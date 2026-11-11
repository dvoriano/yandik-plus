# ROADMAP & PROGRES YANDIK+ | Sumber Status Utama

**Diperbarui:** 11 November 2026 (WIB)  
**Ruang lingkup:** pengembangan **langsung di GitHub**, tanpa VPS, perangkat lokal, atau deployment.  
**Mulai sesi baru:** [PROJECT_STATE.md](../PROJECT_STATE.md) → dokumen ini → [WORKLOG.md](WORKLOG.md) → [Issue #1](https://github.com/dvoriano/yandik-plus/issues/1).  
**Acuan:** [MASTERPLAN](MASTERPLAN.md) · [Indeks 15 modul](MODULES_INDEX.md) · [Riwayat perubahan](CHANGELOG_ROADMAP.md).

**MODE KERJA TERBARU:** [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md). Kode baru hanya ditulis di GitHub, **tanpa CL/CI/tes dulu**, dan semua pemeriksaan ditumpuk pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Bukti 176 tes lama hanya berlaku sampai M03-S3; tidak ada klaim tes M03-S4.

## Dokumen penjelasan untuk pembaca nonteknis (11 November 2026)

**Revisi Ringkasan Eksekutif 1.1:** [dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) sekarang menegaskan **AI Agent sebagai sarana bantu pengembangan YANDIK+**, dengan kebutuhan kredit/token/kuota pemakaian yang perlu ditelaah pembiayaan dan pengendaliannya. Bukan persetujuan belanja, penggunaan layanan AI operasional, atau bukti sistem selesai.

| Keluaran | Keterangan | Kedudukan |
|---|---|---|
| [Ringkasan Eksekutif](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) | Bahan paparan singkat tujuan, manfaat, fungsi, kendali dan pertanyaan kelembagaan | **DRAF, SIAP DIBACA / BELUM DITELAAH FORMAL** |
| [Pengenalan Lengkap YANDIK+](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/PENGENALAN_YANDIK_PLUS.md) | 15 modul, fitur/fungsi, sistem kerja, peran, alur, mutu data, keamanan, hubungan SPBE, tahapan dan FAQ | **DRAF, SIAP DIBACA / BELUM DITELAAH FORMAL** |

Pemeriksaan dan persetujuan substansi dicatat pada [Issue #21](https://github.com/dvoriano/yandik-plus/issues/21), **masih terbuka**.

Penyusunan dokumen ini **tidak mengubah status pengembangan modul**, tidak mengesahkan aturan prioritas/anggaran, tidak menjadi bukti pengujian kode baru, dan tidak menambah pengeluaran CL/CI. Repositori masih **private**, sehingga pembaca membutuhkan izin GitHub.

## Arti status
- **SELESAI:** keluaran/commit dan bukti telah ada untuk ruang lingkup yang disebut; dokumentasi selesai tidak berarti modul terimplementasi.
- **SEDANG:** pekerjaan nyata sedang dilakukan; ada file/commit/issue yang dapat diperiksa.
- **BELUM DIUJI:** kode ditulis dan tersimpan di GitHub, tanpa eksekusi dan tanpa bukti lulus; tidak boleh dipindah ke SELESAI tanpa izin dan bukti QA.
- **RENCANA:** belum dikerjakan, termasuk usulan.
- **TERTUNDA:** menunggu sumber, keputusan atau dependensi tanpa menghalangi pekerjaan lain.
- **DIBATALKAN:** dikeluarkan dari scope aktif, dengan alasan tercatat di changelog.

## A. Selesai (dokumen dan persiapan, bukan fitur baru)
| ID | Pekerjaan | Bukti |
|---|---|---|
| DONE-01 | Pemetaan aplikasi Flask aktif melalui inspeksi read-only terdahulu | Catatan arsitektur di docs/ARCHITECTURE.md |
| DONE-02 | Snapshot source terpisah dan audit statis awal | Arsip sumber 168 file; paket pengembangan 171 file di percakapan, **bukan di repo** |
| DONE-03 | Repository private + branch pengembangan + PR draft | `develop/yandik-foundation`, [PR #9](https://github.com/dvoriano/yandik-plus/pull/9) |
| DONE-04 | Masterplan, 15 spesifikasi modul dan katalog | docs/MASTERPLAN.md + docs/modules/* |
| DONE-05 | UX, workflow, batasan keamanan, changelog | docs/UX_PAPERLESS.md, WORKFLOW_ENGINE.md, CHANGELOG_ROADMAP.md |
| DONE-06 | Validator kode awal untuk impor dan panduan | scripts/verify_import.py, docs/IMPORT_OFFLINE.md; **belum mengimpor kode Flask** |
| DONE-07 | Sistem serah-terima lintas chat dan tata kerja GitHub-only | PROJECT_STATE.md, docs/WORKLOG.md, docs/GITHUB_WORKFLOW.md |
| DONE-08 | Kode kontrak dan fixture fiktif + tes otomatis | [commit 2081606](https://github.com/dvoriano/yandik-plus/commit/2081606d0cd4109eb5f45415688ff4a663937fb6), [GitHub Actions: SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42837742904) |
| DONE-09 | Prototype role/wilayah, workflow immutable dan 12 tes tambahan | [commit 9fe3ce0](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac), [GitHub Actions: SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867) |

| DONE-10 | Kontrak master data Puskeswan, SDM/penempatan, profil, sarpras + 18 tes tambahan | [kode](https://github.com/dvoriano/yandik-plus/commit/420354a885c6291c609e4ab6f25347cadbd2360a), [tes](https://github.com/dvoriano/yandik-plus/commit/43ee5ff342659fb1bb96eac552bad687e3ab0854), [GitHub Actions sukses](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033) |
| DONE-11 | Prototype perubahan Profil per bagian, review, 25 tes tambahan | [kode](https://github.com/dvoriano/yandik-plus/commit/ee9cceecfe4a61c315e6bef6a38f0e6c9b4e30e8), [tes](https://github.com/dvoriano/yandik-plus/commit/12007b6d8cc1c96011e0b521510b0adf6d600557), [Actions: SUCCESS, 65 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389) |
| DONE-12 | M02-S2 Prototype UI HP Profil Saya + antrian verifikator, 20 tes model Node dan CI | [kode](https://github.com/dvoriano/yandik-plus/commit/3096d64f2b2d113318ba3ee365abe814c2f6a910), [GitHub Actions Python+Node SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701) |
| DONE-13 | M02-S3 perbaikan draf + mode pimpinan, tes browser HP 320/375, peta domain Profiling | [perbaikan](https://github.com/dvoriano/yandik-plus/commit/0ce6b2db1ef0f9ca417eea072f1307c1ee94de30), [tes Chromium](https://github.com/dvoriano/yandik-plus/commit/78cf52a06d38874581a6709bf7b22b723704ed40), [CI SUCCESS: 96 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703), [peta domain](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROFILING_2026_MAPPING.md) |
| DONE-14 | M02-S4 Permasalahan Puskeswan + kartu SDM/APEL baca-saja, 23 tes baru (20 Node + 3 Chromium) | [model](https://github.com/dvoriano/yandik-plus/commit/c973bdc3f744805b39c9cd39447cca185444ba95), [UI](https://github.com/dvoriano/yandik-plus/commit/f06ee93c134eac9f03871a7bf590391a41aee8b1), [Actions: 119 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101), [detail](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROBLEMS_AND_REFERENCES.md) |
| DONE-15 | M03-S1 usulan Support dari masalah terverifikasi, 15 tes Node dan 3 tes Chromium baru | [model](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926), [UI](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7), [GitHub Actions 137 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052) |
| DONE-16 | M03-S2 pemeriksaan metadata bukti, pencegahan duplikat per Puskeswan lintas masalah, 15 tes Node + 2 Chromium baru | [kode](https://github.com/dvoriano/yandik-plus/commit/41ce4079840af89e4f8216d3f31124ac5fb3e815), [UI](https://github.com/dvoriano/yandik-plus/commit/82691922ca6c602d22089951f8f0f0c4e26d75e1), [GitHub Actions SUCCESS 154 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527), [detail](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_EVIDENCE_AND_DEDUP.md) |
| DONE-17 | M03-S3 prioritas percobaan 5 faktor dan review provinsi, uji fairness dasar + stale review guard | [model](https://github.com/dvoriano/yandik-plus/commit/dfc49f323dc36f4526031fd370f93696a5658aae), [UI](https://github.com/dvoriano/yandik-plus/commit/7519ab003375041c46c2bfb7d18febe5beb1e897), [guard](https://github.com/dvoriano/yandik-plus/commit/87a14fd5d76a387e4b40792fd41c054795bd7b06), [CI 176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270), [dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_PRIORITY_ASSESSMENT.md) |

## B. Sedang dikerjakan (kode/pekerjaan aktif)
| ID | Pekerjaan | Status tepat | Syarat selesai |
|---|---|---|---|
| M00 | Fondasi dan source pengembangan GitHub | **SEDANG**: kontrak, fixture dan CI teruji; Flask legacy 171 file belum masuk repo | Source legacy terimpor, dependensi/config anonim dan tes runtime/regresi APEL berhasil |
| M01 | Core Platform: role/wilayah dan workflow | **SEDANG**: role/workflow dan master Profil/SDM/Sarpras prototype; **40 tes foundation** lulus [GitHub Actions](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033) | Role disepakati; endpoint legacy, transaksi audit dan pengujian akses API tersambung dan lulus |
| M02 | Profil Puskeswan terpadu | **SEDANG (prototype interaktif)**: form per bagian, Masalah→tindak lanjut, SDM/APEL baca-saja dummy; **65 Python + 45 Node + 9 Chromium = 119 tes** [Actions SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101) | Uji UX dan aksesibilitas pada HP nyata, field Profiling lama, otorisasi/API/DB server, integrasi sumber asli |
| M03 | Support Puskeswan: kebutuhan dan prioritas | **SEDANG**: M03-S1..S3 prototype teruji sebelumnya [176 tes lama](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270); **M03-S4A/S4B kode draft BELUM DIUJI**, [kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) | Pending test [backlog](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); evaluasi fairness, bobot kebijakan, source real/Flask, keamanan backend, uji petugas; tidak ada alokasi otomatis |

### M03-S4B: Alur telaah metodologi, KODE DITULIS / BELUM DIUJI
- [x] **Kode tersedia:** [review_ledger.mjs dan form review](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) berisi draf, pengajuan, permintaan perbaikan, pencatatan untuk pembahasan, dan penolakan metodologis. [commit](https://github.com/dvoriano/yandik-plus/commit/bfa697af515479ec05735badcde4c89222e8c5d8).
- [x] **Dokumentasi:** [alur dan batas kewenangan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4B_REVIEW_POLICY.md) serta [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] **Semua pemeriksaan ditunda:** logika status, validasi, revisi, tampilan, perlindungan sumber dan akses riil **BELUM DIUJI**.
- [ ] Tidak ada pengesahan bobot, pemilihan penerima, alokasi, pengadaan atau BAST. Mode tanpa CL/CI masih berlaku.

### M03-S4: Draft baru, sengaja BELUM DIUJI
- [x] **KODE ADA:** draft modul komparasi enam skenario anonim fiktif, tiga profil bobot dan indikator sensitivitas; [commit](https://github.com/dvoriano/yandik-plus/commit/3e30ac406a24ec17ee604b654251c7b3eb1cee7c).
- [x] **DOKUMEN ADA:** [rencana](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4_FAIRNESS_PLAN.md), [backlog semua pemeriksaan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md), [mode tanpa CL/CI](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md).
- [ ] **QA/tes kode:** TIDAK dijalankan atas instruksi pemilik. Syntax, perhitungan, browser HP dan integrasi masih **BELUM DIUJI**.
- [ ] **Keputusan kebijakan:** bobot dan batas skor belum disetujui; tidak boleh menjadi keputusan dukungan/anggaran.
- [ ] **Integrasi:** draft di `drafts/`, bukan modul aplikasi aktif; lanjut hanya ketika tes diizinkan dan hasil dikaji.
**M03-S4 tidak dimasukkan ke tabel SELESAI dan tidak mendapat DONE-18.** Tes terakhir M03-S3 tidak berlaku untuk draft ini.

### M00: subpekerjaan
- [x] M00-A: buat branch dan draft PR agar `main` tidak berubah
- [x] M00-B: tulis standar pengembangan, roadmap, modul dan validator awal
- [x] M00-C: buat handoff permanen lintas percakapan
- [ ] M00-D: masukkan source Flask hasil snapshot sanitasi **secara langsung melalui kemampuan GitHub yang tersedia**, tanpa meminta pengguna melakukan download/PowerShell/SSH
- [x] M00-E1: `.env.example`, fixture dummy, kontrak Profil/APEL/Support, 10 tes, GitHub Actions SUCCESS
- [ ] M00-E2: pemetaan dependensi Flask asli, konfigurasi anonim untuk runtime dan tes startup setelah source tersedia
- [ ] M00-F: test regresi APEL, integritas struktur dan keamanan minimum sebelum M00 ditutup

**Catatan dependensi:** M00-D mungkin belum dapat diselesaikan dalam satu operasi melalui akses GitHub saat ini. Tidak boleh menyatakan source sudah di repo atau memaksa langkah manual; tetap kerjakan bagian yang memungkinkan langsung di GitHub, dengan status sesuai bukti.

## C. Rencana per modul (M01, M02 dan M03 sudah di daftar SEDANG)
| ID | Prioritas | Modul/keluaran | Dependensi | Dokumen |
|---|---|---|---|---|
| M04 | P0 | Support: alokasi sesuai kewenangan, distribusi dan BAST | M03 | [Support](modules/04_SUPPORT_PUSKESWAN.md) |
| M05 | P1 | APEL 2.0: rapor, tren, koreksi, peraturan 2027 | M01/M02 | [APEL](modules/02_APEL_PUSKESWAN.md) |
| M06 | P1 | Pengawasan Obat Hewan | M01 | [Obat](modules/05_PENGAWASAN_OBAT_HEWAN.md) |
| M07 | P1 | Klinik/Praktik Dokter Hewan | M01 | [Klinik](modules/06_KLINIK_PRAKTIK_DOKTER_HEWAN.md) |
| M08 | P1 | Dashboard Pimpinan lintas modul | Modul sumber | [Dashboard](modules/11_DASHBOARD_PIMPINAN.md) |
| M09 | P2 | Notifikasi, PWA dan draf lapangan | M01 | [Notifikasi](modules/14_NOTIFIKASI_MODE_LAPANGAN.md) |
| M10 | P2 | GIS Kesehatan Hewan | M02 | [GIS](modules/12_GIS.md) |
| M11 | P2 | Pustaka Regulasi, SOP, AI opsional | M01 | [Pustaka/AI](modules/13_PUSTAKA_REGULASI_AI.md) |
| M12 | P2 | Administrasi Kegiatan dan Dokumen paperless | M01 | [Dokumen](modules/10_ADMINISTRASI_DOKUMEN.md) |
| M13 | P2 | PHMS, zoonosis dan surveilans (tidak duplikasi iSIKHNAS) | M01/M02 | [PHMS](modules/07_PHMS_ZOONOSIS.md) |
| M14 | P2 | Sertifikat Veteriner dan Lalu Lintas | M01 | [Sertifikat](modules/08_SERTIFIKAT_LALU_LINTAS.md) |
| M15 | P2 | Pembinaan, Bimtek, pengembangan SDM | M01/M02 | [Pembinaan](modules/09_PEMBINAAN_BIMTEK.md) |
| M16 | P3 | Kajian integrasi e-SPJ/kepegawaian/kanal eksternal | Evaluasi SPBE | [Administrasi](modules/10_ADMINISTRASI_DOKUMEN.md) |

## D. Item kualitas lintas modul
- **SEC-01 P0:** otorisasi API pengguna, reset password, akses dokumen, CSRF dan password hashing pada versi pengembangan.
- **DEV-01 P0:** dependensi yang bisa direproduksi, konfigurasi dummy dan fixture aman.
- **REG-01 P0:** regresi APEL termasuk satu laporan/bulan/Puskeswan, kategori dan hitung Kesmavet.
- **UX-01 P0:** uji lima pekerjaan umum di HP dengan pengguna nonteknis.
- **GOV-01 P1:** kamus data, kewenangan, dan peninjauan SPBE sebelum sistem resmi diintegrasikan.

## E. Aturan pembaruan
**Ketentuan baru:** buat kode tanpa tes/CL/CI terlebih dahulu, tandai **BELUM DIUJI**, letakkan di luar jalur workflow otomatis bila memungkinkan, tambahkan ke [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); `[skip ci]` di pesan commit. Tes baru hanya setelah owner memberi izin. Bukti tes lama tidak otomatis membenarkan kode baru.

**Setiap ada progres nyata**, perbarui paling sedikit:
1. [PROJECT_STATE.md](../PROJECT_STATE.md): status terbaru dan langkah berikut, ringkas untuk chat baru.
2. Dokumen ini: ubah checklist/status hanya dengan bukti hasil.
3. [WORKLOG.md](WORKLOG.md): satu entri ringkas yang menunjuk commit/issue/PR.
4. Dokumen modul yang berubah, bila terkait; [CHANGELOG_ROADMAP.md](CHANGELOG_ROADMAP.md) bila ada penambahan/pengubahan/penghapusan scope.
5. Issue/PR yang berhubungan. Jangan menandai selesai kalau baru rencana atau kode belum diuji.

## F. Batas mutlak
Website https://yandikvo.my.id/ dan seluruh komponen produksinya **tidak berubah**; tidak ada koneksi VPS YANDIK+, VPS Indodax, live database, atau otomatisasi deploy. Persiapan staging/deploy hanya setelah pendanaan, pengujian dan persetujuan terpisah.
