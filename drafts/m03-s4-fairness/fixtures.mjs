/** M03-S4 DRAFT / BELUM DIUJI: all examples are invented, not real Puskeswan.
 * service_volume_demo is illustrative display data only. NEVER pass it into score.
 */
import { FACTORS } from "../../prototypes/profil-puskeswan/support_priority.mjs";

function evidence(levels, name) {
  return Object.fromEntries(FACTORS.map((factor, index) => [
    factor.id,
    levels[index] === null
      ? { level: null, rationale: "", source_ref: "" }
      : {
        level: levels[index],
        rationale: "Asumsi data simulasi " + name + ", untuk faktor " + factor.id + ".",
        source_ref: "DEMO-FAKTOR-" + (index + 1),
      },
  ]));
}
function scenario(id, label, region, volume, levels) {
  return Object.freeze({
    id, label, region_label: region, synthetic: true,
    service_volume_demo: volume, factors: evidence(levels, id),
  });
}
export const FAIRNESS_SCENARIOS = Object.freeze([
  scenario("DEMO-TERPENCIL-01",
    "Lokasi terpencil, kasus tercatat sedikit, gangguan layanan berat",
    "Wilayah fiktif Pegunungan A", 9, [3, 3, 3, 3, 2]),
  scenario("DEMO-PADAT-02",
    "Lokasi perkotaan, volume layanan tinggi, fasilitas relatif memadai",
    "Wilayah fiktif Perkotaan B", 920, [1, 1, 0, 0, 1]),
  scenario("DEMO-SDM-TERBATAS-03",
    "Tenaga klinik terbatas dengan akses suplai sedang",
    "Wilayah fiktif Pedalaman C", 42, [2, 2, 2, 3, 1]),
  scenario("DEMO-RANTAI-DINGIN-04",
    "Rantai dingin kritis dengan risiko layanan besar",
    "Wilayah fiktif Kepulauan D", 170, [3, 3, 1, 1, 3]),
  scenario("DEMO-TIDAK-LENGKAP-05",
    "Kondisi SDM belum diketahui, tidak boleh dianggap nol",
    "Wilayah fiktif Terisolasi E", null, [2, 2, 3, null, 2]),
  scenario("DEMO-NILAI-SAMA-06",
    "Contoh nilai indikator sama untuk menguji aturan seri",
    "Wilayah fiktif Perbatasan F", 15, [2, 2, 2, 3, 1]),
]);
// Manual review scenarios to execute ONLY after owner authorizes testing.
// 1. Increase service_volume_demo of a fixed case: scores MUST remain unchanged.
// 2. Missing staff input MUST remain unranked, not zero.
// 3. Two identical factor profiles MUST share rank.
// 4. All weight variants MUST sum to 100 and keep audit rationale.
// 5. Changing weights might change rank; treat it as sensitivity, not approval.
// 6. Every row must be DEMO; reject real identities or allocation fields.
