# Mengenal YANDIK+
## Gambaran Sistem, Modul, Proses Kerja, Manfaat, dan Tata Kelola

**YANDIK+ | Satu data, pekerjaan lebih tertata, pelayanan lebih terpantau**

| Keterangan | Isi |
|---|---|
| Jenis dokumen | Naskah pengenalan dan konsep operasional, bukan spesifikasi pemrograman |
| Sasaran pembaca | Pimpinan, Inspektorat, Diskominfotik, perencana, pemeriksa, serta pengelola layanan kesehatan hewan |
| Konteks pengusul | Lingkup pelayanan dan kesehatan hewan pada Dinas Peternakan dan Kesehatan Hewan Provinsi Sumatera Barat |
| Versi | Draf pengenalan 1.0, 11 November 2026 |
| Kedudukan | **Bahan penjelasan dan telaah. Bukan persetujuan kebijakan, penganggaran, penerapan sistem, atau penetapan kewenangan.** |
| Status | Sebagian layanan APEL telah berjalan pada situs yang ada; pengembangan YANDIK+ terpadu dilakukan bertahap di GitHub, dengan banyak bagian masih prototype atau rencana |

> **Pesan utama:** YANDIK+ dirancang sebagai ruang kerja digital terpadu yang membantu petugas Puskeswan, kabupaten/kota, dan provinsi mengelola data, kegiatan, pengawasan, pembinaan, kebutuhan, serta tindak lanjut. Data dicatat pada sumber yang tepat, dapat digunakan kembali sesuai hak akses, dan dapat ditelusuri ketika diperiksa. **YANDIK+ tidak mengambil alih keputusan pejabat, proses pengadaan, penerbitan dokumen resmi, atau aplikasi pemerintah yang sudah menjadi rujukan.**

**Panduan baca:** Untuk gambaran dalam waktu singkat, lihat [Ringkasan Eksekutif YANDIK+](RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md). Dokumen ini menjelaskan **apa yang dikerjakan sistem dan bagaimana prosesnya**, bukan kode atau perangkat lunaknya. Status kemajuan terkini tersedia terpisah di [ROADMAP](ROADMAP.md).

---

## 1. Apa itu YANDIK+?

YANDIK+ adalah **konsep pengembangan sistem kerja digital terpadu** bagi pelayanan dan kesehatan hewan. Tujuannya bukan sekadar menyediakan formulir elektronik, melainkan membantu kegiatan dari awal sampai tindak lanjut: mencatat informasi, menyiapkan pekerjaan, menghimpun bukti, memeriksa kelengkapan, melakukan verifikasi sesuai kewenangan, mengolah rekap, serta menampilkan informasi untuk pengambilan keputusan.

Kegiatan yang semula berada pada berkas, pesan WhatsApp, spreadsheet, formulir terpisah, dan arsip masing-masing unit diarahkan menjadi **alur kerja yang saling berhubungan**. Setiap jenis data memiliki sumber utama. Petugas tidak perlu menyalin identitas fasilitas atau jumlah pelayanan ke banyak formulir ketika informasi tersebut sudah ada dan dapat digunakan kembali secara sah.

**Contoh sederhana:** Kondisi lemari pendingin vaksin yang rusak dicatat pada profil/permasalahan Puskeswan. Dari catatan tersebut, petugas dapat menyusun **usulan kebutuhan**. Petugas kabupaten/kota dan provinsi memeriksa kebutuhan dengan bukti serta alasan. Pimpinan melihat ringkasan kebutuhan yang masih terbuka. Jika kelak ada keputusan bantuan **melalui mekanisme yang berwenang**, penerimaan dan pemanfaatannya dapat dipantau. Pencatatan masalah, verifikasi kebutuhan, dan keputusan bantuan **adalah tiga tindakan berbeda**.

YANDIK+ dikembangkan secara **modular**. Artinya, tiap kelompok pekerjaan mempunyai bagian sendiri, tetapi memakai identitas fasilitas, pengaturan akses, status pekerjaan, dan standar data bersama.

## 2. Mengapa dibutuhkan?

Permasalahan yang ingin diatasi antara lain:

1. **Pengisian berulang.** Identitas Puskeswan, wilayah, tenaga, dan kegiatan sering perlu disebut kembali pada rekap atau usulan lain.
2. **Data tersebar.** Profil fasilitas, layanan, pengawasan, pembinaan, dan kebutuhan tidak selalu terlihat dalam satu konteks.
3. **Tindak lanjut sulit ditelusuri.** Dokumen dan pesan terkirim belum tentu menjawab apakah masalah sudah diperiksa, ditangani, atau selesai.
4. **Pembuktian tersebar.** Foto, daftar hadir, surat, hasil pemeriksaan, dan catatan perbaikan sering tidak terhubung dengan kegiatannya.
5. **Pimpinan menunggu rekap manual.** Informasi sulit dibandingkan karena periode, definisi, dan tingkat verifikasinya berbeda.
6. **Kendala lapangan.** Keterbatasan petugas, kemampuan menggunakan teknologi, serta jaringan internet menuntut tampilan sederhana dan dukungan penyimpanan draf.

**Manfaat yang dituju**, bukan hasil yang sudah dibuktikan: mengurangi pengetikan ulang, mempercepat penyusunan bahan laporan, memudahkan pelacakan kegiatan, membuat pembinaan dan bantuan lebih berbasis kebutuhan, serta memperjelas pertanggungjawaban data. Besarnya penghematan waktu atau biaya **belum dihitung** dan perlu diukur setelah uji pengguna.

## 3. Prinsip penyelenggaraan

