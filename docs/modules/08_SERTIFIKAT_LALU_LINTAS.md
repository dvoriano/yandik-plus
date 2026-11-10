# MOD-08 | Sertifikat Veteriner dan Lalu Lintas Hewan/Produk

**Milestone:** M14  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Kegiatan sertifikat veteriner dan lalu lintas merupakan kebutuhan kerja yang harus diakomodasi. Snapshot belum diverifikasi sebagai sistem resmi penerbitan sertifikat end-to-end.

## 2. Tujuan
Meminimalkan pengisian dokumen berulang dan memudahkan penelusuran berkas, status pemeriksaan, serta rekap kegiatan tanpa mengambil alih sistem penerbitan resmi.

## 3. Pengguna dan hak akses
- Petugas penerima/verifikator
- petugas pemeriksa teknis
- pejabat berwenang
- pemohon bila layanan publik kelak disetujui
Hak akses rinci mengikuti modul Core Platform, termasuk pembatasan peran dan wilayah.

## 4. Fitur yang direncanakan
- Register permohonan, nomor referensi, tanggal, asal/tujuan, jenis komoditas
- Checklist syarat yang berlaku menurut jenis lalu lintas
- Lampiran dan hasil pemeriksaan teknis yang dibatasi aksesnya
- Draf dokumen dan rekomendasi administratif sesuai format sah
- Catat nomor/status sertifikat dari mekanisme penerbitan resmi
- Kode verifikasi keabsahan hanya untuk data yang memang boleh diakses publik
- Rekap permohonan, status, volume dan tren per periode

## 5. Alur kerja pengguna
Permohonan dicatat → verifikasi syarat → pemeriksaan teknis → rekomendasi → penerbitan resmi di kanal berwenang → catat hasil dan rekap.

## 6. Objek data (usulan, belum migrasi final)
- application_id, applicant_ref minimal
- commodity_type, origin, destination, inspection
- document_requirement, verification, official_reference
- certificate_status, issued_at, issuer_role
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Master wilayah, workflow dokumen, dashboard, pengawasan, pustaka aturan; integrasi ke sistem resmi hanya bila tersedia izin dan API yang sah.

## 8. Checklist pengembangan
- [ ] MOD-08-01: Validasi alur bisnis dan pejabat penandatangan menurut jenis sertifikat
- [ ] MOD-08-02: Susun checklist persyaratan versioned
- [ ] MOD-08-03: Rancang register dan draf dokumen dummy
- [ ] MOD-08-04: Rancang pengaitan hasil resmi tanpa membuat sertifikat palsu
- [ ] MOD-08-05: Uji akses pemohon, petugas, pejabat dan publik

## 9. Kriteria selesai
Skenario permohonan dummy dapat ditelusuri hingga dicatat hasil resminya; tidak dapat menerbitkan atau memvalidasi sertifikat resmi tanpa mekanisme berwenang.

## 10. Catatan batasan, risiko, dan UX
Status ditetapkan saat pengembangan. Jangan mengklaim sertifikat dikeluarkan otomatis oleh YANDIK+. Penerbitan resmi dan tanda tangan tidak diambil alih.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
