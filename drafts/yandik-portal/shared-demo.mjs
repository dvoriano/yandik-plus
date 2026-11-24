/** Consolidation K1/K2 | CODE_ONLY, synthetic browser memory only.
 * Reuse M05 models. The independent M04 and M05-0/M05-1 sources must not be
 * equated merely because labels or periods resemble one another.
 */
import {buildDemoDashboardFixture} from "../m05-apel-dashboard-ui/fixtures.mjs";
import {buildDemoDashboard} from "../m05-apel-dashboard-ui/model.mjs";
import {buildDemoProfileSdmFixture} from "../m05-profile-sdm/fixtures.mjs";
import {buildIntegratedDemoView} from "../m05-profile-sdm/integration.mjs";
import {buildDemoCorrectionWorkflowFixture,demoM0516Adapters} from "../m05-report-correction/fixtures.mjs";
import {buildDemoCorrectionContext} from "../m05-report-correction/correction.mjs";
import {applyDemoCommand} from "../m05-apel-workflow/workflow.mjs";
import {buildDemoFollowupView} from "../m05-followup-review/followup.mjs";
import {emptyPersonnelEdits} from "./personnel-model.mjs";

export const SCHEMA="YANDIK-CONSOLIDATION-DEMO-UNTESTED-1";
export const YEARS=Object.freeze([2026,2027,2028,2029,2030]);
export const FIELDS=Object.freeze(["pengobatan","vaksinasi","penyuluhan","layanan_lain"]);
export function createDemoContext(){
 const dashboardFixture=buildDemoDashboardFixture();
 const profileFixture=buildDemoProfileSdmFixture();
 const {workflow}=buildDemoCorrectionWorkflowFixture();
 // Existing join checks *all* registry keys and labels, not just name matches.
 const checked=buildIntegratedDemoView({dashboardFixture,profileFixture});
 const {options}=buildDemoDashboard(dashboardFixture);
 if(checked.rows.length!==options.facilities.length)throw Error("MASTER_MISMATCH");
 return {schema:SCHEMA,synthetic:true,dashboardFixture,profileFixture,workflow,
   facilities:options.facilities,regions:options.regions,
   sequence:0,personnelEdits:emptyPersonnelEdits(),persistent:false,official_authorization:false};
}
function validate(c,scope){
 if(c?.schema!==SCHEMA||c.synthetic!==true||c.persistent!==false||
    c.official_authorization!==false||!YEARS.includes(scope.year)||
    !Number.isSafeInteger(scope.month)||scope.month<1||scope.month>12)
  throw Error("DEMO_SCOPE_INVALID");
 const f=c.facilities.find(x=>x.facility_id===scope.facility_id);
 if(!f||f.region_id!==scope.region_id)throw Error("DEMO_ID_REGION_MISMATCH");
 return f;
}
function period(scope){return scope.year+"-"+String(scope.month).padStart(2,"0");}
export function readConsolidatedDemo(c,scope){
 const facility=validate(c,scope);
 const join=buildIntegratedDemoView({year:scope.year,
   region_id:scope.region_id,facility_id:scope.facility_id,
   dashboardFixture:c.dashboardFixture,profileFixture:c.profileFixture});
 const dashboard=buildDemoDashboard({...c.dashboardFixture,
   year:scope.year,region_id:scope.region_id,facility_id:scope.facility_id});
 const correction=buildDemoCorrectionContext({
  workflow:c.workflow,...demoM0516Adapters(facility.facility_id),
  facility_id:facility.facility_id,region_id:facility.region_id,
  period:period(scope),dashboardFixture:c.dashboardFixture,
  profileFixture:c.profileFixture
 });
 const followup=buildDemoFollowupView(correction);
 const ledgerMonth=dashboard.facility_rows[0].months[scope.month-1];
 // Read the selected synthetic draft only; do not copy ledger records.
 const draft=c.workflow.records.find(x=>x.facility_id===scope.facility_id&&x.period===period(scope))?.draft;
 const draft_counts=draft?Object.fromEntries(FIELDS.map(k=>[k,draft.counts[k]])):null;
 return {schema:SCHEMA,synthetic:true,facility,period:period(scope),
  joined:join.rows[0],annual:dashboard.summary,ledgerMonth,
  correction,followup,draft_counts,
  draft_activities:draft?{investigations:structuredClone(draft.investigations),kurban_animals:structuredClone(draft.kurban_animals)}:null,
  source_status:{ledger:"M05-0/M05-14 (snapshot)",
   profile:"M05-15 (snapshot)",workflow:"M05-1/M05-16 (in-memory)",
   support:"M04-I1 (independent scenario; no ID crosswalk)"},
  same_official_source:false,ledger_workflow_reconciled:false,
  support_identity_linked:false,official_authorization:false};
}
const transitions={
 NOT_STARTED_DEMO:["create_draft"],DRAFT:["save_draft","submit"],
 SUBMITTED_REVIEW_PENDING:["return_correction"],
 CORRECTION_REQUESTED:["revise_draft"],
 REVISION_DRAFT:["revise_draft","resubmit"]
};
export function nextActions(view){return [...(transitions[view.correction.report_state]??[])];}
/** Explicit click only. Caller provides synthetic integers; no raw notes,
 * credentials, real sessions, uploads, external API or local persistence. */