| Prinsip | Artinya bagi pelaksana |
|---|---|
| Sekali dicatat, dipakai sesuai keperluan | Identitas fasilitas berasal dari satu data induk; rekap APEL tetap bersumber dari pelaporan APEL |
| Berangkat dari pekerjaan petugas | Pengguna melihat tugas penting, bukan dipaksa memahami menu yang rumit |
| Sederhana untuk HP | Bahasa umum, tombol jelas, simpan draf, bantuan pengisian, dan status yang mudah dibaca |
| Ada sumber dan penanggung jawab | Data menyebut periode, asal informasi, pembuat, dan pemeriksa apabila diperlukan |
| Kegiatan dan pembuktian terkait | Bukti serta catatan ditempatkan pada kegiatan atau objek yang relevan |
| Verifikasi tidak sama dengan persetujuan | Pemeriksaan kelengkapan tidak otomatis mengesahkan pembiayaan, penerbitan sertifikat, atau tindakan pejabat |
| Peran dan wilayah menentukan akses | Petugas melihat pekerjaan sesuai penugasan; data yang lebih sensitif tidak otomatis terbuka |
| Menghormati sistem yang telah ada | Tidak menggantikan iSIKHNAS, SRIKANDI, OSS/perizinan, pengadaan, kepegawaian, atau sistem resmi tanpa penugasan dan persetujuan |
| Dapat diaudit dan diperbaiki | Perubahan data penting harus punya alasan dan histori, bukan diam-diam menimpa nilai lama |
| Diterapkan bertahap | Rancangan, prototype, uji kelayakan, persetujuan, dan penerapan dipisahkan |

---

## 4. Peta 15 modul dan fungsinya

Tabel di bawah menggambarkan **lingkup YANDIK+ yang direncanakan**, bukan pernyataan bahwa semua fitur telah tersedia untuk digunakan. Tiap modul memiliki [dokumen rancangan tersendiri](MODULES_INDEX.md).

| Modul | Fitur utama dari sudut pengguna | Fungsi dan hasil kerja | Posisi pengembangan per 11 Nov 2026 |
|---|---|---|---|
| **00. Sistem Dasar / Core** | Data induk Puskeswan, akun, hak akses, pembagian wilayah, tugas, verifikasi, histori | Menyatukan identitas dan aturan kerja seluruh modul | **Prototype**, belum menjadi hak akses server produksi yang terintegrasi |
| **01. Profil Puskeswan** | Legalitas, lokasi, fasilitas, peralatan, obat/BHP, permasalahan, kesiapan | Memotret kondisi fasilitas serta memperlihatkan kekurangan dan riwayat pembinaan | **Prototype pengembangan**; pemetaan data lama belum final |
| **02. APEL Puskeswan** | Laporan pelayanan bulanan, kepatuhan laporan, rekap, tren, apresiasi | Menggambarkan pelayanan yang telah dilaporkan dan konsistensi pelaporan | **APEL awal sudah memiliki layanan daring**; pengembangan APEL 2.0 di YANDIK+ **masih rencana** |
| **03. SDM Veteriner** | Data tenaga, penempatan, kompetensi, perubahan penugasan, riwayat pelatihan | Menampilkan ketersediaan tenaga per fasilitas dan kebutuhan pengembangan kapasitas | Ada **rancangan dan model data awal**; modul terpadu dan data nyata belum selesai |
| **04. Dukungan Puskeswan / Support** | Usulan kebutuhan, bukti, klarifikasi, prioritas, tindak lanjut, bantuan bila berwenang | Menghubungkan masalah dengan kebutuhan yang telah diperiksa, lalu memantau penyelesaian | **Prototype usulan dan penilaian**; lab fairness M03-S4 **belum diuji**; alokasi/BAST **rencana** |
| **05. Pengawasan Obat Hewan** | Daftar sarana/distributor, jadwal, checklist, hasil, temuan dan perbaikan | Membantu pengawasan sarana dan peredaran obat hewan sesuai kewenangan | **Rencana** pengembangan terpadu |
| **06. Klinik dan Praktik Dokter Hewan** | Direktori sarana, dokumen legalitas, pemeriksaan, pembinaan, tindak lanjut | Membantu pemetaan dan pengawasan/pembinaan fasilitas praktik | **Rencana** pengembangan terpadu |
| **07. PHMS, Zoonosis dan Surveilans** | Catatan kejadian, investigasi, sampel/hasil rujukan, respons dan pemantauan | Mendukung koordinasi penanganan penyakit hewan dan zoonosis | **Rencana**, dengan batas integrasi data resmi harus ditentukan |
| **08. Sertifikat Veteriner dan Lalu Lintas** | Register permohonan, syarat, hasil pemeriksaan, status, referensi sertifikat | Memantau proses administratif dan teknis tanpa menerbitkan dokumen resmi secara otomatis | **Rencana**, tergantung ketentuan serta pejabat berwenang |
| **09. Pembinaan dan Bimtek** | Rencana kegiatan, sasaran, materi, kehadiran, rekomendasi dan hasil | Menghubungkan kegiatan peningkatan kapasitas dengan kebutuhan dan tindak lanjut | **Rencana** pengembangan terpadu |
| **10. Administrasi Kegiatan dan Dokumen** | Jadwal, tugas, bukti, daftar hadir, draf laporan/berita acara, pencarian berkas | Mengurangi penyusunan ulang administrasi kegiatan dan menguatkan dokumentasi | **Rencana**; bukan pengganti persuratan/arsip resmi |
| **11. Dashboard Pimpinan** | Rekap indikator, tren, wilayah, kebutuhan, pengawasan dan status tindak lanjut | Menyediakan pandangan manajerial yang jelas sumber dan batas datanya | Dashboard APEL tertentu telah ada; **dashboard terpadu rencana** |
| **12. Peta GIS** | Peta fasilitas, wilayah kerja, fasilitas pengawasan, kebutuhan dan sebaran kegiatan | Membantu melihat ketimpangan akses dan distribusi layanan secara geografis | **Rencana**; presisi lokasi dan akses perlu diatur |
| **13. Regulasi, Panduan, SOP dan AI Opsional** | Pustaka juknis, pencarian panduan, FAQ, templat draf dan asisten bila disetujui | Membantu petugas mendapatkan petunjuk yang seragam dan mudah diakses | Pustaka dasar ada/direncanakan; **AI opsional, belum menjadi prasyarat** |
| **14. Notifikasi dan Mode Lapangan** | Pengingat pelaporan, jadwal, tenggat, kotak tugas, penyimpanan draf saat jaringan buruk | Mengurangi pekerjaan terlewat dan membantu penggunaan HP | **Rencana**, termasuk dukungan offline/PWA |

