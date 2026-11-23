/**
 * M05-12 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Readiness and no-go are documentation templates, not a deployment controller.
 * Never reads sources, accesses servers, starts tests, or authorizes production.
 */
import {requireYear,annualPolicy} from "../m05-apel-multiyear/policy.mjs";
import {buildDemoStagingProtocol,noExecutionAuthority}
 from "../m05-apel-staging-protocol/protocol.mjs";
import {buildDemoProtocolReview}
 from "../m05-apel-staging-protocol/review.mjs";
import {buildDemoStagingEvidencePacket}
 from "../m05-apel-staging-protocol/packet.mjs";
import {isDemoId} from "../m05-apel-evidence/evidence.mjs";

export const M05_12_READINESS_SCHEMA="M05-12-RELEASE-READINESS-UNTESTED-1";
export const M05_12_RELEASE_CONTROLS=Object.freeze([
 ["OWNER_CHANGE_AUTHORITY","PROJECT_OWNER","Separate written authority to consider production change"],
 ["SYSTEM_PRODUCTION_AUTHORITY","SYSTEM_OWNER","Production system owner explicitly approves exact scope"],
 ["INDEPENDENT_RELEASE_REVIEW","QA_REVIEWER","Independent review of test evidence, defects and exceptions"],
 ["STAGING_PARITY_COMPLETE","APEL_PROCESS_OWNER","Authorized staging tests and Juknis parity actually completed"],
 ["ANNUAL_POLICY_APPROVED","APEL_PROCESS_OWNER","Year-specific policy is officially approved and effective"],
 ["SCHEMA_MIGRATION_REVIEW","DATA_MANAGER","Schema/migration compatibility and backward changes are reviewed"],
 ["SOURCE_PROVENANCE_READY","SOURCE_OWNER","Data sources, snapshots and permissions are verified"],
 ["RBAC_SECRETS_SECURITY","SYSTEM_MANAGER","Least privilege, secret custody and privacy are verified"],
 ["PRODUCTION_BACKUP_VERIFIED","SYSTEM_MANAGER","Production backup and restore verification are documented"],
 ["ROLLBACK_PLAN_APPROVED","SYSTEM_OWNER","Fallback strategy, triggers and actual tested restore method are approved"],
 ["MAINTENANCE_WINDOW","SYSTEM_OWNER","Scheduled change window and affected services are agreed"],
 ["OBSERVABILITY_BASELINE","SYSTEM_MANAGER","Logs, metrics, alerts and pre-change baseline are ready"],
 ["HEALTHCHECK_CRITERIA","SYSTEM_MANAGER","Post-change checks, thresholds and abort conditions are approved"],
 ["ONCALL_ESCALATION","SYSTEM_OWNER","On-call and escalation roles are explicitly appointed outside the repo"],
 ["DATA_INTEGRITY_GUARD","DATA_MANAGER","No loss/duplicate count or wrong historical attribution after a change"],
 ["DEPENDENCY_COMPATIBILITY","SYSTEM_MANAGER","Runtime, libraries, integrations and reverse proxy changes reviewed"],
 ["COMMUNICATION_AND_SUPPORT","APEL_PROCESS_OWNER","Official communications, support channel and incident process approved"],
 ["PUBLICATION_SEPARATION","APEL_PROCESS_OWNER","Public reporting remains separately authorized"]
].map(([control_id,owner_role,purpose])=>
 Object.freeze({control_id,owner_role,purpose,verified:false,approved:false})));

const fail=code=>{throw Error(code)};
export const M05_12_DENIED_ACTIONS=Object.freeze([
 "may_run_tests","may_connect","may_query","may_write","may_repair",
 "may_migrate","may_release","may_rollback","may_restart",
 "may_score","may_rank","may_award","may_publish","may_merge","may_deploy",
 "official_authorization","production_authorization_verified",
 "project_test_permission_verified","system_access_permission_verified",
 "production_backup_verified","rollback_test_verified",
 "staging_tests_verified","juknis_parity_verified"
]);
export function allActionsDenied(x){
 return M05_12_DENIED_ACTIONS.every(key=>x?.[key]===false);
}
export function buildDemoReleaseReadiness({year,snapshot_id}={}){
 requireYear(year);
 if(!isDemoId(snapshot_id)||!snapshot_id.startsWith("DEMO-SNAP-"))
  fail("M05_12_SNAPSHOT_INVALID");
 const protocol=buildDemoStagingProtocol({year,snapshot_id});
 if(!noExecutionAuthority(protocol))
  fail("M05_12_PROTOCOL_UNSAFE");
 const review=buildDemoProtocolReview({protocol,notes:[]});
 const staging=buildDemoStagingEvidencePacket({protocol,review});
 if(staging.status!=="BLOCKED_NOT_AUTHORIZED_NOT_EXECUTED"||
  staging.code_only_active!==true||
  staging.counts.artifacts_provided!==0||
  staging.counts.scenarios_run!==0||
  staging.counts.blocked_gates!==6)
  fail("M05_12_STAGING_NOT_BLOCKED");
 const controls=M05_12_RELEASE_CONTROLS.map(x=>({
  ...x,status:"BLOCKED_NO_OFFICIAL_EVIDENCE",
  evidence_ref:null,signoff_ref:null,decision:"NOT_ASSESSED"}));
 const gates=[
  "TEST_AND_STAGING","DATA_AND_SECURITY","BACKUP_AND_RECOVERY",
  "PRODUCTION_CHANGE_AUTHORITY","PUBLICATION_AUTHORITY"
 ].map(gate_id=>({gate_id,status:"NO_GO",
  evidence_verified:false,official_signoff:false,execution_permitted:false}));
 return {schema:M05_12_READINESS_SCHEMA,synthetic:true,
  mode:"RELEASE_DESIGN_NO_EXECUTION",year,snapshot_id,
  policy_draft_version:annualPolicy(year).draft_rule_version,
  upstream_staging_state:"BLOCKED_NOT_AUTHORIZED_NOT_EXECUTED",
  upstream_staging_test_count:0,upstream_blocked_gates:6,
  controls,gates,
  counts:{controls:controls.length,blocked_controls:controls.length,
   gates:gates.length,no_go_gates:gates.length,signoffs:0,
   staging_tests_run:0,production_changes:0,rollbacks_run:0},
  decision:"NO_GO_UNAUTHORIZED_UNTESTED",
  code_only_active:true,production_environment_connected:false,
  production_authorization_verified:false,
  project_test_permission_verified:false,
  system_access_permission_verified:false,
  production_backup_verified:false,rollback_test_verified:false,
  staging_tests_verified:false,juknis_parity_verified:false,
  may_run_tests:false,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_migrate:false,
  may_release:false,may_rollback:false,may_restart:false,
  may_score:false,may_rank:false,may_award:false,may_publish:false,
  may_merge:false,may_deploy:false,official_authorization:false};
}
export function assertDemoReleaseReadiness(value){
 if(value?.schema!==M05_12_READINESS_SCHEMA||value?.synthetic!==true||
  value?.mode!=="RELEASE_DESIGN_NO_EXECUTION"||
  value?.code_only_active!==true||!allActionsDenied(value))
  fail("M05_12_READINESS_INVALID");
 const canonical=buildDemoReleaseReadiness({
  year:value.year,snapshot_id:value.snapshot_id});
 if(JSON.stringify(value)!==JSON.stringify(canonical))
  fail("M05_12_READINESS_TAMPERED");
 return true;
}
