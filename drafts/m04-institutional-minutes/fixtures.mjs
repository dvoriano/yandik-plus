/** M04-S9D | KODE DITULIS, BELUM DIUJI. Seluruh data fiktif. */
import {buildExecutiveBrief,REGISTER_DEMO,DOCKET_DEMO,SOP_DEMO,
  REPOSITORY_SNAPSHOT_DEMO} from "../m04-institutional-review/fixtures.mjs";
import {buildInstitutionalReviewPacket} from "../m04-institutional-review/decision_matrix.mjs";
import {createDiscussionRegister,addDiscussion} from "./register.mjs";
export const AGENDA_DEMO=buildInstitutionalReviewPacket(
  buildExecutiveBrief(REGISTER_DEMO,DOCKET_DEMO,SOP_DEMO),REPOSITORY_SNAPSHOT_DEMO);
export const SECRETARIAT_DEMO={role:"sekretariat_demo",id:"DEMO-SEKRETARIAT-001"};
export const REVIEWER_DEMO={role:"penelaah_demo",id:"DEMO-PENELAAH-001"};
export const EXAMPLE={
  subject:AGENDA_DEMO.rows[0].subject,
  discussion:"Contoh pembahasan menunjukkan perlunya kepastian akses repository dan klasifikasi dokumen.",
  evidence_needed:"Bukti yang dibutuhkan meliputi keputusan pemilik dan kajian isi serta riwayat repository.",
  next_step:"Susun ringkasan peninjauan akses dan daftar pemeriksaan informasi sebelum penggunaan data asli.",
  assigned_demo_id:"DEMO-PETUGAS-001",due_date_demo:"2026-11-14",
};
let register=createDiscussionRegister(AGENDA_DEMO,SECRETARIAT_DEMO);
register=addDiscussion(register,AGENDA_DEMO,AGENDA_DEMO.rows[0].id,EXAMPLE,SECRETARIAT_DEMO);
export const REGISTER_DEMO=register;
