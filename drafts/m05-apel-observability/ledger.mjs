/**
 * M05-13 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * In-memory append-only proposal for synthetic event metadata.
 * No clock/crypto persistence, actual audit assurances, source reads or telemetry.
 */
import {annualPolicy,requireYear} from "../m05-apel-multiyear/policy.mjs";
import {parsePeriod} from "../m05-apel-multiyear/reporting.mjs";
import {isDemoId} from "../m05-apel-evidence/evidence.mjs";
import {M05_13_SIGNALS,M05_13_SEVERITIES,
 M05_13_OBSERVATION_CODES} from "./catalog.mjs";

export const M05_13_LEDGER_SCHEMA="M05-13-SYNTHETIC-AUDIT-LEDGER-UNTESTED-1";
const fail=code=>{throw Error(code)};
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const ID=/^DEMO-EVT-[A-Z0-9_-]{1,48}$/;
const FIELDS=["event_id","snapshot_id","facility_id",
 "period","signal_id","severity","observation_code"];
const exact=(v,keys)=>v!==null&&typeof v==="object"&&!Array.isArray(v)&&
 Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const zero={may_run_tests:false,may_connect:false,may_query:false,
 may_write:false,may_repair:false,may_notify:false,may_publish:false,
 may_score:false,may_rank:false,may_award:false,may_merge:false,
 may_deploy:false,official_authorization:false};
export const M05_13_DENIED_ACTIONS=Object.freeze(Object.keys(zero));
export function assertNoAuditAuthority(o){
 return M05_13_DENIED_ACTIONS.every(k=>o?.[k]===false);
}
export function emptyDemoAuditLedger({year,snapshot_id}={}){
 requireYear(year);
 if(!isDemoId(snapshot_id)||!snapshot_id.startsWith("DEMO-SNAP-"))
  fail("M05_13_SNAPSHOT_INVALID");
 return {schema:M05_13_LEDGER_SCHEMA,synthetic:true,
  mode:"IN_MEMORY_METADATA_NO_TRUSTED_AUDIT",
  year,snapshot_id,policy_draft_version:annualPolicy(year).draft_rule_version,
  events:[],counts:{events:0,by_severity:{INFO:0,REVIEW:0,URGENT_REVIEW:0}},
  last_sequence:0,history_verified:false,persistent:false,
  clock_trusted:false,raw_payload_stored:false,
  official_incident_count:0,monitoring_activated:false,...zero};
}
function eventInputOk(x,year,snapshot_id){
 if(!exact(x,FIELDS)||!ID.test(x.event_id)||
  x.snapshot_id!==snapshot_id||!FAC.test(x.facility_id)||
  !M05_13_SIGNALS.some(s=>s.signal_id===x.signal_id)||
  !M05_13_SEVERITIES.includes(x.severity)||
  !M05_13_OBSERVATION_CODES.includes(x.observation_code))
  fail("M05_13_EVENT_INVALID");
 let parsed;try{parsed=parsePeriod(x.period);}catch{
  fail("M05_13_PERIOD_INVALID");
 }
 if(parsed.year!==year)fail("M05_13_YEAR_MISMATCH");
}
function appendUnchecked(ledger,observations){
 const ids=new Set(ledger.events.map(x=>x.event_id));
 const events=ledger.events.map(x=>({...x}));
 for(const x of observations){
  eventInputOk(x,ledger.year,ledger.snapshot_id);
  if(ids.has(x.event_id))fail("M05_13_DUPLICATE_EVENT_ID");
  ids.add(x.event_id);
  const sequence=events.length+1;
  const signal=M05_13_SIGNALS.find(s=>s.signal_id===x.signal_id);
  events.push({...x,
   sequence,event_key:ledger.snapshot_id+"|"+String(sequence).padStart(4,"0"),
   domain:signal.domain,required_evidence_id:signal.requirement_id,
   suggested_rollback_condition:signal.rollback_condition_id,
   event_status:"UNVERIFIED_SYNTHETIC_OBSERVATION",
   source_evidence_ref:null,actor_id:null,received_at:null,
   external_log_ref:null,officially_verified:false,
   incident_confirmed:false,raw_payload_stored:false,
   external_notification_sent:false,source_modified:false});
 }
 return {...ledger,events,last_sequence:events.length,
  counts:{events:events.length,by_severity:Object.fromEntries(
   M05_13_SEVERITIES.map(k=>[k,events.filter(e=>e.severity===k).length]))}};
}
export function assertDemoAuditLedger(ledger){
 if(ledger?.schema!==M05_13_LEDGER_SCHEMA||ledger?.synthetic!==true||
  ledger?.mode!=="IN_MEMORY_METADATA_NO_TRUSTED_AUDIT"||
  !assertNoAuditAuthority(ledger)||
  ledger?.history_verified!==false||ledger?.persistent!==false||
  ledger?.clock_trusted!==false||ledger?.raw_payload_stored!==false||
  ledger?.monitoring_activated!==false||ledger?.official_incident_count!==0||
  !Array.isArray(ledger?.events)||ledger.events.length>250)
  fail("M05_13_LEDGER_INVALID");
 const expected=appendUnchecked(emptyDemoAuditLedger({
  year:ledger.year,snapshot_id:ledger.snapshot_id}),
  ledger.events.map(x=>Object.fromEntries(FIELDS.map(k=>[k,x[k]]))));
 if(JSON.stringify(ledger)!==JSON.stringify(expected))
  fail("M05_13_LEDGER_TAMPERED");
 return true;
}
export function appendDemoObservations({ledger,observations=[]}={}){
 assertDemoAuditLedger(ledger);
 if(!Array.isArray(observations)||observations.length>50||
  ledger.events.length+observations.length>250)
  fail("M05_13_BATCH_INVALID");
 return appendUnchecked(ledger,observations);
}
