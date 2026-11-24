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

## Lanjutan K1/K2 | Editor konsolidasi 24 November
[Daftar aktif dan mutasi DEMO](../../drafts/yandik-portal/review.html#profil-sdm) menggunakan interval penempatan M05-15, akhir eksklusif, histori sebelum/sesudah dan proyeksi Desember. Cakupan tidak dipromosikan dari parsial ke lengkap; catatan kompetensi bukan sertifikat. [19 QA lintas Profil/SDM](../../drafts/yandik-portal/tests/personnel.test.mjs), 0 dijalankan. Implementasi riil, impor, role/server, histori resmi dan bukti kompetensi belum. Status resmi mengikuti ROADMAP.

## 2026-11-24 | K4-A4: backend SDM Veteriner DEMO
- [Kontrak](../K4_A4_STAFF_TYPED_WRITER_2026_2030.md): master/interval eksklusif, histori mutasi, register/assign/end, catatan kompetensi, coverage tahunan, rekap profil dalam transaksi baca, grant aktif, replay dan rollback. 26 QA tertulis (8 pure + 18 memory rehearsal), 0 dijalankan. Bukan data pegawai/otorisasi resmi; belum API, impor, persetujuan mutasi, DB riil atau persistensi. CODE_ONLY [skip ci]. Berikutnya K4-A5 Support Puskeswan dengan crosswalk terpisah.


## 2026-11-24 | K4-C3: formulir tahunan Profil, Inventaris dan SDM
- [Kontrak](../K4_C3_ANNUAL_FORMS_2026_2030.md): 7 form profil, 198 butir/15 kelompok katalog dari backend, pencarian, salin tahun sebelumnya, konfirmasi butir/kelompok, telaah, roster SDM scoped, form penempatan/mutasi/kompetensi kandidat, retry ID tetap dan revision guard. 21 GET + 8 POST; 6 QA backend + 10 JS baru, 0 dijalankan. Manifest backend 267 (97+170). Belum browser transport, pengujian, data riil/role resmi. CODE_ONLY [skip ci]. Berikutnya K4-C4 perluasan Support Puskeswan.

