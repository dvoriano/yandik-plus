# M14-S1 | Register Permohonan Sertifikat Veteriner & Lalu Lintas DEMO

**KODE DITULIS, BELUM DIUJI.** Bukan penerbitan, pengesahan atau validasi sertifikat resmi.

\`register.mjs\` membuat daftar contoh permohonan hewan/produk hewan, hanya dengan ID DEMO, wilayah asal/tujuan fiktif, jenis komoditas, bulan dan status telaah internal. Tidak ada nama pemohon, identitas petugas, tanda tangan, kode QR, nomor dokumen resmi, atau berkas kedinasan.

- Scope baca berdasarkan **wilayah asal** permohonan, bukan wilayah tujuan. Peran DEMO kab/kota lain tidak bisa mengakses rincian.
- Field review awal (asal, komoditas, tujuan, dokumen pendukung) adalah **kategori rancangan yang belum menjadi persyaratan legal**.
- \`PRESENT_UNVERIFIED_DEMO\` bukan dokumen benar; \`INTERNAL_REVIEW_PENDING_DEMO\` bukan permohonan sudah diajukan ke instansi resmi.
- Kolom nomor sertifikat resmi dan waktu penerbitan selalu \`null\`. Tidak ada jalan memasukkan nomor/izin secara diam-diam pada model DEMO.
- Tidak menyediakan pembuatan PDF sertifikat, penomoran, penandatanganan, QR, pencarian keabsahan publik, API, pengiriman, verifikasi resmi atau penghubung ke sistem penerbit.
- \`tests/register.test.mjs\`: **25 QA tertulis, 0 dijalankan**.

Implementasi nyata membutuhkan identifikasi jenis sertifikat dan kewenangan menurut regulasi yang berlaku, verifikasi persyaratan oleh pemilik proses, keamanan data pemohon dan integrasi sah ke mekanisme penerbitan eksternal. Tidak ada klaim siap operasional.

[Spesifikasi M14-S1](../../docs/M14_S1_REGISTER_SERTIFIKAT_LALU_LINTAS_DEMO_2026_2030.md) · [Backlog QA](../../docs/TEST_BACKLOG.md).
