/**
 * M05-3 | KODE DITULIS, BELUM DIUJI.
 * Synthetic independent M05-0 ledger and M05-2 workflow examples;
 * they are intentionally NOT reconciled/authoritatively joined.
 */
import {proposeYearRules} from "./rulebook.mjs";
import {emptyDemoLedger,recordDemoReport}
 from "../m05-apel-multiyear/reporting.mjs";
import {demoInput} from "../m05-apel-multiyear/fixtures.mjs";
import {buildFacilityYearChecklist}
 from "../m05-apel-compliance/checklist.mjs";
import {exampleWorkflow,FACILITY_ID}
 from "../m05-apel-compliance/fixtures.mjs";
import {demoAdapters} from "../m05-apel-workflow/fixtures.mjs";
export {FACILITY_ID};
export function demoRule(year=2026,metrics=["SERVICE_VOLUME","REPORTING_CONSISTENCY"]){
 return proposeYearRules({
  year,proposal_id:"DEMO-M05-RULE-"+year+"-A",
  categories:metrics.map((metric_key,i)=>({
   category_id:"DEMO-CAT-"+String(i+1).padStart(2,"0"),
   metric_key,label:"Dimensi simulasi "+metric_key
  })),
  notes:"Usulan hanya untuk peninjauan internal dengan sumber DEMO fiktif."
 });
}
export function demoEvidence(year=2026){
 let ledger=emptyDemoLedger();
 ledger=recordDemoReport(ledger,demoInput(FACILITY_ID,year+"-01"));
 const checklist=buildFacilityYearChecklist({
  state:exampleWorkflow(),adapters:demoAdapters(),
  facility_id:FACILITY_ID,year
 });
 return {ledger,checklist};
}
