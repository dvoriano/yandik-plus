# M13-S3 | Catatan Telaah Manusia atas Kandidat Hubungan APEL ↔ Surveilans, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | DATA FIKTIF | TANPA VALIDASI KEJADIAN RESMI.**

## Tujuan dan bukti
M13-S2 hanya mengajukan kemungkinan kecocokan berdasarkan kunci peristiwa-lokasi-periode-Puskeswan. M13-S3 menambahkan *catatan penelaahan manusia* dan pemeriksaan perubahan sumber, tanpa mengubah sifat link sebagai **kandidat yang belum terbukti**.

- [Model review](../drafts/m13-crosswalk-review/review.mjs) memanggil ulang kontrak M13-S2/M13-S1 dan M05-14/M05-0 sebelum membangun board atau menambah catatan.
- [Fixture rekaan](../drafts/m13-crosswalk-review/fixtures.mjs) membuat satu usulan dan dua identitas peran DEMO tanpa data petugas asli.
- [28 skenario QA tertulis](../drafts/m13-crosswalk-review/tests/review.test.mjs), **0 dijalankan**.
- **Pemeriksaan source secara statis:** impor \`buildDemoDashboard\` dari M05-14 yang digunakan M13-S2 ditemukan sesuai deklarasi ekspor, tetapi hal ini **bukan bukti modul berhasil dijalankan**.

## Alur untuk bahan diskusi
| Langkah | Hasil kode DEMO | Batas yang tegas |
|---|---|---|
| Usul pasangan kunci | Kandidat M13-S2 \`POSSIBLE_MATCH_UNVERIFIED_DEMO\` | Bukan kesamaan kejadian nyata |
| Cakupan usul | Pengusul DEMO berbeda dari verifikator DEMO | Identitas/otorisasi server nyata belum ada |
| Catatan penelaah | \`REQUEST_EVIDENCE_DEMO\`, \`POSSIBLY_RELATED_DEMO\`, \`DISTINCT_RECORDS_DEMO\`, \`REOPEN_DEMO\` | Tidak ada keputusan resmi atau konfirmasi penyakit |
| Alasan | Kode kategori tanpa uraian bebas | Tidak memuat identitas, lokasi aktual, dokumen, atau hasil lab |
| Sumber berubah | Catatan lama dengan digest berbeda ditolak | Digest hanya mendeteksi perubahan fixture, bukan keaslian data |
| Penyimpanan | Hanya salinan log in-memory dengan urutan/revisi | Bukan database, tanda tangan, audit persisten atau penugasan |
| Dampak terhadap APEL | Tidak mengubah record/total, status \`reconciled=null\` secara konseptual | Tidak menetapkan nilai capaian/penghargaan |

Keluaran board hanya menampilkan status ringkas; **bukan bukti seorang petugas resmi telah menelaah atau menyetujui**. Detail nama reviewer tidak dikirim ke tampilan. Tidak ada konfirmasi kasus/penyakit, sinkronisasi iSIKHNAS, klaim otorisasi atau publikasi.

## Gerbang menuju sistem benar-benar terintegrasi
1. Validasi terminologi kejadian, investigasi per lokasi, unit penghitungan APEL, dan kesetaraan sumber dengan pemilik proses.
2. Hak akses kasus dan lokasi, retensi dokumen, petugas penelaah lintas level, persetujuan dan mekanisme koreksi perlu ditetapkan.
3. Implementasikan identitas *server-side* dan audit log append-only yang didukung storage aman serta otorisasi berbasis objek dan peran.
4. Integritas sumber membutuhkan bukti impor, checkpoint, sumber resmi berizin dan rekonsiliasi versi. SHA-256 dari data yang dikendalikan pengusul **tidak boleh** dianggap autentikasi.
5. Uji ulang 28 QA, tes regresi M13-S2 dan hak akses negatif setelah pemilik proyek memberi izin. Hingga saat itu tetap **NO_GO**.

**Status:** \`CODE_WRITTEN_NOT_TESTED\`. MOD-07 dan APEL terpadu belum selesai.
