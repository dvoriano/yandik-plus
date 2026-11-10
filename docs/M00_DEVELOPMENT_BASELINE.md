# M00 | Fondasi Kode dan Pengujian Offline

**Tanggal:** 10 November 2026  
**Status:** komponen foundation dibuat dalam GitHub, **belum** digabung ke kode Flask lama atau di-deploy.

## Apa yang diimplementasikan
1. \`foundation/yandik_base/contracts.py\`: kontrak Puskeswan, pelaporan APEL bulanan per Puskeswan, dan usulan kebutuhan Support.
2. \`foundation/fixtures/\`: tiga Puskeswan **fiktif**, tiga laporan fiktif, dua kebutuhan bantuan fiktif.
3. \`foundation/tests/\`: pengujian data negatif, relasi ID, pelaporan ganda, nilai nol dan belum melapor.
4. \`foundation/validate_fixtures.py\`: validator data contoh standar-library, tanpa DB/VPS.
5. \`.github/workflows/m00-offline-checks.yml\`: pengujian otomatis pada push/PR, read-only, tanpa secrets.
6. \`.env.example\`: nama variabel contoh tanpa nilai kredensial.

## Keputusan arsitektur
- Gunakan namespace \`foundation/\` **terpisah dari \`app.py\` lama** sampai ada audit kesesuaian skema.
- Tidak menebak total pelayanan berdasarkan menjumlah semua kategori; perlu juknis APEL.
- Laporan berangka nol **berbeda** dari belum melapor.
- Semua kebutuhan dukungan harus merujuk master ID Puskeswan.
- Pengujian mandiri tidak menggantikan tes login, API, keamanan, atau regresi APEL asli.

## Verifikasi aktual
- [GitHub Actions run #42837742904](https://github.com/dvoriano/yandik-plus/actions/runs/42837742904) = **SUCCESS**.
- Job `offline-contracts` selesai; langkah `Test synthetic data contracts` dan `Validate linked synthetic fixtures` lulus.
- Terdapat 10 tes kontrak standar Python. **Belum** ada tes runtime/keamanan Flask legacy.
- [Commit sumber 2081606](https://github.com/dvoriano/yandik-plus/commit/2081606d0cd4109eb5f45415688ff4a663937fb6).

## Pekerjaan yang tetap terbuka
- **M00-D:** source Flask 171 file masih berasal dari arsip percakapan, **belum di GitHub**.
- Pemetaan konfigurasi dan dependensi Flask lama.
- Pengujian runtime dan regresi APEL pada source asli.
- Pemeriksaan keamanan API, password, akses upload, CSRF.
- Persetujuan implementasi modul dan deployment mendatang.

## Ketentuan operasional
Pengembangan hanya melalui GitHub. **Jangan meminta pengguna menjalankan skrip di laptop atau VPS**. Tidak ada deployment atau akses database produksi.
