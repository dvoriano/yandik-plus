import { test, expect } from "@playwright/test";
test.use({baseURL:"http://127.0.0.1:8767"});

test("dashboard demo: 19 fiktif, filter kota dan status, bulan berubah",async({page})=>{
  const errors=[];page.on("pageerror",e=>errors.push(String(e)));
  await page.goto("/puskeswan-simulation/");
  await expect(page.locator(".alert")).toContainText("DATA FIKTIF");
  await expect(page.locator("#region-list button.region-row")).toHaveCount(19);
  await page.locator("#kind").selectOption("kota");
  await expect(page.locator("#region-list button.region-row")).toHaveCount(7);
  await page.locator("#kind").selectOption("all");
  await page.locator("#status").selectOption("missing");
  const missing=await page.locator("#region-list button.region-row").count();
  expect(missing).toBeGreaterThan(0);
  await expect(page.locator("#k-reported")).toHaveText("0");
  await page.locator("#status").selectOption("all");
  await page.locator("#search").fill("Tuapejat");
  await expect(page.locator("#region-list button.region-row")).toHaveCount(1);
  await expect(page.locator("#selected-name")).toContainText("Kepulauan Mentawai");
  await page.locator("#search").fill("");
  await page.locator("#month").selectOption("7");
  await expect(page.locator("#trend-chart rect")).toHaveCount(12);
  await expect(page.locator("#k-units")).toHaveText("19");
  expect(errors).toEqual([]);
});

test("download CSV selalu mengandung label sintetis",async({page})=>{
  await page.goto("/puskeswan-simulation/");
  const downloadPromise=page.waitForEvent("download");
  await page.locator("#export").click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^YANDIK-LAB-FIKTIF-/);
  const stream=await download.createReadStream();
  const chunks=[];for await(const chunk of stream)chunks.push(chunk);
  const content=Buffer.concat(chunks).toString("utf8");
  expect(content).toContain("SYNTHETIC / NOT OFFICIAL");
  expect(content).toContain("TIDAK TERSEDIA");
  expect(content.split("\r\n").filter(Boolean)).toHaveLength(20);
});

test("mobile viewport: no page-level horizontal overflow",async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  try{
    const page=await context.newPage();
    await page.goto("http://127.0.0.1:8767/puskeswan-simulation/");
    await expect(page.locator("#region-list button.region-row")).toHaveCount(19);
    const width=await page.evaluate(()=>document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(392);
  }finally{await context.close();}
});
