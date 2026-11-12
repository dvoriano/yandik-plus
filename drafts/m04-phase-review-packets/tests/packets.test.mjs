/**
 * YANDIK+ M04-S9Q | 12 SCENARIOS WRITTEN, NOT EXECUTED.
 * CODE_ONLY: explicit owner permission required before any test is run.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {SEQUENCE_DEMO,HANDOFF_DEMO} from "../fixtures.mjs";
import {buildPhaseReviewPackets,phaseReviewPacketsText,NO_AUTHORITY}
  from "../packets.mjs";
const create=()=>buildPhaseReviewPackets(SEQUENCE_DEMO,HANDOFF_DEMO);
const alterFirst=change=>({...SEQUENCE_DEMO,
  rows:SEQUENCE_DEMO.rows.map((x,i)=>i?x:{...x,...change})});
const alterFirstEntry=change=>({...HANDOFF_DEMO,
  groups:HANDOFF_DEMO.groups.map((g,i)=>i?g:{
    ...g,entries:g.entries.map((x,j)=>j?x:{...x,...change})})});
test("four P0-P3 packets cover 18 unique source items",()=>{
  const p=create(),entries=p.packets.flatMap(x=>x.entries);
  assert.deepEqual(p.packets.map(x=>x.phase),["P0","P1","P2","P3"]);
  assert.equal(entries.length,18);
  assert.equal(new Set(entries.map(x=>x.source_id)).size,18);
});
test("phase order preserves global source discussion sequence",()=>{
  const p=create(),entries=p.packets.flatMap(x=>x.entries);
  for(let i=1;i<entries.length;i++)
    assert.ok(entries[i-1].discussion_sequence<entries[i].discussion_sequence);
});
test("questions are preserved verbatim, without answers",()=>{
  const p=create();
  for(const item of p.packets.flatMap(x=>x.entries)){
    const source=HANDOFF_DEMO.groups.flatMap(x=>x.entries)
      .find(x=>x.id===item.source_id);
    assert.deepEqual(item.open_questions.map(x=>x.text),source.open_questions);
    assert.ok(item.open_questions.every(x=>
      x.answer_recorded===false&&x.official_answer===null));
  }
  assert.equal(p.totals.open_questions,HANDOFF_DEMO.totals.open_question_prompts);
});
test("material proof not verified and example gaps remain examples",()=>{
  const p=create();
  assert.equal(p.totals.materials_requested,18);
  assert.equal(p.totals.example_gap_notes,3);
  assert.equal(p.totals.official_evidence_verified,0);
  assert.ok(p.packets.flatMap(x=>x.entries).every(x=>
    !x.material_received_demo&&!x.evidence_officially_verified));
});
test("all packets unsent with no meetings, approval or permission",()=>{
  const p=create();
  assert.equal(p.readiness,NO_AUTHORITY);
  assert.ok(p.packets.every(x=>x.unsent&&!x.formal_meeting&&
    !x.official_approval&&!x.permission_to_test&&!x.permission_to_deploy));
  assert.equal(p.totals.packages_sent,0);
});
test("prerequisite is shown as a reference, never as completed work",()=>{
  const p=create(),ids=new Map(p.packets.flatMap(x=>x.entries)
    .map(x=>[x.source_id,x]));
  for(const e of ids.values())for(const dep of e.prerequisite_ids)
    assert.ok(ids.get(dep).discussion_sequence<e.discussion_sequence);
  assert.ok(p.warnings.some(x=>x.includes("BUKAN berarti prasyarat sudah dipenuhi")));
});
test("stale source warns but cannot authorize QA",()=>{
  const s={...SEQUENCE_DEMO,source:{...SEQUENCE_DEMO.source,source_stale:true}};
  const h={...HANDOFF_DEMO,source:{...HANDOFF_DEMO.source,source_stale:true}};
  const p=buildPhaseReviewPackets(s,h);
  assert.ok(p.warnings.some(x=>x.includes("ditandai berubah")));
  assert.equal(p.totals.authorized_tests,0);
});
test("private snapshot does not imply official review",()=>{
  const snapshot={...SEQUENCE_DEMO.source.repo_snapshot,visibility:"private"};
  const s={...SEQUENCE_DEMO,source:{...SEQUENCE_DEMO.source,repo_snapshot:snapshot}};
  const h={...HANDOFF_DEMO,source:{...HANDOFF_DEMO.source,repo_snapshot:snapshot}};
  assert.equal(buildPhaseReviewPackets(s,h).totals.official_evidence_verified,0);
});
test("reject mismatched revision, snapshot or missing row",()=>{
  const s={...SEQUENCE_DEMO,source:{...SEQUENCE_DEMO.source,revision:999}};
  assert.throws(()=>buildPhaseReviewPackets(s,HANDOFF_DEMO));
  assert.throws(()=>buildPhaseReviewPackets({...SEQUENCE_DEMO,
    rows:SEQUENCE_DEMO.rows.slice(1)},HANDOFF_DEMO));
});
test("reject forged approval, fake source evidence and fake reply",()=>{
  assert.throws(()=>buildPhaseReviewPackets(
    alterFirst({officially_cleared:true}),HANDOFF_DEMO));
  assert.throws(()=>buildPhaseReviewPackets(SEQUENCE_DEMO,
    alterFirstEntry({evidence_verified:true})));
  assert.throws(()=>buildPhaseReviewPackets(SEQUENCE_DEMO,
    alterFirstEntry({question_responses_recorded:1})));
});
test("reject duplicate order, unknown dependency or tampered question IDs",()=>{
  assert.throws(()=>buildPhaseReviewPackets(
    alterFirst({discussion_sequence:2}),HANDOFF_DEMO));
  assert.throws(()=>buildPhaseReviewPackets(
    alterFirst({prerequisite_ids:["UNKNOWN"]}),HANDOFF_DEMO));
  assert.throws(()=>buildPhaseReviewPackets(
    alterFirst({question_ids:["DEMO-Q-BAD-01"]}),HANDOFF_DEMO));
});
test("filtered export and builder stay synthetic and pure",()=>{
  const p=create(),txt=phaseReviewPacketsText(p,"P0","keamanan");
  assert.match(txt,/BELUM DIKIRIM/);
  assert.match(txt,/SEC-01/);
  assert.doesNotMatch(txt,/INT-02/);
  assert.throws(()=>phaseReviewPacketsText(p,"P7"));
  assert.throws(()=>phaseReviewPacketsText(p,"all","invalid"));
  assert.deepEqual(create().packets,p.packets);
});
