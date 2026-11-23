/** M05-12 | QA WRITTEN, ZERO EXECUTED | CODE_ONLY | DEMO ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoReleaseReadiness,assertDemoReleaseReadiness,
 M05_12_RELEASE_CONTROLS,M05_12_DENIED_ACTIONS} from "../readiness.mjs";
import {buildDemoRollbackPlan,assertDemoRollbackPlan,
 M05_12_STOP_CONDITIONS,M05_12_ROLLBACK_STEPS} from "../rollback.mjs";
import {buildDemoReleaseReview,buildDemoReleaseHandoff,
 M05_12_HANDOFF_ARTIFACTS,M05_12_REVIEW_ACTIONS}
 from "../handoff.mjs";
import {annualPolicy,SUPPORTED_YEARS}
 from "../../m05-apel-multiyear/policy.mjs";

const SNAP="DEMO-SNAP-RELEASE-1";
const ready=(year=2026,snapshot_id=SNAP)=>
 buildDemoReleaseReadiness({year,snapshot_id});
const rollback=(r=ready())=>buildDemoRollbackPlan({readiness:r});
const note=(id="DEMO-NOTE-1")=>({
 note_id:id,snapshot_id:SNAP,control_id:"OWNER_CHANGE_AUTHORITY",
 reviewer_id:"DEMO-REVIEWER-1",action_code:"REQUEST_TEST_EVIDENCE",
 reason_code:"DEMO_TESTS_NOT_RUN"
});
const review=(r=ready(),notes=[])=>buildDemoReleaseReview({
 readiness:r,notes});
const packet=(r=ready(),b=rollback(r),rv=review(r))=>
 buildDemoReleaseHandoff({readiness:r,rollback:b,review:rv});

test("M05-12 defines 18 separate pre-release control requirements",()=>{
 assert.equal(M05_12_RELEASE_CONTROLS.length,18);
});
test("M05-12 control IDs are unique",()=>{
 const ids=M05_12_RELEASE_CONTROLS.map(x=>x.control_id);
 assert.equal(new Set(ids).size,ids.length);
});
test("M05-12 release decision requires separate project and system authority",()=>{
 const ids=M05_12_RELEASE_CONTROLS.map(x=>x.control_id);
 assert.ok(ids.includes("OWNER_CHANGE_AUTHORITY"));
 assert.ok(ids.includes("SYSTEM_PRODUCTION_AUTHORITY"));
});
test("M05-12 requires independently verified staging parity",()=>{
 assert.ok(M05_12_RELEASE_CONTROLS.some(x=>
  x.control_id==="STAGING_PARITY_COMPLETE"));
});
test("M05-12 requires independently approved year-specific policy",()=>{
 assert.ok(M05_12_RELEASE_CONTROLS.some(x=>
  x.control_id==="ANNUAL_POLICY_APPROVED"));
});
test("M05-12 requires production backup verification",()=>{
 assert.ok(M05_12_RELEASE_CONTROLS.some(x=>
  x.control_id==="PRODUCTION_BACKUP_VERIFIED"));
});
test("M05-12 requires rollback and recovery approval",()=>{
 assert.ok(M05_12_RELEASE_CONTROLS.some(x=>
  x.control_id==="ROLLBACK_PLAN_APPROVED"));
});
test("M05-12 requires independent on-call assignment outside repo",()=>{
 assert.ok(M05_12_RELEASE_CONTROLS.some(x=>
  x.control_id==="ONCALL_ESCALATION"));
});
test("M05-12 security and historical data integrity are explicit",()=>{
 const ids=M05_12_RELEASE_CONTROLS.map(x=>x.control_id);
 assert.ok(ids.includes("RBAC_SECRETS_SECURITY"));
 assert.ok(ids.includes("DATA_INTEGRITY_GUARD"));
});
test("M05-12 publication is a separate authorization",()=>{
 assert.ok(M05_12_RELEASE_CONTROLS.some(x=>
  x.control_id==="PUBLICATION_SEPARATION"));
});
test("M05-12 release checklist contains 18 blocked controls",()=>{
 const p=ready();
 assert.equal(p.counts.blocked_controls,18);
 assert.ok(p.controls.every(x=>x.status==="BLOCKED_NO_OFFICIAL_EVIDENCE"));
});
test("M05-12 release checklist exposes five no-go gates",()=>{
 const p=ready();
 assert.equal(p.gates.length,5);
 assert.ok(p.gates.every(x=>x.status==="NO_GO"&&
  x.execution_permitted===false));
});
test("M05-12 empty checklist cannot assert a production change",()=>{
 const p=ready();
 assert.equal(p.counts.production_changes,0);
 assert.equal(p.decision,"NO_GO_UNAUTHORIZED_UNTESTED");
});
test("M05-12 upstream staging is not authorized or executed",()=>{
 const p=ready();
 assert.equal(p.upstream_blocked_gates,6);
 assert.equal(p.upstream_staging_test_count,0);
});
test("M05-12 2026 uses its own demo policy draft",()=>{
 assert.equal(ready(2026).policy_draft_version,
  annualPolicy(2026).draft_rule_version);
});
test("M05-12 2030 uses a distinct annual draft policy",()=>{
 assert.notEqual(ready(2030).policy_draft_version,
  ready(2026).policy_draft_version);
});
test("M05-12 covers only configured years 2026 through 2030",()=>{
 assert.deepEqual(SUPPORTED_YEARS,[2026,2027,2028,2029,2030]);
});
test("M05-12 rejects unsupported 2031 policy",()=>{
 assert.throws(()=>ready(2031),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-12 rejects string year",()=>{
 assert.throws(()=>ready("2026"),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-12 rejects non-demo snapshot ID",()=>{
 assert.throws(()=>ready(2026,"SNAP-REAL"),/M05_12_SNAPSHOT_INVALID/);
});
test("M05-12 rejects demo ID without snapshot namespace",()=>{
 assert.throws(()=>ready(2026,"DEMO-OTHER"),/M05_12_SNAPSHOT_INVALID/);
});
test("M05-12 read-only inspection never grants any action",()=>{
 const r=ready();
 assert.ok(M05_12_DENIED_ACTIONS.every(key=>r[key]===false));
});
test("M05-12 official readiness cannot be spoofed by changing a gate",()=>{
 const r=ready();r.gates[0].status="GO";
 assert.throws(()=>assertDemoReleaseReadiness(r),/M05_12_READINESS_TAMPERED/);
});
test("M05-12 official signoff cannot be spoofed",()=>{
 const r=ready();r.controls[0].approved=true;
 assert.throws(()=>assertDemoReleaseReadiness(r),/M05_12_READINESS_TAMPERED/);
});
test("M05-12 production access flag cannot be enabled",()=>{
 const r=ready();r.may_connect=true;
 assert.throws(()=>assertDemoReleaseReadiness(r),/M05_12_READINESS_INVALID/);
});
test("M05-12 defines 11 stop and rollback conditions",()=>{
 assert.equal(M05_12_STOP_CONDITIONS.length,11);
});
test("M05-12 stop condition IDs are unique",()=>{
 assert.equal(new Set(M05_12_STOP_CONDITIONS.map(x=>
  x.condition_id)).size,11);
});
test("M05-12 stop conditions include loss of counts and privacy",()=>{
 const ids=M05_12_STOP_CONDITIONS.map(x=>x.condition_id);
 assert.ok(ids.includes("SERVICE_COUNT_DRIFT"));
 assert.ok(ids.includes("ACCESS_OR_SECRET_EXPOSURE"));
});
test("M05-12 stop conditions distinguish missing from zero",()=>{
 assert.ok(M05_12_STOP_CONDITIONS.some(x=>
  x.condition_id==="UNEXPECTED_ZERO_CONVERSION"));
});
test("M05-12 stop conditions cover historical region drift",()=>{
 assert.ok(M05_12_STOP_CONDITIONS.some(x=>
  x.condition_id==="REGION_HISTORY_DRIFT"));
});
test("M05-12 rollback lists ten operator-led conceptual steps",()=>{
 assert.equal(M05_12_ROLLBACK_STEPS.length,10);
});
test("M05-12 rollback never claims a restore occurred",()=>{
 const p=rollback();
 assert.equal(p.counts.restores_completed,0);
 assert.equal(p.actual_rollback_result,null);
});
test("M05-12 rollback never stores a real restore point",()=>{
 const p=rollback();
 assert.equal(p.restore_point,null);
 assert.equal(p.backup_verification_ref,null);
});
test("M05-12 rollback never runs operations from its step list",()=>{
 const p=rollback();
 assert.ok(p.steps.every(x=>x.operation_status==="NOT_RUN"&&
  x.completed===false));
});
test("M05-12 rollback thresholds remain undecided",()=>{
 const p=rollback();
 assert.ok(p.triggers.every(x=>
  x.threshold==="NOT_DEFINED_BY_APPROVED_POLICY"&&
  x.automated_trigger===false));
});
test("M05-12 rollback rejects fake backup verification",()=>{
 const r=ready(),p=rollback(r);p.backup_verified=true;
 assert.throws(()=>assertDemoRollbackPlan(p,r),/M05_12_ROLLBACK_INVALID/);
});
test("M05-12 rollback rejects fake executed restore step",()=>{
 const r=ready(),p=rollback(r);p.steps[0].completed=true;
 assert.throws(()=>assertDemoRollbackPlan(p,r),/M05_12_ROLLBACK_TAMPERED/);
});
test("M05-12 rollback rejects changed snapshot in its source",()=>{
 const r=ready(),p=rollback(r);p.snapshot_id="DEMO-SNAP-OTHER";
 assert.throws(()=>assertDemoRollbackPlan(p,r),/M05_12_ROLLBACK_TAMPERED/);
});
test("M05-12 rollback forbids all release and change actions",()=>{
 const p=rollback();
 assert.ok(M05_12_DENIED_ACTIONS.every(key=>p[key]===false));
});
test("M05-12 review action vocabulary excludes approval",()=>{
 assert.equal(M05_12_REVIEW_ACTIONS.includes("APPROVE_RELEASE"),false);
});
test("M05-12 review notes are allowed only for declared controls",()=>{
 const n=note();n.control_id="UNKNOWN";
 assert.throws(()=>review(ready(),[n]),/M05_12_NOTE_INVALID/);
});
test("M05-12 review rejects real identity and arbitrary contents",()=>{
 const n=note();n.reviewer_id="real_user";
 assert.throws(()=>review(ready(),[n]),/M05_12_NOTE_INVALID/);
});
test("M05-12 review rejects duplicated DEMO note ID",()=>{
 assert.throws(()=>review(ready(),[note(),note()]),
  /M05_12_DUPLICATE_NOTE/);
});
test("M05-12 review rejects forged signed permission",()=>{
 const n=note();n.official_signoff=true;
 assert.throws(()=>review(ready(),[n]),/M05_12_NOTE_INVALID/);
});
test("M05-12 review note remains non-authoritative",()=>{
 const v=review(ready(),[note()]);
 assert.equal(v.notes[0].release_authorized,false);
 assert.equal(v.counts.signoffs,0);
});
test("M05-12 release handoff defines eight empty official artifacts",()=>{
 const p=packet();
 assert.equal(M05_12_HANDOFF_ARTIFACTS.length,8);
 assert.equal(p.counts.evidence_artifacts_provided,0);
});
test("M05-12 release handoff maintains NO_GO with notes",()=>{
 const r=ready(),v=review(r,[note()]);
 const p=packet(r,rollback(r),v);
 assert.equal(p.counts.review_notes,1);
 assert.equal(p.decision,"NO_GO_UNAUTHORIZED_UNTESTED");
});
test("M05-12 handoff rejects forged official reviewer approval",()=>{
 const r=ready(),v=review(r,[note()]);
 v.notes[0].official_signoff=true;
 assert.throws(()=>packet(r,rollback(r),v),
  /M05_12_REVIEW_TAMPERED/);
});
test("M05-12 handoff rejects rollback from mismatched snapshot",()=>{
 const r=ready(),b=rollback(ready(2026,"DEMO-SNAP-OTHER"));
 assert.throws(()=>packet(r,b,review(r)),/M05_12_ROLLBACK_TAMPERED/);
});
test("M05-12 handoff cannot publish, release, restore or deploy",()=>{
 const p=packet();
 assert.ok(M05_12_DENIED_ACTIONS.every(key=>p[key]===false));
});
