# M04-S13–S15 | Siklus Realisasi, Serah Terima dan Monitoring Dukungan Puskeswan

**16 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Seluruh data dan catatan fiktif. Bukan pelaksanaan kegiatan, persetujuan bantuan, dokumen resmi atau hasil evaluasi.

## Maksud dan alur
Rangkaian S10–S12 menyediakan rancangan paket, telaah metadata dan jadwal. S13–S15 melengkapi rancangan fungsi setelah jadwal dengan satu antarmuka simulasi dan tiga model terpisah yang menggunakan sumber satu sama lain. Ini bukan integrasi produksi M03/APEL dan tidak membuat izin dari status telaah.

| Tahap | Fungsi DEMO | Rujukan |
|---|---|---|
| S13 | Pencatatan kirim, terima parsial, kondisi baik/rusak, selisih dan sisa | Jadwal S12, ID kirim dan snapshot sumber |
| S14 | Register metadata rujukan serah terima/BAST, satu fasilitas per catatan | ID penerimaan S13 dan snapshot |
| S15 | Pengamatan berkala kondisi pemanfaatan, riwayat dan rekap terbaru | Baris barang baik dari register S14 |

### Perhitungan S13
- Jumlah kirim simulasi kumulatif tidak boleh melebihi jumlah jadwal.
- Jumlah terima fisik = baik + rusak saat terima; kumulatif tidak melebihi jumlah kirim.
- Belum dikirim = jadwal − kirim; menunggu penerimaan = kirim − terima fisik. Selisih ini belum boleh diasumsikan hilang atau ditetapkan sebagai kerugian.
- Tanggal penerimaan tidak mendahului kirim. Tanggal kirim boleh mendahului tanggal jadwal indikatif pada simulasi.
- ID, tujuan, satuan, dan kuantitas bersumber dari model sebelumnya.

### S14
Satu catatan model dapat memuat beberapa penerimaan dari satu fasilitas; penerimaan tidak boleh digunakan dua kali dan referensi DEMO unik. UI menyederhanakan menjadi satu penerimaan per catatan. Tanggal referensi tidak mendahului penerimaan. Nomor otomatis DEMO-BAST hanya identitas contoh, bukan nomor dokumen yang diterbitkan, bukan arsip yang autentik dan bukan tanda tangan.

### S15
Kondisi pengamatan: digunakan + belum digunakan + rusak setelah penerimaan harus sama dengan jumlah barang baik dalam baris sumber. Barang rusak saat diterima dilaporkan terpisah dan tidak otomatis masuk pemantauan barang baik. Riwayat pengamatan disimpan; rekap mengambil tanggal pengamatan paling baru per baris, satu pengamatan per tanggal per baris. Barang tanpa pengamatan diklasifikasikan **belum diamati**, bukan belum digunakan. Satuan berbeda tidak digabungkan. Catatan pemanfaatan belum menjadi penilaian resmi atau bukti perubahan kinerja pelayanan.

## Kode dan antarmuka
- [Model dan fixture](https://github.com/dvoriano/yandik-plus/commit/1508aa33d7a8b42e889c49ff4d9cc06de56c8a29): realization.mjs, handover.mjs, monitoring.mjs, common.mjs, fixtures.mjs.
- [24 skenario Node dan satu UI gabungan](https://github.com/dvoriano/yandik-plus/commit/86fbec76da490918171f1597d0b9c7c4939a3ee6): formulir kirim, penerimaan, rujukan dan pengamatan, daftar serta rekap per satuan.
- [Direktori sumber](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-support-lifecycle). Data hanya dalam memori; append-only dalam sesi, reset/reload menghapusnya. Tidak ada fitur koreksi resmi, rekonsiliasi sumber usang, unggah dokumen, identitas penandatangan, buku stok, ataupun audit server.
- Snapshot pembandingan hanya pengikatan data sintetis, bukan bukti kriptografis atau autentikasi. Perubahan sumber memblokir catatan lama; belum ada mekanisme penanganan koreksi dengan persetujuan dan histori permanen.
- Fixture S12 adalah sumber bersama. UI tidak menerima edit dari halaman S10–S12. Model S10–S15 saling dirujuk melalui fungsi; integrasi M03, APEL, database, RBAC/wilayah, pengadaan/anggaran, bukti nyata, SOP dan proses resmi masih RENCANA.

## QA dan kesiapan
24 deklarasi test ditulis (8 per tahap), **belum dijalankan**. S9V tetap snapshot 192 skenario, S10 12, S11 12, S12 14, dan tambahan S13–S15 24; lingkup dihitung terpisah, bukan hasil tes. Tidak ada CI, browser, deployment atau perubahan produksi. Repo PUBLIC menurut metadata 16 November, PR #9 Draft.

## Keputusan lanjutan
Cakupan rancangan fungsional Support Puskeswan kini mencapai monitoring. Jangan menambah prototipe berulang sebagai pengganti integrasi. Tahap lanjutan yang disarankan: susun kontrak integrasi M03/M04, aturan koreksi dan akses wilayah, data/audit server serta QA dengan izin eksplisit owner. Rancangan fungsional tidak menandakan modul siap dipakai, bantuan sah atau proyek YANDIK+ telah selesai.