export function applyConsolidatedDemoAction(c,scope,action,counts,activities){
 const view=readConsolidatedDemo(c,scope);
 if(!nextActions(view).includes(action))throw Error("TRANSITION_DENIED");
 const write=["create_draft","save_draft","revise_draft"].includes(action);
 let payload={};
 if(write){
  if(!counts||Object.keys(counts).length!==FIELDS.length||
     FIELDS.some(k=>!Object.hasOwn(counts,k)||
        !Number.isSafeInteger(counts[k])||counts[k]<0||counts[k]>100000))
    throw Error("DEMO_COUNTS_INVALID");
  const prior=c.workflow.records.find(x=>x.facility_id===scope.facility_id&&x.period===view.period)?.draft;
  const extra=activities??view.draft_activities??{investigations:[],kurban_animals:[]};
  if(!extra||Object.keys(extra).length!==2||
     !Array.isArray(extra.investigations)||!Array.isArray(extra.kurban_animals)||
     extra.investigations.length>100||extra.kurban_animals.length>100)
    throw Error("DEMO_ACTIVITIES_INVALID");
  const safeId=x=>typeof x==="string"&&/^DEMO-[A-Z0-9_-]{1,40}$/.test(x);
  if(extra.investigations.some(x=>!x||Object.keys(x).length!==2||
    !safeId(x.event_id)||!safeId(x.location_id))||
    extra.kurban_animals.some(x=>!x||Object.keys(x).length!==3||
    !safeId(x.animal_id)||typeof x.ante!=="boolean"||typeof x.post!=="boolean"))
   throw Error("DEMO_ACTIVITIES_INVALID");
  // M05-0 via M05-1 enforces unique event/location pairs and animals,
  // at least one examination per animal and consistency of explicit zero.
  payload={report:{facility_id:scope.facility_id,period:view.period,
   declared_no_activity:FIELDS.every(k=>counts[k]===0)&&
      extra.investigations.length===0&&extra.kurban_animals.length===0,
   counts:Object.fromEntries(FIELDS.map(k=>[k,counts[k]])),
   investigations:structuredClone(extra.investigations),
   kurban_animals:structuredClone(extra.kurban_animals),
   evidence_refs:structuredClone(prior?.evidence_refs??[])}};
 }else if(action==="return_correction"){
  payload={reason:"Periksa kembali angka pada contoh laporan DEMO."};
 }
 const role=action==="return_correction"?"provinsi_verifikator":"puskeswan";
 const sequence=c.sequence+1;
 const changed=applyDemoCommand(c.workflow,demoM0516Adapters(scope.facility_id,role),
  {request_id:"DEMO-M05-REQ-CONSOLIDATED-"+sequence,
   facility_id:scope.facility_id,period:view.period,
   expected_revision:view.correction.revision,action,payload});
 return {...c,workflow:changed.state,sequence};
}
export function readRegionalCoverage(c,year){
 if(!YEARS.includes(year))throw Error("DEMO_YEAR_INVALID");
 return c.regions.map(region=>{
  const joined=buildIntegratedDemoView({year,region_id:region.region_id,
   dashboardFixture:c.dashboardFixture,profileFixture:c.profileFixture});
  return {region:region.region_label,facilities:joined.rows.length,
    reported:joined.dashboard_summary.reported_facility_months,
    expected:joined.dashboard_summary.expected_facility_months,
    service:joined.dashboard_summary.observed_demo_events,
    profiles:joined.profile_sdm_summary.profile_available_demo,
    sdm:joined.profile_sdm_summary.sdm_complete_demo};
 });
}

/** Queue only already-created workflow records; not a compliance list. */
export function readRecordedFollowupQueue(c,scope){
 validate(c,scope);
 const facilities=new Map(c.facilities.filter(f=>f.region_id===scope.region_id)
  .map(f=>[f.facility_id,f]));
 const records=c.workflow.records.filter(r=>r.year===scope.year&&facilities.has(r.facility_id));
 return records.flatMap(record=>{
  const f=facilities.get(record.facility_id);
  const view=readConsolidatedDemo(c,{year:scope.year,month:Number(record.period.slice(5)),
   region_id:f.region_id,facility_id:f.facility_id});
  return view.followup.advisory_proposals.map(p=>({
   facility_label:f.facility_label,period:p.period,subject:p.subject,
   role_to_consult:p.role_to_consult,status:p.status
  }));
 }).sort((a,b)=>(a.period+"|"+a.facility_label).localeCompare(b.period+"|"+b.facility_label));
}
