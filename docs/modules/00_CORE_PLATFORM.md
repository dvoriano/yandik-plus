# MOD-00 | Core Platform, Hak Akses dan Komponen Bersama

**Milestone:** M01  
**Status implementasi GitHub:** SEDANG (prototype lama punya tes historis; M00-G1–G9 kode baru belum diuji; belum terintegrasi Flask).  
**Acuan status tunggal:** [ROADMAP.md](../ROADMAP.md).  
**Versi spesifikasi:** 1.0 / 10 November 2026.

## 1. Kondisi awal
Snapshot memuat modul auth, user, role/permission, organisasi, wilayah, audit, dan sebagian utilitas platform. Belum dianggap siap sebagai sistem hak akses lintas modul.

## 2. Tujuan
Satu pondasi keamanan, identitas, dan proses pekerjaan yang dipakai oleh semua modul tanpa menambah formulir ganda.

## 3. Pengguna dan hak akses
- Admin provinsi
- verifikator provinsi
- koordinator kab/kota
- petugas Puskeswan
- pengawas
- pimpinan baca saja
Hak akses rinci ditentukan pada Core Platform, termasuk pembatasan wilayah dan bukti.

## 4. Fitur yang direncanakan
- Master Puskeswan dengan ID stabil dan wilayah/organisasi
- Pengguna dan role-teritorial, izin tiap aksi API serta field sensitif
- Pusat tugas pengguna, audit perubahan, log aktivitas penting
- Mesin workflow, bukti, antrian verifikasi dan generator dokumen bersama
- Konfigurasi environment anonim dan migrasi skema versioned
- Pengujian keamanan: akun, upload, reset password, CSRF dan password hashing

## 5. Alur kerja pengguna
Login → lihat tugas sesuai peran → isi kegiatan → kirim → verifikasi → tindak lanjut → rekap.

## 6. Objek data (usulan, belum migrasi final)
- puskeswan_id, wilayah_id, organisasi_id
- user_id, role_id, scope wilayah
- workflow_case, evidence_ref, status_history, audit_event
- metadata dokumen dan retensi
Semua perubahan penting menyimpan pembuat, waktu, sumber, status verifikasi dan jejak revisi.

## 7. Integrasi dengan modul lain
Seluruh modul di bawah harus memakai ID, hak akses, audit, workflow, dan sumber identitas ini.

## Tambahan izin verifikasi M02
- [x] `VERIFY_PROFILE` untuk verifikator provinsi dan kab/kota sesuai wilayah; penulis tidak dapat menyetujui sendiri.
- [x] 25 tes baru pada kode profile review [CI SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42842163389); belum terhubung endpoint Flask.

## Progres master data terbaru
- [x] Prototype master ID Puskeswan, histori SDM/penempatan, kondisi sarpras serta asal/verifikasi profiling.
- [x] Hubungan ke APEL dan Support serta 18 tes tambahan [GitHub Actions SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42840263033).
- [ ] Migrasi database dan integrasi endpoint Flask asli masih terbuka; rincian [M01-S2](../M01_MASTER_DATA.md).

## Progres prototype yang sudah terbukti
- [x] Role/territory check default deny untuk Puskeswan, kab/kota, provinsi, pimpinan.
- [x] Workflow in-memory dengan audit append-only, koreksi, alasan, dan batas wilayah.
- [x] 12 tes tambahan pada [CI GitHub: SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42838727867).
- [ ] Adaptasi ke endpoint, database dan pengesahan matriks kewenangan sebenarnya.

## Tambahan M00-G1 | Gerbang baca-saja modul pengawasan DEMO
- [x] [Kode baca-saja berwilayah](../M00_G1_SCOPED_OVERSIGHT_READ.md) dan 19 QA tertulis, **0 dijalankan**.
- [ ] Autentikasi server, izin per-API, identitas penanggung jawab, logout dan audit harus dibuktikan. Tidak ada izin operasional atau publikasi.

## Tambahan M00-G2 | Batas sumber dan akses API DEMO
- [x] [Kontrak manifest asal data](../M00_G2_SOURCE_API_BOUNDARY_2026_2030.md) dan 24 QA tertulis, **0 dijalankan**. SURVEILLANCE didaftarkan pada M00-G1.
- [ ] Tidak ada autentikasi sesi, API server, bukti keaslian sumber, izin integrasi maupun sinkronisasi iSIKHNAS/APEL.

## Tambahan M00-G3 | Proyeksi endpoint API baca-saja DEMO
- [x] [Kode kontrak gateway](../M00_G3_READ_API_BOUNDARY_2026_2030.md) dan 19 QA tertulis, **0 dijalankan**; request GET dan respons minimum, bukan endpoint HTTP.
- [ ] Sesi backend nyata, identitas setiap API, CSRF, log akses dan hak per field tetap belum dibuktikan.

