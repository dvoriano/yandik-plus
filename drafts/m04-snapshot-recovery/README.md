# M04-I6C | Snapshot, Recovery & Retensi (DEMO)

**KODE DITULIS, BELUM DIUJI.** Semua rancangan di folder ini terisolasi, tanpa database nyata, autentikasi Flask, file/backup riil, migrasi, penghapusan atau penjadwalan.

| Kode | Fungsi rencana | Yang tidak dilakukan |
|---|---|---|
| `snapshot.mjs` | Dua observasi I4/I5 diperiksa ulang melalui manifest I6A | Tidak membuka transaksi DB atau membuktikan atomisitas |
| `recovery.mjs` | Jurnal DEMO berurutan, checksum berantai, rencana respons kegagalan | Tidak menjalankan restore atau rollback |
| `retention.mjs` | Register per Puskeswan dan klasifikasi arsip, legal hold DEMO | Tidak menentukan masa simpan atau menghapus/ekspor data |
| `runbook.mjs` | 12 gerbang host, backup, transaksi all-or-nothing, audit dan keputusan | Tidak pernah mengizinkan cutover hanya dari status simulasi |

**Seluruh keluaran secara eksplisit menolak `may_write`, `may_cutover`, dan izin tindakan lain.** Hash jurnal mendeteksi modifikasi sederhana, bukan tanda tangan digital atau audit permanen. Dua pembacaan cocok bukan bukti satu snapshot atomik; callback I6B juga belum menjamin pembacaan tepercaya sampai dihubungkan pada backend.

Skenario yang **ditulis tetapi tidak dijalankan:** 8 snapshot + 11 recovery + 6 retensi + 5 runbook = **30**. Eksekusi QA/CI membutuhkan izin G0 eksplisit dari pemilik proyek.

Lihat [spesifikasi M04-I6C](../../docs/M04_I6C_SNAPSHOT_RECOVERY_RETENTION.md), [I6B](../../docs/M04_I6B_BACKEND_READONLY_IDENTITY.md), dan [TEST_BACKLOG](../../docs/TEST_BACKLOG.md).
