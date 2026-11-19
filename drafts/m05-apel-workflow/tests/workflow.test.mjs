/** M05-1 | 19 QA scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {emptyDemoWorkflow,applyDemoCommand,readDemoWorkflow}
 from "../workflow.mjs";
import {FACILITIES,USERS,demoAdapters,demoReport,partialDraft,
 command,startedDemo} from "../fixtures.mjs";
const A=FACILITIES[0].id,B=FACILITIES[1].id,C=FACILITIES[2].id;
function act(state,actor,action,rev,payload={},suffix="NEXT",id=A,period="2026-01"){
 return applyDemoCommand(state,demoAdapters(actor),
  command(action,rev,payload,id,period,suffix));
}
test("M05-1 draft may be partial; no scoring, publication or approval",()=>{
 const r=act(emptyDemoWorkflow(),USERS.PET,"create_draft",null,
  {report:partialDraft()}, "D1");
 assert.equal(r.result.status,"DRAFT");
 assert.equal(r.state.records[0].draft.counts.pengobatan,null);
 assert.equal(r.result.may_score,false);
 assert.equal(r.result.may_publish,false);
});
test("M05-1 incomplete draft cannot be submitted",()=>{
 const s=act(emptyDemoWorkflow(),USERS.PET,"create_draft",null,
  {report:partialDraft()},"D1").state;
 assert.throws(()=>act(s,USERS.PET,"submit",1,{},"D2"),/APEL_COUNTS_INVALID/);
 assert.equal(s.records[0].revision,1);
});
test("M05-1 create -> save -> submit records three sequential events",()=>{
 let s=act(emptyDemoWorkflow(),USERS.PET,"create_draft",null,
  {report:partialDraft()},"D1").state;
 s=act(s,USERS.PET,"save_draft",1,{report:demoReport()},"D2").state;
 const r=act(s,USERS.PET,"submit",2,{},"D3");
 assert.equal(r.result.status,"SUBMITTED_REVIEW_PENDING");
 assert.equal(r.result.revision,3);
 assert.deepEqual(r.state.events.map(x=>x.revision),[1,2,3]);
 assert.equal(r.state.records[0].draft,null);
});
test("M05-1 one facility and period cannot be created twice",()=>{
 const s=startedDemo();
 assert.throws(()=>act(s,USERS.PET,"create_draft",null,
  {report:demoReport()},"AGAIN"),/APEL_DUPLICATE_FACILITY_MONTH/);
});
test("M05-1 stale optimistic revision cannot save or submit",()=>{
 const s=startedDemo();
 assert.throws(()=>act(s,USERS.PET,"save_draft",9,
  {report:demoReport()},"STALE"),/APEL_REVISION_CONFLICT/);
});
test("M05-1 request IDs never replay into duplicate audit entries",()=>{
 const s=startedDemo();
 assert.throws(()=>act(s,USERS.PET,"save_draft",1,
  {report:demoReport()},"START"),/APEL_REQUEST_ID_ALREADY_USED/);
 assert.equal(s.events.length,1);
});
test("M05-1 same month in next year is a distinct record",()=>{
 const s=startedDemo();
 const r=act(s,USERS.PET,"create_draft",null,
  {report:demoReport(A,"2027-01")},"YEAR2",A,"2027-01");
 assert.equal(r.state.records.length,2);
 assert.deepEqual(r.state.records.map(x=>x.year),[2026,2027]);
});
test("M05-1 same-period different facility is separate, with scoped actor",()=>{
 const s=startedDemo();
 const r=act(s,USERS.PET_B,"create_draft",null,
  {report:demoReport(B)},"B1",B);
 assert.equal(r.state.records.length,2);
});
test("M05-1 Puskeswan cannot edit another unit even same region",()=>{
 assert.throws(()=>act(startedDemo(),USERS.PET,"create_draft",null,
  {report:demoReport(C)},"C1",C),/ACCESS_DENIED/);
});
test("M05-1 Puskeswan cannot edit out-of-region facility",()=>{
 assert.throws(()=>act(startedDemo(),USERS.PET,"create_draft",null,
  {report:demoReport(B)},"B1",B),/ACCESS_DENIED/);
});
test("M05-1 kab/kota and verifier cannot forge submitter role",()=>{
 for(const user of [USERS.KAB,USERS.VER,USERS.LEAD]){
  assert.throws(()=>act(startedDemo(),user,"submit",1,{},"ROLE"),/ACCESS_DENIED/);
 }
});
test("M05-1 reviewer cannot alter submitted report or submitter snapshot",()=>{
 let s=startedDemo();
 s=act(s,USERS.PET,"submit",1,{},"SEND").state;
 const before=JSON.stringify(s.records[0].report);
 s=act(s,USERS.KAB,"return_correction",2,
  {reason:"Mohon periksa kembali bukti DEMO dan angka."},"RETURN").state;
 assert.equal(s.records[0].status,"CORRECTION_REQUESTED");
 assert.equal(JSON.stringify(s.records[0].report),before);
 assert.equal(s.records[0].draft.counts.pengobatan,2);
});
test("M05-1 correction needs a different reviewer and a scoped role",()=>{
 let s=startedDemo();
 s=act(s,USERS.PET,"submit",1,{},"SEND").state;
 assert.throws(()=>act(s,USERS.PET,"return_correction",2,
  {reason:"Mohon perbaiki narasi contoh."},"SELF"),/ACCESS_DENIED/);
 const denied={...USERS.KAB,region:FACILITIES[1].region};
 assert.throws(()=>act(s,denied,"return_correction",2,
  {reason:"Mohon perbaiki narasi contoh."},"OTHER"),/ACCESS_DENIED/);
});
test("M05-1 review reason cannot contain apparent secrets or URLs",()=>{
 let s=startedDemo();s=act(s,USERS.PET,"submit",1,{},"SEND").state;
 assert.throws(()=>act(s,USERS.VER,"return_correction",2,
  {reason:"Review available at https://example.com/private"},"LINK"),
  /APEL_CORRECTION_REASON_INVALID/);
});
test("M05-1 revision keeps previous submitted snapshot in events",()=>{
 let s=startedDemo();
 s=act(s,USERS.PET,"submit",1,{},"SEND").state;
 s=act(s,USERS.VER,"return_correction",2,
  {reason:"Catatan DEMO butuh koreksi angka pengobatan."},"RETURN").state;
 s=act(s,USERS.PET,"revise_draft",3,{
  report:demoReport(A,"2026-01",{counts:{
   pengobatan:7,vaksinasi:0,penyuluhan:0,layanan_lain:0}})},"REV").state;
 s=act(s,USERS.PET,"resubmit",4,{},"SEND2").state;
 assert.equal(s.records[0].revision,5);
 assert.equal(s.records[0].report.total_demo_events,7);
 assert.equal(s.events[1].draft_or_submitted_snapshot.total_demo_events,2);
 assert.equal(s.events[4].draft_or_submitted_snapshot.total_demo_events,7);
});
test("M05-1 cannot revise without correction request",()=>{
 assert.throws(()=>act(startedDemo(),USERS.PET,"revise_draft",1,
  {report:demoReport()},"REV"),/APEL_STATE_TRANSITION_DENIED/);
});
test("M05-1 no unsupported approval or publish transition exists",()=>{
 assert.throws(()=>act(startedDemo(),USERS.ADMIN,"approve",1,{},"APPROVE"),
  /APEL_COMMAND_INVALID/);
});
test("M05-1 backend resolver is necessary, client actor_id field not accepted",()=>{
 const s=startedDemo(),c={...command("submit",1,{}),actor_id:USERS.ADMIN.id};
 assert.throws(()=>applyDemoCommand(s,demoAdapters(USERS.PET),c),/APEL_COMMAND_INVALID/);
 assert.throws(()=>applyDemoCommand(s,{},command("submit",1,{})),
  /TRUSTED_BACKEND_ADAPTERS_REQUIRED/);
});
test("M05-1 read is scoped, returns copies, never permits publication",()=>{
 const s=startedDemo();
 const r=readDemoWorkflow(s,demoAdapters(USERS.PET),A,"2026-01");
 assert.equal(r.record.revision,1);assert.equal(r.may_publish,false);
 r.record.draft.counts.pengobatan=999;
 assert.equal(s.records[0].draft.counts.pengobatan,2);
 assert.throws(()=>readDemoWorkflow(s,demoAdapters(USERS.PET),B,"2026-01"),
  /ACCESS_DENIED/);
});
