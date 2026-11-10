import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const allowedFiles = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/style.css", ["style.css", "text/css; charset=utf-8"]],
  ["/main.mjs", ["main.mjs", "text/javascript; charset=utf-8"]],
  ["/model.mjs", ["model.mjs", "text/javascript; charset=utf-8"]],
  ["/problems.mjs", ["problems.mjs", "text/javascript; charset=utf-8"]],
  ["/source_snapshots.mjs", ["source_snapshots.mjs", "text/javascript; charset=utf-8"]],
]);
let server;
let browser;
let baseUrl;

before(async () => {
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    const file = allowedFiles.get(pathname);
    if (!file) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    try {
      const data = await readFile(new URL("../" + file[0], import.meta.url));
      response.writeHead(200, {
        "Content-Type": file[1],
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'none'",
      });
      response.end(data);
    } catch {
      response.writeHead(500);
      response.end("Static test failure");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = "http://127.0.0.1:" + server.address().port;
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
});

async function openDemo(viewport = { width: 375, height: 812 }) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "load" });
  await page.locator("#section-cards .card").first().waitFor();
  return { page, errors };
}
function section(page, id) {
  return page.locator('#section-cards .card[data-section="' + id + '"]');
}
function queued(page, id) {
  return page.locator('#review-list .card[data-section="' + id + '"]');
}

