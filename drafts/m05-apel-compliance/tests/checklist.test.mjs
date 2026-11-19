/** M05-2 | 12 QA written, NOT EXECUTED, CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildFacilityYearChecklist,buildFiveYearChecklist}
 from "../checklist.mjs";
import {exampleWorkflow,exampleSchedule,FACILITY_ID} from "../fixtures.mjs";
import {demoAdapters,USERS,FACILITIES}
 from "../../m05-apel-workflow/fixtures.mjs";
function get(year=2026,actor=USERS.PET,withSchedule=true){
 return buildFacilityYearChecklist({state:exampleWorkflow(),
  adapters:demoAdapters(actor),facility_id:FACILITY_ID,year,
  schedule:withSchedule?exampleSchedule(year):null});
}
test("M05-2 all twelve months represented with distinct workflow statuses",()=>{
 const r=get();
 assert.equal(r.months.length,12);
 assert.deepEqual(r.months.slice(0,6).map(x=>x.status),[
  "DRAF_BELUM_DIKIRIM","TERKIRIM_MENUNGGU_TELAAH",
  "DIKEMBALIKAN_UNTUK_PERBAIKAN","DRAF_REVISI_BELUM_DIKIRIM",
  "TERKIRIM_MENUNGGU_TELAAH","BELUM_DILAPORKAN"]);
});
test("M05-2 summary distinguishes missing draft pending review and correction",()=>{
 const s=get().summary;
 assert.equal(s.missing,7);assert.equal(s.draft_unsent,1);
 assert.equal(s.submitted_pending_review,2);
 assert.equal(s.correction_requested,1);
 assert.equal(s.revision_draft_unsent,1);
});
test("M05-2 originally submitted report remains marked ever submitted while corrected",()=>{
 const r=get();
 assert.equal(r.summary.ever_submitted_demo,4);
 assert.equal(r.months[2].has_demo_submission,true);
 assert.equal(r.months[3].has_demo_submission,true);
 assert.equal(r.months[0].has_demo_submission,false);
});
test("M05-2 explicit zero submission does not represent missing month",()=>{
 const r=get();
 assert.equal(r.summary.explicit_zero_submissions_demo,1);
 assert.equal(r.months[4].reported_zero,true);
 assert.equal(r.months[5].reported_zero,null);
});
test("M05-2 deadline dates are proposals, never official timeliness",()=>{
 const r=get();
 assert.equal(r.months[0].proposed_deadline_date,"2026-02-09");
 assert.equal(r.months[1].timeliness,"TIDAK_DAPAT_DITENTUKAN");
 assert.equal(r.months[1].official_compliance,null);
 assert.equal(r.official_timeliness_verified,false);
 assert.equal(r.official_completeness_verified,false);
});
test("M05-2 no schedule means no inferred deadline",()=>{
 const r=get(2026,USERS.PET,false);
 assert.equal(r.schedule_proposal_id,null);
 assert.ok(r.months.every(x=>x.proposed_deadline_date===null));
});
test("M05-2 foreign-year deadline rejected",()=>{
 assert.throws(()=>buildFacilityYearChecklist({
  state:exampleWorkflow(),adapters:demoAdapters(),facility_id:FACILITY_ID,
  year:2026,schedule:exampleSchedule(2027)}),/M05_SCHEDULE_INVALID/);
});
test("M05-2 facility scoping prevents reading other Puskeswan",()=>{
 assert.throws(()=>buildFacilityYearChecklist({
  state:exampleWorkflow(),adapters:demoAdapters(USERS.PET),
  facility_id:FACILITIES[1].id,year:2026}),/ACCESS_DENIED/);
});
test("M05-2 leading read is not a route for leadership personal detail",()=>{
 assert.throws(()=>get(2026,USERS.LEAD),/ACCESS_DENIED/);
});
test("M05-2 2027 and 2030 are not populated with 2026 statuses",()=>{
 const y2027=get(2027),y2030=get(2030);
 assert.equal(y2027.summary.draft_unsent,1);
 assert.equal(y2027.summary.submitted_pending_review,0);
 assert.equal(y2030.summary.submitted_pending_review,1);
 assert.equal(y2030.months[11].proposed_deadline_date,"2031-01-09");
});
test("M05-2 five-year overview has five isolated annual schedules",()=>{
 const r=buildFiveYearChecklist({state:exampleWorkflow(),
  adapters:demoAdapters(),facility_id:FACILITY_ID,
  schedules:[exampleSchedule(2026),exampleSchedule(2030)]});
 assert.deepEqual(r.years.map(x=>x.year),[2026,2027,2028,2029,2030]);
 assert.equal(r.years[1].schedule_proposal_id,null);
 assert.equal(r.years[4].schedule_proposal_id,"DEMO-M05-SCHEDULE-2030-A");
 assert.equal(r.official_scoring,false);
});
test("M05-2 duplicate schedule year is rejected",()=>{
 assert.throws(()=>buildFiveYearChecklist({
  state:exampleWorkflow(),adapters:demoAdapters(),facility_id:FACILITY_ID,
  schedules:[exampleSchedule(2026),exampleSchedule(2026)]}),
  /M05_CHECKLIST_SCHEDULES_INVALID/);
});
