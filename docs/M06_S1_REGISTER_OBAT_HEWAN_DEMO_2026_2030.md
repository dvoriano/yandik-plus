# M06-S1 | Register Sarana & Observasi Pengawasan Obat Hewan, DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI.** Milestone M06, bagian awal MOD-05.

## Kode yang sudah dibuat
- [Register dan proyeksi observasi](../drafts/m06-medicine-oversight/medicine.mjs), dipisahkan dari database, formulir izin, pembuatan inspeksi atau penerbitan temuan resmi.
- [Data sintetis](../drafts/m06-medicine-oversight/fixtures.mjs): tiga sarana fiktif di dua wilayah fiktif, dua catatan kunjungan sintetis dan tanpa nama pemilik.
- [24 skenario QA tertulis](../drafts/m06-medicine-oversight/tests/medicine.test.mjs), **0 dijalankan**.

## Ruang lingkup register
\`site_id\` memakai \`DEMO-MED-*\`, bukan ID Puskeswan. Setiap fasilitas memiliki wilayah, kategori sarana contoh, sumber \`DEMO-SOURCE-*\`, dan status legalitas \`NOT_VERIFIED_DEMO\`. Perbedaan antara sarana distribusi obat dan inventaris obat Puskeswan tetap dipertahankan.

Checklist DEMO versi \`DEMO-CHECKLIST-UNAPPROVED-1\` mencakup:
1. Catatan dokumen
2. Kondisi penyimpanan
3. Catatan persediaan
4. Penanganan kedaluwarsa

Empat kelompok tersebut adalah **contoh kebutuhan bisnis, bukan pengesahan standar inspeksi yang berlaku**. Jawaban hanya \`NOT_ASSESSED_DEMO\`, \`OBSERVED_DEMO\`, atau \`NEEDS_CLARIFICATION_DEMO\`. Tidak ada angka skor risiko, sanksi, status kepatuhan legal, keabsahan izin, atau kesimpulan pelanggaran.

## Alur perencanaan dan batas aman
1. Admin/verifikator provinsi atau kab/kota dalam wilayah DEMO dapat *membaca* daftar sesuai [M00-G1](M00_G1_SCOPED_OVERSIGHT_READ.md).
2. Bila tidak ada catatan kunjungan di fixture, tampilkan \`latest_visit_month=null\`. **Tidak boleh menyimpulkan tidak pernah diawasi.**
3. Bila observasi belum lengkap/perlu klarifikasi, buat **bahan telaah manusia** berupa draft, tanpa penugasan atau tenggat.
4. Status legalitas tidak pernah berubah menjadi valid otomatis; izin, kewenangan pengawasan, foto/dokumen asli, proses berita acara, tindak lanjut, dan sanksi berada di luar kode.
5. Audit negatif, review standar teknis, tata kelola bukti dan source mapping harus dilakukan sebelum integrasi.

## Belum selesai
- Pengesahan jenis sarana dan standar checklist menurut ketentuan terbaru serta kewenangan instansi.
- Form pengawasan HP, berkas bukti yang aksesnya dibatasi, histori koreksi nyata, pemeriksaan dua peran, rencana inspeksi yang akuntabel, pembuatan naskah resmi, dan audit persisten.
- Pengujian 24 QA baru, autentikasi/otorisasi nyata dan uji lapangan.
- Integrasi dengan data sarana/izin resmi serta izin akses ke sistem tersebut.

**Status:** hanya M06-S1 *ditulis*. MOD-05 secara keseluruhan **belum selesai**. Tidak ada interaksi dengan layanan yang sedang berjalan.
