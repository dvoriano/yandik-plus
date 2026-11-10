# WORKLOG | Catatan Pengembangan YANDIK+ (append-only)

**Cara membaca:** entri terbaru paling atas. Hanya catat sesuatu yang **betul-betul terjadi di GitHub**; pastikan tautan atau path bukti ada. Status milestone resmi tetap di [ROADMAP.md](ROADMAP.md).

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
