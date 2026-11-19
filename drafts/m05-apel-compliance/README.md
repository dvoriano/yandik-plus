# M05-2 | Checklist Kepatuhan APEL 2026–2030 (DEMO)

**KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Semua berkas berisi fungsi baca/komparasi DEMO. Tidak terhubung pada produksi, tidak menjalankan tes, tidak mengirim notifikasi, tidak mengubah formulir, tidak mengaktifkan penilaian.

| Kode | Fungsi | Batas kepercayaan |
|---|---|---|
| `schedule.mjs` | Kalender *usulan* 12 bulan per tahun, hari tenggat/publikasi pada bulan berikut, pengecualian periode tertentu, termasuk transisi Desember 2030 → Januari 2031 | Semua hari/tanggal **input usulan**. Tidak ada nilai resmi otomatis untuk 2026–2030, tidak ada persetujuan |
| `checklist.mjs` | Pembaca terscope M05-1; status belum lapor, draf, terkirim menunggu telaah, koreksi dan revisi; ringkasan per tahun/lima tahun | Callback sesi/fasilitas hanya kontrak DEMO, belum autentikasi riil. Pembacaan 12 bulan bukan snapshot transaksi |
| `timing.mjs` | Perbandingan tanggal penerimaan fiktif dengan kalender usulan, berlabel **SIMULASI**, atau tidak dapat ditentukan jika tidak ada bukti waktu | M05-1 belum menyimpan timestamp server; tanggal contoh tidak dapat membuktikan ketepatan waktu, tidak menghitung skor |
| `fixtures.mjs` | Contoh akun, periode, status dan tanggal fiktif | Tidak memakai layanan atau petugas sungguhan |

**Pembedaan utama:** draf tidak sama dengan terkirim; terkirim bukan terverifikasi; setelah dikembalikan status tetap terpisah meski pengiriman sebelumnya tercatat. Laporan nol tidak sama dengan bulan tanpa laporan. Tidak boleh mengklaim laporan lengkap, tepat waktu, terlambat, atau layak mendapat apresiasi berdasarkan informasi DEMO saja.

**QA baru:** `tests/schedule.test.mjs` (9 skenario), `tests/checklist.test.mjs` (12), `tests/timing.test.mjs` (7). **Total 28 tertulis, 0 dijalankan.** Tidak ada CI/CL/tes sampai izin owner.

[Spesifikasi M05-2](../../docs/M05_2_CHECKLIST_COMPLIANCE_2026_2030.md) · [M05-1](../../docs/M05_1_APEL_REPORT_WORKFLOW_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
