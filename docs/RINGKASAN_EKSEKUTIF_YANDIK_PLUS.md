# YANDIK+ | RINGKASAN EKSEKUTIF
### Pengembangan Sistem Kerja Terpadu Pelayanan dan Kesehatan Hewan

**Dinas Peternakan dan Kesehatan Hewan Provinsi Sumatera Barat**  
**Dokumen konsep untuk pembahasan pimpinan dan telaah perangkat daerah terkait**  
**Draf revisi 1.1 | 11 November 2026**

> **Pokok usulan:** Mengembangkan YANDIK+ secara bertahap sebagai sarana kerja digital yang menghubungkan pendataan, pelayanan, pengawasan, pembinaan, dan tindak lanjut kesehatan hewan. Pelaksanaannya memerlukan penataan proses bisnis, pengendalian data, koordinasi tata kelola SPBE, serta **dukungan AI Agent sebagai sarana bantu pengembangan sistem**. AI Agent membantu tim membangun dan menyempurnakan sistem; **tidak menggantikan pejabat, tenaga teknis, atau prosedur pengesahan resmi**.

## 1. Latar Belakang dan Kebutuhan

Penyelenggaraan pelayanan dan kesehatan hewan melibatkan Puskeswan, perangkat daerah kabupaten/kota, serta provinsi. Data profil fasilitas, sumber daya manusia, kegiatan pelayanan, pengawasan sarana, pembinaan, dan kebutuhan operasional masih berpotensi tercatat pada beberapa formulir, dokumen, atau media kerja yang terpisah.

Kondisi ini menimbulkan kebutuhan untuk meningkatkan konsistensi data, mengurangi pengisian berulang, mempermudah penyusunan laporan, dan memastikan setiap temuan atau usulan dapat ditelusuri sampai tahap tindak lanjut. Selain itu, keterbatasan sumber daya pengembangan mendorong perlunya metode pembangunan sistem yang bertahap, hemat sumber daya, dan tetap dapat dikendalikan.

**YANDIK+ diusulkan sebagai sarana pendukung pelaksanaan tugas**, bukan untuk membentuk kewenangan baru atau menggantikan aplikasi resmi yang telah ditetapkan.

## 2. Tujuan Pengembangan

Pengembangan YANDIK+ diarahkan untuk:

1. **Mengintegrasikan informasi kerja** melalui satu identitas rujukan Puskeswan dan penggunaan kembali data sesuai kewenangan.
2. **Memperkuat tertib administrasi dan akuntabilitas** dengan status pekerjaan, bukti pendukung, riwayat perbaikan, serta pemisahan pihak pengisi dan pemeriksa.
3. **Mendukung pelayanan dan pembinaan berbasis kebutuhan** dengan menghubungkan kondisi fasilitas, hasil pelayanan, permasalahan, dan rekomendasi tindak lanjut.
4. **Menyediakan informasi manajerial** yang jelas sumber, periode, definisi, dan status verifikasinya.
5. **Memudahkan petugas lapangan** melalui rancangan penggunaan ponsel, formulir sederhana, dan pengurangan pekerjaan berulang.

Manfaat tersebut merupakan **sasaran yang akan diukur**, bukan klaim hasil efisiensi yang telah diverifikasi.

## 3. Ruang Lingkup Sistem

YANDIK+ dirancang dalam **15 modul** yang dikelompokkan ke dalam fungsi berikut.

| Kelompok fungsi | Ruang lingkup yang direncanakan | Hasil kerja yang dituju |
|---|---|---|
| **Data dasar dan pelayanan** | Pengelolaan identitas fasilitas, Profil Puskeswan, APEL Puskeswan, dan SDM veteriner | Data induk, laporan pelayanan, kondisi fasilitas, serta informasi ketersediaan tenaga |
| **Kebutuhan dan dukungan layanan** | Pencatatan masalah, usulan kebutuhan, verifikasi, penilaian prioritas, dan pemantauan tindak lanjut | Dasar informasi untuk pembinaan dan pertimbangan kebutuhan secara lebih tertelusur |
| **Pengawasan dan kesehatan hewan** | Pengawasan obat hewan, klinik/praktik dokter hewan, PHMS/zoonosis, serta sertifikat veteriner dan lalu lintas | Catatan pemeriksaan, rekomendasi, pemantauan, dan referensi administrasi sesuai kewenangan |
| **Pembinaan dan administrasi** | Pembinaan/Bimtek, dokumen kegiatan, daftar tugas, dan notifikasi | Rekam kegiatan, laporan kerja, pengingat, dan pemantauan penyelesaian |
| **Informasi dan dukungan pengetahuan** | Dashboard pimpinan, peta wilayah/GIS, regulasi, panduan, dan fungsi bantuan informasi | Informasi untuk evaluasi serta akses panduan kerja yang lebih seragam |

