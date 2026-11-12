import test from "node:test";
import assert from "node:assert/strict";
import { readSdmSnapshot, readApelSnapshot, sourceSummary, DEMO_APEL_PERIODS } from "../source_snapshots.mjs";
test("ringkasan SDM berdasarkan ID master dengan sumber dan tanggal", () => {
  const d = readSdmSnapshot("DEMO-PSW-001");
  assert.equal(d.status, "tersedia");
  assert.equal(d.dokter_hewan, 0);
  assert.equal(d.paramedik, 1);
  assert.equal(d.observed_on, "2026-10-31");
  assert.match(d.source, /SDM/);
});
test("nol SDM bukan catatan tidak tersedia", () => {
  assert.equal(readSdmSnapshot("DEMO-PSW-002").paramedik, 0);
  assert.equal(readSdmSnapshot("DEMO-PSW-999").paramedik, null);
  assert.equal(readSdmSnapshot("DEMO-PSW-999").status, "belum_tersedia");
});
test("APEL belum melapor dibedakan dari laporan bernilai nol", () => {
  const zero = readApelSnapshot("DEMO-PSW-001", "2026-09");
  const missing = readApelSnapshot("DEMO-PSW-001", "2026-11");
  assert.equal(zero.status, "dilaporkan");
  assert.equal(zero.kategori.pemeriksaan, 0);
  assert.equal(missing.status, "belum_melapor");
  assert.equal(missing.kategori, null);
});
test("APEL contoh mempertahankan kategori tanpa total buatan", () => {
  const d = readApelSnapshot("DEMO-PSW-001", "2026-10");
  assert.deepEqual(d.kategori, {
    pemeriksaan: 12, pengobatan: 9, vaksinasi: 17, investigasi: 1, penyuluhan: 2,
  });
  assert.equal("total_pelayanan" in d, false);
  assert.equal(DEMO_APEL_PERIODS.length, 3);
});
test("ringkasan gabungan tidak menulis atau mengubah data sumber", () => {
  const first = sourceSummary("DEMO-PSW-001", "2026-10");
  assert.equal(first.puskeswan_id, "DEMO-PSW-001");
  assert.equal(Object.isFrozen(first.sdm), true);
  assert.equal(Object.isFrozen(first.apel.kategori), true);
  assert.throws(() => { first.apel.kategori.pemeriksaan = 999; }, TypeError);
  assert.equal(sourceSummary("DEMO-PSW-001", "2026-10").apel.kategori.pemeriksaan, 12);
});
test("format periode keliru tidak diterima", () => {
  assert.throws(() => readApelSnapshot("DEMO-PSW-001", "Oktober"), /tidak sah/);
});
