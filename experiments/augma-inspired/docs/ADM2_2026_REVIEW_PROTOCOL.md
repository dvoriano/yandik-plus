# Protokol review sumber peta ADM2 Sumatera Barat (2026)

> **LAB ONLY.** Sumber geografi dan pemeriksaan teknis tidak otomatis menjadi batas hukum, data resmi siap pakai, atau izin redistribusi.

## Kandidat prioritas

1. **BIG, edisi 2026:** [BATAS_KABKOTA_AR_2026](https://data.go.id/dataset/dataset/batas_kabkota_ar_2026), dipublikasikan 21 Agustus 2026. Deskripsi menyatakan edisi Juni 2026, dengan metadata penting mengenai pemutakhiran garis pantai. Terdapat teks yang menyebut pembaruan dari Desember 2026, walau dipublikasikan Agustus 2026. **Tanggal edisi perlu dikonfirmasi oleh pemilik data.**
2. **BIG GeoServices:** [Area Batas Wilayah Administrasi Kabupaten/Kota](https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0), geometri poligon, EPSG:4326, atribut `WADMPR`, `WADMKK`, `KDPKAB`, dan identitas lain. Data nasional belum berarti sudah difilter tepat 19 kabupaten/kota.
3. **BNPB, sumber pembanding historis:** [DATA_KABKOT_SUMBAR1 layer 5](https://gis.bnpb.go.id/server/rest/services/Hosted/DATA_KABKOT_SUMBAR1/FeatureServer/5). Metadata layanan dapat dibaca, tetapi hasil query aktual, topologi, dan izin belum diverifikasi untuk paket ini.

**Status pada 23 November 2026:** belum ada GeoJSON ADM2 19 wilayah yang terbukti lengkap, mendapat izin pakai, dan diperiksa SIG di dalam lab. Tidak ada unduhan geometri resmi yang di-commit.

## Alur yang dapat dijalankan pada komputer uji terotorisasi

1. Periksa syarat akses, hak guna, hak distribusi, metadata edisi, dan pemilik dataset. Dapatkan paket secara sah, secara manual di luar repository, bukan dari jaringan internal kantor.
2. Simpan file asli dan manifest metadata dalam folder uji di luar GitHub. Hitung SHA256 byte file asli. Jangan menaruh token, cookie, email pribadi atau nama petugas di manifest publik.
3. Cocokkan 19 kode/identitas wilayah dengan registry lokal, cek 12 kabupaten/7 kota, ring poligon, overlap, selisih outline serta Kepulauan Mentawai.
4. Jalankan pemeriksa manifest dan geometri baca-saja:
   
   ```sh
   cd experiments/augma-inspired
   python3 tools/review_adm2_package.py /path/local/sumbar-adm2.geojson \
     --manifest /path/local/manifest.json \
     --registry prototypes/geo-command-center/regions.mjs \
     --outline prototypes/geo-command-center/data/sumbar-outline.geojson
   ```

5. Bila mendapat `TECHNICAL_PASS_REVIEW_REQUIRED`, berarti hanya checksum, metadata awal, dan pemeriksaan geometri teknis lulus. Tetap harus melakukan penilaian lisensi, koreksi sumber, kesesuaian batas, versi referensi serta persetujuan operasional sebelum integrasi.

Template `manifest.json` lokal berikut belum merupakan bukti unduhan:

```json
{
  "source": "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0",
  "publisher": "Badan Informasi Geospasial",
  "dataset_version": "TULIS_EDISI_TERVERIFIKASI",
  "retrieved_utc": "2026-11-23T05:00:00+00:00",
  "sha256": "GANTI_DENGAN_64_KARAKTER_SHA256_FILE_ASLI",
  "source_license_status": "NOT_VERIFIED",
  "legal_boundary_status": "NOT_VERIFIED"
}
```

Manifest yang memakai URL dengan query atau kredensial ditolak agar tidak sengaja menyimpan token. `source_license_status` tidak otomatis mengesahkan izin dan bahkan klaim `release_approved` di manifest tidak akan mengaktifkan rilis.

## Gerbang yang masih terbuka

- [ ] Mengambil kandidat berizin dengan sumber, checksum, edisi, dan atribusi yang terdokumentasi.
- [ ] Memastikan geometri 19 unit dan memeriksa topologi, pulau kecil, pesisir, serta selisih antar edisi di QGIS.
- [ ] Menentukan kebijakan penyimpanan, penggunaan, dan redistribusi instansi.
- [ ] Mendapat persetujuan tata kelola untuk pemanfaatan di luar lab.

Skrip dan tes memakai data sintetis tanpa akses ke APEL, Puskeswan, VPS, atau layanan produksi.

## Additional input safety checks

The offline reviewer now rejects local/private or loopback source URLs in the manifest, including nonpublic IPs, `.local`/`.internal` hostnames, unqualified hostnames, and embedded control characters. Symlinked input paths are rejected before opening files. These checks help prevent confusing a private endpoint or a redirected file with an authorized public dataset; they do **not** prove licensing or source authenticity. Two regression tests were added. A full CI run for these changes remains pending at this documentation update.

## Pemeriksaan metadata BIG sebelum berkas geometri

Pemeriksaan tambahan telah disiapkan dalam [BIG 2026 metadata preflight](BIG_2026_METADATA_PREFLIGHT.md). Kode `tools/check_big_adm2_metadata.py` hanya membaca file JSON layer secara lokal dan tidak melakukan panggilan jaringan. **12/12 tes offline BIG lulus dan seluruh suite Python 54/54 lulus lokal**. Kode tersebut belum memverifikasi data BIG yang diunduh langsung; izin, edisi yang kontradiktif pada portal, dan 19 poligon aktual tetap memerlukan review khusus.
