# MOD-06 | Pengawasan Klinik dan Praktik Dokter Hewan

**Milestone:** M07  
**Status implementasi GitHub:** SEDANG sebagai draf M07-S1; KODE DITULIS, BELUM DIUJI; belum modul operasional.  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Source memuat kerangka modules/klinik dan halaman awal; belum cukup sebagai sistem pengawasan/pembinaan praktik lengkap.

## 2. Tujuan
Direktori dan pembinaan sarana praktik kedokteran hewan sesuai kewenangan, dengan data legalitas, standar layanan, dan tindak lanjut.

## 3. Pengguna dan hak akses
- Pengelola data praktik
- petugas pengawas/pembina
- verifikator provinsi/kab kota
- pimpinan
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Profil klinik/praktik, wilayah, jenis layanan dan tenaga penanggung jawab
- Status dokumen legalitas, tanggal berlaku dan keterangan verifikasi
- Inventaris fasilitas dasar dan kesiapan pelayanan
- Jadwal pembinaan/pengawasan, checklist sesuai jenis sarana
- Temuan, bukti, rekomendasi dan monitoring tindak lanjut
- Direktori publik hanya untuk informasi yang layak dipublikasikan

## 5. Alur kerja pengguna
Catat sarana → validasi dokumen → rencanakan kegiatan → periksa → draf BA → tindak lanjut → tutup temuan.

## 6. Objek data (usulan, belum migrasi final)
- veterinary_practice, facility_type, person_in_charge_ref
- practice_document, inspection, check_answer
- finding, corrective_action, verified_at
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Master wilayah, SDM (relasi terbatas), workflow pengawasan bersama dengan obat hewan, dashboard, GIS.

## Progres M07-S1 | Register dan checklist observasi DEMO
- [x] [Rancangan kode register Klinik/Praktik](../M07_S1_KLINIK_PRAKTIK_DEMO_2026_2030.md) disimpan, data sintetis, pembatasan wilayah berdasarkan kontrak M00-G1.
- [x] [22 QA tertulis](../../drafts/m07-practice-oversight/tests/practice.test.mjs), **0 dijalankan**.
- [ ] Pemetaan izin/SIP, checklist resmi, dokumen bukti, otorisasi server, UX HP dan alur inspeksi/pembinaan sebenarnya belum ada.

## 8. Checklist pengembangan
- [ ] MOD-06-01: Susun definisi jenis klinik/praktik dan otoritas tiap proses
- [ ] MOD-06-02: Bangun register sarana dengan kontrol data pribadi
- [ ] MOD-06-03: Rancang checklist pemeriksaan bertipe/versioned
- [ ] MOD-06-04: Gunakan generator BA dan temuan reusable
- [ ] MOD-06-05: Uji akses regional, dokumen dan ringkasan hasil

## 9. Kriteria selesai
Pengawasan simulasi dapat dilaksanakan dan direkap tanpa menggandakan komponen pengawasan obat; akses dokumen pribadi terbatas.

## 10. Catatan batasan, risiko, dan UX
Tidak menggantikan penerbitan SIP atau perizinan resmi. Jangan mempublikasikan nomor pribadi atau berkas internal.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).

## Lanjutan konsolidasi DEMO | 24 November 2026
[Halaman kerja](../../drafts/yandik-portal/review.html) diperluas. Detail kunjungan/checklist memakai M07-S1; belum pemeriksaan izin resmi. KODE DITULIS, BELUM DIUJI; 13 kasus tambahan QA lintas konsolidasi, 0 dijalankan. [Panduan preview](../CODEX_PREVIEW_YANDIK.md).

## 2026-11-24 | K4-A6: backend empat register teknis DEMO
- [Kontrak](../K4_A6_REGIONAL_REGISTERS_2026_2030.md): typed snapshot regional read-only obat/praktik/surveilans/sertifikat, 7 fixture 2026 independen, coverage null, sidecar telaah internal ber-revisi dan audit, grant aktif/scope asal, replay/rollback, command namespace lintas stream. 20 QA tertulis (7 pure + 13 rehearsal), 0 dijalankan. Bukan migrasi M06/M07/M13/M14, iSIKHNAS/APEL sync, penerbitan, izin atau diagnosis; belum HTTP/auth/DB riil. CODE_ONLY [skip ci]. Berikutnya K4-A7 pembinaan/administrasi.


## 2026-11-24 | K4-C5: pengawasan dan layanan teknis regional
- [Kontrak](../K4_C5_REGIONAL_FORMS_2026_2030.md): 4 panel sumber baca-saja dengan detail typed, filter dan histori, formulir klarifikasi/telaah/buka kembali, candidate actions server, reviewer DEMO kedua, 23 GET + 8 POST, retry/revisi shared. 8 QA backend + 8 JS baru, 0 dijalankan; manifest backend 288 (102+186). Tidak mengubah sumber, legalitas, diagnosis, sertifikat resmi, data riil atau integrasi HTTP. CODE_ONLY [skip ci]. Berikutnya K4-C6 pembinaan dan administrasi.

