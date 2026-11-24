import { buildDemoDashboardFixture } from "../m05-apel-dashboard-ui/fixtures.mjs";
import { buildDemoDashboard } from "../m05-apel-dashboard-ui/model.mjs";
import { buildDemoFollowupContexts } from "../m05-followup-review/fixtures.mjs";
import { buildDemoFollowupBoard } from "../m05-followup-review/followup.mjs";
import { buildDemoProfileSdmFixture } from "../m05-profile-sdm/fixtures.mjs";
import { buildProfileSdmView } from "../m05-profile-sdm/model.mjs";

const byId = (id) => document.getElementById(id);
const number = new Intl.NumberFormat("id-ID");
const formatNumber = (value) => value === null ? "—" : number.format(value);
const periodFormat = new Intl.DateTimeFormat("id-ID", {
  month: "long", year: "numeric", timeZone: "UTC",
});
const profileLabels = {
  NOT_AVAILABLE_DEMO: ["Belum tersedia", "missing"],
  DRAFT_DEMO: ["Draf", "partial"],
  REVIEW_PENDING_DEMO: ["Menunggu telaah", "partial"],
  RECORDED_DEMO: ["Tercatat", "complete"],
};
const staffLabels = {
  NOT_AVAILABLE_DEMO: ["Belum tersedia", "missing"],
  PARTIAL_DEMO: ["Sebagian", "partial"],
  COMPLETE_DEMO: ["Lengkap", "complete"],
};
const roleLabels = {
  PENGELOLA_PELAPORAN: "Pengelola pelaporan",
  PENDAMPING_PUSKESWAN: "Pendamping Puskeswan",
  PENGELOLA_PROFIL: "Pengelola profil",
  PENGELOLA_SDM: "Pengelola SDM",
};

function element(tag, className, value) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (value !== undefined) item.textContent = value;
  return item;
}

function setOptions(select, options, preferred) {
  select.replaceChildren(...options.map(([value, label]) => new Option(label, value)));
  if (options.some(([value]) => String(value) === String(preferred))) {
    select.value = preferred;
  }
}

function renderMetrics(dashboard, profile) {
  const summary = dashboard.summary;
  const { profile_available_demo: profiles, sdm_complete_demo: complete } = profile.summary;
  const metrics = [
    ["Pelayanan tercatat", formatNumber(summary.observed_demo_events),
      summary.reported_facility_months ? "Akumulasi dari laporan yang tersedia" : "Belum ada laporan"],
    ["Entri APEL terlapor", summary.reported_facility_months,
      "Dari " + summary.expected_facility_months + " entri Puskeswan-bulan"],
    ["Profil tersedia", profiles, "Dari " + summary.facility_count + " Puskeswan"],
    ["Cakupan SDM lengkap", complete, "Dari " + summary.facility_count + " Puskeswan"],
  ];
  byId("metrics").replaceChildren(...metrics.map(([title, value, note]) => {
    const article = element("article", "metric");
    article.append(element("h2", "", title), element("strong", "", value), element("p", "", note));
    return article;
  }));
}

function renderTrend(dashboard) {
  const months = dashboard.months;
  const maximum = Math.max(1, ...months.map((month) => month.observed_demo_events ?? 0));
  byId("trend-empty").hidden = dashboard.summary.reported_facility_months > 0;
  byId("months").replaceChildren(...months.map((month) => {
    const value = month.observed_demo_events;
    const illustratedValue = formatNumber(value);
    const slot = element("li", "month");
    const track = element("div", "bar-track");
    const state = value === null ? "missing" : value === 0 ? "zero" : "reported";
    const bar = element("div", "bar " + state);
    if (value > 0) bar.style.height = Math.max(4, value / maximum * 100) + "%";
    track.setAttribute("aria-hidden", "true");
    track.append(bar);
    const visibleValue = element("span", "bar-value", illustratedValue);
    visibleValue.setAttribute("aria-hidden", "true");
    const spokenValue = value === null ? "belum ada laporan" :
      value === 0 ? "laporan nol" : illustratedValue + " layanan";
    slot.append(
      visibleValue, track, element("span", "month-label", month.label),
      element("span", "sr-only", spokenValue),
    );
    return slot;
  }));
}

function renderCoverage(summary) {
  const statuses = [
    ["Ada pelayanan", summary.reported_facility_months - summary.explicit_zero_reports, "reported"],
    ["Laporan nol", summary.explicit_zero_reports, "zero"],
    ["Belum melapor", summary.missing_facility_months, "missing"],
  ];
  const track = byId("coverage-track");
  const list = byId("coverage-list");
  track.replaceChildren();
  list.replaceChildren();
  for (const [label, count, state] of statuses) {
    if (count) {
      const segment = element("span", state);
      segment.style.flexGrow = count;
      track.append(segment);
    }
    const row = element("div", "coverage-row " + state);
    row.append(element("dt", "", label), element("dd", "", number.format(count)));
    list.append(row);
  }
}

