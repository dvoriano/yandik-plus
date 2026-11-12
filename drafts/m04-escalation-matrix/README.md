# M04-S6 | Matriks Alur Eskalasi Administratif

**KODE DITULIS, BELUM DIUJI.** Tidak ada CL, test, browser, CI, produksi, atau data sungguhan.

## Apa yang dirancang
- Matriks **5 kategori kendala × 3 tingkat urgensi** dari M04-S5 dengan unit tujuan **DEMO**.
- Saran awal unit dan alasannya. Urgensi `mendesak_kajian` mengarah ke **koordinasi pembahasan**, bukan menaikkan kewenangan/bantuan.
- Koordinator menyusun **catatan pilihan alur** yang dapat berbeda dari saran, tetapi perlu alasan lebih panjang dan catatan keterbatasan.
- Penelaah DEMO terpisah hanya dapat **mencatat untuk pembahasan**, meminta revisi, atau tidak merekomendasikan. Tidak ada tombol approve, disposisi maupun pengiriman.
- Riwayat versi, gerbang perubahan sumber M04-S5, dan teks rekap baca-saja.
- Matriks unit tidak mengklaim susunan organisasi, kewenangan atau SOP DPKH yang berlaku.

## Berkas
- `routing_matrix.mjs`: matriks rekomendasi, skema catatan, validasi, perubahan rute beralasan, penelaahan, histori, pembatasan sumber.
- `fixtures.mjs`: satu eskalasi **dilaporkan** dari fungsi M04-S5 dengan sumber fiktif.
- `main.mjs`, `index.html`, `style.css`: tabel matriks dan formulir pencatatan/telaah tanpa mutasi sumber.
- [Spesifikasi M04-S6](../../docs/M04_S6_ROUTING_MATRIX.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).

## Pembatasan
**Pencatatan pilihan jalur TIDAK otomatis memanggil `routeEscalation()` di M04-S5.** Hanya *usulan koordinasi DEMO* dan tidak membuat disposisi resmi, izin belanja, penerima bantuan, pengadaan atau BAST. Semua data berada di memori browser. Identitas DEMO bukan login/otorisasi atau audit sah.

Kode belum diuji; seluruh pemeriksaan ditunda sampai pemilik mengizinkan.
