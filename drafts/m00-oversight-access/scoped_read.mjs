/**
 * M00-G1 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Shared module/territory read gate for future oversight modules.
 *
 * Never accept a browser-provided session callback, authenticated principal,
 * or claims of official permissions. The server MUST supply a trusted resolver
 * from an authenticated request context. This module is NOT an auth service.
 */
import {backendPrincipal} from "../m04-backend-readonly/identity.mjs";

export const M00_G1_SCHEMA="M00-G1-SCOPED-READ-UNTESTED-1";
export const M00_G1_MODULES=Object.freeze([
 "MEDICINE_OVERSIGHT","PRACTICE_OVERSIGHT","CERTIFICATE_REGISTER"
]);
const fail=(code="ACCESS_DENIED")=>{throw Error(code);};
const validRegion=x=>typeof x==="string"&&
 /^Wilayah DEMO [A-Za-z]{2,25}$/.test(x);
const validModule=x=>M00_G1_MODULES.includes(x);

export function requireDemoScopedRead(
 {resolveServerSession}={},
 {module,region_label,detail=true}={}
){
 if(!validModule(module)||!validRegion(region_label)||detail!==true)
  fail("M00_G1_SCOPE_INVALID");
 const actor=backendPrincipal(resolveServerSession);
 if(actor.role==="provinsi_admin"||actor.role==="provinsi_verifikator"){
  // Prototype admin/verifier can see sample detail, not issue permissions.
  return Object.freeze({
   schema:M00_G1_SCHEMA,synthetic:true,module,
   region_label,read_permitted_demo:true,
   authenticated_in_production:false,
   may_write:false,may_approve:false,may_issue:false,may_publish:false
  });
 }
 if(actor.role==="kab_kota"&&actor.region===region_label){
  return Object.freeze({
   schema:M00_G1_SCHEMA,synthetic:true,module,
   region_label,read_permitted_demo:true,
   authenticated_in_production:false,
   may_write:false,may_approve:false,may_issue:false,may_publish:false
  });
 }
 fail();
}

export function requireDemoScopedList(
 {resolveServerSession}={},
 {module,region_label,records,max_records=100}={}
){
 if(!validModule(module)||!validRegion(region_label)||
    !Array.isArray(records)||!Number.isSafeInteger(max_records)||
    max_records<1||max_records>100||records.length>max_records)
  fail("M00_G1_LIST_INVALID");
 const scope=requireDemoScopedRead({resolveServerSession},
  {module,region_label,detail:true});
 // Fail closed if any record crosses the requested territory.
 for(const record of records){
  if(!record||typeof record!=="object"||Array.isArray(record)||
     record.region_label!==region_label||record.synthetic!==true)
   fail("M00_G1_CROSS_TERRITORY_RECORD");
 }
 return Object.freeze({
  schema:M00_G1_SCHEMA,scope,
  synthetic:true,mode:"DEMO_READ_ONLY",
  records:structuredClone(records),
  may_export:false,may_write:false,
  may_publish:false,official_authorization:false
 });
}

export function moduleAccessPolicyDraft(){
 return Object.freeze({
  schema:M00_G1_SCHEMA,
  synthetic:true,
  scoped_details:["provinsi_admin","provinsi_verifikator",
   "kab_kota_sesuai_wilayah"],
  denied_detail_roles:["puskeswan","pimpinan"],
  provider:"BACKEND_CALLBACK_CONTRACT_NOT_REAL_AUTH",
  production_identity_verified:false,
  allow_public_lookup:false,allow_export:false,
  allow_write:false,allow_issue_certificates:false,
  allow_approve_licenses:false
 });
}
