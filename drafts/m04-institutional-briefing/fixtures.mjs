/** M04-S9B DEMO. KODE DITULIS, BELUM DIUJI. */
import {DOCKET_DEMO,SOP_DEMO,COORDINATOR_DEMO,STAFF_DEMO,EXAMPLE_PLAN}
  from "../m04-institutional-followup/fixtures.mjs";
import {createInstitutionalFollowupRegister,createFollowupFinding,recordFinding}
  from "../m04-institutional-followup/followup_register.mjs";
export {DOCKET_DEMO,SOP_DEMO};
let register=createInstitutionalFollowupRegister();
register=createFollowupFinding(register,DOCKET_DEMO,SOP_DEMO,EXAMPLE_PLAN,COORDINATOR_DEMO);
register=recordFinding(register,register.items.at(-1).id,DOCKET_DEMO,SOP_DEMO,COORDINATOR_DEMO);
register=createFollowupFinding(register,DOCKET_DEMO,SOP_DEMO,{
  kind:"syarat_kelembagaan",source_ref:"otorisasi",
  description:"Pemisahan peran pengisi, penelaah, dan penanggung jawab kewenangan belum dikaji secara resmi.",
  impact:"Bila tidak dibahas, pengelolaan proses berisiko tidak sesuai penugasan dan kewenangan.",
  corrective_plan:"Siapkan daftar peran, batas kewenangan, dan dokumen pengampu proses untuk ditelaah.",
  expected_output:"Matriks kewenangan awal sebagai bahan diskusi internal tanpa pengesahan.",
  assignee_demo_id:STAFF_DEMO.id,due_date_demo:"2026-11-09",
},COORDINATOR_DEMO);
register=createFollowupFinding(register,DOCKET_DEMO,SOP_DEMO,{
  kind:"usulan_katalog",source_ref:"DEMO-UBAH-UNIT-001",
  description:"Usulan perubahan unit fiktif memerlukan penilaian dampak pada rute eskalasi dan RACI.",
  impact:"Rute pengelolaan pekerjaan berisiko tidak selaras apabila unit diubah tanpa kajian.",
  corrective_plan:"Buat daftar dampak terhadap jalur, pembagian peran, SOP, arsip dan rencana pemulihan.",
  expected_output:"Bahan pembahasan perubahan unit dan matriks dampaknya untuk pemilik proses.",
  assignee_demo_id:STAFF_DEMO.id,due_date_demo:"2026-12-12",
},COORDINATOR_DEMO);
export const REGISTER_DEMO=register;
