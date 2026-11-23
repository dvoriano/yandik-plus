/** M05-11 | QA WRITTEN, ZERO EXECUTED | CODE_ONLY | DEMO ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoStagingProtocol,M05_11_CONTROL_SPEC,
 M05_11_NON_EXECUTION_FLAGS,noExecutionAuthority}
 from "../protocol.mjs";
import {buildDemoProtocolReview,M05_11_NOTE_KINDS,M05_11_NOTE_REASONS}
 from "../review.mjs";
import {buildDemoStagingEvidencePacket,M05_11_EVIDENCE_ARTIFACTS}
 from "../packet.mjs";
import {annualPolicy,SUPPORTED_YEARS}
 from "../../m05-apel-multiyear/policy.mjs";

const snap="DEMO-SNAP-STAGING-1";
const proto=(year=2026,snapshot_id=snap)=>
 buildDemoStagingProtocol({year,snapshot_id});
const notes=()=>({
 note_id:"DEMO-NOTE-1",snapshot_id:snap,
 control_id:"PROJECT_TEST_PERMISSION",reviewer_id:"DEMO-REVIEWER-1",
 note_kind:"REQUEST_EVIDENCE",reason_code:"DEMO_NO_TEST_PERMISSION"
});
const review=(p=proto(),ns=[])=>buildDemoProtocolReview({protocol:p,notes:ns});
const packet=(p=proto(),rv=review(p))=>
 buildDemoStagingEvidencePacket({protocol:p,review:rv});

test("M05-11 has fourteen unique staging controls",()=>{
 assert.equal(M05_11_CONTROL_SPEC.length,14);
 assert.equal(new Set(M05_11_CONTROL_SPEC.map(x=>x.control_id)).size,14);
});
test("M05-11 distinguishes project test permission from system access",()=>{
 const ids=M05_11_CONTROL_SPEC.map(x=>x.control_id);
 assert.ok(ids.includes("PROJECT_TEST_PERMISSION"));
 assert.ok(ids.includes("SYSTEM_ACCESS_PERMISSION"));
});
test("M05-11 includes isolated staging and synthetic data boundaries",()=>{
 const ids=M05_11_CONTROL_SPEC.map(x=>x.control_id);
 assert.ok(ids.includes("ISOLATED_STAGING"));
 assert.ok(ids.includes("SYNTHETIC_DATA_BOUNDARY"));
});
test("M05-11 documents secrets and RBAC without storing credentials",()=>{
 assert.ok(M05_11_CONTROL_SPEC.some(x=>x.control_id==="SECRETS_AND_RBAC"));
});
test("M05-11 requires backup, incident stop and rollback controls",()=>{
 const ids=M05_11_CONTROL_SPEC.map(x=>x.control_id);
 assert.ok(ids.includes("BACKUP_AND_RECOVERY"));
 assert.ok(ids.includes("FAILURE_AND_ROLLBACK"));
});
test("M05-11 requires source mapping and 2026 Juknis baseline",()=>{
 const ids=M05_11_CONTROL_SPEC.map(x=>x.control_id);
 assert.ok(ids.includes("SOURCE_SCHEMA_CONTRACT"));
 assert.ok(ids.includes("BASELINE_AND_JUKNIS"));
});
test("M05-11 retains independent publication permission",()=>{
 assert.ok(M05_11_CONTROL_SPEC.some(x=>x.control_id==="PUBLICATION_SEPARATION"));
});
test("M05-11 all controls start blocked",()=>{
 assert.ok(proto().controls.every(x=>x.status==="BLOCKED_NO_REAL_EVIDENCE"));
});
test("M05-11 all controls have null official evidence references",()=>{
 assert.ok(proto().controls.every(x=>
  x.official_evidence_ref===null&&x.official_signoff_ref===null));
});
test("M05-11 2026 protocol retains 22 unexecuted parity cases",()=>{
 const p=proto();
 assert.equal(p.counts.parity_cases,22);
 assert.ok(p.parity_cases.every(x=>x.executed===false));
});
test("M05-11 2027 protocol retains 20 unexecuted parity cases",()=>{
 assert.equal(proto(2027).counts.parity_cases,20);
});
test("M05-11 2030 protocol keeps its own policy",()=>{
 const p=proto(2030);
 assert.equal(p.policy_draft_version,annualPolicy(2030).draft_rule_version);
});
test("M05-11 plans cover all five configured years",()=>{
 assert.deepEqual(SUPPORTED_YEARS,[2026,2027,2028,2029,2030]);
 assert.ok(SUPPORTED_YEARS.every(y=>proto(y).year===y));
});
test("M05-11 rejects out-of-range year instead of inheriting policy",()=>{
 assert.throws(()=>proto(2031),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-11 rejects text year instead of parsing it",()=>{
 assert.throws(()=>proto("2027"),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-11 rejects absent snapshot",()=>{
 assert.throws(()=>buildDemoStagingProtocol({year:2026}),
  /M05_11_SNAPSHOT_INVALID/);
});
test("M05-11 rejects non-DEMO snapshot",()=>{
 assert.throws(()=>proto(2026,"LIVE-SNAPSHOT"),
  /M05_11_SNAPSHOT_INVALID/);
});
test("M05-11 rejects generic DEMO ID without snapshot namespace",()=>{
 assert.throws(()=>proto(2026,"DEMO-SOMETHING"),
  /M05_11_SNAPSHOT_INVALID/);
});
test("M05-11 project test permission remains unverified",()=>{
 const p=proto();
 assert.equal(p.project_test_permission_verified,false);
 assert.equal(p.code_only_active,true);
});
test("M05-11 separate system access permission remains unverified",()=>{
 const p=proto();
 assert.equal(p.system_access_permission_verified,false);
 assert.equal(p.source_owner_verified,false);
});
test("M05-11 no staging environment is provisioned",()=>{
 const p=proto();
 assert.equal(p.source_environment,"NONE_CONNECTED");
 assert.equal(p.proposed_execution_environment,"UNDECIDED_NOT_PROVISIONED");
});
test("M05-11 protocol never yields an execution authorization",()=>{
 assert.equal(noExecutionAuthority(proto()),true);
});
test("M05-11 protocol cannot score, rank, award, publish or merge",()=>{
 const p=proto();
 for(const k of ["may_score","may_rank","may_award","may_publish",
  "may_merge","may_deploy"])assert.equal(p[k],false);
});
test("M05-11 note kinds cannot grant authority",()=>{
 assert.equal(M05_11_NOTE_KINDS.includes("APPROVE_TESTS"),false);
 assert.equal(M05_11_NOTE_REASONS.includes("SIGN_OFF"),false);
});
test("M05-11 empty review never implies permission",()=>{
 const rv=review();
 assert.equal(rv.counts.permissions,0);
 assert.ok(rv.controls.every(x=>x.permission_granted===false));
});
test("M05-11 valid DEMO note stays non-authoritative",()=>{
 const rv=review(proto(),[notes()]);
 assert.equal(rv.notes.length,1);
 assert.equal(rv.notes[0].official_decision,false);
 assert.equal(rv.notes[0].permission_granted,false);
});
test("M05-11 review notes are tied to a single control",()=>{
 const rv=review(proto(),[notes()]);
 assert.equal(rv.controls[0].note_count,1);
 assert.equal(rv.controls[1].note_count,0);
});
test("M05-11 review rejects duplicate note IDs",()=>{
 assert.throws(()=>review(proto(),[notes(),notes()]),
  /M05_11_DUPLICATE_NOTE/);
});
test("M05-11 review rejects non-DEMO reviewer IDs",()=>{
 const n=notes();n.reviewer_id="employee";
 assert.throws(()=>review(proto(),[n]),/M05_11_NOTE_INVALID/);
});
test("M05-11 review rejects mismatched snapshot",()=>{
 const n=notes();n.snapshot_id="DEMO-SNAP-OTHER";
 assert.throws(()=>review(proto(),[n]),/M05_11_NOTE_INVALID/);
});
test("M05-11 review rejects unknown control ID",()=>{
 const n=notes();n.control_id="UNLISTED_CONTROL";
 assert.throws(()=>review(proto(),[n]),/M05_11_NOTE_INVALID/);
});
test("M05-11 review rejects fake approval note",()=>{
 const n=notes();n.note_kind="APPROVED";
 assert.throws(()=>review(proto(),[n]),/M05_11_NOTE_INVALID/);
});
test("M05-11 review rejects unexpected free-text evidence field",()=>{
 const n=notes();n.contents="confidential data";
 assert.throws(()=>review(proto(),[n]),/M05_11_NOTE_INVALID/);
});
test("M05-11 review rejects protocol with forged test permission",()=>{
 const p=proto();p.project_test_permission_verified=true;
 assert.throws(()=>review(p),/M05_11_PROTOCOL_INVALID/);
});
test("M05-11 review rejects altered protocol parity cases",()=>{
 const p=proto();p.parity_cases.pop();
 assert.throws(()=>review(p),/M05_11_PROTOCOL_TAMPERED/);
});
test("M05-11 review rejects altered official control signoff",()=>{
 const p=proto();p.controls[0].official_signoff=true;
 assert.throws(()=>review(p),/M05_11_PROTOCOL_TAMPERED/);
});
test("M05-11 requires twelve categories of future regression evidence",()=>{
 assert.equal(M05_11_EVIDENCE_ARTIFACTS.length,12);
 assert.equal(new Set(M05_11_EVIDENCE_ARTIFACTS.map(x=>x.artifact_id)).size,12);
});
test("M05-11 future evidence artifacts are all not provided",()=>{
 const p=packet();
 assert.equal(p.counts.artifacts_provided,0);
 assert.ok(p.artifacts.every(x=>x.status==="NOT_PROVIDED"));
});
test("M05-11 packet records zero executions and zero verdicts",()=>{
 const p=packet();
 assert.equal(p.counts.scenarios_run,0);
 assert.equal(p.counts.scenarios_passed,0);
 assert.equal(p.counts.scenarios_failed,0);
});
test("M05-11 packet retains six blocked upstream gates",()=>{
 const p=packet();
 assert.equal(p.counts.blocked_gates,6);
 assert.ok(p.gates.every(x=>x.status==="BLOCKED"));
});
test("M05-11 a review note never changes packet readiness",()=>{
 const p=proto(),rv=review(p,[notes()]);
 const out=packet(p,rv);
 assert.equal(out.counts.demo_review_notes,1);
 assert.equal(out.status,"BLOCKED_NOT_AUTHORIZED_NOT_EXECUTED");
});
test("M05-11 a review note does not fill official artifact references",()=>{
 const p=proto(),out=packet(p,review(p,[notes()]));
 assert.ok(out.artifacts.every(x=>x.reference_id===null));
});
test("M05-11 packet refuses forged official review decision",()=>{
 const p=proto(),rv=review(p,[notes()]);
 rv.notes[0].official_decision=true;
 assert.throws(()=>packet(p,rv),/M05_11_PACKET_REVIEW_TAMPERED/);
});
test("M05-11 packet refuses forged permission from review",()=>{
 const p=proto(),rv=review(p);rv.may_run_tests=true;
 assert.throws(()=>packet(p,rv),/M05_11_PACKET_INPUT_INVALID/);
});
test("M05-11 packet refuses forged permission from protocol",()=>{
 const p=proto(),rv=review(p);p.may_run_tests=true;
 assert.throws(()=>packet(p,rv),/M05_11_PACKET_INPUT_INVALID/);
});
test("M05-11 packet refuses altered note count",()=>{
 const p=proto(),rv=review(p,[notes()]);
 rv.controls[0].note_count=99;
 assert.throws(()=>packet(p,rv),/M05_11_PACKET_REVIEW_TAMPERED/);
});
test("M05-11 packet refuses review from different snapshot",()=>{
 const p=proto(),rv=review(proto(2026,"DEMO-SNAP-OTHER"));
 assert.throws(()=>packet(p,rv),/M05_11_PACKET_INPUT_INVALID/);
});
test("M05-11 packet refuses mutated protocol control count",()=>{
 const p=proto(),rv=review(p);
 p.counts.controls=1;
 assert.throws(()=>packet(p,rv),/M05_11_PACKET_PROTOCOL_TAMPERED/);
});
test("M05-11 packet cannot run tests, connect, write or publish",()=>{
 const p=packet();
 assert.ok(M05_11_NON_EXECUTION_FLAGS.every(k=>p[k]===false));
});
test("M05-11 scenario results keep missing values distinct from a verified zero",()=>{
 const p=packet();
 assert.ok(p.cases.every(x=>
  x.expected_value===null&&x.observed_value===null&&
  x.verdict==="NOT_ASSESSED"));
});
