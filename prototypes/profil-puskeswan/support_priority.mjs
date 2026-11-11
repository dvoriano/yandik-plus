/** M03-S3: explainable, unapproved priority advisory on synthetic records ONLY.
 * This score never creates an allocation or official decision.
 * Kab/kota enters the evidence-backed assessment; province independently reviews.
 */
export const POLICY_VERSION = "M03-S3-EXPERIMENTAL-1";
export const FACTORS = Object.freeze([
  { id: "facility_gap", label: "Kesenjangan fasilitas", weight: 25, hint: "Kondisi alat/sarana yang kurang atau rusak" },
  { id: "continuity_risk", label: "Risiko gangguan pelayanan", weight: 30, hint: "Dampak terhadap keberlanjutan layanan penting" },
  { id: "access_difficulty", label: "Kesulitan akses wilayah", weight: 20, hint: "Keterjangkauan lokasi, bukan jumlah laporan" },
  { id: "staff_constraints", label: "Keterbatasan SDM", weight: 15, hint: "Kemampuan petugas menangani kebutuhan dengan tenaga tersedia" },
  { id: "verified_stock_gap", label: "Kesenjangan persediaan", weight: 10, hint: "Kekurangan persediaan yang telah dicatat" },
]);
export const LEVELS = Object.freeze([
  { level: 0, label: "0 · Tidak ada kesenjangan teridentifikasi" },
  { level: 1, label: "1 · Ringan" },
  { level: 2, label: "2 · Sedang" },
  { level: 3, label: "3 · Berat" },
]);
export const PRIORITY_BANDS = Object.freeze([
  { id: "rendah", label: "Perlu kajian lanjutan (rendah)" },
  { id: "sedang", label: "Perlu perhatian (sedang)" },
  { id: "tinggi", label: "Perlu pembahasan lebih dahulu (tinggi)" },
]);
export const ASSESSMENT_STATUSES = Object.freeze({
  draf: "Draf penilaian",
  diajukan: "Menunggu review provinsi",
  perlu_perbaikan: "Penilaian perlu perbaikan",
  ditinjau: "Penilaian ditinjau, bukan bantuan disetujui",
});
const POLICY_WEIGHT_TOTAL = FACTORS.reduce((sum, factor) => sum + factor.weight, 0);
if (POLICY_WEIGHT_TOTAL !== 100) throw new Error("Bobot percobaan tidak berjumlah 100.");
const EVIDENCE_REF = /^DEMO-[A-Z0-9][A-Z0-9_-]{3,49}$/;

