# Akuisisi kandidat ADM2 BNPB (uji lokal, tidak otomatis)

Modul `fetch_bnpb_adm2.py` adalah pengambil data **baca-saja** dari satu endpoint publik yang telah dibatasi:

- Layanan: https://gis.bnpb.go.id/server/rest/services/Hosted/DATA_KABKOT_SUMBAR1/FeatureServer/5
- Layer: `DATA_KABKOT_SUMBAR`, geometri Polygon, referensi koordinat EPSG:4326, dan dukungan query GeoJSON.
- Atribut minimal yang diperiksa: `fid`, `kdpkab`, `namobj`, `wadmkk`.
- Tanggal kajian metadata: 23 November 2026. Perubahan layanan dapat menyebabkan pengambilan ditolak.

**Layanan publik bukan berarti geometri dapat langsung didistribusikan atau dianggap sebagai batas hukum.** Hak guna, ketelitian, dan penetapan batas wajib diperiksa tersendiri. Tidak ada data BNPB yang disalin ke GitHub oleh proses ini.

## Cara menjalankan pada komputer uji (bukan VPS produksi)

Dibutuhkan Python 3.10+, Shapely 2+, akses internet yang diizinkan, serta folder di luar repo. Dari folder `experiments/augma-inspired/`:

```sh
python3 -m pip install shapely

# Tanpa opsi --fetch-public-bnpb: tidak ada akses jaringan
python3 tools/fetch_bnpb_adm2.py \
  --fetch-public-bnpb \
  --output-dir /tmp/yandik-sumbar-gis-review-2026-11
```

Proses melakukan:

1. Meminta metadata layanan dan menolak layer atau atribut yang berubah.
2. Meminta daftar ID, lalu membaca geometri dalam batch kecil melalui HTTPS host BNPB saja.
3. Menolak data yang tidak tepat 19 fitur/identitas unik, nama-kode tidak cocok, atau `fid` respons tidak sesuai ID yang diminta; memeriksa ulang seluruh objectId setelah pengambilan untuk mendeteksi perubahan selama pagination.
4. Menjalankan auditor Shapely terhadap geometri dan outline pembanding jika tersedia.
5. **Hanya setelah pemeriksaan teknis lulus**, menulis `sumbar-adm2-bnpb-candidate.geojson` dan `manifest.json` di folder uji yang ditentukan.

Jika jumlah objek, kode, bentuk, atau geometri tidak cocok, proses **gagal tertutup**, tidak mengarang/padankan kode, dan tidak menulis kandidat sebagai hasil lulus. Output tidak ditimpa bila folder sudah memiliki file target. Total respons jaringan dan ukuran per respons dibatasi.

## Makna hasil

- `PASS_TECHNICAL_NOT_CERTIFIED`: auditor geometri lulus pemeriksaan keras; **belum** menyatakan akurat secara hukum/geografi, belum memvalidasi lisensi.
- `FAILED_CLOSED` atau `REJECTED`: kandidat perlu investigasi lebih lanjut.
- Tidak memperoleh geometri: **status masih pending**, bukan berarti semua batas sudah diverifikasi.

## Tes tanpa jaringan

```sh
python3 -m unittest discover -s tools/tests -v
```

Termasuk lima tes auditor Shapely dan sembilan skenario pengambil BNPB dengan sumber sintetis/mock. Workflow branch lab juga disiapkan; hasil run tidak boleh dianggap lulus sebelum ada bukti. Tidak mengakses endpoint sebenarnya selama tes. Tes yang ditambahkan tidak otomatis berjalan di GitHub Actions.

## Catatan penerapan

Sebelum menggunakan kandidat pada sistem resmi: pastikan izin penggunaan dan atribusi, cocokkan dengan referensi BIG/Kemendagri versi yang berlaku, tinjau Mentawai serta garis pantai/perbatasan di GIS, simpan dokumentasi sumber, lalu lakukan review kelembagaan. Jangan menggunakan skrip ini di server atau perangkat kantor tanpa otorisasi pengelola.
