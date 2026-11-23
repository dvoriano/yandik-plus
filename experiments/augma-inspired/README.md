# YANDIK+ Innovation Lab: Augma-Inspired Experiments

> **TERISOLASI / EKSPERIMEN / BUKAN PRODUKSI** · Riset 2026–2030

Ruang uji mandiri untuk mengeksplorasi peta situasional, data geospasial, dan asisten tanya-data pada YANDIK+. Mengambil **ide umum** dari Augma Imaginarium tanpa menyalin kode, aset, atau desain mereka.

## Prototipe

| Modul | Kondisi saat ini |
|---|---|
| [Command Center awal](prototypes/command-center/) | Dashboard enam wilayah dengan **angka fiktif** dan tanya-data berbasis aturan |
| [Geo Command Center](prototypes/geo-command-center/) | Outline geografis provinsi; 19 kode kabupaten/kota + marker perkiraan; impor **opsional** GeoJSON ADM2 yang dicek struktur dan ditampilkan sebagai poligon sesi browser |
| [Simulasi Pelaporan Puskeswan](prototypes/puskeswan-simulation/) | Dashboard 19 unit **imajiner** × 12 bulan (228 catatan sintetis): filter, KPI, tren, daftar tindak lanjut, CSV fiktif, tanpa data APEL |
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
- **Simulasi Pelaporan:** `http://127.0.0.1:8767/puskeswan-simulation/`

Semua UI default berjalan di browser tanpa database atau token, termasuk outline provinsi. Peta kab/kota baru muncul **setelah** pengguna mengimpor sendiri 19 Polygon/MultiPolygon dari sumber yang sah; data sumbernya belum disertakan.

## Pengujian

Dari folder `prototypes/`:

```sh
npm run test:unit
```

Audit geospasial offline (opsional Shapely 2+) dari folder `experiments/augma-inspired/`:

```sh
python3 -m unittest discover -s tools/tests -v
# Untuk dataset ADM2 berizin yang diunduh secara terpisah:
python3 tools/audit_adm2.py /path/to/sumbar-adm2.geojson \
  --registry prototypes/geo-command-center/regions.mjs
```

Enam tes audit geometri sintetis telah lulus pada sesi pengujian 23 November 2026, termasuk penolakan selisih area outline di atas 10% pada fixture buatan. Hasil ini **bukan** sertifikasi batas kabupaten/kota.

Pengujian browser memerlukan Playwright: [panduan browser](prototypes/BROWSER_TESTING.md). Workflow CI terbatas pada branch lab sudah dilengkapi pemeriksaan isolasi source dan laporan Playwright, tetapi **hasil run belum terverifikasi**. Tidak ada auto-deploy atau pengujian produksi. Jangan mengklaim browser lulus tanpa hasilnya.

## Kriteria pemisahan

- **Branch:** `lab/augma-inspired-experiments`. Source aplikasi, tes, data demo, dan dokumentasi berada pada `experiments/augma-inspired/`. Satu pengecualian terkontrol: workflow validasi di `.github/workflows/yandik-innovation-lab-ci.yml` **hanya pada branch lab**, bukan main/develop, dan tidak memiliki langkah deployment.
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
- [Pengambilan kandidat data BNPB secara manual dan baca-saja](tools/BNPB_ACQUISITION.md)
- [Pengujian browser](prototypes/BROWSER_TESTING.md)
- [Hasil validasi dan batasan](VALIDATION_EVIDENCE_2026-11-23.md)
- [Status QA dan gerbang rilis](docs/QA_GATE_STATUS_2026-11-23.md)
- [Workflow CI terisolasi](../../.github/workflows/yandik-innovation-lab-ci.yml)

**Status:** fondasi eksperimen, dashboard simulasi 19 unit x 12 bulan, auditor geometri, pengambil kandidat BNPB yang memeriksa kestabilan ID, dan workflow tes branch lab tersedia. Hasil CI/browser masih harus dilihat; verifikasi ADM2 sungguhan dan uji STB fisik tetap terbuka. Tidak ada perubahan ke produksi.
