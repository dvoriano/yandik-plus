// Independent read-only evidence assistant in the lab.
// No LLM provider is connected; answers are deterministic until an evaluated adapter exists.
import { REGIONS, regionByCode, filterRegions, summarize } from "../geo-command-center/regions.mjs";

export const SOURCES = Object.freeze({
  law: Object.freeze({
    id: "LAW-17-2022", label: "UU 17/2022, Pasal 3 (19 kabupaten/kota)",
    url: "https://jdih.bpkp.go.id/dokumen/data_dokumen/Salinan%20UU%20Nomor%2017%20Tahun%202022.pdf"
  }),
  region: Object.freeze({
    id: "LAB-REGISTRY", label: "Registry wilayah lab, indikatif (regions.mjs)",
    url: "../geo-command-center/regions.mjs"
  }),
  data: Object.freeze({
    id: "LAB-DATA-STATUS", label: "Status data simulasi (regions.mjs: nilai null)",
    url: "../geo-command-center/regions.mjs"
  }),
  map: Object.freeze({
    id: "MAP-ATTRIBUTION", label: "Catatan asal geometri & keterbatasan peta",
    url: "../geo-command-center/README.md"
  }),
  guard: Object.freeze({
    id: "LAB-SAFETY", label: "Aturan eksperimen dan larangan data produksi",
    url: "../../docs/SAFETY_AND_LICENSE.md"
  })
});
export const POLICY = Object.freeze({
  environment: "LAB_ONLY",
  external_calls: false,
  production_data: false,
  invented_metrics: false,
  automatic_decisions: false,
  provider: "DETERMINISTIC_MOCK"
});

function reply(text, sources, status = "answered") {
  return Object.freeze({
    text,
    sources: Object.freeze(sources),
    status,
    provider: POLICY.provider
  });
}

const normalize = value => String(value ?? "").toLocaleLowerCase("id-ID").normalize("NFKC").trim();

function findExplicitRegion(query) {
  const canonical = normalize(query).replace(/[^\p{L}\p{N}.\s]/gu, " ");
  const fullNames = [...REGIONS].sort((a, b) => b.name.length - a.name.length);
  const full = fullNames.find(r => canonical.includes(normalize(r.name)));
  if (full) return full;
  const seat = [...REGIONS].sort((a, b) => b.seat.length - a.seat.length).find(r => {
    const word = normalize(r.seat);
    return word.length >= 6 && canonical.includes(word);
  });
  return seat ?? null;
}

// Classification gate comes before any data lookup, so missing service metrics cannot be hallucinated.
export function answer(question) {
  const q = normalize(question).slice(0, 240);
  if (!q) return reply("Tulis pertanyaan untuk melihat jawaban dengan sumber.", [], "help");
  if (/password|kata sandi|token|api key|kredensial|data pribadi|akses produksi|login produksi/.test(q)) {
    return reply("Lab ini tidak memiliki izin ataupun koneksi untuk mengambil kredensial, data pribadi, dan data produksi. Gunakan lingkungan uji yang diotorisasi.", [SOURCES.guard], "refused");
  }
  const region = findExplicitRegion(q);
  if (/puskeswan|pelayanan|jumlah layanan|berapa layanan|vaksin|laporan|pelaporan|sudah melapor|belum melapor|kasus|penyakit|kematian|stok/.test(q)) {
    const scope = region ? " untuk " + region.name : "";
    return reply("Data pelayanan, pelaporan, atau fasilitas Puskeswan" + scope +
      " **belum tersedia** pada eksperimen ini. Status belum tersedia berbeda dengan 0. Saya tidak akan membuat angka perkiraan.",
      [SOURCES.data, SOURCES.guard], "unavailable");
  }
  if (region) {
    return reply(region.name + " (kode " + region.code + ") tercantum pada registry lab. Penanda peta berada kira-kira di sekitar " +
      region.seat + ", bukan koordinat GPS pusat layanan atau batas hukum resmi.",
      [SOURCES.region, SOURCES.map], "answered");
  }
  if (/apa (saja )?(nama )?(daftar )?kabupaten|sebutkan kabupaten|kabupaten apa saja/.test(q)) {
    const names = REGIONS.filter(r => r.type === "kabupaten").map(r => r.name);
    return reply("Dua belas kabupaten: " + names.join("; ") + ".", [SOURCES.law, SOURCES.region]);
  }
  if (/apa (saja )?(nama )?(daftar )?kota|sebutkan kota|kota apa saja/.test(q)) {
    const names = REGIONS.filter(r => r.type === "kota").map(r => r.name);
    return reply("Tujuh kota: " + names.join("; ") + ".", [SOURCES.law, SOURCES.region]);
  }
  if (/berapa|jumlah|total|banyak|kabupaten|kota|wilayah/.test(q)) {
    const { regions, kabupaten, kota } = summarize();
    return reply("Secara administratif Sumatera Barat memiliki " + regions +
      " kabupaten/kota: " + kabupaten + " kabupaten dan " + kota +
      " kota. Jumlah ini adalah cakupan administrasi, bukan jumlah Puskeswan.",
      [SOURCES.law, SOURCES.region]);
  }
  if (/peta|batas|geojson|koordinat|lokasi|geografi|geometri/.test(q)) {
    return reply("Peta lab menggambar outline provinsi dari GeoJSON pihak ketiga dan titik pusat wilayah yang bersifat indikatif. Batas kabupaten/kota dan koordinat Puskeswan yang telah diverifikasi belum tersedia.",
      [SOURCES.map, SOURCES.region]);
  }
  if (/ai|otomatis|agent|asisten|kamu siapa|sumber|dasar jawaban/.test(q)) {
    return reply("Saya adalah Evidence Assistant versi lab, saat ini masih berbasis aturan dan hanya membaca registry wilayah uji. Saya belum menggunakan LLM atau tersambung ke data operasional. Setiap jawaban faktual menyertakan sumber.",
      [SOURCES.guard, SOURCES.region], "help");
  }
  return reply("Pertanyaan ini belum bisa dijawab dari bukti yang tersedia. Contoh: 'Berapa kabupaten/kota di Sumatera Barat?', 'Sebutkan kabupaten', 'Apakah ada data pelayanan?', atau 'Apa sumber peta?'.",
    [SOURCES.guard], "unavailable");
}

export function prepareEvidencePackage(question) {
  const result = answer(question);
  // Future local LLM adapters may consume this, but never receive raw production data.
  return Object.freeze({
    query: String(question ?? "").slice(0, 240),
    answer_status: result.status,
    allowed_evidence: result.sources.map(s => ({ id: s.id, label: s.label, url: s.url })),
    grounded_response: result.text,
    constraints: ["Do not invent numbers", "No production API", "Cite source IDs", "Never act on external systems"]
  });
}
