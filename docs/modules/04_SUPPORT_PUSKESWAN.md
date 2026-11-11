# MOD-04 | Support Puskeswan: Kebutuhan, Bantuan dan Evaluasi

**Milestone:** M03 dan M04  
**Status implementasi GitHub:** **M03 SEDANG (prototype)** untuk draf/ajukan/verifikasi kebutuhan berbasis masalah; **M04-S1/S2/S3/S4/S5 SEDANG (kode draft) / BELUM DIUJI** untuk administrasi, register, tindak lanjut, dashboard dan koordinasi kendala; **keputusan dan proses riil M04-S6+ tetap RENCANA**. Belum backend/anggaran/bantuan resmi.  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Sudah ada data profiling, sarpras/obat dan konsep Puskeswan Prioritas; mekanisme pengajuan, verifikasi, alokasi, penyaluran dan evaluasi bantuan end-to-end belum diklaim tersedia.

## 2. Tujuan
Menghubungkan kebutuhan berbasis data dengan bantuan provinsi yang tepat sasaran, transparan, dapat dipertanggungjawabkan dan terpantau.

## 3. Pengguna dan hak akses
- Pengusul Puskeswan
- koordinator kab/kota
- verifikator provinsi
- penanggung jawab kegiatan/paket
- pimpinan
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Kebutuhan otomatis disarankan dari profil: alat rusak, sarana kurang, stok kosong
- Puskeswan konfirmasi usulan kategori, jumlah, alasan, urgensi dan bukti
- Antrian verifikasi per wilayah, revisi dan klarifikasi
- Skor prioritas dengan indikator, alasan dan override manusia tercatat
- Rencana dukungan disesuaikan kewenangan dan ketersediaan anggaran
- Paket, jadwal dan bukti distribusi; BAST/dokumen draf otomatis
- Monitoring pemanfaatan dan kondisi bantuan setelah penerimaan

## 5. Alur kerja pengguna
Data Profil/APEL → kebutuhan teridentifikasi → usulan → verifikasi → penetapan prioritas manusia → alokasi/penyaluran resmi → BAST → evaluasi.

## 6. Objek data (usulan, belum migrasi final)
- support_need, need_evidence, verifier_decision
- priority_indicator, score_version, rationale
- support_proposal, fund_reference, human_approval
- support_delivery, bast_ref, utilization_review
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Profil (kondisi alat/obat/SDM), APEL (beban pelayanan), workflow bersama, dashboard pimpinan dan GIS.

