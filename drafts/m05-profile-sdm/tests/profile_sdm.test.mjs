/** M05-15 | QA WRITTEN, ZERO EXECUTED | CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {M05_15_SCHEMA,buildProfileSdmView} from "../model.mjs";
import {buildDemoProfileSdmFixture} from "../fixtures.mjs";
import {buildIntegratedDemoView,M05_15_INTEGRATION_SCHEMA} from "../integration.mjs";
import {buildDemoDashboardFixture} from "../../m05-apel-dashboard-ui/fixtures.mjs";

const setup=()=>buildDemoProfileSdmFixture();
const view=(changes={})=>buildProfileSdmView({...setup(),...changes});
test("M05-15 uses distinct untested schema",()=>{
 assert.equal(view().schema,M05_15_SCHEMA);
});
test("M05-15 contains exactly three invented facilities",()=>{
 assert.equal(view().summary.facilities,3);
});
test("M05-15 lists 2026 profile snapshots",()=>{
 assert.equal(view().summary.profile_available_demo,3);
});
test("M05-15 partial staffing prevents false total",()=>{
 assert.equal(view().summary.total_staff,null);
});
test("M05-15 complete facility can show explicit zero doctors",()=>{
 const beta=view({facility_id:"DEMO-PSW-BETA"});
 assert.equal(beta.rows[0].doctors,0);
 assert.equal(beta.rows[0].paramedics,1);
});
test("M05-15 partial coverage does not create numeric staffing",()=>{
 const gamma=view({facility_id:"DEMO-PSW-GAMMA"});
 assert.equal(gamma.rows[0].sdm_coverage,"PARTIAL_DEMO");
 assert.equal(gamma.rows[0].doctors,null);
});
test("M05-15 no-data 2030 is null instead of zero",()=>{
 const y=view({year:2030,facility_id:"DEMO-PSW-BETA"});
 assert.equal(y.rows[0].doctors,null);
 assert.equal(y.rows[0].profile_state,"NOT_AVAILABLE_DEMO");
});
test("M05-15 2027 transfer does not double count staff",()=>{
 const y=view({year:2027,facility_id:"DEMO-PSW-GAMMA"});
 assert.equal(y.rows[0].doctors,2);
});
test("M05-15 different year does not inherit 2026 snapshot",()=>{
 assert.equal(view({year:2028}).summary.profile_available_demo,0);
});
test("M05-15 supports consistent geographic filter",()=>{
 assert.equal(view({region_id:"DEMO-REGION-UTARA"}).rows.length,2);
});
test("M05-15 mismatched region and facility rejected",()=>{
 assert.throws(()=>view({region_id:"DEMO-REGION-SELATAN",
  facility_id:"DEMO-PSW-BETA"}),/M05_15_FILTER_CONFLICT/);
});
test("M05-15 rejects unknown facility",()=>{
 assert.throws(()=>view({facility_id:"DEMO-PSW-UNKNOWN"}),/FILTER_INVALID/);
});
test("M05-15 rejects duplicate profile revisions for facility and year",()=>{
 const x=setup();x.profiles.push({...x.profiles[0]});
 assert.throws(()=>buildProfileSdmView(x),/DUPLICATE_PROFILE/);
});
test("M05-15 rejects placements overlapping for same staff",()=>{
 const x=setup();x.placements.push({
  staff_id:"DEMO-STAFF-01",facility_id:"DEMO-PSW-BETA",
  role:"PARAMEDIK",start_month:"2026-06",end_month:"2027-01"});
 assert.throws(()=>buildProfileSdmView(x),/OVERLAPPING_STAFF/);
});
test("M05-15 adjacent transfer periods allowed",()=>{
 assert.equal(view({year:2027}).rows.length,3);
});
test("M05-15 rejects unknown placement facility",()=>{
 const x=setup();x.placements[0].facility_id="DEMO-PSW-OTHER";
 assert.throws(()=>buildProfileSdmView(x),/PLACEMENT_INVALID/);
});
test("M05-15 rejects non-DEMO staff IDs",()=>{
 const x=setup();x.placements[0].staff_id="REAL-EMP-01";
 assert.throws(()=>buildProfileSdmView(x),/PLACEMENT_INVALID/);
});
test("M05-15 rejects out-of-range year",()=>{
 assert.throws(()=>view({year:2031}),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-15 rejects bad source references",()=>{
 const x=setup();x.profiles[0].source_ref="http://real.example";
 assert.throws(()=>buildProfileSdmView(x),/PROFILE_INVALID/);
});
test("M05-15 prevents staff assignments outside configured years",()=>{
 const x=setup();x.placements[0].start_month="2025-01";
 assert.throws(()=>buildProfileSdmView(x),/PLACEMENT_INVALID/);
});
test("M05-15 counts 0 explicitly only with complete DEMO coverage",()=>{
 const x=setup();x.placements=x.placements.filter(p=>p.facility_id!=="DEMO-PSW-BETA");
 const y=buildProfileSdmView({...x,facility_id:"DEMO-PSW-BETA"});
 assert.equal(y.rows[0].doctors,0);
 assert.equal(y.rows[0].paramedics,0);
});
test("M05-15 no names or personal contacts in result",()=>{
 const s=JSON.stringify(view());
 assert.equal(s.includes("phone"),false);
 assert.equal(s.includes("email"),false);
 assert.equal(view().no_person_names,true);
});
test("M05-15 aggregated count not published if some coverage missing",()=>{
 assert.equal(view({year:2027}).summary.total_staff,null);
});
test("M05-15 joins APEL and SDM on same DEMO IDs",()=>{
 const result=buildIntegratedDemoView();
 assert.equal(result.schema,M05_15_INTEGRATION_SCHEMA);
 assert.equal(result.rows.length,3);
});
test("M05-15 integrated view keeps missing APEL months separate from SDM gaps",()=>{
 const result=buildIntegratedDemoView({year:2030});
 assert.equal(result.dashboard_summary.observed_demo_events,null);
 assert.equal(result.profile_sdm_summary.total_staff,null);
});
test("M05-15 integrated filter preserves facility scope",()=>{
 const result=buildIntegratedDemoView({facility_id:"DEMO-PSW-BETA"});
 assert.equal(result.rows.length,1);
 assert.equal(result.rows[0].facility_id,"DEMO-PSW-BETA");
});
test("M05-15 rejects changed DEMO registry on join",()=>{
 const wrong=setup();wrong.facilities[0].facility_label="Puskeswan DEMO Changed";
 assert.throws(()=>buildIntegratedDemoView({
  dashboardFixture:buildDemoDashboardFixture(),profileFixture:wrong
 }),/FACILITY_REGISTRY_MISMATCH/);
});
test("M05-15 rejects foreign or non-synthetic fixture",()=>{
 const wrong=setup();wrong.synthetic=false;
 assert.throws(()=>buildIntegratedDemoView({profileFixture:wrong}),
  /NON_SYNTHETIC_SOURCE/);
});
test("M05-15 all authority and publishing flags stay denied",()=>{
 const v=view(),j=buildIntegratedDemoView();
 for(const key of ["may_publish","may_write","may_connect","may_deploy"]){
  assert.equal(v[key],false);assert.equal(j[key],false);
 }
 assert.equal(v.officially_verified,false);
});
