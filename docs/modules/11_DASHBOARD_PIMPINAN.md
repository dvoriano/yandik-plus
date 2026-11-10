# MOD-11 | Dashboard Pimpinan dan Analitik Lintas Modul

**Milestone:** M08  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Dashboard APEL dan statistik pelayanan tersedia; belum ada dashboard pimpinan lintas kebutuhan, bantuan, pengawasan, SDM dan kegiatan dengan definisi metrik terpadu.

## 2. Tujuan
Pimpinan bisa melihat situasi pelayanan, masalah, progres tindak lanjut dan dukungan dalam satu layar dengan angka yang dapat ditelusuri sumbernya.

## 3. Pengguna dan hak akses
- Pimpinan baca saja
- koordinator provinsi
- analisis data berwenang
Hak akses rinci mengikuti modul Core Platform, termasuk pembatasan peran dan wilayah.

## 4. Fitur yang direncanakan
- Panel ringkas APEL per periode dan kepatuhan laporan
- Kesiapan profil, kekurangan sarpras/SDM, lokasi prioritas
- Usulan bantuan dan realisasi BAST serta evaluasi pemanfaatan
- Jadwal inspeksi, hasil pengawasan dan temuan belum selesai
- Ringkasan pembinaan, PHMS, sertifikat sesuai definisi dan kewenangan
- Drill-down dari angka agregat ke rekaman yang berizin
- Filter periode, wilayah, jenis layanan, status verifikasi dan sumber data

## 5. Alur kerja pengguna
Pimpinan buka ringkasan → pilih isu → filter wilayah/periode → lihat sumber dan status tindak lanjut → unduh ringkasan berizin.

## 6. Objek data (usulan, belum migrasi final)
- metric_definition, aggregation_period, source_module
- metric_snapshot, generated_at, validation_state
- access_role, filter_scope
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Hanya menarik sumber data terverifikasi dari setiap modul; tidak menjadi master data baru.

## 8. Checklist pengembangan
- [ ] MOD-11-01: Buat kamus indikator, periode dan metode hitung
- [ ] MOD-11-02: Rancang beranda 5-8 KPI prioritas tanpa membanjiri grafik
- [ ] MOD-11-03: Tetapkan akses wilayah dan pembatasan data pribadi
- [ ] MOD-11-04: Buat drill-down serta tanggal pembaruan/sumber
- [ ] MOD-11-05: Uji konsistensi angka dengan laporan modul sumber

## 9. Kriteria selesai
Setiap angka bisa ditelusuri ke modul, periode dan definisinya; perbedaan data tidak diam-diam disamakan; tidak menampilkan identitas tak perlu.

## 10. Catatan batasan, risiko, dan UX
Indikator tidak boleh menggunakan angka tanpa periode atau menggabungkan satuan layanan yang berbeda tanpa definisi.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
