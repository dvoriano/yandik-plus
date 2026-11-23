// Manually invoked quality gates. Run ONLY against local http.server lab.
// These are not proof of GIS accuracy and do not connect to YANDIK+ production.
import { test, expect } from "@playwright/test";

test.describe("Lab responsive, offline, and browser errors", () => {
  for (const { label, width, height } of [
    { label: "mobile", width: 390, height: 844 },
    { label: "desktop", width: 1366, height: 768 }
  ]) {
    for (const path of ["/geo-command-center/", "/data-assistant/"]) {
      test(label + " " + path + ": no JS errors and no external requests", async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width, height } });
        const page = await context.newPage();
        const errors = [];
        const blocked = [];
        page.on("pageerror", error => errors.push(String(error)));
        await page.route("**/*", route => {
          const url = route.request().url();
          if (url.startsWith("http://127.0.0.1:8767/")) return route.continue();
          blocked.push(url);
          return route.abort();
        });
        try {
          const response = await page.goto("http://127.0.0.1:8767" + path, {
            waitUntil: "networkidle"
          });
          expect(response?.status()).toBe(200);
          await expect(page.locator("main")).toBeVisible();
          if (path.startsWith("/geo")) {
            await expect(page.locator("#map-boundary path")).not.toHaveCount(0);
            await expect(page.locator("#region-list .region-row")).toHaveCount(19);
          } else {
            await expect(page.locator("#ask-form")).toBeVisible();
            await page.locator("#question").fill("Berapa kabupaten dan kota di Sumatera Barat?");
            await page.locator("#ask-form button").click();
            await expect(page.locator(".message.assistant").last()).toContainText("12 kabupaten dan 7 kota");
          }
          const layout = await page.evaluate(() => ({
            viewportWidth: innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            contentWidth: document.body.scrollWidth
          }));
          expect(layout.documentWidth, JSON.stringify(layout)).toBeLessThanOrEqual(width + 2);
          expect(errors).toEqual([]);
          // External assets are not allowed in the independent lab runtime.
          expect(blocked).toEqual([]);
        } finally {
          await context.close();
        }
      });
    }
  }
});

test("Geo map: reduced-motion mode still responds to selection", async ({ browser }) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 }
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:8767/geo-command-center/");
    await page.locator('button[data-kind="kota"]').click();
    await expect(page.locator(".region-row")).toHaveCount(7);
    await page.locator("#zoom-in").click();
    await expect(page.locator("#map-svg")).not.toHaveAttribute("viewBox", "0 0 800 650");
    await page.locator("#zoom-reset").click();
    await expect(page.locator("#map-svg")).toHaveAttribute("viewBox", /0\.00 0\.00 800\.00 650\.00/);
  } finally {
    await context.close();
  }
});
