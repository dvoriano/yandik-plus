/** M00-G3 | QA DITULIS, BELUM DIJALANKAN | NO EXECUTION */
import test from "node:test";
import assert from "node:assert/strict";
import {readDemoSurveillanceApi,demoReadApiContract,M00_G3_SCHEMA}
 from "../gateway.mjs";
import {demoReadApiFixture} from "../fixtures.mjs";
import {demoSurveillanceAdapters}
 from "../../m13-surveillance/fixtures.mjs";
const make=(extra={})=>{
 const x=demoReadApiFixture();
 return readDemoSurveillanceApi({...x,...extra});
};
test("M00-G3 code defines its own draft schema",()=>
 assert.equal(make().schema,M00_G3_SCHEMA));
test("M00-G3 is not an HTTP implementation",()=>
 assert.equal(demoReadApiContract().no_http_endpoint,true));
test("M00-G3 lists only three DEMO event projections",()=>
 assert.equal(make().record_count_demo,3));
test("M00-G3 no event location ID leaks through the API projection",()=>
 assert.equal(JSON.stringify(make()).includes("DEMO-LOCATION"),false));
test("M00-G3 source IDs not exported in projection",()=>
 assert.equal(JSON.stringify(make()).includes("DEMO-SOURCE"),false));
test("M00-G3 actor IDs are not returned",()=>
 assert.equal(JSON.stringify(make()).includes("DEMO-USER"),false));
test("M00-G3 list rejects event selector",()=>{
 const x=demoReadApiFixture();x.request.event_id="DEMO-EVENT-ALPHA";
 assert.throws(()=>readDemoSurveillanceApi(x),/REQUEST_DENIED/);
});
test("M00-G3 rejects role spoofing in request",()=>{
 const x=demoReadApiFixture();x.request.role="provinsi_admin";
 assert.throws(()=>readDemoSurveillanceApi(x),/REQUEST_DENIED/);
});
test("M00-G3 rejects region supplied in request",()=>{
 const x=demoReadApiFixture();x.request.region_label="Wilayah DEMO Selatan";
 assert.throws(()=>readDemoSurveillanceApi(x),/REQUEST_DENIED/);
});
test("M00-G3 rejects source URL in request",()=>{
 const x=demoReadApiFixture();x.request.source="https://test.invalid";
 assert.throws(()=>readDemoSurveillanceApi(x),/REQUEST_DENIED/);
});
test("M00-G3 prohibits POST requests",()=>{
 const x=demoReadApiFixture();x.request.method="POST";
 assert.throws(()=>readDemoSurveillanceApi(x),/REQUEST_DENIED/);
});
test("M00-G3 prohibits unknown operations",()=>{
 const x=demoReadApiFixture();x.request.operation="ISSUE_OFFICIAL";
 assert.throws(()=>readDemoSurveillanceApi(x),/REQUEST_DENIED/);
});
test("M00-G3 supports single-event review",()=>{
 const x=demoReadApiFixture();x.request={method:"GET",
  operation:"REVIEW_EVENT",event_id:"DEMO-EVENT-BETA"};
 const y=readDemoSurveillanceApi(x);
 assert.equal(y.record_count_demo,1);
 assert.equal(y.records[0].event_id,"DEMO-EVENT-BETA");
});
test("M00-G3 fails closed for nonexisting event",()=>{
 const x=demoReadApiFixture();x.request={method:"GET",
  operation:"REVIEW_EVENT",event_id:"DEMO-EVENT-NOT-FOUND"};
 assert.throws(()=>readDemoSurveillanceApi(x),/ACCESS_DENIED/);
});
test("M00-G3 rejects missing host",()=>
 assert.throws(()=>make({host:null}),/TRUSTED_HOST_REQUIRED/));
test("M00-G3 rejects attacker-supplied host role field",()=>{
 const x=demoReadApiFixture();x.host.role="provinsi_admin";
 assert.throws(()=>readDemoSurveillanceApi(x),/TRUSTED_HOST_REQUIRED/);
});
test("M00-G3 restricts cross-region DEMO user",()=>{
 const x=demoReadApiFixture();
 x.host.resolveServerSession=demoSurveillanceAdapters({
  region:"Wilayah DEMO Selatan"}).resolveServerSession;
 assert.throws(()=>readDemoSurveillanceApi(x),/ACCESS_DENIED/);
});
test("M00-G3 cannot bypass underlying manifest validation",()=>{
 const x=demoReadApiFixture();x.host.manifest.source_verified=true;
 assert.throws(()=>readDemoSurveillanceApi(x),/SOURCE_UNTRUSTED/);
});
test("M00-G3 never grants official actions",()=>{
 const y=make();
 for(const k of ["may_write","may_import","may_export",
  "may_notify","may_approve","may_publish","may_deploy"])
  assert.equal(y[k],false);
});
