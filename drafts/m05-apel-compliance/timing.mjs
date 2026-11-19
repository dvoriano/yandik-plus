/**
 * M05-2 | KODE DITULIS, BELUM DIUJI.
 * Optional date-only simulations. M05-1 has NO trusted server timestamps.
 * Sample dates cannot establish official timeliness or deadline compliance.
 */
import {M05_2_CHECKLIST_SCHEMA} from "./checklist.mjs";
import {requireSchedule} from "./schedule.mjs";
export const M05_2_TIMING_SCHEMA="M05-2-DATE-COMPARISON-DEMO-UNTESTED-1";
const fail=code=>{throw Error(code)};
const DEMO_REQUEST=/^DEMO-M05-REQ-[A-Z0-9_-]{1,40}$/;
function validDate(str){
 if(typeof str!=="string"||!/^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(str))
  return false;
 const [year,month,day]=str.split("-").map(Number);
 const x=new Date(Date.UTC(year,month-1,day));
 return x.getUTCFullYear()===year&&x.getUTCMonth()===month-1&&
  x.getUTCDate()===day;
}
function exact(x,keys){
 return x!==null&&typeof x==="object"&&!Array.isArray(x)&&
  Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
}
export function simulateSubmissionDateComparison(checklist,schedule,samples=[]){
 if(!checklist||checklist.schema!==M05_2_CHECKLIST_SCHEMA||
    checklist.synthetic!==true||checklist.mode!=="READ_ONLY_DEMO"||
    checklist.official_timeliness_verified!==false||
    checklist.may_publish!==false||checklist.official_authorization!==false||
    !Array.isArray(checklist.months)||checklist.months.length!==12||
    !Number.isInteger(checklist.year))
  fail("M05_TIMING_CHECKLIST_INVALID");
 requireSchedule(schedule,checklist.year);
 if(checklist.schedule_proposal_id!==schedule.proposal_id)
  fail("M05_TIMING_SCHEDULE_MISMATCH");
 if(!Array.isArray(samples))fail("M05_TIMING_SAMPLES_INVALID");
 const byPeriod=new Map();
 for(const item of samples){
  if(!exact(item,["period","request_id","received_date"])||
     typeof item.period!=="string"||
     !new RegExp("^"+checklist.year+"-(0[1-9]|1[0-2])$").test(item.period)||
     typeof item.request_id!=="string"||!DEMO_REQUEST.test(item.request_id)||
     !validDate(item.received_date)||byPeriod.has(item.period))
   fail("M05_TIMING_SAMPLE_INVALID");
  byPeriod.set(item.period,item);
 }
 const rows=checklist.months.map((m,i)=>{
  const deadline=schedule.months[i];
  if(!m||m.period!==deadline.period||
     m.proposed_deadline_date!==deadline.deadline_date)
   fail("M05_TIMING_ROW_MISMATCH");
  const sample=byPeriod.get(m.period);
  if(sample&&(!m.has_demo_submission||
     sample.request_id!==m.last_submission_request_id))
   fail("M05_TIMING_EVENT_MISMATCH");
  return {period:m.period,workflow_status:m.status,
   proposed_deadline_date:deadline.deadline_date,
   sampled_received_date:sample?.received_date??null,
   comparison:sample?
    (sample.received_date<=deadline.deadline_date?
      "SIMULASI_TANGGAL_PADA_ATAU_SEBELUM_TENGGAT":
      "SIMULASI_TANGGAL_SETELAH_TENGGAT"):
    "TIDAK_DAPAT_DITENTUKAN",
   receipt_source_verified:false,official_timeliness:null};
 });
 return {schema:M05_2_TIMING_SCHEMA,synthetic:true,mode:"SIMULATION_ONLY",
  facility_id:checklist.facility_id,year:checklist.year,
  schedule_proposal_id:schedule.proposal_id,rows,
  timezone_assumed:"CALENDAR_DATE_ONLY_NO_CLOCK",
  receipt_source_verified:false,official_timeliness_verified:false,
  may_score:false,may_notify:false,may_publish:false,
  official_authorization:false};
}
