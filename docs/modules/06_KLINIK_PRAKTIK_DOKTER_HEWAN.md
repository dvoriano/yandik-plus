# MOD-06 | Pengawasan Klinik dan Praktik Dokter Hewan

**Milestone:** M07  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
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
