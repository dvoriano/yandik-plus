/** M05-16 | QA DITULIS, 0 DIJALANKAN | CODE_ONLY */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoCorrectionContext,M05_16_SCHEMA} from "../correction.mjs";
import {demoM0516Adapters,buildDemoCorrectionWorkflowFixture} from "../fixtures.mjs";
import {emptyDemoWorkflow} from "../../m05-apel-workflow/workflow.mjs";
const make=(facility_id="DEMO-PSW-ALPHA",period="2026-01",options={})=>
 buildDemoCorrectionContext({
  facility_id,period,
  workflow:buildDemoCorrectionWorkflowFixture().workflow,
  ...demoM0516Adapters(facility_id),...options
 });
test("M05-16 has dedicated untested schema",()=>assert.equal(make().schema,M05_16_SCHEMA));
test("M05-16 is exclusively synthetic",()=>assert.equal(make().synthetic,true));
test("M05-16 returns Alpha 2026-01 resubmitted status",()=>
 assert.equal(make().report_state,"SUBMITTED_REVIEW_PENDING"));
test("M05-16 carries five recorded revisions",()=>
 assert.equal(make().history.length,5));
test("M05-16 keeps last submitted demonstration count",()=>
 assert.equal(make().activity_count_last_submitted_demo,7));
test("M05-16 never presents unverified count as verified",()=>
 assert.equal(make().activity_count_currently_verified,null));
test("M05-16 hides raw event actor identifiers",()=>
 assert.equal(JSON.stringify(make()).includes("DEMO-USER-"),false));
test("M05-16 hides text of correction notes",()=>
 assert.equal(JSON.stringify(make()).includes("Jumlah laporan DEMO perlu"),false));
test("M05-16 does not reveal full report payload",()=>
 assert.equal(make().no_raw_report_exposed,true));
test("M05-16 pending correction remains distinct",()=>
 assert.equal(make("DEMO-PSW-GAMMA","2026-06").report_state,"CORRECTION_REQUESTED"));
test("M05-16 retains correction reason presence only",()=>
 assert.equal(make("DEMO-PSW-GAMMA","2026-06").has_correction_reason,true));
test("M05-16 draft does not imply submission",()=>
 assert.equal(make("DEMO-PSW-BETA","2026-02").historical_submissions_preserved_demo,false));
test("M05-16 no workflow report remains not started",()=>{
 const v=make("DEMO-PSW-BETA","2029-05",{workflow:emptyDemoWorkflow()});
 assert.equal(v.report_state,"NOT_STARTED_DEMO");
 assert.equal(v.activity_count_last_submitted_demo,null);
});
test("M05-16 null report does not mean zero",()=>
 assert.equal(make("DEMO-PSW-BETA","2029-05").activity_count_last_submitted_demo,null));
test("M05-16 rejects unsupported year",()=>
 assert.throws(()=>make("DEMO-PSW-ALPHA","2031-01"),/APEL_YEAR_NOT_CONFIGURED/));
test("M05-16 rejects unknown facility",()=>
 assert.throws(()=>make("DEMO-PSW-OTHER","2026-01"),/FIXTURE_FACILITY_UNKNOWN/));
test("M05-16 rejects mismatching geographic filter",()=>
 assert.throws(()=>make("DEMO-PSW-ALPHA","2026-01",
  {region_id:"DEMO-REGION-SELATAN"}),/FILTER_CONFLICT/));
test("M05-16 rejects fabricated non-DEMO workflow state",()=>{
 const x=buildDemoCorrectionWorkflowFixture().workflow;
 x.synthetic=false;
 assert.throws(()=>make("DEMO-PSW-ALPHA","2026-01",{workflow:x}),/WORKFLOW_UNTRUSTED/);
});
test("M05-16 rejects actor outside territorial scope",()=>
 assert.throws(()=>make("DEMO-PSW-ALPHA","2026-01",
  {resolveServerSession:()=>({id:"DEMO-USER-WRONG",active:true,
   role:"puskeswan",puskeswan_id:"DEMO-PSW-BETA",region:"Other"})}),/ACCESS_DENIED/));
test("M05-16 does not equate dashboard ledger to correction history",()=>
 assert.equal(make().dashboard_context.synchronized_with_workflow,false));
test("M05-16 excludes timing and official deadline judgement",()=>
 assert.equal(make().deadline_compliance,null));
test("M05-16 exposes contextual profile status",()=>
 assert.equal(make().profile_context.profile_state,"RECORDED_DEMO"));
test("M05-16 year context is taken from requested reporting period",()=>
 assert.equal(make("DEMO-PSW-ALPHA","2028-02").year,2028));
test("M05-16 denies all privileged actions",()=>{
 const v=make();
 for(const f of ["may_write","may_connect","may_score","may_rank",
  "may_publish","may_notify","may_deploy","official_authorization"])
  assert.equal(v[f],false);
});
