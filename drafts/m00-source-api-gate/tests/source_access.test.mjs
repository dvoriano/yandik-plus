/** M00-G2 | 23 QA WRITTEN, 0 EXECUTED | CODE_ONLY */
import test from "node:test";
import assert from "node:assert/strict";
import {assertDemoSourceManifest,requireDemoSourceRead,
 draftApiBoundaryContract,M00_G2_SCHEMA}
 from "../source_access.mjs";
import {demoSourceManifest,demoSourceSession}
 from "../fixtures.mjs";
const make=(opts={})=>requireDemoSourceRead({
 ...demoSourceSession(),
 ...opts.adapters
},{
 module:"SURVEILLANCE",region_label:"Wilayah DEMO Utara",
 manifest:demoSourceManifest(),...opts.input
});
test("M00-G2 manifest validates an offline synthetic source",()=>
 assert.equal(assertDemoSourceManifest(demoSourceManifest()).synthetic,true));
test("M00-G2 returns dedicated untested schema",()=>
 assert.equal(make().schema,M00_G2_SCHEMA));
test("M00-G2 source is explicitly not officially approved",()=>
 assert.equal(make().source.source_approved,false));
test("M00-G2 freshness remains unverified",()=>
 assert.equal(make().source.freshness_verified,false));
test("M00-G2 does not claim an authenticated production session",()=>
 assert.equal(make().production_session_verified,false));
test("M00-G2 kab-kota may read same synthetic territory",()=>
 assert.equal(make().scope_contract.read_permitted_demo,true));
test("M00-G2 wrong kab-kota territory denied",()=>
 assert.throws(()=>make({adapters:demoSourceSession({
  role:"kab_kota",region:"Wilayah DEMO Selatan"})}),/ACCESS_DENIED/));
test("M00-G2 Puskeswan cannot read surveillance detail",()=>
 assert.throws(()=>make({adapters:demoSourceSession({role:"puskeswan"})}),/ACCESS_DENIED/));
test("M00-G2 leader cannot read surveillance detail",()=>
 assert.throws(()=>make({adapters:demoSourceSession({role:"pimpinan"})}),/ACCESS_DENIED/));
test("M00-G2 province verifier can read synthetic source",()=>
 assert.equal(make({adapters:demoSourceSession({
  role:"provinsi_verifikator"})}).synthetic,true));
test("M00-G2 missing server resolver is refused",()=>
 assert.throws(()=>make({adapters:{resolveServerSession:undefined}})));
test("M00-G2 non-demo source ID denied",()=>
 assert.throws(()=>assertDemoSourceManifest(demoSourceManifest({
  source_id:"isiKHNAS-REAL-001"})),/SOURCE_UNTRUSTED/));
test("M00-G2 source URL instead of ID denied",()=>
 assert.throws(()=>assertDemoSourceManifest(demoSourceManifest({
  source_id:"https://example.org"})),/SOURCE_UNTRUSTED/));
test("M00-G2 bad snapshot ID denied",()=>
 assert.throws(()=>assertDemoSourceManifest(demoSourceManifest({
  snapshot_id:"REAL-DB-SNAPSHOT"})),/SOURCE_UNTRUSTED/));
test("M00-G2 out-of-range time denied",()=>
 assert.throws(()=>assertDemoSourceManifest(demoSourceManifest({
  capture_month:"2031-01"})),/SOURCE_UNTRUSTED/));
test("M00-G2 revision must be positive",()=>
 assert.throws(()=>assertDemoSourceManifest(demoSourceManifest({
  revision:0})),/SOURCE_UNTRUSTED/));
test("M00-G2 claimed official authorization denied",()=>
 assert.throws(()=>assertDemoSourceManifest({
  ...demoSourceManifest(),official_authorization:true}),/SOURCE_UNTRUSTED/));
test("M00-G2 claimed verified source denied",()=>
 assert.throws(()=>assertDemoSourceManifest({
  ...demoSourceManifest(),source_verified:true}),/SOURCE_UNTRUSTED/));
test("M00-G2 unexpected personal field denied",()=>
 assert.throws(()=>assertDemoSourceManifest({
  ...demoSourceManifest(),contact:"real contact"}),/SOURCE_UNTRUSTED/));
test("M00-G2 mismatched source domain denied",()=>
 assert.throws(()=>make({input:{manifest:demoSourceManifest({
  domain:"MEDICINE_OVERSIGHT_DEMO"})}}),/SOURCE_DOMAIN_MISMATCH/));
test("M00-G2 mismatched source region denied",()=>
 assert.throws(()=>make({input:{manifest:demoSourceManifest({
  region_label:"Wilayah DEMO Selatan"})}}),/SOURCE_SCOPE_MISMATCH/));
test("M00-G2 unsupported module cannot claim access",()=>
 assert.throws(()=>make({input:{module:"UNREGISTERED"}})));
test("M00-G2 denies issuance and write",()=>{
 const x=make();
 for(const key of ["may_write","may_submit","may_approve",
  "may_notify","may_publish","may_deploy"])
  assert.equal(x[key],false);
});
test("M00-G2 API is not implemented by document alone",()=>
 assert.equal(draftApiBoundaryContract().transport_endpoints_implemented,false));
