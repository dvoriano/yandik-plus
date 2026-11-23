# M00 P0 | Gerbang Penerimaan Source Flask Legacy untuk YANDIK+ 2026–2030

**23 November 2026 | CHECKLIST PERENCANAAN, BUKAN HASIL SCAN SOURCE.** Repository publik tidak boleh menerima secrets atau data kedinasan/masyarakat riil.

## Saat source bisa diberikan secara sah
| Pemeriksaan masuk | Bukti yang diperlukan | Tindakan bila belum terpenuhi |
|---|---|---|
| Kewenangan sumber | Konfirmasi penanggung jawab instansi dan hak penggunaan source untuk pengembangan | JANGAN impor |
| Ruang lingkup | Daftar file/modul dan tujuan pemrosesan disepakati | JANGAN impor |
| Data/PII | Tidak ada database, log, data petugas, nomor kontak, lokasi kasus nyata, unggahan atau dokumen pribadi | JANGAN impor |
| Rahasia | Tidak ada \`.env*\`, token, API key, secret Flask, credential, password bawaan, file backup atau SSH key | JANGAN impor |
| Aset eksternal | Dependency, lisensi, dataset rujukan dan batas interoperabilitas diketahui | Tahan integrasi |
| Sisi aplikasi | Inventory Flask blueprints, route, session, autentikasi, akses per role/wilayah dan error handling diperiksa | Tidak boleh deploy |
| Migrasi | Database/backup, source version, rollback, audit dan idempotency dinilai | Tidak boleh mutasi |
| Bukti review | PR terpisah, hasil scan/tes dengan data fiktif, review pemilik proses dan keputusan keamanan tertulis | Tetap Draft |

## Ketentuan integrasi nanti
1. Bawa hanya **source yang telah diizinkan dan disanitasi**; jangan menyalin file produksi secara otomatis.
2. Audit baseline read-only sebelum adaptasi dan buat daftar route/manajemen session; jangan membuat bypass credential atau route admin.
3. Jadikan M00-G6 hanya contoh factory Blueprint, **jangan otomatis mendaftarkan** endpoint yang flag-nya dapat diaktifkan tanpa auth sungguhan.
4. Buat otorisasi server per-request/per-objek/per-wilayah, CSRF untuk mutasi berbasis cookie, rate limiting dan allowlist response.
5. Pastikan M00-G8 tidak dipercaya sebagai verifikasi audit atau migrator. M00-G7 hanya SQLite in-memory untuk pengujian kelak.
6. Jangan merge ke \`main\`, jalankan workflow, test runner, migrasi DB atau ubah produksi sampai owner mencabut mode CODE_ONLY secara eksplisit.

**Status saat dicatat:** source Flask legacy belum ada sebagai salinan sanitisasi berizin dalam repo pengembangan. Tidak ada audit source riil atau izin integrasi yang dibuktikan. Teruskan P0 tanpa menghubungi VPS produksi atau membuka data pribadi.

## Lanjutan M00-G9 | Pratinjau deklarasi metadata
[Preflight metadata file/rute DEMO](M00_G9_FLASK_INTAKE_METADATA_DEMO_2026_2030.md) telah ditulis dengan **41 QA tertulis, 0 dijalankan**. Ia tidak membuka source maupun memindai rahasia; hasil tidak pernah mengizinkan impor. Checklist penerimaan di atas tetap harus dipenuhi dengan bukti independen saat sumber berizin tersedia.
