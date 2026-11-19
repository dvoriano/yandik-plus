# M04-I4 | Aktivasi Simulasi Rekonsiliasi dan Register Tindak Lanjut

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Semua identitas, status, dokumen dan data adalah fiktif. Tidak ada otorisasi kelembagaan, perubahan produksi, pengesahan bantuan, pembayaran ataupun penerbitan BAST.

## Tujuan dan prinsip
M04-I3 telah menyiapkan cabang prospektif untuk sumber M03 yang berubah, tanpa mengganggu workspace aktif. M04-I4 menambahkan gerbang kelayakan aktivasi **DEMO** dan prosedur preservasi histori untuk kasus yang *belum memiliki jejak penyaluran*. Jika sudah ada catatan kirim/terima/serah terima/pemanfaatan, kode tidak mengaktifkan cabang dan hanya mencatat kebutuhan tindak lanjut manual.

## Dua jalur yang berbeda

| Kondisi sumber dan objek terdampak | Tindakan yang diizinkan dalam rancangan DEMO | Yang tidak dilakukan |
|---|---|---|
| Cabang telah ditelaah, hanya paket/telaah/jadwal, **belum ada kirim/terima/BAST/monitoring** | Penelaahan kesiapan oleh pemeriksa kedua, pemeriksaan ulang sumber, aktivasi simulasi terarsip jika seluruh gerbang lulus | Tidak menerbitkan persetujuan resmi, tidak mengubah data kedinasan |
| Ada jejak kirim, penerimaan, rujukan BAST atau monitoring | Buat register tindak lanjut yang mencantumkan ID, hubungan dokumen dan kuantitas contoh; kasus tetap dibekukan | Tidak mengubah stok, menegasikan realisasi, menghapus BAST atau mengaktifkan sumber baru |
| Paket mencampur fasilitas, cabang tidak tersedia, sumber usang, atau baseline berubah | Tolak dan arahkan ke penanganan manual/review ulang | Tidak membagi data lintas fasilitas secara otomatis |
| Cabang belum ditelaah, reviewer sama dengan pemohon/penyusun/reviewer sebelumnya, atau aktor tanpa scope | Tolak | Tidak menyimpulkan persetujuan dari keberadaan metadata |

## Mekanisme M04-I4

1. **Persiapan dari M04-I3**: repository I2 menangkap snapshot workspace aktif (`base_workspace`) saat membuat cabang. Entri lama yang tidak memiliki baseline tersebut harus ditolak untuk aktivasi sampai disiapkan ulang.
2. **Gerbang aktivasi**: `activationGate` menolak cabang kosong, campuran fasilitas, status belum ditelaah, sumber tidak berubah, serta semua jejak pengiriman/penerimaan/BAST/monitoring.
3. **Penelaahan tambahan oleh aktor berbeda**: perintah `review_activation` merekam `catat_kesiapan_demo` atau `kembalikan_untuk_perbaikan`. Pemeriksa ini harus berbeda dari pemohon koreksi, pembuat cabang dan penelaah M04-I3. Kebijakan peran hanyalah DEMO dan **bukan pembuktian kewenangan pejabat**.
4. **Pemeriksaan ulang tepat sebelum perubahan**: `activate_branch_demo` membutuhkan `acknowledge_demo=true`. Repository membaca lagi calon sumber dari provider sintetis tepercaya, memeriksa versi, cakupan, seluruh snapshot dampak, serta kesamaan workspace aktif dengan baseline. Perubahan pada fasilitas lain juga memblokir aktivasi sebagai pilihan konservatif.
5. **Transaksi dan arsip**: bila memenuhi syarat, dalam satu transaksi I2 dipertahankan snapshot versi lama, disimpan arsip sidecar berisi objek yang dipensiunkan dan sumber semula, daftar ID tidak boleh dipakai ulang, kemudian workspace DEMO berpindah ke cabang valid. Revisi, audit dan idempotency key dicatat bersama. Ini **aktivasi di dalam model DEMO saja**; tidak ada adapter ke produksi.
6. **Akses baca**: fungsi `activation(actorId, facilityId, correctionId)` menampilkan status, ringkasan guard dan ketersediaan arsip/tindak lanjut menurut cakupan DEMO, tidak mengembalikan source packet, objek arsip, atau payload cabang kepada pemanggil.
7. **Kunci pasca-aktivasi**: skenario deterministik I1 untuk fasilitas itu tetap dibekukan, agar ID paket/jadwal lama tidak direproduksi. Perlu desain penerbitan identitas baru dan penanganan revisi sebelum alur dapat dilanjutkan.

