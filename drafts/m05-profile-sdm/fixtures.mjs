/** M05-15 | KODE DITULIS, BELUM DIUJI | invented source snapshots only. */
import {DEMO_FACILITIES} from "../m05-apel-dashboard-ui/fixtures.mjs";
export const DEMO_PROFILES=Object.freeze([
 {facility_id:"DEMO-PSW-ALPHA",region_id:"DEMO-REGION-UTARA",year:2026,
  profile_state:"RECORDED_DEMO",source_ref:"DEMO-SOURCE-PROFILE-A26"},
 {facility_id:"DEMO-PSW-BETA",region_id:"DEMO-REGION-UTARA",year:2026,
  profile_state:"REVIEW_PENDING_DEMO",source_ref:"DEMO-SOURCE-PROFILE-B26"},
 {facility_id:"DEMO-PSW-GAMMA",region_id:"DEMO-REGION-SELATAN",year:2026,
  profile_state:"DRAFT_DEMO",source_ref:"DEMO-SOURCE-PROFILE-C26"},
 {facility_id:"DEMO-PSW-ALPHA",region_id:"DEMO-REGION-UTARA",year:2027,
  profile_state:"RECORDED_DEMO",source_ref:"DEMO-SOURCE-PROFILE-A27"},
 {facility_id:"DEMO-PSW-GAMMA",region_id:"DEMO-REGION-SELATAN",year:2027,
  profile_state:"REVIEW_PENDING_DEMO",source_ref:"DEMO-SOURCE-PROFILE-C27"}
]);
export const DEMO_STAFF_COVERAGE=Object.freeze([
 {facility_id:"DEMO-PSW-ALPHA",year:2026,
  completeness:"COMPLETE_DEMO",source_ref:"DEMO-SOURCE-STAFF-A26"},
 {facility_id:"DEMO-PSW-BETA",year:2026,
  completeness:"COMPLETE_DEMO",source_ref:"DEMO-SOURCE-STAFF-B26"},
 {facility_id:"DEMO-PSW-GAMMA",year:2026,
  completeness:"PARTIAL_DEMO",source_ref:"DEMO-SOURCE-STAFF-C26"},
 {facility_id:"DEMO-PSW-ALPHA",year:2027,
  completeness:"COMPLETE_DEMO",source_ref:"DEMO-SOURCE-STAFF-A27"},
 {facility_id:"DEMO-PSW-GAMMA",year:2027,
  completeness:"COMPLETE_DEMO",source_ref:"DEMO-SOURCE-STAFF-C27"}
]);
export const DEMO_PLACEMENTS=Object.freeze([
 {staff_id:"DEMO-STAFF-01",facility_id:"DEMO-PSW-ALPHA",role:"DOKTER_HEWAN",
  start_month:"2026-01",end_month:"2027-07"},
 {staff_id:"DEMO-STAFF-02",facility_id:"DEMO-PSW-ALPHA",role:"PARAMEDIK",
  start_month:"2026-02",end_month:null},
 {staff_id:"DEMO-STAFF-03",facility_id:"DEMO-PSW-BETA",role:"PARAMEDIK",
  start_month:"2026-01",end_month:"2027-01"},
 {staff_id:"DEMO-STAFF-04",facility_id:"DEMO-PSW-GAMMA",role:"DOKTER_HEWAN",
  start_month:"2026-02",end_month:null},
 {staff_id:"DEMO-STAFF-01",facility_id:"DEMO-PSW-GAMMA",role:"DOKTER_HEWAN",
  start_month:"2027-07",end_month:null}
]);
export function buildDemoProfileSdmFixture(){
 return {
  facilities:DEMO_FACILITIES.map(f=>({...f})),
  profiles:DEMO_PROFILES.map(x=>({...x})),
  coverage:DEMO_STAFF_COVERAGE.map(x=>({...x})),
  placements:DEMO_PLACEMENTS.map(x=>({...x})),
  synthetic:true,contains_personal_data:false,
  profiles_officially_verified:false,staff_placements_verified:false
 };
}
