/** M02-S4 synthetic problem registry. Not an official complaint/aid approval system.
 * All state lives only in one browser tab. Role switch is a demo control.
 */
export const PROBLEM_CATEGORIES = Object.freeze([
  { id: "sdm", label: "SDM" },
  { id: "bangunan", label: "Bangunan" },
  { id: "peralatan", label: "Peralatan klinik" },
  { id: "obat_bhp", label: "Obat dan BHP" },
  { id: "pelayanan", label: "Pelayanan" },
  { id: "lainnya", label: "Lainnya" },
]);
export const PROBLEM_STATUS = Object.freeze({
  draf: "Draf",
  diajukan: "Menunggu verifikasi",
  perlu_perbaikan: "Perlu perbaikan",
  tercatat: "Terverifikasi, belum ditindaklanjuti",
  ditindaklanjuti: "Sedang ditindaklanjuti",
  selesai: "Selesai dicatat",
  ditolak: "Ditolak",
});
const PROBLEM_STATES = new Set(Object.keys(PROBLEM_STATUS));
const REVIEW_DECISIONS = new Set(["tercatat", "perlu_perbaikan", "ditolak"]);
const REVIEWER_ROLES = ["verifikator_kab", "verifikator_prov"];

function checkText(value, label, min, max) {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max)
    throw new Error(label + " wajib " + min + " sampai " + max + " karakter.");
  return value.trim();
}
function checkCategory(category) {
  if (!PROBLEM_CATEGORIES.some((x) => x.id === category))
    throw new Error("Kategori permasalahan tidak dikenal.");
}
function requireRole(state, allowed) {
  if (!allowed.includes(state.role))
    throw new Error("Peran simulasi tidak diizinkan untuk tindakan ini.");
}
function findProblem(state, id) {
  const problem = state.problems.find((p) => p.id === id);
  if (!problem) throw new Error("Permasalahan tidak ditemukan.");
  if (problem.puskeswan_id !== state.facility.id || problem.kab_kota !== state.facility.region)
    throw new Error("Permasalahan di luar cakupan Puskeswan simulasi.");
  return problem;
}
function updated(state, problem) {
  return { ...state, problems: state.problems.map((p) => p.id === problem.id ? problem : p) };
}
function history(problem, action, role, reason = "") {
  return [...problem.history, {
    action, actor: role, version: problem.version + 1, note: reason.trim(),
  }];
}
export function visibleProblems(state) {
  if (state.role === "pimpinan") return [];
  if (state.role === "petugas") return state.problems.filter(
    (p) => p.puskeswan_id === state.facility.id && p.kab_kota === state.facility.region
  );
  if (REVIEWER_ROLES.includes(state.role)) return state.problems.filter(
    (p) => p.puskeswan_id === state.facility.id && p.kab_kota === state.facility.region
      && p.status !== "draf"
  );
  return [];
}
export function saveProblem(state, fields, intent, problemId = null) {
  requireRole(state, ["petugas"]);
  if (intent !== "save" && intent !== "submit")
    throw new Error("Tindakan masalah tidak dikenal.");
  if (!fields || typeof fields !== "object")
    throw new Error("Isian permasalahan tidak sah.");
  checkCategory(fields.category);
  const title = checkText(fields.title, "Judul permasalahan", 5, 100);
  const description = checkText(fields.description, "Keterangan masalah", 10, 500);
  let problem, base;
  if (problemId === null) {
    problem = {
      id: state.nextProblemId, puskeswan_id: state.facility.id,
      kab_kota: state.facility.region, category: fields.category,
      title, description, status: "draf", version: 1, note: "",
      history: [{ action: "simpan_draf", actor: "petugas", version: 1, note: "" }],
    };
    base = {
      ...state,
      nextProblemId: state.nextProblemId + 1,
      problems: [...state.problems, problem],
    };
  } else {
    const current = findProblem(state, problemId);
    if (!["draf", "perlu_perbaikan"].includes(current.status))
      throw new Error("Masalah yang telah diajukan tidak dapat diedit.");
    const unchanged = current.category === fields.category &&
      current.title === title && current.description === description;
    if (unchanged && current.status === "draf") {
      if (intent === "save") return state;
      return submitProblem(state, current.id);
    }
    problem = {
      ...current, category: fields.category, title, description,
      status: "draf", version: current.version + 1,
      history: history(current, "simpan_draf", "petugas"),
    };
    base = updated(state, problem);
  }
  return intent === "submit" ? submitProblem(base, problem.id) : base;
}
export function submitProblem(state, problemId) {
  requireRole(state, ["petugas"]);
  const p = findProblem(state, problemId);
  if (p.status !== "draf")
    throw new Error("Hanya draf permasalahan yang dapat diajukan.");
  return updated(state, {
    ...p, status: "diajukan", version: p.version + 1,
    history: history(p, "ajukan", "petugas"),
  });
}
export function reviewProblem(state, problemId, decision, note = "") {
  requireRole(state, REVIEWER_ROLES);
  const p = findProblem(state, problemId);
  if (p.status !== "diajukan")
    throw new Error("Permasalahan tidak sedang menunggu verifikasi.");
  if (!REVIEW_DECISIONS.has(decision))
    throw new Error("Keputusan verifikasi tidak dikenal.");
  if (typeof note !== "string" || note.length > 300)
    throw new Error("Catatan tidak sah.");
  if (decision !== "tercatat" && !note.trim())
    throw new Error("Alasan wajib untuk penolakan atau permintaan perbaikan.");
  return updated(state, {
    ...p, status: decision, note: note.trim(), version: p.version + 1,
    history: history(p, decision, state.role, note),
  });
}
export function followUpProblem(state, problemId, decision, note) {
  requireRole(state, REVIEWER_ROLES);
  const p = findProblem(state, problemId);
  if (!["ditindaklanjuti", "selesai"].includes(decision))
    throw new Error("Tindak lanjut tidak dikenal.");
  if (p.status === "tercatat" && decision !== "ditindaklanjuti")
    throw new Error("Masalah perlu dicatat tindak lanjutnya terlebih dahulu.");
  if (p.status !== "tercatat" && !(p.status === "ditindaklanjuti" && decision === "selesai"))
    throw new Error("Status tidak mengizinkan tindak lanjut berikutnya.");
  const reason = checkText(note, "Catatan tindak lanjut", 5, 300);
  return updated(state, {
    ...p, status: decision, note: reason, version: p.version + 1,
    history: history(p, decision, state.role, reason),
  });
}
export function problemCounts(state) {
  const list = visibleProblems(state);
  return {
    total: list.length,
    waiting: list.filter((p) => p.status === "diajukan").length,
    corrections: list.filter((p) => p.status === "perlu_perbaikan").length,
    unresolved: list.filter((p) => !["selesai", "ditolak"].includes(p.status)).length,
  };
}
export function validateProblems(state) {
  if (!Array.isArray(state.problems)) throw new Error("Daftar permasalahan tidak sah.");
  const ids = new Set();
  for (const p of state.problems) {
    if (!Number.isSafeInteger(p.id) || p.id < 1 || ids.has(p.id)) throw new Error("ID masalah duplikat/tidak sah.");
    ids.add(p.id);
    if (!PROBLEM_STATES.has(p.status) || !PROBLEM_CATEGORIES.some((c) => c.id === p.category))
      throw new Error("Status/kategori masalah tidak sah.");
    if (p.version < 1 || !Array.isArray(p.history) || p.history.length !== p.version)
      throw new Error("Histori masalah tidak konsisten.");
  }
  return true;
}
