/** M05-3 | 10 scenarios WRITTEN, NOT EXECUTED (CODE_ONLY). */
import test from "node:test";
import assert from "node:assert/strict";
import {annualRuleCatalog,proposeYearRules,requireYearRules}
 from "../rulebook.mjs";
import {demoRule} from "../fixtures.mjs";
test("M05-3 catalog contains exactly 2026 through 2030",()=>{
 assert.deepEqual(annualRuleCatalog().map(x=>x.year),
  [2026,2027,2028,2029,2030]);
});
test("M05-3 2026 category references require legacy parity",()=>{
 const x=annualRuleCatalog()[0];
 assert.equal(x.basis,"PROJECT_HISTORY_NEEDS_JUKNIS_PARITY");
 assert.equal(x.concepts.length,3);
 assert.equal(x.approved,false);
});
test("M05-3 2027 service/support/district categories are only proposals",()=>{
 const x=annualRuleCatalog()[1];
 assert.deepEqual(x.concepts.map(y=>y.metric_key),
  ["SERVICE_VOLUME","SUPPORT_REALIZATION","DISTRICT_SERVICE"]);
 assert.ok(x.concepts.every(y=>y.official_verified===false));
});
test("M05-3 2028-2030 categories remain undefined, not copied",()=>{
 for(const x of annualRuleCatalog().slice(2)){
  assert.equal(x.basis,"UNDEFINED_PER_YEAR");
  assert.equal(x.concepts.length,0);
  assert.equal(x.scoring_formula,null);
 }
});
test("M05-3 every year uses distinct draft policy version",()=>{
 const x=annualRuleCatalog();
 assert.equal(new Set(x.map(r=>r.policy_draft_version)).size,5);
});
test("M05-3 year 2031 is rejected instead of inheriting rules",()=>{
 assert.throws(()=>demoRule(2031),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-3 a proposal never becomes official scoring",()=>{
 const p=demoRule();
 for(const key of ["approved","scoring_enabled","may_rank",
  "may_award","may_publish","official_authorization"])
  assert.equal(p[key],false);
 assert.ok(p.categories.every(c=>c.formula===null&&c.weight===null));
});
test("M05-3 duplicate metrics or forged IDs rejected",()=>{
 assert.throws(()=>demoRule(2026,["SERVICE_VOLUME","SERVICE_VOLUME"]),
  /M05_RULE_CATEGORY_INVALID/);
 assert.throws(()=>proposeYearRules({
  year:2026,proposal_id:"INVALID",categories:[{
   category_id:"DEMO-CAT-1",metric_key:"SERVICE_VOLUME",label:"Layanan DEMO"
  }],notes:"Proposal untuk pelaporan tahun 2026 saja."}),/M05_RULE_ID_INVALID/);
});
test("M05-3 revised category/version or claimed approval is refused",()=>{
 const rule=structuredClone(demoRule(2029));
 assert.equal(requireYearRules(rule,2029),true);
 rule.approved=true;
 assert.throws(()=>requireYearRules(rule,2029),/M05_RULE_NOT_UNAPPROVED_PROPOSAL/);
 const other=demoRule(2028);
 assert.throws(()=>requireYearRules(other,2029),/M05_RULE_NOT_UNAPPROVED_PROPOSAL/);
});
test("M05-3 public proposal must not contain URLs or credential assignments",()=>{
 const rule=demoRule(2027),categories=rule.categories.map(c=>({
  category_id:c.category_id,metric_key:c.metric_key,label:c.label
 }));
 assert.throws(()=>proposeYearRules({
  year:2027,proposal_id:rule.proposal_id,categories,
  notes:"Refer to https://example.invalid/private for credentials"
 }),/M05_RULE_NOTES_INVALID/);
});
