# MOD-01 | Profil Puskeswan Terpadu

**Milestone:** M02  
**Status implementasi GitHub:** SEDANG (prototype UI mobile-first dengan tes browser otomatis berhasil; belum Flask/API/DB maupun penggunaan petugas).  
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

## Progres M02-S4: daftar masalah dan data sumber baca-saja
- [x] Prototype Permasalahan: draf, ajukan, verifikasi, perbaikan, catatan tindak lanjut dan selesai, **bukan** alokasi bantuan.
- [x] Kartu SDM dan APEL dari snapshot fiktif berdasarkan ID Puskeswan, tanpa input ulang. APEL 0 tidak dianggap belum melapor.
- [x] 20 tes model Node + 3 tes browser baru; total 119 tes otomatis [GitHub CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101).
- [ ] Adapter real SDM/APEL dan register masalah persisten serta izin server/DB belum ada.
- [Dokumen M02-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROBLEMS_AND_REFERENCES.md).

## Progres M02-S3: uji UI dan pemetaan domain
- [x] Draf tersimpan bisa diajukan tanpa pengetikan ulang; tampilan pimpinan tidak merender rincian individu.
- [x] Browser Chromium headless diuji pada viewport 320 dan 375 px, termasuk siklus kirim → koreksi → setuju.
- [x] 65 Python + 25 Node + 6 browser, [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703).
- [x] [Peta sembilan domain Profiling 2026](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROFILING_2026_MAPPING.md) ditulis sebagai **rancangan**, belum pemetaan field-level nyata.
- [ ] Uji UX petugas, screen reader, field asal data, API Flask dan persistensi masih terbuka.

## Progres M02-S2: Tampilan Profil Saya (prototype interaktif)
- [x] [HTML/CSS/JS mobile-first](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/prototypes/profil-puskeswan/) untuk petugas dan antrian verifikator, tombol besar dan label bantuan.
- [x] Status 5 bagian, draf/ajukan/review/perbaikan dapat dicoba pada data fiktif di memori browser.
- [x] 20 tes model Node serta sintaks JS dan tes Python sebelumnya [GitHub Actions SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701).
- [x] Browser E2E sintetis telah lulus, [Actions](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703).
- [ ] Uji UX petugas nyata, persistensi dan autentikasi API server belum selesai.
- [Dokumen M02-S2](../M02_UI_DEMO.md).

## Progres M02-S1: pembaruan profil per bagian
- [x] Prototype draf/edit/ajukan, verifikasi/koreksi/tolak dengan alasan, akses role/wilayah dan versi optimistis.
- [x] Status 5 bagian profil dan audit tanpa menimpa catatan terdahulu.
- [x] 25 tes tambahan, total 65 tes fondasi [GitHub Actions SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389).
- [ ] UI petugas dari HP, field Profiling riil, persistensi DB, upload bukti belum tersedia.
- Detail: [M02_PROFILE_EDITS.md](../M02_PROFILE_EDITS.md).

## Progres dasar teknis
- [x] Kontrak data Profil/Sarpras, relasi ID Puskeswan, data ber-tanggal dan status verifikasi diuji [GitHub CI](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033).
- [ ] Form profiling lama, riwayat perubahan database, kelengkapan per bagian dan UI HP belum diimplementasikan.
- Lihat [M01-S2](../M01_MASTER_DATA.md) untuk kontrak data. **Status M02 kini SEDANG sebagai prototype**, belum modul operasional.

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
