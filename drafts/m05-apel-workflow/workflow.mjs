/**
 * M05-1 | KODE DITULIS, BELUM DIUJI, CODE_ONLY.
 * APEL multi-year 2026-2030 DEMO draft / submit / correction lifecycle.
 * Pure in-memory snapshot, NO Flask route, DB, official verification or approval.
 * Trusted host MUST bind resolveServerSession & resolveFacility, never browser.
 */
import {backendPrincipal,requireFacilityRead,facilitySelector}
 from "../m04-backend-readonly/identity.mjs";
import {parsePeriod,normalizeDemoReport} from "../m05-apel-multiyear/reporting.mjs";

export const M05_1_SCHEMA="M05-1-APEL-WORKFLOW-UNTESTED-1";
export const STATES=Object.freeze([
 "DRAFT","SUBMITTED_REVIEW_PENDING","CORRECTION_REQUESTED","REVISION_DRAFT"
]);
const fail=code=>{throw Error(code)};
const REQ=/^DEMO-M05-REQ-[A-Z0-9_-]{1,40}$/;
const REF=/^DEMO-[A-Z0-9_-]{1,40}$/;
const KEYS=["facility_id","period","declared_no_activity","counts",
 "investigations","kurban_animals","evidence_refs"];
const COUNTS=["pengobatan","vaksinasi","penyuluhan","layanan_lain"];
const ACTIONS=["create_draft","save_draft","submit","return_correction",
 "revise_draft","resubmit"];
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const clone=x=>structuredClone(x);
function draftPayload(raw,id,period) {
 if(!exact(raw,KEYS)||raw.facility_id!==id||raw.period!==period||
    !exact(raw.counts,COUNTS)||
    COUNTS.some(k=>raw.counts[k]!==null&&
      !(Number.isSafeInteger(raw.counts[k])&&raw.counts[k]>=0))||
    ![true,false,null].includes(raw.declared_no_activity)||
    !Array.isArray(raw.investigations)||!Array.isArray(raw.kurban_animals)||
    !Array.isArray(raw.evidence_refs))
  fail("APEL_DRAFT_INVALID");
 // Probe the strict M05-0 field, ID, dedupe and cross-count validations.
 // A partial draft can contain null. Only submit requires complete values.
 const counts=Object.fromEntries(COUNTS.map(k=>[k,raw.counts[k]??0]));
 const activity=COUNTS.reduce((n,k)=>n+counts[k],0)+
   raw.investigations.length+raw.kurban_animals.length;
 const declared=raw.declared_no_activity===true||
   (activity===0&&raw.declared_no_activity!==false);
 normalizeDemoReport({...raw,counts,declared_no_activity:declared});
 return clone(raw);
}
function allowed(actor,facility,action) {
 requireFacilityRead(actor,facility);
 const edit=["puskeswan","provinsi_admin"];
 const review=["kab_kota","provinsi_verifikator"];
 const roles=action==="return_correction"?review:edit;
 if(!roles.includes(actor.role))fail("ACCESS_DENIED");
}
function command(raw) {
 if(!exact(raw,["request_id","facility_id","period","expected_revision",
   "action","payload"])||typeof raw.request_id!=="string"||
   !REQ.test(raw.request_id)||!ACTIONS.includes(raw.action)||
   !exact(raw.payload,raw.action==="return_correction"?["reason"]:
     ["create_draft","save_draft","revise_draft"].includes(raw.action)?["report"]:[]))
   fail("APEL_COMMAND_INVALID");
 const id=facilitySelector(raw.facility_id);
 parsePeriod(raw.period);
 if(raw.action==="create_draft"){
  if(raw.expected_revision!==null)fail("APEL_EXPECTED_REVISION_INVALID");
 } else if(!Number.isSafeInteger(raw.expected_revision)||
           raw.expected_revision<1)fail("APEL_EXPECTED_REVISION_INVALID");
 if(raw.action==="return_correction"){
  const s=raw.payload.reason;
  if(typeof s!=="string"||s.trim()!==s||s.length<12||s.length>240||
     /https?:\/\/|(?:token|secret|password|api[_-]?key)\s*[:=]/i.test(s))
   fail("APEL_CORRECTION_REASON_INVALID");
 }
 return { ...raw,facility_id:id};
}
export function emptyDemoWorkflow(){
 return {schema:M05_1_SCHEMA,synthetic:true,mode:"IN_MEMORY_DEMO",
  records:[],events:[],persistent:false,
  verified_identity:false,official_authorization:false};
}
function checkState(state) {
 if(!state||state.schema!==M05_1_SCHEMA||state.synthetic!==true||
    state.mode!=="IN_MEMORY_DEMO"||state.persistent!==false||
    state.official_authorization!==false||state.verified_identity!==false||
    !Array.isArray(state.records)||!Array.isArray(state.events))
  fail("APEL_WORKFLOW_STATE_INVALID");
 const keys=new Set(),requests=new Set();
 for(const r of state.records){
  if(!r||typeof r.facility_id!=="string"||
     typeof r.period!=="string"||!STATES.includes(r.status)||
     !Number.isSafeInteger(r.revision)||r.revision<1||
     typeof r.policy_draft_version!=="string")fail("APEL_WORKFLOW_RECORD_INVALID");
  facilitySelector(r.facility_id);
  const {year}=parsePeriod(r.period);
  if(r.year!==year)fail("APEL_WORKFLOW_RECORD_INVALID");
  const k=r.facility_id+"|"+r.period;
  if(keys.has(k))fail("APEL_DUPLICATE_FACILITY_MONTH");
  keys.add(k);
  if(r.draft!==null)draftPayload(r.draft,r.facility_id,r.period);
  if(r.report!==null){
   const normalized=normalizeDemoReport(r.report_input);
   if(JSON.stringify(normalized)!==JSON.stringify(r.report))
    fail("APEL_WORKFLOW_REPORT_CHANGED");
  }
  if(["DRAFT","REVISION_DRAFT","CORRECTION_REQUESTED"].includes(r.status)&&!r.draft)
   fail("APEL_WORKFLOW_RECORD_INVALID");
  if(r.status==="SUBMITTED_REVIEW_PENDING"&&!r.report)
   fail("APEL_WORKFLOW_RECORD_INVALID");
 }
 for(const e of state.events){
  if(!e||!REQ.test(e.request_id)||requests.has(e.request_id)||
     !keys.has(e.facility_id+"|"+e.period))fail("APEL_WORKFLOW_EVENT_INVALID");
  requests.add(e.request_id);
 }
 for(const r of state.records){
  if(state.events.filter(e=>e.facility_id===r.facility_id&&
     e.period===r.period).length!==r.revision)
   fail("APEL_WORKFLOW_REVISION_MISMATCH");
 }
}
export function applyDemoCommand(state,{resolveServerSession,resolveFacility}={},raw){
 if(typeof resolveServerSession!=="function"||typeof resolveFacility!=="function")
  fail("TRUSTED_BACKEND_ADAPTERS_REQUIRED");
 const c=command(raw);
 const actor=backendPrincipal(resolveServerSession);
 const facility=resolveFacility(c.facility_id);
 if(!facility||facility.id!==c.facility_id||facility.status!=="aktif"||
    typeof facility.region!=="string")fail("ACCESS_DENIED");
 allowed(actor,facility,c.action);
 checkState(state);
 if(state.events.some(e=>e.request_id===c.request_id))
  fail("APEL_REQUEST_ID_ALREADY_USED");
 const records=state.records.map(clone);
 const idx=records.findIndex(r=>r.facility_id===c.facility_id&&
    r.period===c.period);
 let row=idx<0?null:records[idx];
 if(c.action==="create_draft"){
  if(row)fail("APEL_DUPLICATE_FACILITY_MONTH");
  const {year}=parsePeriod(c.period);
  row={facility_id:c.facility_id,period:c.period,year,
   policy_draft_version:"DEMO-APEL-"+year+"-BASELINE-R0",
   revision:0,status:"DRAFT",draft:null,report:null,report_input:null,
   last_submitter:null,correction_reason:null};
 }else{
  if(!row)fail("APEL_REPORT_NOT_FOUND");
  if(row.revision!==c.expected_revision)fail("APEL_REVISION_CONFLICT");
 }
 let snapshot=null,reason=null;
 if(c.action==="create_draft"||c.action==="save_draft"){
  if(c.action==="save_draft"&&row.status!=="DRAFT")
   fail("APEL_STATE_TRANSITION_DENIED");
  row.draft=draftPayload(c.payload.report,c.facility_id,c.period);
  snapshot=clone(row.draft);
 }else if(c.action==="revise_draft"){
  if(!["CORRECTION_REQUESTED","REVISION_DRAFT"].includes(row.status))
   fail("APEL_STATE_TRANSITION_DENIED");
  row.draft=draftPayload(c.payload.report,c.facility_id,c.period);
  row.status="REVISION_DRAFT";snapshot=clone(row.draft);
 }else if(c.action==="submit"||c.action==="resubmit"){
  if(c.action==="submit"&&row.status!=="DRAFT"||
     c.action==="resubmit"&&row.status!=="REVISION_DRAFT")
   fail("APEL_STATE_TRANSITION_DENIED");
  const validated=normalizeDemoReport(row.draft); // full submit gate
  row.report=clone(validated);
  row.report_input=clone(row.draft);
  row.draft=null;row.status="SUBMITTED_REVIEW_PENDING";
  row.last_submitter=actor.id;row.correction_reason=null;
  snapshot=clone(validated);
 }else{
  if(row.status!=="SUBMITTED_REVIEW_PENDING"||
     row.last_submitter===actor.id)fail("APEL_REVIEW_SEPARATION_DENIED");
  reason=c.payload.reason;
  row.status="CORRECTION_REQUESTED";
  row.correction_reason=reason;
  row.draft=clone(row.report_input); // retain previous submitted snapshot
 }
 row.revision++;
 if(idx<0)records.push(row);else records[idx]=row;
 const event={
  request_id:c.request_id,facility_id:c.facility_id,period:c.period,
  revision:row.revision,action:c.action,actor_id:actor.id,
  actor_role:actor.role,resulting_status:row.status,
  draft_or_submitted_snapshot:snapshot,correction_reason:reason,
  official_verified:false
 };
 const updated={...state,records,events:[...state.events.map(clone),event]};
 checkState(updated);
 return {state:updated,result:{
  schema:M05_1_SCHEMA,synthetic:true,facility_id:row.facility_id,
  period:row.period,revision:row.revision,status:row.status,
  event_count:updated.events.length,
  may_score:false,may_publish:false,official_verified:false,
  official_authorization:false}};
}
export function readDemoWorkflow(state,{resolveServerSession,resolveFacility}={},facilityId,period){
 if(typeof resolveServerSession!=="function"||typeof resolveFacility!=="function")
  fail("TRUSTED_BACKEND_ADAPTERS_REQUIRED");
 const id=facilitySelector(facilityId);parsePeriod(period);
 const actor=backendPrincipal(resolveServerSession),facility=resolveFacility(id);
 if(!facility||facility.id!==id||facility.status!=="aktif")
  fail("ACCESS_DENIED");
 requireFacilityRead(actor,facility);
 checkState(state);
 const row=state.records.find(r=>r.facility_id===id&&r.period===period);
 return {schema:M05_1_SCHEMA,synthetic:true,facility_id:id,period,
  record:row?clone(row):null,
  events:state.events.filter(e=>e.facility_id===id&&e.period===period).map(clone),
  may_score:false,may_publish:false,official_authorization:false};
}
