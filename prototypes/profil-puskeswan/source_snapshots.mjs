/** Read-only synthetic source snapshots for M02. Zero is NOT "no report".
 * These copied DEMO sample values illustrate adapters, not a live SDM/APEL API.
 * UI must never provide a form that writes to these structures.
 */
const facilities = {
  "DEMO-PSW-001": Object.freeze({
    sdm: Object.freeze({
      source: "Modul SDM (contoh)", observed_on: "2026-10-31",
      dokter_hewan: 0, paramedik: 1, status: "tersedia",
    }),
    apel: Object.freeze({
      "2026-10": Object.freeze({
        status: "dilaporkan", source: "APEL Puskeswan (contoh)", periode: "2026-10",
        kategori: Object.freeze({ pemeriksaan: 12, pengobatan: 9, vaksinasi: 17, investigasi: 1, penyuluhan: 2 }),
      }),
      "2026-09": Object.freeze({
        status: "dilaporkan", source: "APEL Puskeswan (contoh)", periode: "2026-09",
        kategori: Object.freeze({ pemeriksaan: 0, pengobatan: 0, vaksinasi: 0, investigasi: 0, penyuluhan: 0 }),
      }),
    }),
  }),
  "DEMO-PSW-002": Object.freeze({
    sdm: Object.freeze({
      source: "Modul SDM (contoh)", observed_on: "2026-10-31",
      dokter_hewan: 1, paramedik: 0, status: "tersedia",
    }),
    apel: Object.freeze({
      "2026-10": Object.freeze({
        status: "dilaporkan", source: "APEL Puskeswan (contoh)", periode: "2026-10",
        kategori: Object.freeze({ pemeriksaan: 0, pengobatan: 0, vaksinasi: 0, investigasi: 0, penyuluhan: 0 }),
      }),
    }),
  }),
};
export const DEMO_APEL_PERIODS = Object.freeze([
  { value: "2026-10", label: "Oktober 2026" },
  { value: "2026-09", label: "September 2026" },
  { value: "2026-11", label: "November 2026" },
]);
export function readSdmSnapshot(puskeswanId) {
  const data = facilities[puskeswanId]?.sdm;
  if (!data) return Object.freeze({
    status: "belum_tersedia", source: "Modul SDM (contoh)",
    observed_on: null, dokter_hewan: null, paramedik: null,
  });
  return data;
}
export function readApelSnapshot(puskeswanId, period) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period))
    throw new Error("Periode APEL tidak sah.");
  return facilities[puskeswanId]?.apel?.[period] ?? Object.freeze({
    status: "belum_melapor", source: "APEL Puskeswan (contoh)",
    periode: period, kategori: null,
  });
}
export function sourceSummary(puskeswanId, period) {
  return Object.freeze({
    puskeswan_id: puskeswanId,
    sdm: readSdmSnapshot(puskeswanId),
    apel: readApelSnapshot(puskeswanId, period),
  });
}
