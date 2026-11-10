# WORKLOG | Catatan Pengembangan YANDIK+ (append-only)

**Cara membaca:** entri terbaru paling atas. Hanya catat sesuatu yang **betul-betul terjadi di GitHub**; pastikan tautan atau path bukti ada. Status milestone resmi tetap di [ROADMAP.md](ROADMAP.md).

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
