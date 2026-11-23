/**
 * M05-11 | KODE DITULIS, BELUM DIUJI | DEMO ONLY.
 * Review notes are planning metadata, NOT authority or evidence of a run.
 */
import {buildDemoStagingProtocol,M05_11_PROTOCOL_SCHEMA,
 noExecutionAuthority} from "./protocol.mjs";
import {isDemoId} from "../m05-apel-evidence/evidence.mjs";
export const M05_11_REVIEW_SCHEMA="M05-11-PROTOCOL-NOTES-UNTESTED-1";
export const M05_11_NOTE_KINDS=Object.freeze([
 "REQUEST_EVIDENCE","REQUEST_CLARIFICATION","FLAG_SECURITY_RISK",
 "REQUEST_SCOPE_REVIEW","DEFER_UNTIL_PERMISSION"
]);
export const M05_11_NOTE_REASONS=Object.freeze([
 "DEMO_NO_TEST_PERMISSION","DEMO_NO_ACCESS_PERMISSION",
 "DEMO_ISOLATION_NOT_VERIFIED","DEMO_SOURCE_UNKNOWN",
 "DEMO_SCHEMA_UNMAPPED","DEMO_JUKNIS_UNVERIFIED",
 "DEMO_POLICY_PENDING","DEMO_RECOVERY_UNVERIFIED",
 "DEMO_REVIEW_PENDING"
]);
const KEYS=["note_id","snapshot_id","control_id","reviewer_id",
 "note_kind","reason_code"];
const exact=(v,keys)=>v!==null&&typeof v==="object"&&!Array.isArray(v)&&
 Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const fail=x=>{throw Error(x)};
function verifyProtocol(p){
 if(p?.schema!==M05_11_PROTOCOL_SCHEMA||p?.synthetic!==true||
  p?.mode!=="DRAFT_NO_STAGING_EXECUTION"||
  !noExecutionAuthority(p)||p.code_only_active!==true||
  p.readiness!=="BLOCKED_PENDING_SEPARATE_OWNER_PERMISSIONS"||
  p.upstream_acceptance!=="BLOCKED"||
  p.counts?.executed!==0||p.counts?.official_signoffs!==0||
  p.counts?.blocked_controls!==p.counts?.controls||
  !Array.isArray(p.controls)||!Array.isArray(p.parity_cases))
  fail("M05_11_PROTOCOL_INVALID");
 const baseline=buildDemoStagingProtocol({year:p.year,snapshot_id:p.snapshot_id});
 if(JSON.stringify(baseline)!==JSON.stringify(p))
  fail("M05_11_PROTOCOL_TAMPERED");
 return baseline;
}
export function buildDemoProtocolReview({protocol,notes=[]}={}){
 const source=verifyProtocol(protocol);
 if(!Array.isArray(notes)||notes.length>100)
  fail("M05_11_NOTES_INVALID");
 const seen=new Set();
 const accepted=notes.map(n=>{
  if(!exact(n,KEYS)||!isDemoId(n.note_id)||
   !isDemoId(n.reviewer_id)||n.snapshot_id!==source.snapshot_id||
   !M05_11_NOTE_KINDS.includes(n.note_kind)||
   !M05_11_NOTE_REASONS.includes(n.reason_code)||
   !source.controls.some(c=>c.control_id===n.control_id))
   fail("M05_11_NOTE_INVALID");
  if(seen.has(n.note_id))fail("M05_11_DUPLICATE_NOTE");
  seen.add(n.note_id);
  return {...n,official_decision:false,permission_granted:false,
   evidence_verified:false,issue_resolved:false};
 });
 const controls=source.controls.map(c=>({
  control_id:c.control_id,owner_role:c.owner_role,
  note_count:accepted.filter(n=>n.control_id===c.control_id).length,
  candidate_review_state:accepted.some(n=>n.control_id===c.control_id)?
    "DEMO_NOTES_PRESENT":"NO_DEMO_NOTES",
  officially_verified:false,permission_granted:false,
  signoff_obtained:false,status:"BLOCKED_NO_REAL_EVIDENCE"}));
 return {schema:M05_11_REVIEW_SCHEMA,synthetic:true,
  mode:"NOTES_ONLY_NO_AUTHORITY",snapshot_id:source.snapshot_id,
  year:source.year,notes:accepted,controls,
  counts:{notes:accepted.length,controls:controls.length,
   verified:0,permissions:0,signoffs:0},
  source_owner_verified:false,
  may_run_tests:false,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_score:false,may_rank:false,
  may_award:false,may_publish:false,may_merge:false,may_deploy:false,
  official_authorization:false,
  project_test_permission_verified:false,
  system_access_permission_verified:false,
  staging_environment_verified:false,
  security_controls_verified:false,baseline_verified:false,
  juknis_parity_verified:false};
}
