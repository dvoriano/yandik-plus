# MOD-07 | PHMS, Zoonosis dan Surveilans

**Milestone:** M13  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
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