**Catatan penamaan:** Nomor 00–14 adalah **15 modul substansi**. Kode proyek M00, M01, M02, M03, dan seterusnya merupakan **tahapan pengembangan**, bukan nomor modul pada tabel ini. Karena itu, misalnya **MOD-04 Support** dikembangkan dalam tahapan **M03 dan M04**.

### 4.1. Pengelompokan yang mudah dipahami

- **Pelayanan dan fasilitas:** Core, Profil, APEL, SDM, Support.
- **Pengawasan dan kesehatan hewan:** Obat Hewan, Klinik/Praktik, PHMS/Zoonosis, Sertifikat/Lalu Lintas.
- **Pembinaan dan administrasi:** Bimtek, dokumen kegiatan, notifikasi.
- **Informasi dan pengambilan keputusan:** Dashboard, GIS, Regulasi/Panduan/AI opsional.

---

## 5. Sistem kerja di dalam YANDIK+ (bukan urusan pemrograman)

Modul adalah **jenis pekerjaan**. Di belakang modul tersebut, YANDIK+ dirancang memiliki beberapa **sistem kerja bersama** supaya kegiatan berjalan konsisten.

### 5.1. Sistem data induk

Setiap Puskeswan mempunyai satu identitas rujukan yang tetap, dilengkapi wilayah dan informasi institusi. Profil, SDM, pelayanan dan kebutuhan merujuk ke identitas yang sama. Ini mencegah satu fasilitas mempunyai beberapa versi nama atau pengisian identitas berulang.

**Aturan:** Data yang belum diketahui ditandai *belum tersedia*, bukan dianggap berisi angka nol. Perubahan informasi penting memiliki tanggal dan sumber pembaruan.

### 5.2. Sistem pembagian peran dan kewenangan

Pekerjaan dibatasi berdasarkan fungsi dan wilayah: petugas Puskeswan mengisi data pada fasilitasnya, kabupaten/kota mengelola lingkup wilayahnya, provinsi memeriksa dan memantau sesuai penugasan, pimpinan menerima ringkasan. Akses pengawas atau pejabat penerbit dokumen dibuat sesuai kegiatan spesifik.

**Aturan:** Pengisi tidak otomatis menjadi pemeriksa, dan pemeriksa data tidak otomatis berwenang menyetujui pengadaan, pembayaran atau menerbitkan sertifikat.

### 5.3. Sistem tugas dan alur pekerjaan

Kegiatan memiliki tahapan yang dapat dibaca, misalnya **Draf → Diajukan → Diperiksa → Perlu Perbaikan / Terverifikasi → Ditindaklanjuti → Selesai**. Jenis kegiatan berbeda boleh memakai tahapan berbeda. Setiap pengembalian untuk perbaikan harus mempunyai alasan sehingga petugas tahu apa yang mesti dilakukan.

**Fungsi:** Menjawab tiga pertanyaan sederhana: *Siapa yang sedang bertugas? Apa yang belum selesai? Mengapa perlu diperbaiki?*

### 5.4. Sistem pengisian dan validasi data

Formulir disusun mengikuti pekerjaan nyata. Informasi yang sudah sah tidak diminta lagi; angka, satuan, periode, dan petunjuk pengisian dibuat jelas. Ada pilihan simpan draf sebelum dikirim.

**Contoh APEL:** Satu laporan bulanan untuk satu Puskeswan pada periode yang sama; tidak ada kegiatan dapat ditulis **0** sesuai juknis, sedangkan **belum melapor** tetap berstatus belum ada laporan. Aturan ini penting agar dashboard tidak memberikan gambaran keliru.

### 5.5. Sistem pembuktian dan kelengkapan berkas

Setiap pekerjaan yang mensyaratkan bukti dapat mempunyai daftar kelengkapan, misalnya foto kondisi sarana, catatan pemeriksaan, daftar hadir, dan dokumen pendukung. Bukti dikaitkan dengan kegiatan, periode, pembuat dan pihak yang berhak melihat.

**Batas kondisi sekarang:** Pada prototype Support, kode bukti masih **contoh metadata fiktif**, bukan unggahan maupun pemeriksaan keaslian foto/dokumen. Pengelolaan bukti riil harus dirancang dengan pengamanan dan retensi sebelum digunakan.

### 5.6. Sistem verifikasi dan perbaikan

Verifikator memeriksa kelengkapan, kesesuaian konteks, dan persyaratan. Jika ada kekurangan, data dikembalikan beserta catatan. Riwayat pengajuan lama tidak dihapus ketika diperbaiki.

**Penting:** *Terverifikasi* berarti data atau kebutuhan telah diperiksa untuk tujuan tersebut. **Bukan** berarti pejabat telah menetapkan bantuan atau pengeluaran anggaran.

### 5.7. Sistem pencatatan permasalahan dan kebutuhan

