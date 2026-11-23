import test from "node:test";
import assert from "node:assert/strict";
import {
  REGIONS, DISCLAIMER, summarize, pendingRegions,
  pendingCount, reportingPercent, answerQuestion
} from "../core.mjs";

test("jumlah contoh konsisten dengan total per wilayah", () => {
  const s = summarize();
  assert.equal(s.regions, 6);
  assert.equal(s.sites, 21);
  assert.equal(s.reported, 15);
  assert.equal(s.services, 13580);
  assert.equal(s.sites - s.reported, 6);
});

test("unit belum melapor tidak negatif dan persentase aman", () => {
  assert.equal(pendingCount({ sites: 2, reported: 3 }), 0);
  assert.equal(reportingPercent({ sites: 0, reported: 0 }), 0);
  assert.equal(reportingPercent(REGIONS[0]), 75);
});

test("peringkat kekurangan laporan benar", () => {
  const list = pendingRegions();
  assert.equal(list[0].id, "limapuluh");
  assert.equal(list.length, 5);
  assert.ok(list.every(item => pendingCount(item) > 0));
});

test("pertanyaan didukung dan selalu melabel simulasi", () => {
  for (const q of ["belum melapor", "total layanan", "pelayanan terbanyak", "data resmi", "abc"]) {
    assert.ok(answerQuestion(q).includes(DISCLAIMER), q);
  }
  assert.match(answerQuestion("pelayanan terbanyak"), /Kabupaten Lima Puluh Kota/);
  assert.match(answerQuestion("belum melapor"), /unit belum melapor/);
});

test("data kosong dan input kosong tidak gagal", () => {
  assert.equal(summarize([]).sites, 0);
  assert.match(answerQuestion("tertinggi", []), /Tidak ada data/);
  assert.match(answerQuestion(""), /Tulis pertanyaan/);
});
