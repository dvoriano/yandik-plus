# MOD-09 | Pembinaan, Bimbingan Teknis dan Pengembangan SDM

**Milestone:** M15  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
YANDIK+ telah memiliki data SDM dan sebagian fitur form/dokumen, tetapi belum ada klaim workflow pembinaan menyeluruh.

## 2. Tujuan
Satu catatan kegiatan pembinaan sejak perencanaan sampai tindak lanjut, dilengkapi bukti dan rekap capaian otomatis.

## 3. Pengguna dan hak akses
- Koordinator kegiatan
- petugas pembina
- peserta/petugas Puskeswan
- verifikator/kepala bidang
- pimpinan
Hak akses rinci mengikuti modul Core Platform, termasuk pembatasan peran dan wilayah.

## 4. Fitur yang direncanakan
- Rencana pembinaan: topik, sasaran, Puskeswan, waktu dan penanggung jawab
- Agenda, materi, daftar hadir digital yang proporsional
- Checklist lapangan dan rekomendasi khusus per Puskeswan
- Dokumentasi dan unggah bukti tanpa pengumpulan data pribadi berlebihan
- Draf laporan hasil, berita acara, notulen dan tindak lanjut
- Riwayat Bimtek, sertifikat dan pengembangan kompetensi SDM
- Monitoring apakah rekomendasi pembinaan dilaksanakan

## 5. Alur kerja pengguna
Buat kegiatan → pilih peserta/objek → laksanakan & catat hasil → draf laporan → verifikasi → tindak lanjut → rekap tahunan.

## 6. Objek data (usulan, belum migrasi final)
- training_event, coaching_activity, attendance_record
- material_ref, report_ref, recommendation, followup
- sdm_id/organization_id, verified_by, outcome
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Data SDM, Profil Puskeswan, support, workflow bersama, dashboard IKU/pembinaan.

## 8. Checklist pengembangan
- [ ] MOD-09-01: Petakan jenis pembinaan, Bimtek dan keluaran dokumen
- [ ] MOD-09-02: Rancang kegiatan, bukti dan rekap kehadiran minimum
- [ ] MOD-09-03: Integrasikan dengan profil dan histori SDM
- [ ] MOD-09-04: Buat draf laporan dan pemantauan rekomendasi
- [ ] MOD-09-05: Uji rekap per triwulan/tahun memakai data dummy

## 9. Kriteria selesai
Satu kegiatan dummy menghasilkan daftar objek/peserta, bukti, laporan draf dan tindak lanjut, dengan akses sesuai peran.

## 10. Catatan batasan, risiko, dan UX
Sertifikat pelatihan hanya disiapkan sesuai ketentuan kegiatan; jangan dibuat sebagai pengganti sertifikasi profesi resmi.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).

## Lanjutan konsolidasi DEMO | 24 November 2026
[Halaman kerja](../../drafts/yandik-portal/review.html) diperluas. Antrean bahan telaah berdasarkan workflow M05-17 tercatat per tahun/wilayah; belum penugasan, Bimtek atau notifikasi resmi. KODE DITULIS, BELUM DIUJI; 13 kasus tambahan QA lintas konsolidasi, 0 dijalankan. [Panduan preview](../CODEX_PREVIEW_YANDIK.md).

## 2026-11-24 | MOD-09 / M15 Pembinaan dan Bimtek DEMO
- [Halaman kerja](../../drafts/yandik-portal/coaching.html), model in-memory dengan master fasilitas M05, rencana, kehadiran agregat, draf hasil, rekomendasi, tenggat, telaah/koreksi dan tindak lanjut DEMO. 16 kasus unit ditulis, 0 dijalankan; QA browser tertunda. Belum ada histori peserta individu/SDM, bukti/dokumen, otorisasi, database atau sertifikat. Tidak mengubah ledger APEL atau inventaris. CODE_ONLY, [skip ci]. Berikutnya administrasi paperless/pustaka.


## 2026-11-24 | K4-A7: backend pembinaan dan administrasi DEMO
- [Kontrak](../K4_A7_COACHING_PAPERLESS_2026_2030.md): 30 slot kegiatan dan 120 slot draf kosong, typed rencana/hasil/telaah/tindak lanjut, 4 jenis draf, metadata bukti, FK revisi sumber, stale/refresh/reopen, histori dan scope, transaksi/replay/rollback. 22 QA tertulis (6 pure + 16 rehearsal), 0 dijalankan. Belum parity UI, SOP, dokumen resmi, upload, HTTP, login, DB riil atau persistensi. CODE_ONLY [skip ci]. Berikutnya K4-A8 integrasi API kandidat dan proyeksi read-only.


## 2026-11-24 | K4-C6: formulir pembinaan dan administrasi paperless
- [Kontrak](../K4_C6_COACHDOC_FORMS_2026_2030.md): slot kosong terlihat, 5 tindakan pembinaan + 7 tindakan dokumen, 4 jenis draf per kegiatan, metadata bukti, revisi sumber/stale guard, baca histori revisi, kandidat aksi server, retry/revisi shared. 9 QA backend + 8 JS baru, 0 dijalankan; manifest backend 297 (102+195), API tetap 31. Belum template resmi, unggah bukti, tanda tangan, pengiriman, browser transport/HTTP/DB riil. CODE_ONLY [skip ci]. Berikutnya K4-C7 penyempurnaan template dokumen.

