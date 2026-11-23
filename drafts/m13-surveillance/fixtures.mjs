/** M13-S1 | Disease scenarios and every location/reference are invented. */
import {demoSourceManifest,demoSourceSession}
 from "../m00-source-api-gate/fixtures.mjs";
export function demoSurveillanceFixtures(){
 const manifest=demoSourceManifest();
 const base={region_label:"Wilayah DEMO Utara",
   source_id:manifest.source_id,snapshot_id:manifest.snapshot_id,
   official_case_reference:null,official_lab_reference:null};
 return {manifest,events:[
  { ...base,event_id:"DEMO-EVENT-ALPHA",
    location_ref:"DEMO-LOCATION-A",period:"2026-01",
    syndrome_tag:"DEMO-SYNDROME-GENERAL",
    report_class:"SUSPECTED_UNVERIFIED_DEMO",
    investigation_state:"NOT_STARTED_DEMO",
    sample_state:"NOT_LOGGED_DEMO",
    followup_state:"NOT_RECORDED_DEMO",
    evidence_ref_count_demo:0},
  { ...base,event_id:"DEMO-EVENT-BETA",
    location_ref:"DEMO-LOCATION-B",period:"2026-04",
    syndrome_tag:"DEMO-SYNDROME-NEUROLOGIC",
    report_class:"FIELD_OBSERVATION_UNVERIFIED_DEMO",
    investigation_state:"FIELD_NOTES_RECORDED_UNVERIFIED_DEMO",
    sample_state:"SAMPLE_LOGGED_UNVERIFIED_DEMO",
    followup_state:"DRAFT_REVIEW_ONLY",
    evidence_ref_count_demo:1},
  { ...base,event_id:"DEMO-EVENT-GAMMA",
    location_ref:"DEMO-LOCATION-C",period:"2026-10",
    syndrome_tag:"DEMO-SYNDROME-RESPIRATORY",
    report_class:"SUSPECTED_UNVERIFIED_DEMO",
    investigation_state:"FIELD_NOTES_RECORDED_UNVERIFIED_DEMO",
    sample_state:"RESULT_NOTES_RECORDED_UNVERIFIED_DEMO",
    followup_state:"NOT_RECORDED_DEMO",
    evidence_ref_count_demo:2}
 ],synthetic:true,external_records_used:false,
   no_exact_coordinates:true};
}
export function demoSurveillanceAdapters(options={}){
 return demoSourceSession(options);
}
