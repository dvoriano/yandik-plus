# M04-I6A | Kontrak Preflight Migrasi Satu Arah (DEMO)

**19 November 2026 (WIB) | KODE DITULIS, BELUM DIUJI.** Fase pertama dari usulan M04-I6, bukan migrasi atau izin menjalankan migrasi.

## Tujuan
Menyiapkan pemeriksaan **sebelum** pemindahan data dari proyeksi M04-I4 ke struktur per Puskeswan M04-I5. Semua menggunakan sumber fiktif dan belum ada database sumber maupun target yang dijalankan.

## Kontrak rancangan
1. **Sumber:** snapshot I4 yang memenuhi kontrak `partitionI4Snapshot` dan nomor revisi workspace yang disebut eksplisit. Validasi turunan tetap menggunakan M04-I5.
2. **Tujuan:** inventaris target I5 **kosong seluruhnya**, termasuk tabel current, versions, events dan commands. Jika satu baris ada, preflight berhenti. Tidak mengizinkan upsert, replace, merge parsial atau skip fasilitas.
3. **Rencana:** satu manifest berisi ID Puskeswan DEMO, revisi awal 0 per fasilitas, hitungan arsip dan retired ID, hash per partisi, hash sumber serta hash manifest. Tidak berisi isi data operasional.
4. **Pemeriksaan ulang:** manifest dihitung ulang terhadap sumber/inventaris acuan. Perbedaan menyebabkan penolakan; hasil cocok tetap `may_write=false`, `official_authorization=false`, `source_verified=false`.
5. **Batas:** SHA-256 pada manifest hanya menyamakan isi antar-pembacaan lokal. Tidak membuktikan provenance, keaslian, integritas database di luar pembacaan, atau otorisasi. Perubahan target setelah inventory dibaca belum diamankan oleh transaksi.

## Gerbang sebelum migrasi nyata
| Gerbang | Syarat dan bukti yang diperlukan | Status |
|---|---|---|
| G0 | Izin eksplisit owner untuk mulai pengujian; CODE_ONLY dicabut sesuai lingkup | MENUNGGU |
| G1 | Identitas backend tepercaya, RBAC per wilayah, prosedur multi-aktor dan review audit | RENCANA |
| G2 | Bukti source snapshot konsisten, inventaris/versi target dari koneksi server, retensi data | RENCANA |
| G3 | Rencana transaksi all-or-nothing, locking/freeze, idempotensi, journal dan pemulihan | RENCANA |
| G4 | Uji backup/restore, perubahan data di tengah migrasi, kegagalan listrik, audit lintas fasilitas | BELUM DIUJI |
| G5 | Keputusan kelembagaan SPBE, kebijakan, akses data/arsip dan jadwal perubahan | BUTUH KEPUTUSAN |

**Jangan menyebut G0–G5 di atas telah dilewati.** Bahkan manifest DEMO yang cocok bukan izin migrasi.

## Batas identitas dan keamanan server
Rancangan berikutnya harus memakai identitas yang diterbitkan/divalidasi oleh server, bukan `role`, `actor_id`, `facility_id` atau daftar wilayah yang dikirim browser sebagai kebenaran. Akses petugas dibatasi satuan kerja/wilayah, penelaah terpisah, pimpinan hanya agregat yang diizinkan. Verifikasi sumber dan inventaris wajib dilakukan server dalam lingkup transaksi dengan audit tahan perubahan. Model M04-I5 yang menggunakan callback sintetis **belum memenuhi** prasyarat ini.

## Pemulihan dan retensi, belum diimplementasikan
Sebelum mutasi nyata, perlukan backup terverifikasi, bukti restore, inventaris seluruh sumber dan arsip, journal cutover, prosedur rollback sebelum aktivasi, kebijakan retensi menurut pengampu data, serta pembatasan ekspor historis. Migrasi lintas fasilitas bersifat all-or-nothing dalam rancangan; SQLite satu penulis secara fisik. Tidak ada logika kompensasi data nyata atau cron recovery pada fase ini.

## Kode dan antrean QA
- [Model preflight](../drafts/m04-migration-preflight/preflight.mjs)
- [13 skenario tertulis, belum dijalankan](../drafts/m04-migration-preflight/tests/preflight.test.mjs)
- [Panduan folder](../drafts/m04-migration-preflight/README.md)
- [TEST_BACKLOG](TEST_BACKLOG.md)

**Langkah berikutnya M04-I6B (usulan):** kontrak identitas server dan pembacaan inventaris tepercaya secara *read-only*, masih terisolasi dan dengan skenario regresi tertulis. Tidak membuat endpoint produksi atau memindahkan data sampai izin owner dan keputusan prosedural ada. M05 APEL 2.0 tetap mengikuti roadmap.
