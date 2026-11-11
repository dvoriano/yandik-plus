/**
 * M03-S4 DRAFT / BELUM DIUJI / NO CI REQUESTED.
 * Synthetic cross-Puskeswan fairness lab. Not a funding decision, ranking policy,
 * recipient selection, procurement recommendation or production integration.
 *
 * Imports the existing M03-S3 factor validator to avoid a second source of truth.
 * DO NOT import this file into production until test backlog + governance review pass.
 */
import { FACTORS, POLICY_VERSION, previewPriority } from "../../prototypes/profil-puskeswan/support_priority.mjs";

export const LAB_VERSION = "M03-S4-UNTESTED-1";
export const PROFILES = Object.freeze([
  Object.freeze({
    id: "baseline", label: "Bobot M03-S3 (percobaan)",
    weights: Object.freeze({ facility_gap: 25, continuity_risk: 30, access_difficulty: 20, staff_constraints: 15, verified_stock_gap: 10 }),
  }),
  Object.freeze({
    id: "akses_sdm", label: "Sensitivitas akses dan SDM",
    weights: Object.freeze({ facility_gap: 20, continuity_risk: 25, access_difficulty: 30, staff_constraints: 20, verified_stock_gap: 5 }),
  }),
  Object.freeze({
    id: "kontinuitas", label: "Sensitivitas kesinambungan layanan",
    weights: Object.freeze({ facility_gap: 20, continuity_risk: 40, access_difficulty: 15, staff_constraints: 15, verified_stock_gap: 10 }),
  }),
]);
const FACTOR_IDS = FACTORS.map((factor) => factor.id);
const DENIED_FIELDS = Object.freeze([
  "funding_approved", "allocation", "approved_budget", "delivery_id",
  "recipient_selected", "bast", "final_award", "beneficiary",
]);

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
function classify(score) {
  return score >= 70 ? "tinggi" : score >= 40 ? "sedang" : "rendah";
}
function assertProfile(profile) {
  if (!profile || typeof profile !== "object" || !profile.weights)
    throw new Error("Profil bobot tidak tersedia.");
  const weights = profile.weights;
  if (Object.keys(weights).length !== FACTOR_IDS.length ||
      FACTOR_IDS.some((key) => !Object.hasOwn(weights, key) ||
        !Number.isInteger(weights[key]) || weights[key] < 5 || weights[key] > 50))
    throw new Error("Bobot tidak sesuai lima faktor atau di luar batas simulasi.");
  if (FACTOR_IDS.reduce((sum, key) => sum + weights[key], 0) !== 100)
    throw new Error("Total bobot percobaan harus 100.");
  return weights;
}
function assertFixture(row) {
  if (!row || typeof row !== "object" || Array.isArray(row) ||
      row.synthetic !== true || typeof row.id !== "string" ||
      !/^DEMO-[A-Z0-9-]{3,40}$/.test(row.id))
    throw new Error("Hanya Puskeswan fiktif dengan ID DEMO- yang boleh masuk lab.");
  if (typeof row.label !== "string" || row.label.trim().length < 8 ||
      row.label.length > 100)
    throw new Error("Nama skenario DEMO tidak sah.");
  if (typeof row.region_label !== "string" || !row.region_label.startsWith("Wilayah fiktif "))
    throw new Error("Label wilayah harus jelas fiktif.");
  if (row.service_volume_demo !== null &&
      (!Number.isSafeInteger(row.service_volume_demo) || row.service_volume_demo < 0))
    throw new Error("Volume pelayanan fiktif tidak sah.");
  for (const key of DENIED_FIELDS) {
    if (Object.hasOwn(row, key)) throw new Error("Lab bukan sistem alokasi atau BAST.");
  }
  if (!row.factors || typeof row.factors !== "object")
    throw new Error("Faktor penilaian belum disediakan.");
  return row;
}
export function computeAdvisory(row, profile = PROFILES[0]) {
  const fixture = assertFixture(row);
  const weights = assertProfile(profile);
  // Reuse all five factors, input validation and the unknown-vs-zero semantics.
  const sourcePreview = previewPriority(fixture.factors);
  const breakdown = FACTOR_IDS.map((key) => {
    const original = sourcePreview.breakdown.find((x) => x.id === key);
    return {
      id: key,
      label: original.label,
      level: original.level,
      weight: weights[key],
      points: original.level === null ? null : round2((weights[key] * original.level) / 3),
      rationale: original.rationale,
      source_ref: original.source_ref,
    };
  });
  const common = {
    id: fixture.id, label: fixture.label, region_label: fixture.region_label,
    service_volume_demo: fixture.service_volume_demo,
    source_policy: POLICY_VERSION, lab_version: LAB_VERSION,
    weight_profile: profile.id,
    synthetic: true, allocation_status: "TIDAK ADA KEPUTUSAN",
  };
  if (!sourcePreview.complete) {
    return {
      ...common, complete: false, score: null, band: null, rank: null,
      missing: [...sourcePreview.missing], breakdown,
      note: "DATA BELUM LENGKAP: dikecualikan dari urutan, bukan diberi nilai nol.",
    };
  }
  const score = round2(breakdown.reduce((sum, factor) =>
    sum + weights[factor.id] * factor.level / 3, 0));
  return {
    ...common, complete: true, score, band: classify(score), rank: null,
    missing: [], breakdown,
    note: "Skor indikatif, bukan keputusan penerima bantuan.",
  };
}
export function compareFacilities(fixtures, profileId = "baseline") {
  if (!Array.isArray(fixtures) || fixtures.length < 2 || fixtures.length > 30)
    throw new Error("Perbandingan perlu 2–30 Puskeswan fiktif.");
  const profile = PROFILES.find((entry) => entry.id === profileId);
  if (!profile) throw new Error("Profil perbandingan tidak dikenal.");
  const ids = new Set();
  const evaluated = fixtures.map((row) => {
    const result = computeAdvisory(row, profile);
    if (ids.has(result.id)) throw new Error("ID DEMO tidak boleh duplikat.");
    ids.add(result.id);
    return result;
  });
  // Ties share rank; do not invent a tiebreaker or automatically award assistance.
  const ranked = evaluated.filter((x) => x.complete).sort((a, b) =>
    b.score - a.score || a.id.localeCompare(b.id));
  let lastScore = null;
  let lastRank = 0;
  const ordered = ranked.map((row, index) => {
    if (lastScore === null || row.score !== lastScore) {
      lastScore = row.score;
      lastRank = index + 1;
    }
    return { ...row, rank: lastRank };
  });
  const incomplete = evaluated.filter((x) => !x.complete);
  const tied = ordered.filter((row, i) => i > 0 && row.rank === ordered[i - 1].rank)
    .map((row) => row.id);
  return {
    profile_id: profile.id, profile_label: profile.label, policy_status: "DRAF_BELUM_DIUJI",
    calculation_policy: POLICY_VERSION, weights: { ...profile.weights },
    all_count: evaluated.length, complete_count: ordered.length,
    incomplete_count: incomplete.length,
    results: [...ordered, ...incomplete],
    warnings: [
      "SEMUA DATA FIKTIF. Urutan adalah alat analisis sensitivitas, bukan keputusan bantuan.",
      ...(incomplete.length ? ["Data tidak lengkap tidak boleh diurutkan sebagai skor nol."] : []),
      ...(tied.length ? ["Skor sama memiliki peringkat sama. Tidak ada tie-break penerima bantuan."] : []),
    ],
  };
}
export function compareSensitivity(fixtures) {
  const comparisons = PROFILES.map((profile) => compareFacilities(fixtures, profile.id));
  const baseline = comparisons.find((x) => x.profile_id === "baseline");
  const movement = baseline.results.map((base) => {
    const across = comparisons.map((comparison) => {
      const item = comparison.results.find((x) => x.id === base.id);
      return { profile_id: comparison.profile_id, rank: item.rank, score: item.score, band: item.band };
    });
    const ranks = across.map((x) => x.rank).filter((x) => x !== null);
    const swing = ranks.length === comparisons.length ? Math.max(...ranks) - Math.min(...ranks) : null;
    return {
      id: base.id, label: base.label,
      scores_by_profile: across,
      rank_swing: swing,
      sensitivity_flag: swing !== null && swing >= 2,
      needs_human_review: swing === null || swing >= 2,
      note: swing === null ? "Data kosong: perlu dilengkapi, jangan dipaksa masuk ranking."
        : swing >= 2 ? "Urutan peka terhadap bobot, perlu dikaji manusia."
        : "Peringkat relatif stabil dalam tiga bobot percobaan; belum sah sebagai kebijakan.",
    };
  });
  return {
    lab_version: LAB_VERSION, status: "BELUM_DIUJI_BELUM_DISAHKAN",
    comparisons, movement,
    disclaimer: "Tidak menggunakan pelayanan mentah dalam skor, tidak ada pemilihan penerima, alokasi, BAST atau pengadaan.",
  };
}
