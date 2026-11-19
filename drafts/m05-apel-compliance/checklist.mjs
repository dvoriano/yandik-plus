/**
 * M05-2 | KODE DITULIS, BELUM DIUJI, CODE_ONLY.
 * A scoped status checklist derived from M05-1 DEMO workflow, not live APEL.
 * No official compliance verdict, no scoring, no clocks, no data writes.
 */
import {requireYear,annualPolicy,SUPPORTED_YEARS}
 from "../m05-apel-multiyear/policy.mjs";
import {readDemoWorkflow} from "../m05-apel-workflow/workflow.mjs";
import {requireSchedule} from "./schedule.mjs";
export const M05_2_CHECKLIST_SCHEMA="M05-2-COMPLIANCE-DRAFT-UNTESTED-1";
const fail=code=>{throw Error(code)};
const LABELS=Object.freeze({
 DRAFT:"DRAF_BELUM_DIKIRIM",
 SUBMITTED_REVIEW_PENDING:"TERKIRIM_MENUNGGU_TELAAH",
 CORRECTION_REQUESTED:"DIKEMBALIKAN_UNTUK_PERBAIKAN",
 REVISION_DRAFT:"DRAF_REVISI_BELUM_DIKIRIM"
});
function row(read,period,deadline){
 const record=read.record,events=read.events;
 if(!record){
  if(events.length)fail("M05_CHECKLIST_ORPHAN_EVENTS");
  return {period,status:"BELUM_DILAPORKAN",revision:null,
   last_submission_request_id:null,has_demo_submission:false,
   reported_zero:null,draft_or_correction_pending:false,
   proposed_deadline_date:deadline?.deadline_date??null,
   proposed_publication_date:deadline?.publication_date??null,
   timeliness:"TIDAK_DAPAT_DITENTUKAN",official_compliance:null};
 }
 if(record.facility_id!==read.facility_id||record.period!==period||
    !Object.hasOwn(LABELS,record.status)||
    record.policy_draft_version!==annualPolicy(Number(period.slice(0,4))).draft_rule_version||
    !Array.isArray(events))
  fail("M05_CHECKLIST_WORKFLOW_INVALID");
 const submissions=events.filter(e=>e.action==="submit"||e.action==="resubmit");
 const last=submissions.at(-1)??null;
 const has=last!==null;
 if((record.status==="DRAFT"&&has)||
    (record.status!=="DRAFT"&&!has)||
    (has&&(!record.report||record.report.official_verified!==false)))
  fail("M05_CHECKLIST_SUBMISSION_INCONSISTENT");
 return {period,status:LABELS[record.status],revision:record.revision,
  last_submission_request_id:last?.request_id??null,
  has_demo_submission:has,
  reported_zero:has?record.report.total_demo_events===0:null,
  draft_or_correction_pending:record.status!=="SUBMITTED_REVIEW_PENDING",
  proposed_deadline_date:deadline?.deadline_date??null,
  proposed_publication_date:deadline?.publication_date??null,
  timeliness:"TIDAK_DAPAT_DITENTUKAN",
  official_compliance:null};
}
export function buildFacilityYearChecklist({state,adapters,facility_id,year,
 schedule=null}={}){
 requireYear(year);
 if(schedule!==null)requireSchedule(schedule,year);
 const months=Array.from({length:12},(_,i)=>{
  const period=year+"-"+String(i+1).padStart(2,"0");
  // Each read is scope-checked by the DEMO server contract.
  // Multiple reads DO NOT prove transactional snapshot consistency.
  const r=readDemoWorkflow(state,adapters,facility_id,period);
  const deadline=schedule?.months[i]??null;
  if(deadline&&deadline.period!==period)
   fail("M05_CHECKLIST_SCHEDULE_MISMATCH");
  return row(r,period,deadline);
 });
 const count=status=>months.filter(m=>m.status===status).length;
 return {schema:M05_2_CHECKLIST_SCHEMA,synthetic:true,mode:"READ_ONLY_DEMO",
  facility_id,year,policy_draft_version:annualPolicy(year).draft_rule_version,
  schedule_proposal_id:schedule?.proposal_id??null,months,
  summary:{
   missing:count("BELUM_DILAPORKAN"),
   draft_unsent:count("DRAF_BELUM_DIKIRIM"),
   submitted_pending_review:count("TERKIRIM_MENUNGGU_TELAAH"),
   correction_requested:count("DIKEMBALIKAN_UNTUK_PERBAIKAN"),
   revision_draft_unsent:count("DRAF_REVISI_BELUM_DIKIRIM"),
   ever_submitted_demo:months.filter(m=>m.has_demo_submission).length,
   explicit_zero_submissions_demo:months.filter(m=>m.reported_zero===true).length
  },
  no_official_deadline_verification:true,
  official_completeness_verified:false,
  official_timeliness_verified:false,
  official_scoring:false,may_publish:false,may_notify:false,
  official_authorization:false};
}
export function buildFiveYearChecklist({state,adapters,facility_id,
 schedules=[]}={}){
 if(!Array.isArray(schedules))fail("M05_CHECKLIST_SCHEDULES_INVALID");
 const byYear=new Map();
 for(const s of schedules){
  if(!s||!Number.isInteger(s.year)||byYear.has(s.year))
   fail("M05_CHECKLIST_SCHEDULES_INVALID");
  requireSchedule(s,s.year);byYear.set(s.year,s);
 }
 const years=SUPPORTED_YEARS.map(year=>buildFacilityYearChecklist({
  state,adapters,facility_id,year,schedule:byYear.get(year)??null
 }));
 return {schema:M05_2_CHECKLIST_SCHEMA,synthetic:true,
  facility_id,from_year:2026,to_year:2030,years,
  annual_policies_independent:true,official_scoring:false,
  may_publish:false,official_authorization:false};
}
