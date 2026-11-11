# M03-S4B | Alur Telaah Perbandingan Bobot Prioritas Puskeswan

**Status: KODE DITULIS, BELUM DIUJI, BELUM DISAHKAN.**  
**Tanggal dokumentasi:** 11 November 2026 (WIB)  
**Lingkungan:** direktori `drafts/m03-s4-fairness/` pada branch `develop/yandik-foundation`. Tidak terhubung ke Flask, database, website, API ataupun pengguna sebenarnya.

## Tujuan tahap pengembangan

M03-S4A menghasilkan rancangan perbandingan enam Puskeswan **fiktif** di bawah tiga pilihan bobot penilaian. M03-S4B menambahkan rancangan **catatan telaah metodologi** untuk menjawab mengapa suatu bobot patut dikaji, siapa yang menuliskan usulan, apa keterbatasan datanya, bagaimana urutan indikatif berbeda, dan bagaimana penelaah memberikan catatan.

Perancangan ini **bukan proses mengesahkan bobot kebijakan, menentukan penerima bantuan, mengalokasikan dana, atau menerbitkan BAST**. Penilaian prioritas resmi memerlukan pembahasan, data yang sah, keputusan pejabat sesuai kewenangan, dan tata kelola yang berlaku.

## Alur pekerjaan yang dirancang

| Tahap | Pelaku pada DEMO | Informasi atau tindakan | Makna status |
|---|---|---|---|
| Menyiapkan draf | Peran verifikator kabupaten/kota (identitas DEMO) | Pilih profil bobot; jelaskan alasan, dampak, keterbatasan, referensi fiktif | Hanya draf penjelasan |
| Mengajukan | Peran yang membuat draf | Membawa hasil perbandingan dan histori ke antrean kajian | **Bukan** permohonan persetujuan bantuan |
| Menelaah | Peran verifikator provinsi (identitas DEMO) | Catatan minimum 30 karakter, pilih hasil kajian | Hanya telaah metodologi |
| Dikembalikan | Peran provinsi | Minta data/alasan dilengkapi | Pengusul dapat membuat revisi dengan histori |
| Dicatat untuk pembahasan | Peran provinsi | Alternatif bobot patut dibahas lebih lanjut | **Bukan** bobot yang disahkan |
| Tidak direkomendasikan | Peran provinsi | Alternatif bobot belum layak dilanjutkan | Keputusan kajian fiktif, bukan sanksi |

Semua pilihan pada tampilan menggunakan frasa yang **tidak menyatakan persetujuan**. Tidak ada tombol "setujui anggaran", "tetapkan penerima" atau "berikan bantuan".

## Data yang dicatat pada rancangan

- Pilihan satu dari tiga bobot eksperimen, beserta versi sumber laboratorium perbandingan.
- Alasan pemilihan bobot, dampak yang diperkirakan terhadap fasilitas terpencil/SDM terbatas, serta keterbatasan sumber data.
- Kode referensi DEMO, **bukan** dokumen yang diunggah atau diperiksa keasliannya.
- Perbandingan **skor dan peringkat indikatif** antara baseline dan bobot alternatif; data belum lengkap ditampilkan sebagai *belum dinilai*, bukan nol.
- Identitas peran DEMO, revisi, histori tindakan, dan catatan penelaah.
- Peringatan bahwa hasil kajian merupakan rancangan yang belum diuji/disahkan.

**Tidak boleh memuat** informasi penerima yang ditetapkan, pagu/alokasi dana, pengadaan, persetujuan keuangan, distribusi, atau BAST.

## Batas keamanan dan validitas

1. **Belum diuji:** keberadaan kode di GitHub tidak berarti fungsi atau hitungannya telah benar. Jangan menyebut rancangan ini beroperasi.
2. **Identitas hanya simulasi:** nama peran dan ID `DEMO-` adalah label contoh, **bukan login, autentikasi, atau pembatasan akses server**.
3. **Data tersimpan pada memori browser:** belum ada retensi, database, penyimpanan aman, pencadangan, atau jejak audit hukum.
4. **Masih tiga pilihan bobot tetap:** belum ada pengeditan bobot bebas atau pengesahan metode; perubahan bobot harus melalui tata kelola dan uji keadilan sebelum digunakan.
5. **Sumber fiktif:** tidak ada data riil Puskeswan, dokumen sensitif, daftar penerima bantuan, atau bukti kegiatan.
6. **Tidak terhubung ke M03-S3:** formulir review ini terpisah dari prototype aktif, dan tidak mengubah keputusan kegiatan atau scorecard yang sudah ada.

## File rancangan

| Berkas | Isi |
|---|---|
| [`review_ledger.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/review_ledger.mjs) | Kontrak draf, pengajuan, telaah, pengembalian dan histori revisi |
| [`review_ui.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/review_ui.mjs) | Penghubung form DEMO ke kontrak, data dalam memori |
| [`review.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/review.html) | Form alasan dan catatan metodologi |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/index.html) | Titik navigasi dari perbandingan awal ke halaman kajian |

**Bukti penyimpanan kode:** [GitHub commit M03-S4B](https://github.com/dvoriano/yandik-plus/commit/bfa697af515479ec05735badcde4c89222e8c5d8). Commit ditulis `[skip ci]`; tidak ada tes yang dilakukan.

## Backlog untuk penyisiran setelah diizinkan

- [ ] Kontrak masukan: format peran dan kode bukti, batas karakter, aksi yang tidak dikenal, dan field terlarang.
- [ ] Draf → diajukan → dicatat/dikembalikan/tidak direkomendasikan; revisi harus mempertahankan histori.
- [ ] Pemisahan pengusul dan penelaah dengan identitas yang **benar-benar terautentikasi** kelak, bukan sekadar label DEMO.
- [ ] Konsistensi hasil perbandingan terhadap perubahan skenario, skor seri dan data belum lengkap.
- [ ] Uji form keyboard/layar kecil, HTML semantics, pesan kesalahan, perubahan halaman, refresh, dan dukungan aksesibilitas.
- [ ] Pastikan tidak ada tombol/field yang dapat menghasilkan pengesahan bobot, alokasi, keputusan bantuan atau BAST.
- [ ] Evaluasi metodologi bobot dan keadilan oleh penanggung jawab proses sebelum integrasi nyata.

Daftar pemeriksaan lintas modul terdapat dalam [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). **Jangan jalankan tes atau CL/CI tanpa instruksi eksplisit pemilik proyek.**

## Kelanjutan

Setelah penulisan kode berikutnya, tetap gunakan direktori `drafts/` dan penanda **BELUM DIUJI**. Keluaran yang kelak dapat dipertimbangkan adalah **berita acara hasil telaah metodologi sebagai draf** dan bahan perbandingan untuk pengambilan keputusan manusia. Bukan keputusan yang dibuat oleh program.
