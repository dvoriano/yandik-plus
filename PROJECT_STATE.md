# PROJECT STATE | YANDIK+ (BACA PERTAMA PADA CHAT BARU)

**Terakhir diperbarui:** 10 November 2026, WIB  
**Kanonik:** repository private [dvoriano/yandik-plus](https://github.com/dvoriano/yandik-plus)  
**Branch kerja:** [develop/yandik-foundation](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation)  
**Pull Request aktif:** [#9 (DRAFT)](https://github.com/dvoriano/yandik-plus/pull/9) → `main`. **Jangan merge otomatis.**  
**Milestone aktif:** **M00, M01 dan M02 SEDANG** (semuanya pengembangan GitHub, tidak di-deploy); status resmi di ROADMAP. ([Issue #1](https://github.com/dvoriano/yandik-plus/issues/1)).

## PEMBARUAN M02-S2 (TERBARU) | 10 November 2026
**Progres terbaru:** prototype tampilan **Profil Saya** mobile-first dan **Antrian Verifikasi** sudah dikode langsung di GitHub.
- **State model & 20 tes Node:** [commit 6c807fa](https://github.com/dvoriano/yandik-plus/commit/6c807fa21fd130e0e28093eedb53623b9520e866), `prototypes/profil-puskeswan/model.mjs`.
- **UI dan GitHub CI:** [commit 3096d64](https://github.com/dvoriano/yandik-plus/commit/3096d64f2b2d113318ba3ee365abe814c2f6a910) berisi `index.html`, `style.css`, `main.mjs`, panduan dan workflow Python + Node.
- **CI:** [GitHub Actions #42844096701](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701) **SUCCESS** (job `offline-contracts` dan `profile-ui-demo`). 65 tes Python sebelumnya tetap lulus, ditambah 20 tes model JS. UI HTML/CSS belum diuji oleh manusia pada browser sungguhan.
- **Apa yang berfungsi dalam demo:** 5 kartu bagian profil, indikator belum lengkap/perlu verifikasi, simpan draf, ajukan, role-switch simulasi, antrian verifikator, koreksi dengan alasan, persetujuan dan perbaikan, tampilan responsif dengan label & teks status.
- **Status M02 tetap SEDANG (prototype interaktif)**, belum halaman Flask asli. **Pergantian role hanyalah simulasi, BUKAN autentikasi**; penyimpanan hanya memori tab dan hilang saat refresh. Jangan pernah pakai data nyata.
- **Berikutnya:** review alur UI terhadap standar UX & field Profiling 2026, tambah test markup/interaksi browser, lalu adapter API/DB jika source Flask lama bisa masuk GitHub tanpa VPS/laptop.
- **M00 masih terhalang:** source Flask lama 171 file belum berada di GitHub. Website produksi, VPS, DB tetap tidak disentuh.

## PEMBARUAN M02-S1 | 10 November 2026
- **Kode per bagian:** [commit ee9ccee](https://github.com/dvoriano/yandik-plus/commit/ee9cceecfe4a61c315e6bef6a38f0e6c9b4e30e8) membuat `foundation/yandik_base/profile_updates.py`, izin `VERIFY_PROFILE`, draf, ajukan, review, alasan koreksi, dan versi perubahan.
- **Pengujian lulus:** [commit 12007b6](https://github.com/dvoriano/yandik-plus/commit/12007b6d8cc1c96011e0b521510b0adf6d600557), **25 tes baru; 65 tes fondasi** keseluruhan. [GitHub Actions #42842163389](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389) **SUCCESS**.
- **Status M02:** SEDANG (prototype). Ringkasan 5 bagian profil, draft/edit/submit/approval telah diuji; belum ada layar pengguna, API Flask, penyimpanan DB, unggah foto maupun notifikasi.
- **Batas:** SDM dan APEL hanya direferensikan, bukan diinput ulang; source Flask lama 171 file belum ada di GitHub; website/VPS tidak disentuh.
- **Berikutnya:** buat tampilan prototype Profil Saya yang sederhana/mobile-first dan pengujian jalur tugas/verifikasi memakai data fiktif, tetap di GitHub.

## PEMBARUAN M01-S2 | 10 November 2026
- Kode [master Puskeswan, histori SDM, sarpras dan profil](https://github.com/dvoriano/yandik-plus/commit/420354a885c6291c609e4ab6f25347cadbd2360a) serta [18 tes baru](https://github.com/dvoriano/yandik-plus/commit/43ee5ff342659fb1bb96eac552bad687e3ab0854) berhasil dibuat di GitHub.
- [GitHub Actions #42840263033](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033) **SUCCESS**, total foundation **40 tes** serta validator data fiktif.
- Relasi APEL/Support memakai satu ID Puskeswan; tidak melapor berbeda dengan nilai nol; penempatan tenaga dan kondisi alat memiliki riwayat tanggal.
- M01 **SEDANG**; M02 masih **RENCANA** sebagai fitur pengguna walau sebagian kontrak datanya sudah dibuat.
- **Next:** lanjut adapter profil/SDM dan hak akses pada kode pengembangan, sambil tetap menunggu source Flask asli masuk langsung melalui GitHub. Belum ada deployment.

## PEMBARUAN TERBARU | 10 November 2026
- **M01 kode prototype:** [commit 9fe3ce0](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac) berisi hak akses berbasis role+wilayah dan alur kerja audit immutable, ditambah 12 tes.
- **M01 GitHub Actions SUCCESS:** [run #42838727867](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867); tes kontrak dan validator fixture lulus. Total suite foundation: 22 tes.
- Keputusan: pekerjaan M01 yang bisa dipisah dari Flask lama **SEDANG**, tetapi belum ada perubahan API, izin login, atau database lama. Ini bukan persetujuan resmi.
- **Next:** lanjut pengembangan Core Platform teruji dengan data dummy, sambil tetap mencatat source Flask M00-D belum diimpor langsung via GitHub.

- **M00 coding:** [commit 2081606](https://github.com/dvoriano/yandik-plus/commit/2081606d0cd4109eb5f45415688ff4a663937fb6) memuat 13 file kontrak Python, fixture anonim, 10 tes dan GitHub workflow.
- **CI terbukti lulus:** [GitHub Actions run #42837742904](https://github.com/dvoriano/yandik-plus/actions/runs/42837742904) **SUCCESS**; kedua langkah test kontrak dan validasi fixture berhasil.
- Kontrak yang diuji: identitas Puskeswan stabil, laporan per bulan/Puskeswan, nol berbeda dengan tidak melapor, referensi data Support, penolakan nilai negatif/format salah.
- **Bukan aplikasi Flask produksi**; source legacy lengkap masih belum ada di GitHub. M00 **SEDANG**.
- **Next:** upayakan source legacy hanya lewat GitHub connector; kalau belum bisa, kembangkan kontrak dan pengujian yang tidak bergantung pada source legacy. Tidak meminta setup user.

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
### SELESAI (dokumentasi/alat dan kontrak fondasi teruji; belum fitur produksi)
- [x] Repo private dan branch `develop/yandik-foundation`; PR #9 draft.
- [x] Masterplan `docs/MASTERPLAN.md`, katalog 15 modul `docs/MODULES_INDEX.md`.
- [x] Spesifikasi terpisah `docs/modules/00_...md` sampai `14_...md` beserta checklist.
- [x] Roadmap, backlog, changelog, standar UX, workflow dan aturan pengelolaan data.
- [x] Validator awal `scripts/verify_import.py` ada di branch.
- [x] Catatan handoff, worklog dan aturan **GitHub-only** dimasukkan ke branch.
- [x] Kode fondasi `foundation/`, fixture anonim dan 10 tes lulus di GitHub Actions #42837742904.
- [x] Prototype master Profil/SDM/Sarpras dengan 18 tes tambahan dan total 40 tes foundation, [CI sukses](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033).
- [x] **M02-S1** draf profil per bagian, review, scoped auth, audit immutable dan 25 tes tambahan; [CI 65 tes sukses](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389).
- [x] **M02-S2** halaman demo responsive Profil Saya / antrian verifikasi, 20 tes Node dan CI Python+Node [SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701).
- [x] Prototype hak akses wilayah dan workflow audit (12 tes tambahan) lulus di GitHub Actions #42838727867.

### SEDANG
- **M00 Fondasi repo/source.** Kode kontrak/fixture/tes ada dan CI lulus; source Flask lengkap masih menunggu.
- **M01 Core Platform.** Prototype akses wilayah, master data dan workflow tersedia; belum terintegrasi ke Flask.
- **M02 Profil Puskeswan.** Prototype draf dan verifikasi **serta UI interaktif responsif** ada di GitHub; belum Flask/API/DB, belum uji pengguna.

### BELUM SELESAI / TERBUKA
- [ ] **Source Flask lengkap belum diimpor ke repository.** Ada snapshot 168 file dan salinan pengembangan 171 file dari percakapan sebelumnya, tetapi *file di chat bukan file GitHub*. Jangan klaim sudah commit.
- [x] Fixture dummy Profil/APEL/Support dan pengujian kontrak awal tersedia.
- [ ] Dependensi aplikasi Flask nyata, tes integrasi/runtime, dan regresi hitungan APEL produksi belum selesai.
- [ ] Audit serta perbaikan otorisasi, password reset/default, upload dan CSRF di kode pengembangan belum selesai.
- [ ] M01 dan M02 masih **prototype GitHub**, bukan fitur Flask berjalan; M03–M16 tetap rencana implementasi.

### TERTUNDA khusus
- Jalur impor melalui ZIP/Windows/PowerShell **tidak digunakan atas instruksi pemilik**. Bila transfer source memerlukan jalur yang tidak tersedia di connector GitHub, kerjakan bagian yang memungkinkan langsung di GitHub, jangan minta manual download/setup.

## PRIORITAS NEXT ACTION
1. **M00-D:** masukkan source Flask sanitasi lewat GitHub connector jika bisa tanpa tindakan pengguna; jika tidak, pertahankan status tertunda.
2. **M00-F:** lengkapi tes dan perbaikan keamanan setelah source tersedia, petakan aturan hitung APEL resmi; pertahankan regresi.
3. **M02:** lanjut pengujian UX nyata/aksesibilitas dan pemetaan field Profiling 2026; setelah source Flask tersedia di GitHub barulah membuat API/database staging. Hindari membuat peran simulasi sebagai autentikasi.


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
