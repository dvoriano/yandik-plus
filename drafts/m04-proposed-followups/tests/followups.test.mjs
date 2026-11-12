/**
 * YANDIK+ M04-S9K | 12 SCENARIOS WRITTEN, NOT EXECUTED.
 * Testing is prohibited by CODE_ONLY until explicit owner permission.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {AGENDA_DEMO,CONFIRMATION_VIEW_DEMO} from "../fixtures.mjs";
import {buildProposedFollowups,proposedFollowupsText,NO_AUTHORITY}
  from "../followups.mjs";
const create=()=>buildProposedFollowups(CONFIRMATION_VIEW_DEMO,AGENDA_DEMO);
test("all 18 source items map one-to-one into readonly proposal lanes",()=>{
  const b=create();
  assert.equal(b.rows.length,18);assert.equal(b.functions.length,6);
  assert.equal(new Set(b.rows.map(x=>x.source_id)).size,18);
  assert.equal(new Set(b.rows.map(x=>x.id)).size,18);
});
test("only explicitly entered DEMO suggestion becomes suggested follow-up",()=>{
  const b=create();
  assert.equal(b.totals.proposals_demo,3);
  assert.equal(b.totals.without_proposal_demo,15);
  assert.equal(b.rows.find(x=>x.source_id==="GOV-01").status,"USULAN_CONTOH_PERLU_TELAAH");
  assert.equal(b.rows.find(x=>x.source_id==="GOV-02").status,"BELUM_ADA_USULAN_CONTOH");
});
test("traceability retains source revision, evidence, function, and dependency",()=>{
  const b=create(),src=CONFIRMATION_VIEW_DEMO.groups.find(x=>x.id==="keamanan").items.find(x=>x.item_id==="SEC-01");
  const row=b.rows.find(x=>x.source_id==="SEC-01");
  assert.equal(row.source_revision,src.revision);
  assert.deepEqual(row.source_dependencies,src.dependency_ids);
  assert.equal(row.source_material,src.expected_evidence);
  assert.equal(row.source_function_id,src.function_id);
});
test("all official approvals, decisions, tasks, evidence and test permits stay false",()=>{
  const b=create();
  assert.equal(b.readiness,NO_AUTHORITY);
  assert.equal(b.totals.official_tasks,0);
  assert.ok(b.rows.every(x=>!x.officially_assigned&&!x.official_review&&
    !x.official_decision&&!x.official_evidence_verified&&
    !x.authorization_to_test&&!x.authorization_to_deploy&&
    x.assigned_officer===null&&x.official_deadline===null));
});
test("stale source only flags a warning, not authorization",()=>{
  const v={...CONFIRMATION_VIEW_DEMO,source_stale:true};
  const a={...AGENDA_DEMO,source_stale:true};
  const b=buildProposedFollowups(v,a);
  assert.equal(b.source.source_stale,true);
  assert.equal(b.readiness,NO_AUTHORITY);
});
test("source snapshot mismatch rejects reuse",()=>{
  const v={...CONFIRMATION_VIEW_DEMO,source_snapshot:{
    ...CONFIRMATION_VIEW_DEMO.source_snapshot,visibility:"private"}};
  assert.throws(()=>buildProposedFollowups(v,AGENDA_DEMO));
});
test("private snapshot alone still does not authorize anything",()=>{
  const snapshot={...AGENDA_DEMO.source.repo_snapshot,visibility:"private"};
  const a={...AGENDA_DEMO,source:{...AGENDA_DEMO.source,repo_snapshot:snapshot}};
  const v={...CONFIRMATION_VIEW_DEMO,source_snapshot:snapshot};
  assert.equal(buildProposedFollowups(v,a).readiness,NO_AUTHORITY);
});
test("reject forged official decisions or evidence in source",()=>{
  const view={...CONFIRMATION_VIEW_DEMO,totals:{
    ...CONFIRMATION_VIEW_DEMO.totals,formal_decisions:1}};
  assert.throws(()=>buildProposedFollowups(view,AGENDA_DEMO));
  const agenda={...AGENDA_DEMO,totals:{...AGENDA_DEMO.totals,official_decisions:1}};
  assert.throws(()=>buildProposedFollowups(CONFIRMATION_VIEW_DEMO,agenda));
});
test("reject missing, duplicate, cross-function or altered source rows",()=>{
  const missing={...CONFIRMATION_VIEW_DEMO,groups:CONFIRMATION_VIEW_DEMO.groups.map((g,i)=>
    i?g:{...g,items:g.items.slice(1)})};
  assert.throws(()=>buildProposedFollowups(missing,AGENDA_DEMO));
  const cross={...CONFIRMATION_VIEW_DEMO,groups:CONFIRMATION_VIEW_DEMO.groups.map((g,i)=>
    i?g:{...g,items:g.items.map((x,j)=>j?x:{...x,function_id:"keamanan"})})};
  assert.throws(()=>buildProposedFollowups(cross,AGENDA_DEMO));
});
test("reject tampering with note status or stated source evidence",()=>{
  const forged={...CONFIRMATION_VIEW_DEMO,groups:CONFIRMATION_VIEW_DEMO.groups.map((g,i)=>
    i?g:{...g,items:g.items.map((x,j)=>j?x:{...x,official_confirmation:true})})};
  assert.throws(()=>buildProposedFollowups(forged,AGENDA_DEMO));
  const altered={...CONFIRMATION_VIEW_DEMO,groups:CONFIRMATION_VIEW_DEMO.groups.map((g,i)=>
    i?g:{...g,items:g.items.map((x,j)=>j?x:{...x,expected_evidence:"X"})})};
  assert.throws(()=>buildProposedFollowups(altered,AGENDA_DEMO));
});
test("text export filters statuses and function, includes official disclaimer",()=>{
  const b=create(),t=proposedFollowupsText(b,"keamanan","USULAN_CONTOH_PERLU_TELAAH");
  assert.match(t,/BUKAN PENUGASAN/);
  assert.match(t,/SEC-01/);
  assert.doesNotMatch(t,/GOV-01/);
  assert.throws(()=>proposedFollowupsText(b,"unknown"));
  assert.throws(()=>proposedFollowupsText(b,"all","APPROVED"));
});
test("source object is read, never mutated or persisted by builder",()=>{
  const before=CONFIRMATION_VIEW_DEMO.groups[0].items[0].note.tindak_lanjut_usulan_demo;
  const x=create(),y=create();
  assert.deepEqual(x.rows,y.rows);
  assert.equal(CONFIRMATION_VIEW_DEMO.groups[0].items[0].note.tindak_lanjut_usulan_demo,before);
});
