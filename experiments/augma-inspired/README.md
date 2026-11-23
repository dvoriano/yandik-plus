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

Pengujian browser menggunakan Playwright: [panduan browser](prototypes/BROWSER_TESTING.md). [GitHub Actions run #45113635452](https://github.com/dvoriano/yandik-plus/actions/runs/45113635452) **berhasil** pada commit `2d098d0`: **21 tes Python, 31 tes unit JavaScript, dan 13 tes Chromium** lulus. Ini bukti prototipe berbasis data sintetis, **bukan** sertifikasi peta resmi, pengujian perangkat fisik, atau izin deployment. Tidak ada auto-deploy maupun pengujian produksi.

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
- [Protokol review paket GeoJSON BIG 2026 dan checksum](docs/ADM2_2026_REVIEW_PROTOCOL.md)
- [Checklist kesiapan STB/laptop uji (read-only)](docs/STB_READONLY_ACCEPTANCE.md)
- [Lisensi, privasi, isolasi](docs/SAFETY_AND_LICENSE.md)
- [Pengambilan kandidat data BNPB secara manual dan baca-saja](tools/BNPB_ACQUISITION.md)
- [Pengujian browser](prototypes/BROWSER_TESTING.md)
- [Hasil validasi dan batasan](VALIDATION_EVIDENCE_2026-11-23.md)
- [Status QA dan gerbang rilis](docs/QA_GATE_STATUS_2026-11-23.md)
- [Tes keyboard, aksesibilitas dan ketahanan jaringan](docs/ACCESSIBILITY_NETWORK_RESILIENCE.md)
- [Bukti 23 tes Python dan 6 tes Node lokal](docs/LOCAL_TEST_EVIDENCE_2026-11-23.json)
- [Workflow CI terisolasi](../../.github/workflows/yandik-innovation-lab-ci.yml)

**Status:** fondasi eksperimen dan simulasi 19 unit × 12 bulan tersedia. **CI Python, JavaScript, dan Chromium lulus** pada run #45113635452. Data ADM2 resmi/izin pakai, validasi GIS, pengujian STB fisik, dan keputusan integrasi **masih terbuka**. Tidak ada perubahan ke produksi.
