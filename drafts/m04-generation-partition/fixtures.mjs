/**
 * M04-I5 | KODE DITULIS, BELUM DIUJI.
 * Synthetic I4->I5 fixture without touching any actual DB or source provider.
 */
import {demoWorkspace,MASTER} from "../m04-integrated-workspace/fixtures.mjs";
import {advanceDemo} from "../m04-integrated-workspace/workspace.mjs";
import {followUpProblem} from "../../prototypes/profil-puskeswan/problems.mjs";
import {createOrEditNeed,verifyNeed} from "../../prototypes/profil-puskeswan/support_needs.mjs";
import {useRole} from "../../prototypes/profil-puskeswan/model.mjs";
import {buildReconciliationBranch} from "../m04-reconciliation/impact.mjs";
import {previewDemoPromotion} from "../m04-reconciliation-activation/activation.mjs";

export const A=MASTER[0],B=MASTER[1],C=MASTER[2];
export const CORRECTION="DEMO-KOREKSI-001";
export function archivedI4Fixture(){
 const before=advanceDemo(demoWorkspace(),A.id,"paket");
 const changed=followUpProblem(useRole(before.states[0],"verifikator_kab"),
  1,"ditindaklanjuti","Perubahan masalah fiktif untuk koreksi sumber.");
 const packet={revision:2,state:changed};
 const draft=buildReconciliationBranch(before,A,1,packet);
 const correction={id:CORRECTION,facility_id:A.id,
  status:"siap_aktivasi_demo",base_source_revision:1};
 const entry={correction_id:CORRECTION,facility_id:A.id,
  impact:draft.impact,branch:draft.branch,base_workspace:before,
  source_revision:2,base_workspace_revision:6,
  review:{disposition:"catat_cabang_draf"}};
 const promoted=previewDemoPromotion(before,entry,correction,1,packet);
 const archives=[{...promoted.archive,recorded_by:"DEMO-USER-ADMIN"}];
 const retired=[...promoted.archive.retired_ids.packages,
  ...promoted.archive.retired_ids.reviews,
  ...promoted.archive.retired_ids.schedules];
 const activeCorrection={...correction,status:"diaktifkan_demo_terarsip"};
 const payload={workspace:promoted.workspace,
  source_versions:{[A.id]:2,[B.id]:1,[C.id]:0},
  corrections:[activeCorrection],
  reconciliations:[{...entry,branch:null,
   activation_review:{disposition:"catat_kesiapan_demo"}}],
  archived_workflows:archives,retired_workflow_ids:retired};
 return {payload,oldWorkspace:before,source:changed,sourceRevision:7};
}
export function newerVerifiedNeed(source){
 let s=useRole(source,"petugas");
 s=createOrEditNeed(s,{
  problem_id:1,category:"peralatan",
  item:"Peralatan tambahan untuk generasi dua",
  quantity:1,unit:"unit",urgency:"sedang",
  reason:"Kebutuhan baru setelah tindak lanjut masalah fiktif.",
  evidence:[{type:"observasi",ref:"DEMO-BUKTI-REVISI-002"}]
 },"submit");
 const id=s.supportNeeds.at(-1).id;
 s=verifyNeed(useRole(s,"verifikator_prov"),id,"terverifikasi",
  "Verifikasi metadata kebutuhan generasi baru DEMO.",{evidenceReviewed:true});
 return useRole(s,"petugas");
}
