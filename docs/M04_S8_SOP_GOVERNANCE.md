# M04-S8 | Kesiapan Penerapan SOP dan Tata Kelola Katalog Unit

**Status: KODE DITULIS, BELUM DIUJI, BELUM DISAHKAN.** Tanggal 11 November 2026. Hanya data fiktif `DEMO-` di branch pengembangan.

Kode: [direktori M04-S8](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance) · [commit awal](https://github.com/dvoriano/yandik-plus/commit/aa6b8949b20094df481bd06b64504cfa6cff27a8) · [perbaikan revisi usulan](https://github.com/dvoriano/yandik-plus/commit/8a510f46f7a428f78df6d0a18d1f4d95165da10a).

## Maksud
M04-S8 merupakan bahan kajian sebelum sebuah konsep aturan koordinasi dan katalog unit dapat diterapkan secara riil. Inputnya adalah **naskah M04-S7 yang dicatat sebagai bahan SOP**, bukan SOP resmi yang telah disahkan. Modul ini tidak memutuskan kewenangan, mengubah katalog sumber M04-S6/S7, membuat disposisi, ataupun menyetujui bantuan/anggaran.

## Dua belas persyaratan awal

| Kelompok | Unsur | Prioritas |
|---|---|---|
| Kelembagaan | Pemilik proses dan pengampu SOP | Wajib |
| Kelembagaan | Kesesuaian tupoksi unit | Wajib |
| Kewenangan | Batas kewenangan dan pemisahan pemeriksa | Wajib |
| Kewenangan | RACI dan jalur eskalasi | Wajib |
| Tata kelola | Dasar prosedur dan tata naskah dinas | Wajib |
| Tata kelola | Arsip, bukti dan masa simpan | Wajib |
| Sistem | Akses pengguna, wilayah dan keamanan data | Wajib |
| Sistem | Koordinasi arsitektur dan tata kelola SPBE | Wajib |
| Sistem | Jejak perubahan yang layak diaudit | Wajib |
| Implementasi | Uji fungsi, akses HP dan petugas lapangan | Wajib |
| Implementasi | Panduan dan pembinaan pengguna | Opsional dalam kajian awal |
| Implementasi | Kebutuhan integrasi dengan sistem resmi | Opsional dalam kajian awal |

Status tiap unsur: **belum diperiksa**, **perlu klarifikasi**, **bahan tersedia** dengan kode metadata DEMO, atau **tidak berlaku** dengan alasan, hanya bagi unsur opsional. Status bahan tersedia tidak membuktikan dokumen riil sudah benar, sah, atau disetujui. **Sepuluh syarat wajib tidak dapat dilewati.**

Berkas parsial boleh diajukan untuk menerima masukan, tetapi **tidak** menghasilkan keputusan siap produksi atau pengesahan SOP. Ringkasan membedakan jumlah unsur total, bukti contoh, unsur wajib yang belum tersedia dan usulan katalog.

## Perubahan katalog unit

Tiga tipe yang dapat **diusulkan**: **tambah**, **ubah fungsi/batas**, dan **nonaktifkan**. Satu usulan mencatat profil unit DEMO, alasan, dampak pada alur M04-S6, pembagian tanggung jawab RACI M04-S7, naskah SOP/arsip, serta rencana pembatalan atau rollback. Kunci/ID unit lama tidak dapat diganti sembarangan; penonaktifan tidak menghapus histori.

Alur perubahan: **draf → menunggu telaah → dicatat untuk pembahasan / perlu perbaikan / tidak direkomendasikan**. Usulan yang dikembalikan dapat direvisi dan diajukan ulang dengan histori tetap tersimpan. **Tidak ada perintah apply, publish atau update** terhadap katalog M04-S7, daftar tujuan M04-S6, maupun tugas kedinasan.

Kajian kesiapan SOP dan kajian perubahan katalog berlangsung **terpisah**, dengan penelaah DEMO berbeda dari penyusun. Keduanya hanya menghasilkan **catatan pembahasan**, bukan persetujuan resmi.

## Persyaratan sebelum penggunaan nyata

Pemilik proses harus menentukan struktur organisasi dan tupoksi berwenang, SOP dan tata naskah yang benar, alur pemeriksaan sumber, pemisahan tugas, pengelolaan bukti dan arsip, kontrol akses akun dan wilayah, audit tahan perubahan, pengendalian versi, keamanan data, koordinasi SPBE, kesiapan petugas lapangan serta kebutuhan integrasi dengan sistem pemerintah terkait. Proses keputusan bantuan, pengadaan, distribusi, dan BAST tetap berada pada pejabat/sistem yang berwenang.

Semua identitas/petugas contoh menggunakan kode DEMO. **Belum ada API, database, autentikasi, konfirmasi dokumen asli, pengesahan elektronik ataupun audit resmi.** Riwayat hanya di memori halaman dan teks rekap bersifat baca-saja.

## Berkas dan pemeriksaan yang ditunda

| Berkas | Rancangan |
|---|---|
| [`governance.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance/governance.mjs) | Checklist, perubahan katalog, review, histori, snapshot dan rekap |
| [`fixtures.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance/fixtures.mjs) | Sumber M04-S7 fiktif |
| [`main.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance/main.mjs) | Form checklist, usulan katalog, telaah, rekap |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance/index.html) | Tampilan rancangan |
| [`style.css`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance/style.css) | Desain responsif, belum diperiksa di HP |
| [`README.md`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance/README.md) | Ketentuan penggunaan simulasi |

QA tertunda mencakup: impor M04-S1/S2/S3/S5/S6/S7/S8, validasi 12 syarat, status tidak berlaku, bukti DEMO, pengembalian dan revisi usulan, larangan perubahan katalog aktif, kondisi sumber berubah, form HP/aksesibilitas, konflik tanggung jawab, keamanan, tata naskah, retensi serta SPBE. Semua item telah ditambahkan pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).

**Tidak menjalankan CL, tes kode, browser, CI atau deployment.** Keberadaan file di GitHub tidak membuktikan perilakunya benar.

## Status selanjutnya
**M04-S1 sampai S8: KODE DITULIS, BELUM DIUJI.** M04-S9+ untuk keputusan resmi, anggaran, paket, pengadaan, distribusi dan BAST **RENCANA**. Kandidat tahap berikut adalah *register hasil pembahasan dan tindak lanjut koreksi kelembagaan*, tetap tanpa mengaktifkan aturan secara otomatis.
