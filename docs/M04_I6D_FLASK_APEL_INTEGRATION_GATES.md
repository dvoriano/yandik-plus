# M04-I6D | Peta Kompatibilitas Flask/APEL dan Gerbang Integrasi

**19 November 2026 WIB | KODE DITULIS, BELUM DIUJI.** Melanjutkan I6A (preflight), I6B (identitas/inventaris read-only), I6C (snapshot/recovery/retensi). Semua pekerjaan hanya di GitHub, branch `develop/yandik-foundation`. **Bukan integrasi aplikasi hidup, uji kompatibilitas, izin migrasi, atau penilaian resmi SPBE.**

## 1. Keputusan arsitektur

**Pendekatan:** `PARALLEL_DRAFT_NO_REWRITE`. Pertahankan antarmuka dan jalur pengisian lama sebagai acuan; modul M04 tidak mengambil alih route, membaca database produksi, atau menulis langsung ke tabel APEL/SDM.

Arsitektur yang sebelumnya dicatat dalam `docs/ARCHITECTURE.md`: Browser → Caddy → Gunicorn → Flask `app:app`; berkas lama diperkirakan meliputi `app.py`, `core/`, `modules/`, `templates/`, `static/`. Ini hanya **catatan snapshot investigasi sebelumnya**, bukan pemeriksaan aplikasi produksi tanggal ini. Repo draft tidak menyertakan source Flask lengkap dan data runtime. Tidak ada upaya mengakses VPS.

## 2. Pemetaan pintu layanan yang terdokumentasi

| ID kandidat | Rute yang terdokumentasi | Kontrak yang perlu dibuktikan dari source Flask asli |
|---|---|---|
| APEL_FORM | `/form` | Sesi pelapor, kepemilikan unit, validasi input, periodisasi, method, response, error dan jejak revisi |
| APEL_DASHBOARD | `/dashboard` | Agregasi, query pembatasan wilayah, keterbacaan, perhitungan dan hak lihat |
| APEL_DATA_SAYA | `/data-saya` | Isolasi data fasilitas sendiri, revisi historis dan respons saat sesi habis |
| APEL_CHECKLIST | `/checklist-kepatuhan` | Kelengkapan per bulan, sumber laporan, keterlambatan dan anomali |
| SDM_DIREKTORI | `/modul/sdm` | Hak lihat/ubah, batas data personel dan kaitan ID dengan master Puskeswan |

Lima path tersebut merupakan **pintu layanan terdokumentasi yang perlu dikonfirmasi**, bukan hasil inspeksi route Flask terbaru. Modul `legacy-surfaces.mjs` bahkan tidak menerima klaim `VERIFIED` dalam catatan DEMO, supaya metadata publik tidak keliru disangka bukti teknis.

## 3. 24 gerbang sebelum integrasi

**12 gerbang I6C** diwariskan sebagai *daftar periksa*, bukan bukti lulus: provenance snapshot, sesi & RBAC, baca konsisten, pembekuan penulis, pemeriksaan dalam lock, backup, restore, migrasi atomik, jurnal tahan gagal, pemeriksaan pasca-cutover, retensi dan otorisasi.

**12 gerbang baru I6D** dikelompokkan:
- **Route/keamanan:** pemeriksaan route Flask, sesi backend, RBAC wilayah, CSRF, logout, akses API.
- **Data & aturan APEL:** crosswalk identitas Puskeswan/SDM dan periode; parity rekap/juknis APEL 2026; mencegah input bulanan ganda.
- **Pemisahan modul:** Support M04 hanya memakai data APEL/SDM yang sah dan bersifat read-only; tidak memindahkan kewenangan pengesahan.
- **Privasi, UX, gangguan:** pembatasan bukti/unduhan, penanganan error, kesetaraan form/dashboard/checklist, fallback.
- **QA dan kelembagaan:** pengujian staging anonim setelah izin G0, telaah keamanan, data, dan SPBE oleh pihak terkait.

Semua status `BELUM_DIBUKTIKAN`. Berkas `contracts.mjs` tidak menyediakan mekanisme mengubahnya menjadi `lulus` dari parameter browser.

## 4. Kesetaraan aturan APEL yang wajib diuji nantinya