test("HP 375px: lima bagian, label, tidak scroll mendatar atau error JS", async () => {
  const { page, errors } = await openDemo();
  try {
    assert.equal(await page.locator("#section-cards .card").count(), 5);
    assert.equal(await page.getByRole("heading", { name: "Profil Saya" }).count(), 1);
    assert.equal(await page.locator("#role").getAttribute("aria-describedby"), "role-help");
    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    assert.equal(horizontalOverflow, false);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

test("HP 320px: halaman tetap masuk viewport dan label ada", async () => {
  const { page, errors } = await openDemo({ width: 320, height: 640 });
  try {
    assert.equal(await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    ), false);
    await section(page, "wilayah_kerja").getByRole("button", { name: "Perbarui Wilayah kerja" }).click();
    assert.equal(await page.locator("#profile-value-label").getAttribute("for"), "profile-value");
    assert.equal(await page.locator("#profile-value").isVisible(), true);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

test("draf disimpan lalu bisa langsung diajukan tanpa perubahan isi", async () => {
  const { page, errors } = await openDemo();
  try {
    await section(page, "bangunan").getByRole("button", { name: "Perbarui Bangunan" }).click();
    await page.locator("#profile-value").fill("Dinding perlu dicat ulang");
    await page.getByRole("button", { name: "Simpan draf" }).click();
    assert.equal((await section(page, "bangunan").locator(".status").textContent()).trim(), "Draf tersimpan");
    await section(page, "bangunan").getByRole("button", { name: "Lanjutkan draf Bangunan" }).click();
    assert.equal(await page.locator("#profile-value").inputValue(), "Dinding perlu dicat ulang");
    await page.getByRole("button", { name: "Ajukan verifikasi" }).click();
    assert.equal((await section(page, "bangunan").locator(".status").textContent()).trim(), "Menunggu verifikasi");
    assert.equal((await page.locator("#notice").textContent()).includes("berhasil"), true);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

test("alur petugas → verifikator → perbaikan → ajukan ulang → setujui", async () => {
  const { page, errors } = await openDemo();
  try {
    await section(page, "bangunan").getByRole("button", { name: "Perbarui Bangunan" }).click();
    await page.locator("#profile-value").fill("Ruang pelayanan butuh perbaikan");
    await page.getByRole("button", { name: "Ajukan verifikasi" }).click();

    await page.locator("#role").selectOption("verifikator_kab");
    assert.equal(await queued(page, "bangunan").count(), 1);
    await queued(page, "bangunan").getByRole("button", { name: "Periksa pengajuan" }).click();
    await page.getByRole("button", { name: "Minta perbaikan" }).click();
    assert.match(await page.locator("#notice").innerText(), /Alasan wajib/);
    await page.locator("#review-notes").fill("Perjelas kondisi bangunan.");
    await page.getByRole("button", { name: "Minta perbaikan" }).click();
    assert.equal(await queued(page, "bangunan").count(), 0);

    await page.locator("#role").selectOption("petugas");
    assert.equal((await section(page, "bangunan").locator(".status").textContent()).trim(), "Perlu perbaikan");
    assert.match(await section(page, "bangunan").innerText(), /Perjelas kondisi bangunan/);
    await section(page, "bangunan").getByRole("button", { name: "Perbaiki data Bangunan" }).click();
    await page.locator("#profile-value").fill("Ruang sudah diperiksa dan rusak ringan");
    await page.getByRole("button", { name: "Ajukan verifikasi" }).click();

    await page.locator("#role").selectOption("verifikator_prov");
    await queued(page, "bangunan").getByRole("button", { name: "Periksa pengajuan" }).click();
    await page.getByRole("button", { name: "Setujui" }).click();
    await page.locator("#role").selectOption("petugas");
    assert.equal((await section(page, "bangunan").locator(".status").textContent()).trim(), "Terverifikasi");
    assert.match(await section(page, "bangunan").innerText(), /Ruang sudah diperiksa dan rusak ringan/);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

test("mode Pimpinan tidak merender detail Puskeswan individu", async () => {
  const { page, errors } = await openDemo();
  try {
    await page.locator("#role").selectOption("pimpinan");
    assert.equal(await page.locator("#facility-card").isVisible(), false);
    assert.equal(await page.locator("#overview").isVisible(), false);
    assert.equal(await page.locator("#profile-panel").isVisible(), false);
    assert.equal(await page.locator("#review-panel").isVisible(), false);
    assert.equal(await page.locator("#leader-panel").isVisible(), true);
    assert.equal(await page.locator("#section-cards").innerHTML(), "");
    assert.equal(await page.locator("#review-list").innerHTML(), "");
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

test("reload tidak menyimpan data demo dan role-switch bukan login", async () => {
  const { page, errors } = await openDemo();
  try {
    await section(page, "bangunan").getByRole("button", { name: "Perbarui Bangunan" }).click();
    await page.locator("#profile-value").fill("Sementara demo");
    await page.getByRole("button", { name: "Simpan draf" }).click();
    await page.reload();
    assert.equal((await section(page, "bangunan").locator(".status").textContent()).trim(), "Perlu verifikasi");
    assert.equal(await page.locator("#role").inputValue(), "petugas");
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});


test("SDM dan APEL dibaca tanpa formulir pengisian ulang, nol beda belum lapor", async () => {
  const { page, errors } = await openDemo();
  try {
    assert.match(await page.locator("#source-sdm").innerText(), /Dokter hewan: 0/);
    assert.match(await page.locator("#source-sdm").innerText(), /Paramedik: 1/);
    assert.match(await page.locator("#source-apel").innerText(), /Pemeriksaan\s+12/);
    await page.locator("#apel-period").selectOption("2026-09");
    assert.match(await page.locator("#source-apel").innerText(), /Pemeriksaan\s+0/);
    await page.locator("#apel-period").selectOption("2026-11");
    assert.match(await page.locator("#source-apel").innerText(), /Belum ada laporan/);
    assert.equal(await page.locator("#source-apel input").count(), 0);
    assert.equal(await page.locator("#source-sdm input").count(), 0);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test("masalah: catat → ajukan → koreksi → ajukan ulang → verifikasi → tindak lanjut → selesai", async () => {
  const { page, errors } = await openDemo();
  try {
    await page.getByRole("button", { name: "Catat masalah" }).click();
    await page.locator("#problem-category").selectOption("peralatan");
    await page.locator("#problem-title").fill("Pendingin vaksin rusak");
    await page.locator("#problem-description").fill("Pendingin vaksin tidak berfungsi dalam simulasi.");
    await page.getByRole("button", { name: "Simpan draf masalah" }).click();
    assert.match(await page.locator('#problem-list [data-problem-id="1"]').innerText(), /Draf/);
    await page.getByRole("button", { name: "Lanjutkan draf #1" }).click();
    await page.getByRole("button", { name: "Ajukan masalah" }).click();
    assert.match(await page.locator('#problem-list [data-problem-id="1"]').innerText(), /Menunggu verifikasi/);

    await page.locator("#role").selectOption("verifikator_kab");
    await page.getByRole("button", { name: "Verifikasi masalah #1" }).click();
    await page.getByRole("button", { name: "Minta perbaikan" }).last().click();
    assert.match(await page.locator("#notice").innerText(), /Alasan wajib/);
    await page.locator("#problem-review-notes").fill("Perjelas kondisi alat.");
    await page.getByRole("button", { name: "Minta perbaikan" }).last().click();

    await page.locator("#role").selectOption("petugas");
    assert.match(await page.locator('#problem-list [data-problem-id="1"]').innerText(), /Perlu perbaikan/);
    await page.getByRole("button", { name: "Perbaiki masalah #1" }).click();
    await page.locator("#problem-description").fill("Pendingin vaksin rusak; pemeriksaan awal sudah dilakukan.");
    await page.getByRole("button", { name: "Ajukan masalah" }).click();

    await page.locator("#role").selectOption("verifikator_prov");
    await page.getByRole("button", { name: "Verifikasi masalah #1" }).click();
    await page.getByRole("button", { name: "Verifikasi masalah", exact: true }).click();
    assert.match(await page.locator('#problem-list [data-problem-id="1"]').innerText(), /Terverifikasi, belum ditindaklanjuti/);
    await page.getByRole("button", { name: "Catat tindak lanjut #1" }).click();
    await page.locator("#problem-review-notes").fill("Pemeriksaan sarpras dijadwalkan.");
    await page.getByRole("button", { name: "Catat tindak lanjut", exact: true }).click();
    await page.getByRole("button", { name: "Catat tindak lanjut #1" }).click();
    await page.locator("#problem-review-notes").fill("Pemeriksaan telah dicatat selesai.");
    await page.getByRole("button", { name: "Tandai selesai" }).click();
    assert.match(await page.locator('#problem-list [data-problem-id="1"]').innerText(), /Selesai dicatat/);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test("pimpinan tidak melihat daftar masalah, sumber SDM/APEL atau identitas Puskeswan", async () => {
  const { page, errors } = await openDemo();
  try {
    await page.locator("#role").selectOption("pimpinan");
    assert.equal(await page.locator("#facility-card").isVisible(), false);
    assert.equal(await page.locator("#linked-panel").isVisible(), false);
    assert.equal(await page.locator("#problems-panel").isVisible(), false);
    assert.equal(await page.locator("#problem-list").innerHTML(), "");
    assert.equal(await page.locator("#source-sdm").innerHTML(), "");
    assert.equal(await page.locator("#source-apel").innerHTML(), "");
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});
