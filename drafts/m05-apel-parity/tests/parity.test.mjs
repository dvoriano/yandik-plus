/** M05-10 | QA WRITTEN, ZERO EXECUTED | CODE_ONLY, DEMO ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {caseCatalog,buildAnnualParityPlan,buildFiveYearParityMatrix,
 M05_10_CASE_DEFINITIONS,M05_10_CRITERIA}
 from "../matrix.mjs";
import {M05_10_REFERENCE_KINDS,buildDemoReferenceReview}
 from "../references.mjs";
import {M05_10_ACCEPTANCE_STEPS,buildDemoAcceptanceChecklist}
 from "../acceptance.mjs";
import {SUPPORTED_YEARS,annualPolicy}
 from "../../m05-apel-multiyear/policy.mjs";

const plan=(year=2026)=>buildAnnualParityPlan({year});
const caseKey=(year=2026)=>plan(year).scenarios[0].case_key;
const candidate=(year=2026)=>({
 case_key:caseKey(year),reference_id:"DEMO-REF-1",
 reference_kind:"DEMO_STAGING_FIXTURE",supplied_by:"DEMO-OWNER-1",
 snapshot_id:"DEMO-SNAP-1",claim_state:"DEMO_UNVERIFIED"
});
const review=(year=2026,candidates=[])=>buildDemoReferenceReview({
 plan:plan(year),candidates});
const acceptance=(year=2026,candidates=[])=>buildDemoAcceptanceChecklist({
 review:review(year,candidates)});
const noAuthorityKeys=["may_run_tests","may_connect","may_query",
 "may_write","may_repair","may_score","may_rank","may_award",
 "may_publish","may_merge","may_deploy","official_authorization"];

test("M05-10 case catalog has 23 definitions",()=>{
 assert.equal(M05_10_CASE_DEFINITIONS.length,23);
});
test("M05-10 case keys are unique",()=>{
 const ids=caseCatalog().map(x=>x.case_id);
 assert.equal(new Set(ids).size,ids.length);
});
test("M05-10 criteria catalog has 23 distinct named acceptance concepts",()=>{
 assert.equal(M05_10_CRITERIA.length,23);
 assert.equal(new Set(M05_10_CRITERIA).size,23);
});
test("M05-10 all cases require an M05-8 evidence type",()=>{
 assert.ok(caseCatalog().every(x=>typeof x.evidence_requirement_id==="string"&&
  x.evidence_requirement_id.length>0));
});
test("M05-10 zero and missing are a standalone case",()=>{
 assert.ok(caseCatalog().some(x=>x.case_id==="ZERO_VS_UNREPORTED"));
});
test("M05-10 2026 investigation/location is explicit",()=>{
 assert.ok(caseCatalog().some(x=>x.case_id==="INVESTIGATION_EVENT_LOCATION"&&
  x.scope==="YEAR_2026_ONLY"));
});
test("M05-10 2026 kurban animal unit is explicit",()=>{
 assert.ok(caseCatalog().some(x=>x.case_id==="KURBAN_ANIMAL"&&
  x.scope==="YEAR_2026_ONLY"));
});
test("M05-10 2027-2030 unknown policy is an explicit issue",()=>{
 assert.ok(caseCatalog().some(x=>x.case_id==="FUTURE_YEAR_POLICY"&&
  x.scope==="YEAR_2027_TO_2030"));
});
test("M05-10 2026 plan has historical-only cases",()=>{
 const p=plan(2026);
 assert.equal(p.scenarios.length,22);
 assert.ok(p.scenarios.some(x=>x.case_id==="BASELINE_2026_PARITY"));
 assert.equal(p.scenarios.some(x=>x.case_id==="FUTURE_YEAR_POLICY"),false);
});
test("M05-10 2027 plan does not inherit the historical parity case",()=>{
 const p=plan(2027);
 assert.equal(p.scenarios.length,20);
 assert.equal(p.scenarios.some(x=>x.case_id==="BASELINE_2026_PARITY"),false);
 assert.ok(p.scenarios.some(x=>x.case_id==="FUTURE_YEAR_POLICY"));
});
test("M05-10 each planned year has its own version",()=>{
 const v=SUPPORTED_YEARS.map(y=>plan(y).policy_draft_version);
 assert.equal(new Set(v).size,5);
});
test("M05-10 policy versions match the existing DEMO source registry",()=>{
 assert.ok(SUPPORTED_YEARS.every(y=>plan(y).policy_draft_version===
  annualPolicy(y).draft_rule_version));
});
test("M05-10 five-year matrix covers 2026-2030 independently",()=>{
 const r=buildFiveYearParityMatrix();
 assert.deepEqual(r.years,[2026,2027,2028,2029,2030]);
 assert.equal(r.plans.length,5);
 assert.equal(r.annual_rules_inherited,false);
});
test("M05-10 five-year matrix reports all scenarios as not executed",()=>{
 const r=buildFiveYearParityMatrix();
 assert.equal(r.totals.scenarios,102);
 assert.equal(r.totals.executed,0);
 assert.equal(r.totals.passed,0);
});
test("M05-10 refuses 2031 without borrowing 2030 rules",()=>{
 assert.throws(()=>plan(2031),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-10 refuses invalid year values",()=>{
 assert.throws(()=>plan("2026"),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-10 no annual acceptance verdict is pre-granted",()=>{
 const p=plan();
 assert.ok(p.scenarios.every(s=>s.acceptance_verdict==="NOT_ASSESSED"&&
  s.official_pass===false&&s.official_fail===false));
});
test("M05-10 official expected values are never prefilled",()=>{
 assert.ok(plan().scenarios.every(s=>s.official_expected_value===null&&
  s.official_source_ref===null&&s.expected_ref===null));
});
test("M05-10 planned comparators and tolerances remain undecided",()=>{
 assert.ok(plan().scenarios.every(s=>
  s.comparator==="TO_BE_DEFINED_AFTER_APPROVED_REFERENCE"&&
  s.tolerance==="NOT_DEFINED_BY_VERIFIED_POLICY"));
});
test("M05-10 no annual plan grants permission",()=>{
 const p=plan();
 assert.ok(noAuthorityKeys.every(k=>p[k]===false));
});
test("M05-10 no five-year view grants permission",()=>{
 const p=buildFiveYearParityMatrix();
 assert.ok(noAuthorityKeys.every(k=>p[k]===false));
});
test("M05-10 demo reference metadata kinds are enumerated",()=>{
 assert.equal(M05_10_REFERENCE_KINDS.length,5);
});
test("M05-10 empty reference review is blocked",()=>{
 const r=review();
 assert.equal(r.candidates.length,0);
 assert.equal(r.overall_readiness,"BLOCKED_NOT_TESTED");
});
test("M05-10 one DEMO reference remains unverified",()=>{
 const r=review(2026,[candidate()]);
 assert.equal(r.candidates[0].official_reference_verified,false);
 assert.equal(r.scenarios[0].reference_candidate_count,1);
});
test("M05-10 two kinds may be candidates for the same case",()=>{
 const a=candidate(),b={...candidate(),reference_id:"DEMO-REF-2",
  reference_kind:"DEMO_LEGACY_BASELINE"};
 const r=review(2026,[a,b]);
 assert.equal(r.scenarios[0].reference_candidate_count,2);
});
test("M05-10 duplicate DEMO reference candidate is rejected",()=>{
 assert.throws(()=>review(2026,[candidate(),candidate()]),
  /M05_10_DUPLICATE_REFERENCE_CANDIDATE/);
});
test("M05-10 non-DEMO reference identifier is rejected",()=>{
 const c=candidate();c.reference_id="REAL-DOC";
 assert.throws(()=>review(2026,[c]),/M05_10_REFERENCE_CANDIDATE_INVALID/);
});
test("M05-10 real-looking owner identifier is rejected",()=>{
 const c=candidate();c.supplied_by="official";
 assert.throws(()=>review(2026,[c]),/M05_10_REFERENCE_CANDIDATE_INVALID/);
});
test("M05-10 non-snapshot identifier is rejected",()=>{
 const c=candidate();c.snapshot_id="DEMO-OTHER";
 assert.throws(()=>review(2026,[c]),/M05_10_REFERENCE_CANDIDATE_INVALID/);
});
test("M05-10 reference cannot claim approval",()=>{
 const c=candidate();c.claim_state="APPROVED";
 assert.throws(()=>review(2026,[c]),/M05_10_REFERENCE_CANDIDATE_INVALID/);
});
test("M05-10 reference cannot carry raw source contents",()=>{
 const c=candidate();c.document_content="Official copy";
 assert.throws(()=>review(2026,[c]),/M05_10_REFERENCE_CANDIDATE_INVALID/);
});
test("M05-10 candidate for unplanned year is rejected",()=>{
 const c=candidate(2026);
 assert.throws(()=>review(2027,[c]),/M05_10_REFERENCE_CANDIDATE_INVALID/);
});
test("M05-10 unknown reference type is rejected",()=>{
 const c=candidate();c.reference_kind="PRODUCTION_DB";
 assert.throws(()=>review(2026,[c]),/M05_10_REFERENCE_CANDIDATE_INVALID/);
});
test("M05-10 rejects modified approved annual plan",()=>{
 const p=plan();p.scenarios[0].official_pass=true;
 assert.throws(()=>buildDemoReferenceReview({plan:p}),
  /M05_10_PLAN_TAMPERED/);
});
test("M05-10 rejects modified comparator",()=>{
 const p=plan();p.scenarios[0].comparator="EXACT_OFFICIAL";
 assert.throws(()=>buildDemoReferenceReview({plan:p}),
  /M05_10_PLAN_TAMPERED/);
});
test("M05-10 rejects added unrecognized case row",()=>{
 const p=plan();p.scenarios.push({...p.scenarios[0],case_key:"2026|CUSTOM"});
 assert.throws(()=>buildDemoReferenceReview({plan:p}),
  /M05_10_PLAN_TAMPERED/);
});
test("M05-10 rejects non-array reference input",()=>{
 assert.throws(()=>buildDemoReferenceReview({plan:plan(),candidates:{}}),
  /M05_10_REFERENCES_INVALID/);
});
test("M05-10 one reference cannot trigger acceptance",()=>{
 const a=acceptance(2026,[candidate()]);
 assert.equal(a.state,"BLOCKED_NO_AUTHORIZED_REFERENCE_OR_TEST");
 assert.equal(a.counts.official_passes,0);
});
test("M05-10 acceptance lists nine independent prerequisites",()=>{
 assert.equal(M05_10_ACCEPTANCE_STEPS.length,9);
 assert.equal(acceptance().steps.length,9);
});
test("M05-10 acceptance preserves six blocked M05-8 gates",()=>{
 const a=acceptance();
 assert.equal(a.counts.blocked_gates,6);
 assert.ok(a.gates.every(g=>g.readiness==="BLOCKED"));
});
test("M05-10 candidate references do not open any acceptance gate",()=>{
 const a=acceptance(2026,[candidate()]);
 assert.equal(a.counts.blocked_steps,9);
 assert.ok(a.steps.every(s=>s.official_verified===false&&s.passed===false));
});
test("M05-10 no acceptance packet grants test, write, or publication",()=>{
 const a=acceptance();
 assert.ok(noAuthorityKeys.every(k=>a[k]===false));
});
test("M05-10 cannot claim reviewed source is accepted",()=>{
 const r=review();r.scenarios[0].may_accept=true;
 assert.throws(()=>buildDemoAcceptanceChecklist({review:r}),
  /M05_10_REVIEW_INVALID/);
});
test("M05-10 refuses forged comparison count",()=>{
 const r=review();r.counts.comparisons_executed=1;
 assert.throws(()=>buildDemoAcceptanceChecklist({review:r}),
  /M05_10_REVIEW_INVALID/);
});
test("M05-10 refuses altered DEMO candidate metadata in reviewed report",()=>{
 const r=review(2026,[candidate()]);r.candidates[0].reference_content_loaded=true;
 assert.throws(()=>buildDemoAcceptanceChecklist({review:r}),
  /M05_10_REVIEW_TAMPERED/);
});
test("M05-10 absent review is rejected rather than marked complete",()=>{
 assert.throws(()=>buildDemoAcceptanceChecklist({}),
  /M05_10_REVIEW_INVALID/);
});
test("M05-10 2026 historical rules are not pronounced verified",()=>{
 assert.equal(plan(2026).policy_state,"REFERENCE_NEEDS_SOURCE_CHECK");
 assert.equal(acceptance(2026).legacy_juknis_parity_verified,false);
});
test("M05-10 2028 policy stays decision pending",()=>{
 assert.equal(plan(2028).policy_state,"ANNUAL_DECISION_PENDING");
 assert.equal(acceptance(2028).year_policy_approved,false);
});
test("M05-10 2030 requires independent policy decision",()=>{
 const p=plan(2030);
 assert.ok(p.scenarios.some(s=>s.case_id==="FUTURE_YEAR_POLICY"));
 assert.equal(p.policy_approved,false);
});
test("M05-10 scores, rank, awards, and publication remain disabled",()=>{
 const a=acceptance(2027);
 for(const k of ["may_score","may_rank","may_award","may_publish"])
  assert.equal(a[k],false);
});
