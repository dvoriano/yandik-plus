// YANDIK+ Innovation Lab, local-model experimental adapter.
// No network in this module; caller injects transport. Disabled by default.
// Model output is NEVER promoted to a verified answer automatically.
import { answer, prepareEvidencePackage } from "./assistant-core.mjs";

export const ADAPTER_POLICY = Object.freeze({
  enabledByDefault: false,
  acceptedRole: "DRAFT_FOR_REVIEW",
  externalTools: false,
  automaticActions: false,
  productionData: false
});

function uniqueStrings(items) {
  return [...new Set(items)];
}

export function validateModelDraft(candidate, allowedSources) {
  let parsed = candidate;
  if (typeof candidate === "string") {
    try { parsed = JSON.parse(candidate.trim()); }
    catch { return { valid: false, reason: "Model tidak mengembalikan JSON terstruktur" }; }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) ||
      typeof parsed.draft !== "string" || parsed.draft.length < 1 || parsed.draft.length > 1800 ||
      !Array.isArray(parsed.citations) || !parsed.citations.length || parsed.citations.length > 8) {
    return { valid: false, reason: "Struktur draft atau daftar sumber tidak valid" };
  }
  const expected = new Set(allowedSources.map(s => s.id));
  const citations = uniqueStrings(parsed.citations);
  if (citations.some(id => typeof id !== "string" || !expected.has(id)))
    return { valid: false, reason: "Draft mengutip sumber yang tidak tersedia" };
  // Not a factual accuracy check. Mandatory human review remains in place.
  return { valid: true, draft: parsed.draft, citations };
}

export function createLocalPrompt(evidence) {
  if (!evidence || !Array.isArray(evidence.allowed_evidence)) throw Error("Evidence packet tidak valid");
  return [
    "TUGAS: Usulkan parafrasa ringkas jawaban yang sudah tersedia; bukan mencari fakta baru.",
    "ATURAN: Hanya gunakan jawaban dasar dan sumber yang diberikan.",
    "Jangan mengubah angka, menambahkan nama atau data, menyimpulkan status 0 dari data kosong, atau membuat sumber baru.",
    "Tidak ada hak menggunakan alat, login, file sistem, database, maupun layanan eksternal.",
    "Keluarkan HANYA JSON: {\"draft\":\"...\",\"citations\":[\"SOURCE_ID\"]}",
    "Status jawaban dasar: " + evidence.answer_status,
    "Pertanyaan: " + JSON.stringify(evidence.query),
    "Jawaban dasar: " + JSON.stringify(evidence.grounded_response),
    "Sumber yang tersedia: " + JSON.stringify(evidence.allowed_evidence.map(s => ({ id: s.id, label: s.label })))
  ].join("\n");
}

export async function runLocalAdapter(question, options = {}) {
  const canonical = answer(question);
  const fallback = (status, reason) => Object.freeze({
    status, reason, canonical, modelDraft: null, verified: false
  });
  // Never transmit requests for unavailable metrics, denied data, or help prompts.
  if (canonical.status !== "answered")
    return fallback("blocked_by_evidence", "Hanya pertanyaan dengan bukti yang tersedia boleh diajukan ke model lokal");
  if (options.enabled !== true)
    return fallback("disabled", "Adapter lokal tidak diaktifkan secara eksplisit");
  if (typeof options.transport !== "function")
    return fallback("transport_missing", "Transport model lokal belum disediakan");
  const packet = prepareEvidencePackage(question);
  if (!packet.allowed_evidence.length)
    return fallback("blocked_by_evidence", "Sumber tidak tersedia");

  let response;
  try {
    response = await options.transport({
      prompt: createLocalPrompt(packet),
      packet,
      model: options.model ?? "local-model"
    });
  } catch {
    return fallback("transport_error", "Transport lokal gagal");
  }
  const validation = validateModelDraft(response, packet.allowed_evidence);
  if (!validation.valid) return fallback("draft_invalid", validation.reason);
  return Object.freeze({
    status: "review_required",
    reason: "Draf model tidak diverifikasi faktual dan tidak boleh dijadikan jawaban otomatis",
    canonical,
    modelDraft: Object.freeze({ text: validation.draft, sourceIds: Object.freeze(validation.citations) }),
    verified: false
  });
}
