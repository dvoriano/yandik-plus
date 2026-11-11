# M04-S6 | Matriks Alur Eskalasi dan Pembagian Tanggung Jawab Administratif

**Status:** KODE DITULIS, **BELUM DIUJI**, BELUM DITETAPKAN MENJADI SOP.  
**Tanggal rancangan:** 11 November 2026 (WIB).  
**Lingkup:** rancangan jalur koordinasi **administratif** berdasarkan kategori dan urgensi kendala M04-S5.  
**Bukti kode:** [drafts/m04-escalation-matrix/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix) · [commit M04-S6](https://github.com/dvoriano/yandik-plus/commit/0456b4307d982fa04c7891d9e1ee0c5a36b21b84).

## 1. Mengapa diperlukan

M04-S5 menyiapkan pencatatan kendala dan eskalasi lintas petugas. Belum ada acuan rancangan untuk **memilih unit pertama yang patut dimintai penjelasan**, membedakan pelaporan biasa dengan kebutuhan pembahasan lebih cepat, serta memastikan perubahan jalur dibarengi alasan tertulis. M04-S6 mengisi kebutuhan tersebut sebagai **matriks rekomendasi DEMO**.

**Penting:** rancangan ini **bukan bagan organisasi resmi DPKH, SOP penanganan surat, disposisi pimpinan, izin mengalokasikan bantuan, verifikasi keabsahan surat, atau sistem penyaluran barang**. Unit tujuan yang muncul hanya label fiktif. Keputusan tugas/anggaran tetap melalui pejabat dan mekanisme yang berwenang.

## 2. Matriks kategori dan arah penanganan yang diusulkan

| Kategori kendala | Tujuan awal DEMO bila urgensi biasa/perlu perhatian | Fokus administratif |
|---|---|---|
| Kelengkapan bukti | Pengelola administrasi/arsip DEMO | Mengumpulkan dan menyandingkan metadata |
| Klarifikasi penerbit | Pengelola administrasi/arsip DEMO | Menyiapkan daftar klarifikasi kepada penerbit, **tanpa menghubungi pihak luar otomatis** |
| Kesesuaian kebutuhan | Pengampu substansi teknis DEMO | Menyiapkan catatan kesesuaian informasi kebutuhan |
| Koordinasi petugas | Koordinasi lintas petugas DEMO | Mengklarifikasi pembagian tugas |
| Hambatan administrasi lainnya | Penelaah prosedur administratif DEMO | Mengidentifikasi langkah prosedural yang perlu diputuskan |

Untuk seluruh kategori dengan urgensi **`mendesak_kajian`**, rute awal beralih ke **koordinator DEMO untuk dibahas lebih cepat**, bukan mempercepat persetujuan bantuan. Dengan demikian terdapat **15 kombinasi kategori dan urgensi**, seluruhnya untuk kajian awal, bukan kewajiban hukum.

| Urgensi | Makna |
|---|---|
| `biasa` | Masih memerlukan penanganan administratif |
| `perlu_perhatian` | Perlu perhatian tambahan oleh koordinator, tetapi usulan unit dasar tetap dipertahankan |
| `mendesak_kajian` | Perlu dibahas lebih awal melalui koordinator DEMO, **bukan peningkatan hak keputusan** |

## 3. Pembagian peran yang dirancang

| Peran DEMO | Kewajiban dalam simulasi | Bukan kewenangannya |
|---|---|---|
| Pelapor M04-S5 | Melaporkan kendala dan dampaknya, menyiapkan rujukan dan upaya sebelumnya | Menetapkan rute/anggaran |
| Koordinator matriks | Membaca rekomendasi dan memilih jalur untuk **bahan pembahasan** disertai alasan | Menerbitkan disposisi, memerintahkan pengadaan |
| Penelaah matriks berbeda | Mencatat pendapat atas alasan pemilihan, meminta perbaikan atau tidak merekomendasikan | Menyetujui bantuan, surat atau anggaran |
| Unit tujuan DEMO | Opsi kategori dalam matriks; **belum menerima tugas nyata** | Dianggap otomatis menerima disposisi |
| Pejabat/proses yang sah (di luar demo) | Menetapkan alur resmi dan tindakan administratif sesuai kewenangan | Tidak digantikan oleh matriks |

**Sistem tidak boleh menentukan petugas riil berdasarkan string ID DEMO.** Pemisahan peran ini hanya kontrak prototype; akses, otorisasi wilayah, pengawasan dan audit nyata belum dibangun.

## 4. Proses usulan jalur

1. **Baca sumber:** gunakan eskalasi M04-S5 DEMO yang telah dilaporkan dan sumber M04-S3/M04-S2 tidak berubah. Kendala draf, ditutup, dibatalkan atau telah berubah **tidak menjadi dasar usulan baru**.
2. **Tampilkan rekomendasi:** ambil kategori/urgensi kendala dan tampilkan unit yang disarankan, alasan serta ID unit DEMO.
3. **Koordinator menyiapkan draf:** bisa memilih jalur rekomendasi atau unit lain yang ada dalam daftar. Alasan dan batas data harus ditulis. Bila **berbeda dari rekomendasi**, alasan minimum lebih panjang untuk mendorong justifikasi substantif.
4. **Ajukan untuk telaah:** draf yang berasal dari sumber masih cocok diajukan ke **penelaah DEMO**.
5. **Catat hasil telaah:** penelaah hanya dapat *catat untuk pembahasan*, *minta perbaikan*, atau *tidak direkomendasikan*. Tidak ada pilihan "setujui".
6. **Perbaikan dan histori:** alasan/tujuan dapat direvisi setelah dikembalikan, dengan riwayat tindakan tetap dicatat.
7. **Keluaran:** teks catatan baca-saja yang dapat disalin manual, bukan surat dan **tidak otomatis mengubah atau meneruskan catatan M04-S5**.

**Status alur:** `draf → menunggu_telaah → dicatat_untuk_pembahasan`, `perlu_perbaikan → draf`, atau `tidak_direkomendasikan`. Kata *dicatat* tidak berarti keputusan resmi atau tugas telah dikirim.

## 5. Batas data dan keamanan

- Sumber yang digunakan hanya metadata DEMO M04-S5, bukan dokumen dari penerbit yang sudah diverifikasi.
- *Snapshot* kategori, urgensi, status, versi dan histori kendala digunakan untuk mendeteksi perubahan. Perubahan itu **menghentikan** langkah berikutnya, bukan otomatis menerima versi baru. Tanda tangan/checksum pada data contoh bukan bukti integritas digital.
- Pengubahan tujuan harus memilih unit dalam matriks DEMO dan mencantumkan alasan tertulis; ini **bukan kontrol otorisasi server**.
- Form contoh dilarang memasukkan kolom pengesahan bantuan, penerima ditetapkan, nilai anggaran, pengadaan, pembayaran, distribusi, BAST dan keputusan resmi.
- Semua data hanya berada dalam memori browser dan hilang setelah reload. Histori bukan audit pemerintah yang sah.
- Tidak ada API, akun terautentikasi, surat keluar, email, notifikasi Telegram, tanda tangan elektronik, integrasi SRIKANDI atau koneksi ke aplikasi produksi.

## 6. Berkas GitHub yang telah ditulis

| Berkas | Kegunaan |
|---|---|
| [`routing_matrix.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix/routing_matrix.mjs) | Matriks 5×3, pembacaan eskalasi M04-S5, catatan pilihan unit dan alasan, review, histori, pembatasan sumber |
| [`fixtures.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix/fixtures.mjs) | Satu eskalasi dilaporkan pada data contoh dari kontrak M04-S1/S2/S3/S5 |
| [`main.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix/main.mjs) | Hubungan tabel rekomendasi, formulir alasan dan telaah DEMO |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix/index.html) | Layar matriks 15 kombinasi, perbandingan pilihan unit dan keluaran baca-saja |
| [`style.css`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix/style.css) | Desain tampilan responsive yang **belum diperiksa di HP** |
| [`README.md`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix/README.md) | Batas penggunaan dan petunjuk pembangunan |

**Bukti GitHub hanya menunjukkan file tersimpan, bukan bahwa model, impor atau UI sudah berfungsi.**

## 7. Antrean pemeriksaan tanpa CL/CI

- [ ] Impor M04-S1 → M04-S2 → M04-S3 → M04-S5 → M04-S6 serta kecocokan fixture.
- [ ] Kelima kategori dan ketiga urgensi membentuk 15 baris matriks yang benar.
- [ ] Urgensi `mendesak_kajian` hanya mengalihkan rute DEMO ke koordinator, bukan keputusan bantuan.
- [ ] Kendala yang masih draf/ditutup/dibatalkan/sumber berubah ditolak.
- [ ] Pilihan jalur berbeda memerlukan alasan sesuai panjang minimum, sementara sumber tidak boleh berubah.
- [ ] Penelaah terpisah, riwayat draf/submit/revisi/telaah dan status hasil.
- [ ] Field keputusan, pengadaan, BAST, penerima dan anggaran dilarang.
- [ ] Tidak ada pemanggilan `routeEscalation` otomatis, pemberitahuan atau perubahan sumber M04-S5.
- [ ] Kebersihan teks, UI 320/375px, keyboard, aksesibilitas, konsistensi status dan pengosongan draf.
- [ ] Peninjauan SOP/struktur unit/wilayah, kelayakan kewenangan, SPBE, perlindungan data dan audit server.

Lihat pula [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). **Tidak ada CL, tes otomatis/manual, atau CI yang dijalankan.**

## 8. Status dan kelanjutan

- **M04-S1 sampai S6:** **SEDANG hanya pada kode draft / BELUM DIUJI**.
- **M04-S7+** untuk keputusan pejabat, alokasi, paket, pengadaan, distribusi, BAST dan evaluasi **RENCANA**.
- **Langkah desain berikut:** penyiapan *katalog rujukan unit dan tata penerusan* yang dapat ditelaah pemilik proses; sebelum diaktifkan resmi, wajib disahkan menurut prosedur kedinasan.
