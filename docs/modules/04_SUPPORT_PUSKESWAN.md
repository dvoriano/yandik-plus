# MOD-04 | Support Puskeswan: Kebutuhan, Bantuan dan Evaluasi

**Milestone:** M03 dan M04  
**Status implementasi GitHub:** **M03 SEDANG (prototype)** untuk draf/ajukan/verifikasi kebutuhan berbasis masalah; **M04 tetap RENCANA**. Belum backend/anggaran/bantuan resmi.  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Sudah ada data profiling, sarpras/obat dan konsep Puskeswan Prioritas; mekanisme pengajuan, verifikasi, alokasi, penyaluran dan evaluasi bantuan end-to-end belum diklaim tersedia.

## 2. Tujuan
Menghubungkan kebutuhan berbasis data dengan bantuan provinsi yang tepat sasaran, transparan, dapat dipertanggungjawabkan dan terpantau.

## 3. Pengguna dan hak akses
- Pengusul Puskeswan
- koordinator kab/kota
- verifikator provinsi
- penanggung jawab kegiatan/paket
- pimpinan
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Kebutuhan otomatis disarankan dari profil: alat rusak, sarana kurang, stok kosong
- Puskeswan konfirmasi usulan kategori, jumlah, alasan, urgensi dan bukti
- Antrian verifikasi per wilayah, revisi dan klarifikasi
- Skor prioritas dengan indikator, alasan dan override manusia tercatat
- Rencana dukungan disesuaikan kewenangan dan ketersediaan anggaran
- Paket, jadwal dan bukti distribusi; BAST/dokumen draf otomatis
- Monitoring pemanfaatan dan kondisi bantuan setelah penerimaan

## 5. Alur kerja pengguna
Data Profil/APEL → kebutuhan teridentifikasi → usulan → verifikasi → penetapan prioritas manusia → alokasi/penyaluran resmi → BAST → evaluasi.

## 6. Objek data (usulan, belum migrasi final)
- support_need, need_evidence, verifier_decision
- priority_indicator, score_version, rationale
- support_proposal, fund_reference, human_approval
- support_delivery, bast_ref, utilization_review
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Profil (kondisi alat/obat/SDM), APEL (beban pelayanan), workflow bersama, dashboard pimpinan dan GIS.

## Progres M03-S2
- [x] Pemeriksaan metadata bukti DEMO sebelum pengajuan dan checkbox pemeriksa sebelum kebutuhan berstatus terverifikasi.
- [x] Cegah usulan barang serupa dalam satu Puskeswan meskipun sumber permasalahannya berbeda; histori penolakan memerlukan alasan pengajuan ulang.
- [x] [GitHub Actions SUCCESS: 154 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527), termasuk 15 Node dan 2 Chromium baru.
- [ ] **Bukan** unggah foto, validasi keaslian bukti, pemeriksaan fisik, penyimpanan DB atau persetujuan alokasi.
- Detail [M03-S2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_EVIDENCE_AND_DEDUP.md).

## Progres M03-S1
- [x] Model kebutuhan yang wajib merujuk masalah terverifikasi melalui `problem_id` dan ID Puskeswan yang sama; tidak menyalin deskripsi.
- [x] Field contoh: kategori, barang, jumlah, satuan, urgensi, alasan, status & histori.
- [x] Draf, pengajuan, koreksi, verifikasi, penolakan dan tes akses role wilayah pada data fiktif.
- [x] UI mobile-first demo dan 15 tes Node + 3 tes browser baru; [GitHub Actions SUCCESS: 137 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052).
- [ ] Skor prioritas adil, dokumen bukti, verifikasi resmi, database, autentikasi, integrasi, alokasi dan BAST belum dibuat.
- [Rincian M03-S1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_LINKED_SUPPORT_NEEDS.md).

## 8. Checklist pengembangan
- [x] MOD-04-01: Kategori dan data minimum **untuk prototype** ditentukan; perlu review kedinasan sebelum final.
- [ ] MOD-04-02: Susun kriteria prioritas yang adil bagi Puskeswan terpencil (next M03-S3).
- [x] MOD-04-03a: Cek bukti metadata dan deteksi duplikat **di prototype**, [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527).
- [x] MOD-04-03: Form usulan + verifikasi dan alasan koreksi **sebagai prototype fiktif**, belum aplikasi resmi.
- [ ] MOD-04-04: Bangun simulasi penetapan dan rencana paket bantuan
- [ ] MOD-04-05: Buat pencatatan distribusi, BAST dan evaluasi menggunakan data dummy

## Batas modul dengan M02-S4
M02 kini memiliki **prototype register Permasalahan Puskeswan** di browser dengan data DEMO. Itu **tidak sama dengan pengajuan kebutuhan, prioritas bantuan, keputusan alokasi, serah terima atau BAST**. M03 **SEDANG (prototype)**, M04 tetap **RENCANA**. Referensi kebutuhan ke `problem_id` sudah ada di kode fiktif, tanpa auto-approval atau auto-budgeting.
- [x] Domain sumber masalah teridentifikasi sebagai prototype M02-S4 [bukti](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROBLEMS_AND_REFERENCES.md).
- [x] Tautan **model prototype** problem → kebutuhan dan verifikasi kebutuhan tersedia (bukan transaksi database resmi).
- [ ] Prioritas akhir, keputusan bantuan sah, distribusi dan BAST belum dibuat.

## 9. Kriteria selesai
Simulasi satu bantuan dapat ditelusuri dari sumber kebutuhan sampai BAST dan dampaknya; tidak ada penetapan bantuan otomatis tanpa kewenangan manusia.

## 10. Catatan batasan, risiko, dan UX
Peringkat pelayanan tinggi tidak otomatis mendominasi bantuan; fasilitas terpencil/kekurangan tenaga tetap dipertimbangkan. Sistem tidak melakukan pengadaan atau pembelanjaan otomatis. Rujuk juga docs/SUPPORT_PUSKESWAN.md.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