Masalah di Puskeswan dicatat terlebih dahulu, misalnya alat rusak, ruang tidak memadai, atau kekurangan BHP. Setelah diperiksa, petugas dapat membuat **usulan kebutuhan** dengan jumlah, alasan dan referensi masalah. Kebutuhan serupa diperiksa agar tidak didata berkali-kali.

Usulan yang pernah ditolak dapat diajukan kembali dengan alasan baru. Ini menjaga kesempatan bagi fasilitas yang kondisinya berubah, sekaligus mempertahankan histori.

### 5.8. Sistem penilaian prioritas yang dapat dijelaskan

Rancangan Support menggunakan faktor kondisi fasilitas, risiko gangguan pelayanan, kesulitan akses, keterbatasan SDM dan kesenjangan persediaan. **Skor tidak menggunakan jumlah pelayanan mentah sebagai ukuran utama kebutuhan.**

Setiap penilaian harus punya penjelasan dan sumber. Kabupaten/kota menilai dan provinsi dapat meninjau; usulan koreksi ditulis dengan alasan, sedangkan skor dasar dipertahankan. Bobot yang telah dikoding **masih percobaan dan belum disahkan**.

**Pengembangan M03-S4:** Rancangan perbandingan enam fasilitas fiktif di tiga variasi bobot sudah ditulis, tetapi **BELUM DIUJI** dan belum dihubungkan ke aplikasi aktif.

### 5.9. Sistem pelaksanaan, tindak lanjut dan evaluasi

Tujuan sistem bukan berhenti pada laporan. Hasil pengawasan dapat menimbulkan rekomendasi perbaikan; pembinaan memiliki catatan hasil; kebutuhan yang kelak dipenuhi dapat dinilai pemanfaatannya. Tugas yang belum selesai tetap terlihat sampai ditutup oleh pihak berwenang.

**Contoh:** Pemeriksaan menemukan tempat penyimpanan obat tidak sesuai. Temuan dicatat, ada rekomendasi dan tenggat perbaikan. Petugas kemudian memeriksa apakah perbaikan benar dilakukan. **Alur ini masih direncanakan** untuk modul pengawasan terpadu.

### 5.10. Sistem rekap dan pemantauan pimpinan

Pimpinan diharapkan dapat melihat ringkasan pelayanan, kepatuhan pelaporan, kondisi fasilitas, kebutuhan belum terselesaikan, pembinaan, serta kegiatan pengawasan. Setiap angka harus jelas **asal modul, periode, definisi, dan tingkat verifikasinya**.

Rekap tidak boleh mencampur jumlah pelayanan, jumlah kegiatan, jumlah hewan, jumlah laporan, dan jumlah fasilitas seolah-olah satu jenis angka.

### 5.11. Sistem penyusunan dokumen kerja

Data yang telah diisi dapat digunakan untuk menyiapkan **draf** laporan, rekap, surat pengantar, notulen atau berita acara. Petugas tetap dapat memeriksa narasi, lampiran dan kelengkapan sebelum disampaikan.

**Batas:** Pengesahan, tanda tangan elektronik, nomor surat resmi, pengarsipan dinas dan dokumen keuangan tetap mengikuti **SRIKANDI, tata naskah, dan prosedur/sistem resmi yang berlaku**. YANDIK+ tidak otomatis menggantikan proses itu.

### 5.12. Sistem pengingat dan pekerjaan tertunda

Pada pengembangan berikutnya, pengguna diharapkan melihat laporan yang belum dikirim, dokumen mendekati akhir masa berlaku, kegiatan pemeriksaan mendatang, dan tindak lanjut yang melewati tenggat. Pengingat dibuat relevan menurut peran dan tidak membanjiri pengguna.

### 5.13. Sistem riwayat perubahan dan pemeriksaan

Untuk data penting, dicatat perubahan dari versi sebelumnya, pelaku yang berwenang, tanggal, status, dan alasan. Ini membantu pembina, auditor, atau pemeriksa memahami perjalanan suatu pekerjaan.

**Catatan:** Jejak audit yang benar-benar tahan perubahan dan terikat pengguna resmi memerlukan pengamanan backend dan database yang **belum selesai** pada prototype.

### 5.14. Sistem panduan dan pengetahuan kerja

Juknis, SOP, contoh pengisian, pertanyaan umum dan templat diharapkan terhubung langsung ke tugas terkait. Petugas tidak perlu mencari ulang berkas di percakapan terpisah. Asisten AI **hanya opsi** untuk membantu pencarian/rangkuman/draf bila nantinya disetujui, dengan pemeriksaan manusia atas hasil.

---

## 6. Contoh perjalanan pekerjaan dari awal sampai akhir

### Contoh A. Laporan bulanan APEL Puskeswan

1. Petugas memilih bulan pelaporan dan melihat identitas Puskeswan yang sesuai.
2. Petugas mengisi jumlah kegiatan sesuai **juknis yang berlaku untuk tahun/periode tersebut**.
3. Laporan yang belum ada dibedakan dari kegiatan yang dilaporkan bernilai nol.
4. Setelah dikirim, sistem mencatat periode serta status, membantu mengecek bulan yang tertinggal.
5. Data yang sah dipakai sebagai rekap untuk provinsi/kabupaten/kota dan informasi pimpinan.
6. Jika ada revisi, perubahan dicatat; **aturan apresiasi 2026 tidak diam-diam diganti oleh rancangan 2027**.

**Kondisi:** APEL 2026 mempunyai layanan berjalan yang menjadi konteks pengembangan. Pengembangan APEL 2.0, penyatuan hak akses serta rapor lintas modul **belum selesai**.

### Contoh B. Pendingin vaksin Puskeswan rusak

