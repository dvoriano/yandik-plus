/** M05-2 | 7 QA written, NOT EXECUTED, CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {simulateSubmissionDateComparison} from "../timing.mjs";
import {buildFacilityYearChecklist} from "../checklist.mjs";
import {exampleWorkflow,exampleSchedule,FACILITY_ID} from "../fixtures.mjs";
import {demoAdapters} from "../../m05-apel-workflow/fixtures.mjs";
function sample(){
 const schedule=exampleSchedule(2026);
 const checklist=buildFacilityYearChecklist({state:exampleWorkflow(),
  adapters:demoAdapters(),facility_id:FACILITY_ID,year:2026,schedule});
 return {schedule,checklist};
}
const received=(date="2026-03-09")=>({
 period:"2026-02",request_id:"DEMO-M05-REQ-SEND-FEB",received_date:date
});
test("M05-2 no receipt sample returns unknown, never a late verdict",()=>{
 const {schedule,checklist}=sample();
 const r=simulateSubmissionDateComparison(checklist,schedule);
 assert.equal(r.rows[1].comparison,"TIDAK_DAPAT_DITENTUKAN");
 assert.equal(r.official_timeliness_verified,false);
 assert.equal(r.may_notify,false);
});
test("M05-2 same-day mock receipt is only simulation on or before deadline",()=>{
 const {schedule,checklist}=sample();
 const r=simulateSubmissionDateComparison(checklist,schedule,[received()]);
 assert.equal(r.rows[1].comparison,"SIMULASI_TANGGAL_PADA_ATAU_SEBELUM_TENGGAT");
 assert.equal(r.rows[1].official_timeliness,null);
 assert.equal(r.receipt_source_verified,false);
});
test("M05-2 mock receipt after proposed deadline remains nonofficial",()=>{
 const {schedule,checklist}=sample();
 const r=simulateSubmissionDateComparison(checklist,schedule,[received("2026-03-10")]);
 assert.equal(r.rows[1].comparison,"SIMULASI_TANGGAL_SETELAH_TENGGAT");
 assert.equal(r.official_authorization,false);
});
test("M05-2 cannot assign sample to unsent draft",()=>{
 const {schedule,checklist}=sample();
 assert.throws(()=>simulateSubmissionDateComparison(checklist,schedule,[{
  period:"2026-01",request_id:"DEMO-M05-REQ-CREATE-JAN",
  received_date:"2026-02-09"}]),/M05_TIMING_EVENT_MISMATCH/);
});
test("M05-2 rejects forged request ID or duplicate monthly samples",()=>{
 const {schedule,checklist}=sample();
 assert.throws(()=>simulateSubmissionDateComparison(checklist,schedule,[{
  ...received(),request_id:"DEMO-M05-REQ-WRONG"}]),/M05_TIMING_EVENT_MISMATCH/);
 assert.throws(()=>simulateSubmissionDateComparison(checklist,schedule,[
  received(),received("2026-03-10")]),/M05_TIMING_SAMPLE_INVALID/);
});
test("M05-2 invalid calendar dates and wrong year are rejected",()=>{
 const {schedule,checklist}=sample();
 for(const received_date of ["2026-02-30","2026-13-10","09/03/2026"])
  assert.throws(()=>simulateSubmissionDateComparison(checklist,schedule,
   [received(received_date)]),/M05_TIMING_SAMPLE_INVALID/);
 assert.throws(()=>simulateSubmissionDateComparison(checklist,schedule,[{
  ...received(),period:"2027-02"}]),/M05_TIMING_SAMPLE_INVALID/);
});
test("M05-2 mismatched schedule and privileged checklist are rejected",()=>{
 const {schedule,checklist}=sample();
 assert.throws(()=>simulateSubmissionDateComparison(checklist,
  exampleSchedule(2027),[received()]),/M05_SCHEDULE_INVALID/);
 assert.throws(()=>simulateSubmissionDateComparison({
  ...checklist,official_timeliness_verified:true},schedule,[received()]),
  /M05_TIMING_CHECKLIST_INVALID/);
});
