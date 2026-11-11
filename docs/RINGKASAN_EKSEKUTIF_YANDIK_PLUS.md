# YANDIK+ | Ringkasan Eksekutif
## Ringkasan untuk Pimpinan, Inspektorat, dan Diskominfotik

**Bahan presentasi dan telaah awal | Draf 1.0, 11 November 2026**

> **YANDIK+ adalah konsep ruang kerja digital terpadu untuk membantu pelayanan dan kesehatan hewan.** Tujuannya: data tidak diketik berkali-kali, pekerjaan mempunyai status yang jelas, bukti kegiatan dapat ditelusuri, dan pimpinan memperoleh rekap yang dapat diperiksa sumbernya.

**Kedudukan:** Rancangan pengembangan bertahap pada lingkup Dinas Peternakan dan Kesehatan Hewan Provinsi Sumatera Barat. **Bukan** dokumen pengesahan sistem, permohonan pengadaan, atau keputusan bahwa seluruh modul telah tersedia.

## Masalah yang ingin diselesaikan

- Data profil fasilitas, SDM, pelayanan dan kegiatan tersebar pada formulir atau berkas yang berbeda.
- Rekap dan dokumen kegiatan perlu disusun berulang.
- Sulit melihat proses sesudah laporan dikirim: apakah sudah diperiksa, dikoreksi atau ditindaklanjuti.
- Kebutuhan fasilitas dan hasil pengawasan belum selalu terhubung dengan kondisi nyata yang mendasarinya.
- Petugas lapangan memerlukan sistem yang nyaman dipakai dari HP, mudah dipahami dan tahan kendala koneksi.

## Apa yang akan dikerjakan YANDIK+?

| Kelompok pekerjaan | Fungsi yang dituju |
|---|---|
| **Pelayanan Puskeswan** | Profil fasilitas, tenaga, pelaporan APEL, masalah dan usulan kebutuhan |
| **Pengawasan** | Sarana obat hewan, klinik/praktik dokter hewan, jadwal, checklist, temuan dan perbaikan |
| **Kesehatan hewan** | Koordinasi informasi PHMS/zoonosis, hasil rujukan dan sertifikat/lalu lintas menurut kewenangan |
| **Pembinaan dan administrasi** | Jadwal, bukti kegiatan, laporan, rekomendasi, histori dan pengingat |
| **Informasi pimpinan** | Dashboard, peta kebutuhan, ringkasan indikator dan status tindak lanjut |
| **Panduan kerja** | SOP, juknis, FAQ, template dan opsi asisten AI jika disetujui |

Keseluruhan rancangan terdiri dari **15 modul** yang terhubung oleh sistem dasar bersama.

## Bukan sekadar kumpulan menu

YANDIK+ dirancang mempunyai **cara kerja yang tertib**:

1. **Satu data induk:** setiap Puskeswan memiliki identitas rujukan; APEL, SDM, sarpras dan Support mengambil informasi pada sumber yang tepat.
2. **Hak akses sesuai peran:** petugas mengisi; verifikator menelaah; pimpinan membaca ringkasan; keputusan pejabat tetap pada kewenangannya.
3. **Status pekerjaan:** draf → diajukan → diperiksa → perbaikan bila perlu → ditindaklanjuti → selesai.
4. **Bukti dan histori:** informasi penting, alasan koreksi serta tindak lanjut dapat ditelusuri.
5. **Satu sumber angka:** laporan bernilai nol tidak disamakan dengan belum melapor; laporan tidak diganti diam-diam pada dashboard.
6. **Prioritas yang dapat dijelaskan:** kebutuhan fasilitas dinilai dari kondisi/risiko/akses/SDM, bukan otomatis dari banyaknya jumlah pelayanan.
7. **Dokumen kerja:** sistem membantu membuat draf dan rekap, sedangkan pengesahan resmi melalui mekanisme berwenang.

**Contoh:** Puskeswan mencatat alat pendingin vaksin rusak → masalah diperiksa → petugas mengajukan kebutuhan barang → usulan ditelaah → rekomendasi kebutuhan disusun. **Persetujuan bantuan, anggaran, distribusi dan BAST tidak terjadi otomatis**, melainkan tetap mengikuti proses resmi.

