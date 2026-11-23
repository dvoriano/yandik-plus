/**
 * M05-16 | CODE ONLY | KODE DITULIS, BELUM DIUJI.
 * Read-only APEL reporting and correction context. Never mutates the ledger.
 * Access resolver is a DEMO contract, not a replacement for trusted server auth.
 */
import {parsePeriod} from "../m05-apel-multiyear/reporting.mjs";
import {readDemoWorkflow,M05_1_SCHEMA,STATES} from "../m05-apel-workflow/workflow.mjs";
import {buildIntegratedDemoView} from "../m05-profile-sdm/integration.mjs";

export const M05_16_SCHEMA="M05-16-REPORTING-CORRECTION-DEMO-UNTESTED-1";
const fail=code=>{throw Error(code);};
const WORKFLOW_STATES=new Set(STATES);
const ACTIONS=new Set(["create_draft","save_draft","submit",
 "return_correction","revise_draft","resubmit"]);
const safeInt=n=>Number.isSafeInteger(n)&&n>=0;
const deny=()=>({
 may_write:false,may_connect:false,may_score:false,may_rank:false,
 may_publish:false,may_notify:false,may_deploy:false,
 official_authorization:false,officially_verified:false
});
const clone=x=>structuredClone(x);

export function buildDemoCorrectionContext({
 workflow,resolveServerSession,resolveFacility,
 period="2026-01",facility_id="DEMO-PSW-ALPHA",region_id="ALL",
 dashboardFixture,profileFixture
}={}){
 const {year}=parsePeriod(period);
 if(typeof facility_id!=="string"||!/^DEMO-PSW-[A-Z0-9_-]{1,24}$/.test(facility_id))
  fail("M05_16_FACILITY_INVALID");
 if(workflow?.schema!==M05_1_SCHEMA||workflow.synthetic!==true||
    workflow.mode!=="IN_MEMORY_DEMO"||workflow.persistent!==false||
    workflow.official_authorization!==false||
    workflow.verified_identity!==false||
    !Array.isArray(workflow.records)||!Array.isArray(workflow.events))
  fail("M05_16_WORKFLOW_UNTRUSTED");
 const linked=buildIntegratedDemoView({
  year,region_id,facility_id,
  ...(dashboardFixture===undefined?{}:{dashboardFixture}),
  ...(profileFixture===undefined?{}:{profileFixture})
 });
 if(linked.rows.length!==1||linked.rows[0].facility_id!==facility_id)
  fail("M05_16_CONTEXT_SCOPE_MISMATCH");
 // M05-1 read contract checks the DEMO session/facility scope, revisions,
 // immutable snapshots and duplicate requests before any projection.
 const read=readDemoWorkflow(workflow,
  {resolveServerSession,resolveFacility},facility_id,period);
 if(read.synthetic!==true||read.official_authorization!==false||
    read.facility_id!==facility_id||read.period!==period)
  fail("M05_16_SOURCE_MISMATCH");
 const row=read.record;
 if(row!==null&&(!WORKFLOW_STATES.has(row.status)||!safeInt(row.revision)||
   row.revision<1||row.period!==period||row.facility_id!==facility_id))
  fail("M05_16_STATE_INVALID");
 const history=read.events.map((e,i)=>{
  if(!e||!ACTIONS.has(e.action)||!safeInt(e.revision)||
     e.revision!==i+1||e.facility_id!==facility_id||
     e.period!==period||typeof e.resulting_status!=="string"||
     !WORKFLOW_STATES.has(e.resulting_status))
   fail("M05_16_HISTORY_INVALID");
  // Never return actor IDs, raw notes, request IDs or submitted records.
  return {revision:e.revision,action:e.action,status:e.resulting_status,
   officially_verified:false};
 });
 if(row!==null&&(row.revision!==history.length||
    row.status!==history.at(-1)?.status))
  fail("M05_16_REVISION_MISMATCH");
 const status=row?.status??"NOT_STARTED_DEMO";
 const previous=row?.report?.total_demo_events??null;
 if(previous!==null&&!safeInt(previous))fail("M05_16_REPORT_INVALID");
 const needsCorrection=status==="CORRECTION_REQUESTED"||
   status==="REVISION_DRAFT";
 const pendingReview=status==="SUBMITTED_REVIEW_PENDING";
 const mayEdit=status==="DRAFT"||status==="REVISION_DRAFT"||
   status==="CORRECTION_REQUESTED";
 return {
  schema:M05_16_SCHEMA,synthetic:true,mode:"READ_ONLY_DEMO",
  facility_id,period,year,region_id:linked.rows[0].region_id,
  report_state:status,revision:row?.revision??null,
  activity_count_last_submitted_demo:previous,
  activity_count_currently_verified:null,
  has_correction_reason:typeof row?.correction_reason==="string"&&
   row.correction_reason.length>0,
  correction_requested_demo:needsCorrection,
  review_pending_demo:pendingReview,draft_exists_demo:mayEdit,
  submission_date_verified:false,deadline_compliance:null,
  profile_context:{
   profile_state:linked.rows[0].profile_state,
   profile_source_ref:linked.rows[0].profile_source_ref,
   sdm_coverage:linked.rows[0].sdm_coverage,
   doctors:linked.rows[0].doctors,paramedics:linked.rows[0].paramedics
  },
  // This is a separate workflow simulation; dashboard ledger M05-0 is NOT
  // reconciled with the M05-1 workflow, so totals cannot be equated.
  dashboard_context:{
   observed_demo_events:linked.rows[0].observed_demo_events,
   report_coverage:linked.rows[0].report_coverage,
   synchronized_with_workflow:false
  },
  history:clone(history),
  historical_submissions_preserved_demo:history.some(x=>
   x.action==="submit"||x.action==="resubmit"),
  no_actor_identity_exposed:true,no_raw_report_exposed:true,
  cross_source_reconciled:false,source:"M05-1_AND_M05-15_SYNTHETIC_ONLY",
  ...deny()
 };
}
