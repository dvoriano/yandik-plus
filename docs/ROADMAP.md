# ROADMAP & PROGRES YANDIK+ | Sumber Status Utama

**Diperbarui:** 10 November 2026  
**Ruang lingkup:** pengembangan GitHub offline, bukan pelaksanaan website aktif.  
**Acuan:** [MASTERPLAN](MASTERPLAN.md) · [Indeks modul](MODULES_INDEX.md) · [Riwayat perubahan](CHANGELOG_ROADMAP.md).

## Arti status
- **SELESAI:** ada bukti konkret (dokumen/commit, hasil uji); tahap selesai hanya dalam ruang lingkup yang ditulis.
- **SEDANG:** pekerjaan benar-benar dimulai dan ada keluaran/branch/PR, belum memenuhi kriteria selesai.
- **RENCANA:** belum dimulai, termasuk ide yang masih perlu validasi lapangan.
- **TERTUNDA:** ditahan karena dependensi, keputusan kewenangan, atau kebutuhan pendanaan.
- **DIBATALKAN:** dihapus dari rencana aktif dengan alasan dalam changelog. Tidak menghapus rekam jejak.

Status tidak dihitung dari perkiraan persentase. **Dokumen selesai ≠ modul berkode selesai ≠ sudah di-deploy.**

## A. Telah dilakukan (SELESAI)
| ID | Pekerjaan | Bukti / batasan |
|---|---|---|
| DONE-01 | Identifikasi jalur aplikasi produksi secara read-only | Operator VPS mengonfirmasi Caddy → Gunicorn:5000 → Flask di folder apel-puskeswan |
| DONE-02 | Salin dan audit awal source secara terpisah | ZIP salinan 168 file, audit statis; tidak menjalankan layanan |
| DONE-03 | Siapkan paket pengembangan offline | ZIP 171 file, nilai bawaan dipisah/dibersihkan, uji sintaks/smoke dasar; **belum diimpor ke GitHub** |
| DONE-04 | Buat branch GitHub khusus dan PR draft | Branch develop/yandik-foundation; PR #9; main tidak berubah |
| DONE-05 | Dokumentasikan arah awal dan backlog | docs/START_HERE.md, BACKLOG.md dan spesifikasi awal Support |
| DONE-06 | Buat masterplan, status roadmap, indeks dan spesifikasi per modul | Dokumen dalam PR draft; **bukan bukti fitur modul sudah dibuat** |

## B. Sedang dilakukan (SEDANG)
| ID | Pekerjaan aktif | Bukti saat ini | Syarat selesai |
|---|---|---|---|
| M00 | Import baseline source yang aman ke branch GitHub | ZIP offline + panduan impor tersedia; source lengkap **belum terlihat pada branch GitHub** | Struktur source tersedia di repo, dependensi, data contoh, tes dasar dan review sanitasi |

> Setelah source masuk ke branch dan diverifikasi, M00 boleh diubah ke SELESAI. Sampai itu terjadi, modul coding berikutnya tetap RENCANA.

