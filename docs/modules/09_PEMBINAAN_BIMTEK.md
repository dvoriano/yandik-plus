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
