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
   sequence:0,persistent:false,official_authorization:false};
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
 // Read only the four numeric draft fields from this synthetic in-memory record.
 const draft=c.workflow.records.find(x=>x.facility_id===scope.facility_id&&x.period===period(scope))?.draft;
 const draft_counts=draft?Object.fromEntries(FIELDS.map(k=>[k,draft.counts[k]])):null;
 return {schema:SCHEMA,synthetic:true,facility,period:period(scope),
  joined:join.rows[0],annual:dashboard.summary,ledgerMonth,
  correction,followup,draft_counts,
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
export function applyConsolidatedDemoAction(c,scope,action,counts){
 const view=readConsolidatedDemo(c,scope);
 if(!nextActions(view).includes(action))throw Error("TRANSITION_DENIED");
 const write=["create_draft","save_draft","revise_draft"].includes(action);
 let payload={};
 if(write){
  if(!counts||Object.keys(counts).length!==FIELDS.length||
     FIELDS.some(k=>!Object.hasOwn(counts,k)||
        !Number.isSafeInteger(counts[k])||counts[k]<0||counts[k]>100000))
    throw Error("DEMO_COUNTS_INVALID");
  payload={report:{facility_id:scope.facility_id,period:view.period,
   declared_no_activity:FIELDS.every(k=>counts[k]===0),
   counts:Object.fromEntries(FIELDS.map(k=>[k,counts[k]])),
   investigations:[],kurban_animals:[],evidence_refs:[]}};
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
