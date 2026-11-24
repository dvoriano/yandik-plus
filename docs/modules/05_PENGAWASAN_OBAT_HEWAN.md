# MOD-05 | Pengawasan Obat Hewan dan Sarana Distribusi

**Milestone:** M06  
**Status implementasi GitHub:** SEDANG sebagai draf M06-S1; KODE DITULIS, BELUM DIUJI. Bukan sistem pengawasan operasional.  
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

## Progres M06-S1 | Register dan checklist observasi DEMO
- [x] [Register sarana dan model observasi fiktif](../M06_S1_REGISTER_OBAT_HEWAN_DEMO_2026_2030.md): 3 sarana/2 kunjungan contoh, sumber dan legalitas tidak terverifikasi.
- [x] [24 skenario QA tertulis](../../drafts/m06-medicine-oversight/tests/medicine.test.mjs), **0 dijalankan**.
- [ ] Klasifikasi sarana dan standar inspeksi resmi, foto bukti, hak akses riil, pembinaan sampai penutupan, dan pengujian belum tersedia.

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

## Lanjutan konsolidasi DEMO | 24 November 2026
[Halaman kerja](../../drafts/yandik-portal/review.html) diperluas. Detail kunjungan/checklist dan usulan telaah memakai M06-S1; belum inspeksi resmi. KODE DITULIS, BELUM DIUJI; 13 kasus tambahan QA lintas konsolidasi, 0 dijalankan. [Panduan preview](../CODEX_PREVIEW_YANDIK.md).

## 2026-11-24 | K4-A6: backend empat register teknis DEMO
- [Kontrak](../K4_A6_REGIONAL_REGISTERS_2026_2030.md): typed snapshot regional read-only obat/praktik/surveilans/sertifikat, 7 fixture 2026 independen, coverage null, sidecar telaah internal ber-revisi dan audit, grant aktif/scope asal, replay/rollback, command namespace lintas stream. 20 QA tertulis (7 pure + 13 rehearsal), 0 dijalankan. Bukan migrasi M06/M07/M13/M14, iSIKHNAS/APEL sync, penerbitan, izin atau diagnosis; belum HTTP/auth/DB riil. CODE_ONLY [skip ci]. Berikutnya K4-A7 pembinaan/administrasi.


## 2026-11-24 | K4-C5: pengawasan dan layanan teknis regional
- [Kontrak](../K4_C5_REGIONAL_FORMS_2026_2030.md): 4 panel sumber baca-saja dengan detail typed, filter dan histori, formulir klarifikasi/telaah/buka kembali, candidate actions server, reviewer DEMO kedua, 23 GET + 8 POST, retry/revisi shared. 8 QA backend + 8 JS baru, 0 dijalankan; manifest backend 288 (102+186). Tidak mengubah sumber, legalitas, diagnosis, sertifikat resmi, data riil atau integrasi HTTP. CODE_ONLY [skip ci]. Berikutnya K4-C6 pembinaan dan administrasi.

