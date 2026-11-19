# M04-I4 | Aktivasi simulasi terjaga dan register tindak lanjut

**KODE DITULIS, BELUM DIUJI.** Modul ini hanya membangun pemeriksaan gerbang dan usulan arsip untuk promosi **DEMO**. Ia tidak bisa memberikan persetujuan resmi, perubahan produksi, konfirmasi anggaran atau penerbitan BAST.

- Aktivasi cabang yang punya jejak kirim/terima/BAST/monitoring **selalu ditolak**.
- Kandidat dibangun ulang dari provider sintetis tepercaya sebelum promosi, sehingga payload cabang yang berbeda atau sumber berubah ditolak.
- Snapshot workspace aktif pada waktu persiapan harus sama dengan snapshot di saat promosi. Seluruh record yang tidak lagi aktif disalin ke arsip sidecar dan snapshot versi historis I2 tetap dipertahankan.
- Untuk kasus yang sudah punya jejak realisasi, `draftFollowupRegister` hanya membuat daftar tindak lanjut manual, tanpa pembalikan stok, transaksi, biaya, pembayaran atau BAST baru.
- Tidak ada eksekusi runtime atau test. Setelah integrasi repository, semua operasi hanya berlaku pada DB DEMO yang kelak diinjeksikan host tepercaya.

Dokumen: `docs/M04_I4_ACTIVATION_AND_FOLLOWUP.md`.