function limitedText(value, name, min, max) {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max)
    throw new Error(name + " harus " + min + "-" + max + " karakter.");
  return value.trim();
}
function role(state, allowed) {
  if (!allowed.includes(state.role)) throw new Error("Peran simulasi tidak berwenang.");
}
function sameFacility(state, record) {
  if (record.puskeswan_id !== state.facility.id || record.kab_kota !== state.facility.region)
    throw new Error("Penilaian atau kebutuhan di luar cakupan fasilitas.");
}
function needForAssessment(state, id) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("ID kebutuhan tidak sah.");
  const need = state.supportNeeds.find((x) => x.id === id);
  if (!need) throw new Error("Kebutuhan sumber tidak ditemukan.");
  sameFacility(state, need);
  if (need.status !== "terverifikasi" || need.evidence_review?.mode !== "metadata_saja_demo")
    throw new Error("Hanya kebutuhan terverifikasi dengan pemeriksaan metadata yang dapat dinilai.");
  const problem = state.problems.find((x) => x.id === need.problem_id);
  if (!problem) throw new Error("Permasalahan rujukan tidak ditemukan.");
  sameFacility(state, problem);
  if (!["tercatat", "ditindaklanjuti"].includes(problem.status))
    throw new Error("Permasalahan tidak lagi aktif; penilaian perlu ditinjau ulang.");
  return { need, problem };
}
function assessmentById(state, id) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("ID penilaian tidak sah.");
  const record = state.priorityAssessments.find((x) => x.id === id);
  if (!record) throw new Error("Penilaian tidak ditemukan.");
  sameFacility(state, record);
  return record;
}
function validateFresh(state, assessment) {
  const { need, problem } = needForAssessment(state, assessment.need_id);
  if (assessment.source_need_version !== need.version ||
      assessment.source_problem_version !== problem.version)
    throw new Error("Sumber berubah. Penilaian harus diperbarui sebelum dikirim atau ditinjau.");
  return true;
}
export function emptyFactors() {
  return Object.fromEntries(FACTORS.map((factor) =>
    [factor.id, { level: null, rationale: "", source_ref: "" }]));
}
export function parseFactors(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Indikator penilaian harus berupa objek.");
  for (const name of Object.keys(input)) {
    if (!FACTORS.some((factor) => factor.id === name))
      throw new Error("Indikator tidak dikenal: " + name);
  }
  const result = {};
  for (const factor of FACTORS) {
    const row = input[factor.id] ?? { level: null, rationale: "", source_ref: "" };
    if (!row || typeof row !== "object" || Array.isArray(row))
      throw new Error("Nilai indikator tidak sah: " + factor.id);
    for (const k of Object.keys(row)) {
      if (!["level", "rationale", "source_ref"].includes(k))
        throw new Error("Kolom indikator tidak dikenal.");
    }
    const level = row.level === undefined ? null : row.level;
    if (level !== null && (!Number.isInteger(level) || level < 0 || level > 3))
      throw new Error("Tingkat indikator harus 0 sampai 3 atau belum dipilih.");
    const rawNote = row.rationale ?? "";
    const rawRef = row.source_ref ?? "";
    if (level === null && (!["", null].includes(rawNote) || !["", null].includes(rawRef)))
      throw new Error("Pilih tingkat indikator sebelum mengisi alasan dan sumber.");
    const rationale = level === null ? "" : limitedText(rawNote, "Alasan indikator", 12, 240);
    if (level !== null && (typeof rawRef !== "string" || !EVIDENCE_REF.test(rawRef)))
      throw new Error("Sumber indikator wajib kode DEMO-... yang sah.");
    result[factor.id] = { level, rationale, source_ref: level === null ? "" : rawRef };
  }
  return result;
}
export function previewPriority(input) {
  const factors = parseFactors(input);
  const missing = FACTORS.filter((factor) => factors[factor.id].level === null).map((factor) => factor.id);
  const breakdown = FACTORS.map((factor) => {
    const { level, rationale, source_ref } = factors[factor.id];
    return {
      id: factor.id, label: factor.label, weight: factor.weight, level,
      points: level === null ? null : Math.round((factor.weight * level / 3) * 100) / 100,
      rationale, source_ref,
    };
  });
  if (missing.length)
    return { complete: false, missing, score: null, band: null, breakdown, policy_version: POLICY_VERSION };
  const score = Math.round(FACTORS.reduce((total, factor) =>
    total + factor.weight * factors[factor.id].level / 3, 0) * 100) / 100;
  const band = score >= 70 ? "tinggi" : score >= 40 ? "sedang" : "rendah";
  return { complete: true, missing: [], score, band, breakdown, policy_version: POLICY_VERSION };
}
function withUpdated(state, record) {
  return { ...state, priorityAssessments: state.priorityAssessments.map((x) =>
    x.id === record.id ? record : x) };
}
function audit(record, action, actor, note = "") {
  return [...record.history, { action, actor, note, version: record.version + 1 }];
}
export function visiblePriorityAssessments(state) {
  if (!["verifikator_kab", "verifikator_prov"].includes(state.role)) return [];
  return state.priorityAssessments.filter((x) =>
    x.puskeswan_id === state.facility.id && x.kab_kota === state.facility.region &&
    (state.role === "verifikator_kab" || x.status !== "draf"));
}
export function createOrEditPriority(state, needId, factors, intent, assessmentId = null) {
  role(state, ["verifikator_kab"]);
  if (!["save", "submit"].includes(intent)) throw new Error("Tindakan penilaian tidak dikenal.");
  const { need, problem } = needForAssessment(state, needId);
  const cleaned = parseFactors(factors);
  const preview = previewPriority(cleaned);
  if (intent === "submit" && !preview.complete)
    throw new Error("Lengkapi kelima indikator sebelum mengajukan penilaian.");
  let record;
  if (assessmentId === null) {
    if (state.priorityAssessments.some((x) => x.need_id === needId))
      throw new Error("Kebutuhan sudah memiliki penilaian. Lanjutkan penilaian yang ada.");
    record = {
      id: state.nextPriorityId, need_id: needId,
      puskeswan_id: need.puskeswan_id, kab_kota: need.kab_kota,
      source_need_version: need.version,
      source_problem_version: problem.version,
      factors: cleaned, preview, status: "draf",
      version: 1, review: null,
      history: [{ action: "simpan_draf", actor: "verifikator_kab", version: 1, note: "" }],
    };
    const next = {
      ...state, nextPriorityId: state.nextPriorityId + 1,
      priorityAssessments: [...state.priorityAssessments, record],
    };
    return intent === "submit" ? submitPriority(next, record.id) : next;
  }
  record = assessmentById(state, assessmentId);
  if (record.need_id !== needId) throw new Error("Referensi kebutuhan penilaian tidak boleh diganti.");
  if (!["draf", "perlu_perbaikan"].includes(record.status))
    throw new Error("Penilaian yang diajukan atau ditinjau tidak dapat diedit.");
  // A corrected assessment refreshes its source snapshot after review.
  const same = JSON.stringify(record.factors) === JSON.stringify(cleaned) &&
    record.source_need_version === need.version &&
    record.source_problem_version === problem.version && record.status === "draf";
  if (same) return intent === "submit" ? submitPriority(state, record.id) : state;
  const nextRecord = {
    ...record, factors: cleaned, preview,
    source_need_version: need.version, source_problem_version: problem.version,
    status: "draf", review: null, version: record.version + 1,
    history: audit(record, "simpan_draf", "verifikator_kab"),
  };
  const next = withUpdated(state, nextRecord);
  return intent === "submit" ? submitPriority(next, record.id) : next;
}
export function submitPriority(state, assessmentId) {
  role(state, ["verifikator_kab"]);
  const record = assessmentById(state, assessmentId);
  if (record.status !== "draf") throw new Error("Hanya draf penilaian bisa diajukan.");
  validateFresh(state, record);
  const preview = previewPriority(record.factors);
  if (!preview.complete) throw new Error("Lengkapi kelima indikator terlebih dahulu.");
  return withUpdated(state, {
    ...record, preview, status: "diajukan", version: record.version + 1,
    history: audit(record, "ajukan", "verifikator_kab"),
  });
}
export function reviewPriority(state, assessmentId, decision, reason = "", overrideBand = null) {
  role(state, ["verifikator_prov"]);
  const record = assessmentById(state, assessmentId);
  if (record.status !== "diajukan") throw new Error("Penilaian tidak sedang menunggu tinjauan.");
  validateFresh(state, record);
  const preview = previewPriority(record.factors);
  if (!preview.complete) throw new Error("Penilaian belum lengkap.");
  if (!["terima", "kembalikan", "koreksi_prioritas"].includes(decision))
    throw new Error("Keputusan tinjauan tidak dikenal.");
  const required = decision === "terima" ? 0 : 20;
  if (typeof reason !== "string" || reason.length > 400 ||
      (required > 0 && reason.trim().length < required))
    throw new Error("Alasan review wajib minimal 20 karakter untuk perbaikan/koreksi.");
  if (decision === "koreksi_prioritas" &&
      (!PRIORITY_BANDS.some((b) => b.id === overrideBand) || overrideBand === preview.band))
    throw new Error("Prioritas koreksi harus berbeda dari hasil hitung.");
  if (decision !== "koreksi_prioritas" && overrideBand !== null)
    throw new Error("Koreksi prioritas hanya dapat dipilih pada keputusan koreksi.");
  const recommendation = decision === "koreksi_prioritas" ? overrideBand : preview.band;
  const note = reason.trim();
  const review = decision === "kembalikan" ? null : {
    action: decision, reviewer_role: "verifikator_prov",
    calculated_score: preview.score,
    calculated_band: preview.band,
    recommendation_band: recommendation,
    rationale: note, policy_version: POLICY_VERSION,
    source_need_version: record.source_need_version,
  };
  return withUpdated(state, {
    ...record, status: decision === "kembalikan" ? "perlu_perbaikan" : "ditinjau",
    review, version: record.version + 1,
    history: audit(record, decision, "verifikator_prov", note),
  });
}
export function validatePriorityAssessments(state) {
  if (!Array.isArray(state.priorityAssessments)) throw new Error("Daftar penilaian tidak sah.");
  const ids = new Set();
  const needs = new Set();
  for (const record of state.priorityAssessments) {
    if (!Number.isSafeInteger(record.id) || record.id < 1 || ids.has(record.id) ||
        needs.has(record.need_id))
      throw new Error("ID penilaian duplikat.");
    ids.add(record.id);
    needs.add(record.need_id);
    const preview = previewPriority(record.factors);
    if (JSON.stringify(preview) !== JSON.stringify(record.preview) ||
        !Object.hasOwn(ASSESSMENT_STATUSES, record.status) ||
        !Number.isSafeInteger(record.version) || record.version < 1 ||
        !Array.isArray(record.history) || record.history.length !== record.version)
      throw new Error("Penilaian, versi atau rincian skor tidak valid.");
    const need = state.supportNeeds.find((n) => n.id === record.need_id);
    if (!need) throw new Error("Referensi kebutuhan tidak ditemukan.");
    if (need.puskeswan_id !== record.puskeswan_id || need.kab_kota !== record.kab_kota)
      throw new Error("Cakupan kebutuhan penilaian salah.");
    if (["diajukan", "ditinjau"].includes(record.status) && !preview.complete)
      throw new Error("Penilaian diajukan belum lengkap.");
    if (record.status === "ditinjau" &&
        (!record.review || record.review.calculated_score !== preview.score ||
          record.review.calculated_band !== preview.band ||
          !["terima", "koreksi_prioritas"].includes(record.review.action) ||
          record.review.policy_version !== POLICY_VERSION))
      throw new Error("Review penilaian tidak sesuai hasil dasar.");
    if (record.status !== "ditinjau" && record.review !== null)
      throw new Error("Review tidak boleh terpasang pada penilaian belum selesai.");
    for (const forbidden of ["approved_budget", "allocation", "support_delivery", "bast", "recipient_selected"]) {
      if (Object.hasOwn(record, forbidden))
        throw new Error("Penilaian prioritas tidak boleh berisi keputusan bantuan.");
    }
  }
  return true;
}