1. Puskeswan mencatat masalah dan dampak pelayanan.
2. Masalah diperiksa; jika sesuai, dicatat sebagai masalah terverifikasi.
3. Petugas **memilih sendiri** membuat usulan kebutuhan barang dari masalah tersebut.
4. Usulan memuat jenis barang, jumlah, satuan, urgensi, alasan dan bukti yang dipersyaratkan.
5. Kabupaten/kota atau provinsi melakukan pemeriksaan kebutuhan menurut kewenangan.
6. Penilaian prioritas disusun secara terpisah dan dapat dikoreksi dengan alasan.
7. **Penetapan bantuan, pembelian, penyaluran dan BAST hanya terjadi setelah mekanisme resmi yang berwenang**, bukan ketika skor tinggi.
8. Setelah ada bantuan resmi, evaluasi pemanfaatan dapat menjadi bagian sistem di tahap berikut.

**Kondisi:** Langkah 1–6 telah dikembangkan **pada data simulasi/prototype** dengan beberapa batasan. Langkah 7–8 adalah **rencana proses**, bukan layanan bantuan otomatis yang sudah berjalan.

### Contoh C. Pengawasan sarana obat hewan

**Alur yang direncanakan:** data sarana → perencanaan pemeriksaan → checklist di lapangan → catatan temuan dan bukti → verifikasi → rekomendasi → tindak lanjut dan pemeriksaan ulang → rekap untuk pimpinan.

Sistem bertujuan membantu petugas bekerja dan menyimpan catatan yang saling berhubungan. **Sanksi, keputusan hukum, dan penerbitan dokumen resmi tidak dibuat otomatis**.

### Contoh D. Administrasi pembinaan

**Alur yang direncanakan:** menetapkan Puskeswan sasaran berdasarkan kebutuhan → merencanakan pembinaan → mencatat pelaksanaan, peserta, materi dan bukti → menyusun draf laporan → mencatat rekomendasi → memeriksa tindak lanjut.

Riwayat pembinaan nantinya dapat dikaitkan ke Profil serta SDM tanpa meminta identitas yang sama berkali-kali.

---

## 7. Siapa pengguna dan apa perannya?

| Pengguna | Pekerjaan utama yang dituju | Batas penting |
|---|---|---|
| **Petugas Puskeswan** | Isi data dan laporan fasilitasnya, catat masalah, ajukan kebutuhan, pantau status | Tidak bisa menyetujui alokasi bantuan sendiri |
| **Koordinator/verifikator kabupaten/kota** | Pantau fasilitas wilayahnya, periksa data, klarifikasi, berikan penilaian sesuai penugasan | Bukan pemilik data seluruh provinsi dan bukan otomatis pejabat pengesah |
| **Petugas/verifikator provinsi** | Rekap antarwilayah, verifikasi sesuai kewenangan, pembinaan, analisis kebutuhan | Verifikasi teknis tidak menggantikan keputusan administrasi/anggaran |
| **Petugas pengawasan/pembinaan** | Rencanakan kegiatan, isi checklist, rekam temuan, rekomendasi dan tindak lanjut | Akses dibatasi pada penugasan dan jenis informasi |
| **Pejabat berwenang** | Memeriksa keputusan yang memerlukan kewenangan formal dan menerbitkan/menandatangani melalui mekanisme berlaku | Keputusan harus tetap berasal dari pejabat dan proses sah |
| **Pimpinan** | Membaca indikator, kendala dan tindak lanjut untuk evaluasi | Sebaiknya ringkasan baca-saja, dengan rincian seperlunya |
| **Pengelola data/dokumen** | Menjaga mutu data, daftar referensi, versi panduan dan retensi dokumen | Tidak otomatis boleh mengubah substansi tanpa proses verifikasi |
| **Masyarakat/publik (bila disetujui)** | Melihat informasi umum yang memang boleh dipublikasikan | Tidak memperoleh akses ke data pegawai, temuan sensitif, atau dokumen internal |

**Penting:** Matriks peran di atas adalah **rancangan proses bisnis**, belum penetapan hak akses definitif. Pemisahan wewenang perlu diputuskan bersama penanggung jawab unit dan diterapkan pada pengguna resmi sebelum produksi.

## 8. Data apa yang masuk dan apa hasilnya?

| Data/sumber utama | Dipakai oleh | Keluaran yang diharapkan |
|---|---|---|
| **Identitas dan Profil Puskeswan** | Profil, SDM, APEL, Support, GIS | Satu referensi fasilitas, kondisi, kesiapan, daftar masalah |
| **Laporan APEL per bulan** | Pelaporan, rekap, dashboard | Realisasi pelayanan menurut juknis, kepatuhan pelaporan, tren |
| **Data SDM terverifikasi** | Profil, pembinaan, Support, dashboard | Tenaga tersedia/penempatan, kebutuhan pembinaan dan kapasitas |
| **Hasil pengawasan** | Obat Hewan, Klinik, pembinaan, pimpinan | Temuan, rekomendasi, tugas koreksi dan laporan kegiatan |
| **Catatan masalah dan usulan** | Support, perencanaan/pembinaan | Daftar kebutuhan yang diperiksa, alasan prioritas, status tindak lanjut |
| **Kegiatan PHMS/zoonosis dan sumber resmi** | Surveilans, GIS, laporan agregat | Koordinasi penanganan serta ringkasan menurut hak akses |
| **Permohonan dan hasil pemeriksaan dokumen** | Sertifikat/lalu lintas | Status proses dan referensi penerbitan resmi |
| **Kegiatan pembinaan dan dokumen** | Administrasi, SDM, dashboard | Laporan kegiatan, rekomendasi, riwayat tindak lanjut |

