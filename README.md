# YANDIK+

**Satu data, pekerjaan lebih tertata, pelayanan lebih terpantau.**

**YANDIK+** adalah proyek pengembangan ruang kerja digital terpadu untuk membantu pelayanan dan kesehatan hewan, khususnya pengelolaan Pusat Kesehatan Hewan (Puskeswan) dan koordinasi kegiatan di tingkat kabupaten/kota serta provinsi.

Gagasannya sederhana: **petugas lebih fokus pada pelayanan, sementara pencatatan, pelaporan, pemeriksaan, dan tindak lanjut menjadi lebih mudah dan saling terhubung.**

> **Status proyek:** YANDIK+ terpadu **masih dalam pengembangan**. Sebagian fungsi APEL Puskeswan telah berjalan di sistem yang sudah ada, tetapi sebagian besar modul YANDIK+ masih berupa rancangan atau prototipe, **belum menjadi sistem operasional terpadu yang disahkan**.

## Mengapa YANDIK+ dikembangkan?

Dalam pekerjaan sehari-hari, informasi pelayanan, kondisi fasilitas, tenaga veteriner, kegiatan pembinaan, dan kebutuhan Puskeswan sering berada di berbagai formulir, spreadsheet, pesan, atau dokumen terpisah. Akibatnya, data harus diisi berulang, laporan disusun kembali secara manual, dan perkembangan suatu masalah tidak selalu mudah dilacak.

YANDIK+ dirancang untuk **menghubungkan informasi dan proses kerja tersebut** tanpa membuat petugas harus mempelajari sistem yang rumit.

## Apa hasil akhir yang ingin diwujudkan?

Hasil akhir yang dituju adalah **satu ruang kerja digital yang nyaman digunakan melalui komputer maupun ponsel**, dengan kemampuan:

1. **Satu profil Puskeswan yang dapat digunakan bersama.** Informasi fasilitas, SDM, sarana, peralatan, serta permasalahan tersedia sebagai data rujukan sesuai hak akses.
2. **Pelayanan dan pelaporan yang lebih praktis.** Kegiatan pelayanan dicatat dan dirangkum secara konsisten, termasuk pengembangan pelaporan dan pemantauan APEL Puskeswan.
3. **Permasalahan dan kebutuhan yang dapat ditelusuri.** Kondisi atau kendala di lapangan dapat dicatat, dilengkapi bahan pendukung, lalu diajukan sebagai usulan dan ditindaklanjuti sesuai kewenangan.
4. **Pekerjaan lintas unit yang lebih tertata.** Pembinaan, pengawasan, kesehatan hewan, surveilans, administrasi kegiatan, dan proses sertifikasi dapat dipantau melalui alur yang jelas.
5. **Dashboard yang membantu pengambilan keputusan.** Kabupaten/kota dan provinsi dapat melihat rekap, tren, serta pekerjaan yang masih perlu perhatian berdasarkan data yang tersedia dan status pemeriksaannya.
6. **Riwayat kegiatan yang lebih mudah diperiksa.** Perubahan, catatan pemeriksaan, dan tindak lanjut dirancang memiliki jejak yang jelas sehingga bahan laporan tidak perlu disusun dari awal setiap saat.

Dengan demikian, tujuan YANDIK+ **bukan hanya mengumpulkan data**, melainkan membantu mengubah data menjadi informasi dan tindak lanjut yang berguna untuk pelayanan kesehatan hewan.

## Contoh penggunaan sederhana

Sebuah Puskeswan melaporkan bahwa peralatan pelayanan tertentu rusak.

**Kondisi dicatat → kebutuhan diusulkan → kelengkapan diperiksa → tindak lanjut dipantau → hasilnya terlihat dalam rekap.**

Petugas dapat mengetahui perkembangan usulannya, pengelola kabupaten/kota dapat melihat kebutuhan fasilitas, dan provinsi memperoleh gambaran yang lebih menyeluruh untuk bahan pembinaan serta perencanaan.

**Penting:** Pencatatan masalah atau verifikasi usulan **tidak otomatis berarti bantuan disetujui atau anggaran tersedia**. Keputusan resmi tetap mengikuti prosedur dan kewenangan yang berlaku.