## Register tindak lanjut, bukan kompensasi aktual

`record_followup_register` hanya digunakan bila terdapat jejak pada S13–S15. `draftFollowupRegister` membuat baris menurut jenis objek, ID rujukan, jumlah contoh/kondisi, dan status `butuh_telaah_manual`. Hasilnya berada pada sidecar transaksi historis dengan `actual_compensation=0`, `official_adjustments=0`, `stock_mutated=false` dan `legal_bast_issued=false`. Tindak lanjut tidak dapat dieksekusi oleh kontrak ini, dan koreksi tetap berstatus dibekukan.

Dokumen riil yang ditandatangani, perbedaan barang fisik, pengembalian barang, penggantian, perubahan sumber anggaran, maupun pembatalan BAST memerlukan proses terpisah dan keputusan pihak yang berwenang. Tidak boleh diputuskan berdasarkan kode DEMO atau snapshot lama.

## Kode dan pengujian tertunda

- [Gerbang aktivasi dan register tindak lanjut](https://github.com/dvoriano/yandik-plus/commit/c08f9e4a3143e379642061c2ccc9652a1173f876)
- [Transaksi repository dan kontrol peran](https://github.com/dvoriano/yandik-plus/commit/d5e91e6ecf3fb62c7147ba3870f013b63d727104)
- [20 skenario Node tertulis](https://github.com/dvoriano/yandik-plus/commit/00ee731c48714df79c6464d827f860c3650039b7) serta [perbaikan kontrak contoh sumber dan konkurensi](https://github.com/dvoriano/yandik-plus/commit/f1b3b8899e8c312471f7abeb263c90a187f3ba9f)
- [Folder M04-I4](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-reconciliation-activation)

Seluruh skenario **BELUM DIJALANKAN**. Belum ada pembuktian keamanan, integritas SQL, konkurensi multi-koneksi, kemampuan pemulihan, performa atau semantik formal persetujuan. Repository sementara berbasis kontrak Node/SQLite yang belum terhubung Flask, autentikasi server asli, arsip kedinasan atau database produksi. GitHub tetap PUBLIC dan PR #9 Draft; semua fixture harus tetap fiktif.

## Batas penyelesaian dan pekerjaan berikutnya

Yang dibangun pada tahap ini adalah **rancangan aktivasi DEMO terjaga dan pencatatan tindak lanjut**, bukan pembetulan operasional data yang sudah disalurkan. Konflik yang memiliki realisasi fisik tetap membutuhkan prosedur koreksi resmi, referensi dokumen, penanggung jawab, dan pemisahan tindakan. Versi sumber yang berubah pada fasilitas lain juga memerlukan persiapan ulang karena snapshot workspace masih global. Belum ada model partisi per fasilitas, ID baru pasca-arsip, atau API.

**Usulan M04-I5:** revisi sumber berjenjang dan pembentukan ID generasi baru, workflow koreksi dengan bukti dokumen asli, partisi transaksi per fasilitas, retensi/arsip dan adaptor aplikasi setelah review kelembagaan. Jalankan QA secara bertahap hanya jika owner memberi izin eksplisit G0. M05 APEL 2.0 tetap mengikuti roadmap.
