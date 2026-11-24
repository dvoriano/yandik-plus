import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";

const serverFile = fileURLToPath(new URL("../../yandik-backend-contract/local_server.py", import.meta.url));
const actors = ["ALPHA", "KAB-UTARA", "REVIEW", "LEADER"];
let server, browser, url;
const codes = new Map();

before(async () => {
  server = spawn(process.env.YANDIK_PYTHON ?? "python3", [
    "-B", serverFile, "--port", "0", "--allow-demo-commands",
  ], { stdio: ["ignore", "pipe", "ignore"] });
  const lines = createInterface({ input: server.stdout });
  for await (const line of lines) {
    const origin = line.match(/^Buka (http:\/\/127\.0\.0\.1:\d+\/)/);
    const login = line.match(/^Kode sesi DEMO (\S+): (\S+)$/);
    if (origin) url = origin[1];
    if (login) codes.set(login[1], login[2]);
    if (url && codes.size === actors.length) break;
  }
  assert.ok(url && actors.every(actor => codes.has(actor)));
  const executablePath = process.env.YANDIK_CHROMIUM_PATH;
  browser = await chromium.launch(executablePath ? { executablePath } : {});
});

after(async () => {
  await browser?.close();
  if (server && server.exitCode === null && server.signalCode === null) {
    const exited = once(server, "exit");
    server.kill();
    await exited;
  }
});

