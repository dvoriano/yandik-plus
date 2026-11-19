# M04-I3 | Rekonsiliasi Data Lintas Modul dan Histori Koreksi

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Seluruh desain dan data bersifat sintetis. Bukan rekonsiliasi data kedinasan, izin perubahan basis data, pengesahan bantuan atau klaim pengujian.

## Permasalahan yang ditangani
Pada M04-I2 sumber M03 yang berubah dan terikat pada paket lama ditolak agar tidak mengacaukan data S10–S15. Blokir tersebut belum menunjukkan **objek apa saja yang terdampak** dan belum menyediakan tempat aman untuk memeriksa calon data pengganti tanpa mengubah workspace aktif.

M04-I3 menambahkan penelusuran relasi sumber hingga kegiatan akhir, serta **cabang prospektif untuk telaah**. Cabang DEMO bukan branch GitHub dan tidak otomatis diaktifkan.

## Rantai relasi
| Sumber atau objek | Penelusuran untuk rencana koreksi |
|---|---|
| Masalah/kebutuhan M03 | ID Puskeswan kanonik, kebutuhan lokal, versi dan isi sumber |
| Paket S10 | Baris paket yang menggunakan ID kebutuhan berubah |
| Telaah S11 | Snapshot paket yang terdampak |
| Jadwal S12 | Paket dan kebutuhan asal |
| Kirim dan terima S13 | Jadwal dan ID pengiriman |
| Rujukan BAST S14 | ID penerimaan yang tercantum |
| Monitoring S15 | ID penerimaan dan rujukan serah terima |

Bandingkan ID dan snapshot sumber secara eksplisit, bukan nama orang/fasilitas atau kecocokan teks bebas. Semua objek yang tergantung pada paket terdampak dicatat pada manifest berisi ID per jenis, jumlah dan penanda apakah sudah ada jejak penyaluran/penerimaan. **Paket lintas fasilitas tidak otomatis dipisah:** cabang dinyatakan tidak tersedia dan perlu pembahasan manual.

## Mekanisme rencana
1. Permintaan koreksi, penelaahan awal dan upaya sinkron berjalan menurut I2, semuanya DEMO. Konflik binding mengembalikan `terblokir_rekonsiliasi` tanpa menimpa sumber.
2. Admin DEMO dapat menjalankan `prepare_reconciliation` pada koreksi yang diblokir. Repository memperoleh calon snapshot langsung dari provider sinkron tepercaya, bukan dari payload klien. Pemeriksaan versi, cakupan dan histori sumber I2 dilakukan ulang.
3. Penyusun membentuk **manifest dampak** dan cabang prospektif. Dalam *cabang* saja objek yang bergantung pada sumber lama dikeluarkan dari rantai aktif kandidat agar kontrak model bisa diperiksa; workspace aktif tetap utuh dan snapshot semua revisi terdahulu tetap berada di tabel histori.
4. Satu penelaah DEMO lain dapat menggunakan `review_reconciliation` untuk **mencatat cabang draf** atau **mengembalikan untuk perbaikan** disertai alasan. Penelaah tidak boleh sama dengan pemohon atau penyusun cabang. Cabang campuran lintas fasilitas tidak dapat dicatat sebagai cabang tersedia.
5. Status `cabang_draf_tercatat` **tetap memblokir kelanjutan aksi dukungan**. Tidak ada perintah aktivasi, merge branch data, penyaluran ulang, penghapusan, tanda tangan, atau verifikasi resmi. Penyelesaian yang mengubah sumber aktif memerlukan desain transisi/otorisasi lanjutan dan QA.

## Mekanisme preservasi
- `workspace_current.workspace` **tidak diubah** oleh persiapan/telaah I3; sumber yang dipakai modul aktif tetap sumber lama.
- `workspace_versions` dan `workspace_events` dari I2 menyimpan keadaan setiap revisi, termasuk historinya. Candidate workspace/manifest disimpan sebagai data **sidecar** dalam payload DEMO pada revisi baru. Ini bukan audit permanen yang tahan manipulasi administrator.
- `reconciliation(actorId,facilityId,correctionId)` menampilkan laporan dampak dan status hanya pada cakupan yang diizinkan, **bukan payload cabang atau snapshot sumber**. Kebijakan peran masih bergantung pada identity lookup tepercaya dan belum dipasang ke HTTP/Flask.
- Semua operasi penulisan tetap berada pada transaksi dan idempotency I2. Kunci permintaan ulang tidak boleh membuat cabang tambahan.
- Kode tidak menangani pembenahan rantai yang sudah memiliki dokumen resmi, penghapusan legal, perpindahan Puskeswan antarwilayah, atau paket lintas fasilitas. Tidak ada migrasi data nyata.

## Bukti perubahan kode
- [Pemeriksaan kandidat sumber I2 dan model manifest/cabang](https://github.com/dvoriano/yandik-plus/commit/661c7bacbf37f97ba8ecdfc87a172698b1655f43).
- [Pencatatan dan penelaahan cabang terisolasi pada repository/policy](https://github.com/dvoriano/yandik-plus/commit/348ce95630cd8af4e47a0c40bff0008f97d0e1b1).
- [15 skenario Node tertulis, BELUM DIJALANKAN](https://github.com/dvoriano/yandik-plus/commit/f5c719e621fae23a8a844583f43488b11082a6cb) meliputi rantai dampak lengkap, sumber usang, paket lintas fasilitas, lintas peran, idempotensi, freeze, rollback, penolakan payload sumber langsung dan preservasi histori.
- [Folder M04-I3](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-reconciliation).

## Hal yang masih terbuka
Skenario QA **tidak dijalankan**. Validitas runtime, transaksi bersamaan, kegagalan parsial dan keamanan masih harus diuji nanti sesuai izin eksplisit G0. Tidak ada aktivasi cabang, rekonsiliasi konflik yang mengubah data aktif, mekanisme pengganti barang yang sudah disalurkan, pengesahan pemeriksa, adapter HTTP/Flask, database operasional, identitas sesungguhnya, pemulihan cadangan, migrasi atau penerapan SPBE. Keputusan mengenai workflow resmi, pemisahan kewenangan, retensi dan audit wajib dibahas dengan pengampu.

**Langkah lanjutan yang diusulkan M04-I4:** desain proses aktivasi yang aman dengan persetujuan manusia sesuai kewenangan, konsistensi historis dan ledger kompensasi untuk objek turunannya, serta batas eksplisit terhadap catatan yang telah menjadi dokumen resmi. Jangan otomatis mempromosikan cabang DEMO. M05 (APEL 2.0) tetap mengikuti roadmap.

Repository GitHub masih PUBLIC pada pemeriksaan 19 November 2026; PR #9 tetap Draft. Tidak ada tes, CI, merge `main`, deployment, VPS, database produksi maupun akses data asli.


## Lanjutan M04-I4 (19 November 2026)
[Gerbang aktivasi simulasi dan register tindak lanjut](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I4_ACTIVATION_AND_FOLLOWUP.md) telah ditulis, **BELUM DIUJI**. Cabang I3 kini menyimpan baseline untuk pemeriksaan ulang; cabang dengan jejak kirim/terima/BAST/monitoring tidak dapat diaktifkan otomatis. Untuk cabang tanpa jejak fisik, aktivasi hanya di workspace sintetis setelah penelaah tambahan dan validasi sumber; objek lama diarsipkan. Keputusan/dokumen resmi tetap di luar sistem DEMO.
