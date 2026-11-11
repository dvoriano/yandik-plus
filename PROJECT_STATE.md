# PROJECT STATE | YANDIK+ (BACA PERTAMA PADA CHAT BARU)

**Terakhir diperbarui:** 11 November 2026, WIB  
**Kanonik:** repository private [dvoriano/yandik-plus](https://github.com/dvoriano/yandik-plus)  
**Branch kerja:** [develop/yandik-foundation](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation)  
**Pull Request aktif:** [#9 (DRAFT)](https://github.com/dvoriano/yandik-plus/pull/9) → `main`. **Jangan merge otomatis.**  
**Milestone aktif:** **M00, M01, M02 dan M03 SEDANG** (semuanya pengembangan GitHub, tidak di-deploy); status resmi di ROADMAP. ([Issue #1](https://github.com/dvoriano/yandik-plus/issues/1)).

## PEMBARUAN M03-S3 (TERBARU) | 11 November 2026
- **Penilaian prioritas Support berbobot (prototype):** lima faktor 30% risiko gangguan pelayanan, 25% kesenjangan fasilitas, 20% akses wilayah, 15% SDM dan 10% kekurangan stok. Tingkat 0–3, alasan serta kode sumber DEMO wajib. **Data kosong bukan nol, jumlah pelayanan mentah tidak ikut skor.**
- **Alur review:** verifikator kab/kota membuat scorecard kebutuhan terverifikasi, provinsi meninjau, meminta perbaikan, atau mengoreksi kategori rekomendasi dengan alasan. Skor hitung dasar tidak ditimpa.
- **Pengamanan:** nomor versi kebutuhan/masalah, penilaian usang bila sumber berubah, validator menolak review palsu dan field anggaran/alokasi/BAST.
- **Bukti tes:** [GitHub Actions #42939237270](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270) **SUCCESS tiga job**, 65 Python + 94 Node + 17 Chromium = **176 tes otomatis**; fixture valid.
- **Dokumen teknis:** [M03_PRIORITY_ASSESSMENT.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_PRIORITY_ASSESSMENT.md); bobot, ambang dan peran merupakan **rancangan percobaan**, bukan kebijakan resmi.
- **Status M03 masih SEDANG (prototype), M04 RENCANA.** Source Flask legacy 171 file belum di repo; belum API/DB/login resmi, upload bukti, atau uji petugas HP fisik.
- **Next:** uji keadilan dengan skenario beberapa fasilitas secara anonim, persiapkan review bobot/aturan oleh pemilik proses, tetap tanpa alokasi otomatis.
- Website/VPS/branch main tidak disentuh.

## PEMBARUAN M03-S2 | 11 November 2026
- **Bukti kebutuhan:** [kode](https://github.com/dvoriano/yandik-plus/commit/41ce4079840af89e4f8216d3f31124ac5fb3e815) menambah metadata bukti DEMO; draf tanpa bukti bisa disimpan, pengajuan membutuhkan minimal 1 kode bukti, verifikator wajib mencentang pemeriksaan metadata sebelum menyatakan kebutuhan terverifikasi. **Belum ada unggah atau pemeriksaan file sebenarnya.**
- **Duplikasi kebutuhan:** nama barang dinormalisasi (kapital/spasi/tanda baca), usulan serupa diblokir di satu Puskeswan meskipun dari masalah berbeda. Jika usulan terdahulu ditolak, wajib alasan pengajuan ulang dan tautan ke kebutuhan sebelumnya.
- **Tes & UI:** [15 tes Node tambahan](https://github.com/dvoriano/yandik-plus/commit/49326c9b9a9d6233dddf25e9e4a132ac607068f4), [form/checkbox](https://github.com/dvoriano/yandik-plus/commit/82691922ca6c602d22089951f8f0f0c4e26d75e1), [2 tes Chromium baru](https://github.com/dvoriano/yandik-plus/commit/77f0f344127e1d81a404caf041b883260754474e). [GitHub Actions #42936090527](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527) **SUCCESS ketiga job**, **65 Python + 75 Node + 14 Chromium = 154 tes otomatis**, validator fixture lulus.
- **Detail:** [M03_EVIDENCE_AND_DEDUP.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_EVIDENCE_AND_DEDUP.md). Bukti masih kode referensi fiktif, bukan unggahan atau pengesahan dokumen.
- **Status:** M03 tetap **SEDANG (prototype)**, M04 **RENCANA**. Source Flask legacy 171 file masih belum di repository; tidak ada API/DB/login asli.
- **Next:** M03-S3 rancangan prioritas yang adil dan dapat dijelaskan, tanpa keputusan bantuan otomatis; pengujian UX/aksesibilitas tetap terbuka.
- **Batas:** hanya GitHub branch pengembangan, `main`/VPS/website produksi tidak disentuh.

## PEMBARUAN M03-S1 | 11 November 2026
- **M03 Support mulai DIKERJAKAN, prototype:** [model & 15 tes](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926) membuat usulan kebutuhan yang merujuk `problem_id` terverifikasi, bukan menduplikasi profil/masalah atau menyetujui bantuan.
- [UI dan 3 tes browser baru](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7): tombol "Usulkan kebutuhan" pada masalah terverifikasi, form kategori/barang/jumlah/satuan/urgensi/alasan, draf, ajukan, review, koreksi/tolak.
- **CI final:** [GitHub Actions #42862700052](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052) **SUCCESS**. Ketiga job lulus: **65 Python + 60 Node + 12 Chromium = 137 tes otomatis**; validator fixture berhasil.
- **Dokumen tersendiri:** [M03_LINKED_SUPPORT_NEEDS.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_LINKED_SUPPORT_NEEDS.md), [Support Puskeswan](docs/modules/04_SUPPORT_PUSKESWAN.md).
- **Kewenangan:** masalah tervalidasi ≠ pengajuan kebutuhan; kebutuhan terverifikasi ≠ keputusan anggaran/penetapan alokasi/BAST. M04 tetap RENCANA.
- **Source Flask legacy 171 file belum di repo**, tidak ada database/API asli, server auth, penggunaan petugas fisik atau deploy.
- **Next:** tes bukti/duplikasi dan rancangan prioritas yang adil, sambil menjaga otorisasi & peran sesuai kedinasan.
- **Batas:** hanya GitHub development branch, data fiktif; tidak menyentuh VPS, `main`, atau website.

## PEMBARUAN M02-S4 | 10 November 2026
- **Modul Permasalahan Puskeswan (prototype):** [commit c973bdc](https://github.com/dvoriano/yandik-plus/commit/c973bdc3f744805b39c9cd39447cca185444ba95) membuat `problems.mjs` dengan draf, pengajuan, perbaikan, verifikasi, tindak lanjut dan selesai, disertai histori. **Verifikasi masalah bukan persetujuan bantuan/anggaran**.
- **Ringkasan baca-saja SDM/APEL:** `source_snapshots.mjs` menyediakan **data contoh** berdasarkan ID Puskeswan. APEL nol vs belum melapor dibedakan; tidak ada form input ganda atau total pelayanan resmi palsu. **Bukan koneksi database produksi**.
- **Halaman dan tes:** [commit f06ee93](https://github.com/dvoriano/yandik-plus/commit/f06ee93c134eac9f03871a7bf590391a41aee8b1) menambahkan kartu sumber data, daftar masalah, formulir dan 3 tes Chromium baru.
- **CI:** [GitHub Actions #42850233101](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101) **SUCCESS**: 65 tes Python, **45 tes Node**, **9 tes Chromium** = **119 pengujian otomatis**, validator fixture lulus.
- **Dokumen:** [M02_PROBLEMS_AND_REFERENCES.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROBLEMS_AND_REFERENCES.md). Semua angka bersifat fiktif, data hilang saat reload, role switch simulasi bukan login.
- **Status:** M00/M01/M02 masih **SEDANG**; source Flask legacy 171 file belum ada di GitHub. M03/M04 tetap RENCANA; belum Support resmi ataupun website aktif.
- **Next:** tambah model tautan masalah→kebutuhan Support **tanpa alokasi otomatis**, audit aksesibilitas, lalu selaraskan data/field real hanya setelah source Flask di GitHub.
- **Larangan tetap:** tidak ada VPS, DB produksi, GitHub Pages, deploy, atau merge ke `main`.

## PEMBARUAN M02-S3 | 10 November 2026
- **Diperbaiki:** [commit 0ce6b2d](https://github.com/dvoriano/yandik-plus/commit/0ce6b2db1ef0f9ca417eea072f1307c1ee94de30) membuat draf yang sudah disimpan bisa langsung diajukan tanpa mengetik ulang. Mode simulasi pimpinan kini **tidak menampilkan atau merender rincian individu Puskeswan**.
- **Tes browser:** [commit 78cf52a](https://github.com/dvoriano/yandik-plus/commit/78cf52a06d38874581a6709bf7b22b723704ed40) menambah 6 uji Chromium headless: HP 320/375 px tanpa scroll horizontal, simpan → ajukan draf, koreksi → kirim ulang → setujui, role pimpinan, dan reset data demo saat reload.
- **Kendala CI terselesaikan:** runner ubuntu-latest berubah ke Ubuntu 26.04 (Playwright 1.56.1 belum mendukung), [commit c810f5f](https://github.com/dvoriano/yandik-plus/commit/c810f5f565843ee9487440bf97da33bc8c8ee7fc) pin job browser ke Ubuntu 24.04.
- **Bukti CI:** [GitHub Actions #42846236703](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703) **SUCCESS** di 3 job: 65 tes Python, 25 tes unit Node, dan **6 tes browser Chromium**, total **96 tes otomatis**; tes validator fixture juga lulus.
- **Peta domain Profiling 2026:** [M02_PROFILING_2026_MAPPING.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROFILING_2026_MAPPING.md) membedakan 9 domain, source data SDM/APEL, kesiapan vs realisasi surveilans/Kesmavet, dan kebutuhan Support. Ini **masih rancangan**, kolom source Flask asli belum diaudit.
- **M02 tetap SEDANG**: prototype UI dan browser smoke siap untuk review, **bukan** aplikasi Flask/DB/akun nyata. Tes browser headless bukan tes perangkat fisik atau pengguna nonteknis.
- **Next:** rancang referensi data lintas modul + Permasalahan pada prototype tanpa input ganda, dan tetapkan field-level mapping setelah source Flask lengkap ada di GitHub.
- **Produksi:** website, VPS dan DB tidak disentuh; branch `main` dan PR draft tetap aman.

## PEMBARUAN M02-S2 | 10 November 2026
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
- [x] **M02-S3** perbaikan draf dan tampilan pimpinan, **6 tes browser** + **25 tes Node** + **65 tes Python** [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703), peta 9 kelompok Profiling 2026 sementara.
- [x] **M02-S4** Permasalahan Puskeswan + sumber SDM/APEL baca-saja, **119 tes Python/Node/Chromium** [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101).
- [x] **M03-S1** usulan dari masalah terverifikasi, 15 tes Node dan 3 tes browser tambahan, [GitHub Actions 137 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052).
- [x] **M03-S2** pemeriksaan metadata bukti dan deteksi item duplikat lintas masalah, [154 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527).
- [x] **M03-S3** model scorecard prioritas percobaan, review manusia dan peringatan sumber usang; [176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270).
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
3. **M03 selanjutnya:** uji skenario komparatif antar fasilitas secara anonim, evaluasi metodologi dan kewenangan review; bobot percobaan belum boleh menjadi dasar penetapan bantuan. Keamanan server/field Flask masih terbuka.


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
