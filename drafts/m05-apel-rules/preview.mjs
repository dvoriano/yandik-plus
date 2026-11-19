/**
 * M05-3 | KODE DITULIS, BELUM DIUJI.
 * Non-official descriptive preview: preserves missingness and source boundaries.
 * Does not calculate award scores, ranks, weights, or administrative decisions.
 */
import {requireYearRules} from "./rulebook.mjs";
import {M05_2_CHECKLIST_SCHEMA} from "../m05-apel-compliance/checklist.mjs";
import {annualDemoTotals,APEL_LEDGER_SCHEMA}
 from "../m05-apel-multiyear/reporting.mjs";
export const M05_3_PREVIEW_SCHEMA="M05-3-DESCRIPTIVE-PREVIEW-UNTESTED-1";
const fail=code=>{throw Error(code)};
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const nonneg=x=>Number.isSafeInteger(x)&&x>=0;
const categories=[
 "SERVICE_VOLUME","REPORTING_CONSISTENCY","TIMELINESS",
 "SUPPORT_REALIZATION","DISTRICT_SERVICE"
];
export function previewAnnualRuleFacts({rule,ledger,checklist}={}){
 if(!rule||!Number.isInteger(rule.year))fail("M05_PREVIEW_YEAR_INVALID");
 requireYearRules(rule,rule.year);
 if(!checklist||checklist.schema!==M05_2_CHECKLIST_SCHEMA||
    checklist.synthetic!==true||checklist.mode!=="READ_ONLY_DEMO"||
    checklist.official_completeness_verified!==false||
    checklist.official_timeliness_verified!==false||
    checklist.official_scoring!==false||
    checklist.official_authorization!==false||
    !Array.isArray(checklist.months)||checklist.months.length!==12||
    !checklist.summary||!FAC.test(checklist.facility_id)||
    checklist.year!==rule.year||
    checklist.policy_draft_version!==rule.policy_draft_version)
  fail("M05_PREVIEW_CHECKLIST_INVALID");
 // Recalculate the 12-month status summary: reject arbitrary client totals.
 const validStates=[
  "BELUM_DILAPORKAN","DRAF_BELUM_DIKIRIM",
  "TERKIRIM_MENUNGGU_TELAAH","DIKEMBALIKAN_UNTUK_PERBAIKAN",
  "DRAF_REVISI_BELUM_DIKIRIM"
 ];
 const keys=[
  "missing","draft_unsent","submitted_pending_review",
  "correction_requested","revision_draft_unsent"
 ];
 const tallies=validStates.map(status=>
   checklist.months.filter(m=>m?.status===status).length);
 if(tallies.reduce((a,b)=>a+b,0)!==12||
    keys.some((k,i)=>checklist.summary[k]!==tallies[i])||
    checklist.summary.ever_submitted_demo!==
     checklist.months.filter(m=>m.has_demo_submission===true).length||
    checklist.summary.explicit_zero_submissions_demo!==
     checklist.months.filter(m=>m.reported_zero===true).length||
    checklist.months.some((m,i)=>
      m.period!==rule.year+"-"+String(i+1).padStart(2,"0")||
      m.official_compliance!==null||
      m.timeliness!=="TIDAK_DAPAT_DITENTUKAN"))
  fail("M05_PREVIEW_CHECKLIST_TAMPERED");
 if(!ledger||ledger.schema!==APEL_LEDGER_SCHEMA||
    ledger.synthetic!==true||ledger.persistent!==false||
    ledger.official_authorization!==false)
  fail("M05_PREVIEW_LEDGER_INVALID");
 const totals=annualDemoTotals(ledger,checklist.facility_id,rule.year);
 const fields={
  SERVICE_VOLUME:{
   value:totals.total_demo_events,unit:"DEMO_EVENTS",
   source:"M05-0_UNVERIFIED_LEDGER",
   completeness:totals.missing_months===0?"ALL_MONTHS_RECORDED_DEMO":"PARTIAL_YEAR"
  },
  REPORTING_CONSISTENCY:{
   value:checklist.summary.ever_submitted_demo,unit:"DEMO_MONTHS_OF_12",
   source:"M05-2_UNVERIFIED_STATUS",
   completeness:"SUBMITTED_DOES_NOT_MEAN_APPROVED"
  },
  TIMELINESS:{value:null,unit:"UNDEFINED",
   source:"NO_TRUSTED_RECEIPT_TIMESTAMPS",completeness:"BLOCKED"},
  SUPPORT_REALIZATION:{value:null,unit:"UNDEFINED",
   source:"NO_APPROVED_SUPPORT_DENOMINATOR",completeness:"BLOCKED"},
  DISTRICT_SERVICE:{value:null,unit:"UNDEFINED",
   source:"NO_VERIFIED_DISTRICT_AGGREGATION",completeness:"BLOCKED"}
 };
 const rows=rule.categories.map(({category_id,metric_key,label})=>{
  if(!categories.includes(metric_key))fail("M05_PREVIEW_METRIC_UNKNOWN");
  const m=fields[metric_key];
  if(m.value!==null&&!nonneg(m.value))fail("M05_PREVIEW_VALUE_INVALID");
  return {
   category_id,metric_key,label,
   observed_demo_value:m.value,unit:m.unit,source:m.source,
   evidence_state:m.completeness,
   official_scoring_eligible:false,
   score:null,rank:null,award:null
  };
 });
 return {schema:M05_3_PREVIEW_SCHEMA,synthetic:true,
  mode:"DESCRIPTIVE_NONOFFICIAL_ONLY",
  facility_id:checklist.facility_id,year:rule.year,
  proposal_id:rule.proposal_id,rows,
  reported_months_ledger_demo:totals.reported_months,
  submitted_months_workflow_demo:checklist.summary.ever_submitted_demo,
  sources_reconciled:false,
  time_verified:false,historical_policy_verified:false,
  scoring_formula_verified:false,official_scoring:false,
  can_compare_across_years:false,may_rank:false,
  may_award:false,may_publish:false,official_authorization:false};
}
