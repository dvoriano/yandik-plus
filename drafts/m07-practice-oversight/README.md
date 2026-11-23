# M07-S1 | Pengawasan Klinik & Praktik Dokter Hewan DEMO

**KODE DITULIS, BELUM DIUJI | CODE_ONLY | BUKAN SISTEM PERIZINAN.**

\`practice.mjs\` membuat model *read-only* untuk tiga sarana rekaan (klinik dan praktik mandiri) dengan wilayah, jenis sarana, dan sumber sintetis. \`fixtures.mjs\` memuat dua catatan observasi fiktif tanpa nama dokter, nomor izin, alamat, atau nomor pribadi.

Sumber dibatasi melalui \`M00-G1\` di \`drafts/m00-oversight-access/scoped_read.mjs\`; kontrol DEMO tersebut **belum merupakan autentikasi server terpercaya**.

Lima kategori checklist semata **contoh rancangan yang belum disahkan**: administrasi, fasilitas, catatan layanan, kebersihan, tindak lanjut internal. Status \`OBSERVED_DEMO\` bukan bukti patuh. Tidak ada verifikasi izin praktik/SIP, rekomendasi kedinasan, sanksi, atau penandatanganan dokumen.

- Detail hanya untuk peran DEMO provinsi/kab-kota sesuai wilayah, tanpa hak menulis.
- Rincian hanya memuat **status checklist dan jumlah** bukti, bukan berkas bukti atau identitas pemilik.
- Usulan pembahasan tidak memiliki nomor surat, petugas tertugas, atau tenggat.
- Satu record fasilitas per bulan adalah **batas fixture DEMO**, bukan aturan jumlah inspeksi sebenarnya.
- \`tests/practice.test.mjs\`: **22 skenario QA tertulis, 0 dijalankan**.

[Spesifikasi M07-S1](../../docs/M07_S1_KLINIK_PRAKTIK_DEMO_2026_2030.md) · [Antrean QA](../../docs/TEST_BACKLOG.md).
