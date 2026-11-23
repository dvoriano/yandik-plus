/**
 * M05-14 | KODE DITULIS, BELUM DIUJI | SYNTHETIC FIXTURES ONLY.
 * All facility, region, location, source and event IDs are fictional DEMO.
 */
import {emptyDemoLedger,recordDemoReport}
 from "../m05-apel-multiyear/reporting.mjs";

export const DEMO_FACILITIES=Object.freeze([
 {facility_id:"DEMO-PSW-ALPHA",facility_label:"Puskeswan DEMO Alpha",
  region_id:"DEMO-REGION-UTARA",region_label:"Wilayah DEMO Utara"},
 {facility_id:"DEMO-PSW-BETA",facility_label:"Puskeswan DEMO Beta",
  region_id:"DEMO-REGION-UTARA",region_label:"Wilayah DEMO Utara"},
 {facility_id:"DEMO-PSW-GAMMA",facility_label:"Puskeswan DEMO Gamma",
  region_id:"DEMO-REGION-SELATAN",region_label:"Wilayah DEMO Selatan"}
]);
const RECORDS=Object.freeze([
 // [year,month,facility suffix,observed dummy services] 0 means explicit submitted zero.
 [2026,1,"ALPHA",27],[2026,2,"ALPHA",35],[2026,3,"ALPHA",0],
 [2026,4,"ALPHA",39],[2026,5,"ALPHA",44],[2026,6,"ALPHA",31],
 [2026,7,"ALPHA",42],[2026,8,"ALPHA",47],
 [2026,1,"BETA",15],[2026,2,"BETA",0],[2026,4,"BETA",18],
 [2026,5,"BETA",24],[2026,8,"BETA",21],
 [2026,2,"GAMMA",11],[2026,3,"GAMMA",19],[2026,6,"GAMMA",0],
 [2027,1,"ALPHA",22],[2027,2,"ALPHA",0],
 [2027,1,"BETA",17],
 [2027,1,"GAMMA",8],[2027,2,"GAMMA",13],[2027,3,"GAMMA",0]
]);
// A handful of records include synthetic event/location and animal evidence
// to demonstrate the M05-0 counting rule without implying Juknis parity.
export function buildDemoDashboardFixture(){
 let ledger=emptyDemoLedger();
 for(const [year,month,suffix,quantity] of RECORDS){
  const period=year+"-"+String(month).padStart(2,"0");
  const specialInvestigation=year===2026&&month===6&&suffix==="ALPHA";
  const specialKurban=year===2026&&month===8&&suffix==="ALPHA";
  const investigations=specialInvestigation?[{
   event_id:"DEMO-EVENT-ONE",location_id:"DEMO-LOCATION-ONE"}]:[];
  const kurban_animals=specialKurban?[{
   animal_id:"DEMO-ANIMAL-ONE",ante:true,post:true}]:[];
  const counts={pengobatan:quantity,vaksinasi:0,penyuluhan:0,layanan_lain:0};
  ledger=recordDemoReport(ledger,{
   facility_id:"DEMO-PSW-"+suffix,period,
   declared_no_activity:quantity===0&&!investigations.length&&!kurban_animals.length,
   counts,investigations,kurban_animals,evidence_refs:[]
  });
 }
 return {ledger,facilities:DEMO_FACILITIES.map(f=>({...f})),
  metadata:{synthetic:true,source:"DEMO_GENERATED_IN_CODE",
   record_count:RECORDS.length,no_real_facility_data:true,
   not_official_reporting:true,policy_verified:false}};
}
