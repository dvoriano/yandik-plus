/** M00-G1 | QA TERTULIS, 0 DIJALANKAN. */
import test from "node:test";
import assert from "node:assert/strict";
import {requireDemoScopedRead,requireDemoScopedList,
 moduleAccessPolicyDraft,M00_G1_SCHEMA} from "../scoped_read.mjs";
const region="Wilayah DEMO Utara";
const actor=(role,more={})=>({
 resolveServerSession:()=>({
  id:"DEMO-USER-"+role.toUpperCase(),role,active:true,
  region, ...(role==="puskeswan"?{puskeswan_id:"DEMO-PSW-A"}:{}),
  ...more
 })
});
const req={module:"MEDICINE_OVERSIGHT",region_label:region,detail:true};
test("M00-G1 policy is explicitly demo-only",()=>{
 assert.equal(moduleAccessPolicyDraft().production_identity_verified,false);
});
test("M00-G1 admin can view synthetic scope",()=>{
 assert.equal(requireDemoScopedRead(actor("provinsi_admin"),req).read_permitted_demo,true);
});
test("M00-G1 province verifier can view synthetic scope",()=>{
 assert.equal(requireDemoScopedRead(actor("provinsi_verifikator"),req).synthetic,true);
});
test("M00-G1 matched kabupaten/kota may read sample territory",()=>{
 assert.equal(requireDemoScopedRead(actor("kab_kota"),req).region_label,region);
});
test("M00-G1 cross territory fails closed",()=>{
 assert.throws(()=>requireDemoScopedRead(actor("kab_kota",{region:"Wilayah DEMO Selatan"}),req),/ACCESS_DENIED/);
});
test("M00-G1 Puskeswan role cannot read oversight details",()=>{
 assert.throws(()=>requireDemoScopedRead(actor("puskeswan"),req),/ACCESS_DENIED/);
});
test("M00-G1 leadership cannot read site details",()=>{
 assert.throws(()=>requireDemoScopedRead(actor("pimpinan"),req),/ACCESS_DENIED/);
});
test("M00-G1 missing callback is denied",()=>{
 assert.throws(()=>requireDemoScopedRead({},req));
});
test("M00-G1 unsupported module rejected",()=>{
 assert.throws(()=>requireDemoScopedRead(actor("provinsi_admin"),
  {...req,module:"PRODUCTION_ADMIN"}),/SCOPE_INVALID/);
});
test("M00-G1 rejects invalid region selector",()=>{
 assert.throws(()=>requireDemoScopedRead(actor("provinsi_admin"),
  {...req,region_label:"Kabupaten Padang"}),/SCOPE_INVALID/);
});
test("M00-G1 refuses requests to change detail semantics",()=>{
 assert.throws(()=>requireDemoScopedRead(actor("provinsi_admin"),
  {...req,detail:false}),/SCOPE_INVALID/);
});
test("M00-G1 restricts missing or disabled accounts",()=>{
 assert.throws(()=>requireDemoScopedRead(actor("provinsi_admin",{active:false}),req),/ACCESS_DENIED/);
});
test("M00-G1 supports separate practice oversight module",()=>{
 assert.equal(requireDemoScopedRead(actor("provinsi_admin"),
  {...req,module:"PRACTICE_OVERSIGHT"}).read_permitted_demo,true);
});
test("M00-G1 supports draft certificate register but never issuance",()=>{
 const v=requireDemoScopedRead(actor("provinsi_admin"),
  {...req,module:"CERTIFICATE_REGISTER"});
 assert.equal(v.may_issue,false);
});
test("M00-G1 only allows matched territory records in a list",()=>{
 const list=requireDemoScopedList(actor("kab_kota"),
  {module:"MEDICINE_OVERSIGHT",region_label:region,
   records:[{synthetic:true,region_label:region,status:"DEMO"}]});
 assert.equal(list.records.length,1);
});
test("M00-G1 list refuses foreign record",()=>{
 assert.throws(()=>requireDemoScopedList(actor("kab_kota"),
  {module:"MEDICINE_OVERSIGHT",region_label:region,
   records:[{synthetic:true,region_label:"Wilayah DEMO Selatan"}]}),
  /CROSS_TERRITORY_RECORD/);
});
test("M00-G1 list refuses non-DEMO record",()=>{
 assert.throws(()=>requireDemoScopedList(actor("kab_kota"),
  {module:"MEDICINE_OVERSIGHT",region_label:region,
   records:[{synthetic:false,region_label:region}]}),
  /CROSS_TERRITORY_RECORD/);
});
test("M00-G1 list rejects too many records",()=>{
 assert.throws(()=>requireDemoScopedList(actor("kab_kota"),
  {module:"MEDICINE_OVERSIGHT",region_label:region,
   records:new Array(101).fill({synthetic:true,region_label:region})}),/LIST_INVALID/);
});
test("M00-G1 never authorizes publishing/issuance",()=>{
 const p=requireDemoScopedRead(actor("provinsi_admin"),req);
 assert.equal(p.may_publish,false);
 assert.equal(p.may_issue,false);
 assert.equal(p.may_approve,false);
});
