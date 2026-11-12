/**
 * M03-S4C | DRAF / BELUM DIUJI. Read-only text for preparing a future official
 * minute/berita acara, using only M03-S4B's synthetic review record.
 *
 * NEVER issue an official meeting number, approve methodology, sign a document,
 * choose a grant recipient, create budget allocations or mark a BAST completed.
 * No real names, personal data, timestamps, database, file upload or network.
 */
import { LEDGER_VERSION, STATUS, validateDraftSource } from "./review_ledger.mjs";
import { LAB_VERSION, PROFILES } from "./comparison.mjs";
export const MINUTES_DRAFT_VERSION = "M03-S4C-UNTESTED-1";
const DECISIONS = Object.freeze({
  catat: "Dicatat untuk pembahasan lanjutan, belum disahkan",
  perbaiki: "Dikembalikan untuk melengkapi data dan alasan",
  tolak: "Alternatif bobot tidak direkomendasikan dalam simulasi",
});
const SAFE_DEMO_REF = /^DEMO-[A-Z0-9_-]{4,50}$/;

function plainText(value, field, min, max) {
  if (typeof value !== "string") throw new Error(field + " wajib berupa teks.");
  const normalized = value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
  if (normalized.length < min || normalized.length > max)
    throw new Error(field + " harus " + min + " hingga " + max + " karakter.");
  return normalized;
}
function markdown(value) {
  return String(value).replace(/([\\\x60*_{}\[\]()<>#|])/g, "\\$1");
}
function display(value) {
  return value === null || value === undefined ? "BELUM DINILAI" : String(value);
}
function source(record) {
  validateDraftSource(record); // verifies earlier draft's shape and source comparison
  if (record.schema !== LEDGER_VERSION || record.synthetic !== true ||
      !record.author || record.author.role !== "verifikator_kab" ||
      !SAFE_DEMO_REF.test(record.author.id) ||
      !SAFE_DEMO_REF.test(record.evidence_ref) ||
      !Object.hasOwn(STATUS, record.status))
    throw new Error("Hanya catatan kajian DEMO yang dapat dijadikan draf.");
  if (record.snapshot.lab_version !== LAB_VERSION ||
      !Array.isArray(record.snapshot.changes) ||
      !Array.isArray(record.snapshot.missing_scenarios) ||
      !Array.isArray(record.snapshot.significant_rank_changes))
    throw new Error("Rincian sumber perbandingan tidak sah.");
  if (record.review !== null) {
    if (!record.review || typeof record.review !== "object" ||
        !Object.hasOwn(DECISIONS, record.review.decision) ||
        typeof record.review.notes !== "string" ||
        record.review.notes.trim().length < 30 ||
        !SAFE_DEMO_REF.test(record.review.reviewer_demo_id))
      throw new Error("Rincian catatan penelaah tidak sah.");
  }
  if (["dicatat", "dikembalikan", "tidak_direkomendasikan"].includes(record.status) &&
      record.review === null)
    throw new Error("Status kajian harus mempunyai hasil telaah.");
  if (record.history.some((h) =>
    !h || typeof h !== "object" ||
    !Number.isSafeInteger(h.version) || h.version < 1 ||
    typeof h.action !== "string" || typeof h.note !== "string" ||
    !SAFE_DEMO_REF.test(h.actor_demo_id)))
    throw new Error("Riwayat kajian DEMO tidak lengkap.");
  return record;
}
function formatHistory(history) {
  return history.map((item, index) => {
    const label = ({
      buat_draf: "Pembuatan draf",
      ajukan: "Pengajuan untuk kajian",
      revisi: "Perbaikan draf",
      catat: "Dicatat untuk pembahasan",
      perbaiki: "Dikembalikan untuk perbaikan",
      tolak: "Tidak direkomendasikan",
    })[item.action] ?? "Tindakan DEMO lain";
    return (index + 1) + ". Versi " + item.version + " | " + label +
      " | Peran: " + markdown(item.actor_demo_role) +
      " | Aktor: " + markdown(item.actor_demo_id) +
      " | Catatan: " + markdown(item.note);
  });
}
export function buildMinutesDraft(record, context) {
  const packet = source(record);
  if (!context || typeof context !== "object" || Array.isArray(context))
    throw new Error("Konteks telaah DEMO harus tersedia.");
  for (const forbidden of ["official_number", "signature", "approver",
    "approval_date", "allocation", "budget", "recipient", "bast"]) {
    if (Object.hasOwn(context, forbidden))
      throw new Error("Draf tidak menerima atribut pengesahan atau keputusan bantuan.");
  }
  const agenda = plainText(context.agenda, "Agenda telaah", 20, 300);
  const followUp = plainText(context.follow_up, "Catatan tindak lanjut", 30, 600);
  const profile = PROFILES.find((p) => p.id === packet.profile_id);
  if (!profile) throw new Error("Profil bobot tidak ditemukan.");
  const results = packet.snapshot.changes.map((row, i) =>
    (i + 1) + ". " + markdown(row.label) + " [" + markdown(row.scenario_id) + "]" +
    "\n   - Skor dasar: " + display(row.baseline_score) +
    "; skor alternatif: " + display(row.alternative_score) +
    "\n   - Urutan dasar: " + display(row.baseline_rank) +
    "; urutan alternatif: " + display(row.alternative_rank) +
    (row.incomplete ? "\n   - DATA BELUM LENGKAP, tidak boleh diperingkat sebagai nol." : "")
  );
  const current = packet.review === null ? (
    "BELUM ADA HASIL PENELAAHAN PROVINSI. Ini bukan berita acara hasil rapat."
  ) : (
    DECISIONS[packet.review.decision] +
    "\n\nCatatan penelaah: " + markdown(packet.review.notes) +
    "\n\nIdentitas penelaah (fiktif): " + markdown(packet.review.reviewer_demo_id)
  );
  const history = formatHistory(packet.history);
  const lines = [
    "# DRAF BAHAN PENYUSUNAN BERITA ACARA TELAAH METODOLOGI",
    "",
    "**STATUS: SIMULASI / BELUM DIUJI / BELUM DISAHKAN / BUKAN BERITA ACARA RESMI**",
    "",
    "> Dokumen kerja ini hanya untuk dibahas dan dikoreksi oleh petugas berwenang.",
    "> Tidak ada nomor resmi, tanggal rapat yang diverifikasi, tanda tangan,",
    "> persetujuan bobot kebijakan, penetapan penerima bantuan atau keputusan anggaran.",
    "",
    "## A. Identitas catatan simulasi",
    "- Referensi: " + markdown(packet.id) + " (fiktif)",
    "- Versi catatan: " + packet.version,
    "- Status: " + markdown(STATUS[packet.status]),
    "- Versi draf: " + MINUTES_DRAFT_VERSION,
    "- Sumber komparasi: " + markdown(packet.snapshot.lab_version),
    "- Penyusun contoh: " + markdown(packet.author.id) + " (" + markdown(packet.author.role) + ")",
    "- Nomor dan tanggal berita acara resmi: **BELUM ADA, tidak diterbitkan dalam demo**",
    "- Tempat, peserta, pimpinan rapat, paraf dan pengesahan: **DIISI di luar simulasi**",
    "",
    "## B. Agenda kajian",
    markdown(agenda),
    "",
    "## C. Dasar pertimbangan",
    "- Profil bobot simulasi: " + markdown(profile.label),
    "- Alasan pemilihan: " + markdown(packet.rationale),
    "- Dampak dan risiko yang dipertimbangkan: " + markdown(packet.risks),
    "- Keterbatasan data/metode: " + markdown(packet.limitations),
    "- Referensi bukti fiktif: " + markdown(packet.evidence_ref),
    "- Bobot percobaan: " + profile.weights.facility_gap + "% fasilitas, " +
      profile.weights.continuity_risk + "% kontinuitas, " +
      profile.weights.access_difficulty + "% akses, " +
      profile.weights.staff_constraints + "% SDM, " +
      profile.weights.verified_stock_gap + "% persediaan.",
    "",
    "## D. Hasil perbandingan indikatif (SELURUH DATA FIKTIF)",
    ...results,
    "",
    "Skenario dengan data tidak lengkap: " + packet.snapshot.missing_scenarios.length + ".",
    "Skenario yang bergeser paling sedikit dua peringkat: " +
      packet.snapshot.significant_rank_changes.length + ".",
    "Jumlah pelayanan mentah bukan komponen perhitungan skor.",
    "Hasil urutan bukan keputusan penerima bantuan atau alokasi.",
    "",
    "## E. Pendapat penelaah simulasi",
    current,
    "",
    "## F. Riwayat pengajuan, rekomendasi dan perbaikan",
    ...(history.length ? history : ["Belum ada histori yang dapat dicetak."]),
    "",
    "## G. Catatan tindak lanjut yang perlu dibahas",
    markdown(followUp),
    "",
    "## H. Pemeriksaan dan pengesahan terpisah",
    "- Validasi data dan metode oleh pemilik proses: BELUM DILAKUKAN.",
    "- Pemeriksaan oleh pejabat/verifikator dengan akun resmi: BELUM ADA.",
    "- Penetapan bobot kebijakan: TIDAK DILAKUKAN OLEH DRAF INI.",
    "- Persetujuan bantuan, pengadaan, anggaran, penyaluran dan BAST: TIDAK ADA.",
    "- Dokumen resmi dan tanda tangan harus diproses sesuai tata naskah dan",
    "  kewenangan instansi apabila kemudian memang diperlukan.",
    "",
    "**AKHIR DRAF SIMULASI M03-S4C, BELUM DIUJI**",
  ];
  return {
    kind: "DEMO_MATERIAL_FOR_MINUTES_NOT_OFFICIAL",
    version: MINUTES_DRAFT_VERSION,
    review_status: packet.status,
    has_reviewer_opinion: packet.review !== null,
    synthetic: true,
    text: lines.join("\n"),
  };
}
