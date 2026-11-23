# M05-8 | Evidence Register, Review Notes & Readiness Gates APEL 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.**

Modul ini menyusun *format calon bukti dan catatan telaah*, bukan menghubungkan atau mengesahkan sumber resmi. Input hanya metadata ID sintetis berawalan `DEMO-`, tanpa nama orang asli, isi dokumen, kredensial atau data operasional. File ini tidak terhubung ke Flask, API, DB atau website produksi.

- `evidence.mjs`: katalog **14 persyaratan**, metadata calon bukti, penanggung jawab **peran konseptual**, jenis bukti dan keluarga sumber. Calon bukti selalu `DEMO_UNVERIFIED` dan tidak dapat ditandai sah.
- `review.mjs`: catatan telaah contoh terhadap calon bukti dan alasan kode. Hasil `DEMO_NOTES_RECORDED_NOT_VERIFIED` **bukan** verifikasi, persetujuan pemilik data, keputusan pejabat atau pengesahan dokumen.
- `gates.mjs`: paket keterbacaan untuk **enam gerbang** sumber/scope, schema/grain, rekonsiliasi/histori, policy/dukungan, keamanan/staging, dan publikasi. Semua gerbang **BLOCKED** karena otoritas resmi dan bukti yang diperlukan belum ada. Bisa menerima ringkasan konflik **DEMO** dari M05-7, tetapi catatan telaah tidak menyelesaikan konflik otomatis.

Kontrak ini memisahkan empat hal: *calon metadata bukti* ≠ *catatan review* ≠ *verifikasi sumber yang dapat dipertanggungjawabkan* ≠ *otorisasi integrasi/publikasi*. Nilai `may_connect`, `may_query`, `may_write`, `may_repair`, `may_score`, `may_publish`, `official_authorization` selalu false. Paket readiness juga melarang `may_run_tests`, `may_merge` dan `may_deploy`.

**49 QA ditulis, 0 dijalankan:** `tests/evidence.test.mjs`. Tidak ada penilaian lulus. Baca [spesifikasi](../../docs/M05_8_EVIDENCE_REVIEW_GATES_2026_2030.md) dan [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).

**Tahap berikut M05-9 (RENCANA):** skema *manual reconciliation decision register* dan paket persiapan validasi tanpa akses data resmi. Data dictionary dan izin pengelola tetap harus dipenuhi sebelum uji/integrasi nyata.
