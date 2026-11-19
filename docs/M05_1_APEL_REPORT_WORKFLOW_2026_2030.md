# M05-1 | Siklus Draf, Pengiriman dan Koreksi APEL 2026–2030

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Lanjutan M05-0. Hanya kode DEMO pada `drafts/m05-apel-workflow`, bukan perubahan website, Flask, atau database. Kebijakan tahun 2027–2030 tetap menunggu penetapan masing-masing.

## 1. Tujuan dan kunci induk
Pelapor Puskeswan dapat menyiapkan laporan bulanan bertahap, mengirim setelah lengkap, menerima permintaan perbaikan dan mengirim kembali. **Satu identitas laporan per pasangan Puskeswan–periode YYYY-MM.** Perbaikan menambah revisi, bukan menambah laporan induk atau menggandakan jumlah bulan terlapor.

## 2. Siklus status

| Aksi DEMO | Asal → hasil | Pelaksana | Perlindungan |
|---|---|---|---|
| Buat draf | Belum ada → DRAFT | Puskeswan/admin provinsi sesuai scope | Tolak kunci induk duplikat |
| Simpan draf | DRAFT → DRAFT | Pelapor berwenang | Dapat belum lengkap, revisi bertambah |
| Kirim | DRAFT → SUBMITTED_REVIEW_PENDING | Pelapor | M05-0 memvalidasi data lengkap |
| Kembalikan | SUBMITTED_REVIEW_PENDING → CORRECTION_REQUESTED | Verifikator provinsi/kab-kota sesuai scope | Alasan wajib, pemisahan aktor, salinan terkirim tetap |
| Revisi | CORRECTION_REQUESTED/REVISION_DRAFT → REVISION_DRAFT | Pelapor | Tidak menimpa snapshot terkirim sebelumnya |
| Kirim ulang | REVISION_DRAFT → SUBMITTED_REVIEW_PENDING | Pelapor | Validasi ulang, jejak revisi baru |

**Tidak ada transisi persetujuan, verifikasi akhir, publikasi, penilaian, sertifikasi, atau pencairan bantuan.** Status terkirim hanya berarti *menunggu telaah*.

## 3. Identitas, peran dan wilayah
Kode memanggil `backendPrincipal(resolveServerSession)` dari kontrak M04-I6B dan `resolveFacility(facilityId)` yang wajib berasal dari server tepercaya. Input tidak dapat memilih `actor_id`, `role`, atau wilayah.

- Puskeswan dibatasi unit dan wilayah sendiri.
- Admin provinsi dapat menyiapkan/mengirim DEMO, tetapi ini belum penetapan kewenangan dinas.
- Verifikator provinsi/kab-kota dapat meminta perbaikan sesuai cakupan.
- Pimpinan tidak dapat menyunting atau membaca rincian melalui kontrak ini.
- `expected_revision` menolak tindakan berbasis versi lama; `request_id` ganda ditolak tanpa menambah event.

**Batas:** Tidak ada autentikasi nyata, proteksi CSRF, logout, rate-limit, otorisasi API, audit permanen, maupun jaminan callback server benar-benar dipercaya.

## 4. Kelengkapan, bukti, dan historis
Pada draf, nilai belum diisi boleh `null` dan bukan nol. Pada saat kirim, validasi M05-0 wajib terpenuhi termasuk deklarasi laporan nol secara eksplisit, investigasi per kejadian/lokasi, hewan kurban ante+post unik, dan format ID bukti fiktif.

`evidence_refs` hanya metadata `DEMO-...`, bukan foto/arsip asli. Alasan pengembalian berupa teks DEMO tanpa tautan dan fragmen kredensial.

Setiap event dalam memori mencatat ID perintah, revisi, ID/role aktor DEMO, status dan salinan metadata draf atau laporan terkirim. **Belum ada DB append-only, cap waktu server, transaksi atomik, tanda tangan audit, perlindungan perubahan state dari klien, atau ketahanan restart.** Akses ke objek state dan callback harus dipagari oleh backend saat integrasi kelak.

## 5. Pembatasan per tahun
- 2026 memerlukan uji parity ke Juknis dan Flask aktual; perilaku DEMO tidak diklaim sama dengan layanan resmi.
- 2027–2030 tetap memakai versi kebijakan tahunan draf yang berbeda. Tenggat, peringkat, apresiasi dan persetujuan resmi belum ada.
- 2031+ ditolak sampai registry kebijakan diperluas melalui keputusan.
- M05-1 belum memasukkan laporan ke checklist kepatuhan resmi. Status draf/menunggu telaah tidak boleh keliru dianggap laporan yang telah disahkan.

## 6. QA dan langkah selanjutnya
- [Kode siklus](../drafts/m05-apel-workflow/workflow.mjs)
- [Fixture pengguna/fasilitas](../drafts/m05-apel-workflow/fixtures.mjs)
- [19 skenario tertulis](../drafts/m05-apel-workflow/tests/workflow.test.mjs)
- [M05-0](M05_0_APEL_MULTIYEAR_2026_2030.md) · [TEST_BACKLOG](TEST_BACKLOG.md)

**19 skenario tertulis, 0 dijalankan.** Tidak ada tes Flask, database, keamanan, UI, atau deployment.

**Berikutnya M05-2 (RENCANA):** checklist kepatuhan multi-tahun menurut status belum ada, draf, menunggu telaah, kembali untuk revisi, serta aturan tenggat yang berversi per tahun. Tidak membuat keputusan tenggat otomatis tanpa bukti kebijakan.
