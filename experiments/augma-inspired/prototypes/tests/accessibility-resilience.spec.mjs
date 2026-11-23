// Browser-only lab quality gates; all requests stay on local loopback.
// These tests do not measure WCAG conformance or test physical devices.
import { test, expect } from "@playwright/test";

test.use({ baseURL: "http://127.0.0.1:8767" });

test("keyboard: daftar wilayah memilih melalui Enter tanpa mouse", async ({ page }) => {
  await page.goto("/geo-command-center/");
  const row = page.locator("#region-list .region-row").filter({hasText:"Kabupaten Kepulauan Mentawai"});
  await row.focus();
  await expect(row).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#selected-name")).toHaveText("Kabupaten Kepulauan Mentawai");
  await expect(row).toHaveAttribute("aria-pressed", "true");
});

test("keyboard: penanda SVG peta dapat dipilih melalui Enter dan Space", async ({ page }) => {
  await page.goto("/geo-command-center/");
  await expect(page.locator("#map-pins .pin")).toHaveCount(19);
  const pins = page.locator("#map-pins .pin[role='button'][tabindex='0']");
  await expect(pins).toHaveCount(19);
  await pins.first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#selected-name")).toHaveText("Kabupaten Pesisir Selatan");
  await pins.nth(1).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#selected-name")).toHaveText("Kabupaten Solok");
});

test("keyboard: formulir asisten mengembalikan jawaban dengan sumber", async ({ page }) => {
  await page.goto("/data-assistant/");
  await page.locator("#question").focus();
  await page.keyboard.type("Berapa kabupaten dan kota di Sumatera Barat?");
  await page.keyboard.press("Tab");
  await expect(page.locator("#ask-form button")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".message.assistant").last()).toContainText("12 kabupaten dan 7 kota");
  await expect(page.locator(".message.assistant .sources").last()).toBeVisible();
});

test("keyboard: dashboard fiktif bisa dicari dan dipilih tanpa mouse", async ({ page }) => {
  await page.goto("/puskeswan-simulation/");
  await page.locator("#search").focus();
  await page.keyboard.type("Tuapejat");
  await expect(page.locator("#region-list .region-row")).toHaveCount(1);
  const row = page.locator("#region-list .region-row").first();
  await row.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#selected-name")).toHaveText("Kabupaten Kepulauan Mentawai");
  await expect(row).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".alert")).toContainText("DATA FIKTIF");
});

test("jaringan gagal: outline peta tidak tersedia, daftar 19 wilayah tetap berfungsi", async ({ page }) => {
  const errors = [];
  page.on("pageerror", err => errors.push(String(err)));
  await page.route("**/geo-command-center/data/sumbar-outline.geojson", route => route.abort("failed"));
  await page.goto("/geo-command-center/");
  await expect(page.locator("#map-status")).toContainText("Peta gagal dimuat");
  await expect(page.locator("#region-list .region-row")).toHaveCount(19);
  await page.locator("#search").fill("Mentawai");
  await expect(page.locator("#region-list .region-row")).toHaveCount(1);
  await page.locator("#region-list .region-row").first().click();
  await expect(page.locator("#selected-name")).toContainText("Kepulauan Mentawai");
  await expect(page.locator(".summary .missing")).toHaveText("N/A");
  expect(errors).toEqual([]);
});

test("jaringan lambat: tampilkan loading hingga outline lokal selesai diproses", async ({ page }) => {
  await page.route("**/geo-command-center/data/sumbar-outline.geojson", async route => {
    await new Promise(resolve => setTimeout(resolve, 950));
    await route.continue();
  });
  await page.goto("/geo-command-center/", {waitUntil:"domcontentloaded"});
  await expect(page.locator("#map-status")).toContainText("Memuat GeoJSON lokal");
  await expect(page.locator("#region-list .region-row")).toHaveCount(19);
  await expect(page.locator("#map-status")).toContainText("Geometri provinsi lokal terbaca", {timeout:10000});
  await expect(page.locator("#map-boundary path")).not.toHaveCount(0);
  await expect(page.locator(".summary .missing")).toHaveText("N/A");
});
