import {
  SECTION_DEFS, startDemo, useRole, allSections, pendingQueue,
  saveOrSubmit, reviewRequest, demoMetrics,
} from "./model.mjs";
import {
  PROBLEM_CATEGORIES, PROBLEM_STATUS, visibleProblems, saveProblem,
  reviewProblem, followUpProblem, problemCounts,
} from "./problems.mjs";
import { DEMO_APEL_PERIODS, sourceSummary } from "./source_snapshots.mjs";

let state = startDemo();
let editing = null;
let reviewing = null;
let editingProblem = null;
let reviewingProblem = null;

const $ = (id) => document.getElementById(id);
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
const STATUS_LABEL = {
  belum_lengkap: ["Belum lengkap", "muted"],
  perlu_verifikasi: ["Perlu verifikasi", "warn"],
  draf: ["Draf tersimpan", "muted"],
  diajukan: ["Menunggu verifikasi", "wait"],
  perlu_perbaikan: ["Perlu perbaikan", "warn"],
  terverifikasi: ["Terverifikasi", "ok"],
};
function showNotice(message, error = false) {
  const node = $("notice");
  node.hidden = false;
  node.className = error ? "notice error" : "notice";
  node.textContent = message;
}
function statusNode(status) {
  const [label, modifier] = STATUS_LABEL[status] ?? ["Status tidak dikenal", "warn"];
  return element("span", "status " + modifier, label);
}
function sectionById(id) {
  return SECTION_DEFS.find((s) => s.id === id);
}
function clear(node) {
  node.replaceChildren();
}
function makeButton(text, onClick, disabled = false) {
  const button = element("button", "", text);
  button.type = "button";
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

function renderProfileCards() {
  const list = $("section-cards");
  clear(list);
  for (const section of allSections(state)) {
    const card = element("article", "card");
    card.dataset.section = section.id;
    const top = element("div", "card-top");
    const description = element("div");
    description.append(
      element("h3", "", section.label),
      element("p", "muted", section.hint)
    );
    top.append(description, statusNode(section.status));
    card.append(top);
    const content = element("div", "current");
    const summary = section.request?.status === "diajukan"
      ? "Perubahan sudah dikirim. Menunggu pemeriksaan."
      : section.request?.status === "perlu_perbaikan"
      ? "Ada catatan perbaikan dari verifikator."
      : section.value ?? "Belum ada data yang tercatat.";
    content.append(element("p", "", summary));
    if (section.request?.status === "perlu_perbaikan" && section.request.note) {
      content.append(element("p", "small muted", "Catatan: " + section.request.note));
    }
    card.append(content);
    const bottom = element("div", "detail");
    bottom.append(element("span", "", section.latestDate
      ? "Pembaruan data: " + section.latestDate : "Belum ada tanggal pembaruan"));
    const label = section.request?.status === "perlu_perbaikan"
      ? "Perbaiki data" : section.request?.status === "draf"
      ? "Lanjutkan draf" : section.request?.status === "diajukan"
      ? "Sedang diperiksa" : "Perbarui";
    const button = makeButton(label, () => openEditor(section.id), !section.canEdit);
    button.setAttribute("aria-label", label + " " + section.label);
    bottom.append(button);
    card.append(bottom);
    list.append(card);
  }
}
function renderQueue() {
  const list = $("review-list");
  clear(list);
  const requests = pendingQueue(state);
  if (!requests.length) {
    const empty = element("div", "card");
    empty.append(element("h3", "", "Tidak ada pengajuan menunggu"), element("p", "muted", "Semua pengajuan contoh sudah diperiksa."));
    list.append(empty);
    return;
  }
  for (const request of requests) {
    const section = sectionById(request.section);
    const card = element("article", "card");
    card.dataset.section = request.section;
    const top = element("div", "card-top");
    top.append(element("h3", "", section?.label ?? "Bagian profil"), statusNode(request.status));
    card.append(top, element("p", "current", request.value));
    const details = element("div", "detail");
    details.append(element("span", "", "Pengajuan DEMO #" + request.id));
    details.append(makeButton("Periksa pengajuan", () => openReview(request.id)));
    card.append(details);
    list.append(card);
  }
}

const PROBLEM_CLASS = {
  draf: "muted", diajukan: "wait", perlu_perbaikan: "warn",
  tercatat: "ok", ditindaklanjuti: "wait", selesai: "ok", ditolak: "warn",
};
function problemStatusNode(status) {
  return element("span", "status " + (PROBLEM_CLASS[status] ?? "warn"),
    PROBLEM_STATUS[status] ?? "Status tidak dikenal");
}
function problemCategoryLabel(id) {
  return PROBLEM_CATEGORIES.find((category) => category.id === id)?.label ?? "Lainnya";
}
function renderSourceReadOnly() {
  const record = sourceSummary(state.facility.id, $("apel-period").value);
  const sdm = $("source-sdm");
  const apel = $("source-apel");
  clear(sdm);
  clear(apel);
  if (record.sdm.status !== "tersedia") {
    sdm.append(element("p", "muted", "Data SDM belum tersedia."));
  } else {
    sdm.append(
      element("p", "readout", "Dokter hewan: " + record.sdm.dokter_hewan),
      element("p", "readout", "Paramedik: " + record.sdm.paramedik),
      element("p", "small muted", "Per tanggal " + record.sdm.observed_on),
    );
  }
  sdm.append(element("p", "small muted", "Sumber: " + record.sdm.source + " · Baca-saja"));
  if (record.apel.status === "belum_melapor") {
    apel.append(element("p", "muted", "Belum ada laporan untuk periode ini. Bukan angka nol."));
  } else {
    const labels = {
      pemeriksaan: "Pemeriksaan", pengobatan: "Pengobatan", vaksinasi: "Vaksinasi",
      investigasi: "Investigasi", penyuluhan: "Penyuluhan",
    };
    const list = element("ul", "service-list");
    for (const [category, count] of Object.entries(record.apel.kategori)) {
      const li = element("li");
      li.append(element("span", "", labels[category] ?? category),
        element("strong", "", String(count)));
      list.append(li);
    }
    apel.append(element("p", "small source-note", "Laporan sudah masuk. Nilai 0 tetap sah."), list);
  }
  apel.append(element("p", "small muted",
    "Sumber: " + record.apel.source + " · Baca-saja; tidak dihitung menjadi total resmi"));
}
function renderProblems() {
  const list = $("problem-list");
  clear(list);
  const actor = state.role;
  const problems = visibleProblems(state);
  const counts = problemCounts(state);
  $("problem-counter").textContent = actor === "petugas"
    ? counts.total + " permasalahan tercatat" : counts.waiting + " menunggu pemeriksaan";
  if (problems.length === 0) {
    const empty = element("div", "card");
    empty.append(element("h3", "", actor === "petugas" ? "Belum ada permasalahan" : "Tidak ada permasalahan yang dapat diperiksa"),
      element("p", "muted", "Catatan masalah dalam prototype akan muncul di sini."));
    list.append(empty);
    return;
  }
  for (const problem of problems) {
    const card = element("article", "card problem-card");
    card.dataset.problemId = String(problem.id);
    const top = element("div", "card-top");
    const group = element("div");
    group.append(element("h3", "", problem.title),
      element("p", "muted", problemCategoryLabel(problem.category)));
    top.append(group, problemStatusNode(problem.status));
    card.append(top, element("p", "current", problem.description));
    if (problem.note && ["perlu_perbaikan", "ditolak", "ditindaklanjuti", "selesai"].includes(problem.status))
      card.append(element("p", "small muted", "Catatan terakhir: " + problem.note));
    const bottom = element("div", "detail");
    bottom.append(element("span", "", "Masalah DEMO #" + problem.id + " · Revisi " + problem.version));
    if (actor === "petugas" && ["draf", "perlu_perbaikan"].includes(problem.status)) {
      const btn = makeButton(problem.status === "draf" ? "Lanjutkan draf" : "Perbaiki masalah",
        () => openProblemEditor(problem.id));
      btn.setAttribute("aria-label", btn.textContent + " #" + problem.id);
      bottom.append(btn);
    } else if (["verifikator_kab", "verifikator_prov"].includes(actor)
      && ["diajukan", "tercatat", "ditindaklanjuti"].includes(problem.status)) {
      const btn = makeButton(problem.status === "diajukan" ? "Verifikasi masalah" : "Catat tindak lanjut",
        () => openProblemReview(problem.id));
      btn.setAttribute("aria-label", btn.textContent + " #" + problem.id);
      bottom.append(btn);
    }
    card.append(bottom);
    list.append(card);
  }
}
function fillProblemEditor(problemId) {
  const p = state.problems.find((item) => item.id === problemId);
  $("problem-category").value = p?.category ?? "peralatan";
  $("problem-title").value = p?.title ?? "";
  $("problem-description").value = p?.description ?? "";
  $("problem-editor-title").textContent = p ? "Perbarui permasalahan" : "Catat permasalahan baru";
}
function openProblemEditor(problemId = null) {
  if (state.role !== "petugas") return;
  editingProblem = problemId;
  fillProblemEditor(problemId);
  $("problem-form-panel").hidden = false;
  $("problem-form-panel").scrollIntoView({ block: "nearest" });
  $("problem-title").focus();
}
function closeProblemEditor() {
  editingProblem = null;
  $("problem-form-panel").hidden = true;
}
function openProblemReview(problemId) {
  if (!["verifikator_kab", "verifikator_prov"].includes(state.role)) return;
  const problem = visibleProblems(state).find((p) => p.id === problemId);
  if (!problem) return;
  reviewingProblem = problemId;
  $("problem-review-context").textContent = problemCategoryLabel(problem.category) +
    ": " + problem.title + ". Status saat ini: " + PROBLEM_STATUS[problem.status];
  $("problem-review-notes").value = "";
  const pending = problem.status === "diajukan";
  $("problem-review-correction").hidden = !pending;
  $("problem-review-reject").hidden = !pending;
  $("problem-review-accept").hidden = !pending;
  $("problem-followup").hidden = problem.status !== "tercatat";
  $("problem-close").hidden = problem.status !== "ditindaklanjuti";
  $("problem-review-panel").hidden = false;
  $("problem-review-panel").scrollIntoView({ block: "nearest" });
  $("problem-review-notes").focus();
}
function closeProblemReview() {
  reviewingProblem = null;
  $("problem-review-panel").hidden = true;
}

function render() {
  const actor = state.role;
  const isVerifier = actor === "verifikator_kab" || actor === "verifikator_prov";
  const isLeader = actor === "pimpinan";
  $("facility-card").hidden = isLeader;
  $("overview").hidden = isLeader;
  $("profile-panel").hidden = isVerifier || isLeader;
  $("review-panel").hidden = !isVerifier;
  $("leader-panel").hidden = !isLeader;
  $("linked-panel").hidden = actor !== "petugas";
  $("problems-panel").hidden = isLeader;
  $("add-problem").hidden = actor !== "petugas";
  if (actor === "petugas") renderSourceReadOnly();
  else {
    clear($("source-sdm"));
    clear($("source-apel"));
  }
  if (!isLeader) renderProblems();
  else clear($("problem-list"));
  $("page-title").textContent = isVerifier ? "Verifikasi Profil" : isLeader ? "Ringkasan Profil" : "Profil Saya";
  $("page-subtitle").textContent = isVerifier
    ? "Periksa pengajuan dan berikan alasan jika memerlukan perbaikan."
    : isLeader ? "Lihat ringkasan contoh tanpa mengubah data individu."
    : "Perbarui hanya bagian yang berubah. Data lainnya tetap tersimpan.";
  const metrics = demoMetrics(state);
  $("metric-verified").textContent = metrics.verified + "/" + metrics.total;
  $("metric-waiting").textContent = String(metrics.waiting);
  $("metric-corrections").textContent = String(metrics.corrections);
  // Never render individual fields into the leader's demo view.
  if (isVerifier) {
    clear($("section-cards"));
    renderQueue();
  } else if (isLeader) {
    clear($("section-cards"));
    clear($("review-list"));
    closeEditor();
    closeReview();
    closeProblemEditor();
    closeProblemReview();
  } else {
    clear($("review-list"));
    renderProfileCards();
  }
}

function openEditor(section) {
  const card = allSections(state).find((s) => s.id === section);
  if (!card?.canEdit) return;
  editing = section;
  const def = sectionById(section);
  $("editor-title").textContent = "Perbarui " + def.label;
  $("editor-hint").textContent = def.hint;
  $("profile-value-label").textContent = def.prompt;
  $("profile-value").value = card.request?.value ?? card.value ?? "";
  $("editor-panel").hidden = false;
  $("editor-panel").scrollIntoView({ block: "nearest" });
  $("profile-value").focus();
}
function closeEditor() {
  editing = null;
  $("editor-panel").hidden = true;
}
function openReview(id) {
  const request = pendingQueue(state).find((r) => r.id === id);
  if (!request) return;
  reviewing = id;
  $("review-context").textContent = "Bagian: " + (sectionById(request.section)?.label ?? "Profil") + " · Nilai diajukan: " + request.value;
  $("review-notes").value = "";
  $("review-editor").hidden = false;
  $("review-editor").scrollIntoView({ block: "nearest" });
  $("review-notes").focus();
}
function closeReview() {
  reviewing = null;
  $("review-editor").hidden = true;
}

$("role").addEventListener("change", (event) => {
  state = useRole(state, event.target.value);
  closeEditor();
  closeReview();
  closeProblemEditor();
  closeProblemReview();
  $("notice").hidden = true;
  render();
});
$("cancel-editor").addEventListener("click", closeEditor);
$("cancel-review").addEventListener("click", closeReview);
$("profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!editing) return;
  const intent = event.submitter?.value ?? "save";
  try {
    const result = saveOrSubmit(state, editing, $("profile-value").value, intent);
    const unchanged = result === state;
    state = result;
    showNotice(intent === "submit"
      ? "Pengajuan berhasil dicatat dalam simulasi dan siap diperiksa."
      : unchanged ? "Draf sudah tersimpan. Tidak ada perubahan baru."
      : "Draf tersimpan selama halaman simulasi masih terbuka.");
    closeEditor();
    render();
  } catch (error) {
    showNotice(error.message, true);
  }
});
$("review-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (reviewing == null) return;
  try {
    const decision = event.submitter?.value;
    state = reviewRequest(state, reviewing, decision, $("review-notes").value);
    closeReview();
    render();
    showNotice("Keputusan verifikator tersimpan dalam simulasi. Tidak ada data produksi yang berubah.");
  } catch (error) {
    showNotice(error.message, true);
  }
});


