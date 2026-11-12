import test from "node:test";
import assert from "node:assert/strict";
import { startDemo, useRole } from "../model.mjs";
import { saveProblem, reviewProblem } from "../problems.mjs";
import {
  NEED_CATEGORIES, URGENCY, NEED_STATUS, createOrEditNeed, submitNeed, verifyNeed,
  visibleNeeds, supportCounts, validateNeeds,
} from "../support_needs.mjs";

const problemForm = {
  category: "peralatan", title: "Pendingin vaksin rusak",
  description: "Pendingin vaksin pada ruangan pemeriksaan tidak berfungsi.",
};
const fields = {
  problem_id: 1, category: "rantai_dingin", item: "Coolbox untuk vaksin",
  quantity: 2, unit: "unit", urgency: "tinggi",
  reason: "Pendingin yang tersedia tidak berfungsi sehingga dukungan diperlukan.",
  evidence: [{ type: "foto", ref: "DEMO-BUKTI-001" }],
};
function source() {
  const submitted = saveProblem(startDemo(), problemForm, "submit");
  const checked = reviewProblem(useRole(submitted, "verifikator_kab"), 1, "tercatat");
  return useRole(checked, "petugas");
}
test("kebutuhan hanya dari masalah yang sudah diverifikasi", () => {
  const draft = saveProblem(startDemo(), problemForm, "save");
  assert.throws(() => createOrEditNeed(draft, fields, "save"), /sudah diverifikasi/);
  const submitted = saveProblem(startDemo(), problemForm, "submit");
  assert.throws(() => createOrEditNeed(submitted, fields, "submit"), /sudah diverifikasi/);
});
test("draf kebutuhan menyimpan referensi bukan menyalin judul masalah", () => {
  const start = source();
  const draft = createOrEditNeed(start, fields, "save");
  assert.equal(draft.supportNeeds[0].problem_id, 1);
  assert.equal(draft.supportNeeds[0].source_problem_version, start.problems[0].version);
  assert.equal(draft.supportNeeds[0].puskeswan_id, start.facility.id);
  assert.equal(Object.hasOwn(draft.supportNeeds[0], "problem_title"), false);
  assert.equal(Object.hasOwn(draft.supportNeeds[0], "approved_budget"), false);
  assert.equal(start.supportNeeds.length, 0);
  assert.equal(validateNeeds(draft), true);
});
test("petugas dapat mengajukan draf tersimpan tanpa pengetikan ulang", () => {
  const draft = createOrEditNeed(source(), fields, "save");
  assert.equal(createOrEditNeed(draft, fields, "save", 1), draft);
  const submitted = createOrEditNeed(draft, fields, "submit", 1);
  assert.equal(submitted.supportNeeds[0].status, "diajukan");
  assert.equal(submitted.supportNeeds[0].history.length, 2);
});
test("ajukan langsung bukan persetujuan bantuan", () => {
  const created = createOrEditNeed(source(), fields, "submit");
  assert.equal(created.supportNeeds[0].status, "diajukan");
  assert.equal(NEED_CATEGORIES.length, 5);
  assert.equal(URGENCY.length, 4);
  assert.match(NEED_STATUS.terverifikasi, /belum diputuskan/);
});
test("verifikator tidak melihat draf; pimpinan tidak menerima data individu", () => {
  const draft = createOrEditNeed(source(), fields, "save");
  assert.equal(visibleNeeds(useRole(draft, "verifikator_kab")).length, 0);
  assert.equal(visibleNeeds(useRole(draft, "pimpinan")).length, 0);
});
test("verifikator berbeda dari pengusul", () => {
  const submitted = createOrEditNeed(source(), fields, "submit");
  assert.throws(() => verifyNeed(submitted, 1, "terverifikasi"), /Peran simulasi/);
  const reviewer = useRole(submitted, "verifikator_prov");
  assert.throws(() => createOrEditNeed(reviewer, fields, "save", 1), /Peran simulasi/);
  assert.equal(visibleNeeds(reviewer).length, 1);
});
test("persetujuan verifikasi hanya mengubah status kebutuhan, bukan dana", () => {
  const submitted = useRole(createOrEditNeed(source(), fields, "submit"), "verifikator_prov");
  const verified = verifyNeed(submitted, 1, "terverifikasi", "Kebutuhan tercatat untuk kajian", { evidenceReviewed: true });
  assert.equal(verified.supportNeeds[0].status, "terverifikasi");
  assert.equal(Object.hasOwn(verified.supportNeeds[0], "funding_approved"), false);
  assert.equal(Object.hasOwn(verified.supportNeeds[0], "bast"), false);
  assert.equal(supportCounts(verified).verified, 1);
  assert.equal(validateNeeds(verified), true);
});
test("alur koreksi memerlukan alasan dan ajukan ulang", () => {
  const submitted = useRole(createOrEditNeed(source(), fields, "submit"), "verifikator_kab");
  assert.throws(() => verifyNeed(submitted, 1, "perlu_perbaikan"), /Alasan wajib/);
  const corrected = verifyNeed(submitted, 1, "perlu_perbaikan", "Jumlah barang harus dijelaskan");
  const owner = useRole(corrected, "petugas");
  const amended = createOrEditNeed(owner, { ...fields, quantity: 1 }, "submit", 1);
  const verified = verifyNeed(useRole(amended, "verifikator_prov"), 1, "terverifikasi", "", { evidenceReviewed: true });
  assert.equal(verified.supportNeeds[0].quantity, 1);
  assert.equal(verified.supportNeeds[0].status, "terverifikasi");
  assert.equal(verified.supportNeeds[0].history.length, verified.supportNeeds[0].version);
});
test("draf dengan item sama untuk masalah sama ditolak", () => {
  const draft = createOrEditNeed(source(), fields, "save");
  assert.throws(() => createOrEditNeed(draft, fields, "save"), /Usulan barang serupa/);
  const otherItem = createOrEditNeed(draft, { ...fields, item: "Termometer digital" }, "save");
  assert.equal(otherItem.supportNeeds.length, 2);
});
test("kebutuhan tidak boleh berpindah problem atau wilayah", () => {
  const draft = createOrEditNeed(source(), fields, "save");
  assert.throws(() => createOrEditNeed(draft, { ...fields, problem_id: 5 }, "save", 1), /tidak boleh diganti/);
  const forged = { ...draft, supportNeeds: [{ ...draft.supportNeeds[0], kab_kota: "Kota Lain" }] };
  assert.throws(() => verifyNeed(useRole(forged, "verifikator_prov"), 1, "terverifikasi"), /di luar cakupan/);
});
test("jumlah, satuan, item, urgency, kategori salah ditolak", () => {
  for (const variant of [
    { quantity: 0 }, { quantity: -1 }, { quantity: 1.5 },
    { quantity: "2" }, { quantity: 1001 }, { unit: "" },
    { item: "x" }, { urgency: "pasti_didanai" }, { category: "approval" },
  ]) assert.throws(() => createOrEditNeed(source(), { ...fields, ...variant }, "save"));
});
test("kebutuhan sedang diperiksa tidak boleh diedit", () => {
  const submitted = createOrEditNeed(source(), fields, "submit");
  assert.throws(() => createOrEditNeed(submitted, fields, "save", 1), /Hanya draf/);
  assert.throws(() => submitNeed(submitted, 1), /Hanya draf/);
});
test("verifikasi ganda dan penolakan tanpa alasan ditolak", () => {
  const submitted = useRole(createOrEditNeed(source(), fields, "submit"), "verifikator_kab");
  assert.throws(() => verifyNeed(submitted, 1, "ditolak"), /Alasan wajib/);
  const rejected = verifyNeed(submitted, 1, "ditolak", "Tidak sesuai lingkup");
  assert.throws(() => verifyNeed(rejected, 1, "terverifikasi"), /tidak sedang/);
});
test("source problem palsu/cross-region ditolak", () => {
  const src = source();
  assert.throws(() => createOrEditNeed(src, { ...fields, problem_id: 999 }, "save"), /tidak ditemukan/);
  const forged = { ...src, problems: src.problems.map((p) => ({ ...p, kab_kota: "Wilayah Lain" })) };
  assert.throws(() => createOrEditNeed(forged, fields, "save"), /di luar cakupan/);
});
test("schema menolak field keputusan bantuan yang disisipkan", () => {
  const draft = createOrEditNeed(source(), fields, "save");
  const forged = { ...draft, supportNeeds: [{ ...draft.supportNeeds[0], approved_budget: 100000 }] };
  assert.throws(() => validateNeeds(forged), /tidak boleh disimpan/);
});
