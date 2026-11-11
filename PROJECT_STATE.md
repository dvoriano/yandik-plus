# PROJECT STATE | YANDIK+ (BACA PERTAMA PADA CHAT BARU)

**Terakhir diperbarui:** 11 November 2026, WIB  
**Kanonik:** repository [dvoriano/yandik-plus](https://github.com/dvoriano/yandik-plus) (**metadata GitHub PUBLIC per pemeriksaan 11 November 2026; jangan masukkan data riil/rahasia**)  
**Branch kerja:** [develop/yandik-foundation](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation)  
**Pull Request aktif:** [#9 (DRAFT)](https://github.com/dvoriano/yandik-plus/pull/9) → `main`. **Jangan merge otomatis.**  
**Milestone aktif:** **M00, M01, M02 dan M03 SEDANG** (semuanya pengembangan GitHub, tidak di-deploy); status resmi di ROADMAP. ([Issue #1](https://github.com/dvoriano/yandik-plus/issues/1)).

## RISIKO TERBUKA | VISIBILITAS REPOSITORI DAN AUDIT STATIS | 11 November 2026
- **GitHub metadata: PUBLIC**, sedangkan beberapa catatan lama menyebut PRIVATE. Koreksi penjelasan dilakukan pada dokumen; **pengaturan visibilitas GitHub belum diubah**. Lihat [catatan audit statis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9B_STATIC_REVIEW.md).
- Tidak ada bukti QA untuk M04-S9B atau persetujuan kelembagaan; jangan memuat data riil/rahasia ke kode publik. Keputusan visibilitas dan klasifikasi berada pada pemilik repositori.

## PEMBARUAN M04-S9B | REKAP EKSEKUTIF PEMBAHASAN KELEMBAGAAN | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [tujuh berkas baru](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-briefing) dan [spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9B_EXECUTIVE_BRIEFING.md); sumber M04-S8/S9 DEMO dibaca tanpa mutasi. [Commit 96e0914](https://github.com/dvoriano/yandik-plus/commit/96e091411249c46f444d19cd4f62694bf36458fc).
- Ringkasan 12 unsur (10 wajib, 2 opsional), daftar kekurangan wajib tanpa register aktif, penanggung jawab dan rencana koreksi, tenggat contoh, sumber berubah serta usulan perubahan unit.
- Daftar pertanyaan diperuntukkan bagi manusia/pemilik proses. Status kelayakan integrasi tetap **BELUM DINILAI**, walau semua catatan ditutup; bukan hasil audit, pengesahan SOP atau keputusan bantuan.
- QA-M04S9B masih **BELUM DIUJI** pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Tidak ada CL, CI, browser, tes, deployment, main atau produksi; PR #9 tetap DRAFT.
- Lanjutan: audit statis dan penyiapan QA, tanpa menjalankan pengujian sampai izin owner. M04-S10+ keputusan sah pejabat/anggaran/pengadaan/distribusi/BAST tetap **RENCANA**.

## PEMBARUAN M04-S9 | REGISTER TINDAK LANJUT HASIL PEMBAHASAN KELEMBAGAAN (TERBARU) | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit register](https://github.com/dvoriano/yandik-plus/commit/1f3a4f47118e8fb6c3c1ccb2fe143fc9bb9eab65) dan [perbaikan kode topik tambahan](https://github.com/dvoriano/yandik-plus/commit/d1624a7dcab447a88b9768065891590ee651a9db) menyimpan enam berkas [`drafts/m04-institutional-followup/`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-institutional-followup) untuk tindak lanjut kelembagaan dari M04-S8 DEMO.
- **Tiga sumber temuan:** persyaratan kelembagaan yang belum diperiksa/perlu klarifikasi, usulan perubahan katalog dan topik pembahasan DEMO. Setiap item mempunyai uraian kekurangan, dampak, rencana koreksi, penanggung jawab, tanggal rencana, progres, hasil, telaah dan histori.
- **Transisi:** draf → tercatat → dalam proses → menunggu telaah → perlu perbaikan/ditutup administratif; bisa dibatalkan dengan alasan. Sumber M04-S8/M04-S7 yang berubah akan ditandai untuk kajian ulang.
- **Batas:** `catatan_ditutup` **BUKAN** persyaratan resmi terpenuhi atau sistem siap diintegrasikan. Tidak mengubah SOP/katalog/sumber, tidak menerbitkan keputusan pejabat, alokasi, pengadaan, distribusi atau BAST. Pelaku/data DEMO di memori browser, bukan autentikasi/audit.
- **Dokumen:** [Spesifikasi M04-S9](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9_INSTITUTIONAL_FOLLOWUP.md) dan [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Mode CODE_ONLY: **tanpa CL, tes, CI dan deploy**.
- **Status:** M04-S1 sampai S9 SEDANG hanya kode draft **BELUM DIUJI**; keputusan resmi/paket/BAST M04-S10+ **RENCANA**. PR #9 tetap DRAFT; branch `main`, website, VPS dan bot Indodax tidak disentuh.
- **Next:** rekap daftar temuan kelembagaan yang perlu keputusan/perbaikan manusia, bukan status siap integrasi otomatis.

## PEMBARUAN M04-S8 | PERSYARATAN SOP DAN PERUBAHAN KATALOG | 11 November 2026
- **Pemeriksaan baca-kode (tanpa eksekusi), 11 Nov 2026:** seluruh lingkup M04-S8 telah tersedia pada draft sebelumnya. [Perbaikan kecil UI](https://github.com/dvoriano/yandik-plus/commit/0b9f4320b50a485f140f2205a9c23253a31a921c) mengaktifkan kembali kolom bukti saat unsur checklist `bahan_tersedia` dibuka ulang; **BELUM DIUJI** dan tidak mengubah proses resmi.
- **KODE DITULIS, BELUM DIUJI:** [kode M04-S8](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-sop-governance) pada [commit](https://github.com/dvoriano/yandik-plus/commit/aa6b8949b20094df481bd06b64504cfa6cff27a8) dan [revisi](https://github.com/dvoriano/yandik-plus/commit/8a510f46f7a428f78df6d0a18d1f4d95165da10a) menambah 12 unsur pemeriksaan kelembagaan, usulan perubahan unit tambah/ubah/nonaktif, dampak ke M04-S6/RACI M04-S7/SOP, rollback dan dua alur telaah DEMO.
- Hasil `bahan_tersedia`/`dicatat_untuk_pembahasan` **BUKAN** pengesahan SOP, bukti surat sah, atau perubahan katalog aktif. Sumber M04-S7 disimpan sebagai snapshot; histori di memori browser bukan audit resmi.
- [Spesifikasi M04-S8](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S8_SOP_GOVERNANCE.md); [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). **Tanpa CL/CI/tes**, tanpa sentuh website, VPS, Indodax atau `main`, PR #9 tetap DRAFT.
- **Status:** M04-S1 hingga S8 kode draft **BELUM DIUJI**; M04-S9+ keputusan/anggaran/paket/distribusi/BAST masih **RENCANA**.
- Next: register tindak lanjut hasil pembahasan kelembagaan, tetap tanpa penetapan otomatis.

## PEMBARUAN M04-S7 | KATALOG UNIT, RACI, DRAF ATURAN KOORDINASI (TERBARU) | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit](https://github.com/dvoriano/yandik-plus/commit/64493b20e5abb3078f15f5abd48ffab3c77902eb) menambah enam berkas pada [drafts/m04-unit-catalog/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-unit-catalog): katalog empat unit tujuan DEMO konsisten dengan M04-S6, matriks RACI enam kegiatan, draf naskah koordinasi, telaah, pengembalian dan histori.
- **Sumber rancangan:** hanya catatan rute M04-S6 `dicatat_untuk_pembahasan` dan sumber M04-S5 yang tidak berubah. Unit tidak dapat diganti diam-diam; penelaah DEMO berbeda bisa mencatat sebagai **bahan SOP, bukan pengesahan**.
- **Batas:** tidak membentuk SOP resmi, kewenangan petugas, disposisi, pengiriman, perubahan status M04-S5/S6, keputusan bantuan, anggaran, pengadaan, distribusi, atau BAST. Data/peran/kontak DEMO di memori browser, belum backend/otorisasi/audit.
- **Dokumen:** [spesifikasi M04-S7](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S7_UNIT_CATALOG_RACI.md); [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) QA tertunda. Tidak ada CL, tes, browser, CI atau deploy; keberhasilan 176 tes lama tidak berlaku.
- **Status:** M04-S1 sampai S7 SEDANG hanya **kode draft BELUM DIUJI**; M04-S9+ kegiatan resmi/keuangan/paket/distribusi/BAST tetap **RENCANA**. PR #9 tetap DRAFT; `main`, produksi YANDIK+, VPS dan Indodax tidak disentuh.
- **Next:** prasyarat penetapan SOP, review otorisasi/katalog serta tata kelola perubahan, bukan otomatisasi keputusan bantuan.

## PEMBARUAN M04-S6 | MATRIKS PENERUSAN KENDALA DEMO | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit](https://github.com/dvoriano/yandik-plus/commit/0456b4307d982fa04c7891d9e1ee0c5a36b21b84) membuat enam berkas [drafts/m04-escalation-matrix/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-escalation-matrix) berisi matriks 5 kategori × 3 urgensi, unit tujuan DEMO, alasan, perubahan pilihan unit dengan justifikasi, telaah terpisah dan histori.
- **Batas eksplisit:** matriks **hanya menyarankan** alur pembahasan dari kendala M04-S5 yang telah dilaporkan. Pencatatan pilihan **tidak memanggil routeEscalation**, tidak mengirim tugas/berkas, tidak membuat disposisi atau keputusan bantuan. Kategori/struktur unit belum menjadi SOP kedinasan.
- **Keterlacakan:** snapshot sumber/stale guard; opsi `mendesak_kajian` untuk prioritas pembahasan DEMO, **bukan hak persetujuan tambahan**; data fiktif dan peran label DEMO, hanya memori browser.
- **Dokumen:** [spesifikasi proses M04-S6](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S6_ROUTING_MATRIX.md); [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) berisi QA tertunda. Tidak ada CL, unit test, browser, CI atau deploy.
- **Status:** M04-S1/S2/S3/S4/S5/S6 **SEDANG hanya kode draft / BELUM DIUJI**. Keputusan, alokasi, pengadaan, distribusi dan BAST **M04-S7+ RENCANA**. PR #9 tetap DRAFT; `main`, produksi YANDIK+, VPS dan Indodax tidak disentuh.
- **Next:** katalog unit tujuan dan SOP pemilihan rute yang perlu diverifikasi pemilik proses; tetap tanpa approval otomatis.

## PEMBARUAN M04-S5 | KENDALA DAN ESKALASI ADMINISTRATIF | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit](https://github.com/dvoriano/yandik-plus/commit/3db79c4b0199fa635597d2caffde21ad3ca9838e) menambahkan enam berkas di [drafts/m04-admin-escalations/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations) untuk kendala M04-S3 fiktif, kategori/urgensi, pelaporan, penerusan lintas petugas, tanggapan, telaah, pembatalan beralasan dan histori.
- **Alur DEMO:** pelapor assignee M04-S3 → koordinator meneruskan kepada penerima → penerima mencatat tanggapan → penelaah terpisah minta klarifikasi atau **menutup catatan administratif saja**. Deteksi sumber berubah dan pencegahan duplikat kendala aktif sejenis menjadi batas rancangan.
- **Batas:** penutupan eskalasi tidak menyatakan surat sah, masalah pokok selesai, bantuan disetujui, dana tersedia, pengadaan, distribusi atau BAST. Role/data DEMO dan memori browser, bukan autentikasi/audit nyata. Tanpa CL/CI/tes.
- **Dokumen:** [Spesifikasi M04-S5](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S5_ADMIN_ESCALATIONS.md); [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) untuk seluruh pengujian tertunda. Hasil 176 tes historis tidak meliputi kode ini.
- **Status:** M04-S1/S2/S3/S4/S5 **SEDANG (draft) / BELUM DIUJI**. Proses resmi/paket/BAST M04-S6+ **RENCANA**. PR #9 DRAFT; branch `main`, website, VPS dan bot Indodax tidak disentuh.
- **Next:** rancangan matriks penerusan kendala dan penanggung jawab yang perlu ditetapkan pemilik proses; tetap tanpa approval otomatis.

## PEMBARUAN M04-S4 | DASHBOARD ANTREAN ADMINISTRATIF | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit](https://github.com/dvoriano/yandik-plus/commit/a2bcc8ef931c0c0363bb92efd0d2d75671d447ef) menambahkan enam berkas di [drafts/m04-admin-dashboard/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard) untuk **dashboard baca-saja** dari delapan tugas dan dua referensi fiktif M04-S3/M04-S2.
- **Fitur rancangan:** total/aktif, menunggu telaah, perlu perbaikan, lewat tanggal rencana, sumber berubah, ditutup administratif, dibatalkan; filter status/penanggung jawab/perhatian dan **tanggal acuan DEMO yang dipilih**; daftar urut perhatian serta teks rekap baca-saja.
- **Batas:** ringkasan **sebelum filter** dipisah dari jumlah yang ditampilkan. Tidak ada konfirmasi keaslian dokumen, approval, anggaran, penerima bantuan, pengadaan, distribusi, BAST atau tugas resmi. Role dan data fiktif di memori browser.
- **Rujukan:** [Spesifikasi M04-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S4_FOLLOWUP_DASHBOARD.md), [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); **tidak menjalankan CL/CI/tes**. Angka 176 tes terdahulu tidak mencakup M03-S4 atau M04.
- **Status:** M04-S1/S2/S3/S4 **SEDANG (draft) / BELUM DIUJI**; keputusan pejabat/paket/penyaluran/BAST M04-S5+ **RENCANA**. PR #9 tetap DRAFT; `main`, website, VPS dan Indodax tidak disentuh.
- **Next:** susun draft pencatatan kendala dan eskalasi administratif lintas petugas bila dibutuhkan, tanpa kewenangan pengesahan otomatis.

## PEMBARUAN M04-S3 | TINDAK LANJUT ADMINISTRASI | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit model/UI](https://github.com/dvoriano/yandik-plus/commit/805a052a11a7ceddeb5efdf382d209b344f03825) menambahkan enam berkas [drafts/m04-admin-followup/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup); [commit perbaikan kontrol](https://github.com/dvoriano/yandik-plus/commit/b4041ee90d70dd3505591531f508ba0ce8d01d54) memisahkan tombol rencana baru dan alasan pembatalan.
- **Alur DEMO:** referensi `metadata_tercatat` M04-S2 (BUKAN dokumen sah) → draf rencana → penugasan fiktif → penyusunan catatan → telaah manusia DEMO → dikembalikan atau ditutup **administratif saja**. Ada anti-duplikat tugas sejenis dan penanda sumber berubah.
- **Batas:** tugas ditutup bukan konfirmasi keaslian surat, pengesahan keputusan, persetujuan bantuan/anggaran, pengadaan, distribusi atau BAST. Role hanya string DEMO, tidak ada akses nyata/DB/audit permanen, semua data fiktif.
- **Dokumentasi:** [M04-S3 alur dan batas kewenangan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S3_ADMIN_FOLLOWUP.md); [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) memuat QA tertunda. **Tidak menggunakan CL/CI/tes**.
- **Status:** M04-S1/S2/S3 **SEDANG (kode draft) / BELUM DIUJI**; M04-S4+ paket, keputusan resmi dan BAST **RENCANA**; `main`, website, VPS dan bot Indodax tidak disentuh.
- **Next:** rancangan dashboard antrean kerja administratif DEMO baca-saja dan rekap tugas perlu klarifikasi, tanpa membuat keputusan bantuan otomatis.

## PEMBARUAN M04-S2 | REGISTER REFERENSI KEPUTUSAN EKSTERNAL | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit model edcc66d](https://github.com/dvoriano/yandik-plus/commit/edcc66dfd03ffba302ff7e88422a32d6b61a79ef) dan [perbaikan multi-entri 7b177e2](https://github.com/dvoriano/yandik-plus/commit/7b177e2de92ec380971006a3f3497d775e4682b8) menambah enam berkas di [`drafts/m04-decision-reference/`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference), termasuk model register, data DEMO, formulir, daftar dan status telaah.
- **Alur:** M04-S1 `tercatat_untuk_pertimbangan` (DEMO) → draf referensi eksternal yang **diklaim terbit di luar sistem** → ajukan pemeriksaan metadata → catat metadata, minta klarifikasi atau tandai tidak sesuai. Nomor sama dicegah dalam register DEMO; sumber berubah ditandai usang.
- **Batas kewenangan:** `metadata_tercatat` **BUKAN** verifikasi keaslian atau keputusan pejabat; tidak ada penerbitan SK, penetapan penerima, anggaran, pengadaan, distribusi atau BAST. Role DEMO bukan login; semua data fiktif dan hanya di memori browser.
- **Dokumen:** [M04-S2 prosedur dan batas](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md); QA ditunda pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Tidak menggunakan CL, Node test, Chromium maupun CI.
- **Status:** **M04-S1/S2 SEDANG (kode draft) / BELUM DIUJI**; M04-S3+ keputusan resmi/penyaluran/BAST RENCANA, M03-S4A/B/C BELUM DIUJI. `main`, VPS dan produksi tidak disentuh, PR #9 tetap DRAFT.
- **Selanjutnya:** rancangan tindak lanjut administratif M04-S3 pada referensi yang sudah dicatat untuk penelusuran, **bukan** otomatis menetapkan bantuan atau pengadaan.

## PEMBARUAN M04-S1 | BERKAS ADMINISTRASI USULAN | 11 November 2026
- **Kode tersimpan, BELUM DIUJI:** [commit 9051571](https://github.com/dvoriano/yandik-plus/commit/9051571aeee25a2611850aa43406aceb6fe66a04) menambahkan [drafts/m04-admin-review/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review) dengan `dossier.mjs`, `fixtures.mjs`, `main.mjs`, `index.html`, `style.css` dan README.
- **Alur terpisah dari skor M03:** kebutuhan dari sumber fiktif yang berstatus terverifikasi → draf berkas administrasi → checklist lima kelengkapan → pemeriksaan administrasi oleh peran DEMO berbeda → dikembalikan atau **dicatat sebagai bahan pertimbangan**. Tidak ada status persetujuan atau alokasi otomatis.
- **Batas penting:** ID pelaku DEMO bukan autentikasi, bukti hanya metadata, sumber M03 riil belum disambungkan, tidak ada DB/audit sah atau dokumen resmi. Tidak ada nominal, keputusan pejabat, pengadaan, penyaluran atau BAST.
- **Dokumen M04-S1:** [alur dan batas kewenangan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S1_ADMIN_HANDOFF.md); [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) menampung seluruh QA tertunda.
- **Status:** M04-S1 **SEDANG (kode draft) / BELUM DIUJI**, fungsi keputusan/pendanaan/distribusi/BAST M04 lainnya tetap **RENCANA**. M03-S4A/B/C juga BELUM DIUJI. **Tanpa CL/CI/test**, `main`/produksi/VPS tidak disentuh.
- **Next:** desain M04-S2 register **referensi keputusan pejabat yang sudah diterbitkan di luar sistem** dengan konfirmasi manusia, bukan fitur penerbitan keputusan atau persetujuan otomatis.

## PEMBARUAN M03-S4C | DRAF BAHAN BERITA ACARA TELAAH | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit](https://github.com/dvoriano/yandik-plus/commit/93a0d7df9e446af1db4f350ac47b34c56faf1c79) menambahkan `draft_minutes.mjs`, bagian form agenda/tindak lanjut dan teks draf baca-saja pada [review.html](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness/review.html), serta jembatan baca riwayat kajian. Semua berada di `drafts/`.
- **Fungsi rancangan:** menyiapkan teks bahan penyusunan berita acara dengan identitas DEMO, alasan dan bobot perbandingan, hasil tinjauan, **histori rekomendasi/pengembalian/perbaikan**, dan tindak lanjut. Tidak membuat nomor resmi, berita acara sah, tanda tangan, penerima bantuan, pengadaan atau alokasi.
- **Batas:** semua data fiktif; output teks hanya di memori browser, harus dipilih/disalin manual. Peran adalah label demo; belum ada pemeriksaan resmi, koneksi API/DB, integrasi SRIKANDI atau pengujian browser.
- **Dokumen:** [rancangan M03-S4C](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4C_DRAFT_MINUTES.md) dan [backlog QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); 176 tes lama hanya untuk M03-S3. **TIDAK MENJALANKAN CL/CI/TEST**.
- **Status:** M03-S4A/B/C KODE DITULIS, BELUM DIUJI; M03 keseluruhan SEDANG; M04 RENCANA. Status akses repo pada catatan lama tertulis private, tetapi **terdeteksi PUBLIC pada 11 November 2026**; PR Draft, main/VPS/website produksi tidak disentuh.
- **Berikutnya:** rancang alur administrasi keputusan pejabat yang **terpisah** dari rekomendasi skor. Tidak otomatis memproses bantuan/anggaran.

## PEMBARUAN M03-S4B | TELAHAH PERBANDINGAN PRIORITAS | 11 November 2026
- **KODE DITULIS, BELUM DIUJI:** [commit](https://github.com/dvoriano/yandik-plus/commit/bfa697af515479ec05735badcde4c89222e8c5d8) membuat `review_ledger.mjs`, `review_ui.mjs` dan `review.html`, serta menautkannya dari [laboratorium M03-S4](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness). Semua berada di `drafts/`, bukan aplikasi aktif.
- **Fungsi konsep:** mencatat alasan pemilihan bobot percobaan, risiko/perubahan urutan, keterbatasan data, kode sumber DEMO, pengajuan oleh peran kab/kota, dan penelaahan oleh peran provinsi. Hasil review hanya **dicatat untuk pembahasan / dikembalikan / tidak direkomendasikan**, tidak ada pengesahan.
- **Batas:** identitas peran hanya label DEMO, data di memori browser, tidak ada login/DB/audit sah, tidak ada keputusan bantuan, pagu/anggaran, BAST, atau perubahan bobot resmi. Rancangan belum pernah dijalankan.
- **Panduan:** [dokumen M03-S4B](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4B_REVIEW_POLICY.md), [backlog QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md); **tanpa CL/CI/tes** sesuai instruksi owner. Angka 176 tes terdahulu tidak mencakup kode ini.
- **Status:** M03 tetap SEDANG (prototype), M03-S4A/S4B **BELUM DIUJI**, M04 RENCANA; `main`, VPS dan website produksi tidak disentuh.
- **Next:** lanjut draft catatan hasil telaah dan prosedur pemeriksaan metodologi, tanpa aktivitas testing/implementasi produksi.

## REVISI RINGKASAN EKSEKUTIF DAN KEBUTUHAN AI AGENT | 11 November 2026
- **Ringkasan Eksekutif 1.1** direvisi lebih formal dan berorientasi keputusan, [dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md), [commit](https://github.com/dvoriano/yandik-plus/commit/ad054783b5fec427651b1ea1d57e30b906a61876).
- Bagian **AI Agent untuk pengembangan YANDIK+** diangkat secara eksplisit sebagai sarana bantu tim mengembangkan modul, kode, dokumentasi, pemetaan data dan persiapan QA; **berbeda dari chatbot/fitur AI pengguna**.
- Kebutuhan **akses kredit/token/kuota berbasis pemakaian** dan opsi prepaid/top-up dijelaskan secara vendor-netral, dengan catatan biaya, satuan pengadaan, pengendalian dan pertanggungjawaban **masih memerlukan telaah**. Fungsi dasar aplikasi untuk petugas tidak harus menggunakan AI berbayar per transaksi.
- Penjelasan pada [Dokumen Pengenalan Lengkap](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/PENGENALAN_YANDIK_PLUS.md) dan navigasi README diselaraskan. Naskah **DRAF BAHAN TELAAH**, belum persetujuan SPBE, anggaran, atau pengadaan.
- [Issue #21](https://github.com/dvoriano/yandik-plus/issues/21) untuk telaah institusional tetap terbuka.
- **Mode tanpa CL/CI/tes masih berlaku**, tidak ada perubahan kode sistem, VPS, website, atau branch main.

## PEMBARUAN DOKUMEN PENJELASAN YANDIK+ | 11 November 2026
- **Permintaan pemilik:** susun dokumen YANDIK+ yang mudah dipahami pimpinan, Inspektorat, Diskominfotik, tidak membahas koding sebagai fokus; menjelaskan 15 modul, fitur/fungsi, dan sistem kerja termasuk kewenangan serta tata kelola.
- **Dokumen sudah ditulis di GitHub:** [Ringkasan Eksekutif](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/RINGKASAN_EKSEKUTIF_YANDIK_PLUS.md) dan [Pengenalan Lengkap](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/PENGENALAN_YANDIK_PLUS.md), [commit](https://github.com/dvoriano/yandik-plus/commit/19eae9de3525838593b6347d20400bf4faec2cc8). Dokumen lengkap menerangkan data induk, hak akses, tugas, bukti, verifikasi, permasalahan, usulan Support, penilaian prioritas, tindak lanjut, dashboard, administrasi, pengingat, dan histori.
- **Status isi:** **DRAF BAHAN TELAAH**, bukan pengesahan kebijakan, penganggaran atau legitimasi SPBE. Tidak mengklaim seluruh modul aktif; APEL layanan yang sudah ada dipisah dari prototype/rencana. Posisi AI opsional dan batas iSIKHNAS/SRIKANDI/OSS/pengadaan dijelaskan.
- **Telaah substansi:** [Issue #21](https://github.com/dvoriano/yandik-plus/issues/21) mencatat daftar cek masukan pimpinan, Inspektorat, Diskominfotik dan pengelola modul; seluruhnya **BELUM DITELAAH FORMAL**.
- **Akses aktual pada pemeriksaan 11 November 2026: PUBLIC menurut metadata GitHub.** Kode dapat diakses publik; status ini belum ditelaah sebagai keputusan publikasi bahan kedinasan. Review visibilitas/isi repository sebelum memasukkan data riil.
- **Mode kerja tetap:** tanpa CL/CI/tes baru. Pembuatan dan penautan dokumen saja, tidak menjalankan aplikasi, tidak menyentuh website/VPS/`main`.
- **Berikutnya:** pemilik proyek dapat memberikan koreksi substansi/istilah/kewenangan setelah dokumen dibaca; catat perubahan versi. Coding M03-S4 tetap **BELUM DIUJI**.

## PEMBARUAN M03-S4 | 11 November 2026
**INSTRUKSI PEMILIK PROYEK TERBARU: MODE KODE SAJA, TANPA CL DAN TANPA PENGUJIAN/CI DULU.** Baca [CODE_ONLY_MODE.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md) dan [TEST_BACKLOG.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md) sebelum bekerja pada setiap chat YANDIK+ berikutnya. Jatah CL disisihkan untuk bot Indodax. Tidak boleh menjalankan workflow GitHub Actions, node test, unittest, Playwright atau tes manual hingga izin eksplisit berikutnya.
- **Kode telah ditulis, BELUM DIUJI:** [drafts/m03-s4-fairness/](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) dengan `comparison.mjs`, `fixtures.mjs`, `app.mjs`, `index.html`, `style.css`, dan README. [Commit kode](https://github.com/dvoriano/yandik-plus/commit/3e30ac406a24ec17ee604b654251c7b3eb1cee7c) menggunakan `[skip ci]`, file berada di `drafts/` di luar jalur workflow otomatis.
- **Konten M03-S4:** enam contoh Puskeswan anonim fiktif; skor tiga bobot percobaan (baseline, akses/SDM, kontinuitas); kasus data belum lengkap tanpa skor, skor seri seimbang, penanda perubahan peringkat untuk review manusia. **Jumlah layanan hanya ilustrasi, bukan komponen nilai.**
- **Sumber tunggal perubahan:** [rencana/limitasi M03-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4_FAIRNESS_PLAN.md). Semua pemeriksaan yang belum dilakukan dicatat pada [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md). Belum diintegrasikan ke prototype aktif, Flask, database, website, atau sistem keputusan bantuan.
- **Status:** M03-S4 = **SEDANG / KODE DITULIS / BELUM DIUJI**, **BUKAN SELESAI**. M03 keseluruhan SEDANG, M04 RENCANA. M00 source Flask legacy 171 file tetap belum ada di repo.
- **176 tes SUCCESS sebelumnya** hanya mencerminkan kode M03-S3 sebelum draft baru, **tidak membuktikan M03-S4**.
- **Next:** lanjut coding melalui GitHub-only dalam `drafts/` dan dokumentasi, catat semua pending test. Jangan jalankan CI/CL, jangan ubah `main`, VPS atau website.

## PEMBARUAN M03-S3 | 11 November 2026
- **Penilaian prioritas Support berbobot (prototype):** lima faktor 30% risiko gangguan pelayanan, 25% kesenjangan fasilitas, 20% akses wilayah, 15% SDM dan 10% kekurangan stok. Tingkat 0–3, alasan serta kode sumber DEMO wajib. **Data kosong bukan nol, jumlah pelayanan mentah tidak ikut skor.**
- **Alur review:** verifikator kab/kota membuat scorecard kebutuhan terverifikasi, provinsi meninjau, meminta perbaikan, atau mengoreksi kategori rekomendasi dengan alasan. Skor hitung dasar tidak ditimpa.
- **Pengamanan:** nomor versi kebutuhan/masalah, penilaian usang bila sumber berubah, validator menolak review palsu dan field anggaran/alokasi/BAST.
- **Bukti tes:** [GitHub Actions #42939237270](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270) **SUCCESS tiga job**, 65 Python + 94 Node + 17 Chromium = **176 tes otomatis**; fixture valid.
- **Dokumen teknis:** [M03_PRIORITY_ASSESSMENT.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_PRIORITY_ASSESSMENT.md); bobot, ambang dan peran merupakan **rancangan percobaan**, bukan kebijakan resmi.
- **Status M03 masih SEDANG (prototype), M04 RENCANA.** Source Flask legacy 171 file belum di repo; belum API/DB/login resmi, upload bukti, atau uji petugas HP fisik.
- **Next:** uji keadilan dengan skenario beberapa fasilitas secara anonim, persiapkan review bobot/aturan oleh pemilik proses, tetap tanpa alokasi otomatis.
- Website/VPS/branch main tidak disentuh.

## PEMBARUAN M03-S2 | 11 November 2026
- **Bukti kebutuhan:** [kode](https://github.com/dvoriano/yandik-plus/commit/41ce4079840af89e4f8216d3f31124ac5fb3e815) menambah metadata bukti DEMO; draf tanpa bukti bisa disimpan, pengajuan membutuhkan minimal 1 kode bukti, verifikator wajib mencentang pemeriksaan metadata sebelum menyatakan kebutuhan terverifikasi. **Belum ada unggah atau pemeriksaan file sebenarnya.**
- **Duplikasi kebutuhan:** nama barang dinormalisasi (kapital/spasi/tanda baca), usulan serupa diblokir di satu Puskeswan meskipun dari masalah berbeda. Jika usulan terdahulu ditolak, wajib alasan pengajuan ulang dan tautan ke kebutuhan sebelumnya.
- **Tes & UI:** [15 tes Node tambahan](https://github.com/dvoriano/yandik-plus/commit/49326c9b9a9d6233dddf25e9e4a132ac607068f4), [form/checkbox](https://github.com/dvoriano/yandik-plus/commit/82691922ca6c602d22089951f8f0f0c4e26d75e1), [2 tes Chromium baru](https://github.com/dvoriano/yandik-plus/commit/77f0f344127e1d81a404caf041b883260754474e). [GitHub Actions #42936090527](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527) **SUCCESS ketiga job**, **65 Python + 75 Node + 14 Chromium = 154 tes otomatis**, validator fixture lulus.
- **Detail:** [M03_EVIDENCE_AND_DEDUP.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_EVIDENCE_AND_DEDUP.md). Bukti masih kode referensi fiktif, bukan unggahan atau pengesahan dokumen.
- **Status:** M03 tetap **SEDANG (prototype)**, M04 **RENCANA**. Source Flask legacy 171 file masih belum di repository; tidak ada API/DB/login asli.
- **Next:** M03-S3 rancangan prioritas yang adil dan dapat dijelaskan, tanpa keputusan bantuan otomatis; pengujian UX/aksesibilitas tetap terbuka.
- **Batas:** hanya GitHub branch pengembangan, `main`/VPS/website produksi tidak disentuh.

## PEMBARUAN M03-S1 | 11 November 2026
- **M03 Support mulai DIKERJAKAN, prototype:** [model & 15 tes](https://github.com/dvoriano/yandik-plus/commit/35f923ba6d974182c9c55ced13b9cea09ec07926) membuat usulan kebutuhan yang merujuk `problem_id` terverifikasi, bukan menduplikasi profil/masalah atau menyetujui bantuan.
- [UI dan 3 tes browser baru](https://github.com/dvoriano/yandik-plus/commit/02cd5e3bd3f7ce84dac5aaadab4333ae914bc5e7): tombol "Usulkan kebutuhan" pada masalah terverifikasi, form kategori/barang/jumlah/satuan/urgensi/alasan, draf, ajukan, review, koreksi/tolak.
- **CI final:** [GitHub Actions #42862700052](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052) **SUCCESS**. Ketiga job lulus: **65 Python + 60 Node + 12 Chromium = 137 tes otomatis**; validator fixture berhasil.
- **Dokumen tersendiri:** [M03_LINKED_SUPPORT_NEEDS.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_LINKED_SUPPORT_NEEDS.md), [Support Puskeswan](docs/modules/04_SUPPORT_PUSKESWAN.md).
- **Kewenangan:** masalah tervalidasi ≠ pengajuan kebutuhan; kebutuhan terverifikasi ≠ keputusan anggaran/penetapan alokasi/BAST. M04 tetap RENCANA.
- **Source Flask legacy 171 file belum di repo**, tidak ada database/API asli, server auth, penggunaan petugas fisik atau deploy.
- **Next:** tes bukti/duplikasi dan rancangan prioritas yang adil, sambil menjaga otorisasi & peran sesuai kedinasan.
- **Batas:** hanya GitHub development branch, data fiktif; tidak menyentuh VPS, `main`, atau website.

## PEMBARUAN M02-S4 | 10 November 2026
- **Modul Permasalahan Puskeswan (prototype):** [commit c973bdc](https://github.com/dvoriano/yandik-plus/commit/c973bdc3f744805b39c9cd39447cca185444ba95) membuat `problems.mjs` dengan draf, pengajuan, perbaikan, verifikasi, tindak lanjut dan selesai, disertai histori. **Verifikasi masalah bukan persetujuan bantuan/anggaran**.
- **Ringkasan baca-saja SDM/APEL:** `source_snapshots.mjs` menyediakan **data contoh** berdasarkan ID Puskeswan. APEL nol vs belum melapor dibedakan; tidak ada form input ganda atau total pelayanan resmi palsu. **Bukan koneksi database produksi**.
- **Halaman dan tes:** [commit f06ee93](https://github.com/dvoriano/yandik-plus/commit/f06ee93c134eac9f03871a7bf590391a41aee8b1) menambahkan kartu sumber data, daftar masalah, formulir dan 3 tes Chromium baru.
- **CI:** [GitHub Actions #42850233101](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101) **SUCCESS**: 65 tes Python, **45 tes Node**, **9 tes Chromium** = **119 pengujian otomatis**, validator fixture lulus.
- **Dokumen:** [M02_PROBLEMS_AND_REFERENCES.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROBLEMS_AND_REFERENCES.md). Semua angka bersifat fiktif, data hilang saat reload, role switch simulasi bukan login.
- **Status:** M00/M01/M02 masih **SEDANG**; source Flask legacy 171 file belum ada di GitHub. M03/M04 tetap RENCANA; belum Support resmi ataupun website aktif.
- **Next:** tambah model tautan masalah→kebutuhan Support **tanpa alokasi otomatis**, audit aksesibilitas, lalu selaraskan data/field real hanya setelah source Flask di GitHub.
- **Larangan tetap:** tidak ada VPS, DB produksi, GitHub Pages, deploy, atau merge ke `main`.

## PEMBARUAN M02-S3 | 10 November 2026
- **Diperbaiki:** [commit 0ce6b2d](https://github.com/dvoriano/yandik-plus/commit/0ce6b2db1ef0f9ca417eea072f1307c1ee94de30) membuat draf yang sudah disimpan bisa langsung diajukan tanpa mengetik ulang. Mode simulasi pimpinan kini **tidak menampilkan atau merender rincian individu Puskeswan**.
- **Tes browser:** [commit 78cf52a](https://github.com/dvoriano/yandik-plus/commit/78cf52a06d38874581a6709bf7b22b723704ed40) menambah 6 uji Chromium headless: HP 320/375 px tanpa scroll horizontal, simpan → ajukan draf, koreksi → kirim ulang → setujui, role pimpinan, dan reset data demo saat reload.
- **Kendala CI terselesaikan:** runner ubuntu-latest berubah ke Ubuntu 26.04 (Playwright 1.56.1 belum mendukung), [commit c810f5f](https://github.com/dvoriano/yandik-plus/commit/c810f5f565843ee9487440bf97da33bc8c8ee7fc) pin job browser ke Ubuntu 24.04.
- **Bukti CI:** [GitHub Actions #42846236703](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703) **SUCCESS** di 3 job: 65 tes Python, 25 tes unit Node, dan **6 tes browser Chromium**, total **96 tes otomatis**; tes validator fixture juga lulus.
- **Peta domain Profiling 2026:** [M02_PROFILING_2026_MAPPING.md](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROFILING_2026_MAPPING.md) membedakan 9 domain, source data SDM/APEL, kesiapan vs realisasi surveilans/Kesmavet, dan kebutuhan Support. Ini **masih rancangan**, kolom source Flask asli belum diaudit.
- **M02 tetap SEDANG**: prototype UI dan browser smoke siap untuk review, **bukan** aplikasi Flask/DB/akun nyata. Tes browser headless bukan tes perangkat fisik atau pengguna nonteknis.
- **Next:** rancang referensi data lintas modul + Permasalahan pada prototype tanpa input ganda, dan tetapkan field-level mapping setelah source Flask lengkap ada di GitHub.
- **Produksi:** website, VPS dan DB tidak disentuh; branch `main` dan PR draft tetap aman.

## PEMBARUAN M02-S2 | 10 November 2026
**Progres terbaru:** prototype tampilan **Profil Saya** mobile-first dan **Antrian Verifikasi** sudah dikode langsung di GitHub.
- **State model & 20 tes Node:** [commit 6c807fa](https://github.com/dvoriano/yandik-plus/commit/6c807fa21fd130e0e28093eedb53623b9520e866), `prototypes/profil-puskeswan/model.mjs`.
- **UI dan GitHub CI:** [commit 3096d64](https://github.com/dvoriano/yandik-plus/commit/3096d64f2b2d113318ba3ee365abe814c2f6a910) berisi `index.html`, `style.css`, `main.mjs`, panduan dan workflow Python + Node.
- **CI:** [GitHub Actions #42844096701](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701) **SUCCESS** (job `offline-contracts` dan `profile-ui-demo`). 65 tes Python sebelumnya tetap lulus, ditambah 20 tes model JS. UI HTML/CSS belum diuji oleh manusia pada browser sungguhan.
- **Apa yang berfungsi dalam demo:** 5 kartu bagian profil, indikator belum lengkap/perlu verifikasi, simpan draf, ajukan, role-switch simulasi, antrian verifikator, koreksi dengan alasan, persetujuan dan perbaikan, tampilan responsif dengan label & teks status.
- **Status M02 tetap SEDANG (prototype interaktif)**, belum halaman Flask asli. **Pergantian role hanyalah simulasi, BUKAN autentikasi**; penyimpanan hanya memori tab dan hilang saat refresh. Jangan pernah pakai data nyata.
- **Berikutnya:** review alur UI terhadap standar UX & field Profiling 2026, tambah test markup/interaksi browser, lalu adapter API/DB jika source Flask lama bisa masuk GitHub tanpa VPS/laptop.
- **M00 masih terhalang:** source Flask lama 171 file belum berada di GitHub. Website produksi, VPS, DB tetap tidak disentuh.

## PEMBARUAN M02-S1 | 10 November 2026
- **Kode per bagian:** [commit ee9ccee](https://github.com/dvoriano/yandik-plus/commit/ee9cceecfe4a61c315e6bef6a38f0e6c9b4e30e8) membuat `foundation/yandik_base/profile_updates.py`, izin `VERIFY_PROFILE`, draf, ajukan, review, alasan koreksi, dan versi perubahan.
- **Pengujian lulus:** [commit 12007b6](https://github.com/dvoriano/yandik-plus/commit/12007b6d8cc1c96011e0b521510b0adf6d600557), **25 tes baru; 65 tes fondasi** keseluruhan. [GitHub Actions #42842163389](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389) **SUCCESS**.
- **Status M02:** SEDANG (prototype). Ringkasan 5 bagian profil, draft/edit/submit/approval telah diuji; belum ada layar pengguna, API Flask, penyimpanan DB, unggah foto maupun notifikasi.
- **Batas:** SDM dan APEL hanya direferensikan, bukan diinput ulang; source Flask lama 171 file belum ada di GitHub; website/VPS tidak disentuh.
- **Berikutnya:** buat tampilan prototype Profil Saya yang sederhana/mobile-first dan pengujian jalur tugas/verifikasi memakai data fiktif, tetap di GitHub.

## PEMBARUAN M01-S2 | 10 November 2026
- Kode [master Puskeswan, histori SDM, sarpras dan profil](https://github.com/dvoriano/yandik-plus/commit/420354a885c6291c609e4ab6f25347cadbd2360a) serta [18 tes baru](https://github.com/dvoriano/yandik-plus/commit/43ee5ff342659fb1bb96eac552bad687e3ab0854) berhasil dibuat di GitHub.
- [GitHub Actions #42840263033](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033) **SUCCESS**, total foundation **40 tes** serta validator data fiktif.
- Relasi APEL/Support memakai satu ID Puskeswan; tidak melapor berbeda dengan nilai nol; penempatan tenaga dan kondisi alat memiliki riwayat tanggal.
- M01 **SEDANG**; M02 masih **RENCANA** sebagai fitur pengguna walau sebagian kontrak datanya sudah dibuat.
- **Next:** lanjut adapter profil/SDM dan hak akses pada kode pengembangan, sambil tetap menunggu source Flask asli masuk langsung melalui GitHub. Belum ada deployment.

## PEMBARUAN TERBARU | 10 November 2026
- **M01 kode prototype:** [commit 9fe3ce0](https://github.com/dvoriano/yandik-plus/commit/9fe3ce0fd2723fe077cc05aabb634a3df3a1b2ac) berisi hak akses berbasis role+wilayah dan alur kerja audit immutable, ditambah 12 tes.
- **M01 GitHub Actions SUCCESS:** [run #42838727867](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867); tes kontrak dan validator fixture lulus. Total suite foundation: 22 tes.
- Keputusan: pekerjaan M01 yang bisa dipisah dari Flask lama **SEDANG**, tetapi belum ada perubahan API, izin login, atau database lama. Ini bukan persetujuan resmi.
- **Next:** lanjut pengembangan Core Platform teruji dengan data dummy, sambil tetap mencatat source Flask M00-D belum diimpor langsung via GitHub.

- **M00 coding:** [commit 2081606](https://github.com/dvoriano/yandik-plus/commit/2081606d0cd4109eb5f45415688ff4a663937fb6) memuat 13 file kontrak Python, fixture anonim, 10 tes dan GitHub workflow.
- **CI terbukti lulus:** [GitHub Actions run #42837742904](https://github.com/dvoriano/yandik-plus/actions/runs/42837742904) **SUCCESS**; kedua langkah test kontrak dan validasi fixture berhasil.
- Kontrak yang diuji: identitas Puskeswan stabil, laporan per bulan/Puskeswan, nol berbeda dengan tidak melapor, referensi data Support, penolakan nilai negatif/format salah.
- **Bukan aplikasi Flask produksi**; source legacy lengkap masih belum ada di GitHub. M00 **SEDANG**.
- **Next:** upayakan source legacy hanya lewat GitHub connector; kalau belum bisa, kembangkan kontrak dan pengujian yang tidak bergantung pada source legacy. Tidak meminta setup user.

## KEPUTUSAN PEMILIK PROYEK | jangan ditanyakan berulang
1. **HANYA KERJAKAN DI GITHUB**: pengguna tidak mau lagi diminta unduh ZIP, PowerShell, Git lokal, login dari komputer, copy SSH, atau setup lain di luar GitHub untuk saat ini.
2. **Website produksi tidak boleh diubah sedikit pun.** Tidak ada sambungan GitHub ke VPS YANDIK+, tidak restart service, tidak menyentuh database, tidak CI/CD deploy; semua coding adalah pengembangan calon versi masa depan.
3. **Repo bot Indodax terpisah total**; jangan akses/ubah sebagai bagian YANDIK+.
4. Source dari aplikasi Flask YANDIK+ yang sekarang menjadi **baseline fungsional**. Jangan rewrite tanpa alasan. Jika belum tersedia dalam repo, kerjakan fondasi/dokumen/modul aman yang bisa ditulis langsung via GitHub; laporkan batasannya tanpa membebani pengguna.
5. **Satu platform paperless** untuk semua kegiatan dengan fokus petugas kurang terbiasa teknologi; modul masing-masing terpisah, data diisi sekali.
6. **Setiap progres wajib disimpan ke GitHub** sebelum sesi diakhiri. Saat konteks chat menipis, dokumen ini menjadi catatan serah-terima yang paling baru.

## CARA MELANJUTKAN DI CHAT BERIKUTNYA
Jika pengguna berkata **"cek GitHub", "lanjutkan", "cek perkembangan", "kerjakan sesuai roadmap"**, lakukan:
1. Buka `PROJECT_STATE.md` pada **branch kerja** (bukan asal baca `main`).
2. Baca `docs/ROADMAP.md` (status resmi), bagian terbaru `docs/WORKLOG.md`, dan perubahan terakhir di branch/PR.
3. Baca `docs/modules/<modul>.md` dan issue terkait saat mengerjakan modul.
4. Pilih item tertinggi yang belum selesai, kerjakan **langsung menggunakan connector GitHub**, catat commit dan hasil.
5. Sebelum membalas, **perbarui file ini + ROADMAP + WORKLOG serta issue/PR jika perlu**, lalu verifikasi lewat fetch GitHub. Jangan mengandalkan hanya isi percakapan atau memory.

## KONDISI NYATA GITHUB SAAT INI
### SELESAI (dokumentasi/alat dan kontrak fondasi teruji; belum fitur produksi)
- [x] Pernyataan historis: repo sebelumnya dicatat private; **pemeriksaan 11 November 2026 menunjukkan PUBLIC**. Branch develop/yandik-foundation; PR #9 draft.
- [x] Masterplan `docs/MASTERPLAN.md`, katalog 15 modul `docs/MODULES_INDEX.md`.
- [x] Spesifikasi terpisah `docs/modules/00_...md` sampai `14_...md` beserta checklist.
- [x] Roadmap, backlog, changelog, standar UX, workflow dan aturan pengelolaan data.
- [x] Validator awal `scripts/verify_import.py` ada di branch.
- [x] Catatan handoff, worklog dan aturan **GitHub-only** dimasukkan ke branch.
- [x] Kode fondasi `foundation/`, fixture anonim dan 10 tes lulus di GitHub Actions #42837742904.
- [x] Prototype master Profil/SDM/Sarpras dengan 18 tes tambahan dan total 40 tes foundation, [CI sukses](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033).
- [x] **M02-S1** draf profil per bagian, review, scoped auth, audit immutable dan 25 tes tambahan; [CI 65 tes sukses](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389).
- [x] **M02-S2** halaman demo responsive Profil Saya / antrian verifikasi, 20 tes Node dan CI Python+Node [SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42844096701).
- [x] **M02-S3** perbaikan draf dan tampilan pimpinan, **6 tes browser** + **25 tes Node** + **65 tes Python** [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42846236703), peta 9 kelompok Profiling 2026 sementara.
- [x] **M02-S4** Permasalahan Puskeswan + sumber SDM/APEL baca-saja, **119 tes Python/Node/Chromium** [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42850233101).
- [x] **M03-S1** usulan dari masalah terverifikasi, 15 tes Node dan 3 tes browser tambahan, [GitHub Actions 137 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052).
- [x] **M03-S2** pemeriksaan metadata bukti dan deteksi item duplikat lintas masalah, [154 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527).
- [x] **M03-S3** model scorecard prioritas percobaan, review manusia dan peringatan sumber usang; [176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270).
- [ ] **M03-S4 BELUM DIUJI**: kode lab fairness fiktif telah dibuat di `drafts/`, belum ada test atau integrasi. [Pekerjaan](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) · [backlog](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [x] Prototype hak akses wilayah dan workflow audit (12 tes tambahan) lulus di GitHub Actions #42838727867.

### SEDANG
- **M00 Fondasi repo/source.** Kode kontrak/fixture/tes ada dan CI lulus; source Flask lengkap masih menunggu.
- **M01 Core Platform.** Prototype akses wilayah, master data dan workflow tersedia; belum terintegrasi ke Flask.
- **M02 Profil Puskeswan.** Prototype draf dan verifikasi **serta UI interaktif responsif** ada di GitHub; belum Flask/API/DB, belum uji pengguna.

### BELUM SELESAI / TERBUKA
- [ ] **Source Flask lengkap belum diimpor ke repository.** Ada snapshot 168 file dan salinan pengembangan 171 file dari percakapan sebelumnya, tetapi *file di chat bukan file GitHub*. Jangan klaim sudah commit.
- [x] Fixture dummy Profil/APEL/Support dan pengujian kontrak awal tersedia.
- [ ] Dependensi aplikasi Flask nyata, tes integrasi/runtime, dan regresi hitungan APEL produksi belum selesai.
- [ ] Audit serta perbaikan otorisasi, password reset/default, upload dan CSRF di kode pengembangan belum selesai.
- [ ] M01 dan M02 masih **prototype GitHub**, bukan fitur Flask berjalan; M03–M16 tetap rencana implementasi.

### TERTUNDA khusus
- Jalur impor melalui ZIP/Windows/PowerShell **tidak digunakan atas instruksi pemilik**. Bila transfer source memerlukan jalur yang tidak tersedia di connector GitHub, kerjakan bagian yang memungkinkan langsung di GitHub, jangan minta manual download/setup.

## PRIORITAS NEXT ACTION
1. **M00-D:** masukkan source Flask sanitasi lewat GitHub connector jika bisa tanpa tindakan pengguna; jika tidak, pertahankan status tertunda.
2. **M00-F:** lengkapi tes dan perbaikan keamanan setelah source tersedia, petakan aturan hitung APEL resmi; pertahankan regresi.
3. **M03-S4 dan modul berikut:** lanjut tulis kode di GitHub tanpa CL/CI/tes sesuai instruksi terbaru; tandai setiap tugas **BELUM DIUJI** dan isi TEST_BACKLOG. Jangan menjalankan simulasi sampai owner mengizinkan. Bobot percobaan belum boleh dipakai sebagai dasar bantuan.


## DOKUMEN RUJUKAN
- [Status roadmap induk](docs/ROADMAP.md)
- [Catatan pekerjaan kronologis](docs/WORKLOG.md)
- [Aturan setiap sesi](docs/GITHUB_WORKFLOW.md)
- [Katalog modul](docs/MODULES_INDEX.md)
- [Masterplan](docs/MASTERPLAN.md)
- [Perubahan scope](docs/CHANGELOG_ROADMAP.md)
- [Issue #1 (M00)](https://github.com/dvoriano/yandik-plus/issues/1)

## TEMPLATE CATATAN AKHIR SETIAP SESI (perbarui, jangan duplikasi)
- **Terakhir dilakukan:** <perubahan/fitur yang benar-benar tersimpan>
- **Bukti:** <link commit/PR/tes>
- **Status setelah pekerjaan:** <Mxx dan SELESAI/SEDANG/RENCANA>
- **Berikutnya:** <satu langkah konkret>
- **Blokir:** <apa yang belum bisa, tanpa meminta setup eksternal>
- **Produksi:** tidak disentuh

**Prinsip bukti:** pernyataan pekerjaan selesai harus didukung commit/isi file GitHub dan tes bila relevan. Jangan menganggap data yang hanya ada di ZIP lokal telah tersedia di repository.
