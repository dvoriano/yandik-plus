# Pengujian browser (opsional dan manual)

Belum ada klaim bahwa browser/HP atau STB berhasil diuji. Skrip Playwright telah disiapkan sebagai pemeriksaan yang dapat direproduksi, **tidak dijalankan otomatis**, tidak memakai GitHub Actions, dan tidak mengakses produksi.

## Prasyarat

Node.js 20+, Python 3, Chromium via Playwright pada komputer uji; koneksi hanya dibutuhkan saat memasang dependency Playwright (bukan saat mengoperasikan prototipe).

Terminal 1, dari direktori `prototypes/`:
```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

Terminal 2 dari direktori yang sama:
```sh
npm install --no-save @playwright/test
npx playwright install chromium
npx playwright test --config=playwright.config.mjs
```

Tes browser memeriksa: peta outline lokal, 19 entri, filter 7 kota/12 kabupaten, impor geometri simulasi dan penolakannya, serta sumber jawaban asisten dan status tidak tersedia. Dataset poligon pada tes dibentuk oleh persegi fiktif di sekitar penanda wilayah, **bukan** geometri nyata.

## Checklist pengujian manual

- [ ] Browser desktop: peta tampil, filter dan zoom berfungsi, tidak ada error Console.
- [ ] Browser seluler: peta, daftar, form impor, dan asisten dapat dipakai.
- [ ] Navigasi keyboard dan pembaca layar, termasuk label bantuan.
- [ ] Laptop berkinerja rendah: responsivitas dengan geometri banyak titik.
- [ ] STB rumahan: cek RAM, CPU, storage, ketersediaan Python/browser dan waktu render.
- [ ] Berkas GeoJSON salah: penolakan dan fallback tetap terlihat.
- [ ] Offline: peta outline dan asisten dasar berfungsi tanpa API.

**Tidak boleh menganggap tes ini lulus** hingga benar-benar dijalankan dan dicatat dengan perangkat, browser, tanggal, serta hasilnya.
