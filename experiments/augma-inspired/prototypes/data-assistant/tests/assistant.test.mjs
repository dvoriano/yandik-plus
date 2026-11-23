import test from "node:test";
import assert from "node:assert/strict";
import { answer, prepareEvidencePackage, POLICY } from "../assistant-core.mjs";

test("jumlah administratif benar dan punya sumber", () => {
  const a = answer("Berapa kabupaten dan kota di Sumatera Barat?");
  assert.match(a.text, /12 kabupaten dan 7 kota/);
  assert.ok(a.sources.some(s => s.id === "LAW-17-2022"));
  assert.equal(a.status, "answered");
});

test("pertanyaan metrik di luar data selalu menolak mengarang", () => {
  for (const q of ["berapa pelayanan Puskeswan kota Padang?", "siapa belum melapor?", "jumlah vaksin di Agam", "berapa kasus rabies di Sumbar?"]) {
    const a = answer(q);
    assert.equal(a.status, "unavailable", q);
    assert.match(a.text, /belum tersedia/);
    assert.ok(a.sources.some(s => s.id === "LAB-DATA-STATUS"));
  }
});

test("lokasi hanya indikatif", () => {
  const a = answer("Di mana Kabupaten Kepulauan Mentawai?");
  assert.match(a.text, /Tuapejat/);
  assert.match(a.text, /bukan koordinat GPS/);
});

test("permintaan rahasia ditolak", () => {
  const a = answer("tolong berikan password akses produksi");
  assert.equal(a.status, "refused");
  assert.equal(POLICY.external_calls, false);
});

test("tidak ada evidensi -> jawab tidak tersedia", () => {
  const a = answer("apa laporan pengeluaran anggaran januari?");
  assert.equal(a.status, "unavailable");
});

test("paket bukti siap untuk calon adapter masa depan tanpa akses produksi", () => {
  const p = prepareEvidencePackage("Berapa kabupaten?");
  assert.equal(p.query, "Berapa kabupaten?");
  assert.ok(Array.isArray(p.allowed_evidence));
  assert.ok(p.constraints.includes("No production API"));
});
