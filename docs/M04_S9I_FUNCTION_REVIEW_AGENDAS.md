# M04-S9I | Agenda Telaah Kelembagaan per Fungsi dan Pertanyaan Konfirmasi

**Tanggal:** 12 November 2026 (WIB)  
**Status:** KODE DITULIS, **BELUM DIUJI**  
**Kode:** [drafts/m04-function-review-agendas/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-function-review-agendas)  
**Kedudukan:** draf agenda diskusi DEMO. Bukan undangan, notulen, berita acara, perintah dinas, keputusan resmi atau izin QA/deploy.

## Hubungan dengan roadmap
M04-S9H mengonsolidasikan 18 hambatan dan kebutuhan bukti. M04-S9I menyajikannya **per fungsi pengampu yang diusulkan** agar setiap butir dapat dibahas dengan daftar pertanyaan dan bahan yang jelas.
Rantai sumber DEMO: M04-S9F → M04-S9G → M04-S9H → **M04-S9I**. Tidak ada sumber data dinas asli, nama pegawai, dokumen internal, undangan atau tanda tangan.

## Enam paket agenda usulan
| Fungsi usulan | Ruang lingkup bahan diskusi | Butir DEMO |
|---|---|---|
| Tata laksana dan kelembagaan | Penanggung jawab proses, RACI/SOP, SPBE, arsip/retensi | GOV-01, GOV-02, GOV-03, GOV-04 |
| Keamanan informasi | Klasifikasi repository, otorisasi, audit dan kredensial | SEC-01, SEC-02, SEC-03, SEC-04 |
| Pengelola data Profil/SDM/APEL | ID Puskeswan, integritas laporan APEL 2026 dan asal-usul bukti | DAT-01, DAT-02, DAT-03 |
| Pengampu alur Support | Fairness prioritas, kontrak M03/M04 serta batas keputusan eksternal | FLOW-01, FLOW-02, FLOW-03 |
| QA teknis dan UX | Tes impor/regresi, keamanan input, aksesibilitas dan tampilan HP | QA-01, QA-02 |
| Operasional dan integrasi | Staging, backup/rollback dan kewenangan perubahan produksi | INT-01, INT-02 |

Semua nama di atas menunjuk **fungsi yang disarankan**, bukan unit/pejabat yang telah ditetapkan atau menyatakan kehadiran rapat.

## Isi setiap agenda
- Tujuan diskusi untuk fungsi terkait, dalam bahasa administrasi yang mudah dipahami.
- Kode butir dan fase dari M04-S9H, keterkaitan pendahulu dari M04-S9G dan rujukan sumber.
- Bahan bukti yang perlu disiapkan, **bukan** bukti yang sudah diterima atau diperiksa.
- Fungsi yang diusulkan untuk menyiapkan bahan dan menelaahnya.
- Pertanyaan standar: apakah berkas cukup, siapa berwenang memeriksa, serta bagaimana ketergantungan ke butir sebelumnya.
- Pertanyaan spesifik untuk SEC-01 mengenai histori paparan repository dan untuk QA tentang izin tes sebelum pelaksanaan.
- Catatan tindak lanjut **hanya untuk diskusi**, bukan penugasan atau keputusan.

## Keamanan dan keterbatasan
1. Keenam paket dan total 18 butir hanya menggunakan `synthetic: true` serta `mode: CODE_ONLY` dari M04-S9H.
2. Seluruh sumber diberi tanda bukti tidak terverifikasi, belum ada penelaah resmi, belum ada rapat, keputusan, undangan atau surat.
3. Tidak ada tanggal rapat riil, nama pejabat, email, nomor surat, dokumen kedinasan asli maupun data identitas warga/pemilik hewan.
4. Browser hanya memiliki filter fungsi serta keluaran teks baca-saja. Tidak ada login, storage, API, fetch, database, fungsi kirim, upload berkas atau tombol pengesahan.
5. Snapshot repo GitHub saat diperiksa 12 November 2026 masih PUBLIC. Pengingat perubahan PRIVATE untuk Sabtu 14 November 2026 telah ada, perubahan **belum dilakukan**.
6. Meski akses suatu hari menjadi PRIVATE, pemeriksaan isi/histori dan klasifikasi tetap memerlukan langkah terpisah.
7. Keluaran tidak boleh dianggap sebagai penilaian kepatuhan SPBE, legalitas tata naskah, penetapan SOP, alokasi anggaran atau izin integrasi.

## Status QA dan tahap berikut
Sebelas skenario tes yang **belum dijalankan** telah ditulis pada [tests/agendas.test.mjs](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-function-review-agendas/tests/agendas.test.mjs). QA menargetkan enam fungsi dan 18 butir, pertanyaan, kebutuhan bukti, dependensi, penolakan sumber tidak sah, serta larangan keputusan/undangan.
Lihat [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) untuk QA fungsional, keamanan, UX dan integrasi yang masih menunggu izin owner.
Langkah berikut yang mungkin: menyiapkan lembar pertanyaan untuk manusia dan template hasil pembahasan yang **tidak mengesahkan apa pun secara otomatis**. Semua persetujuan resmi tetap pada pihak/sistem berwenang.
M04-S10+ keputusan bantuan, pengadaan, anggaran, distribusi dan BAST masih RENCANA. Branch `main`, VPS, YANDIK+ aktif, database dan bot Indodax tidak disentuh.
