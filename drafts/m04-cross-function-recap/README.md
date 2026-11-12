# YANDIK+ M04-S9L | Rekap Lintas Fungsi DEMO

**KODE DITULIS, BELUM DIUJI. 12 November 2026.**

- `recap.mjs` membaca register M04-S9K sintetis (18 butir, 6 fungsi) dan mengelompokkan usulan, kekurangan bukti tertulis serta ketergantungan antar-fungsi.
- Ada perbedaan penting antara **kolom kekurangan bukti DEMO kosong** dan **kekurangan riil tidak ada**. Keduanya tidak boleh disamakan.
- Fixture M04-S9K sengaja mempunyai tiga contoh usulan dan tiga catatan kekurangan, semuanya fiktif (GOV-01, SEC-01, DAT-01). Lima belas butir lainnya tanpa usulan dan tanpa catatan kekurangan contoh.
- Rekap berisi 18 baris dengan jejak sumber ID/revisi, fungsi, fase, pendahulu lintas fungsi, bukti yang perlu disiapkan, usulan/penelaah fungsi, dan status otorisasi semuanya false.
- Tampilan `index.html`, `main.mjs`, `style.css` hanya baca-saja: matriks fungsi, filter fungsi/kelas, rekap teks dan peringatan. Tanpa API, storage, fetch, penugasan, atau dokumen resmi.
- `tests/recap.test.mjs` memuat **12 skenario yang baru ditulis, BELUM DIJALANKAN** karena CODE_ONLY.
- Repo masih PUBLIC pada metadata pemeriksaan 12 November; pengingat owner untuk perubahan PRIVATE Sabtu 14 November aktif, setting belum diubah.

Spesifikasi: `docs/M04_S9L_CROSS_FUNCTION_RECAP.md`.