/**
 * M05-10 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Acceptance *design*, not a parity engine or an executable official Juknis.
 * No source read, numeric comparison, approval, scores or status of PASS.
 */
import {SUPPORTED_YEARS,annualPolicy,requireYear}
 from "../m05-apel-multiyear/policy.mjs";
import {REQUIREMENTS} from "../m05-apel-evidence/evidence.mjs";

export const M05_10_MATRIX_SCHEMA="M05-10-PARITY-MATRIX-UNTESTED-1";
export const M05_10_SCOPE=Object.freeze([
 "EACH_YEAR","YEAR_2026_ONLY","YEAR_2027_TO_2030"
]);
export const M05_10_CRITERIA=Object.freeze([
 "SOURCE_IDENTITY_UNIQUE","PERIOD_AND_GRAIN_AGREE",
 "MISSING_NOT_OBSERVED_ZERO","COUNT_PER_EVENT_LOCATION",
 "COUNT_PER_ANIMAL","UNIT_DICTIONARY_AGREES",
 "REPORT_REVISION_MATCH","TRUSTED_SERVER_CLOCK_REQUIRED",
 "APPROVED_DEADLINE_RULE_REQUIRED","REGION_AS_OF_PERIOD",
 "INDEPENDENT_ANNUAL_RULE","APPROVED_SUPPORT_DENOMINATOR",
 "SNAPSHOT_ATOMICITY_REQUIRED","DIGEST_VERIFIED_IN_STAGING",
 "PROVENANCE_APPROVED","PRIVACY_AND_ACCESS_CONTROL",
 "OUT_OF_RANGE_YEAR_REJECTED","MISSINGNESS_PRESERVED",
 "YEAR_TOTAL_RECONCILES","NO_OFFICIAL_RANK_FROM_DEMO",
 "PUBLICATION_SEPARATE_PERMISSION","HISTORICAL_PARITY_2026",
 "FUTURE_POLICY_UNDEFINED_NO_INHERITANCE"
]);
const fail=code=>{throw Error(code)};
const reqSet=new Set(REQUIREMENTS.map(r=>r.requirement_id));
// Scenario labels are engineering questions, not verified operational rules.
const SPEC=Object.freeze([
 ["SOURCE_FACILITY_ID","EACH_YEAR","SOURCE_IDENTITY_UNIQUE","KEYS_AND_GRAIN",
  "A single stable facility identity must anchor all source records"],
 ["REPORT_PERIOD","EACH_YEAR","PERIOD_AND_GRAIN_AGREE","KEYS_AND_GRAIN",
  "Each recorded facility-month must have its documented grain and revision"],
 ["ZERO_VS_UNREPORTED","EACH_YEAR","MISSING_NOT_OBSERVED_ZERO","SERVICE_UNIT_GRAIN",
  "Explicitly submitted zero and an unreported month must remain distinct"],
 ["INVESTIGATION_EVENT_LOCATION","YEAR_2026_ONLY","COUNT_PER_EVENT_LOCATION","SERVICE_UNIT_GRAIN",
  "Verify investigation per event and location against the authoritative 2026 Juknis"],
 ["KURBAN_ANIMAL","YEAR_2026_ONLY","COUNT_PER_ANIMAL","SERVICE_UNIT_GRAIN",
  "Verify the same sacrificial animal is not double-counted for ante/post examination"],
 ["SERVICE_UNIT","EACH_YEAR","UNIT_DICTIONARY_AGREES","SERVICE_UNIT_GRAIN",
  "Compare only quantities with approved unit and service definitions"],
 ["REPORT_REVISION","EACH_YEAR","REPORT_REVISION_MATCH","REPORT_REVISIONS",
  "Service and workflow references must point to the same approved revision"],
 ["SUBMITTED_AT","EACH_YEAR","TRUSTED_SERVER_CLOCK_REQUIRED","REPORT_REVISIONS",
  "No timeliness verdict until authoritative timestamp and timezone are evidenced"],
 ["CUTOFF_AND_EXCEPTIONS","EACH_YEAR","APPROVED_DEADLINE_RULE_REQUIRED","YEARLY_POLICY",
  "Annual and monthly reporting cutoffs require an approved source, not a guess"],
 ["REGION_HISTORY","EACH_YEAR","REGION_AS_OF_PERIOD","REGION_HISTORY",
  "District totals require a verified temporal attribution rule for the month"],
 ["YEARLY_RULE_VERSION","EACH_YEAR","INDEPENDENT_ANNUAL_RULE","YEARLY_POLICY",
  "Annual policy version must be independently approved and effective"],
 ["PLAN_REALIZATION","EACH_YEAR","APPROVED_SUPPORT_DENOMINATOR","SUPPORT_PLAN_REALIZATION",
  "Support plan, realization, units and evidence must be distinct and attributable"],
 ["ATOMIC_SNAPSHOT","EACH_YEAR","SNAPSHOT_ATOMICITY_REQUIRED","SNAPSHOT_ATOMICITY",
  "Comparisons require a consistent, documented source snapshot"],
 ["VERIFIED_DIGEST","EACH_YEAR","DIGEST_VERIFIED_IN_STAGING","SNAPSHOT_ATOMICITY",
  "A formatted digest is insufficient until independently computed and verified"],
 ["SOURCE_PROVENANCE","EACH_YEAR","PROVENANCE_APPROVED","SOURCE_PROVENANCE",
  "All compared values must trace to the authorized source and revision"],
 ["PRIVACY_GUARDRAILS","EACH_YEAR","PRIVACY_AND_ACCESS_CONTROL","SECURITY_RETENTION",
  "Authorized read-only access, retention and privacy require evidence"],
 ["YEAR_BOUNDARY","EACH_YEAR","OUT_OF_RANGE_YEAR_REJECTED","YEARLY_POLICY",
  "Do not silently borrow adjacent-year policy for unsupported periods"],
 ["NULL_MISSING_NOT_ZERO","EACH_YEAR","MISSINGNESS_PRESERVED","SERVICE_UNIT_GRAIN",
  "Unavailable, unreported and not applicable may not be converted to zero"],
 ["ANNUAL_TOTAL","EACH_YEAR","YEAR_TOTAL_RECONCILES","JUKNIS_PARITY",
  "Comparison totals require compatible denominators, units and complete coverage"],
 ["NO_RANKING_FROM_DEMO","EACH_YEAR","NO_OFFICIAL_RANK_FROM_DEMO","YEARLY_POLICY",
  "Comparison planning cannot turn DEMO quantities into official ranking"],
 ["PUBLICATION_PERMISSION","EACH_YEAR","PUBLICATION_SEPARATE_PERMISSION","REPORT_PUBLICATION_PERMISSION",
  "Internal validation does not authorize public reporting"],
 ["BASELINE_2026_PARITY","YEAR_2026_ONLY","HISTORICAL_PARITY_2026","JUKNIS_PARITY",
  "Compare approved 2026 Juknis with authoritative legacy calculations and known regressions"],
 ["FUTURE_YEAR_POLICY","YEAR_2027_TO_2030","FUTURE_POLICY_UNDEFINED_NO_INHERITANCE","YEARLY_POLICY",
  "2027 to 2030 require separate decisions; no automatic reuse of 2026 rules"]
].map(([case_id,scope,criterion,evidence_requirement_id,purpose])=>
 Object.freeze({case_id,scope,criterion,evidence_requirement_id,purpose,
  official_expected_value:null,official_source_ref:null,
  official_reference_verified:false,comparison_executed:false,
  acceptance_verdict:"NOT_ASSESSED"})));
