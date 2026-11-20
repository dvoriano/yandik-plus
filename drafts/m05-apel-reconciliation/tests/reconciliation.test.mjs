/** M05-5 | 20 scenarios WRITTEN, NOT EXECUTED. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildSourceReconciliation,M05_5_SOURCE_KEYS}
 from "../reconciliation.mjs";
import {annualPolicy,SUPPORTED_YEARS}
 from "../../m05-apel-multiyear/policy.mjs";
const digest="a".repeat(64);
const env=(name,records)=>({schema:"M05-5-SOURCE-ENVELOPE-UNTESTED-1",
 synthetic:true,snapshot_id:"DEMO-SNAP-"+name,captured_at:"2026-11-20T00:00:00Z",
 content_digest:digest,records,authority_state:"DEMO_UNVERIFIED",
 digest_verified:false,source_owner_verified:false,read_only:true});
const fac="DEMO-PSW-001",period="2026-01";
const per=(f=fac,p=period)=>({facility_id:f,period:p,
 policy_draft_version:annualPolicy(Number(p.slice(0,4))).draft_rule_version});
const sources=()=>({
 facility_registry:env("REGISTRY",[{facility_id:fac,region_id:"DEMO-REGION-01",active_demo:true}]),
 service_ledger:env("LEDGER",[per()]),
 workflow_submissions:env("WORKFLOW",[per()]),
 annual_policy:env("POLICY",SUPPORTED_YEARS.map(year=>({
  year,policy_draft_version:annualPolicy(year).draft_rule_version,
  policy_state:annualPolicy(year).policy_state})))
});
test("M05-5 accepts four explicitly synthetic source envelopes",()=>{
 const r=buildSourceReconciliation({sources:sources()});
 assert.equal(r.synthetic,true);assert.equal(r.counts.registry_facilities,1);
});
test("M05-5 declares structural match without claiming verification",()=>{
 const r=buildSourceReconciliation({sources:sources()});
 assert.equal(r.structural_match,true);
 assert.equal(r.evidence_state,"DEMO_ONLY_NOT_INDEPENDENTLY_VERIFIED");
 assert.equal(r.source_authority_verified,false);
});
test("M05-5 lists source snapshot metadata and never verifies digest",()=>{
 const r=buildSourceReconciliation({sources:sources()});
 assert.equal(Object.keys(r.source_snapshots).length,4);
 assert.ok(Object.values(r.source_snapshots).every(x=>x.digest_verified===false));
});
test("M05-5 rejects missing source family",()=>{
 const s=sources();delete s.workflow_submissions;
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_SOURCE_SET_INVALID/);
});
test("M05-5 rejects unexpected source family",()=>{
 const s=sources();s.untrusted=env("X",[]);
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_SOURCE_SET_INVALID/);
});
test("M05-5 rejects envelope with authority falsely asserted",()=>{
 const s=sources();s.service_ledger.authority_state="OFFICIAL";
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_SOURCE_ENVELOPE_INVALID/);
});
test("M05-5 rejects digest marked verified without verifier",()=>{
 const s=sources();s.service_ledger.digest_verified=true;
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_SOURCE_ENVELOPE_INVALID/);
});
test("M05-5 rejects mutable or writable source",()=>{
 const s=sources();s.workflow_submissions.read_only=false;
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_SOURCE_ENVELOPE_INVALID/);
});
test("M05-5 rejects malformed snapshot digest",()=>{
 const s=sources();s.annual_policy.content_digest="sha256";
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_SOURCE_ENVELOPE_INVALID/);
});
test("M05-5 rejects duplicate facility registry identity",()=>{
 const s=sources();s.facility_registry.records.push({...s.facility_registry.records[0]});
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_REGISTRY_DUPLICATE/);
});
test("M05-5 rejects duplicate service facility-period",()=>{
 const s=sources();s.service_ledger.records.push(per());
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_SOURCE_DUPLICATE_PERIOD/);
});
test("M05-5 reports service period without workflow submission",()=>{
 const s=sources();s.workflow_submissions.records=[];
 const r=buildSourceReconciliation({sources:s});
 assert.deepEqual(r.discrepancies.service_without_workflow,[fac+"|"+period]);
});
test("M05-5 reports workflow submission without service ledger",()=>{
 const s=sources();s.service_ledger.records=[];
 const r=buildSourceReconciliation({sources:s});
 assert.deepEqual(r.discrepancies.workflow_without_service,[fac+"|"+period]);
});
test("M05-5 reports records whose facility is absent from registry",()=>{
 const s=sources();s.facility_registry.records=[];
 const r=buildSourceReconciliation({sources:s});
 assert.deepEqual(r.discrepancies.records_without_registry_facility,[fac+"|"+period]);
});
test("M05-5 reports missing annual policy evidence",()=>{
 const s=sources();s.annual_policy.records=s.annual_policy.records.filter(x=>x.year!==2030);
 const r=buildSourceReconciliation({sources:s});
 assert.deepEqual(r.discrepancies.missing_policy_years,[2030]);
});
test("M05-5 rejects policy version mismatched to year",()=>{
 const s=sources();s.annual_policy.records[0].policy_draft_version="wrong";
 assert.throws(()=>buildSourceReconciliation({sources:s}),/M05_POLICY_RECORD_INVALID/);
});
test("M05-5 filters records to selected year without deleting source evidence",()=>{
 const s=sources();s.service_ledger.records.push(per(fac,"2027-01"));
 const r=buildSourceReconciliation({sources:s,years:[2026]});
 assert.equal(r.counts.service_periods,1);
 assert.equal(s.service_ledger.records.length,2);
});
test("M05-5 rejects unsupported or duplicate year filters",()=>{
 assert.throws(()=>buildSourceReconciliation({sources:sources(),years:[2031]}),
  /M05_RECONCILIATION_YEARS_INVALID/);
 assert.throws(()=>buildSourceReconciliation({sources:sources(),years:[2026,2026]}),
  /M05_RECONCILIATION_YEARS_INVALID/);
});
test("M05-5 structural match is never permission to repair or publish",()=>{
 const r=buildSourceReconciliation({sources:sources()});
 for(const k of ["may_write","may_repair","may_delete","may_rank",
  "may_award","may_publish","official_authorization"])assert.equal(r[k],false);
});
test("M05-5 reports non-atomic snapshots and non-verified compliance",()=>{
 const r=buildSourceReconciliation({sources:sources()});
 assert.equal(r.snapshot_atomicity_verified,false);
 assert.equal(r.temporal_consistency_verified,false);
 assert.equal(r.official_compliance_verified,false);
});
