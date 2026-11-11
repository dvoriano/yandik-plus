# M04-S5 | Pencatatan Kendala dan Eskalasi Administratif Lintas Petugas

**Kedudukan:** KODE DITULIS, **BELUM DIUJI**, belum terhubung produksi.  
**Tanggal:** 11 November 2026 (WIB)  
**Fungsi:** pencatatan kendala, koordinasi, penugasan *simulasi*, tanggapan dan telaah catatan administratif lintas peran.  
**Kode:** [drafts/m04-admin-escalations/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations) · [commit M04-S5](https://github.com/dvoriano/yandik-plus/commit/3db79c4b0199fa635597d2caffde21ad3ca9838e).

## 1. Maksud dan batas proses

Sesudah berkas pertimbangan (M04-S1), register metadata referensi dokumen eksternal (M04-S2), tugas tindak lanjut (M04-S3), serta rekap antrean (M04-S4), pekerjaan dapat menghadapi kendala yang **perlu dilaporkan dan diteruskan ke petugas/unit yang tepat**. M04-S5 menyiapkan mekanisme contoh untuk menuliskan kendala dan tanggapannya secara sistematis.

**Pemisahan penting:** eskalasi ini **bukan** disposisi dinas resmi, permintaan surat otomatis, keputusan pemberian bantuan, pembuktian keabsahan dokumen, penetapan penerima, pengadaan, distribusi, atau BAST. Sistem tidak dapat menaikkan status surat eksternal menjadi "sah" atau mengubah status tugas M04-S3 secara otomatis. Penutupan eskalasi **hanya menutup catatan koordinasi**, bukan otomatis menyelesaikan masalah pokok.

## 2. Rangkaian kerja administratif yang dirancang

| Tahapan | Peran dalam simulasi | Tindakan | Batasan |
|---|---|---|---|
| Pencatatan | Petugas tindak lanjut DEMO yang tercatat pada tugas M04-S3 | Mengisi kategori, urgensi, dampak, upaya, kebutuhan koordinasi, kode bukti metadata | Hanya tugas sumber yang masih aktif dan tidak berubah |
| Pelaporan | Pelapor DEMO | Mengirim draf ke antrean koordinator | Bukan surat/disposisi kedinasan |
| Penerusan | Koordinator eskalasi DEMO berbeda dari pelapor | Mencatat penerima tujuan, instruksi dan tanggal tanggapan **fiktif** | Tidak mengirim pesan/email atau menerbitkan tugas |
| Tanggapan | Penerima eskalasi DEMO yang dituju | Mencatat jawaban, informasi yang belum ada dan kode metadata hasil | Bukan konfirmasi surat dari penerbit resmi |
| Telaah | Penelaah DEMO terpisah dari pelapor, koordinator dan penerima | Mengembalikan untuk klarifikasi atau menutup catatan administratif | Tidak menyetujui bantuan/anggaran |
| Pembatalan | Koordinator DEMO | Membatalkan catatan yang masih aktif disertai alasan | Alasan tetap dalam histori |

**Status:** `draf → dilaporkan → diteruskan → ditanggapi → perlu_klarifikasi → diteruskan/tanggapan berikutnya` atau `ditanggapi → ditutup_administratif`. Rancangan menerima tanggapan ulang dari penerima ketika status `perlu_klarifikasi`, tanpa mengesahkan hasilnya.

Status `dibatalkan` diperbolehkan bagi kendala dilaporkan, diteruskan atau membutuhkan klarifikasi dengan alasan koordinator. Tidak ada status `bantuan_disetujui`, `dokumen_asli`, `uang_cair`, `barang_dikirim`, `BAST_selesai`.

## 3. Jenis kendala dan prioritas pembahasan

| Kelompok kendala | Contoh informasi yang ingin dicatat |
|---|---|
| Kelengkapan bukti | Metadata pendukung belum lengkap atau tidak sesuai |
| Klarifikasi penerbit | Nomor/ruang lingkup referensi eksternal belum bisa diyakini hanya dari metadata |
| Kesesuaian kebutuhan | Hubungan dokumen dengan kebutuhan fasilitas belum jelas |
| Koordinasi petugas | Pembagian tanggung jawab administratif belum jelas |
| Hambatan lain | Kendala administrasi yang memerlukan pencatatan alasan |

**Urgensi:** `biasa`, `perlu_perhatian`, `mendesak_kajian`. Ketiganya menggambarkan **kebutuhan koordinasi administratif**, bukan skor kebutuhan bantuan Puskeswan atau klasifikasi kedaruratan veteriner.

Tanggal rencana tanggapan hanya untuk **contoh simulasi**, dibandingkan terhadap tanggal acuan manual; bukan batas kinerja atau SLA dinas yang telah disetujui.

## 4. Informasi yang dicatat dan keterlacakan

- ID kendala, kategori, tingkat perhatian, uraian, dampak pekerjaan, upaya terdahulu, bantuan koordinasi yang diperlukan, dan kode referensi metadata fiktif.
- ID tugas M04-S3, versi dan status snapshot sumber; referensi M04-S2 dan berkas M04-S1 fiktif. Bila sumber berubah, operasi eskalasi dirancang berhenti untuk pemeriksaan ulang.
- Identitas pelapor, koordinator, penerima, penelaah berupa **kode DEMO**, bukan nama/akun kedinasan riil.
- Arahan koordinasi contoh, rencana tanggal, tanggapan tertulis, sisa kendala dan kode bukti hasil **DEMO**.
- Histori status, versi, alasan klarifikasi dan penutupan/pembatalan. Histori di memori browser **tidak dapat dianggap jejak audit yang tahan perubahan**.
- Rekap antrean kendala terbuka, menunggu koordinator, menunggu tanggapan, butuh klarifikasi, lewat tanggal contoh, sumber berubah, catatan yang ditutup administratif, serta ringkasan baca-saja.

**Gerbang anti-duplikasi:** kategori kendala yang sama pada tugas aktif yang sama hanya dapat memiliki satu eskalasi aktif pada register contoh. Setelah penutupan atau pembatalan, catatan baru dapat dibuat untuk keperluan baru dengan riwayat berbeda.

## 5. Pengendalian dan batas implementasi

1. **Tidak ada keputusan bantuan otomatis.** Eskalasi tidak mengubah status M03, M04-S1, M04-S2 atau M04-S3.
2. **Kendalikan sumber berubah.** Simulasi menyimpan snapshot sumber. Bila tugas/referensi berubah, tindakan perlu dihentikan agar data tidak dianggap masih mutakhir.
3. **Pemisahan peran konseptual.** Reporter hanya pelaksana tugas M04-S3 DEMO; koordinator, penerima, dan penelaah menggunakan peran DEMO terpisah. Ini **bukan autentikasi, kewenangan wilayah, atau pengamanan API**.
4. **Tanpa media resmi.** Tidak ada surat keluar, panggilan API, notifikasi eksternal, unggah file, tanda tangan, disposisi, atau integrasi SRIKANDI.
5. **Tanpa sumber riil.** Contoh data menggunakan ID `DEMO-`; tidak boleh memasukkan data warga, pejabat, informasi sensitif atau nomor surat asli.
6. **Tanpa penyimpanan permanen.** Seluruhnya di memori halaman. Draf rekap dibaca dan disalin manual setelah koreksi.
7. **Tidak menganggap catatan ditutup sebagai hasil substantif.** Penelaahan catatan administratif belum membuktikan perbaikan sarpras, penerbitan keputusan atau kelayakan anggaran.
8. **BELUM DIUJI.** Belum ada pemeriksaan jalur kode, keamanan, konsistensi, UX HP, pembaca layar atau akurasi status.

## 6. Berkas yang ditulis

| Berkas | Peran |
|---|---|
| [`escalations.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations/escalations.mjs) | Register kendala, validasi, status, penerusan, tanggapan, review, pembatalan, anti-duplikasi, deteksi sumber berubah |
| [`fixtures.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations/fixtures.mjs) | Sumber tugas M04-S3 dan referensi fiktif M04-S2 dari kontrak sebelumnya |
| [`main.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations/main.mjs) | Form dan alur interaksi contoh, rekap dan ringkasan |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations/index.html) | Tampilan laporan kendala, penerusan, tanggapan, telaah, register |
| [`style.css`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations/style.css) | Rancangan responsif (belum diuji di HP) |
| [`README.md`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations/README.md) | Petunjuk batasan kode dan status |

**Commit tersedia di GitHub** ([lihat](https://github.com/dvoriano/yandik-plus/commit/3db79c4b0199fa635597d2caffde21ad3ca9838e)), tetapi file **belum dijalankan**. Perilaku dalam dokumen ini adalah **rancangan yang diharapkan**, bukan hasil tes.

## 7. Pemeriksaan tertunda

- [ ] Kontrak impor M04-S1 → S2 → S3 → S5, serta kecocokan fixture DEMO.
- [ ] Petugas bukan assignee tugas M04-S3, tugas ditutup/dibatalkan, atau sumber berubah harus ditolak.
- [ ] Draf, pelaporan, penerusan, tanggapan, klarifikasi/tanggapan ulang dan penutupan administratif.
- [ ] Pembatalan beralasan, histori tiap perubahan dan duplikasi kendala aktif.
- [ ] Pemisahan keempat peran; akses sungguhan memerlukan autentikasi server, bukan label.
- [ ] Pengecekan kode DEMO, tanggal kalender, batas teks dan larangan field keputusan/anggaran/BAST.
- [ ] Antrean indikator dan tanggal acuan demo, termasuk sumber berubah dan status yang telah ditutup.
- [ ] Form 320/375 px, keyboard, pembaca layar, pesan kesalahan, tombol yang terpisah dari form tersembunyi.
- [ ] Keselarasan SOP pembinaan, alur koordinasi lintas unit, disposisi resmi, kerahasiaan, retensi dan SPBE.
- [ ] Penyisiran klaim bahwa eskalasi ditutup tidak mengubah M04-S3 dan bukan keputusan bantuan.

Daftar terpusat: [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Semua pengujian **DITUNDA** sesuai keputusan pemilik proyek.

## 8. Status dan langkah berikut

- **M04-S1 sampai M04-S5:** SEDANG hanya pada **kode draft BELUM DIUJI**; belum API/DB/akun nyata atau penerapan layanan.
- **M04-S6+** untuk keputusan resmi, alokasi sesuai kewenangan, paket, penyaluran, BAST dan evaluasi **RENCANA**.
- **Langkah desain berikut yang mungkin:** merancang katalog aturan eskalasi dan matriks penerima sesuai struktur organisasi, lalu meninjau dokumen bersama penanggung jawab proses. Tidak mengubah batas keputusan pejabat.
