# M00-G4 | Gerbang Persyaratan Izin Sumber dan Identitas Server, 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | DEMO ONLY.**

## Hasil kode
- [Model pemeriksaan kesiapan](../drafts/m00-source-readiness/readiness.mjs) dan [fixture sintetis](../drafts/m00-source-readiness/fixtures.mjs) disimpan di branch pengembangan.
- [22 QA tertulis](../drafts/m00-source-readiness/tests/readiness.test.mjs), **0 dijalankan**.
- Kontrak membaca [manifest M00-G2](M00_G2_SOURCE_API_BOUNDARY_2026_2030.md) dan membatasi pembacaan daftar persyaratan ke peran pengelola/verifikator provinsi DEMO. Callback sesi belum menjadi autentikasi backend sah.

## Tujuh pemeriksaan sebelum sumber resmi boleh dipertimbangkan
| Tema | Keputusan yang harus dibuat manusia |
|---|---|
| Otorisasi pemilik sumber | Siapa pengampu, tujuan dan bentuk izin tertulis |
| Tujuan/minimalisasi | Data apa yang dibutuhkan dan batas pemanfaatan |
| Klasifikasi | Identitas, lokasi penyakit, data sensitif dan publikasi |
| Metode transfer | Jalur API/ekspor resmi dan mekanisme pengamanan |
| Retensi/penghapusan | Jangka simpan, koreksi dan penghapusan yang sah |
| Identitas server | Sesi aman, revokasi, scope objek/wilayah, CSRF, no default password |
| Audit/insiden | Tanggung jawab, jejak akses, pemulihan dan notifikasi insiden |

Model **hanya** mengenal NOT_REVIEWED_DEMO dan DRAFTED_UNVERIFIED_DEMO. Status APPROVED atau nomor izin eksternal ditolak. Ketika ketujuhnya telah berstatus 'drafted', izin resmi **tetap false**, koneksi real **tetap dilarang**.

## Batas implementasi
- Tidak menghubungi pengelola iSIKHNAS, mengirim permohonan izin, memverifikasi surat, membuat autentikasi Flask, atau menyimpan data asli.
- Tidak memiliki endpoint HTTP, kredensial, sistem akses produksi, audit API atau database.
- Daftar ini **bukan pengesahan kelembagaan**. Pengampu proses dan pemilik data harus menetapkan kebijakan/izin sesuai ketentuan sebelum koneksi.

**Status:** CODE_WRITTEN_NOT_TESTED, SOURCE_PERMISSION_NOT_GRANTED, PRODUCTION_NO_GO.

## Lanjutan kontrak M00-G6
[Factory adaptor Flask baca-saja DEMO](M00_G6_FLASK_ADAPTER_DEMO_2026_2030.md) ditulis, **25 QA tertulis, 0 dijalankan**. Route masih belum didaftarkan; tidak menandai bahwa sumber sudah mendapat izin.