Seluruh fungsi menggunakan **mekanisme bersama** berupa pembagian hak akses, status pekerjaan, pemeriksaan kelengkapan, verifikasi, riwayat perubahan, dan pelacakan tindak lanjut.

**Contoh proses:** Kerusakan alat pada Puskeswan dicatat sebagai permasalahan → diperiksa oleh petugas berwenang → dapat menjadi usulan kebutuhan → dinilai dan ditelaah berdasarkan alasan serta bukti → ditindaklanjuti sesuai keputusan dan prosedur yang berlaku. **Verifikasi kebutuhan maupun skor prioritas tidak sama dengan persetujuan bantuan, pengadaan, atau anggaran.**

## 4. Dukungan AI Agent untuk Pengembangan YANDIK+

### 4.1. Kedudukan dan kebutuhan

Dalam metode pengembangan yang diusulkan, **AI Agent menjadi salah satu sarana kerja yang dibutuhkan untuk mempercepat pembangunan dan penyempurnaan YANDIK+ secara bertahap**, terutama ketika kapasitas pengembangan internal terbatas dan kebutuhan modul cukup luas.

**AI Agent pengembangan berbeda dari chatbot untuk pengguna layanan.** Chatbot umumnya berfungsi menjawab pertanyaan; AI Agent pengembangan digunakan oleh tim yang ditugaskan untuk membantu mengerjakan tahapan teknis secara terarah, seperti menyiapkan rancangan, menghasilkan dan memperbaiki kode, menelusuri keterkaitan modul, menyusun dokumentasi, serta membantu menyiapkan pemeriksaan kualitas. Hasilnya tetap memerlukan **penilaian dan pengesahan manusia**.

| Peran AI Agent dalam pengembangan | Keluaran yang dapat diperiksa |
|---|---|
| Menjabarkan kebutuhan kerja menjadi rancangan modul dan alur pengguna | Rancangan proses, daftar kebutuhan fitur, dan spesifikasi |
| Membantu penulisan serta penyempurnaan komponen sistem | Perubahan kode yang terdokumentasi dan dapat ditinjau |
| Membantu penataan hubungan antarbagian dan migrasi data secara terkendali | Pemetaan data, catatan perubahan, dan rencana integrasi |
| Membantu penyusunan dokumentasi, petunjuk penggunaan, serta bahan telaah | Naskah, panduan, dan riwayat pengembangan |
| Membantu identifikasi masalah serta menyiapkan skenario pemeriksaan | Daftar temuan dan rencana pengujian yang dapat diverifikasi |

Penggunaan AI Agent **bukan pengganti pengembang yang bertanggung jawab, bukan bukti bahwa kode telah diuji, dan bukan dasar untuk melakukan perubahan otomatis pada sistem produksi**.

### 4.2. Bentuk kebutuhan layanan dan pembiayaan

AI Agent pengembangan pada umumnya memerlukan **akses ke layanan model AI melalui kredit/token atau kuota pemakaian**, yang konsumsinya bergantung pada volume pekerjaan. Mekanisme ini **berbeda dari langganan chatbot dengan biaya tetap**, dan kebutuhan kredit dapat muncul kembali selama kegiatan pengembangan, perbaikan, dokumentasi, maupun pemeliharaan.

Untuk itu, dibutuhkan **telaah penyediaan akses dan kuota pemakaian AI Agent**, termasuk kemungkinan mekanisme pembelian di muka atau isi ulang (*prepaid/top-up*) jika sesuai dengan ketentuan penganggaran dan pengadaan. Pemilihan penyedia, satuan belanja, komponen standar harga, besaran biaya, serta bukti pertanggungjawaban **belum ditetapkan melalui dokumen ini**.

Pengendalian yang diusulkan mencakup batas penggunaan, catatan konsumsi kredit, pembatasan akses anggota tim, peninjauan keluaran, serta pembandingan keluaran terhadap biaya. **Tidak ada ketergantungan yang harus ditetapkan pada satu merek atau penyedia.**

### 4.3. Pemisahan dari layanan operasional YANDIK+

**Fungsi dasar YANDIK+ tidak harus memanggil layanan AI berbayar setiap kali petugas mengisi data, melapor, memverifikasi, atau membuka dashboard.** Kebutuhan AI Agent yang dijelaskan di sini terutama merupakan **dukungan pada proses pembangunan dan pengembangan sistem**. Apabila pada masa mendatang AI ditambahkan sebagai fitur untuk pengguna, kebutuhan, risiko, akses data, dan biayanya harus dibahas secara terpisah.

