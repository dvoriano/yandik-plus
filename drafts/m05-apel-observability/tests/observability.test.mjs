/** M05-13 | QA WRITTEN, ZERO EXECUTED | CODE_ONLY | DEMO ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {M05_13_SIGNALS,observabilityCatalog,
 M05_13_SEVERITIES,M05_13_OBSERVATION_CODES} from "../catalog.mjs";
import {emptyDemoAuditLedger,appendDemoObservations,
 assertDemoAuditLedger,M05_13_DENIED_ACTIONS}
 from "../ledger.mjs";
import {buildDemoObservabilityBoard,buildDemoTriageNotes,
 buildDemoObservabilityHandoff,M05_13_TRIAGE_ACTIONS}
 from "../triage.mjs";
import {annualPolicy} from "../../m05-apel-multiyear/policy.mjs";

const snap="DEMO-SNAP-OBS-1";
const ledger=(year=2026,snapshot_id=snap)=>emptyDemoAuditLedger({
 year,snapshot_id});
const event=(id="DEMO-EVT-ONE",extra={})=>({
 event_id:id,snapshot_id:snap,facility_id:"DEMO-PSW-ONE",
 period:"2026-07",signal_id:"MISSING_VS_ZERO",
 severity:"REVIEW",observation_code:"DEMO_MISSINGNESS_REVIEW",...extra});
const withEvents=(...events)=>appendDemoObservations({
 ledger:ledger(),observations:events});
const note=(id="DEMO-NOTE-1",extra={})=>({
 note_id:id,snapshot_id:snap,event_id:"DEMO-EVT-ONE",
 reviewer_id:"DEMO-REVIEWER-1",
 action_code:"REQUEST_SOURCE_REVIEW",
 reason_code:"DEMO_MISSINGNESS_CONFLICT",...extra});
const triage=(l,notes=[])=>buildDemoTriageNotes({ledger:l,notes});
const board=l=>buildDemoObservabilityBoard({ledger:l});
const handoff=(l,notes=[])=>buildDemoObservabilityHandoff({
 ledger:l,board:board(l),triage:triage(l,notes)});

test("M05-13 catalogs exactly twelve questions",()=>{
 assert.equal(M05_13_SIGNALS.length,12);
});
test("M05-13 signal IDs are unique",()=>{
 assert.equal(new Set(M05_13_SIGNALS.map(s=>s.signal_id)).size,12);
});
test("M05-13 links each signal to a source evidence requirement",()=>{
 assert.ok(M05_13_SIGNALS.every(s=>s.requirement_id));
});
test("M05-13 maps each signal to a rollback condition for human review",()=>{
 assert.ok(M05_13_SIGNALS.every(s=>s.rollback_condition_id));
});
test("M05-13 report revision consistency is represented",()=>{
 assert.ok(M05_13_SIGNALS.some(s=>s.signal_id==="REPORT_REVISION_LINK"));
});
test("M05-13 missing versus explicit zero is represented",()=>{
 assert.ok(M05_13_SIGNALS.some(s=>s.signal_id==="MISSING_VS_ZERO"));
});
test("M05-13 historical district attribution is represented",()=>{
 assert.ok(M05_13_SIGNALS.some(s=>s.signal_id==="REGION_AS_OF_MONTH"));
});
test("M05-13 2026 investigation and kurban service grain are represented",()=>{
 const names=M05_13_SIGNALS.map(s=>s.signal_id);
 assert.ok(names.includes("INVESTIGATION_EVENT_LOCATION"));
 assert.ok(names.includes("KURBAN_SINGLE_ANIMAL"));
});
test("M05-13 signals cannot claim approved alert thresholds",()=>{
 assert.ok(observabilityCatalog().signals.every(s=>
  s.threshold_approved===false));
});
test("M05-13 catalog is not live monitoring",()=>{
 const c=observabilityCatalog();
 assert.equal(c.monitoring_activated,false);
 assert.equal(c.counts.connected_sources,0);
});
test("M05-13 severity vocabulary cannot assert production emergency",()=>{
 assert.deepEqual(M05_13_SEVERITIES,["INFO","REVIEW","URGENT_REVIEW"]);
});
test("M05-13 observations only use enumerated synthetic codes",()=>{
 assert.ok(M05_13_OBSERVATION_CODES.every(x=>x.startsWith("DEMO_")));
});
test("M05-13 empty ledger has no incident claims",()=>{
 const l=ledger();assert.equal(l.events.length,0);
 assert.equal(l.official_incident_count,0);
});
test("M05-13 empty ledger lacks trusted clock and persistence",()=>{
 const l=ledger();
 assert.equal(l.clock_trusted,false);
 assert.equal(l.persistent,false);
});
test("M05-13 ledger derives the year policy draft",()=>{
 assert.equal(ledger(2028).policy_draft_version,
  annualPolicy(2028).draft_rule_version);
});
test("M05-13 refuses unsupported year",()=>{
 assert.throws(()=>ledger(2031),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-13 refuses non-DEMO snapshot",()=>{
 assert.throws(()=>ledger(2026,"REAL-SNAP"),/M05_13_SNAPSHOT_INVALID/);
});
test("M05-13 refuses wrong DEMO snapshot namespace",()=>{
 assert.throws(()=>ledger(2026,"DEMO-OTHER"),/M05_13_SNAPSHOT_INVALID/);
});
test("M05-13 one event appends to a new ledger without source access",()=>{
 const l=withEvents(event());
 assert.equal(l.events.length,1);
 assert.equal(l.events[0].source_evidence_ref,null);
});
test("M05-13 event key uses snapshot-local sequence",()=>{
 const l=withEvents(event(),event("DEMO-EVT-TWO"));
 assert.deepEqual(l.events.map(e=>e.sequence),[1,2]);
 assert.ok(l.events[1].event_key.endsWith("|0002"));
});
test("M05-13 observation source never gains official verification",()=>{
 assert.equal(withEvents(event()).events[0].officially_verified,false);
});
test("M05-13 observation cannot store a raw payload",()=>{
 const bad=event();bad.raw_payload={password:"abc"};
 assert.throws(()=>withEvents(bad),/M05_13_EVENT_INVALID/);
});
test("M05-13 observation cannot accept free-form personal name",()=>{
 const bad=event();bad.actor_name="someone";
 assert.throws(()=>withEvents(bad),/M05_13_EVENT_INVALID/);
});
test("M05-13 observation refuses an unregistered code",()=>{
 assert.throws(()=>withEvents(event("DEMO-EVT-X",{
  observation_code:"OFFICIAL_INCIDENT"
 })),/M05_13_EVENT_INVALID/);
});
test("M05-13 event ID cannot identify a real production record",()=>{
 assert.throws(()=>withEvents(event("REAL-ID")) ,/M05_13_EVENT_INVALID/);
});
test("M05-13 facility ID must remain synthetic",()=>{
 assert.throws(()=>withEvents(event("DEMO-EVT-ONE",{
  facility_id:"PUSKESWAN-REAL"
 })),/M05_13_EVENT_INVALID/);
});
test("M05-13 event period must match reporting year",()=>{
 assert.throws(()=>withEvents(event("DEMO-EVT-ONE",{
  period:"2027-07"
 })),/M05_13_YEAR_MISMATCH/);
});
test("M05-13 duplicate event IDs within one batch are rejected",()=>{
 assert.throws(()=>withEvents(event(),event()),
  /M05_13_DUPLICATE_EVENT_ID/);
});
test("M05-13 duplicate event IDs across batches are rejected",()=>{
 const l=withEvents(event());
 assert.throws(()=>appendDemoObservations({ledger:l,observations:[event()]}),
  /M05_13_DUPLICATE_EVENT_ID/);
});
test("M05-13 unbounded batch size is rejected",()=>{
 assert.throws(()=>appendDemoObservations({
  ledger:ledger(),observations:Array.from({length:51},(_,i)=>
   event("DEMO-EVT-"+i))}),/M05_13_BATCH_INVALID/);
});
test("M05-13 invalid ledger metadata is rejected",()=>{
 const l=ledger();l.monitoring_activated=true;
 assert.throws(()=>assertDemoAuditLedger(l),/M05_13_LEDGER_INVALID/);
});
test("M05-13 tampered event sequence is rejected",()=>{
 const l=withEvents(event());l.events[0].sequence=99;
 assert.throws(()=>assertDemoAuditLedger(l),/M05_13_LEDGER_TAMPERED/);
});
test("M05-13 tampered severity counts are rejected",()=>{
 const l=withEvents(event());l.counts.by_severity.REVIEW=99;
 assert.throws(()=>assertDemoAuditLedger(l),/M05_13_LEDGER_TAMPERED/);
});
test("M05-13 ledger cannot grant test, write, publish or merge",()=>{
 const l=ledger();
 assert.ok(M05_13_DENIED_ACTIONS.every(key=>l[key]===false));
});
test("M05-13 empty board states health has not been measured",()=>{
 const v=board(ledger());
 assert.equal(v.health,"NOT_MEASURED");
 assert.equal(v.counts.signals_without_demo_observation,12);
});
test("M05-13 no observation is not proof of healthy service",()=>{
 assert.equal(board(ledger()).no_observation_is_not_healthy,true);
});
test("M05-13 board observations do not claim verified live signals",()=>{
 const v=board(withEvents(event()));
 assert.equal(v.signals.find(x=>x.signal_id==="MISSING_VS_ZERO").
  actual_signal_state,"UNKNOWN_NO_LIVE_SOURCE");
});
test("M05-13 board keeps all signals even without events",()=>{
 assert.equal(board(withEvents(event())).signals.length,12);
});
test("M05-13 board records zero official notifications",()=>{
 assert.equal(board(withEvents(event())).counts.notifications_sent,0);
});
test("M05-13 triage cannot contain a notification action",()=>{
 assert.equal(M05_13_TRIAGE_ACTIONS.includes("SEND_TELEGRAM"),false);
});
test("M05-13 valid synthetic note remains open and unverified",()=>{
 const l=withEvents(event()),v=triage(l,[note()]);
 assert.equal(v.counts.open_unverified,1);
 assert.equal(v.notes[0].resolved,false);
});
test("M05-13 valid note cannot assign a real person",()=>{
 const l=withEvents(event()),v=triage(l,[note()]);
 assert.equal(v.notes[0].assigned_real_person,false);
});
test("M05-13 note requires a matching existing synthetic observation",()=>{
 const l=withEvents(event());
 assert.throws(()=>triage(l,[note("DEMO-NOTE-X",{event_id:"DEMO-EVT-UNKNOWN"})]),
  /M05_13_NOTE_INVALID/);
});
test("M05-13 note cannot carry private free-text narrative",()=>{
 const l=withEvents(event());
 assert.throws(()=>triage(l,[note("DEMO-NOTE-X",{message:"sensitive"})]),
  /M05_13_NOTE_INVALID/);
});
test("M05-13 review note cannot spoof a human signoff",()=>{
 const l=withEvents(event());
 assert.throws(()=>triage(l,[note("DEMO-NOTE-X",{approved:true})]),
  /M05_13_NOTE_INVALID/);
});
test("M05-13 duplicate note ID is rejected",()=>{
 const l=withEvents(event());
 assert.throws(()=>triage(l,[note(),note()]),/M05_13_DUPLICATE_NOTE/);
});
test("M05-13 snapshot mismatch in triage is rejected",()=>{
 const l=withEvents(event());
 assert.throws(()=>triage(l,[note("DEMO-NOTE-X",{
  snapshot_id:"DEMO-SNAP-OTHER"})]),/M05_13_NOTE_INVALID/);
});
test("M05-13 handoff rejects forged board health state",()=>{
 const l=withEvents(event()),b=board(l);b.health="HEALTHY";
 assert.throws(()=>buildDemoObservabilityHandoff({
  ledger:l,board:b,triage:triage(l)}),/M05_13_BOARD_TAMPERED/);
});
test("M05-13 handoff rejects forged incident resolution",()=>{
 const l=withEvents(event()),t=triage(l,[note()]);
 t.notes[0].resolved=true;
 assert.throws(()=>buildDemoObservabilityHandoff({
  ledger:l,board:board(l),triage:t}),/M05_13_TRIAGE_TAMPERED/);
});
test("M05-13 handoff cannot dispatch or publish anything",()=>{
 const l=withEvents(event()),h=handoff(l,[note()]);
 assert.equal(h.counts.alerts_dispatched,0);
 assert.equal(h.may_send_alert,false);
 assert.ok(M05_13_DENIED_ACTIONS.every(k=>h[k]===false));
});
