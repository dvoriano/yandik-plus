/** M05-3 | 11 scenarios WRITTEN, NOT EXECUTED (CODE_ONLY). */
import test from "node:test";
import assert from "node:assert/strict";
import {previewAnnualRuleFacts} from "../preview.mjs";
import {demoRule,demoEvidence,FACILITY_ID} from "../fixtures.mjs";
import {emptyDemoLedger} from "../../m05-apel-multiyear/reporting.mjs";
const preview=(year=2026,metrics=undefined)=>{
 const {ledger,checklist}=demoEvidence(year);
 return previewAnnualRuleFacts({rule:demoRule(year,metrics),ledger,checklist});
};
test("M05-3 returns raw DEMO volume and submitted months, no scores",()=>{
 const p=preview();
 assert.equal(p.year,2026);assert.equal(p.facility_id,FACILITY_ID);
 assert.equal(p.rows[0].observed_demo_value,1);
 assert.equal(p.rows[1].observed_demo_value,4);
 assert.ok(p.rows.every(r=>r.score===null&&r.rank===null&&r.award===null));
});
test("M05-3 timeliness lacks trusted server timestamps, remains unavailable",()=>{
 const p=preview(2026,["TIMELINESS"]);
 assert.equal(p.rows[0].observed_demo_value,null);
 assert.equal(p.rows[0].evidence_state,"BLOCKED");
});
test("M05-3 support realization and district aggregation cannot be inferred",()=>{
 const p=preview(2027,["SUPPORT_REALIZATION","DISTRICT_SERVICE"]);
 assert.ok(p.rows.every(r=>r.observed_demo_value===null));
 assert.equal(p.official_scoring,false);
});
test("M05-3 five years can use independent proposals without inheritance",()=>{
 for(const year of [2026,2027,2028,2029,2030]){
  const x=preview(year,["SERVICE_VOLUME"]);
  assert.equal(x.year,year);
  assert.equal(x.sources_reconciled,false);
  assert.equal(x.can_compare_across_years,false);
 }
});
test("M05-3 a submitted month is not a verified compliant month",()=>{
 const p=preview();
 assert.equal(p.submitted_months_workflow_demo,4);
 assert.equal(p.time_verified,false);
 assert.equal(p.may_award,false);
});
test("M05-3 2027 ledger record and workflow month remain unreconciled",()=>{
 const p=preview(2027,["SERVICE_VOLUME","REPORTING_CONSISTENCY"]);
 assert.equal(p.reported_months_ledger_demo,1);
 assert.equal(p.submitted_months_workflow_demo,0);
 assert.equal(p.sources_reconciled,false);
});
test("M05-3 missing annual ledger cannot become zero-volume official evidence",()=>{
 const {checklist}=demoEvidence();
 const p=previewAnnualRuleFacts({rule:demoRule(),
  ledger:emptyDemoLedger(),checklist});
 assert.equal(p.rows[0].observed_demo_value,0);
 assert.equal(p.rows[0].evidence_state,"PARTIAL_YEAR");
 assert.equal(p.rows[0].official_scoring_eligible,false);
});
test("M05-3 cross-year rule/checklist mismatch rejected",()=>{
 const {ledger,checklist}=demoEvidence();
 assert.throws(()=>previewAnnualRuleFacts({rule:demoRule(2027),
  ledger,checklist}),/M05_PREVIEW_CHECKLIST_INVALID/);
});
test("M05-3 fake submitted month count rejected",()=>{
 const {ledger,checklist}=demoEvidence();
 const c=structuredClone(checklist);
 c.summary.ever_submitted_demo=12;
 assert.throws(()=>previewAnnualRuleFacts({rule:demoRule(),ledger,
  checklist:c}),/M05_PREVIEW_CHECKLIST_TAMPERED/);
});
test("M05-3 official/timeliness flags cannot be made true",()=>{
 const {ledger,checklist}=demoEvidence();
 const c={...checklist,official_timeliness_verified:true};
 assert.throws(()=>previewAnnualRuleFacts({rule:demoRule(),ledger,
  checklist:c}),/M05_PREVIEW_CHECKLIST_INVALID/);
});
test("M05-3 no DB evidence and no leak from forged ledger",()=>{
 const {checklist}=demoEvidence();
 const bad=emptyDemoLedger();bad.official_authorization=true;
 assert.throws(()=>previewAnnualRuleFacts({rule:demoRule(),ledger:bad,
  checklist}),/M05_PREVIEW_LEDGER_INVALID/);
});
