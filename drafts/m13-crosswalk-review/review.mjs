/**
 * M13-S3 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * IN-MEMORY human-review notes for synthetic M13-S2 crosswalk candidates.
 * A fingerprint detects source changes; it is NOT source authentication,
 * a legal signature, or proof of one real epidemiological event.
 */
import {createHash} from "node:crypto";
import {backendPrincipal} from "../m04-backend-readonly/identity.mjs";
import {buildDemoCandidateCrosswalk,M13_S2_SCHEMA}
 from "../m13-apel-crosswalk/crosswalk.mjs";

export const M13_S3_SCHEMA="M13-S3-REVIEW-NOTES-UNTESTED-1";
export const M13_S3_LOG_SCHEMA="M13-S3-IN-MEMORY-LOG-UNTESTED-1";
const fail=code=>{throw Error(code);};
const LINK=/^DEMO-CROSSWALK-[A-Z0-9_-]{1,28}$/;
const USER=/^DEMO-USER-[A-Z0-9_-]{1,40}$/;
const SHA=/^[a-f0-9]{64}$/;
const CODES=new Set(["REQUEST_EVIDENCE_DEMO","POSSIBLY_RELATED_DEMO",
 "DISTINCT_RECORDS_DEMO","REOPEN_DEMO"]);
const REASONS=new Set(["IDENTIFIER_UNCLEAR_DEMO","LOCATION_UNCLEAR_DEMO",
 "PERIOD_UNCLEAR_DEMO","SOURCE_COMPARISON_DEMO",
 "MANUAL_ASSESSMENT_DEMO"]);
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const check=(s,re)=>typeof s==="string"&&re.test(s);
const clone=x=>structuredClone(x);

export function emptyDemoReviewLog(){
 return {schema:M13_S3_LOG_SCHEMA,synthetic:true,persistent:false,
  official_authorization:false,events:[]};
}

function sourceContext(context){
 if(!context||typeof context!=="object"||Array.isArray(context))
  fail("M13_S3_CONTEXT_INVALID");
 const board=buildDemoCandidateCrosswalk(context);
 if(board.schema!==M13_S2_SCHEMA||board.synthetic!==true||
    board.apel_source_reconciled!==false||
    board.isikhnas_source_reconciled!==false||
    board.official_authorization!==false)
  fail("M13_S3_CROSSWALK_UNTRUSTED");
 const candidates=new Map();
 for(const row of board.rows){
  const ev=context.events.find(e=>e.event_id===row.event_id);
  const report=context.dashboardFixture.ledger.records.find(r=>
   r.facility_id===row.facility_id&&r.period===row.period);
  const facility=context.dashboardFixture.facilities.find(f=>
   f.facility_id===row.facility_id);
  if(!ev||!report||!facility)fail("M13_S3_SOURCE_CHANGED");
  // Canonical set of carefully selected DEMO objects. A digest is only a
  // change detector: an attacker can forge fixture data and recompute it.
  const basis={
   schema:M13_S3_SCHEMA,source_snapshot:context.manifest.snapshot_id,
   source_revision:context.manifest.revision,
   source_capture_month:context.manifest.capture_month,
   candidate:row,event:ev,apel_report:report,facility
  };
  const basis_digest=createHash("sha256")
   .update(JSON.stringify(basis),"utf8").digest("hex");
  candidates.set(row.link_id,{row,basis_digest});
 }
 return {board,candidates};
}

function proposalsIndex(proposals,candidates){
 if(!Array.isArray(proposals)||proposals.length!==candidates.size||
    proposals.length>100)fail("M13_S3_PROPOSALS_INVALID");
 const index=new Map();
 for(const p of proposals){
  if(!exact(p,["link_id","proposer_id"])||
     !check(p.link_id,LINK)||!check(p.proposer_id,USER)||
     !candidates.has(p.link_id)||index.has(p.link_id))
   fail("M13_S3_PROPOSAL_INVALID");
  index.set(p.link_id,p.proposer_id);
 }
 return index;
}

