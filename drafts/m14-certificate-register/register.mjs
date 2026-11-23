/**
 * M14-S1 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Synthetic request register for veterinary certificates / animal movements.
 * This is NOT a certificate issuer, verifier, signature or official registry.
 */
import {requireDemoScopedRead,requireDemoScopedList}
 from "../m00-oversight-access/scoped_read.mjs";

export const M14_S1_SCHEMA="M14-S1-CERTIFICATE-INTAKE-DEMO-UNTESTED-1";
export const M14_S1_REVIEW_FIELDS=Object.freeze([
 "INFORMASI_ASAL_DEMO",
 "INFORMASI_KOMODITAS_DEMO",
 "INFORMASI_TUJUAN_DEMO",
 "DOKUMEN_PENDUKUNG_DEMO"
]);
const fail=code=>{throw Error(code);};
const APPLICATION=/^DEMO-CERT-REQ-[A-Z0-9_-]{1,24}$/;
const SOURCE=/^DEMO-SOURCE-[A-Z0-9_-]{1,32}$/;
const REGION=/^Wilayah DEMO [A-Za-z]{2,25}$/;
const PERIOD=/^(?:202[6-9]|2030)-(?:0[1-9]|1[0-2])$/;
const COMMODITIES=new Set(["HEWAN_HIDUP_DEMO","PRODUK_HEWAN_DEMO"]);
const STAGES=new Set(["DRAFT_DEMO","INTERNAL_REVIEW_PENDING_DEMO",
 "NEEDS_CLARIFICATION_DEMO"]);
const OBS=new Set(["NOT_ASSESSED_DEMO","PRESENT_UNVERIFIED_DEMO",
 "NEEDS_CLARIFICATION_DEMO"]);
const valid=(x,re)=>typeof x==="string"&&re.test(x);
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));

function validateRequests(requests){
 if(!Array.isArray(requests)||requests.length>100)
  fail("M14_S1_REQUESTS_INVALID");
 const ids=new Set();
 for(const item of requests){
  if(!exact(item,["request_id","period","origin_region_label",
    "destination_region_label","commodity_type","source_ref",
    "internal_stage","review_template_version","requirements",
    "official_reference","official_issued_at"])||
    !valid(item.request_id,APPLICATION)||!valid(item.period,PERIOD)||
    !valid(item.origin_region_label,REGION)||
    !valid(item.destination_region_label,REGION)||
    !COMMODITIES.has(item.commodity_type)||!valid(item.source_ref,SOURCE)||
    !STAGES.has(item.internal_stage)||
    item.review_template_version!=="DEMO-INTAKE-TEMPLATE-UNAPPROVED-1"||
    item.official_reference!==null||item.official_issued_at!==null||
    !Array.isArray(item.requirements)||
    item.requirements.length!==M14_S1_REVIEW_FIELDS.length||
    ids.has(item.request_id))
   fail("M14_S1_REQUEST_INVALID");
  const seen=new Set();
  for(const field of item.requirements){
   if(!exact(field,["field_id","state"])||
     !M14_S1_REVIEW_FIELDS.includes(field.field_id)||
     !OBS.has(field.state)||seen.has(field.field_id))
    fail("M14_S1_REVIEW_FIELD_INVALID");
   seen.add(field.field_id);
  }
  ids.add(item.request_id);
 }
 return requests;
}

export function buildDemoCertificateRegister({
 resolveServerSession,region_label,requests
}={}){
 // Data is scoped by ORIGIN territory. Destination does not grant access.
 requireDemoScopedRead({resolveServerSession},
  {module:"CERTIFICATE_REGISTER",region_label,detail:true});
 const all=validateRequests(requests);
 const selected=all.filter(x=>x.origin_region_label===region_label)
  .sort((a,b)=>(a.period+"|"+a.request_id)
    .localeCompare(b.period+"|"+b.request_id));
 requireDemoScopedList({resolveServerSession},{
  module:"CERTIFICATE_REGISTER",region_label,
  records:selected.map(x=>({synthetic:true,region_label:x.origin_region_label}))
 });
 const rows=selected.map(x=>{
  const notAssessed=x.requirements.filter(v=>
   v.state==="NOT_ASSESSED_DEMO").length;
  const needsClarification=x.requirements.filter(v=>
   v.state==="NEEDS_CLARIFICATION_DEMO").length;
  return {
   request_id:x.request_id,period:x.period,
   origin_region_label:x.origin_region_label,
   destination_region_label:x.destination_region_label,
   commodity_type:x.commodity_type,source_ref:x.source_ref,
   internal_stage:x.internal_stage,
   review_template_version:x.review_template_version,
   unassessed_fields_demo:notAssessed,
   clarification_fields_demo:needsClarification,
   next_internal_review_hint:notAssessed>0||needsClarification>0?
    "REVIEW_MATERIAL_INCOMPLETE_DEMO":"OBSERVATIONS_RECORDED_NOT_VALIDATED",
   external_issuer_connected:false,
   official_certificate_reference:null,
   official_certificate_status:null,
   issuance_verified:false,
   eligibility_determined:false
  };
 });
 return {
  schema:M14_S1_SCHEMA,synthetic:true,
  mode:"READ_ONLY_DEMO_INTAKE",region_label,
  request_count_demo:rows.length,
  rows:structuredClone(rows),
  government_form_version_verified:false,
  legal_requirements_validated:false,
  issuing_authority_connected:false,
  certificate_issued_count:null,
  any_signature_generated:false,no_applicant_person_data:true,
  source:"SYNTHETIC_NOT_A_REAL_CERTIFICATE",
  may_connect:false,may_write:false,may_submit_officially:false,
  may_issue:false,may_verify_publicly:false,may_sign:false,
  may_publish:false,may_approve:false,may_deploy:false,
  official_authorization:false
 };
}

export function buildDemoCertificateReview({
 resolveServerSession,region_label,request_id,requests
}={}){
 if(!valid(request_id,APPLICATION))fail("M14_S1_SELECTOR_INVALID");
 const board=buildDemoCertificateRegister({
  resolveServerSession,region_label,requests
 });
 const item=board.rows.find(x=>x.request_id===request_id);
 if(!item)fail("ACCESS_DENIED");
 // A detail view exposes only invented checklist statuses.
 const original=requests.find(x=>x.request_id===request_id);
 return {
  schema:M14_S1_SCHEMA,synthetic:true,
  request:structuredClone(item),
  review_fields:structuredClone(original.requirements),
  review_note:{
   status:"NOT_SUBMITTED_TO_OFFICIAL_ISSUER",
   suggested_internal_action:"MANUAL_REVIEW_OF_SYNTHETIC_DATA",
   assigned_to:null,official_document_ref:null,approval:null
  },
  official_reference:null,official_issued_at:null,
  cryptographic_signature:null,verification_code:null,
  draft_document_generated:false,
  may_submit_officially:false,may_issue:false,
  may_verify_publicly:false,may_sign:false,
  may_publish:false,may_write:false,may_approve:false,
  may_deploy:false,official_authorization:false
 };
}
