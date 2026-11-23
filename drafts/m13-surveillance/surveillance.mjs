/**
 * M13-S1 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | SYNTHETIC ONLY.
 * Animal health event register, NOT an iSIKHNAS client or official notifier.
 * No real farm coordinates, people, animal owners or disease confirmations.
 */
import {requireDemoSourceRead,M00_G2_SCHEMA}
 from "../m00-source-api-gate/source_access.mjs";

export const M13_S1_SCHEMA="M13-S1-PHMS-SURVEILLANCE-DEMO-UNTESTED-1";
const fail=code=>{throw Error(code);};
const EVENT=/^DEMO-EVENT-[A-Z0-9_-]{1,24}$/;
const LOCATION=/^DEMO-LOCATION-[A-Z0-9_-]{1,28}$/;
const PERIOD=/^(?:202[6-9]|2030)-(?:0[1-9]|1[0-2])$/;
const SYNDROME=new Set([
 "DEMO-SYNDROME-GENERAL","DEMO-SYNDROME-NEUROLOGIC",
 "DEMO-SYNDROME-RESPIRATORY"
]);
const REPORT=new Set(["SUSPECTED_UNVERIFIED_DEMO",
 "FIELD_OBSERVATION_UNVERIFIED_DEMO"]);
const INVESTIGATION=new Set(["NOT_STARTED_DEMO",
 "FIELD_NOTES_RECORDED_UNVERIFIED_DEMO"]);
const SAMPLE=new Set(["NOT_LOGGED_DEMO","SAMPLE_LOGGED_UNVERIFIED_DEMO",
 "RESULT_PENDING_UNVERIFIED_DEMO",
 "RESULT_NOTES_RECORDED_UNVERIFIED_DEMO"]);
const FOLLOWUP=new Set(["NOT_RECORDED_DEMO","DRAFT_REVIEW_ONLY"]);
const FIELDS=["event_id","location_ref","region_label","period",
 "syndrome_tag","report_class","investigation_state","sample_state",
 "followup_state","evidence_ref_count_demo","source_id",
 "snapshot_id","official_case_reference","official_lab_reference"];
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const is=(v,re)=>typeof v==="string"&&re.test(v);

function inspectEvents(events,source){
 if(!Array.isArray(events)||events.length>100)
  fail("M13_S1_EVENTS_INVALID");
 const ids=new Set();
 for(const event of events){
  if(!exact(event,FIELDS)||!is(event.event_id,EVENT)||
    !is(event.location_ref,LOCATION)||!is(event.period,PERIOD)||
    event.region_label!==source.region_label||
    event.period>source.capture_month||
    !SYNDROME.has(event.syndrome_tag)||
    !REPORT.has(event.report_class)||
    !INVESTIGATION.has(event.investigation_state)||
    !SAMPLE.has(event.sample_state)||!FOLLOWUP.has(event.followup_state)||
    !Number.isSafeInteger(event.evidence_ref_count_demo)||
    event.evidence_ref_count_demo<0||event.evidence_ref_count_demo>12||
    event.source_id!==source.source_id||
    event.snapshot_id!==source.snapshot_id||
    event.official_case_reference!==null||
    event.official_lab_reference!==null||
    ids.has(event.event_id))
   fail("M13_S1_EVENT_INVALID");
  // Lab notes without an investigation are not coherent in this draft;
  // no medical or official diagnosis can be inferred in any case.
  if(event.investigation_state==="NOT_STARTED_DEMO"&&
     event.sample_state!=="NOT_LOGGED_DEMO")
   fail("M13_S1_UNSUPPORTED_EVENT_SEQUENCE");
  ids.add(event.event_id);
 }
}

export function buildDemoSurveillanceRegister({
 resolveServerSession,region_label,manifest,events
}={}){
 const access=requireDemoSourceRead({resolveServerSession},{
  module:"SURVEILLANCE",region_label,manifest
 });
 if(access?.schema!==M00_G2_SCHEMA||access.synthetic!==true||
    access.source?.domain!=="SURVEILLANCE_DEMO"||
    access.official_authorization!==false)
  fail("M13_S1_SOURCE_NOT_AUTHORIZED");
 const source=access.source;
 inspectEvents(events,source);
 const rows=events.map(e=>({
  event_id:e.event_id,location_ref:e.location_ref,
  region_label:e.region_label,period:e.period,
  syndrome_tag:e.syndrome_tag,report_class:e.report_class,
  investigation_state:e.investigation_state,
  sample_state:e.sample_state,
  followup_state:e.followup_state,
  evidence_ref_count_demo:e.evidence_ref_count_demo,
  official_case_status:null,
  confirmed_disease_code:null,
  confirmed_case_count:null,
  lab_result_authenticated:false,
  officially_notified:false,
  may_publish:false
 })).sort((a,b)=>(a.period+"|"+a.event_id)
  .localeCompare(b.period+"|"+b.event_id));
 return {
  schema:M13_S1_SCHEMA,synthetic:true,
  mode:"READ_ONLY_UNVERIFIED_SURVEILLANCE_DEMO",
  region_label,source_id:source.source_id,
  snapshot_id:source.snapshot_id,
  captured_month_demo:source.capture_month,
  events_recorded_demo:rows.length,
  suspected_or_observed_events_demo:rows.length,
  official_case_count:null,official_outbreak_count:null,
  confirmed_disease_count:null,verified_lab_result_count:null,
  source_verified:false,source_freshness_verified:false,
  official_reporting_synchronized:false,
  isikhnas_connected:false,apel_ledger_reconciled:false,
  exact_location_available:false,contains_person_data:false,
  external_reporting_authorized:false,
  rows:structuredClone(rows),
  may_connect:false,may_write:false,may_notify:false,
  may_approve:false,may_confirm_disease:false,
  may_dispatch_response:false,may_rank:false,
  may_publish:false,may_deploy:false,
  official_authorization:false
 };
}

export function buildDemoEventReview({
 resolveServerSession,region_label,manifest,events,event_id
}={}){
 if(!is(event_id,EVENT))fail("M13_S1_EVENT_SELECTOR_INVALID");
 const register=buildDemoSurveillanceRegister({
  resolveServerSession,region_label,manifest,events
 });
 const event=register.rows.find(x=>x.event_id===event_id);
 if(!event)fail("ACCESS_DENIED");
 return {
  schema:M13_S1_SCHEMA,synthetic:true,
  mode:"DRAFT_REVIEW_ONLY",
  event:structuredClone(event),
  suggested_review:{
   type:event.investigation_state==="NOT_STARTED_DEMO"?
    "CHECK_DEMO_INVESTIGATION_RECORD":"REVIEW_DEMO_EVENT_NOTES",
   status:"PENDING_HUMAN_CONSIDERATION",
   assigned_to:null,deadline:null,external_notice_ref:null,
   official_decision:null
  },
  source_status:"LOCAL_SYNTHETIC_UNVERIFIED",
  disease_confirmed:false,lab_confirmed:false,
  official_notification_sent:false,
  may_notify:false,may_write:false,may_confirm_disease:false,
  may_dispatch_response:false,may_approve:false,
  may_publish:false,may_deploy:false,official_authorization:false
 };
}
