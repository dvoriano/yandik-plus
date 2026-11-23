// YANDIK+ lab: strict browser-local ADM2 GeoJSON validation.
// No network, source inference, or alteration of actual geometry.
import { REGIONS } from "./regions.mjs";

const officialByCode = new Map(REGIONS.map(region => [region.code, region]));
const cleanup = value => String(value ?? "")
  .toLocaleLowerCase("id-ID").normalize("NFKC").replace(/[^\p{L}\p{N}\s]/gu, " ")
  .replace(/\s+/g, " ").trim();

const CODES = ["code", "kode", "KODE", "KDPKAB", "kdpkab", "KDPPUM", "kdppum"];
const NAMES = ["name", "shapeName", "NAMOBJ", "namobj", "WADMKK", "wadmkk", "nama"];
const RAW_TYPES = ["type", "level", "regionType", "jenis"];

function determineRegion(feature) {
  const properties = feature?.properties ?? {};
  const key = CODES.map(p => properties[p]).find(v => typeof v === "string" && /^13\.(?:0[1-9]|1[0-2]|7[1-7])$/.test(v));
  const rawName = NAMES.map(p => properties[p]).find(v => typeof v === "string" && v.length > 0);
  if (key) {
    const found = officialByCode.get(key);
    if (!found) return null;
    if (!rawName) return found;
    const candidate = cleanup(rawName);
    if (candidate === cleanup(found.name) ||
        candidate === cleanup(found.name.replace(/^(kabupaten|kota) /i, ""))) return found;
    return null; // fail closed on mismatched name/code
  }
  if (!rawName) return null;
  const name = cleanup(rawName);
  const matches = REGIONS.filter(region =>
    cleanup(region.name) === name ||
    cleanup(region.name.replace(/^(kabupaten|kota) /i, "")) === name
  );
  if (matches.length === 1) return matches[0];

  const type = RAW_TYPES.map(p => properties[p]).find(v => typeof v === "string");
  const kind = cleanup(type).includes("kota") || cleanup(type).includes("city") ? "kota"
    : cleanup(type).includes("kabupaten") || cleanup(type).includes("regency") ? "kabupaten" : null;
  const byKind = matches.filter(region => region.type === kind);
  return byKind.length === 1 ? byKind[0] : null;
}

function assertRing(ring, label, counter) {
  if (!Array.isArray(ring) || ring.length < 4) throw Error(label + " memiliki ring kurang dari 4 titik");
  counter.count += ring.length;
  if (counter.count > 300000) throw Error("Geometri terlalu besar untuk perangkat uji");
  for (const coordinate of ring) {
    if (!Array.isArray(coordinate) || coordinate.length < 2) throw Error(label + " memiliki koordinat rusak");
    const [lon, lat] = coordinate;
    if (!Number.isFinite(lon) || !Number.isFinite(lat) ||
        lon < 98 || lon > 103 || lat < -4 || lat > 2)
      throw Error(label + " memiliki koordinat di luar rentang Sumatera Barat");
  }
  const [a, b] = [ring[0], ring[ring.length - 1]];
  if (Math.abs(a[0] - b[0]) > 0.000001 || Math.abs(a[1] - b[1]) > 0.000001)
    throw Error(label + " memiliki ring yang tidak tertutup");
}

function checkGeometry(geometry, label, counter) {
  if (!geometry || !["Polygon", "MultiPolygon"].includes(geometry.type))
    throw Error(label + " bukan Polygon/MultiPolygon");
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  if (!Array.isArray(polygons) || !polygons.length) throw Error(label + " tidak memiliki area");
  for (const polygon of polygons) {
    if (!Array.isArray(polygon) || !polygon.length) throw Error(label + " memiliki polygon kosong");
    for (const ring of polygon) assertRing(ring, label, counter);
  }
}

export function validateBoundaryCollection(collection) {
  if (!collection || collection.type !== "FeatureCollection" ||
      !Array.isArray(collection.features) || collection.features.length !== 19)
    throw Error("GeoJSON kabupaten/kota harus FeatureCollection berisi tepat 19 fitur");
  const used = new Set();
  const counter = { count: 0 };
  const normalized = [];
  for (const feature of collection.features) {
    const region = determineRegion(feature);
    if (!region) throw Error("Nama/kode wilayah tidak cocok atau ambigu: " +
      JSON.stringify(feature?.properties ?? {}).slice(0, 180));
    if (used.has(region.code)) throw Error("Wilayah duplikat: " + region.name);
    checkGeometry(feature.geometry, region.name, counter);
    used.add(region.code);
    normalized.push({
      type: "Feature",
      properties: { code: region.code, name: region.name, type: region.type },
      geometry: feature.geometry
    });
  }
  if (used.size !== REGIONS.length || !REGIONS.every(region => used.has(region.code)))
    throw Error("Cakupan wilayah 19 kabupaten/kota belum lengkap");
  return Object.freeze({
    type: "FeatureCollection",
    features: Object.freeze(normalized),
    metadata: Object.freeze({
      validation: "STRUCTURE_ONLY",
      polygonCount: normalized.length,
      pointCount: counter.count,
      sourceVerified: false,
      legalBoundaryVerified: false,
      note: "Validasi teknis tidak menjamin akurasi geospasial atau lisensi."
    })
  });
}