$("apel-period").addEventListener("change", () => {
  if (state.role === "petugas") renderSourceReadOnly();
});
$("add-problem").addEventListener("click", () => openProblemEditor());
$("cancel-problem").addEventListener("click", closeProblemEditor);
$("cancel-problem-review").addEventListener("click", closeProblemReview);
$("problem-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.role !== "petugas") return;
  try {
    const intent = event.submitter?.value ?? "save";
    state = saveProblem(state, {
      category: $("problem-category").value,
      title: $("problem-title").value,
      description: $("problem-description").value,
    }, intent, editingProblem);
    closeProblemEditor();
    render();
    showNotice(intent === "submit"
      ? "Permasalahan berhasil diajukan dalam simulasi. Ini bukan permohonan bantuan."
      : "Draf permasalahan tersimpan hanya dalam simulasi browser.");
  } catch (error) {
    showNotice(error.message, true);
  }
});
$("problem-review-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (reviewingProblem == null) return;
  try {
    const decision = event.submitter?.value;
    const note = $("problem-review-notes").value;
    state = ["ditindaklanjuti", "selesai"].includes(decision)
      ? followUpProblem(state, reviewingProblem, decision, note)
      : reviewProblem(state, reviewingProblem, decision, note);
    closeProblemReview();
    render();
    showNotice("Status masalah dicatat dalam simulasi. Tidak ada alokasi bantuan atau persetujuan anggaran.");
  } catch (error) {
    showNotice(error.message, true);
  }
});
for (const period of DEMO_APEL_PERIODS) {
  const option = element("option", "", period.label);
  option.value = period.value;
  $("apel-period").append(option);
}
$("apel-period").value = "2026-10";
for (const cat of PROBLEM_CATEGORIES) {
  const option = element("option", "", cat.label);
  option.value = cat.id;
  $("problem-category").append(option);
}

$("role").value = state.role;
$("facility-title").textContent = state.facility.name;
$("facility-area").textContent = state.facility.region + " · " + state.facility.id;
render();