## Siapa yang diharapkan menggunakan YANDIK+?

| Pengguna | Manfaat yang dituju |
|---|---|
| **Petugas Puskeswan** | Mencatat pelayanan, memperbarui profil, menyampaikan kebutuhan, dan melihat tindak lanjut |
| **Pengelola kabupaten/kota** | Memantau layanan, memeriksa kelengkapan informasi, dan mengoordinasikan pembinaan |
| **Pengelola tingkat provinsi** | Melihat kebutuhan lintas wilayah, mendukung pengawasan, dan menyiapkan bahan evaluasi |
| **Pimpinan** | Memperoleh ringkasan dan indikator yang dapat ditelusuri ke sumber datanya |

Hak akses akan dirancang mengikuti tugas, wilayah, dan kewenangan masing-masing pengguna.

## Ruang lingkup pengembangan

YANDIK+ direncanakan memiliki **15 modul** yang saling mendukung, meliputi data dasar dan profil Puskeswan, APEL, SDM veteriner, dukungan Puskeswan, pengawasan obat hewan, klinik/praktik dokter hewan, penyakit hewan dan zoonosis, sertifikat veteriner/lalu lintas, pembinaan, administrasi, dashboard, peta, panduan, serta notifikasi.

Rincian setiap modul tersedia di [Katalog 15 Modul](docs/MODULES_INDEX.md). **Daftar modul merupakan cakupan pengembangan, bukan daftar fitur yang sudah siap digunakan.**

## Perkembangan saat ini

- **Sudah ada layanan tersendiri:** APEL Puskeswan pada [yandikvo.my.id](https://yandikvo.my.id/) untuk fungsi yang telah tersedia saat ini.
- **Sedang dikembangkan di GitHub:** Fondasi data, profil Puskeswan, alur kerja, serta rancangan administrasi dan dukungan Puskeswan.
- **Masih bertahap:** Integrasi lintas modul, penerapan pada pengguna nyata, pengujian fitur baru, pengaturan kelembagaan, dan implementasi produksi.

Repository ini berisi **kode pengembangan, prototipe, dan dokumen rancangan**, bukan salinan sistem produksi yang sudah dapat langsung dipasang. Pengembangan terbaru berlangsung dalam mode **CODE_ONLY: kode ditulis, belum diuji** untuk perubahan-perubahan baru. Pengujian dan implementasi memerlukan tahapan serta persetujuan terpisah.

YANDIK+ juga **tidak dimaksudkan menggantikan** aplikasi dan proses resmi seperti iSIKHNAS, SRIKANDI, sistem perizinan, pengadaan, atau penerbitan dokumen oleh pejabat berwenang. Kesesuaian dengan tata kelola SPBE, keamanan data, dan ketentuan instansi harus ditelaah sebelum penerapan nyata.

## Dokumen proyek

- [Ringkasan Eksekutif](docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md): penjelasan singkat untuk pimpinan dan pemangku kepentingan.
- [Pengenalan Lengkap YANDIK+](docs/PENGENALAN_YANDIK_PLUS.md): tujuan, manfaat, sistem kerja, dan tata kelola.
- [Katalog 15 Modul](docs/MODULES_INDEX.md): cakupan modul yang direncanakan.
- [Roadmap dan Progres](docs/ROADMAP.md): kemajuan pengembangan dan hal yang belum selesai.
- [Status Proyek](PROJECT_STATE.md): kondisi terbaru serta tindak lanjut.
- [Aturan Pengembangan CODE_ONLY](docs/CODE_ONLY_MODE.md): batasan penulisan kode dan pengujian.

---

**YANDIK+ dikembangkan agar administrasi mendukung pekerjaan pelayanan kesehatan hewan, bukan justru menambah bebannya.**

*Dokumen dan kode dalam repository ini masih merupakan bahan pengembangan dan telaah. Repository masih berstatus publik berdasarkan pemeriksaan 12 November 2026; jangan memasukkan data pribadi, informasi kedinasan yang dibatasi, atau dokumen rahasia.*
