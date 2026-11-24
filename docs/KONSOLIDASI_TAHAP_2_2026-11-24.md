# Konsolidasi tahap 2 | 24 November 2026

**KODE DITULIS, BELUM DIUJI.** Dasar pembacaan sumber portal dan dokumen modul pada `131316a30ca34bec3b36a280d34b73ad53cc70b7`. Audit ini terbatas pada jalur portal utama dan kontrak sumber terkait, bukan audit seluruh baris dari ratusan file, bukan hasil eksekusi tes. Semua 15 MOD memiliki kode awal atau fondasi; tidak ada klaim siap produksi.

| Modul | Jalur utama / model | Sumber/cakupan | Gap operasional utama |
|---|---|---|---|
| 00 | Core, portal-navigation, leadership-bridge | G1–G9 dan state halaman | Source Flask sah, auth/RBAC API, audit server |
| 01 | profil-sdm, inventory-model | ID M05, snapshot tahunan | Form resmi lengkap, katalog ditelaah, bukti/persistensi |
| 02 | layanan/koreksi, shared-demo, M05-0/1/14/16 | Ledger dan workflow independen | Rekonsiliasi, aturan skor, histori resmi |
| 03 | personnel-model/editor | ID M05, interval SDM | Impor, master tenaga, validasi kompetensi |
| 04 | dukungan, M04-I1 | Master 001/002/003 independen | Crosswalk sah, realisasi/BAST dan kewenangan |
| 05 | pengawasan, domain-views M06-S1 | Register wilayah snapshot | Edit inspeksi dan tindak lanjut sah |
| 06 | pengawasan, M07-S1 | Register wilayah snapshot | Izin, pengawasan, workflow resmi |
| 07 | pengawasan, M13-S1 | Utara tersedia, Selatan belum | iSIKHNAS, rekonsiliasi, privasi dan otorisasi |
| 08 | pengawasan, M14-S1 | Permohonan snapshot | Penerbitan oleh pihak berwenang, tanda tangan |
| 09 | kegiatan, coaching-model | State sesi ID M05 | Peserta individu dan histori SDM, dokumen/bukti |
| 10 | administrasi, paperless-model | Snapshot sumber kegiatan, versi | Template jenis khusus, ekspor DOCX/PDF dan arsip sah |
| 11 | pimpinan, leadership-model | Proyeksi baca-saja, unit terpisah | Sumber resmi, definisi KPI disepakati, ekspor |
| 12 | wilayah, gis-model | Kisi Cartesian sintetis | GPS resmi, basemap, kebijakan presisi/publikasi |
| 13 | pustaka, library-model | Referensi repo dan kandidat | Naskah resmi, validitas, pengelola/persistensi |
| 14 | notifikasi/mode-lapangan | Pengingat sesi dan mock server | PWA, cache aman, antrean durable, kanal diizinkan |

## Perubahan tahap 2
- 12 menu kelompok mencakup 14 MOD pengguna; MOD-00 fondasi, bukan halaman login palsu. Panel tetap mounted saat hash berubah, sehingga state halaman tidak dibuang. Tidak menghapus prototipe terdahulu; menu utama APEL, Support, Pustaka diarahkan ke review.html. Tautan teknis keluar dari halaman dalam tab baru. Pustaka ditanam dalam halaman; FAQ dan usulan tidak memiliki sesi terpisah saat dibuka dari portal. Standalone tetap demo independen.
- Konfirmasi saat pindah cakupan dengan draf laporan belum tersimpan, dan sebelum reset inti. Reset pembinaan/dokumen menjaga nomor urut sesi agar notifikasi tidak salah menganggap ID yang dipakai kembali sudah dibaca. Notifikasi dokumen membedakan sumber stale/current. Tidak menjamin semua form dinamis menyimpan isian belum disubmit saat filter atau render ulang; perlu QA dan desain draft durable.
- K1/K2/K3/K5/K6 sebagian konsolidasi UI; K4 dan K7 tetap tertunda. Sumber berbeda tidak digabung berdasarkan kemiripan nama. Filter bukan otorisasi.

## Urutan berikutnya
1. Audit kontrak backend/data: daftar endpoint, role/aksi/wilayah per objek, skema master, migrasi, audit dan bukti; gunakan hanya kontrak DEMO atau source yang disanitasi/diizinkan. Belum adaptasi Flask produksi.
2. Siapkan matriks QA Codex dari jalur kritis dan dependency; jangan menjalankan sampai owner memberi izin. Pertahankan bukti lama sebagai historis.
3. Setelah izin dan hasil QA, putuskan perbaikan/merge/rilis secara terpisah. Jangan gabungkan M04 dan M05 tanpa crosswalk sah, jangan mengimpor data sensitif ke repo publik.

## 2026-11-24 | K4: Kontrak integrasi backend/data DEMO
- [Kontrak](K4_KONTRAK_BACKEND_DATA_2026_2030.md): katalog 15 resource, usulan jalur API, DDL 16 tabel inti, evaluator Python baca/aksi kandidat berwilayah dengan deny default dan konversi interval akhir inklusif → eksklusif. 22 QA unit ditulis, 0 dijalankan. Tidak ada HTTP, DB, migrasi, login, writer atau izin operasi; melengkapi kontrak M00-G1–G9/M01-S2/M04-I2–I5 tanpa menggantinya. Source Flask berizin, typed domain schema, role server, rekonsiliasi dan QA tetap tertunda. CODE_ONLY [skip ci]. Berikutnya matriks QA Codex dan urutan integrasi, tanpa menjalankan tes.


## 2026-11-24 | K7: Master QA YANDIK+ 2026–2030
- [Master QA](MASTER_QA_YANDIK_2026_2030.md) dan [matriks JSON](../drafts/yandik-qa/qa-plan.json): inventaris prioritas 11 file unit (178 portal + 22 backend = 200 kasus dirancang), 36 skenario manual/integrasi/gerbang (29 preview, 1 DDL rehearsal, 6 blocked backend/rilis), seluruh 15 MOD. Semua NOT_RUN/BLOCKED, 0 dijalankan; bukan inventaris seluruh repo atau pengganti TEST_BACKLOG. Gate izin terpisah preview/unit/DDL/backend/rilis, bukti per SHA dan stop rules P0. CODE_ONLY [skip ci]. Berikutnya izin eksplisit owner untuk preview Codex atau lanjut review kode tanpa eksekusi; K4/K7 tetap tertunda.

