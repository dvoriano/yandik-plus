/**
 * M05-8 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY
 * Review notes are NOT data-owner attestation or legal/operational approvals.
 */
import {M05_8_EVIDENCE_SCHEMA,REQUIREMENTS,isDemoId} from "./evidence.mjs";
export const M05_8_REVIEW_SCHEMA="M05-8-EVIDENCE-REVIEW-UNTESTED-1";
export const REVIEW_ASSESSMENTS=Object.freeze([
 "DEMO_STRUCTURE_NOTED","REQUEST_CLARIFICATION","REJECT_DEMO_CANDIDATE"
]);
export const REVIEW_REASONS=Object.freeze([
 "DEMO_MISSING_OWNER","DEMO_UNCLEAR_SOURCE","DEMO_UNCLEAR_GRAIN",
 "DEMO_REVISION_UNCLEAR","DEMO_REGION_AMBIGUOUS","DEMO_UNIT_CONFLICT",
 "DEMO_EVIDENCE_INCOMPLETE","DEMO_REVIEW_NOTE_ONLY"
]);
const noteKeys=["review_id","requirement_id","evidence_id","reviewer_id",
 "assessment","reason_code"];
const fail=code=>{throw Error(code)};
const exact=(v,keys)=>v!==null&&typeof v==="object"&&!Array.isArray(v)&&
 Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
function safeRegister(register){
 return register?.schema===M05_8_EVIDENCE_SCHEMA&&register?.synthetic===true&&
 register?.mode==="DEMO_EVIDENCE_METADATA_ONLY"&&
 register?.official_authorization===false&&
 register?.counts?.official_verified===0&&
 Array.isArray(register?.requirements)&&
 register.requirements.length===REQUIREMENTS.length&&
 Array.isArray(register?.candidates)&&
 register.candidates.every(c=>c.claim_state==="DEMO_UNVERIFIED"&&
  c.officially_verified===false)&&
 register.candidates.length===register.counts.candidates;
}
export function makeDemoEvidenceReview({register,notes=[]}={}){
 if(!safeRegister(register))fail("M05_8_REGISTER_INVALID");
 if(!Array.isArray(notes)||notes.length>100)
  fail("M05_8_REVIEW_NOTES_INVALID");
 const seen=new Set(),accepted=notes.map(n=>{
  if(!exact(n,noteKeys)||!isDemoId(n.review_id)||!isDemoId(n.reviewer_id)||
   !REVIEW_ASSESSMENTS.includes(n.assessment)||
   !REVIEW_REASONS.includes(n.reason_code))
   fail("M05_8_REVIEW_NOTE_INVALID");
  const candidate=register.candidates.find(c=>c.evidence_id===n.evidence_id);
  if(!candidate||candidate.requirement_id!==n.requirement_id)
   fail("M05_8_REVIEW_REFERENCE_MISMATCH");
  if(seen.has(n.review_id))fail("M05_8_DUPLICATE_REVIEW_ID");
  seen.add(n.review_id);
  return {...n,official_decision:false,source_attestation_verified:false,
   issue_resolved:false};
 });
 const items=register.requirements.map(r=>{
  const subset=accepted.filter(n=>n.requirement_id===r.requirement_id);
  return {requirement_id:r.requirement_id,candidate_count:r.candidate_count,
   review_note_count:subset.length,review_state:subset.length?
    "DEMO_NOTES_RECORDED_NOT_VERIFIED":
    r.candidate_count?"PENDING_DEMO_REVIEW":"NO_CANDIDATE",
   officially_verified:false,signoff_obtained:false};
 });
 return {schema:M05_8_REVIEW_SCHEMA,synthetic:true,
  mode:"DEMO_NOTES_ARE_NOT_APPROVAL",source_evidence_ids:register.candidates
   .map(c=>c.evidence_id).sort(),
  notes:accepted,items,counts:{notes:accepted.length,
   verified:0,approved:0,requirements:REQUIREMENTS.length},
  independent_source_review_verified:false,
  human_signoff_verified:false,official_authorization:false,
  may_connect:false,may_query:false,may_write:false,may_repair:false,
  may_score:false,may_publish:false};
}
