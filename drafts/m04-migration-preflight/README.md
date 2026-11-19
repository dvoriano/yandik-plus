# M04-I6A | Preflight Migrasi Satu Arah DEMO

**KODE DITULIS, BELUM DIUJI.** Dirancang terpisah; tidak ada migrasi sungguhan.

Berkas `preflight.mjs` membuat **manifest rencana** untuk pemetaan I4→I5 berbasis data sintetis. Ia memanggil proyeksi partisi M04-I5, mencatat jumlah fasilitas, revisi acuan, jumlah arsip dan sidik SHA-256. Keluaran tidak memuat isi snapshot atau bukti operasional.

Prapemeriksaan menolak sumber tidak sesuai kontrak I4/I5, target tidak kosong, revisi tidak sah, rujukan silang/yatim, dan manifest yang tidak cocok saat dibandingkan kembali. Digest hanya pendeteksi perubahan, **bukan bukti bahwa sumber berasal dari sistem resmi**. Inventaris target yang diberikan pemanggil juga **bukan bukti dari database**.

Belum ada penyalinan, penulisan SQL, pembuatan tabel, akses file, pengaturan identitas, koneksi server, sinkronisasi, pemulihan, CI, atau deployment. Tidak boleh digunakan untuk migrasi nyata atau keputusan kedinasan.

Skenario regresi di `tests/preflight.test.mjs` **baru ditulis dan tidak dijalankan**. Rujukan: [M04-I6A](../../docs/M04_I6A_MIGRATION_PREFLIGHT.md), [M04-I5](../../docs/M04_I5_GENERATION_AND_PARTITIONS.md).
