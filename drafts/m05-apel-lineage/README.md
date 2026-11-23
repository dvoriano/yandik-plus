# M05-7 | Data Lineage, Temporal Join & Conflict Review APEL 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | DATA DEMO SAJA.**

Modul `lineage.mjs` menyusun **kontrak relasi** dan meninjau *calon* rantai asal data pada fixture sintetik. Fungsi `buildLineageContract()` menyediakan tujuh jenis relasi dan referensi field semantik M05-6. Fungsi `inspectDemoLineage({sources})` memeriksa identitas Puskeswan, periode, revisi, kecocokan workflow, histori wilayah, versi policy, serta hubungan rencana/realisasi dukungan tanpa mengubah data.

- Sumber: `facilities`, `regions`, `services`, `workflows`, `policies`, `support_plans`, `support_realizations`.
- Semua ID fixture wajib berawalan `DEMO-`. Tidak ada join berdasarkan nama, pengambilan revisi terbaru otomatis, atribusi wilayah terkini untuk bulan lampau, atau penggabungan rencana dengan realisasi.
- Batas `valid_to` pada fixture DEMO bersifat **eksklusif**; relasi wilayah dan policy memerlukan cakupan **sebulan penuh**. Pergantian di tengah bulan diperlakukan sebagai konflik yang membutuhkan aturan sumber yang sah.
- Banyak kejadian pelayanan boleh berbagi satu revisi laporan. Duplikasi identitas kejadian + lokasi + kategori ditandai, **tidak** dihapus otomatis.
- Nilai `OBSERVED_ZERO`, `OBSERVED_NONZERO`, `UNKNOWN`, `NOT_REPORTED`, `NOT_APPLICABLE` terpisah. Nol tidak boleh disimpulkan dari null.
- Semua `candidate_refs` dan jejak dukungan berstatus **unverified** dan `usable_for_reporting=false`. Daftar konflik hanya antrian telaah manual, bukan bukti kebenaran atau perbaikan otomatis.

**Dilarang:** koneksi, query, operasi DB, sumber riil, penetapan aturan, perbaikan, scoring, ranking, publikasi, atau deploy. Status semua gerbang otorisasi tetap false. Import modul lain adalah import kode DEMO, bukan integrasi runtime/produksi.

**38 skenario QA ditulis; 0 dijalankan** pada `tests/lineage.test.mjs`. Lihat [spesifikasi M05-7](../../docs/M05_7_LINEAGE_TEMPORAL_CONFLICT_2026_2030.md) dan [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).

Tahap lanjutan M05-8: paket review bukti dan daftar persetujuan sumber/mapping, tetap tanpa koneksi nyata hingga izin eksplisit diberikan.
