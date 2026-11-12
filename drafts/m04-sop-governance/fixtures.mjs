/** M04-S8 | DEMO BELUM DIUJI: S7 SOP note generated through prior pure models. */
import {
  ROUTE_NOTE_DEMO, BOOK_DEMO, TASKS_DEMO, REGISTER_DEMO, DOSSIER_DEMO,
  PROCESS_OWNER_DEMO, SOP_REVIEWER_DEMO, DEFAULT_PROPOSAL_DEMO,
} from "../m04-unit-catalog/fixtures.mjs";
import {
  prepareCoordinationDraft,submitCoordinationDraft,reviewCoordinationDraft,
} from "../m04-unit-catalog/unit_catalog.mjs";
const draft=prepareCoordinationDraft(ROUTE_NOTE_DEMO,BOOK_DEMO,TASKS_DEMO,
  REGISTER_DEMO,DOSSIER_DEMO,DEFAULT_PROPOSAL_DEMO,PROCESS_OWNER_DEMO);
const pending=submitCoordinationDraft(draft,ROUTE_NOTE_DEMO,BOOK_DEMO,
  TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,PROCESS_OWNER_DEMO);
export const SOP_SOURCE_DEMO=reviewCoordinationDraft(pending,ROUTE_NOTE_DEMO,
  BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,SOP_REVIEWER_DEMO,
  "catat_untuk_bahan_sop",
  "Konsep ini dapat menjadi bahan kajian kelembagaan simulasi, tidak ada pengesahan SOP resmi.");
export const PREPARER_DEMO={
  role:"pengampu_kelembagaan_demo",id:"DEMO-PENGAMPU-KELEMBAGAAN-01",
};
export const REVIEWER_DEMO={
  role:"penelaah_kelembagaan_demo",id:"DEMO-PENELAAH-KELEMBAGAAN-02",
};
export const CHANGE_DEMO={
  type:"ubah",unit_key:"arsip_demo",
  candidate:{
    id:"DEMO-UNIT-ARSIP-01",
    label:"Pengelola administrasi/arsip (DEMO)",
    role:"Menyiapkan penelusuran metadata, kelengkapan bukti dan daftar pertanyaan arsip.",
    boundary:"Tidak memvalidasi surat dari penerbit atau menerbitkan dokumen resmi.",
    precondition:"Perlu sumber metadata lengkap dan verifikasi pihak penerbit di luar sistem.",
    example_contact:"DEMO-KONTAK-ARSIP-01",
  },
  reason:"Rencana meninjau ulang fungsi unit arsip agar kelengkapan metadata lebih mudah ditelusuri dalam simulasi.",
  impact_routes:"Penerusan kendala M04-S6 harus dibahas ulang jika ruang lingkup unit berubah nantinya.",
  impact_raci:"Penanggung jawab RACI M04-S7 perlu dikaji agar penelaah dan pelapor tetap terpisah.",
  impact_sop:"Konsep SOP dan bukti pengarsipan perlu diperiksa ulang bila unit katalog diubah.",
  rollback_note:"Jika usulan tidak sesuai, jangan terapkan; pertahankan katalog asal dan catat alasannya.",
};
