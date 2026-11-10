// Demo-only state model for the M02 mobile interface.
// These are NOT API permissions, and role switching is NOT authentication.
export const SECTION_DEFS = Object.freeze([
  { id: "legalitas", label: "Legalitas", prompt: "Keterangan legalitas Puskeswan", hint: "Tuliskan status dokumen atau informasi yang perlu diperbarui." },
  { id: "bangunan", label: "Bangunan", prompt: "Kondisi bangunan", hint: "Tuliskan kondisi terbaru bangunan atau ruang pelayanan." },
  { id: "peralatan", label: "Peralatan klinik", prompt: "Kondisi peralatan klinik", hint: "Contoh: alat pemeriksaan perlu diperbaiki." },
  { id: "obat_bhp", label: "Obat dan BHP", prompt: "Ketersediaan obat dan bahan habis pakai", hint: "Tuliskan kondisi umum, bukan nama atau data pasien." },
  { id: "wilayah_kerja", label: "Wilayah kerja", prompt: "Keterangan wilayah kerja", hint: "Jelaskan perubahan wilayah pelayanan bila diperlukan." },
]);
export const ROLES = Object.freeze([
  { id: "petugas", label: "Petugas Puskeswan" },
  { id: "verifikator_kab", label: "Verifikator Kab/Kota" },
  { id: "verifikator_prov", label: "Verifikator Provinsi" },
  { id: "pimpinan", label: "Pimpinan (ringkasan)" },
]);
const STATES = new Set(["draf", "diajukan", "perlu_perbaikan", "disetujui", "ditolak"]);
const DECISIONS = new Set(["disetujui", "perlu_perbaikan", "ditolak"]);

export function startDemo() {
  return {
    role: "petugas",
    facility: { id: "DEMO-PSW-001", name: "Puskeswan Fiktif A", region: "Kabupaten Contoh" },
    sections: {
      legalitas: { value: "Dokumen tercatat dalam contoh", verified: true, date: "2026-10-10" },
      bangunan: { value: "Ruang pemeriksaan perlu perbaikan ringan", verified: false, date: "2026-10-20" },
      peralatan: { value: null, verified: false, date: null },
      obat_bhp: { value: "Persediaan tercatat untuk contoh", verified: true, date: "2026-10-17" },
      wilayah_kerja: { value: null, verified: false, date: null },
    },
    requests: [{
      id: 1, section: "peralatan", value: "Alat pemeriksaan perlu diperbaiki",
      status: "diajukan", version: 1, note: "",
      history: [{ action: "ajukan", actor: "Petugas Puskeswan", version: 1 }],
    }],
    nextId: 2,
    problems: [],
    nextProblemId: 1,
  };
}

