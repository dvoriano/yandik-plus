/**
 * M00-G2 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | PURE DEMO.
 * Source provenance and authorization boundary for *read projections*.
 * This cannot authenticate an API, verify an external source, or grant access.
 */
import {requireDemoScopedRead}
 from "../m00-oversight-access/scoped_read.mjs";

export const M00_G2_SCHEMA="M00-G2-SOURCE-ACCESS-UNTESTED-1";
export const M00_G2_SOURCE_SCHEMA="M00-G2-SOURCE-MANIFEST-UNTESTED-1";
export const M00_G2_DOMAINS=Object.freeze({
 SURVEILLANCE:"SURVEILLANCE_DEMO",
 MEDICINE_OVERSIGHT:"MEDICINE_OVERSIGHT_DEMO",
 PRACTICE_OVERSIGHT:"PRACTICE_OVERSIGHT_DEMO",
 CERTIFICATE_REGISTER:"CERTIFICATE_REGISTER_DEMO"
});
const fail=code=>{throw Error(code);};
const IDS=/^DEMO-SOURCE-[A-Z0-9_-]{1,32}$/;
const SNAP=/^DEMO-SNAPSHOT-[A-Z0-9_-]{1,32}$/;
const REGION=/^Wilayah DEMO [A-Za-z]{2,25}$/;
const MONTH=/^(?:202[6-9]|2030)-(?:0[1-9]|1[0-2])$/;
const KEYS=["schema","source_id","snapshot_id","domain","region_label",
 "capture_month","revision","origin","synthetic","source_verified",
 "official_authorization"];
const exact=(x,k)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===k.length&&k.every(a=>Object.hasOwn(x,a));
export function assertDemoSourceManifest(manifest,{domain,region_label}={}){
 if(!exact(manifest,KEYS)||
    manifest.schema!==M00_G2_SOURCE_SCHEMA||
    typeof manifest.source_id!=="string"||!IDS.test(manifest.source_id)||
    typeof manifest.snapshot_id!=="string"||!SNAP.test(manifest.snapshot_id)||
    !Object.values(M00_G2_DOMAINS).includes(manifest.domain)||
    typeof manifest.region_label!=="string"||
    !REGION.test(manifest.region_label)||
    typeof manifest.capture_month!=="string"||
    !MONTH.test(manifest.capture_month)||
    !Number.isSafeInteger(manifest.revision)||manifest.revision<1||
    manifest.revision>100000||
    manifest.origin!=="LOCAL_SYNTHETIC_FIXTURE"||
    manifest.synthetic!==true||manifest.source_verified!==false||
    manifest.official_authorization!==false)
  fail("M00_G2_SOURCE_UNTRUSTED");
 if(domain!==undefined&&manifest.domain!==domain)
  fail("M00_G2_SOURCE_DOMAIN_MISMATCH");
 if(region_label!==undefined&&manifest.region_label!==region_label)
  fail("M00_G2_SOURCE_SCOPE_MISMATCH");
 return Object.freeze({
  schema:M00_G2_SCHEMA,synthetic:true,
  source_id:manifest.source_id,snapshot_id:manifest.snapshot_id,
  domain:manifest.domain,region_label:manifest.region_label,
  capture_month:manifest.capture_month,revision:manifest.revision,
  provenance_status:"SYNTHETIC_METADATA_ONLY",
  source_approved:false,source_verified:false,
  freshness_verified:false,identity_verified:false,
  may_connect:false,may_import:false,may_write:false,
  may_publish:false,official_authorization:false
 });
}
export function requireDemoSourceRead({
 resolveServerSession
}={},{
 module,region_label,manifest
}={}){
 // Fail closed before revealing source identifiers; user supplied roles are not
 // accepted as auth. The callback is only a prototype server trust contract.
 const scope=requireDemoScopedRead({resolveServerSession},
  {module,region_label,detail:true});
 const domain=M00_G2_DOMAINS[module];
 if(!domain)fail("M00_G2_MODULE_UNKNOWN");
 const source=assertDemoSourceManifest(manifest,{domain,region_label});
 return Object.freeze({
  schema:M00_G2_SCHEMA,synthetic:true,mode:"READ_ONLY_DEMO",
  module,region_label,
  source,
  scope_contract:snapshotScope(scope),
  production_session_verified:false,
  source_verification_complete:false,
  can_expose_case_details:false,
  may_write:false,may_submit:false,may_approve:false,
  may_notify:false,may_publish:false,may_deploy:false,
  official_authorization:false
 });
}
function snapshotScope(scope){
 if(scope?.synthetic!==true||scope.read_permitted_demo!==true)
  fail("M00_G2_SCOPE_UNTRUSTED");
 return {
  synthetic:true,read_permitted_demo:true,
  authenticated_in_production:false,may_write:false
 };
}
export function draftApiBoundaryContract(){
 return Object.freeze({
  schema:M00_G2_SCHEMA,synthetic:true,
  source:"LOCAL_SYNTHETIC_FIXTURE_ONLY",
  transport_endpoints_implemented:false,
  server_session_binding_verified:false,
  tenant_isolation_verified:false,source_freshness_verified:false,
  external_data_permission_verified:false,
  deny_browser_actor_claims:true,deny_external_credentials:true,
  deny_record_write:true,deny_official_case_publishing:true,
  no_secret_material:true,ready_for_staging:false,
  ready_for_production:false
 });
}
