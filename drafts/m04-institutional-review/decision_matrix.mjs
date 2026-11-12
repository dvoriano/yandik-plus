/**
 * YANDIK+ M04-S9C | KODE DITULIS, BELUM DIUJI.
 * Generates a discussion agenda, NOT an approval, certificate, release gate,
 * SOP enactment, security audit, legal opinion or integration authorization.
 * Inputs: previously prepared M04-S9B synthetic briefing and a dated
 * repository-visibility observation supplied by the reviewer.
 */
import {BRIEF_SCHEMA} from "../m04-institutional-briefing/briefing.mjs";

export const MATRIX_SCHEMA="M04-S9C-REVIEW-PACKET-UNTESTED-1";
export const DECISION_BOUNDARY="BUTUH_TELAAH_MANUSIA_DAN_BELUM_LAYAK_DINYATAKAN_SIAP";
const OWNER_SUGGESTIONS=Object.freeze({
  pemilik_proses:"Pengampu proses bisnis (usulan, belum ditetapkan)",
  tupoksi:"Pengampu organisasi/tata laksana (usulan, belum ditetapkan)",
  otorisasi:"Pengampu kewenangan dan pemeriksaan (usulan, belum ditetapkan)",
  raci:"Koordinator proses lintas unit (usulan, belum ditetapkan)",
  dasar_prosedur:"Pengampu SOP dan tata naskah (usulan, belum ditetapkan)",
  arsip_retensi:"Pengampu kearsipan (usulan, belum ditetapkan)",
  keamanan_akses:"Pengampu keamanan data/akses (usulan, belum ditetapkan)",
  spbe:"Pengampu koordinasi SPBE (usulan, belum ditetapkan)",
  audit:"Pengampu audit dan jejak perubahan (usulan, belum ditetapkan)",
  qa_lapangan:"Pengampu QA dan uji pengguna (usulan, belum ditetapkan)",
});
const EVIDENCE_SUGGESTIONS=Object.freeze({
  pemilik_proses:"Identifikasi unit pengampu, dasar penugasan, dan batas proses yang disepakati.",
  tupoksi:"Matriks tugas/fungsi resmi yang diperiksa terhadap rancangan M04-S7.",
  otorisasi:"Matriks peran, pemisahan pemeriksaan, dan dasar kewenangan resmi.",
  raci:"Matriks RACI dan jalur eskalasi yang diperiksa bersama unit terkait.",
  dasar_prosedur:"Draft SOP, dasar ketentuan, alur telaah, tata naskah dan pihak penetapnya.",
  arsip_retensi:"Peta penyimpanan, klasifikasi, retensi serta akses bukti/dokumen.",
  keamanan_akses:"Rencana autentikasi, otorisasi wilayah, audit, perlindungan data dan respons insiden.",
  spbe:"Catatan koordinasi arsitektur SPBE dan kebutuhan integrasi sistem resmi.",
  audit:"Rencana audit tahan perubahan, siapa meninjau dan prosedur koreksi catatan.",
  qa_lapangan:"Rencana tes fungsi/keamanan/aksesibilitas dan berita acara uji pengguna jika kelak dilakukan.",
});
function observed(value) {
  if(!value||typeof value!=="object"||Array.isArray(value))throw Error("Observasi repo harus objek.");
  if(!["public","private","unknown"].includes(value.visibility))
    throw Error("Status visibilitas hanya public, private atau unknown.");
  if(typeof value.observed_on!=="string"||!/^20\d{2}-\d{2}-\d{2}$/.test(value.observed_on))
    throw Error("Tanggal observasi harus YYYY-MM-DD.");
  const d=new Date(value.observed_on+"T00:00:00Z");
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==value.observed_on)
    throw Error("Tanggal observasi tidak sah.");
  if(value.source!=="github_metadata_readonly"&&value.source!=="unknown")
    throw Error("Rujukan observasi repo tidak dikenal.");
  return {visibility:value.visibility,observed_on:value.observed_on,source:value.source};
}
export function buildInstitutionalReviewPacket(brief,repoObservation) {
  if(!brief||typeof brief!=="object"||brief.schema!==BRIEF_SCHEMA||
    brief.synthetic!==true||!Array.isArray(brief.requirements)||
    !Array.isArray(brief.findings)||!Array.isArray(brief.change_proposals)||
    !Array.isArray(brief.decisions_for_humans))
    throw Error("Sumber harus ringkasan DEMO M04-S9B yang sah.");
  const repo=observed(repoObservation);
  const mandatory=brief.requirements.filter(x=>x.mandatory);
  const keys=new Set(mandatory.map(x=>x.id));
  if(mandatory.length!==10||keys.size!==10||
    Object.keys(OWNER_SUGGESTIONS).some(x=>!keys.has(x)))
    throw Error("Cakupan 10 persyaratan wajib belum lengkap.");
  const questions=mandatory.map(x=>({
    id:"S9C-"+x.id,group:"Persyaratan wajib",
    subject:x.title,source_ref:x.id,
    owner_suggestion:OWNER_SUGGESTIONS[x.id],
    evidence_needed:EVIDENCE_SUGGESTIONS[x.id],
    demo_checklist_status:x.status,
    active_demo_register:x.active_related,
    priority:x.missing_for_discussion?"PERLU_KLARIFIKASI":"PERLU_VALIDASI_BUKTI_RIIL",
    resolution:"BELUM_DIPUTUSKAN_MANUSIA",
  }));
  const publicRisk=repo.visibility==="public";
  const access={
    id:"S9C-AKSES-REPO",group:"Perlindungan informasi",
    subject:"Keputusan klasifikasi dan visibilitas repository GitHub",
    owner_suggestion:"Pemilik repositori dan pengampu pengelolaan informasi",
    evidence_needed:"Keputusan visibilitas/klasifikasi isi, review riwayat dan mekanisme pencegahan unggahan data rahasia.",
    priority:publicRisk?"PRIORITAS_TINGGI":"PERLU_VERIFIKASI",
    resolution:"BELUM_DIPUTUSKAN_MANUSIA",
    observation:"GitHub "+repo.visibility+" diamati pada "+repo.observed_on+
      "; hanya snapshot, bukan pemeriksaan status live.",
  };
  const qa={
    id:"S9C-QA",group:"Kelayakan teknis",
    subject:"Rencana pengujian dan keamanan integrasi untuk seluruh kode draft belum diuji",
    owner_suggestion:"Pengampu teknis dan keamanan (usulan, belum ditetapkan)",
    evidence_needed:"Catatan QA terukur dan hasil uji setelah owner secara eksplisit mengizinkan; audit akses, API/DB dan risiko SPBE.",
    priority:"TERTUNDA_SAMPAI_IZIN_UJI",
    resolution:"BELUM_DIPUTUSKAN_MANUSIA",
  };
  const catalog=brief.change_proposals.map(x=>({
    id:"S9C-KATALOG-"+x.id,group:"Perubahan katalog",
    subject:x.unit_key+" / "+x.type,
    owner_suggestion:"Pemilik proses dan pengampu struktur unit (belum ditetapkan)",
    evidence_needed:"Tupoksi, dampak RACI/eskalasi/SOP, risiko dan rencana rollback yang ditelaah manusia.",
    priority:"PERLU_TELAAH",
    resolution:"BELUM_DIPUTUSKAN_MANUSIA",
  }));
  const rows=[access,...questions,...catalog,qa];
  return {
    schema:MATRIX_SCHEMA,synthetic:true,
    origin:"M04-S9B DEMO / GitHub metadata snapshot supplied, NOT current live approval",
    as_of_demo:brief.as_of_demo,
    repo_observation:repo,
    summary:{
      discussion_items:rows.length,mandatory_requirements:mandatory.length,
      mandatory_unresolved_demo:mandatory.filter(x=>x.missing_for_discussion).length,
      active_demo_findings:brief.totals?.open??null,
      attention_demo:brief.totals?.attention??null,
      repo_public_on_observed_date:publicRisk,
      untested_code:true,
    },
    rows, 
    flags:[
      ...(publicRisk?["Repo PUBLIC pada tanggal observasi: hindari data riil/rahasia dan minta keputusan pemilik."]:[]),
      ...(brief.source?.source_changed?["Sumber M04-S7/S8 berubah menurut snapshot: perlu kaji ulang."]:[]),
      "Semua status DEMO dan daftar bukti contoh bukan hasil telaah resmi.",
      "Tidak ada penetapan SOP, persetujuan bantuan, pengadaan, anggaran, BAST atau izin integrasi.",
    ],
    integration_status:DECISION_BOUNDARY,
  };
}
export function institutionalReviewPacketText(packet){
  if(!packet||packet.schema!==MATRIX_SCHEMA||packet.synthetic!==true||
    !Array.isArray(packet.rows))throw Error("Bahan review M04-S9C tidak sesuai.");
  return [
    "DRAF AGENDA PEMBAHASAN KELEMBAGAAN YANDIK+ M04-S9C | KODE BELUM DIUJI",
    "Sumber: M04-S9B DEMO. BUKAN hasil rapat/telaah sah atau penetapan kewenangan.",
    "Tanggal contoh: "+packet.as_of_demo,
    "Observasi GitHub: "+packet.repo_observation.visibility+
      " pada "+packet.repo_observation.observed_on+
      " (tidak otomatis diperbarui)",
    "Jumlah butir pembahasan: "+packet.rows.length,
    ...packet.rows.map((x,i)=>String(i+1)+". "+x.subject+
      " | kebutuhan: "+x.evidence_needed+
      " | pengampu usulan: "+x.owner_suggestion+
      " | prioritas: "+x.priority+
      " | hasil keputusan: BELUM ADA"),
    "BATASAN:",
    ...packet.flags.map(x=>"- "+x),
    "STATUS: "+packet.integration_status,
  ].join("\n");
}
