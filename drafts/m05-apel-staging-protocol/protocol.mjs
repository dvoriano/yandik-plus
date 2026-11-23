/**
 * M05-11 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Draft protocol is NOT an authorization request, permit, run plan or staging connector.
 * All suggested activities remain NOT AUTHORIZED. No network, I/O, tests or database.
 */
import {requireYear,annualPolicy} from "../m05-apel-multiyear/policy.mjs";
import {buildAnnualParityPlan} from "../m05-apel-parity/matrix.mjs";
import {buildDemoReferenceReview} from "../m05-apel-parity/references.mjs";
import {buildDemoAcceptanceChecklist} from "../m05-apel-parity/acceptance.mjs";
import {isDemoId,REQUIREMENTS} from "../m05-apel-evidence/evidence.mjs";

export const M05_11_PROTOCOL_SCHEMA="M05-11-STAGING-PROTOCOL-UNTESTED-1";
export const M05_11_CONTROL_SPEC=Object.freeze([
 ["PROJECT_TEST_PERMISSION","PROJECT_OWNER","STAGING_TEST_PERMISSION","Explicit owner instruction ending CODE_ONLY for a specified test scope"],
 ["SYSTEM_ACCESS_PERMISSION","SYSTEM_OWNER","SOURCE_OWNER_SCOPE","Separate source owner permission for data and environment access"],
 ["PURPOSE_AND_DATA_SCOPE","SOURCE_OWNER","SOURCE_PROVENANCE","Document approved purpose, scope and least privilege"],
 ["ISOLATED_STAGING","SYSTEM_MANAGER","SECURITY_RETENTION","Isolate staging from production, including DB, keys and outbound endpoints"],
 ["SYNTHETIC_DATA_BOUNDARY","DATA_MANAGER","SECURITY_RETENTION","Restrict drafts to synthetic records; approve any different handling separately"],
 ["SECRETS_AND_RBAC","SYSTEM_MANAGER","SECURITY_RETENTION","Document access controls without storing credentials in public repository"],
 ["BACKUP_AND_RECOVERY","SYSTEM_MANAGER","SECURITY_RETENTION","Verify recovery and restore controls before any authorized migration test"],
 ["SOURCE_SCHEMA_CONTRACT","DATA_MANAGER","DATA_DICTIONARY","Review real schema mapping and field-level grain outside public repository"],
 ["BASELINE_AND_JUKNIS","APEL_PROCESS_OWNER","JUKNIS_PARITY","Verify authoritative legacy baseline and Juknis before parity execution"],
 ["YEAR_POLICY_AND_UNITS","APEL_PROCESS_OWNER","YEARLY_POLICY","Confirm annual policy and unit rules without cross-year inheritance"],
 ["REGRESSION_EVIDENCE","QA_REVIEWER","SNAPSHOT_ATOMICITY","Specify atomic snapshot, provenance and immutable run identifiers for later evidence"],
 ["FAILURE_AND_ROLLBACK","SYSTEM_MANAGER","SECURITY_RETENTION","Define stop conditions, incident handling, rollback and clean-up"],
 ["HUMAN_REVIEW_SIGNOFF","APEL_PROCESS_OWNER","STAGING_TEST_PERMISSION","Route results for independent review; do not auto-approve"],
 ["PUBLICATION_SEPARATION","APEL_PROCESS_OWNER","REPORT_PUBLICATION_PERMISSION","Require an independent decision before producing public official results"]
].map(([control_id,owner_role,evidence_requirement_id,purpose])=>
 Object.freeze({control_id,owner_role,evidence_requirement_id,purpose,
  official_evidence_verified:false,official_signoff:false})));
const reqs=new Set(REQUIREMENTS.map(x=>x.requirement_id));
const fail=code=>{throw Error(code)};
export const M05_11_NON_EXECUTION_FLAGS=Object.freeze([
 "may_run_tests","may_connect","may_query","may_write","may_repair",
 "may_score","may_rank","may_award","may_publish","may_merge","may_deploy",
 "official_authorization","project_test_permission_verified",
 "system_access_permission_verified","source_owner_verified",
 "staging_environment_verified","security_controls_verified",
 "baseline_verified","juknis_parity_verified"
]);
export function noExecutionAuthority(v){
 return M05_11_NON_EXECUTION_FLAGS.every(k=>v?.[k]===false);
}
export function buildDemoStagingProtocol({year,snapshot_id}={}){
 requireYear(year);
 if(!isDemoId(snapshot_id)||!snapshot_id.startsWith("DEMO-SNAP-"))
  fail("M05_11_SNAPSHOT_INVALID");
 const parity=buildAnnualParityPlan({year});
 const refs=buildDemoReferenceReview({plan:parity,candidates:[]});
 const upstream=buildDemoAcceptanceChecklist({review:refs});
 if(upstream.state!=="BLOCKED_NO_AUTHORIZED_REFERENCE_OR_TEST"||
  upstream.counts.blocked_gates!==6||upstream.counts.blocked_steps!==9)
  fail("M05_11_UPSTREAM_NOT_BLOCKED");
 if(M05_11_CONTROL_SPEC.some(x=>!reqs.has(x.evidence_requirement_id)))
  fail("M05_11_CONTROL_REQUIREMENT_INVALID");
 const controls=M05_11_CONTROL_SPEC.map(x=>({...x,
  status:"BLOCKED_NO_REAL_EVIDENCE",candidate_note_count:0,
  official_evidence_ref:null,official_signoff_ref:null}));
 const parityCases=parity.scenarios.map(x=>({
  case_key:x.case_key,criterion:x.criterion,
  evidence_requirement_id:x.evidence_requirement_id,
  staging_reference_ref:null,actual_result_ref:null,executed:false,
  official_verdict:"NOT_ASSESSED",ready_for_execution:false}));
 return {schema:M05_11_PROTOCOL_SCHEMA,synthetic:true,
  mode:"DRAFT_NO_STAGING_EXECUTION",year,snapshot_id,
  policy_draft_version:annualPolicy(year).draft_rule_version,
  controls,parity_cases:parityCases,
  upstream_acceptance:"BLOCKED",
  source_environment:"NONE_CONNECTED",
  proposed_execution_environment:"UNDECIDED_NOT_PROVISIONED",
  code_only_active:true,
  counts:{controls:controls.length,blocked_controls:controls.length,
   parity_cases:parityCases.length,executed:0,official_passes:0,
   official_failures:0,official_signoffs:0},
  readiness:"BLOCKED_PENDING_SEPARATE_OWNER_PERMISSIONS",
  project_test_permission_verified:false,
  system_access_permission_verified:false,
  source_owner_verified:false,staging_environment_verified:false,
  security_controls_verified:false,baseline_verified:false,
  juknis_parity_verified:false,
  may_run_tests:false,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_score:false,may_rank:false,
  may_award:false,may_publish:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
