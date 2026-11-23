/**
 * M05-14 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * UI read-model over validated M05-0 synthetic ledger, not Flask/production.
 * No ranking, real source, timeliness, official totals or public release.
 */
import {SUPPORTED_YEARS,requireYear,annualPolicy}
 from "../m05-apel-multiyear/policy.mjs";
import {annualChecklist,APEL_LEDGER_SCHEMA}
 from "../m05-apel-multiyear/reporting.mjs";

export const M05_14_DASHBOARD_SCHEMA="M05-14-APEL-UI-UNTESTED-1";
export const M05_14_MONTH_NAMES=Object.freeze([
 "Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"
]);
export const M05_14_STATUS=Object.freeze({
 BELUM_DILAPORKAN:"Belum melapor",
 LAPORAN_NOL:"Laporan nol",
 LAPORAN_ADA_KEGIATAN:"Ada pelayanan"
});
const fail=code=>{throw Error(code)};
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const REG=/^DEMO-REGION-[A-Z0-9_-]{1,24}$/;
const safeCount=x=>Number.isSafeInteger(x)&&x>=0;
const safeLabel=(s,prefix)=>typeof s==="string"&&s.startsWith(prefix)&&
 s.length<=64&&s.trim()===s&&!/[<>\u0000-\u001f]/.test(s);
const allowed=Object.keys(M05_14_STATUS);

