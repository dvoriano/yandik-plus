/**
 * YANDIK+ M04-S9M | 12 SCENARIOS WRITTEN, NOT EXECUTED.
 * CODE_ONLY: testing awaits explicit owner permission.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {RECAP_DEMO,AGENDA_DEMO} from "../fixtures.mjs";
import {buildHumanReviewHandoff,humanReviewHandoffText,NO_AUTHORITY}
  from "../handoff.mjs";
const build=()=>buildHumanReviewHandoff(RECAP_DEMO,AGENDA_DEMO);
test("six function packets preserve 18 agenda references",()=>{
  const p=build(),rows=p.groups.flatMap(x=>x.entries);
  assert.equal(p.groups.length,6);assert.equal(rows.length,18);
  assert.equal(new Set(rows.map(x=>x.id)).size,18);
  assert.equal(p.totals.evidence_requests,18);
});
test("all questions are carried through with no official responses",()=>{
  const p=build();
  for(const group of p.groups)for(const entry of group.entries){
    const original=AGENDA_DEMO.groups.find(x=>x.id===group.id)
      .items.find(x=>x.id===entry.id);
    assert.deepEqual(entry.open_questions,original.proposed_questions);
    assert.equal(entry.question_responses_recorded,0);
  }
  assert.ok(p.totals.open_question_prompts>=54);
});
test("synthetic proposal and gap counts are preserved",()=>{
  const p=build();
  assert.equal(p.totals.proposal_notes_demo,3);
  assert.equal(p.totals.gap_notes_demo,3);
  assert.equal(p.totals.missing_gap_text_demo,15);
});
test("each source evidence request and lineage is preserved",()=>{
  const p=build();
  for(const group of p.groups)for(const item of group.entries){
    const original=RECAP_DEMO.rows.find(x=>x.source_id===item.id);
    assert.equal(item.evidence_requested,original.source_material);
    assert.equal(item.source_followup_id,original.id);
    assert.equal(item.source_revision,original.source_revision);
    assert.deepEqual(item.dependency_ids,original.source_dependencies);
  }
});
test("no official handoff, meeting, signature or permission in packet",()=>{
  const p=build();assert.equal(p.readiness,NO_AUTHORITY);
  assert.equal(p.totals.handoffs_sent,0);
  assert.equal(p.totals.official_decisions,0);
  assert.ok(p.groups.every(x=>!x.handoff_sent&&!x.meeting_held&&!x.decision_recorded));
  assert.ok(p.groups.flatMap(x=>x.entries).every(x=>
    !x.officially_reviewed&&!x.officially_assigned&&
    !x.official_decision&&!x.authorized_to_test&&!x.authorized_to_deploy));
});
test("source stale adds caution without clearing anything",()=>{
  const r={...RECAP_DEMO,source:{...RECAP_DEMO.source,source_stale:true}};
  const a={...AGENDA_DEMO,source_stale:true};
  const p=buildHumanReviewHandoff(r,a);
  assert.ok(p.warnings.some(x=>x.includes("ditandai berubah")));
  assert.equal(p.totals.official_reviews,0);
});
test("private repository snapshot is never interpreted as approved",()=>{
  const s={...RECAP_DEMO.source.repo_snapshot,visibility:"private"};
  const r={...RECAP_DEMO,source:{...RECAP_DEMO.source,repo_snapshot:s}};
  const a={...AGENDA_DEMO,source:{...AGENDA_DEMO.source,repo_snapshot:s}};
  assert.equal(buildHumanReviewHandoff(r,a).readiness,NO_AUTHORITY);
});
test("mismatched agenda/review snapshot rejects handoff",()=>{
  const a={...AGENDA_DEMO,source:{...AGENDA_DEMO.source,
    repo_snapshot:{...AGENDA_DEMO.source.repo_snapshot,visibility:"private"}}};
  assert.throws(()=>buildHumanReviewHandoff(RECAP_DEMO,a));
});
test("reject forged decisions in recap and agenda",()=>{
  const r={...RECAP_DEMO,totals:{...RECAP_DEMO.totals,official_decisions:1}};
  assert.throws(()=>buildHumanReviewHandoff(r,AGENDA_DEMO));
  const a={...AGENDA_DEMO,groups:AGENDA_DEMO.groups.map((x,i)=>
    i?x:{...x,meeting_held:true})};
  assert.throws(()=>buildHumanReviewHandoff(RECAP_DEMO,a));
});
test("reject swapped item evidence, missing question and unknown dependency",()=>{
  const row={...RECAP_DEMO.rows[0],source_material:"bukti palsu"};
  const r={...RECAP_DEMO,rows:[row,...RECAP_DEMO.rows.slice(1)]};
  assert.throws(()=>buildHumanReviewHandoff(r,AGENDA_DEMO));
  const a={...AGENDA_DEMO,groups:AGENDA_DEMO.groups.map((g,i)=>i?g:{
    ...g,items:g.items.map((x,j)=>j?x:{...x,proposed_questions:[]})})};
  assert.throws(()=>buildHumanReviewHandoff(RECAP_DEMO,a));
  const e={...RECAP_DEMO.rows[0],source_dependencies:["UNKNOWN"]};
  assert.throws(()=>buildHumanReviewHandoff({...RECAP_DEMO,
    rows:[e,...RECAP_DEMO.rows.slice(1)]},AGENDA_DEMO));
});
test("export filters by function, contains nonofficial disclaimer",()=>{
  const p=build(),text=humanReviewHandoffText(p,"keamanan");
  assert.match(text,/BELUM DIKIRIM/);assert.match(text,/SEC-01/);
  assert.doesNotMatch(text,/GOV-01 \|/);
  assert.throws(()=>humanReviewHandoffText(p,"wrong"));
});
test("pure builder does not change source",()=>{
  const before=AGENDA_DEMO.groups[0].items[0].evidence_needed;
  const one=build(),two=build();
  assert.deepEqual(one.groups,two.groups);
  assert.equal(AGENDA_DEMO.groups[0].items[0].evidence_needed,before);
});
