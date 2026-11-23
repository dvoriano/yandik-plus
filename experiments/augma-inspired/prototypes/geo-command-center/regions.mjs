// 19 kabupaten/kota in West Sumatra, pursuant to UU 17/2022.
// Coordinates are APPROXIMATE markers near the administrative seats, NOT official centroids,
// office locations, Puskeswan sites, or legal boundaries. No production metrics.
export const REGIONS = Object.freeze([
  { code: "13.01", name: "Kabupaten Pesisir Selatan", type: "kabupaten", lon: 100.575, lat: -1.350, seat: "Painan" },
  { code: "13.02", name: "Kabupaten Solok", type: "kabupaten", lon: 100.675, lat: -0.951, seat: "Arosuka" },
  { code: "13.03", name: "Kabupaten Sijunjung", type: "kabupaten", lon: 101.015, lat: -0.706, seat: "Muaro Sijunjung" },
  { code: "13.04", name: "Kabupaten Tanah Datar", type: "kabupaten", lon: 100.594, lat: -0.461, seat: "Batusangkar" },
  { code: "13.05", name: "Kabupaten Padang Pariaman", type: "kabupaten", lon: 100.284, lat: -0.573, seat: "Parit Malintang" },
  { code: "13.06", name: "Kabupaten Agam", type: "kabupaten", lon: 100.146, lat: -0.328, seat: "Lubuk Basung" },
  { code: "13.07", name: "Kabupaten Lima Puluh Kota", type: "kabupaten", lon: 100.665, lat: -0.172, seat: "Sarilamak" },
  { code: "13.08", name: "Kabupaten Pasaman", type: "kabupaten", lon: 100.160, lat: 0.144, seat: "Lubuk Sikaping" },
  { code: "13.09", name: "Kabupaten Kepulauan Mentawai", type: "kabupaten", lon: 99.586, lat: -2.028, seat: "Tuapejat" },
  { code: "13.10", name: "Kabupaten Dharmasraya", type: "kabupaten", lon: 101.498, lat: -1.113, seat: "Pulau Punjung" },
  { code: "13.11", name: "Kabupaten Solok Selatan", type: "kabupaten", lon: 101.250, lat: -1.559, seat: "Padang Aro" },
  { code: "13.12", name: "Kabupaten Pasaman Barat", type: "kabupaten", lon: 99.830, lat: 0.231, seat: "Simpang Empat" },
  { code: "13.71", name: "Kota Padang", type: "kota", lon: 100.354, lat: -0.950, seat: "Padang" },
  { code: "13.72", name: "Kota Solok", type: "kota", lon: 100.660, lat: -0.799, seat: "Solok" },
  { code: "13.73", name: "Kota Sawahlunto", type: "kota", lon: 100.780, lat: -0.687, seat: "Sawahlunto" },
  { code: "13.74", name: "Kota Padang Panjang", type: "kota", lon: 100.404, lat: -0.460, seat: "Padang Panjang" },
  { code: "13.75", name: "Kota Bukittinggi", type: "kota", lon: 100.370, lat: -0.305, seat: "Bukittinggi" },
  { code: "13.76", name: "Kota Payakumbuh", type: "kota", lon: 100.633, lat: -0.229, seat: "Payakumbuh" },
  { code: "13.77", name: "Kota Pariaman", type: "kota", lon: 100.120, lat: -0.625, seat: "Pariaman" }
].map(({code,name,type,lon,lat,seat}) => Object.freeze({
  code, name, type, lon, lat, seat,
  sites: null, reported: null, services: null
})));

export const DISCLAIMER = "DATA DEMO: tidak ada angka pelayanan atau pelaporan asli. Lokasi penanda hanya indikatif; batas bukan rujukan hukum.";

export function summarize(regions = REGIONS) {
  return Object.freeze({
    regions: regions.length,
    kabupaten: regions.filter(r => r.type === "kabupaten").length,
    kota: regions.filter(r => r.type === "kota").length,
    sites: null,
    reported: null,
    services: null
  });
}

export function filterRegions(regions = REGIONS, term = "", category = "all") {
  const query = String(term).trim().toLocaleLowerCase("id-ID");
  return regions.filter(r =>
    (category === "all" || r.type === category) &&
    (r.name.toLocaleLowerCase("id-ID").includes(query) ||
      r.seat.toLocaleLowerCase("id-ID").includes(query) ||
      r.code.includes(query))
  );
}

export function regionByCode(code, regions = REGIONS) {
  return regions.find(r => r.code === code) ?? null;
}

export function validateRegistry(regions = REGIONS) {
  const codes = new Set();
  for (const r of regions) {
    if (codes.has(r.code) || !/^13\.(?:0[1-9]|1[0-2]|7[1-7])$/.test(r.code)) return false;
    codes.add(r.code);
    if (!(r.lon >= 98 && r.lon <= 103 && r.lat >= -4 && r.lat <= 2)) return false;
    if (r.sites !== null || r.reported !== null || r.services !== null) return false;
  }
  const { regions: n, kabupaten, kota } = summarize(regions);
  return n === 19 && kabupaten === 12 && kota === 7;
}
