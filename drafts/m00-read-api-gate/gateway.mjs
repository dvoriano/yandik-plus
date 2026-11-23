/**
 * M00-G3 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | SYNTHETIC.
 * Request boundary simulation only: no HTTP routes, cookies, credentials,
 * authorization middleware, or production API are implemented here.
 * Server host MUST own both trusted scope and session/source callbacks.
 */
import {buildDemoSurveillanceRegister,M13_S1_SCHEMA}
 from "../m13-surveillance/surveillance.mjs";
export const M00_G3_SCHEMA="M00-G3-READ-API-BOUNDARY-DEMO-UNTESTED-1";
const fail=code=>{throw Error(code);};
const safeId=/^DEMO-EVENT-[A-Z0-9_-]{1,24}$/;
const region=/^Wilayah DEMO [A-Za-z]{2,25}$/;
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const operations=new Set(["LIST_EVENTS","REVIEW_EVENT"]);
export function demoReadApiContract(){
 return Object.freeze({
  schema:M00_G3_SCHEMA,synthetic:true,
  request_keys:["method","operation","event_id"],
  allowed_method:"GET",operations:[...operations],
  trusted_host_inputs:["resolveServerSession","region_label",
   "manifest","events"],
  forbid_client_identity_claims:true,
  forbid_client_region_claims:true,
  forbid_client_source_selection:true,
  no_http_endpoint:true,no_real_authentication:true,
  no_database_connection:true,no_cookie_or_header_handling:true,
  no_write_operations:true,no_public_access:true,
  may_deploy:false
 });
}
export function readDemoSurveillanceApi({
 request,host
}={}){
 if(!exact(request,["method","operation","event_id"])||
    request.method!=="GET"||!operations.has(request.operation)||
    (request.operation==="LIST_EVENTS"&&request.event_id!==null)||
    (request.operation==="REVIEW_EVENT"&&
     (typeof request.event_id!=="string"||
      !safeId.test(request.event_id))))
  fail("M00_G3_REQUEST_DENIED");
 if(!exact(host,["resolveServerSession","region_label","manifest","events"])||
    typeof host.resolveServerSession!=="function"||
    typeof host.region_label!=="string"||!region.test(host.region_label))
  fail("M00_G3_TRUSTED_HOST_REQUIRED");
 // Recheck the session & region on each call by calling M13-S1.
 const register=buildDemoSurveillanceRegister({
  resolveServerSession:host.resolveServerSession,
  region_label:host.region_label,
  manifest:host.manifest,
  events:host.events
 });
 if(register.schema!==M13_S1_SCHEMA||register.synthetic!==true||
    register.official_authorization!==false||
    register.source_verified!==false||
    register.isikhnas_connected!==false)
  fail("M00_G3_SOURCE_UNTRUSTED");
 const publicFields=x=>({
  event_id:x.event_id,period:x.period,
  report_class:x.report_class,
  investigation_state:x.investigation_state,
  sample_state:x.sample_state,
  officially_notified:false,disease_confirmed:false
 });
 let rows;
 if(request.operation==="LIST_EVENTS")
  rows=register.rows.map(publicFields);
 else{
  const found=register.rows.find(x=>x.event_id===request.event_id);
  if(!found)fail("ACCESS_DENIED");
  rows=[publicFields(found)];
 }
 return {
  schema:M00_G3_SCHEMA,synthetic:true,
  operation:request.operation,
  region_label:host.region_label,
  records:structuredClone(rows),record_count_demo:rows.length,
  response_projection:"STRICT_FIELDS_NO_LOCATION_OR_SOURCE_IDS",
  source_provenance_verified:false,authenticated_in_production:false,
  official_case_count:null,
  no_actor_identity_exposed:true,no_exact_location_exposed:true,
  no_personal_data_exposed:true,
  no_http_endpoint:true,may_write:false,may_import:false,
  may_export:false,may_notify:false,may_approve:false,
  may_publish:false,may_deploy:false,official_authorization:false
 };
}
