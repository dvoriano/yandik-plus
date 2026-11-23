# M14-S1 | Register Sertifikat Veteriner dan Lalu Lintas, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.**
Tidak menerbitkan, menandatangani, memvalidasi, atau mengajukan sertifikat resmi.

## Kode tersimpan
- [Model permohonan internal](../drafts/m14-certificate-register/register.mjs): hanya daftar permohonan DEMO dan status pemeriksaan awal.
- [Fixture sepenuhnya sintetis](../drafts/m14-certificate-register/fixtures.mjs): tiga permohonan rekaan, tipe komoditas DEMO, wilayah asal/tujuan fiktif, tanpa nama pemohon, alamat atau nomor surat asli.
- [25 skenario QA tertulis](../drafts/m14-certificate-register/tests/register.test.mjs), **0 dijalankan**.
- Scope baca oleh [M00-G1](M00_G1_SCOPED_OVERSIGHT_READ.md) selalu berdasarkan **wilayah asal**; tujuan lain tidak memperluas hak akses.

## Kontrak dan batas kewenangan
| Elemen | Nilai/aturan pada DEMO | Bukan |
|---|---|---|
| `request_id` | `DEMO-CERT-REQ-*`, ID permohonan rekaan | Nomor sertifikat resmi |
| Status internal | Draf/menunggu telaah/perlu klarifikasi DEMO | Disetujui atau diterbitkan |
| Komoditas | Hewan hidup atau produk hewan DEMO | Klasifikasi resmi semua jenis lalu lintas |
| Review | Empat kategori informasi awal (asal, komoditas, tujuan, dokumen pendukung) | Persyaratan teknis/hukum yang disahkan |
| Dokumen | Status `PRESENT_UNVERIFIED_DEMO` berarti informasi contoh dicatat | Keabsahan berkas pendukung |
| `official_reference` | Selalu `null` | Sertifikat bernomor |
| `official_issued_at` | Selalu `null` | Penerbitan dari otoritas sebenarnya |
| Verifikasi publik/QR/tanda tangan | Tidak disediakan | Verifikasi resmi, QR, e-signature |
| Tindakan | Semua `may_issue`, `may_sign`, `may_submit_officially`, `may_approve`, `may_publish` = `false` | Persetujuan otoritas atau akses publik |

Hasil `buildDemoCertificateReview` hanya menampilkan daftar status review, tanpa dokumen, identitas pemohon, kode verifikasi atau rujukan resmi. Klaim siap diterbitkan **dilarang** berdasarkan total kelengkapan.

## Gerbang integrasi yang masih terbuka
1. Tetapkan matriks kewenangan aktual, jenis sertifikat, asal/tujuan/komoditas dan perubahan regulasi.
2. Validasi formulir dan lampiran resmi, akses pribadi, tanda tangan, arsip dan mekanisme penerbitan oleh instansi yang sah.
3. Pencatatan referensi sertifikat yang terbit **hanya** lewat otorisasi dan verifikasi ke sistem/sumber resmi. Saat ini dilarang untuk DEMO.
4. Uji 25 QA, otorisasi server, pembatasan wilayah, integrasi, privacy, dan audit perubahan setelah izin pemilik proyek.

**Status:** M14-S1 **CODE_WRITTEN_NOT_TESTED**. Seluruh MOD-08 belum selesai; tidak ada sertifikat yang dikeluarkan YANDIK+.
