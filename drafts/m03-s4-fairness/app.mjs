/** M03-S4 DRAFT / BELUM DIUJI; intentionally NOT wired into live prototype. */
import { FAIRNESS_SCENARIOS } from "./fixtures.mjs";
import { compareSensitivity, PROFILES, LAB_VERSION } from "./comparison.mjs";

const get = (id) => document.getElementById(id);
const node = (tag, text = "") => {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
};
function message(target, value) {
  target.replaceChildren(node("p", value));
}
function render() {
  const status = get("status");
  const summary = get("summary");
  const tableBody = get("results");
  const detail = get("detail");
  try {
    const result = compareSensitivity(FAIRNESS_SCENARIOS);
    const profileId = get("profile").value;
    const selected = result.comparisons.find((x) => x.profile_id === profileId);
    if (!selected) throw new Error("Profil percobaan tidak diketahui.");
    status.textContent = "DRAF BELUM DIUJI · " + LAB_VERSION;
    message(summary, selected.complete_count + " skenario lengkap dan " +
      selected.incomplete_count + " skenario belum lengkap. Semuanya fiktif.");
    tableBody.replaceChildren();
    for (const row of selected.results) {
      const tr = node("tr");
      const movement = result.movement.find((x) => x.id === row.id);
      for (const value of [
        row.rank === null ? "Tidak diperingkat" : String(row.rank),
        row.label,
        row.service_volume_demo === null ? "Tidak diketahui" : String(row.service_volume_demo),
        row.score === null ? "Belum dinilai" : row.score.toFixed(2),
        row.band ?? "Tidak tersedia",
        movement.needs_human_review ? "Perlu kajian" : "Belum layak keputusan",
      ]) {
        const td = node("td", value);
        tr.append(td);
      }
      tableBody.append(tr);
    }
    const current = selected.results.find((x) => x.id === get("facility").value) ??
      selected.results[0];
    detail.replaceChildren();
    detail.append(node("h3", current.label),
      node("p", current.note),
      node("p", "Volume layanan ilustratif hanya untuk konteks, TIDAK masuk rumus."));
    const list = node("ul");
    for (const factor of current.breakdown) {
      const label = factor.level === null
        ? factor.label + ": belum ada data, tidak boleh diasumsikan 0."
        : factor.label + ": tingkat " + factor.level +
          ", kontribusi " + factor.points.toFixed(2) + " dari bobot " + factor.weight +
          "%. Sumber: " + factor.source_ref;
      list.append(node("li", label));
    }
    detail.append(list);
    if (current.complete) {
      const movement = result.movement.find((x) => x.id === current.id);
      detail.append(node("p", "Perubahan urutan antar profil bobot: " +
        (movement.rank_swing ?? "Belum dapat dihitung") +
        ". " + movement.note));
    }
  } catch (error) {
    status.textContent = "ERROR DRAF BELUM DIUJI";
    message(summary, "Gagal menyusun simulasi. " + error.message);
    tableBody.replaceChildren();
    detail.replaceChildren();
  }
}
for (const profile of PROFILES) {
  const option = node("option", profile.label);
  option.value = profile.id;
  get("profile").append(option);
}
for (const fixture of FAIRNESS_SCENARIOS) {
  const option = node("option", fixture.label);
  option.value = fixture.id;
  get("facility").append(option);
}
get("profile").addEventListener("change", render);
get("facility").addEventListener("change", render);
render();
