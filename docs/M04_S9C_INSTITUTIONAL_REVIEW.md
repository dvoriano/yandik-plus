# M04-S9C | Paket Agenda Telaah Kelembagaan Sebelum Integrasi

**Status:** KODE DITULIS, **BELUM DIUJI**. Tanggal 11 November 2026.  
**Ruang lingkup:** bahan diskusi, **bukan** review kelembagaan yang benar-benar telah dilakukan.  
**Berkas:** [drafts/m04-institutional-review/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-review).

## Kedudukan M04-S9C
Setelah M04-S8 menyiapkan 12 unsur, M04-S9 merekam tindak lanjut, dan M04-S9B meringkas temuan, M04-S9C menyajikan **agenda pembahasan, bukti yang perlu disiapkan, dan fungsi pengampu yang diusulkan**. Konsep ini membantu memastikan persoalan kelembagaan, SPBE, keamanan, tata naskah dan QA tidak terlewat. Tidak menetapkan nama pejabat atau organisasi resmi.

Data kajian M04-S8/S9 tetap DEMO. Informasi visibilitas repo menggunakan **snapshot metadata GitHub pada tanggal observasi**, bukan API live maupun bukti perlindungan data secara lengkap.

## Sumber dan cara membaca
- **10 unsur wajib M04-S8:** setiap unsur masuk agenda meskipun status DEMO “bahan tersedia”, sebab dokumen riil belum diperiksa. Jika belum diperiksa/perlu klarifikasi, tampil sebagai prioritas untuk diskusi; status lain tetap memerlukan validasi resmi.
- **Usulan katalog:** tiap usulan meminta penjelasan dampak ke tupoksi, RACI, SOP, jalur eskalasi, arsip dan rollback. Tidak mengubah unit aktif.
- **Akses GitHub:** metadata repo public pada 11 November 2026 memunculkan perhatian tinggi untuk pembahasan klasifikasi dan pilihan visibility. Keputusan dilakukan oleh pemilik, bukan kode M04-S9C.
- **QA:** seluruh kode M03-S4/M04 draft belum diuji pada proyek ini. Paket hanya mengusulkan bukti QA yang perlu disiapkan apabila owner kemudian mengizinkan pengujian.

## Kategori agenda
| Kelompok | Pertanyaan inti | Keluaran yang perlu dipersiapkan |
|---|---|---|
| Perlindungan informasi | Apakah repository dan dokumen perlu dibatasi aksesnya? | Keputusan visibilitas/klasifikasi, review riwayat, pengaturan kolaborator |
| Kelembagaan dan tupoksi | Siapa pemilik proses dan fungsi unit yang sah? | Dasar tugas, matriks proses dan RACI yang ditelaah |
| SOP dan tata naskah | Alur mana memerlukan persetujuan institusi? | Draf SOP, prosedur arsip dan pihak penetap yang disepakati |
| Keamanan/SPBE | Bagaimana role, wilayah, bukti, audit dan integrasi diatur? | Rancangan kontrol akses, catatan koordinasi SPBE dan keamanan |
| QA dan uji lapangan | Bagaimana bukti fungsi dan aksesibilitas akan diperiksa? | Rencana tes, hasil QA dan umpan balik pengguna setelah izin |
| Perubahan katalog | Apa dampak perubahan unit? | Analisis dampak/alur dan rencana rollback |

**Arti hasil:** Seluruh item berstatus BELUM_DIPUTUSKAN_MANUSIA. Tidak ada tombol “setuju”, “sah”, “siap integrasi”, atau keputusan bantuan. Semua peran hanyalah **saran fungsi**, bukan struktur nyata.

## Berkas
- decision_matrix.mjs: membentuk daftar agenda dari ringkasan M04-S9B, dengan 10 persyaratan wajib dan status repo hasil observasi yang diberikan.
- fixtures.mjs: sumber DEMO dan snapshot status repo dari 11 November 2026.
- main.mjs, index.html, style.css: tampilan baca-saja, tanggal acuan dan filter, keluaran teks.
- tests/decision_matrix.test.mjs: tujuh skenario uji disimpan sebagai kode, **belum dieksekusi**.
- README.md: ringkasan penggunaan dan batas kewenangan.

## Ketentuan sebelum integrasi dan QA
1. Pemilik repository menentukan akses yang tepat dan klasifikasi informasi.
2. Pengampu kelembagaan menelaah pemilik proses, tupoksi, SOP, RACI, arsip dan otorisasi.
3. Pengampu SPBE dan keamanan menilai penanganan data, integrasi, otorisasi wilayah dan jejak perubahan.
4. Owner secara eksplisit mengizinkan pengujian sebelum Node/Chromium/CI/QA dijalankan. Pengujian M04 harus dilakukan secara bertahap dari sumber dependensi awal.
5. Keputusan resmi, pengadaan, distribusi, BAST atau penetapan bantuan tetap di luar M04-S9C dan berada pada mekanisme berwenang.

**KODE DITULIS BUKAN BUKTI BERFUNGSI.** Tidak ada CL/CI/tes, pengiriman, penyimpanan, autentikasi, API, deployment atau pengubahan main/VPS/website produksi.
