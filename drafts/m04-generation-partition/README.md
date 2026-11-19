# M04-I5 | Generasi baru dan partisi data per Puskeswan

**KODE DITULIS, BELUM DIUJI.** Pure model + SQLite server contract untuk data DEMO. Tidak ada koneksi nyata, test, aplikasi Flask, login, server, migrasi produksi, atau penyaluran.

- Partisi prospektif \`partitionI4Snapshot\` memecah **snapshot I4 sintetis** berdasarkan pemilik paket, jadwal, pengiriman, penerimaan, serah terima dan monitoring. Paket campuran fasilitas/rujukan yatim ditolak. Histori I4 ditempatkan dalam sidecar arsip masing-masing fasilitas.
- Skema terpisah menggunakan empat tabel dengan \`(facility_id,revision)\` dan \`(facility_id,request_id)\`. Revisi logis independen **bukan** pemisahan database fisik; satu SQLite masih mengunci penulis secara global.
- \`generationId\` membuat ID \`DEMO-PKG-001-G0002\` dan turunan seragam hingga \`DEMO-MON-001-G0002\`. Paket lama yang sudah diarsip tidak dipakai ulang.
- Kebutuhan sumber M03 harus ditinjau ulang setelah I4, dengan pemeriksaan metadata dan riwayat. Alur \`request_revision → review_revision → sync_verified_source → begin_generation → advance_generation\` menggunakan provider sintetis tepercaya; data sumber tidak diterima lewat payload perintah.
- Setelah generasi dibuka, sinkronisasi baru diblokir dan dialihkan ke rekonsiliasi manual, bukan mengganti paket secara diam-diam.
- Semua status \`DEMO\` bukan persetujuan, alokasi anggaran, stok, pengiriman, dokumen BAST, atau evaluasi resmi.
- **25 skenario Node tertulis, BELUM DIJALANKAN.** Lihat [spesifikasi](../../docs/M04_I5_GENERATION_AND_PARTITIONS.md).
