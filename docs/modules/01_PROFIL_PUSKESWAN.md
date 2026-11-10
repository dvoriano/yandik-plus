# MOD-01 | Profil Puskeswan Terpadu

**Milestone:** M02  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Profiling Puskeswan sudah memiliki sebagian legalitas, SDM, bangunan, sarpras, peralatan, obat/BHP, layanan dan permasalahan. Data belum lengkap pada semua Puskeswan.

## 2. Tujuan
Satu kartu identitas Puskeswan yang menjadi referensi untuk APEL, SDM, kebutuhan dukungan, pembinaan dan analitik tanpa isian berulang.

## 3. Pengguna dan hak akses
- Petugas Puskeswan
- koordinator kab/kota
- verifikator provinsi
- pimpinan baca agregat
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Profil legalitas, kontak institusi, wilayah kerja dan lokasi fasilitas
- Daftar SDM aktif melalui referensi master SDM, bukan menulis nama berulang
- Inventaris bangunan, ruang, peralatan, kendaraan, kondisi, pemeliharaan
- Persediaan inti obat dan BHP (jenis, ketersediaan, tanggal pembaruan)
- Profil kebutuhan dan masalah dengan foto bukti opsional
- Kelengkapan profil, status verifikasi dan pembaruan terakhir
- Rapor kesiapan dan riwayat bantuan / pembinaan

## 5. Alur kerja pengguna
Buka Profil Saya → lihat data sudah terisi → perbarui hanya bagian berubah → unggah bukti jika perlu → kirim untuk verifikasi → profil digunakan modul lain.

## 6. Objek data (usulan, belum migrasi final)
- puskeswan_id sebagai kunci utama
- facility_profile, asset_item, asset_condition
- inventory_snapshot, profile_verification, issue_note
- effective_date, source_id, updated_by
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
SDM sebagai sumber tenaga; APEL sebagai sumber statistik pelayanan; Support membaca inventaris dan kesenjangan fasilitas; GIS memakai koordinat fasilitas yang disetujui.

## 8. Checklist pengembangan
- [ ] MOD-01-01: Audit dan petakan field profiling yang sudah ada
- [ ] MOD-01-02: Definisikan ID tunggal dan data dictionary per bagian profil
- [ ] MOD-01-03: Rancang pembaruan per bagian tanpa mengulang seluruh form
- [ ] MOD-01-04: Tambahkan penanda verifikasi, asal data, histori perubahan
- [ ] MOD-01-05: Buat tampilan satu halaman ringkas di HP

## 9. Kriteria selesai
Satu Puskeswan tidak terduplikasi; SDM dan pelayanan otomatis ditarik dari sumber masing-masing; data kosong ditampilkan sebagai belum tersedia, bukan nol.

## 10. Catatan batasan, risiko, dan UX
Jangan menampilkan nomor pribadi tenaga atau dokumen legalitas tidak-publik pada profil publik.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
