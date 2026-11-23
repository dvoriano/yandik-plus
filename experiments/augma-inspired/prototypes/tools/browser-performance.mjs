// Manual browser performance sampling. Never auto-fails on arbitrary targets.
// Run from prototypes/ only after the local demo server is up.
import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:8767";
const browser = await chromium.launch({ headless: true });
const report = { schema: "yandik.lab.browser-perf.v1", measured_at: new Date().toISOString(),
  environment: "LOCAL_LAB_ONLY", thresholds: "NOT_ESTABLISHED", samples: [] };
try {
  for (const [device, viewport] of [
    ["desktop", { width: 1366, height: 768 }],
    ["mobile_emulation", { width: 390, height: 844 }]
  ]) {
    const context = await browser.newContext({ viewport, offline: false });
    for (const path of ["/geo-command-center/", "/data-assistant/"]) {
      const page = await context.newPage();
      const errors = [], external = [];
      page.on("pageerror", err => errors.push(String(err)));
      await page.route("**/*", route => {
        if (route.request().url().startsWith(base + "/")) return route.continue();
        external.push(route.request().url());
        return route.abort();
      });
      const start = performance.now();
      let httpStatus = null;
      try {
        const response = await page.goto(base + path, { waitUntil: "networkidle", timeout: 20000 });
        httpStatus = response?.status() ?? null;
        const browserStats = await page.evaluate(() => {
          const entries = performance.getEntriesByType("resource");
          const nav = performance.getEntriesByType("navigation")[0];
          return {
            resources: entries.length,
            transfer_size_bytes: entries.reduce((sum, r) => sum + (r.transferSize || 0), 0),
            dom_content_loaded_ms: Math.round(nav?.domContentLoadedEventEnd || 0),
            document_width: document.documentElement.scrollWidth
          };
        });
        report.samples.push({ device, path, http_status: httpStatus,
          elapsed_ms: Math.round(performance.now() - start),
          js_errors: errors, external_requests_blocked: external, ...browserStats });
      } catch (err) {
        report.samples.push({device, path, http_status: httpStatus, error: String(err)});
      } finally { await page.close(); }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
if (report.samples.some(s => s.error || s.js_errors?.length || s.external_requests_blocked?.length || s.http_status !== 200)) {
  process.exitCode = 1;
}