## Progres M04-S5: kendala dan eskalasi administratif, BELUM DIUJI
- [x] [Kode M04-S5](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-escalations) memuat pencatatan kendala tugas M04-S3, urgensi, penerusan lintas petugas/unit, tanggapan, telaah dan histori DEMO.
- [x] Batas rancangan: sumber berubah dan kendala duplikat tidak otomatis diselesaikan; `ditutup_administratif` hanya menutup catatan koordinasi.
- [x] [Spesifikasi M04-S5](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S5_ADMIN_ESCALATIONS.md) serta [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Belum autentikasi/DB, verifikasi fakta, SOP resmi, QA kode/HP, integrasi ke surat atau sistem keuangan.
- [ ] M04-S6+ keputusan resmi, pengadaan, distribusi, BAST dan evaluasi tetap RENCANA.

## Progres M04-S4: dashboard antrean administratif, BELUM DIUJI
- [x] [Enam berkas dashboard draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-dashboard) merangkum status tugas, tenggat fiktif, penanggung jawab, sumber berubah serta catatan ditutup administratif.
- [x] Filter status/penanggung jawab/kategori perhatian/tanggal acuan dan bahan rekap baca-saja; **bukan** persetujuan bantuan, angka anggaran atau monitoring BAST.
- [x] [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S4_FOLLOWUP_DASHBOARD.md), [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Sintaks, hasil perhitungan, akses, HP/UX, sumber riil, audit, keamanan dan proses dinas BELUM DIUJI.
- [x] M04-S5: draf kendala dan eskalasi lintas petugas DEMO sudah ditulis, BELUM DIUJI.
- [ ] M04-S6+ keputusan/paket/distribusi/BAST melalui proses sah tetap RENCANA.

## Progres M04-S3: tindak lanjut administratif, BELUM DIUJI
- [x] [Kode rencana tindak lanjut DEMO](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-followup) untuk tugas, penanggung jawab, tenggat contoh, catatan, penelaahan, pengembalian, pembatalan dan histori.
- [x] Gerbang referensi `metadata_tercatat` serta deteksi sumber berubah, **bukan** verifikasi keaslian atau keputusan.
- [x] [Dokumen M04-S3](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S3_ADMIN_FOLLOWUP.md) dan [TEST_BACKLOG](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Semua tes keamanan/kode/HP, autentikasi, data asli, keputusan dan proses bantuan resmi belum dilakukan.
- [x] M04-S4: dashboard antrean tugas administratif baca-saja sudah ditulis, BELUM DIUJI.
- [x] M04-S5: pelaporan kendala dan koordinasi DEMO sudah ditulis, BELUM DIUJI.
- [ ] M04-S6+ perencanaan paket, distribusi, BAST dan proses resmi lainnya tetap RENCANA.

## Progres M04-S2: referensi keputusan/dokumen eksternal (BELUM DIUJI)
- [x] [Kode M04-S2](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference): register metadata dokumen fiktif yang **diklaim terbit di luar YANDIK+**, pemeriksaan metadata, perbaikan, histori, anti-duplikat dan penanda sumber usang.
- [x] **Tidak** menerbitkan keputusan, tidak memeriksa keaslian file, tidak menentukan bantuan/anggaran. Status `metadata_tercatat` hanya catatan penelusuran.
- [x] [Spesifikasi M04-S2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md) dan [QA ditunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Semua uji kode, konfirmasi penerbit, dokumen riil, akun/DB, SPBE dan SOP resmi belum dilakukan.
- [x] M04-S3: draf rencana tindak lanjut administratif tersimpan, BELUM DIUJI.
- [x] M04-S4: draft dashboard tindak lanjut DEMO, BELUM DIUJI.
- [x] M04-S5: draf eskalasi kendala administratif, BELUM DIUJI.
- [ ] M04-S6+ realisasi dukungan, keputusan resmi dan BAST tetap RENCANA.

## Progres M04-S1: rancangan berkas administrasi, BELUM DIUJI
- [x] Kode [`drafts/m04-admin-review/`](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review) untuk memilih kebutuhan DEMO terverifikasi, mengisi alasan dan kode bukti metadata serta mengecek lima unsur kelengkapan.
- [x] Penyusun dan penelaah DEMO terpisah; status akhir hanya **tercatat untuk pertimbangan**, bukan bantuan disetujui.
- [x] [Dokumen M04-S1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S1_ADMIN_HANDOFF.md), [QA tertunda](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Belum uji kode/UI, autentikasi, kewenangan resmi, data riil, alokasi dana, pengadaan, paket, distribusi atau BAST.
- [x] M04-S2 (draft): register **metadata referensi** keputusan eksternal sudah ditulis [kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-decision-reference), BELUM DIUJI; bukan verifikasi surat resmi.
- [x] M04-S3: contoh pencatatan rencana tindak lanjut dari metadata, BELUM DIUJI.
- [ ] M04-S4+: tindak lanjut menurut keputusan sah, paket, penyaluran dan pertanggungjawaban tetap RENCANA.

## Progres M03-S4C: rancangan bahan BA telaah, BELUM DIUJI
- [x] [Kode draft bahan penyusunan berita acara](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness) menyusun teks dari bobot percobaan, rincian skor fiktif, pendapat provinsi dan riwayat rekomendasi/perbaikan.
- [x] Mengingatkan agar dokumen ditelaah manusia, **tanpa** nomor resmi, tanggal berita acara, tanda tangan atau persetujuan bantuan otomatis.
- [ ] Semua tes, hak akses server, format resmi, pengarsipan dan persetujuan kebijakan belum dilakukan.
- [Spesifikasi M03-S4C](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4C_DRAFT_MINUTES.md) · [backlog QA](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).

## Progres M03-S4B: pendapat metodologi, BELUM DIUJI
- [x] Rancangan formulir dan histori telaah pemilihan bobot di [direktori draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness).
- [x] Peran kab/kota dan provinsi berupa label **DEMO**, keluaran hanya catatan kajian, bukan pengesahan bobot/bantuan.
- [ ] Keakuratan kode, akses, UI dan aturan review **belum diuji**. [Rincian](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4B_REVIEW_POLICY.md) dan [backlog](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Integrasi produksi, sumber riil dan tata kelola penetapan kebijakan belum dibangun.

## Progres M03-S4: laboratorium fairness (KODE DITULIS, BELUM DIUJI)
- [x] Enam skenario Puskeswan anonim fiktif dan tiga bobot percobaan ditulis dalam [draft](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m03-s4-fairness).
- [x] Rancangan analisis skor seri, data kosong dan sensitivitas perubahan urutan, tidak ada keputusan penerima bantuan.
- [ ] Review kebenaran sintaks, model, UI dan keadilan: **BELUM DIUJI** sesuai [backlog](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/TEST_BACKLOG.md).
- [ ] Integrasi ke prototype aktif: **belum**, seluruh berkas baru hanya di `drafts/`.
- [ ] Bobot/kriteria kebijakan perlu persetujuan manusia dan data aktual yang berwenang.
- [Ketentuan mode kerja](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/CODE_ONLY_MODE.md) · [Rencana M03-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4_FAIRNESS_PLAN.md).

## Progres M03-S3: penilaian prioritas percobaan
- [x] Lima faktor berbobot, alasan dan sumber DEMO, tiap faktor 0–3; kosong tidak dihitung sebagai 0.
- [x] Tidak memakai total pelayanan APEL mentah sebagai dasar skor; memperhatikan risiko, akses sulit, SDM dan sarana.
- [x] Review kab/kota/provinsi pada prototype, koreksi rekomendasi beralasan tanpa menimpa skor dasar.
- [x] Penilaian usang ketika sumber berubah ditandai; validator menolak field alokasi dan review palsu.
- [x] [GitHub Actions 176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270).
- [ ] Kriteria/bobot resmi, uji fairness lintas wilayah dan data sebenarnya **belum**; tidak ada penetapan bantuan otomatis.
- [Dokumen M03-S3](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_PRIORITY_ASSESSMENT.md).

## Progres M03-S2
- [x] Pemeriksaan metadata bukti DEMO sebelum pengajuan dan checkbox pemeriksa sebelum kebutuhan berstatus terverifikasi.
- [x] Cegah usulan barang serupa dalam satu Puskeswan meskipun sumber permasalahannya berbeda; histori penolakan memerlukan alasan pengajuan ulang.
- [x] [GitHub Actions SUCCESS: 154 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527), termasuk 15 Node dan 2 Chromium baru.
- [ ] **Bukan** unggah foto, validasi keaslian bukti, pemeriksaan fisik, penyimpanan DB atau persetujuan alokasi.
- Detail [M03-S2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_EVIDENCE_AND_DEDUP.md).

## Progres M03-S1
- [x] Model kebutuhan yang wajib merujuk masalah terverifikasi melalui `problem_id` dan ID Puskeswan yang sama; tidak menyalin deskripsi.
- [x] Field contoh: kategori, barang, jumlah, satuan, urgensi, alasan, status & histori.
- [x] Draf, pengajuan, koreksi, verifikasi, penolakan dan tes akses role wilayah pada data fiktif.
- [x] UI mobile-first demo dan 15 tes Node + 3 tes browser baru; [GitHub Actions SUCCESS: 137 tes](https://github.com/dvoriano/yandik-plus/actions/runs/42862700052).
- [ ] Skor prioritas adil, dokumen bukti, verifikasi resmi, database, autentikasi, integrasi, alokasi dan BAST belum dibuat.
- [Rincian M03-S1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_LINKED_SUPPORT_NEEDS.md).

## 8. Checklist pengembangan
- [x] MOD-04-01: Kategori dan data minimum **untuk prototype** ditentukan; perlu review kedinasan sebelum final.
- [x] MOD-04-02a: Konsep prioritas 5 faktor dan penjelasan pada **prototype**, belum disahkan.
- [ ] MOD-04-02b: Validasi kriteria/bobot, kewajaran lintas fasilitas dan penetapan SOP resmi.
- [x] MOD-04-03a: Cek bukti metadata dan deteksi duplikat **di prototype**, [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42936090527).
- [x] MOD-04-03: Form usulan + verifikasi dan alasan koreksi **sebagai prototype fiktif**, belum aplikasi resmi.
- [x] MOD-04-04a: Draft pemeriksaan administrasi **tanpa simulasi keputusan pejabat** dibuat [kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m04-admin-review), BELUM DIUJI.
- [x] MOD-04-04b1: Kode register **metadata referensi** eksternal DEMO, belum teruji/terhubung proses sah.
- [ ] MOD-04-04b2: Verifikasi formal ke sumber, penetapan prosedur, rencana paket dan tindakan resmi yang berwenang.
- [ ] MOD-04-05: Buat pencatatan distribusi, BAST dan evaluasi menggunakan data dummy

## Batas modul dengan M02-S4
M02 kini memiliki **prototype register Permasalahan Puskeswan** di browser dengan data DEMO. Itu **tidak sama dengan pengajuan kebutuhan, prioritas bantuan, keputusan alokasi, serah terima atau BAST**. M03 **SEDANG (prototype)**, M04-S1 baru **DRAFT BELUM DIUJI** dan proses bantuan riil M04-S2+ **RENCANA**. Referensi kebutuhan ke `problem_id` sudah ada di kode fiktif, tanpa auto-approval atau auto-budgeting.
- [x] Domain sumber masalah teridentifikasi sebagai prototype M02-S4 [bukti](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M02_PROBLEMS_AND_REFERENCES.md).
- [x] Tautan **model prototype** problem → kebutuhan dan verifikasi kebutuhan tersedia (bukan transaksi database resmi).
- [ ] Prioritas akhir, keputusan bantuan sah, distribusi dan BAST belum dibuat.

## 9. Kriteria selesai
Simulasi satu bantuan dapat ditelusuri dari sumber kebutuhan sampai BAST dan dampaknya; tidak ada penetapan bantuan otomatis tanpa kewenangan manusia.

## 10. Catatan batasan, risiko, dan UX
Peringkat pelayanan tinggi tidak otomatis mendominasi bantuan; fasilitas terpencil/kekurangan tenaga tetap dipertimbangkan. Sistem tidak melakukan pengadaan atau pembelanjaan otomatis. Rujuk juga docs/SUPPORT_PUSKESWAN.md.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).
