# MOD-10 | Administrasi Kegiatan dan Dokumen Paperless

**Milestone:** M12 dan M16  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Snapshot memiliki template, form, referensi/berita dan fitur dokumentasi parsial; belum ada sistem administrasi seluruh kegiatan terintegrasi.

## 2. Tujuan
Mengurangi kertas dan pengetikan ulang melalui satu ruang kerja kegiatan yang menghasilkan draf laporan, checklist, dan dokumentasi siap ditinjau.

## 3. Pengguna dan hak akses
- Penanggung jawab kegiatan
- petugas lapangan
- verifikator administrasi
- pimpinan
- pengelola dokumen
Hak akses rinci mengikuti modul Core Platform, termasuk pembatasan peran dan wilayah.

## 4. Fitur yang direncanakan
- Register kegiatan: rencana, jadwal, lokasi, pelaksana, objek dan nomor internal
- Checklist operasional, catatan pelaksanaan, foto, bukti, daftar hadir
- Template draf laporan kegiatan, berita acara, surat pengantar dan rekap kegiatan
- Folder dokumen digital berdasarkan kegiatan dengan nomor referensi dan riwayat versi
- Tanda status perlu perbaikan, sedang diverifikasi, lengkap, selesai
- Pencarian arsip kerja teknis berdasarkan periode, Puskeswan, jenis kegiatan
- Jalur ekspor/tautan ke sistem resmi persuratan atau keuangan bila disetujui

## 5. Alur kerja pengguna
Buat rencana kegiatan → pelaksanaan/bukti → draf laporan otomatis → pemeriksaan → finalisasi internal → proses resmi di SRIKANDI/kanal berwenang bila diperlukan.

## 6. Objek data (usulan, belum migrasi final)
- activity_id, plan, participants_ref, activity_evidence
- draft_document, template_version, approval_note
- status_history, document_ref, retention_class
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Workflow engine bersama; tiap modul dapat membuat activity_id dan menghasilkan dokumen; sinkronisasi resmi adalah tahap lain sesuai kewenangan.

## 8. Checklist pengembangan
- [ ] MOD-10-01: Petakan formulir dan template dokumen yang sudah digunakan
- [ ] MOD-10-02: Susun satu model kegiatan dan repositori bukti bersama
- [ ] MOD-10-03: Rancang generator draf DOCX/PDF dari data yang ada
- [ ] MOD-10-04: Tambahkan status verifikasi/versi dokumen dan pencarian
- [ ] MOD-10-05: Evaluasi batas SPBE dan rencana integrasi e-SPJ/kepegawaian sebelum kode dibuat

## 9. Kriteria selesai
Satu kegiatan dummy menghasilkan catatan bukti, draf laporan dan rekap tanpa pengisian ulang identitas/wilayah; arsip dinamis resmi tetap di sistem sah.

## 10. Catatan batasan, risiko, dan UX
Jangan membuat pengganti SRIKANDI, pengadaan, atau keuangan. e-SPJ dan aktivitas pegawai masuk M16 evaluasi terlebih dahulu; tidak otomatis jadi ruang lingkup pasti.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).

## Lanjutan konsolidasi DEMO | 24 November 2026
[Halaman kerja](../../drafts/yandik-portal/review.html) diperluas. Tabel kebutuhan dan rekap tahapan M04 di ruang kerja dengan identitas independen; belum BAST sah atau arsip resmi. KODE DITULIS, BELUM DIUJI; 13 kasus tambahan QA lintas konsolidasi, 0 dijalankan. [Panduan preview](../CODEX_PREVIEW_YANDIK.md).

## 2026-11-24 | MOD-10 / M12 Administrasi paperless DEMO
- [Ruang kerja](../../drafts/yandik-portal/coaching.html#administrasi) berbagi state kegiatan MOD-09 pada halaman yang sama. Empat jenis naskah teks, snapshot revisi sumber, metadata empat jenis bukti fiktif, telaah/koreksi, arsip simulasi, versi lama dan pencarian. Sumber berubah mengunci pengajuan; versi baru wajib diperiksa. 14 QA unit ditulis, 0 dijalankan. Belum DOCX/PDF, file bukti, database/otorisasi, SRIKANDI atau e-SPJ; M16 tetap evaluasi. CODE_ONLY [skip ci]. Berikutnya pustaka regulasi/SOP.


## 2026-11-24 | K4-A7: backend pembinaan dan administrasi DEMO
- [Kontrak](../K4_A7_COACHING_PAPERLESS_2026_2030.md): 30 slot kegiatan dan 120 slot draf kosong, typed rencana/hasil/telaah/tindak lanjut, 4 jenis draf, metadata bukti, FK revisi sumber, stale/refresh/reopen, histori dan scope, transaksi/replay/rollback. 22 QA tertulis (6 pure + 16 rehearsal), 0 dijalankan. Belum parity UI, SOP, dokumen resmi, upload, HTTP, login, DB riil atau persistensi. CODE_ONLY [skip ci]. Berikutnya K4-A8 integrasi API kandidat dan proyeksi read-only.

