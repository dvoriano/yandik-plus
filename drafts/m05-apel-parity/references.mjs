/**
 * M05-10 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Reference metadata candidate catalogue. Never reads documents, values, or databases.
 * Listing a DEMO reference does not prove existence or correctness of a source.
 */
import {buildAnnualParityPlan,M05_10_MATRIX_SCHEMA}
 from "./matrix.mjs";
import {isDemoId} from "../m05-apel-evidence/evidence.mjs";
export const M05_10_REFS_SCHEMA="M05-10-REFERENCE-REVIEW-UNTESTED-1";
export const M05_10_REFERENCE_KINDS=Object.freeze([
 "DEMO_JUKNIS_REFERENCE","DEMO_LEGACY_BASELINE","DEMO_POLICY_RECORD",
 "DEMO_SOURCE_DICTIONARY","DEMO_STAGING_FIXTURE"
]);
const FIELDS=["case_key","reference_id","reference_kind","supplied_by",
 "snapshot_id","claim_state"];
const fail=code=>{throw Error(code)};
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
function validatePlan(plan){
 if(plan?.schema!==M05_10_MATRIX_SCHEMA||plan?.synthetic!==true||
  plan?.mode!=="DEFERRED_PARITY_ACCEPTANCE_DESIGN")
  fail("M05_10_PLAN_INVALID");
 const expected=buildAnnualParityPlan({year:plan.year});
 if(JSON.stringify(plan)!==JSON.stringify(expected))
  fail("M05_10_PLAN_TAMPERED");
 return expected;
}
export function buildDemoReferenceReview({plan,candidates=[]}={}){
 const baseline=validatePlan(plan);
 if(!Array.isArray(candidates)||candidates.length>120)
  fail("M05_10_REFERENCES_INVALID");
 const seen=new Set();
 const accepted=candidates.map(c=>{
  if(!exact(c,FIELDS)||!isDemoId(c.reference_id)||
   !isDemoId(c.supplied_by)||!isDemoId(c.snapshot_id)||
   !c.snapshot_id.startsWith("DEMO-SNAP-")||
   !M05_10_REFERENCE_KINDS.includes(c.reference_kind)||
   c.claim_state!=="DEMO_UNVERIFIED"||
   !baseline.scenarios.some(s=>s.case_key===c.case_key))
   fail("M05_10_REFERENCE_CANDIDATE_INVALID");
  const key=c.case_key+"|"+c.reference_kind+"|"+c.reference_id;
  if(seen.has(key))fail("M05_10_DUPLICATE_REFERENCE_CANDIDATE");
  seen.add(key);
  return {...c,official_reference_verified:false,
   reference_content_loaded:false,comparison_performed:false};
 });
 const scenarios=baseline.scenarios.map(s=>({
  case_key:s.case_key,case_id:s.case_id,year:s.year,
  evidence_requirement_id:s.evidence_requirement_id,
  reference_candidate_count:accepted.filter(c=>c.case_key===s.case_key).length,
  actual_reference_verified:false,comparator_defined:false,
  acceptance_state:"PENDING_OFFICIAL_REFERENCE_AND_TEST",
  may_accept:false}));
 return {schema:M05_10_REFS_SCHEMA,synthetic:true,
  mode:"UNVERIFIED_METADATA_CANDIDATES",
  year:baseline.year,policy_draft_version:baseline.policy_draft_version,
  scenarios,candidates:accepted,
  counts:{scenarios:scenarios.length,candidates:accepted.length,
   officially_verified:0,comparisons_executed:0,passed:0,failed:0},
  official_source_verified:false,source_owner_verified:false,
  independent_validation_verified:false,
  overall_readiness:"BLOCKED_NOT_TESTED",
  may_run_tests:false,may_connect:false,may_query:false,may_write:false,
  may_repair:false,may_score:false,may_rank:false,may_award:false,
  may_publish:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
