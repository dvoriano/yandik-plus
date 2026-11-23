# M05-12 | Checklist Kesiapan Rilis & Rollback APEL 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.**

Modul ini menulis **kontrak pemeriksaan Go/No-Go dan prosedur pemulihan konseptual**, bukan menyiapkan deployment. Berkas berada di `drafts/` dan tidak memiliki koneksi ke VPS, Flask, database, website, GitHub Actions, atau data resmi APEL.

- `readiness.mjs`: 18 kontrol sebelum perubahan produksi, 5 gerbang `NO_GO`. Mewarisi prasyarat staging M05-11 yang tetap `BLOCKED`; memisahkan izin uji, akses sistem, otorisasi perubahan produksi, dan izin publikasi. `decision=NO_GO_UNAUTHORIZED_UNTESTED`.
- `rollback.mjs`: 11 kondisi penghentian yang perlu dikaji (termasuk selisih jumlah layanan, data hilang berubah menjadi nol, duplikasi kejadian/hewan, perubahan riwayat wilayah, masalah keamanan) dan 10 langkah pemulihan manusia. Tidak ada nilai ambang yang dikarang, tidak ada script restore, log insiden asli, perintah server, atau tindakan rollback.
- `handoff.mjs`: catatan review DEMO yang hanya dapat meminta klarifikasi/bukti dan 8 slot dokumen yang **belum tersedia**. Paket akhir `NON_OPERATIONAL_NO_GO_HANDOFF` tidak bisa menyetujui rilis atau memulai perubahan.
- `tests/release.test.mjs`: **50 QA tertulis, 0 dijalankan**, tidak ada hasil PASS.

**Pemisahan keputusan:** otorisasi rilis harus berbeda dari izin menjalankan QA, izin mengakses sumber/staging, approval pemilik data, izin publikasi, dan hak menjalankan rollback oleh operator. Tidak ada persetujuan yang dapat lahir dari metadata `DEMO-`.

Semua ID fixture `DEMO-` dan seluruh status kegunaan aktual tetap `false`. Tidak ada nama petugas nyata, kredensial, IP privat, source dump, dokumentasi internal sensitif atau bahan resmi dinas di repository PUBLIC.

[Spesifikasi M05-12](../../docs/M05_12_RELEASE_READINESS_ROLLBACK_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md)

**M05-13 (RENCANA):** rancangan observabilitas dan audit trail pasca-perubahan (log kesehatan layanan, keselamatan data, eskalasi), tetap sebagai skema DEMO tanpa koneksi, notifikasi atau pengujian.
