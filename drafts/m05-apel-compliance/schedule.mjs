/**
 * M05-2 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Year-specific deadline/publication calendar PROPOSALS, not official policy.
 * No defaults or inheritance across years. No schedulers, reminders or writes.
 */
import {requireYear,annualPolicy} from "../m05-apel-multiyear/policy.mjs";
export const M05_2_SCHEDULE_SCHEMA="M05-2-ANNUAL-SCHEDULE-PROPOSAL-UNTESTED-1";
const fail=code=>{throw Error(code)};
const oneTo28=d=>Number.isInteger(d)&&d>=1&&d<=28;
const ID=/^DEMO-M05-SCHEDULE-(202[6-9]|2030)-[A-Z0-9_-]{1,24}$/;
const hasExactly=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
function nextMonth(year,month,day){
 const y=month===12?year+1:year;
 const m=month===12?1:month+1;
 return y+"-"+String(m).padStart(2,"0")+"-"+String(day).padStart(2,"0");
}
export function planAnnualDeadline({year,proposal_id,deadline_day,
 publication_day,exceptions=[]}={}){
 requireYear(year);
 if(typeof proposal_id!=="string"||!ID.test(proposal_id)||
   !proposal_id.startsWith("DEMO-M05-SCHEDULE-"+year+"-"))
  fail("M05_SCHEDULE_ID_INVALID");
 if(!oneTo28(deadline_day)||!oneTo28(publication_day))
  fail("M05_SCHEDULE_DAY_INVALID");
 if(!Array.isArray(exceptions))fail("M05_SCHEDULE_EXCEPTIONS_INVALID");
 const seen=new Set(),byPeriod=new Map();
 for(const exception of exceptions){
  if(!hasExactly(exception,["period","deadline_day","publication_day","reason"])||
     typeof exception.period!=="string"||
     !new RegExp("^"+year+"-(0[1-9]|1[0-2])$").test(exception.period)||
     !oneTo28(exception.deadline_day)||
     !oneTo28(exception.publication_day)||
     typeof exception.reason!=="string"||
     exception.reason.trim()!==exception.reason||
     exception.reason.length<12||exception.reason.length>180||
     seen.has(exception.period))
   fail("M05_SCHEDULE_EXCEPTION_INVALID");
  seen.add(exception.period);byPeriod.set(exception.period,exception);
 }
 const policy=annualPolicy(year);
 const months=Array.from({length:12},(_,i)=>{
  const month=i+1,period=year+"-"+String(month).padStart(2,"0");
  const selected=byPeriod.get(period);
  return Object.freeze({period,year,month,
   deadline_date:nextMonth(year,month,selected?.deadline_day??deadline_day),
   publication_date:nextMonth(year,month,selected?.publication_day??publication_day),
   source:selected?"YEAR_EXCEPTION_DEMO":"YEAR_DEFAULT_PROPOSAL",
   exception_reason:selected?.reason??null,official_verified:false});
 });
 return Object.freeze({
  schema:M05_2_SCHEDULE_SCHEMA,synthetic:true,mode:"PROPOSAL_ONLY",
  year,proposal_id,default_deadline_day:deadline_day,
  default_publication_day:publication_day,
  policy_draft_version:policy.draft_rule_version,
  months,approved:false,official_rules_verified:false,
  deadline_enforced:false,publication_allowed:false,
  may_notify:false,may_score:false,may_publish:false,
  official_authorization:false
 });
}
export function requireSchedule(schedule,year){
 requireYear(year);
 if(!schedule||schedule.schema!==M05_2_SCHEDULE_SCHEMA||
   schedule.synthetic!==true||schedule.mode!=="PROPOSAL_ONLY"||
   schedule.year!==year||schedule.approved!==false||
   schedule.official_rules_verified!==false||
   schedule.deadline_enforced!==false||
   schedule.publication_allowed!==false||
   schedule.may_notify!==false||schedule.may_score!==false||
   schedule.may_publish!==false||schedule.official_authorization!==false||
   schedule.policy_draft_version!==annualPolicy(year).draft_rule_version||
   typeof schedule.proposal_id!=="string"||
   !ID.test(schedule.proposal_id)||
   !schedule.proposal_id.startsWith("DEMO-M05-SCHEDULE-"+year+"-")||
   !oneTo28(schedule.default_deadline_day)||
   !oneTo28(schedule.default_publication_day)||
   !Array.isArray(schedule.months)||schedule.months.length!==12)
   fail("M05_SCHEDULE_INVALID");
 const original=planAnnualDeadline({
  year,proposal_id:schedule.proposal_id,
  deadline_day:schedule.default_deadline_day,
  publication_day:schedule.default_publication_day,
  exceptions:schedule.months.filter(x=>x.source==="YEAR_EXCEPTION_DEMO").map(x=>({
   period:x.period,deadline_day:Number(x.deadline_date.slice(-2)),
   publication_day:Number(x.publication_date.slice(-2)),
   reason:x.exception_reason
  }))
 });
 // Validate exact month-by-month dates and metadata, not arbitrary supplied "approved".
 if(JSON.stringify(original.months)!==JSON.stringify(schedule.months))
  fail("M05_SCHEDULE_MONTHS_TAMPERED");
 return true;
}
