import test from "node:test";
import assert from "node:assert/strict";
import { startDemo, useRole } from "../model.mjs";
import { saveProblem, reviewProblem } from "../problems.mjs";
import {
  createOrEditNeed, submitNeed, verifyNeed, validateNeeds,
} from "../support_needs.mjs";
import {
  parseEvidence, evidenceCompleteness, normalizedItem, priorSimilarNeeds,
} from "../support_evidence.mjs";

const problemFields = {
  category: "peralatan", title: "Pendingin vaksin rusak",
  description: "Pendingin vaksin tidak berfungsi untuk pelayanan rutin.",
};
const fields = {
  problem_id: 1, category: "rantai_dingin", item: "Coolbox untuk vaksin",
  quantity: 1, unit: "unit", urgency: "tinggi",
  reason: "Diperlukan pengamanan rantai dingin untuk vaksin.",
  evidence: [{ type: "foto", ref: "DEMO-BUKTI-001" }],
};
function verifiedProblem() {
  const draft = saveProblem(startDemo(), problemFields, "submit");
  return useRole(
    reviewProblem(useRole(draft, "verifikator_kab"), 1, "tercatat"),
    "petugas"
  );
}
function pendingNeed() {
  return useRole(createOrEditNeed(verifiedProblem(), fields, "submit"), "verifikator_kab");
}

test("draf tanpa bukti metadata boleh disimpan tetapi tidak boleh dikirim", () => {
  const draft = createOrEditNeed(verifiedProblem(), { ...fields, evidence: [] }, "save");
  assert.equal(draft.supportNeeds[0].status, "draf");
  assert.deepEqual(evidenceCompleteness(draft.supportNeeds[0]).missing,
    ["Minimal satu referensi bukti (hanya metadata DEMO)"]);
  assert.throws(() => submitNeed(draft, 1), /minimal satu referensi bukti/);
  assert.throws(() => createOrEditNeed(verifiedProblem(), { ...fields, evidence: [] }, "submit"), /minimal satu/);
});

test("satu referensi bukti DEMO membuat pengajuan lengkap secara metadata", () => {
  const submitted = createOrEditNeed(verifiedProblem(), fields, "submit");
  assert.equal(submitted.supportNeeds[0].status, "diajukan");
  assert.deepEqual(submitted.supportNeeds[0].evidence,
    [{ type: "foto", ref: "DEMO-BUKTI-001" }]);
  assert.equal(evidenceCompleteness(submitted.supportNeeds[0]).complete, true);
  assert.equal(validateNeeds(submitted), true);
});

test("format DEMO wajib, URL, jalur file dan string kosong ditolak", () => {
  for(const ref of ["http://contoh.id/foto.jpg", "/var/rahasia/file.pdf", "",
    "BUKTI-001", "DEMO-x", "DEMO-BUKTI 001"]) {
    assert.throws(() => parseEvidence([{ type: "foto", ref }]), /Kode bukti/);
  }
  assert.deepEqual(parseEvidence(undefined), []);
});

test("jenis bukti di luar katalog, lebih dari 3, dan kode ganda ditolak", () => {
  assert.throws(() => parseEvidence([{ type: "rekam_medis", ref: "DEMO-BUKTI-111" }]), /Jenis bukti/);
  assert.throws(() => parseEvidence(Array.from({ length: 4 }, (_, i) =>
    ({ type: "foto", ref: "DEMO-BUKTI-00" + i }))), /maksimal tiga/);
  assert.throws(() => parseEvidence([
    { type: "foto", ref: "DEMO-BUKTI-111" },
    { type: "dokumen", ref: "DEMO-BUKTI-111" },
  ]), /tidak boleh duplikat/);
});

test("verifikator wajib mencentang pemeriksaan METADATA sebelum menyetujui", () => {
  const submitted = pendingNeed();
  assert.throws(() => verifyNeed(submitted, 1, "terverifikasi"), /menandai pemeriksaan/);
  const checked = verifyNeed(submitted, 1, "terverifikasi", "", { evidenceReviewed: true });
  assert.equal(checked.supportNeeds[0].evidence_review.mode, "metadata_saja_demo");
  assert.equal(checked.supportNeeds[0].evidence_review.actor, "verifikator_kab");
  assert.deepEqual(checked.supportNeeds[0].evidence_review.references, ["DEMO-BUKTI-001"]);
  assert.equal(validateNeeds(checked), true);
  assert.equal(submitted.supportNeeds[0].status, "diajukan");
});

test("verifikasi tidak berarti ada file, anggaran atau BAST", () => {
  const checked = verifyNeed(pendingNeed(), 1, "terverifikasi", "", { evidenceReviewed: true });
  const record = checked.supportNeeds[0];
  assert.equal(record.evidence_review.mode, "metadata_saja_demo");
  for (const forbidden of ["file_uploaded", "file_verified", "funding_approved", "bast"]) {
    assert.equal(Object.hasOwn(record, forbidden), false);
  }
});

