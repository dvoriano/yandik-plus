# M05-12 | Checklist Kesiapan Rilis dan Rollback APEL 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Seluruh hasil merupakan desain DEMO, **bukan dokumen otorisasi rilis, bukti backup berhasil, prosedur restore yang telah diuji, atau hasil perubahan produksi**.

## 1. Tujuan dan batas
Melengkapi M05-10 (matriks 23 kriteria paritas) dan M05-11 (14 kontrol staging dan 12 kebutuhan bukti regresi) agar kelak tersedia daftar pemeriksaan sebelum integrasi/perubahan sistem boleh diterapkan, beserta prosedur penanganan bila penerapan gagal. M05-8 masih memiliki **enam gerbang BLOCKED**, sedangkan M05-11 masih **0 pengujian dijalankan** dan tidak memiliki bukti izin akses atau staging nyata.

Dokumen ini tidak mengubah batas CODE_ONLY. Hanya kode dan test plan yang ditulis di GitHub PUBLIC. Tidak ada akses database, VPS, Flask, source service, deploy, merge, CI/CL, browser, pengujian, scoring atau publikasi.

## 2. Delapan belas kontrol kesiapan rilis

| Kelompok | Pemeriksaan yang harus dibuktikan kelak |
|---|---|
| OWNER_CHANGE_AUTHORITY | Persetujuan perubahan oleh pemilik proyek sesuai ruang lingkup |
| SYSTEM_PRODUCTION_AUTHORITY | Izin produksi tersendiri dari pemilik/pengelola sistem |
| INDEPENDENT_RELEASE_REVIEW | Telaah independen hasil uji, risiko dan pengecualian |
| STAGING_PARITY_COMPLETE | Bukti parity staging dan Juknis aktual telah diperiksa |
| ANNUAL_POLICY_APPROVED | Dasar kebijakan setiap tahun (2026–2030) telah ditetapkan |
| SCHEMA_MIGRATION_REVIEW | Kompatibilitas schema, migrasi dan rollback data ditelaah |
| SOURCE_PROVENANCE_READY | Asal sumber, snapshot konsisten dan otorisasi dicek |
| RBAC_SECRETS_SECURITY | Kontrol akses, keamanan, privasi dan kepemilikan credential |
| PRODUCTION_BACKUP_VERIFIED | Backup aktual diverifikasi dan dapat dipulihkan |
| ROLLBACK_PLAN_APPROVED | Strategi pemulihan dan uji restore disahkan terpisah |
| MAINTENANCE_WINDOW | Waktu serta lingkup perubahan disetujui |
| OBSERVABILITY_BASELINE | Kondisi awal, log, metrik, alert disiapkan |
| HEALTHCHECK_CRITERIA | Cara menilai keberhasilan dan kondisi penghentian jelas |
| ONCALL_ESCALATION | Petugas berwenang dan eskalasi ditetapkan secara formal |
| DATA_INTEGRITY_GUARD | Tidak ada selisih salah, duplikasi, kehilangan data, salah histori |
| DEPENDENCY_COMPATIBILITY | Dampak runtime, library, API, reverse proxy dan integrasi diperiksa |
| COMMUNICATION_AND_SUPPORT | Komunikasi dan dukungan pada pengguna telah diatur |
| PUBLICATION_SEPARATION | Pelaporan/publikasi hanya dengan izin tersendiri |

**Saat ini: 18/18 kontrol BLOCKED, 5/5 gerbang NO_GO.** Tidak ada signoff, bukti backup, izin produksi atau data sumber terverifikasi. `NO_GO` adalah proteksi kode DEMO, **bukan keputusan resmi pejabat**.

## 3. Sebelas pemicu penghentian konseptual
- Ketidakcocokan integritas sumber dan perubahan jumlah pelayanan yang tidak bisa dijelaskan.
- Bulan `UNKNOWN` atau `NOT_REPORTED` yang keliru menjadi `OBSERVED_ZERO`.
- Duplikasi kejadian investigasi/lokasi atau hewan pada pemeriksaan kurban.
- Revisi pelayanan/workflow dan riwayat wilayah yang tidak sesuai periode.
- Versi kebijakan tahunan tidak sah atau digunakan pada tahun lain.
- Insiden hak akses, kredensial, kebocoran atau kehilangan/kerusakan data.
- Kegagalan pemeriksaan kesehatan layanan, atau ternyata tidak ada jalur restore yang terverifikasi.

Kesebelas pemicu ada di `rollback.mjs` sebagai **kategori**, bukan pendeteksi real-time. Ambang, nilai observasi, pemantauan, owner insiden dan evaluasi keamanan **belum ditetapkan**.

## 4. Sepuluh langkah rollback konseptual
1. Hentikan perubahan sesuai prosedur dan kewenangan yang sah.
2. Catat insiden lewat mekanisme resmi.
3. Beritahu penanggung jawab/eskalasi yang telah ditunjuk.
4. Amankan log dan bukti serta baseline yang memang boleh diakses.
5. Periksa ruang lingkup dan integritas titik pemulihan.
6. Dapatkan keputusan rollback yang terpisah.
7. Operasi restore hanya boleh dikerjakan operator berwenang di luar modul ini.
8. Verifikasi ulang integritas data, angka pelayanan dan kondisi layanan.
9. Komunikasikan hasil dan pantau stabilitas sesuai durasi yang disetujui.
10. Dokumentasikan hasil serta penutupan insiden melalui keputusan resmi.

Semua `operation_status=NOT_RUN`, `restore_point=null`, `backup_verified=false`, dan `authorized_rollback=false`. Tidak ada skrip, parameter, kredensial ataupun perintah yang dapat melakukan restore.

## 5. Paket serah-terima dan gerbang keputusan
`handoff.mjs` hanya menyusun delapan kebutuhan dokumen kosong: izin perubahan, hasil regresi resmi, rencana perubahan, kajian keamanan, hasil uji restore, pemeriksaan sebelum/sesudah, penanganan insiden, dan persetujuan terpisah. Catatan review menggunakan ID fiktif dan kode alasan, bukan teks sensitif.

Semua output tetap `NO_GO_UNAUTHORIZED_UNTESTED`. `may_run_tests`, `may_connect`, `may_query`, `may_write`, `may_migrate`, `may_release`, `may_rollback`, `may_restart`, `may_score`, `may_rank`, `may_award`, `may_publish`, `may_merge`, dan `may_deploy` bernilai false.

## 6. Hasil GitHub dan backlog uji
- [Checklist rilis DEMO](../drafts/m05-apel-release-readiness/readiness.mjs)
- [Rencana rollback non-eksekusi](../drafts/m05-apel-release-readiness/rollback.mjs)
- [Review dan handoff NO_GO](../drafts/m05-apel-release-readiness/handoff.mjs)
- [50 QA tertulis](../drafts/m05-apel-release-readiness/tests/release.test.mjs), **0 dijalankan**
- [README](../drafts/m05-apel-release-readiness/README.md)
- [TEST_BACKLOG](TEST_BACKLOG.md)

**M05-13 (RENCANA):** model observabilitas dan audit trail pascarilis, daftar kondisi layanan serta mekanisme eskalasi yang aman, tetap CODE_ONLY dan DEMO.
