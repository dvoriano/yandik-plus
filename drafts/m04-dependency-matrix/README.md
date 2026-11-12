# YANDIK+ M04-S9G | Matriks Ketergantungan Prasyarat Integrasi DEMO

**KODE DITULIS, BELUM DIUJI**, 12 November 2026.

- Sumber wajib model M04-S9F sintetis yang mempunyai tepat 18 prasyarat, 4 fase berstatus BELUM_DIMULAI dan tidak mempunyai bukti/verifikasi resmi.
- dependencies.mjs memetakan hubungan pendahulu, mengurutkan secara topologis, menandai panjang lapisan dan menghitung banyaknya butir lanjutan yang bergantung pada setiap prasyarat.
- Model menolak ID tidak dikenal, dependensi ganda/self-loop, fase mundur dan siklus. Semua ini kontrak tertulis, **BELUM DIUJI**.
- Fase P0 terkait perlindungan informasi dan tata kelola; P1 tentang data/otorisasi/alur; P2 tentang QA setelah izin; P3 tentang staging/deploy review tanpa eksekusi otomatis.
- Tidak ada status lulus/siap, penetapan tugas, anggaran, procurement, distribusi, BAST, tindakan API atau deploy. Fase bisa dipakai sebagai urutan bahan diskusi, bukan bukti kelayakan.
- main.mjs, index.html, style.css adalah UI baca-saja dengan filter fase/domain dan rekap, tanpa penyimpanan atau akses data riil.
- tests/dependencies.test.mjs memuat 11 skenario tertulis yang belum dijalankan sesuai CODE_ONLY.
- Repo PUBLIC pada pemeriksaan 12 November 2026; perubahan ke PRIVATE direncanakan pada Sabtu 14 November dengan pengingat aktif dan belum dieksekusi.

Dokumen: docs/M04_S9G_DEPENDENCY_PLAN.md.