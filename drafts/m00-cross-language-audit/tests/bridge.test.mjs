/** M00-G8 | QA WRITTEN, NOT EXECUTED. */
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {canonicalDemoBridgeRecord,normalizeLegacyDemoAudit,
 compareDemoAuditPorts,G8_SCHEMA,G8_DOMAIN} from "../bridge.mjs";
const fixture=()=>JSON.parse(readFileSync(
 new URL("../demo_vectors.json",import.meta.url),"utf8"));
const norm=(source_kind,events)=>normalizeLegacyDemoAudit({source_kind,events});
test("M00-G8 schema and synthetic fixture",()=>{
 const x=fixture();assert.equal(x.synthetic,true);
 assert.equal(norm("G5_LEGACY_DEMO",x.g5_events).schema,G8_SCHEMA);
});
test("M00-G8 JS canonical payload uses fixed JSON array",()=>{
 const x=fixture().g5_events[0],s=canonicalDemoBridgeRecord({
  link_id:x.link_id,revision:1,reviewer_id:x.reviewer_id,
  action_code:x.action_code,reason_code:x.reason_code,
  basis_digest:x.basis_digest,previous_bridge_digest:x.previous_digest});
 assert.equal(JSON.parse(s)[0],G8_DOMAIN);
 assert.equal(JSON.parse(s)[2],1);
});
test("M00-G8 same semantic event from distinct legacy shapes",()=>{
 assert.equal(compareDemoAuditPorts(fixture()).format_only_parity_demo,true);
});
test("M00-G8 bridge is not source integrity",()=>{
 const c=compareDemoAuditPorts(fixture());
 assert.equal(c.source_integrity_proven,false);
 assert.equal(c.migration_safe,false);
});
test("M00-G8 source hashes are not claimed authenticated",()=>{
 const r=norm("G5_LEGACY_DEMO",fixture().g5_events);
 assert.equal(r.original_source_digests_validated,false);
});
test("M00-G8 hash changes if action differs",()=>{
 const x=fixture();x.g7_rows[0].action_code="DISTINCT_RECORDS_DEMO";
 assert.equal(compareDemoAuditPorts(x).format_only_parity_demo,false);
});
test("M00-G8 denies client metadata",()=>{
 const x=fixture();x.g5_events[0].role="provinsi_admin";
 assert.throws(()=>compareDemoAuditPorts(x),/FORMAT_DENIED/);
});
test("M00-G8 denies fake real facility names",()=>{
 const x=fixture();x.g5_events[0].link_id="REAL-CASE";
 assert.throws(()=>compareDemoAuditPorts(x),/FORMAT_DENIED/);
});
test("M00-G8 denies official authorization",()=>{
 const x=fixture();x.g5_events[0].official_authorization=true;
 assert.throws(()=>compareDemoAuditPorts(x),/FORMAT_DENIED/);
});
test("M00-G8 denies official flag on G7",()=>{
 const x=fixture();x.g7_rows[0].is_official=1;
 assert.throws(()=>compareDemoAuditPorts(x),/FORMAT_DENIED/);
});
test("M00-G8 denies bad source hash shape",()=>{
 const x=fixture();x.g7_rows[0].event_digest="invalid";
 assert.throws(()=>compareDemoAuditPorts(x),/FORMAT_DENIED/);
});
test("M00-G8 denies zero events",()=>
 assert.throws(()=>norm("G5_LEGACY_DEMO",[]),/FORMAT_DENIED/));
test("M00-G8 denies unsupported source kind",()=>
 assert.throws(()=>norm("REAL_SOURCE",fixture().g5_events),/FORMAT_DENIED/));
test("M00-G8 denies missing event ID in G7",()=>{
 const x=fixture();delete x.g7_rows[0].event_id;
 assert.throws(()=>compareDemoAuditPorts(x),/FORMAT_DENIED/);
});
test("M00-G8 rejects multiple links in global G5 stream",()=>{
 const x=fixture(),a=x.g5_events[0];
 x.g5_events.push({...a,audit_id:"DEMO-AUDIT-2",
  review_id:"DEMO-REVIEW-2",sequence:2,link_id:"DEMO-CROSSWALK-OTHER"});
 assert.throws(()=>norm("G5_LEGACY_DEMO",x.g5_events),/FORMAT_DENIED/);
});
test("M00-G8 rejects revision gaps",()=>{
 const x=fixture(),a=x.g7_rows[0];
 x.g7_rows.push({...a,event_id:"DEMO-AUDIT-TWO",revision:3});
 assert.throws(()=>norm("G7_LEGACY_DEMO",x.g7_rows),/FORMAT_DENIED/);
});
test("M00-G8 keeps reviewer out of public bridge rows",()=>{
 const x=fixture(),r=norm("G7_LEGACY_DEMO",x.g7_rows);
 assert.equal(JSON.stringify(r.records).includes("DEMO-USER"),false);
});
test("M00-G8 is strictly read-only",()=>{
 const r=norm("G5_LEGACY_DEMO",fixture().g5_events);
 assert.equal(r.may_write,false);assert.equal(r.may_sync,false);
});
