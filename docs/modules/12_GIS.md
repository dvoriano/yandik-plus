# MOD-12 | Peta GIS Kesehatan Hewan

**Milestone:** M10  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Ada informasi lokasi/koordinat Puskeswan dan aset peta tertentu dalam snapshot, belum ada peta lintas modul lengkap.

## 2. Tujuan
Peta layanan kesehatan hewan untuk merencanakan dukungan dan pengawasan serta melihat wilayah yang sulit terjangkau.

## 3. Pengguna dan hak akses
- Provinsi
- kab/kota
- pengawas
- pimpinan
- publik untuk layer yang disetujui
Hak akses rinci mengikuti modul Core Platform, termasuk pembatasan peran dan wilayah.

## 4. Fitur yang direncanakan
- Sebaran Puskeswan dan status profil/verifikasi
- Sebaran sarana obat hewan dan klinik sesuai hak akses
- Layer kebutuhan fasilitas, kekurangan SDM dan prioritas dukungan
- Layer pengawasan dan tindak lanjut berdasarkan wilayah
- Agregat kegiatan PHMS/zoonosis tanpa menampilkan lokasi sensitif
- Filter kab/kota, jenis objek, status, waktu dan legenda yang jelas

## 5. Alur kerja pengguna
Pilih jenis peta → filter wilayah → lihat ringkasan titik/agregat → buka profil objek jika memiliki izin.

## 6. Objek data (usulan, belum migrasi final)
- facility_id, geo_point institusional, area_code
- layer_visibility, last_verified
- aggregation_grid, location_precision
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Profil, SDM, Support, Pengawasan, PHMS dan dashboard; satu master wilayah.

## 8. Checklist pengembangan
- [ ] MOD-12-01: Audit kualitas koordinat Puskeswan, tanpa data pribadi
- [ ] MOD-12-02: Susun standar level presisi untuk layer publik/internal
- [ ] MOD-12-03: Bangun layer dasar dengan data fiktif
- [ ] MOD-12-04: Tambah filter wilayah, legenda dan status verifikasi
- [ ] MOD-12-05: Uji akses data sensitif dan perilaku pada HP

## 9. Kriteria selesai
Layer dan filter konsisten dengan master wilayah; pengguna publik tidak melihat koordinat rahasia/lokasi pribadi; data tidak terverifikasi diberi penanda.

## 10. Catatan batasan, risiko, dan UX
GIS adalah alat analisis, bukan konfirmasi status penyakit; visualisasi lokasi PHMS perlu agregasi dan aturan rilis ketat.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
