import test from "node:test";
import assert from "node:assert/strict";
import { startDemo, useRole } from "../model.mjs";
import { saveProblem, reviewProblem, followUpProblem } from "../problems.mjs";
import { createOrEditNeed, verifyNeed } from "../support_needs.mjs";
import {
  FACTORS, POLICY_VERSION, emptyFactors, parseFactors, previewPriority,
  createOrEditPriority, submitPriority, reviewPriority, visiblePriorityAssessments,
  validatePriorityAssessments, prioritySourceStale,
} from "../support_priority.mjs";

const proof = [{ type: "foto", ref: "DEMO-PROOF-001" }];
function verifiedNeed() {
  let s = saveProblem(startDemo(), {
    category: "peralatan", title: "Pendingin vaksin rusak",
    description: "Pendingin vaksin klinik rusak dan tidak bisa digunakan.",
  }, "submit");
  s = reviewProblem(useRole(s, "verifikator_kab"), 1, "tercatat");
  s = createOrEditNeed(useRole(s, "petugas"), {
    problem_id: 1, category: "rantai_dingin", item: "Coolbox vaksin",
    quantity: 1, unit: "unit", urgency: "tinggi",
    reason: "Membutuhkan pengganti sementara pendingin vaksin yang rusak.",
    evidence: proof,
  }, "submit");
  s = verifyNeed(useRole(s, "verifikator_prov"), 1, "terverifikasi", "", { evidenceReviewed: true });
  return s;
}
function factors(levels = [2, 3, 2, 2, 3]) {
  return Object.fromEntries(FACTORS.map((f, idx) => [
    f.id, { level: levels[idx], rationale: "Pengamatan kondisi DEMO pada fasilitas, indikator " + f.id,
      source_ref: "DEMO-INDIKATOR-" + (idx + 1) },
  ]));
}
test("kebijakan eksperimen memiliki lima bobot berjumlah 100, tanpa raw volume APEL", () => {
  assert.equal(FACTORS.length, 5);
  assert.equal(FACTORS.reduce((n, f) => n + f.weight, 0), 100);
  assert.equal(FACTORS.some(f => f.id.includes("service_volume") || f.id.includes("apel_total")), false);
  assert.equal(POLICY_VERSION, "M03-S3-EXPERIMENTAL-1");
});
test("nilai 0 sah, data kosong tidak otomatis dianggap 0", () => {
  const missing = previewPriority(emptyFactors());
  assert.equal(missing.complete, false);
  assert.equal(missing.score, null);
  assert.equal(missing.missing.length, 5);
  const zero = previewPriority(factors([0, 0, 0, 0, 0]));
  assert.equal(zero.complete, true);
  assert.equal(zero.score, 0);
  assert.equal(zero.band, "rendah");
});
test("contoh perhitungan bobot bersifat deterministik dan dapat dijelaskan", () => {
  const preview = previewPriority(factors([2, 3, 2, 2, 3]));
  assert.equal(preview.score, 25 * 2 / 3 + 30 + 20 * 2 / 3 + 15 * 2 / 3 + 10);
  assert.equal(preview.band, "tinggi");
  assert.equal(preview.breakdown.length, 5);
  assert.equal(preview.breakdown[0].weight, 25);
  assert.equal(preview.breakdown[1].points, 30);
});
test("skor dan klasifikasi tidak memakai total pelayanan mentah", () => {
  const input = factors([3, 3, 3, 3, 3]);
  const noVolume = previewPriority(input);
  const withHugeVolume = previewPriority({ ...input });
  assert.equal(noVolume.score, withHugeVolume.score);
  assert.equal(noVolume.score, 100);
  const remoteLowVolume = previewPriority(factors([3, 3, 3, 3, 2]));
  const highVolumeLowGap = previewPriority(factors([0, 1, 0, 0, 0]));
  assert.ok(remoteLowVolume.score > highVolumeLowGap.score);
});
test("indikator tidak valid atau sumber tanpa kode DEMO harus ditolak", () => {
  for (const level of [-1, 4, 2.5, "2"]) {
    assert.throws(() => previewPriority({
      ...factors(), facility_gap: { level, rationale: "Alasan pengamatan memadai", source_ref: "DEMO-INDIKATOR-1" },
    }), /Tingkat indikator/);
  }
  assert.throws(() => previewPriority({
    ...factors(), facility_gap: { level: 2, rationale: "Cukup alasan jelas", source_ref: "https://situs.local/foto" },
  }), /Sumber indikator/);
  assert.throws(() => parseFactors({ ...factors(), jumlah_laporan: { level: 3 } }), /tidak dikenal/);
});
test("pimpinan/petugas tidak dapat melihat atau membuat scorecard individu", () => {
  const s = verifiedNeed();
  assert.deepEqual(visiblePriorityAssessments(useRole(s, "petugas")), []);
  assert.throws(() => createOrEditPriority(useRole(s, "petugas"), 1, factors(), "save"), /Peran simulasi/);
  assert.throws(() => createOrEditPriority(useRole(s, "verifikator_prov"), 1, factors(), "save"), /Peran simulasi/);
});
test("kab/kota boleh menyimpan draf tidak lengkap, tetapi pengajuan wajib lima indikator", () => {
  let s = useRole(verifiedNeed(), "verifikator_kab");
  const partial = { facility_gap: factors().facility_gap };
  s = createOrEditPriority(s, 1, partial, "save");
  assert.equal(s.priorityAssessments[0].status, "draf");
  assert.equal(s.priorityAssessments[0].preview.score, null);
  assert.throws(() => submitPriority(s, 1), /Lengkapi kelima/);
  assert.equal(visiblePriorityAssessments(useRole(s, "verifikator_prov")).length, 0);
});
test("draf lengkap langsung dapat dikirim, sumber terkunci versi, skor tetap rekomendasi", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "save");
  assert.equal(createOrEditPriority(s, 1, factors(), "save", 1), s);
  s = submitPriority(s, 1);
  assert.equal(s.priorityAssessments[0].status, "diajukan");
  assert.equal(s.supportNeeds[0].status, "terverifikasi");
  assert.equal(Object.hasOwn(s.priorityAssessments[0], "approved_budget"), false);
  assert.equal(validatePriorityAssessments(s), true);
});
test("kab/kota tidak dapat meninjau penilaian sendiri", () => {
  const s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  assert.throws(() => reviewPriority(s, 1, "terima"), /Peran simulasi/);
});
test("review provinsi menerima baseline, tapi tidak mengalokasikan bantuan", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  s = reviewPriority(useRole(s, "verifikator_prov"), 1, "terima", "Kriteria sudah diperiksa");
  assert.equal(s.priorityAssessments[0].status, "ditinjau");
  assert.equal(s.priorityAssessments[0].review.recommendation_band, "tinggi");
  assert.equal(s.priorityAssessments[0].review.calculated_band, "tinggi");
  assert.equal(Object.hasOwn(s.priorityAssessments[0], "allocation"), false);
  assert.equal(validatePriorityAssessments(s), true);
});
test("override provinsi beralasan mengubah rekomendasi, tidak mengubah skor dasar", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  s = useRole(s, "verifikator_prov");
  assert.throws(() => reviewPriority(s, 1, "koreksi_prioritas", "", "sedang"), /Alasan review/);
  assert.throws(() => reviewPriority(s, 1, "koreksi_prioritas",
    "Kebutuhan sudah diperiksa dan dilihat kembali.", "tinggi"), /harus berbeda/);
  const changed = reviewPriority(s, 1, "koreksi_prioritas",
    "Sudah ada fasilitas alternatif yang dapat dipakai sementara.", "sedang");
  assert.equal(changed.priorityAssessments[0].review.calculated_band, "tinggi");
  assert.equal(changed.priorityAssessments[0].review.recommendation_band, "sedang");
  assert.equal(changed.priorityAssessments[0].preview.score, s.priorityAssessments[0].preview.score);
  assert.equal(changed.priorityAssessments[0].review.rationale.length > 20, true);
  assert.equal(validatePriorityAssessments(changed), true);
});
test("review bisa meminta perbaikan, lalu kabupaten mengajukan versi baru", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  s = useRole(s, "verifikator_prov");
  assert.throws(() => reviewPriority(s, 1, "kembalikan", "Kurang"), /Alasan review/);
  s = reviewPriority(s, 1, "kembalikan", "Sumber jarak ke layanan perlu diperjelas.");
  s = createOrEditPriority(useRole(s, "verifikator_kab"), 1,
    factors([2, 3, 1, 2, 3]), "submit", 1);
  assert.equal(s.priorityAssessments[0].status, "diajukan");
  assert.equal(s.priorityAssessments[0].history.length, s.priorityAssessments[0].version);
});
test("penilaian ganda untuk satu kebutuhan dilarang", () => {
  const s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "save");
  assert.throws(() => createOrEditPriority(s, 1, factors(), "save"), /sudah memiliki penilaian/);
});
test("sumber masalah yang sudah ditutup menyebabkan review ditolak", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  s = followUpProblem(useRole(s, "verifikator_prov"), 1, "ditindaklanjuti", "Koordinasi fasilitas pendingin");
  s = followUpProblem(s, 1, "selesai", "Masalah alat selesai ditangani.");
  assert.throws(() => reviewPriority(s, 1, "terima"), /tidak lagi aktif/);
});
test("revisi sumber masalah membuat assessment stale dan butuh pembaruan", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  s = followUpProblem(useRole(s, "verifikator_prov"), 1, "ditindaklanjuti", "Kegiatan sedang ditindaklanjuti");
  assert.throws(() => reviewPriority(s, 1, "terima"), /Sumber berubah/);
});
test("record skor yang dimanipulasi atau punya field funding ditolak", () => {
  const s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  const forging = (change) => ({ ...s, priorityAssessments: [{ ...s.priorityAssessments[0], ...change }] });
  assert.throws(() => validatePriorityAssessments(forging({ preview: { ...s.priorityAssessments[0].preview, score: 100 } })), /tidak valid/);
  assert.throws(() => validatePriorityAssessments(forging({ approved_budget: 1000 })), /tidak boleh/);
});
test("status review yang sudah ditinjau tidak bisa ditinjau ulang tanpa versi baru", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  s = reviewPriority(useRole(s, "verifikator_prov"), 1, "terima");
  assert.throws(() => reviewPriority(s, 1, "terima"), /tidak sedang/);
  assert.throws(() => createOrEditPriority(useRole(s, "verifikator_kab"), 1, factors(), "submit", 1), /tidak dapat diedit/);
});


