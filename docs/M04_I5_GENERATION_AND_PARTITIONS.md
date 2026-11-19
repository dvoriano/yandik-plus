# M04-I5 | Identitas Generasi Baru dan Revisi Per Puskeswan

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Seluruh data, peran, arsip, proses dan catatan merupakan DEMO. Tidak ada perangkat, layanan, stok, pengiriman, BAST maupun keputusan kedinasan yang berubah.

## Masalah dan hasil yang dituju
M04-I4 mengarsipkan sumber dan ID paket lama setelah rekonsiliasi tanpa jejak penyaluran. Model I1 masih memakai ID tetap, misalnya `DEMO-PKG-001`, sehingga pembuatan ulang akan berbenturan dengan ID lama. Repository I2 juga memiliki satu nomor revisi global untuk semua fasilitas, sehingga perubahan satu Puskeswan dapat membuat revisi lain kedaluwarsa.

M04-I5 mengusulkan **ID generasi baru**, **pemotongan snapshot secara eksplisit per Puskeswan**, serta **nomor revisi logis dan kunci permintaan per fasilitas**. Semua kode berada pada draf terisolasi, bukan migrasi aplikasi.

## Identitas dan rantai lintas generasi

| Tahap | Bentuk ID generasi kedua (contoh fiktif) | Catatan |
|---|---|---|
| Paket | `DEMO-PKG-001-G0002` | Tidak menggunakan `DEMO-PKG-001` yang sudah terarsip |
| Telaah | `DEMO-TELAAH-001-G0002` | Referensi metadata masih DEMO |
| Jadwal | `DEMO-JADWAL-001-G0002` | Tujuan dan kuantitas dari kebutuhan M03 |
| Kirim / terima | `DEMO-KIRIM-001-G0002`, `DEMO-TERIMA-001-G0002` | Simulasi, bukan realisasi fisik |
| Rujukan / monitoring | `DEMO-SERAH-001-G0002`, `DEMO-MON-001-G0002` | `DEMO-BAST-001-G0002` hanya label fiktif |

Generasi minimal 2 karena alur ini dibuka setelah ada arsip I4. Pembukaan generasi baru memerlukan catatan arsip dan kebutuhan M03 yang kembali eligible. ID lama dan arsip tidak boleh dipakai ulang. Nomor generasi tetap terikat pada fasilitas; representasi ini tidak dirancang untuk menjadi nomor surat atau dokumen resmi.

## Pemisahan data per Puskeswan
`partitionI4Snapshot` memproyeksikan satu snapshot I4 yang dipercaya ke beberapa workspace sintetis yang masing-masing hanya memuat satu master fasilitas, state M03, paket, binding, telaah, jadwal, kirim, terima, serah terima, monitoring, revisi sumber serta arsipnya sendiri. Pemilik setiap objek ditentukan melalui ID kebutuhan/relasi turunan yang sudah terikat. **Rujukan yatim, ID ganda, paket lintas fasilitas, serah terima lintas fasilitas, dan daftar ID arsip yang tidak cocok harus ditolak.**

Projection hanya dapat dilakukan dari input I4 yang lengkap dan tervalidasi; belum ada pembuktian asal/keutuhan snapshot dari database resmi, migrasi berkas, migrasi online, sinkronisasi dua arah, backup atau penanganan perubahan master/wilayah. Arsip historis tetap mengandung data lengkap dan harus mendapat aturan akses serta retensi sebelum diterapkan.

## Kontrak penyimpanan terisolasi

| Tabel draf SQLite | Fungsi |
|---|---|
| `facility_current` | Snapshot aktif dan revisi masing-masing fasilitas |
| `facility_versions` | Riwayat snapshot per `(facility_id,revision)` |
| `facility_events` | Catatan aksi, peran dan hasil per fasilitas |
| `facility_commands` | Idempotensi `(facility_id,request_id)` |

Satu transaksi `BEGIN IMMEDIATE` menggabungkan pemeriksaan revisi, perubahan current, histori, event dan hasil perintah. Revisi dua Puskeswan tidak saling dibandingkan secara logis; permintaan pada Puskeswan A tidak menaikkan versi Puskeswan B. **Seluruh tabel masih berada dalam satu database SQLite yang mengunci penulis secara global; ini bukan sharding, concurrency paralel yang teruji, atau isolasi keamanan database per tenant.** Trigger append-only hanya perlindungan terhadap perubahan SQL biasa, bukan terhadap administrator yang memegang database.

