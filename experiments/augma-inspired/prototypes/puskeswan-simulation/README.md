# Simulasi Pelaporan Puskeswan (Experiment 04)

**LAB TERISOLASI · 100% DATA FIKTIF · TANPA API PRODUKSI**

Dashboard ini ditujukan untuk membuktikan desain alur pengawasan dan pelaporan, **bukan** membaca capaian APEL atau menggambarkan jumlah Puskeswan yang sebenarnya.

## Data dan batasannya

- **19 unit imajiner** (satu per kabupaten/kota) dan 12 bulan tahun 2026 = **228 catatan sintetis** yang dibuat secara deterministik.
- Status *belum lapor* bernilai `null`, dibedakan dari laporan yang **tersedia** dengan pelayanan `0`.
- Tenggat tanggal 9 hanya digunakan dalam skenario contoh, bukan penilaian resmi.
- Seluruh tampilan dan CSV mencantumkan label fiktif. Tak ada URL jaringan produksi, akun, token, data penyakit, atau lokasi fasilitas riil.
- Jika difilter hingga tidak ada unit, rasio melapor `null`, bukan otomatis 0%.

## Jalankan dan uji

Dari direktori `experiments/augma-inspired/prototypes/`:

```sh
python3 -m http.server 8767 --bind 127.0.0.1
# buka http://127.0.0.1:8767/puskeswan-simulation/
node --test puskeswan-simulation/tests/core.test.mjs
```

Pengujian browser (perlu `@playwright/test` dan Chromium):

```sh
npm run test:browser
```

Termasuk filter kabupaten/kota, pencarian nama/ibu kota, status belum lapor/terlambat/tepat waktu, tren 12 bulan, daftar tindak lanjut, detail wilayah, dan **ekspor CSV fiktif**.

Semua ini berdiri sendiri di branch `lab/augma-inspired-experiments`. Tidak ada penggabungan atau deployment otomatis. Pengujian dan evaluasi perlu diselesaikan sebelum konsepnya dinilai layak sebagai fitur operasional YANDIK+.
