/** M04-S12 | KODE DITULIS, BELUM DIUJI. All fictional. */
import {NEEDS,PACKAGES,MAKER,REVIEWER,REFERENCES} from "../m04-support-package-review/fixtures.mjs";
import {createReview,submitReview,reviewPackage} from "../m04-support-package-review/review.mjs";
export {NEEDS};
// Extend the S10 fixture locally to demonstrate partial scheduling and mixed units.
export const DEMO_PACKAGES=[{...PACKAGES[0],lines:[
 {need_id:"DEMO-NEED-001",source_version:2,quantity:2},
 {need_id:"DEMO-NEED-002",source_version:1,quantity:1},
]}];
export function demoReview(fields=REFERENCES,action="catat_pembahasan"){
 const draft=createReview(NEEDS,DEMO_PACKAGES,"DEMO-TELAAH-DISTRIBUSI-001",
  {package_id:DEMO_PACKAGES[0].id,fields},MAKER);
 const submitted=submitReview(draft,NEEDS,DEMO_PACKAGES,MAKER);
 return reviewPackage(submitted,NEEDS,DEMO_PACKAGES,REVIEWER,action,
  "Bahan pembahasan distribusi fiktif, bukan persetujuan penyaluran.",true);
}
