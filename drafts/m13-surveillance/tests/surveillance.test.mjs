/** M13-S1 | 28 QA WRITTEN, ZERO EXECUTED | CODE_ONLY */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoSurveillanceRegister,buildDemoEventReview,M13_S1_SCHEMA}
 from "../surveillance.mjs";
import {demoSurveillanceFixtures,demoSurveillanceAdapters}
 from "../fixtures.mjs";
const args=()=>({...demoSurveillanceFixtures(),
  ...demoSurveillanceAdapters(),region_label:"Wilayah DEMO Utara"});
const view=(overrides={})=>buildDemoSurveillanceRegister({...args(),...overrides});
test("M13-S1 uses distinct untested schema",()=>
 assert.equal(view().schema,M13_S1_SCHEMA));
test("M13-S1 returns only synthetic data",()=>
 assert.equal(view().synthetic,true));
test("M13-S1 three events have explicitly nonofficial status",()=>
 assert.equal(view().events_recorded_demo,3));
test("M13-S1 zero officially confirmed cases is not claimed",()=>
 assert.equal(view().official_case_count,null));
test("M13-S1 no official outbreak count is inferred",()=>
 assert.equal(view().official_outbreak_count,null));
test("M13-S1 lab result notes are not confirmation",()=>
 assert.equal(view().verified_lab_result_count,null));
test("M13-S1 source not connected to iSIKHNAS",()=>
 assert.equal(view().isikhnas_connected,false));
test("M13-S1 source not reconciled with APEL",()=>
 assert.equal(view().apel_ledger_reconciled,false));
test("M13-S1 no private coordinates returned",()=>
 assert.equal(view().exact_location_available,false));
test("M13-S1 identity/phone absent",()=>
 assert.equal(JSON.stringify(view()).includes("phone"),false));
test("M13-S1 domain supports only DEMO syndromes",()=>{
 const x=args();x.events[0].syndrome_tag="OFFICIAL_RABIES_POSITIVE";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 official case reference cannot be injected",()=>{
 const x=args();x.events[0].official_case_reference="REAL-CASE-ID";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 lab reference cannot be injected",()=>{
 const x=args();x.events[0].official_lab_reference="REAL-LAB-ID";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 wrong source ID rejected",()=>{
 const x=args();x.events[0].source_id="DEMO-SOURCE-OTHER";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 wrong snapshot ID rejected",()=>{
 const x=args();x.events[0].snapshot_id="DEMO-SNAPSHOT-OTHER";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 external new event field is forbidden",()=>{
 const x=args();x.events[0].owner_name="Sample personal name";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 duplicate event ID rejected",()=>{
 const x=args();x.events.push({...x.events[0]});
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 future event after source capture rejected",()=>{
 const x=args();x.events[0].period="2026-12";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 2031 year rejected",()=>{
 const x=args();x.events[0].period="2031-01";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 cross-territory event rejected",()=>{
 const x=args();x.events[0].region_label="Wilayah DEMO Selatan";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/EVENT_INVALID/);
});
test("M13-S1 cross-territory viewer denied",()=>assert.throws(()=>
 view({resolveServerSession:demoSurveillanceAdapters({
   region:"Wilayah DEMO Selatan"}).resolveServerSession}),/ACCESS_DENIED/));
test("M13-S1 Puskeswan cannot read detailed surveillance",()=>assert.throws(()=>
 view({resolveServerSession:demoSurveillanceAdapters({
   role:"puskeswan"}).resolveServerSession}),/ACCESS_DENIED/));
test("M13-S1 leader cannot read details",()=>assert.throws(()=>
 view({resolveServerSession:demoSurveillanceAdapters({
   role:"pimpinan"}).resolveServerSession}),/ACCESS_DENIED/));
test("M13-S1 source cannot claim verified",()=>{
 const x=args();x.manifest.source_verified=true;
 assert.throws(()=>buildDemoSurveillanceRegister(x),/SOURCE_UNTRUSTED/);
});
test("M13-S1 sample without investigation is rejected",()=>{
 const x=args();x.events[0].sample_state="SAMPLE_LOGGED_UNVERIFIED_DEMO";
 assert.throws(()=>buildDemoSurveillanceRegister(x),/UNSUPPORTED_EVENT_SEQUENCE/);
});
test("M13-S1 missing event cannot be read by direct lookup",()=>assert.throws(()=>
 buildDemoEventReview({...args(),event_id:"DEMO-EVENT-UNKNOWN"}),/ACCESS_DENIED/));
test("M13-S1 event review is never an official notification",()=>{
 const x=buildDemoEventReview({...args(),event_id:"DEMO-EVENT-GAMMA"});
 assert.equal(x.official_notification_sent,false);
 assert.equal(x.disease_confirmed,false);
 assert.equal(x.lab_confirmed,false);
});
test("M13-S1 cannot write or alert or publish",()=>{
 const x=view();
 for(const key of ["may_write","may_connect","may_notify",
  "may_approve","may_confirm_disease","may_dispatch_response",
  "may_publish","may_deploy"])
  assert.equal(x[key],false);
});
