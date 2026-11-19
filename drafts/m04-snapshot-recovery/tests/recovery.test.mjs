/** M04-I6C | 11 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {createRecoveryJournal,appendRecoveryPlan,
 verifyRecoveryJournal,failureResponsePlan,STEPS,FAILURE_KINDS} from "../recovery.mjs";
import {I6C_SNAPSHOT_SCHEMA} from "../snapshot.mjs";
const MAKER="DEMO-USER-MAKER",REVIEWER="DEMO-USER-REVIEWER";
const ready=()=>({schema:I6C_SNAPSHOT_SCHEMA,synthetic:true,
 manifest_sha256:"a".repeat(64),may_write:false,atomic_snapshot_proven:false,
 official_authorization:false,facility_ids:["DEMO-PSW-001"]});
const newJournal=()=>createRecoveryJournal(ready(),"DEMO-I6C-RUN-001",MAKER);
const event=(index,actor=MAKER)=>({
 event_id:"DEMO-I6C-EVENT-"+String(index+1).padStart(3,"0"),
 expected_revision:index,step:STEPS[index],actor_id:actor,
 note:"Rancangan tahap "+STEPS[index]+" belum dilaksanakan."
});
function finished(){
 let j=newJournal();
 for(let i=0;i<STEPS.length;i++)j=appendRecoveryPlan(j,event(i,i===3?REVIEWER:MAKER));
 return j;
}
test("I6C initial journal cannot write, restore or cut over",()=>{
 const j=newJournal();
 assert.equal(j.revision,0);assert.equal(j.status,"rancangan");
 assert.equal(j.may_write,false);assert.equal(j.may_restore,false);
 assert.equal(j.may_cutover,false);assert.equal(verifyRecoveryJournal(j),true);
});
test("I6C five review steps create a deterministic in-memory chain",()=>{
 const j=finished();
 assert.equal(j.revision,5);assert.equal(j.events.length,5);
 assert.equal(j.status,"rancangan_dibekukan_demo");
 assert.equal(j.tip.length,64);assert.equal(verifyRecoveryJournal(j),true);
});
test("I6C rejects fake approvals as input or journal mutation",()=>{
 assert.throws(()=>createRecoveryJournal({...ready(),may_write:true},
  "DEMO-I6C-RUN-001",MAKER),/RECOVERY_READINESS_INVALID/);
 const j=newJournal();j.official_authorization=true;
 assert.throws(()=>verifyRecoveryJournal(j),/JOURNAL_INVALID/);
});
test("I6C forces sequential revision and step",()=>{
 const j=newJournal();
 assert.throws(()=>appendRecoveryPlan(j,{...event(0),expected_revision:1}),
  /JOURNAL_REVISION_CONFLICT/);
 assert.throws(()=>appendRecoveryPlan(j,{...event(1),expected_revision:0}),
  /JOURNAL_STEP_OUT_OF_ORDER/);
});
test("I6C separates demo reviewer from preparer",()=>{
 let j=newJournal();
 for(let i=0;i<3;i++)j=appendRecoveryPlan(j,event(i));
 assert.throws(()=>appendRecoveryPlan(j,event(3,MAKER)),/JOURNAL_REVIEW_SEPARATION/);
 assert.equal(appendRecoveryPlan(j,event(3,REVIEWER)).revision,4);
});
test("I6C detects event text tampering",()=>{
 const j=finished();
 const bad=structuredClone(j);
 bad.events[1].note="Perubahan teks pada rencana lama.";
 assert.throws(()=>verifyRecoveryJournal(bad),/JOURNAL_CHAIN_INVALID/);
});
test("I6C detects changed previous hash, changed tip, or event missing",()=>{
 const j=finished();
 const a=structuredClone(j);a.events[2].previous_hash="f".repeat(64);
 assert.throws(()=>verifyRecoveryJournal(a),/JOURNAL_EVENT_INVALID/);
 const b=structuredClone(j);b.tip="0".repeat(64);
 assert.throws(()=>verifyRecoveryJournal(b),/JOURNAL_STATE_INVALID/);
 const c=structuredClone(j);c.events.pop();
 assert.throws(()=>verifyRecoveryJournal(c),/JOURNAL_INVALID/);
});
test("I6C journal is frozen after design review, not activated",()=>{
 const j=finished();
 assert.throws(()=>appendRecoveryPlan(j,event(4)),/JOURNAL_FROZEN/);
 assert.equal(j.may_restore,false);
});
test("I6C prevents duplicate event IDs and replay from old revision",()=>{
 const first=appendRecoveryPlan(newJournal(),event(0));
 assert.throws(()=>appendRecoveryPlan(first,{...event(1),
  event_id:event(0).event_id}),/JOURNAL_DUPLICATE_EVENT/);
 assert.throws(()=>appendRecoveryPlan(first,{...event(1),expected_revision:0}),
  /JOURNAL_REVISION_CONFLICT/);
});
test("I6C all failure branches require halt and manual review, never rollback execution",()=>{
 const j=finished();
 for(const kind of FAILURE_KINDS){
  const r=failureResponsePlan(j,kind);
  assert.equal(r.action,"HENTIKAN_DAN_TINJAU_MANUAL");
  assert.equal(r.preserve_source,true);
  assert.equal(r.preserve_target,true);
  assert.equal(r.may_restore,false);
  assert.equal(r.may_write,false);
 }
});
test("I6C rejects unknown recovery reason and malformed event/actor",()=>{
 const j=newJournal();
 assert.throws(()=>failureResponsePlan(j,"force_delete"),/FAILURE_KIND_INVALID/);
 assert.throws(()=>appendRecoveryPlan(j,{...event(0),actor_id:"root"}),/ACTOR_INVALID/);
 assert.throws(()=>appendRecoveryPlan(j,{...event(0),note:"too short"}),/JOURNAL_NOTE_INVALID/);
});