## Revisi berjenjang dan gerbang sumber
1. Pengguna dalam cakupan DEMO meminta revisi (`request_revision`) dengan alasan dan ID permintaan unik.
2. Penelaah kab/kota atau provinsi lain (`review_revision`) mencatat `catat_untuk_sinkron` atau mengembalikan; pemohon tidak boleh menelaah permintaannya sendiri.
3. Admin DEMO menjalankan `sync_verified_source`. Data calon sumber diperoleh dari provider tepercaya di server, **bukan payload klien**. Model M03 dan pemeriksaan versi/histori I2 dipakai ulang.
4. Jika rantai generasi sudah aktif atau sumber baru berkonflik dengan paket, status diblokir untuk rekonsiliasi lanjutan tanpa menimpa paket aktif. Tidak ada otorisasi otomatis.
5. Hanya setelah arsip I4 dan kebutuhan terverifikasi tersedia, `begin_generation` dapat membuka generasi kedua. `advance_generation` memanggil fungsi S10–S15 dalam urutan yang sudah ditetapkan. Skenario satu kebutuhan/paket per fasilitas tetap merupakan batas DEMO, bukan editor serbaguna.

`openFacilityRepository` menerima koneksi SQLite, identity lookup dan provider sintetis dari host terpercaya. Belum ada login, API, Flask, RBAC production, penyelarasan kebijakan kelembagaan, record-level database authorization atau enkripsi/retensi. Pimpinan hanya melihat agregat via proyeksi DEMO.

## Kode, batas dan QA
- [ID generasi dan proyeksi partisi](https://github.com/dvoriano/yandik-plus/commit/686a1bacee541c33f96c0df206105d4cda83484b)
- [Skema SQL per fasilitas](https://github.com/dvoriano/yandik-plus/commit/1fddf3a8481833514e4e86c50045f2393a54757d)
- [Repository revisi/role/sumber DEMO](https://github.com/dvoriano/yandik-plus/commit/05d51c9388c87330991b67a2440a29d884b620e5)
- [Fixture transisi I4→I5, 25 skenario tertulis dan README](https://github.com/dvoriano/yandik-plus/commit/b9e3b506cbb0bb766de37520359da68459db90f0)
- [Direktori sumber M04-I5](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-generation-partition)

**25 deklarasi skenario Node ditulis, 0 dijalankan**: 12 untuk partisi/generasi dan 13 untuk repository/revisi. Seluruh regresi M04-I1–I4, kompatibilitas Node/SQLite, concurrency dua koneksi, restart, rollback, respons kesalahan dan kemurnian akses lintas wilayah tetap **BELUM DIUJI**. Tidak ada pengujian/CI yang dijalankan.

## Keterbatasan dan tahap berikutnya
- Penerbitan ID baru **bukan** penerbitan sertifikat, legalitas barang, keputusan bantuan atau BAST.
- Generasi kedua yang sudah berjalan tidak boleh direset/ditimpa otomatis. Bila sumber berubah lagi, dibutuhkan proses rekonsiliasi berikutnya; belum ada transisi generasi ketiga yang disahkan atau dibuktikan.
- Pemisahan dataset bukan pengganti kontrol akses, enkripsi, audit keamanan, SOP, persetujuan peran, ketersediaan barang atau dokumen legal.
- Struktur I5 ini merupakan rancangan pengganti prospektif I2 pada lingkungan sintetis, bukan migrasi in-place atau jalur siap deploy.

**Usulan I6:** verifikasi kontrak migrasi satu arah, desain akses/identitas server yang dapat diaudit, model transaksi lintas fasilitas bila diperlukan, dokumentasi recovery dan retensi, lalu penilaian kesiapan integrasi Flask/APEL. Seluruh QA dan keputusan penerapan menunggu izin eksplisit G0/pemilik. M05 APEL 2.0 tetap mengikuti roadmap.

GitHub PUBLIC, PR #9 Draft, CODE_ONLY. Jangan memasukkan data asli, kredensial, dokumen sah atau file tersembunyi.
