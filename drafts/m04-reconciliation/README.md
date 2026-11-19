# M04-I3 | Peta dampak dan cabang rekonsiliasi

**KODE DITULIS, BELUM DIUJI.** File `impact.mjs` menelusuri sumber M03 ke paket, telaah, jadwal, pengiriman, penerimaan, rujukan BAST dan monitoring. Sumber diperiksa lewat `inspectSourceCandidate` I2. Perubahan yang berdampak menghasilkan kandidat branch DEMO yang dikeluarkan dari rantai terdampak; **workspace aktif dan histori versi lama tetap utuh**. Paket lintas fasilitas memblokir pembuatan branch.

Repository I2 memiliki perintah sintetis `prepare_reconciliation` dan `review_reconciliation`, keduanya transaksional dan idempotent. Penelaah harus berbeda dari pemohon serta penyusun. Cabang hanya dapat dilihat sebagai laporan dampak yang disaring scope; payload calon workspace tidak dikirim lewat metode baca publik. Pencatatan hasil penelaahan bukan aktivasi data, pengesahan, izin penyaluran atau persetujuan anggaran.

**15 skenario tes Node tertulis, tidak dijalankan.** Tidak ada perubahan database produksi, API, runtime, CI atau akses berkas riil. Rujukan: [Spesifikasi](../../docs/M04_I3_RECONCILIATION.md).