**Prinsip data penting:** Angka ditampilkan bersama satuan, periode, status verifikasi dan definisinya. Ketika data berbeda, penyelesaian dilakukan di modul sumber, bukan dengan mengedit angka dashboard agar terlihat cocok.

---

## 9. Kondisi yang telah ada dan yang masih harus dibangun

Dokumen ini membedakan **tiga hal**:

1. **Layanan yang telah ada:** APEL Puskeswan dan beberapa fungsi awal terkait portal yang sedang digunakan. Keberadaan layanan ini **tidak berarti semua 15 modul YANDIK+ sudah berjalan**.
2. **Prototype yang telah dikembangkan pada data contoh:** Fondasi/identitas data, role dan alur, bagian Profil dan Permasalahan, usulan kebutuhan Support, bukti berupa metadata DEMO, penilaian prioritas percobaan dan tinjauan. Prototype **tidak terhubung ke database produksi atau akun petugas sebenarnya**.
3. **Rencana berikutnya:** Pengawasan terpadu, sertifikat/lalu lintas, PHMS, pembinaan, administrasi, dashboard lintas modul, GIS, pengingat lapangan, integrasi dokumen resmi, serta alokasi/BAST bila kewenangannya disetujui.

**Posisi khusus M03-S4:** Telah ditulis *draft* untuk membandingkan prioritas menggunakan enam fasilitas fiktif. **Belum diuji, belum menjadi modul aktif, dan belum dapat dijadikan dasar kebijakan.**

**Penting bagi pembaca:** Keberhasilan pengujian kode prototype sebelumnya tidak membuktikan kesiapan penerapan keseluruhan sistem. Pengembangan saat ini sengaja mengutamakan dokumentasi dan penulisan kode sebelum pemeriksaan terjadwal, sesuai arahan pemilik proyek. Detailnya ada pada [Roadmap dan status terakhir](ROADMAP.md).

---

## 10. Tata kelola, pengendalian internal dan hubungan dengan SPBE

Bagian ini adalah **isu yang perlu ditelaah bersama**, bukan pernyataan bahwa seluruh persyaratan SPBE, pengadaan, keamanan, atau tata naskah telah terpenuhi.

### 10.1. Kedudukan dan koordinasi dengan Diskominfotik

YANDIK+ merupakan **pengembangan sarana kerja digital**. Walaupun tujuan utamanya membantu pelaksanaan tugas teknis, komponen yang berupa aplikasi, basis data, integrasi, layanan pengguna dan dokumen elektronik **tetap perlu dinilai dalam tata kelola SPBE serta ketentuan instansi yang berlaku**.

Sebelum penetapan penerapan resmi, perlu kejelasan mengenai:
- Pengampu proses bisnis dan penanggung jawab sistem/data.
- Apakah fungsi tertentu sudah tersedia pada aplikasi pemerintah yang wajib digunakan; hindari pembangunan layanan ganda.
- Arsitektur dan integrasi data yang sesuai kebijakan instansi, termasuk infrastruktur, pengelolaan akun, keamanan dan pencadangan.
- Mekanisme evaluasi, persetujuan, pencatatan aset digital, serta pembagian tanggung jawab operasional.
- Batas publikasi, pertukaran data, retensi, dan peran masing-masing perangkat daerah.

**Tidak tepat menyatakan YANDIK+ otomatis berada di luar SPBE hanya karena disebut alat bantu kerja.** Penilaian formal menjadi ranah pejabat/unit yang berwenang.

### 10.2. Pertanyaan pengendalian untuk Inspektorat

Pengendalian yang dirancang harus mampu menjawab:
- Siapa yang mengisi, mengubah, memeriksa, dan menyetujui setiap jenis pekerjaan?
- Apakah pelapor dapat memverifikasi usulan yang dibuat sendiri?
- Dari mana setiap angka berasal, periode apa, dan kapan diperbarui?
- Apakah alasan revisi, penolakan dan perubahan prioritas tetap terbaca?
- Apakah bukti kegiatan benar ada dan dapat diakses hanya oleh pemeriksa berwenang?
- Apakah hasil verifikasi secara keliru dipersepsikan sebagai persetujuan anggaran?
- Bagaimana konflik data, usulan berulang, informasi kedaluwarsa dan kesalahan input diperbaiki?
- Siapa menandatangani dokumen resmi dan pada sistem apa?
- Apakah pengembangan, pengadaan dan operasional mengikuti prosedur dan penganggaran yang sah?

**Status:** Konsep kontrol sudah ditulis dan sebagian disimulasikan pada prototype. **Belum dapat diklaim sebagai sistem pengendalian internal yang sudah berjalan penuh**.

### 10.3. Pemisahan tugas dan keputusan

YANDIK+ membedakan:
1. **Pencatatan:** menulis kondisi/kegiatan.
2. **Verifikasi:** memeriksa kebenaran dan kelengkapan dalam batas penugasan.
3. **Penilaian/rekomendasi:** menyiapkan bahan pertimbangan yang dapat ditelusuri.
4. **Penetapan:** keputusan pejabat berwenang mengikuti mekanisme resmi.
5. **Pelaksanaan dan pertanggungjawaban:** distribusi, tanda terima, pembayaran dan dokumen melalui proses yang berlaku.
6. **Evaluasi:** memantau hasil, masalah dan tindak lanjut.

Sistem dapat membantu pencatatan dan peringatan, tetapi **tidak mengambil alih akuntabilitas setiap tahap**.

### 10.4. Keamanan dan perlindungan data

Sasaran kontrol meliputi pembatasan akses berdasarkan tugas/wilayah, pembatasan data pegawai dan pemilik hewan, pencatatan perubahan, perlindungan bukti/dokumen, serta persetujuan publikasi. Data sensitif tidak dibuka di dashboard umum.

