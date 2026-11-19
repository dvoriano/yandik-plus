/**
 * M05-3 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Explicit independent draft rule proposals per reporting year 2026-2030.
 * No official scoring, bonuses, awards, rankings, or cross-year inheritance.
 */
import {requireYear,annualPolicy,SUPPORTED_YEARS}
 from "../m05-apel-multiyear/policy.mjs";
export const M05_3_RULE_SCHEMA="M05-3-ANNUAL-RULE-PROPOSAL-UNTESTED-1";
const fail=code=>{throw Error(code)};
const ID=/^DEMO-M05-RULE-(202[6-9]|2030)-[A-Z0-9_-]{1,24}$/;
const CAT=/^DEMO-CAT-[A-Z0-9_-]{1,24}$/;
const METRIC=Object.freeze({
 SERVICE_VOLUME:"total_demo_events",
 REPORTING_CONSISTENCY:"submitted_months_demo",
 TIMELINESS:"verified_on_time_months_unavailable",
 SUPPORT_REALIZATION:"support_realization_unavailable",
 DISTRICT_SERVICE:"district_total_unavailable"
});
export const METRIC_KEYS=Object.freeze(Object.keys(METRIC));
const exact=(v,keys)=>v!==null&&typeof v==="object"&&!Array.isArray(v)&&
 Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const textSafe=(x,min,max)=>typeof x==="string"&&x.length>=min&&
 x.length<=max&&x.trim()===x&&!/[<>]|https?:\/\/|(?:token|password|secret)\s*[:=]/i.test(x);
export function annualRuleCatalog(){
 const titles={
  2026:[
   ["SERVICE_VOLUME","Apresiasi pelayanan tertinggi (referensi historis)"],
   ["REPORTING_CONSISTENCY","Apresiasi pelaporan disiplin (referensi historis)"],
   ["DISTRICT_SERVICE","Apresiasi daerah berdasarkan pelayanan (referensi historis)"]],
  2027:[
   ["SERVICE_VOLUME","Champion Pelayanan (usulan)"],
   ["SUPPORT_REALIZATION","Realisasi sesuai dukungan (usulan)"],
   ["DISTRICT_SERVICE","Kabupaten/Kota pelayanan terbanyak (usulan)"]],
  2028:[],2029:[],2030:[]
 };
 return SUPPORTED_YEARS.map(year=>({
  schema:M05_3_RULE_SCHEMA,year,synthetic:true,
  policy_draft_version:annualPolicy(year).draft_rule_version,
  concepts:titles[year].map(([metric_key,label])=>({
   metric_key,label,official_verified:false
  })),
  basis:year===2026?"PROJECT_HISTORY_NEEDS_JUKNIS_PARITY":
   year===2027?"PROPOSAL_NOT_APPROVED":"UNDEFINED_PER_YEAR",
  scoring_formula:null,weights:null,minimum_evidence:null,
  official_categories_verified:false,approved:false,
  may_rank:false,may_award:false,may_publish:false
 }));
}
export function proposeYearRules({year,proposal_id,categories,notes}={}){
 requireYear(year);
 if(typeof proposal_id!=="string"||!ID.test(proposal_id)||
    !proposal_id.startsWith("DEMO-M05-RULE-"+year+"-"))
  fail("M05_RULE_ID_INVALID");
 if(!Array.isArray(categories)||categories.length<1||categories.length>5)
  fail("M05_RULE_CATEGORIES_INVALID");
 if(!textSafe(notes,15,320))fail("M05_RULE_NOTES_INVALID");
 const ids=new Set(),metrics=new Set();
 const chosen=categories.map(c=>{
  if(!exact(c,["category_id","metric_key","label"])||
     typeof c.category_id!=="string"||!CAT.test(c.category_id)||
     !METRIC_KEYS.includes(c.metric_key)||
     !textSafe(c.label,7,96)||
     ids.has(c.category_id)||metrics.has(c.metric_key))
   fail("M05_RULE_CATEGORY_INVALID");
  ids.add(c.category_id);metrics.add(c.metric_key);
  return Object.freeze({category_id:c.category_id,metric_key:c.metric_key,
   data_field:METRIC[c.metric_key],label:c.label,
   formula:null,weight:null,tie_breaker:null,unit_decision:"UNDECIDED",
   official_verified:false});
 });
 return Object.freeze({
  schema:M05_3_RULE_SCHEMA,synthetic:true,mode:"PROPOSAL_ONLY",
  year,proposal_id,policy_draft_version:annualPolicy(year).draft_rule_version,
  categories:chosen,notes,
  inherited_previous_year_rules:false,
  source_formula_verified:false,scoring_enabled:false,approved:false,
  comparison_across_years_allowed:false,
  may_rank:false,may_award:false,may_publish:false,
  official_authorization:false
 });
}
export function requireYearRules(rule,year){
 requireYear(year);
 if(!rule||rule.schema!==M05_3_RULE_SCHEMA||
    rule.synthetic!==true||rule.mode!=="PROPOSAL_ONLY"||
    rule.year!==year||rule.policy_draft_version!==
      annualPolicy(year).draft_rule_version||
    rule.inherited_previous_year_rules!==false||
    rule.source_formula_verified!==false||
    rule.scoring_enabled!==false||rule.approved!==false||
    rule.comparison_across_years_allowed!==false||
    rule.may_rank!==false||rule.may_award!==false||
    rule.may_publish!==false||rule.official_authorization!==false)
  fail("M05_RULE_NOT_UNAPPROVED_PROPOSAL");
 const recreated=proposeYearRules({
  year,proposal_id:rule.proposal_id,
  categories:rule.categories.map(c=>({
   category_id:c.category_id,metric_key:c.metric_key,label:c.label
  })),
  notes:rule.notes
 });
 if(JSON.stringify(recreated)!==JSON.stringify(rule))
  fail("M05_RULE_PROPOSAL_CHANGED");
 return true;
}
