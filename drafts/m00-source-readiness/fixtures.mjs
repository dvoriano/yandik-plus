/** M00-G4 | Fictional dossiers; never enter actual approvals or permits. */
import {demoSourceManifest,demoSourceSession}
 from "../m00-source-api-gate/fixtures.mjs";
import {M00_G4_CHECKS,M00_G4_DOSSIER_SCHEMA}
 from "./readiness.mjs";
export function demoReadinessFixture(){
 const manifest=demoSourceManifest();
 return {
  manifest,dossier:{
   schema:M00_G4_DOSSIER_SCHEMA,
   source_id:manifest.source_id,region_label:manifest.region_label,
   purpose:"INTERNAL_PLANNING_DEMO",
   request_state:"NOT_SUBMITTED_DEMO",
   review_items:M00_G4_CHECKS.map(check_id=>({
    check_id,state:"NOT_REVIEWED_DEMO"
   })),
   external_permission_ref:null
  },
  ...demoSourceSession({role:"provinsi_admin"})
 };
}
