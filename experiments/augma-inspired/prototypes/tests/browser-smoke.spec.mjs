// Optional Playwright smoke test. Not run by CI or production.
// Start python3 -m http.server 8767 from 'prototypes' before running.
import { test, expect } from "@playwright/test";
import { REGIONS } from "../geo-command-center/regions.mjs";

test.use({ baseURL: "http://127.0.0.1:8767" });

test("geo map loads local outline and filters 19 regions", async ({ page }) => {
  await page.goto("/geo-command-center/");
  await expect(page.locator("#region-list .region-row")).toHaveCount(19);
  await expect(page.locator("#map-boundary path")).not.toHaveCount(0);
  await page.locator('button[data-kind="kota"]').click();
  await expect(page.locator("#region-list .region-row")).toHaveCount(7);
  await page.locator('button[data-kind="kabupaten"]').click();
  await expect(page.locator("#region-list .region-row")).toHaveCount(12);
  await page.locator("#search").fill("Mentawai");
  await expect(page.locator("#region-list .region-row")).toHaveCount(1);
  await page.locator(".region-row").first().click();
  await expect(page.locator("#selected-name")).toContainText("Kepulauan Mentawai");
});

test("boundary import rejects missing feature, then previews 19 synthetic shapes", async ({ page }) => {
  await page.goto("/geo-command-center/");
  const features = REGIONS.map(region => {
    const x = region.lon, y = region.lat;
    return {type:"Feature",properties:{code:region.code,name:region.name},
      geometry:{type:"Polygon",coordinates:[[
        [x-.01,y-.01],[x+.01,y-.01],[x+.01,y+.01],[x-.01,y+.01],[x-.01,y-.01]
      ]]}};
  });
  const upload = async input => {
    await page.locator("#boundary-file").setInputFiles({
      name:"synthetic-only.geojson",
      mimeType:"application/geo+json",
      buffer:Buffer.from(JSON.stringify(input))
    });
  };
  await page.locator("#license-confirmation").check();
  await upload({type:"FeatureCollection",features:features.slice(0,18)});
  await expect(page.locator("#boundary-status")).toContainText("Impor ditolak");
  await upload({type:"FeatureCollection",features});
  await expect(page.locator("#boundary-status")).toContainText("19/19 poligon");
  await expect(page.locator("#map-adm2 path")).toHaveCount(19);
  await page.locator("#clear-boundary").click();
  await expect(page.locator("#map-adm2 path")).toHaveCount(0);
});

test("assistant provides sources, but refuses missing operational metrics", async ({ page }) => {
  await page.goto("/data-assistant/");
  await page.locator("#question").fill("Berapa kabupaten dan kota di Sumatera Barat?");
  await page.locator("#ask-form button").click();
  await expect(page.locator(".message.assistant").last()).toContainText("12 kabupaten dan 7 kota");
  await expect(page.locator(".message.assistant .sources")).toBeVisible();
  await page.locator("#question").fill("Berapa pelayanan Puskeswan di Agam?");
  await page.locator("#ask-form button").click();
  await expect(page.locator(".message.assistant").last()).toContainText("belum tersedia");
  await expect(page.locator(".message.assistant").last()).toContainText("UNAVAILABLE");
});