function assertSection(section) {
  if (!SECTION_DEFS.some((s) => s.id === section)) throw new Error("Bagian profil tidak dikenal.");
}
function assertRole(state, allowed) {
  if (!allowed.includes(state.role)) throw new Error("Peran simulasi tidak diizinkan untuk tindakan ini.");
}
function assertRequest(state, id) {
  const request = state.requests.find((r) => r.id === id);
  if (!request) throw new Error("Pengajuan tidak ditemukan.");
  return request;
}
function currentRequest(state, section) {
  return [...state.requests].reverse().find(
    (r) => r.section === section && ["draf", "diajukan", "perlu_perbaikan"].includes(r.status)
  ) ?? null;
}
export function useRole(state, role) {
  if (!ROLES.some((r) => r.id === role)) throw new Error("Peran simulasi tidak dikenal.");
  return { ...state, role };
}
export function sectionSummary(state, section) {
  assertSection(section);
  const base = state.sections[section];
  const active = currentRequest(state, section);
  let status = "belum_lengkap";
  if (active) status = active.status;
  else if (base?.verified && base.value !== null) status = "terverifikasi";
  else if (base?.value !== null) status = "perlu_verifikasi";
  return {
    section, status, value: base?.value ?? null,
    latestDate: base?.date ?? null, request: active,
    canEdit: state.role === "petugas" && (!active || active.status !== "diajukan"),
  };
}
export function allSections(state) {
  return SECTION_DEFS.map((section) => ({ ...section, ...sectionSummary(state, section.id) }));
}
export function pendingQueue(state) {
  assertRole(state, ["verifikator_kab", "verifikator_prov"]);
  return state.requests.filter((r) => r.status === "diajukan");
}
export function saveDraft(state, section, text) {
  assertRole(state, ["petugas"]);
  assertSection(section);
  if (typeof text !== "string" || !text.trim() || text.trim().length > 200)
    throw new Error("Isi perubahan wajib 1 sampai 200 karakter.");
  const value = text.trim();
  const active = currentRequest(state, section);
  if (active?.status === "diajukan")
    throw new Error("Pengajuan sedang diperiksa. Tunggu keputusan verifikator.");
  if (active && !["draf", "perlu_perbaikan"].includes(active.status))
    throw new Error("Pengajuan tidak bisa diubah.");
  if (active && active.value === value && active.status === "draf")
    throw new Error("Belum ada perubahan baru untuk disimpan.");
  const version = (active?.version ?? 0) + 1;
  const updated = {
    id: active?.id ?? state.nextId,
    section, value, status: "draf", version, note: "",
    history: [
      ...(active?.history ?? []),
      { action: "simpan_draf", actor: "Petugas Puskeswan", version },
    ],
  };
  return {
    ...state,
    nextId: active ? state.nextId : state.nextId + 1,
    requests: active
      ? state.requests.map((r) => (r.id === active.id ? updated : r))
      : [...state.requests, updated],
  };
}
/** User-facing command: unchanged saved drafts may be submitted without retyping. */
export function saveOrSubmit(state, section, text, intent) {
  assertRole(state, ["petugas"]);
  assertSection(section);
  if (intent !== "save" && intent !== "submit")
    throw new Error("Tindakan formulir tidak dikenal.");
  if (typeof text !== "string" || !text.trim() || text.trim().length > 200)
    throw new Error("Isi perubahan wajib 1 sampai 200 karakter.");
  const active = currentRequest(state, section);
  if (active?.status === "diajukan")
    throw new Error("Pengajuan sedang diperiksa. Tunggu keputusan verifikator.");
  const unchangedDraft = active?.status === "draf" && active.value === text.trim();
  if (unchangedDraft) return intent === "submit" ? submitDraft(state, active.id) : state;
  const saved = saveDraft(state, section, text);
  if (intent === "save") return saved;
  const id = currentRequest(saved, section)?.id;
  if (id == null) throw new Error("Draf tidak ditemukan.");
  return submitDraft(saved, id);
}
export function submitDraft(state, id) {
  assertRole(state, ["petugas"]);
  const request = assertRequest(state, id);
  if (request.status !== "draf") throw new Error("Hanya draf yang bisa diajukan.");
  const version = request.version + 1;
  const next = {
    ...request, status: "diajukan", version,
    history: [...request.history, { action: "ajukan", actor: "Petugas Puskeswan", version }],
  };
  return { ...state, requests: state.requests.map((r) => (r.id === id ? next : r)) };
}
export function reviewRequest(state, id, decision, notes = "") {
  assertRole(state, ["verifikator_kab", "verifikator_prov"]);
  if (!DECISIONS.has(decision)) throw new Error("Keputusan verifikasi tidak dikenal.");
  if (typeof notes !== "string" || notes.trim().length > 300)
    throw new Error("Catatan terlalu panjang.");
  const request = assertRequest(state, id);
  if (request.status !== "diajukan") throw new Error("Pengajuan ini tidak lagi menunggu verifikasi.");
  if (decision !== "disetujui" && !notes.trim())
    throw new Error("Alasan wajib ditulis jika meminta perbaikan atau menolak.");
  const version = request.version + 1;
  const updated = {
    ...request, status: decision, version, note: notes.trim(),
    history: [...request.history, { action: decision, actor: state.role, version, note: notes.trim() }],
  };
  const updatedSections = decision === "disetujui"
    ? { ...state.sections, [request.section]: { value: request.value, verified: true, date: "2026-11-10" } }
    : state.sections;
  return {
    ...state,
    sections: updatedSections,
    requests: state.requests.map((r) => (r.id === id ? updated : r)),
  };
}
export function demoMetrics(state) {
  const list = allSections(state);
  return {
    total: list.length,
    verified: list.filter((s) => s.status === "terverifikasi").length,
    waiting: state.requests.filter((r) => r.status === "diajukan").length,
    corrections: state.requests.filter((r) => r.status === "perlu_perbaikan").length,
  };
}
export function validateDemo(state) {
  if (new Set(state.requests.map((r) => r.id)).size !== state.requests.length)
    throw new Error("ID pengajuan duplikat.");
  for (const request of state.requests) {
    assertSection(request.section);
    if (!STATES.has(request.status) || request.version < 1)
      throw new Error("Status/versi pengajuan tidak sah.");
  }
  return true;
}
