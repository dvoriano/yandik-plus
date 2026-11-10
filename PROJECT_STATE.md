# PROJECT STATE | YANDIK+ (BACA PERTAMA PADA CHAT BARU)

**Terakhir diperbarui:** 10 November 2026, WIB  
**Kanonik:** repository private [dvoriano/yandik-plus](https://github.com/dvoriano/yandik-plus)  
**Branch kerja:** [develop/yandik-foundation](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation)  
**Pull Request aktif:** [#9 (DRAFT)](https://github.com/dvoriano/yandik-plus/pull/9) → `main`. **Jangan merge otomatis.**  
**Milestone aktif:** **M00 SEDANG** ([Issue #1](https://github.com/dvoriano/yandik-plus/issues/1)).

## KEPUTUSAN PEMILIK PROYEK | jangan ditanyakan berulang
1. **HANYA KERJAKAN DI GITHUB**: pengguna tidak mau lagi diminta unduh ZIP, PowerShell, Git lokal, login dari komputer, copy SSH, atau setup lain di luar GitHub untuk saat ini.
2. **Website produksi tidak boleh diubah sedikit pun.** Tidak ada sambungan GitHub ke VPS YANDIK+, tidak restart service, tidak menyentuh database, tidak CI/CD deploy; semua coding adalah pengembangan calon versi masa depan.
3. **Repo bot Indodax terpisah total**; jangan akses/ubah sebagai bagian YANDIK+.
4. Source dari aplikasi Flask YANDIK+ yang sekarang menjadi **baseline fungsional**. Jangan rewrite tanpa alasan. Jika belum tersedia dalam repo, kerjakan fondasi/dokumen/modul aman yang bisa ditulis langsung via GitHub; laporkan batasannya tanpa membebani pengguna.
5. **Satu platform paperless** untuk semua kegiatan dengan fokus petugas kurang terbiasa teknologi; modul masing-masing terpisah, data diisi sekali.
6. **Setiap progres wajib disimpan ke GitHub** sebelum sesi diakhiri. Saat konteks chat menipis, dokumen ini menjadi catatan serah-terima yang paling baru.

## CARA MELANJUTKAN DI CHAT BERIKUTNYA
Jika pengguna berkata **"cek GitHub", "lanjutkan", "cek perkembangan", "kerjakan sesuai roadmap"**, lakukan:
1. Buka `PROJECT_STATE.md` pada **branch kerja** (bukan asal baca `main`).
2. Baca `docs/ROADMAP.md` (status resmi), bagian terbaru `docs/WORKLOG.md`, dan perubahan terakhir di branch/PR.
3. Baca `docs/modules/<modul>.md` dan issue terkait saat mengerjakan modul.
4. Pilih item tertinggi yang belum selesai, kerjakan **langsung menggunakan connector GitHub**, catat commit dan hasil.
5. Sebelum membalas, **perbarui file ini + ROADMAP + WORKLOG serta issue/PR jika perlu**, lalu verifikasi lewat fetch GitHub. Jangan mengandalkan hanya isi percakapan atau memory.

## KONDISI NYATA GITHUB SAAT INI
### SELESAI (dokumentasi/alat, bukan implementasi fitur)
- [x] Repo private dan branch `develop/yandik-foundation`; PR #9 draft.
- [x] Masterplan `docs/MASTERPLAN.md`, katalog 15 modul `docs/MODULES_INDEX.md`.
- [x] Spesifikasi terpisah `docs/modules/00_...md` sampai `14_...md` beserta checklist.
- [x] Roadmap, backlog, changelog, standar UX, workflow dan aturan pengelolaan data.
- [x] Validator awal `scripts/verify_import.py` ada di branch.
- [x] Catatan handoff, worklog dan aturan **GitHub-only** dimasukkan ke branch.

### SEDANG
- **M00 Fondasi repo/source.** Dokumen dan validator dibuat; kerja lanjutan harus langsung via GitHub.

### BELUM SELESAI / TERBUKA
- [ ] **Source Flask lengkap belum diimpor ke repository.** Ada snapshot 168 file dan salinan pengembangan 171 file dari percakapan sebelumnya, tetapi *file di chat bukan file GitHub*. Jangan klaim sudah commit.
- [ ] Dependensi, fixtures data dummy, tes lintas modul dan pengujian aplikasi runtime belum selesai.
- [ ] Audit serta perbaikan otorisasi, password reset/default, upload dan CSRF di kode pengembangan belum selesai.
- [ ] M01–M16 adalah rencana implementasi; dokumentasinya tidak sama dengan fiturnya telah dibuat.

### TERTUNDA khusus
- Jalur impor melalui ZIP/Windows/PowerShell **tidak digunakan atas instruksi pemilik**. Bila transfer source memerlukan jalur yang tidak tersedia di connector GitHub, kerjakan bagian yang memungkinkan langsung di GitHub, jangan minta manual download/setup.

## PRIORITAS NEXT ACTION
1. **M00:** buat secara langsung di GitHub konfigurasi dummy, kerangka tes dan struktur code yang kompatibel dengan source Flask, tanpa mengubah kode produksi.
2. **M00:** imporkan source sanitasi jika dapat dilakukan langsung lewat tools GitHub, lalu verifikasi isi repo dan perbarui status. Jika belum bisa, catat sebagai tertunda, bukan memblokir rancangan.
3. **M01:** Core Platform (master Puskeswan, role/wilayah, audit, workflow), dilanjutkan M02 Profil + SDM, M03–M04 Support, M05 APEL 2.0.

## DOKUMEN RUJUKAN
- [Status roadmap induk](docs/ROADMAP.md)
- [Catatan pekerjaan kronologis](docs/WORKLOG.md)
- [Aturan setiap sesi](docs/GITHUB_WORKFLOW.md)
- [Katalog modul](docs/MODULES_INDEX.md)
- [Masterplan](docs/MASTERPLAN.md)
- [Perubahan scope](docs/CHANGELOG_ROADMAP.md)
- [Issue #1 (M00)](https://github.com/dvoriano/yandik-plus/issues/1)

## TEMPLATE CATATAN AKHIR SETIAP SESI (perbarui, jangan duplikasi)
- **Terakhir dilakukan:** <perubahan/fitur yang benar-benar tersimpan>
- **Bukti:** <link commit/PR/tes>
- **Status setelah pekerjaan:** <Mxx dan SELESAI/SEDANG/RENCANA>
- **Berikutnya:** <satu langkah konkret>
- **Blokir:** <apa yang belum bisa, tanpa meminta setup eksternal>
- **Produksi:** tidak disentuh

**Prinsip bukti:** pernyataan pekerjaan selesai harus didukung commit/isi file GitHub dan tes bila relevan. Jangan menganggap data yang hanya ada di ZIP lokal telah tersedia di repository.
