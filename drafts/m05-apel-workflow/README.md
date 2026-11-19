# M05-1 | Alur Draf, Kirim, Koreksi APEL 2026–2030 (DEMO)

**KODE DITULIS, BELUM DIUJI (CODE_ONLY).** Seluruh orang, wilayah dan Puskeswan fiktif. Tidak ada autentikasi, endpoint Flask, database, file bukti, pengesahan laporan, klasemen atau deployment riil.

- `workflow.mjs`: alur `create_draft → save_draft → submit → return_correction → revise_draft → resubmit`.
- Draf dapat menyimpan `null` untuk angka yang belum lengkap; **submit** baru menerima payload lengkap dari `normalizeDemoReport` M05-0. Data kosong bukan nol.
- Kunci induk tetap `(facility_id, YYYY-MM)` untuk 2026–2030. Perbaikan menaikkan revisi tanpa membuat laporan bulanan baru; snapshot pengiriman lama tetap di event terdahulu.
- Setiap perintah memerlukan `request_id` unik, `expected_revision`, serta identitas dari **callback sesi backend**. Tidak menerima actor/role/wilayah klien sebagai perintah.
- Petugas Puskeswan atau admin provinsi DEMO menyusun/mengirim draf. Verifikator provinsi atau kab/kota yang berwenang hanya **mengembalikan untuk diperbaiki**, bukan mengesahkan.
- Metadata bukti hanya `DEMO-...`. Event hanya dalam memori, belum merupakan audit yang aman atau tahan perubahan. Callback identitas/scope wajib dari host tepercaya; ini **tidak membuktikan** autentikasi yang sungguhan.
- Status `SUBMITTED_REVIEW_PENDING` bukan verifikasi atau publikasi. Semua hasil `may_score:false` dan `may_publish:false`.

`fixtures.mjs` memuat akun/wilayah fiktif dan pembantu perintah. `tests/workflow.test.mjs` berisi **19 skenario tertulis, 0 dijalankan**, tanpa CL/CI.

[Spesifikasi M05-1](../../docs/M05_1_APEL_REPORT_WORKFLOW_2026_2030.md) · [M05-0](../../docs/M05_0_APEL_MULTIYEAR_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
