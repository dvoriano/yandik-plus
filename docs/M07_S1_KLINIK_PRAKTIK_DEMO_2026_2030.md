# M07-S1 | Pengawasan Klinik & Praktik Dokter Hewan DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | BUKAN PERIZINAN RESMI.**

## Kode tersimpan
- [Model register dan paket telaah](../drafts/m07-practice-oversight/practice.mjs): kumpulan sarana dan riwayat observasi baca-saja, tidak membuat izin, penetapan pengawas, temuan resmi atau sanksi.
- [Fixture fiktif](../drafts/m07-practice-oversight/fixtures.mjs): tiga sarana di dua wilayah DEMO, dua kunjungan contoh; seluruh label, periode, ID dan asal data fiktif.
- [22 skenario QA tertulis](../drafts/m07-practice-oversight/tests/practice.test.mjs), **0 dijalankan**.
- Pemeriksaan hak akses menggunakan [M00-G1](M00_G1_SCOPED_OVERSIGHT_READ.md) untuk role/wilayah DEMO. Ini **bukan** autentikasi server nyata.

## Batasan fungsional
| Fitur | Perilaku kode DEMO | Belum/di luar wewenang |
|---|---|---|
| Register klinik/praktik mandiri | ID dan label sarana fiktif, wilayah, jenis sarana, referensi sumber DEMO | Keabsahan kategori sarana dan sumber nyata |
| Dokumen praktik | Selalu `NOT_VERIFIED_DEMO` | Penerbitan dan pembuktian izin/SIP |
| Checklist | 5 kategori rancangan, `OBSERVED_DEMO` / `REVIEW_REQUIRED_DEMO` / `NOT_ASSESSED_DEMO` | Standar hukum dan inspeksi resmi |
| Bukti | Hanya jumlah rujukan fiktif | Isi foto dan dokumen privat |
| Pengawasan | Histori kunjungan sintetik terpisah per sarana/bulan | Jadwal riil, petugas, kewenangan inspeksi |
| Tindak lanjut | Paket `DRAFT_DISCUSSION_ONLY`, tanpa penerima tugas/tenggat | Surat resmi, rekomendasi, verifikasi perbaikan, sanksi |

**Catatan penting:** `OBSERVED_DEMO` tidak berarti patuh; tidak ada kunjungan dalam fixture tidak berarti fasilitas belum pernah diperiksa. Pembatasan satu kunjungan per bulan hanya simplifikasi fixture, bukan aturan tugas pengawasan.

## Kriteria untuk dilanjutkan ke implementasi
1. Pemilik proses menyetujui daftar jenis sarana, struktur data minimal, pemetaan dokumen legalitas, checklist versi yang berlaku, otoritas pengawasan dan perlindungan informasi tenaga.
2. Identitas dan role/wilayah harus diperiksa di API server; tidak boleh ditentukan pengguna melalui field browser, body, query atau header.
3. Perlu audit sumber data, histori, retensi berkas, akses bukti, pemisahan penulis dan penelaah, serta persetujuan tata kelola.
4. Laksanakan 22 QA + pemeriksaan keamanan/peran, lalu pengujian integrasi dan HP **hanya setelah izin owner**.

**Status:** M07-S1 baru tahap **CODE_WRITTEN_NOT_TESTED**. Seluruh MOD-06 masih **BELUM SELESAI**.