## Tambahan M00-G4/G5 | Kesiapan sumber resmi dan audit transaksi DEMO
- [x] [Daftar persyaratan izin sumber](../M00_G4_SOURCE_PERMISSION_GATE_2026_2030.md) ditulis, **22 QA tertulis, 0 dijalankan**; tidak memberi otorisasi data resmi.
- [x] [Skema transaksi audit dan log DEMO](../M00_G5_AUDIT_TRANSACTION_PORT_2026_2030.md) ditulis, **24 QA tertulis, 0 dijalankan**; skema SQL belum dieksekusi dan bukan penyimpanan aman siap pakai.
- [ ] Identitas Flask yang sah, per-API authorization, sumber berizin, transaksi atomik dan backup/restore harus dibuktikan.

## Tambahan M00-G6/G7 | Flask/SQLite DEMO terisolasi
- [x] [Adaptor Flask GET-only](../M00_G6_FLASK_ADAPTER_DEMO_2026_2030.md) disusun dengan factory Blueprint nonaktif default, **25 QA tertulis, 0 dijalankan**. Belum dipasang ke server dan tidak mengautentikasi produksi.
- [x] [Penulis audit SQLite memory-only](../M00_G7_SQLITE_INMEMORY_TRANSACTION_2026_2030.md) disusun dengan transaction/rollback/idempotency, **25 QA tertulis, 0 dijalankan**. Belum ada eksekusi SQL, DB nyata, koneksi M00-G5 atau bukti integrasi.
- [ ] Audit source Flask yang diizinkan, per-session server, review hak akses, QA, proteksi storage dan rollback tetap dibutuhkan.

## Tambahan M00-G8 | Paritas format audit dan gerbang Flask
- [x] [Bridge format audit JS/Python](../M00_G8_CROSS_LANGUAGE_AUDIT_BRIDGE_2026_2030.md) ditulis, **37 QA tertulis, 0 dijalankan**. Hash kanonik tidak memvalidasi hash asli atau migrasi.
- [x] [Checklist penerimaan source Flask legacy](../M00_FLASK_SOURCE_ACCEPTANCE_GATE_2026_2030.md) disusun, bukan bukti izin, audit source atau integrasi.
- [ ] Pemeriksaan hak akses, source integrity, Flask session dan prosedur migrasi nyata belum dilakukan.

## Tambahan M00-G9 | Deklarasi source Flask pra-integrasi
- [x] [Kode preflight metadata](../M00_G9_FLASK_INTAKE_METADATA_DEMO_2026_2030.md) ditulis, **41 QA tertulis, 0 dijalankan**. Ini tidak memindai file, memeriksa secrets sesungguhnya atau memberi izin sumber.
- [ ] Penerimaan source Flask sanitisasi/berizin, pemeriksaan kode nyata dan verifikasi role/route seluruhnya belum dilakukan.

## 8. Checklist pengembangan
- [ ] MOD-00-01: Peta role dan aksi per jenis pengguna disepakati
- [ ] MOD-00-02: Refactor izin API, data minimization, unggah aman dan credential handling di salinan
- [ ] MOD-00-03: Buat master Puskeswan dan migration contoh sintetis
- [ ] MOD-00-04: Buat workflow dan audit reusable yang diuji
- [ ] MOD-00-05: Buat beranda sederhana dan uji tugas via HP

## 9. Kriteria selesai
Tidak ada pengguna dapat melihat atau mengubah data di luar perannya; jejak setiap perubahan ada; master ID dipakai lintas modul; semua tes negatif otorisasi dan smoke lulus.

## 10. Catatan batasan, risiko, dan UX
P0. Tidak melakukan auth terhadap website produksi; sumber risiko teridentifikasi pada snapshot harus diatasi sebelum suatu versi baru dinyatakan siap untuk deployment.

**Standar bersama:** [UX paperless](../UX_PAPERLESS.md), [Workflow Engine](../WORKFLOW_ENGINE.md), [Keamanan & data](../SECURITY_AND_DATA.md).  
**Penegasan:** tidak terhubung VPS, tidak menggunakan data pribadi/produksi; implementasi dan tes dilakukan pada data dummy. Perubahan scope melalui [changelog](../CHANGELOG_ROADMAP.md).


## Tautan pengembangan lintas modul M04-I1 (16 November 2026)
[Workspace DEMO](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I1_INTEGRATED_WORKSPACE.md) menggunakan identitas fiktif dan fungsi M02/M03, snapshot baca-saja SDM/APEL dan model S10–S15. **KODE DITULIS, BELUM DIUJI.** Tidak mengubah status modul produksi, tidak menyatukan sumber asli, tidak mengimplementasikan APEL 2.0 atau RBAC/API/DB server. Kontrak data dan akses server menjadi pekerjaan lanjutan.


