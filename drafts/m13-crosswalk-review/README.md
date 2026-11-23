# M13-S3 | Catatan Telaah Kandidat APEL ↔ Surveilans DEMO

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | NO GOVERNMENT APPROVAL.**

Mengembangkan M13-S2 dengan **catatan telaah manusia secara in-memory**. Tidak ada persistence, API, autentikasi produksi, integrasi iSIKHNAS, tanda tangan, atau perubahan ledger APEL.

- Source M13-S2 dan snapshot APEL divalidasi ulang sebelum membaca/menambah catatan.
- Peran *verifikator provinsi* sintetis dipisahkan dari pengusul; callback sesi reviewer wajib datang dari server terpercaya pada implementasi nantinya.
- Empat hasil diskusi internal: \`REQUEST_EVIDENCE_DEMO\`, \`POSSIBLY_RELATED_DEMO\`, \`DISTINCT_RECORDS_DEMO\`, \`REOPEN_DEMO\`. **Tidak satu pun membuktikan kejadian nyata yang sama atau legalitas hasil**.
- Digest SHA-256 atas candidate, sumber surveilans, dokumen APEL dan revisi manifest digunakan untuk **mendeteksi perubahan source saat catatan lama dibaca**. Digest fixture ini **bukan** bukti keaslian sumber, tidak ditandatangani, dan dapat dibuat ulang oleh siapa pun.
- Log append-only dalam memori, revision check, status berkode tanpa teks bebas, actor tidak dimasukkan ke board keluaran. Penyimpanan riil, penentuan peran, dan audit belum dibangun.
- \`tests/review.test.mjs\`: **28 skenario QA tertulis, 0 dijalankan**.

[Spesifikasi](../../docs/M13_S3_MANUAL_REVIEW_CROSSWALK_DEMO_2026_2030.md) · [Backlog](../../docs/TEST_BACKLOG.md).
