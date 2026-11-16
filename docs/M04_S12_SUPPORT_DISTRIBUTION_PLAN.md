# M04-S12 | Rencana Distribusi Dukungan Puskeswan

**16 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Simulasi perencanaan, bukan pelaksanaan penyaluran.

## Tujuan
Menghubungkan paket rencana S10 dan telaah metadata S11 dengan jadwal indikatif per baris barang. Tujuan Puskeswan dan satuan berasal dari paket sumber, bukan input bebas. S11 tercatat untuk pembahasan adalah prasyarat simulasi saja, bukan persetujuan bantuan atau izin distribusi aktual.

## Alur
1. Baca paket dan sumber telaah S11 yang masih cocok, dengan status tercatat untuk pembahasan serta metadata keputusan dan anggaran contoh.
2. Pilih baris barang dan tujuan dari paket, tanggal rencana, cara (antar atau ambil), serta jumlah bilangan bulat positif.
3. Tambah, ubah atau hapus draf jadwal. Jumlah terjadwal kumulatif per baris paket tidak boleh melebihi jumlah paket. Sisa dihitung sebagai jumlah paket dikurangi jumlah jadwal; satuan berbeda tidak dijumlahkan.
4. Perubahan sumber paket atau catatan telaah menolak penggunaan rencana lama. Belum ada rekonsiliasi otomatis atas draf usang.

## Batas kontrak
- ID jadwal unik; validasi sumber paket memanfaatkan S10 dan ringkasan telaah S11. Snapshot pengikatan sumber merupakan nilai data DEMO, bukan tanda tangan, autentikasi, integritas server atau verifikasi dokumen.
- UI hanya menggunakan paket dan telaah fixture; contoh dua baris berbeda satuan dan dua tujuan fiktif. Tidak mengambil hasil edit pada halaman S10/S11. Data sementara dalam memori, hilang saat reload/reset.
- Tidak ada pemesanan kendaraan, pengadaan, stok tersedia atau reservasi, pengiriman, penerimaan, pengesahan anggaran, penetapan penerima, BAST atau keputusan resmi.
- Waktu, metode dan tujuan indikatif bukan jadwal operasi yang telah disahkan. Jumlah belum dijadwalkan bukan jumlah barang belum diterima.
- Penyaluran aktual memerlukan referensi eksternal nyata yang diperiksa, dasar dan kewenangan yang sah, ketersediaan barang, kontrol akses, sistem pencatatan, SOP serta QA. Belum diimplementasikan.

## Berkas dan QA
[Model, fixture dan 14 skenario Node tertulis](https://github.com/dvoriano/yandik-plus/commit/dacf317018b6df176b783ffe221a10fa4d4043e9); [antarmuka simulasi](https://github.com/dvoriano/yandik-plus/commit/a57ffa58d6abbe8e37c5545d824d8f67479009cc); [folder S12](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-support-distribution-plan). Semua **BELUM DIUJI**. QA ditambahkan terpisah dari snapshot S9V dan suite tambahan S10/S11. Tidak ada tes, CI, browser atau deployment yang dijalankan.

## Tahap berikutnya
Usulan S13: model simulasi pencatatan realisasi dan penerimaan per jadwal/baris, termasuk penerimaan parsial, selisih dan metadata rujukan serah terima/BAST. Prasyarat otorisasi aktual dipisahkan. Tidak menerbitkan BAST sah, tidak menganggap rencana S12 sebagai izin distribusi dan tidak mengubah data nyata.

Repository PUBLIC per metadata 16 November 2026; PR #9 Draft. CODE_ONLY berlaku.

## Lanjutan M04-S13–S15 (16 November 2026)
[Catatan realisasi/penerimaan, register rujukan serah terima/BAST, monitoring](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S13_S15_SUPPORT_LIFECYCLE.md) ditulis sebagai tiga model dan satu UI DEMO, **BELUM DIUJI**. Jadwal tetap bukan izin distribusi. Proses aktual tetap RENCANA.