test("catatan bukti tidak dapat diganti setelah diajukan", () => {
  const submitted = createOrEditNeed(verifiedProblem(), fields, "submit");
  assert.throws(() => createOrEditNeed(submitted,
    { ...fields, evidence: [{ type: "foto", ref: "DEMO-BUKTI-222" }] }, "save", 1),
  /Hanya draf/);
});

test("bukti yang dimanipulasi setelah disetujui gagal divalidasi", () => {
  const checked = verifyNeed(pendingNeed(), 1, "terverifikasi", "", { evidenceReviewed: true });
  const forged = {
    ...checked,
    supportNeeds: checked.supportNeeds.map((x) => ({
      ...x, evidence: [{ type: "foto", ref: "DEMO-BUKTI-999" }],
    })),
  };
  assert.throws(() => validateNeeds(forged), /Pemeriksaan metadata bukti/);
});

test("nama barang distandarkan dari kapital/spasi/tanda baca", () => {
  assert.equal(normalizedItem("  COOLBOX---Untuk    VAKSIN!! "), "coolbox untuk vaksin");
  assert.equal(normalizedItem("Coolbox untuk vaksin"), "coolbox untuk vaksin");
  assert.equal(normalizedItem("Termometer"), "termometer");
});

test("pengajuan barang serupa lintas MASALAH diblokir pada Puskeswan yang sama", () => {
  let s = createOrEditNeed(verifiedProblem(), fields, "submit");
  s = saveProblem(s, {
    category: "peralatan", title: "Masalah peralatan lainnya",
    description: "Peralatan alternatif pada ruangan lain juga tidak tersedia.",
  }, "submit");
  s = useRole(reviewProblem(useRole(s, "verifikator_kab"), 2, "tercatat"), "petugas");
  assert.throws(() => createOrEditNeed(s, {
    ...fields, problem_id: 2, item: " COOLBOX---UNTUK  VAKSIN! ",
  }, "save"), /Usulan barang serupa/);
  assert.equal(s.supportNeeds.length, 1);
});

test("barang yang berbeda pada sumber sama tetap diperbolehkan", () => {
  const one = createOrEditNeed(verifiedProblem(), fields, "save");
  const next = createOrEditNeed(one,
    { ...fields, item: "Termometer digital", evidence: [{ type: "observasi", ref: "DEMO-BUKTI-002" }] }, "save");
  assert.equal(next.supportNeeds.length, 2);
});

test("duplikat pada fasilitas berbeda tidak otomatis diblokir", () => {
  const foreign = {
    id: 3, puskeswan_id: "DEMO-PSW-002",
    kab_kota: "Kota Contoh", item: "Coolbox untuk vaksin", status: "diajukan",
  };
  const result = priorSimilarNeeds({ supportNeeds: [foreign] }, {
    puskeswan_id: "DEMO-PSW-001", kab_kota: "Kabupaten Contoh",
    item: "Coolbox untuk vaksin",
  });
  assert.equal(result.active, null);
});

test("riwayat usulan yang ditolak memerlukan alasan ulang, tapi tidak dihapus", () => {
  const rejected = verifyNeed(pendingNeed(), 1, "ditolak", "Dokumen belum jelas.");
  const owner = useRole(rejected, "petugas");
  assert.throws(() => createOrEditNeed(owner, fields, "save"), /Isi alasan pengajuan ulang/);
  const repeated = createOrEditNeed(owner, {
    ...fields, repeat_reason: "Peralatan masih rusak dan telah diperiksa kembali.",
    evidence: [{ type: "observasi", ref: "DEMO-BUKTI-002" }],
  }, "submit");
  assert.equal(repeated.supportNeeds.length, 2);
  assert.equal(repeated.supportNeeds[1].previous_rejected_need_id, 1);
  assert.equal(repeated.supportNeeds[1].status, "diajukan");
  assert.equal(repeated.supportNeeds[0].status, "ditolak");
  assert.equal(validateNeeds(repeated), true);
});

test("riwayat penolakan tidak boleh dipalsukan ke kebutuhan lain", () => {
  const submitted = createOrEditNeed(verifiedProblem(), fields, "submit");
  const forged = {
    ...submitted,
    supportNeeds: [{ ...submitted.supportNeeds[0],
      previous_rejected_need_id: 999,
      repeat_reason: "Sudah ditolak sebelumnya." }],
  };
  assert.throws(() => validateNeeds(forged), /Jejak pengajuan ulang historis/);
});

test("koreksi kebutuhan boleh mengganti bukti dan kembali dikirim", () => {
  let s = verifyNeed(pendingNeed(), 1, "perlu_perbaikan", "Perjelas bukti");
  s = useRole(s, "petugas");
  s = createOrEditNeed(s, {
    ...fields, evidence: [{ type: "dokumen", ref: "DEMO-BUKTI-888" }],
  }, "submit", 1);
  s = verifyNeed(useRole(s, "verifikator_prov"), 1,
    "terverifikasi", "Metadata baru diperiksa", { evidenceReviewed: true });
  assert.deepEqual(s.supportNeeds[0].evidence_review.references, ["DEMO-BUKTI-888"]);
  assert.equal(s.supportNeeds[0].status, "terverifikasi");
});