function validatedHistory(log,candidates,proposers){
 if(!exact(log,["schema","synthetic","persistent",
      "official_authorization","events"])||
    log.schema!==M13_S3_LOG_SCHEMA||log.synthetic!==true||
    log.persistent!==false||log.official_authorization!==false||
    !Array.isArray(log.events)||log.events.length>100)
  fail("M13_S3_LOG_INVALID");
 const latest=new Map(),lastSequence=new Map();
 for(let i=0;i<log.events.length;i++){
  const event=log.events[i];
  if(!exact(event,["review_id","link_id","sequence",
        "reviewer_id","reviewer_role","action_code","reason_code",
        "basis_digest","officially_verified"])||
     event.review_id!=="DEMO-REVIEW-"+(i+1)||
     !check(event.link_id,LINK)||
     !Number.isSafeInteger(event.sequence)||
     !check(event.reviewer_id,USER)||
     event.reviewer_role!=="provinsi_verifikator"||
     !CODES.has(event.action_code)||!REASONS.has(event.reason_code)||
     !check(event.basis_digest,SHA)||
     event.officially_verified!==false||
     !candidates.has(event.link_id)||
     event.reviewer_id===proposers.get(event.link_id)||
     event.basis_digest!==candidates.get(event.link_id).basis_digest||
     event.sequence!==(lastSequence.get(event.link_id)??0)+1)
   fail("M13_S3_LOG_EVENT_INVALID");
  if(event.action_code==="REOPEN_DEMO"&&!latest.has(event.link_id))
   fail("M13_S3_REOPEN_INVALID");
  lastSequence.set(event.link_id,event.sequence);
  latest.set(event.link_id,event);
 }
 return {latest,lastSequence};
}
function stateFromAction(action){
 if(action==="REQUEST_EVIDENCE_DEMO")return "EVIDENCE_NEEDED_DEMO";
 if(action==="POSSIBLY_RELATED_DEMO")return "PLAUSIBLE_NOT_VERIFIED_DEMO";
 if(action==="DISTINCT_RECORDS_DEMO")return "POSSIBLY_DISTINCT_DEMO";
 return "OPEN_FOR_REVIEW_DEMO";
}

export function buildDemoHumanReviewBoard({
 context,proposals,reviewLog
}={}){
 const {board,candidates}=sourceContext(context);
 const proposers=proposalsIndex(proposals,candidates);
 const {latest}=validatedHistory(reviewLog,candidates,proposers);
 const rows=board.rows.map(candidate=>{
  const action=latest.get(candidate.link_id)?.action_code??null;
  return {
   link_id:candidate.link_id,period:candidate.period,
   facility_id:candidate.facility_id,
   review_state:action===null?"PENDING_REVIEW_DEMO":
    stateFromAction(action),
   has_review_note_demo:action!==null,
   candidate_keys_matched_demo:true,
   source_change_lock:"DIGEST_MATCHES_CURRENT_DEMO_SNAPSHOT",
   manual_review_required:true,
   proof_of_same_real_event:false,
   equivalence_approved:false,official_decision:null,
   disease_confirmed:false
  };
 });
 return {
  schema:M13_S3_SCHEMA,synthetic:true,mode:"REVIEW_NOTES_ONLY",
  rows:clone(rows),pending_notes_demo:rows.filter(x=>!x.has_review_note_demo).length,
  review_notes_demo:reviewLog.events.length,
  source_integrity_verified:false,source_authenticity_verified:false,
  official_links_count:null,official_case_count:null,
  official_review_completed:false,
  no_actor_identity_exposed:true,
  no_source_ledger_mutation:true,may_sync:false,
  may_write_database:false,may_approve:false,may_notify:false,
  may_confirm_disease:false,may_publish:false,may_deploy:false,
  official_authorization:false
 };
}

export function appendDemoHumanReviewNote({
 context,proposals,reviewLog,resolveReviewerSession,
 link_id,action_code,reason_code,expected_revision
}={}){
 const {candidates}=sourceContext(context);
 const proposers=proposalsIndex(proposals,candidates);
 const {latest,lastSequence}=validatedHistory(reviewLog,candidates,proposers);
 if(!check(link_id,LINK)||!candidates.has(link_id)||
    !CODES.has(action_code)||!REASONS.has(reason_code))
  fail("M13_S3_ACTION_INVALID");
 if(!Number.isSafeInteger(expected_revision)||
    expected_revision!==reviewLog.events.length)
  fail("M13_S3_REVISION_CONFLICT");
 const reviewer=backendPrincipal(resolveReviewerSession);
 if(reviewer.role!=="provinsi_verifikator"||
    reviewer.id===proposers.get(link_id))
  fail("ACCESS_DENIED");
 if(action_code==="REOPEN_DEMO"&&!latest.has(link_id))
  fail("M13_S3_REOPEN_INVALID");
 const event={
  review_id:"DEMO-REVIEW-"+(reviewLog.events.length+1),
  link_id,sequence:(lastSequence.get(link_id)??0)+1,
  reviewer_id:reviewer.id,reviewer_role:reviewer.role,
  action_code,reason_code,
  basis_digest:candidates.get(link_id).basis_digest,
  officially_verified:false
 };
 // Pure in-memory next version, never writes to DB, files, API or queue.
 return {
  ...clone(reviewLog),
  events:[...clone(reviewLog.events),event]
 };
}
