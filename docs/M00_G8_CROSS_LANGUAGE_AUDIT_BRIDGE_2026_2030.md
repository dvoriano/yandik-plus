# M00-G8 | Kontrak Audit JavaScript ↔ Python, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | HANYA PROYEKSI BACA-SAjA.**

## Temuan sumber yang melatarbelakangi
- [M00-G5](../drafts/m00-audit-port/audit_port.mjs) membuat hash dari JSON.stringify objek dan nomor \`sequence\` jurnal global.
- [M00-G7](../drafts/m00-sqlite-demo-writer/writer.py) membuat hash lewat json.dumps sorted keys untuk stream per \`link_id\` dengan \`revision\`.
- Nilai hash lama **tidak boleh dianggap identik**, dan urutan G5 tidak sama dengan revisi G7 bila jurnal memuat banyak kandidat. Tidak ada bukti kesamaan sumber, aktor atau database di antara keduanya.

## Kode baru
- [Bridge JavaScript](../drafts/m00-cross-language-audit/bridge.mjs) dan [bridge Python](../drafts/m00-cross-language-audit/bridge.py) memakai array JSON urutan tetap, angka integer positif, ID dan kode status ASCII DEMO, SHA-256 dan domain \`YANDIK_DEMO_AUDIT_BRIDGE_V1\`.
- [Fixture dua format](../drafts/m00-cross-language-audit/demo_vectors.json) menggambarkan satu event fiktif semantik sama, tetapi hash asalnya berbeda dan **tidak divalidasi**.
- [Script ekspor test yang belum dijalankan](../drafts/m00-cross-language-audit/export_vectors.mjs).
- [18 skenario QA JavaScript](../drafts/m00-cross-language-audit/tests/bridge.test.mjs) dan [19 skenario QA Python](../drafts/m00-cross-language-audit/tests/test_bridge.py), **37 QA tertulis, 0 dijalankan**. Pengujian Python nantinya memanggil Node untuk memeriksa hash silang runtime, bila owner mengizinkan.

## Sifat output
| Elemen | Makna | Bukan |
|---|---|---|
| \`format_only_parity_demo\` | Event yang diberikan punya hasil normalisasi kanonik setara | Bukti dua sumber historis sama atau terautentikasi |
| \`bridge_head_digest\` | SHA-256 dari array kanonik hasil normalisasi sintetis | Head hash historis G5 atau G7 untuk transaksi asli |
| \`single_link\` | Dalam satu input hanya satu \`link_id\` dan urutan 1..N | Konverter otomatis semua log G5 multi-link |
| \`original_source_digests_validated:false\` | Hash asal tidak dihitung ulang maupun direkonsiliasi | Bukti integritas/anti-tamper |
| Semua izin false | Tidak ada mutasi, sinkronisasi, persetujuan atau migrasi | Izin produksi |

Rekaman dengan klaim role/field tambahan, status official, ID riil, revisi melompat atau banyak link G5 ditolak. Sumber asli dan identitas aktor harus diperiksa oleh backend berwenang sebelum ada migrasi nyata. Tidak ada koneksi iSIKHNAS/APEL atau SQLite produksi.

## Gerbang P0
1. Dapatkan source Flask sanitisasi berizin dan kamus unit event/record dari pengampu.
2. Definisikan identitas master dan apakah audit global atau per-stream, termasuk rebasing hash lama **tanpa mengubah histori**.
3. Audit integritas sumber lama melalui validator yang tepat masing-masing, provenance tepercaya, reviewer authority, timestamp dan retention.
4. Baru rancang migrasi dengan idempotency, rollback, backup, consent, dan uji negatif; belum ada migrator di kode ini.
5. Jalankan 37 QA setelah izin eksplisit, termasuk pemeriksaan Node↔Python dan pengujian data rusak.

**Status:** CODE_WRITTEN_NOT_TESTED, FORMAT_ONLY, SOURCE_INTEGRITY_UNVERIFIED, MIGRATION_NO_GO.
