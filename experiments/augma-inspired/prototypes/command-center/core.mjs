// YANDIK+ Innovation Lab — data sintetis. BUKAN statistik Puskeswan resmi.
export const REGIONS = Object.freeze([
  { id: "padang", name: "Kota Padang", sites: 4, reported: 3, services: 2420, x: 170, y: 285 },
  { id: "bukittinggi", name: "Kota Bukittinggi", sites: 2, reported: 2, services: 1640, x: 270, y: 182 },
  { id: "payakumbuh", name: "Kota Payakumbuh", sites: 3, reported: 2, services: 1890, x: 355, y: 163 },
  { id: "solok", name: "Kota Solok", sites: 2, reported: 1, services: 980, x: 248, y: 297 },
  { id: "agam", name: "Kabupaten Agam", sites: 5, reported: 4, services: 3100, x: 242, y: 117 },
  { id: "limapuluh", name: "Kabupaten Lima Puluh Kota", sites: 5, reported: 3, services: 3550, x: 395, y: 208 }
]);

export const DISCLAIMER = "SIMULASI: seluruh angka adalah data fiktif untuk uji antarmuka, bukan data resmi APEL/Puskeswan.";

export function pendingCount(item) {
  return Math.max(0, item.sites - item.reported);
}

export function reportingPercent(item) {
  return item.sites > 0 ? Math.round(100 * item.reported / item.sites) : 0;
}

export function summarize(data = REGIONS) {
  return data.reduce((acc, item) => ({
    sites: acc.sites + item.sites,
    reported: acc.reported + item.reported,
    services: acc.services + item.services,
    regions: acc.regions + 1
  }), { sites: 0, reported: 0, services: 0, regions: 0 });
}

export function pendingRegions(data = REGIONS) {
  return data.filter(item => pendingCount(item) > 0)
    .slice()
    .sort((a, b) => pendingCount(b) - pendingCount(a) || a.name.localeCompare(b.name));
}

// Respon deterministik. Ini BUKAN LLM, bukan agent, dan tidak membaca database.
export function answerQuestion(question, data = REGIONS) {
  const q = String(question || "").toLocaleLowerCase("id-ID").trim();
  if (!q) return "Tulis pertanyaan terlebih dahulu. " + DISCLAIMER;

  const s = summarize(data);
  let answer;
  if (/sumber|asli|resmi|valid|produksi|database/.test(q)) {
    answer = "Dashboard ini tidak terhubung ke database nyata. Data dibuat khusus untuk demonstrasi.";
  } else if (/belum|terlambat|tidak lapor|kekurangan|lapor/.test(q)) {
    const missing = pendingRegions(data);
    answer = missing.length
      ? "Wilayah contoh dengan unit belum melapor: " +
        missing.map(r => r.name + " (" + pendingCount(r) + ")").join(", ") + "."
      : "Semua unit pada contoh sudah melapor.";
  } else if (/terbanyak|tertinggi|paling banyak|terbesar|peringkat/.test(q)) {
    if (data.length === 0) answer = "Tidak ada data contoh untuk diperiksa.";
    else {
      const top = data.slice().sort((a, b) => b.services - a.services)[0];
      answer = "Pelayanan terbanyak pada contoh: " + top.name + " (" +
        top.services.toLocaleString("id-ID") + " layanan).";
    }
  } else if (/jumlah|total|berapa|ringkasan|layanan|pelayanan/.test(q)) {
    answer = "Ringkasan contoh: " + s.regions + " wilayah, " + s.sites +
      " unit, " + s.reported + " unit melapor, " +
      (s.sites - s.reported) + " belum melapor, " +
      s.services.toLocaleString("id-ID") + " layanan.";
  } else {
    answer = "Pertanyaan yang didukung: 'Siapa belum melapor?', 'Berapa total pelayanan?', " +
      "'Wilayah pelayanan terbanyak?', atau 'Apakah ini data resmi?'.";
  }
  return answer + " " + DISCLAIMER;
}
