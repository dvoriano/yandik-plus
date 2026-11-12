/** M04-S9K | KODE DITULIS BELUM DIUJI. ONLY FICTIONAL DEMO NOTES. */
import {AGENDA_DEMO} from "../m04-discussion-confirmation/fixtures.mjs";
import {createDemoConfirmationBook,editDemoConfirmation,confirmationView}
  from "../m04-discussion-confirmation/confirmation.mjs";

let book=createDemoConfirmationBook(AGENDA_DEMO);
book=editDemoConfirmation(book,AGENDA_DEMO,"kelembagaan","GOV-01",{
  masukan_demo:"Contoh: fungsi pengampu belum dirumuskan pada bahan diskusi.",
  kekurangan_bukti_demo:"Contoh: perlu matriks proses dan batas tugas fiktif.",
  tindak_lanjut_usulan_demo:"Susun contoh tabel peran dan kebutuhan telaah, bukan penugasan.",
});
book=editDemoConfirmation(book,AGENDA_DEMO,"keamanan","SEC-01",{
  masukan_demo:"Contoh: perlu bahan diskusi pembatasan akses repository.",
  kekurangan_bukti_demo:"Contoh: inventaris kategori data belum disiapkan.",
  tindak_lanjut_usulan_demo:"Siapkan contoh daftar kategori informasi tanpa data asli.",
});
book=editDemoConfirmation(book,AGENDA_DEMO,"data","DAT-01",{
  masukan_demo:"Contoh: rancangan identitas Puskeswan perlu diselaraskan.",
  kekurangan_bukti_demo:"Contoh: skema relasi ID sintetis belum ditelaah.",
  tindak_lanjut_usulan_demo:"Rancang contoh pemetaan ID lintas modul untuk diskusi.",
});
export const CONFIRMATION_VIEW_DEMO=confirmationView(book,AGENDA_DEMO);
export {AGENDA_DEMO};
