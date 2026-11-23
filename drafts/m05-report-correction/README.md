# M05-16 | Pelaporan & Koreksi berbasis konteks DEMO 2026–2030

**KODE DITULIS, BELUM DIUJI.** Hanya pemodelan baca-saja di GitHub.

\`correction.mjs\` menyusun konteks gabungan M05-1 (draf/submit/koreksi/revisi), M05-15 (Profil/SDM DEMO), dan M05-14 (dashboard DEMO) tanpa menulis, mengirim atau mengubah ketiganya. Sumber M05-1 memerlukan resolver sesi dan fasilitas yang dipercayakan oleh *caller*, tetapi resolver contoh di \`fixtures.mjs\` **bukan autentikasi server**.

- Satu laporan induk per Puskeswan-bulan. Revisi 1..n dan transisi dicatat dalam history view tanpa identitas atau isi catatan petugas.
- \`NOT_STARTED_DEMO\` berbeda dari laporan 0. \`SUBMITTED_REVIEW_PENDING\` bukan diterima/valid.
- \`CORRECTION_REQUESTED\` dan \`REVISION_DRAFT\` tidak menghapus hitungan dari snapshot lama, namun hitungan itu tetap *historis, belum diverifikasi*.
- Dashboard M05-14 dan workflow M05-1 adalah dua sumber DEMO berbeda. Model menegaskan \`synchronized_with_workflow=false\`: **jangan jumlahkan atau samakan keduanya**.
- Tidak tersedia tanggal server resmi, penilaian tenggat, persetujuan data, peringkat maupun publikasi.
- \`tests/correction.test.mjs\`: **24 QA tertulis, 0 dijalankan**.

[M05-16 spesifikasi](../../docs/M05_16_PELAPORAN_KOREKSI_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md). MODE CODE_ONLY, tanpa CI/CL/tes/browser dan tanpa koneksi produksi.
