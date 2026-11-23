/** M14-S1 | QA WRITTEN, ZERO EXECUTED, CODE_ONLY */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoCertificateRegister,buildDemoCertificateReview,M14_S1_SCHEMA}
 from "../register.mjs";
import {demoCertificateFixtures,certificateDemoSession} from "../fixtures.mjs";
const setup=(region_label="Wilayah DEMO Utara",role="kab_kota")=>({
 ...demoCertificateFixtures(),
 ...certificateDemoSession(role,region_label),region_label
});
const view=(options={})=>buildDemoCertificateRegister({...setup(),...options});
test("M14-S1 declares an untested DEMO schema",()=>assert.equal(view().schema,M14_S1_SCHEMA));
test("M14-S1 never represents official issuance",()=>assert.equal(view().certificate_issued_count,null));
test("M14-S1 has two northern internal requests",()=>assert.equal(view().request_count_demo,2));
test("M14-S1 filters three requests by origin",()=>assert.equal(
 buildDemoCertificateRegister(setup("Wilayah DEMO Selatan")).rows.length,1));
test("M14-S1 destination cannot expand territory",()=>assert.throws(
 ()=>view({region_label:"Wilayah DEMO Selatan"}),/ACCESS_DENIED/));
test("M14-S1 admin can read DEMO register",()=>assert.equal(
 buildDemoCertificateRegister(setup("Wilayah DEMO Utara","provinsi_admin")).rows.length,2));
test("M14-S1 role puskeswan denied",()=>assert.throws(
 ()=>buildDemoCertificateRegister(setup("Wilayah DEMO Utara","puskeswan")),/ACCESS_DENIED/));
test("M14-S1 leadership denied details",()=>assert.throws(
 ()=>buildDemoCertificateRegister(setup("Wilayah DEMO Utara","pimpinan")),/ACCESS_DENIED/));
test("M14-S1 rejects duplicate request identities",()=>{
 const x=setup();x.requests.push({...x.requests[0]});
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects actual personal names",()=>{
 const x=setup();x.requests[0].applicant_name="Someone";
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects external official reference injection",()=>{
 const x=setup();x.requests[0].official_reference="123/ABC";
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects manufactured official issuance date",()=>{
 const x=setup();x.requests[0].official_issued_at="2026-11-23";
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects real-world source URLs",()=>{
 const x=setup();x.requests[0].source_ref="https://real-site.test";
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects 2031 records",()=>{
 const x=setup();x.requests[0].period="2031-02";
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects non-DEMO origin",()=>{
 const x=setup();x.requests[0].origin_region_label="Padang";
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects fake commodity types",()=>{
 const x=setup();x.requests[0].commodity_type="OFFICIAL_LIVE_ANIMALS";
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects invalid review template",()=>{
 const x=setup();x.requests[0].review_template_version="OFFICIAL_V1";
 assert.throws(()=>buildDemoCertificateRegister(x),/REQUEST_INVALID/);
});
test("M14-S1 rejects duplicate review fields",()=>{
 const x=setup();x.requests[0].requirements[1].field_id=x.requests[0].requirements[0].field_id;
 assert.throws(()=>buildDemoCertificateRegister(x),/REVIEW_FIELD_INVALID/);
});
test("M14-S1 rejects invalid checklist states",()=>{
 const x=setup();x.requests[0].requirements[0].state="OFFICIALLY_APPROVED";
 assert.throws(()=>buildDemoCertificateRegister(x),/REVIEW_FIELD_INVALID/);
});
test("M14-S1 internal completeness is not legal eligibility",()=>{
 const x=view().rows.find(x=>x.request_id==="DEMO-CERT-REQ-ALPHA");
 assert.equal(x.eligibility_determined,false);
 assert.equal(x.official_certificate_status,null);
});
test("M14-S1 detail does not expose applicant identity",()=>{
 const x=buildDemoCertificateReview({...setup(),request_id:"DEMO-CERT-REQ-ALPHA"});
 assert.equal(JSON.stringify(x).includes("applicant_name"),false);
});
test("M14-S1 missing request is access denied",()=>assert.throws(
 ()=>buildDemoCertificateReview({...setup(),request_id:"DEMO-CERT-REQ-UNKNOWN"}),/ACCESS_DENIED/));
test("M14-S1 cannot view request from another origin territory",()=>assert.throws(
 ()=>buildDemoCertificateReview({...setup(),request_id:"DEMO-CERT-REQ-GAMMA"}),/ACCESS_DENIED/));
test("M14-S1 never creates signature or verification code",()=>{
 const x=buildDemoCertificateReview({...setup(),request_id:"DEMO-CERT-REQ-ALPHA"});
 assert.equal(x.cryptographic_signature,null);
 assert.equal(x.verification_code,null);
});
test("M14-S1 prevents submissions, approvals and issuance",()=>{
 const x=view();
 for(const k of ["may_connect","may_write","may_submit_officially",
  "may_issue","may_sign","may_verify_publicly","may_publish","may_approve","may_deploy"])
  assert.equal(x[k],false);
});
