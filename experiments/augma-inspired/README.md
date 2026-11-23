# YANDIK+ Innovation Lab: Augma-Inspired Experiments

> **TERISOLASI / EKSPERIMEN / BUKAN PRODUKSI** · Riset 2026–2030

Ruang uji mandiri untuk mengeksplorasi peta situasional, data geospasial, dan asisten tanya-data pada YANDIK+. Mengambil **ide umum** dari Augma Imaginarium tanpa menyalin kode, aset, atau desain mereka.

## Prototipe

| Modul | Kondisi saat ini |
|---|---|
| [Command Center awal](prototypes/command-center/) | Dashboard enam wilayah dengan **angka fiktif** dan tanya-data berbasis aturan |
| [Geo Command Center](prototypes/geo-command-center/) | Outline geografis provinsi; 19 kode kabupaten/kota + marker perkiraan; impor **opsional** GeoJSON ADM2 yang dicek struktur dan ditampilkan sebagai poligon sesi browser |
| [Evidence Assistant](prototypes/data-assistant/) | Tanya-data berbasis aturan dengan sumber, status `unavailable`, dan penolakan permintaan terlarang |
| [Adapter AI lokal](prototypes/data-assistant/LOCAL_AI_ADAPTER.md) | CLI eksperimen untuk Ollama **OFF secara default**, `--enable-local-ollama` harus dipilih manual; hasil model selalu draf untuk pemeriksaan manusia |

## Menjalankan lab

Di komputer pengembangan dengan Python:

```sh
cd experiments/augma-inspired/prototypes
python3 -m http.server 8767 --bind 127.0.0.1
```

- Geo map: `http://127.0.0.1:8767/geo-command-center/`
- Evidence Assistant: `http://127.0.0.1:8767/data-assistant/`
- Dashboard awal: `http://127.0.0.1:8767/command-center/`

Semua UI default berjalan di browser tanpa database atau token, termasuk outline provinsi. Peta kab/kota baru muncul **setelah** pengguna mengimpor sendiri 19 Polygon/MultiPolygon dari sumber yang sah; data sumbernya belum disertakan.

## Pengujian

Dari folder `prototypes/`:

```sh
npm run test:unit
```

Pengujian browser memerlukan Playwright, **harus dijalankan secara manual**: [panduan browser](prototypes/BROWSER_TESTING.md). Tidak ada CI, auto-deploy, atau pengujian produksi. Jangan menyatakan browser telah diuji sebelum ada hasilnya.

## Kriteria pemisahan

- **Branch:** `lab/augma-inspired-experiments`; **hanya** folder `experiments/augma-inspired/`.
- `main`, `develop`, situs APEL, VPS, database, konfigurasi layanan, bot V2 tidak disentuh.
- Tidak ada pull request/merge/deploy otomatis.
- Data layanan Puskeswan **belum tersedia**, bukan nol. Tidak boleh menyimpulkan capaian riil.
- Marker mendekati pusat pemerintahan, bukan lokasi kantor atau Puskeswan.
- GeoJSON sumber luar perlu verifikasi provenance, lisensi, ketepatan batas, dan tanggal.
- Asisten saat ini berbasis aturan. Adapter LLM lokal bukan jawaban resmi dan tidak bisa melakukan aksi.

## Dokumentasi

- [Radar teknologi](docs/TECHNOLOGY_RADAR.md)
- [Roadmap 2026–2030](docs/ROADMAP_2026_2030.md)
- [Kandidat geometri ADM2 dan persyaratan validasi](docs/GEO_DATA_SOURCES.md)
- [Lisensi, privasi, isolasi](docs/SAFETY_AND_LICENSE.md)
- [Pengujian browser](prototypes/BROWSER_TESTING.md)

**Status:** fondasi eksperimen sudah dibuat, pengujian browser nyata dan verifikasi GIS ADM2 masih terbuka. Tidak ada perubahan ke produksi.
