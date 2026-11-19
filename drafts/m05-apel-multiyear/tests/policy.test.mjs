/** M05-0 | 8 SCENARIOS WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {SUPPORTED_YEARS,annualPolicy,annualPolicyCatalog,
 proposeAnnualPolicy,requireYear} from "../policy.mjs";
test("M05-0 exactly supports 2026 through 2030",()=>{
 assert.deepEqual(SUPPORTED_YEARS,[2026,2027,2028,2029,2030]);
});
test("M05-0 policy version is distinct for each year",()=>{
 const versions=annualPolicyCatalog().map(x=>x.draft_rule_version);
 assert.equal(new Set(versions).size,5);
});
test("M05-0 historical 2026 requires verification, future years require decisions",()=>{
 assert.equal(annualPolicy(2026).policy_state,"REFERENCE_NEEDS_SOURCE_CHECK");
 for(const y of [2027,2028,2029,2030])
  assert.equal(annualPolicy(y).policy_state,"ANNUAL_DECISION_PENDING");
});
test("M05-0 future-year policy is not inherited from 2026",()=>{
 for(const y of SUPPORTED_YEARS){
  const x=annualPolicy(y);
  assert.equal(x.scoring_rule_version,null);assert.equal(x.approved,false);
  assert.equal(x.deadline_day,null);assert.equal(x.publication_day,null);
 }
});
test("M05-0 rejects unconfigured years instead of applying default rules",()=>{
 for(const y of [2025,2031,undefined,"2030",NaN])
  assert.throws(()=>requireYear(y),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-0 proposal cannot become approved or alter records",()=>{
 const x=proposeAnnualPolicy({year:2029,
  version:"DEMO-APEL-2029-PROPOSAL-A",cutoff_day:9,publication_day:10,
  notes:"Contoh usulan aturan tahunan, belum disetujui."});
 assert.equal(x.year,2029);assert.equal(x.approved,false);
 assert.equal(x.may_score,false);assert.equal(x.may_publish,false);
 assert.equal(x.may_change_historical_records,false);
});
test("M05-0 rejects copied version from other year",()=>{
 assert.throws(()=>proposeAnnualPolicy({year:2028,
  version:"DEMO-APEL-2027-PROPOSAL-A",cutoff_day:9,publication_day:10,
  notes:"Contoh keputusan yang belum ditetapkan."}),/APEL_RULE_VERSION_INVALID/);
});
test("M05-0 rejects invalid dates or notes",()=>{
 const x={year:2030,version:"DEMO-APEL-2030-PROPOSAL-A",cutoff_day:9,
  publication_day:10,notes:"Usulan anonim untuk ditelaah selanjutnya."};
 assert.throws(()=>proposeAnnualPolicy({...x,cutoff_day:0}),/APEL_POLICY_DATE_INVALID/);
 assert.throws(()=>proposeAnnualPolicy({...x,notes:"short"}),/APEL_POLICY_NOTES_INVALID/);
});
