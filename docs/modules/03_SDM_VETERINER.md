# MOD-03 | Data SDM Veteriner dan Pengembangan Kompetensi

**Milestone:** M02 dan M15  
**Status implementasi GitHub:** RENCANA (spesifikasi terdokumentasi; kode baru belum dinyatakan selesai).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Ada modul SDM, direktori dan profil dasar, impor Excel serta statistik. Kelengkapan dan hubungan ke profil Puskeswan perlu diperiksa saat source diimpor.

## 2. Tujuan
Satu database tenaga dokter hewan, paramedik dan SDM terkait yang akurat untuk perencanaan layanan, pembinaan dan distribusi tugas.

## 3. Pengguna dan hak akses
- Petugas data SDM provinsi
- verifikator kab/kota
- admin Puskeswan
- pimpinan berizin
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Identitas kedinasan minimum, kompetensi, kategori jabatan, status aktif
- Riwayat penempatan dan mutasi tanpa menghapus histori lama
- Relasi SDM ke Puskeswan/organisasi serta beban kerja agregat
- Rekap pelatihan, Bimtek, sertifikat dan kebutuhan kompetensi
- Status verifikasi dan peringatan data lama / duplikat
- Impor data terkendali dengan pratinjau, validasi dan pencatatan perubahan

## 5. Alur kerja pengguna
Verifikator perbarui tenaga → konfirmasi penempatan → profil Puskeswan terbarui → statistik SDM ikut berubah.

## 6. Objek data (usulan, belum migrasi final)
- sdm_id, puskeswan_id, organisasi_id
- assignment_from, assignment_to, status_aktif
- kompetensi, pelatihan, bukti sertifikat (terbatas)
- verified_at, verified_by
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Profil Puskeswan, pembinaan, sertifikat terkait kompetensi, dashboard kebutuhan tenaga.

## Progres dasar teknis
- [x] Prototype ID SDM dan histori penempatan lintas Puskeswan; penempatan tumpang tindih ditolak [GitHub CI](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033).
- [ ] Migrasi data SDM asli, edit/validasi kab/kota, dan histori keaktifan pegawai belum dibuat.
- Lihat [M01-S2](../M01_MASTER_DATA.md). **Status modul tetap RENCANA.**

## 8. Checklist pengembangan
- [ ] MOD-03-01: Susun kamus SDM dan aturan minimisasi data
- [ ] MOD-03-02: Petakan data lama dan deduplikasi SDM
- [ ] MOD-03-03: Rancang histori penempatan serta validasi kab/kota
- [ ] MOD-03-04: Integrasikan dengan profil Puskeswan dan pelatihan
- [ ] MOD-03-05: Bangun rekap kecukupan SDM tanpa mempublikasikan kontak pribadi

## 9. Kriteria selesai
Mutasi satu tenaga mengubah agregat tempat lama dan baru secara benar tanpa hilang riwayat; data pribadi hanya dilihat oleh pihak berwenang.

## 10. Catatan batasan, risiko, dan UX
Data SDM bukan akun login; seseorang dapat punya akun tanpa harus duplikat kepegawaian. Jangan menggantikan sistem resmi kepegawaian.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