## C. Rencana pengembangan (RENCANA)
| ID | Prioritas | Tahap / keluaran | Dependensi | Modul |
|---|---|---|---|---|
| M01 | P0 | Core: peran, hak akses wilayah, master Puskeswan, audit, workflow dan UX dasar | M00 | [Core](modules/00_CORE_PLATFORM.md) |
| M02 | P0 | Profil terpadu + SDM, sarpras, obat, APEL, provenance/versi data | M01 | [Profil](modules/01_PROFIL_PUSKESWAN.md), [SDM](modules/03_SDM_VETERINER.md) |
| M03 | P0 | Support: kebutuhan, foto/bukti, verifikasi dan skor prioritas yang bisa dijelaskan | M02 | [Support](modules/04_SUPPORT_PUSKESWAN.md) |
| M04 | P0 | Support: usulan, alokasi sesuai kewenangan, penyaluran, BAST, monitoring | M03 | [Support](modules/04_SUPPORT_PUSKESWAN.md) |
| M05 | P1 | APEL 2.0: rapor, tren, deteksi anomali, aturan 2027 | M01–M02 | [APEL](modules/02_APEL_PUSKESWAN.md) |
| M06 | P1 | Pengawasan Obat Hewan: registrasi, inspeksi, temuan dan tindak lanjut | M01 | [Obat](modules/05_PENGAWASAN_OBAT_HEWAN.md) |
| M07 | P1 | Klinik/Praktik Dokter Hewan: profil, pembinaan, pengawasan dan tindak lanjut | M01 | [Klinik](modules/06_KLINIK_PRAKTIK_DOKTER_HEWAN.md) |
| M08 | P1 | Dashboard pimpinan lintas modul dan kamus indikator | M02–M07 | [Dashboard](modules/11_DASHBOARD_PIMPINAN.md) |
| M09 | P2 | Notifikasi dan mode lapangan: pengingat, PWA, draf offline | M01 | [Notifikasi](modules/14_NOTIFIKASI_MODE_LAPANGAN.md) |
| M10 | P2 | GIS: Puskeswan, sarana, wilayah layanan, kondisi & prioritas | M02 | [GIS](modules/12_GIS.md) |
| M11 | P2 | Knowledge center, SOP, generator draf, AI opsional | M01 | [Pustaka/AI](modules/13_PUSTAKA_REGULASI_AI.md) |
| M12 | P2 | Administrasi kegiatan dan dokumen paperless, integrasi prosedural SRIKANDI | M01 | [Administrasi](modules/10_ADMINISTRASI_DOKUMEN.md) |
| M13 | P2 | PHMS/zoonosis/surveilans dan analitik iSIKHNAS tanpa pencatatan ganda | M01–M02 | [PHMS](modules/07_PHMS_ZOONOSIS.md) |
| M14 | P2 | Register dan dukungan penerbitan sertifikat veteriner/lalu lintas | M01 | [Sertifikat](modules/08_SERTIFIKAT_LALU_LINTAS.md) |
| M15 | P2 | Pembinaan, Bimtek, aktivitas teknis SDM dan tindak lanjut | M01–M02 | [Pembinaan](modules/09_PEMBINAAN_BIMTEK.md) |
| M16 | P3 | Evaluasi integrasi e-SPJ/kepegawaian/Telegram tingkat lanjut | Review SPBE, kewenangan & biaya | [Administrasi](modules/10_ADMINISTRASI_DOKUMEN.md) |

**Catatan prioritas:** P0 fondasi; P1 manfaat operasional berikut; P2 ekspansi; P3 evaluasi opsional. Urutan dapat berubah melalui mekanisme perubahan yang transparan.

## D. Item khusus yang belum boleh dilupakan
- **SEC-01 (P0):** review otorisasi API pengguna, reset password, pembatasan upload/unduh, hash password dan CSRF pada salinan pengembangan.
- **DEV-01 (P0):** dependensi dan konfigurasi contoh anonim yang memungkinkan pengujian lokal.
- **REG-01 (P0):** tes regresi APEL (1 laporan/bulan/Puskeswan, penghitungan pelayanan dan Kesmavet sesuai juknis).
- **UX-01 (P0):** uji 5 tugas utama dari HP bagi petugas nonteknis, dengan toleransi internet lambat.
- **GOV-01 (P1):** kamus data, hak akses dan batas sistem resmi/penyesuaian SPBE sebelum integrasi resmi.

## E. Cara memperbarui progres
1. Buka issue atau PR ber-ID milestone dan lampirkan bukti file/tes.
2. Ubah status pada tabel di atas **sesudah bukti ada**, bukan karena rencana sudah ditulis.
3. Perbarui checklist pada dokumen modul terkait dan beri tanggal.
4. Untuk penambahan, pengubahan atau penghapusan, tulis alasan dan dampaknya dalam [CHANGELOG_ROADMAP.md](CHANGELOG_ROADMAP.md).
5. Tiap selesai pengerjaan, cek bahwa tidak ada pekerjaan ke VPS, data produksi, atau bot Indodax.

## F. Syarat deployment di masa depan
Staging terpisah, tes keamanan, data dummy, rencana migrasi & rollback, peninjauan SPBE/otoritas, kesiapan biaya, dan persetujuan eksplisit. **Tidak ada auto-deploy.**
