# MOD-02 | APEL Puskeswan 2.0: Pelaporan dan Apresiasi

**Milestone:** M05  
**Status implementasi GitHub:** **M05-0 sampai M05-6 KODE DITULIS, BELUM DIUJI** untuk pelaporan, workflow, checklist, kontrak aturan tahunan serta model rapor/tren deskriptif 2026–2030. **M05-7+ RENCANA**. Belum ada skor/predikat resmi, UI live, atau perubahan Flask/website.  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.4 / 20 November 2026 (cakupan 2026–2030).

## Implementasi M05-6

[Katalog M05-6](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-mapping) · [20 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-mapping/tests/mapping.test.mjs) (0 dijalankan) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_6_DATA_DICTIONARY_MAPPING_2026_2030.md). Katalog 36 field semantik pada 8 domain. Nama tabel/kolom aktual belum tersedia dan tetap null; kandidat DEMO tidak pernah dianggap terverifikasi. **20 QA tertulis, 0 dijalankan.** [Spesifikasi](../M05_6_DATA_DICTIONARY_MAPPING_2026_2030.md).

## Implementasi M05-5

[Kode M05-5](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-reconciliation) · [20 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-reconciliation/tests/reconciliation.test.mjs) (0 dijalankan) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_5_SOURCE_RECONCILIATION_2026_2030.md). Kontrak rekonsiliasi empat sumber DEMO, tanpa konektor live. Structural match bukan validasi sumber resmi; digest dan atomisitas snapshot belum diverifikasi. **20 QA tertulis, 0 dijalankan.** [Spesifikasi](../M05_5_SOURCE_RECONCILIATION_2026_2030.md).

## Implementasi M05-4

[Kode M05-4](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-dashboard) · [22 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-dashboard/tests/dashboard.test.mjs) (0 dijalankan) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_4_REPORT_TREN_APEL_2026_2030.md). Model hanya mengolah preview DEMO; rekap tahun tidak mencampur metrik/satuan, tren tidak menghitung pertumbuhan atau menyatakan tahun comparable. [Rincian](../M05_4_REPORT_TREN_APEL_2026_2030.md). **22 QA tertulis, 0 dijalankan.**

## 1. Kondisi awal
Pengisian pelayanan bulanan, dashboard, Data Saya, checklist kepatuhan, profil, rekap dan penghargaan sudah menjadi bagian website. Detail aturan berdasarkan juknis APEL harus dipertahankan.

## 2. Tujuan
Pelaporan bulanan yang makin mudah, rapor kinerja dan pengambilan keputusan tanpa menyuruh Puskeswan memasukkan ulang seluruh pelayanan. **Cakupan roadmap APEL 2026–2030**, dengan kontrak kebijakan/perhitungan tahunan terpisah; tahun baru tidak mewarisi rumus, ambang maupun tenggat dari tahun sebelumnya tanpa keputusan.

## 3. Pengguna dan hak akses
- Pelapor Puskeswan
- verifikator provinsi
- koordinator wilayah
- pimpinan
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Form bulanan dengan validasi angka, keterangan, draf dan riwayat revisi
- Pelacakan pelaporan per bulan dan tenggat, termasuk cek bulan kosong
- Tren bulanan/triwulan/tahunan dan komparasi internal yang adil
- Rapor Puskeswan dengan dimensi pelayanan, kepatuhan laporan, kesiapan dan pembinaan
- Aturan penilaian apresiasi berversi untuk **setiap tahun 2026–2030** dengan parameter/tie-breaker terdokumentasi dan persetujuan terpisah
- Peringatan data tak wajar untuk ditinjau, bukan koreksi otomatis
- Ekspor rekap Excel/PDF dan format berita/pengumuman yang mudah dibaca

## 5. Alur kerja pengguna
Puskeswan pilih bulan → angka + bukti → pratinjau → kirim → koreksi jika diminta → rekap/rapor otomatis diperbarui.

## 6. Objek data (usulan, belum migrasi final)
- laporan_bulanan, puskeswan_id, periode YYYY-MM
- jumlah per jenis layanan, sumber dan bukti
- report_revision, validation_flag, reporting_rule_version, scoring_rule_version, policy_year
- annual_report_card, audit_verification
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Satu profil dan SDM, dashboard pimpinan, dukungan berbasis kebutuhan. Integrasi iSIKHNAS bersifat impor/rekap sesuai izin, bukan mewajibkan input ganda.

