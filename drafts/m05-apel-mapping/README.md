# M05-6 | Data dictionary dan mapping schema APEL

**KODE DITULIS, BELUM DIUJI. CODE_ONLY.** Katalog ini berisi 36 field bisnis kanonik yang dibutuhkan untuk memetakan sumber APEL, bukan nama tabel atau kolom produksi.

Delapan domain dipisah: identitas fasilitas, histori wilayah, ledger, detail kejadian, workflow, versi kebijakan, rencana dukungan, dan realisasi dukungan. Kolom \`actual_*\` sengaja null. Nama DEMO yang dimasukkan sebagai kandidat tidak pernah dianggap schema aktual atau tervalidasi.

Tidak ada introspeksi DB, query, konektor, akses Flask/VPS, atau integrasi. **20 skenario QA tertulis, 0 dijalankan.**
