/**
 * M00-G5 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | NO DATABASE.
 * Paired M13-S3 review + audit envelopes for a FUTURE server transaction.
 * SHA-256 here is a change detector, not an authentication/MAC/signature.
 */
import {createHash} from "node:crypto";
import {buildDemoHumanReviewBoard,appendDemoHumanReviewNote,
 M13_S3_SCHEMA,M13_S3_LOG_SCHEMA}
 from "../m13-crosswalk-review/review.mjs";

export const M00_G5_SCHEMA="M00-G5-AUDIT-PORT-UNTESTED-1";
export const M00_G5_JOURNAL_SCHEMA="M00-G5-INMEMORY-JOURNAL-UNTESTED-1";
const ZERO="0".repeat(64),HEX=/^[a-f0-9]{64}$/;
const fail=code=>{throw Error(code);};
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const COPY=x=>structuredClone(x);

export function emptyDemoAuditJournal(){
 return {schema:M00_G5_JOURNAL_SCHEMA,synthetic:true,
  persistent:false,official_authorization:false,events:[]};
}

function hashEvent(e){
 const {event_digest,...payload}=e;
 return createHash("sha256").update(JSON.stringify(payload),"utf8").digest("hex");
}

function validatePairedReview({context,proposals,reviewLog,auditJournal}){
 // The M13-S3 board rechecks candidates, permissions, source snapshots and
 // the review log's complete internal revision history.
 const board=buildDemoHumanReviewBoard({context,proposals,reviewLog});
 if(board.schema!==M13_S3_SCHEMA||board.synthetic!==true||
    board.official_authorization!==false||
    reviewLog?.schema!==M13_S3_LOG_SCHEMA||
    !exact(auditJournal,["schema","synthetic","persistent",
      "official_authorization","events"])||
    auditJournal.schema!==M00_G5_JOURNAL_SCHEMA||
    auditJournal.synthetic!==true||
    auditJournal.persistent!==false||
    auditJournal.official_authorization!==false||
    !Array.isArray(auditJournal.events)||
    auditJournal.events.length>100||
    auditJournal.events.length!==reviewLog.events.length)
  fail("M00_G5_STREAM_MISMATCH");
 let previous=ZERO;
 for(let i=0;i<auditJournal.events.length;i++){
  const a=auditJournal.events[i],r=reviewLog.events[i];
  if(!exact(a,["audit_id","review_id","link_id","sequence",
    "reviewer_id","action_code","reason_code","basis_digest",
    "previous_digest","event_digest","official_authorization"])||
    a.audit_id!=="DEMO-AUDIT-"+(i+1)||
    a.review_id!==r.review_id||
    a.link_id!==r.link_id||
    a.sequence!==i+1||
    a.reviewer_id!==r.reviewer_id||
    a.action_code!==r.action_code||
    a.reason_code!==r.reason_code||
    a.basis_digest!==r.basis_digest||
    a.previous_digest!==previous||
    typeof a.event_digest!=="string"||!HEX.test(a.event_digest)||
    a.event_digest!==hashEvent(a)||
    a.official_authorization!==false)
   fail("M00_G5_AUDIT_CHAIN_INVALID");
  previous=a.event_digest;
 }
 return {board,head_digest:previous};
}

export function prepareDemoAuditedReview({
 context,proposals,reviewLog,auditJournal,
 resolveReviewerSession,link_id,action_code,reason_code,
 expected_revision,expected_audit_revision
}={}){
 const {head_digest}=validatePairedReview({
  context,proposals,reviewLog,auditJournal
 });
 if(!Number.isSafeInteger(expected_revision)||
    !Number.isSafeInteger(expected_audit_revision)||
    expected_revision!==reviewLog.events.length||
    expected_audit_revision!==auditJournal.events.length)
  fail("M00_G5_REVISION_CONFLICT");
 // Validates the demo actor, separates proposer/reviewer and denies stale
 // source data using M13-S3. It only builds a new in-memory review log.
 const nextReview=appendDemoHumanReviewNote({
  context,proposals,reviewLog,resolveReviewerSession,
  link_id,action_code,reason_code,expected_revision
 });
 if(nextReview.events.length!==reviewLog.events.length+1)
  fail("M00_G5_REVIEW_TRANSITION_INVALID");
 const r=nextReview.events.at(-1),seq=auditJournal.events.length+1;
 const partial={
  audit_id:"DEMO-AUDIT-"+seq,
  review_id:r.review_id,link_id:r.link_id,sequence:seq,
  reviewer_id:r.reviewer_id,action_code:r.action_code,
  reason_code:r.reason_code,basis_digest:r.basis_digest,
  previous_digest:head_digest,official_authorization:false
 };
 const event={...partial,event_digest:hashEvent(partial)};
 // Keep output event key order stable as validated in validatePairedReview.
 const ordered={
  audit_id:event.audit_id,review_id:event.review_id,
  link_id:event.link_id,sequence:event.sequence,
  reviewer_id:event.reviewer_id,action_code:event.action_code,
  reason_code:event.reason_code,basis_digest:event.basis_digest,
  previous_digest:event.previous_digest,event_digest:event.event_digest,
  official_authorization:event.official_authorization
 };
 // Compute final hash using the order used by validator's rest payload.
 ordered.event_digest=hashEvent(ordered);
 const nextAudit={...COPY(auditJournal),
  events:[...COPY(auditJournal.events),ordered]};
 return {
  schema:M00_G5_SCHEMA,synthetic:true,
  mode:"TRANSACTION_INPUT_PREVIEW_ONLY",
  nextReviewLog:nextReview,nextAuditJournal:nextAudit,
  expected_revision,expected_audit_revision,
  next_revision:nextReview.events.length,
  persistence_attempted:false,transaction_committed:false,
  security_review_completed:false,source_authenticity_verified:false,
  state_consistency_proven:false,
  may_write_database:false,may_publish:false,may_approve:false,
  may_deploy:false,official_authorization:false
 };
}

export function readDemoAuditSummary({
 context,proposals,reviewLog,auditJournal
}={}){
 const {board,head_digest}=validatePairedReview({
  context,proposals,reviewLog,auditJournal
 });
 return {
  schema:M00_G5_SCHEMA,synthetic:true,
  mode:"AUDIT_JOURNAL_IN_MEMORY_ONLY",
  recorded_review_notes_demo:board.review_notes_demo,
  recorded_audit_events_demo:auditJournal.events.length,
  chain_links_consistent_demo:true,
  journal_digest_present_demo:head_digest!==ZERO,
  durable_audit_proven:false,immutable_storage_proven:false,
  source_authenticated:false,identity_authenticated:false,
  reviewer_identity_exposed:false,official_decision_count:null,
  may_export:false,may_write_database:false,may_approve:false,
  may_publish:false,may_deploy:false,official_authorization:false
 };
}

export function draftAtomicCommitContract(){
 return Object.freeze({
  schema:M00_G5_SCHEMA,synthetic:true,
  schema_file:"drafts/m00-audit-port/001_audit_append_only.sql",
  transaction:[
   "SERVER_AUTHENTICATE_AND_AUTHORIZE",
   "BEGIN_IMMEDIATE_DATABASE_TRANSACTION",
   "CHECK_SOURCE_REVISION_AND_AUDIT_HEAD",
   "APPEND_REVIEW_AND_AUDIT_IN_ONE_TRANSACTION",
   "COMMIT_OR_ROLLBACK_ALL"
  ],
  data_owner_permissions_checked_in_production:false,
  sql_executed:false,db_connection_present:false,
  atomicity_proven:false,immutability_proven:false,
  transaction_writer_implemented:false,ready_for_production:false
 });
}
