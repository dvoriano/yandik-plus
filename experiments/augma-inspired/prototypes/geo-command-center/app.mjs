import { REGIONS, summarize, filterRegions, regionByCode, validateRegistry } from "./regions.mjs";
import { createProjection, geometryPaths, VIEW } from "./geometry.mjs";
import { validateBoundaryCollection } from "./boundary-loader.mjs";

const $ = id => document.getElementById(id);
const SVG_NS = "http://www.w3.org/2000/svg";
if (!validateRegistry()) throw Error("Registry wilayah demo tidak valid");

const totals = summarize();
$("count-all").textContent = totals.regions;
$("count-regency").textContent = totals.kabupaten;
$("count-city").textContent = totals.kota;

let kind = "all";
let selected = "13.71";
let projection = null;
let scale = 1;
let adm2 = null; // Only imported into this browser session, never uploaded.

function makeSvg(tag, props) {
  const n = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(props)) n.setAttribute(key, String(value));
  return n;
}

function getVisible() {
  return filterRegions(REGIONS, $("search").value, kind);
}

function choose(code, keyboardOrigin = null) {
  selected = code;
  renderList();
  renderPins();
  renderAdm2();
  renderDetails();
  // Rendering replaces DOM nodes. Preserve the keyboard focus location
  // when activation originated from Enter or Space.
  if (keyboardOrigin) {
    const container = keyboardOrigin === "list" ? $("region-list")
      : keyboardOrigin === "pin" ? $("map-pins") : $("map-adm2");
    const current = [...container.querySelectorAll("[data-code]")]
      .find(element => element.getAttribute("data-code") === code);
    current?.focus();
  }
}

function renderDetails() {
  const r = regionByCode(selected);
  $("selected-name").textContent = r?.name ?? "Tidak ada wilayah dipilih";
  $("selected-code").textContent = r?.code ?? "—";
  $("selected-seat").textContent = r
    ? "Penanda perkiraan sekitar " + r.seat + "; bukan lokasi fasilitas atau pusat geometri resmi."
    : "Ubah pencarian untuk menampilkan wilayah.";
}

function renderList() {
  const target = $("region-list");
  target.replaceChildren();
  const visible = getVisible();
  if (!visible.length) {
    const note = document.createElement("p");
    note.className = "empty";
    note.textContent = "Tidak ada wilayah cocok dengan filter.";
    target.append(note);
    return;
  }
  for (const r of visible) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "region-row";
    button.dataset.code = r.code;
    button.setAttribute("aria-pressed", String(selected === r.code));
    const labels = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = r.name;
    const seat = document.createElement("small");
    seat.textContent = "Sekitar " + r.seat + " · kode " + r.code;
    labels.append(name, seat);
    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = "›";
    button.append(labels, arrow);
    button.addEventListener("click", event => choose(r.code, event.detail === 0 ? "list" : null));
    target.append(button);
  }
}

function renderPins() {
  const target = $("map-pins");
  target.replaceChildren();
  if (!projection) return;
  const visible = getVisible();
  for (const r of visible) {
    const [x, y] = projection.project([r.lon, r.lat]);
    const g = makeSvg("g", {
      class: "pin" + (selected === r.code ? " selected" : ""),
      transform: "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ")",
      role: "button", tabindex: 0, "data-code": r.code,
      "aria-label": r.name + ": pilih wilayah indikatif",
      "aria-pressed": String(selected === r.code)
    });
    const title = makeSvg("title", {});
    title.textContent = r.name + " (perkiraan sekitar " + r.seat + ")";
    g.append(title);
    g.append(makeSvg("circle", { class: "halo", cx: 0, cy: 0, r: 14 }));
    g.append(makeSvg("circle", { class: "dot", cx: 0, cy: 0, r: 6.5 }));
    if (selected === r.code) {
      const label = makeSvg("text", { x: 12, y: -17, "text-anchor": "start" });
      label.textContent = r.name;
      g.append(label);
    }
    g.addEventListener("click", () => choose(r.code));
    g.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(r.code, "pin"); }
    });
    target.append(g);
  }
}

function applyZoom() {
  const width = VIEW.width / scale;
  const height = VIEW.height / scale;
  $("map-svg").setAttribute("viewBox",
    [ (VIEW.width - width) / 2, (VIEW.height - height) / 2, width, height ].map(v => v.toFixed(2)).join(" "));
  $("zoom-in").disabled = scale >= 2;
  $("zoom-out").disabled = scale <= 1;
}

