import test from "node:test";
import assert from "node:assert/strict";
import {
  startDemo, useRole, sectionSummary, allSections, pendingQueue,
  saveDraft, saveOrSubmit, submitDraft, reviewRequest, demoMetrics, validateDemo,
} from "../model.mjs";

test("profil memuat lima bagian dan data DEMO", () => {
  const s = startDemo();
  assert.equal(allSections(s).length, 5);
  assert.match(s.facility.id, /^DEMO-/);
  assert.equal(sectionSummary(s, "legalitas").status, "terverifikasi");
});
test("belum lengkap berbeda dengan sedang diajukan", () => {
  const s = startDemo();
  assert.equal(sectionSummary(s, "wilayah_kerja").status, "belum_lengkap");
  assert.equal(sectionSummary(s, "peralatan").status, "diajukan");
});
test("petugas bisa menyimpan draf satu bagian", () => {
  const before = startDemo();
  const after = saveDraft(before, "bangunan", "Dinding perlu dicat ulang");
  assert.equal(sectionSummary(after, "bangunan").status, "draf");
  assert.equal(before.requests.length, 1);
  assert.equal(after.requests.length, 2);
  assert.equal(after.sections.bangunan.value, before.sections.bangunan.value);
});
test("petugas bisa mengirim draf tanpa mengubah data terverifikasi", () => {
  const state = saveDraft(startDemo(), "bangunan", "Dinding perlu dicat ulang");
  const sent = submitDraft(state, 2);
  assert.equal(sectionSummary(sent, "bangunan").status, "diajukan");
  assert.equal(sent.sections.bangunan.verified, false);
  assert.equal(sent.sections.bangunan.value, state.sections.bangunan.value);
});
test("peran petugas tidak bisa memverifikasi", () => {
  assert.throws(() => reviewRequest(startDemo(), 1, "disetujui"), /Peran simulasi/);
});
test("verifikator dapat melihat antrian pengajuan", () => {
  const reviewer = useRole(startDemo(), "verifikator_kab");
  assert.equal(pendingQueue(reviewer).length, 1);
});
test("verifikator tidak bisa menyimpan draf", () => {
  const reviewer = useRole(startDemo(), "verifikator_prov");
  assert.throws(() => saveDraft(reviewer, "legalitas", "Baru"), /Peran simulasi/);
});
test("persetujuan memperbarui satu bagian saja", () => {
  const state = useRole(startDemo(), "verifikator_prov");
  const after = reviewRequest(state, 1, "disetujui");
  assert.equal(after.sections.peralatan.value, "Alat pemeriksaan perlu diperbaiki");
  assert.equal(after.sections.peralatan.verified, true);
  assert.equal(after.sections.legalitas.value, state.sections.legalitas.value);
  assert.equal(pendingQueue(after).length, 0);
  assert.equal(state.sections.peralatan.value, null);
});
test("permintaan perbaikan wajib disertai alasan", () => {
  const state = useRole(startDemo(), "verifikator_kab");
  assert.throws(() => reviewRequest(state, 1, "perlu_perbaikan"), /Alasan wajib/);
  const changed = reviewRequest(state, 1, "perlu_perbaikan", "Foto alat belum jelas.");
  assert.equal(changed.requests[0].status, "perlu_perbaikan");
  assert.equal(changed.sections.peralatan.value, null);
});
test("petugas dapat memperbaiki dan mengirim ulang", () => {
  let s = useRole(startDemo(), "verifikator_prov");
  s = reviewRequest(s, 1, "perlu_perbaikan", "Tambahkan kondisi terbaru");
  s = useRole(s, "petugas");
  s = saveDraft(s, "peralatan", "Kondisi terbaru setelah pemeriksaan");
  s = submitDraft(s, 1);
  assert.equal(s.requests[0].status, "diajukan");
  assert.equal(s.requests[0].history.length, 4);
});
test("laporan yang sedang diverifikasi tidak bisa diedit", () => {
  assert.throws(() => saveDraft(startDemo(), "peralatan", "Ubah lagi"), /Tunggu keputusan/);
});
test("dua kali review pengajuan yang sama ditolak", () => {
  let s = useRole(startDemo(), "verifikator_kab");
  s = reviewRequest(s, 1, "disetujui");
  assert.throws(() => reviewRequest(s, 1, "disetujui"), /tidak lagi menunggu/);
});
test("pimpinan tidak mendapat hak edit dan verifikasi", () => {
  const leader = useRole(startDemo(), "pimpinan");
  assert.throws(() => saveDraft(leader, "bangunan", "Ubah"), /Peran simulasi/);
  assert.throws(() => reviewRequest(leader, 1, "disetujui"), /Peran simulasi/);
});
test("input kosong dan terlalu panjang ditolak", () => {
  assert.throws(() => saveDraft(startDemo(), "bangunan", ""), /wajib/);
  assert.throws(() => saveDraft(startDemo(), "bangunan", "x".repeat(201)), /wajib/);
});
test("perubahan data dengan isi sama tidak menambah versi", () => {
  const s = saveDraft(startDemo(), "bangunan", "A");
  assert.throws(() => saveDraft(s, "bangunan", "A"), /Belum ada perubahan/);
});
test("permintaan tidak dikenal ditolak", () => {
  assert.throws(() => submitDraft(startDemo(), 999), /tidak ditemukan/);
});
test("status metrik pembuka konsisten", () => {
  assert.deepEqual(demoMetrics(startDemo()), { total: 5, verified: 2, waiting: 1, corrections: 0 });
});
test("status belum valid ditolak validator", () => {
  const s = startDemo();
  s.requests[0].status = "status_palsu";
  assert.throws(() => validateDemo(s), /tidak sah/);
});
test("ID perubahan ganda ditolak", () => {
  const s = startDemo();
  s.requests.push({ ...s.requests[0] });
  assert.throws(() => validateDemo(s), /duplikat/);
});
test("peran tidak dikenal ditolak", () => {
  assert.throws(() => useRole(startDemo(), "admin"), /tidak dikenal/);
});

test("draf tersimpan bisa langsung diajukan tanpa mengetik ulang", () => {
  const draft = saveOrSubmit(startDemo(), "bangunan", "Ruang perlu perbaikan", "save");
  const sent = saveOrSubmit(draft, "bangunan", "Ruang perlu perbaikan", "submit");
  assert.equal(sent.requests.find(r => r.section === "bangunan").status, "diajukan");
  assert.equal(draft.requests.find(r => r.section === "bangunan").status, "draf");
});
test("menyimpan draf yang sama tidak membuat revisi ganda", () => {
  const draft = saveOrSubmit(startDemo(), "bangunan", "Ruang perlu perbaikan", "save");
  assert.equal(saveOrSubmit(draft, "bangunan", "Ruang perlu perbaikan", "save"), draft);
});
test("simpan dan ajukan dalam satu tindakan mengikuti alur resmi", () => {
  const sent = saveOrSubmit(startDemo(), "wilayah_kerja", "Area demo", "submit");
  assert.equal(sent.requests.find(r => r.section === "wilayah_kerja").status, "diajukan");
  assert.equal(sent.sections.wilayah_kerja.value, null);
});
test("pengiriman ulang saat masih menunggu ditolak", () => {
  assert.throws(() => saveOrSubmit(startDemo(), "peralatan", "Ubah", "submit"), /Tunggu keputusan/);
});
test("tindakan tak dikenal ditolak", () => {
  assert.throws(() => saveOrSubmit(startDemo(), "legalitas", "A", "hapus"), /tidak dikenal/);
});
