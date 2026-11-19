/** M04-I6D | 7 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {mapLegacyCompatibility} from "../legacy-surfaces.mjs";
import {buildFlaskIntegrationGatePlan} from "../contracts.mjs";
import {prepareReviewHandoff,I6D_HANDOFF_SCHEMA} from "../handoff.mjs";
const plan=()=>buildFlaskIntegrationGatePlan(mapLegacyCompatibility());
const note=(n=1)=>({issue_id:"DEMO-I6D-ISSUE-"+n,
 gate_id:"apel_2026_parity",owner_role:"pengampu_apel",
 recorded_by:"DEMO-USER-PROGRAM",status:"PERLU_BUKTI",
 note:"Belum terdapat bukti uji kesesuaian perhitungan APEL."});
test("I6D empty handoff keeps every gate unresolved",()=>{
 const r=prepareReviewHandoff(plan());
 assert.equal(r.schema,I6D_HANDOFF_SCHEMA);
 assert.equal(r.outstanding_gate_count,24);
 assert.equal(r.owner_decisions_verified,0);
 assert.equal(r.can_close_gates,false);
});
test("I6D demo notes do not approve or change Flask",()=>{
 const r=prepareReviewHandoff(plan(),[note()]);
 assert.equal(r.issue_count,1);
 assert.equal(r.notes[0].review_only,true);
 assert.equal(r.may_integrate,false);assert.equal(r.may_deploy,false);
 assert.equal(r.may_modify_flask,false);
});
test("I6D rejects invented gate and owner roles",()=>{
 assert.throws(()=>prepareReviewHandoff(plan(),[{...note(),gate_id:"unknown"}]),
  /HANDOFF_NOTE_REJECTED/);
 assert.throws(()=>prepareReviewHandoff(plan(),[{...note(),owner_role:"random"}]),
  /HANDOFF_NOTE_REJECTED/);
});
test("I6D refuses duplicate IDs and malformed issue identifiers",()=>{
 assert.throws(()=>prepareReviewHandoff(plan(),[note(),note()]),
  /HANDOFF_NOTE_REJECTED/);
 assert.throws(()=>prepareReviewHandoff(plan(),[{...note(),issue_id:"real-case"}]),
  /HANDOFF_NOTE_REJECTED/);
});
test("I6D refuses unsafe free text that resembles credentials or URLs",()=>{
 assert.throws(()=>prepareReviewHandoff(plan(),[{...note(),
  note:"Perlu diperiksa pada https://example.com/private"}]),
  /HANDOFF_POTENTIAL_SENSITIVE_TEXT/);
 assert.throws(()=>prepareReviewHandoff(plan(),[{...note(),
  note:"Password: abcdef hanya contoh tapi tidak boleh ditulis"}]),
  /HANDOFF_POTENTIAL_SENSITIVE_TEXT/);
});
test("I6D refuses approval status and extra approval fields",()=>{
 assert.throws(()=>prepareReviewHandoff(plan(),[{...note(),status:"APPROVED"}]),
  /HANDOFF_NOTE_REJECTED/);
 assert.throws(()=>prepareReviewHandoff(plan(),[{...note(),may_deploy:true}]),
  /HANDOFF_NOTE_SHAPE_INVALID/);
});
test("I6D rejects a privileged plan to prevent backdoor approvals",()=>{
 const p=plan();p.may_deploy=true;
 assert.throws(()=>prepareReviewHandoff(p),/HANDOFF_PLAN_INVALID/);
});
