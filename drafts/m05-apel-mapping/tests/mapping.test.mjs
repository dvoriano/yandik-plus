/** M05-6 | 20 QA scenarios WRITTEN, NOT EXECUTED. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildMappingReadiness,buildCandidateMappingReview,
 M05_6_REQUIRED_FIELDS,M05_6_DOMAINS}
 from "../mapping.mjs";
import {SUPPORTED_YEARS} from "../../m05-apel-multiyear/policy.mjs";
const candidate=(field_key="facility.canonical_id")=>({
 field_key,source_system:"DEMO-APP",table_name:"DEMO-FACILITIES",
 column_name:"DEMO-FACILITY-ID",observed_type:"DEMO-TEXT",
 evidence_ref:"DEMO-DICT-001"
});
test("M05-6 template covers 2026-2030",()=>{
 assert.deepEqual(buildMappingReadiness().years,SUPPORTED_YEARS);
});
test("M05-6 template defines eight separate domains",()=>{
 assert.equal(M05_6_DOMAINS.length,8);
});
test("M05-6 catalog contains unique canonical field keys",()=>{
 const keys=M05_6_REQUIRED_FIELDS.map(x=>x.field_key);
 assert.equal(new Set(keys).size,keys.length);
});
test("M05-6 all actual schema fields start unresolved",()=>{
 const r=buildMappingReadiness();
 assert.ok(r.fields.every(f=>f.actual_table===null&&f.actual_column===null&&
  f.verified===false&&f.mapping_state==="NOT_MAPPED"));
});
test("M05-6 no source schema or authorization is claimed",()=>{
 const r=buildMappingReadiness();
 assert.equal(r.actual_schema_provided,false);
 assert.equal(r.source_owner_verified,false);
 assert.equal(r.official_authorization,false);
});
test("M05-6 reports no mapped or verified fields",()=>{
 const r=buildMappingReadiness();
 assert.equal(r.summary.mapped,0);assert.equal(r.summary.verified,0);
});
test("M05-6 rejects unsupported year",()=>{
 assert.throws(()=>buildMappingReadiness({years:[2031]}),/M05_MAPPING_YEARS_INVALID/);
});
test("M05-6 rejects duplicate years",()=>{
 assert.throws(()=>buildMappingReadiness({years:[2026,2026]}),/M05_MAPPING_YEARS_INVALID/);
});
test("M05-6 accepts a clearly synthetic candidate as unverified",()=>{
 const r=buildCandidateMappingReview({candidates:[candidate()]});
 assert.equal(r.summary.candidate_count,1);
 assert.equal(r.fields.find(f=>f.field_key==="facility.canonical_id")
  .candidate.verified,false);
});
test("M05-6 rejects non-DEMO source names",()=>{
 const c=candidate();c.source_system="production";
 assert.throws(()=>buildCandidateMappingReview({candidates:[c]}),
  /M05_MAPPING_CANDIDATE_INVALID/);
});
test("M05-6 rejects non-DEMO table names",()=>{
 const c=candidate();c.table_name="facilities";
 assert.throws(()=>buildCandidateMappingReview({candidates:[c]}),
  /M05_MAPPING_CANDIDATE_INVALID/);
});
test("M05-6 rejects unknown canonical field",()=>{
 const c=candidate("unknown.field");
 assert.throws(()=>buildCandidateMappingReview({candidates:[c]}),
  /M05_MAPPING_CANDIDATE_INVALID/);
});
test("M05-6 rejects duplicate candidate for same canonical field",()=>{
 assert.throws(()=>buildCandidateMappingReview({candidates:[candidate(),candidate()]}),
  /M05_MAPPING_DUPLICATE_FIELD/);
});
test("M05-6 rejects candidate without evidence reference",()=>{
 const c=candidate();c.evidence_ref="";
 assert.throws(()=>buildCandidateMappingReview({candidates:[c]}),
  /M05_MAPPING_CANDIDATE_INVALID/);
});
test("M05-6 rejects candidate count beyond field catalog",()=>{
 assert.throws(()=>buildCandidateMappingReview({
  candidates:Array(M05_6_REQUIRED_FIELDS.length+1).fill(candidate())}),
  /M05_MAPPING_CANDIDATES_INVALID/);
});
test("M05-6 keeps facility identity separate from region history",()=>{
 assert.notEqual(M05_6_REQUIRED_FIELDS.find(x=>x.field_key==="facility.canonical_id").domain,
  M05_6_REQUIRED_FIELDS.find(x=>x.field_key==="facility.region_id").domain);
});
test("M05-6 includes workflow revision and submission timestamp semantics",()=>{
 const keys=M05_6_REQUIRED_FIELDS.map(x=>x.field_key);
 assert.ok(keys.includes("workflow.revision_id"));
 assert.ok(keys.includes("workflow.submitted_at"));
});
test("M05-6 includes service unit and event grain semantics",()=>{
 const keys=M05_6_REQUIRED_FIELDS.map(x=>x.field_key);
 assert.ok(keys.includes("service.unit"));assert.ok(keys.includes("service.event_id"));
});
test("M05-6 candidate review cannot enable connection or writes",()=>{
 const r=buildCandidateMappingReview({candidates:[candidate()]});
 for(const k of ["may_connect","may_query","may_write","may_repair",
  "may_score","may_publish","official_authorization"])assert.equal(r[k],false);
});
test("M05-6 policy years remain independently unapproved",()=>{
 const r=buildMappingReadiness();
 assert.ok(r.policy_versions.every(p=>p.official_approval_verified===false));
});
