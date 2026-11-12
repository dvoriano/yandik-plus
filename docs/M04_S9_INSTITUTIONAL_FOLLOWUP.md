# M04-S9 | Register Tindak Lanjut Hasil Pembahasan Kelembagaan

**Kedudukan:** KODE DITULIS, **BELUM DIUJI**, tidak dipergunakan sebagai bukti kelayakan implementasi nyata.  
**Tanggal rancangan:** 11 November 2026 (WIB).  
**Lingkup:** pencatatan kekurangan, penanggung jawab, rencana koreksi, bukti metadata dan histori telaah atas kajian kelembagaan M04-S8 DEMO.  
**Kode:** [drafts/m04-institutional-followup/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup) · [commit modul](https://github.com/dvoriano/yandik-plus/commit/1f3a4f47118e8fb6c3c1ccb2fe143fc9bb9eab65) · [perbaikan isian kode referensi](https://github.com/dvoriano/yandik-plus/commit/d1624a7dcab447a88b9768065891590ee651a9db).

## 1. Maksud dan kedudukan

M04-S8 telah menyediakan 12 unsur kesiapan SOP serta usulan perubahan katalog unit. Pekerjaan lanjutan memerlukan sarana untuk **mencatat apa yang masih kurang, siapa yang menyiapkan perbaikan, dan bukti apa yang perlu dibahas**. M04-S9 dirancang sebagai register khusus **tindak lanjut hasil telaah DEMO** agar kekurangan tidak tercecer sebelum suatu saat dilakukan penilaian penggunaan riil.

**M04-S9 bukan otorisasi integrasi.** Register tidak menerbitkan SOP, mengesahkan perubahan katalog, memverifikasi bukti resmi, mengubah status checklist M04-S8, mengatur anggaran, menentukan penerima bantuan atau membuat BAST. Bahkan apabila **seluruh item berstatus `catatan_ditutup`**, kesimpulan tetap **KELAYAKAN INTEGRASI BELUM DINILAI**, bukan siap produksi.

## 2. Sumber temuan

| Sumber | Ketentuan | Yang dicatat |
|---|---|---|
| **Unsur kesiapan SOP** | M04-S8 `belum_diperiksa` atau `perlu_klarifikasi` | ID unsur, kekurangan, dampak, rencana koreksi |
| **Usulan perubahan katalog** | ID usulan perubahan M04-S8 DEMO yang ada | Dampak terhadap unit, eskalasi, RACI, SOP atau arsip |
| **Catatan pembahasan tambahan** | ID topik fiktif `DEMO-` yang tidak mengacu pada berkas asli | Persoalan koordinasi/kelembagaan yang belum tercakup checklist |

Sumber M04-S8 harus sudah **ditelaah** (dengan hasil dicatat untuk pembahasan, perlu perbaikan, atau tidak direkomendasikan), bukan draf yang belum dibaca. Itu pun tetap **telaah dalam DEMO**, bukan bukti rapat resmi. Data sumber dihitung melalui `governanceBoard()` M04-S8 dan dihubungkan dengan snapshot M04-S7. Jika sumber berubah, tindak lanjut yang ada **ditandai usang dan tidak boleh diteruskan tanpa pemeriksaan ulang**.

Satu temuan sumber dengan jenis yang sama hanya boleh mempunyai satu rencana **aktif** pada register contoh. Catatan ditutup/dibatalkan tidak dihapus, sehingga riwayat dan konteks rencana yang lama tetap terlihat.

## 3. Informasi yang harus dicatat pada setiap item

| Field | Maksud |
|---|---|
| ID temuan DEMO | Kode unik untuk penelusuran pada contoh |
| Jenis dan rujukan | Unsur kesiapan, usulan katalog atau topik diskusi yang terkait |
| Kekurangan | Apa yang diketahui masih perlu diperiksa/diperbaiki |
| Dampak | Risiko administratif bila kekurangan dibiarkan |
| **Rencana perbaikan** | Langkah konkret yang akan disiapkan dalam proses koordinasi |
| **Keluaran yang diharapkan** | Dokumen kerja, klarifikasi atau perbandingan informasi yang masih harus diverifikasi |
| **Penanggung jawab** | ID petugas fiktif DEMO, **bukan penugasan kedinasan** |
| **Tanggal rencana** | Tanggal DEMO yang dibandingkan dengan tanggal acuan manual, bukan SLA resmi |
| Progres dan rujukan bukti | Catatan upaya, kode metadata DEMO (bukan bukti asli) |
| Hasil dan pemeriksaan | Ringkasan pekerjaan, penelaah DEMO berbeda, pengembalian atau penutupan catatan |
| Histori dan perubahan sumber | Urutan aksi dan versi serta indikasi ketika sumber berubah |

**Tidak ada angka belanja, keputusan penerima, paket pembelian, distribusi, pengesahan SOP, tanda tangan atau BAST.**

## 4. Alur register dan pembagian peran

| Langkah | Peran DEMO | Perubahan status |
|---|---|---|
| Buat dan revisi rencana | Koordinator tindak lanjut kelembagaan | `draf` |
| Catat penugasan contoh | Koordinator DEMO | `draf → tercatat` |
| Mulai catatan kerja | Petugas perbaikan DEMO sesuai ID yang terdaftar | `tercatat → dalam_proses` |
| Tambah progres | Petugas yang sama | Tetap `dalam_proses`, menambah catatan dan rujukan DEMO |
| Ajukan hasil untuk dibaca | Petugas yang sama | `dalam_proses → menunggu_telaah` |
| Periksa catatan, minta perbaikan | Penelaah berbeda dari penyusun dan petugas | `menunggu_telaah → perlu_perbaikan` |
| Lanjutkan setelah dikembalikan | Petugas DEMO | `perlu_perbaikan → dalam_proses` melalui catatan progres |
| Tutup **catatan saja** | Penelaah DEMO | `menunggu_telaah → catatan_ditutup` |
| Batalkan rencana dengan alasan | Koordinator DEMO | Status aktif → `dibatalkan` |

**Makna utama:** `catatan_ditutup` menandakan hasil pekerjaan administratif contoh **sudah dibaca dan dicatat oleh penelaah**. Status ini **tidak** mengubah unsur M04-S8 menjadi `bahan_tersedia`, tidak mengesahkan perubahan katalog, dan tidak membuktikan proses teknis/keamanan/SPBE layak diterapkan.

Pelaku dan peran masih **label DEMO**, bukan autentikasi atau pengendalian akses sungguhan. Riwayat berada di memori browser, **belum merupakan audit permanen**.

## 5. Ringkasan antrean

Indikator rancangan meliputi jumlah temuan, jumlah aktif, menunggu telaah, perlu perbaikan, sumber berubah yang masih aktif, lewat tanggal rencana DEMO, catatan ditutup dan dibatalkan.

Tanggal rencana dibandingkan dengan **tanggal acuan yang dipilih secara eksplisit** di form. Penutupan atau pembatalan tidak termasuk item aktif yang melewati tanggal contoh. Semua indikator hanya menghitung **pekerjaan administrasi DEMO**, bukan pencapaian indikator kelembagaan resmi.

**Status kelayakan integrasi dibuat eksplisit:** `BELUM_DINILAI_DAN_TIDAK_DAPAT_DIPUTUSKAN_DARI_REGISTER`, tanpa kondisi apa pun yang mengubahnya menjadi siap.

## 6. Pengendalian perubahan dan batas keamanan

1. **Sumber M04-S8 yang sudah ditelaah:** tidak menerima berkas murni draf tanpa review DEMO.
2. **Snapshot dan stale guard:** perubahan status, versi, daftar persyaratan, usulan katalog atau dokumen SOP sumber membuat proses tindak lanjut berhenti sampai ada kajian ulang.
3. **Tidak ada pembaruan sumber otomatis:** menyelesaikan tindak lanjut tidak mengubah M04-S8 atau katalog M04-S7/M04-S6.
4. **Anti-duplikat aktif:** satu item aktif per jenis dan rujukan, sedangkan histori item terdahulu tetap ada.
5. **Pemisahan penelaah:** reviewer DEMO harus berbeda dari koordinator dan petugas pelaksana. Belum mengamankan identitas sungguhan.
6. **Tanpa data asli:** nomor, ID dan bukti contoh diawali `DEMO-`, tidak memuat data pegawai, nomor surat dinas, atau lampiran resmi.
7. **Tanpa pengiriman:** tidak memanggil API, email, SRIKANDI, disposisi, notifikasi atau layanan penyimpanan.
8. **Tanpa keputusan otomatis:** tidak memiliki tombol pengesahan SOP, penetapan unit, kesiapan integrasi, penerima bantuan, anggaran, pengadaan, distribusi dan BAST.

## 7. Berkas kode dan hasil pengerjaan

| Berkas | Peran |
|---|---|
| [`followup_register.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup/followup_register.mjs) | Model register, validasi, sumber M04-S8, transisi per item, progres, review, histori, ringkasan |
| [`fixtures.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup/fixtures.mjs) | Sumber M04-S8 yang ditelaah dengan dua kekurangan dan usulan katalog DEMO |
| [`main.mjs`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup/main.mjs) | Form rencana, progres, review, register dan filter |
| [`index.html`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup/index.html) | Tampilan rancangan register |
| [`style.css`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup/style.css) | Desain layar kecil yang **belum diuji** |
| [`README.md`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup/README.md) | Panduan kode, status dan batas penggunaan |

**Kode sudah masuk GitHub, tetapi fungsi, alur, aksesibilitas, keamanan, kebenaran perhitungan dan kompatibilitas antar-modul belum diuji.** `[skip ci]` digunakan pada commit.

## 8. Antrean pemeriksaan tertunda

- [ ] Konsistensi impor M04-S1/S2/S3/S5/S6/S7/S8/S9 dan pembuatan fixture DEMO.
- [ ] Penolakan berkas M04-S8 yang tidak pernah ditelaah; hasil diskusi tetap bukan keputusan resmi.
- [ ] Pembentukan temuan dari unsur kurang, usulan katalog dan topik DEMO tambahan.
- [ ] Anti-duplikat aktif, ID catatan, pencatatan lebih dari satu temuan dan kapasitas maksimum.
- [ ] Peran koordinator/petugas/penelaah yang terpisah, pilihan penanggung jawab dan validasi DEMO.
- [ ] Draf → tercatat → dalam proses → progres → submit → perbaikan atau tutup, pembatalan dengan alasan.
- [ ] Perubahan versi/rujukan sumber memblokir penutupan, tetapi histori tetap ada.
- [ ] Tanggal acuan manual, jumlah aktif, lewat tanggal dan ringkasan/hasil filter.
- [ ] Semua catatan ditutup tetap **tidak menghasilkan status siap integrasi**.
- [ ] Form 320/375px, keyboard, screen reader, error state, teks dan pengendalian data.
- [ ] Tinjauan kelembagaan nyata, keamanan/akses, SPBE, tata naskah, SOP dan otorisasi resmi.
- [ ] Audit permanen, API/DB dan pengelolaan dokumen hanya setelah prosedur resmi ditetapkan.

Rincian: [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Semua masih **BELUM DIUJI** atau **BUTUH KEPUTUSAN**.

## 9. Tahap selanjutnya

- **M04-S1 sampai S9:** SEDANG sebagai **KODE DITULIS, BELUM DIUJI**, belum diterapkan di produksi.
- **M04-S10+** untuk keputusan sah pejabat berwenang, alokasi, pengadaan, paket, distribusi, BAST dan evaluasi tetap **RENCANA**.
- **Tahap desain yang masuk akal selanjutnya:** rekap kesiapan kelembagaan untuk pimpinan sebagai **daftar ketidaklengkapan dan keputusan yang masih perlu diputuskan manusia**, bukan sertifikat kesiapan integrasi.