Kode, data, dan dokumen yang diproses dengan bantuan AI Agent wajib mengikuti persetujuan akses serta pembatasan informasi. **Data pribadi, kredensial, berkas rahasia, dan data produksi tidak boleh diserahkan ke layanan eksternal tanpa dasar, pengamanan, dan persetujuan yang sesuai.**

## 5. Kondisi Pengembangan dan Tahapan Pelaksanaan

| Kondisi | Penjelasan |
|---|---|
| **Layanan yang telah berjalan** | APEL Puskeswan mempunyai layanan daring awal sebagai salah satu sumber pengalaman pengembangan. |
| **Prototype yang telah disusun** | Model data dasar, Profil, pencatatan masalah, usulan kebutuhan, beberapa alur verifikasi, dan penilaian prioritas menggunakan data simulasi. **Belum terintegrasi dengan pengguna dan basis data produksi.** |
| **Rancangan baru yang belum diuji** | Perbandingan prioritas fasilitas menggunakan contoh data fiktif; belum digunakan sebagai dasar pengambilan keputusan. |
| **Modul yang masih direncanakan** | Pengawasan terpadu, PHMS, sertifikat/lalu lintas, pembinaan, dashboard lintas modul, GIS, notifikasi, serta administrasi bantuan/BAST sesuai kewenangan. |

Tahapan yang diusulkan meliputi: penyepakatan kebutuhan dan proses bisnis → pengembangan modul prioritas dengan dukungan AI Agent → telaah tata kelola dan keamanan → pengujian pengguna dan kesesuaian data → penerapan terbatas setelah persetujuan → evaluasi dan pengembangan lanjutan.

**Dokumen ini tidak menyatakan YANDIK+ terpadu telah siap dioperasikan.**

## 6. Tata Kelola dan Pengendalian

**Pimpinan perangkat daerah** diperlukan untuk menetapkan arah, prioritas, penanggung jawab proses dan data, serta pengendalian pelaksanaan.

**Inspektorat** diharapkan dapat memberikan masukan mengenai pemisahan tugas, kelengkapan bukti, pengendalian perubahan, ketertelusuran rekomendasi, serta pertanggungjawaban penggunaan sumber daya pengembangan, termasuk AI Agent apabila diadakan.

**Diskominfotik/pengelola SPBE** diharapkan memberikan telaah mengenai kesesuaian pengembangan dengan kebijakan SPBE, arsitektur dan integrasi sistem, keamanan informasi, pengelolaan akses, serta kebutuhan pengelolaan infrastruktur.

YANDIK+ **tidak dimaksudkan menggantikan iSIKHNAS, SRIKANDI, sistem perizinan, kepegawaian, atau pengadaan/keuangan resmi**. Kedudukan dan integrasinya perlu ditentukan oleh pihak yang berwenang. Penyebutan sebagai *sarana kerja* tidak dengan sendirinya mengecualikan pengembangan dari tata kelola SPBE.

## 7. Arahan yang Diharapkan

Pada tahap ini, diperlukan **masukan dan arahan** mengenai:

1. **Persetujuan arah kajian** pengembangan YANDIK+ secara bertahap berdasarkan kebutuhan pelayanan dan kesehatan hewan.
2. **Penetapan prioritas modul serta penanggung jawab** proses bisnis, pengelolaan data, dan peninjauan hasil.
3. **Koordinasi telaah SPBE dan pengendalian internal** sebelum penerapan lebih luas.
4. **Penelaahan kebutuhan sarana pengembangan**, termasuk akses AI Agent berbasis kredit/token/kuota pemakaian, kesesuaian mekanisme pembiayaan dan pertanggungjawaban.
5. **Rencana evaluasi** yang mengukur manfaat, ketepatan informasi, beban petugas, dan keamanan sebelum implementasi resmi.

**Penegasan:** Ringkasan ini merupakan **bahan pertimbangan awal**, bukan persetujuan pengadaan, pengesahan anggaran, penetapan aplikasi baru, atau pernyataan bahwa seluruh persyaratan tata kelola telah dipenuhi.

---

**Dokumen pendukung:** [Pengenalan Lengkap YANDIK+](PENGENALAN_YANDIK_PLUS.md) · [Katalog 15 Modul](MODULES_INDEX.md) · [Roadmap Pengembangan](ROADMAP.md)

**Status naskah:** Draf untuk telaah internal. Repositori GitHub saat ini bersifat **private**; penyampaian kepada pihak lain mengikuti ketentuan akses dan tata naskah instansi.
