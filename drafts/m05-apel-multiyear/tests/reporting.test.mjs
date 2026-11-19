/** M05-0 | 13 SCENARIOS WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {emptyDemoLedger,normalizeDemoReport,parsePeriod,
 recordDemoReport,annualChecklist,annualDemoTotals} from "../reporting.mjs";
import {demoInput} from "../fixtures.mjs";
const A="DEMO-PSW-001",B="DEMO-PSW-002";
test("M05-0 accepts exact period months in all five years",()=>{
 for(const y of [2026,2027,2028,2029,2030]){
  assert.equal(parsePeriod(y+"-01").year,y);
  assert.equal(parsePeriod(y+"-12").month,12);
 }
});
test("M05-0 rejects invalid month and unsupported year",()=>{
 for(const p of ["2026-00","2027-13","2031-01","2026-1","random"])
  assert.throws(()=>parsePeriod(p));
});
test("M05-0 one facility may report each year independently",()=>{
 let ledger=emptyDemoLedger();
 ledger=recordDemoReport(ledger,demoInput(A,"2026-01"));
 ledger=recordDemoReport(ledger,demoInput(A,"2027-01"));
 ledger=recordDemoReport(ledger,demoInput(B,"2026-01"));
 assert.equal(ledger.records.length,3);
});
test("M05-0 rejects second report for same facility and month",()=>{
 const initial=recordDemoReport(emptyDemoLedger(),demoInput(A,"2027-01"));
 assert.throws(()=>recordDemoReport(initial,demoInput(A,"2027-01")),
  /APEL_DUPLICATE_FACILITY_MONTH/);
});
test("M05-0 unreported months are missing, never silently zero",()=>{
 const x=annualChecklist(emptyDemoLedger(),A,2028);
 assert.equal(x.missing_months,12);
 assert.equal(x.rows[0].status,"BELUM_DILAPORKAN");
 assert.equal(x.rows[0].total_demo_events,null);
});
test("M05-0 explicit zero-activity submission is distinct from missing",()=>{
 let x=recordDemoReport(emptyDemoLedger(),demoInput(A,"2026-05",{
  declared_no_activity:true,
  counts:{pengobatan:0,vaksinasi:0,penyuluhan:0,layanan_lain:0}
 }));
 const result=annualChecklist(x,A,2026);
 assert.equal(result.rows[4].status,"LAPORAN_NOL");
 assert.equal(result.rows[5].status,"BELUM_DILAPORKAN");
});
test("M05-0 declared zero cannot hide real counts",()=>{
 assert.throws(()=>normalizeDemoReport(demoInput(A,"2026-02",{
  declared_no_activity:true})),/APEL_ZERO_ACTIVITY_CONFLICT/);
});
test("M05-0 investigation is per event and location",()=>{
 const x=normalizeDemoReport(demoInput(A,"2027-03",{
  investigations:[{event_id:"DEMO-EVENT-1",location_id:"DEMO-LOC-1"},
   {event_id:"DEMO-EVENT-1",location_id:"DEMO-LOC-2"}]}));
 assert.equal(x.investigation_count,2);
});
test("M05-0 duplicate incident-location entry is rejected",()=>{
 const e={event_id:"DEMO-EVENT-1",location_id:"DEMO-LOC-1"};
 assert.throws(()=>normalizeDemoReport(demoInput(A,"2026-04",{
  investigations:[e,e]})),/APEL_DUPLICATE_INVESTIGATION_LOCATION_EVENT/);
});
test("M05-0 ante and post on same kurban animal count once",()=>{
 const x=normalizeDemoReport(demoInput(A,"2029-06",{
  kurban_animals:[{animal_id:"DEMO-ANIMAL-1",ante:true,post:true}]}));
 assert.equal(x.kurban_animal_count,1);
});
test("M05-0 duplicate kurban animal ID is rejected",()=>{
 const animal={animal_id:"DEMO-ANIMAL-1",ante:true,post:false};
 assert.throws(()=>normalizeDemoReport(demoInput(A,"2030-06",{
  kurban_animals:[animal,animal]})),/APEL_DUPLICATE_KURBAN_ANIMAL/);
});
test("M05-0 annual totals stay partial when months missing",()=>{
 const ledger=recordDemoReport(emptyDemoLedger(),demoInput(A,"2030-01"));
 const r=annualDemoTotals(ledger,A,2030);
 assert.equal(r.total_demo_events,1);assert.equal(r.reported_months,1);
 assert.equal(r.missing_months,11);assert.equal(r.is_partial,true);
 assert.equal(r.unreported_months_counted_as_zero,false);
 assert.equal(r.official_scoring,false);
});
test("M05-0 invalid counters, shapes and evidence refs are rejected",()=>{
 assert.throws(()=>normalizeDemoReport(demoInput(A,"2026-03",{
  counts:{pengobatan:-1,vaksinasi:0,penyuluhan:0,layanan_lain:0}
 })),/APEL_COUNTS_INVALID/);
 assert.throws(()=>normalizeDemoReport({...demoInput(A,"2026-03"),role:"admin"}),
  /APEL_REPORT_SHAPE_INVALID/);
 assert.throws(()=>normalizeDemoReport(demoInput(A,"2026-03",{
  evidence_refs:["https://somewhere.invalid/photo"]
 })),/APEL_EVIDENCE_INVALID/);
});

test("M05-0 zero activity must be declared explicitly",()=>{
 assert.throws(()=>normalizeDemoReport(demoInput(A,"2028-02",{
  counts:{pengobatan:0,vaksinasi:0,penyuluhan:0,layanan_lain:0}
 })),/APEL_ZERO_MUST_BE_DECLARED/);
});
test("M05-0 tampered in-memory DEMO ledger rows are refused",()=>{
 const l=recordDemoReport(emptyDemoLedger(),demoInput(A,"2029-03"));
 const edited=structuredClone(l);edited.records[0].total_demo_events=999;
 assert.throws(()=>annualChecklist(edited,A,2029),/APEL_LEDGER_RECORD_TAMPERED/);
});
