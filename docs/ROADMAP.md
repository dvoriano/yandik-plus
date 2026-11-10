# ROADMAP & PROGRES YANDIK+ | Sumber Status Utama

**Diperbarui:** 10 November 2026 (WIB)  
**Ruang lingkup:** pengembangan **langsung di GitHub**, tanpa VPS, perangkat lokal, atau deployment.  
**Mulai sesi baru:** [PROJECT_STATE.md](../PROJECT_STATE.md) → dokumen ini → [WORKLOG.md](WORKLOG.md) → [Issue #1](https://github.com/dvoriano/yandik-plus/issues/1).  
**Acuan:** [MASTERPLAN](MASTERPLAN.md) · [Indeks 15 modul](MODULES_INDEX.md) · [Riwayat perubahan](CHANGELOG_ROADMAP.md).

## Arti status
- **SELESAI:** keluaran/commit dan bukti telah ada untuk ruang lingkup yang disebut; dokumentasi selesai tidak berarti modul terimplementasi.
- **SEDANG:** pekerjaan nyata sedang dilakukan; ada file/commit/issue yang dapat diperiksa.
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

## B. Sedang dikerjakan (kode/pekerjaan aktif)
| ID | Pekerjaan | Status tepat | Syarat selesai |
|---|---|---|---|
| M00 | Fondasi pengembangan langsung di GitHub | **SEDANG**: dokumentasi & validator tersedia; source aplikasi lengkap belum masuk | Lingkungan kode pada branch, dependensi, konfigurasi dummy, tes sintaks/smoke dan pemeriksaan batas data selesai |

### M00: subpekerjaan
- [x] M00-A: buat branch dan draft PR agar `main` tidak berubah
- [x] M00-B: tulis standar pengembangan, roadmap, modul dan validator awal
- [x] M00-C: buat handoff permanen lintas percakapan
- [ ] M00-D: masukkan source Flask hasil snapshot sanitasi **secara langsung melalui kemampuan GitHub yang tersedia**, tanpa meminta pengguna melakukan download/PowerShell/SSH
- [ ] M00-E: bentuk konfigurasi dummy, dependency specification dan tes yang dapat diperiksa di GitHub
- [ ] M00-F: test regresi APEL, integritas struktur dan keamanan minimum sebelum M00 ditutup

**Catatan dependensi:** M00-D mungkin belum dapat diselesaikan dalam satu operasi melalui akses GitHub saat ini. Tidak boleh menyatakan source sudah di repo atau memaksa langkah manual; tetap kerjakan bagian yang memungkinkan langsung di GitHub, dengan status sesuai bukti.

## C. Rencana per modul
| ID | Prioritas | Modul/keluaran | Dependensi | Dokumen |
|---|---|---|---|---|
| M01 | P0 | Core: hak akses wilayah, master Puskeswan, audit dan workflow | M00 | [Core](modules/00_CORE_PLATFORM.md) |
| M02 | P0 | Profil dan SDM terpadu, sarpras dan obat, asal data | M01 | [Profil](modules/01_PROFIL_PUSKESWAN.md), [SDM](modules/03_SDM_VETERINER.md) |
| M03 | P0 | Support: kebutuhan, bukti, verifikasi, prioritas | M02 | [Support](modules/04_SUPPORT_PUSKESWAN.md) |
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
**Setiap ada progres nyata**, perbarui paling sedikit:
1. [PROJECT_STATE.md](../PROJECT_STATE.md): status terbaru dan langkah berikut, ringkas untuk chat baru.
2. Dokumen ini: ubah checklist/status hanya dengan bukti hasil.
3. [WORKLOG.md](WORKLOG.md): satu entri ringkas yang menunjuk commit/issue/PR.
4. Dokumen modul yang berubah, bila terkait; [CHANGELOG_ROADMAP.md](CHANGELOG_ROADMAP.md) bila ada penambahan/pengubahan/penghapusan scope.
5. Issue/PR yang berhubungan. Jangan menandai selesai kalau baru rencana atau kode belum diuji.

## F. Batas mutlak
Website https://yandikvo.my.id/ dan seluruh komponen produksinya **tidak berubah**; tidak ada koneksi VPS YANDIK+, VPS Indodax, live database, atau otomatisasi deploy. Persiapan staging/deploy hanya setelah pendanaan, pengujian dan persetujuan terpisah.
