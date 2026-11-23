/** M13-S2 | Invented matching keys ONLY. Not evidence of one real event. */
import {demoSurveillanceFixtures,demoSurveillanceAdapters}
 from "../m13-surveillance/fixtures.mjs";
import {buildDemoDashboardFixture}
 from "../m05-apel-dashboard-ui/fixtures.mjs";
export function demoCrosswalkFixture(){
 const {manifest,events}=demoSurveillanceFixtures();
 const linkedEvent={
  region_label:"Wilayah DEMO Utara",
  source_id:manifest.source_id,snapshot_id:manifest.snapshot_id,
  official_case_reference:null,official_lab_reference:null,
  event_id:"DEMO-EVENT-ONE",location_ref:"DEMO-LOCATION-ONE",
  period:"2026-06",syndrome_tag:"DEMO-SYNDROME-GENERAL",
  report_class:"SUSPECTED_UNVERIFIED_DEMO",
  investigation_state:"FIELD_NOTES_RECORDED_UNVERIFIED_DEMO",
  sample_state:"NOT_LOGGED_DEMO",
  followup_state:"DRAFT_REVIEW_ONLY",
  evidence_ref_count_demo:0
 };
 const link={
  link_id:"DEMO-CROSSWALK-ONE",
  facility_id:"DEMO-PSW-ALPHA",event_id:"DEMO-EVENT-ONE",
  location_ref:"DEMO-LOCATION-ONE",period:"2026-06",
  region_label:"Wilayah DEMO Utara",
  source_id:manifest.source_id,snapshot_id:manifest.snapshot_id,
  review_state:"PROPOSED_UNVERIFIED_DEMO"
 };
 return {
  ...demoSurveillanceAdapters(),
  region_label:"Wilayah DEMO Utara",
  manifest,events:[...events,linkedEvent],
  dashboardFixture:buildDemoDashboardFixture(),
  links:[link],year:2026
 };
}