function inspectFacilities(facilities){
 if(!Array.isArray(facilities)||facilities.length>100)
  fail("M05_14_FACILITIES_INVALID");
 const ids=new Set(),list=[];
 for(const x of facilities){
  if(!x||typeof x!=="object"||Array.isArray(x)||
    Object.keys(x).length!==4||
    !Object.hasOwn(x,"facility_id")||!Object.hasOwn(x,"facility_label")||
    !Object.hasOwn(x,"region_id")||!Object.hasOwn(x,"region_label")||
    !FAC.test(x.facility_id)||!REG.test(x.region_id)||
    !safeLabel(x.facility_label,"Puskeswan DEMO ")||
    !safeLabel(x.region_label,"Wilayah DEMO ")||
    ids.has(x.facility_id))
   fail("M05_14_FACILITY_INVALID");
  ids.add(x.facility_id);
  list.push({...x});
 }
 const regionNames=new Map();
 for(const f of list){
  const name=regionNames.get(f.region_id);
  if(name!==undefined&&name!==f.region_label)
   fail("M05_14_REGION_NAME_CONFLICT");
  regionNames.set(f.region_id,f.region_label);
 }
 return list;
}
function checkLedger(ledger,facilityList){
 if(ledger?.schema!==APEL_LEDGER_SCHEMA||ledger?.synthetic!==true||
  ledger?.persistent!==false||ledger?.official_authorization!==false||
  !Array.isArray(ledger.records)||ledger.records.length>1200)
  fail("M05_14_LEDGER_INVALID");
 const ids=new Set(facilityList.map(x=>x.facility_id));
 for(const r of ledger.records){
  if(!ids.has(r?.facility_id))fail("M05_14_UNKNOWN_LEDGER_FACILITY");
 }
 // M05-0's annualChecklist validates normalized records, grain, uniqueness
 // and duplicate event/animal constraints, including *other* annual records.
 if(facilityList.length){
  annualChecklist(ledger,facilityList[0].facility_id,2026);
 }else if(ledger.records.length)fail("M05_14_ORPHAN_RECORDS");
}
export function buildDemoDashboard({
 ledger,facilities,year=2026,region_id="ALL",facility_id="ALL"
}={}){
 requireYear(year);
 const list=inspectFacilities(facilities);
 checkLedger(ledger,list);
 if(region_id!=="ALL"&&!list.some(f=>f.region_id===region_id))
  fail("M05_14_REGION_FILTER_INVALID");
 if(facility_id!=="ALL"&&!list.some(f=>f.facility_id===facility_id))
  fail("M05_14_FACILITY_FILTER_INVALID");
 if(facility_id!=="ALL"&&region_id!=="ALL"&&
  !list.some(f=>f.facility_id===facility_id&&f.region_id===region_id))
  fail("M05_14_CROSS_FILTER_MISMATCH");
 const selected=list.filter(f=>
  (region_id==="ALL"||f.region_id===region_id)&&
  (facility_id==="ALL"||f.facility_id===facility_id));
 const facilityRows=selected.map(f=>{
  const checklist=annualChecklist(ledger,f.facility_id,year);
  const months=checklist.rows.map((r,i)=>({
   month:i+1,period:r.period,status:r.status,
   observed_demo_events:r.total_demo_events,
   source:"M05-0_LEDGER_UNVERIFIED",
   official_verified:false
  }));
  if(months.some(r=>!allowed.includes(r.status)||
   ((r.status==="BELUM_DILAPORKAN")!==(r.observed_demo_events===null))||
   (r.status==="LAPORAN_NOL"&&r.observed_demo_events!==0)||
   (r.status==="LAPORAN_ADA_KEGIATAN"&&
    (!safeCount(r.observed_demo_events)||r.observed_demo_events===0))))
   fail("M05_14_STATUS_INCONSISTENT");
  const submitted=months.filter(m=>m.status!=="BELUM_DILAPORKAN");
  const observed=submitted.reduce((a,m)=>a+m.observed_demo_events,0);
  if(!safeCount(observed))fail("M05_14_COUNT_OVERFLOW");
  return {...f,months,reported_months:submitted.length,
   unreported_months:12-submitted.length,
   reported_zero_months:months.filter(m=>m.status==="LAPORAN_NOL").length,
   observed_demo_total:submitted.length?observed:null,
   total_coverage:submitted.length===12?"COMPLETE_DEMO":"PARTIAL_DEMO",
   officially_verified:false};
 });
 const n=facilityRows.length;
 const months=M05_14_MONTH_NAMES.map((label,i)=>{
  const rows=facilityRows.map(f=>f.months[i]);
  const reported=rows.filter(r=>r.status!=="BELUM_DILAPORKAN");
  const sum=reported.reduce((a,r)=>a+r.observed_demo_events,0);
  if(!safeCount(sum))fail("M05_14_COUNT_OVERFLOW");
  return {month:i+1,label,period:year+"-"+String(i+1).padStart(2,"0"),
   facilities_reported:reported.length,
   facilities_not_reported:n-reported.length,
   explicit_zero_reports:reported.filter(r=>r.status==="LAPORAN_NOL").length,
   observed_demo_events:reported.length?sum:null,
   coverage_state:!reported.length?"NO_REPORTS_DEMO":
    reported.length===n?"ALL_SELECTED_REPORTED_DEMO":"PARTIAL_DEMO",
   official_verified:false};
 });
 const reported=months.reduce((sum,m)=>sum+m.facilities_reported,0);
 const missing=months.reduce((sum,m)=>sum+m.facilities_not_reported,0);
 const zero=months.reduce((sum,m)=>sum+m.explicit_zero_reports,0);
 const total=months.reduce((sum,m)=>sum+(m.observed_demo_events??0),0);
 if(!safeCount(total))fail("M05_14_COUNT_OVERFLOW");
 const summary={facility_count:n,
  expected_facility_months:n*12,reported_facility_months:reported,
  missing_facility_months:missing,explicit_zero_reports:zero,
  observed_demo_events:reported?total:null,
  coverage_state:n===0?"NO_FACILITIES_DEMO":
   reported===n*12?"ALL_SELECTED_REPORTED_DEMO":"PARTIAL_DEMO",
  timeliness:null,official_score:null,official_rank:null};
 const options={
  years:[...SUPPORTED_YEARS],
  regions:[...new Map(list.map(f=>[f.region_id,
   {region_id:f.region_id,region_label:f.region_label}])).values()]
   .sort((a,b)=>a.region_id.localeCompare(b.region_id)),
  facilities:list.map(x=>({...x})).sort((a,b)=>
   a.facility_id.localeCompare(b.facility_id))
 };
 return {schema:M05_14_DASHBOARD_SCHEMA,synthetic:true,
  mode:"READ_ONLY_DEMO_UI_MODEL",year,
  policy_draft_version:annualPolicy(year).draft_rule_version,
  policy_state:annualPolicy(year).policy_state,
  filters:{region_id,facility_id},options,summary,months,
  facility_rows:facilityRows.sort((a,b)=>
   a.facility_id.localeCompare(b.facility_id)),
  source:"M05-0_SYNTHETIC_LEDGER_NOT_PRODUCTION",
  snapshot_consistency_verified:false,
  all_sources_reconciled:false,
  timeliness_verified:false,policy_approved:false,
  scores_enabled:false,ranking_enabled:false,publishing_enabled:false,
  officially_verified:false,
  can_compare_across_years:false,
  may_connect:false,may_query:false,may_write:false,
  may_score:false,may_rank:false,may_award:false,may_publish:false,
  may_notify:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
