/** M05-0 | KODE DITULIS, BELUM DIUJI. Entirely invented APEL records. */
import {SUPPORTED_YEARS} from "./policy.mjs";
import {emptyDemoLedger,recordDemoReport} from "./reporting.mjs";
export const DEMO_FACILITIES=Object.freeze(["DEMO-PSW-001","DEMO-PSW-002"]);
export function demoInput(facility_id,period,overrides={}){
 const base={facility_id,period,declared_no_activity:false,
  counts:{pengobatan:1,vaksinasi:0,penyuluhan:0,layanan_lain:0},
  investigations:[],kurban_animals:[],evidence_refs:[]};
 return {...base,...overrides};
}
export function multiyearDemoLedger(){
 let ledger=emptyDemoLedger();
 for(const year of SUPPORTED_YEARS){
  const period=year+"-01";
  ledger=recordDemoReport(ledger,demoInput(DEMO_FACILITIES[0],period,{
   counts:{pengobatan:year-2025,vaksinasi:0,penyuluhan:0,layanan_lain:0}
  }));
 }
 ledger=recordDemoReport(ledger,demoInput(
  DEMO_FACILITIES[1],"2026-02",{
   declared_no_activity:true,
   counts:{pengobatan:0,vaksinasi:0,penyuluhan:0,layanan_lain:0}
  }));
 ledger=recordDemoReport(ledger,demoInput(
  DEMO_FACILITIES[1],"2027-06",{
   counts:{pengobatan:0,vaksinasi:0,penyuluhan:0,layanan_lain:0},
   investigations:[{event_id:"DEMO-EVENT-1",location_id:"DEMO-LOC-1"}],
   kurban_animals:[{animal_id:"DEMO-ANIMAL-1",ante:true,post:true}]
  }));
 return ledger;
}