function refresh() {
  const filtered = getVisible();
  if (!filtered.some(r => r.code === selected)) selected = filtered[0]?.code ?? null;
  renderList();
  renderDetails();
  renderPins();
}

async function initializeMap() {
  try {
    const response = await fetch("./data/sumbar-outline.geojson", { cache: "no-store" });
    if (!response.ok) throw Error("HTTP " + response.status);
    const geo = await response.json();
    projection = createProjection(geo);
    const layer = $("map-boundary");
    for (const feature of geo.features) {
      for (const pathString of geometryPaths(feature.geometry, projection.project)) {
        layer.append(makeSvg("path", { d: pathString, "fill-rule": "evenodd" }));
      }
    }
    $("map-status").textContent = "Geometri provinsi lokal terbaca. Pilih titik wilayah.";
    renderAdm2();
    refresh();
  } catch (error) {
    $("map-status").textContent = "Peta gagal dimuat: " + String(error.message) +
      ". Daftar wilayah tetap dapat dibaca.";
  }
}

function renderAdm2() {
  const layer = $("map-adm2");
  layer.replaceChildren();
  if (!adm2 || !projection) return;
  for (const feature of adm2.features) {
    const code = feature.properties.code;
    const region = regionByCode(code);
    for (const pathString of geometryPaths(feature.geometry, projection.project)) {
      const path = makeSvg("path", {
        d: pathString, "fill-rule": "evenodd",
        class: "adm2-area" + (selected === code ? " selected" : ""),
        role: "button", tabindex: "0", "data-code": code,
        "aria-label": "Tinjau batas demo " + region.name,
        "aria-pressed": String(selected === code)
      });
      const title = makeSvg("title", {});
      title.textContent = region.name + " · geometri yang diimpor, belum diverifikasi resmi";
      path.append(title);
      path.addEventListener("click", () => choose(code));
      path.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose(code, "adm2");
        }
      });
      layer.append(path);
    }
  }
}

function setBoundaryStatus(message, error = false) {
  $("boundary-status").textContent = message;
  $("boundary-status").dataset.state = error ? "error" : "ready";
}

async function importBoundaryFile(file) {
  if (!file) return;
  if (!$("license-confirmation").checked) {
    setBoundaryStatus("Konfirmasi dulu bahwa Anda berhak menggunakan dataset tersebut.", true);
    $("boundary-file").value = "";
    return;
  }
  try {
    if (file.size > 8_000_000) throw Error("File melebihi batas 8 MB");
    const data = JSON.parse(await file.text());
    const verifiedStructure = validateBoundaryCollection(data);
    adm2 = verifiedStructure;
    setBoundaryStatus(
      "19/19 poligon lolos validasi TEKNIS (" +
      verifiedStructure.metadata.pointCount.toLocaleString("id-ID") +
      " titik). Akurasi geografi dan hak pakai belum diverifikasi otomatis."
    );
    renderAdm2();
  } catch (error) {
    adm2 = null;
    setBoundaryStatus("Impor ditolak: " + String(error.message), true);
    renderAdm2();
  }
  $("boundary-file").value = "";
}

$("boundary-file").addEventListener("change", event => {
  void importBoundaryFile(event.target.files?.[0]);
});
$("clear-boundary").addEventListener("click", () => {
  adm2 = null;
  $("boundary-file").value = "";
  setBoundaryStatus("Belum ada data batas kabupaten/kota yang diimpor.");
  renderAdm2();
});

$("search").addEventListener("input", refresh);
for (const button of document.querySelectorAll("[data-kind]")) {
  button.addEventListener("click", () => {
    kind = button.dataset.kind;
    for (const b of document.querySelectorAll("[data-kind]")) {
      b.setAttribute("aria-pressed", String(b === button));
    }
    refresh();
  });
}
$("zoom-in").addEventListener("click", () => { scale = Math.min(2, Math.round((scale + 0.2) * 10) / 10); applyZoom(); });
$("zoom-out").addEventListener("click", () => { scale = Math.max(1, Math.round((scale - 0.2) * 10) / 10); applyZoom(); });
$("zoom-reset").addEventListener("click", () => { scale = 1; applyZoom(); });
renderList();
renderDetails();
applyZoom();
initializeMap();
