# YANDIK+

**Kerja sudah sulit, administrasi jangan rumit.**

Repository pengembangan YANDIK+ untuk mewujudkan sistem kerja kesehatan hewan yang paperless, mudah dipakai petugas, dan terintegrasi.

## BACA INI DULU SETIAP CHAT / PROGRES TERBARU
**[PROJECT_STATE.md: STATUS TERAKHIR + LANGKAH SELANJUTNYA](PROJECT_STATE.md)**

**[Roadmap dan Checklist](docs/ROADMAP.md)** · **[Worklog progres](docs/WORKLOG.md)** · **[Aturan GitHub-only](docs/GITHUB_WORKFLOW.md)**

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
