/**
 * M00-G8 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | SYNTHETIC.
 * Read-only format bridge. DOES NOT verify original G5/G7 source hashes,
 * session, actor authority, territorial access, DB state, or provenance.
 * Digest of normalized data is NEVER a replacement for legacy head hashes.
 */
import {createHash} from "node:crypto";

export const G8_SCHEMA="M00-G8-INTEROP-PREVIEW-UNTESTED-1";
export const G8_DOMAIN="YANDIK_DEMO_AUDIT_BRIDGE_V1";
const ZERO="0".repeat(64);
const K5=["audit_id","review_id","link_id","sequence","reviewer_id",
 "action_code","reason_code","basis_digest","previous_digest",
 "event_digest","official_authorization"];
const K7=["event_id","link_id","revision","reviewer_id",
 "action_code","reason_code","basis_digest","previous_digest",
 "event_digest","is_official"];
const LINK=/^DEMO-CROSSWALK-[A-Z0-9_-]{1,28}$/;
const USER=/^DEMO-USER-[A-Z0-9_-]{1,40}$/;
const HEX=/^[a-f0-9]{64}$/;
const EVENT=/^DEMO-AUDIT-[A-Z0-9_-]{1,32}$/;
const ACTIONS=new Set(["REQUEST_EVIDENCE_DEMO","POSSIBLY_RELATED_DEMO",
 "DISTINCT_RECORDS_DEMO","REOPEN_DEMO"]);
const REASONS=new Set(["IDENTIFIER_UNCLEAR_DEMO","LOCATION_UNCLEAR_DEMO",
 "PERIOD_UNCLEAR_DEMO","SOURCE_COMPARISON_DEMO",
 "MANUAL_ASSESSMENT_DEMO"]);
const fail=()=>{throw Error("M00_G8_FORMAT_DENIED");};
const exact=(o,keys)=>o!==null&&typeof o==="object"&&!Array.isArray(o)&&
 Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
const matches=(x,p)=>typeof x==="string"&&p.test(x);
const hash=x=>createHash("sha256").update(x,"utf8").digest("hex");

/** Fixed ASCII-only JSON-array encoding; no JSON object key ordering risk. */
export function canonicalDemoBridgeRecord({
 link_id,revision,reviewer_id,action_code,reason_code,
 basis_digest,previous_bridge_digest
}={}){
 if(!matches(link_id,LINK)||!Number.isSafeInteger(revision)||
    revision<1||revision>100||
    !matches(reviewer_id,USER)||!ACTIONS.has(action_code)||
    !REASONS.has(reason_code)||!matches(basis_digest,HEX)||
    !matches(previous_bridge_digest,HEX))fail();
 return JSON.stringify([G8_DOMAIN,link_id,revision,reviewer_id,
  action_code,reason_code,basis_digest,previous_bridge_digest,false]);
}

function validatedSource(kind,source,index,link){
 if(kind!=="G5_LEGACY_DEMO"&&kind!=="G7_LEGACY_DEMO")fail();
 const five=kind==="G5_LEGACY_DEMO";
 if(!exact(source,five?K5:K7)||
    !matches(source.link_id,LINK)||
    (link!==null&&source.link_id!==link)||
    !matches(source.reviewer_id,USER)||
    !ACTIONS.has(source.action_code)||
    !REASONS.has(source.reason_code)||
    !matches(source.basis_digest,HEX)||
    !matches(source.previous_digest,HEX)||
    !matches(source.event_digest,HEX))fail();
 if(five){
  if(source.audit_id!=="DEMO-AUDIT-"+index||
     source.review_id!=="DEMO-REVIEW-"+index||
     source.sequence!==index||
     source.official_authorization!==false)fail();
 }else{
  if(!matches(source.event_id,EVENT)||
     source.revision!==index||source.is_official!==0)fail();
 }
 return source.link_id;
}

export function normalizeLegacyDemoAudit({source_kind,events}={}){
 if(!["G5_LEGACY_DEMO","G7_LEGACY_DEMO"].includes(source_kind)||
    !Array.isArray(events)||events.length<1||events.length>100)fail();
 let link=null,previous=ZERO;
 const records=[];
 for(let i=0;i<events.length;i++){
  const e=events[i],idx=i+1;
  link=validatedSource(source_kind,e,idx,link);
  const canonical=canonicalDemoBridgeRecord({
   link_id:link,revision:idx,reviewer_id:e.reviewer_id,
   action_code:e.action_code,reason_code:e.reason_code,
   basis_digest:e.basis_digest,previous_bridge_digest:previous
  });
  previous=hash(canonical);
  records.push({link_id:link,revision_demo:idx,bridge_digest:previous});
 }
 return {
  schema:G8_SCHEMA,synthetic:true,
  mode:"READ_ONLY_FORMAT_NORMALIZATION_DEMO",
  source_kind,link_id:link,record_count_demo:records.length,
  records,bridge_head_digest:previous,
  original_source_digests_validated:false,
  original_source_chain_validated:false,
  original_source_revisions_authenticated:false,
  cross_language_digest_is_official:false,
  source_permission_verified:false,identity_authenticated:false,
  production_import_allowed:false,migration_approved:false,
  no_source_rewrite:true,may_write:false,may_sync:false,
  may_approve:false,may_publish:false,may_deploy:false,
  official_authorization:false
 };
}

export function compareDemoAuditPorts({g5_events,g7_rows}={}){
 const g5=normalizeLegacyDemoAudit({
  source_kind:"G5_LEGACY_DEMO",events:g5_events});
 const g7=normalizeLegacyDemoAudit({
  source_kind:"G7_LEGACY_DEMO",events:g7_rows});
 return {
  schema:G8_SCHEMA,synthetic:true,
  format_only_parity_demo:g5.link_id===g7.link_id&&
   g5.record_count_demo===g7.record_count_demo&&
   g5.records.every((e,i)=>e.bridge_digest===g7.records[i].bridge_digest),
  g5_record_count_demo:g5.record_count_demo,
  g7_record_count_demo:g7.record_count_demo,
  source_integrity_proven:false,audit_immutability_proven:false,
  evidence_of_same_authenticated_journal:false,
  migration_safe:false,may_write:false,may_deploy:false,
  official_authorization:false
 };
}
