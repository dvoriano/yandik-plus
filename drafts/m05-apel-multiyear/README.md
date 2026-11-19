# M05-0 | APEL 2026–2030, baseline multi-tahun

**KODE DITULIS, BELUM DIUJI.** Seluruh data fiktif, tidak ada koneksi Flask, APEL lama, SQLite atau situs produksi.

| Berkas | Fungsi DEMO | Batas |
|---|---|---|
| `policy.mjs` | Registry per tahun 2026, 2027, 2028, 2029, 2030; usulan revisi mandiri per tahun | Belum ada aturan/penilaian disahkan, tidak mewarisi aturan tahun lain |
| `reporting.mjs` | Validasi input DEMO; satu laporan/fasilitas/bulan; nilai nol berbeda dengan bulan tidak ada; investigasi per lokasi+kejadian; hewan kurban unik | Bukan skema persis form APEL produksi; tanpa simpan ke DB, revisi resmi, approval |
| `timeline.mjs` | Rekap terpisah per tahun serta penanda jumlah bulan belum melapor | Tidak menyatukan skor lintas tahun atau membuat klasemen resmi |
| `fixtures.mjs` | Contoh laporan sintetis 2026–2030 dan kasus nol/kurban/investigasi | Tidak memakai data layanan atau nama Puskeswan asli |
| `tests/` | **29 skenario tertulis, 0 dijalankan** | QA/CI menunggu izin pemilik (G0) |

**Arsitektur dapat diperluas setelah 2030**, tetapi hanya tahun yang tercantum dalam registry yang diproses agar tidak ada aturan "default" yang diam-diam dipakai pada tahun yang belum dirancang. Semua output berlabel DEMO, `official_scoring:false`, tidak memberi izin publish/migrasi.

[Spesifikasi M05-0](../../docs/M05_0_APEL_MULTIYEAR_2026_2030.md) · [Dokumen modul APEL](../../docs/modules/02_APEL_PUSKESWAN.md) · [Test backlog](../../docs/TEST_BACKLOG.md).
