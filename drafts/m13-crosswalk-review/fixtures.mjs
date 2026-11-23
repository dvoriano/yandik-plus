/** M13-S3 | All reviewer and proposer IDs are synthetic. */
import {demoCrosswalkFixture}
 from "../m13-apel-crosswalk/fixtures.mjs";
import {emptyDemoReviewLog}
 from "./review.mjs";
export function demoHumanReviewFixture(){
 return {
  context:demoCrosswalkFixture(),
  proposals:[{link_id:"DEMO-CROSSWALK-ONE",
    proposer_id:"DEMO-USER-PROVINSI_ADMIN"}],
  reviewLog:emptyDemoReviewLog()
 };
}
export function demoReviewerSession(role="provinsi_verifikator"){
 return {resolveReviewerSession:()=>({
  id:"DEMO-USER-"+role.toUpperCase(),role,active:true,
  region:"Wilayah DEMO Utara"
 })};
}
