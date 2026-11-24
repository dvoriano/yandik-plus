/**
 * M05-15 | CODE_ONLY. Read-only cross-model link, no mutation, no API.
 * Year and region/facility filters are shared with existing M05-14 dashboard.
 */
import {buildDemoDashboard} from "../m05-apel-dashboard-ui/model.mjs";
import {buildDemoDashboardFixture} from "../m05-apel-dashboard-ui/fixtures.mjs";
import {buildProfileSdmView} from "./model.mjs";
import {buildDemoProfileSdmFixture} from "./fixtures.mjs";

export const M05_15_INTEGRATION_SCHEMA="M05-15-APEL-PROFILE-SDM-LINK-UNTESTED-1";
const fail=code=>{throw Error(code);};
export function buildIntegratedDemoView({
 year=2026,region_id="ALL",facility_id="ALL",
 dashboardFixture=buildDemoDashboardFixture(),
 profileFixture=buildDemoProfileSdmFixture()
}={}){
 if(dashboardFixture?.metadata?.synthetic!==true||
    dashboardFixture.metadata.no_real_facility_data!==true||
    profileFixture?.synthetic!==true||
    profileFixture.contains_personal_data!==false)
  fail("M05_15_NON_SYNTHETIC_SOURCE");
 const profile=buildProfileSdmView({
  facilities:profileFixture.facilities,profiles:profileFixture.profiles,
  coverage:profileFixture.coverage,placements:profileFixture.placements,
  year,region_id,facility_id
 });
 const dash=buildDemoDashboard({
  ledger:dashboardFixture.ledger,facilities:dashboardFixture.facilities,
  year,region_id,facility_id
 });
 const left=new Set(dashboardFixture.facilities.map(f=>f.facility_id+
  "|"+f.region_id+"|"+f.facility_label+"|"+f.region_label));
 const right=new Set(profileFixture.facilities.map(f=>f.facility_id+
  "|"+f.region_id+"|"+f.facility_label+"|"+f.region_label));
 if(left.size!==right.size||[...left].some(x=>!right.has(x)))
  fail("M05_15_FACILITY_REGISTRY_MISMATCH");
 const index=new Map(profile.rows.map(r=>[r.facility_id,r]));
 const rows=dash.facility_rows.map(r=>{
  const p=index.get(r.facility_id);
  if(!p||p.region_id!==r.region_id)fail("M05_15_JOIN_MISMATCH");
  return {facility_id:r.facility_id,facility_label:r.facility_label,
   region_id:r.region_id,year,
   reported_months:r.reported_months,
   observed_demo_events:r.observed_demo_total,
   report_coverage:r.total_coverage,
   profile_state:p.profile_state,profile_source_ref:p.profile_source_ref,
   sdm_coverage:p.sdm_coverage,sdm_source_ref:p.sdm_source_ref,
   doctors:p.doctors,paramedics:p.paramedics,
   source_join_verified:false,officially_verified:false};
 });
 return {
  schema:M05_15_INTEGRATION_SCHEMA,synthetic:true,
  year,filters:{region_id,facility_id},
  dashboard_summary:dash.summary,profile_sdm_summary:profile.summary,
  rows,
  context_only:true,no_operational_authorization:true,
  may_score:false,may_rank:false,may_award:false,may_publish:false,
  may_write:false,may_connect:false,may_deploy:false
 };
}
