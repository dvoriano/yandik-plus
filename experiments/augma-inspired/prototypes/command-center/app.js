import {
  REGIONS, DISCLAIMER, summarize, pendingCount,
  reportingPercent, answerQuestion
} from "./core.mjs";

const $ = id => document.getElementById(id);
const fmt = value => value.toLocaleString("id-ID");
const svgNS = "http://www.w3.org/2000/svg";
let selectedId = REGIONS[0].id;

const total = summarize(REGIONS);
$("stat-regions").textContent = fmt(total.regions);
$("stat-sites").textContent = fmt(total.sites);
$("stat-reported").textContent = fmt(total.reported);
$("stat-rate").textContent = Math.round((total.reported / total.sites) * 100) + "% pelaporan (contoh)";
$("stat-pending").textContent = fmt(total.sites - total.reported);
$("stat-services").textContent = fmt(total.services);

function visibleRegions() {
  const search = $("search").value.trim().toLocaleLowerCase("id-ID");
  const onlyPending = $("only-pending").checked;
  return REGIONS.filter(r =>
    (!search || r.name.toLocaleLowerCase("id-ID").includes(search)) &&
    (!onlyPending || pendingCount(r) > 0)
  );
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
  return el;
}

function chooseRegion(id) {
  selectedId = id;
  render();
}

function renderPins(data) {
  const layer = $("pins");
  layer.replaceChildren();
  for (const region of data) {
    const pending = pendingCount(region) > 0;
    const g = svgEl("g", {
      class: "pin " + (pending ? "pending" : "complete") +
        (region.id === selectedId ? " selected" : ""),
      role: "button", tabindex: "0",
      "aria-label": region.name + ": " + pendingCount(region) + " unit belum melapor",
      "aria-pressed": String(region.id === selectedId),
      transform: "translate(" + region.x + " " + region.y + ")"
    });
    g.appendChild(svgEl("circle", { class: "halo", r: 22, cx: 0, cy: 0 }));
    g.appendChild(svgEl("circle", { class: "marker", r: 10, cx: 0, cy: 0 }));
    const label = svgEl("text", { x: 0, y: -29, "text-anchor": "middle" });
    label.textContent = region.name.replace("Kabupaten ", "Kab. ").replace("Kota ", "");
    g.appendChild(label);
    g.addEventListener("click", () => chooseRegion(region.id));
    g.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chooseRegion(region.id); }
    });
    layer.appendChild(g);
  }
}

function renderList(data) {
  const list = $("region-list");
  list.replaceChildren();
  if (!data.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Wilayah tidak ditemukan pada data contoh.";
    list.appendChild(empty);
    return;
  }
  for (const region of data) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "region-button";
    btn.setAttribute("aria-pressed", String(region.id === selectedId));
    const name = document.createElement("span");
    name.textContent = region.name;
    const status = document.createElement("span");
    status.textContent = reportingPercent(region) + "% lapor";
    btn.append(name, status);
    btn.addEventListener("click", () => chooseRegion(region.id));
    list.appendChild(btn);
  }
}

function renderDetail(region) {
  if (!region) {
    $("region-name").textContent = "Tidak ada hasil";
    $("region-description").textContent = "Ubah pencarian atau filter untuk menampilkan wilayah.";
    $("region-progress").style.width = "0%";
    for (const id of ["region-reported", "region-pending", "region-services"]) $(id).textContent = "—";
    return;
  }
  $("region-name").textContent = region.name;
  $("region-description").textContent = reportingPercent(region) +
    "% unit contoh melapor. Semua nilai di halaman ini fiktif.";
  $("region-progress").style.width = reportingPercent(region) + "%";
  $("region-reported").textContent = region.reported + " / " + region.sites;
  $("region-pending").textContent = fmt(pendingCount(region));
  $("region-services").textContent = fmt(region.services);
}

function render() {
  const data = visibleRegions();
  if (!data.some(r => r.id === selectedId)) selectedId = data.length ? data[0].id : null;
  renderPins(data);
  renderList(data);
  renderDetail(data.find(r => r.id === selectedId));
}

$("search").addEventListener("input", render);
$("only-pending").addEventListener("change", render);
$("question-form").addEventListener("submit", event => {
  event.preventDefault();
  $("answer").textContent = answerQuestion($("question").value);
});
for (const button of document.querySelectorAll("[data-question]")) {
  button.addEventListener("click", () => {
    const question = button.getAttribute("data-question");
    $("question").value = question;
    $("answer").textContent = answerQuestion(question);
  });
}
$("answer").setAttribute("title", DISCLAIMER);
render();
