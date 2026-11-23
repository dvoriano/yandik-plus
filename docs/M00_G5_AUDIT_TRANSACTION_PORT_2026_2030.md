# M00-G5 | Audit Berantai dan Rancangan Transaksi Database, 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | TANPA EKSEKUSI SQL.**

## Yang dibangun
- [Model pasangan log](../drafts/m00-audit-port/audit_port.mjs) menyiapkan log review M13-S3 dan audit event **dalam memori**. Ada validasi revisi dan kecocokan satu-per-satu antara review ID, link, penelaah, alasan dan digest source.
- [Skema SQL rancangan](../drafts/m00-audit-port/001_audit_append_only.sql) berisi tabel state/audit dan trigger untuk menolak UPDATE/DELETE audit event. **Tidak diterapkan di database mana pun.**
- [24 QA tertulis](../drafts/m00-audit-port/tests/audit_port.test.mjs), **0 dijalankan**.
- [M13-S3](M13_S3_MANUAL_REVIEW_CROSSWALK_DEMO_2026_2030.md) tetap kontrak review DEMO; tidak ada keputusan kasus, legalitas atau penyamaan data iSIKHNAS/APEL.

## Alur transaksi yang baru berupa rancangan
1. Autentikasi user pada server yang benar (belum diimplementasikan) dan periksa peran, objek dan wilayah.
2. \`BEGIN IMMEDIATE\` pada database yang dikelola server.
3. Periksa revisi terkini, kecocokan source, head audit dan request idempotency.
4. Tambahkan event review + audit + update state **dalam transaksi yang sama**.
5. COMMIT bila semua sukses; ROLLBACK jika ada konflik/gagal.
6. Penuhi backup/restore, logging akses, proteksi file DB, batas retensi dan pemeriksaan integritas eksternal.

## Hal yang tidak boleh disalahartikan
| Komponen | Ada pada kode | Belum terbukti |
|---|---|---|
| Rantai SHA-256 | Digest antar-event untuk mendeteksi perubahan DEMO | Autentikasi, anti-pemalsuan, tanda tangan |
| Revisi optimistis | Pemeriksaan nomor urut review dan audit pada objek memori | Kebenaran saat dua proses menulis bersamaan |
| Skema SQLite | Tabel dan trigger rancangan | Database terpasang, transaksi sukses atau aman terhadap admin |
| Append-only | Struktur journal in-memory dan trigger SQL yang belum dijalankan | Penyimpanan tahan manipulasi, audit permanen |
| Akses reviewer | Callback sesi DEMO M13-S3 | Identitas server dan keputusan yang sah |

SHA-256 yang dihitung ulang dari data yang dikuasai pelaku tidak membuktikan keaslian. Trigger tidak mencegah administrator database mengubah sistem atau file di luar transaksi. Belum ada rahasia, data pengguna, nama sebenarnya atau log nyata dalam repo publik.

**Gerbang berikut:** import source yang sudah disanitasi/diizinkan, rancangan transaksi server yang di-review, authenticated Flask context, RBAC/ABAC, storage/backup, idempotency, negative tests serta persetujuan pengampu proses.

**Status:** CODE_WRITTEN_NOT_TESTED; DATABASE_NOT_CREATED; SQL_NOT_EXECUTED; AUDIT_NOT_DURABLE; PRODUCTION_NO_GO.

## Lanjutan rancangan M00-G7
[Penulis audit SQLite hanya memori DEMO](M00_G7_SQLITE_INMEMORY_TRANSACTION_2026_2030.md) telah ditulis, **25 QA tertulis, 0 dijalankan**. Skema Python berbeda dari model M00-G5 JS; masih perlu keselarasan kontrak dan validasi, tidak ada SQL/DB yang dijalankan.

## Lanjutan M00-G8
[Bridge baca-saja JavaScript ↔ Python](M00_G8_CROSS_LANGUAGE_AUDIT_BRIDGE_2026_2030.md) menyamakan **format proyeksi DEMO** pada jurnal single-link, **37 QA tertulis, 0 dijalankan**. Rantai hash lama M00-G5 tidak dinyatakan kompatibel dengan M00-G7 dan tidak dimigrasi.
