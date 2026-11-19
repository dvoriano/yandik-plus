/**
 * M05-0 | KODE DITULIS, BELUM DIUJI. APEL 2026-2030, DEMO-only.
 * Reporting years are independent. A written draft is never an approved policy.
 */
export const APEL_POLICY_SCHEMA="M05-0-ANNUAL-POLICY-UNTESTED-1";
export const SUPPORTED_YEARS=Object.freeze([2026,2027,2028,2029,2030]);
const fail=code=>{throw Error(code)};
export function requireYear(year){
 if(!Number.isInteger(year)||!SUPPORTED_YEARS.includes(year))
  fail("APEL_YEAR_NOT_CONFIGURED");
 return year;
}
export function annualPolicy(year){
 requireYear(year);
 return {
  schema:APEL_POLICY_SCHEMA,synthetic:true,year,
  draft_rule_version:"DEMO-APEL-"+year+"-BASELINE-R0",
  historical_reference:year===2026?"JUKNIS_2026_TO_BE_VERIFIED":null,
  policy_state:year===2026?"REFERENCE_NEEDS_SOURCE_CHECK":"ANNUAL_DECISION_PENDING",
  scoring_rule_version:null,
  deadline_day:null,publication_day:null,
  metrics_contract:"DEMO_NOT_LEGACY_SCHEMA",
  official_rules_verified:false,approved:false,
  scoring_enabled:false,publishing_enabled:false
 };
}
export function annualPolicyCatalog(){
 return SUPPORTED_YEARS.map(annualPolicy);
}
export function proposeAnnualPolicy({year,version,cutoff_day,publication_day,notes}={}){
 requireYear(year);
 if(typeof version!=="string"||
    !new RegExp("^DEMO-APEL-"+year+"-PROPOSAL-[A-Z0-9_-]{1,24}$").test(version))
  fail("APEL_RULE_VERSION_INVALID");
 if(!Number.isInteger(cutoff_day)||cutoff_day<1||cutoff_day>28||
    !Number.isInteger(publication_day)||publication_day<1||publication_day>28)
  fail("APEL_POLICY_DATE_INVALID");
 if(typeof notes!=="string"||notes.trim()!==notes||
    notes.length<12||notes.length>240)
  fail("APEL_POLICY_NOTES_INVALID");
 return {schema:APEL_POLICY_SCHEMA,synthetic:true,year,version,
  proposal:{cutoff_day,publication_day,notes},
  carries_prior_year_rules:false,scoring_rule_version:null,
  official_rules_verified:false,approved:false,may_publish:false,
  may_score:false,may_change_historical_records:false};
}
