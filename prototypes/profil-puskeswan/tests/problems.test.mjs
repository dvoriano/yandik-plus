import test from "node:test";
import assert from "node:assert/strict";
import { startDemo, useRole } from "../model.mjs";
import { PROBLEM_CATEGORIES, visibleProblems, saveProblem, submitProblem, reviewProblem,
  followUpProblem, problemCounts, validateProblems } from "../problems.mjs";

const fields = { category: "peralatan", title: "Kulkas vaksin rusak", description: "Pendingin vaksin di ruang klinik tidak berfungsi." };
test("permasalahan terhubung ID Puskeswan, tidak membuat bantuan otomatis", () => {
  const state = saveProblem(startDemo(), fields, "save");
  assert.equal(state.problems[0].puskeswan_id, state.facility.id);
  assert.equal(state.problems[0].status, "draf");
  assert.equal("bantuan_disetujui" in state.problems[0], false);
  assert.equal(PROBLEM_CATEGORIES.length, 6);
  assert.equal(validateProblems(state), true);
});
test("petugas membuat, menyimpan dan mengajukan tanpa mengetik ulang", () => {
  const original = startDemo();
  const draft = saveProblem(original, fields, "save");
  const same = saveProblem(draft, fields, "save", 1);
  assert.equal(same, draft);
  const submitted = saveProblem(draft, fields, "submit", 1);
  assert.equal(submitted.problems[0].status, "diajukan");
  assert.equal(submitted.problems[0].history.length, 2);
  assert.equal(original.problems.length, 0);
});
test("petugas bisa mengajukan langsung dari form", () => {
  const state = saveProblem(startDemo(), fields, "submit");
  assert.equal(state.problems[0].status, "diajukan");
  assert.equal(problemCounts(state).waiting, 1);
});
test("pengajuan tak boleh diubah sampai keputusan", () => {
  const state = saveProblem(startDemo(), fields, "submit");
  assert.throws(() => saveProblem(state, fields, "save", 1), /tidak dapat diedit/);
  assert.throws(() => submitProblem(state, 1), /Hanya draf/);
});
test("verifikator tidak melihat draf yang belum dikirim", () => {
  const draft = saveProblem(startDemo(), fields, "save");
  const verifier = useRole(draft, "verifikator_kab");
  assert.equal(visibleProblems(verifier).length, 0);
});
test("verifikator boleh melihat pengajuan tetapi bukan mengedit masalah", () => {
  const verifier = useRole(saveProblem(startDemo(), fields, "submit"), "verifikator_kab");
  assert.equal(visibleProblems(verifier).length, 1);
  assert.throws(() => saveProblem(verifier, fields, "save", 1), /Peran simulasi/);
});
test("petugas dan pimpinan tidak boleh verifikasi masalah", () => {
  const submitted = saveProblem(startDemo(), fields, "submit");
  assert.throws(() => reviewProblem(submitted, 1, "tercatat"), /Peran simulasi/);
  const leader = useRole(submitted, "pimpinan");
  assert.equal(visibleProblems(leader).length, 0);
  assert.throws(() => reviewProblem(leader, 1, "tercatat"), /Peran simulasi/);
});
test("tolak atau perbaikan wajib alasan", () => {
  const state = useRole(saveProblem(startDemo(), fields, "submit"), "verifikator_prov");
  assert.throws(() => reviewProblem(state, 1, "perlu_perbaikan"), /Alasan wajib/);
  const correction = reviewProblem(state, 1, "perlu_perbaikan", "Detail alat kurang jelas");
  assert.equal(correction.problems[0].status, "perlu_perbaikan");
  assert.equal(correction.problems[0].note, "Detail alat kurang jelas");
});
test("alur lengkap: perbaiki → kirim ulang → verifikasi → catat tindak lanjut → selesai", () => {
  let state = useRole(saveProblem(startDemo(), fields, "submit"), "verifikator_kab");
  state = reviewProblem(state, 1, "perlu_perbaikan", "Butuh keterangan lebih jelas");
  state = useRole(state, "petugas");
  state = saveProblem(state, { ...fields, description: fields.description + " Pemeriksaan awal sudah dilakukan." }, "submit", 1);
  state = useRole(state, "verifikator_kab");
  state = reviewProblem(state, 1, "tercatat");
  assert.equal(state.problems[0].status, "tercatat");
  assert.throws(() => followUpProblem(state, 1, "selesai", "Sudah ditutup"), /terlebih dahulu/);
  state = followUpProblem(state, 1, "ditindaklanjuti", "Koordinasi sarpras direncanakan");
  state = followUpProblem(state, 1, "selesai", "Pemeriksaan ulang dicatat");
  assert.equal(state.problems[0].status, "selesai");
  assert.equal(state.problems[0].history.length, state.problems[0].version);
  assert.equal(problemCounts(state).unresolved, 0);
  assert.equal(validateProblems(state), true);
});
test("masalah tidak otomatis menjadi persetujuan bantuan", () => {
  const reviewed = reviewProblem(useRole(saveProblem(startDemo(), fields, "submit"), "verifikator_prov"), 1, "tercatat");
  assert.equal(reviewed.problems[0].status, "tercatat");
  assert.equal("bantuan" in reviewed.problems[0], false);
  assert.equal("alokasi" in reviewed.problems[0], false);
});
test("verifikasi dua kali dilarang", () => {
  const s = reviewProblem(useRole(saveProblem(startDemo(), fields, "submit"), "verifikator_kab"), 1, "tercatat");
  assert.throws(() => reviewProblem(s, 1, "tercatat"), /tidak sedang/);
});
test("data judul, detail, kategori dan catatan yang tidak sah ditolak", () => {
  for (const invalid of [
    { ...fields, title: " " },
    { ...fields, category: "approval" },
    { ...fields, description: " " },
    { ...fields, title: "x".repeat(120) },
  ]) assert.throws(() => saveProblem(startDemo(), invalid, "save"));
  const submitted = useRole(saveProblem(startDemo(), fields, "submit"), "verifikator_kab");
  assert.throws(() => reviewProblem(submitted, 1, "tercatat", "x".repeat(301)), /Catatan/);
});
test("kasus luar cakupan simulasi ditolak", () => {
  const original = saveProblem(startDemo(), fields, "submit");
  const forged = { ...original, problems: original.problems.map(p => ({ ...p, puskeswan_id: "DEMO-PSW-999" })) };
  assert.throws(() => reviewProblem(useRole(forged, "verifikator_kab"), 1, "tercatat"), /luar cakupan/);
});
test("ID duplikat dan histori cacat ditolak", () => {
  const state = saveProblem(startDemo(), fields, "save");
  assert.throws(() => validateProblems({ ...state, problems: [...state.problems, state.problems[0]] }), /duplikat/);
  assert.throws(() => validateProblems({ ...state, problems: [{ ...state.problems[0], version: 9 }] }), /Histori/);
});
