/**
 * M04-I6C | KODE DITULIS, BELUM DIUJI.
 * In-memory PLAN-ONLY recovery journal with a tamper-evident hash chain.
 * The hash chain is NOT a digital signature or durable audit trail.
 */
import {createHash} from "node:crypto";
import {I6C_SNAPSHOT_SCHEMA} from "./snapshot.mjs";
export const I6C_JOURNAL_SCHEMA="M04-I6C-RECOVERY-JOURNAL-UNTESTED-1";
export const STEPS=Object.freeze([
 "risiko_dicatat","backup_direncanakan","restore_direncanakan",
 "ditelaah_demo","rancangan_dibekukan"
]);
export const FAILURE_KINDS=Object.freeze([
 "sumber_berubah","target_berubah","backup_gagal","restore_gagal",
 "jurnal_rusak","cutover_terputus","otorisasi_tidak_sah"
]);
const fail=code=>{throw Error(code)};
const code=(x,re,label)=>{if(typeof x!=="string"||!re.test(x))fail(label+"_INVALID");return x};
const SHA=/^[a-f0-9]{64}$/;
const RUN=/^DEMO-I6C-RUN-[A-Z0-9_-]{1,32}$/;
const ACTOR=/^DEMO-USER-[A-Z0-9_-]{1,40}$/;
const EVENT=/^DEMO-I6C-EVENT-[A-Z0-9_-]{1,40}$/;
const hash=x=>createHash("sha256").update(JSON.stringify(x),"utf8").digest("hex");
const planOnly=()=>({may_write:false,may_restore:false,may_cutover:false,
 official_authorization:false});
export function createRecoveryJournal(readiness,runId,preparedBy) {
 if(!readiness||readiness.schema!==I6C_SNAPSHOT_SCHEMA||
    readiness.synthetic!==true||readiness.may_write!==false||
    readiness.atomic_snapshot_proven!==false||
    readiness.official_authorization!==false||
    !SHA.test(readiness.manifest_sha256))fail("RECOVERY_READINESS_INVALID");
 const run_id=code(runId,RUN,"RUN_ID"),prepared_by=code(preparedBy,ACTOR,"PREPARER");
 return {schema:I6C_JOURNAL_SCHEMA,synthetic:true,run_id,
  manifest_sha256:readiness.manifest_sha256,prepared_by,
  revision:0,status:"rancangan",events:[],tip:"0".repeat(64),
  ...planOnly()};
}
export function verifyRecoveryJournal(journal){
 if(!journal||journal.schema!==I6C_JOURNAL_SCHEMA||
    journal.synthetic!==true||!RUN.test(journal.run_id)||
    !ACTOR.test(journal.prepared_by)||!SHA.test(journal.manifest_sha256)||
    !Array.isArray(journal.events)||!Number.isSafeInteger(journal.revision)||
    journal.revision!==journal.events.length||
    journal.may_write!==false||journal.may_restore!==false||
    journal.may_cutover!==false||journal.official_authorization!==false)
  fail("JOURNAL_INVALID");
 let previous="0".repeat(64);
 const seen=new Set();
 for(let i=0;i<journal.events.length;i++){
  const e=journal.events[i],step=STEPS[i];
  if(!e||e.revision!==i+1||e.step!==step||!EVENT.test(e.event_id)||
     seen.has(e.event_id)||!ACTOR.test(e.actor_id)||e.previous_hash!==previous||
     typeof e.note!=="string"||e.note.trim()!==e.note||
     e.note.length<10||e.note.length>400||!SHA.test(e.hash))
    fail("JOURNAL_EVENT_INVALID");
  if(i===0&&e.actor_id!==journal.prepared_by)fail("JOURNAL_PREPARER_MISMATCH");
  if(step==="ditelaah_demo"&&e.actor_id===journal.prepared_by)
   fail("JOURNAL_REVIEW_SEPARATION");
  const {hash:ignored,...body}=e;
  const calculated=hash(body);
  if(calculated!==e.hash)fail("JOURNAL_CHAIN_INVALID");
  previous=e.hash;seen.add(e.event_id);
 }
 if(journal.tip!==previous||journal.status!==
    (journal.events.length===STEPS.length?"rancangan_dibekukan_demo":"rancangan"))
  fail("JOURNAL_STATE_INVALID");
 return true;
}
export function appendRecoveryPlan(journal,{event_id,expected_revision,step,actor_id,note}){
 verifyRecoveryJournal(journal);
 if(expected_revision!==journal.revision)fail("JOURNAL_REVISION_CONFLICT");
 if(journal.events.length>=STEPS.length)fail("JOURNAL_FROZEN");
 if(step!==STEPS[journal.events.length])fail("JOURNAL_STEP_OUT_OF_ORDER");
 code(event_id,EVENT,"EVENT_ID");code(actor_id,ACTOR,"ACTOR");
 if(typeof note!=="string"||note.trim()!==note||
    note.length<10||note.length>400)fail("JOURNAL_NOTE_INVALID");
 if(journal.events.some(e=>e.event_id===event_id))fail("JOURNAL_DUPLICATE_EVENT");
 if(step==="ditelaah_demo"&&actor_id===journal.prepared_by)
  fail("JOURNAL_REVIEW_SEPARATION");
 const event={event_id,revision:journal.revision+1,step,actor_id,
  note,previous_hash:journal.tip};
 event.hash=hash(event);
 const next={...journal,revision:journal.revision+1,
  events:[...journal.events.map(e=>({...e})),event],tip:event.hash,
  status:step==="rancangan_dibekukan"?"rancangan_dibekukan_demo":"rancangan",
  ...planOnly()};
 verifyRecoveryJournal(next);
 return next;
}
export function failureResponsePlan(journal,kind) {
 verifyRecoveryJournal(journal);
 if(!FAILURE_KINDS.includes(kind))fail("FAILURE_KIND_INVALID");
 return {schema:I6C_JOURNAL_SCHEMA,synthetic:true,run_id:journal.run_id,
  failure_kind:kind,action:"HENTIKAN_DAN_TINJAU_MANUAL",
  preserve_source:true,preserve_target:true,preserve_archives:true,
  require_backup_restore_evidence:true,require_human_review:true,
  ...planOnly()};
}
