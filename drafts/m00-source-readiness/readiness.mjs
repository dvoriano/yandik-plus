/**
 * M00-G4 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Governance intake checklist. This DOES NOT grant external data permission,
 * create a production principal, authorize imports or contact data owners.
 */
import {backendPrincipal}
 from "../m04-backend-readonly/identity.mjs";
import {assertDemoSourceManifest,M00_G2_SCHEMA}
 from "../m00-source-api-gate/source_access.mjs";

export const M00_G4_SCHEMA="M00-G4-SOURCE-READINESS-UNTESTED-1";
export const M00_G4_DOSSIER_SCHEMA="M00-G4-SYNTHETIC-DOSSIER-UNTESTED-1";
export const M00_G4_CHECKS=Object.freeze([
 "SOURCE_OWNER_AUTHORIZATION",
 "PURPOSE_AND_DATA_MINIMIZATION",
 "PERSONAL_OR_SENSITIVE_DATA_CLASSIFICATION",
 "PERMITTED_TRANSFER_MECHANISM",
 "RETENTION_AND_DELETION_POLICY",
 "SECURE_SERVER_IDENTITY",
 "ACCESS_LOGGING_AND_INCIDENT_RESPONSE"
]);
const fail=code=>{throw Error(code);};
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const IDS=/^DEMO-SOURCE-[A-Z0-9_-]{1,32}$/;
const REG=/^Wilayah DEMO [A-Za-z]{2,25}$/;
const STATES=new Set(["NOT_REVIEWED_DEMO","DRAFTED_UNVERIFIED_DEMO"]);
export function buildDemoSourceReadiness({
 resolveServerSession,manifest,dossier
}={}){
 // Only a server-hosted resolver is acceptable in an actual app.
 // This callback is a DEMO trust contract, not proof of authentication.
 const principal=backendPrincipal(resolveServerSession);
 if(!["provinsi_admin","provinsi_verifikator"].includes(principal.role))
  fail("ACCESS_DENIED");
 if(!exact(dossier,["schema","source_id","region_label",
    "purpose","request_state","review_items","external_permission_ref"])||
    dossier.schema!==M00_G4_DOSSIER_SCHEMA||
    typeof dossier.source_id!=="string"||!IDS.test(dossier.source_id)||
    typeof dossier.region_label!=="string"||!REG.test(dossier.region_label)||
    dossier.purpose!=="INTERNAL_PLANNING_DEMO"||
    dossier.request_state!=="NOT_SUBMITTED_DEMO"||
    dossier.external_permission_ref!==null||
    !Array.isArray(dossier.review_items)||
    dossier.review_items.length!==M00_G4_CHECKS.length)
  fail("M00_G4_DOSSIER_INVALID");
 const statuses=new Map();
 for(const item of dossier.review_items){
  if(!exact(item,["check_id","state"])||
    !M00_G4_CHECKS.includes(item.check_id)||
    !STATES.has(item.state)||statuses.has(item.check_id))
   fail("M00_G4_CHECK_INVALID");
  statuses.set(item.check_id,item.state);
 }
 const source=assertDemoSourceManifest(manifest,{
  domain:"SURVEILLANCE_DEMO",
  region_label:dossier.region_label
 });
 if(source.schema!==M00_G2_SCHEMA||
   source.source_id!==dossier.source_id)
  fail("M00_G4_SOURCE_MISMATCH");
 const unreviewed=M00_G4_CHECKS.filter(k=>
  statuses.get(k)==="NOT_REVIEWED_DEMO");
 return {
  schema:M00_G4_SCHEMA,synthetic:true,mode:"INTERNAL_DOSSIER_ONLY",
  source_id:source.source_id,snapshot_id:source.snapshot_id,
  region_label:dossier.region_label,capture_month:source.capture_month,
  purpose:dossier.purpose,
  check_count_demo:M00_G4_CHECKS.length,
  unreviewed_count_demo:unreviewed.length,
  drafted_count_demo:M00_G4_CHECKS.length-unreviewed.length,
  check_states:M00_G4_CHECKS.map(k=>({
   check_id:k,state:statuses.get(k)
  })),
  permission_request_submitted:false,
  data_owner_permission_obtained:false,
  source_identity_authenticated:false,
  production_api_authenticated:false,
  data_transfer_approved:false,classification_review_approved:false,
  retention_policy_approved:false,
  ready_for_real_import:false,ready_for_real_read:false,
  ready_for_staging:false,ready_for_production:false,
  official_authorization:false,
  may_connect:false,may_import:false,may_store_real_data:false,
  may_export:false,may_write:false,may_publish:false,
  may_approve:false,may_deploy:false
 };
}

export function draftServerIdentityRequirements(){
 return Object.freeze({
  schema:M00_G4_SCHEMA,synthetic:true,
  security_owner_reviewed:false,
  required_controls:[
   "SERVER_OWNED_SESSION_LOOKUP",
   "SESSION_EXPIRATION_AND_REVOCATION",
   "CSRF_PROTECTION_FOR_COOKIE_MUTATIONS",
   "PER_ROUTE_ROLE_AND_OBJECT_SCOPE",
   "PER_FIELD_RESPONSE_ALLOWLIST",
   "NO_DEFAULT_PASSWORDS_OR_SECRET_FALLBACK",
   "AUDIT_AND_RATE_LIMIT_POLICY",
   "APPROVED_EXTERNAL_SOURCE_RIGHTS"
  ],
  deny_client_role_claims:true,deny_client_tenant_claims:true,
  deny_client_source_permissions:true,
  session_provider_implemented:false,
  flask_adapter_implemented:false,http_routes_implemented:false,
  verified_credentials_available:false,
  external_source_permission_verified:false,
  production_access_enabled:false,official_authorization:false
 });
}
