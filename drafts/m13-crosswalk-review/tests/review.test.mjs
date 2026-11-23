/** M13-S3 | QA written, NOT run. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoHumanReviewBoard,appendDemoHumanReviewNote,
 emptyDemoReviewLog,M13_S3_SCHEMA}
 from "../review.mjs";
import {demoHumanReviewFixture,demoReviewerSession}
 from "../fixtures.mjs";
const make=()=>demoHumanReviewFixture();
const note=(f,more={})=>appendDemoHumanReviewNote({
 ...f,...demoReviewerSession(),
 link_id:"DEMO-CROSSWALK-ONE",action_code:"REQUEST_EVIDENCE_DEMO",
 reason_code:"SOURCE_COMPARISON_DEMO",
 expected_revision:f.reviewLog.events.length,...more
});
test("M13-S3 separate draft schema",()=>
 assert.equal(buildDemoHumanReviewBoard(make()).schema,M13_S3_SCHEMA));
test("M13-S3 initial queue is pending",()=>
 assert.equal(buildDemoHumanReviewBoard(make()).pending_notes_demo,1));
test("M13-S3 initial log is empty in memory",()=>
 assert.equal(emptyDemoReviewLog().events.length,0));
test("M13-S3 appending a note returns a new log",()=>{
 const f=make();const next=note(f);
 assert.equal(next.events.length,1);
 assert.equal(f.reviewLog.events.length,0);
});
test("M13-S3 note status is not official verification",()=>{
 const f=make();f.reviewLog=note(f);
 const b=buildDemoHumanReviewBoard(f);
 assert.equal(b.rows[0].review_state,"EVIDENCE_NEEDED_DEMO");
 assert.equal(b.official_review_completed,false);
});
test("M13-S3 note never proves same real occurrence",()=>{
 const f=make();f.reviewLog=note(f,{action_code:"POSSIBLY_RELATED_DEMO"});
 assert.equal(buildDemoHumanReviewBoard(f).rows[0].proof_of_same_real_event,false);
});
test("M13-S3 different-record note also remains unverified",()=>{
 const f=make();f.reviewLog=note(f,{action_code:"DISTINCT_RECORDS_DEMO"});
 assert.equal(buildDemoHumanReviewBoard(f).rows[0].equivalence_approved,false);
});
test("M13-S3 reopen possible only after prior note",()=>{
 const f=make();
 assert.throws(()=>note(f,{action_code:"REOPEN_DEMO"}),/REOPEN_INVALID/);
 f.reviewLog=note(f);
 f.reviewLog=note(f,{action_code:"REOPEN_DEMO"});
 assert.equal(buildDemoHumanReviewBoard(f).rows[0].review_state,"OPEN_FOR_REVIEW_DEMO");
});
test("M13-S3 rejects any write claim on read board",()=>{
 const b=buildDemoHumanReviewBoard(make());
 for(const k of ["may_sync","may_write_database","may_approve",
  "may_notify","may_confirm_disease","may_publish","may_deploy"])
  assert.equal(b[k],false);
});
test("M13-S3 reviewer cannot be normal kab-kota role",()=>{
 const f=make();
 assert.throws(()=>note(f,demoReviewerSession("kab_kota")),/ACCESS_DENIED/);
});
test("M13-S3 admin cannot review this demo action",()=>{
 const f=make();
 assert.throws(()=>note(f,demoReviewerSession("provinsi_admin")),/ACCESS_DENIED/);
});
test("M13-S3 proposer and reviewer cannot be same",()=>{
 const f=make();
 f.proposals[0].proposer_id="DEMO-USER-PROVINSI_VERIFIKATOR";
 assert.throws(()=>note(f),/ACCESS_DENIED/);
});
test("M13-S3 no resolver denied",()=>{
 const f=make();
 assert.throws(()=>note(f,{resolveReviewerSession:undefined}));
});
test("M13-S3 unknown candidate denied",()=>{
 const f=make();
 assert.throws(()=>note(f,{link_id:"DEMO-CROSSWALK-OTHER"}),/ACTION_INVALID/);
});
test("M13-S3 rejects unstructured notes",()=>{
 const f=make();
 assert.throws(()=>note(f,{reason_code:"REAL_FARM_TEXT"}),/ACTION_INVALID/);
});
test("M13-S3 rejects unsupported action",()=>{
 const f=make();
 assert.throws(()=>note(f,{action_code:"OFFICIAL_APPROVAL"}),/ACTION_INVALID/);
});
test("M13-S3 revision conflict fails closed",()=>{
 const f=make();
 assert.throws(()=>note(f,{expected_revision:2}),/REVISION_CONFLICT/);
});
test("M13-S3 stored reviewer role tampering rejected",()=>{
 const f=make();f.reviewLog=note(f);
 f.reviewLog.events[0].reviewer_role="provinsi_admin";
 assert.throws(()=>buildDemoHumanReviewBoard(f),/LOG_EVENT_INVALID/);
});
test("M13-S3 stored official status tampering rejected",()=>{
 const f=make();f.reviewLog=note(f);
 f.reviewLog.events[0].officially_verified=true;
 assert.throws(()=>buildDemoHumanReviewBoard(f),/LOG_EVENT_INVALID/);
});
test("M13-S3 stored basis digest tampering rejected",()=>{
 const f=make();f.reviewLog=note(f);
 f.reviewLog.events[0].basis_digest="0".repeat(64);
 assert.throws(()=>buildDemoHumanReviewBoard(f),/LOG_EVENT_INVALID/);
});
test("M13-S3 source revision change invalidates old review",()=>{
 const f=make();f.reviewLog=note(f);
 f.context.manifest.revision=2;
 assert.throws(()=>buildDemoHumanReviewBoard(f),/LOG_EVENT_INVALID/);
});
test("M13-S3 surveillance source content change invalidates prior note",()=>{
 const f=make();f.reviewLog=note(f);
 const e=f.context.events.find(x=>x.event_id==="DEMO-EVENT-ONE");
 e.investigation_state="NOT_STARTED_DEMO";
 assert.throws(()=>buildDemoHumanReviewBoard(f),/LOG_EVENT_INVALID/);
});
test("M13-S3 APEL report count change invalidates prior note",()=>{
 const f=make();f.reviewLog=note(f);
 const r=f.context.dashboardFixture.ledger.records.find(x=>
  x.facility_id==="DEMO-PSW-ALPHA"&&x.period==="2026-06");
 r.counts.pengobatan=30;
 assert.throws(()=>buildDemoHumanReviewBoard(f));
});
test("M13-S3 duplicate proposal rejected",()=>{
 const f=make();f.proposals.push({...f.proposals[0]});
 assert.throws(()=>buildDemoHumanReviewBoard(f),/PROPOSALS_INVALID/);
});
test("M13-S3 rejected foreign proposal ID",()=>{
 const f=make();f.proposals[0].link_id="DEMO-CROSSWALK-UNKNOWN";
 assert.throws(()=>buildDemoHumanReviewBoard(f),/PROPOSAL_INVALID/);
});
test("M13-S3 review log will not accept free-text fields",()=>{
 const f=make();f.reviewLog=note(f);
 f.reviewLog.events[0].free_text="sensitive notes";
 assert.throws(()=>buildDemoHumanReviewBoard(f),/LOG_EVENT_INVALID/);
});
test("M13-S3 requires valid global review sequence",()=>{
 const f=make();f.reviewLog=note(f);
 f.reviewLog.events[0].review_id="DEMO-REVIEW-999";
 assert.throws(()=>buildDemoHumanReviewBoard(f),/LOG_EVENT_INVALID/);
});
test("M13-S3 no official cases implied from reviewed candidates",()=>{
 const f=make();f.reviewLog=note(f);
 assert.equal(buildDemoHumanReviewBoard(f).official_case_count,null);
});
