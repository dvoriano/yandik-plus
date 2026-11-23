# M00-G5 | Audit In-Memory dengan Blueprint Transaksi SQLite

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | NO DATABASE, NO MIGRATION.**

\`audit_port.mjs\` menyiapkan *pasangan perubahan* pada catatan review M13-S3 dan audit event M00-G5, dengan revisi optimistis, referensi per-event, digest berantai serta pemeriksaan kesesuaian satu-per-satu. Tidak ada penulisan storage atau HTTP.

\`001_audit_append_only.sql\` adalah **rancangan skema** SQL untuk nanti: state per kandidat, audit append-only, pembatasan revisi, dan pemblokiran UPDATE/DELETE audit melalui trigger. **Belum dieksekusi**; tidak cukup membuktikan transaksi atomik, keamanan sumber, proteksi penghapusan oleh DBA, atau backup.

Prasyarat sebelum dipakai: host backend autentik, role yang sah, batas wilayah, penetapan owner data, otorisasi koneksi, sinkronisasi snapshot, transaksi \`BEGIN IMMEDIATE\`, cek revisi dan head digest, tulis state+event satu transaksi, monitoring/backup/audit serta pengujian gagal/rollback.

SHA-256 dalam model hanya pendeteksi perubahan; siapa pun yang menguasai semua record dapat menghitung ulang hash. **Bukan tanda tangan, bukti log yang tidak bisa diubah, atau otorisasi resmi.**

- \`tests/audit_port.test.mjs\`: **24 skenario QA tertulis, 0 dijalankan**.
- Tidak ada tabel, migration, DB, person data, atau produksi yang disentuh.

[Spesifikasi](../../docs/M00_G5_AUDIT_TRANSACTION_PORT_2026_2030.md) · [Backlog QA](../../docs/TEST_BACKLOG.md).
