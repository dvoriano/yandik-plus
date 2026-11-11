/**
 * M04-S7 | KODE DITULIS, BELUM DIUJI.
 * Uses an M04-S6 note marked "discussion material" in a fully fictional chain.
 */
import {
  BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,TICKET_ID_DEMO,
  COORDINATOR_DEMO,REVIEWER_DEMO,DEFAULT_NOTE,
} from "../m04-escalation-matrix/fixtures.mjs";
import {
  suggestEscalationRoute,prepareRoutingNote,submitRoutingNote,reviewRoutingNote,
} from "../m04-escalation-matrix/routing_matrix.mjs";
export { BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO };
const suggestion=suggestEscalationRoute(BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,
  DOSSIER_DEMO,TICKET_ID_DEMO);
const draft=prepareRoutingNote(BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
  TICKET_ID_DEMO,{chosen_unit:suggestion.suggested_unit,
    reason:DEFAULT_NOTE.reason,source_note:DEFAULT_NOTE.source_note},COORDINATOR_DEMO);
const submitted=submitRoutingNote(draft,BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,
  DOSSIER_DEMO,COORDINATOR_DEMO);
export const ROUTE_NOTE_DEMO=reviewRoutingNote(submitted,BOOK_DEMO,TASKS_DEMO,
  REGISTER_DEMO,DOSSIER_DEMO,REVIEWER_DEMO,"catat_untuk_pembahasan",
  "Pilihan unit contoh dapat dicatat sebagai bahan diskusi, bukan penetapan alur atau disposisi resmi.");
export const PROCESS_OWNER_DEMO={
  role:"pengampu_proses_demo",id:"DEMO-PENGAMPU-PROSES-01",
};
export const SOP_REVIEWER_DEMO={
  role:"penelaah_sop_demo",id:"DEMO-PENELAAH-SOP-02",
};
export const DEFAULT_PROPOSAL_DEMO={
  unit_key:ROUTE_NOTE_DEMO.chosen_unit,
  coordination_scope:"Unit tujuan menyiapkan ringkasan metadata kendala untuk pembahasan dengan pengampu proses.",
  minimum_checks:"Periksa ID sumber, kelengkapan catatan, versi rujukan, dan batas kewenangan sebelum membahas tindak lanjut.",
  exception_path:"Bila rujukan berubah atau informasi tidak sesuai, kembalikan untuk klarifikasi dan catat alasan perubahan.",
  recordkeeping_note:"Simpan daftar dokumen yang perlu dicek dan catatan keputusan manusia melalui sistem arsip yang resmi kelak.",
  review_day_demo:"2026-11-30",
  rationale:"Rancangan menata pembagian tugas administratif sementara, tanpa menggantikan persetujuan pejabat dan SOP resmi.",
};
