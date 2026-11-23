# M05-9 | Register Tindak Lanjut Rekonsiliasi Manual APEL 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Rancangan ini bekerja dengan identitas dan skenario sintetis. **Bukan catatan audit resmi, bukan rekomendasi yang telah disetujui, dan bukan persetujuan untuk mengubah data.**

## 1. Maksud dan hubungan dengan tahapan sebelumnya
M05-5 menyiapkan format rekonsiliasi sumber DEMO; M05-6 katalog 36 field semantik yang belum punya mapping schema aktual; M05-7 menyiapkan pemeriksaan relasi/riwayat serta konflik; M05-8 katalog 14 syarat bukti dan enam gerbang kesiapan **BLOCKED**. M05-9 mengubah kebutuhan pembahasan tersebut menjadi daftar **tindak lanjut yang diusulkan**, tanpa menganggap status sumber/aturan resmi telah diverifikasi.

Dua tipe tugas:
1. **REQUIREMENT**: 14 syarat sumber/otorisasi yang masih terbuka, termasuk owner scope, data dictionary, kunci/grain, histori wilayah, timestamp server, versi aturan per tahun, verifikasi Juknis, keamanan, staging dan publikasi.
2. **LINEAGE_ISSUE**: satu tugas untuk setiap konflik DEMO dari M05-7 yang ikut tertera pada paket M05-8, misalnya `REGION_PARTIAL_MONTH`, `WORKFLOW_REVISION_MISMATCH`, `POLICY_MISSING_OR_VERSION`, `SUPPORT_UNIT_CONFLICT`, duplikasi grain, dan fasilitas tidak ditemukan.

Setiap tugas tetap terbuka meskipun sudah mempunyai catatan usulan. Tidak ada status "selesai/approved/verified" yang diproduksi oleh kode.

## 2. Kontrak identitas dan riwayat
- `snapshot_id` wajib dimulai `DEMO-SNAP-`. Satu snapshot menghasilkan identitas tugas lokal yang konsisten untuk kebutuhan bukti dan nomor konflik.
- `issue_index` hanya bermakna di dalam snapshot tersebut. **Jangan** menggunakan `issue_index=1` lintas snapshot sebagai acuan tunggal. Dokumen sumber nyata kelak memerlukan identitas dan hash/snapshot tepercaya tersendiri.
- `task_id` dan `reference` menunjukkan kategori, kode isu dan referensi sumber DEMO, bukan nomor laporan dinas.
- `owner_role` adalah **kategori peran** yang perlu dilibatkan, bukan penunjukan orang/pejabat atau distribusi tugas yang sudah disahkan.
- `required_evidence_ids` berisi ID kebutuhan bukti (bukan ID dokumen atau isi lampiran). Pemetaan konflik ke kebutuhan bukti adalah **usulan review**, belum aturan sumber yang disahkan.

## 3. Usulan tindakan dan pengaman
Kode menyediakan lima jenis usulan: meminta bukti, klarifikasi sumber, telaah rekonsiliasi manual, eskalasi pembahasan kewenangan dan penundaan sampai izin ada. Setiap catatan memerlukan:
- identitas usulan dan reviewer berlabel DEMO;
- `snapshot_id` yang tepat;
- `task_id` yang sudah ada;
- `expected_revision` dan alasan dari katalog;
- `evidence_requirement_id` yang relevan dengan tugas.

Revisi proposal disusun berurutan tanpa mengubah catatan sebelumnya. Pembatasan ini **hanya rancangan in-memory**, bukan pembuktian transaksi, immutable storage, ketersediaan audit trail, autentikasi atau otorisasi. Semua tugas tetap `OPEN_UNVERIFIED`, `officially_resolved=false`, dan `source_modified=false`.

Tidak ada nama petugas nyata, tanggal tenggat resmi atau tanda tangan persetujuan, karena **belum ada sumber kewenangan untuk menetapkannya**. Keluaran `handoff.mjs` hanya untuk bahan pembahasan, bukan pengiriman disposisi.

## 4. Larangan dan status kesiapan
Seluruh upstream harus tetap `BLOCKED`. Fungsi menolak paket yang mengaku memiliki akses/otorisasi atau keputusan integrasi, baik untuk tes, deploy maupun publikasi. M05-9 tidak memiliki:
- database, API, SSH/VPS, sistem produksi, sumber atau data pribadi;
- auto-join, perbaikan record, penghapusan, konfirmasi BAST, tanda tangan atau keputusan kebijakan;
- skoring, peringkat, penghargaan, publikasi ataupun pengiriman tugas otomatis;
- pengujian runtime, browser, CL/CI, GitHub Actions, merge, atau deployment.

Repository bersifat PUBLIC, sehingga seluruh contoh dan metadata harus sintetik. Kesamaan bentuk dengan sumber asli tidak membuktikan validitas atau kewenangan penggunaan.

## 5. Hasil yang perlu tersedia sebelum proses formal
1. Persetujuan tertulis tentang owner data, tujuan penggunaan, cakupan dan lingkungan uji.
2. Data dictionary schema aktual dan aturan primary/foreign key serta revisi.
3. Definisi granularity per layanan/kejadian/lokasi/hewan, deklarasi nihil, serta aturan historis wilayah.
4. Rekonsiliasi snapshot yang tepercaya, data paritas Juknis 2026, dan dasar aturan yang ditetapkan masing-masing tahun 2027–2030.
5. Bukti rencana/realisasi dan satuan yang dapat diperiksa, keamanan data, dan mekanisme audit.
6. Telaah manusia terotorisasi dan bukti keputusan tersendiri untuk penggunaan hasil, staging maupun publikasi.

Catatan review DEMO tidak dapat menggantikan bukti tersebut.

## 6. Keluaran dan QA
- [Register usulan tindak lanjut](../drafts/m05-apel-followup/register.mjs)
- [Riwayat usulan dengan revision guard](../drafts/m05-apel-followup/proposals.mjs)
- [View-model untuk bahan pembahasan](../drafts/m05-apel-followup/handoff.mjs)
- [README](../drafts/m05-apel-followup/README.md)
- [50 skenario QA tertulis](../drafts/m05-apel-followup/tests/followup.test.mjs), **0 dijalankan**
- [Backlog QA](TEST_BACKLOG.md), [PR #9](https://github.com/dvoriano/yandik-plus/pull/9)

**M05-10 (RENCANA):** matriks skenario uji paritas sumber dan kriteria penerimaan tahunan 2026–2030, dengan batas CODE_ONLY tetap berlaku. Tidak ada integrasi nyata sampai otorisasi dan data dictionary resmi tersedia.
