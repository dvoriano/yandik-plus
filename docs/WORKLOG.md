# WORKLOG | Catatan Pengembangan YANDIK+ (append-only)

**Cara membaca:** entri terbaru paling atas. Hanya catat sesuatu yang **betul-betul terjadi di GitHub**; pastikan tautan atau path bukti ada. Status milestone resmi tetap di [ROADMAP.md](ROADMAP.md).

## 2026-11-11 | M03-S2: bukti metadata dan anti-duplikasi lintas masalah
**Status:** M03 SEDANG (prototype); M04 RENCANA.
- [Model bukti dan pencarian item serupa](https://github.com/dvoriano/yandik-plus/commit/41ce4079840af89e4f8216d3f31124ac5fb3e815): kode DEMO, validasi format, normalisasi barang, riwayat usulan ditolak dan alasan pengajuan ulang.
- [15 tes tambahan](https://github.com/dvoriano/yandik-plus/commit/49326c9b9a9d6233dddf25e9e4a132ac607068f4); [UI](https://github.com/dvoriano/yandik-plus/commit/82691922ca6c602d22089951f8f0f0c4e26d75e1) menambah kolom bukti dan konfirmasi verifikator; [2 tes browser baru](https://github.com/dvoriano/yandik-plus/commit/77f0f344127e1d81a404caf041b883260754474e).
- [GitHub Actions #42936090527](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527): **SUCCESS** 3 job, **65 Python + 75 Node + 14 Chromium = 154 tes**; validator fixture lulus.
- [Dokumen M03-S2](M03_EVIDENCE_AND_DEDUP.md).
- **Batas:** kode bukti bukan file terunggah/diperiksa; tidak ada transaksi DB, dukungan anggaran, API, BAST, atau produksi.
- **Next:** M03-S3 prioritas bantuan terukur dan adil dengan penjelasan serta keputusan manusia.

## 2026-11-11 | M03-S1: usulan Support dari masalah terverifikasi
**Jenis:** coding demo, 15 tes Node, formulir, 3 tes browser, dokumentasi per modul. **Status:** M03 SEDANG, M04 RENCANA.
- [Commit model](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926) membuat `support_needs.mjs`, sumber dari `problem_id`, ruang lingkup dan histori, proteksi duplikasi kebutuhan aktif, larangan approval otomatis.
- [Commit UI](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7) memasang tombol pada masalah yang telah diverifikasi, draf/ajukan usulan, antrian verifikasi dan pengujian Chromium.
- [GitHub Actions #42862700052](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052) **SUCCESS**: 65 Python + 60 Node + 12 Chromium = **137 tes**, dan validator fixture lulus.
- [Dokumen M03-S1](M03_LINKED_SUPPORT_NEEDS.md) memisahkan status kebutuhan terverifikasi dari keputusan bantuan/anggaran/BAST.
- Belum source Flask 171 file, API/DB, autentikasi, bukti lampiran, prioritas objektif, persetujuan bantuan, distribusi maupun HP fisik.
- Next: kategori/kriteria bukti dan anti-duplikasi, skor penilaian adil dengan manual override; produksi tetap utuh.

## 2026-11-10 | M02-S4: Permasalahan, SDM/APEL baca-saja, 119 tes otomatis lulus
**Jenis:** coding model dan UI browser di GitHub, unit test Node, E2E Chromium, dokumentasi. **Status:** M02 SEDANG (prototype), M03/M04 masih rencana.
- [Commit model dan 20 tes baru](https://github.com/dvoriano/yandik-plus/commit/c973bdc3f744805b39c9cd39447cca185444ba95): register masalah 6 kategori, draf→ajukan→perbaikan→terverifikasi→tindak lanjut→selesai; 6 pemeriksaan sumber data fiktif baca-saja.
- [Commit UI dan 3 tes Chromium baru](https://github.com/dvoriano/yandik-plus/commit/f06ee93c134eac9f03871a7bf590391a41aee8b1): kartu SDM/APEL, pilihan periode, pembeda nol/belum melapor, daftar masalah, form dan antrian verifikasi.
- [GitHub Actions #42850233101](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101) **SUCCESS**, 65 Python + 45 Node + 9 browser = **119 tes otomatis**; validator fixture lulus.
- Detail [M02_PROBLEMS_AND_REFERENCES.md](M02_PROBLEMS_AND_REFERENCES.md).
- **Batas:** angka SDM/APEL dari snapshot fiktif statis, bukan API real. Masalah tercatat tidak berarti bantuan disetujui. Login role hanya simulasi, semua hilang saat refresh.
- **Belum:** source Flask legacy 171 file, UI HP fisik, field asli, DB/API, autentikasi, bukti foto, modul Support dan deployment.
- **Berikutnya:** uji aksesibilitas serta kontrak referensi satu arah dari masalah ke Support tanpa mengubah kewenangan anggaran.

## 2026-11-10 | M02-S3: perbaikan draf, uji browser Chromium dan peta Profiling
**Jenis:** coding UI, regresi Node, 6 tes browser E2E melalui GitHub Actions, pemetaan domain sementara. **Status:** M02 SEDANG.
- [Perbaikan](https://github.com/dvoriano/yandik-plus/commit/0ce6b2db1ef0f9ca417eea072f1307c1ee94de30): draf tersimpan dapat diajukan tanpa edit ulang; pimpinan tidak lagi menampilkan rincian individual.
- [Browser tests](https://github.com/dvoriano/yandik-plus/commit/78cf52a06d38874581a6709bf7b22b723704ed40): Chromium 320/375px, tanpa overflow, draf → submit, perbaikan → verifikasi, tampilan pimpinan dan reset demo.
- Masalah Ubuntu 26.04 pada CI diatasi dengan [pin Ubuntu 24.04](https://github.com/dvoriano/yandik-plus/commit/c810f5f565843ee9487440bf97da33bc8c8ee7fc) tanpa menyentuh website.
- [GitHub Actions #42846236703](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703): **SUCCESS**, **65 tes Python + 25 Node + 6 Chromium = 96 tes**, validator fixture lulus.
- [Peta 9 domain Profiling 2026](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROFILING_2026_MAPPING.md) dibuat; ini bukan validasi field legacy karena Flask lama belum ada di repo.
- Masih perlu: uji pengguna manusia/screen reader, real HP, field-level mapping, autentikasi/API/database dan integrasi.
- Berikutnya: skema Permasalahan dan referensi baca-saja SDM/APEL tanpa input ganda, tetap GitHub-only.

## 2026-11-10 | M02-S2: Prototype halaman Profil Saya dan antrian verifikator
**Jenis:** coding frontend demo GitHub-only + test Node, belum ada deployment. **Status:** M02 SEDANG (prototype interaktif).
- [Commit model & tes](https://github.com/dvoriano/yandik-plus/commit/6c807fa21fd130e0e28093eedb53623b9520e866): 20 tes alur draf, pengajuan, permintaan perbaikan dan review role-switch simulasi.
- [Commit UI & CI](https://github.com/dvoriano/yandik-plus/commit/3096d64f2b2d113318ba3ee365abe814c2f6a910): HTML semantik, CSS responsif, JS interaktif, 5 bagian profil, status/indikator, antrian review dan panduan.
- [GitHub Actions #42844096701](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701) **SUCCESS**, job `offline-contracts` dan `profile-ui-demo` berhasil. 65 tes Python sebelumnya dan 20 tes model Node.
- Demo ini **bukan** login nyata: role picker hanya simulasi, data fiktif, perubahan memori browser hilang ketika refresh. Tidak ada server/API/database.
- [Dokumen UI demo](M02_UI_DEMO.md), [folder sumber](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/prototypes/profil-puskeswan/).
- **Belum:** uji UX dengan petugas manusia, browser E2E, mapping Profiling asli, source Flask legacy, database, deploy.
- **Next:** periksa aksesibilitas, uji alur mobile secara terkontrol dan mapping komponen real bila source tersedia di GitHub.

## 2026-11-10 | M02-S1: Profil per bagian dan 65 tes GitHub berhasil
**Jenis:** coding + unit test, tanpa VPS. **Status:** M02 SEDANG hanya sebagai prototype; M00/M01 masih SEDANG.
- [Kode](https://github.com/dvoriano/yandik-plus/commit/ee9cceecfe4a61c315e6bef6a38f0e6c9b4e30e8): draf satu bagian, submit, review kab/kota/provinsi sesuai wilayah, koreksi, alasan, audit dan proteksi versi lama.
- [25 pengujian](https://github.com/dvoriano/yandik-plus/commit/12007b6d8cc1c96011e0b521510b0adf6d600557) mencakup akses lintas wilayah, larangan self-approval, edit hanya di bagian terkait, optimistic version, dan apply hanya setelah persetujuan.
- [GitHub Actions #42842163389](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389) **SUCCESS**: total 65 tes foundation, validasi fixture juga berhasil.
- [Spesifikasi](M02_PROFILE_EDITS.md). SDM/APEL tidak diduplikasi.
- Belum: aplikasi Flask, UI HP, penyimpanan DB, unggahan bukti dan deployment.
- Berikutnya: prototipe antarmuka Profil Saya dan alur antrian verifikator.

## 2026-11-10 | M01-S2 master Puskeswan, SDM, sarpras dan profiling
**Jenis:** coding langsung di GitHub dan CI; M01 SEDANG, M02 (modul tampilan) masih RENCANA.
- [Kode master dan 4 jenis fixture](https://github.com/dvoriano/yandik-plus/commit/420354a885c6291c609e4ab6f25347cadbd2360a) serta [18 tes tambahan dan validator terpadu](https://github.com/dvoriano/yandik-plus/commit/43ee5ff342659fb1bb96eac552bad687e3ab0854).
- Penempatan SDM per tanggal, observasi alat dengan histori, profil terverifikasi, dan hubungan data APEL/Support.
- [GitHub Actions #42840263033](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033) **SUCCESS**. Total 40 tes foundation, tanpa akses VPS.
- Belum: source Flask 171 file, adapter database/endpoint, UI Profil dan pengujian APEL riil.
- Berikutnya: lanjut kontrak/adaptor pengembangan dan input profil yang mudah digunakan.

## 2026-11-10 | Sinkronisasi status milestone
- M00 **SEDANG** karena source Flask legacy belum masuk repo; M01 **SEDANG** hanya untuk prototype.
- Bukti M01: [commit 9fe3ce0](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac), [Actions #42838727867](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867) SUCCESS.

## 2026-11-10 | M01-S1: prototype role/wilayah dan workflow, tes lulus
**Jenis:** coding, role authorization, audit workflow, pengujian GitHub Actions.  
**Status:** M01 SEDANG pada prototype, M00 tetap SEDANG menunggu source Flask.
- `foundation/yandik_base/access.py`: role provinsi, kab/kota, Puskeswan, pimpinan; default deny dan larangan akses lintas wilayah.
- `foundation/yandik_base/workflow.py`: transisi draf/pengajuan/verifikasi/perbaikan/tindak lanjut, alasan wajib, audit append-only.
- `foundation/tests/test_access_workflow.py`: 12 tes tambahan; total suite foundation **22 tes**.
- **Commit:** [9fe3ce0](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac). **Pengujian:** [run #42838727867](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867) **SUCCESS**.
- **Belum:** diterapkan di login/API Flask, database/BAST, ataupun website produksi.
- **Berikutnya:** integrasi aman bila source lama tersedia, dan komponen master data + pemeriksaan role dengan data dummy.

## 2026-11-10 | M00: fondasi kode dan pengujian GitHub SUCCESS
**Jenis:** coding + data dummy + pengujian CI. **Status:** M00 tetap SEDANG.
- Menambahkan `foundation/yandik_base/contracts.py` untuk kontrak identitas Puskeswan, APEL bulanan dan kebutuhan bantuan.
- Membuat 3 file fixture sintetis, validator, 10 tes Python dan workflow GitHub Actions read-only.
- Tes memeriksa pelaporan ganda, missing vs nol, referensi master Puskeswan, periode, nilai negatif dan kategori bantuan.
- [Bukti commit 2081606](https://github.com/dvoriano/yandik-plus/commit/2081606d0cd4109eb5f45415688ff4a663937fb6) dan [GitHub Actions run 42837742904](https://github.com/dvoriano/yandik-plus/actions/runs/42837742904) dengan hasil **SUCCESS**.
- **Belum:** source Flask legacy 171 file, integrasi ke website, regresi APEL asli, deployment.
- **Berikutnya:** M00-D impor source langsung via konektor bila memungkinkan; lanjut kode/test independen di GitHub tanpa meminta setup manual.

## 2026-11-10 | Penetapan cara kerja GitHub-only
**Jenis:** keputusan + dokumentasi tata kerja.  
**Status:** M00 SEDANG; progres dokumentasi selesai, source lengkap masih belum ada di GitHub.

**Dilakukan:**
- Pemilik menetapkan tidak menggunakan ZIP/unduh/PowerShell/setup laptop, SSH atau VPS pada fase pengembangan.
- Menambahkan `PROJECT_STATE.md` untuk handoff lintas chat.
- Membuat `docs/GITHUB_WORKFLOW.md` sebagai aturan baca → kerja → verifikasi → catat.
- Memutakhirkan `docs/ROADMAP.md`, README, `docs/START_HERE.md` dan panduan impor agar tidak lagi mengarahkan pengguna ke setup eksternal.
- Mempertahankan modul dan masterplan yang telah dibuat.

**Bukti:** perubahan pada branch `develop/yandik-foundation`, [Draft PR #9](https://github.com/dvoriano/yandik-plus/pull/9), [Issue M00 #1](https://github.com/dvoriano/yandik-plus/issues/1).  
**Belum dilakukan:** impor source Flask 171 file ke GitHub, tes runtime Flask, deploy.  
**Berikutnya:** bangun struktur pengujian dan konfigurasi dummy **langsung di GitHub**, kemudian lanjut source baseline jika tersedia jalur import tanpa setup manual.

## 2026-11-10 | Persiapan masterplan dan M00
**Jenis:** dokumentasi arsitektur dan validator.  
**Dilakukan:** masterplan, 15 dokumen modul, roadmap, issues, `scripts/verify_import.py`, PR draft.  
**Bukti:** [PR #9](https://github.com/dvoriano/yandik-plus/pull/9), [ROADMAP.md](ROADMAP.md).  
**Batasan:** ZIP source offline sempat disiapkan dalam percakapan, tetapi **tidak diimpor ke GitHub**.
