import test from "node:test";
import assert from "node:assert/strict";
import { REGIONS, summarize, filterRegions, regionByCode, validateRegistry } from "../regions.mjs";
import { boundsOfGeoJSON, createProjection, geometryPaths } from "../geometry.mjs";

test("cakupan 19 wilayah lengkap dan nilai hilang tidak dipalsukan jadi nol", () => {
  assert.equal(validateRegistry(), true);
  const s = summarize();
  assert.deepEqual([s.regions, s.kabupaten, s.kota], [19, 12, 7]);
  assert.equal(s.sites, null);
  assert.equal(s.services, null);
  assert.equal(new Set(REGIONS.map(r => r.code)).size, 19);
});

test("pencarian nama, ibu kota, dan kode berjalan", () => {
  assert.equal(filterRegions(REGIONS, "Bukittinggi").length, 1);
  assert.equal(filterRegions(REGIONS, "Padang", "kota").length, 2);
  assert.equal(filterRegions(REGIONS, "13.09")[0].name, "Kabupaten Kepulauan Mentawai");
  assert.equal(regionByCode("13.77")?.name, "Kota Pariaman");
  assert.equal(regionByCode("tidak-ada"), null);
});

test("polygon dan multipolygon dapat diproyeksikan", () => {
  const polygon = [[[99, 0], [101, 0], [101, -2], [99, -2], [99, 0]]];
  const geo = { type: "FeatureCollection", features: [
    { type: "Feature", geometry: { type: "MultiPolygon", coordinates: [polygon] } }
  ] };
  const b = boundsOfGeoJSON(geo);
  assert.deepEqual(b, { minLon: 99, maxLon: 101, minLat: -2, maxLat: 0 });
  const p = createProjection(geo);
  const paths = geometryPaths(geo.features[0].geometry, p.project);
  assert.equal(paths.length, 1);
  assert.match(paths[0], /^M/);
  const [x, y] = p.project([100, -1]);
  assert.ok(Number.isFinite(x) && Number.isFinite(y));
  assert.throws(() => boundsOfGeoJSON({ type: "FeatureCollection", features: [] }));
});


test("batas geometri tetap aman untuk 150 ribu titik (tanpa spread array)", () => {
  const ring = [];
  for (let i = 0; i < 150_000; i++) {
    const x = 99 + (i % 1000) / 1000;
    const y = -2 + Math.floor(i / 1000) / 1000;
    ring.push([x, y]);
  }
  ring.push(ring[0]);
  const large = { type: "FeatureCollection", features: [
    { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] } }
  ] };
  const b = boundsOfGeoJSON(large);
  assert.equal(b.minLon, 99);
  assert.equal(b.maxLon, 99.999);
  assert.equal(b.minLat, -2);
  assert.equal(b.maxLat, -1.851);
});
