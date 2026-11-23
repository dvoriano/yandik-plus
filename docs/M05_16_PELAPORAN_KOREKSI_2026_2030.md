# M05-16 | Pelaporan dan Koreksi dengan Konteks Profil/SDM, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | BUKAN PRODUKSI.**

## Fungsi draft
- [Model projection](../drafts/m05-report-correction/correction.mjs) membaca status dari kontrak M05-1 melalui fungsi \`readDemoWorkflow\`; tidak menjalankan command, menyimpan, menghapus, mengesahkan, atau mengubah ledger.
- [Fixture sintetis](../drafts/m05-report-correction/fixtures.mjs): contoh Alpha (kirim → koreksi → revisi → kirim ulang), Beta (draf), Gamma (dikembalikan). Semua petugas, unit, wilayah dan data fiktif.
- [24 skenario QA tertulis](../drafts/m05-report-correction/tests/correction.test.mjs), **0 dijalankan**. Dilarang menyebut PASS sebelum tes.
- Tahun dipilih dari \`YYYY-MM\` dan harus 2026–2030. Filter fasilitas/wilayah konsisten dengan M05-15. Satu fasilitas/bulan, revision dan peristiwa dikaitkan menurut kontrak M05-1.

## Aturan presentasi yang tidak boleh hilang

| Kondisi | Makna | Bukan |
|---|---|---|
| \`NOT_STARTED_DEMO\` | Belum ada record pada workflow contoh | Pelayanan atau volume = 0 |
| \`DRAFT\` | Draf hanya disimpan di workflow sintetis | Laporan sudah dikirim |
| \`SUBMITTED_REVIEW_PENDING\` | Contoh laporan terkirim menunggu telaah | Sudah benar/diterima |
| \`CORRECTION_REQUESTED\` | Contoh dikembalikan untuk klarifikasi | Dokumen ditolak resmi |
| \`REVISION_DRAFT\` | Revisi dibuat setelah dikembalikan | Laporan baru disahkan |

Histori keluar hanya sebagai **aksi, revisi dan status**. Catatan koreksi, identitas akun, ID permintaan, dan payload layanan tidak ditampilkan. Jumlah layanan pengiriman terakhir tetap \`activity_count_last_submitted_demo\` (historis, belum diverifikasi); \`activity_count_currently_verified\` selalu \`null\`.

M05-14 memakai ledger M05-0, sementara workflow M05-1 memakai sumber simulasi lain. Kedua sumber **belum direkonsiliasi** dan dilarang disimpulkan sama, atau dipakai sebagai dasar skor, ranking, ketepatan waktu maupun publikasi.

## Gerbang lanjut
- Verifikasi sumber data dan Juknis, identitas Puskeswan, pembatasan hak akses server, audit peristiwa, transaksi dan konflik revisi.
- Uji 24 QA kontrak ini, regresi M05-1/M05-15 dan validasi privasi/UI hanya dengan izin.
- Draf M05-17 memakai hasil baca-saja ini untuk bahan pembinaan, bukan keputusan/penugasan resmi.

**Tidak ada** akses Flask/API/DB/VPS/website, pengiriman dokumen, keputusan pejabat, pengujian otomatis maupun deployment. Tahap **CODE WRITTEN, NOT TESTED**.
