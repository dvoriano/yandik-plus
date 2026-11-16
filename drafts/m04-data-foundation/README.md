# M04-I2 | Fondasi data terpadu (draf server DEMO)

**KODE DITULIS, BELUM DIUJI.** SQLite terisolasi; koneksi DatabaseSync dari Node yang mendukung node:sqlite (baseline rencana Node >=22.13) diberikan oleh host server yang dipercaya. Tidak ada koneksi dibuka oleh modul ini, HTTP endpoint, migrasi produksi atau database yang dibuat pada GitHub.

Repository satu workspace menyimpan state lintas modul, revisi, snapshot lama, audit dan idempotency key secara atomik. Identitas dari adapter sesi tepercaya, scope fasilitas/wilayah dan role check di fungsi server. Bukan implementasi login/RBAC Flask dan bukan otorisasi resmi. Hanya admin DEMO boleh menjalankan skenario I1. Koreksi: ajukan, penelaah berbeda, tarik snapshot baru dari provider sintetis tepercaya; sumber usang/riwayat ditolak, perubahan binding paket diblokir dan dicatat, alur fasilitas dibekukan selama koreksi aktif. Penyelesaian konflik berantai belum dibangun.

16 skenario Node tertulis (DB :memory: di kode tes), **0 dijalankan**. API, migrasi, rekonsiliasi APEL/foundation, recovery, backup, autentikasi, pengujian concurrency lintas koneksi dan evaluasi kelembagaan tertunda. Snapshot mengandung semua state DEMO; tidak boleh digunakan untuk data nyata.
