# MOD-05 | Pengawasan Obat Hewan dan Sarana Distribusi

**Milestone:** M06  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Source memiliki kerangka modules/pengawasan dan halaman daftar sarana/distributor, belum dianggap sebagai workflow pengawasan lengkap.

## 2. Tujuan
Pengawasan sarana obat hewan yang terencana, terdokumentasi, dan memiliki tindak lanjut sampai selesai.

## 3. Pengguna dan hak akses
- Petugas pengawasan
- koordinator kegiatan
- verifikator/pimpinan
- pengelola data sarana
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Register sarana/distributor dan wilayah, penanggung jawab institusi
- Riwayat dokumen legalitas dan pengingat masa berlaku
- Rencana inspeksi berbasis kriteria risiko yang transparan
- Checklist pengawasan: kondisi simpan, kedaluwarsa, pencatatan, distribusi
- Bukti pemeriksaan, temuan, tingkat urgensi dan rekomendasi
- Draf berita acara serta surat tindak lanjut sesuai format
- Tenggat perbaikan, verifikasi dan penutupan temuan

## 5. Alur kerja pengguna
Pilih sarana → tugaskan pengawas → isi checklist di HP → catat temuan → draf BA → rekomendasi → pantau perbaikan.

## 6. Objek data (usulan, belum migrasi final)
- medicine_facility, legal_document, inspection_plan
- inspection, checklist_answer, finding, evidence
- corrective_action, status_history, document_ref
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Core workflow, master wilayah, GIS, dashboard pengawasan; basis inventaris obat Puskeswan tidak otomatis dianggap fasilitas distribusi yang sama.

## 8. Checklist pengembangan
- [ ] MOD-05-01: Validasi jenis sarana dan kewenangan pengawasan
- [ ] MOD-05-02: Rancang register dan checklist versi standar yang berlaku
- [ ] MOD-05-03: Buat mobile inspection dengan foto bukti dan draf
- [ ] MOD-05-04: Implementasi penilaian risiko/penjadwalan transparan
- [ ] MOD-05-05: Tambahkan tindakan perbaikan dan tes hak akses

## 9. Kriteria selesai
Skenario inspeksi dengan temuan memiliki petugas, lokasi, bukti, rekomendasi, tenggat dan penyelesaian yang dapat ditelusuri.

## 10. Catatan batasan, risiko, dan UX
YANDIK+ bukan penerbit izin. Checklist dan dokumen disesuaikan regulasi yang berlaku dan diverifikasi petugas berwenang.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