## Pengembangan repository M04-I2 (16 November 2026)
[Kontrak SQLite dan akses/koreksi DEMO](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I2_DATA_FOUNDATION.md) ditulis dan BELUM DIUJI. Ini rancangan server-side khusus fixture I1, bukan login atau hak akses resmi, adapter Flask atau database produksi. Revisi, snapshot, audit dan idempotensi dirancang satu transaksi; konflik sumber diblokir. Rekonsiliasi dan penyelarasan kebijakan Core masih tertunda.


## Lanjutan M04-I3 (19 November 2026)
[Peta dampak dan cabang rekonsiliasi DEMO](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I3_RECONCILIATION.md) ditulis untuk melindungi hubungan kebutuhan, paket sampai monitoring ketika sumber berubah. Ada penyusunan/penelaahan terpisah, tetapi **belum ada aktivasi cabang, otorisasi resmi, atau pengujian**. Histori dan workspace aktif tetap dipertahankan; integrasi, pengamanan server dan proses kelembagaan masih tertunda.


## Lanjutan M04-I4 (19 November 2026)
[Rancangan gerbang aktivasi dan tindak lanjut](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I4_ACTIVATION_AND_FOLLOWUP.md) sudah ditulis sebagai kode DEMO yang **belum diuji**. Cabang tanpa riwayat pengiriman dapat diproses untuk aktivasi simulasi dengan pemeriksaan ulang dan penelaah tambahan, lalu objek lama disimpan dalam arsip; jejak kirim/terima/BAST/monitoring memblokir aktivasi dan hanya menghasilkan daftar tindak lanjut manual. Tidak ada keputusan pejabat, stok, dokumen kedinasan, database produksi atau integrasi Flask yang diubah.


## Lanjutan M04-I5 (19 November 2026)
[Rancangan ID generasi dan repository logis per Puskeswan](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I5_GENERATION_AND_PARTITIONS.md) telah ditulis, **BELUM DIUJI**. Pemisahan snapshot I4 menggunakan rujukan fasilitas dan arsip yang eksplisit, menolak paket lintas wilayah dan ID lama; SQLite DEMO masih berbagi penulis fisik. Hak akses asli, migrasi, koreksi resmi, dokumen, serta data produksi belum ditangani.

