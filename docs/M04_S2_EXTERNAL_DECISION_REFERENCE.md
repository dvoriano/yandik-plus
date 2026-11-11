# M04-S2 | Register Referensi Keputusan atau Dokumen Eksternal

**Kedudukan:** **KODE DITULIS, BELUM DIUJI, BELUM DIAKTIFKAN.**  
**Versi rancangan:** 11 November 2026 (WIB)  
**Ruang lingkup:** pencatatan dan pemeriksaan **metadata referensi dokumen yang diklaim sudah terbit di luar YANDIK+**. Bukan layanan penerbitan surat keputusan, pembuktian keaslian dokumen, atau persetujuan pemberian bantuan.

**Berkas:** [Direktori draft M04-S2](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference) · [commit model](https://github.com/dvoriano/yandik-plus/commit/edcc66dfd03ffba302ff7e88422a32d6b61a79ef) · [commit navigasi register](https://github.com/dvoriano/yandik-plus/commit/7b177e2de92ec380971006a3f3497d775e4682b8).

## 1. Posisi dalam sistem Support Puskeswan

Alur yang dipisahkan berdasarkan kewenangan:

1. **M03:** masalah → kebutuhan terverifikasi → penilaian/rekomendasi (hanya bahan pertimbangan).
2. **M04-S1:** penyusunan kelengkapan administratif → telaah → `tercatat_untuk_pertimbangan` (bukan approval).
3. **M04-S2:** pencatatan referensi **dokumen eksternal yang diklaim terbit melalui proses berwenang** → pemeriksaan metadata → klarifikasi atau pencatatan untuk penelusuran.
4. **Di luar kode sekarang:** konfirmasi ke penerbit/arsip asli, pemeriksaan substansi/keabsahan dan keputusan pejabat sesuai kewenangannya.
5. **M04-S3 dan seterusnya (RENCANA):** rencana tindak lanjut administratif, paket, penyaluran, BAST, dan evaluasi **hanya apabila dasar dan prosedur resminya telah dipenuhi**.

**Penting:** M04-S2 tidak menghasilkan, menyalin atau menggantikan dokumen keputusan resmi. Bahkan status `metadata_tercatat` **bukan bukti** bahwa keputusan benar telah diterbitkan, sah, masih berlaku, mencakup barang tertentu atau berimplikasi pada ketersediaan anggaran.

## 2. Apa yang dicatat?

| Kelompok informasi | Penjelasan |
|---|---|
| **Sumber administrasi** | ID berkas M04-S1, versi, ID kebutuhan, dan ID Puskeswan, seluruhnya DEMO |
| **Nomor referensi** | Kode bertanda `DEMO-`; bukan nomor keputusan sebenarnya |
| **Jenis dokumen** | Klaim dokumen keputusan eksternal, surat pengantar, atau rekomendasi |
| **Penerbit** | Kode lembaga fiktif `DEMO-` |
| **Tanggal** | Tanggal contoh yang dapat diperiksa formatnya; bukan tanggal resmi yang diverifikasi |
| **Uraian** | Apa yang diklaim dimuat dalam dokumen dan keterkaitannya dengan berkas |
| **Kode metadata pendukung** | ID bukti contoh, bukan isi file yang telah diperiksa |
| **Catatan keterbatasan** | Bagian yang perlu konfirmasi ke pihak penerbit serta pengelola arsip |
| **Histori dan pemeriksaan** | Penyusun DEMO, penelaah DEMO, perubahan metadata, alasan, status dan versi |

**Tidak diperbolehkan di dalam model DEMO:** status bantuan disetujui, nominal anggaran, alokasi, penerima ditetapkan, pembayaran, pengadaan, pengiriman, BAST, tanda tangan atau klaim keaslian hukum.

## 3. Proses bisnis yang dirancang

| Tahapan | Pelaku simulasi | Proses | Hasil |
|---|---|---|---|
| Draf referensi | Pencatat referensi provinsi DEMO | Pilih sumber M04-S1 yang tercatat untuk pertimbangan, isi metadata | `draf` |
| Ajukan pemeriksaan | Pencatat DEMO | Periksa nomor ganda dan kesesuaian snapshot berkas | `menunggu_telaah` |
| Pemeriksaan metadata | Penelaah referensi DEMO yang berbeda | Catat alasan, tegaskan batas pemeriksaan hanya metadata | Salah satu hasil telaah di bawah |
| Klarifikasi | Penelaah DEMO | Minta informasi dilengkapi; pencatat boleh merevisi, histori tetap | `perlu_klarifikasi` → `draf` |
| Catatan penelusuran | Penelaah DEMO | Masukkan sebagai referensi yang perlu ditelusuri di proses resmi | `metadata_tercatat` |
| Ketidaksesuaian | Penelaah DEMO | Tandai nomor/kaitan/uraian yang tidak cocok | `tidak_sesuai` |

Tidak ada status `disetujui`, `keputusan_sah`, `bantuan_diberikan`, atau `anggaran_tersedia`. Pemeriksaan metadata hanya mengurangi risiko salah referensi pada **contoh data**, tidak menggantikan pengecekan asli atau audit yang mempunyai konsekuensi hukum.

## 4. Pengendalian yang dituju

- **Gerbang sumber:** hanya berkas M04-S1 yang `tercatat_untuk_pertimbangan` dengan catatan penelaah DEMO dapat menjadi sumber awal. Ini **tidak** berarti keputusan pejabat sudah ada.
- **Versi dan kesesuaian sumber:** snapshot berkas disimpan. Jika berubah, referensi ditandai untuk kajian ulang, bukan otomatis dinyatakan masih sesuai.
- **Anti-duplikat:** nomor referensi `DEMO-` yang sama tidak boleh dicatat dua kali di register yang sama. Potensi dokumen yang digunakan lintas usulan harus diatur setelah SOP resmi disetujui.
- **Dua peran:** pencatat dan penelaah menggunakan identitas DEMO berbeda, tetapi **belum memiliki autentikasi atau kontrol akses server**.
- **Pemeriksaan eksplisit:** penelaah wajib mengakui bahwa pemeriksaan hanya berupa metadata dan belum menilai keaslian atau keberlakuan hukum.
- **Penyimpanan sementara:** model dan tampilan hanya menggunakan memori browser, sehingga tidak dapat dianggap register resmi maupun audit permanen.
- **Pengamanan data:** hanya data fiktif. Pencatatan nomor surat asli, pihak penerbit riil, berkas rahasia, atau informasi pribadi tidak diperbolehkan pada demo.

## 5. Dokumen dan kode

| Berkas | Fungsi |
|---|---|
| [`reference_register.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference/reference_register.mjs) | Kontrak data dan operasi register (draf, submit, telaah, revisi, anti-duplikat, deteksi sumber usang) |
| [`fixtures.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference/fixtures.mjs) | Sumber fiktif yang disusun memakai kontrak M04-S1, tanpa data Puskeswan nyata |
| [`main.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference/main.mjs) | Hubungan form, daftar referensi, pergantian entri dan catatan ringkasan |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference/index.html) | Rancangan halaman metadata, pemeriksaan dan daftar register |
| [`style.css`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference/style.css) | Tampilan responsif yang direncanakan, **belum diuji di HP** |
| [`README.md`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference/README.md) | Batasan dan petunjuk pengerjaan draft |

**Tidak dilakukan dalam sesi ini:** tes Node, Chromium, pemeriksaan runtime, workflow CI, CL, uji aksesibilitas, tes keamanan, atau pengoperasian layanan.

## 6. Hal yang belum tersedia

- Dokumen keputusan resmi yang diverifikasi langsung pada penerbit/arsip.
- Peran dan identitas pengguna nyata, otorisasi wilayah atau tanda tangan elektronik.
- Pengaturan integrasi dengan SRIKANDI, tata naskah, sistem keuangan, dan metadata arsip.
- Mekanisme validasi berkas, integritas digital, status dicabut/diubah serta perubahan masa berlaku.
- Database, audit transaksional permanen, keamanan API, unggah dan retensi lampiran.
- Rujukan data produksi M03/M04-S1.
- Penetapan penerima, realisasi dukungan, alokasi/pengadaan, distribusi dan BAST.
- Pengujian kode draft dan validasi kelembagaan/SPBE.

## 7. Pemeriksaan yang harus ditunda hingga diizinkan

- [ ] Form nomor/tanggal/jenis dokumen; input hanya DEMO dan tidak menerima atribut persetujuan.
- [ ] Sumber M04-S1 selain `tercatat_untuk_pertimbangan` harus ditolak.
- [ ] Nomor referensi DEMO sama tidak boleh ada dua kali; sumber yang berubah memerlukan telaah ulang.
- [ ] Transisi draf → pemeriksaan → catatan/klarifikasi/tidak sesuai; revisi harus mempertahankan histori.
- [ ] Reviewer tidak sama dengan pencatat; acknowledgement batas metadata wajib.
- [ ] Tidak ada klaim keaslian, keputusan sah atau penerima bantuan otomatis.
- [ ] Teks ringkasan, keamanan input, penamaan field dan penggunaan data fiktif.
- [ ] Penggunaan pada layar HP, navigasi keyboard dan aksesibilitas.
- [ ] Sinkronisasi keamanan, SOP, otorisasi, data asli serta verifikasi eksternal sebelum produksi.

Seluruh pemeriksaan dirinci juga pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) dan **belum dijalankan**.

## 8. Status dan kelanjutan

**M04-S2:** **SEDANG (kode draft) / BELUM DIUJI**. **M04-S1:** kode draft, BELUM DIUJI. **M04-S3+: RENCANA**. Tidak ada perubahan aplikasi produksi atau kewenangan pejabat.

**Arah berikut:** M04-S3 dapat dimulai sebagai **rancangan tindak lanjut administratif** terhadap referensi yang sudah ditelaah, dengan kegiatan yang *menunggu klarifikasi/pembahasan*. Itu tetap **bukan otomatis mengizinkan alokasi, pembelian, paket, distribusi, atau BAST**.
