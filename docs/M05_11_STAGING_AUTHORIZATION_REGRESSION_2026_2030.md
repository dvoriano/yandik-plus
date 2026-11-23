# M05-11 | Protokol Otorisasi Pengujian Staging & Validasi Regresi APEL 2026–2030

**23 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO.** Ini rancangan prasyarat, **bukan surat izin, dokumen persetujuan, lingkungan staging yang telah disiapkan, maupun laporan hasil tes**.

## 1. Tujuan
M05-10 telah menyediakan 23 definisi kasus paritas APEL yang menghasilkan 22 rencana pemeriksaan untuk 2026 serta 20 per tahun untuk 2027–2030. M05-11 menentukan **apa yang harus tersedia sebelum rencana itu boleh dijalankan**. M05-8 masih memblokir enam gerbang dan M05-9 belum menghasilkan keputusan atau koreksi resmi. Semua input saat ini hanya DEMO.

Ada empat keputusan yang **harus dibedakan**:
1. **Izin pengujian oleh pemilik proyek:** perubahan mode kerja CODE_ONLY harus diminta eksplisit untuk cakupan tertentu.
2. **Izin sumber dan sistem oleh pemilik yang berwenang:** hak akses, kebutuhan data, lingkungan, dan batas operasi harus terpisah dari perintah ChatGPT.
3. **Otorisasi penerapan/operasional:** hanya setelah pengujian dan penelaahan formal, melalui mekanisme lain yang sah.
4. **Otorisasi publikasi:** berbeda dari semuanya dan memerlukan kewenangan tersendiri.

Tidak satu pun izin tersebut bisa dinyatakan ada hanya karena catatan atau checklist DEMO telah lengkap.

## 2. Empat belas kontrol staging yang diusulkan

| Kelompok | Kontrol wajib sebelum uji nyata |
|---|---|
| 1. PROJECT_TEST_PERMISSION | Izin eksplisit keluar dari CODE_ONLY untuk scope yang tertulis |
| 2. SYSTEM_ACCESS_PERMISSION | Persetujuan pemilik sistem dan sumber terpisah |
| 3. PURPOSE_AND_DATA_SCOPE | Tujuan, batas dataset dan akses minimum |
| 4. ISOLATED_STAGING | Pemisahan jaringan, database, kunci dan endpoint dari produksi |
| 5. SYNTHETIC_DATA_BOUNDARY | Data sintetis sebagai awal; data nyata membutuhkan dasar terpisah |
| 6. SECRETS_AND_RBAC | Pengelolaan kredensial di luar repo PUBLIC; kontrol hak akses |
| 7. BACKUP_AND_RECOVERY | Bukti strategi backup, restore, dan pemulihan |
| 8. SOURCE_SCHEMA_CONTRACT | Data dictionary aktual, kunci, grain, unit dan revisi |
| 9. BASELINE_AND_JUKNIS | Paritas terhadap acuan Juknis 2026 yang terverifikasi |
| 10. YEAR_POLICY_AND_UNITS | Versi aturan tahunan 2026–2030 tanpa warisan otomatis |
| 11. REGRESSION_EVIDENCE | Rencana snapshot tepercaya, log dan identitas eksekusi yang dapat diaudit |
| 12. FAILURE_AND_ROLLBACK | Kriteria hentikan uji, penanganan insiden, pemulihan dan kebersihan data |
| 13. HUMAN_REVIEW_SIGNOFF | Pemeriksaan independen oleh pengampu/penelaah yang berwenang |
| 14. PUBLICATION_SEPARATION | Izin berbeda sebelum menggunakan hasil untuk publikasi |

Seluruh pemilik kontrol di kode adalah **peran konseptual**, bukan nama atau penugasan pejabat nyata. Kontrol selalu `BLOCKED_NO_REAL_EVIDENCE` dengan `official_signoff=false`.

## 3. Dua belas jenis artefak bukti yang harus direncanakan
`packet.mjs` menyiapkan **slot kosong** untuk bukti izin tertulis, isolasi staging, RBAC/retensi, mapping schema, baseline Juknis, policy per tahun, snapshot/digest, log uji, laporan perbedaan/ambang, log insiden dan rollback, review independen, dan keputusan publikasi. Tidak ada isi berkas, checksum tepercaya, file hasil tes, nama penandatangan atau sumber nyata.

Arsitektur bukti nyata **belum** dibuat dan tidak boleh diimprovisasi menjadi arsip kredensial atau lampiran dinas dalam repository PUBLIC. Nanti perlu lokasi simpan dan retensi yang disahkan, audit trail, provenance, izin akses, serta prosedur penghapusan yang resmi.

## 4. Rancangan regresi tanpa eksekusi
Seluruh item M05-10 tetap `NOT_RUN`, `NOT_ASSESSED`, `expected_value=null`, `observed_value=null` dan `difference=null`. Persyaratan wajib menyatakan identitas tahun/versi policy, tanggal dan sumber snapshot yang sah, comparator dan toleransi yang disetujui, hasil aktual, penelaah, serta catatan insiden bila ada.

Kasus utama meliputi:
- laporan nol eksplisit versus bulan tidak melapor; nilai UNKNOWN/NOT_REPORTED/NOT_APPLICABLE tidak boleh berubah menjadi nol;
- investigasi per kejadian dan lokasi serta kurban per hewan menurut Juknis 2026 yang telah diperiksa;
- revisi workflow, timestamp server, tenggat laporan, riwayat wilayah, satuan dan bukti dukungan;
- paritas total bulanan/tahunan dengan coverage yang setara, bukan membandingkan angka yang grain dan denominator berbeda;
- independensi aturan 2027–2030, tidak ada otomatisasi skor, peringkat atau penghargaan dari data DEMO.

Pengujian unit terhadap fungsi DEMO dan **uji integrasi sumber resmi** merupakan dua jenis pekerjaan berbeda. Persetujuan untuk yang pertama tidak otomatis mengizinkan yang kedua.

## 5. Pengaman yang berlaku sekarang
- `code_only_active=true`, `source_environment=NONE_CONNECTED`, `readiness=BLOCKED_PENDING_SEPARATE_OWNER_PERMISSIONS`.
- Tidak ada pengujian, database, Flask, VPS, API, SQL, SSH, browser, CL/CI, workflow_dispatch, merge ataupun deployment.
- `may_run_tests`, `may_connect`, `may_query`, `may_write`, `may_repair`, `may_score`, `may_rank`, `may_award`, `may_publish` dan `official_authorization` selalu false.
- Review DEMO atau adanya file kode bukan bukti keandalan, izin akses, sertifikasi keamanan, hasil paritas, atau legalitas data.

## 6. Hasil pekerjaan & QA
- [Kontrak kontrol staging](../drafts/m05-apel-staging-protocol/protocol.mjs)
- [Catatan review DEMO](../drafts/m05-apel-staging-protocol/review.mjs)
- [Paket bukti regresi (kosong)](../drafts/m05-apel-staging-protocol/packet.mjs)
- [README](../drafts/m05-apel-staging-protocol/README.md)
- [50 skenario QA tertulis](../drafts/m05-apel-staging-protocol/tests/protocol.test.mjs) (**0 dijalankan**)
- [TEST_BACKLOG](TEST_BACKLOG.md)

**M05-12 (RENCANA):** rancangan checklist kesiapan rilis dan rollback, tetapi tidak ada izin menjalankan uji ataupun menyentuh sumber/website nyata dalam mode CODE_ONLY.
