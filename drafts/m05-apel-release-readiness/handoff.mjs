/**
 * M05-12 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Review comments and handoff are NOT an official go/no-go or a change ticket.
 */
import {assertDemoReleaseReadiness,allActionsDenied}
 from "./readiness.mjs";
import {assertDemoRollbackPlan} from "./rollback.mjs";
import {isDemoId} from "../m05-apel-evidence/evidence.mjs";

export const M05_12_REVIEW_SCHEMA="M05-12-RELEASE-REVIEW-UNTESTED-1";
export const M05_12_HANDOFF_SCHEMA="M05-12-RELEASE-HANDOFF-UNTESTED-1";
export const M05_12_REVIEW_ACTIONS=Object.freeze([
 "REQUEST_REVIEW","REQUEST_TEST_EVIDENCE","FLAG_RELEASE_RISK",
 "REQUEST_BACKUP_PROOF","REQUEST_ROLLBACK_CLARIFICATION",
 "DEFER_PENDING_AUTHORITY"
]);
export const M05_12_REVIEW_REASONS=Object.freeze([
 "DEMO_NO_PRODUCTION_APPROVAL","DEMO_TESTS_NOT_RUN",
 "DEMO_NO_STAGING_EVIDENCE","DEMO_BACKUP_UNVERIFIED",
 "DEMO_RESTORE_UNVERIFIED","DEMO_SECURITY_UNVERIFIED",
 "DEMO_POLICY_NOT_APPROVED","DEMO_REVIEW_PENDING"
]);
export const M05_12_HANDOFF_ARTIFACTS=Object.freeze([
 ["CHANGE_AUTHORITY","Written scope, approver and separation of permissions"],
 ["OFFICIAL_TEST_REPORT","Independently checked staged regression and Juknis parity results"],
 ["PRODUCTION_CHANGE_PLAN","Approved maintenance window, rollback boundaries and dependencies"],
 ["DATA_PROTECTION_REVIEW","Security/privacy, backup and protected source evidence"],
 ["RESTORE_DRILL_RECORD","Authorized prior restore drill and validated recovery outcomes"],
 ["PRE_AND_POST_CHECKS","Verified source-labelled health, service count and integrity checks"],
 ["INCIDENT_COMMUNICATION","Approved on-call and communications escalation details"],
 ["INDEPENDENT_SIGNOFF","Separate production reviewer decision and public-release authority"]
].map(([artifact_id,purpose])=>Object.freeze({artifact_id,purpose})));

const fail=x=>{throw Error(x)};
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const fields=["note_id","snapshot_id","control_id","reviewer_id",
 "action_code","reason_code"];
export function buildDemoReleaseReview({readiness,notes=[]}={}){
 assertDemoReleaseReadiness(readiness);
 if(!Array.isArray(notes)||notes.length>100)fail("M05_12_NOTES_INVALID");
 const seen=new Set();
 const accepted=notes.map(n=>{
  if(!exact(n,fields)||!isDemoId(n.note_id)||!isDemoId(n.reviewer_id)||
   n.snapshot_id!==readiness.snapshot_id||
   !readiness.controls.some(c=>c.control_id===n.control_id)||
   !M05_12_REVIEW_ACTIONS.includes(n.action_code)||
   !M05_12_REVIEW_REASONS.includes(n.reason_code))
   fail("M05_12_NOTE_INVALID");
  if(seen.has(n.note_id))fail("M05_12_DUPLICATE_NOTE");
  seen.add(n.note_id);
  return {...n,official_signoff:false,release_authorized:false,
   source_modified:false};
 });
 return {schema:M05_12_REVIEW_SCHEMA,synthetic:true,
  mode:"DEMO_NOTES_NO_RELEASE_AUTHORITY",
  year:readiness.year,snapshot_id:readiness.snapshot_id,
  notes:accepted,
  controls:readiness.controls.map(x=>({
   control_id:x.control_id,
   review_note_count:accepted.filter(n=>n.control_id===x.control_id).length,
   status:"BLOCKED_NO_OFFICIAL_EVIDENCE",approved:false})),
  counts:{notes:accepted.length,signoffs:0,approved_controls:0},
  decision:"NO_GO_UNAUTHORIZED_UNTESTED",
  may_run_tests:false,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_migrate:false,
  may_release:false,may_rollback:false,may_restart:false,
  may_score:false,may_rank:false,may_award:false,may_publish:false,
  may_merge:false,may_deploy:false,official_authorization:false,
  production_authorization_verified:false,
  project_test_permission_verified:false,
  system_access_permission_verified:false,
  production_backup_verified:false,rollback_test_verified:false,
  staging_tests_verified:false,juknis_parity_verified:false};
}
export function buildDemoReleaseHandoff({readiness,rollback,review}={}){
 assertDemoReleaseReadiness(readiness);
 assertDemoRollbackPlan(rollback,readiness);
 if(review?.schema!==M05_12_REVIEW_SCHEMA||
  review?.synthetic!==true||
  review?.mode!=="DEMO_NOTES_NO_RELEASE_AUTHORITY"||
  review?.snapshot_id!==readiness.snapshot_id||
  review?.year!==readiness.year||
  review?.decision!=="NO_GO_UNAUTHORIZED_UNTESTED"||
  !allActionsDenied(review)||!Array.isArray(review?.notes))
  fail("M05_12_REVIEW_INVALID");
 const noteFields=review.notes.map(x=>
  Object.fromEntries(fields.map(k=>[k,x[k]])));
 const canonical=buildDemoReleaseReview({readiness,notes:noteFields});
 if(JSON.stringify(canonical)!==JSON.stringify(review))
  fail("M05_12_REVIEW_TAMPERED");
 const artifacts=M05_12_HANDOFF_ARTIFACTS.map(x=>({
  ...x,status:"NOT_PROVIDED",official_document_ref:null,
  authorized_signoff:false,verified:false}));
 return {schema:M05_12_HANDOFF_SCHEMA,synthetic:true,
  mode:"NON_OPERATIONAL_NO_GO_HANDOFF",
  year:readiness.year,snapshot_id:readiness.snapshot_id,
  decision:"NO_GO_UNAUTHORIZED_UNTESTED",
  readiness_controls:readiness.controls.map(c=>({
   control_id:c.control_id,status:c.status,
   review_note_count:canonical.controls.find(x=>
    x.control_id===c.control_id).review_note_count,
   verified:false,authorized:false})),
  release_gates:readiness.gates.map(g=>({...g})),
  rollback_conditions:rollback.triggers.map(t=>({
   condition_id:t.condition_id,status:"UNVERIFIED_NOT_MONITORED",
   condition_activated:false})),
  evidence_artifacts:artifacts,
  counts:{release_controls:readiness.controls.length,
   release_gates_blocked:readiness.gates.length,
   rollback_conditions:rollback.triggers.length,
   rollback_steps_executed:0,
   review_notes:canonical.notes.length,
   evidence_artifacts_required:artifacts.length,
   evidence_artifacts_provided:0,official_approvals:0},
  publishable:false,operationally_usable:false,code_only_active:true,
  may_run_tests:false,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_migrate:false,
  may_release:false,may_rollback:false,may_restart:false,
  may_score:false,may_rank:false,may_award:false,may_publish:false,
  may_merge:false,may_deploy:false,official_authorization:false,
  production_authorization_verified:false,
  project_test_permission_verified:false,
  system_access_permission_verified:false,
  production_backup_verified:false,rollback_test_verified:false,
  staging_tests_verified:false,juknis_parity_verified:false};
}
