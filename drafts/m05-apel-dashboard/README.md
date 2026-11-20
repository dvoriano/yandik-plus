# M05-4 | Rapor & Tren APEL 2026–2030 (DEMO)

**KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Tidak ada UI live, database, konektor Flask, data Puskeswan aktual, skor, ranking atau publikasi.

- \`report.mjs\`: rekap satu tahun dan metrik terpisah, jumlah fasilitas yang memiliki preview, cakupan nilai tersedia/tidak tersedia, total DEMO hanya jika satuan seragam. Hanya fasilitas-tahun unik.
- \`trends.mjs\`: seri tahunan 2026–2030. Tahun diurutkan dan tahun tanpa data dicatat. **Tidak menghitung pertumbuhan/perbandingan lintas tahun**, karena definisi, sumber dan kebijakan belum dinyatakan sebanding.
- \`dashboard.mjs\`: view-model deskriptif untuk lima pilihan tahun dan lima keluarga indikator. Ini bukan komponen frontend atau dashboard produksi.
- \`tests/dashboard.test.mjs\`: **22 skenario tertulis, 0 dijalankan**.

Jumlah pelayanan DEMO, bulan pernah dikirim DEMO, ketepatan waktu, realisasi dukungan, dan agregasi kabupaten/kota tidak dicampur. Nilai \`null\` tetap tidak tersedia; angka 0 yang memang teramati tetap 0. Sumber M05-0 dan M05-2 tetap belum direkonsiliasi. Tidak ada rumus skor, perubahan persen, klasemen atau piagam.

[Spesifikasi M05-4](../../docs/M05_4_REPORT_TREN_APEL_2026_2030.md) · [M05-3](../../docs/M05_3_ANNUAL_RULES_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
