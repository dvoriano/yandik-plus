/**
 * M05-10 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Pure acceptance checklist: never produces PASS/READY from draft references.
 * Actual acceptance requires an independently authorized later workflow.
 */
import {M05_10_REFS_SCHEMA,buildDemoReferenceReview}
 from "./references.mjs";
import {buildAnnualParityPlan} from "./matrix.mjs";
import {GATE_CATALOG} from "../m05-apel-evidence/gates.mjs";
import {REQUIREMENTS} from "../m05-apel-evidence/evidence.mjs";
export const M05_10_ACCEPTANCE_SCHEMA="M05-10-ACCEPTANCE-CHECKLIST-UNTESTED-1";
const fail=code=>{throw Error(code)};
const REQUIREMENT_KEYS=new Set(REQUIREMENTS.map(r=>r.requirement_id));
export const M05_10_ACCEPTANCE_STEPS=Object.freeze([
 ["SOURCE_AUTHORITY","SOURCE_OWNER_SCOPE","Source owner authorizes precise read-only scope"],
 ["OFFICIAL_SCHEMA","DATA_DICTIONARY","Field mapping aligns with actual approved data dictionary"],
 ["RECORD_GRAIN","KEYS_AND_GRAIN","Event and report grain, keys and revisions are documented"],
 ["CONSISTENT_SNAPSHOT","SNAPSHOT_ATOMICITY","Atomicity, digest and provenance are independently established"],
 ["JUKNIS_PARITY","JUKNIS_PARITY","Historical 2026 calculations compared to approved Juknis and legacy reference"],
 ["ANNUAL_POLICY","YEARLY_POLICY","Each annual policy has its own formal decision and effective interval"],
 ["SECURE_STAGING","SECURITY_RETENTION","Security, privacy, access logs and retention are reviewed"],
 ["STAGING_AUTHORITY","STAGING_TEST_PERMISSION","Separate written authorization for staging test execution"],
 ["PUBLICATION_AUTHORITY","REPORT_PUBLICATION_PERMISSION","Separate authorization before any public disclosure"]
].map(([step_id,requirement_id,condition])=>Object.freeze({
 step_id,requirement_id,condition,official_verified:false,passed:false
})));
export function buildDemoAcceptanceChecklist({review}={}){
 if(review?.schema!==M05_10_REFS_SCHEMA||
  review?.synthetic!==true||
  review?.mode!=="UNVERIFIED_METADATA_CANDIDATES"||
  !Number.isInteger(review?.year)||
  review?.overall_readiness!=="BLOCKED_NOT_TESTED"||
  review?.official_source_verified!==false||
  review?.source_owner_verified!==false||
  review?.independent_validation_verified!==false||
  review?.official_authorization!==false||
  review?.may_run_tests!==false||
  review?.may_connect!==false||review?.may_query!==false||
  review?.may_write!==false||review?.may_repair!==false||
  review?.may_score!==false||review?.may_publish!==false||
  review?.may_merge!==false||review?.may_deploy!==false||
  !Array.isArray(review?.candidates)||!Array.isArray(review?.scenarios)||
  review.counts?.candidates!==review.candidates.length||
  review.counts?.scenarios!==review.scenarios.length||
  review.counts?.officially_verified!==0||
  review.counts?.comparisons_executed!==0||
  review.counts?.passed!==0||review.counts?.failed!==0||
  !review.scenarios.every(s=>s.actual_reference_verified===false&&
   s.comparator_defined===false&&s.may_accept===false&&
   s.acceptance_state==="PENDING_OFFICIAL_REFERENCE_AND_TEST"))
  fail("M05_10_REVIEW_INVALID");
 const expected=buildDemoReferenceReview({
  plan:buildAnnualParityPlan({year:review.year}),
  candidates:review.candidates.map(c=>({
   case_key:c.case_key,reference_id:c.reference_id,
   reference_kind:c.reference_kind,supplied_by:c.supplied_by,
   snapshot_id:c.snapshot_id,claim_state:c.claim_state
  }))
 });
 if(JSON.stringify(expected)!==JSON.stringify(review))
  fail("M05_10_REVIEW_TAMPERED");
 if(M05_10_ACCEPTANCE_STEPS.some(x=>
  !REQUIREMENT_KEYS.has(x.requirement_id)))
  fail("M05_10_ACCEPTANCE_REQUIREMENT_INVALID");
 const steps=M05_10_ACCEPTANCE_STEPS.map(x=>({
  ...x,gate_state:"BLOCKED",official_reference_id:null,
  test_execution_id:null,reviewer_signoff_id:null
 }));
 const gates=GATE_CATALOG.map(x=>({gate_id:x.gate_id,
  requirement_ids:[...x.requirement_ids],
  readiness:"BLOCKED",official_attestation:false}));
 return {schema:M05_10_ACCEPTANCE_SCHEMA,synthetic:true,
  mode:"NON_OPERATIONAL_ACCEPTANCE_TEMPLATE",
  year:review.year,policy_draft_version:review.policy_draft_version,
  steps,gates,scenarios:review.scenarios.map(s=>({...s})),
  counts:{steps:steps.length,blocked_steps:steps.length,
   gates:gates.length,blocked_gates:gates.length,
   scenarios:review.counts.scenarios,
   demo_reference_candidates:review.counts.candidates,
   official_passes:0,official_failures:0,executed:0},
  state:"BLOCKED_NO_AUTHORIZED_REFERENCE_OR_TEST",
  year_policy_approved:false,source_owner_verified:false,
  legacy_juknis_parity_verified:false,independent_qa_verified:false,
  may_run_tests:false,may_connect:false,may_query:false,may_write:false,
  may_repair:false,may_score:false,may_rank:false,may_award:false,
  may_publish:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
