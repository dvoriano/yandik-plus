/** M04-S5 | KODE DITULIS, BELUM DIUJI. Only fake data. */
import { DEMO_DOSSIER,DEMO_REGISTER,DEMO_REFERENCE_ID,DEMO_PLAN } from "../m04-admin-followup/fixtures.mjs";
import { createFollowupList,createFollowupDraft,assignFollowup,startFollowup } from "../m04-admin-followup/followup.mjs";
export const DOSSIER_DEMO=DEMO_DOSSIER;
export const REGISTER_DEMO=DEMO_REGISTER;
const coordinator={role:"koordinator_administrasi_demo",id:"DEMO-KOORDINATOR-PROV-01"};
export const REPORTER_DEMO={role:"petugas_tindak_lanjut_demo",id:"DEMO-PETUGAS-ADMIN-01"};
export const COORDINATOR_DEMO={role:"koordinator_eskalasi_demo",id:"DEMO-KOORDINATOR-ESK-01"};
export const RECEIVER_DEMO={role:"penerima_eskalasi_demo",id:"DEMO-UNIT-TUJUAN-01"};
export const REVIEWER_DEMO={role:"penelaah_eskalasi_demo",id:"DEMO-PENELAAH-ESK-02"};
export const ROUTE_DEMO={
  recipient_demo_id:RECEIVER_DEMO.id,
  due_date_demo:"2026-11-25",
  instruction:"Siapkan penjelasan administratif dan daftar informasi tambahan untuk menindaklanjuti kendala contoh.",
};
export const COMPLAINT_DEMO={
  category:"klarifikasi_penerbit",urgency:"perlu_perhatian",
  description:"Nomor dokumen rujukan contoh masih perlu dikonfirmasi kepada penerbit melalui proses resmi.",
  effect_on_work:"Penyusunan catatan tindak lanjut tertunda karena metadata belum lengkap.",
  attempted_steps:"Petugas telah mengumpulkan daftar pertanyaan serta membandingkan kode rujukan contoh.",
  needed_action:"Koordinator perlu meneruskan permintaan penjelasan kepada pihak yang sesuai prosedur.",
  evidence_ref_demo:"DEMO-BUKTI-KENDALA-01",
};
export const RESPONSE_DEMO={
  response:"Penerima telah menyusun catatan penjelasan metadata untuk pembahasan lebih lanjut oleh pemilik proses.",
  remaining_blocker:"Keaslian dokumen dan kesesuaian rujukan resmi masih harus ditelaah pihak berwenang.",
  evidence_ref_demo:"DEMO-TANGGAPAN-01",
};
let tasks=createFollowupList();
tasks=createFollowupDraft(tasks,REGISTER_DEMO,DEMO_REFERENCE_ID,DOSSIER_DEMO,
  DEMO_PLAN,coordinator);
tasks=assignFollowup(tasks,"DEMO-TUGAS-001",REGISTER_DEMO,DOSSIER_DEMO,coordinator);
tasks=startFollowup(tasks,"DEMO-TUGAS-001",REGISTER_DEMO,DOSSIER_DEMO,REPORTER_DEMO);
export const TASKS_DEMO=tasks;
export const TASK_ID_DEMO="DEMO-TUGAS-001";
