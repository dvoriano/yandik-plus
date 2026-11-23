#!/usr/bin/env node
// Explicit opt-in CLI: localhost ONLY. Run on a development computer with Ollama installed.
// It never modifies any file or calls the production YANDIK+ API.
import { runLocalAdapter } from "./local-adapter.mjs";

const args = process.argv.slice(2);
const enabled = args.includes("--enable-local-ollama");
const question = args.filter(a => a !== "--enable-local-ollama").join(" ").trim();

if (!question) {
  console.error('Usage: node cli-local-ollama.mjs [--enable-local-ollama] "berapa kabupaten di Sumbar?"');
  process.exitCode = 2;
} else {
  const model = process.env.YANDIK_LAB_LOCAL_MODEL || "qwen2.5:1.5b";
  const result = await runLocalAdapter(question, {
    enabled,
    model,
    transport: async ({ prompt }) => {
      // Caller cannot choose endpoint through env. No DNS or non-loopback network.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            model, stream: false, prompt,
            format: "json", options: { temperature: 0, num_predict: 400 }
          }),
          signal: controller.signal
        });
        if (!response.ok) throw Error("Ollama response " + response.status);
        const body = await response.json();
        if (typeof body.response !== "string") throw Error("Ollama response is missing");
        return body.response;
      } finally { clearTimeout(timer); }
    }
  });
  console.log(JSON.stringify({
    mode: enabled ? "LOCAL_EXPLICIT_OPT_IN" : "DISABLED",
    model: enabled ? model : null,
    status: result.status,
    canonical_answer: result.canonical.text,
    canonical_sources: result.canonical.sources.map(s => s.id),
    draft_for_human_review: result.modelDraft,
    verified: false,
    message: result.reason
  }, null, 2));
}
