/** M05-3 | 8 scenarios WRITTEN, NOT EXECUTED (CODE_ONLY). */
import test from "node:test";
import assert from "node:assert/strict";
import {prepareAnnualRuleReview,REVIEW_GATES}
 from "../review.mjs";
import {previewAnnualRuleFacts} from "../preview.mjs";
import {demoRule,demoEvidence} from "../fixtures.mjs";
const inputs=(year=2026)=>{
 const rule=demoRule(year),e=demoEvidence(year);
 const preview=previewAnnualRuleFacts({rule,...e});
 return {rule,preview};
};
const note=(suffix="A")=>({
 note_id:"DEMO-M05-REVIEW-"+suffix,gate_id:"formula_weight_tiebreak",
 owner_role:"pengampu_apel",status:"BUTUH_BUKTI",
 text:"Belum tersedia bukti pembahasan metode penilaian tahunan."
});
test("M05-3 review gates stay pending and empty evidence",()=>{
 const r=prepareAnnualRuleReview(inputs());
 assert.equal(r.pending_gates.length,12);
 assert.equal(r.pending_gates.length,REVIEW_GATES.length);
 assert.ok(r.pending_gates.every(g=>
  g.status==="BELUM_DIBUKTIKAN"&&g.evidence_ref===null));
});
test("M05-3 review notes are not formal approvals",()=>{
 const r=prepareAnnualRuleReview({...inputs(),notes:[note()]});
 assert.equal(r.notes.length,1);
 assert.equal(r.notes[0].nonofficial,true);
 assert.equal(r.official_approvals_recorded,0);
 for(const k of ["may_accept_scores","may_rank","may_award",
  "may_publish","official_authorization"])assert.equal(r[k],false);
});
test("M05-3 forged completed gates and scoring preview rejected",()=>{
 const a=inputs();
 assert.throws(()=>prepareAnnualRuleReview({...a,
  preview:{...a.preview,official_scoring:true}}),/M05_REVIEW_PREVIEW_INVALID/);
});
test("M05-3 mismatched rule year or proposal ID refused",()=>{
 const a=inputs();
 assert.throws(()=>prepareAnnualRuleReview({...a,
  rule:demoRule(2027)}),/M05_REVIEW_PREVIEW_INVALID/);
});
test("M05-3 notes cannot name unknown gate or privileged role",()=>{
 const a=inputs();
 assert.throws(()=>prepareAnnualRuleReview({...a,
  notes:[{...note(),gate_id:"secret_approval"}]}),/M05_REVIEW_NOTE_INVALID/);
 assert.throws(()=>prepareAnnualRuleReview({...a,
  notes:[{...note(),owner_role:"root"}]}),/M05_REVIEW_NOTE_INVALID/);
});
test("M05-3 duplicate note IDs rejected",()=>{
 assert.throws(()=>prepareAnnualRuleReview({...inputs(),
  notes:[note(),note()]}),/M05_REVIEW_NOTE_INVALID/);
});
test("M05-3 free-text credentials or links rejected",()=>{
 const a=inputs();
 assert.throws(()=>prepareAnnualRuleReview({...a,notes:[
  {...note(),text:"Ada laporan di https://example.invalid/private yang sensitif"}]}),
  /M05_REVIEW_NOTE_INVALID/);
 assert.throws(()=>prepareAnnualRuleReview({...a,notes:[
  {...note(),text:"token: abcdefghi tidak boleh ditulis di repo publik"}]}),
  /M05_REVIEW_NOTE_INVALID/);
});
test("M05-3 2030 remains a review-only year, not eligible for award",()=>{
 const r=prepareAnnualRuleReview(inputs(2030));
 assert.equal(r.year,2030);
 assert.equal(r.rule_version_locked,false);
 assert.equal(r.may_award,false);
});
