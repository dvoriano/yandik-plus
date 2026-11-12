/**
 * YANDIK+ M04-S9I | 11 TEST SCENARIOS WRITTEN, NOT EXECUTED.
 * CODE_ONLY forbids any Node/CI/browser tests until explicit owner permission.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {TRIAGE_DEMO} from "../fixtures.mjs";
import {buildFunctionAgendas,functionAgendaText,NO_APPROVAL,FUNCTIONS}
  from "../agendas.mjs";
const build=()=>buildFunctionAgendas(TRIAGE_DEMO);
test("six suggested functions retain all 18 IDs without duplicates",()=>{
  const a=build(),ids=a.groups.flatMap(g=>g.source_ids);
  assert.equal(a.totals.functions,6);assert.equal(ids.length,18);
  assert.equal(new Set(ids).size,18);
  assert.deepEqual(new Set(ids),new Set(TRIAGE_DEMO.rows.map(x=>x.id)));
});
test("agenda questions and evidence are tied to their exact source item",()=>{
  const a=build();
  for(const g of a.groups)for(const item of g.items){
    const src=TRIAGE_DEMO.rows.find(x=>x.id===item.id);
    assert.equal(item.evidence_needed,src.evidence_request);
    assert.deepEqual(item.dependency_ids,src.dependency_ids);
    assert.ok(item.proposed_questions.length>=3);
  }
});
test("six categories include distinct reviewer suggestions but no confirmation",()=>{
  const a=build();assert.deepEqual(a.groups.map(x=>x.id),FUNCTIONS.map(x=>x.id));
  assert.ok(a.groups.every(g=>g.suggested_reviewer_role&&!g.owner_assigned));
  assert.equal(a.totals.confirmed_reviewers,0);
});
test("no invitations, minutes or decisions may be represented as executed",()=>{
  const a=build();
  assert.equal(a.totals.meetings_held,0);
  assert.ok(a.groups.every(g=>!g.invitation_sent&&!g.meeting_held&&!g.minutes_official));
  assert.ok(a.groups.flatMap(g=>g.items).every(x=>!x.meeting_held&&!x.decision_made));
});
test("public snapshot gives data confidentiality caution, not upload",()=>{
  const a=build();assert.ok(a.warnings.some(x=>x.includes("PUBLIC")));
});
test("private snapshot does not make packet approved",()=>{
  const t={...TRIAGE_DEMO,source:{...TRIAGE_DEMO.source,
    repo_snapshot:{...TRIAGE_DEMO.source.repo_snapshot,visibility:"private"}}};
  assert.equal(buildFunctionAgendas(t).readiness,NO_APPROVAL);
});
test("source changed preserves all 18 agenda lines but warns",()=>{
  const t={...TRIAGE_DEMO,source:{...TRIAGE_DEMO.source,snapshot_changed:true}};
  const a=buildFunctionAgendas(t);
  assert.equal(a.source_stale,true);assert.equal(a.totals.agenda_items,18);
  assert.ok(a.warnings.some(x=>x.startsWith("Sumber berubah")));
});
test("reject forged decisions, evidence verification and missing item",()=>{
  const t={...TRIAGE_DEMO,rows:TRIAGE_DEMO.rows.map((x,i)=>i?x:{...x,decision_recorded:true})};
  assert.throws(()=>buildFunctionAgendas(t));
  const u={...TRIAGE_DEMO,rows:TRIAGE_DEMO.rows.map((x,i)=>i?x:{...x,official_evidence_verified:true})};
  assert.throws(()=>buildFunctionAgendas(u));
  assert.throws(()=>buildFunctionAgendas({...TRIAGE_DEMO,rows:TRIAGE_DEMO.rows.slice(1)}));
});
test("reject unknown group, duplicate and inconsistent dependency",()=>{
  const badGroup={...TRIAGE_DEMO,rows:TRIAGE_DEMO.rows.map((x,i)=>i?x:{...x,group:"other"})};
  assert.throws(()=>buildFunctionAgendas(badGroup));
  const dup={...TRIAGE_DEMO,rows:TRIAGE_DEMO.rows.map((x,i)=>i?x:{...x,id:TRIAGE_DEMO.rows[1].id})};
  assert.throws(()=>buildFunctionAgendas(dup));
  const dep={...TRIAGE_DEMO,rows:TRIAGE_DEMO.rows.map((x,i)=>i?x:{...x,dependency_ids:["UNKNOWN"]})};
  assert.throws(()=>buildFunctionAgendas(dep));
});
test("reject QA wave or wrong synthetic mode",()=>{
  assert.throws(()=>buildFunctionAgendas({...TRIAGE_DEMO,synthetic:false}));
  assert.throws(()=>buildFunctionAgendas({...TRIAGE_DEMO,mode:"LIVE"}));
  assert.throws(()=>buildFunctionAgendas({...TRIAGE_DEMO,phases:TRIAGE_DEMO.phases.map((x,i)=>i?x:{...x,state:"SELESAI"})}));
});
test("text export filters by function and rejects invalid function",()=>{
  const a=build();
  const out=functionAgendaText(a,"keamanan");
  assert.match(out,/BUKAN UNDANGAN RESMI/);
  assert.match(out,/SEC-01/);
  assert.ok(!out.includes("GOV-01:"));
  assert.throws(()=>functionAgendaText(a,"anonymous"));
  assert.equal(a.readiness,NO_APPROVAL);
});
