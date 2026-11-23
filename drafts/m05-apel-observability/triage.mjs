/**
 * M05-13 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Triage proposals do not notify people, confirm incidents, or modify sources.
 */
import {isDemoId} from "../m05-apel-evidence/evidence.mjs";
import {M05_13_SIGNALS,M05_13_SEVERITIES} from "./catalog.mjs";
import {assertDemoAuditLedger,assertNoAuditAuthority,
 M05_13_DENIED_ACTIONS} from "./ledger.mjs";
export const M05_13_TRIAGE_SCHEMA="M05-13-TRIAGE-NOTES-UNTESTED-1";
export const M05_13_BOARD_SCHEMA="M05-13-OBSERVABILITY-BOARD-UNTESTED-1";
export const M05_13_HANDOFF_SCHEMA="M05-13-OBSERVABILITY-HANDOFF-UNTESTED-1";
export const M05_13_TRIAGE_ACTIONS=Object.freeze([
 "REQUEST_SOURCE_REVIEW","REQUEST_SCHEMA_REVIEW",
 "REQUEST_POLICY_REVIEW","ESCALATE_TO_HUMAN_REVIEW",
 "DEFER_UNTIL_AUTHORIZED"
]);
export const M05_13_TRIAGE_REASONS=Object.freeze([
 "DEMO_NO_TRUSTED_LOG","DEMO_MISSING_SOURCE_EVIDENCE",
 "DEMO_UNVERIFIED_POLICY","DEMO_MISSINGNESS_CONFLICT",
 "DEMO_POSSIBLE_DUPLICATE","DEMO_SECURITY_REVIEW_PENDING",
 "DEMO_RESTORE_UNVERIFIED","DEMO_NEEDS_REVIEW"
]);
const FIELDS=["note_id","snapshot_id","event_id","reviewer_id",
 "action_code","reason_code"];
