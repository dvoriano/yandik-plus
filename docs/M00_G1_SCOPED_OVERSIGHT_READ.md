# M00-G1 | Kontrak Hak Akses Lintas Modul Pengawasan (Baca-Saja DEMO)

**23 November 2026 | KODE DITULIS, BELUM DIUJI.** Ini bukan sistem login atau otorisasi produksi.

## Bukti kode
- [Gerbang read-only per modul dan wilayah](../drafts/m00-oversight-access/scoped_read.mjs) dibangun di atas prototype \`M04-I6B\` yang memerlukan callback \`resolveServerSession()\` dari backend tepercaya.
- [19 skenario QA tertulis](../drafts/m00-oversight-access/tests/scoped_read.test.mjs), **0 dijalankan**.
- Kategori kontrak DEMO: MEDICINE_OVERSIGHT, PRACTICE_OVERSIGHT, CERTIFICATE_REGISTER, dan **SURVEILLANCE** (ditambahkan M00-G2). Semua hanya kontrol contoh; tidak ada koneksi layanan sebenarnya.
- Untuk data surveilans, metadata sumber diwajibkan melalui [M00-G2](M00_G2_SOURCE_API_BOUNDARY_2026_2030.md).

## Batas akses untuk rancangan, bukan kebijakan yang sudah disahkan

| Peran DEMO | Detail sarana pengawasan | Keterangan |
|---|---|---|
| Admin provinsi | Ya, baca-saja | Tidak dapat memberi izin atau menerbitkan dokumen |
| Verifikator provinsi | Ya, baca-saja | Tidak ada approval |
| Kab/kota sesuai wilayah | Ya, baca-saja | Tolak lintas wilayah |
| Petugas Puskeswan | Tidak | Data profil dan laporan APEL memakai kontrak lain |
| Pimpinan | Tidak | Dashboard agregat kelak membutuhkan agregator terpisah |
| Pengguna publik/tanpa sesi | Tidak | Bukan direktori publik |

Bacaan koleksi dengan campuran wilayah, entri non-DEMO, scope tidak diketahui, sesi nonaktif, dan nama modul tak dikenal ditolak. Output tidak memuat identitas pengguna dan flag tindakan tetap \`false\`.

**Peringatan desain keamanan:** jika suatu aplikasi di masa depan menerima callback sesi dari browser, pemeriksaan ini dapat dilewati. Kode belum membuktikan keaslian session resolver, kecukupan otorisasi pada setiap API, ataupun proteksi CSRF. Sebelum dipakai perlu review sumber Flask, RBAC/ABAC nyata, pengujian negatif wilayah, audit autentikasi dan pengesahan kelembagaan.

**Status gerbang:** \`CODE_WRITTEN_NOT_TESTED\`, \`PRODUCTION_NO_GO\`.
