/**
 * M05-8 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY
 * Fail-closed readiness packet: no fixture, review note, or missing issue can
 * authorize staging, production, scoring, ranking, publication or DB access.
 */
import {M05_8_EVIDENCE_SCHEMA,REQUIREMENTS,isDemoId} from "./evidence.mjs";
import {M05_8_REVIEW_SCHEMA} from "./review.mjs";
import {M05_7_SCHEMA} from "../m05-apel-lineage/lineage.mjs";
export const M05_8_GATE_SCHEMA="M05-8-READINESS-GATES-UNTESTED-1";
export const GATE_CATALOG=Object.freeze([
 {gate_id:"SOURCE_AND_SCOPE",requirement_ids:["SOURCE_OWNER_SCOPE","SOURCE_PROVENANCE"]},
 {gate_id:"SCHEMA_AND_GRAIN",requirement_ids:["DATA_DICTIONARY","KEYS_AND_GRAIN","SERVICE_UNIT_GRAIN"]},
 {gate_id:"RECONCILIATION_HISTORY",requirement_ids:["SNAPSHOT_ATOMICITY","REGION_HISTORY","REPORT_REVISIONS"]},
 {gate_id:"ANNUAL_SUPPORT_POLICY",requirement_ids:["YEARLY_POLICY","SUPPORT_PLAN_REALIZATION","JUKNIS_PARITY"]},
 {gate_id:"SECURITY_AND_STAGING",requirement_ids:["SECURITY_RETENTION","STAGING_TEST_PERMISSION"]},
 {gate_id:"PUBLICATION",requirement_ids:["REPORT_PUBLICATION_PERMISSION"]}
]);
export const ISSUE_ACTIONS=Object.freeze([
 "REQUEST_SOURCE_CLARIFICATION","REQUEST_ADDITIONAL_EVIDENCE",
 "ESCALATE_TO_SOURCE_OWNER","DEFER_UNTIL_AUTHORIZED"
]);
const ISSUE_REASONS=Object.freeze([
 "DEMO_MISSING_PARENT","DEMO_AMBIGUOUS_JOIN","DEMO_UNAPPROVED_RULE",
 "DEMO_MISSING_EVIDENCE","DEMO_SOURCE_SNAPSHOT_UNKNOWN"
]);
const issueNoteKeys=["note_id","issue_index","reviewer_id","action","reason_code"];
const fail=code=>{throw Error(code)};
const exact=(v,keys)=>v!==null&&typeof v==="object"&&!Array.isArray(v)&&
 Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const flagsFalse=o=>["may_connect","may_query","may_write","may_repair",
 "may_score","may_publish","official_authorization"].every(k=>o?.[k]===false);
