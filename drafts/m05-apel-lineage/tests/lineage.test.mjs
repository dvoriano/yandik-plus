/** M05-7 | 38 QA scenarios WRITTEN, ZERO EXECUTED | CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {annualPolicy} from "../../m05-apel-multiyear/policy.mjs";
import {SOURCE_GROUPS,RELATIONS,buildLineageContract,
 inspectDemoLineage,classifyQuantity} from "../lineage.mjs";
const fac="DEMO-PSW-01";
function sample(){
 const version=annualPolicy(2026).draft_rule_version;
 return {facilities:[{facility_id:fac}],
  regions:[{mapping_id:"DEMO-RMAP-1",facility_id:fac,region_id:"DEMO-KAB-1",
   valid_from:"2026-01-01",valid_to:null}],
  services:[{record_id:"DEMO-SVC-1",facility_id:fac,period:"2026-10",
   revision_id:"DEMO-REV-1",policy_version:version,activity_type:"DEMO-VAX",
   event_id:"DEMO-EVT-1",location_id:"DEMO-LOC-1",
   quantity_state:"OBSERVED",quantity:0,unit:"DEMO-HEWAN",
   declared_no_activity:true}],
  workflows:[{record_id:"DEMO-WF-1",facility_id:fac,period:"2026-10",
   revision_id:"DEMO-REV-1",status:"DEMO_SUBMITTED",
   request_id:"DEMO-REQ-1",submitted_at:"2026-11-05T10:00:00+07:00"}],
  policies:[{policy_id:"DEMO-POL-1",year:2026,version,
   effective_from:"2026-01-01",effective_to:null,
   approval_state:"DEMO_UNVERIFIED"}],
  support_plans:[{plan_id:"DEMO-PLAN-1",facility_id:fac,period:"2026-10",
   unit:"DEMO-PAKET",quantity_state:"UNKNOWN",planned_quantity:null}],
  support_realizations:[{realization_id:"DEMO-REAL-1",plan_id:"DEMO-PLAN-1",
   unit:"DEMO-PAKET",quantity_state:"OBSERVED",realized_quantity:0,
   evidence_ref:"DEMO-EVID-1"}]};
}
const review=s=>inspectDemoLineage({sources:s});
const codes=s=>review(s).issues.map(x=>x.code);
test("M05-7 contract covers exactly 2026-2030",()=>{
 assert.deepEqual(buildLineageContract().years,[2026,2027,2028,2029,2030]);
});
test("M05-7 defines seven source groups",()=>assert.equal(SOURCE_GROUPS.length,7));
test("M05-7 lineage relations are explicit",()=>assert.equal(RELATIONS.length,7));
test("M05-7 canonical fields refer to M05-6 dictionary",()=>{
 assert.ok(buildLineageContract().business_fields.every(f=>f.catalogued));
});
test("M05-7 contractual connection/write/reporting are blocked",()=>{
 const r=buildLineageContract();
 for(const k of ["may_connect","may_query","may_write","may_repair",
  "may_score","may_publish","official_authorization"])assert.equal(r[k],false);
});
test("M05-7 complete DEMO has candidate references but no verification",()=>{
 const r=review(sample()),c=r.candidate_chains[0];
 assert.equal(c.candidate_refs.workflow_record,"DEMO-WF-1");
 assert.equal(c.candidate_refs.region_mapping,"DEMO-RMAP-1");
 assert.equal(c.candidate_refs.policy_record,"DEMO-POL-1");
 assert.equal(c.verified,false);assert.equal(c.usable_for_reporting,false);
 assert.equal(r.counts.issues,0);
});
test("M05-7 observed zero is distinguished",()=>{
 assert.equal(classifyQuantity({state:"OBSERVED",quantity:0}),"OBSERVED_ZERO");
});
test("M05-7 unobserved is not silently converted to zero",()=>{
 assert.equal(classifyQuantity({state:"UNKNOWN",quantity:null}),"UNKNOWN");
 assert.equal(classifyQuantity({state:"NOT_REPORTED",quantity:null}),"NOT_REPORTED");
 assert.equal(classifyQuantity({state:"NOT_APPLICABLE",quantity:null}),"NOT_APPLICABLE");
});
test("M05-7 observed positive quantity is separately classified",()=>{
 assert.equal(classifyQuantity({state:"OBSERVED",quantity:4}),"OBSERVED_NONZERO");
});
test("M05-7 all DEMO provenance and authorizations remain unverified",()=>{
 const r=review(sample());
 for(const k of ["mapping_verified","source_owner_verified",
  "snapshot_consistency_verified","temporal_semantics_verified",
  "official_authorization"])assert.equal(r[k],false);
});
test("M05-7 refuses extra/unrecognized source group",()=>{
 const s=sample();s.unapproved_source=[];
 assert.throws(()=>review(s),/M05_7_SOURCE_SET_INVALID/);
});
test("M05-7 refuses missing required source column",()=>{
 const s=sample();delete s.services[0].revision_id;
 assert.throws(()=>review(s),/M05_7_ROW_SHAPE/);
});
test("M05-7 refuses non-DEMO facility identity",()=>{
 const s=sample();s.facilities[0].facility_id="PSW-01";
 assert.throws(()=>review(s),/M05_7_NON_DEMO_ID/);
});
test("M05-7 refuses unsupported 2031 service month",()=>{
 const s=sample();s.services[0].period="2031-01";
 assert.throws(()=>review(s),/M05_7_SERVICE_INVALID/);
});
test("M05-7 rejects invalid quantity state value pair",()=>{
 const s=sample();s.services[0].quantity_state="UNKNOWN";
 assert.throws(()=>review(s),/M05_7_SERVICE_INVALID/);
});
test("M05-7 rejects impossible calendar date",()=>{
 const s=sample();s.regions[0].valid_from="2026-02-30";
 assert.throws(()=>review(s),/M05_7_REGION_INVALID/);
});
test("M05-7 rejects reversed region validity",()=>{
 const s=sample();s.regions[0].valid_to="2026-01-01";
 assert.throws(()=>review(s),/M05_7_REGION_INVALID/);
});
test("M05-7 revision mismatch blocks workflow selection",()=>{
 const s=sample();s.workflows[0].revision_id="DEMO-REV-2";
 const c=review(s).candidate_chains[0];
 assert.equal(c.candidate_refs.workflow_record,null);
 assert.ok(codes(s).includes("WORKFLOW_REVISION_MISMATCH"));
});
test("M05-7 missing workflow is reported",()=>{
 const s=sample();s.workflows=[];
 assert.ok(codes(s).includes("WORKFLOW_MISSING"));
});
test("M05-7 multiple same-revision workflow candidates are flagged",()=>{
 const s=sample();s.workflows.push({...s.workflows[0],
  record_id:"DEMO-WF-2",request_id:"DEMO-REQ-2"});
 assert.ok(codes(s).includes("WORKFLOW_CARDINALITY"));
});
test("M05-7 region split within report month is ambiguous",()=>{
 const s=sample();s.regions[0].valid_to="2026-10-16";
 s.regions.push({...s.regions[0],mapping_id:"DEMO-RMAP-2",
  valid_from:"2026-10-16",valid_to:null,region_id:"DEMO-KAB-2"});
 assert.ok(codes(s).includes("REGION_SPLIT_OR_OVERLAP"));
 assert.equal(review(s).candidate_chains[0].candidate_refs.region_mapping,null);
});
test("M05-7 single partial-month region is not attributed",()=>{
 const s=sample();s.regions[0].valid_from="2026-10-10";
 assert.ok(codes(s).includes("REGION_PARTIAL_MONTH"));
});
test("M05-7 missing valid region is not replaced by current region",()=>{
 const s=sample();s.regions[0].valid_from="2026-11-01";
 assert.ok(codes(s).includes("REGION_NOT_COVERED"));
});
test("M05-7 policy version mismatch is not repaired",()=>{
 const s=sample();s.services[0].policy_version="DEMO-APEL-2026-DIFFERENT";
 assert.ok(codes(s).includes("POLICY_MISSING_OR_VERSION"));
});
test("M05-7 incomplete policy period is rejected for month lineage",()=>{
 const s=sample();s.policies[0].effective_to="2026-10-20";
 assert.ok(codes(s).includes("POLICY_PARTIAL_MONTH"));
});
test("M05-7 duplicate policy candidates need human review",()=>{
 const s=sample();s.policies.push({...s.policies[0],policy_id:"DEMO-POL-2"});
 assert.ok(codes(s).includes("POLICY_CARDINALITY"));
});
test("M05-7 orphan facility cannot be joined by name",()=>{
 const s=sample();s.services[0].facility_id="DEMO-PSW-UNKNOWN";
 assert.ok(codes(s).includes("MISSING_FACILITY"));
 assert.equal(review(s).candidate_chains[0].candidate_refs.facility,null);
});
test("M05-7 duplicate facility keys remain ambiguous",()=>{
 const s=sample();s.facilities.push({...s.facilities[0]});
 assert.ok(codes(s).includes("AMBIGUOUS_FACILITY"));
 assert.ok(codes(s).includes("DUPLICATE_SOURCE_ID"));
});
test("M05-7 repeated event/location grain is flagged, not deduplicated",()=>{
 const s=sample();s.services.push({...s.services[0],record_id:"DEMO-SVC-2"});
 assert.ok(codes(s).includes("DUPLICATE_EVENT_GRAIN"));
 assert.equal(review(s).counts.services,2);
});
test("M05-7 declared no activity cannot silently imply unknown is zero",()=>{
 const s=sample();s.services[0].quantity_state="UNKNOWN";
 s.services[0].quantity=null;
 assert.ok(codes(s).includes("NO_ACTIVITY_NOT_EXPLICIT_ZERO"));
});
test("M05-7 missing support plan is reported without assigning quantity",()=>{
 const s=sample();s.support_plans=[];
 assert.ok(codes(s).includes("SUPPORT_PLAN_MISSING"));
 assert.equal(review(s).support_realization_candidates[0].plan_ref,null);
});
test("M05-7 realization unit conflict is reported",()=>{
 const s=sample();s.support_realizations[0].unit="DEMO-HEWAN";
 assert.ok(codes(s).includes("SUPPORT_UNIT_CONFLICT"));
});
test("M05-7 missing support evidence is reported",()=>{
 const s=sample();s.support_realizations[0].evidence_ref=null;
 assert.ok(codes(s).includes("SUPPORT_EVIDENCE_MISSING"));
});
test("M05-7 multiple realizations are preserved as separate evidence rows",()=>{
 const s=sample();s.support_realizations.push({...s.support_realizations[0],
  realization_id:"DEMO-REAL-2",evidence_ref:"DEMO-EVID-2"});
 assert.equal(review(s).support_realization_candidates.length,2);
 assert.equal(codes(s).includes("SUPPORT_PLAN_CARDINALITY"),false);
});
test("M05-7 duplicate source ID must not be silently overwritten",()=>{
 const s=sample();s.workflows.push({...s.workflows[0]});
 assert.ok(codes(s).includes("DUPLICATE_SOURCE_ID"));
});
test("M05-7 Dec 2030 validity may reach Jan 2031 boundary",()=>{
 const s=sample(),p=annualPolicy(2030).draft_rule_version;
 s.services[0].period="2030-12";s.services[0].policy_version=p;
 s.workflows[0].period="2030-12";
 s.regions[0].valid_from="2030-01-01";
 s.policies=[{policy_id:"DEMO-POL-2030",year:2030,version:p,
  effective_from:"2030-01-01",effective_to:null,approval_state:"DEMO_UNVERIFIED"}];
 assert.equal(review(s).candidate_chains[0].candidate_refs.policy_record,"DEMO-POL-2030");
});
test("M05-7 no automatic repair, score or publish even with conflicts",()=>{
 const s=sample();s.workflows=[];
 const r=review(s);
 for(const k of ["may_connect","may_query","may_write","may_repair",
  "may_score","may_publish","official_authorization"])assert.equal(r[k],false);
 assert.ok(r.issues.every(x=>x.auto_resolved===false));
});

test("M05-7 distinct service events in one revision are legitimate candidates",()=>{
 const s=sample();s.services.push({...s.services[0],record_id:"DEMO-SVC-2",
  event_id:"DEMO-EVT-2",declared_no_activity:false,quantity:2});
 const r=review(s);
 assert.equal(r.candidate_chains.length,2);
 assert.equal(r.issues.length,0);
});
