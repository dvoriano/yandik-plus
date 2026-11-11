# M04-S3 | Rencana Tindak Lanjut Administratif atas Referensi Eksternal

**Kedudukan:** KODE DITULIS, **BELUM DIUJI**, belum digunakan petugas secara resmi.  
**Tanggal:** 11 November 2026 (WIB)  
**Sumber:** metadata M04-S2 dari dokumen **yang diklaim telah terbit di luar YANDIK+**, bukan dokumen terverifikasi.  
**Berkas:** [drafts/m04-admin-followup](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup) · [commit awal](https://github.com/dvoriano/yandik-plus/commit/805a052a11a7ceddeb5efdf382d209b344f03825) · [perbaikan kontrol formulir](https://github.com/dvoriano/yandik-plus/commit/b4041ee90d70dd3505591531f508ba0ce8d01d54).

## 1. Tujuan dan batas kewenangan

M04-S3 dirancang untuk **menata pekerjaan administrasi yang masih perlu dilakukan** setelah suatu referensi dokumen dicatat untuk penelusuran pada M04-S2. Contoh pekerjaan: menyiapkan permintaan klarifikasi, mencatat daftar perbedaan informasi, mempersiapkan pembahasan proses dengan pengampu tugas, serta menghimpun informasi yang masih kurang.

**Ini bukan sistem penerbitan keputusan, pengesahan dokumen, penentuan penerima bantuan atau realisasi bantuan.** Status `metadata_tercatat` pada M04-S2 hanya berarti **informasi referensi dituliskan dalam register contoh**, bukan bahwa suratnya asli, berlaku, atau dapat digunakan sebagai dasar hukum. M04-S3 **tidak** mengubah makna itu.

Penutupan sebuah tugas di M04-S3 hanya berarti **catatan administratif telah selesai ditelaah dalam simulasi**. Tidak berarti instansi penerbit sudah membalas, dokumen telah dikonfirmasi, permohonan bantuan disetujui, anggaran tersedia, atau barang telah disalurkan.

## 2. Posisi pada rangkaian pekerjaan

| Tahap | Hasil yang dibedakan | Tidak boleh disamakan dengan |
|---|---|---|
| **M03** | Masalah, kebutuhan serta penilaian/rekomendasi teknis | Penetapan penerima atau alokasi |
| **M04-S1** | Berkas administratif dicatat sebagai bahan pertimbangan | Persetujuan pejabat |
| **M04-S2** | Metadata dokumen eksternal dicatat untuk penelusuran | Keaslian dan keberlakuan hukum surat |
| **M04-S3** | Rencana dan **catatan upaya tindak lanjut administratif** | Konfirmasi penerbit, keputusan anggaran, pengadaan atau BAST |
| **Tahap resmi di luar kode draft** | Pemeriksaan pada pihak penerbit, telaah substansi dan keputusan pejabat sesuai prosedur | Proses otomatis YANDIK+ |
| **M04-S4+ (RENCANA)** | Kajian lanjutan tata kelola paket/distribusi/serah-terima bila disahkan | Fitur siap operasional saat ini |

## 3. Jenis tindak lanjut yang dapat direncanakan

1. **Menyiapkan permintaan konfirmasi ke penerbit:** menyusun daftar pertanyaan atau draf korespondensi, bukan mengirim atau memperoleh konfirmasi resmi.
2. **Menyusun daftar kesesuaian ruang lingkup:** mencatat apa yang perlu dibandingkan antara referensi dan kebutuhan.
3. **Menyiapkan klarifikasi arsip dan metadata:** merangkum kekurangan referensi untuk pengelola arsip atau pejabat terkait.
4. **Menyiapkan bahan pembahasan proses:** mengumpulkan isu dan dokumen kerja untuk pembahasan oleh pemilik proses.

Tiap rencana mempunyai kategori, uraian, **penanggung jawab fiktif DEMO**, target keluaran administratif, tanggal rencana DEMO, dan keterbatasan informasi. Tanggal contoh adalah isian perencanaan **bukan** agenda dinas, jadwal resmi atau reminder otomatis.

## 4. Status dan pembagian tanggung jawab pada simulasi

| Status | Peran DEMO | Arti tindakan |
|---|---|---|
| `draf` | Koordinator administrasi | Menuliskan rencana tanpa penugasan resmi |
| `ditugaskan` | Koordinator administrasi | Menandai petugas fiktif yang diminta menyiapkan catatan |
| `dalam_proses` | Petugas tindak lanjut | Mulai menyusun keterangan administratif |
| `menunggu_telaah` | Petugas tindak lanjut | Mengirim catatan dan kode sumber DEMO untuk ditelaah |
| `perlu_perbaikan` | Penelaah berbeda | Mengembalikan catatan dengan alasan; petugas boleh mengajukan kembali |
| `ditutup_administratif` | Penelaah berbeda | Menutup **catatan kerja**, tidak mengesahkan dokumen/keputusan/bantuan |
| `dibatalkan` | Koordinator | Membatalkan rencana dengan alasan, riwayat tetap ditampilkan |

**Tidak ada** pilihan `bantuan_disetujui`, `anggaran_cair`, `barang_dikirim`, `surat_valid`, `BAST_selesai` atau status lain yang meniru kewenangan resmi.

Peran contoh hanya **label dan kode DEMO**. Tidak ada login, verifikasi identitas, otorisasi kewenangan, pemisahan tugas yang terbukti aman maupun audit server.

## 5. Sumber, pengendalian dan keluaran

- Sumber simulasi berasal dari kontrak **M04-S1** dan **M04-S2**, hanya menggunakan fasilitas dan dokumen fiktif.
- Gerbang rancangan: referensi M04-S2 harus dalam status `metadata_tercatat` setelah catatan penelaah DEMO, dengan sumber administrasi yang tidak berubah.
- Sebelum tindakan berikut, versi dan snapshot referensi diperiksa kembali. **Perubahan berkas/referensi menghentikan pekerjaan dalam rancangan sampai ada pemeriksaan ulang**, bukan otomatis mengikuti sumber yang baru.
- Dalam satu register DEMO, rencana yang masih aktif dengan **jenis tugas sama pada referensi sama** ditolak sebagai duplikat.
- Tugas dapat diberi catatan hasil berawalan `DEMO-`, diperiksa oleh peran DEMO yang berbeda, dan direvisi dengan histori. **Bukti tersebut hanya kode metadata**, bukan surat, foto atau dokumen yang telah diperiksa.
- Keluaran berupa daftar tugas dan **teks ringkasan baca-saja** untuk dikaji/disalin secara manual, bukan surat perintah, nota dinas atau laporan resmi.
- Input dibatasi pada atribut tugas; tidak ada penerima bantuan, nomor keputusan asli, nilai pembiayaan, alokasi, pembelian, penyaluran, tanda terima atau BAST.
- Semua data berada **di memori halaman** dan hilang saat reload. Tidak ada database, pencadangan, pengiriman surat, tanda tangan ataupun arsip resmi.

## 6. Kode yang sudah disimpan

| Berkas | Fungsi yang dirancang |
|---|---|
| [`followup.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup/followup.mjs) | Kontrak rencana, transisi status, anti-duplikasi jenis tugas, pemeriksaan sumber berubah, histori, ringkasan |
| [`fixtures.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup/fixtures.mjs) | Contoh berkas M04-S1 dan metadata referensi M04-S2 sepenuhnya fiktif |
| [`main.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup/main.mjs) | Form dan kontrol status penanggung jawab, catatan, penelaahan dan pembatalan |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup/index.html) | Tampilan rancangan penugasan administratif |
| [`style.css`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup/style.css) | Styling responsif, **belum diperiksa pada HP** |
| [`README.md`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup/README.md) | Batas penggunaan serta instruksi pengerjaan |

Kode berstatus **BELUM DIUJI**, sehingga kelancaran alur, keakuratan validasi, keamanan maupun kenyamanan HP **belum dapat dinyatakan terverifikasi**.

## 7. Pemeriksaan yang ditunda atas instruksi pemilik proyek

- [ ] Kesesuaian impor tiga tahap M04-S1/M04-S2/M04-S3 dengan data DEMO.
- [ ] Rujukan metadata yang belum tercatat, masih klarifikasi atau berkas sumber berubah **ditolak**.
- [ ] Transisi status termasuk tugas yang dikembalikan/diajukan ulang, pembatalan, dan tugas yang sudah ditutup.
- [ ] Pemeriksaan pemisahan koordinator, petugas dan penelaah; peran tanpa autentikasi tidak boleh dianggap aman.
- [ ] Duplikasi tugas sejenis untuk satu referensi, rencana baru, batas kapasitas dan format tanggal.
- [ ] Keterangan tugas, tanggal, kode sumber, pemilik tugas, serta input dengan kolom keputusan/anggaran dilarang.
- [ ] Kesesuaian histori, pengembalian, catatan hasil serta penutupan hanya administratif.
- [ ] Form pada HP dan desktop, akses keyboard/screen reader, pesan kesalahan, hasil baca-saja.
- [ ] Keputusan SOP, mekanisme konfirmasi penerbit/arsip, audit nyata, siapa berwenang memberi tugas, retensi, SPBE dan integrasi dengan sistem pemerintah.

Daftar terpusat juga tersedia di [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). **Tidak menjalankan CL, unit test, browser test, CI, maupun pengujian runtime**.

## 8. Status setelah penulisan kode

- **M04-S1/S2/S3:** SEDANG pada rancangan kode di GitHub, seluruhnya **BELUM DIUJI**.
- **M04-S4+** (proses resmi, paket, penyaluran, BAST, evaluasi): **RENCANA**.
- M03-S4A/B/C masih **BELUM DIUJI**; keberhasilan 176 tes lama hanya mencakup snapshot M03-S3.
- Tidak ada pengoperasian website YANDIK+, sumber Flask asli, akun/DB, VPS atau branch `main`.
- PR #9 tetap Draft dan repository private.

**Rencana berikutnya:** menyusun *dashboard antrean tindak lanjut administratif* dari status tugas contoh secara baca-saja, bukan dashboard penetapan bantuan, sambil mengumpulkan perbaikan model untuk sesi pemeriksaan setelah izin.
