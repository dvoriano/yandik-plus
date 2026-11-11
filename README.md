# YANDIK+

**Kerja sudah sulit, administrasi jangan rumit.**

Repository pengembangan YANDIK+ untuk mewujudkan sistem kerja kesehatan hewan yang paperless, mudah dipakai petugas, dan terintegrasi.

## Dokumen Pengenalan dan Gambaran Umum YANDIK+

**Dokumen rujukan:**

1. **[RINGKASAN EKSEKUTIF YANDIK+](docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md)**: bahan penjelasan kebijakan, kebutuhan pengembangan, tata kelola, dan dukungan AI Agent sebagai sarana bantu pembangunan sistem.
2. **[DOKUMEN PENGENALAN LENGKAP YANDIK+](docs/PENGENALAN_YANDIK_PLUS.md)**: tujuan, 15 modul, fitur dan fungsi, 14 sistem kerja internal, contoh alur pelayanan, pemisahan kewenangan, pengawasan, tata kelola SPBE dan pertanyaan pemeriksaan.
3. **[KATALOG 15 MODUL](docs/MODULES_INDEX.md)**: rincian modul jika ingin membaca lebih jauh.

**Status naskah:** **DRAF UNTUK TELAAH**, belum disahkan sebagai kebijakan atau persetujuan implementasi. Repositori ini **private**; tautan dapat dibuka hanya oleh pengguna GitHub yang diberi akses. Jangan mengubahnya menjadi publik tanpa peninjauan/izin.

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

## M02-S4: Permasalahan dan ringkasan data lintas modul
- [Daftar masalah dan proses tindak lanjut](prototypes/profil-puskeswan/problems.mjs)
- [Contoh ringkasan SDM/APEL baca-saja](prototypes/profil-puskeswan/source_snapshots.mjs)
- [Dokumen keputusan, batasan dan progres](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROBLEMS_AND_REFERENCES.md)
- [GitHub Actions: 119 tes Python/Node/Chromium SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101)
- Data fiktif; **bukan** pelaporan asli, API, atau persetujuan bantuan.

## M03-S1: Support Puskeswan, usulan dari masalah
- [Kontrak kebutuhan & verifikasi tanpa alokasi](prototypes/profil-puskeswan/support_needs.mjs)
- [Alur dan kewenangan](docs/M03_LINKED_SUPPORT_NEEDS.md)
- [GitHub Actions: 137 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052) (65 Python, 60 Node, 12 Chromium).
- M03 **SEDANG sebagai prototype**, M04 alokasi dan distribusi tetap RENCANA.

## M03-S2: referensi bukti dan pencegahan duplikat
- [Validasi kode bukti dan normalisasi barang](prototypes/profil-puskeswan/support_evidence.mjs).
- [Dokumen M03-S2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_EVIDENCE_AND_DEDUP.md) beserta batasan metadata, anti-duplikat dan review manusia.
- [GitHub Actions: 154 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527).
- M03 tetap SEDANG (prototype); bukti belum diunggah sungguhan, M04 tetap RENCANA.

## M04-S3 | Tindak lanjut administratif (draft, BELUM DIUJI)
- [Kode penugasan, klarifikasi dan pemeriksaan catatan DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup).
- [Dokumen M04-S3](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S3_ADMIN_FOLLOWUP.md) dan [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Penutupan tugas **bukan** keaslian surat, persetujuan bantuan, pengadaan, penyaluran atau BAST; tidak terhubung ke produksi.

## M04-S2 | Register referensi dokumen eksternal (draft, BELUM DIUJI)
- [Kode register metadata dokumen DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference) untuk pencatatan, klarifikasi dan pemeriksaan referensi yang diklaim sudah terbit di luar YANDIK+.
- [Dokumen proses M04-S2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md) dan [backlog QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- **Metadata tercatat bukan bukti keputusan sah.** Tidak ada penerbitan SK, pembiayaan, penetapan bantuan atau BAST; belum diuji, belum terhubung produksi.

## M04-S1 | Administrasi usulan Support (draft, BELUM DIUJI)
- [Enam berkas rancangan proses pemeriksaan administratif](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review), tanpa keputusan/anggaran otomatis.
- [Dokumen M04-S1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S1_ADMIN_HANDOFF.md) dan [backlog pemeriksaan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Baru ditulis di GitHub `drafts/`, belum dijalankan atau diintegrasikan ke website/VPS. M04-S2+ tetap RENCANA.

## M03-S3: penilaian prioritas yang dapat dijelaskan
- [Model lima faktor, perhitungan dan review](prototypes/profil-puskeswan/support_priority.mjs).
- [Dokumen rancangan bobot, keadilan dan batas](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_PRIORITY_ASSESSMENT.md).
- [GitHub Actions 176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270) (65 Python, 94 Node, 17 Chromium).
- **Bobot belum menjadi kebijakan dinas.** Ini hanya prototype dengan DEMO, bukan penetapan bantuan atau fitur website aktif.

## M03-S4 | Draft komparasi fairness, BELUM DIUJI
- [Kode laboratorium enam skenario fiktif](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness).
- [Rencana M03-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4_FAIRNESS_PLAN.md), [backlog tes tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md), [mode tanpa CL/CI](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md).
- **Belum diuji, belum diintegrasikan**, tidak boleh dipakai memilih penerima bantuan.
- Bukti 176 tes sebelumnya hanya untuk M03-S3.

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
