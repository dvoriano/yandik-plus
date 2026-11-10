/** M03-S1 Support Puskeswan prototype.
 * Verified facility problems may be referenced in draft support needs.
 * Verification != funding allocation, budget approval, BAST or delivery.
 * Demo only, no real authentication, database or live API.
 */
export const NEED_CATEGORIES = Object.freeze([
  { id: "peralatan", label: "Peralatan klinik" },
  { id: "rantai_dingin", label: "Rantai dingin" },
  { id: "obat_bhp", label: "Obat/BHP" },
  { id: "perbaikan", label: "Perbaikan sarana" },
  { id: "lainnya", label: "Lainnya" },
]);
export const URGENCY = Object.freeze([
  { id: "rendah", label: "Rendah" },
  { id: "sedang", label: "Sedang" },
  { id: "tinggi", label: "Tinggi" },
  { id: "darurat", label: "Darurat (perlu verifikasi)" },
]);
export const NEED_STATUS = Object.freeze({
  draf: "Draf kebutuhan",
  diajukan: "Menunggu verifikasi kebutuhan",
  perlu_perbaikan: "Perlu perbaikan kebutuhan",
  terverifikasi: "Kebutuhan terverifikasi, belum diputuskan",
  ditolak: "Kebutuhan ditolak",
});
const REVIEWERS = ["verifikator_kab", "verifikator_prov"];
const VERIFIED_PROBLEMS = new Set(["tercatat", "ditindaklanjuti"]);

