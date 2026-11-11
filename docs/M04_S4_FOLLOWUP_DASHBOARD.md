# M04-S4 | Dashboard Antrean Tindak Lanjut Administratif

**Kedudukan:** KODE DITULIS, **BELUM DIUJI**, bukan aplikasi produksi.  
**Tanggal rancangan:** 11 November 2026 (WIB)  
**Jenis keluaran:** rekap dan daftar antrean kerja administratif **baca-saja** dari data fiktif M04-S3.  
**Lokasi kode:** [direktori M04-S4](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard) · [commit](https://github.com/dvoriano/yandik-plus/commit/a2bcc8ef931c0c0363bb92efd0d2d75671d447ef).

## 1. Tujuan

M04-S4 dirancang untuk memberi gambaran cepat mengenai **pekerjaan administratif mana yang masih terbuka, apa yang dikembalikan untuk perbaikan, siapa penanggung jawabnya, dan kapan tugas direncanakan**.

Dashboard ini **tidak** memantau keputusan bantuan atau realisasi anggaran. Tugas yang dinyatakan `ditutup_administratif` hanya menandakan **catatan kerja selesai ditelaah dalam simulasi**, bukan bukti dokumen asli, keputusan pejabat, pembelian atau penyaluran bantuan.

## 2. Asal data dan hubungan antartahap

| Tahap | Informasi | Batas |
|---|---|---|
| M03 | Masalah dan usulan kebutuhan fiktif, prioritas indikatif | Bukan dasar persetujuan otomatis |
| M04-S1 | Berkas administrasi untuk bahan pertimbangan | Bukan keputusan pejabat |
| M04-S2 | **Metadata referensi** dokumen yang diklaim terbit di luar sistem | Bukan keaslian/keberlakuan hukum dokumen |
| M04-S3 | Catatan pekerjaan klarifikasi dan penyiapan informasi | Penutupan catatan bukan penerbitan SK/bantuan |
| **M04-S4** | **Ringkasan antrean administratif baca-saja** dari M04-S3 | Tidak mengubah status atau menugaskan petugas |
| **M04-S5** | Pencatatan kendala dan eskalasi administratif pada tugas M04-S3 | **KODE DITULIS, BELUM DIUJI**, bukan approval atau disposisi dinas |
| **M04-S6+** | Proses resmi, paket, distribusi, BAST dan evaluasi | **RENCANA**, hanya berdasarkan kewenangan dan dasar yang sah |

**Sumber yang digunakan untuk contoh:** delapan tugas dari dua referensi dokumen fiktif. Data disusun menggunakan fungsi rancangan M04-S1, S2 dan S3. Data sumber **tidak disalin dari Puskeswan, dokumen pejabat atau database sungguhan**.

## 3. Indikator yang direncanakan

| Indikator | Definisi |
|---|---|
| **Seluruh tugas** | Banyaknya tugas DEMO yang ada sebelum filter |
| **Tugas aktif** | Status apa pun kecuali `ditutup_administratif` dan `dibatalkan` |
| **Perlu perbaikan** | Tugas berstatus `perlu_perbaikan` |
| **Menunggu telaah** | Tugas berstatus `menunggu_telaah` |
| **Lewat tanggal rencana** | **Tugas aktif** dengan tanggal rencana DEMO sebelum tanggal acuan yang dipilih |
| **Jatuh tempo pada tanggal acuan** | **Tugas aktif** dengan tanggal rencana sama dengan tanggal acuan |
| **Sumber berubah** | Tugas yang referensi M04-S2/M04-S1 berbeda dari snapshot ketika dibuat. Tugas aktif ditampilkan terpisah |
| **Ditutup administratif** | Catatan tugas ditelaah, bukan realisasi bantuan |
| **Dibatalkan** | Rencana tugas DEMO dibatalkan dengan alasan |

**Tidak dihitung:** jumlah barang disalurkan, nilai anggaran, dana dicairkan, penerima disetujui, BAST sah, persentase pengadaan atau status dokumen terverifikasi hukum.

### Aturan tanggal dan klasifikasi perhatian

- Tanggal acuan **diisi secara eksplisit** pada filter. Pada contoh awal dipakai 11 November 2026 dan diberi label DEMO, bukan mengambil jam server maupun menggambarkan keadaan sebenarnya.
- Tugas `ditutup_administratif` atau `dibatalkan` **tidak dihitung terlambat sebagai tugas aktif**.
- Urutan perhatian untuk daftar: **sumber berubah → lewat tanggal rencana → perlu perbaikan → menunggu telaah → jatuh tempo pada tanggal acuan → lainnya → ditutup → dibatalkan**.
- Indikator **sumber berubah**, **perlu perbaikan** dan **lewat tanggal rencana** merupakan sifat berbeda yang dapat terjadi bersamaan. *Label perhatian utama* hanya satu sesuai urutan di atas; **angka keseluruhan dihitung masing-masing**. Dengan demikian, jumlah kelompok perhatian utama tidak boleh diasumsikan sama dengan jumlah setiap indikator terpisah.
- Tanggal yang melewati rencana **bukan temuan kinerja petugas**. Makna hukum/SOP tenggat belum ditetapkan.

## 4. Filter dan tampilan

| Filter | Cara baca |
|---|---|
| **Tanggal acuan** | Acuan untuk menentukan jatuh tempo/terlewat dalam data DEMO |
| **Status tugas** | Seluruh status atau salah satu status M04-S3 |
| **Perhatian utama** | Berdasarkan urutan klasifikasi indikator pada bagian 3 |
| **Penanggung jawab DEMO** | Kode contoh, bukan akun pengguna terautentikasi |

**Ringkasan indikator di bagian atas tetap menghitung seluruh tugas sebelum filter.** Bagian daftar menunjukkan **jumlah yang tampil setelah filter**, dan teks rekap mencatat keduanya agar pembaca tidak salah menyimpulkan.

Bila tidak ada data yang cocok, daftar dapat menampilkan keterangan kosong. Teks rekap disediakan **baca-saja**, dapat dipilih/disalin manual, dan tidak disimpan maupun dikirim ke sistem lain.

## 5. Perlindungan, kewenangan, dan keterbatasan

1. **Dashboard baca-saja.** Tidak ada tombol menyetujui berkas, membuat anggaran, memberi instruksi dinas, memilih penerima, menerbitkan surat, menugaskan ulang, mencairkan dana, mengirim barang, atau BAST.
2. **Identitas fiktif.** Peran dan petugas berawalan `DEMO-`; itu bukan autentikasi, otorisasi wilayah, atau bukti pekerjaan.
3. **Hanya metadata referensi.** Status `metadata_tercatat` di M04-S2 tidak menyatakan keputusan pejabat asli atau sah. Dashboard tidak boleh menaikkan status sumber.
4. **Seluruhnya di memori browser.** Tanpa API/DB/pencadangan/jejak audit permanen. Seluruh catatan hilang saat halaman dimuat ulang.
5. **Konsistensi sumber.** Rancangan mengandalkan sumber M04-S3 beserta pemeriksaan perubahan referensi; belum dilakukan audit keamanan atau uji penanganan perubahan.
6. **Pengembangan dan tata kelola.** Sebelum penggunaan nyata, perlu persetujuan proses bisnis, otorisasi dan pembatasan data, pengujian HP, ketepatan pengelompokan, audit permanen dan telaah SPBE.

## 6. Berkas sumber

| Berkas | Fungsi |
|---|---|
| [`dashboard.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard/dashboard.mjs) | Rekap status, perhatian, tanggal acuan, filter, sortir, teks ringkasan |
| [`fixtures.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard/fixtures.mjs) | Delapan tugas dan dua rujukan dokumen yang sepenuhnya fiktif |
| [`main.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard/main.mjs) | Hubungan model ke tampilan, filter dan rekap baca-saja |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard/index.html) | Struktur dashboard dan tabel daftar |
| [`style.css`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard/style.css) | Desain responsif **yang belum diuji** |
| [`README.md`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard/README.md) | Batasan dan petunjuk rancangan |

**Bukti penulisan:** [GitHub commit](https://github.com/dvoriano/yandik-plus/commit/a2bcc8ef931c0c0363bb92efd0d2d75671d447ef). **Tidak ada bukti kelulusan tes untuk kode ini**.

## 7. Pemeriksaan tertunda

- [ ] Kesesuaian impor rantai M04-S1 → S2 → S3 → S4 dan keutuhan fixture.
- [ ] Indikator semua status, aktif/tertutup, kasus sumber berubah dan tanggal terlewat.
- [ ] Waktu pembanding bergantung pada tanggal acuan eksplisit, bukan jam server.
- [ ] Filter status, kategori perhatian dan pemilik tugas DEMO; total sebelum dan sesudah filter.
- [ ] Tugas yang sudah ditutup/dibatalkan tidak dianggap terlambat aktif.
- [ ] Kombinasi beberapa indikator perhatian tidak menyebabkan salah hitung atau klaim kebijakan.
- [ ] Hanya teks baca-saja; tidak ada tombol mutasi/approval, data asli atau kebocoran kredensial.
- [ ] Aksesibilitas tabel, form, pesan kosong, HP 320/375 px, keyboard dan pembaca layar.
- [ ] Kualitas sumber, peran resmi, SOP tenggat/riwayat, retensi, keamanan dan tata kelola SPBE.

**Daftar terpadu:** [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Semua item teknis baru **BELUM DIUJI** sesuai keputusan pemilik proyek.

## 8. Status dan arah kelanjutan

- **M04-S1/S2/S3/S4:** kode draft **SEDANG / BELUM DIUJI**, belum terhubung produksi.
- **M04-S5:** pencatatan kendala dan eskalasi administratif di [drafts/m04-admin-escalations/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations), **KODE BELUM DIUJI**. Tidak ada keterhubungan otomatis dengan dashboard ini.
- **M04-S6+** yang mencakup keputusan resmi, paket dan distribusi, BAST serta evaluasi: **RENCANA**, tidak diimplementasikan di dashboard.
- **Sesi berikut yang dapat dikerjakan tanpa CL/CI:** melanjutkan contoh rancangan *daftar kendala/eskalasi administratif* untuk koordinasi lintas peran. Isi dapat diperbaiki kemudian setelah pemilik proses menilai kesesuaiannya, sambil menjaga pembatasan keputusan resmi.