Dokumen ini **tidak memuat kata sandi, data pribadi, hasil pemeriksaan rahasia, rincian keuangan, ataupun kerentanan teknis**. Sebelum penerapan resmi tetap diperlukan kajian keamanan dan pengaturan penyimpanan, pencadangan, pemulihan, serta retensi.

### 10.5. Hubungan dengan sistem resmi lain

| Sistem/proses yang telah memiliki kewenangan | Kedudukan YANDIK+ yang dituju |
|---|---|
| **iSIKHNAS** | Referensi atau analisis sesuai hak akses dan izin integrasi; tidak membuat pelaporan kasus ganda sebagai pengganti sistem sumber |
| **SRIKANDI/persuratan** | Menyiapkan bahan/draf dan referensi kegiatan; surat resmi, tanda tangan dan arsip mengikuti sistem/prosedur resmi |
| **OSS/perizinan dan registrasi berwenang** | Mendukung register dan pemeriksaan data; tidak menerbitkan izin tandingan |
| **Sistem pengadaan, keuangan dan SPJ** | Membantu pencatatan kebutuhan/monitoring; tidak membuat persetujuan anggaran, transaksi atau bukti pembayaran otomatis |
| **Kepegawaian dan basis data SDM resmi** | Menggunakan referensi sesuai kewenangan; tidak membuat data kepegawaian paralel sebagai sumber hukum |
| **Laboratorium/sertifikasi dan penerbitan dokumen** | Mengelola informasi pengantar/status sesuai izin; hasil resmi tetap berasal dari institusi berwenang |

Integrasi teknis dan pertukaran data baru boleh disusun setelah dasar kewenangan, mutu data, dan pengamanan disepakati.

### 10.6. Posisi AI dan kebutuhan biaya

**YANDIK+ tidak mensyaratkan pembelian token AI untuk menjalankan fungsi dasar** seperti pendataan, checklist, verifikasi, rekap dan penyusunan template terstruktur. AI dapat menjadi **opsi pendukung** untuk pencarian panduan, rangkuman, dan penyusunan draf setelah disetujui.

Jika kelak diusulkan biaya layanan AI, hosting, integrasi atau operasional, kebutuhan, keluaran, cara pembelian, pembebanan dan dasar penganggarannya perlu dijelaskan **secara terpisah**. Dokumen ini **bukan permohonan persetujuan belanja** dan tidak menilai legalitas satuan biaya tertentu.

---

## 11. Bagaimana keberhasilannya kelak diukur?

Ukuran keberhasilan perlu ditetapkan bersama dan diuji sebelum menetapkan target angka:

| Aspek | Contoh ukuran yang dapat diperiksa |
|---|---|
| **Kelengkapan data** | Persentase Puskeswan dengan profil yang terverifikasi dan tanggal pembaruan jelas |
| **Kepatuhan pelaporan** | Jumlah fasilitas yang melapor menurut periode, ketepatan waktu, dan bulan belum terisi |
| **Kemudahan kerja** | Waktu untuk mengisi satu laporan/mengajukan kebutuhan, jumlah isian ulang yang dapat dihapus |
| **Kualitas verifikasi** | Proporsi usulan yang harus dikoreksi, alasan koreksi jelas, waktu penyelesaian |
| **Tindak lanjut** | Persentase temuan/pembinaan yang memiliki status dan bukti penyelesaian |
| **Mutu laporan pimpinan** | Konsistensi angka dashboard dengan sumber, tanggal pembaruan dan penjelasan indikator |
| **Keadilan dukungan** | Kemampuan menilai fasilitas terpencil/SDM terbatas dengan indikator yang dibuktikan, bukan semata jumlah pelayanan |
| **Perlindungan data** | Ketepatan hak akses, pembatasan dokumen dan pemeriksaan histori perubahan |

Angka capaian dan besarnya manfaat **tidak dicantumkan sebagai fakta** sebelum tersedia data pengukuran yang sah.

## 12. Pelaksanaan bertahap

**Tahap 1. Inventarisasi proses dan sumber data.** Mendata alur kerja riil, juknis, hak akses, aturan resmi, modul yang sudah ada, serta kebutuhan pengintegrasian.

**Tahap 2. Penyusunan rancangan dan contoh kerja.** Membangun model data, contoh formulir, alur verifikasi, rekap serta dokumen kebijakan dengan data fiktif. Saat ini sebagian pekerjaan berada pada tahap ini.

**Tahap 3. Peninjauan tata kelola.** Membahas batas SPBE dengan Diskominfotik, fungsi pengendalian bersama Inspektorat dan kewenangan proses dengan pimpinan/pemilik layanan.

**Tahap 4. Pengujian sebelum penerapan.** Melibatkan petugas Puskeswan yang benar-benar menggunakan HP, menguji jaringan lambat, hak akses, ketepatan angka dan dokumen, serta mengevaluasi data yang tidak lengkap.

**Tahap 5. Penerapan terbatas yang disetujui.** Hanya setelah ada keputusan tata kelola, infrastruktur, keamanan, pendanaan yang diperlukan, dan rencana pemulihan apabila terjadi masalah.

**Tahap 6. Evaluasi dan perluasan bertahap.** Menilai manfaat, kesalahan, duplikasi, beban petugas dan risiko; modul ditambah atau direvisi secara terdokumentasi.

**Perhatian:** Tahapan ini merupakan *usulan urutan kerja*, bukan jadwal atau mandat implementasi yang sudah disahkan.

## 13. Hal yang diharapkan dari pembahasan dengan pimpinan dan unit terkait