function role(state, allowed) {
  if (!allowed.includes(state.role)) throw new Error("Peran simulasi tidak diizinkan.");
}
function text(value, field, min, max) {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max)
    throw new Error(field + " wajib " + min + "-" + max + " karakter.");
  return value.trim();
}
function enumId(list, value, name) {
  if (!list.some((x) => x.id === value)) throw new Error(name + " tidak dikenal.");
}
function validId(id) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("ID tidak sah.");
}
function problem(state, problemId, requireOpen = false) {
  validId(problemId);
  const found = state.problems.find((x) => x.id === problemId);
  if (!found) throw new Error("Permasalahan sumber tidak ditemukan.");
  if (found.puskeswan_id !== state.facility.id || found.kab_kota !== state.facility.region)
    throw new Error("Permasalahan sumber di luar cakupan.");
  if (requireOpen && !VERIFIED_PROBLEMS.has(found.status))
    throw new Error("Buat kebutuhan hanya dari masalah yang sudah diverifikasi dan masih aktif.");
  return found;
}
function getNeed(state, id) {
  validId(id);
  const need = state.supportNeeds.find((x) => x.id === id);
  if (!need) throw new Error("Kebutuhan tidak ditemukan.");
  if (need.puskeswan_id !== state.facility.id || need.kab_kota !== state.facility.region)
    throw new Error("Kebutuhan di luar cakupan.");
  problem(state, need.problem_id);
  return need;
}
function event(need, action, actor, note = "") {
  return [...need.history, {
    action, actor, version: need.version + 1, note: note.trim(),
  }];
}
function update(state, need) {
  return { ...state, supportNeeds: state.supportNeeds.map((x) => x.id === need.id ? need : x) };
}
function parseFields(fields) {
  if (!fields || typeof fields !== "object" || Array.isArray(fields))
    throw new Error("Data kebutuhan tidak sah.");
  enumId(NEED_CATEGORIES, fields.category, "Kategori bantuan");
  enumId(URGENCY, fields.urgency, "Urgensi");
  const item = text(fields.item, "Barang/kebutuhan", 5, 120);
  const reason = text(fields.reason, "Alasan", 10, 500);
  const qty = fields.quantity;
  if (!Number.isSafeInteger(qty) || qty < 1 || qty > 1000)
    throw new Error("Jumlah harus bilangan bulat 1-1000.");
  const unit = text(fields.unit, "Satuan", 2, 30);
  return { category: fields.category, urgency: fields.urgency, item, reason, quantity: qty, unit };
}
function activeDuplicate(state, sourceId, item, exceptId = null) {
  return state.supportNeeds.some((x) =>
    x.problem_id === sourceId && x.item.toLocaleLowerCase("id") === item.toLocaleLowerCase("id")
    && x.id !== exceptId && x.status !== "ditolak"
  );
}
export function visibleNeeds(state) {
  if (state.role === "pimpinan") return [];
  if (!["petugas", ...REVIEWERS].includes(state.role)) return [];
  return state.supportNeeds.filter((x) =>
    x.puskeswan_id === state.facility.id && x.kab_kota === state.facility.region
    && (state.role === "petugas" || x.status !== "draf")
  );
}
export function createOrEditNeed(state, fields, intent, needId = null) {
  role(state, ["petugas"]);
  if (!["save", "submit"].includes(intent)) throw new Error("Tindakan kebutuhan tidak dikenal.");
  const cleaned = parseFields(fields);
  let need, base;
  if (needId === null) {
    const src = problem(state, fields.problem_id, true);
    if (activeDuplicate(state, src.id, cleaned.item))
      throw new Error("Kebutuhan barang yang sama masih tercatat untuk masalah ini.");
    need = {
      id: state.nextNeedId, problem_id: src.id,
      puskeswan_id: state.facility.id, kab_kota: state.facility.region,
      source_problem_version: src.version,
      ...cleaned, status: "draf", version: 1, note: "",
      history: [{ action: "simpan_draf", actor: "petugas", version: 1, note: "" }],
    };
    base = {
      ...state, nextNeedId: state.nextNeedId + 1,
      supportNeeds: [...state.supportNeeds, need],
    };
  } else {
    const original = getNeed(state, needId);
    if (!["draf", "perlu_perbaikan"].includes(original.status))
      throw new Error("Hanya draf atau kebutuhan yang dikembalikan boleh diubah.");
    if (fields.problem_id !== original.problem_id)
      throw new Error("Referensi permasalahan tidak boleh diganti.");
    const src = problem(state, original.problem_id, true);
    if (activeDuplicate(state, src.id, cleaned.item, needId))
      throw new Error("Kebutuhan barang yang sama masih tercatat untuk masalah ini.");
    const unchanged = Object.entries(cleaned).every(([key, value]) => original[key] === value);
    if (unchanged && original.status === "draf")
      return intent === "submit" ? submitNeed(state, original.id) : state;
    need = {
      ...original, ...cleaned, status: "draf", version: original.version + 1,
      history: event(original, "simpan_draf", "petugas"),
    };
    base = update(state, need);
  }
  return intent === "submit" ? submitNeed(base, need.id) : base;
}
export function submitNeed(state, needId) {
  role(state, ["petugas"]);
  const need = getNeed(state, needId);
  if (need.status !== "draf") throw new Error("Hanya draf kebutuhan dapat diajukan.");
  problem(state, need.problem_id, true);
  return update(state, {
    ...need, status: "diajukan", version: need.version + 1,
    history: event(need, "ajukan", "petugas"),
  });
}
export function verifyNeed(state, needId, decision, notes = "") {
  role(state, REVIEWERS);
  if (!["terverifikasi", "perlu_perbaikan", "ditolak"].includes(decision))
    throw new Error("Keputusan kebutuhan tidak dikenal.");
  const need = getNeed(state, needId);
  if (need.status !== "diajukan") throw new Error("Kebutuhan tidak sedang menunggu verifikasi.");
  if (typeof notes !== "string" || notes.length > 300)
    throw new Error("Catatan verifikasi tidak sah.");
  if (decision !== "terverifikasi" && !notes.trim())
    throw new Error("Alasan wajib untuk perbaikan atau penolakan.");
  // A verified need is still ONLY a documented need.
  return update(state, {
    ...need, status: decision, note: notes.trim(),
    version: need.version + 1,
    history: event(need, decision, state.role, notes),
  });
}
export function supportCounts(state) {
  const needs = visibleNeeds(state);
  return {
    total: needs.length,
    waiting: needs.filter((x) => x.status === "diajukan").length,
    verified: needs.filter((x) => x.status === "terverifikasi").length,
    corrections: needs.filter((x) => x.status === "perlu_perbaikan").length,
  };
}
export function validateNeeds(state) {
  if (!Array.isArray(state.supportNeeds)) throw new Error("Daftar kebutuhan tidak sah.");
  const seen = new Set();
  for (const need of state.supportNeeds) {
    if (!Number.isSafeInteger(need.id) || need.id < 1 || seen.has(need.id))
      throw new Error("ID kebutuhan ganda atau tidak sah.");
    seen.add(need.id);
    const src = problem(state, need.problem_id);
    if (need.puskeswan_id !== src.puskeswan_id || need.kab_kota !== src.kab_kota)
      throw new Error("Referensi wilayah kebutuhan tidak cocok.");
    parseFields(need);
    if (!Object.keys(NEED_STATUS).includes(need.status) ||
        !Number.isSafeInteger(need.version) || need.version < 1 ||
        !Array.isArray(need.history) || need.history.length !== need.version ||
        !Number.isSafeInteger(need.source_problem_version) ||
        need.source_problem_version < 1 || need.source_problem_version > src.version)
      throw new Error("Status/riwayat kebutuhan tidak valid.");
    for (const forbidden of ["approved_budget", "funding_approved", "bast", "delivery_id"]) {
      if (Object.hasOwn(need, forbidden))
        throw new Error("Data keputusan bantuan tidak boleh disimpan otomatis.");
    }
  }
  return true;
}