function validateInputs(register,reviews){
 if(register?.schema!==M05_8_EVIDENCE_SCHEMA||
  register?.synthetic!==true||register?.mode!=="DEMO_EVIDENCE_METADATA_ONLY"||
  !flagsFalse(register)||!Array.isArray(register.requirements)||
  register.requirements.length!==REQUIREMENTS.length||
  !Array.isArray(register.candidates)||
  register.candidates.length!==register.counts?.candidates||
  !register.candidates.every(x=>x.claim_state==="DEMO_UNVERIFIED"&&
   x.officially_verified===false))
  fail("M05_8_GATE_REGISTER_INVALID");
 if(reviews?.schema!==M05_8_REVIEW_SCHEMA||reviews?.synthetic!==true||
  reviews?.mode!=="DEMO_NOTES_ARE_NOT_APPROVAL"||!flagsFalse(reviews)||
  reviews.counts?.approved!==0||reviews.counts?.verified!==0||
  !Array.isArray(reviews.source_evidence_ids)||
  !Array.isArray(reviews.notes)||
  !Array.isArray(reviews.items)||reviews.items.length!==REQUIREMENTS.length||
  reviews.notes.length!==reviews.counts?.notes||
  reviews.source_evidence_ids.join("|")!==
    register.candidates.map(x=>x.evidence_id).sort().join("|")||
  !reviews.items.every(x=>x.officially_verified===false&&
   x.signoff_obtained===false))
  fail("M05_8_GATE_REVIEW_INVALID");
}
function inspectLineage(lineage){
 if(lineage===null)return {status:"NOT_PROVIDED",issues:[]};
 if(lineage?.schema!==M05_7_SCHEMA||lineage?.synthetic!==true||
  lineage?.mode!=="DEMO_LINEAGE_REVIEW_ONLY"||
  lineage?.all_candidate_links_are_unverified!==true||
  lineage?.mapping_verified!==false||lineage?.source_owner_verified!==false||
  !flagsFalse(lineage)||!Array.isArray(lineage.issues)||
  lineage.issues.length>1000||!lineage.issues.every(issue=>
   typeof issue.code==="string"&&/^[A-Z0-9_]{3,90}$/.test(issue.code)&&
   typeof issue.source_ref==="string"&&
   /^[a-z_]+:DEMO-[A-Z0-9_|:-]{1,160}$/.test(issue.source_ref)&&
   issue.auto_resolved===false&&
   issue.resolution==="HUMAN_REVIEW_REQUIRED"))
  fail("M05_8_LINEAGE_SOURCE_INVALID");
 return {status:"DEMO_SOURCE_UNVERIFIED",issues:lineage.issues.map((r,i)=>({
  issue_index:i+1,code:r.code,source_ref:r.source_ref,
  review_state:"UNRESOLVED",auto_resolved:false}))};
}
export function buildDemoReadinessPacket({
 register,reviews,lineage=null,issue_notes=[]
}={}){
 validateInputs(register,reviews);
 const issues=inspectLineage(lineage);
 if(!Array.isArray(issue_notes)||issue_notes.length>100||
  (lineage===null&&issue_notes.length))fail("M05_8_ISSUE_NOTES_INVALID");
 const seen=new Set();
 const recorded=issue_notes.map(n=>{
  if(!exact(n,issueNoteKeys)||!isDemoId(n.note_id)||
   !isDemoId(n.reviewer_id)||!Number.isSafeInteger(n.issue_index)||
   n.issue_index<1||n.issue_index>issues.issues.length||
   !ISSUE_ACTIONS.includes(n.action)||!ISSUE_REASONS.includes(n.reason_code))
   fail("M05_8_ISSUE_NOTE_INVALID");
  if(seen.has(n.note_id))fail("M05_8_DUPLICATE_ISSUE_NOTE");
  seen.add(n.note_id);
  return {...n,official_decision:false,issue_resolved:false};
 });
 const requirements=REQUIREMENTS.map(r=>{
  const candidate_count=register.candidates.filter(c=>
   c.requirement_id===r.requirement_id).length;
  return {requirement_id:r.requirement_id,owner_role:r.owner_role,
   candidate_count,
   review_note_count:reviews.notes.filter(n=>n.requirement_id===
    r.requirement_id).length,
   evidence_status:candidate_count?"DEMO_CANDIDATE_UNVERIFIED":"NOT_PROVIDED",
   official_attestation:"NOT_PROVIDED",verified:false,blocking:true};
 });
 const gates=GATE_CATALOG.map(g=>{
  const blocked=requirements.filter(r=>
   g.requirement_ids.includes(r.requirement_id)).map(r=>r.requirement_id);
  return {gate_id:g.gate_id,requirement_ids:[...g.requirement_ids],
   blocking_requirement_ids:blocked,decision:"BLOCKED",
   official_signoff:false,reviewer_signoff:false,
   integration_permitted:false};
 });
 return {schema:M05_8_GATE_SCHEMA,synthetic:true,
  mode:"UNTESTED_EVIDENCE_REVIEW_PACKET",
  requirements,gates,
  issue_review:{source_state:issues.status,
   issues:issues.issues,notes:recorded,unresolved_count:issues.issues.length},
  counts:{requirements:requirements.length,
   evidence_candidates:register.candidates.length,
   evidence_review_notes:reviews.notes.length,
   issue_review_notes:recorded.length,
   unresolved_lineage_issues:issues.issues.length,
   officially_verified_requirements:0,blocked_gates:gates.length},
  readiness:"BLOCKED_NO_OFFICIAL_EVIDENCE_OR_AUTHORIZATION",
  source_owner_verified:false,schema_mapping_verified:false,
  source_snapshot_verified:false,methodology_parity_verified:false,
  staging_testing_authorized:false,production_authorized:false,
  publishing_authorized:false,may_run_tests:false,may_merge:false,
  may_deploy:false,may_connect:false,may_query:false,may_write:false,
  may_repair:false,may_score:false,may_rank:false,may_award:false,
  may_publish:false,official_authorization:false};
}
