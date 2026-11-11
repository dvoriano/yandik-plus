# M03-S4C | Rancangan Bahan Penyusunan Berita Acara Telaah Metodologi

**Status:** KODE DITULIS, **BELUM DIUJI**, **BELUM DISAHKAN**.  
**Tanggal:** 11 November 2026 (WIB)  
**Kedudukan:** Draf keluaran administratif **untuk disalin dan diperiksa manusia**, bukan berita acara yang sah, bukan proses persuratan elektronik, dan bukan tindakan pejabat.  
**Kode:** [drafts/m03-s4-fairness/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) · [commit M03-S4C](https://github.com/dvoriano/yandik-plus/commit/93a0d7df9e446af1db4f350ac47b34c56faf1c79).

## 1. Tujuan

M03-S4A menyiapkan perbandingan enam fasilitas fiktif berdasarkan tiga pilihan bobot. M03-S4B menyiapkan alasan kajian dan riwayat tinjauan metodologi oleh peran kabupaten/kota serta provinsi **dalam simulasi**. M03-S4C menambahkan rancangan untuk **mengubah catatan kajian tersebut menjadi teks bahan penyusunan berita acara**, agar narasi dan historinya tidak perlu ditulis ulang ketika kelak akan dibahas.

**Penggunaan yang dimaksud:** pengelola dapat membaca draf dan memperbaikinya, lalu menyiapkan dokumen kerja atau berita acara melalui tata naskah, mekanisme penandatanganan dan kewenangan instansi yang sah. Tidak ada dokumen yang diterbitkan secara otomatis.

## 2. Informasi dalam draf

| Bagian | Sumber / maksud |
|---|---|
| Identitas kajian | ID DEMO, versi, status kajian, penyusun DEMO dan versi metode |
| Agenda pembahasan | Catatan yang diketik pada formulir simulasi, bukan tanggal atau rapat yang dibuktikan |
| Dasar pertimbangan | Alternatif bobot, alasan, dampak, keterbatasan dan sumber DEMO |
| Rincian pembanding | Skor dan urutan baseline vs alternatif dari skenario fiktif |
| Pendapat penelaah | Jika ada, hasil tinjauan provinsi DEMO beserta alasan; bila belum ada, ditandai tegas |
| Riwayat rekomendasi dan perbaikan | Seluruh event histori yang tersedia, termasuk pengajuan, pengembalian, revisi dan hasil telaah |
| Tindak lanjut | Catatan yang perlu diperiksa pemilik proses, bukan perintah dinas |
| Pembatasan pengesahan | Tidak ada nomor resmi, tanggal/berkas sah, tanda tangan, alokasi atau penetapan kebijakan |

**Tidak ada hasil pemeriksaan lapangan riil atau bukti keaslian dokumen dalam kode ini.**

## 3. Rancangan alur pengguna

1. Kabupaten/kota membuat draf penjelasan bobot pada `review.html`.
2. Draf dapat diajukan untuk tinjauan provinsi **pada peran DEMO**.
3. Provinsi dapat mencatat untuk pembahasan, mengembalikan agar direvisi, atau menyatakan alternatif tidak direkomendasikan. Tindakan itu tidak menyetujui bobot kebijakan.
4. Pengguna mengisi **agenda simulasi** dan **catatan tindak lanjut simulasi**.
5. Pengguna memilih **Susun draf hasil telaah, bukan berita acara resmi**.
6. Program dirancang menyiapkan teks Markdown ke kolom **baca-saja** yang bisa dipilih lalu disalin **secara manual**.
7. Bila catatan kajian berubah, keluaran lama dikosongkan sehingga pengguna perlu menyusun ulang. Tidak ada unduhan/unggah otomatis, penyimpanan file, pengiriman atau tanda tangan.

**Catatan penggunaan:** Seluruh data dapat hilang ketika halaman diperbarui. Halaman belum diuji, sehingga alur di atas adalah **perilaku yang dirancang**, belum diverifikasi.

## 4. Contoh struktur teks yang direncanakan

> **DRAF BAHAN PENYUSUNAN BERITA ACARA TELAAH METODOLOGI**  
> STATUS: SIMULASI, BELUM DIUJI, BUKAN BERITA ACARA RESMI  
> A. Identitas kajian dan status.  
> B. Agenda pembahasan.  
> C. Dasar pertimbangan dan bobot yang dikaji.  
> D. Perbandingan indikatif skenario fiktif.  
> E. Pendapat penelaah (atau penanda belum ditelaah).  
> F. Riwayat pengajuan, rekomendasi, dan perbaikan.  
> G. Catatan tindak lanjut.  
> H. Pemeriksaan dan pengesahan secara terpisah.

Struktur adalah **template untuk dikaji**, bukan format baku berita acara yang ditetapkan pemerintah daerah.

## 5. Batas teknis, perlindungan, dan kewenangan

- Hanya catatan `DEMO-` dengan skema M03-S4B yang dirancang diterima; program tidak boleh menambahkan status resmi, nomor surat, identitas petugas riil, nomor rekening, penerima bantuan, anggaran, pengadaan atau BAST.
- Isi teks ditujukan untuk dibaca/disalin, bukan dirender sebagai HTML tanpa pengamanan. Draf Markdown menormalisasi/menandai karakter khusus untuk mengurangi risiko format yang menyesatkan, tetapi **belum ada pengujian keamanan**.
- Keluaran bersifat **read-only** dalam aplikasi contoh dan tidak terhubung ke API, server database, SRIKANDI, tanda tangan elektronik, sistem keuangan atau aplikasi produksi.
- Pemeriksaan peran DEMO **bukan autentikasi**. Histori dalam memori **bukan jejak audit yang tahan perubahan**.
- Seandainya kebutuhan ini dilanjutkan, penanggung jawab proses tetap perlu menetapkan template sah, pemeriksa, tata naskah, klasifikasi, penyimpanan dan arsip, serta kesesuaian dengan tata kelola SPBE sebelum penerapan.
- Pembaca **tidak boleh** memperlakukan draf sebagai bukti rapat telah terjadi atau bahwa bobot/dukungan/anggaran disetujui.

## 6. Berkas yang ditulis

| Berkas | Peran |
|---|---|
| [`draft_minutes.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/draft_minutes.mjs) | Penyusunan teks hasil telaah, perbandingan dan histori |
| [`review_ledger.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/review_ledger.mjs) | Akses baca status dan riwayat kajian fiktif |
| [`review_ui.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/review_ui.mjs) | Penyiapan teks dari form dan pengosongan keluaran saat sumber berubah |
| [`review.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/review.html) | Form agenda/tindak lanjut serta teks draf baca-saja |

**Hanya keberadaan berkas yang telah diperiksa di GitHub, bukan kebenaran pelaksanaan kode.** Commit `[skip ci]` digunakan dan tidak menjalankan CL/CI/tes.

## 7. Daftar pemeriksaan tertunda

- [ ] Kompatibilitas impor `review_ledger.mjs`, `comparison.mjs`, dan `draft_minutes.mjs`.
- [ ] Draf ketika review belum ada: jangan membentuk kesan telah ada kesepakatan atau hasil rapat.
- [ ] Setelah review dikembalikan dan direvisi: histori harus tetap lengkap; pendapat yang bukan terkini tidak menjadi hasil akhir.
- [ ] Status tidak direkomendasikan: tidak boleh berubah menjadi "disetujui".
- [ ] Skor seri dan data tidak lengkap: tidak boleh diberi peringkat palsu/angka nol.
- [ ] Sanitasi teks, string berbahaya, format panjang, karakter khusus dan nomor/atribut resmi terlarang.
- [ ] Validasi form, interaksi 320/375 px, pembaca layar, navigasi keyboard dan pembaruan area baca-saja.
- [ ] Kebijakan penyimpanan/retensi/akses, nomor dan pengesahan berita acara sesuai kewenangan.
- [ ] Review pemilik proses dan pengelola dokumen sebelum integrasi.

Daftar ada juga di [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). **Tidak ada tes baru yang dijalankan**.

## 8. Status dan tindak lanjut

**M03-S4A, M03-S4B, M03-S4C: KODE DITULIS, BELUM DIUJI.** M03 keseluruhan masih SEDANG (prototype). M04 tetap RENCANA dan bukan fungsi dari modul ini.

**Berikutnya:** menyusun kebutuhan administratif untuk proses keputusan pejabat secara **terpisah** dari skor prioritas, tanpa menambahkan keputusan otomatis. Jika dibutuhkan, mulai M04 dengan rancangan alur saja, sesudah pembagian kewenangan ditelaah. Semua coding baru tetap `drafts/`, tanpa CL/CI/tes hingga izin eksplisit.
