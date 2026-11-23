# M05-15 | Kontrak Profil Puskeswan + SDM, terhubung APEL DEMO 2026–2030

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | TIDAK ADA DATA NYATA.**

- model.mjs: memvalidasi identitas fasilitas dan wilayah DEMO, profil per tahun, status cakupan SDM per fasilitas-tahun, serta histori penempatan contoh. Validasi mencegah penempatan ganda dalam rentang beririsan.
- fixtures.mjs: tiga Puskeswan rekaan (Alpha/Beta/Gamma), lima catatan profil contoh, lima cakupan SDM, dan lima periode penempatan tanpa nama orang.
- integration.mjs: memadankan ID fiktif yang sama dengan M05-14, menggunakan tahun/wilayah/fasilitas yang sama, dan mengembalikan satu tampilan read-only.
- tests/profile_sdm.test.mjs: **29 skenario QA tertulis, 0 dijalankan**. Hasil belum diketahui.

Semantik data:
- \`NOT_AVAILABLE_DEMO\` berarti sumber tidak ada, bukan nol atau gagal memenuhi kewajiban.
- \`PARTIAL_DEMO\` berarti catatan tenaga belum lengkap, sehingga jumlah tenaga tetap \`null\`.
- \`COMPLETE_DEMO\` berarti snapshot *contoh* menyatakan lengkap, sehingga 0 boleh ditampilkan secara eksplisit. Bukan pernyataan data kepegawaian resmi.
- As-of pada Desember tiap tahun untuk tampilan tahunan, sedangkan riwayat penempatan memakai interval [start_month, end_month) agar tidak terhitung ganda ketika berpindah.
- Data 2026/2027 tidak otomatis disalin ke 2028–2030. Tanpa snapshot tiap tahun, tampil \`null\`.

Tidak ada identitas orang, alamat pribadi, koneksi jaringan, autentikasi, database, permintaan HTTP, penulisan, mutasi atau publikasi. Tautan antar modul hanya validasi pada fixture sintetis. Penggunaan nyata memerlukan pemetaan sumber lama, penetapan peran, historisasi data, migrasi, tes, dan persetujuan yang terpisah.

[Spesifikasi M05-15](../../docs/M05_15_PROFIL_SDM_LINK_2026_2030.md) · [TEST_BACKLOG](../../docs/TEST_BACKLOG.md)
