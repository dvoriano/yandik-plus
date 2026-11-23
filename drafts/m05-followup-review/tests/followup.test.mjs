/** M05-17 | QA TERTULIS, 0 DIJALANKAN. */
import test from "node:test";
import assert from "node:assert/strict";
import {M05_17_SCHEMA,buildDemoFollowupView,buildDemoFollowupBoard}
 from "../followup.mjs";
import {buildDemoFollowupContexts} from "../fixtures.mjs";
const sample=(i=0)=>buildDemoFollowupContexts()[i];
test("M05-17 keeps its own schema",()=>assert.equal(buildDemoFollowupView(sample()).schema,M05_17_SCHEMA));
test("M05-17 output is synthetic",()=>assert.equal(buildDemoFollowupView(sample()).synthetic,true));
test("M05-17 pending report receives review suggestion",()=>
 assert.ok(buildDemoFollowupView(sample()).advisory_proposals.some(x=>
  x.review_reason_code==="TELAAH_SUBMIT_DEMO")));
test("M05-17 draft receives counseling suggestion",()=>
 assert.ok(buildDemoFollowupView(sample(1)).advisory_proposals.some(x=>
  x.review_reason_code==="PENDAMPINGAN_DRAF_DEMO")));
test("M05-17 returned report receives clarification suggestion",()=>
 assert.ok(buildDemoFollowupView(sample(2)).advisory_proposals.some(x=>
  x.review_reason_code==="KLARIFIKASI_KOREKSI_DEMO")));
test("M05-17 incomplete profile creates review candidate",()=>
 assert.ok(buildDemoFollowupView(sample(2)).advisory_proposals.some(x=>
  x.review_reason_code==="TELAAH_PROFIL_DEMO")));
test("M05-17 partial SDM is context not staffing judgement",()=>{
 const v=buildDemoFollowupView(sample(2));
 assert.ok(v.advisory_proposals.some(x=>x.review_reason_code==="TELAAH_SDM_DEMO"));
 assert.equal(v.staffing_adequacy_judged,false);
});
test("M05-17 complete SDM does not imply deficiency",()=>
 assert.equal(buildDemoFollowupView(sample()).advisory_proposals.some(x=>
  x.review_reason_code==="TELAAH_SDM_DEMO"),false));
test("M05-17 absent 2029 records do not become official noncompliance",()=>{
 const v=buildDemoFollowupView(sample(3));
 assert.equal(v.report_state_demo,"NOT_STARTED_DEMO");
 assert.equal(v.public_service_performance_judged,false);
});
test("M05-17 output contains no raw correction reason",()=>{
 assert.equal(JSON.stringify(buildDemoFollowupView(sample(2)))
  .includes("Mohon periksa data DEMO"),false);
});
test("M05-17 review candidates have no due date",()=>{
 assert.ok(buildDemoFollowupView(sample(2)).advisory_proposals
  .every(x=>x.due_date===null));
});
test("M05-17 no case is formally assigned",()=>{
 assert.ok(buildDemoFollowupView(sample(2)).advisory_proposals
  .every(x=>x.assigned_to===null&&x.may_dispatch===false));
});
test("M05-17 no official document reference assigned",()=>{
 assert.ok(buildDemoFollowupView(sample(2)).advisory_proposals
  .every(x=>x.official_document_ref===null));
});
test("M05-17 no candidate can close itself",()=>{
 assert.ok(buildDemoFollowupView(sample()).advisory_proposals
  .every(x=>x.may_close_case===false));
});
test("M05-17 empty board is not official case count zero",()=>{
 const b=buildDemoFollowupBoard([]);
 assert.equal(b.context_count,0);
 assert.equal(b.official_followup_cases,null);
});
test("M05-17 board contains four DEMO contexts",()=>
 assert.equal(buildDemoFollowupBoard(buildDemoFollowupContexts()).context_count,4));
test("M05-17 board counts suggestions only",()=>{
 const b=buildDemoFollowupBoard(buildDemoFollowupContexts());
 assert.ok(b.proposed_review_items>=b.context_count);
 assert.equal(b.has_official_case_registry,false);
});
test("M05-17 rejects duplicate facility-period",()=>{
 const x=sample();
 assert.throws(()=>buildDemoFollowupBoard([x,x]),/DUPLICATE_FACILITY_MONTH/);
});
test("M05-17 rejects unsourced fake object",()=>
 assert.throws(()=>buildDemoFollowupView({synthetic:true}),/CONTEXT_UNTRUSTED/));
test("M05-17 rejects context marked official",()=>{
 const x=sample();x.official_authorization=true;
 assert.throws(()=>buildDemoFollowupView(x),/CONTEXT_UNTRUSTED/);
});
test("M05-17 rejects fabricated 2032 periods",()=>{
 const x=sample();x.period="2032-01";
 assert.throws(()=>buildDemoFollowupView(x),/CONTEXT_UNTRUSTED/);
});
test("M05-17 rejects source claimed as reconciled",()=>{
 const x=sample();x.cross_source_reconciled=true;
 assert.throws(()=>buildDemoFollowupView(x),/CONTEXT_UNTRUSTED/);
});
test("M05-17 denies decisions, notifications and deployment",()=>{
 const v=buildDemoFollowupView(sample());
 for(const key of ["may_assign","may_notify","may_write","may_score",
  "may_rank","may_publish","may_allocate","may_approve","may_deploy"])
  assert.equal(v[key],false);
});
test("M05-17 board denies actions as well",()=>{
 const v=buildDemoFollowupBoard(buildDemoFollowupContexts());
 for(const key of ["may_assign","may_notify","may_write","may_approve",
  "may_allocate","may_publish","may_deploy"])
  assert.equal(v[key],false);
});
