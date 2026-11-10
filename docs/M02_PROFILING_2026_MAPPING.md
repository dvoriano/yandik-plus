# M02-S3 | Peta Profiling Puskeswan 2026 ke YANDIK+ Paperless

**Status:** Rancangan pemetaan **berdasarkan struktur Profiling 2026 yang telah dibahas**, **belum** diverifikasi terhadap kolom source Flask/DB asli.  
**Tanggal:** 10 November 2026. **Lingkungan:** GitHub-only, data fiktif, tanpa sinkronisasi website.

## Prinsip utama
1. **Satu Puskeswan, satu ID master.** Identitas fasilitas tidak diinput berulang.
2. **Data tetap berada pada modul sumber yang berwenang.** Profil boleh menampilkan ringkasan SDM/APEL, tetapi tidak menggandakan sumber data.
3. **Kondisi/kesiapan ≠ realisasi kegiatan.** Contoh: kemampuan melaksanakan surveilans adalah profil, jumlah surveilans yang sudah dilakukan adalah catatan pelayanan.
4. **Kosong ≠ nol ≠ tidak terverifikasi.** Tampilkan tiga keadaan secara berbeda.
5. **Versi historis terjaga.** Mutasi tenaga, alat rusak dan legalitas baru tidak menghapus riwayat lama.
6. **Hak akses dan pengesahan di backend.** Role picker dalam demo bukan login atau pengesahan legal.

## Pemetaan domain
| Domain Profiling 2026 | Sumber yang direncanakan | Dalam prototype saat ini | Pengembangan berikutnya |
|---|---|---|---|
| **Legalitas** | Profiling Puskeswan | Draf/review satu field status | Rincikan jenis dokumen, nomor referensi internal, masa berlaku, status verifikasi |
| **SDM** | Modul SDM (master & histori penempatan) | Kontrak master SDM ada; **belum ada tampilan sinkron** | Tampilkan tenaga aktif per tanggal sebagai ringkasan baca-saja, tautkan ke modul SDM |
| **Bangunan** | Profiling fasilitas | Draf/review satu field kondisi | Pecah per ruang/jenis bangunan, bukti dan catatan pemeliharaan |
| **Peralatan klinik** | Profiling sarpras/inventaris | Draf/review satu field kondisi; kontrak histori aset ada | Daftar aset individual, kondisi, tanggal periksa dan kebutuhan perbaikan |
| **Obat dan BHP** | Profiling ketersediaan/inventaris | Draf/review satu field status | Daftar kategori persediaan dengan tanggal pembaruan; jangan menebak stok |
| **Pelayanan** | APEL bulanan sebagai sumber realisasi; jenis layanan tersedia di profil jika perlu | Kontrak APEL ada; **belum terhubung ke UI demo** | Ringkasan periode, kepatuhan dan tren tanpa membuat formulir pelayanan kedua |
| **Surveilans** | Profil kemampuan/layanan dan catatan kegiatan surveilans pada sumber sah | Belum ada field UI | Bedakan fasilitas/kapasitas surveilans vs realisasi dan investigasi, hindari input ganda iSIKHNAS |
| **Kesmavet** | Profil layanan Kesmavet dan APEL kegiatan | Belum ada field UI | Bedakan kesiapan fasilitas/kewenangan layanan vs jumlah pelaksanaan Kesmavet |
| **Permasalahan** | Catatan masalah Puskeswan; nanti ditautkan ke Support | Belum ada field UI | Alur isu → bukti → verifikasi → rencana tindak lanjut → evaluasi; tidak otomatis menyetujui bantuan |

**Wilayah kerja** ada sebagai bagian tambahan pada demo lima kartu, tetapi belum dapat diklaim sebagai kategori formulir Profiling 2026 yang berdiri sendiri. Harus dipetakan ke identitas fasilitas dan cakupan kewilayahan bila desain final disetujui.

## Batas lima kartu dalam demo M02-S2
Prototype saat ini baru memiliki **Legalitas, Bangunan, Peralatan klinik, Obat/BHP, Wilayah kerja**. Setiap bagian masih berupa **satu kolom teks demonstrasi**, bukan replika seluruh pertanyaan Profiling 2026. Tidak ada integrasi backend, DB, SDM, APEL, iSIKHNAS, atau inventaris. Semua tampilan menyatakan status simulasi.

## Navigasi UX yang akan dibuat
- **Profil Saya:** ringkasan dan status kelengkapan, tombol "Perbarui" per bagian saja.
- **SDM:** ringkasan *dibaca* dari sumber SDM; jika berubah gunakan "Kelola SDM", bukan mengedit angka tenaga di profil.
- **Pelayanan:** ringkasan *dibaca* dari APEL; "Lihat laporan bulanan" menuju modul APEL.
- **Surveilans/Kesmavet:** sediakan bagian profil kapasitas bila memang diperlukan, dan tautan realisasi ke modul kegiatan.
- **Permasalahan:** satu daftar isu dengan status dan tindak lanjut; dukungan barang tidak ditetapkan otomatis.
- **Verifikator:** lihat bagian yang berubah, nilai sebelumnya dan baru, bukti, serta alasan; dapat meminta perbaikan.

## Kriteria pemetaan lengkap (BELUM terpenuhi)
- [ ] Source Flask lama lengkap ada di GitHub, tanpa data pribadi/kredensial.
- [ ] Field asli Profiling 2026, tipe data, aturan pengisian, dan formulir existing dicocokkan satu per satu.
- [ ] Dicatat untuk setiap field: sumber utama, apakah berulang, periode, bukti, hak akses, dan mekanisme revisi.
- [ ] Data existing dapat dibaca lewat adapter yang tidak mengubah perhitungan historis APEL 2026.
- [ ] Usability test pada HP sederhana, jaringan lambat, dan petugas yang kurang terbiasa teknologi.
- [ ] Pemeriksaan kewenangan, legalitas, dan SPBE sebelum integrasi ke proses resmi.

## Referensi
- [Project State](../PROJECT_STATE.md)
- [Roadmap](ROADMAP.md)
- [Prototype M02-S2](M02_UI_DEMO.md)
- [Profil Puskeswan](modules/01_PROFIL_PUSKESWAN.md)
- [SDM Veteriner](modules/03_SDM_VETERINER.md)
- [APEL](modules/02_APEL_PUSKESWAN.md)
- [Support Puskeswan](modules/04_SUPPORT_PUSKESWAN.md)
