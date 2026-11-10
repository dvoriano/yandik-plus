import {
  SECTION_DEFS, startDemo, useRole, allSections, pendingQueue,
  saveOrSubmit, reviewRequest, demoMetrics,
} from "./model.mjs";

let state = startDemo();
let editing = null;
let reviewing = null;

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
function render() {
  const actor = state.role;
  const isVerifier = actor === "verifikator_kab" || actor === "verifikator_prov";
  const isLeader = actor === "pimpinan";
  $("facility-card").hidden = isLeader;
  $("overview").hidden = isLeader;
  $("profile-panel").hidden = isVerifier || isLeader;
  $("review-panel").hidden = !isVerifier;
  $("leader-panel").hidden = !isLeader;
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

$("role").value = state.role;
$("facility-title").textContent = state.facility.name;
$("facility-area").textContent = state.facility.region + " · " + state.facility.id;
render();
