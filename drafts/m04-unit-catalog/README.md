# M04-S7 | Katalog Unit Tujuan, RACI dan Aturan Koordinasi

**KODE DITULIS, BELUM DIUJI.** Tidak ada CL, Node test, Chromium, GitHub Actions baru, deployment, atau data riil.

## Cakupan
- Katalog **empat unit tujuan DEMO**, konsisten dengan nama dan kode pada M04-S6, meliputi fungsi yang disarankan, batas kewenangan, prasyarat serta kontak fiktif.
- Matriks **enam aktivitas RACI** (Responsible, Accountable, Consulted, Informed) untuk pelaporan kendala, pilihan alur, telaah, tanggapan, revisi dan rancangan SOP. Seluruh role hanya label DEMO.
- Draf aturan koordinasi berdasarkan **catatan M04-S6 yang sudah dicatat sebagai bahan pembahasan oleh penelaah DEMO**, bukan keputusan resmi.
- Pengampu DEMO menyiapkan lingkup, pemeriksaan minimum, jalur pengecualian, rencana pencatatan, tanggal telaah dan alasan; penelaah DEMO berbeda hanya dapat mencatat untuk bahan SOP, meminta revisi atau tidak merekomendasikan.
- Perubahan sumber M04-S5 / M04-S6 memblokir kelanjutan draf. Output teks baca-saja, dapat diperiksa manusia.
- Tidak ada cara mengubah unit M04-S6 melalui modul ini: perubahan rute harus ditelaah kembali pada tahap sebelumnya.

## Berkas
- `unit_catalog.mjs`: data katalog, matriks RACI, sumber, draf SOP, transisi review, histori dan teks.
- `fixtures.mjs`: satu catatan M04-S6 DEMO dengan status **dicatat untuk pembahasan**.
- `index.html`, `style.css`, `main.mjs`: tabel unit, matriks RACI dan naskah koordinasi. Tampilan BELUM DIUJI.

## Batas
Semua kode/hubungan data masih fiktif; label role bukan autentikasi. `dicatat_untuk_bahan_sop` **bukan** pengesahan SOP. Tidak ada disposisi, notifikasi, pengadaan, anggaran, keputusan pemberian bantuan, distribusi atau BAST. Data dan histori hanya di memori halaman.

[Spesifikasi M04-S7](../../docs/M04_S7_UNIT_CATALOG_RACI.md) · [QA tertunda](../../docs/TEST_BACKLOG.md).

**Tes dan review resmi ditunda sampai instruksi owner.**
