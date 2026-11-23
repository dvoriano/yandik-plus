# M00-G2 | Kontrak Provenance Sumber dan Batas Akses API DEMO 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | NONPRODUKSI.**

## Kode yang ditulis
- [Pemeriksaan manifest dan kontrak baca](../drafts/m00-source-api-gate/source_access.mjs) membatasi sumber pada fixture lokal sintetis, ID sumber/snapshot berawalan DEMO, versi positif, periode 2026–2030, jenis domain dan wilayah.
- [24 skenario QA tertulis](../drafts/m00-source-api-gate/tests/source_access.test.mjs), **0 dijalankan**.
- [M00-G1](M00_G1_SCOPED_OVERSIGHT_READ.md) diperluas agar mengenali kategori SURVEILLANCE DEMO untuk role provinsi dan kab/kota sesuai wilayah. Peran Puskeswan dan pimpinan tidak diberi akses rincian pada prototipe ini.

## Batas kepercayaan
| Lapisan | Ketentuan demonstrasi | Belum terbukti |
|---|---|---|
| Sesi | Callback resolveServerSession() hanya dari host server tepercaya | Autentikasi sungguhan, revokasi, CSRF |
| Scope | Kombinasi domain dan wilayah harus cocok | Kebijakan kewenangan resmi |
| Identitas sumber | source_id dan snapshot_id DEMO, domain dan periode eksplisit | Asal eksternal, tanda tangan, integritas dataset |
| Provenance | source_verified=false, official_authorization=false | Izin akses iSIKHNAS atau data pemerintah |
| Kesegaran | capture_month untuk fixture saja | Waktu server dan freshness nyata |
| Akses API | Fungsi murni pembangun konteks, baca-saja | Tidak ada endpoint HTTP/API atau isolasi tenant |
| Keluaran | Tidak memberikan izin impor, tulis, terbit, publikasi | Belum ada audit server / proteksi PII |

**Jangan menjadikan keberhasilan validasi format manifest sebagai pembuktian bahwa sumber benar.** Fixture dapat dibuat sendiri; kode tidak memiliki kepercayaan kriptografis, kontrol perubahan database, atau otorisasi integrasi. Domain harus memvalidasi data setiap record sebelum ditampilkan.

## Gerbang P0 yang masih terbuka
1. Audit dan sanitasi source Flask legacy yang diizinkan, tanpa rahasia/personalia.
2. Tetapkan ID wilayah/Puskeswan dan data dictionary asli dengan klasifikasi data.
3. Identitas API tepercaya, RBAC + scope objek, rate limit, CSRF, audit request dan filtrasi keluaran.
4. Perjanjian sumber, kewenangan integrasi, mekanisme koreksi, snapshot, rekonsiliasi antar modul.
5. 24 QA M00-G2, 19 QA M00-G1, serta uji negatif API dan tenancy sesudah owner mengizinkan pengujian.

**Status:** CODE_WRITTEN_NOT_TESTED, SOURCE_NOT_VERIFIED, API_NOT_IMPLEMENTED, PRODUCTION_NO_GO.