export const M05_10_CASE_DEFINITIONS=SPEC;
export function caseCatalog(){
 return SPEC.map(x=>({...x}));
}
export function buildAnnualParityPlan({year}={}){
 requireYear(year);
 const chosen=SPEC.filter(x=>x.scope==="EACH_YEAR"||
  (year===2026&&x.scope==="YEAR_2026_ONLY")||
  (year>2026&&x.scope==="YEAR_2027_TO_2030"));
 const ids=new Set(chosen.map(x=>x.case_id));
 if(ids.size!==chosen.length||chosen.some(x=>
  !M05_10_CRITERIA.includes(x.criterion)||!reqSet.has(x.evidence_requirement_id)))
  fail("M05_10_CASE_CATALOG_INVALID");
 return {schema:M05_10_MATRIX_SCHEMA,synthetic:true,
  mode:"DEFERRED_PARITY_ACCEPTANCE_DESIGN",
  year,policy_draft_version:annualPolicy(year).draft_rule_version,
  policy_state:annualPolicy(year).policy_state,
  scenarios:chosen.map(x=>({...x,year,case_key:year+"|"+x.case_id,
   comparator:"TO_BE_DEFINED_AFTER_APPROVED_REFERENCE",
   tolerance:"NOT_DEFINED_BY_VERIFIED_POLICY",
   test_input_ref:null,expected_ref:null,observed_ref:null,
   official_pass:false,official_fail:false,
   reviewer_signoff:false})),
  counts:{scenarios:chosen.length,executed:0,passed:0,failed:0,
   official_reference_verified:0},
  source_contract_verified:false,juknis_parity_verified:false,
  policy_approved:false,source_owner_verified:false,
  verification_scope:"UNDEFINED_PENDING_OFFICIAL_SOURCE",
  overall_result:"BLOCKED_NOT_TESTED",
  may_run_tests:false,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_score:false,may_rank:false,
  may_award:false,may_publish:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
export function buildFiveYearParityMatrix(){
 const plans=SUPPORTED_YEARS.map(year=>buildAnnualParityPlan({year}));
 return {schema:M05_10_MATRIX_SCHEMA,synthetic:true,
  mode:"FIVE_INDEPENDENT_ANNUAL_PARITY_PLANS",
  years:[...SUPPORTED_YEARS],plans,
  annual_rules_inherited:false,official_comparability_verified:false,
  totals:{scenarios:plans.reduce((n,p)=>n+p.counts.scenarios,0),
   executed:0,passed:0,failed:0},
  result:"BLOCKED_NOT_TESTED",
  may_run_tests:false,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_score:false,may_rank:false,
  may_award:false,may_publish:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