const fail=code=>{throw Error(code)};
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const denied=()=>Object.fromEntries(M05_13_DENIED_ACTIONS.map(k=>[k,false]));
export function buildDemoObservabilityBoard({ledger}={}){
 assertDemoAuditLedger(ledger);
 const signals=M05_13_SIGNALS.map(s=>{
  const events=ledger.events.filter(e=>e.signal_id===s.signal_id);
  return {signal_id:s.signal_id,domain:s.domain,
   requirement_id:s.requirement_id,
   suggested_rollback_condition:s.rollback_condition_id,
   observations_demo:events.length,
   most_recent_demo_sequence:events.at(-1)?.sequence??null,
   review_state:events.length?"HUMAN_REVIEW_NEEDED":"NOT_MEASURED",
   actual_signal_state:"UNKNOWN_NO_LIVE_SOURCE",
   threshold_verified:false,incident_confirmed:false,
   external_notification_sent:false};
 });
 const uncovered=signals.filter(s=>s.observations_demo===0).length;
 return {schema:M05_13_BOARD_SCHEMA,synthetic:true,
  mode:"READ_ONLY_NON_LIVE_DEMO_BOARD",
  year:ledger.year,snapshot_id:ledger.snapshot_id,
  policy_draft_version:ledger.policy_draft_version,
  signals,counts:{signals:signals.length,
   signals_without_demo_observation:uncovered,
   synthetic_observations:ledger.events.length,
   officially_confirmed_incidents:0,notifications_sent:0},
  health:"NOT_MEASURED",monitoring_activated:false,
  no_observation_is_not_healthy:true,
  overall_status:"UNVERIFIED_NO_LIVE_MONITORING",
  ...denied()};
}
export function buildDemoTriageNotes({ledger,notes=[]}={}){
 assertDemoAuditLedger(ledger);
 if(!Array.isArray(notes)||notes.length>100)fail("M05_13_NOTES_INVALID");
 const seen=new Set();
 const accepted=notes.map(n=>{
  if(!exact(n,FIELDS)||!isDemoId(n.note_id)||
   !isDemoId(n.reviewer_id)||n.snapshot_id!==ledger.snapshot_id||
   !ledger.events.some(e=>e.event_id===n.event_id)||
   !M05_13_TRIAGE_ACTIONS.includes(n.action_code)||
   !M05_13_TRIAGE_REASONS.includes(n.reason_code))
   fail("M05_13_NOTE_INVALID");
  if(seen.has(n.note_id))fail("M05_13_DUPLICATE_NOTE");
  seen.add(n.note_id);
  return {...n,official_incident:false,resolved:false,
   notification_sent:false,source_modified:false,
   assigned_real_person:false};
 });
 const events=ledger.events.map(e=>({
  event_id:e.event_id,signal_id:e.signal_id,
  severity:e.severity,sequence:e.sequence,
  note_count:accepted.filter(n=>n.event_id===e.event_id).length,
  review_state:"OPEN_UNVERIFIED",official_incident:false,
  officially_resolved:false}));
 return {schema:M05_13_TRIAGE_SCHEMA,synthetic:true,
  mode:"NON_OPERATIONAL_HUMAN_TRIAGE_REQUESTS",
  year:ledger.year,snapshot_id:ledger.snapshot_id,notes:accepted,events,
  counts:{observations:events.length,notes:accepted.length,
   open_unverified:events.length,confirmed_incidents:0,
   resolved:0,notifications_sent:0},
  no_assigned_real_owner:true,source_data_unchanged:true,
  ...denied()};
}
export function buildDemoObservabilityHandoff({ledger,board,triage}={}){
 assertDemoAuditLedger(ledger);
 if(board?.schema!==M05_13_BOARD_SCHEMA||board?.synthetic!==true||
  board?.mode!=="READ_ONLY_NON_LIVE_DEMO_BOARD"||
  board?.snapshot_id!==ledger.snapshot_id||board?.year!==ledger.year||
  !assertNoAuditAuthority(board)||
  !Array.isArray(board?.signals))
  fail("M05_13_BOARD_INVALID");
 const expectedBoard=buildDemoObservabilityBoard({ledger});
 if(JSON.stringify(board)!==JSON.stringify(expectedBoard))
  fail("M05_13_BOARD_TAMPERED");
 if(triage?.schema!==M05_13_TRIAGE_SCHEMA||
  triage?.synthetic!==true||
  triage?.mode!=="NON_OPERATIONAL_HUMAN_TRIAGE_REQUESTS"||
  triage?.snapshot_id!==ledger.snapshot_id||triage?.year!==ledger.year||
  !assertNoAuditAuthority(triage)||
  !Array.isArray(triage?.notes))
  fail("M05_13_TRIAGE_INVALID");
 const rebuilt=buildDemoTriageNotes({ledger,
  notes:triage.notes.map(n=>
   Object.fromEntries(FIELDS.map(k=>[k,n[k]])))});
 if(JSON.stringify(triage)!==JSON.stringify(rebuilt))
  fail("M05_13_TRIAGE_TAMPERED");
 const severityCounts=Object.fromEntries(M05_13_SEVERITIES.map(k=>
  [k,ledger.events.filter(e=>e.severity===k).length]));
 return {schema:M05_13_HANDOFF_SCHEMA,synthetic:true,
  mode:"DEMO_HANDOFF_NO_ALERTS_OR_CHANGES",
  year:ledger.year,snapshot_id:ledger.snapshot_id,
  signal_gaps:expectedBoard.signals.filter(s=>
   s.observations_demo===0).map(x=>x.signal_id),
  review_queue:rebuilt.events.map(e=>({
   ...e,proposed_action_required:e.note_count>0,
   assignee_ref:null,deadline:null,official_decision:null})),
  by_severity:severityCounts,
  counts:{synthetic_observations:ledger.events.length,
   unobserved_signals:expectedBoard.counts.signals_without_demo_observation,
   notes:rebuilt.notes.length,confirmed_incidents:0,
   alerts_dispatched:0,official_closures:0},
  external_links:[],evidence_payloads:[],
  status:"BLOCKED_NOT_MONITORING_PRODUCTION",
  no_data_does_not_mean_healthy:true,
  may_close_incident:false,may_send_alert:false,
  ...denied()};
}
