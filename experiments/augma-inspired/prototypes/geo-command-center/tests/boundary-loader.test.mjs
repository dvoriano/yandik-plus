import test from "node:test";
import assert from "node:assert/strict";
import { REGIONS } from "../regions.mjs";
import { validateBoundaryCollection } from "../boundary-loader.mjs";

const square = region => {
  const x = region.lon, y = region.lat;
  return { type: "Feature", properties: { code: region.code, name: region.name },
    geometry: { type: "Polygon", coordinates: [[
      [x-.01,y-.01],[x+.01,y-.01],[x+.01,y+.01],[x-.01,y+.01],[x-.01,y-.01]
    ]] } };
};
const sample = () => ({type:"FeatureCollection",features:REGIONS.map(square)});

test("validasi 19 poligon simulasi, bukan geometri resmi", () => {
  const parsed = validateBoundaryCollection(sample());
  assert.equal(parsed.features.length,19);
  assert.equal(parsed.metadata.pointCount,95);
  assert.equal(parsed.metadata.sourceVerified,false);
  assert.equal(parsed.metadata.legalBoundaryVerified,false);
});

test("tidak menerima kekurangan atau duplikasi kabupaten/kota", () => {
  const missing = sample(); missing.features.pop();
  assert.throws(() => validateBoundaryCollection(missing), /tepat 19/);
  const duplicate = sample(); duplicate.features[18] = duplicate.features[0];
  assert.throws(() => validateBoundaryCollection(duplicate), /duplikat/);
});

test("koordinat di luar Sumbar dan ring tidak tertutup ditolak", () => {
  const wrong = sample(); wrong.features[0].geometry.coordinates[0][0][0]=120;
  assert.throws(() => validateBoundaryCollection(wrong), /di luar/);
  const broken = sample(); broken.features[0].geometry.coordinates[0].pop();
  assert.throws(() => validateBoundaryCollection(broken), /tidak tertutup/);
});

test("nama kabupaten/kota Solok ambigu tanpa prefiks atau kode", () => {
  const ambiguous = sample();
  ambiguous.features[1].properties = { name: "Solok" };
  assert.throws(() => validateBoundaryCollection(ambiguous), /ambigu/);
});

test("kode wilayah dan nama yang bertentangan ditolak", () => {
  const conflict = sample();
  conflict.features[0].properties.name = "Kota Padang";
  assert.throws(() => validateBoundaryCollection(conflict), /tidak cocok|ambigu/);
});
