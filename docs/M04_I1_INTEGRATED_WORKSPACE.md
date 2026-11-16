# M04-I1 | Ruang Kerja Terpadu Puskeswan (DEMO)

**16 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Integrasi fungsi pada simulasi di GitHub, bukan integrasi produksi. I1 adalah penamaan submilestone penyatuan M04 yang diusulkan untuk membedakannya dari tahapan S10–S15.

## Tujuan
Mengurangi pengisian berulang dan membangun jalur identitas yang sama pada master Puskeswan, profil, SDM, APEL, kebutuhan berbasis masalah, paket, distribusi, penerimaan, serah terima dan monitoring.

## Sumber dan kontrak
| Sumber yang dipakai | Cara digunakan |
|---|---|
| Master foundation | Tiga identitas/nama/wilayah fiktif dicerminkan dalam fixture JS, dengan crosswalk eksplisit ke alias Support baru |
| M02 Profil | Fungsi startDemo/allSections dan masalah; profil A dipakai pada A saja, profil B kosong, C tidak tersedia |
| SDM dan APEL | Fungsi readSdmSnapshot/readApelSnapshot M02, baca-saja |
| M03 | Fungsi saveProblem, reviewProblem, createOrEditNeed, verifyNeed; adapter memanggil validateProblems, validateNeeds, validatePriorityAssessments |
| M04-S10–S15 | Model paket, telaah, jadwal, realisasi, rujukan dan pemanfaatan; input berasal dari adapter M03 pada skenario baru |

Master DEMO-PSW-001–003 dipetakan secara eksplisit ke DEMO-PUSK-BRIDGE-001–003. **Crosswalk ini sengaja dibuat untuk fixture baru**, bukan menyatakan fasilitas independen fixture S10–S15 lama identik dengan master. Tidak mencari padanan dari nama, nomor urut daftar atau tebakan wilayah. ID kebutuhan numerik lokal dinamespace dengan ID fasilitas (misalnya DEMO-NEED-001-N1); versi dan isi masalah, kebutuhan dan prioritas terikat ke paket. Perubahan isi pada versi sama memblokir model; pengikatan bukan tanda tangan atau audit server.

Kebutuhan yang belum terverifikasi, sumber masalah usang/tidak aktif, metadata pemeriksaan tidak cocok, satuan tanpa padanan atau prioritas ditinjau yang usang dikeluarkan dengan alasan, bukan otomatis diperbaiki atau disetujui. Prioritas belum dinilai tetap belum dinilai; tidak ada ranking atau alokasi otomatis. Kontrak mendukung unit/set/paket/buah S10; satuan lain memerlukan katalog dan padanan yang ditelaah.

APEL dan SDM menggunakan snapshot JS M02 sebagai sumber **khusus DEMO ini**. Hal ini dipilih untuk menghindari data ganda pada antarmuka. Fixture JSON foundation berbeda, termasuk cakupan November; tidak digabungkan atau dianggap telah direkonsiliasi. Nol laporan yang tercatat dibedakan dari ketidaktersediaan data. Jumlah layanan adalah penjumlahan kategori contoh, bukan skor, jumlah hewan unik atau hasil resmi APEL. Agregat hanya mencakup periode dan cakupan tampilan.

## Workspace
- [Adapter dan model workspace](https://github.com/dvoriano/yandik-plus/commit/199d993a4edc04668f91376eb84fbffb0e3cdf37); [UI, perbaikan proyeksi profil dan 14 skenario tertulis](https://github.com/dvoriano/yandik-plus/commit/092ce9e94ed11bc1bf7962b1f1f41b6a7c104e8d).
- Satu pilihan Puskeswan dan periode APEL; daftar profil/SDM/APEL, kebutuhan, paket, jadwal, pengiriman/penerimaan DEMO, rujukan dan monitoring dengan sumber yang sama.
- Petugas hanya cakupan fasilitas contoh; kab/kota hanya wilayah; pimpinan agregat tanpa detail; admin provinsi dapat melihat fasilitas DEMO dan mengaktifkan langkah simulasi. Ini proyeksi client, **bukan RBAC atau autentikasi server**. Semua fixture tersedia di browser; tidak boleh menggunakan data riil.
- Tujuh kontrol simulasi memanggil fungsi S10–S15 secara berurutan dalam state memori yang sama. Skenario terbatas pada kebutuhan pertama yang eligible, satu paket dan satu jadwal per fasilitas, jumlah penuh, dua peran telaah fiktif dan tanggal contoh; bukan editor umum seluruh alur atau pengganti SOP. Tidak mengambil perubahan dari tab UI prototipe lama.
- UI menampilkan sumber profile/status, laporan APEL dan SDM hanya baca. Tidak menulis APEL, tidak membuktikan ketepatan laporan, tidak mengubah profil atau histori resmi.

## Batas dan QA
14 deklarasi Node ditulis, **0 dijalankan**. Tidak ada tes browser, CI, main, deployment atau produksi; seluruh catatan memori hilang saat reload/reset. GitHub public, PR #9 draft. Belum tersedia rekonsiliasi draf usang, API/DB, autentikasi dan akses wilayah server, audit, adapter Flask/APEL nyata dan data riil. Sumber versi serta dokumen dan persetujuan resmi tetap harus ditelaah.

## Rencana lanjutan
M04-I2: rancangan kontrak repository data, otorisasi di sisi server, transaksi atomik/versi dan audit perubahan; tentukan rekonsiliasi data sumber serta koreksi objek berantai. Jangan mengklaim integrasi operasional atau menjalankan QA tanpa izin eksplisit owner. M05 (APEL 2.0) tetap mengikuti roadmap, tidak diimplementasikan oleh I1.
