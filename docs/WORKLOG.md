# WORKLOG | Catatan Pengembangan YANDIK+ (append-only)

**Cara membaca:** entri terbaru paling atas. Hanya catat sesuatu yang **betul-betul terjadi di GitHub**; pastikan tautan atau path bukti ada. Status milestone resmi tetap di [ROADMAP.md](ROADMAP.md).

## 2026-11-11 | M04-S7: katalog unit tujuan, RACI dan konsep aturan koordinasi
**Status:** KODE DITULIS, **BELUM DIUJI**. Tidak menjalankan CL/CI/tes.
- [Commit](https://github.com/dvoriano/yandik-plus/commit/64493b20e5abb3078f15f5abd48ffab3c77902eb) menambah [enam berkas DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-unit-catalog) untuk katalog empat unit tujuan yang konsisten dengan M04-S6, matriks enam kegiatan RACI, draf lingkup koordinasi, minimum checks, pengecualian, catatan arsip dan telaah naskah.
- Sumber harus catatan rute M04-S6 yang sudah **dicatat untuk pembahasan** dan sumber M04-S5 tidak berubah. Catatan `dicatat_untuk_bahan_sop` **BUKAN** SOP yang berlaku.
- [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S7_UNIT_CATALOG_RACI.md); daftar pemeriksaan kode, unit, kewenangan dan UI [ditunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- Tidak ada disposisi dinas/pengiriman data, perubahan M04-S5/S6, keputusan pejabat, uang, pembelian, paket, distribusi atau BAST.
- Status M04-S1 sampai S7 sebagai kode draft BELUM DIUJI; keputusan resmi/pengadaan/distribusi/BAST M04-S8+ RENCANA.

## 2026-11-11 | M04-S6: matriks alur eskalasi administratif dan tanggung jawab DEMO
**Status:** KODE DITULIS, **BELUM DIUJI**. Tidak memakai CL/CI/tes ataupun deployment.
- [Commit](https://github.com/dvoriano/yandik-plus/commit/0456b4307d982fa04c7891d9e1ee0c5a36b21b84) menambah [enam berkas draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix) untuk matriks 5×3 kategori/urgensi, pilihan unit DEMO, alasan jika berbeda, review peran terpisah, penanda sumber berubah dan teks ringkasan.
- Tidak ada pemanggilan penerusan otomatis ke M04-S5, tidak ada disposisi dinas maupun keputusan bantuan, anggaran, pengadaan atau BAST. Unit yang disarankan belum mewakili struktur organisasi sah.
- [Spesifikasi M04-S6](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S6_ROUTING_MATRIX.md), [backlog QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) dan PROJECT_STATE disinkronkan. Tidak ada data produksi/akun resmi/DB/arsip.
- Status M04-S1 hingga S6 **kode draft BELUM DIUJI**; M04-S7+ untuk proses keputusan resmi, paket, distribusi dan BAST tetap RENCANA.

## 2026-11-11 | M04-S5: kendala dan eskalasi administratif lintas petugas
**Status:** KODE DITULIS, **BELUM DIUJI**. Tidak ada CL, CI, Node test, browser atau deploy.
- [Commit M04-S5](https://github.com/dvoriano/yandik-plus/commit/3db79c4b0199fa635597d2caffde21ad3ca9838e) menambahkan [enam file draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations): register kendala, fixture M04-S3, form pelaporan, penerusan, respons, telaah, pembatalan beralasan, daftar dan rekap histori.
- Peran DEMO (pelapor, koordinator, penerima, penelaah) dipisah secara konseptual. Anti-duplikat kendala aktif sejenis dan sumber berubah menjadi persyaratan rancangan, bukan pengamanan server yang sudah diverifikasi.
- `ditutup_administratif` berarti catatan koordinasi ditutup, **tidak** membuktikan dokumen eksternal sah, masalah substantif selesai, bantuan diterima, anggaran, pengadaan atau BAST.
- [Spesifikasi M04-S5](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S5_ADMIN_ESCALATIONS.md); [backlog pemeriksaan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Seluruh sumber masih fiktif; tanpa autentikasi, API/DB dan audit permanen.
- M04-S1 hingga S5 berstatus SEDANG hanya pada kode draft BELUM DIUJI. Keputusan resmi dan distribusi/BAST M04-S6+ RENCANA.

## 2026-11-11 | M04-S4: Dashboard antrean tindak lanjut administratif
**Status:** KODE DITULIS, **BELUM DIUJI**, tanpa CL/CI/Node test/browser.
- [Commit M04-S4](https://github.com/dvoriano/yandik-plus/commit/a2bcc8ef931c0c0363bb92efd0d2d75671d447ef) membuat [enam berkas](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard): model rekap, delapan tugas contoh dari dua referensi DEMO, tabel, filter status/penanggung jawab/perhatian, tanggal acuan manual dan teks baca-saja.
- Dashboard hanya mengolah status M04-S3 tanpa mengubah tugas atau menjadikan `metadata_tercatat` M04-S2 sebagai dokumen resmi. Status selesai administratif bukan persetujuan bantuan/anggaran.
- [Dokumen M04-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S4_FOLLOWUP_DASHBOARD.md); [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) menampung pemeriksaan model, tanggal, filter, UI, source stale dan keamanan yang belum dilakukan.
- M04-S1/S2/S3/S4 SEDANG hanya sebagai **kode draft BELUM DIUJI**; keputusan resmi/paket/distribusi/BAST M04-S5+ tetap RENCANA. Produksi dan `main` tidak berubah.

## 2026-11-11 | M04-S3: rencana tindak lanjut administratif dari referensi eksternal
**Status:** KODE DITULIS, **BELUM DIUJI**. Tidak menjalankan CL, Node test, browser, CI atau workflow.
- [Commit M04-S3](https://github.com/dvoriano/yandik-plus/commit/805a052a11a7ceddeb5efdf382d209b344f03825) menambah [enam berkas](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup) untuk contoh daftar tugas, penanggung jawab/tanggal DEMO, proses, catatan, pengembalian, pembatalan dan pemeriksaan oleh peran DEMO.
- [Commit kontrol form](https://github.com/dvoriano/yandik-plus/commit/b4041ee90d70dd3505591531f508ba0ce8d01d54) memisahkan pembuatan rencana baru dan alasan pembatalan dari form utama.
- Data sumber berasal dari M04-S2 yang `metadata_tercatat` **bukan keaslian**. Status `ditutup_administratif` hanya catatan telah ditelaah, bukan konfirmasi surat, persetujuan bantuan atau realisasi anggaran.
- [Spesifikasi M04-S3](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S3_ADMIN_FOLLOWUP.md), [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Tidak ada integrasi server/DB, akun resmi atau data riil.
- M04-S1/S2/S3 masih **kode draft BELUM DIUJI**. M04-S4+ serta semua fungsi keputusan resmi, pengadaan, distribusi, BAST **RENCANA**.

## 2026-11-11 | M04-S2: register referensi dokumen eksternal pada berkas Support
**Status:** KODE DITULIS, **BELUM DIUJI**. Tidak menggunakan CL/CI/Node test/browser.
- [Commit model](https://github.com/dvoriano/yandik-plus/commit/edcc66dfd03ffba302ff7e88422a32d6b61a79ef) dan [commit navigasi multi-entri](https://github.com/dvoriano/yandik-plus/commit/7b177e2de92ec380971006a3f3497d775e4682b8) menyimpan [enam file draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference), menghubungkan sumber M04-S1 *fiktif* ke metadata referensi dokumen yang **diklaim terbit di luar sistem**.
- Model menyiapkan draf/ajukan/telaah/klarifikasi/tidak sesuai, pencatatan histori, anti-duplikat referensi dan peringatan sumber berkas berubah, tanpa status persetujuan.
- **Batas penting:** nomor dan instansi DEMO, autentikasi/konfirmasi penerbit/arsip asli belum ada; metadata `tercatat` bukan validasi legalitas, SK, bantuan atau anggaran. Tidak ada data riil, database atau audit persisten.
- [Dokumentasi M04-S2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md) serta [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) dibuat.
- **M04-S1 dan S2 SEDANG pada draft BELUM DIUJI**; M04-S3+ RENCANA; produksi, VPS dan bot Indodax tidak disentuh.

## 2026-11-11 | M04-S1: bahan pertimbangan administratif usulan Support
**Status:** KODE DITULIS, **BELUM DIUJI**. M04-S1 SEDANG dalam `drafts/`; keputusan bantuan, alokasi, pengadaan dan BAST M04 lainnya masih RENCANA.
- [Commit 9051571](https://github.com/dvoriano/yandik-plus/commit/9051571aeee25a2611850aa43406aceb6fe66a04) menambah [enam file](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review) untuk sumber kebutuhan DEMO terverifikasi, checklist administrasi, draf, pengajuan dan catatan telaah oleh peran DEMO terpisah.
- Draf administrasi lengkap **hanya dicatat sebagai bahan pertimbangan**; tidak menyediakan otorisasi/nominal/penetapan/penyaluran resmi. Riwayat dan teks memo hanya memori browser.
- [Spesifikasi M04-S1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S1_ADMIN_HANDOFF.md), [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); tidak menjalankan CL, CI, Node test, browser atau runtime.
- Tidak menghubungkan source Flask/APEL nyata atau mengubah kode M03 aktif, website dan VPS. Seluruh contoh fiktif.
- Berikutnya: rancangan register **referensi keputusan resmi** yang berasal dari pejabat/sistem berwenang, dengan verifikasi manual, bukan penerbitan keputusan.

## 2026-11-11 | M03-S4C: rancangan draf bahan penyusunan berita acara
**Status:** KODE DITULIS, **BELUM DIUJI**. Tidak menggunakan CL atau menjalankan CI, Node test maupun browser.
- [Commit M03-S4C](https://github.com/dvoriano/yandik-plus/commit/93a0d7df9e446af1db4f350ac47b34c56faf1c79) menambah `draft_minutes.mjs`, jembatan baca `review_ledger.mjs`, serta form agenda/tindak lanjut dan keluaran teks baca-saja di `review.html` / `review_ui.mjs`.
- Teks yang dirancang memuat pilihan bobot, rincian skor fiktif, alasan, status pendapat provinsi, histori **pengajuan/rekomendasi/perbaikan**, serta tindak lanjut.
- **Bukan berita acara resmi:** tanpa nomor/tanggal yang diverifikasi, nama pejabat, tanda tangan, pengadaan, anggaran, penetapan penerima, atau BAST. Data di memori browser, tidak diunggah/dikirim otomatis.
- [Spesifikasi M03-S4C](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4C_DRAFT_MINUTES.md); pemeriksaan nanti dicatat di [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Status M03-S4A/B/C tetap **BELUM DIUJI**.
- Next: rancangan proses administrasi keputusan berwenang yang terpisah; M04 masih RENCANA.

## 2026-11-11 | M03-S4B: rancangan formulir dan histori telaah metodologi
**Status:** kode dan dokumen tercatat, **BELUM DIUJI**; tidak memakai CL/CI.
- [Commit M03-S4B](https://github.com/dvoriano/yandik-plus/commit/bfa697af515479ec05735badcde4c89222e8c5d8) membuat registrasi review metode `review_ledger.mjs`, UI DEMO terpisah dan navigasi dari simulasi perbandingan.
- Pembuat kajian memasukkan alasan dan batas data, mengajukan; peran provinsi mencatat tinjauan atau meminta perbaikan. Review **bukan** persetujuan bobot resmi, alokasi atau penerima bantuan.
- Kode tidak memakai login maupun database, hanya identitas fiktif dan memori browser. [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4B_REVIEW_POLICY.md).
- [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) mencatat pemeriksaan yang ditunda. Tidak ada angka keberhasilan tes baru.
- M03 tetap SEDANG; M04 RENCANA; produksi dan bot Indodax tidak berubah.

## 2026-11-11 | Penyempurnaan ringkasan eksekutif dan kebutuhan AI Agent
**Status:** DRAF 1.1 untuk pimpinan/Inspektorat/Diskominfotik; belum ada persetujuan substansi.
- [Revisi Ringkasan Eksekutif](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) ([commit](https://github.com/dvoriano/yandik-plus/commit/ad054783b5fec427651b1ea1d57e30b906a61876)): latar belakang, tujuan, kelompok modul, alur, status pengembangan, tata kelola, dan arahan kelembagaan diperjelas dalam gaya naskah kebijakan.
- Penjelasan khusus **AI Agent sebagai sarana bantu pembangunan YANDIK+**, berbeda dari chatbot bagi pengguna. Kredit/token/kuota penggunaan dan mekanisme top-up dibahas sebagai **kebutuhan untuk ditelaah**, bukan belanja yang sudah disetujui.
- [Pengenalan Lengkap](PENGENALAN_YANDIK_PLUS.md) diselaraskan pada bagian AI dan FAQ; halaman utama README diperbarui.
- Tetap tanpa CL, CI, uji kode, merge, deploy, dan perubahan produksi. Review formal pada Issue #21 masih terbuka.

## 2026-11-11 | Dokumen publikasi terbatas: pengenalan YANDIK+ untuk pimpinan dan pemeriksa
**Status:** dua naskah **DRAF untuk telaah**, selesai ditulis di GitHub tetapi belum disetujui secara kedinasan. Tidak ada pengujian/CL/CI.
- [Ringkasan Eksekutif](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md): tujuan, manfaat, kelompok modul, mekanisme operasional, batasan dan titik konsultasi dengan pimpinan/Inspektorat/Diskominfotik.
- [Pengenalan Lengkap YANDIK+](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/PENGENALAN_YANDIK_PLUS.md): fungsi 15 modul, 14 sistem kerja bersama, alur APEL/Support/Pengawasan/Pembinaan, matriks pengguna, pengelolaan data, pertanyaan pengawasan, SPBE, perlindungan informasi dan kedudukan AI opsional.
- [Commit pembuatan dua naskah](https://github.com/dvoriano/yandik-plus/commit/19eae9de3525838593b6347d20400bf4faec2cc8), penautan dari README, katalog modul, masterplan, project state dan roadmap.
- **Penting:** dokumen nonteknis menjelaskan rancangan; tidak menyatakan keseluruhan modul siap digunakan, tidak menggantikan kewenangan pejabat atau sistem resmi. Belum ada review formal.
- [Issue #21](https://github.com/dvoriano/yandik-plus/issues/21) dibuat untuk mengumpulkan masukan formal/operasional, tanpa menyatakan sudah ada persetujuan pihak terkait.
- Repository private, pihak eksternal harus memiliki akses GitHub; tidak diubah menjadi public.
- Mode coding tanpa CL/CI tetap berlaku; M03-S4 masih **BELUM DIUJI**, M04 **RENCANA**.

## 2026-11-11 | M03-S4: draft simulasi fairness, tanpa CL/CI dan tanpa tes
**Status:** M03-S4 SEDANG / KODE DITULIS / **BELUM DIUJI** (bukan SELESAI).
- Atas instruksi owner, mode coding GitHub-only **tanpa CL dan tanpa pengujian/CI** diterapkan. Jatah CL disisihkan untuk bot Indodax.
- [Commit 3e30ac4](https://github.com/dvoriano/yandik-plus/commit/3e30ac406a24ec17ee604b654251c7b3eb1cee7c) menyimpan enam berkas draft baru pada [drafts/m03-s4-fairness](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness), di luar filter workflow otomatis, berpesan `[skip ci]`.
- Isi kode: perbandingan enam skenario fiktif antar Puskeswan, bobot baseline/akses-SDM/kontinuitas, data kosong tidak dihitung nol, tie bersama, analisis sensitivitas. **Ini hanya rancangan belum dijalankan**.
- [Rencana M03-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4_FAIRNESS_PLAN.md), [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) dan [CODE_ONLY_MODE](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md) sebagai acuan semua pekerjaan berikut.
- **Tidak ada tes yang dijalankan untuk M03-S4.** Angka 176 tes di M03-S3 berasal dari commit sebelumnya dan tidak membuktikan draft ini.
- Berikutnya: lanjut coding langsung di GitHub tanpa mengaktifkan CI, catat QA tertunda; tidak ada implementasi alokasi/BAST atau deploy.

## 2026-11-11 | M03-S3: scorecard prioritas transparan dan review provinsi
**Jenis:** coding prototype, UI HP, 19 tes Node priority dan 3 tes Chromium baru. **Status:** M03 SEDANG; M04 RENCANA.
- Lima indikator berbobot percobaan dengan alasan dan sumber DEMO, skor dibedakan dari data kosong, total pelayanan APEL mentah tidak dihitung.
- Alur kab/kota menilai → provinsi menerima, mengembalikan, atau mengoreksi rekomendasi dengan alasan; baseline tetap, tidak ada alokasi bantuan.
- Model, tes, UI dan guard versi sumber tercatat pada [M03_PRIORITY_ASSESSMENT.md](M03_PRIORITY_ASSESSMENT.md).
- [GitHub Actions #42939237270](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270) **SUCCESS** tiga job, 65 Python + 94 Node + 17 Chromium = **176 tes otomatis**; validator fixture berhasil.
- **Belum:** validasi kriteria/bobot oleh instansi, pembanding fasilitas riil, source Flask lama di GitHub, API/DB dan otorisasi resmi, upload bukti, uji petugas HP fisik.
- Next: skenario anonymized cross-Puskeswan dan penilaian kewajaran metodologi, bukan keputusan bantuan.

## 2026-11-11 | M03-S2: bukti metadata dan anti-duplikasi lintas masalah
**Status:** M03 SEDANG (prototype); M04 RENCANA.
- [Model bukti dan pencarian item serupa](https://github.com/dvoriano/yandik-plus/commit/41ce4079840af89e4f8216d3f31124ac5fb3e815): kode DEMO, validasi format, normalisasi barang, riwayat usulan ditolak dan alasan pengajuan ulang.
- [15 tes tambahan](https://github.com/dvoriano/yandik-plus/commit/49326c9b9a9d6233dddf25e9e4a132ac607068f4); [UI](https://github.com/dvoriano/yandik-plus/commit/82691922ca6c602d22089951f8f0f0c4e26d75e1) menambah kolom bukti dan konfirmasi verifikator; [2 tes browser baru](https://github.com/dvoriano/yandik-plus/commit/77f0f344127e1d81a404caf041b883260754474e).
- [GitHub Actions #42936090527](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527): **SUCCESS** 3 job, **65 Python + 75 Node + 14 Chromium = 154 tes**; validator fixture lulus.
- [Dokumen M03-S2](M03_EVIDENCE_AND_DEDUP.md).
- **Batas:** kode bukti bukan file terunggah/diperiksa; tidak ada transaksi DB, dukungan anggaran, API, BAST, atau produksi.
- **Next:** M03-S3 prioritas bantuan terukur dan adil dengan penjelasan serta keputusan manusia.

## 2026-11-11 | M03-S1: usulan Support dari masalah terverifikasi
**Jenis:** coding demo, 15 tes Node, formulir, 3 tes browser, dokumentasi per modul. **Status:** M03 SEDANG, M04 RENCANA.
- [Commit model](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926) membuat `support_needs.mjs`, sumber dari `problem_id`, ruang lingkup dan histori, proteksi duplikasi kebutuhan aktif, larangan approval otomatis.
- [Commit UI](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7) memasang tombol pada masalah yang telah diverifikasi, draf/ajukan usulan, antrian verifikasi dan pengujian Chromium.
- [GitHub Actions #42862700052](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052) **SUCCESS**: 65 Python + 60 Node + 12 Chromium = **137 tes**, dan validator fixture lulus.
- [Dokumen M03-S1](M03_LINKED_SUPPORT_NEEDS.md) memisahkan status kebutuhan terverifikasi dari keputusan bantuan/anggaran/BAST.
- Belum source Flask 171 file, API/DB, autentikasi, bukti lampiran, prioritas objektif, persetujuan bantuan, distribusi maupun HP fisik.
- Next: kategori/kriteria bukti dan anti-duplikasi, skor penilaian adil dengan manual override; produksi tetap utuh.

## 2026-11-10 | M02-S4: Permasalahan, SDM/APEL baca-saja, 119 tes otomatis lulus
**Jenis:** coding model dan UI browser di GitHub, unit test Node, E2E Chromium, dokumentasi. **Status:** M02 SEDANG (prototype), M03/M04 masih rencana.
- [Commit model dan 20 tes baru](https://github.com/dvoriano/yandik-plus/commit/c973bdc3f744805b39c9cd39447cca185444ba95): register masalah 6 kategori, draf→ajukan→perbaikan→terverifikasi→tindak lanjut→selesai; 6 pemeriksaan sumber data fiktif baca-saja.
- [Commit UI dan 3 tes Chromium baru](https://github.com/dvoriano/yandik-plus/commit/f06ee93c134eac9f03871a7bf590391a41aee8b1): kartu SDM/APEL, pilihan periode, pembeda nol/belum melapor, daftar masalah, form dan antrian verifikasi.
- [GitHub Actions #42850233101](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101) **SUCCESS**, 65 Python + 45 Node + 9 browser = **119 tes otomatis**; validator fixture lulus.
- Detail [M02_PROBLEMS_AND_REFERENCES.md](M02_PROBLEMS_AND_REFERENCES.md).
- **Batas:** angka SDM/APEL dari snapshot fiktif statis, bukan API real. Masalah tercatat tidak berarti bantuan disetujui. Login role hanya simulasi, semua hilang saat refresh.
- **Belum:** source Flask legacy 171 file, UI HP fisik, field asli, DB/API, autentikasi, bukti foto, modul Support dan deployment.
- **Berikutnya:** uji aksesibilitas serta kontrak referensi satu arah dari masalah ke Support tanpa mengubah kewenangan anggaran.

## 2026-11-10 | M02-S3: perbaikan draf, uji browser Chromium dan peta Profiling
**Jenis:** coding UI, regresi Node, 6 tes browser E2E melalui GitHub Actions, pemetaan domain sementara. **Status:** M02 SEDANG.
- [Perbaikan](https://github.com/dvoriano/yandik-plus/commit/0ce6b2db1ef0f9ca417eea072f1307c1ee94de30): draf tersimpan dapat diajukan tanpa edit ulang; pimpinan tidak lagi menampilkan rincian individual.
- [Browser tests](https://github.com/dvoriano/yandik-plus/commit/78cf52a06d38874581a6709bf7b22b723704ed40): Chromium 320/375px, tanpa overflow, draf → submit, perbaikan → verifikasi, tampilan pimpinan dan reset demo.
- Masalah Ubuntu 26.04 pada CI diatasi dengan [pin Ubuntu 24.04](https://github.com/dvoriano/yandik-plus/commit/c810f5f565843ee9487440bf97da33bc8c8ee7fc) tanpa menyentuh website.
- [GitHub Actions #42846236703](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703): **SUCCESS**, **65 tes Python + 25 Node + 6 Chromium = 96 tes**, validator fixture lulus.
- [Peta 9 domain Profiling 2026](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROFILING_2026_MAPPING.md) dibuat; ini bukan validasi field legacy karena Flask lama belum ada di repo.
- Masih perlu: uji pengguna manusia/screen reader, real HP, field-level mapping, autentikasi/API/database dan integrasi.
- Berikutnya: skema Permasalahan dan referensi baca-saja SDM/APEL tanpa input ganda, tetap GitHub-only.

## 2026-11-10 | M02-S2: Prototype halaman Profil Saya dan antrian verifikator
**Jenis:** coding frontend demo GitHub-only + test Node, belum ada deployment. **Status:** M02 SEDANG (prototype interaktif).
- [Commit model & tes](https://github.com/dvoriano/yandik-plus/commit/6c807fa21fd130e0e28093eedb53623b9520e866): 20 tes alur draf, pengajuan, permintaan perbaikan dan review role-switch simulasi.
- [Commit UI & CI](https://github.com/dvoriano/yandik-plus/commit/3096d64f2b2d113318ba3ee365abe814c2f6a910): HTML semantik, CSS responsif, JS interaktif, 5 bagian profil, status/indikator, antrian review dan panduan.
- [GitHub Actions #42844096701](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701) **SUCCESS**, job `offline-contracts` dan `profile-ui-demo` berhasil. 65 tes Python sebelumnya dan 20 tes model Node.
- Demo ini **bukan** login nyata: role picker hanya simulasi, data fiktif, perubahan memori browser hilang ketika refresh. Tidak ada server/API/database.
- [Dokumen UI demo](M02_UI_DEMO.md), [folder sumber](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/prototypes/profil-puskeswan/).
- **Belum:** uji UX dengan petugas manusia, browser E2E, mapping Profiling asli, source Flask legacy, database, deploy.
- **Next:** periksa aksesibilitas, uji alur mobile secara terkontrol dan mapping komponen real bila source tersedia di GitHub.

## 2026-11-10 | M02-S1: Profil per bagian dan 65 tes GitHub berhasil
**Jenis:** coding + unit test, tanpa VPS. **Status:** M02 SEDANG hanya sebagai prototype; M00/M01 masih SEDANG.
- [Kode](https://github.com/dvoriano/yandik-plus/commit/ee9cceecfe4a61c315e6bef6a38f0e6c9b4e30e8): draf satu bagian, submit, review kab/kota/provinsi sesuai wilayah, koreksi, alasan, audit dan proteksi versi lama.
- [25 pengujian](https://github.com/dvoriano/yandik-plus/commit/12007b6d8cc1c96011e0b521510b0adf6d600557) mencakup akses lintas wilayah, larangan self-approval, edit hanya di bagian terkait, optimistic version, dan apply hanya setelah persetujuan.
- [GitHub Actions #42842163389](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389) **SUCCESS**: total 65 tes foundation, validasi fixture juga berhasil.
- [Spesifikasi](M02_PROFILE_EDITS.md). SDM/APEL tidak diduplikasi.
- Belum: aplikasi Flask, UI HP, penyimpanan DB, unggahan bukti dan deployment.
- Berikutnya: prototipe antarmuka Profil Saya dan alur antrian verifikator.

## 2026-11-10 | M01-S2 master Puskeswan, SDM, sarpras dan profiling
**Jenis:** coding langsung di GitHub dan CI; M01 SEDANG, M02 (modul tampilan) masih RENCANA.
- [Kode master dan 4 jenis fixture](https://github.com/dvoriano/yandik-plus/commit/420354a885c6291c609e4ab6f25347cadbd2360a) serta [18 tes tambahan dan validator terpadu](https://github.com/dvoriano/yandik-plus/commit/43ee5ff342659fb1bb96eac552bad687e3ab0854).
- Penempatan SDM per tanggal, observasi alat dengan histori, profil terverifikasi, dan hubungan data APEL/Support.
- [GitHub Actions #42840263033](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033) **SUCCESS**. Total 40 tes foundation, tanpa akses VPS.
- Belum: source Flask 171 file, adapter database/endpoint, UI Profil dan pengujian APEL riil.
- Berikutnya: lanjut kontrak/adaptor pengembangan dan input profil yang mudah digunakan.

## 2026-11-10 | Sinkronisasi status milestone
- M00 **SEDANG** karena source Flask legacy belum masuk repo; M01 **SEDANG** hanya untuk prototype.
- Bukti M01: [commit 9fe3ce0](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac), [Actions #42838727867](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867) SUCCESS.

## 2026-11-10 | M01-S1: prototype role/wilayah dan workflow, tes lulus
**Jenis:** coding, role authorization, audit workflow, pengujian GitHub Actions.  
**Status:** M01 SEDANG pada prototype, M00 tetap SEDANG menunggu source Flask.
- `foundation/yandik_base/access.py`: role provinsi, kab/kota, Puskeswan, pimpinan; default deny dan larangan akses lintas wilayah.
- `foundation/yandik_base/workflow.py`: transisi draf/pengajuan/verifikasi/perbaikan/tindak lanjut, alasan wajib, audit append-only.
- `foundation/tests/test_access_workflow.py`: 12 tes tambahan; total suite foundation **22 tes**.
- **Commit:** [9fe3ce0](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac). **Pengujian:** [run #42838727867](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867) **SUCCESS**.
- **Belum:** diterapkan di login/API Flask, database/BAST, ataupun website produksi.
- **Berikutnya:** integrasi aman bila source lama tersedia, dan komponen master data + pemeriksaan role dengan data dummy.

## 2026-11-10 | M00: fondasi kode dan pengujian GitHub SUCCESS
**Jenis:** coding + data dummy + pengujian CI. **Status:** M00 tetap SEDANG.
- Menambahkan `foundation/yandik_base/contracts.py` untuk kontrak identitas Puskeswan, APEL bulanan dan kebutuhan bantuan.
- Membuat 3 file fixture sintetis, validator, 10 tes Python dan workflow GitHub Actions read-only.
- Tes memeriksa pelaporan ganda, missing vs nol, referensi master Puskeswan, periode, nilai negatif dan kategori bantuan.
- [Bukti commit 2081606](https://github.com/dvoriano/yandik-plus/commit/2081606d0cd4109eb5f45415688ff4a663937fb6) dan [GitHub Actions run 42837742904](https://github.com/dvoriano/yandik-plus/actions/runs/42837742904) dengan hasil **SUCCESS**.
- **Belum:** source Flask legacy 171 file, integrasi ke website, regresi APEL asli, deployment.
- **Berikutnya:** M00-D impor source langsung via konektor bila memungkinkan; lanjut kode/test independen di GitHub tanpa meminta setup manual.

## 2026-11-10 | Penetapan cara kerja GitHub-only
**Jenis:** keputusan + dokumentasi tata kerja.  
**Status:** M00 SEDANG; progres dokumentasi selesai, source lengkap masih belum ada di GitHub.

**Dilakukan:**
- Pemilik menetapkan tidak menggunakan ZIP/unduh/PowerShell/setup laptop, SSH atau VPS pada fase pengembangan.
- Menambahkan `PROJECT_STATE.md` untuk handoff lintas chat.
- Membuat `docs/GITHUB_WORKFLOW.md` sebagai aturan baca → kerja → verifikasi → catat.
- Memutakhirkan `docs/ROADMAP.md`, README, `docs/START_HERE.md` dan panduan impor agar tidak lagi mengarahkan pengguna ke setup eksternal.
- Mempertahankan modul dan masterplan yang telah dibuat.

**Bukti:** perubahan pada branch `develop/yandik-foundation`, [Draft PR #9](https://github.com/dvoriano/yandik-plus/pull/9), [Issue M00 #1](https://github.com/dvoriano/yandik-plus/issues/1).  
**Belum dilakukan:** impor source Flask 171 file ke GitHub, tes runtime Flask, deploy.  
**Berikutnya:** bangun struktur pengujian dan konfigurasi dummy **langsung di GitHub**, kemudian lanjut source baseline jika tersedia jalur import tanpa setup manual.

## 2026-11-10 | Persiapan masterplan dan M00
**Jenis:** dokumentasi arsitektur dan validator.  
**Dilakukan:** masterplan, 15 dokumen modul, roadmap, issues, `scripts/verify_import.py`, PR draft.  
**Bukti:** [PR #9](https://github.com/dvoriano/yandik-plus/pull/9), [ROADMAP.md](ROADMAP.md).  
**Batasan:** ZIP source offline sempat disiapkan dalam percakapan, tetapi **tidak diimpor ke GitHub**.
