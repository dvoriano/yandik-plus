/** M00-G5 | QA WRITTEN BUT NOT EXECUTED | CODE_ONLY */
import test from "node:test";
import assert from "node:assert/strict";
import {prepareDemoAuditedReview,readDemoAuditSummary,
 emptyDemoAuditJournal,draftAtomicCommitContract,M00_G5_SCHEMA}
 from "../audit_port.mjs";
import {demoAuditFixture} from "../fixtures.mjs";
const prep=(overrides={})=>
 prepareDemoAuditedReview({...demoAuditFixture(),...overrides});
test("M00-G5 draft schema",()=>
 assert.equal(prep().schema,M00_G5_SCHEMA));
test("M00-G5 audit journal starts empty",()=>
 assert.equal(emptyDemoAuditJournal().events.length,0));
test("M00-G5 does not commit to a database",()=>
 assert.equal(prep().transaction_committed,false));
test("M00-G5 does not claim trusted storage",()=>
 assert.equal(readDemoAuditSummary(demoAuditFixture()).durable_audit_proven,false));
test("M00-G5 pairs review and audit revisions",()=>{
 const x=prep();
 assert.equal(x.nextReviewLog.events.length,1);
 assert.equal(x.nextAuditJournal.events.length,1);
});
test("M00-G5 audit event mirrors review ID and digest",()=>{
 const x=prep(),a=x.nextAuditJournal.events[0],r=x.nextReviewLog.events[0];
 assert.equal(a.review_id,r.review_id);
 assert.equal(a.basis_digest,r.basis_digest);
});
test("M00-G5 original inputs are not mutated",()=>{
 const x=demoAuditFixture();
 prep(x);
 assert.equal(x.reviewLog.events.length,0);
 assert.equal(x.auditJournal.events.length,0);
});
test("M00-G5 recognizes matching synthetic audit chain",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 const s=readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal
 });
 assert.equal(s.recorded_audit_events_demo,1);
});
test("M00-G5 supports a second in-memory review",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 const q=prepareDemoAuditedReview({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal,
  expected_revision:1,expected_audit_revision:1,
  action_code:"POSSIBLY_RELATED_DEMO"
 });
 assert.equal(q.nextAuditJournal.events.length,2);
});
test("M00-G5 denies diverging journal lengths",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 assert.throws(()=>readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:x.auditJournal
 }),/STREAM_MISMATCH/);
});
test("M00-G5 denies stale review revision",()=>
 assert.throws(()=>prep({expected_revision:1}),/REVISION_CONFLICT/));
test("M00-G5 denies stale audit revision",()=>
 assert.throws(()=>prep({expected_audit_revision:1}),/REVISION_CONFLICT/));
test("M00-G5 denies reviewer spoofing",()=>
 assert.throws(()=>prep({resolveReviewerSession:null})));
test("M00-G5 denies fake official approval action",()=>
 assert.throws(()=>prep({action_code:"OFFICIAL_APPROVAL"}),/ACTION_INVALID/));
test("M00-G5 rejects official authorization flag",()=>{
 const x=demoAuditFixture();x.auditJournal.official_authorization=true;
 assert.throws(()=>prepareDemoAuditedReview(x),/STREAM_MISMATCH/);
});
test("M00-G5 detects mutated audit reason",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 p.nextAuditJournal.events[0].reason_code="OTHER";
 assert.throws(()=>readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal
 }),/AUDIT_CHAIN_INVALID/);
});
test("M00-G5 detects tampered previous digest",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 p.nextAuditJournal.events[0].previous_digest="a".repeat(64);
 assert.throws(()=>readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal
 }),/AUDIT_CHAIN_INVALID/);
});
test("M00-G5 detects tampered event digest",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 p.nextAuditJournal.events[0].event_digest="b".repeat(64);
 assert.throws(()=>readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal
 }),/AUDIT_CHAIN_INVALID/);
});
test("M00-G5 detects real source snapshot change",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 x.context.manifest.revision=2;
 assert.throws(()=>readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal
 }));
});
test("M00-G5 refuses extra private event fields",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 p.nextAuditJournal.events[0].free_text="private notes";
 assert.throws(()=>readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal
 }),/AUDIT_CHAIN_INVALID/);
});
test("M00-G5 no actor name in projected summary",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 const s=readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal
 });
 assert.equal(JSON.stringify(s).includes("DEMO-USER"),false);
});
test("M00-G5 labels SQL as not executed",()=>{
 const s=draftAtomicCommitContract();
 assert.equal(s.sql_executed,false);
 assert.equal(s.atomicity_proven,false);
});
test("M00-G5 no write/publish/deploy on preview",()=>{
 const p=prep();
 for(const k of ["may_write_database","may_publish","may_approve","may_deploy"])
  assert.equal(p[k],false);
});
test("M00-G5 audit never implies official decision",()=>{
 const x=demoAuditFixture(),p=prepareDemoAuditedReview(x);
 assert.equal(readDemoAuditSummary({
  ...x,reviewLog:p.nextReviewLog,auditJournal:p.nextAuditJournal
 }).official_decision_count,null);
});
