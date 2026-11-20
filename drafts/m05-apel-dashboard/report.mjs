/**
 * M05-4 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Pure, source-labelled descriptive report over M05-3 DEMO previews.
 * Aggregates raw values only within the same year and metric.
 * No score, ranking, cross-year growth, official compliance or publication.
 */
import {SUPPORTED_YEARS,requireYear} from "../m05-apel-multiyear/policy.mjs";
import {M05_3_PREVIEW_SCHEMA} from "../m05-apel-rules/preview.mjs";
export const M05_4_REPORT_SCHEMA="M05-4-APEL-DESCRIPTIVE-REPORT-UNTESTED-1";
const fail=code=>{throw Error(code)};
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const METRICS=["SERVICE_VOLUME","REPORTING_CONSISTENCY",
 "TIMELINESS","SUPPORT_REALIZATION","DISTRICT_SERVICE"];
const safeCount=x=>Number.isSafeInteger(x)&&x>=0;
const metricValue=(preview,key)=>{
 const rows=preview.rows.filter(r=>r.metric_key===key);
 if(rows.length>1)fail("M05_REPORT_DUPLICATE_METRIC");
 if(!rows.length)return {value:null,unit:null,source:"NOT_INCLUDED",
  evidence_state:"NOT_IN_PROPOSAL"};
 const r=rows[0];
 if(r.official_scoring_eligible!==false||r.score!==null||
    r.rank!==null||r.award!==null||
    (r.observed_demo_value!==null&&!safeCount(r.observed_demo_value))||
    typeof r.unit!=="string"||typeof r.source!=="string"||
    typeof r.evidence_state!=="string")
  fail("M05_REPORT_METRIC_INVALID");
 return {value:r.observed_demo_value,unit:r.unit,source:r.source,
  evidence_state:r.evidence_state};
};
function assertPreview(p){
 if(!p||p.schema!==M05_3_PREVIEW_SCHEMA||p.synthetic!==true||
  p.mode!=="DESCRIPTIVE_NONOFFICIAL_ONLY"||!FAC.test(p.facility_id)||
  !SUPPORTED_YEARS.includes(p.year)||typeof p.proposal_id!=="string"||
  p.sources_reconciled!==false||p.time_verified!==false||
  p.historical_policy_verified!==false||p.scoring_formula_verified!==false||
  p.official_scoring!==false||p.can_compare_across_years!==false||
  p.may_rank!==false||p.may_award!==false||p.may_publish!==false||
  p.official_authorization!==false||!Array.isArray(p.rows)||
  !safeCount(p.reported_months_ledger_demo)||
  p.reported_months_ledger_demo>12||
  !safeCount(p.submitted_months_workflow_demo)||
  p.submitted_months_workflow_demo>12)
  fail("M05_REPORT_PREVIEW_INVALID");
 const seen=new Set();
 for(const r of p.rows){
  if(!r||!METRICS.includes(r.metric_key)||typeof r.category_id!=="string"||
    typeof r.label!=="string"||seen.has(r.metric_key))fail("M05_REPORT_ROW_INVALID");
  seen.add(r.metric_key);
  metricValue({...p,rows:[r]},r.metric_key);
 }
 return p;
}
export function buildAnnualDescriptiveReport({previews,year}={}){
 requireYear(year);
 if(!Array.isArray(previews)||previews.length>1000)
  fail("M05_REPORT_INPUT_INVALID");
 const chosen=previews.filter(p=>p?.year===year).map(assertPreview);
 const ids=new Set();
 for(const p of chosen){
  if(ids.has(p.facility_id))fail("M05_REPORT_DUPLICATE_FACILITY_YEAR");
  ids.add(p.facility_id);
 }
 const metrics=METRICS.map(metric_key=>{
  const observations=chosen.map(p=>({facility_id:p.facility_id,
   ...metricValue(p,metric_key)}));
  const available=observations.filter(x=>x.value!==null);
  const unavailable=observations.length-available.length;
  const units=new Set(available.map(x=>x.unit));
  const sources=new Set(available.map(x=>x.source));
  const sum=available.reduce((s,x)=>s+x.value,0);
  if(!safeCount(sum))fail("M05_REPORT_AGGREGATE_OVERFLOW");
  return {metric_key,unit:units.size===1?[...units][0]:null,
   facility_count:observations.length,available_count:available.length,
   unavailable_count:unavailable,
   total_observed_demo_value:available.length&&units.size===1?sum:null,
   unit_conflict:units.size>1,
   source_labels:[...sources].sort(),
   observations};
 });
 return {schema:M05_4_REPORT_SCHEMA,synthetic:true,
  mode:"ANNUAL_DESCRIPTIVE_ONLY",year,
  facility_count:chosen.length,metrics,
  coverage:{facility_year_records:chosen.length,
   reporting_months_ledger_demo:chosen.reduce((s,p)=>s+p.reported_months_ledger_demo,0),
   submitted_months_workflow_demo:chosen.reduce((s,p)=>s+p.submitted_months_workflow_demo,0),
   sources_reconciled:false},
  official_compliance:false,official_scoring:false,
  ranking_enabled:false,award_enabled:false,may_publish:false,
  official_authorization:false};
}
