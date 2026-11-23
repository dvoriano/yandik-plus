/**
 * M05-12 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * This is a paper rollback playbook, NOT an executable restore/rollback script.
 */
import {assertDemoReleaseReadiness,M05_12_READINESS_SCHEMA,
 allActionsDenied} from "./readiness.mjs";
export const M05_12_ROLLBACK_SCHEMA="M05-12-ROLLBACK-PLAYBOOK-UNTESTED-1";
export const M05_12_STOP_CONDITIONS=Object.freeze([
 ["SOURCE_INTEGRITY_MISMATCH","Mismatch against verified pre-change source"],
 ["SERVICE_COUNT_DRIFT","Service counts differ beyond an approved comparison rule"],
 ["UNEXPECTED_ZERO_CONVERSION","Missing or unknown data converted to zero"],
 ["DUPLICATE_EVENT_OR_ANIMAL","Double counting by event/location or animal"],
 ["REPORT_REVISION_MISMATCH","Wrong workflow revision used for service period"],
 ["REGION_HISTORY_DRIFT","Wrong district assignment for historical reporting month"],
 ["POLICY_VERSION_MISMATCH","Annual policy version not authorized for reporting year"],
 ["ACCESS_OR_SECRET_EXPOSURE","Detected unauthorized access or credential exposure"],
 ["DATA_LOSS_OR_CORRUPTION","Data lost, modified or corrupted unexpectedly"],
 ["HEALTHCHECK_FAILURE","Key health checks fail after a proposed change"],
 ["ROLLBACK_PATH_UNAVAILABLE","Restore point, procedure, or recovery access cannot be verified"]
].map(([condition_id,meaning])=>Object.freeze({condition_id,meaning})));
export const M05_12_ROLLBACK_STEPS=Object.freeze([
 ["STOP_CHANGE","Halt any future change, if and only if formally authorized"],
 ["DECLARE_INCIDENT","Record the issue in the official incident process"],
 ["NOTIFY_RESPONSIBLE_ROLES","Use officially appointed escalation contacts"],
 ["PRESERVE_EVIDENCE","Secure permitted logs and the verified pre-change baseline"],
 ["CHECK_RESTORE_SCOPE","Confirm backup integrity, restore point and data dependencies"],
 ["OBTAIN_RESTORE_AUTHORITY","Obtain separate production rollback authorization"],
 ["EXECUTE_APPROVED_RESTORE","Reserved for authorized operators outside this code"],
 ["VERIFY_DATA_AND_HEALTH","Compare allowed integrity, availability and workflow checks"],
 ["COMMUNICATE_AND_MONITOR","Use approved communication and observation windows"],
 ["REVIEW_AND_CLOSE_INCIDENT","Document signoff and learning through official governance"]
].map(([step_id,purpose])=>Object.freeze({step_id,purpose})));
const fail=code=>{throw Error(code)};
export function buildDemoRollbackPlan({readiness}={}){
 assertDemoReleaseReadiness(readiness);
 const triggers=M05_12_STOP_CONDITIONS.map(x=>({
  ...x,threshold:"NOT_DEFINED_BY_APPROVED_POLICY",
  observed_value:null,official_verification:false,
  action:"PROPOSE_HUMAN_REVIEW_ONLY",automated_trigger:false}));
 const steps=M05_12_ROLLBACK_STEPS.map(x=>({
  ...x,operation_status:"NOT_RUN",authorized_operator_id:null,
  verified_evidence_id:null,execution_timestamp:null,
  completed:false}));
 return {schema:M05_12_ROLLBACK_SCHEMA,synthetic:true,
  mode:"ROLLBACK_DESIGN_NOT_EXECUTABLE",
  year:readiness.year,snapshot_id:readiness.snapshot_id,
  source_readiness_schema:M05_12_READINESS_SCHEMA,
  source_decision:"NO_GO_UNAUTHORIZED_UNTESTED",
  triggers,steps,counts:{triggers:triggers.length,steps:steps.length,
   trigger_observations:0,steps_executed:0,restores_completed:0},
  restore_point:null,backup_verification_ref:null,
  restore_procedure_ref:null,authorized_operator_ref:null,
  allowed_change_window:null,actual_incident_ref:null,
  actual_rollback_result:null,
  rollback_state:"NOT_AUTHORIZED_NOT_TESTED",
  backup_verified:false,restore_procedure_verified:false,
  authorized_rollback:false,source_modified:false,
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
export function assertDemoRollbackPlan(value,readiness){
 assertDemoReleaseReadiness(readiness);
 if(value?.schema!==M05_12_ROLLBACK_SCHEMA||
  value?.synthetic!==true||
  value?.mode!=="ROLLBACK_DESIGN_NOT_EXECUTABLE"||
  !allActionsDenied(value)||value?.source_modified!==false||
  value?.backup_verified!==false||value?.authorized_rollback!==false)
  fail("M05_12_ROLLBACK_INVALID");
 const canonical=buildDemoRollbackPlan({readiness});
 if(JSON.stringify(value)!==JSON.stringify(canonical))
  fail("M05_12_ROLLBACK_TAMPERED");
 return true;
}