## Lanjutan K1 | Identitas Profil/SDM 24 November
[Editor konsolidasi](../../drafts/yandik-portal/review.html#profil-sdm) memakai ID master DEMO M05 dan validator sumber M05-15; hanya state memori, tanpa pemetaan M04 dan tanpa autentikasi server. 19 QA lintas Profil/SDM tertulis, 0 dijalankan. K4/K7 tetap tertunda.

## Konsolidasi portal tahap 2 (24 November)
## 2026-11-24 | Konsolidasi tahap 2: satu ruang kerja DEMO
- [Audit gap 15 modul](../KONSOLIDASI_TAHAP_2_2026-11-24.md), [portal](../../drafts/yandik-portal/review.html): 12 kelompok navigasi hash untuk 14 modul pengguna, panel tetap mounted, pustaka tertanam, tautan utama APEL/Support/Pustaka ke ruang kerja; prototipe lama dipertahankan. Perbaikan statis konfirmasi draf/reset, urutan ID pembinaan/dokumen dan kunci notifikasi stale. 10 QA unit navigasi tertulis, 0 dijalankan; QA browser dan seluruh audit backend masih tertunda. Bukan audit seluruh baris atau bukti integrasi operasional. CODE_ONLY [skip ci]. Berikutnya kontrak integrasi backend/data dan matriks QA, tanpa menjalankan tes.


## 2026-11-24 | K4: Kontrak integrasi backend/data DEMO
- [Kontrak](../K4_KONTRAK_BACKEND_DATA_2026_2030.md): katalog 15 resource, usulan jalur API, DDL 16 tabel inti, evaluator Python baca/aksi kandidat berwilayah dengan deny default dan konversi interval akhir inklusif → eksklusif. 22 QA unit ditulis, 0 dijalankan. Tidak ada HTTP, DB, migrasi, login, writer atau izin operasi; melengkapi kontrak M00-G1–G9/M01-S2/M04-I2–I5 tanpa menggantinya. Source Flask berizin, typed domain schema, role server, rekonsiliasi dan QA tetap tertunda. CODE_ONLY [skip ci]. Berikutnya matriks QA Codex dan urutan integrasi, tanpa menjalankan tes.


## 2026-11-24 | K4-A1: penulis transaksi APEL bertipe DEMO
- Owner menunda preview Codex; kembali fokus CODE_ONLY. [Kontrak](../K4_A1_APEL_TYPED_WRITER_2026_2030.md): validator payload M05-0, satu tabel pendamping payload/revisi, penulis SQLite :memory: terisolasi untuk dua fixture record APEL, grant aktif, pemeriksaan revisi, replay, rollback, audit dan pemisahan ledger. 25 QA tertulis (8 validator + 17 rehearsal), 0 dijalankan. Bukan paritas M05-1, belum HTTP, DB riil, UI binding, otorisasi atau persistensi. K4/K7 tertunda; berikutnya typed inventory tahunan dan validasi katalog versi. [skip ci].


## 2026-11-24 | K4-A9: akun, grant dan siklus sesi DEMO
- [Kontrak](../K4_A9_ACCOUNT_SESSION_LIFECYCLE_2026_2030.md): AccountStore :memory:, admin/pimpinan fixture, akun dan grant satu aktif, scope master, token acak runtime (digest saja), kedaluwarsa 30 menit, logout/revokasi, admin command host-only, audit/replay/rollback. Dispatcher memakai resolver terikat instance pada AccountStore, raw callback ditolak. 24 QA tertulis (6 pure + 18 rehearsal), 0 dijalankan. 9/9 tahapan K4-A1–A9 kode awal tersedia, K4/K7 BELUM SELESAI/TERUJI. Belum auth/HTTP/CSRF, owner reassignment, DB riil atau persetujuan role. CODE_ONLY [skip ci]. Berikutnya K4-B konsolidasi statis kontrak, penutupan gap dan handoff QA tanpa eksekusi.


## 2026-11-24 | K4-B1–B6: konsolidasi backend, paket awal
- [Hasil dan batas](../K4_B_CONSOLIDATION_2026_2030.md): audit sumber terfokus, slot APEL 180 (3×60, dua ID lama dipertahankan), validasi tahun/role, respons missing/scope seragam, shared envelope 5 writer, adapter 15 modul + inventory, host in-process nonaktif default, manifest 241 QA backend (92 pure + 149 rehearsal, 0 dijalankan). 12 QA baru (4+8). Belum audit runtime, binding portal, auth riil, source/ledger, owner transfer, migrasi, HTTP, security QA. B1–B6 paket kode awal ditulis, K4/K7 belum selesai/teruji. CODE_ONLY [skip ci]. Berikutnya K4-B review sisa gap dan handoff QA; tidak menjalankan tanpa izin.


## 2026-11-24 | K4-C1: pengikatan portal backend DEMO
- [Kontrak](../K4_C1_PORTAL_BACKEND_BINDING_2026_2030.md): entry backend-review terpisah dari fixture, mount DOM 12 menu via transport host eksplisit, scope dari core, proyeksi read 15 modul + inventory, form APEL typed termasuk investigasi/kurban/metadata dan retry ID tetap, role menu, support refs dari server, perbaikan alias hash. 10 QA JS tertulis, 0 dijalankan. Belum host-browser transport, preview, form tulis selain APEL, auth/HTTP/ledger/DB riil. CODE_ONLY [skip ci]. Berikutnya K4-C2 pergantian penanggung jawab dan form domain lain; gate QA tetap tertunda.


## 2026-11-24 | K4-C2: serah terima penanggung jawab Puskeswan DEMO
- [Kontrak](../K4_C2_RESPONSIBILITY_HANDOFF_2026_2030.md): review provinsi + konfirmasi admin terpisah, snapshot akun/grant dan seluruh record fasilitas, digest/revisi/TTL 24 jam, alih owner tanpa mengubah payload, grant lama dan sesi dicabut atomik, grant baru dan histori per record/akun, replay dan rollback. 20 QA tertulis (5 pure + 15 rehearsal), manifest backend 261 (97+164), 0 dijalankan. Host-only, bukan mutasi SDM, belum UI/HTTP/persetujuan resmi/recovery petugas nonaktif. CODE_ONLY [skip ci]. Berikutnya K4-C3 formulir Profil, Inventaris dan SDM.


## 2026-11-24 | K4-C8: paket aplikasi terpadu dan handoff QA
- [Panduan](../K4_C8_INTEGRATED_PACKAGE_QA_HANDOFF_2026_2030.md): manifest 18 aset statis, audit impor terfokus, runner Playwright lokal virtual-origin tanpa HTTP listener, host AccountStore satu :memory: dengan konteks aktor terpisah, explicit authorization/read-only default, tidak auto-install. Semua 23 GET +8 POST provider aliases, retry APEL unified dan ACK malformed pending. 9 QA backend +4 JS baru, 0 dijalankan; manifest backend 319 (115+204). K4-C1–C8 kode awal tersedia 8/8, bukan siap jalan atau selesai K4/K7. Gate A/B/C tetap belum dijalankan; preview terpisah, D/E blocked. CODE_ONLY [skip ci]. Berikutnya keputusan owner cakupan QA; tidak otomatis menjalankan.