const core = { method: "GET", path: "/api/v1/core", query: {}, body: null };
function post(context, path, data) {
  return context.request.post(new URL(path, url).href, {
    headers: { Origin: new URL(url).origin },
    data,
  });
}
async function open(actor, viewport = { width: 1280, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.setDefaultTimeout(5_000);
  await page.goto(url);
  await page.getByLabel("Kode sesi DEMO").fill(codes.get(actor));
  await page.getByRole("button", { name: "Masuk ke DEMO" }).click();
  await page.locator('.backend-nav button[aria-pressed="true"]').waitFor({ state: "attached" });
  return { context, page };
}
function panel(page) {
  return page.locator("#backend-root .review-panel");
}
async function visit(page, name) {
  await page.getByText("Menu lainnya", { exact: true }).click();
  await page.getByRole("navigation", { name: "Menu ruang kerja" }).getByRole("button", { name, exact: true }).click();
  await panel(page).getByRole("heading", { name, exact: true }).waitFor();
  await page.waitForFunction(() => !document.querySelector(".workspace-panel").hasAttribute("aria-busy"));
  assert.doesNotMatch(await panel(page).innerText(), /Sumber belum tersedia atau akses dibatasi/);
}

test("login DEMO, peran di server, sesi ditutup ketika keluar", { timeout: 20_000 }, async () => {
  const context = await browser.newContext();
  try {
    assert.equal((await post(context, "/local/dispatch", core)).status(), 401);
    assert.equal((await post(context, "/local/session", { code: "invalid" })).status(), 401);
    const login = await post(context, "/local/session", { code: codes.get("ALPHA") });
    assert.equal(login.status(), 200);
    assert.match(login.headers()["set-cookie"], /HttpOnly; SameSite=Strict/);
    const session = await (await post(context, "/local/dispatch", core)).json();
    assert.equal(session.data.role_demo, "puskeswan");
    assert.deepEqual(session.data.facilities.map(f => f.facility_id), ["DEMO-PSW-ALPHA"]);
    const foreign = await post(context, "/local/dispatch", {
      ...core, path: "/api/v1/profiles", query: { facility_id: "DEMO-PSW-GAMMA", year: 2026 },
    });
    assert.equal(foreign.status(), 403);
    assert.equal((await post(context, "/local/dispatch", { ...core, actor: "ADMIN" })).status(), 422);
    assert.equal((await context.request.post(new URL("/local/dispatch", url).href, {
      headers: { Origin: "http://localhost:8765" }, data: core,
    })).status(), 403);
    const page = await context.newPage();
    await page.goto(url);
    await page.getByRole("button", { name: "Keluar dari DEMO" }).click();
    await page.getByLabel("Kode sesi DEMO").waitFor();
    assert.equal((await post(context, "/local/dispatch", core)).status(), 401);
  } finally {
    await context.close();
  }
});

test("portal backend memuat semua menu sesuai peran dan tetap dalam viewport", { timeout: 40_000 }, async () => {
  const union = new Set();
  for (const actor of ["ALPHA", "KAB-UTARA", "LEADER"]) {
    const { context, page } = await open(actor);
    try {
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      const labels = await page.locator(".backend-nav button").allTextContents();
      if (actor === "LEADER") assert.deepEqual(labels, ["Dashboard pimpinan", "Pustaka digital"]);
      for (const label of labels) {
        await visit(page, label);
        union.add(label);
        for (const width of [320, 375, 768, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            actor + " " + label + " overflow pada " + width);
        }
      }
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  }
  assert.equal(union.size, 12);
});

test("halaman awal petugas menampilkan satu tindakan dan membuka pilihan sesuai kebutuhan", { timeout: 20_000 }, async () => {
  const { context, page } = await open("ALPHA", { width: 390, height: 844 });
  try {
    const action = page.getByText("Mulai isi laporan", { exact: true });
    await page.getByText("Puskeswan DEMO ALPHA · Januari 2026", { exact: true }).waitFor();
    await page.getByText("Belum ada draf", { exact: true }).waitFor();
    const bounds = await action.boundingBox();
    assert.ok(bounds && bounds.y + bounds.height <= 844 && bounds.height >= 44);
    assert.equal(await page.getByRole("navigation", { name: "Menu ruang kerja" }).count(), 0);
    assert.equal(await page.getByRole("combobox").count(), 0);
    assert.equal(await page.getByLabel("Pengobatan", { exact: true }).isVisible(), false);

    await action.press("Enter");
    await page.getByLabel("Pengobatan", { exact: true }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Tambah", exact: true }).count(), 0);
    await page.getByText("Investigasi, kurban dan bukti", { exact: true }).click();
    assert.equal(await page.getByRole("button", { name: "Tambah", exact: true }).count(), 3);
    await page.getByText("Ubah periode", { exact: true }).click();
    await page.getByRole("combobox", { name: "Bulan", exact: true }).selectOption("2");
    await page.getByText("Puskeswan DEMO ALPHA · Februari 2026", { exact: true }).waitFor();
    await action.waitFor();
    assert.equal(await page.getByRole("combobox", { name: "Puskeswan" }).count(), 0);
  } finally {
    await context.close();
  }
});

test("APEL menyimpan draf DEMO, validasi isian, reviewer terpisah, dan kirim ulang", { timeout: 30_000 }, async () => {
  const writer = await open("ALPHA", { width: 375, height: 850 });
  const reviewer = await open("REVIEW");
  try {
    const field = writer.page.getByLabel("Pengobatan", { exact: true });
    const save = writer.page.getByRole("button", { name: "Simpan draf DEMO" });
    writer.page.on("dialog", dialog => dialog.accept());
    reviewer.page.on("dialog", dialog => dialog.accept());
    await writer.page.getByText("Mulai isi laporan", { exact: true }).click();
    await field.fill("3");
    for (const label of ["Vaksinasi", "Penyuluhan", "Layanan lain"]) {
      await writer.page.getByLabel(label, { exact: true }).fill("0");
    }
    await save.click();
    const submit = writer.page.getByRole("button", { name: "Kirim laporan DEMO", exact: true });
    await submit.waitFor();
    const edit = writer.page.getByText("Ubah isian laporan", { exact: true });
    await edit.click();
    await field.fill("4");
    await submit.waitFor({ state: "hidden" });
    await edit.click();
    await submit.click();
    await writer.page.getByText("Simpan isian yang berubah terlebih dahulu.", { exact: true }).waitFor();
    await edit.click();
    assert.equal(await field.inputValue(), "4");
    await save.click();
    await submit.click();
    await panel(writer.page).getByText("Terkirim untuk ditinjau", { exact: true }).waitFor();
    await visit(reviewer.page, "Pelayanan & pelaporan");
    await reviewer.page.getByRole("button", { name: "Minta koreksi DEMO" }).click();
    await panel(reviewer.page).getByText("Perlu koreksi", { exact: true }).waitFor();
    await writer.page.reload();
    await writer.page.getByText("Perbaiki laporan", { exact: true }).click();
    await field.fill("5");
    await save.click();
    await submit.click();
    await panel(writer.page).getByText("Terkirim untuk ditinjau", { exact: true }).waitFor();
  } finally {
    await writer.context.close();
    await reviewer.context.close();
  }
});

test("inventaris terkonfirmasi menjadi dasar usulan Support Puskeswan", { timeout: 25_000 }, async () => {
  const { context, page } = await open("ALPHA");
  try {
    page.on("dialog", dialog => dialog.accept());
    await visit(page, "Inventaris tahunan");
    const groups = page.getByLabel("Kelompok inventaris");
    await groups.selectOption("C1");
    const item = panel(page).locator("details").filter({ hasText: "C.1.a" }).first();
    const summary = item.locator("summary");
    const title = (await summary.innerText()).split(" · ")[0];
    await summary.click();
    await item.getByLabel("Ketersediaan").selectOption("ABSENT");
    assert.equal(await item.getByLabel("Jumlah tersedia").isVisible(), false);
    await item.getByRole("button", { name: "Simpan butir" }).click();
    await panel(page).getByText(/^1\/198 butir dikonfirmasi/).waitFor();
    await visit(page, "Support Puskeswan");
    const row = panel(page).getByRole("row").filter({ hasText: title }).first();
    await row.getByRole("button", { name: "Buka", exact: true }).click();
    await panel(page).getByLabel("Jumlah diusulkan").fill("2");
    await panel(page).getByRole("button", { name: "Simpan tindakan DEMO" }).click();
    await page.getByLabel("Tampilkan").selectOption("started");
    await row.getByRole("button", { name: "Buka", exact: true }).click();
    await panel(page).getByText("Usulan: 2", { exact: true }).waitFor();
  } finally {
    await context.close();
  }
});

test("hasil pembinaan menjadi sumber draf administrasi paperless", { timeout: 25_000 }, async () => {
  const reviewer = await open("REVIEW");
  const worker = await open("ALPHA");
  const slot = page => panel(page).locator("details").filter({ hasText: "Slot 1" }).first();
  const save = scope => scope.getByRole("button", { name: "Simpan tindakan DEMO" });
  try {
    for (const { page } of [reviewer, worker]) page.on("dialog", dialog => dialog.accept());
    await visit(reviewer.page, "Pembinaan & Bimtek");
    await slot(reviewer.page).locator("summary").first().click();
    await slot(reviewer.page).getByLabel("Tanggal rencana").fill("2026-11-01");
    await slot(reviewer.page).getByLabel("Rencana peserta").fill("10");
    await save(slot(reviewer.page)).click();
    await slot(reviewer.page).getByText("Revisi: 1", { exact: true }).waitFor({ state: "attached" });
    await visit(worker.page, "Pembinaan & Bimtek");
    await slot(worker.page).locator("summary").first().click();
    await slot(worker.page).getByLabel("Kehadiran aktual").fill("9");
    await slot(worker.page).getByLabel("Tanggal pencatatan").fill("2026-11-02");
    await slot(worker.page).getByLabel("Tenggat tindak lanjut").fill("2026-12-01");
    await save(slot(worker.page)).click();
    await slot(worker.page).getByText("Revisi: 2", { exact: true }).waitFor({ state: "attached" });
    await visit(worker.page, "Administrasi kegiatan");
    const document = panel(worker.page).locator("details").filter({ hasText: "Laporan hasil" }).first();
    await document.locator("summary").first().click();
    await save(document).click();
    await document.getByText("Revisi sumber terikat: 2", { exact: true }).waitFor({ state: "attached" });
    await document.locator("summary").first().click();
    await document.locator(".paperless-preview").waitFor();
  } finally {
    await worker.context.close();
    await reviewer.context.close();
  }
});

test("simulasi fixture tetap dapat dibuka dari aplikasi backend dan bernavigasi", { timeout: 20_000 }, async () => {
  const { context, page } = await open("ALPHA", { width: 375, height: 850 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await page.getByRole("link", { name: "Kembali ke simulasi portal" }).click();
    await page.locator("#scope-controls:enabled").waitFor();
    await page.getByRole("button", { name: "Menu ruang kerja" }).click();
    await page.locator("#portal-nav").getByText("Inventaris tahunan", { exact: true }).click();
    await page.locator("#inventaris").waitFor();
    assert.match(page.url(), /#inventaris$/);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.goBack();
    await page.locator("#layanan").waitFor();
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
});