## Apa yang sudah ada dan apa yang belum?

| Kelompok | Keterangan |
|---|---|
| **Layanan yang telah ada** | APEL Puskeswan memiliki layanan daring awal. Ini bukan bukti seluruh YANDIK+ sudah berjalan. |
| **Prototype pengembangan** | Data induk, Profil, daftar permasalahan, usulan kebutuhan, bukti metadata contoh, alur verifikasi dan skor prioritas percobaan. Belum menjadi aplikasi terpadu yang digunakan petugas sebenarnya. |
| **Kode baru belum diuji** | Laboratorium M03-S4 untuk enam fasilitas **fiktif** dan tiga bobot perbandingan. Belum diintegrasikan ke layanan. |
| **Masih direncanakan** | Pengawasan dan pembinaan terpadu, sertifikat/lalu lintas, PHMS, dokumen, notifikasi, GIS, dashboard lintas modul, serta alokasi/BAST sesuai kewenangan. |

**Seluruh pengembangan terpadu belum disahkan untuk penerapan produksi.** Status tiap bagian dijaga dalam [ROADMAP](ROADMAP.md).

## Pokok perhatian bagi masing-masing pembaca

**Pimpinan:** apakah arah ini menjawab kebutuhan tugas nyata; modul mana diprioritaskan; siapa penanggung jawab proses dan data; bagaimana hasil akan diukur?

**Inspektorat:** siapa membuat dan memeriksa data; apakah bukti dan histori terjaga; apakah penilaian, verifikasi, dan keputusan bantuan/anggaran dipisahkan; bagaimana tindak lanjut diperiksa?

**Diskominfotik:** bagaimana kedudukan YANDIK+ dalam tata kelola SPBE, arsitektur aplikasi dan data, keamanan, infrastruktur, akses pengguna dan integrasi tanpa membuat layanan pemerintah ganda?

**Prinsip penting:** Disebut *alat bantu kerja* bukan berarti otomatis berada di luar ketentuan SPBE. Kedudukannya perlu **ditelaah dan ditentukan bersama pengampu yang berwenang**. YANDIK+ juga tidak dimaksudkan menggantikan iSIKHNAS, SRIKANDI, OSS, sistem pengadaan atau kepegawaian.

## Apakah wajib membeli AI?

**Tidak.** Pendataan, checklist, verifikasi, rekap dan penyusunan template dasar tidak mensyaratkan token AI berbayar. AI hanya opsi untuk mencari panduan, meringkas data atau membantu draf apabila dinilai bermanfaat dan disetujui. Pengadaan/biaya operasional, bila diperlukan, harus dibahas melalui proses tersendiri.

## Langkah berikutnya yang diusulkan

1. Menyepakati proses kerja, pemilik data dan prioritas modul bersama pengguna.
2. Menelaah kedudukan dan integrasi SPBE dengan Diskominfotik serta pengendalian dengan Inspektorat.
3. Melakukan uji pengguna, keamanan, akurasi data dan kewajaran penilaian prioritas **setelah tahapan penulisan rancangan selesai dan pengujian diizinkan**.
4. Menentukan kebutuhan penerapan, pemeliharaan, pembiayaan dan penanggung jawab sebelum penggunaan resmi.

**Keputusan yang dimohon pada tahap ini:** **masukan dan arahan atas konsep serta proses bisnis**, bukan persetujuan otomatis atas seluruh modul, anggaran, atau deployment.

---

**Cara berbagi:** Dokumen ini ada di repository **private**. Pembaca harus terlebih dahulu memiliki akses GitHub yang diberikan secara sah. Jangan menjadikan repository publik tanpa penelaahan dan persetujuan.

**Baca penjelasan selengkapnya:** [Dokumen Pengenalan YANDIK+](PENGENALAN_YANDIK_PLUS.md) · [Katalog 15 Modul](MODULES_INDEX.md) · [Roadmap dan Status](ROADMAP.md)

**Naskah ini tidak menggantikan juknis, regulasi, SOP, atau keputusan pejabat yang berlaku.**
