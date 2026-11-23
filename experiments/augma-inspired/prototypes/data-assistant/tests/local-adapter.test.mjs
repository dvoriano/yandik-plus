import test from "node:test";
import assert from "node:assert/strict";
import { runLocalAdapter, createLocalPrompt, validateModelDraft, ADAPTER_POLICY } from "../local-adapter.mjs";
import { prepareEvidencePackage } from "../assistant-core.mjs";

test("default OFF, transport tidak boleh dipanggil", async () => {
  let calls = 0;
  const result = await runLocalAdapter("berapa wilayah?", {
    transport: async () => { calls++; throw Error("should never run"); }
  });
  assert.equal(result.status, "disabled");
  assert.equal(calls, 0);
  assert.equal(ADAPTER_POLICY.productionData, false);
});

test("data tidak tersedia memblokir model walau enabled", async () => {
  let calls = 0;
  const result = await runLocalAdapter("berapa pelayanan Puskeswan?", {
    enabled: true, transport: async () => { calls++; return {}; }
  });
  assert.equal(result.status, "blocked_by_evidence");
  assert.equal(calls, 0);
  assert.equal(result.canonical.status, "unavailable");
});

test("draf tidak menjadi jawaban terverifikasi", async () => {
  const result = await runLocalAdapter("berapa kabupaten dan kota?", {
    enabled: true,
    transport: async ({ packet }) => ({
      draft: "Sumatera Barat memiliki 12 kabupaten dan 7 kota.",
      citations: packet.allowed_evidence.map(s => s.id)
    })
  });
  assert.equal(result.status, "review_required");
  assert.equal(result.verified, false);
  assert.match(result.canonical.text, /12 kabupaten dan 7 kota/);
  assert.ok(result.modelDraft.sourceIds.length > 0);
});

test("sumber rekaan dan draft bebas format ditolak", async () => {
  const packet = prepareEvidencePackage("berapa kabupaten?");
  assert.equal(validateModelDraft({ draft: "data", citations: ["FAKE"] }, packet.allowed_evidence).valid, false);
  assert.equal(validateModelDraft("text biasa", packet.allowed_evidence).valid, false);
  assert.match(createLocalPrompt(packet), /Jangan mengubah angka/);
});

test("transport error tidak menghentikan jawaban dasar", async () => {
  const result = await runLocalAdapter("berapa kabupaten?", {
    enabled: true, transport: async () => { throw Error("offline"); }
  });
  assert.equal(result.status, "transport_error");
  assert.equal(result.canonical.status, "answered");
});
