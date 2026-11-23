# M05-11 | Protokol Otorisasi Staging & Paket Bukti Regresi APEL 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.**

Tujuan modul ini adalah **mendefinisikan persyaratan sebelum pengujian diizinkan**, bukan mengaktifkan pengujian. Penggunaan kata *staging* adalah rancangan, bukan bukti lingkungan staging sudah tersedia.

- `protocol.mjs`: 14 kontrol kesiapan mulai dari **izin eksplisit pemilik proyek untuk keluar dari CODE_ONLY**, **izin terpisah pemilik sistem/sumber data**, pemisahan lingkungan staging-produksi, keamanan dan RBAC, minimisasi data sintetis, backup/recovery, schema, Juknis, kebijakan 2026–2030, sampai keputusan publikasi yang mandiri. Ia memakai rancangan M05-10 sebagai sumber 22 kasus 2026 atau 20 kasus per tahun 2027–2030. Setiap kontrol `BLOCKED_NO_REAL_EVIDENCE`.
- `review.mjs`: hanya catatan klarifikasi dan kekurangan DEMO dengan `DEMO-` ID. Satu catatan tidak dapat mengesahkan bukti atau memberi izin.
- `packet.mjs`: format 12 kebutuhan artefak masa depan seperti surat izin, sumber acuan, daftar pengendalian akses, log eksekusi, laporan selisih, tanggapan insiden, serta verifikasi independen. **Semua artefak `NOT_PROVIDED`** dan semua kasus `NOT_RUN`. Enam gerbang M05-8 tetap BLOCKED.
- `tests/protocol.test.mjs`: **50 skenario QA ditulis, 0 dijalankan**. Tidak ada hasil lulus maupun gagal.

**Pemisahan kewenangan:** permintaan menulis kode **bukan izin menguji**; izin pengujian **bukan izin mengakses database**; izin akses staging **bukan izin memodifikasi sumber**; hasil uji internal **bukan izin publikasi**. Kontrak DEMO tidak dapat menaikkan statusnya sendiri.

Batas keamanan: repo PUBLIC tidak boleh berisi dokumen kedinasan asli, data pribadi atau kesehatan hewan, nama pejabat penandatangan, kredensial, dump database, token, alamat server privat, atau snapshot riil. Tidak ada SQL, HTTP, SSH, I/O, browser, GitHub Actions, CL/CI, test run, penerapan database, auto-repair, scoring, rangking, deployment, ataupun merge.

[Spesifikasi M05-11](../../docs/M05_11_STAGING_AUTHORIZATION_REGRESSION_2026_2030.md) · [Backlog QA](../../docs/TEST_BACKLOG.md)

**M05-12 (RENCANA):** rancangan *release/rollback readiness checklist* dan batas pemisahan operasi sebelum menyentuh integrasi, tetap berupa kode/dokumen DEMO tanpa test-run atau akses produksi.
