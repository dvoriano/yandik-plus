# MOD-07 | PHMS, Zoonosis dan Surveilans

**Milestone:** M13  
**Status implementasi GitHub:** SEDANG sebagai rancangan M13-S1/S2/S3; KODE DITULIS, BELUM DIUJI; tidak ada modul operasional.  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
APEL telah memiliki kategori kegiatan surveilans/pelayanan; ada mekanisme impor data iSIKHNAS pada source, tetapi alur investigasi hingga tindak lanjut penyakit belum dinyatakan sebagai modul komprehensif.

## 2. Tujuan
Catatan kegiatan investigasi, pengendalian penyakit dan analitik kewilayahan yang tidak menambah input ganda pada sistem pelaporan resmi.

## 3. Pengguna dan hak akses
- Petugas lapangan/Puskeswan
- koordinator kab/kota
- tim surveilans provinsi
- lab rujukan sesuai akses
- pimpinan
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Register kejadian dengan lokasi/waktu, jenis penyakit dugaan, status kasus
- Form investigasi, riwayat lapangan, keterkaitan kejadian dan bukti
- Register sampel/pengiriman/hasil lab (melalui mekanisme resmi yang disetujui)
- Rencana tindak lanjut vaksinasi/pengendalian dan status kegiatan
- Rekap pelaporan/analitik dari iSIKHNAS sesuai hak akses dan izin impor
- Peta indikatif dan laporan agregat dengan penandaan data terverifikasi

## 5. Alur kerja pengguna
Kejadian terlapor → validasi → investigasi → sampel/penanganan → monitoring tindak lanjut → analisis agregat.

## 6. Objek data (usulan, belum migrasi final)
- event_id, disease_code, location_id, observed_at
- investigation, sampling_ref, lab_result_status
- response_activity, followup, reporting_source_id
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
APEL (rekap layanan terkait), master wilayah, GIS, dashboard, dukungan darurat, iSIKHNAS sebagai sistem rujukan.

## Progres M13-S1 | Register kejadian DEMO
- [x] [Kode register kejadian sintetis](../M13_S1_PHMS_ZOONOSIS_SURVEILANS_DEMO_2026_2030.md) memisahkan dugaan, investigasi, sampel/lab, dan tindak lanjut tanpa konfirmasi penyakit.
- [x] [28 QA tertulis](../../drafts/m13-surveillance/tests/surveillance.test.mjs), **0 dijalankan**.
- [ ] Definisi kasus, SOP surveilans, izin sumber iSIKHNAS, integrasi APEL, hasil lab autentik, akses data sensitif, serta uji keamanan masih terbuka.

## Tambahan M13-S2 | Calon relasi catatan APEL dan surveilans
- [x] [Kandidat crosswalk APEL](../M13_S2_APEL_SURVEILLANCE_CROSSWALK_DEMO_2026_2030.md) dibuat, **24 QA tertulis, 0 dijalankan**. Kesesuaian ID hanya bahan telaah, bukan kasus terkonfirmasi/rekonsiliasi resmi.
- [ ] Perlu definisi penyakit, izin sumber, perlindungan data, review manual dan API nyata sebelum penggabungan apapun.

## Tambahan M13-S3 | Catatan telaah kandidat
- [x] [Log review in-memory DEMO](../M13_S3_MANUAL_REVIEW_CROSSWALK_DEMO_2026_2030.md) ditulis untuk kandidat M13-S2, **28 QA tertulis, 0 dijalankan**. Pemisahan aktor sintetis dan source digest bukan persetujuan resmi.
- [ ] Prosedur penelaah, audit server, izin sumber, bukti fisik, definisi kejadian dan pengujian integrasi belum ada.

## 8. Checklist pengembangan
- [ ] MOD-07-01: Susun daftar use-case penyakit prioritas dan kamus istilah
- [ ] MOD-07-02: Tentukan batas integrasi iSIKHNAS dan izin data
- [ ] MOD-07-03: Desain form investigasi dan daftar sampel berbasis dummy
- [ ] MOD-07-04: Bangun status tindak lanjut tanpa pendataan kasus ganda
- [ ] MOD-07-05: Uji privasi lokasi dan pelaporan agregat

## 9. Kriteria selesai
Satu kegiatan investigasi dummy dapat ditelusuri lengkap, tanpa mengklaim sebagai notifikasi resmi penyakit jika belum diintegrasikan.

## 10. Catatan batasan, risiko, dan UX
Contoh cakupan: PMK, rabies, Jembrana, ASF, LSD, AI, brucellosis. Jangan menyajikan data dugaan sebagai kasus terkonfirmasi; perbedaan harus jelas.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).

## Lanjutan konsolidasi DEMO | 24 November 2026
[Halaman kerja](../../drafts/yandik-portal/review.html) diperluas. Detail event dan usulan telaah memakai M13-S1, tanpa konfirmasi penyakit atau iSIKHNAS. KODE DITULIS, BELUM DIUJI; 13 kasus tambahan QA lintas konsolidasi, 0 dijalankan. [Panduan preview](../CODEX_PREVIEW_YANDIK.md).

## 2026-11-24 | K4-A6: backend empat register teknis DEMO
- [Kontrak](../K4_A6_REGIONAL_REGISTERS_2026_2030.md): typed snapshot regional read-only obat/praktik/surveilans/sertifikat, 7 fixture 2026 independen, coverage null, sidecar telaah internal ber-revisi dan audit, grant aktif/scope asal, replay/rollback, command namespace lintas stream. 20 QA tertulis (7 pure + 13 rehearsal), 0 dijalankan. Bukan migrasi M06/M07/M13/M14, iSIKHNAS/APEL sync, penerbitan, izin atau diagnosis; belum HTTP/auth/DB riil. CODE_ONLY [skip ci]. Berikutnya K4-A7 pembinaan/administrasi.

