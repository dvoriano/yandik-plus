/** M03-S2: proof-reference metadata and duplicate checks for synthetic data only.
 * A DEMO evidence reference is not proof that a file exists or has been inspected.
 */
export const EVIDENCE_TYPES = Object.freeze([
  { id: "foto", label: "Foto kondisi (referensi DEMO)" },
  { id: "dokumen", label: "Dokumen pendukung (referensi DEMO)" },
  { id: "observasi", label: "Catatan observasi (referensi DEMO)" },
]);
const EVIDENCE_REF = /^DEMO-[A-Z0-9][A-Z0-9_-]{3,49}$/;

export function parseEvidence(input) {
  if (input === undefined || input === null) return [];
  if (!Array.isArray(input) || input.length > 3)
    throw new Error("Referensi bukti maksimal tiga catatan.");
  const seen = new Set();
  return input.map((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row) ||
        !EVIDENCE_TYPES.some((x) => x.id === row.type))
      throw new Error("Jenis bukti tidak dikenal.");
    if (typeof row.ref !== "string" || !EVIDENCE_REF.test(row.ref))
      throw new Error("Kode bukti harus berbentuk DEMO-..., bukan tautan/file nyata.");
    if (seen.has(row.ref)) throw new Error("Referensi bukti tidak boleh duplikat.");
    seen.add(row.ref);
    return { type: row.type, ref: row.ref };
  });
}
export function evidenceCompleteness(need) {
  const evidence = parseEvidence(need.evidence);
  return {
    complete: evidence.length > 0,
    count: evidence.length,
    missing: evidence.length ? [] : ["Minimal satu referensi bukti (hanya metadata DEMO)"],
  };
}
export function normalizedItem(value) {
  if (typeof value !== "string") throw new Error("Nama barang tidak sah.");
  return value.normalize("NFKC").toLocaleLowerCase("id-ID")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}
export function priorSimilarNeeds(state, { puskeswan_id, kab_kota, item, excludingId = null }) {
  const key = normalizedItem(item);
  const all = (state.supportNeeds ?? []).filter((need) =>
    need.id !== excludingId && need.puskeswan_id === puskeswan_id &&
    need.kab_kota === kab_kota && normalizedItem(need.item) === key
  );
  return {
    active: all.find((need) => need.status !== "ditolak") ?? null,
    rejected: [...all].reverse().find((need) => need.status === "ditolak") ?? null,
  };
}