| Pihak | Pokok masukan/keputusan yang dibutuhkan |
|---|---|
| **Pimpinan DPKH** | Penetapan arah kebutuhan, prioritas modul, pemilik proses, batas penugasan, dan persetujuan studi/validasi lanjutan |
| **Kabupaten/kota dan Puskeswan** | Validasi pekerjaan sehari-hari, kamus data, kesulitan pengisian, alur verifikasi, kebutuhan HP/jaringan |
| **Inspektorat** | Telaah jejak bukti, pemisahan tugas, pengendalian revisi/keputusan, ruang lingkup pertanggungjawaban |
| **Diskominfotik/pengelola SPBE** | Telaah kedudukan sistem, kesesuaian arsitektur/interoperabilitas, pengamanan, pembagian pengelolaan, dan kebutuhan koordinasi SPBE |
| **Pejabat/penanggung jawab dokumen dan anggaran** | Penetapan titik keputusan resmi, sistem penerbitan dokumen, batas bantuan, pengadaan dan BAST |

Tidak ada permintaan untuk mengesahkan seluruh fitur sekaligus. Justru rancangan dibuat **dapat diubah, ditambah atau dihentikan per modul** setelah masukan.

## 14. Tanya jawab singkat

**Apakah YANDIK+ sudah menjadi aplikasi lengkap yang dapat digunakan semua petugas?**  
Belum. Beberapa fungsi awal, terutama APEL, memiliki layanan yang telah berjalan. YANDIK+ sebagai sistem terpadu masih berkembang dan sebagian besar modul merupakan rencana.

**Apakah YANDIK+ mengganti iSIKHNAS atau SRIKANDI?**  
Tidak dirancang untuk itu. Penggunaan data dan tautan proses mengikuti persetujuan serta kewenangan sistem sumber.

**Apakah penilaian prioritas otomatis menentukan penerima bantuan?**  
Tidak. Skor merupakan rancangan bahan pertimbangan yang bisa ditinjau dan dikoreksi. Keputusan bantuan, anggaran dan penyaluran adalah proses terpisah.

**Apakah YANDIK+ hanya alat bantu sehingga tidak perlu ditelaah dari sisi SPBE?**  
Tidak boleh disimpulkan demikian. Komponen digital dan integrasinya perlu dikaji bersama pengampu SPBE sesuai fungsi dan ketentuan yang berlaku.

**Apakah seluruh data dapat dibuka kepada pimpinan atau masyarakat?**  
Tidak. Ringkasan, rincian dan data sensitif harus dibedakan menurut tujuan dan kewenangan.

**Apakah pengembangan ini membutuhkan langganan AI berbayar?**  
Tidak untuk fungsi dasarnya. AI hanya opsi yang memerlukan kajian manfaat, biaya dan perlindungan data tersendiri.

**Apakah dokumen ini berarti anggaran pembangunan atau pengadaan telah disetujui?**  
Tidak. Naskah ini menjadi **bahan pemahaman dan telaah**, bukan dasar tunggal untuk melakukan pengeluaran.

---

## 15. Istilah yang perlu dipahami

| Istilah | Arti sederhana |
|---|---|
| **Modul** | Kelompok pekerjaan, misalnya APEL, Profil atau Pengawasan Obat |
| **Data induk** | Informasi acuan utama, seperti satu identitas Puskeswan |
| **Alur kerja** | Urutan tindakan dan siapa yang mengerjakannya |
| **Draf** | Data belum dikirim untuk pemeriksaan |
| **Verifikasi** | Pemeriksaan menurut kewenangan, bukan selalu persetujuan akhir |
| **Tindak lanjut** | Pekerjaan setelah hasil pemeriksaan, temuan atau rekomendasi |
| **Jejak perubahan** | Riwayat apa yang diubah, kapan dan oleh siapa |
| **Dashboard** | Ringkasan data dan keadaan pekerjaan untuk dibaca |
| **APEL** | Program/layanan pelaporan dan apresiasi pelayanan Puskeswan dalam lingkup pengembangan ini |
| **BAST** | Berita Acara Serah Terima, sesuai proses dan kewenangan yang berlaku |
| **Prototype** | Contoh cara kerja untuk dikaji, bukan layanan resmi siap pakai |
| **Belum diuji** | Kode/rancangan tersedia, namun belum ada bukti pengujian terhadap perubahan tersebut |
| **SPBE** | Sistem Pemerintahan Berbasis Elektronik, dengan tata kelola yang perlu dikoordinasikan |
| **AI opsional** | Bantuan kecerdasan buatan yang bukan syarat agar pendataan, verifikasi dan rekap dapat bekerja |

---

## 16. Referensi dan pengendalian dokumen

Dokumen ini dirangkum dari dokumen internal pengembangan: [Masterplan](MASTERPLAN.md), [Katalog Modul](MODULES_INDEX.md), [Standar kemudahan pengguna](UX_PAPERLESS.md), [Rancangan alur kerja](WORKFLOW_ENGINE.md), [Batas keamanan dan data](SECURITY_AND_DATA.md), serta [ROADMAP](ROADMAP.md). Ketentuan operasional dan aturan penilaian yang berlaku **tetap merujuk juknis/peraturan resmi**, bukan dokumen pengenalan ini.

**Catatan versi:** Setiap perubahan substansial pada lingkup modul, alur persetujuan, kedudukan SPBE atau status implementasi perlu dicatat di dokumen ini dan [riwayat perubahan proyek](CHANGELOG_ROADMAP.md). Untuk melihat progres terbaru, gunakan [PROJECT_STATE](../PROJECT_STATE.md).

**Penegasan penutup:** YANDIK+ diusulkan untuk memudahkan pekerjaan teknis dan membuat proses lebih tertelusur. Pengembangan fungsi digital, pemrosesan data, penggunaan anggaran dan keputusan resmi **tetap membutuhkan persetujuan serta pengendalian sesuai kewenangan masing-masing**.