| Perilaku lama | Hal yang harus dipertahankan/diverifikasi |
|---|---|
| Pelaporan bulanan Puskeswan | Satu laporan per bulan **per Puskeswan**, bukan laporan masing-masing petugas |
| Tidak ada pelayanan | Nilai nol, dibedakan dari data tidak dikirim |
| Investigasi | Hitung berdasarkan lokasi/kejadian sesuai juknis |
| Pemeriksaan kurban | Ante dan post mortem pada hewan yang sama tidak dihitung dua hewan |
| Tenggat dan kepatuhan | Aturan tanggal 9 dan publikasi tanggal 10 mengikuti kebijakan periode terkait |
| Perhitungan apresiasi | Rumus 2026 tidak berubah diam-diam ketika versi penilaian baru dibuat |
| Dashboard/Data Saya | Kelengkapan data, wilayah dan identitas fasilitas tidak bocor lintas pengguna |

Ketentuan tersebut **merupakan daftar regresi yang diusulkan berdasarkan dokumen proyek**, bukan bukti bahwa sistem lama sudah melaksanakan semuanya dengan tepat. Implementasi M05 APEL 2.0 perlu mempertahankan kesetaraan pada data fixture anonim sebelum peralihan apa pun.

## 5. Peta tanggung jawab dan keluaran telaah

| Kelompok | Pengampu review yang diusulkan | Bukti yang masih perlu |
|---|---|---|
| APEL dan juknis | Pengampu APEL | Spesifikasi perhitungan berversi, contoh bulan, hasil banding |
| SDM/master wilayah | Pengelola data & SDM | Pemilik ID kanonik, daftar relasi, perlindungan data personal |
| Teknis Flask | Tim teknis aplikasi | Inventaris source/route/middleware, skema DB, fallback |
| Keamanan | Pengampu keamanan sistem | Session/CSRF/RBAC, audit, kontrol unduhan dan upload |
| Arsip/retensi | Pengelola data dan arsip | Klasifikasi, masa simpan, legal hold, restore |
| Tata kelola SPBE | Pengampu terkait | Keputusan tertulis cakupan/integrasi dan standar yang relevan |

Catatan DEMO dapat dibuat lewat `prepareReviewHandoff`, namun ID dan catatannya hanyalah metadata usulan. Tindakan reviewer tidak pernah otomatis memberi persetujuan, mengubah skema atau mengubah website.

## 6. Ketentuan pemisahan kerja dan keamanan

1. Tidak menyimpan password, session cookies, token, DB dump, identitas petugas, gambar bukti pelayanan, PDF kedinasan atau data warga dalam repository **PUBLIC**.
2. Tidak menarik source Flask nyata dari VPS; bila kelak sudah diizinkan harus melalui proses akses dan sanitasi terpisah.
3. Tidak membuat jalur server yang dapat dipanggil browser untuk memilih `actor_id`, `role`, wilayah atau izin migrasi.
4. Tidak menulis pada `foundation/`, `prototypes/`, `main`, serta tidak menjalankan CI/CL/test sampai owner secara eksplisit mencabut pembatasan G0 dalam lingkup disetujui.
5. Tidak membuat nilai tanggal retensi sendiri atau menyatakan persetujuan SPBE.
6. Tidak mengubah URL/juknis/penilaian 2026, target Puskeswan, atau skema APEL produksi dalam fase rancangan ini.

## 7. Artefak dan backlog

- [Kandidat permukaan Flask/APEL](../drafts/m04-flask-integration-gates/legacy-surfaces.mjs)
- [Matriks 24 gerbang](../drafts/m04-flask-integration-gates/contracts.mjs)
- [Catatan handoff review](../drafts/m04-flask-integration-gates/handoff.mjs)
- [21 skenario tertulis](../drafts/m04-flask-integration-gates/tests/)
- [TEST_BACKLOG](TEST_BACKLOG.md)

**7+7+7 = 21 skenario Node disimpan, 0 dijalankan.** Tidak ada bukti uji Flask, DB, migrasi, keamanan atau deployment baru.

## 8. Lanjutan

**M05-0 sudah ditulis sebagai kontrak APEL multi-tahun 2026–2030 (BELUM DIUJI):** [spesifikasi M05-0](M05_0_APEL_MULTIYEAR_2026_2030.md) dan [kode DEMO](../drafts/m05-apel-multiyear/). Baseline 2026 memerlukan regresi terhadap sumber Flask/Juknis; kebijakan 2027–2030 menunggu keputusan masing-masing tahun. Seluruhnya masih nonresmi dan tidak mengizinkan integrasi. Ini tidak membuka izin integrasi atau deploy; M04-I6A–I6D tetap berstatus kode draft BELUM DIUJI.