function renderProfiles(profile) {
  byId("profiles").replaceChildren(...profile.rows.map((row) => {
    const tr = element("tr");
    const facility = element("th");
    facility.scope = "row";
    facility.append(
      element("strong", "", row.facility_label),
      element("small", "", row.region_label),
    );
    const profileStatus = element("td");
    const staffStatus = element("td");
    const [profileLabel, profileClass] = profileLabels[row.profile_state];
    const [staffLabel, staffClass] = staffLabels[row.sdm_coverage];
    profileStatus.append(element("span", "status " + profileClass, profileLabel));
    staffStatus.append(element("span", "status " + staffClass, staffLabel));
    tr.append(
      facility, profileStatus, staffStatus,
      element("td", "numeric", formatNumber(row.doctors)),
      element("td", "numeric", formatNumber(row.paramedics)),
    );
    return tr;
  }));
}

function renderFollowup(board, selectedFacilities, year) {
  const selected = board.items.filter((item) =>
    item.year === year && selectedFacilities.has(item.facility_id),
  );
  const proposals = selected.flatMap((item) => item.advisory_proposals);
  byId("followup-count").textContent = number.format(proposals.length) + " usulan";
  const area = byId("followup");
  if (!proposals.length) {
    area.replaceChildren(element("p", "empty", "Belum ada contoh bahan pembinaan untuk cakupan ini."));
    return;
  }
  const list = element("ul", "followup-list");
  for (const proposal of proposals) {
    const item = element("li", "followup-item");
    const facility = selectedFacilities.get(proposal.facility_id);
    const period = periodFormat.format(new Date(proposal.period + "-01T00:00:00Z"));
    const details = element("div");
    details.append(
      element("strong", "", proposal.subject),
      element("p", "", facility.facility_label + " · " + period),
    );
    item.append(details, element("span", "role-label", roleLabels[proposal.role_to_consult]));
    list.append(item);
  }
  area.replaceChildren(list);
}

function initialize() {
  const dashboardFixture = buildDemoDashboardFixture();
  const profileFixture = buildDemoProfileSdmFixture();
  const followup = buildDemoFollowupBoard(buildDemoFollowupContexts());
  const { options } = buildDemoDashboard(dashboardFixture);
  const year = byId("year");
  const region = byId("region");
  const facility = byId("facility");
  const filters = byId("filters");
  const status = byId("load-state");

  function render(preferredFacility) {
    const eligible = options.facilities.filter((item) =>
      region.value === "ALL" || item.region_id === region.value,
    );
    setOptions(facility, [
      ["ALL", "Semua Puskeswan"],
      ...eligible.map((item) => [item.facility_id, item.facility_label]),
    ], preferredFacility);
    const scope = {
      year: Number(year.value), region_id: region.value, facility_id: facility.value,
    };
    const dashboard = buildDemoDashboard({ ...dashboardFixture, ...scope });
    const profile = buildProfileSdmView({ ...profileFixture, ...scope });
    const selectedFacilities = new Map(
      dashboard.facility_rows.map((item) => [item.facility_id, item]),
    );
    renderMetrics(dashboard, profile);
    renderTrend(dashboard);
    renderCoverage(dashboard.summary);
    renderProfiles(profile);
    renderFollowup(followup, selectedFacilities, scope.year);
    status.textContent = scope.year + " · " + dashboard.summary.facility_count + " Puskeswan dalam cakupan";
  }

  setOptions(year, options.years.map((value) => [value, value]), 2026);
  setOptions(region, [
    ["ALL", "Semua wilayah"],
    ...options.regions.map((item) => [item.region_id, item.region_label]),
  ], "ALL");
  filters.addEventListener("submit", (event) => event.preventDefault());
  filters.addEventListener("change", () => render(facility.value));
  filters.addEventListener("reset", (event) => {
    event.preventDefault();
    year.value = "2026";
    region.value = "ALL";
    render("ALL");
  });
  render("ALL");
  byId("workspace").hidden = false;
  byId("filter-controls").disabled = false;
}

const sectionLinks = document.querySelectorAll('.sidebar nav a[href^="#"]');
function updateCurrentSection() {
  const current = location.hash || "#konten";
  for (const link of sectionLinks) {
    if (link.hash === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
window.addEventListener("hashchange", updateCurrentSection);
updateCurrentSection();

try {
  initialize();
} catch (error) {
  byId("load-state").textContent = "Data demo tidak dapat dimuat. Muat ulang halaman untuk mencoba lagi.";
  console.error(error);
}
