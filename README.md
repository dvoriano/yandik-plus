# YANDIK+

**Kerja sudah sulit, administrasi jangan rumit.**

Repository pengembangan YANDIK+ untuk mewujudkan sistem kerja kesehatan hewan yang paperless, mudah dipakai petugas, dan terintegrasi.

## BACA INI DULU SETIAP CHAT / PROGRES TERBARU
**[PROJECT_STATE.md: STATUS TERAKHIR + LANGKAH SELANJUTNYA](PROJECT_STATE.md)**

**[Roadmap dan Checklist](docs/ROADMAP.md)** · **[Worklog progres](docs/WORKLOG.md)** · **[Aturan GitHub-only](docs/GITHUB_WORKFLOW.md)**

## Kode fondasi pengembangan (bukan website produksi)
- [Kontrak Puskeswan, APEL, dan Support](foundation/yandik_base/contracts.py)
- [Tes otomatis fondasi](foundation/tests/test_contracts.py)
- [Contoh data fiktif](foundation/fixtures/)
- [GitHub Actions: berhasil](https://github.com/dvoriano/yandik-plus/actions/runs/42837742904)

## M01 prototype (hak akses dan alur kerja)
- [Peran dan wilayah](foundation/yandik_base/access.py)
- [Workflow dan audit](foundation/yandik_base/workflow.py)
- [Pengujian GitHub: SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867)
- [Batasan dan progres M01](docs/M01_PROTOTYPE.md)

## Master data Puskeswan lintas modul
- [Kode SDM/penempatan/sarpras/profil](foundation/yandik_base/masterdata.py).
- [Dokumentasi M01-S2](docs/M01_MASTER_DATA.md).
- [GitHub Actions: 40 tes foundation sukses](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033).

## M02: pembaruan Profil Puskeswan (prototype)
- [Kode draf/verifikasi per bagian](foundation/yandik_base/profile_updates.py)
- [Spesifikasi dan alur UX](docs/M02_PROFILE_EDITS.md)
- [65 tes foundation lulus](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389)

## Prototype antarmuka Profil Puskeswan (M02-S2)
- [HTML, CSS dan JS halaman Profil Saya + antrian verifikator](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/prototypes/profil-puskeswan/)
- [Dokumen status, batasan dan roadmap UI](docs/M02_UI_DEMO.md)
- [GitHub Actions: Python+Node SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701)
- **Ini kode demonstrasi, bukan website yang dipublikasikan.** Tidak ada akses VPS/Flask.

## M02-S3: browser E2E dan peta Profiling 2026
- [6 tes Chromium untuk layar HP dan alur verifikasi](prototypes/profil-puskeswan/tests/browser.test.mjs)
- [Peta 9 domain Profiling 2026 (belum field-level)](docs/M02_PROFILING_2026_MAPPING.md)
- [GitHub Actions 96 tes otomatis: SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703)
- **Masih prototype.** Browser headless bukan uji petugas di HP nyata.

## Dokumen desain
- [Masterplan](docs/MASTERPLAN.md)
- [Katalog 15 modul](docs/MODULES_INDEX.md)
- [UX ramah petugas lapangan](docs/UX_PAPERLESS.md)
- [Workflow bersama](docs/WORKFLOW_ENGINE.md)
- [Riwayat perubahan scope](docs/CHANGELOG_ROADMAP.md)
- [Issue pekerjaan](https://github.com/dvoriano/yandik-plus/issues)
- [Draft PR #9](https://github.com/dvoriano/yandik-plus/pull/9)

## Kesepakatan operasional
- **Hanya bekerja langsung di GitHub** untuk saat ini. Tidak meminta pengguna unduh/setup/PowerShell/SSH.
- Website https://yandikvo.my.id/ tetap berjalan seperti sekarang dan **tidak diubah**. Tidak ada koneksi VPS/database/auto-deploy.
- Branch kerja `develop/yandik-foundation`, bukan `main`.
- Source Flask lama 171 file **belum seluruhnya terimpor ke repository**; jangan mengklaim aplikasinya runnable.
- Perkembangan ditulis ke `PROJECT_STATE.md`, `docs/ROADMAP.md`, dan `docs/WORKLOG.md` setiap ada progres. Spesifikasi modul dan changelog ikut diperbarui jika berubah.

Repository dan pekerjaan YANDIK+ terpisah sepenuhnya dari bot Indodax.