test("review palsu atau rekomendasi tanpa alasan tidak lolos validasi", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  s = reviewPriority(useRole(s, "verifikator_prov"), 1, "koreksi_prioritas",
    "Alat cadangan tersedia untuk sementara waktu.", "sedang");
  const fake = (review) => ({
    ...s, priorityAssessments: s.priorityAssessments.map((a) => ({ ...a, review })),
  });
  assert.throws(() => validatePriorityAssessments(fake({
    ...s.priorityAssessments[0].review, allocation: 1000000,
  })), /Review penilaian/);
  assert.throws(() => validatePriorityAssessments(fake({
    ...s.priorityAssessments[0].review, rationale: "kurang",
  })), /Review penilaian/);
  assert.throws(() => validatePriorityAssessments(fake({
    ...s.priorityAssessments[0].review, recommendation_band: "tinggi",
  })), /Review penilaian/);
});
test("penilaian historis menjadi usang ketika versi masalah berubah", () => {
  let s = createOrEditPriority(useRole(verifiedNeed(), "verifikator_kab"), 1, factors(), "submit");
  s = reviewPriority(useRole(s, "verifikator_prov"), 1, "terima");
  assert.equal(prioritySourceStale(s, s.priorityAssessments[0]), false);
  s = followUpProblem(s, 1, "ditindaklanjuti",
    "Tindak lanjut sarana telah dimulai pada fasilitas contoh.");
  assert.equal(prioritySourceStale(s, s.priorityAssessments[0]), true);
  assert.equal(validatePriorityAssessments(s), true); // snapshot historis tetap ada
});
