# M05-17 | Rancangan Pembinaan & Tindak Lanjut DEMO

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | REVIEW ONLY.**

\`followup.mjs\` menggunakan proyeksi M05-16 (pelaporan/koreksi + konteks profil/SDM) untuk menyusun **usulan perhatian yang harus ditinjau manusia**. Tidak ada penugasan, pemeringkatan Puskeswan, keputusan bantuan, kewajiban tenggat, publikasi, atau pengiriman notifikasi.

Sinyal yang dihasilkan:
- Laporan dikembalikan → *bahan klarifikasi*, bukan teguran resmi.
- Laporan menunggu telaah → *bahan pemeriksaan*, bukan validasi.
- Belum ada snapshot laporan atau masih draf → *bahan pendampingan*, bukan klaim terlambat atau tidak patuh.
- Profil belum tersedia/masih draf → *tinjau data profil*, bukan kondisi pelayanan buruk.
- Cakupan SDM tidak lengkap → *tinjau data SDM*, bukan rekomendasi otomatis penambahan personel.

\`buildDemoFollowupBoard(contexts)\` menggabungkan kasus tanpa prioritas numerik; menghitung **jumlah saran** saja, bukan tindakan atau kasus resmi. Setiap saran punya \`assigned_to=null\`, \`due_date=null\`, \`may_dispatch=false\`.

\`fixtures.mjs\` berisi empat konteks fiktif dan tidak ada data riil. \`tests/followup.test.mjs\` memuat **24 QA tertulis, 0 dijalankan**. Tidak ada UI produksi, database, autentikasi riil, dokumen resmi, workflow dispatch, atau akses jaringan.

[Spesifikasi M05-17](../../docs/M05_17_PEMBINAAN_TINDAK_LANJUT_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