## 8. Checklist pengembangan
- [x] MOD-02-01A: **Tulis** kontrak data/QA DEMO multi-tahun 2026–2030 (M05-0, BELUM DIUJI)
- [ ] MOD-02-01B: Jalankan dan cocokkan regresi aturan penghitungan 2026 terhadap juknis dan kode asli (izin G0 diperlukan)
- [x] MOD-02-02A: **Tulis** kontrak simpan draf, kirim, kembalikan, revisi dan riwayat (M05-1 DEMO, BELUM DIUJI)
- [x] MOD-02-02B1: **Tulis** checklist status bulanan, kalender usulan per tahun, pengecualian per bulan dan simulasi pembandingan tanggal (M05-2, BELUM DIUJI)
- [ ] MOD-02-02B2: Pembuktian tenggat dan jam WIB resmi, timestamp penerimaan server, status tepat waktu/terlambat yang sah dan regresi nyata (belum dilakukan)
- [x] MOD-02-03A: **Tulis** katalog kategori/usulan rule-set independen tiap tahun **2026–2030** dan register 12 gerbang review (M05-3, BELUM DIUJI)
- [ ] MOD-02-03B: Verifikasi rumus 2026 dan tetapkan/ujikan aturan 2027–2030 beserta bobot, sumber, penanda seri, kelengkapan data dan persetujuan tahun terkait
- [ ] MOD-02-04: Buat rapor & peringatan anomali terjelaskan
- [ ] MOD-02-05: Buat generator laporan triwulan/semester/tahunan

## 9. Kriteria selesai
Untuk contoh data yang sama, rekap 2026 harus terbukti identik dengan sebelum pengembangan; satu entri layanan bulanan per Puskeswan; **2027–2030** memakai versi aturan yang ditetapkan pada tiap tahun, **bukan** duplikasi otomatis 2026. Bulan belum melapor berbeda dari laporan nol. Kesesuaian ini masih kriteria, **belum diuji**.

## 10. Catatan batasan, risiko, dan UX
Juknis: nol bila tidak ada kegiatan; investigasi berdasarkan lokasi/kejadian; pemeriksaan hewan kurban ante dan post pada satu hewan tidak dihitung dua; APEL melaporkan pelayanan Puskeswan, bukan per individu; tenggat bulanan sesuai ketentuan (umumnya tanggal 9, publikasi 10). Tidak menjadikan papan apresiasi sebagai pembanding mutlak daerah.

**Rancangan baseline M05-0 (19 November 2026):** [APEL Multi-Tahun 2026–2030](../M05_0_APEL_MULTIYEAR_2026_2030.md), [kode DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-multiyear), 29 skenario ditulis, 0 dijalankan. 2026 referensi butuh parity; 2027–2030 belum ada keputusan kebijakan.

**Rancangan lifecycle M05-1 (19 November 2026):** [Siklus Draf, Submit dan Koreksi APEL 2026–2030](../M05_1_APEL_REPORT_WORKFLOW_2026_2030.md), [kode DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-workflow). Ada 19 skenario tertulis, 0 dijalankan. Perintah memakai revisi dan identitas sesi backend dalam kontrak, tetapi belum ada autentikasi/DB/approval resmi; status terkirim tidak otomatis berarti laporan terverifikasi.

**Rancangan checklist M05-2 (19 November 2026):** [Checklist Kepatuhan 2026–2030](../M05_2_CHECKLIST_COMPLIANCE_2026_2030.md), [kode DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-compliance). **28 skenario tertulis, 0 dijalankan.** Draf ≠ terkirim ≠ diverifikasi; tanggal tenggat hanya usulan per tahun, ketepatan waktu belum dapat ditentukan secara resmi.

**Rancangan rule-set M05-3 (19 November 2026):** [Evaluasi dan Apresiasi APEL 2026–2030](../M05_3_ANNUAL_RULES_2026_2030.md), [kode DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-rules), **29 QA ditulis, 0 dijalankan**. Konsep 2026 berupa referensi historis yang belum diverifikasi, 2027 usulan, 2028–2030 belum ditetapkan. Tidak ada skor, ranking, penghargaan, bukti ketepatan waktu atau izin publikasi resmi.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).


## Tautan pengembangan lintas modul M04-I1 (16 November 2026)
[Workspace DEMO](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I1_INTEGRATED_WORKSPACE.md) menggunakan identitas fiktif dan fungsi M02/M03, snapshot baca-saja SDM/APEL dan model S10–S15. **KODE DITULIS, BELUM DIUJI.** Tidak mengubah status modul produksi, tidak menyatukan sumber asli, tidak mengimplementasikan APEL 2.0 atau RBAC/API/DB server. Kontrak data dan akses server menjadi pekerjaan lanjutan.
