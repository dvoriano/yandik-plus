/**
 * M05-0 | KODE DITULIS, BELUM DIUJI.
 * Pure demo records. Not the exact live APEL form schema and no persistence.
 * No silent conversion from missing data to zero, no overwrite/auto-scoring.
 */
import {requireYear,annualPolicy} from "./policy.mjs";
export const APEL_LEDGER_SCHEMA="M05-0-MULTIYEAR-LEDGER-UNTESTED-1";
const fail=code=>{throw Error(code)};
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const REF=/^DEMO-[A-Z0-9_-]{1,40}$/;
const KINDS=["pengobatan","vaksinasi","penyuluhan","layanan_lain"];
const REPORT_KEYS=["facility_id","period","declared_no_activity",
 "counts","investigations","kurban_animals","evidence_refs"];
const count=x=>Number.isSafeInteger(x)&&x>=0;
function objectKeys(value,keys){
 return value!==null&&typeof value==="object"&&!Array.isArray(value)&&
  Object.keys(value).length===keys.length&&
  keys.every(k=>Object.hasOwn(value,k));
}
export function parsePeriod(period){
 if(typeof period!=="string"||!/^(20\d{2})-(0[1-9]|1[0-2])$/.test(period))
  fail("APEL_PERIOD_INVALID");
 const year=Number(period.slice(0,4));
 requireYear(year);
 return {year,month:Number(period.slice(5,7)),period};
}
export function normalizeDemoReport(raw){
 if(!objectKeys(raw,REPORT_KEYS))fail("APEL_REPORT_SHAPE_INVALID");
 if(typeof raw.facility_id!=="string"||!FAC.test(raw.facility_id))
  fail("APEL_FACILITY_INVALID");
 const {year,month,period}=parsePeriod(raw.period);
 if(typeof raw.declared_no_activity!=="boolean"||
    !objectKeys(raw.counts,KINDS)||KINDS.some(k=>!count(raw.counts[k])))
  fail("APEL_COUNTS_INVALID");
 if(!Array.isArray(raw.investigations)||!Array.isArray(raw.kurban_animals)||
    !Array.isArray(raw.evidence_refs))fail("APEL_ACTIVITY_LIST_INVALID");
 const events=new Set(),animals=new Set(),refs=new Set();
 for(const item of raw.investigations){
  if(!objectKeys(item,["event_id","location_id"])||
     !REF.test(item.event_id)||!REF.test(item.location_id))
   fail("APEL_INVESTIGATION_INVALID");
  const k=item.event_id+"|"+item.location_id;
  if(events.has(k))fail("APEL_DUPLICATE_INVESTIGATION_LOCATION_EVENT");
  events.add(k);
 }
 for(const item of raw.kurban_animals){
  if(!objectKeys(item,["animal_id","ante","post"])||
     !REF.test(item.animal_id)||
     typeof item.ante!=="boolean"||typeof item.post!=="boolean"||
     !(item.ante||item.post))fail("APEL_KURBAN_INVALID");
  if(animals.has(item.animal_id))fail("APEL_DUPLICATE_KURBAN_ANIMAL");
  animals.add(item.animal_id);
 }
 for(const item of raw.evidence_refs){
  if(typeof item!=="string"||!REF.test(item)||refs.has(item))
   fail("APEL_EVIDENCE_INVALID");
  refs.add(item);
 }
 const simple=KINDS.reduce((s,k)=>s+raw.counts[k],0);
 if(!count(simple+events.size+animals.size))fail("APEL_COUNT_OVERFLOW");
 if(raw.declared_no_activity&&(simple!==0||events.size!==0||animals.size!==0))
  fail("APEL_ZERO_ACTIVITY_CONFLICT");
 const total=simple+events.size+animals.size;
 return {
  schema:APEL_LEDGER_SCHEMA,synthetic:true,facility_id:raw.facility_id,
  period,year,month,
  policy_draft_version:annualPolicy(year).draft_rule_version,
  declared_no_activity:raw.declared_no_activity,
  counts:Object.fromEntries(KINDS.map(k=>[k,raw.counts[k]])),
  investigations:raw.investigations.map(x=>({...x})),
  kurban_animals:raw.kurban_animals.map(x=>({...x})),
  evidence_refs:[...raw.evidence_refs],
  investigation_count:events.size,kurban_animal_count:animals.size,
  total_demo_events:total,
  status:"RECORDED_DEMO_NOT_VERIFIED",official_verified:false
 };
}
export function emptyDemoLedger(){
 return {schema:APEL_LEDGER_SCHEMA,synthetic:true,records:[],
  persistent:false,official_authorization:false};
}
function assertLedger(ledger){
 if(!ledger||ledger.schema!==APEL_LEDGER_SCHEMA||
    ledger.synthetic!==true||ledger.persistent!==false||
    ledger.official_authorization!==false||!Array.isArray(ledger.records))
  fail("APEL_LEDGER_INVALID");
 const seen=new Set();
 for(const r of ledger.records){
  if(!r||r.schema!==APEL_LEDGER_SCHEMA||r.synthetic!==true||
     !FAC.test(r.facility_id)||typeof r.period!=="string"||
     r.year!==parsePeriod(r.period).year||r.official_verified!==false||
     r.status!=="RECORDED_DEMO_NOT_VERIFIED")
   fail("APEL_LEDGER_RECORD_INVALID");
  const key=r.facility_id+"|"+r.period;
  if(seen.has(key))fail("APEL_DUPLICATE_FACILITY_MONTH");
  seen.add(key);
 }
}
export function recordDemoReport(ledger,input){
 assertLedger(ledger);
 const report=normalizeDemoReport(input);
 const key=report.facility_id+"|"+report.period;
 if(ledger.records.some(r=>r.facility_id+"|"+r.period===key))
  fail("APEL_DUPLICATE_FACILITY_MONTH");
 return {...ledger,records:[...ledger.records.map(r=>structuredClone(r)),report]};
}
export function annualChecklist(ledger,facilityId,year){
 assertLedger(ledger);requireYear(year);
 if(typeof facilityId!=="string"||!FAC.test(facilityId))
  fail("APEL_FACILITY_INVALID");
 const rows=Array.from({length:12},(_,i)=>{
  const period=year+"-"+String(i+1).padStart(2,"0");
  const r=ledger.records.find(x=>x.facility_id===facilityId&&x.period===period);
  return {period,status:!r?"BELUM_DILAPORKAN":
   r.total_demo_events===0?"LAPORAN_NOL":"LAPORAN_ADA_KEGIATAN",
   total_demo_events:r?.total_demo_events??null,
   official_verified:false};
 });
 const reporting_months=rows.filter(r=>r.status!=="BELUM_DILAPORKAN").length;
 return {schema:APEL_LEDGER_SCHEMA,synthetic:true,facility_id:facilityId,year,
  reporting_months,missing_months:12-reporting_months,
  rows,completeness_proven:reporting_months===12,
  deadline_compliance_verified:false,
  official_scoring:false,official_authorization:false};
}
export function annualDemoTotals(ledger,facilityId,year){
 const checklist=annualChecklist(ledger,facilityId,year);
 const records=ledger.records.filter(r=>r.facility_id===facilityId&&r.year===year);
 const total=records.reduce((s,r)=>s+r.total_demo_events,0);
 if(!count(total))fail("APEL_TOTAL_OVERFLOW");
 return {schema:APEL_LEDGER_SCHEMA,synthetic:true,
  facility_id:facilityId,year,total_demo_events:total,
  reported_months:checklist.reporting_months,
  missing_months:checklist.missing_months,
  is_partial:checklist.missing_months!==0,
  unreported_months_counted_as_zero:false,
  official_scoring:false,ranking_enabled:false,may_publish:false};
}
