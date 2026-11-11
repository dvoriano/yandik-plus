/**
 * YANDIK+ M04-S9F | KODE DITULIS, BELUM DIUJI.
 * A synthetic, read-only inventory of pre-integration questions and evidence.
 * No automated authorization, production access or check-off mechanism.
 */
import {OVERSIGHT_SCHEMA} from "../m04-institutional-oversight/oversight.mjs";

export const CHECKLIST_SCHEMA="M04-S9F-PREINTEGRATION-UNTESTED-1";
export const VERDICT="BELUM_DINILAI_TIDAK_ADA_IZIN_INTEGRASI";
export const STATES=Object.freeze({
  BUTUH_KEPUTUSAN:"Membutuhkan keputusan pejabat/pemilik proses",
  BELUM_DIBUKTIKAN:"Belum ada bukti riil yang diperiksa",
  MENUNGGU_IZIN_UJI:"Tes dilarang sampai izin eksplisit pemilik",
});
const groups=Object.freeze({
  kelembagaan:"Kelembagaan dan tata kelola",
  keamanan:"Perlindungan data dan akses",
  data:"Data induk dan integritas APEL",
  alur:"Alur support dan kewenangan",
  pengujian:"QA dan ketahanan",
  integrasi:"Integrasi, operasional dan rollback",
});
const check=(id,group,title,proof,owner,status,source)=>Object.freeze({
  id,group,title,proof,owner_suggestion:owner,status,source,
  meaning:"PERTANYAAN/BUKTI YANG PERLU DITELAAH, BUKAN PERSYARATAN YANG SUDAH LULUS",
});
export const REQUIREMENTS=Object.freeze([
  check("GOV-01","kelembagaan","Penanggung jawab proses dan batas tupoksi",
    "Penetapan pengampu, alur fungsi serta pembatasan penugasan lintas unit",
    "Pengampu organisasi dan proses bisnis","BUTUH_KEPUTUSAN","docs/M04_S7_UNIT_CATALOG_RACI.md"),
  check("GOV-02","kelembagaan","RACI, jalur eskalasi dan SOP yang berlaku",
    "Telaah resmi atas RACI, SOP, tata naskah, penandatanganan dan unit tujuan",
    "Pengampu SOP/tata laksana","BUTUH_KEPUTUSAN","docs/M04_S8_SOP_GOVERNANCE.md"),
  check("GOV-03","kelembagaan","Posisi YANDIK+ terhadap SPBE dan sistem resmi",
    "Koordinasi SPBE serta batas integrasi ke SRIKANDI/iSIKHNAS/sistem pengadaan",
    "Pengampu SPBE dan sistem/data","BUTUH_KEPUTUSAN","docs/MASTERPLAN.md"),
  check("GOV-04","kelembagaan","Tata naskah, bukti dan retensi arsip",
    "Klasifikasi dan retensi catatan, prosedur dokumen resmi serta penyimpanan bukti",
    "Pengampu kearsipan dan tata naskah","BUTUH_KEPUTUSAN","docs/M04_S9C_INSTITUTIONAL_REVIEW.md"),
  check("SEC-01","keamanan","Klasifikasi informasi dan visibilitas GitHub",
    "Keputusan pemilik atas repository private/public, inventaris akses dan riwayat paparan",
    "Pemilik repository/pengelola informasi","BUTUH_KEPUTUSAN","docs/REPOSITORY_ACCESS_DECISION.md"),
  check("SEC-02","keamanan","Autentikasi dan otorisasi berdasarkan peran/wilayah",
    "Rancangan dan uji akses API/server antar Puskeswan, kabupaten/kota, provinsi",
    "Pengampu keamanan aplikasi","MENUNGGU_IZIN_UJI","docs/SECURITY_AND_DATA.md"),
  check("SEC-03","keamanan","Audit permanen dan minimisasi data pribadi",
    "Log audit yang tidak mudah diubah, kebijakan data dan kontrol pengunduhan/unggahan",
    "Pengampu keamanan dan pengelola data","BELUM_DIBUKTIKAN","docs/SECURITY_AND_DATA.md"),
  check("SEC-04","keamanan","Rahasia, kredensial dan pengelolaan konfigurasi",
    "Audit isi/history rahasia, rotasi jika ditemukan, konfigurasi aman di luar repo",
    "Pengampu repository dan layanan","BELUM_DIBUKTIKAN","docs/REPOSITORY_ACCESS_DECISION.md"),
  check("DAT-01","data","Identitas Puskeswan lintas Profil, SDM dan APEL",
    "Pemetaan ID stabil, wilayah, relasi master dan contoh pembaruan yang aman",
    "Pengelola master data","BELUM_DIBUKTIKAN","docs/M02_PROFILING_2026_MAPPING.md"),
  check("DAT-02","data","Cakupan dan perhitungan APEL 2026 tetap utuh",
    "Pembuktian tanpa mengubah data historis, agregat, periode dan formula pelayanan",
    "Pengampu APEL dan pemilik data","MENUNGGU_IZIN_UJI","docs/modules/02_APEL_PUSKESWAN.md"),
  check("DAT-03","data","Provenance, koreksi dan deduplikasi bukti",
    "Uji keterlacakan sumber, versi, koreksi, bukti dan larangan duplikasi aktif",
    "Pengelola data dan verifikator","MENUNGGU_IZIN_UJI","docs/M03_EVIDENCE_AND_DEDUP.md"),
  check("FLOW-01","alur","Fairness prioritas dukungan dan batas keputusan",
    "Penetapan metode prioritas dan QA bobot/ketiadaan data tanpa alokasi otomatis",
    "Pengampu kebijakan dukungan","BUTUH_KEPUTUSAN","docs/M03_PRIORITY_ASSESSMENT.md"),
  check("FLOW-02","alur","Sambungan M03 ke M04, stale guard dan review DEMO",
    "Tes impor dan kontrak lintas M03-S4 sampai M04-S9E termasuk sumber berubah",
    "Pengampu teknis dan proses support","MENUNGGU_IZIN_UJI","docs/TEST_BACKLOG.md"),
  check("FLOW-03","alur","Keputusan eksternal dan penyaluran bukan hasil DEMO",
    "Prosedur referensi dokumen dari sistem berwenang dan batas pengadaan/BAST",
    "Pengampu keputusan dan administrasi resmi","BUTUH_KEPUTUSAN","docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md"),
  check("QA-01","pengujian","Unit/regresi dari M03-S4 hingga M04-S9E",
    "Hasil tes dependensi bertahap, data sintetis dan laporan temuan pasca izin",
    "Pengampu pengujian teknis","MENUNGGU_IZIN_UJI","docs/TEST_BACKLOG.md"),
  check("QA-02","pengujian","Keamanan input, aksesibilitas dan uji HP",
    "QA XSS, error dan keyboard/reader pada layar 320/375 piksel serta uji lapangan",
    "Pengampu UX/QA dan keamanan","MENUNGGU_IZIN_UJI","docs/UX_PAPERLESS.md"),
  check("INT-01","integrasi","Perencanaan staging, migrasi dan rollback",
    "Rencana pembuktian staging terpisah, backup terenkripsi, pemulihan dan monitoring",
    "Pengampu teknis operasional","BELUM_DIBUKTIKAN","docs/MASTERPLAN.md"),
  check("INT-02","integrasi","Kewenangan deploy dan jadwal perubahan",
    "Keputusan tertulis pelaksana serta langkah menghindari dampak pada YANDIK+ aktif",
    "Pemilik sistem dan pengampu operasional","BUTUH_KEPUTUSAN","docs/CODE_ONLY_MODE.md"),
]);
export const TEST_WAVES=Object.freeze([
  {id:"P0",title:"Prakondisi persetujuan dan keselamatan",
    prerequisites:"Pemilik mengizinkan QA; repo/klasifikasi data telah ditangani.",
    scope:"Dokumen dan keterlacakan sumber; tanpa server produksi.",status:"BELUM_DIMULAI"},
  {id:"P1",title:"Tes modul dasar dengan fixture sintetis",
    prerequisites:"P0 disetujui; import dependency dan versi branch dikunci.",
    scope:"M03-S4, M04-S1 sampai M04-S9E; validasi input, status dan stale guard.",status:"BELUM_DIMULAI"},
  {id:"P2",title:"Keamanan, UX dan regresi lintas modul",
    prerequisites:"P1 teruji; reviewer dan bukti skenario tersedia.",
    scope:"Role/wilayah, ID Puskeswan, APEL 2026, HP dan aksesibilitas.",status:"BELUM_DIMULAI"},
  {id:"P3",title:"Review staging dan rencana perubahan resmi",
    prerequisites:"Keputusan kelembagaan/SPBE dan data security, P2 teruji.",
    scope:"Staging terpisah, audit/rollback, validasi pemilik sistem; bukan deploy otomatis.",status:"BELUM_DIMULAI"},
]);
function obj(value){return value&&typeof value==="object"&&!Array.isArray(value);}
export function buildPreintegrationChecklist(board,context){
  if(!obj(board)||board.schema!==OVERSIGHT_SCHEMA||board.synthetic!==true||
    !Array.isArray(board.rows)||!obj(board.repo_snapshot)||
    !Number.isSafeInteger(board.total_agenda)||board.total_agenda!==board.rows.length||
    !["BELUM_DINILAI_DAN_BUKAN_IZIN_INTEGRASI"].includes(board.integration_readiness))
    throw Error("Sumber harus papan M04-S9E DEMO, bukan penetapan resmi.");
  if(!obj(context)||context.mode!=="CODE_ONLY"||
    context.repo_visibility!==board.repo_snapshot.visibility||
    context.repo_observed_on!==board.repo_snapshot.observed_on||
    context.authorized_testing!==false||context.production_connected!==false)
    throw Error("Konteks M04-S9F tidak cocok dengan snapshot CODE_ONLY.");
  if(!["public","private","unknown"].includes(context.repo_visibility))
    throw Error("Visibilitas repo tidak diketahui.");
  const ids=new Set();
  for(const row of board.rows){
    if(!obj(row)||typeof row.agenda_id!=="string"||ids.has(row.agenda_id)||
      row.needs_human_decision!==true)throw Error("Agenda tidak valid/duplikat.");
    ids.add(row.agenda_id);
  }
  const requirements=REQUIREMENTS.map(r=>({
    ...r,group_label:groups[r.group],done:false,official_evidence_verified:false,
    context_alert:r.id==="SEC-01"&&context.repo_visibility==="public"?
      "Repositori PUBLIC pada tanggal observasi, review akses prioritas.":r.id==="FLOW-02"&&
      board.source_stale?"Sumber DEMO berubah, tindakan harus ditahan.":"",
  }));
  return {
    schema:CHECKLIST_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    as_of_demo:board.as_of_demo,
    source:{schema:board.schema,agenda_count:board.total_agenda,
      notes_count:board.registered_notes,source_stale:board.source_stale,
      repo_snapshot:{...board.repo_snapshot}},
    totals:{checks:requirements.length,
      needs_decision:requirements.filter(x=>x.status==="BUTUH_KEPUTUSAN").length,
      needs_proof:requirements.filter(x=>x.status==="BELUM_DIBUKTIKAN").length,
      awaiting_qa:requirements.filter(x=>x.status==="MENUNGGU_IZIN_UJI").length,
      verified:0,unreviewed_agenda:board.missing_or_canceled,
      overdue_demo:board.overdue_notes},
    groups,requirements,waves:TEST_WAVES.map(x=>({...x})),
    integration_readiness:VERDICT,
    note:"Ini inventaris pekerjaan, bukan verifikasi kepatuhan, hasil audit atau status layak produksi.",
  };
}
export function checklistText(checklist){
  if(!obj(checklist)||checklist.schema!==CHECKLIST_SCHEMA||
    checklist.synthetic!==true||checklist.integration_readiness!==VERDICT||
    !Array.isArray(checklist.requirements)||!Array.isArray(checklist.waves))
    throw Error("Checklist DEMO M04-S9F tidak sah.");
  return [
    "YANDIK+ M04-S9F | PRASYARAT INTEGRASI (DEMO / KODE BELUM DIUJI)",
    "BUKAN HASIL PEMERIKSAAN, PERSETUJUAN ATAU IZIN DEPLOY.",
    "Tanggal contoh "+checklist.as_of_demo+
      "; sumber M04-S9E, agenda "+checklist.source.agenda_count,
    "Sumber berubah: "+(checklist.source.source_stale?"YA":"tidak terdeteksi DEMO"),
    "Repository snapshot: "+checklist.source.repo_snapshot.visibility+
      " per "+checklist.source.repo_snapshot.observed_on,
    "Prasyarat "+checklist.totals.checks+
      "; terverifikasi resmi: "+checklist.totals.verified,
    "CHECKLIST BELUM TERBUKTI:",
    ...checklist.requirements.map(r=>"- "+r.id+" | "+r.title+
      " | "+STATES[r.status]+" | saran pengampu: "+r.owner_suggestion+
      " | bukti: "+r.proof+
      (r.context_alert?" | PERHATIAN: "+r.context_alert:"")),
    "URUTAN QA MASIH DITAHAN:",
    ...checklist.waves.map(w=>"- "+w.id+" "+w.title+
      " | "+w.prerequisites+" | "+w.status),
    "STATUS: "+checklist.integration_readiness,checklist.note,
  ].join("\n");
}
