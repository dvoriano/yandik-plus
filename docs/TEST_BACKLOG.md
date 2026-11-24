# TEST BACKLOG | Menumpuk Kode Dulu, Periksa Bersama Nanti

## K4-C3 | Form tahunan
- 6 QA backend `test_annual_forms.py` + 10 JS `tests/annual-form-model.test.mjs`, 0 dijalankan. Manual: 198 butir/15 kelompok, status unknown vs absent, stock vs asset, copy prior and group confirmation (including filtered rows), candidate actions, profile legal/date/coverage, scoped roster, transfer dates, retry lost ACK, conflict/dirty, permission changes, mobile/keyboard, regressions. Manifest backend 267 (97 pure+170 rehearsal); portal tests separate. Unit/DDL/browser require authorization.


## K4-C2 | Serah terima tanggung jawab
- 20 QA `drafts/yandik-backend-contract/test_handoff.py` (5 pure + 15 memory rehearsal), 0 dijalankan. Skenario tambahan: peran terpisah, snapshot stale dari revisi record/akun, revokasi reviewer, expired proposal, digest mismatch, mixed owner, akun baru tanpa grant, duplikasi/replay, old session denial, immutable audit, rollback lintas grant/session/owner/receipt, command replay tiap domain, no SDM/ledger update. Manifest backend 261 deklarasi (97 pure +164 rehearsal), portal terpisah. Perlu izin unit/DDL; akses produksi dan UI belum tersedia.


## K4-C1 | Portal backend binding
- 10 QA pure JS `drafts/yandik-portal/tests/backend-workspace-model.test.mjs`, 0 dijalankan. Tambahan manual: mount host authorization, no transport/no fallback, 12 menu/role, scope switch/stale async, unknown vs zero, input valid/zero, evidence refs, APEL draft/submit/review, lost ACK/conflict, dirty guard, accessibility and mobile, source M04 separation, backend revocation, full regression. Backend manifest 241 tetap; suite JS baru terpisah. Jangan jalankan browser/unit/DDL tanpa izin.


## K4-B | Konsolidasi backend
- 12 QA baru `drafts/yandik-backend-contract/test_consolidation.py` (4 pure + 8 rehearsal), 0 dijalankan; [manifest](../drafts/yandik-backend-contract/qa_manifest.json) berisi 241 QA backend (92 pure, 149 rehearsal) berdasarkan deklarasi 22 core + 207 A1–A9 + 12 B. QA tambahan manual: seluruh 5 envelope writer atomicity, 180 period coverage, scope/error parity, 28 route integration, bridge no fallback, ACK retry, lifecycle, owner transfer, regional reopen role, source manifest parity, multi-user/concurrency, source stale, missing coverage, security. Portal baseline dan historical suite tetap terpisah. Izin unit/DDL/preview terpisah; D/E blocked.


## K4-A9 | Account / grant / session lifecycle
- 24 QA `drafts/yandik-backend-contract/test_account_store.py` (6 pure, 18 memory rehearsal), 0 dijalankan. Tambahan: host resolver trust, instance binding, expiry/logout, revoke across all writers including replay, disabled/reenabled grants, scope derivation, protected admin, receipt/history/rollback, raw token redaction, session clock, old fixture API regression, negative authorization all 28 routes. Izin unit/DDL terpisah. HTTP session/CSRF, secure cookies, password KDF or SSO, rate limits and ownership transfer require design/review before production.


## K4-A8 | API candidate / projections
- 20 QA `drafts/yandik-backend-contract/test_api_dispatch.py` (5 pure, 15 memory rehearsal), 0 dijalankan. QA lanjutan: seluruh 28 jalur, command positif/negatif tiap writer, query/body spoofing, revoked grant, enum malformed, scope origin, aggregate suppression, coverage null, library parity, inbox lintas tahun, JS transport/ACK lost/retry/conflict, no storage, API error redaction, regresi sebelumnya. Izin unit/DDL terpisah, HTTP/auth/CSRF belum tersedia.


## K4-A7 | Coaching / paperless typed writer
- 22 QA `drafts/yandik-backend-contract/test_coachdoc_store.py` (6 pure + 16 rehearsal), 0 dijalankan. Tambahan: scope, date/order, return result, source stale, revision FK, evidence metadata, archive/reopen/refresh, old revision retrieval, replay/revocation, rollback, cross-stream command collision, no official issuance, regression previous stores. Izin unit dan DDL terpisah; belum parity JS/Python dan integrasi UI.


## K4-A6 | Regional register backend
- 20 QA `drafts/yandik-backend-contract/test_regional_store.py` (7 pure + 13 rehearsal), 0 dijalankan. Tambahan: parity sumber lama, scope origin, grant revocation, coverage missing, read-only snapshot, separation of duty, receipt collision lintas stream, immutable history, source digest, rollback, regresi store terdahulu. Unit/DDL perlu izin terpisah. Tidak menguji kewenangan, standar, data riil, atau penerbitan.


## K4-A5 | Support typed writer
- 20 QA `drafts/yandik-backend-contract/test_support_store.py` (6 pure + 14 rehearsal), 0 dijalankan. Tambahan QA source pin/stale sebelum dan setelah kirim, partial receipt per shipment, duplicate metadata, monitoring terbaru, unit terpisah, scope, revisi/replay/revokasi, collision lintas stream, rollback, regresi writer sebelumnya. Tidak membuktikan integrasi M04-I2/I6, pengadaan/BAST resmi, crosswalk atau keamanan server. Izin unit/DDL terpisah diperlukan.


## K4-A4 | SDM typed writer
- 26 QA `drafts/yandik-backend-contract/test_staff_store.py` (8 pure, 18 rehearsal), 0 dijalankan. Tambahan: interval eksklusif, coverage parsial/kosong, histori, role, kompetensi konflik, replay/revokasi, collision lintas resource, rollback, profil dan regresi APEL/inventaris/profil. Izin unit dan DDL terpisah; belum parity JS/Python atau data sah.


## K4-A3 | Profil typed writer
- 26 QA `drafts/yandik-backend-contract/test_profile_store.py` (10 pure, 16 memory rehearsal), 0 dijalankan. Tambahan parity lima bagian portal + dua kesiapan, date/scope, per-section review/reopen, histori stale, grant revokasi/replay, rollback, referensi inventaris/APEL dan SDM unknown. Tidak menguji sumber riil. Izin unit dan DDL terpisah diperlukan.


## K4-A2 | Inventaris typed writer
- 24 QA `drafts/yandik-backend-contract/test_inventory_store.py` (10 pure, 14 memory rehearsal), 0 dijalankan. Tambahan: parity katalog/JS, digest versi, copy draf dan tahun terakhir, confirm group attestation, scope kab/kota, dua tahap/reopen, ulang telaah setelah koreksi, command collision lintas APEL, revokasi/replay, immutable history, rollback dan isolasi. Izin terpisah unit/DDL diperlukan.


## K4-A1 | APEL typed writer | 24 November 2026
- 25 QA ditulis `drafts/yandik-backend-contract/test_apel_store.py`, 0 dijalankan. 8 pure validator, 17 SQLite memory rehearsal; perlu izin unit DAN DDL untuk seluruh suite. Tambahan QA: paritas JS/Python terhadap M05-0/1, state mapping, replay setelah revokasi, audit/receipt fault rollback, FK/attached guard, periode/owner, tidak menyentuh ledger. Belum concurrency lintas koneksi, auth, HTTP atau penyimpanan durable. Jangan menjalankan sekarang.


## 2026-11-24 | QA-A: percobaan preview terbatas, terblokir lingkungan
- Owner menjawab `kerjakan` setelah usulan preview QA-A; cakupan hanya preview DEMO, bukan unit/SQL/CI/deploy. Snapshot target `fe0c77c016ad928907a55d5125c2138a04112d9b`. Checkout lokal gagal DNS GitHub; arsip tidak tersedia melalui lingkungan ini. Tidak ada browser dibuka, tidak ada hasil render atau PASS. Pemeriksaan sumber melalui konektor: tree tidak terpotong, 8 entry script dan 3 CSS review.html ditemukan, tidak ada ID HTML statis duplikat. Q01 BLOCKED_ENVIRONMENT; Q02–Q29 NOT_RUN. [Handoff Codex](QA_A_PREVIEW_HANDOFF_2026-11-24.md). QA-B/C/D/E tidak diizinkan atau dijalankan; PR tetap Draft. Berikutnya checkout snapshot di Codex dengan akses repo, preview Q01–Q04 dulu.


## 2026-11-24 | K7: Master QA YANDIK+ 2026–2030
- [Master QA](MASTER_QA_YANDIK_2026_2030.md) dan [matriks JSON](../drafts/yandik-qa/qa-plan.json): inventaris prioritas 11 file unit (178 portal + 22 backend = 200 kasus dirancang), 36 skenario manual/integrasi/gerbang (29 preview, 1 DDL rehearsal, 6 blocked backend/rilis), seluruh 15 MOD. Semua NOT_RUN/BLOCKED, 0 dijalankan; bukan inventaris seluruh repo atau pengganti TEST_BACKLOG. Gate izin terpisah preview/unit/DDL/backend/rilis, bukti per SHA dan stop rules P0. CODE_ONLY [skip ci]. Berikutnya izin eksplisit owner untuk preview Codex atau lanjut review kode tanpa eksekusi; K4/K7 tetap tertunda.


## K4 | Kontrak backend/data | 24 November 2026
- 22 unit Python `drafts/yandik-backend-contract/test_contract.py` tertulis, 0 dijalankan. Setelah izin, periksa evaluator default deny/scope/owner/reviewer/revisi, tanggal dan crosswalk; SQL rehearsal hanya disposable memory: FK, uniqueness fasilitas/periode, grant mismatch, overlap interval, revision/audit/receipt rollback, immutable history, typed envelope/identity invariants, source document scope, konkurensi dan retry. Belum ada writer/HTTP; pengujian integrasi auth/CSRF/route menunggu source sah. Tidak ada klaim PASS.


## Konsolidasi tahap 2 | 24 November 2026
- 10 unit navigasi `drafts/yandik-portal/tests/navigation.test.mjs`, 0 dijalankan. Browser tertunda: hash langsung/Back/Forward, tiap menu, tautan internal, tab baru, panel tetap mounted, daftar kegiatan pada administrasi, pustaka sesi yang sama, mobile menu/keyboard/320px, perubahan cakupan batal/menerima, reset dan ID tidak dipakai ulang, status stale notification, sumber M04/ledger tetap terpisah. Uji kehilangan input dinamis saat filter/re-render; belum dijamin durable.


## MOD-14 / M09 Notifikasi & mode lapangan | 24 November 2026
- 20 unit tertulis `drafts/yandik-portal/tests/notifications.test.mjs`, 0 dijalankan. Browser tertunda: filter tanggal/wilayah/fasilitas, Januari lintas tahun, nol vs belum tercatat, sumber gagal, dedupe, dibaca/preferensi, koreksi versi, perubahan inventaris/pembinaan/dokumen, antrean offline tiruan, retry/ACK hilang/konflik, reset dan reload, 320px/keyboard. Tidak menguji offline browser/PWA atau server nyata.


## MOD-12 / M10 GIS sintetis | 24 November 2026
- 18 unit tertulis `drafts/yandik-portal/tests/gis.test.mjs`, 0 dijalankan. Browser tertunda: navigasi, SVG 320/375px, enam layer, filter tahun/wilayah, klik/tombol keyboard, pilihan keluar cakupan, perubahan inventaris/SDM/pembinaan, nol vs kosong, kegagalan provider, register wilayah tanpa sumber, reset; tanpa jaringan/peta nyata/koordinat sensitif. Audit GIS resmi dan otorisasi terpisah.


## MOD-11 / M08 Dashboard lintas modul | 24 November 2026
- 17 unit tertulis `drafts/yandik-portal/tests/leadership.test.mjs`, 0 dijalankan. Browser tertunda: impor; filter tahunan/wilayah/fasilitas; nol/kosong/SDM parsial; perubahan profil, inventaris dan reset; kegiatan/dokumen dan sumber stale; perubahan tahap M04; sumber pengawasan kosong/gagal; pemisahan cakupan; navigasi, keyboard dan 320px; tidak ada penyimpanan atau API.


## MOD-13 / M11 Pustaka digital | 24 November 2026
- 17 unit tertulis `drafts/yandik-portal/tests/library.test.mjs`, 0 dijalankan. Browser tertunda: navigasi katalog/ruang kerja; tautan 12 dokumen dan rute tugas; filter/pencarian/FAQ/favorit; sumber belum tersedia dan status tanpa klaim berlaku; usulan duplikat, revisi, telaah/kembalikan tanpa publikasi; reset dan reload; 320px/keyboard; tanpa AI atau unggah. Pemeriksaan substansi regulasi dan persetujuan pengelola terpisah.


## MOD-10 / M12 Paperless | 24 November 2026
- 14 unit tertulis `drafts/yandik-portal/tests/paperless.test.mjs`, 0 dijalankan. Browser tertunda: akses dari katalog; buat kegiatan dan hasil; buat empat draf tanpa input ulang identitas; nol kehadiran; isi metadata dan cegah duplikat; telaah/koreksi; perubahan sumber dan versi lama; arsip/buka revisi; pencarian cakupan; reset bersama; keyboard/320px; tidak ada jaringan atau file asli.


## MOD-09 / M15 Pembinaan dan Bimtek | 24 November 2026
- 16 unit tertulis pada `drafts/yandik-portal/tests/coaching.test.mjs`, 0 dijalankan. Browser tertunda: navigasi dua pintu; filter tahun/wilayah/fasilitas; validasi rencana; simpan hasil termasuk hadir nol; koreksi dan telaah; tindak lanjut/histori dan reset; responsif/keyboard serta pembatas DEMO. Belum ada pengujian backend.


**Berlaku mulai 11 November 2026 atas instruksi pemilik proyek.**

**JANGAN JALANKAN CL, CI, test runner, workflow_dispatch, GitHub Actions manual, Node test, unittest, Chromium/Playwright atau tes browser untuk perubahan YANDIK+ baru sampai pemilik proyek memberi izin eksplisit.** Tidak perlu meminta setup lokal atau VPS. Hanya tulis kode GitHub dan tandai status.

## Status
- **BELUM DIUJI:** kode/berkas baru telah dibuat, tetapi benar-salah dan fungsinya belum diketahui.
- **TERTUNDA UJI:** menunggu persetujuan pemilik proyek untuk sesi penyisiran bersama.
- **TERUJI SEBELUMNYA:** capaian terakhir yang sudah punya run SUCCESS; tidak berlaku otomatis untuk kode yang baru ditambahkan.
- **BUTUH KEPUTUSAN:** memerlukan review pemilik proses/kebijakan, tidak cukup dengan tes teknis.

## MOD-01 | Inventaris tahunan (16 QA tertulis, 0 dijalankan)
[QA](../drafts/yandik-portal/tests/inventory.test.mjs): katalog, minimum, null/0, validasi jumlah, stok kontekstual, carry-forward, scope, lock/koreksi dan rekap. 66 kasus unit portal kumulatif; 0 dijalankan. Browser dan telaah katalog tertunda sesuai [kontrak](M02_INVENTARIS_TAHUNAN_PUSKESWAN.md).

## K1/K2 | Profil/SDM konsolidasi (19 QA unit tertulis, 0 dijalankan)
- Editor kosong tidak menyalin fixture M02; isolasi fasilitas/tahun, draf/ajukan/koreksi/revisi/telaah, status snapshot sintetis, lima bagian, penolakan teks non-DEMO, akses wilayah dan telaah sebelum submit.
- Ledger/workflow APEL tetap; mutasi pada batas bulan mempertahankan histori, mengubah rekap sumber/tujuan untuk tahun yang terdampak, tahun sebelum mutasi tetap; penolakan penempatan tertutup, tanggal awal sama, tujuan sama; cakupan parsial tetap tidak diketahui.
- Kompetensi nonsertifikat, duplikasi, scope, konflik histori mutasi/kompetensi, reset.
- [19 deklarasi QA](../drafts/yandik-portal/tests/personnel.test.mjs); bersama 31 kasus [konsolidasi](../drafts/yandik-portal/tests/consolidated.test.mjs), total 50 kasus unit dirancang, 0 dijalankan.
- Browser setelah izin: editor lima bagian, perubahan filter, histori sebelum/sesudah, mutasi bulan efektif dan rekap Desember, catatan kompetensi, reset; perubahan profil/SDM ditahan jika isian laporan belum disimpan.

## Lanjutan K2/K3/K5/K6 | Aktivitas dan detail register (13 kasus tambahan, 0 dijalankan)
- Investigasi unik per pasangan event/lokasi; satu hewan ante+post dihitung satu; duplikasi, status ante/post kosong, ID bukan DEMO ditolak; aktivitas tersimpan melalui koreksi dan ledger tidak berubah.
- Antrean pembinaan hanya record workflow tahun/wilayah terpilih; tidak mengartikan ketiadaan record sebagai kepatuhan.
- Empat detail domain menggunakan validator baca-saja; ID di luar wilayah dan wilayah tanpa snapshot ditolak.
- QA browser tertunda: tambah/hapus baris, pilihan ID fiktif, input kotor menghalangi kirim, perubahan scope/reset, rendering detail async dan pengosongan saat filter berubah; tabel tahap/kebutuhan M04 tetap terpisah.
- [QA konsolidasi](../drafts/yandik-portal/tests/consolidated.test.mjs): 25 deklarasi dengan dua loop 4 domain, total **31 kasus dirancang, 0 dijalankan**. Angka 18 kasus pada entri sebelumnya adalah catatan historis.

## K1–K6 | Ruang kerja konsolidasi DEMO (18 kasus unit dirancang, 0 dijalankan)
- K1: join identitas, filter silang wilayah, null/0, SDM parsial, cakupan regional kosong.
- K2: transisi draf/kirim/koreksi/revisi/kirim ulang, validasi angka, transisi tidak sah, jejak, ledger tetap; draft counts terikat scope. QA browser tambahan: input belum disimpan menahan kirim, reset, navigasi.
- K3: tujuh tahap M04 independen dan tidak mengubah ledger M05; kebutuhan yang tidak layak tidak dipaksa lanjut.
- K5: 4 register domain, allowlist kolom, filter wilayah, surveilans tanpa sumber = null bukan nol, domain/wilayah invalid.
- K6: agregat M05 saja; tautan dan batas pustaka/GIS/PWA; keyboard/responsivitas dan console.
- [File QA](../drafts/yandik-portal/tests/consolidated.test.mjs) berisi 15 deklarasi test dengan loop empat domain (18 kasus). [Checklist visual](CODEX_PREVIEW_YANDIK.md). Tidak dijalankan, izin preview terdahulu tidak diwariskan.
 
## K0 | Katalog Portal YANDIK+ (7 kelompok QA tertulis, 0 dijalankan)

[Checklist QA portal](../drafts/yandik-portal/README.md#qa-tertunda): muat lokal, 15 ID/status unik, tautan halaman, anchor dan keyboard, responsivitas/kontras, tidak ada koneksi/penyimpanan eksternal, serta regresi halaman lama. Pemetaan path dicek statis terhadap tree snapshot; **bukan bukti browser PASS**. Pengujian beranda yang dilaporkan di bawah tetap terbatas pada versi sebelumnya dan bukan pengujian portal baru.

## Ruang Kerja Puskeswan | Uji demo lokal

Izin pengguna pada 24 November 2026 mencakup membuka dan menguji alur utama [ruang kerja DEMO](../drafts/yandik-workspace/) di workspace lokal.

| Pemeriksaan | Hasil |
|---|---|
| Beranda 2026 memuat tiga fasilitas, 12 bulan, 16 laporan dan tiga laporan nol | Lulus di Chromium |
| Filter fasilitas/wilayah menghapus pilihan yang tidak cocok, dan reset memulihkan cakupan awal | Lulus di Chromium |
| Cakupan 2030 menampilkan data layanan dan SDM yang belum tersedia serta keadaan kosong pembinaan | Lulus di Chromium |
| Navigasi ke Pembinaan memperbarui lokasi, tanpa overflow halaman pada lebar 320 dan 375 piksel | Lulus di Chromium |
| Dashboard APEL, Simulasi Profil, dan Simulasi Dukungan terbuka; satu langkah Dukungan memperbarui data simulasi dalam memori | Lulus di Chromium |
| Uji aksesibilitas menyeluruh, regresi semua modul, dan uji dengan pengguna | Belum dijalankan |

## Antrean M00-G9 | Metadata Intake Flask DEMO (41 QA tertulis, 0 dijalankan)

| ID | Kelompok verifikasi tertunda | Status |
|---|---|---|
| QA-M00G9-01 | Schema DEMO, volume, klaim origin/izin/scan source yang tidak resmi ditolak | BELUM DIUJI |
| QA-M00G9-02 | Deklarasi file Python, dependensi, entrypoint, size dan checksum klaim sesuai bentuk | BELUM DIUJI |
| QA-M00G9-03 | Traversal, path absolut/Windows, non-ASCII, dotfile, ekstensi biner dan symlink ditolak | BELUM DIUJI |
| QA-M00G9-04 | Pola nama secrets/backup/private dan field ekstra ditolak, tanpa klaim pemindaian isi | BELUM DIUJI |
| QA-M00G9-05 | Nama file duplikat, jumlah berlebih, hash rusak, ukuran boolean/terlalu besar ditolak | BELUM DIUJI |
| QA-M00G9-06 | Rute `/demo` unik per method/path/ID, modul terdaftar, status akses hanya unverified | BELUM DIUJI |
| QA-M00G9-07 | Tipe method/status tidak sah, ID/klaim authorization palsu, route non-DEMO ditolak | BELUM DIUJI |
| QA-M00G9-08 | Entry/dependency tidak dideklarasikan dilaporkan sebagai blocker, bukan status approved | BELUM DIUJI |
| QA-M00G9-09 | Respons tidak memaparkan nama file dan tidak menyediakan data pribadi | BELUM DIUJI |
| QA-M00G9-10 | Semua may_connect/execute/write/publish/deploy/ready flags false | BELUM DIUJI |
| QA-M00G9-11 | Pengujian kode terhadap manifest tidak melakukan I/O atau memindai file aktual | TERTUNDA UJI |
| QA-M00G9-12 | Keabsahan izin source, validitas hash isi, klasifikasi data, audit Flask nyata dan persetujuan keamanan | BUTUH KEPUTUSAN |

**41 deklarasi QA tertulis di** [`test_preflight.py`](../drafts/m00-flask-intake-preflight/tests/test_preflight.py), **tidak dijalankan**. QA pengujian sesungguhnya tetap menunggu izin owner. Semua klaim metadata sumber tetap **belum terverifikasi**.

## Antrean M00-G8 | Paritas format audit JavaScript ↔ Python (37 QA tertulis, 0 dijalankan)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M00G8-01 | Identitas schema, domain kanonik, urutan tetap JSON-array, ASCII-only dan integer revisi | BELUM DIUJI |
| QA-M00G8-02 | Fixture G5/G7 dengan isi semantik sama menghasilkan digest bridge format setara | BELUM DIUJI |
| QA-M00G8-03 | Hash historis G5/G7 yang berbeda **tidak** diperlakukan sebagai hash kanonik dan **tidak** dinyatakan terverifikasi | BELUM DIUJI |
| QA-M00G8-04 | Perubahan action/reason/basis membatalkan kesesuaian format | BELUM DIUJI |
| QA-M00G8-05 | Role tambahan, metadata personal, ID bukan DEMO dan field tidak dikenal ditolak | BELUM DIUJI |
| QA-M00G8-06 | Klaim official authorization atau is_official=1 ditolak | BELUM DIUJI |
| QA-M00G8-07 | Log G5 multi-link dan urutan/revisi melompat ditolak agar tidak salah menyamakan urutan global/per-link | BELUM DIUJI |
| QA-M00G8-08 | Respons bridge tidak menampilkan ID reviewer dan melarang write/sync/approve/deploy | BELUM DIUJI |
| QA-M00G8-09 | Node ↔ Python menghasilkan SHA-256 kanonik sama pada fixture dan beberapa event berurutan | BELUM DIUJI |
| QA-M00G8-10 | Integritas hash asli, integritas DB, autentikasi server, izin sumber, transport dan perizinan migrasi | TERTUNDA UJI |
| QA-M00G8-11 | Audit source Flask sanitisasi berizin dan review kontrak multi-modul | BUTUH KEPUTUSAN |

**18 deklarasi QA JavaScript + 19 Python**, **0 dijalankan**. Termasuk skrip lintas runtime dalam kode, tetapi tidak dieksekusi. Format sama **bukan** autentikasi jurnal atau persetujuan integrasi.

## Antrean M00-G6 & M00-G7 | Flask draft dan audit SQLite (50 QA tertulis, 0 dijalankan)

### M00-G6 | Factory Flask read-only DEMO
| Kelompok | Verifikasi yang tertunda | Status |
|---|---|---|
| QA-M00G6-01 | Source manifest dan event benar-benar fiktif, status dugaan tidak terkonfirmasi | BELUM DIUJI |
| QA-M00G6-02 | Peran/ID klien tidak dapat diambil dari query/body/headers | BELUM DIUJI |
| QA-M00G6-03 | Sesi nonaktif/role tidak sah/kab-kota luar wilayah gagal tertutup | BELUM DIUJI |
| QA-M00G6-04 | Event setelah periode capture, duplikat, ID non-DEMO dan field PII ditolak | BELUM DIUJI |
| QA-M00G6-05 | Output hanya allowlist, tidak memuat lokasi atau identitas actor | BELUM DIUJI |
| QA-M00G6-06 | Blueprint tidak terdaftar; flag default false menghasilkan 404 | BELUM DIUJI |
| QA-M00G6-07 | GET list/detail, POST ditolak, query tambahan ditolak, no-store | BELUM DIUJI |
| QA-M00G6-08 | Flask versi legacy, session trust, auth request, rate-limit, proxy config | TERTUNDA UJI |
| QA-M00G6-09 | Persetujuan sumber, klasifikasi data, izin operasional | BUTUH KEPUTUSAN |

### M00-G7 | Penulis SQLite in-memory DEMO
| Kelompok | Verifikasi yang tertunda | Status |
|---|---|---|
| QA-M00G7-01 | Penolakan koneksi file atau attached DB dan foreign keys OFF | BELUM DIUJI |
| QA-M00G7-02 | Pembuatan skema :memory: tanpa file DB | BELUM DIUJI |
| QA-M00G7-03 | BEGIN IMMEDIATE, cek revisi/head, tulis stream dan audit serta COMMIT | BELUM DIUJI |
| QA-M00G7-04 | Konflik menimbulkan rollback lengkap tanpa catatan ganda | BELUM DIUJI |
| QA-M00G7-05 | Idempotency request yang sama dan konflik konten berbeda | BELUM DIUJI |
| QA-M00G7-06 | Penolakan role tidak sah, non-DEMO ID dan status official palsu | BELUM DIUJI |
| QA-M00G7-07 | Chain digest dapat diperiksa dan pembacaan ringkas tanpa ID reviewer | BELUM DIUJI |
| QA-M00G7-08 | Trigger UPDATE/DELETE audit/command menolak mutasi | BELUM DIUJI |
| QA-M00G7-09 | Dua penulis, crash, pemulihan, migrasi skema dan transaksi DB sungguhan | TERTUNDA UJI |
| QA-M00G7-10 | Perizinan/keaslian sumber, akun server, retensi dan audit eksternal | BUTUH KEPUTUSAN |

**25 deklarasi QA G6 + 25 deklarasi QA G7. Tidak ada pengujian yang dijalankan.** Tabel ini daftar risiko, bukan hasil PASS.

## Antrean M00-G4 & M00-G5 | Kode P0 (46 QA tertulis, 0 dijalankan)

### M00-G4 | Kesiapan izin sumber dan identitas server
| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M00G4-01 | 7 tema otorisasi sumber, tujuan, klasifikasi, transport, retensi, sesi dan insiden hanya fixture DEMO | BELUM DIUJI |
| QA-M00G4-02 | DRAFTED_UNVERIFIED_DEMO tidak boleh berubah menjadi izin nyata | BELUM DIUJI |
| QA-M00G4-03 | Status APPROVED, sumber URL, nomor izin, nama pemilik/PII tidak diterima | BELUM DIUJI |
| QA-M00G4-04 | Duplikasi/missing checklist, field ekstra dan region/source/domain mismatch ditolak | BELUM DIUJI |
| QA-M00G4-05 | Role kab/kota, Puskeswan, pimpinan, tanpa sesi ditolak untuk dossier | BELUM DIUJI |
| QA-M00G4-06 | Sesi backend, CSRF, revokasi, scope per objek, field allowlist tetap belum diwujudkan | BELUM DIUJI |
| QA-M00G4-07 | Tata kelola sumber resmi dan penetapan izin oleh pemilik data | BUTUH KEPUTUSAN |
| QA-M00G4-08 | Bukti autentikasi backend Flask, negative authorization, privilege escalation | TERTUNDA UJI |

### M00-G5 | Rancangan audit transaksi
| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M00G5-01 | Review M13-S3 dan audit event berpasangan, urut, tanpa mengubah input asal | BELUM DIUJI |
| QA-M00G5-02 | Revision optimistis review/audit tidak boleh konflik atau berpisah panjangnya | BELUM DIUJI |
| QA-M00G5-03 | Perubahan alasan, actor, source digest, previous digest, event digest ditolak | BELUM DIUJI |
| QA-M00G5-04 | Ketika source berubah, catatan stale tidak bisa dipakai tanpa tinjauan ulang | BELUM DIUJI |
| QA-M00G5-05 | Output audit ringkas tidak membuka nama/ID actor | BELUM DIUJI |
| QA-M00G5-06 | Tidak ada izin menulis DB, mengesahkan, menerbitkan, mempublikasikan atau deploy | BELUM DIUJI |
| QA-M00G5-07 | SQL belum dijalankan: review skema, foreign key, trigger, index dan race conditions | TERTUNDA UJI |
| QA-M00G5-08 | Transaction BEGIN IMMEDIATE, optimistic row check, atomic review+event insert, rollback bila gagal | TERTUNDA UJI |
| QA-M00G5-09 | Keamanan storage/backup, role DB, audit admin, retensi dan bencana | BUTUH KEPUTUSAN |
| QA-M00G5-10 | Digest berantai tanpa signature/MAC tidak dianggap anti-tamper atau sumber autentik | BELUM DIUJI |

**22 QA G4 dan 24 QA G5 telah ditulis sebagai kode, 0 dieksekusi.** Tabel pengelompokan risiko, bukan bukti keberhasilan.

## Antrean M13-S3 | Review manusia atas kandidat APEL ↔ surveilans (28 QA tertulis, 0 dijalankan)

| ID | Kelompok verifikasi tertunda | Status |
|---|---|---|
| QA-M13S3-01 | Usulan kandidat hanya berasal dari M13-S2 yang tervalidasi DEMO | BELUM DIUJI |
| QA-M13S3-02 | Pengusul dan penelaah berbeda; hanya verifikator provinsi DEMO boleh menulis catatan in-memory | BELUM DIUJI |
| QA-M13S3-03 | Sesi penelaah palsu, kab/kota, pimpinan, tanpa sesi tidak diberi hak review | BELUM DIUJI |
| QA-M13S3-04 | Alasan dan aksi hanya kode enumerasi; teks bebas/field tambahan ditolak | BELUM DIUJI |
| QA-M13S3-05 | Nilai perlu bukti/kemungkinan terkait/kemungkinan berbeda tetap tanpa persetujuan resmi | BELUM DIUJI |
| QA-M13S3-06 | Reopen tidak dapat dilakukan sebelum catatan awal | BELUM DIUJI |
| QA-M13S3-07 | Konflik revision dan urutan catatan atau duplikasi ID ditolak | BELUM DIUJI |
| QA-M13S3-08 | SHA-256 berubah bila versi manifest/sumber/record APEL berubah, catatan stale ditolak | BELUM DIUJI |
| QA-M13S3-09 | Pembatasan volume log, pengusul tak dikenal dan ketidaksesuaian pasangan ditolak | BELUM DIUJI |
| QA-M13S3-10 | Pembacaan board tidak membocorkan identitas aktor/PII; seluruh status official tetap null/false | BELUM DIUJI |
| QA-M13S3-11 | In-memory append tidak memodifikasi ledger APEL, data kejadian, atau keluaran resmi | BELUM DIUJI |
| QA-M13S3-12 | Otorisasi server asli, audit yang tidak dapat diedit dan bukti keaslian sumber | TERTUNDA UJI |
| QA-M13S3-13 | Definisi hukum/proses yang menetapkan kewenangan penelaah dan keputusan atas catatan | BUTUH KEPUTUSAN |
| QA-M13S3-14 | Uji end-to-end link/validasi bukti, manajemen konflik antarwilayah dan historis | TERTUNDA UJI |

**28 deklarasi QA ditulis pada** [\`review.test.mjs\`](../drafts/m13-crosswalk-review/tests/review.test.mjs), **tidak satu pun dijalankan**. Tabel adalah pengelompokan risiko, bukan hasil PASS.

## Antrean M00-G3 dan M13-S2 | Kode DEMO (43 skenario QA tertulis, 0 dijalankan)

### M00-G3 | Kontrak gateway baca-saja
| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M00G3-01 | GET hanya LIST_EVENTS / REVIEW_EVENT, request memiliki tiga kunci tepat | BELUM DIUJI |
| QA-M00G3-02 | POST, query role/region/source, operasi lain, host field ekstra ditolak | BELUM DIUJI |
| QA-M00G3-03 | Resolver sesi, wilayah dan sumber berasal dari host; klaim host **belum** dibuktikan autentik | BELUM DIUJI |
| QA-M00G3-04 | Recheck M00-G1/G2/M13-S1 pada tiap pembacaan | BELUM DIUJI |
| QA-M00G3-05 | Role Puskeswan/pimpinan/kab-kota luar wilayah ditolak | BELUM DIUJI |
| QA-M00G3-06 | Respons terbatas: tanpa lokasi rinci, source ID, nama aktor dan PII | BELUM DIUJI |
| QA-M00G3-07 | ID tidak ada gagal tertutup, status penyakit tetap tidak resmi | BELUM DIUJI |
| QA-M00G3-08 | Semua may_write/import/export/publish/notify/deploy false, tidak ada HTTP API | BELUM DIUJI |
| QA-M00G3-09 | Audit keamanan backend Flask asli, CSRF, autentikasi sesi, tenant isolation dan test route | TERTUNDA UJI |
| QA-M00G3-10 | Persetujuan organisasi untuk role/otorisasi dan sumber data | BUTUH KEPUTUSAN |

### M13-S2 | Candidate crosswalk investigasi APEL / surveilans
| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M13S2-01 | Crosswalk eksplisit memeriksa event, lokasi, period, facility, region dan manifest | BELUM DIUJI |
| QA-M13S2-02 | M13-S1 dan M05-14/M05-0 masing-masing memvalidasi source sendiri | BELUM DIUJI |
| QA-M13S2-03 | Kunci tidak sesuai sumber, wilayah berbeda, duplikat, tahun beda ditolak | BELUM DIUJI |
| QA-M13S2-04 | Link kandidat tidak dianggap kejadian sama atau kasus/layanan sah | BELUM DIUJI |
| QA-M13S2-05 | Tanpa kandidat bukan nol kasus resmi, total resmi tetap null | BELUM DIUJI |
| QA-M13S2-06 | Tidak mengubah ledger APEL, data surveilans, atau ketentuan satu investigasi/lokasi | BELUM DIUJI |
| QA-M13S2-07 | Penolakan sumber non-DEMO, source_verified palsu, metadata tidak sah | BELUM DIUJI |
| QA-M13S2-08 | Peran wilayah lain tidak dapat membaca tautan kejadian | BELUM DIUJI |
| QA-M13S2-09 | Flag sync, write, score, confirm, notify, publish, deploy tetap false | BELUM DIUJI |
| QA-M13S2-10 | Definisi kasus, lokasi, ID master dan izin integrasi iSIKHNAS/APEL | BUTUH KEPUTUSAN |
| QA-M13S2-11 | Pengujian sumber riil, audit historis dan regresi dua modul (hanya dengan izin) | TERTUNDA UJI |

**19 QA M00-G3 + 24 QA M13-S2 tertulis**, **0 dijalankan**. Tabel mengelompokkan risiko, bukan hasil lulus/teruji.

## Antrean M00-G2 & M13-S1 | KODE DEMO (52 QA tertulis, 0 dijalankan)

### M00-G2 | Provenance sumber dan batas akses
| ID | Pemeriksaan yang harus dilakukan | Status |
|---|---|---|
| QA-M00G2-01 | Format source_id/snapshot_id DEMO dan referensi eksplisit ke domain/region | BELUM DIUJI |
| QA-M00G2-02 | Versi positif, periode 2026–2030 dan batas ukuran/kolom manifest | BELUM DIUJI |
| QA-M00G2-03 | Sumber non-DEMO, URL, field ekstra, sumber terverifikasi palsu ditolak | BELUM DIUJI |
| QA-M00G2-04 | Ketidaksesuaian wilayah dan domain gagal tertutup | BELUM DIUJI |
| QA-M00G2-05 | Sesi kab-kota lintas wilayah, pimpinan, Puskeswan, akun nonaktif ditolak | BELUM DIUJI |
| QA-M00G2-06 | Status freshness, izin integrasi, identitas prod dan API nyata tetap false | BELUM DIUJI |
| QA-M00G2-07 | Regresi daftar modul M00-G1 dengan SURVEILLANCE | BELUM DIUJI |
| QA-M00G2-08 | Backend Flask, trust callback, CSRF, RBAC/ABAC, file audit, metadata database | TERTUNDA UJI |
| QA-M00G2-09 | Hak akses sumber resmi dan tata kelola data, termasuk iSIKHNAS | BUTUH KEPUTUSAN |

### M13-S1 | Kejadian kesehatan hewan/surveilans
| ID | Pemeriksaan yang harus dilakukan | Status |
|---|---|---|
| QA-M13S1-01 | Tiga kejadian fiktif, lokasi ID DEMO, tanpa koordinat atau PII | BELUM DIUJI |
| QA-M13S1-02 | Dugaan/observasi tidak menjadi kasus resmi terkonfirmasi | BELUM DIUJI |
| QA-M13S1-03 | Catatan hasil lab tidak menjadi hasil lab autentik atau bukti diagnosis | BELUM DIUJI |
| QA-M13S1-04 | ID event unik, status valid, hubungan snapshot sumber konsisten | BELUM DIUJI |
| QA-M13S1-05 | Tahun/periode event tidak dapat melewati capture_month sumber | BELUM DIUJI |
| QA-M13S1-06 | Event non-DEMO atau kasus/hasil lab resmi palsu ditolak | BELUM DIUJI |
| QA-M13S1-07 | Puskeswan/pimpinan/kab-kota asing tidak melihat detail | BELUM DIUJI |
| QA-M13S1-08 | Temuan lapangan/bukti count tidak memunculkan notifikasi/respons otomatis | BELUM DIUJI |
| QA-M13S1-09 | iSIKHNAS dan APEL tidak disimpulkan tersinkron atau sudah dideduplikasi | BELUM DIUJI |
| QA-M13S1-10 | Flag write/confirm/approve/notify/publish/deploy seluruhnya false | BELUM DIUJI |
| QA-M13S1-11 | Definisi kasus menurut hukum, SOP surveilans, perlindungan lokasi, akses lab | BUTUH KEPUTUSAN |
| QA-M13S1-12 | Uji keamanan API nyata, rekonsiliasi iSIKHNAS/APEL dan UI petugas | TERTUNDA UJI |

**24 skenario M00-G2 dan 28 skenario M13-S1 tertulis, 0 dieksekusi.** Tabel merupakan kelompok risiko, bukan bukti QA lulus.

## Antrean M07-S1 & M14-S1 | KODE DEMO (47 QA tertulis, 0 dijalankan)

### M07-S1 | Pengawasan Klinik & Praktik Dokter Hewan

| ID | Verifikasi yang masih diperlukan | Status |
|---|---|---|
| QA-M07S1-01 | Skema, 3 fasilitas fiktif, 2 catatan observasi, tanpa nama dokter/alamat/nomor izin asli | BELUM DIUJI |
| QA-M07S1-02 | Jenis klinik/praktik, wilayah dan sumber DEMO valid; duplikasi ID dan input tambahan ditolak | BELUM DIUJI |
| QA-M07S1-03 | Scope regional: pengguna kab/kota tidak melihat fasilitas wilayah lain | BELUM DIUJI |
| QA-M07S1-04 | Provinsi baca-saja; Puskeswan/pimpinan ditolak dari rincian pengawasan | BELUM DIUJI |
| QA-M07S1-05 | Catatan kunjungan tidak boleh mengacu fasilitas tidak dikenal atau periode setelah 2030 | BELUM DIUJI |
| QA-M07S1-06 | Checklist 5 kategori lengkap dan unik, status DEMO sah, bukti hanya jumlah rujukan | BELUM DIUJI |
| QA-M07S1-07 | Kunjungan tidak tersedia = `null`, bukan klaim tidak pernah diperiksa | BELUM DIUJI |
| QA-M07S1-08 | Paket tindak lanjut hanya untuk telaah; tidak memiliki nomor surat, PIC/tenggat atau sanksi | BELUM DIUJI |
| QA-M07S1-09 | Kode tidak dapat mengesahkan SIP/izin praktik, verifikasi legalitas atau publikasi | BELUM DIUJI |
| QA-M07S1-10 | Definisi jenis sarana, kewenangan pemeriksa, checklist dan SOP yang berlaku | BUTUH KEPUTUSAN |
| QA-M07S1-11 | Integrasi API/DB otentik, bukti privat, UX HP dan audit peran negatif | TERTUNDA UJI |

### M14-S1 | Register Permohonan Sertifikat & Lalu Lintas

| ID | Verifikasi yang masih diperlukan | Status |
|---|---|---|
| QA-M14S1-01 | 3 permohonan berlabel DEMO dan komoditas asal/tujuan rekaan | BELUM DIUJI |
| QA-M14S1-02 | Tipe komoditas, versi persyaratan, sumber, periode valid 2026–2030 dan ID unik | BELUM DIUJI |
| QA-M14S1-03 | Filter akses memakai wilayah asal; tujuan tidak menambah hak baca | BELUM DIUJI |
| QA-M14S1-04 | Puskeswan, pimpinan dan kab/kota lain ditolak dari rincian | BELUM DIUJI |
| QA-M14S1-05 | Data nama pemohon, nomor surat nyata, tanggal terbit dan sumber asli ditolak | BELUM DIUJI |
| QA-M14S1-06 | Persyaratan fiktif 4 kategori lengkap, status `PRESENT_UNVERIFIED_DEMO` bukan sah | BELUM DIUJI |
| QA-M14S1-07 | Referensi, nomor sertifikat dan `issued_at` tetap `null` | BELUM DIUJI |
| QA-M14S1-08 | Tidak ada e-signature, QR, penerbitan, verifikasi publik atau pengiriman resmi | BELUM DIUJI |
| QA-M14S1-09 | Semua flag `may_issue`, `may_sign`, `may_approve`, `may_publish`, `may_write` = `false` | BELUM DIUJI |
| QA-M14S1-10 | Matriks kewenangan hukum, jenis sertifikat, instansi penerbit, lampiran, retensi/arsip | BUTUH KEPUTUSAN |
| QA-M14S1-11 | Otorisasi API sebenarnya, bukti data pribadi, koneksi penerbit resmi dan audit | TERTUNDA UJI |

**22 skenario M07-S1 dan 25 skenario M14-S1 telah ditulis**, tetapi **0 dieksekusi**. Daftar di atas mengelompokkan risiko, bukan menyatakan 22/25 pengujian telah lulus.

## Antrean M00-G1 & M06-S1 | Kode pengawasan DEMO (43 QA tertulis, 0 dijalankan)

### M00-G1 | Batas akses modul dan wilayah

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M00G1-01 | Role provinsi dapat membaca DEMO, tanpa kemampuan menulis/menyetujui/menerbitkan | BELUM DIUJI |
| QA-M00G1-02 | Koordinator kab/kota hanya wilayah yang sama; beda wilayah ditolak | BELUM DIUJI |
| QA-M00G1-03 | Puskeswan, pimpinan, pengguna tanpa sesi dan sesi nonaktif ditolak untuk detail | BELUM DIUJI |
| QA-M00G1-04 | Hanya modul DEMO terdaftar, region valid dan rincian yang diizinkan | BELUM DIUJI |
| QA-M00G1-05 | Daftar dengan item luar wilayah, non-DEMO dan volume berlebihan ditolak | BELUM DIUJI |
| QA-M00G1-06 | Adapter callback tidak boleh bersumber dari browser, query atau body | BUTUH KEPUTUSAN |
| QA-M00G1-07 | Uji identitas backend asli, CSRF, scope tiap API, audit autentikasi dan data leakage | TERTUNDA UJI |

### M06-S1 | Pengawasan sarana obat hewan

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M06S1-01 | 3 sarana fiktif dengan wilayah; 2 inspeksi DEMO dan tidak ada data personal | BELUM DIUJI |
| QA-M06S1-02 | ID/sumber/jenis sarana duplikat dan tidak valid ditolak | BELUM DIUJI |
| QA-M06S1-03 | Kunjungan dari site tak dikenal, tahun di luar 2026–2030 atau duplikat per bulan ditolak | BELUM DIUJI |
| QA-M06S1-04 | 4 domain checklist harus lengkap dan tidak duplikat | BELUM DIUJI |
| QA-M06S1-05 | Referensi bukti tidak boleh menjadi URL/file atau dokumen nyata | BELUM DIUJI |
| QA-M06S1-06 | Wilayah terisolasi, pimpinan/petugas Puskeswan tidak membaca detail | BELUM DIUJI |
| QA-M06S1-07 | Tidak ada kunjungan DEMO = null, bukan klaim tidak pernah diperiksa | BELUM DIUJI |
| QA-M06S1-08 | Observasi perlu klarifikasi tetap review-only; tidak ada skor/izin/sanksi | BELUM DIUJI |
| QA-M06S1-09 | Pencatatan dan output harus immutable terhadap sumber, tanpa aksi jaringan | BELUM DIUJI |
| QA-M06S1-10 | Validasi SOP/kewenangan sarana dan standar checklist yang berlaku | BUTUH KEPUTUSAN |
| QA-M06S1-11 | Tes akses/inspeksi HP, data resmi, bukti, API dan audit penugasan | TERTUNDA UJI |

**Katalog unit:** [M00-G1](M00_G1_SCOPED_OVERSIGHT_READ.md) berisi 19 QA tertulis, [M06-S1](M06_S1_REGISTER_OBAT_HEWAN_DEMO_2026_2030.md) berisi 24 QA tertulis. Tabel ini mengelompokkan risiko, bukan total jumlah test runner yang dieksekusi.

## Antrean M05-16 & M05-17 | QA CODE_ONLY (48 skenario tertulis, 0 dijalankan)

### M05-16 | Pelaporan/koreksi baca-saja
| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M0516-01 | Read-only \`readDemoWorkflow\`, filter wilayah/fasilitas dan pembatasan sesi/fasilitas DEMO | BELUM DIUJI |
| QA-M0516-02 | Revisi berurutan, transisi draf → submit → correction → revise → resubmit | BELUM DIUJI |
| QA-M0516-03 | Riwayat lama tidak ditimpa, request ID tidak bocor pada output | BELUM DIUJI |
| QA-M0516-04 | Identitas petugas, alasan koreksi teks bebas, dan payload laporan tidak muncul | BELUM DIUJI |
| QA-M0516-05 | Belum mulai ≠ 0, menunggu telaah ≠ terverifikasi, draf ≠ terkirim | BELUM DIUJI |
| QA-M0516-06 | Tahun 2026–2030, filter keliru, perubahan wilayah, status tidak sah ditolak | BELUM DIUJI |
| QA-M0516-07 | Ledger M05-0 dan workflow M05-1 terpisah; tidak ada klaim sinkron atau total resmi | BELUM DIUJI |
| QA-M0516-08 | Semua kemampuan publikasi/write/score/deploy tetap false | BELUM DIUJI |
| QA-M0516-09 | Regresi akses peran dan histori sumber M05-1/M05-15/M05-14 | TERTUNDA UJI |
| QA-M0516-10 | Persetujuan sumber, Juknis, kebijakan tahun, DB, timestamp server, QA UI | BUTUH KEPUTUSAN |

### M05-17 | Usulan perhatian pembinaan
| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M0517-01 | Input hanya konteks M05-16 sintetis tidak terotorisasi dan belum diverifikasi | BELUM DIUJI |
| QA-M0517-02 | Usulan menurut status laporan (draf, kirim, koreksi) | BELUM DIUJI |
| QA-M0517-03 | Profil draf/kosong dan SDM parsial tidak menjadi vonis mutu/kepegawaian | BELUM DIUJI |
| QA-M0517-04 | Tidak ada \`assigned_to\`, tenggat, dokumen, penutupan otomatis | BELUM DIUJI |
| QA-M0517-05 | Jumlah usulan hanya indikatif; tidak dibaca sebagai kasus resmi/penilaian/urutan prioritas | BELUM DIUJI |
| QA-M0517-06 | Anti-duplikasi fasilitas-bulan, penolakan input manipulatif dan tahun di luar cakupan | BELUM DIUJI |
| QA-M0517-07 | Tidak ada PII, teks laporan mentah, aktivitas jaringan atau mutasi data | BELUM DIUJI |
| QA-M0517-08 | Semua kemampuan notifikasi, penugasan, ranking, alokasi, approval dan deployment false | BELUM DIUJI |
| QA-M0517-09 | Browser HP/keyboard/aksesibilitas dan regresi modul sumber jika UI dibuat | TERTUNDA UJI |
| QA-M0517-10 | Proses pembinaan asli, kewenangan, tata naskah, perlindungan data dan arsip | BUTUH KEPUTUSAN |

**24 skenario M05-16 + 24 skenario M05-17 tertulis** pada \`drafts/\`. Tabel di atas mengelompokkan risiko, tidak menggantikan pengujian dan tidak membuktikan kedua modul berhasil. Tidak boleh menjalankan CL/CI/test sampai ada izin.

## Antrean M05-15: Profil Puskeswan + SDM DEMO terhubung APEL (29 QA tertulis, 0 dijalankan)

| ID | Yang nanti harus diperiksa | Status |
|---|---|---|
| QA-M0515-01 | Schema dan label fixture sintetis 3 fasilitas, tahun valid 2026–2030 | BELUM DIUJI |
| QA-M0515-02 | Snapshot profil satu ID fasilitas-tahun; duplikat ditolak | BELUM DIUJI |
| QA-M0515-03 | Penempatan tenaga beririsan ditolak; mutasi pada batas interval tidak dobel | BELUM DIUJI |
| QA-M0515-04 | ID fasilitas, staf, wilayah dan sumber non-DEMO ditolak | BELUM DIUJI |
| QA-M0515-05 | Cakupan SDM parsial/tidak ada tetap null, bukan nol | BELUM DIUJI |
| QA-M0515-06 | Snapshot cakupan lengkap dengan tenaga 0 boleh tampil nol DEMO | BELUM DIUJI |
| QA-M0515-07 | Snapshot 2026 tidak diwariskan diam-diam ke 2028–2030 | BELUM DIUJI |
| QA-M0515-08 | Filter tahun, wilayah, fasilitas dan kombinasi bertentangan ditolak | BELUM DIUJI |
| QA-M0515-09 | Join M05-14 ↔ M05-15 tepat ID, wilayah dan label; beda registry ditolak | BELUM DIUJI |
| QA-M0515-10 | Penggabungan tidak mengubah ledger atau agregasi pelayanan M05-0 | BELUM DIUJI |
| QA-M0515-11 | Semua flag publish, write, connect, score, rank, deploy tetap false | BELUM DIUJI |
| QA-M0515-12 | Tidak ada data pribadi, endpoint, kontak atau keputusan kepegawaian | BELUM DIUJI |
| QA-M0515-13 | Uji regresi M05-0..M05-14 dan uji statis/sintaks setelah izin | TERTUNDA UJI |
| QA-M0515-14 | Pemilik sumber, histori wilayah, akses staf, versi dan retensi data resmi | BUTUH KEPUTUSAN |
| QA-M0515-15 | Pengujian API otorisasi lintas kabupaten/kota, mutasi dan audit server | TERTUNDA UJI |
| QA-M0515-16 | UX petugas/verifikator, layar kecil, keyboard dan aksesibilitas | TERTUNDA UJI |

**Sumber:** [M05-15](M05_15_PROFIL_SDM_LINK_2026_2030.md), [kode](../drafts/m05-profile-sdm/), [29 unit tests tertulis](../drafts/m05-profile-sdm/tests/profile_sdm.test.mjs). Tidak ada tes yang dieksekusi; daftar tabel adalah *kelompok risiko*, bukan jumlah test otomatis.

## Antrean M03-S4: laboratorium fairness

| ID | Yang nanti perlu diperiksa | Status |
|---|---|---|
| QA-S4-01 | Review sintaks JS, imports dan file static demo | BELUM DIUJI |
| QA-S4-02 | Semua bobot integer total 100, kontribusi 0–3 tidak melebihi bobot | BELUM DIUJI |
| QA-S4-03 | Nilai kosong ≠ nol, kasus tidak lengkap tidak masuk peringkat | BELUM DIUJI |
| QA-S4-04 | Volume pelayanan fiktif tidak berubah menjadi poin atau tie-breaker | BELUM DIUJI |
| QA-S4-05 | Kasus faktor identik seri, tanpa tiebreak penerima bantuan | BELUM DIUJI |
| QA-S4-06 | Perubahan bobot ditandai sebagai sensitivitas, bukan pengesahan prioritas | BELUM DIUJI |
| QA-S4-07 | Invalid ID/faktor/bukti dan field pendanaan ditolak, input ditampilkan aman | BELUM DIUJI |
| QA-S4-08 | Browser HP, keyboard, screen reader, kontras, overflow, error | BELUM DIUJI |
| QA-S4-09 | Penyisiran dengan kondisi riil Puskeswan, wilayah dan SOP resmi | BUTUH KEPUTUSAN |
| QA-S4-10 | Integrasi ke modul aktif, role server/DB dan regression suite | TERTUNDA UJI |

## Antrean M03-S4B: telaah metodologi DEMO (semuanya BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-S4B-01 | Struktur kode, relative import dan form HTML tanpa menjalankan CL/CI | BELUM DIUJI |
| QA-S4B-02 | Kontrak draf, pengajuan, review, pengembalian dan revisi mempertahankan histori | BELUM DIUJI |
| QA-S4B-03 | Koreksi/alasan 30–700 karakter, peran/ID DEMO dan referensi harus valid | BELUM DIUJI |
| QA-S4B-04 | Skor baseline dan alternatif, data kosong, skor seri, perubahan peringkat sesuai sumber | BELUM DIUJI |
| QA-S4B-05 | Cegah keputusan anggaran, persetujuan bobot, BAST atau penerima dari form/output | BELUM DIUJI |
| QA-S4B-06 | Pemeriksaan tampilan HP, keyboard, screen reader, pesan error dan hilangnya data saat reload | BELUM DIUJI |
| QA-S4B-07 | Review kebijakan/otorisasi riil dan sumber data terverifikasi sebelum integrasi | BUTUH KEPUTUSAN |
| QA-S4B-08 | Keamanan backend, transaksi DB dan audit independen ketika ada sistem riil | TERTUNDA UJI |

Dokumen: [M03-S4B metodologi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4B_REVIEW_POLICY.md). Belum pernah diuji pada sesi coding ini.

## Antrean M03-S4C: draf bahan berita acara (SEMUA BELUM DIUJI)

| ID | Pemeriksaan kelak | Status |
|---|---|---|
| QA-S4C-01 | Impor `draft_minutes.mjs` dan jembatan baca `review_ledger.mjs`; struktur output | BELUM DIUJI |
| QA-S4C-02 | Rekap seluruh histori dari draf, submit, review, pengembalian, revisi tanpa kehilangan catatan lama | BELUM DIUJI |
| QA-S4C-03 | Catatan tanpa review tidak disebut hasil sah; status ditolak/dikembalikan tidak berubah menjadi diterima | BELUM DIUJI |
| QA-S4C-04 | Format poin, bobot, urutan, kasus seri dan data kosong tetap sesuai sumber simulasi | BELUM DIUJI |
| QA-S4C-05 | Sanitasi Markdown, teks panjang, karakter khusus, masukan tak sah dan field resmi terlarang | BELUM DIUJI |
| QA-S4C-06 | Form agenda/tindak lanjut, keluaran baca-saja, stale output dan interaksi HP 320/375 px + keyboard | BELUM DIUJI |
| QA-S4C-07 | Pastikan tidak ada nomor/tanggal resmi, tanda tangan, persetujuan anggaran, pengadaan, BAST atau surat keputusan | BELUM DIUJI |
| QA-S4C-08 | SOP tata naskah, verifikator resmi, arsip dan klasifikasi informasi sebelum penggunaan kedinasan | BUTUH KEPUTUSAN |

[Dokumen M03-S4C](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M03_S4C_DRAFT_MINUTES.md). Tidak ada uji otomatis atau manual pada sesi ini.

## Antrean M04-S1: berkas administrasi Support (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S1-01 | Kontrak sumber DEMO terverifikasi vs diajukan; status bukti metadata, versi dan fasilitas | BELUM DIUJI |
| QA-M04S1-02 | Draf belum lengkap boleh disimpan; pengajuan wajib seluruh lima checklist `ada` | BELUM DIUJI |
| QA-M04S1-03 | Penelaah DEMO berbeda dari penyusun, hak transisi, pengembalian/perbaikan dan histori | BELUM DIUJI |
| QA-M04S1-04 | Larangan field allocation/approved_budget/recipient/SK/BAST dalam dokumen dan output | BELUM DIUJI |
| QA-M04S1-05 | Kategori prioritas sumber tidak menjadi auto-approve; angka pelayanan tidak memicu keputusan | BELUM DIUJI |
| QA-M04S1-06 | Source stale, perubahan versi dan penguncian referensi kebutuhan saat revisi | BELUM DIUJI |
| QA-M04S1-07 | Teks keluaran, karakter tak aman, validasi error, batas field dan penyimpanan memori saja | BELUM DIUJI |
| QA-M04S1-08 | UI HP 320/375 px, keyboard, pembaca layar, overflow dan navigasi | BELUM DIUJI |
| QA-M04S1-09 | Kesesuaian proses kewenangan, bukti, tata naskah, SPBE dan SOP daerah | BUTUH KEPUTUSAN |
| QA-M04S1-10 | Adapter sumber M03 asli, autentikasi, API/DB, audit, transaksi dan retensi resmi | TERTUNDA UJI |

[Dokumen M04-S1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S1_ADMIN_HANDOFF.md). Tidak ada CL, tes atau workflow yang dijalankan. Angka 176 tes lama hanya berlaku sampai M03-S3.

## Antrean M04-S2: register referensi eksternal (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang ditunda | Status |
|---|---|---|
| QA-M04S2-01 | Import relatif dari M04-S1, bentuk data DEMO dan kompatibilitas antarberkas | BELUM DIUJI |
| QA-M04S2-02 | Sumber dossier belum `tercatat_untuk_pertimbangan` ditolak, status sumber dan versi valid | BELUM DIUJI |
| QA-M04S2-03 | Nomor referensi DEMO ganda, penambahan beberapa entri dan pergantian referensi | BELUM DIUJI |
| QA-M04S2-04 | Validasi jenis dokumen, tanggal kalender, kode penerbit, kode metadata dan batas teks | BELUM DIUJI |
| QA-M04S2-05 | Alur draf → submit → catat metadata/klarifikasi/tidak sesuai, revisi dan histori | BELUM DIUJI |
| QA-M04S2-06 | Penelaah berbeda dari pencatat, pernyataan batas pemeriksaan wajib diisi | BELUM DIUJI |
| QA-M04S2-07 | Perubahan source M04-S1 membuat referensi stale dan menghalangi review tanpa konfirmasi ulang | BELUM DIUJI |
| QA-M04S2-08 | Tidak ada API/aksi menerbitkan SK, mengesahkan keputusan, menyetujui bantuan, anggaran atau BAST | BELUM DIUJI |
| QA-M04S2-09 | Keamanan teks/kebocoran data, ringkasan, UI HP 320/375 px, keyboard dan screen reader | BELUM DIUJI |
| QA-M04S2-10 | SOP, pemilik keputusan resmi, konfirmasi penerbit, pencabutan/masa berlaku, arsip/retensi/SPBE | BUTUH KEPUTUSAN |
| QA-M04S2-11 | Integrasi nanti dengan akun riil, API, database, audit dan keamanan file | TERTUNDA UJI |

[Dokumen M04-S2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S2_EXTERNAL_DECISION_REFERENCE.md). Kode tidak dijalankan; 176 tes lama hanya sampai M03-S3.

## Antrean M04-S3: tindak lanjut administrasi (SELURUHNYA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S3-01 | Kesesuaian import dan kontrak antara model M04-S1/S2/S3 dengan fixture fiktif | BELUM DIUJI |
| QA-M04S3-02 | Sumber bukan `metadata_tercatat`, catatan M04-S2 tanpa review dan source stale ditolak | BELUM DIUJI |
| QA-M04S3-03 | Draf, penugasan, mulai catatan, submit, telaah, revisi, pembatalan dan histori | BELUM DIUJI |
| QA-M04S3-04 | Pemisahan koordinator, petugas dan penelaah; label DEMO bukan autentikasi | BELUM DIUJI |
| QA-M04S3-05 | Duplikasi tugas satu jenis pada referensi aktif, hingga 30 tugas, penanganan ID dan tanggal | BELUM DIUJI |
| QA-M04S3-06 | Referensi berubah setelah pembuatan tugas, operasi diblokir tanpa review ulang | BELUM DIUJI |
| QA-M04S3-07 | Field alokasi, penerima, pembayaran, pengadaan, keputusan dan BAST dilarang | BELUM DIUJI |
| QA-M04S3-08 | Status `ditutup_administratif` tidak mengubah keaslian surat, alokasi/BAST, atau makna M04-S2 | BELUM DIUJI |
| QA-M04S3-09 | UI 320/375 px, tombol rencana baru, cancel beralasan, keyboard, screen reader dan kesalahan form | BELUM DIUJI |
| QA-M04S3-10 | SOP pemberi tugas, konfirmasi dokumen penerbit asli, keamanan, arsip/retensi dan SPBE | BUTUH KEPUTUSAN |
| QA-M04S3-11 | Integrasi Flask/DB/role nyata, audit tahan perubahan dan pengingat tenggat yang sah | TERTUNDA UJI |

[Spesifikasi M04-S3](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S3_ADMIN_FOLLOWUP.md). Tidak ada kode baru yang diuji pada sesi ini.

## Antrean M04-S4: Dashboard antrean administratif (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang ditunda | Status |
|---|---|---|
| QA-M04S4-01 | Impor, fixture lintas M04-S1/S2/S3/S4; semua data hanya DEMO | BELUM DIUJI |
| QA-M04S4-02 | Total sebelum filter, jumlah aktif/ditutup/dibatalkan, perbaikan dan menunggu telaah | BELUM DIUJI |
| QA-M04S4-03 | Tanggal acuan eksplisit, tanggal tidak sah dan kondisi lewat/tiba tenggat | BELUM DIUJI |
| QA-M04S4-04 | Tugas ditutup/dibatalkan tidak ikut hitungan aktif terlambat | BELUM DIUJI |
| QA-M04S4-05 | Sumber berubah/stale, indikator gabungan dan klasifikasi perhatian utama | BELUM DIUJI |
| QA-M04S4-06 | Filter status, penanggung jawab DEMO, kategori perhatian serta reset | BELUM DIUJI |
| QA-M04S4-07 | Pengurutan perhatian dan tenggat, kasus tanpa data, tampilan tabel | BELUM DIUJI |
| QA-M04S4-08 | Rekap teks baca-saja, status sebelum/sesudah filter, tanpa angka kebijakan/keuangan | BELUM DIUJI |
| QA-M04S4-09 | HP 320/375 px, keyboard, screen reader, pesan kesalahan, tabel dapat digulir | BELUM DIUJI |
| QA-M04S4-10 | API mutasi/approval absent, privasi DEMO, tidak ada penyimpanan/kirim otomatis | BELUM DIUJI |
| QA-M04S4-11 | SOP definisi keterlambatan, penugasan, klasifikasi data, keamanan/akses dan SPBE | BUTUH KEPUTUSAN |
| QA-M04S4-12 | Integrasi data/akun riil, backend, audit permanen dan monitoring operasional | TERTUNDA UJI |

[Dokumen M04-S4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S4_FOLLOWUP_DASHBOARD.md). Tidak ada pemeriksaan baru yang dieksekusi.

## Antrean M04-S5: Kendala dan eskalasi administratif (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S5-01 | Kontrak impor M04-S1/S2/S3/S5 dan data fiktif, tidak ada koneksi ke produksi | BELUM DIUJI |
| QA-M04S5-02 | Hanya assignee aktif M04-S3 yang dapat membuat draf; sumber stale atau ditutup ditolak | BELUM DIUJI |
| QA-M04S5-03 | Draf, revisi, pelaporan, penerusan, tanggapan, klarifikasi ulang, penutupan/batal dan histori | BELUM DIUJI |
| QA-M04S5-04 | Pemisahan pelapor/koordinator/penerima/penelaah DEMO; identitas peran bukan autentikasi | BELUM DIUJI |
| QA-M04S5-05 | Duplikat aktif kategori sama pada tugas yang sama, ID unik dan kapasitas 25 | BELUM DIUJI |
| QA-M04S5-06 | Perubahan tugas sumber/referensi, versi dan snapshot membuat tindakan tertahan | BELUM DIUJI |
| QA-M04S5-07 | Kategori/urgensi/teks/tanggal kode DEMO, field keputusan/anggaran/BAST dilarang | BELUM DIUJI |
| QA-M04S5-08 | Penutupan administratif tidak mengubah M04-S3 dan tidak mengesahkan surat/bantuan | BELUM DIUJI |
| QA-M04S5-09 | Rekap total/aktif/perlu klarifikasi/lewat tanggal manual dan histori teks | BELUM DIUJI |
| QA-M04S5-10 | Form dan pilihan kendala 320/375px, keyboard, pembaca layar, status error/empty | BELUM DIUJI |
| QA-M04S5-11 | SOP alur eskalasi, siapa berwenang menerima, retensi dan keamanan/SPBE | BUTUH KEPUTUSAN |
| QA-M04S5-12 | Integrasi login, otorisasi wilayah, API/DB, audit dan notifikasi resmi kelak | TERTUNDA UJI |

[Spesifikasi M04-S5](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S5_ADMIN_ESCALATIONS.md). Seluruh kode BELUM DIUJI, belum ada CL/CI baru.

## Antrean M04-S6: matriks eskalasi administratif DEMO (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S6-01 | Impor M04-S1/S2/S3/S5/S6 dan fixture sumber DEMO tanpa data riil | BELUM DIUJI |
| QA-M04S6-02 | Matriks lima kategori dan tiga urgensi (15 rute), label/tujuan/penjelasan konsisten | BELUM DIUJI |
| QA-M04S6-03 | Urgensi mendesak hanya usulan pembahasan koordinator, bukan penetapan bantuan | BELUM DIUJI |
| QA-M04S6-04 | Draf, belum dilaporkan, ditutup/dibatalkan atau sumber usang tidak bisa dipilih | BELUM DIUJI |
| QA-M04S6-05 | Alasan override minimum 60 karakter; unit tujuan harus termasuk daftar DEMO | BELUM DIUJI |
| QA-M04S6-06 | Draf → submit → review/return/revise, pemisahan pelaku dan kelengkapan histori | BELUM DIUJI |
| QA-M04S6-07 | Sumber eskalasi berubah setelah draf/pengajuan, tidak dapat melanjutkan tanpa kaji ulang | BELUM DIUJI |
| QA-M04S6-08 | Tidak ada `routeEscalation()` otomatis, notifikasi atau mutasi status M04-S5 | BELUM DIUJI |
| QA-M04S6-09 | Atribut persetujuan, anggaran, penerima, pengadaan dan BAST tidak diterima | BELUM DIUJI |
| QA-M04S6-10 | Tabel 15 opsi, form, aksesibilitas dan HP 320/375px, filter, navigasi keyboard | BELUM DIUJI |
| QA-M04S6-11 | Format rekap, perubahan status, catatan review dan sanitasi input teks | BELUM DIUJI |
| QA-M04S6-12 | Validitas alur kelembagaan, petugas pengampu, SPO/SOP, tata naskah, SPBE | BUTUH KEPUTUSAN |
| QA-M04S6-13 | Integrasi backend dengan login, kontrol akses wilayah, audit tahan perubahan setelah disetujui | TERTUNDA UJI |

[Spesifikasi M04-S6](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S6_ROUTING_MATRIX.md); semua tes ditunda sesuai instruksi owner.

## Antrean M04-S7: Katalog unit, matriks RACI dan draf SOP (SEMUA BELUM DIUJI)

| ID | Pemeriksaan nanti | Status |
|---|---|---|
| QA-M04S7-01 | Import M04-S1/S2/S3/S5/S6/S7 dan fixture DEMO | BELUM DIUJI |
| QA-M04S7-02 | Empat unit/kode/prasyarat/batas konsisten dengan M04-S6 | BELUM DIUJI |
| QA-M04S7-03 | Enam aktivitas RACI, peran R/A/C/I tepat dan tidak mengklaim jabatan/kewenangan resmi | BELUM DIUJI |
| QA-M04S7-04 | Hanya note M04-S6 ditelaah `dicatat_untuk_pembahasan` yang dapat jadi sumber | BELUM DIUJI |
| QA-M04S7-05 | Kendala M04-S5 stale, batal/ditutup, perubahan note M04-S6 dan sumber tidak konsisten harus ditolak | BELUM DIUJI |
| QA-M04S7-06 | Unit proposal harus sama dengan unit M04-S6, tidak boleh mengubah rute diam-diam | BELUM DIUJI |
| QA-M04S7-07 | Draf, submit, review, return, revisi, histori; penelaah DEMO berbeda | BELUM DIUJI |
| QA-M04S7-08 | Tanggal, teks minimum/maksimum dan atribut SOP resmi/approval/anggaran/BAST dilarang | BELUM DIUJI |
| QA-M04S7-09 | Tidak mengirim surat/disposisi, tidak mengubah sumber M04-S5/S6 atau memicu CI | BELUM DIUJI |
| QA-M04S7-10 | Tabel katalog/RACI, form HP 320/375px, keyboard, screen reader, pesan kesalahan | BELUM DIUJI |
| QA-M04S7-11 | Rekap baca-saja dan klaim status `dicatat_untuk_bahan_sop` tidak jadi SOP berlaku | BELUM DIUJI |
| QA-M04S7-12 | Telaah kewenangan resmi, tupoksi, bagan organisasi, SOP, SPBE, tata naskah/arsip | BUTUH KEPUTUSAN |
| QA-M04S7-13 | Integrasi autentikasi/role/wilayah nyata, DB, audit permanen dan dokumen resmi setelah disahkan | TERTUNDA UJI |

[Spesifikasi M04-S7](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S7_UNIT_CATALOG_RACI.md). Mode kode saja tetap berlaku, tidak ada tes baru.

## Antrean M05-14: Dashboard visual APEL DEMO 2026–2030 (BELUM DIUJI)
- [Kode M05-14](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-dashboard-ui) · [Halaman HTML](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-dashboard-ui/index.html) · [50 QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-dashboard-ui/tests/dashboard.test.mjs) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_14_DASHBOARD_APEL_DEMO_2026_2030.md). **50 ditulis, 0 dijalankan**.
- Pemeriksaan manual UI yang belum dilakukan: (1) syntax/import ES module dan penyajian dari server statis lokal yang baru boleh digunakan saat izin, (2) filter tahun/wilayah/fasilitas dan reset, (3) empty state 2028–2030, (4) pemisahan laporan nol dan belum melapor secara visual, (5) grafis tidak mengaburkan cakupan parsial, (6) aksesibilitas keyboard, label dan simbol, (7) responsif desktop/ponsel dan scroll tabel, (8) tidak ada fetch/analytics/koneksi jaringan, (9) security review, (10) konsistensi M05-0/Juknis sebelum integrasi. **Tidak ada tes browser atau screenshot yang telah dilakukan**.
 
| ID | Skenario QA terjadwal | Status |
|---|---|---|
| QA-M05-14-01 | M05-14 exposes twelve Indonesian month labels | BELUM DIUJI |
| QA-M05-14-02 | M05-14 distinguishes three monthly reporting states | BELUM DIUJI |
| QA-M05-14-03 | M05-14 fixtures contain only fictional facility identities | BELUM DIUJI |
| QA-M05-14-04 | M05-14 fixture source explicitly states no real facility data | BELUM DIUJI |
| QA-M05-14-05 | M05-14 fixture returns a fresh ledger for each build | BELUM DIUJI |
| QA-M05-14-06 | M05-14 dashboard uses the dedicated untested schema | BELUM DIUJI |
| QA-M05-14-07 | M05-14 dashboard remains DEMO only | BELUM DIUJI |
| QA-M05-14-08 | M05-14 dashboard offers years 2026 through 2030 | BELUM DIUJI |
| QA-M05-14-09 | M05-14 dashboard returns twelve calendar months | BELUM DIUJI |
| QA-M05-14-10 | M05-14 dashboard has only three DEMO facilities in the fixture | BELUM DIUJI |
| QA-M05-14-11 | M05-14 facility rows are alphabetical by DEMO ID | BELUM DIUJI |
| QA-M05-14-12 | M05-14 2026 includes sixteen submitted facility-months | BELUM DIUJI |
| QA-M05-14-13 | M05-14 2026 includes twenty unreported facility-months | BELUM DIUJI |
| QA-M05-14-14 | M05-14 2026 contains three explicit zero reports | BELUM DIUJI |
| QA-M05-14-15 | M05-14 2026 recorded services are derived from DEMO event counts | BELUM DIUJI |
| QA-M05-14-16 | M05-14 Feb 2026 includes explicit zero and positive reports | BELUM DIUJI |
| QA-M05-14-17 | M05-14 June 2026 includes a location-event investigation once | BELUM DIUJI |
| QA-M05-14-18 | M05-14 August 2026 counts an ante and post animal only once | BELUM DIUJI |
| QA-M05-14-19 | M05-14 reported zero has numeric value zero | BELUM DIUJI |
| QA-M05-14-20 | M05-14 unreported month has null value, not zero | BELUM DIUJI |
| QA-M05-14-21 | M05-14 March 2026 respects reported zero versus missing | BELUM DIUJI |
| QA-M05-14-22 | M05-14 filters region without ranking facilities | BELUM DIUJI |
| QA-M05-14-23 | M05-14 filters single facility within its DEMO region | BELUM DIUJI |
| QA-M05-14-24 | M05-14 a region selector keeps only its facilities | BELUM DIUJI |
| QA-M05-14-25 | M05-14 invalid region is rejected | BELUM DIUJI |
| QA-M05-14-26 | M05-14 invalid facility is rejected | BELUM DIUJI |
| QA-M05-14-27 | M05-14 cross-region facility selection is rejected | BELUM DIUJI |
| QA-M05-14-28 | M05-14 invalid year is rejected rather than converted | BELUM DIUJI |
| QA-M05-14-29 | M05-14 year 2031 cannot inherit the 2030 rule | BELUM DIUJI |
| QA-M05-14-30 | M05-14 2027 demo year has six reported months | BELUM DIUJI |
| QA-M05-14-31 | M05-14 2027 has its own policy version | BELUM DIUJI |
| QA-M05-14-32 | M05-14 2027 recorded services remain independent of 2026 | BELUM DIUJI |
| QA-M05-14-33 | M05-14 2028 has no submitted DEMO months | BELUM DIUJI |
| QA-M05-14-34 | M05-14 2028 no reports means null aggregate, never zero | BELUM DIUJI |
| QA-M05-14-35 | M05-14 2029 without reports also has null aggregate | BELUM DIUJI |
| QA-M05-14-36 | M05-14 2030 without reports is not an official finding | BELUM DIUJI |
| QA-M05-14-37 | M05-14 complete explicit zero is distinguishable from no reports | BELUM DIUJI |
| QA-M05-14-38 | M05-14 invalid real facility identifiers are rejected | BELUM DIUJI |
| QA-M05-14-39 | M05-14 facility labels cannot include HTML | BELUM DIUJI |
| QA-M05-14-40 | M05-14 region labels cannot include HTML | BELUM DIUJI |
| QA-M05-14-41 | M05-14 conflicting region names are rejected | BELUM DIUJI |
| QA-M05-14-42 | M05-14 duplicate facility identity is rejected | BELUM DIUJI |
| QA-M05-14-43 | M05-14 a source record for an unknown facility is rejected | BELUM DIUJI |
| QA-M05-14-44 | M05-14 malformed ledger is rejected | BELUM DIUJI |
| QA-M05-14-45 | M05-14 a tampered ledger report must fail M05-0 validation | BELUM DIUJI |
| QA-M05-14-46 | M05-14 no selected facilities does not imply zero recorded services | BELUM DIUJI |
| QA-M05-14-47 | M05-14 timeliness and official rank always remain unavailable | BELUM DIUJI |
| QA-M05-14-48 | M05-14 all source reconciliation and historical comparisons remain unverified | BELUM DIUJI |
| QA-M05-14-49 | M05-14 all permissions to write score rank award or publish are denied | BELUM DIUJI |
| QA-M05-14-50 | M05-14 no month may claim authoritative verification | BELUM DIUJI |

## Antrean M05-13: observabilitas dan audit trail DEMO APEL 2026–2030 (BELUM DIUJI)
- [Kode M05-13](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-observability) · [50 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-observability/tests/observability.test.mjs) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_13_APEL_OBSERVABILITY_AUDIT_2026_2030.md). **50 ditulis, 0 dijalankan**.
- Tidak ada klaim log tepercaya, waktu server asli, sumber live, ambang peringatan, notifikasi, insiden resmi maupun persetujuan. Semua kontrak metadata perlu diperiksa serta sumber/tata kelola ditetapkan sebelum integrasi.

| ID | Skenario QA tertunda | Status |
|---|---|---|
| QA-M05-13-01 | M05-13 catalogs exactly twelve questions | BELUM DIUJI |
| QA-M05-13-02 | M05-13 signal IDs are unique | BELUM DIUJI |
| QA-M05-13-03 | M05-13 links each signal to a source evidence requirement | BELUM DIUJI |
| QA-M05-13-04 | M05-13 maps each signal to a rollback condition for human review | BELUM DIUJI |
| QA-M05-13-05 | M05-13 report revision consistency is represented | BELUM DIUJI |
| QA-M05-13-06 | M05-13 missing versus explicit zero is represented | BELUM DIUJI |
| QA-M05-13-07 | M05-13 historical district attribution is represented | BELUM DIUJI |
| QA-M05-13-08 | M05-13 2026 investigation and kurban service grain are represented | BELUM DIUJI |
| QA-M05-13-09 | M05-13 signals cannot claim approved alert thresholds | BELUM DIUJI |
| QA-M05-13-10 | M05-13 catalog is not live monitoring | BELUM DIUJI |
| QA-M05-13-11 | M05-13 severity vocabulary cannot assert production emergency | BELUM DIUJI |
| QA-M05-13-12 | M05-13 observations only use enumerated synthetic codes | BELUM DIUJI |
| QA-M05-13-13 | M05-13 empty ledger has no incident claims | BELUM DIUJI |
| QA-M05-13-14 | M05-13 empty ledger lacks trusted clock and persistence | BELUM DIUJI |
| QA-M05-13-15 | M05-13 ledger derives the year policy draft | BELUM DIUJI |
| QA-M05-13-16 | M05-13 refuses unsupported year | BELUM DIUJI |
| QA-M05-13-17 | M05-13 refuses non-DEMO snapshot | BELUM DIUJI |
| QA-M05-13-18 | M05-13 refuses wrong DEMO snapshot namespace | BELUM DIUJI |
| QA-M05-13-19 | M05-13 one event appends to a new ledger without source access | BELUM DIUJI |
| QA-M05-13-20 | M05-13 event key uses snapshot-local sequence | BELUM DIUJI |
| QA-M05-13-21 | M05-13 observation source never gains official verification | BELUM DIUJI |
| QA-M05-13-22 | M05-13 observation cannot store a raw payload | BELUM DIUJI |
| QA-M05-13-23 | M05-13 observation cannot accept free-form personal name | BELUM DIUJI |
| QA-M05-13-24 | M05-13 observation refuses an unregistered code | BELUM DIUJI |
| QA-M05-13-25 | M05-13 event ID cannot identify a real production record | BELUM DIUJI |
| QA-M05-13-26 | M05-13 facility ID must remain synthetic | BELUM DIUJI |
| QA-M05-13-27 | M05-13 event period must match reporting year | BELUM DIUJI |
| QA-M05-13-28 | M05-13 duplicate event IDs within one batch are rejected | BELUM DIUJI |
| QA-M05-13-29 | M05-13 duplicate event IDs across batches are rejected | BELUM DIUJI |
| QA-M05-13-30 | M05-13 unbounded batch size is rejected | BELUM DIUJI |
| QA-M05-13-31 | M05-13 invalid ledger metadata is rejected | BELUM DIUJI |
| QA-M05-13-32 | M05-13 tampered event sequence is rejected | BELUM DIUJI |
| QA-M05-13-33 | M05-13 tampered severity counts are rejected | BELUM DIUJI |
| QA-M05-13-34 | M05-13 ledger cannot grant test, write, publish or merge | BELUM DIUJI |
| QA-M05-13-35 | M05-13 empty board states health has not been measured | BELUM DIUJI |
| QA-M05-13-36 | M05-13 no observation is not proof of healthy service | BELUM DIUJI |
| QA-M05-13-37 | M05-13 board observations do not claim verified live signals | BELUM DIUJI |
| QA-M05-13-38 | M05-13 board keeps all signals even without events | BELUM DIUJI |
| QA-M05-13-39 | M05-13 board records zero official notifications | BELUM DIUJI |
| QA-M05-13-40 | M05-13 triage cannot contain a notification action | BELUM DIUJI |
| QA-M05-13-41 | M05-13 valid synthetic note remains open and unverified | BELUM DIUJI |
| QA-M05-13-42 | M05-13 valid note cannot assign a real person | BELUM DIUJI |
| QA-M05-13-43 | M05-13 note requires a matching existing synthetic observation | BELUM DIUJI |
| QA-M05-13-44 | M05-13 note cannot carry private free-text narrative | BELUM DIUJI |
| QA-M05-13-45 | M05-13 review note cannot spoof a human signoff | BELUM DIUJI |
| QA-M05-13-46 | M05-13 duplicate note ID is rejected | BELUM DIUJI |
| QA-M05-13-47 | M05-13 snapshot mismatch in triage is rejected | BELUM DIUJI |
| QA-M05-13-48 | M05-13 handoff rejects forged board health state | BELUM DIUJI |
| QA-M05-13-49 | M05-13 handoff rejects forged incident resolution | BELUM DIUJI |
| QA-M05-13-50 | M05-13 handoff cannot dispatch or publish anything | BELUM DIUJI |

## Antrean M05-12: kesiapan rilis & rollback APEL 2026–2030 (BELUM DIUJI)
- [Kode M05-12](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-release-readiness) · [50 QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-release-readiness/tests/release.test.mjs) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_12_RELEASE_READINESS_ROLLBACK_2026_2030.md). **50 ditulis, 0 dijalankan**.
- Perlu izin eksplisit owner untuk perubahan mode CODE_ONLY sebelum melakukan tes; dokumen izin pemilik sistem/produksi, hasil staging/paritas Juknis, backup & restore yang terverifikasi, audit keamanan, baseline kesehatan, prosedur insiden, serta penelaahan independen tetap belum ada. Draf NO_GO bukan keputusan pejabat.

| ID | Skenario QA tertunda | Status |
|---|---|---|
| QA-M05-12-01 | M05-12 defines 18 separate pre-release control requirements | BELUM DIUJI |
| QA-M05-12-02 | M05-12 control IDs are unique | BELUM DIUJI |
| QA-M05-12-03 | M05-12 release decision requires separate project and system authority | BELUM DIUJI |
| QA-M05-12-04 | M05-12 requires independently verified staging parity | BELUM DIUJI |
| QA-M05-12-05 | M05-12 requires independently approved year-specific policy | BELUM DIUJI |
| QA-M05-12-06 | M05-12 requires production backup verification | BELUM DIUJI |
| QA-M05-12-07 | M05-12 requires rollback and recovery approval | BELUM DIUJI |
| QA-M05-12-08 | M05-12 requires independent on-call assignment outside repo | BELUM DIUJI |
| QA-M05-12-09 | M05-12 security and historical data integrity are explicit | BELUM DIUJI |
| QA-M05-12-10 | M05-12 publication is a separate authorization | BELUM DIUJI |
| QA-M05-12-11 | M05-12 release checklist contains 18 blocked controls | BELUM DIUJI |
| QA-M05-12-12 | M05-12 release checklist exposes five no-go gates | BELUM DIUJI |
| QA-M05-12-13 | M05-12 empty checklist cannot assert a production change | BELUM DIUJI |
| QA-M05-12-14 | M05-12 upstream staging is not authorized or executed | BELUM DIUJI |
| QA-M05-12-15 | M05-12 2026 uses its own demo policy draft | BELUM DIUJI |
| QA-M05-12-16 | M05-12 2030 uses a distinct annual draft policy | BELUM DIUJI |
| QA-M05-12-17 | M05-12 covers only configured years 2026 through 2030 | BELUM DIUJI |
| QA-M05-12-18 | M05-12 rejects unsupported 2031 policy | BELUM DIUJI |
| QA-M05-12-19 | M05-12 rejects string year | BELUM DIUJI |
| QA-M05-12-20 | M05-12 rejects non-demo snapshot ID | BELUM DIUJI |
| QA-M05-12-21 | M05-12 rejects demo ID without snapshot namespace | BELUM DIUJI |
| QA-M05-12-22 | M05-12 read-only inspection never grants any action | BELUM DIUJI |
| QA-M05-12-23 | M05-12 official readiness cannot be spoofed by changing a gate | BELUM DIUJI |
| QA-M05-12-24 | M05-12 official signoff cannot be spoofed | BELUM DIUJI |
| QA-M05-12-25 | M05-12 production access flag cannot be enabled | BELUM DIUJI |
| QA-M05-12-26 | M05-12 defines 11 stop and rollback conditions | BELUM DIUJI |
| QA-M05-12-27 | M05-12 stop condition IDs are unique | BELUM DIUJI |
| QA-M05-12-28 | M05-12 stop conditions include loss of counts and privacy | BELUM DIUJI |
| QA-M05-12-29 | M05-12 stop conditions distinguish missing from zero | BELUM DIUJI |
| QA-M05-12-30 | M05-12 stop conditions cover historical region drift | BELUM DIUJI |
| QA-M05-12-31 | M05-12 rollback lists ten operator-led conceptual steps | BELUM DIUJI |
| QA-M05-12-32 | M05-12 rollback never claims a restore occurred | BELUM DIUJI |
| QA-M05-12-33 | M05-12 rollback never stores a real restore point | BELUM DIUJI |
| QA-M05-12-34 | M05-12 rollback never runs operations from its step list | BELUM DIUJI |
| QA-M05-12-35 | M05-12 rollback thresholds remain undecided | BELUM DIUJI |
| QA-M05-12-36 | M05-12 rollback rejects fake backup verification | BELUM DIUJI |
| QA-M05-12-37 | M05-12 rollback rejects fake executed restore step | BELUM DIUJI |
| QA-M05-12-38 | M05-12 rollback rejects changed snapshot in its source | BELUM DIUJI |
| QA-M05-12-39 | M05-12 rollback forbids all release and change actions | BELUM DIUJI |
| QA-M05-12-40 | M05-12 review action vocabulary excludes approval | BELUM DIUJI |
| QA-M05-12-41 | M05-12 review notes are allowed only for declared controls | BELUM DIUJI |
| QA-M05-12-42 | M05-12 review rejects real identity and arbitrary contents | BELUM DIUJI |
| QA-M05-12-43 | M05-12 review rejects duplicated DEMO note ID | BELUM DIUJI |
| QA-M05-12-44 | M05-12 review rejects forged signed permission | BELUM DIUJI |
| QA-M05-12-45 | M05-12 review note remains non-authoritative | BELUM DIUJI |
| QA-M05-12-46 | M05-12 release handoff defines eight empty official artifacts | BELUM DIUJI |
| QA-M05-12-47 | M05-12 release handoff maintains NO_GO with notes | BELUM DIUJI |
| QA-M05-12-48 | M05-12 handoff rejects forged official reviewer approval | BELUM DIUJI |
| QA-M05-12-49 | M05-12 handoff rejects rollback from mismatched snapshot | BELUM DIUJI |
| QA-M05-12-50 | M05-12 handoff cannot publish, release, restore or deploy | BELUM DIUJI |

## Antrean M05-11: izin uji staging dan paket bukti regresi APEL 2026–2030 (BELUM DIUJI)
- [Kode M05-11](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-staging-protocol) · [50 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-staging-protocol/tests/protocol.test.mjs) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_11_STAGING_AUTHORIZATION_REGRESSION_2026_2030.md). **50 ditulis, 0 dijalankan**.
- Semua bukti, izin owner proyek untuk mengubah CODE_ONLY, izin owner sistem/sumber untuk akses, staging yang terisolasi, Juknis dan referensi resmi, kontrol keamanan, laporan selisih dan penelaahan independen masih harus diperiksa ketika pengguna/instansi mengizinkan proses yang sesuai. Catatan DEMO tidak dapat mengesahkan salah satunya.

| ID | Skenario QA tertunda | Status |
|---|---|---|
| QA-M05-11-01 | M05-11 has fourteen unique staging controls | BELUM DIUJI |
| QA-M05-11-02 | M05-11 distinguishes project test permission from system access | BELUM DIUJI |
| QA-M05-11-03 | M05-11 includes isolated staging and synthetic data boundaries | BELUM DIUJI |
| QA-M05-11-04 | M05-11 documents secrets and RBAC without storing credentials | BELUM DIUJI |
| QA-M05-11-05 | M05-11 requires backup, incident stop and rollback controls | BELUM DIUJI |
| QA-M05-11-06 | M05-11 requires source mapping and 2026 Juknis baseline | BELUM DIUJI |
| QA-M05-11-07 | M05-11 retains independent publication permission | BELUM DIUJI |
| QA-M05-11-08 | M05-11 all controls start blocked | BELUM DIUJI |
| QA-M05-11-09 | M05-11 all controls have null official evidence references | BELUM DIUJI |
| QA-M05-11-10 | M05-11 2026 protocol retains 22 unexecuted parity cases | BELUM DIUJI |
| QA-M05-11-11 | M05-11 2027 protocol retains 20 unexecuted parity cases | BELUM DIUJI |
| QA-M05-11-12 | M05-11 2030 protocol keeps its own policy | BELUM DIUJI |
| QA-M05-11-13 | M05-11 plans cover all five configured years | BELUM DIUJI |
| QA-M05-11-14 | M05-11 rejects out-of-range year instead of inheriting policy | BELUM DIUJI |
| QA-M05-11-15 | M05-11 rejects text year instead of parsing it | BELUM DIUJI |
| QA-M05-11-16 | M05-11 rejects absent snapshot | BELUM DIUJI |
| QA-M05-11-17 | M05-11 rejects non-DEMO snapshot | BELUM DIUJI |
| QA-M05-11-18 | M05-11 rejects generic DEMO ID without snapshot namespace | BELUM DIUJI |
| QA-M05-11-19 | M05-11 project test permission remains unverified | BELUM DIUJI |
| QA-M05-11-20 | M05-11 separate system access permission remains unverified | BELUM DIUJI |
| QA-M05-11-21 | M05-11 no staging environment is provisioned | BELUM DIUJI |
| QA-M05-11-22 | M05-11 protocol never yields an execution authorization | BELUM DIUJI |
| QA-M05-11-23 | M05-11 protocol cannot score, rank, award, publish or merge | BELUM DIUJI |
| QA-M05-11-24 | M05-11 note kinds cannot grant authority | BELUM DIUJI |
| QA-M05-11-25 | M05-11 empty review never implies permission | BELUM DIUJI |
| QA-M05-11-26 | M05-11 valid DEMO note stays non-authoritative | BELUM DIUJI |
| QA-M05-11-27 | M05-11 review notes are tied to a single control | BELUM DIUJI |
| QA-M05-11-28 | M05-11 review rejects duplicate note IDs | BELUM DIUJI |
| QA-M05-11-29 | M05-11 review rejects non-DEMO reviewer IDs | BELUM DIUJI |
| QA-M05-11-30 | M05-11 review rejects mismatched snapshot | BELUM DIUJI |
| QA-M05-11-31 | M05-11 review rejects unknown control ID | BELUM DIUJI |
| QA-M05-11-32 | M05-11 review rejects fake approval note | BELUM DIUJI |
| QA-M05-11-33 | M05-11 review rejects unexpected free-text evidence field | BELUM DIUJI |
| QA-M05-11-34 | M05-11 review rejects protocol with forged test permission | BELUM DIUJI |
| QA-M05-11-35 | M05-11 review rejects altered protocol parity cases | BELUM DIUJI |
| QA-M05-11-36 | M05-11 review rejects altered official control signoff | BELUM DIUJI |
| QA-M05-11-37 | M05-11 requires twelve categories of future regression evidence | BELUM DIUJI |
| QA-M05-11-38 | M05-11 future evidence artifacts are all not provided | BELUM DIUJI |
| QA-M05-11-39 | M05-11 packet records zero executions and zero verdicts | BELUM DIUJI |
| QA-M05-11-40 | M05-11 packet retains six blocked upstream gates | BELUM DIUJI |
| QA-M05-11-41 | M05-11 a review note never changes packet readiness | BELUM DIUJI |
| QA-M05-11-42 | M05-11 a review note does not fill official artifact references | BELUM DIUJI |
| QA-M05-11-43 | M05-11 packet refuses forged official review decision | BELUM DIUJI |
| QA-M05-11-44 | M05-11 packet refuses forged permission from review | BELUM DIUJI |
| QA-M05-11-45 | M05-11 packet refuses forged permission from protocol | BELUM DIUJI |
| QA-M05-11-46 | M05-11 packet refuses altered note count | BELUM DIUJI |
| QA-M05-11-47 | M05-11 packet refuses review from different snapshot | BELUM DIUJI |
| QA-M05-11-48 | M05-11 packet refuses mutated protocol control count | BELUM DIUJI |
| QA-M05-11-49 | M05-11 packet cannot run tests, connect, write or publish | BELUM DIUJI |
| QA-M05-11-50 | M05-11 scenario results keep missing values distinct from a verified zero | BELUM DIUJI |

## Antrean M05-10: matriks paritas & kriteria penerimaan APEL 2026–2030 (BELUM DIUJI)
- [Kode M05-10](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-parity) · [50 QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-parity/tests/parity.test.mjs) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_10_PARITY_ACCEPTANCE_MATRIX_2026_2030.md). **50 skenario QA ditulis, 0 dijalankan.** 102 item rencana tahun bukan bukti 102 pengujian.
- Pengujian baru dapat dimulai setelah pemilik proyek mencabut CODE_ONLY secara eksplisit; diperlukan data dictionary resmi, baseline Juknis 2026, aturan independen tahun 2027–2030, referensi source, izin staging, security, persetujuan reviewer, serta protokol pembanding yang disahkan. Draf belum dapat memperoleh verdict PASS.

| ID | Skenario QA yang ditunda | Status |
|---|---|---|
| QA-M05-10-01 | M05-10 case catalog has 23 definitions | BELUM DIUJI |
| QA-M05-10-02 | M05-10 case keys are unique | BELUM DIUJI |
| QA-M05-10-03 | M05-10 criteria catalog has 23 distinct named acceptance concepts | BELUM DIUJI |
| QA-M05-10-04 | M05-10 all cases require an M05-8 evidence type | BELUM DIUJI |
| QA-M05-10-05 | M05-10 zero and missing are a standalone case | BELUM DIUJI |
| QA-M05-10-06 | M05-10 2026 investigation/location is explicit | BELUM DIUJI |
| QA-M05-10-07 | M05-10 2026 kurban animal unit is explicit | BELUM DIUJI |
| QA-M05-10-08 | M05-10 2027-2030 unknown policy is an explicit issue | BELUM DIUJI |
| QA-M05-10-09 | M05-10 2026 plan has historical-only cases | BELUM DIUJI |
| QA-M05-10-10 | M05-10 2027 plan does not inherit the historical parity case | BELUM DIUJI |
| QA-M05-10-11 | M05-10 each planned year has its own version | BELUM DIUJI |
| QA-M05-10-12 | M05-10 policy versions match the existing DEMO source registry | BELUM DIUJI |
| QA-M05-10-13 | M05-10 five-year matrix covers 2026-2030 independently | BELUM DIUJI |
| QA-M05-10-14 | M05-10 five-year matrix reports all scenarios as not executed | BELUM DIUJI |
| QA-M05-10-15 | M05-10 refuses 2031 without borrowing 2030 rules | BELUM DIUJI |
| QA-M05-10-16 | M05-10 refuses invalid year values | BELUM DIUJI |
| QA-M05-10-17 | M05-10 no annual acceptance verdict is pre-granted | BELUM DIUJI |
| QA-M05-10-18 | M05-10 official expected values are never prefilled | BELUM DIUJI |
| QA-M05-10-19 | M05-10 planned comparators and tolerances remain undecided | BELUM DIUJI |
| QA-M05-10-20 | M05-10 no annual plan grants permission | BELUM DIUJI |
| QA-M05-10-21 | M05-10 no five-year view grants permission | BELUM DIUJI |
| QA-M05-10-22 | M05-10 demo reference metadata kinds are enumerated | BELUM DIUJI |
| QA-M05-10-23 | M05-10 empty reference review is blocked | BELUM DIUJI |
| QA-M05-10-24 | M05-10 one DEMO reference remains unverified | BELUM DIUJI |
| QA-M05-10-25 | M05-10 two kinds may be candidates for the same case | BELUM DIUJI |
| QA-M05-10-26 | M05-10 duplicate DEMO reference candidate is rejected | BELUM DIUJI |
| QA-M05-10-27 | M05-10 non-DEMO reference identifier is rejected | BELUM DIUJI |
| QA-M05-10-28 | M05-10 real-looking owner identifier is rejected | BELUM DIUJI |
| QA-M05-10-29 | M05-10 non-snapshot identifier is rejected | BELUM DIUJI |
| QA-M05-10-30 | M05-10 reference cannot claim approval | BELUM DIUJI |
| QA-M05-10-31 | M05-10 reference cannot carry raw source contents | BELUM DIUJI |
| QA-M05-10-32 | M05-10 candidate for unplanned year is rejected | BELUM DIUJI |
| QA-M05-10-33 | M05-10 unknown reference type is rejected | BELUM DIUJI |
| QA-M05-10-34 | M05-10 rejects modified approved annual plan | BELUM DIUJI |
| QA-M05-10-35 | M05-10 rejects modified comparator | BELUM DIUJI |
| QA-M05-10-36 | M05-10 rejects added unrecognized case row | BELUM DIUJI |
| QA-M05-10-37 | M05-10 rejects non-array reference input | BELUM DIUJI |
| QA-M05-10-38 | M05-10 one reference cannot trigger acceptance | BELUM DIUJI |
| QA-M05-10-39 | M05-10 acceptance lists nine independent prerequisites | BELUM DIUJI |
| QA-M05-10-40 | M05-10 acceptance preserves six blocked M05-8 gates | BELUM DIUJI |
| QA-M05-10-41 | M05-10 candidate references do not open any acceptance gate | BELUM DIUJI |
| QA-M05-10-42 | M05-10 no acceptance packet grants test, write, or publication | BELUM DIUJI |
| QA-M05-10-43 | M05-10 cannot claim reviewed source is accepted | BELUM DIUJI |
| QA-M05-10-44 | M05-10 refuses forged comparison count | BELUM DIUJI |
| QA-M05-10-45 | M05-10 refuses altered DEMO candidate metadata in reviewed report | BELUM DIUJI |
| QA-M05-10-46 | M05-10 absent review is rejected rather than marked complete | BELUM DIUJI |
| QA-M05-10-47 | M05-10 2026 historical rules are not pronounced verified | BELUM DIUJI |
| QA-M05-10-48 | M05-10 2028 policy stays decision pending | BELUM DIUJI |
| QA-M05-10-49 | M05-10 2030 requires independent policy decision | BELUM DIUJI |
| QA-M05-10-50 | M05-10 scores, rank, awards, and publication remain disabled | BELUM DIUJI |

## Antrean M05-9: register tindak lanjut rekonsiliasi manual APEL 2026–2030 (BELUM DIUJI)
- [Kode DEMO M05-9](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-followup) · [50 QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-followup/tests/followup.test.mjs) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_9_MANUAL_RECONCILIATION_FOLLOWUP_2026_2030.md). **50 skenario ditulis, 0 dijalankan.**
- Uji baru dapat dilakukan setelah izin eksplisit pemilik proyek untuk keluar dari CODE_ONLY. Persetujuan pengujian bukan izin produksi; perlu bukti terpisah data dictionary, Juknis, validitas snapshot, hak akses dan keputusan owner.

| ID | Skenario QA yang ditunda | Status |
|---|---|---|
| QA-M05-9-01 | M05-9 accepts a blocked DEMO readiness input | BELUM DIUJI |
| QA-M05-9-02 | M05-9 creates a fourteen-item requirement review queue | BELUM DIUJI |
| QA-M05-9-03 | M05-9 issues remain separate from evidence requirements | BELUM DIUJI |
| QA-M05-9-04 | M05-9 task kinds are explicit | BELUM DIUJI |
| QA-M05-9-05 | M05-9 action codes do not include auto-close or auto-repair | BELUM DIUJI |
| QA-M05-9-06 | M05-9 scopes every task to its snapshot | BELUM DIUJI |
| QA-M05-9-07 | M05-9 issue index is anchored to snapshot and source reference | BELUM DIUJI |
| QA-M05-9-08 | M05-9 never treats an index as global issue identity | BELUM DIUJI |
| QA-M05-9-09 | M05-9 missing readiness packet is rejected | BELUM DIUJI |
| QA-M05-9-10 | M05-9 rejects readiness not shaped as M05-8 packet | BELUM DIUJI |
| QA-M05-9-11 | M05-9 rejects readiness with unauthorized production access | BELUM DIUJI |
| QA-M05-9-12 | M05-9 rejects gate falsely marked ready | BELUM DIUJI |
| QA-M05-9-13 | M05-9 rejects official attestation forged into requirement | BELUM DIUJI |
| QA-M05-9-14 | M05-9 rejects a resolved upstream issue | BELUM DIUJI |
| QA-M05-9-15 | M05-9 rejects non-DEMO snapshot | BELUM DIUJI |
| QA-M05-9-16 | M05-9 rejects generic DEMO label lacking snapshot namespace | BELUM DIUJI |
| QA-M05-9-17 | M05-9 unresolved region issue requires history evidence | BELUM DIUJI |
| QA-M05-9-18 | M05-9 workflow issue requires workflow revision evidence | BELUM DIUJI |
| QA-M05-9-19 | M05-9 unknown issue code falls back to provenance and grain | BELUM DIUJI |
| QA-M05-9-20 | M05-9 all tasks start open, without deadlines or official signoff | BELUM DIUJI |
| QA-M05-9-21 | M05-9 no branch of register can authorize writes, tests or scores | BELUM DIUJI |
| QA-M05-9-22 | M05-9 preserves scope 2026-2030 | BELUM DIUJI |
| QA-M05-9-23 | M05-9 accepts one proposal with correct expected revision | BELUM DIUJI |
| QA-M05-9-24 | M05-9 proposal never changes issue resolution or source | BELUM DIUJI |
| QA-M05-9-25 | M05-9 append does not mutate input register | BELUM DIUJI |
| QA-M05-9-26 | M05-9 supports ordered sequential notes with explicit revisions | BELUM DIUJI |
| QA-M05-9-27 | M05-9 supports append on previously reviewed register | BELUM DIUJI |
| QA-M05-9-28 | M05-9 rejects stale revision rather than overwriting notes | BELUM DIUJI |
| QA-M05-9-29 | M05-9 rejects duplicate proposal ID within new batch | BELUM DIUJI |
| QA-M05-9-30 | M05-9 rejects reuse of previously recorded proposal ID | BELUM DIUJI |
| QA-M05-9-31 | M05-9 cross-snapshot proposal is rejected | BELUM DIUJI |
| QA-M05-9-32 | M05-9 unknown task is not silently created | BELUM DIUJI |
| QA-M05-9-33 | M05-9 unrelated evidence requirement is rejected | BELUM DIUJI |
| QA-M05-9-34 | M05-9 missing evidence reference is rejected | BELUM DIUJI |
| QA-M05-9-35 | M05-9 fake reviewer identifier is rejected | BELUM DIUJI |
| QA-M05-9-36 | M05-9 proposed auto-approval action is rejected | BELUM DIUJI |
| QA-M05-9-37 | M05-9 proposed close-and-repair action is rejected | BELUM DIUJI |
| QA-M05-9-38 | M05-9 forged official decision field is rejected | BELUM DIUJI |
| QA-M05-9-39 | M05-9 arbitrary free text or raw evidence is rejected | BELUM DIUJI |
| QA-M05-9-40 | M05-9 forged register authorization is rejected | BELUM DIUJI |
| QA-M05-9-41 | M05-9 forged closed task is rejected | BELUM DIUJI |
| QA-M05-9-42 | M05-9 empty proposal batch makes no source changes | BELUM DIUJI |
| QA-M05-9-43 | M05-9 handoff renders requirement and issue groups without dispatch | BELUM DIUJI |
| QA-M05-9-44 | M05-9 handoff records notes without treating them as resolved | BELUM DIUJI |
| QA-M05-9-45 | M05-9 handoff cannot assign actual staff or publish | BELUM DIUJI |
| QA-M05-9-46 | M05-9 handoff refuses spoofed register source | BELUM DIUJI |
| QA-M05-9-47 | M05-9 proposal for missing dictionary evidence remains pending | BELUM DIUJI |
| QA-M05-9-48 | M05-9 rejects inconsistent evidence candidate counts | BELUM DIUJI |
| QA-M05-9-49 | M05-9 rejects forged blocked-requirement gate list | BELUM DIUJI |
| QA-M05-9-50 | M05-9 rejects modified historical proposal revision | BELUM DIUJI |

## Antrean M05-8: evidence review dan gerbang sumber APEL 2026–2030 (BELUM DIUJI)
- [Kode M05-8](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-evidence) · [49 QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-evidence/tests/evidence.test.mjs) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_8_EVIDENCE_REVIEW_GATES_2026_2030.md). **49 skenario ditulis, 0 dijalankan.**
- Butuh keputusan owner untuk mulai pengujian; hasil fiktif tidak boleh naik ke status sah. Butuh verifikasi independen dan persetujuan formal untuk data dictionary, pemilik sumber, grain, Juknis, versi policy, bukti dukungan, izin staging serta publikasi.

| ID | Skenario tertunda | Status |
|---|---|---|
| QA-M05-8-01 | M05-8 catalog has fourteen distinct mandatory requirements | BELUM DIUJI |
| QA-M05-8-02 | M05-8 catalog cites eight semantic domains | BELUM DIUJI |
| QA-M05-8-03 | M05-8 catalog cites seven DEMO source families | BELUM DIUJI |
| QA-M05-8-04 | M05-8 catalog covers years 2026 to 2030 | BELUM DIUJI |
| QA-M05-8-05 | M05-8 contract never grants access, scoring, or publication | BELUM DIUJI |
| QA-M05-8-06 | M05-8 empty register represents fourteen missing requirements | BELUM DIUJI |
| QA-M05-8-07 | M05-8 valid DEMO candidate stays unverified | BELUM DIUJI |
| QA-M05-8-08 | M05-8 multiple pieces of DEMO evidence may belong to one requirement | BELUM DIUJI |
| QA-M05-8-09 | M05-8 non-DEMO evidence identity is rejected | BELUM DIUJI |
| QA-M05-8-10 | M05-8 non-DEMO reference is rejected | BELUM DIUJI |
| QA-M05-8-11 | M05-8 non-DEMO supplier identity is rejected | BELUM DIUJI |
| QA-M05-8-12 | M05-8 evidence type must match requirement | BELUM DIUJI |
| QA-M05-8-13 | M05-8 evidence family must match requirement | BELUM DIUJI |
| QA-M05-8-14 | M05-8 unknown requirement is rejected | BELUM DIUJI |
| QA-M05-8-15 | M05-8 duplicate evidence identity is rejected | BELUM DIUJI |
| QA-M05-8-16 | M05-8 noninteger revision is rejected | BELUM DIUJI |
| QA-M05-8-17 | M05-8 invented verified claim cannot enter register | BELUM DIUJI |
| QA-M05-8-18 | M05-8 evidence metadata rejects raw document contents | BELUM DIUJI |
| QA-M05-8-19 | M05-8 excessive candidate count is rejected | BELUM DIUJI |
| QA-M05-8-20 | M05-8 reviews reject missing register | BELUM DIUJI |
| QA-M05-8-21 | M05-8 empty review register does not claim signoff | BELUM DIUJI |
| QA-M05-8-22 | M05-8 DEMO review note remains non-authoritative | BELUM DIUJI |
| QA-M05-8-23 | M05-8 review rejects unknown evidence reference | BELUM DIUJI |
| QA-M05-8-24 | M05-8 review rejects mismatched requirement link | BELUM DIUJI |
| QA-M05-8-25 | M05-8 review duplicate ID is rejected | BELUM DIUJI |
| QA-M05-8-26 | M05-8 review non-DEMO reviewer ID is rejected | BELUM DIUJI |
| QA-M05-8-27 | M05-8 unknown review reason is rejected | BELUM DIUJI |
| QA-M05-8-28 | M05-8 review cannot assert official approval | BELUM DIUJI |
| QA-M05-8-29 | M05-8 review rejects free-text or unexpected metadata | BELUM DIUJI |
| QA-M05-8-30 | M05-8 baseline packet has all official gates blocked | BELUM DIUJI |
| QA-M05-8-31 | M05-8 every requirement belongs to an explicit approval gate | BELUM DIUJI |
| QA-M05-8-32 | M05-8 no lineage report is explicitly unavailable | BELUM DIUJI |
| QA-M05-8-33 | M05-8 DEMO lineage conflict stays unresolved | BELUM DIUJI |
| QA-M05-8-34 | M05-8 lineage with no issues cannot imply official readiness | BELUM DIUJI |
| QA-M05-8-35 | M05-8 note on lineage conflict does not resolve it | BELUM DIUJI |
| QA-M05-8-36 | M05-8 issue review rejects nonexisting issue index | BELUM DIUJI |
| QA-M05-8-37 | M05-8 issue review rejects notes without lineage source | BELUM DIUJI |
| QA-M05-8-38 | M05-8 duplicate issue note identity is rejected | BELUM DIUJI |
| QA-M05-8-39 | M05-8 issue note rejects non-DEMO reviewer | BELUM DIUJI |
| QA-M05-8-40 | M05-8 issue review cannot automatically approve a conflict | BELUM DIUJI |
| QA-M05-8-41 | M05-8 bad lineage synthetic marker is rejected | BELUM DIUJI |
| QA-M05-8-42 | M05-8 lineage unauthorized permission cannot pass | BELUM DIUJI |
| QA-M05-8-43 | M05-8 upstream auto-resolved conflict is rejected | BELUM DIUJI |
| QA-M05-8-44 | M05-8 real-looking lineage source reference is rejected | BELUM DIUJI |
| QA-M05-8-45 | M05-8 mismatched register and review snapshots are rejected | BELUM DIUJI |
| QA-M05-8-46 | M05-8 all requirements with DEMO metadata are still blocked | BELUM DIUJI |
| QA-M05-8-47 | M05-8 packet rejects modified official register state | BELUM DIUJI |
| QA-M05-8-48 | M05-8 packet rejects spoofed human review signoff | BELUM DIUJI |
| QA-M05-8-49 | M05-8 packet forbids tests, merge, deployment and all actions | BELUM DIUJI |

## Antrean M05-7: data lineage, relasi temporal dan konflik APEL 2026–2030 (BELUM DIUJI)
- [Kode M05-7](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-lineage) · [38 skenario tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-lineage/tests/lineage.test.mjs) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_7_LINEAGE_TEMPORAL_CONFLICT_2026_2030.md). **Tidak ada satu pun skenario dijalankan (0/38).**
- Pengujian tertunda sampai instruksi eksplisit. Setelah itu tetap diperlukan telaah dictionary, grain kejadian, histori wilayah, aturan revisi, timezone, versi policy dan otorisasi pengelola data.

| ID | Pemeriksaan yang direncanakan | Status |
|---|---|---|
| QA-M05-7-01 | M05-7 contract covers exactly 2026-2030 | BELUM DIUJI |
| QA-M05-7-02 | M05-7 defines seven source groups | BELUM DIUJI |
| QA-M05-7-03 | M05-7 lineage relations are explicit | BELUM DIUJI |
| QA-M05-7-04 | M05-7 canonical fields refer to M05-6 dictionary | BELUM DIUJI |
| QA-M05-7-05 | M05-7 contractual connection/write/reporting are blocked | BELUM DIUJI |
| QA-M05-7-06 | M05-7 complete DEMO has candidate references but no verification | BELUM DIUJI |
| QA-M05-7-07 | M05-7 observed zero is distinguished | BELUM DIUJI |
| QA-M05-7-08 | M05-7 unobserved is not silently converted to zero | BELUM DIUJI |
| QA-M05-7-09 | M05-7 observed positive quantity is separately classified | BELUM DIUJI |
| QA-M05-7-10 | M05-7 all DEMO provenance and authorizations remain unverified | BELUM DIUJI |
| QA-M05-7-11 | M05-7 refuses extra/unrecognized source group | BELUM DIUJI |
| QA-M05-7-12 | M05-7 refuses missing required source column | BELUM DIUJI |
| QA-M05-7-13 | M05-7 refuses non-DEMO facility identity | BELUM DIUJI |
| QA-M05-7-14 | M05-7 refuses unsupported 2031 service month | BELUM DIUJI |
| QA-M05-7-15 | M05-7 rejects invalid quantity state value pair | BELUM DIUJI |
| QA-M05-7-16 | M05-7 rejects impossible calendar date | BELUM DIUJI |
| QA-M05-7-17 | M05-7 rejects reversed region validity | BELUM DIUJI |
| QA-M05-7-18 | M05-7 revision mismatch blocks workflow selection | BELUM DIUJI |
| QA-M05-7-19 | M05-7 missing workflow is reported | BELUM DIUJI |
| QA-M05-7-20 | M05-7 multiple same-revision workflow candidates are flagged | BELUM DIUJI |
| QA-M05-7-21 | M05-7 region split within report month is ambiguous | BELUM DIUJI |
| QA-M05-7-22 | M05-7 single partial-month region is not attributed | BELUM DIUJI |
| QA-M05-7-23 | M05-7 missing valid region is not replaced by current region | BELUM DIUJI |
| QA-M05-7-24 | M05-7 policy version mismatch is not repaired | BELUM DIUJI |
| QA-M05-7-25 | M05-7 incomplete policy period is rejected for month lineage | BELUM DIUJI |
| QA-M05-7-26 | M05-7 duplicate policy candidates need human review | BELUM DIUJI |
| QA-M05-7-27 | M05-7 orphan facility cannot be joined by name | BELUM DIUJI |
| QA-M05-7-28 | M05-7 duplicate facility keys remain ambiguous | BELUM DIUJI |
| QA-M05-7-29 | M05-7 repeated event/location grain is flagged, not deduplicated | BELUM DIUJI |
| QA-M05-7-30 | M05-7 declared no activity cannot silently imply unknown is zero | BELUM DIUJI |
| QA-M05-7-31 | M05-7 missing support plan is reported without assigning quantity | BELUM DIUJI |
| QA-M05-7-32 | M05-7 realization unit conflict is reported | BELUM DIUJI |
| QA-M05-7-33 | M05-7 missing support evidence is reported | BELUM DIUJI |
| QA-M05-7-34 | M05-7 multiple realizations are preserved as separate evidence rows | BELUM DIUJI |
| QA-M05-7-35 | M05-7 duplicate source ID must not be silently overwritten | BELUM DIUJI |
| QA-M05-7-36 | M05-7 Dec 2030 validity may reach Jan 2031 boundary | BELUM DIUJI |
| QA-M05-7-37 | M05-7 no automatic repair, score or publish even with conflicts | BELUM DIUJI |
| QA-M05-7-38 | M05-7 distinct service events in one revision are legitimate candidates | BELUM DIUJI |

## Antrean M05-6: data dictionary dan schema mapping APEL 2026–2030 (BELUM DIUJI)

| ID | Pemeriksaan setelah izin G0 dari owner | Status |
|---|---|---|
| QA-M05-6-01 | Seluruh field kanonik unik dan terdefinisi | BELUM DIUJI |
| QA-M05-6-02 | Delapan domain tetap terpisah | BELUM DIUJI |
| QA-M05-6-03 | Semua actual table/column/type dimulai null | BELUM DIUJI |
| QA-M05-6-04 | Tidak ada klaim schema aktual atau owner terverifikasi | BELUM DIUJI |
| QA-M05-6-05 | Tahun terbatas 2026–2030 dan tidak duplikat | BELUM DIUJI |
| QA-M05-6-06 | Kandidat mapping wajib berlabel DEMO | BELUM DIUJI |
| QA-M05-6-07 | Nama tabel/kolom kandidat non-DEMO ditolak | BELUM DIUJI |
| QA-M05-6-08 | Field kanonik yang tidak dikenal ditolak | BELUM DIUJI |
| QA-M05-6-09 | Kandidat field ganda ditolak | BELUM DIUJI |
| QA-M05-6-10 | Kandidat tanpa evidence reference ditolak | BELUM DIUJI |
| QA-M05-6-11 | Kandidat tidak pernah menjadi verified | BELUM DIUJI |
| QA-M05-6-12 | Identitas fasilitas terpisah dari histori wilayah | BELUM DIUJI |
| QA-M05-6-13 | Ledger memiliki grain fasilitas-periode-revisi | BELUM DIUJI |
| QA-M05-6-14 | Event/location identity dan unit layanan ditentukan | BELUM DIUJI |
| QA-M05-6-15 | Workflow menyimpan status, revisi dan request identity | BELUM DIUJI |
| QA-M05-6-16 | Timestamp submit menyertakan semantik zona waktu | BELUM DIUJI |
| QA-M05-6-17 | Policy version dan approval state per tahun terpisah | BELUM DIUJI |
| QA-M05-6-18 | Rencana dan realisasi dukungan memiliki unit/periode/bukti | BELUM DIUJI |
| QA-M05-6-19 | Template tidak dapat konek/query/write/repair/publish | BELUM DIUJI |
| QA-M05-6-20 | Mapping aktual memerlukan bukti owner dan data dictionary resmi | BELUM DIUJI |
| QA-M05-6-21 | Review cardinality, temporal join dan konflik | RENCANA / BUTUH BUKTI |
| QA-M05-6-22 | Sampling dan total kontrol bersama owner | RENCANA / BELUM DIUJI |

**20 skenario tertulis, 0 dijalankan.** [Katalog M05-6](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-mapping) · [20 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-mapping/tests/mapping.test.mjs) (0 dijalankan) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_6_DATA_DICTIONARY_MAPPING_2026_2030.md).

## Antrean M05-5: kontrak sumber dan rekonsiliasi APEL 2026–2030 (BELUM DIUJI)

| ID | Pemeriksaan setelah izin G0 dari owner | Status |
|---|---|---|
| QA-M05-5-01 | Empat keluarga sumber wajib tersedia dan tidak ada sumber ekstra | BELUM DIUJI |
| QA-M05-5-02 | Envelope DEMO dengan schema/snapshot/digest format valid | BELUM DIUJI |
| QA-M05-5-03 | Sumber yang mengaku official/verified ditolak | BELUM DIUJI |
| QA-M05-5-04 | Envelope writable atau bukan read-only ditolak | BELUM DIUJI |
| QA-M05-5-05 | Registry fasilitas unik | BELUM DIUJI |
| QA-M05-5-06 | Periode ledger/workflow dan tahun berada pada 2026–2030 | BELUM DIUJI |
| QA-M05-5-07 | Duplikasi fasilitas-periode dalam sumber ditolak | BELUM DIUJI |
| QA-M05-5-08 | Versi policy harus cocok dengan tahun | BELUM DIUJI |
| QA-M05-5-09 | Ledger tanpa workflow dilaporkan | BELUM DIUJI |
| QA-M05-5-10 | Workflow tanpa ledger dilaporkan | BELUM DIUJI |
| QA-M05-5-11 | Fasilitas tanpa registry dilaporkan | BELUM DIUJI |
| QA-M05-5-12 | Tahun tanpa bukti policy dilaporkan | BELUM DIUJI |
| QA-M05-5-13 | Filter tahun tidak mengubah sumber input | BELUM DIUJI |
| QA-M05-5-14 | Filter tahun duplikat/tidak didukung ditolak | BELUM DIUJI |
| QA-M05-5-15 | Structural match tidak menyatakan validasi resmi | BELUM DIUJI |
| QA-M05-5-16 | Digest tidak dianggap terverifikasi tanpa verifier | BELUM DIUJI |
| QA-M05-5-17 | Timestamp tidak dianggap bukti snapshot atomik | BELUM DIUJI |
| QA-M05-5-18 | Hasil tidak dapat menulis, memperbaiki atau menghapus | BELUM DIUJI |
| QA-M05-5-19 | Hasil tidak dapat scoring, ranking, award atau publikasi | BELUM DIUJI |
| QA-M05-5-20 | Sumber kosong/bermasalah tetap eksplisit dan fail-closed | BELUM DIUJI |
| QA-M05-5-21 | Mapping data dictionary aktual setelah izin dan bukti owner | RENCANA / BUTUH KEPUTUSAN |
| QA-M05-5-22 | Snapshot atomik, digest tepercaya, rekonsiliasi sampling dan audit di staging | RENCANA / BELUM DIUJI |

**20 skenario tertulis, 0 dijalankan.** Item 21–22 adalah tindak lanjut, belum diimplementasikan/diuji. [Kode M05-5](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-reconciliation) · [20 skenario QA tertulis](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/drafts/m05-apel-reconciliation/tests/reconciliation.test.mjs) (0 dijalankan) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_5_SOURCE_RECONCILIATION_2026_2030.md).

## Antrean M05-4: rapor dan tren APEL 2026–2030 (BELUM DIUJI)

| ID | Pemeriksaan setelah izin G0 dari owner | Status |
|---|---|---|
| QA-M05-4-01 | Rekap hanya mengambil fasilitas-tahun yang dipilih | BELUM DIUJI |
| QA-M05-4-02 | Fasilitas ganda pada tahun sama ditolak | BELUM DIUJI |
| QA-M05-4-03 | Tahun lain tidak ikut masuk ke rekap tahunan | BELUM DIUJI |
| QA-M05-4-04 | Metrik volume layanan dan bulan submit tetap terpisah | BELUM DIUJI |
| QA-M05-4-05 | Nilai metrik yang tidak ada pada proposal tetap unavailable | BELUM DIUJI |
| QA-M05-4-06 | Nilai nol teramati dibedakan dari nilai null | BELUM DIUJI |
| QA-M05-4-07 | Timestamp/dukungan/wilayah yang tidak tersedia tidak diisi nol | BELUM DIUJI |
| QA-M05-4-08 | Satuan berbeda tidak boleh dijumlahkan | BELUM DIUJI |
| QA-M05-4-09 | Overflow agregasi gagal tertutup | BELUM DIUJI |
| QA-M05-4-10 | Preview dengan klaim official/scoring ditolak | BELUM DIUJI |
| QA-M05-4-11 | Duplikasi metrik dalam satu preview ditolak | BELUM DIUJI |
| QA-M05-4-12 | Rekap kosong tidak menghasilkan capaian nol | BELUM DIUJI |
| QA-M05-4-13 | Tren multi-tahun diurutkan menurut tahun | BELUM DIUJI |
| QA-M05-4-14 | Tahun yang tidak memiliki data tercatat sebagai missing year | BELUM DIUJI |
| QA-M05-4-15 | Pertumbuhan YoY dan persentase tetap null | BELUM DIUJI |
| QA-M05-4-16 | Status comparability lintas tahun tetap false | BELUM DIUJI |
| QA-M05-4-17 | Tahun duplikat/tidak didukung ditolak | BELUM DIUJI |
| QA-M05-4-18 | Metrik tren yang tidak dikenal ditolak | BELUM DIUJI |
| QA-M05-4-19 | Dashboard menyediakan pilihan 2026–2030 | BELUM DIUJI |
| QA-M05-4-20 | Dashboard menampilkan peringatan sumber dan kelengkapan | BELUM DIUJI |
| QA-M05-4-21 | Tahun pilihan di luar konfigurasi ditolak | BELUM DIUJI |
| QA-M05-4-22 | Input tidak sesuai kontrak dan jumlah berlebih ditolak | BELUM DIUJI |
| QA-M05-4-23 | Integrasi dengan sumber resmi hanya setelah rekonsiliasi dan izin | RENCANA / BUTUH KEPUTUSAN |
| QA-M05-4-24 | Review tampilan internal/publik, akses, privasi dan performa | RENCANA / BELUM DIUJI |

**22 skenario tertulis, 0 dijalankan.** Item 23–24 adalah pekerjaan lanjutan, belum diimplementasikan/diuji. [Kode M05-4](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-dashboard) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_4_REPORT_TREN_APEL_2026_2030.md).

## Antrean M05-3: aturan evaluasi 2026–2030 (BELUM DIUJI)

| ID | Pemeriksaan setelah izin G0 dari owner | Status |
|---|---|---|
| QA-M05-3-01 | Registry konsep kategori memuat tepat 2026–2030 | BELUM DIUJI |
| QA-M05-3-02 | Konsep 2026 diperlakukan referensi historis yang menunggu parity | BELUM DIUJI |
| QA-M05-3-03 | Konsep 2027 hanya usulan pelayanan, dukungan dan wilayah | BELUM DIUJI |
| QA-M05-3-04 | Kategori 2028–2030 tidak otomatis mewarisi 2026/2027 | BELUM DIUJI |
| QA-M05-3-05 | Versi kebijakan draf berbeda per tahun | BELUM DIUJI |
| QA-M05-3-06 | Tahun 2031 ditolak tanpa konfigurasi baru | BELUM DIUJI |
| QA-M05-3-07 | Proposal tidak dapat menyalakan peringkat, skor, apresiasi atau publikasi | BELUM DIUJI |
| QA-M05-3-08 | Kategori ganda dan ID proposal tak sah ditolak | BELUM DIUJI |
| QA-M05-3-09 | Klaim approved dan proposal lintas tahun ditolak | BELUM DIUJI |
| QA-M05-3-10 | Catatan publik tidak dapat memuat URL internal atau kredensial | BELUM DIUJI |
| QA-M05-3-11 | Pratinjau hanya jumlah kejadian DEMO dan bulan terkirim, tanpa skor | BELUM DIUJI |
| QA-M05-3-12 | Ketepatan waktu tanpa cap waktu tepercaya tetap null | BELUM DIUJI |
| QA-M05-3-13 | Realisasi dukungan dan agregasi wilayah tanpa sumber tetap null | BELUM DIUJI |
| QA-M05-3-14 | Setiap tahun dapat memakai proposal terpisah tanpa perbandingan skor | BELUM DIUJI |
| QA-M05-3-15 | Bulan submit DEMO bukan bukti laporan patuh/verifikasi resmi | BELUM DIUJI |
| QA-M05-3-16 | Jumlah periode ledger dan pengiriman workflow tidak dianggap sudah cocok | BELUM DIUJI |
| QA-M05-3-17 | Ledger kosong hanya menghasilkan tahun parsial DEMO, bukan capaian resmi nol | BELUM DIUJI |
| QA-M05-3-18 | Rule/checklist beda tahun ditolak | BELUM DIUJI |
| QA-M05-3-19 | Manipulasi jumlah bulan kirim pada checklist ditolak | BELUM DIUJI |
| QA-M05-3-20 | Status official_timeliness_verified palsu ditolak | BELUM DIUJI |
| QA-M05-3-21 | Ledger dengan izin operasional palsu ditolak | BELUM DIUJI |
| QA-M05-3-22 | 12 gerbang metodologi tetap BELUM_DIBUKTIKAN | BELUM DIUJI |
| QA-M05-3-23 | Catatan review tidak dapat menjadi pengesahan atau publikasi | BELUM DIUJI |
| QA-M05-3-24 | Preview dengan klaim skor resmi ditolak | BELUM DIUJI |
| QA-M05-3-25 | Review menolak proposal aturan/hasil lintas tahun atau beda ID | BELUM DIUJI |
| QA-M05-3-26 | Gate dan peran pemilik yang tidak dikenal ditolak | BELUM DIUJI |
| QA-M05-3-27 | ID catatan review ganda ditolak | BELUM DIUJI |
| QA-M05-3-28 | Teks catatan sensitif berupa URL/token ditolak | BELUM DIUJI |
| QA-M05-3-29 | Review 2030 tetap tanpa skor atau pengesahan | BELUM DIUJI |
| QA-M05-3-30 | Verifikasi rumus historis 2026 dari Juknis dan kode Flask aktual serta reproduksi hasil | RENCANA / BUTUH SUMBER |
| QA-M05-3-31 | Penetapan kebijakan terpisah 2027–2030: kategori, bobot, aturan seri, normalisasi dan penanganan sanggah | BUTUH KEPUTUSAN |
| QA-M05-3-32 | Verifikasi data layanan, bukti, timestamp WIB, dukungan, atribusi wilayah, proteksi audit historis dan fairness | RENCANA / BELUM DIUJI |
| QA-M05-3-33 | Uji regresi sumber data dan penjaminan dashboard/publikasi tanpa penambahan skor atau hak akses tak sah | RENCANA / BELUM DIUJI |

**29 skenario Node ditulis, 0 dijalankan.** Item 30–33 adalah tindak lanjut yang belum diimplementasikan/diuji. Tidak ada formula penilaian atau kategori 2028–2030 yang disahkan dalam M05-3. [Kode](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-rules) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_3_ANNUAL_RULES_2026_2030.md).

## Antrean M05-2: checklist dan tenggat APEL 2026–2030 (BELUM DIUJI)

| ID | Pemeriksaan saat izin owner G0 diberikan | Status |
|---|---|---|
| QA-M05-2-01 | Registry lima tahun menerima usulan kalender, semua tanpa approval/publikasi | BELUM DIUJI |
| QA-M05-2-02 | Tanggal tenggat dan publikasi usulan memakai bulan setelah periode | BELUM DIUJI |
| QA-M05-2-03 | Desember 2030 menghasilkan tanggal usulan Januari 2031 | BELUM DIUJI |
| QA-M05-2-04 | Pengecualian bulanan hanya mengubah bulan terkait | BELUM DIUJI |
| QA-M05-2-05 | Pengecualian Januari tidak mengubah nilai default tahun | BELUM DIUJI |
| QA-M05-2-06 | Pengecualian duplikat dan lintas tahun ditolak | BELUM DIUJI |
| QA-M05-2-07 | Hari di luar 1–28 atau tahun 2031 ditolak | BELUM DIUJI |
| QA-M05-2-08 | Klaim kalender approved/deadline_enforced ditolak | BELUM DIUJI |
| QA-M05-2-09 | Perubahan tanggal kalender setelah dibuat terdeteksi | BELUM DIUJI |
| QA-M05-2-10 | Checklist 12 bulan membedakan lima status workflow | BELUM DIUJI |
| QA-M05-2-11 | Ringkasan jumlah missing, draft, pending, correction dan revisi | BELUM DIUJI |
| QA-M05-2-12 | Riwayat pernah submit tetap terlihat setelah dikembalikan | BELUM DIUJI |
| QA-M05-2-13 | Laporan nol eksplisit berbeda dari bulan kosong | BELUM DIUJI |
| QA-M05-2-14 | Tanggal usulan tidak berubah menjadi bukti patuh/tepat waktu | BELUM DIUJI |
| QA-M05-2-15 | Tanpa kalender tidak boleh menyimpulkan tenggat | BELUM DIUJI |
| QA-M05-2-16 | Kalender tahun lain ditolak pada checklist tahun berjalan | BELUM DIUJI |
| QA-M05-2-17 | Pembacaan laporan fasilitas lain ditolak sesuai scope | BELUM DIUJI |
| QA-M05-2-18 | Pimpinan tidak memperoleh rincian melalui pembaca workflow | BELUM DIUJI |
| QA-M05-2-19 | Status tahun 2027/2030 tidak tertukar dengan 2026 | BELUM DIUJI |
| QA-M05-2-20 | Ringkasan lima tahun menyimpan policy dan jadwal masing-masing | BELUM DIUJI |
| QA-M05-2-21 | Usulan jadwal duplikat satu tahun ditolak | BELUM DIUJI |
| QA-M05-2-22 | Tanpa sampel timestamp, status tepat waktu tetap tidak diketahui | BELUM DIUJI |
| QA-M05-2-23 | Sampel tanggal jatuh tempo hanya menghasilkan perbandingan SIMULASI | BELUM DIUJI |
| QA-M05-2-24 | Sampel setelah tenggat usulan bukan putusan terlambat resmi | BELUM DIUJI |
| QA-M05-2-25 | Tidak dapat menautkan sampel ke draf yang belum dikirim | BELUM DIUJI |
| QA-M05-2-26 | Sample request ID palsu atau bulan duplikat ditolak | BELUM DIUJI |
| QA-M05-2-27 | Tanggal tidak valid dan tahun salah ditolak | BELUM DIUJI |
| QA-M05-2-28 | Kalender/tabel privileged atau lintas tahun ditolak | BELUM DIUJI |
| QA-M05-2-29 | Membandingkan kalender terhadap Juknis/keputusan resmi per tahun, termasuk kebijakan perpanjangan | BUTUH KEPUTUSAN |
| QA-M05-2-30 | Integrasi timestamp server Asia/Jakarta, sumber penerimaan asli, kontrol akses, transaksi dan snapshot atomik | RENCANA / BUTUH IZIN |
| QA-M05-2-31 | Uji aksesibilitas HP, akses lintas fasilitas, regresi checklist riil dan pemberitahuan tanpa mengirim data sensitif | RENCANA / BELUM DIUJI |

**28 skenario Node ditulis, 0 dijalankan.** Item 29–31 merupakan pekerjaan berikutnya yang belum diimplementasikan. Seluruh tenggat 2026–2030 masih usulan nonresmi, tanpa sumber waktu pengiriman terverifikasi. [Kode M05-2](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-compliance) · [Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_2_CHECKLIST_COMPLIANCE_2026_2030.md).

## Antrean M05-1: siklus draf, submit dan koreksi 2026–2030 (BELUM DIUJI)

| ID | Skenario Node tertulis (jangan dijalankan sampai G0) | Status |
|---|---|---|
| QA-M05-1-01 | Draf parsial menyimpan angka null tanpa scoring/publikasi | BELUM DIUJI |
| QA-M05-1-02 | Draf belum lengkap tidak bisa disubmit | BELUM DIUJI |
| QA-M05-1-03 | Buat → simpan → kirim menghasilkan tiga revisi berurutan | BELUM DIUJI |
| QA-M05-1-04 | Puskeswan/bulan identik tidak bisa memiliki dua laporan induk | BELUM DIUJI |
| QA-M05-1-05 | Revisi usang tidak bisa disimpan/dikirim | BELUM DIUJI |
| QA-M05-1-06 | Request ID sama tidak membuat event duplikat | BELUM DIUJI |
| QA-M05-1-07 | Periode sama pada tahun berbeda memiliki laporan terpisah | BELUM DIUJI |
| QA-M05-1-08 | Fasilitas berbeda pada periode sama tidak tercampur | BELUM DIUJI |
| QA-M05-1-09 | Pelapor Puskeswan tidak bisa mengedit Puskeswan lain pada wilayah sama | BELUM DIUJI |
| QA-M05-1-10 | Pelapor tidak bisa mengedit fasilitas di luar wilayah | BELUM DIUJI |
| QA-M05-1-11 | Kab/kota, verifikator, pimpinan tidak bisa menyamar jadi pelapor | BELUM DIUJI |
| QA-M05-1-12 | Penelaah tidak menimpa salinan laporan yang sudah disubmit | BELUM DIUJI |
| QA-M05-1-13 | Pengembalian koreksi menuntut peran/wilayah yang sah | BELUM DIUJI |
| QA-M05-1-14 | Alasan koreksi dengan URL/kredensial ditolak | BELUM DIUJI |
| QA-M05-1-15 | Revisi setelah koreksi mempertahankan snapshot versi awal | BELUM DIUJI |
| QA-M05-1-16 | Revisi tanpa pengembalian untuk koreksi ditolak | BELUM DIUJI |
| QA-M05-1-17 | Tidak tersedia transisi approve/publish otomatis | BELUM DIUJI |
| QA-M05-1-18 | Actor/role dari perintah klien atau adapter absen ditolak | BELUM DIUJI |
| QA-M05-1-19 | Pembacaan menggunakan scope dan salinan, bukan referensi yang memutasi state | BELUM DIUJI |
| QA-M05-1-20 | Backend Flask session, CSRF, transaksi DB, unique index, idempotency, audit immutable | RENCANA / BUTUH IZIN |
| QA-M05-1-21 | Uji aturan jurnal historis, penolakan bukti palsu, revisi simultan dan akses lintas tahun | RENCANA / BELUM DIUJI |
| QA-M05-1-22 | Juknis 2026 parity; kebijakan submit/revisi dan tenggat tahunan 2027–2030 | BUTUH KEPUTUSAN |

**19 skenario test Node tertulis, 0 dijalankan**; 3 item tambahan adalah rencana QA/proses yang belum dibuat. [Spesifikasi M05-1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_1_APEL_REPORT_WORKFLOW_2026_2030.md). Event hanya in-memory, tidak tahan perubahan dan belum mewakili audit sah.

## Antrean M05-0: APEL 2026–2030 multi-tahun (BELUM DIUJI)

| ID | QA yang hanya ditulis untuk dijalankan setelah izin G0 | Status |
|---|---|---|
| QA-M05-0-01 | Registry memuat tahun 2026, 2027, 2028, 2029, 2030 tepat sekali | BELUM DIUJI |
| QA-M05-0-02 | Draft versi aturan berbeda setiap tahun | BELUM DIUJI |
| QA-M05-0-03 | Baseline 2026 butuh parity; tahun 2027–2030 masih butuh keputusan | BELUM DIUJI |
| QA-M05-0-04 | Tidak ada deadline, publikasi atau scoring otomatis diwariskan ke tahun berikut | BELUM DIUJI |
| QA-M05-0-05 | Tahun tak dikonfigurasi termasuk 2031 tidak memakai default 2030 | BELUM DIUJI |
| QA-M05-0-06 | Usulan aturan tidak menjadi approval/publikasi/izin ubah histori | BELUM DIUJI |
| QA-M05-0-07 | Nomor versi proposal tidak boleh dari tahun lain | BELUM DIUJI |
| QA-M05-0-08 | Tanggal/narasi usulan tidak sah ditolak | BELUM DIUJI |
| QA-M05-0-09 | Semua YYYY-MM valid untuk lima tahun dapat dinormalisasi | BELUM DIUJI |
| QA-M05-0-10 | Bulan invalid dan tahun di luar cakupan ditolak | BELUM DIUJI |
| QA-M05-0-11 | Puskeswan yang sama dapat melaporkan bulan sama pada tahun berbeda | BELUM DIUJI |
| QA-M05-0-12 | Duplikasi satu fasilitas/bulan ditolak tanpa overwrite | BELUM DIUJI |
| QA-M05-0-13 | Bulan kosong tetap BELUM_DILAPORKAN, bukan nol | BELUM DIUJI |
| QA-M05-0-14 | Laporan nol eksplisit berbeda dari bulan kosong | BELUM DIUJI |
| QA-M05-0-15 | Klaim laporan nol konflik dengan kegiatan ditolak | BELUM DIUJI |
| QA-M05-0-16 | Investigasi per kombinasi kejadian dan lokasi | BELUM DIUJI |
| QA-M05-0-17 | Pasangan kejadian/lokasi duplikat ditolak | BELUM DIUJI |
| QA-M05-0-18 | Ante+post pada satu hewan kurban dihitung sekali | BELUM DIUJI |
| QA-M05-0-19 | ID hewan kurban ganda ditolak | BELUM DIUJI |
| QA-M05-0-20 | Rekap belum lengkap tidak dianggap capaian setahun penuh | BELUM DIUJI |
| QA-M05-0-21 | Counter negatif, field asing, referensi bukti non-DEMO ditolak | BELUM DIUJI |
| QA-M05-0-22 | Nol tanpa deklarasi nol eksplisit ditolak | BELUM DIUJI |
| QA-M05-0-23 | Payload ledger yang diubah diam-diam ditolak | BELUM DIUJI |
| QA-M05-0-24 | Ringkasan terdiri dari lima baris tahun terpisah | BELUM DIUJI |
| QA-M05-0-25 | Seluruh baris memakai versi kebijakan draf berbeda | BELUM DIUJI |
| QA-M05-0-26 | Tidak ada ranking atau komparasi scoring resmi otomatis | BELUM DIUJI |
| QA-M05-0-27 | Fixture hanya memuat ID Puskeswan fiktif | BELUM DIUJI |
| QA-M05-0-28 | Laporan nol terhitung sebagai bulan melapor tetapi total nol | BELUM DIUJI |
| QA-M05-0-29 | Pemeriksaan satu kurban + satu investigasi berjumlah dua kejadian DEMO | BELUM DIUJI |
| QA-M05-0-30 | Bandingkan kategori dan angka dengan formulir Flask dan Juknis 2026 sebenarnya | RENCANA / BUTUH SUMBER |
| QA-M05-0-31 | Telaah aturan, tenggat, kategori, dukungan dan penilaian per tahun 2027–2030 | BUTUH KEPUTUSAN |
| QA-M05-0-32 | Autentikasi backend, revisi, bukti riil, akses lintas fasilitas, UI HP, ekspor | RENCANA / BELUM DIUJI |

**29 skenario Node tertulis, 0 dijalankan.** Tambahan QA-M05-0-30–32 adalah pekerjaan masa depan, bukan tes yang tersedia. [Spesifikasi M05-0](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M05_0_APEL_MULTIYEAR_2026_2030.md), [kode/fixture/tes](https://github.com/dvoriano/yandik-plus/tree/develop/yandik-foundation/drafts/m05-apel-multiyear). Tanpa CL/CI/tes/pengujian Flask sampai izin owner.

## Antrean M04-I6D: kompatibilitas Flask/APEL dan gerbang integrasi (BELUM DIUJI)

| ID | Pemeriksaan jika owner mengizinkan G0 | Status |
|---|---|---|
| QA-M04I6D-01 | Lima pintu terdokumentasi tetap kandidat, belum terbukti benar-benar terdaftar di Flask | BELUM DIUJI |
| QA-M04I6D-02 | Catatan review tidak menjadi izin deploy atau bukti autentikasi | BELUM DIUJI |
| QA-M04I6D-03 | ID rute benar tetapi path dipalsukan ditolak | BELUM DIUJI |
| QA-M04I6D-04 | Rute tak dikenal dan catatan duplikat ditolak | BELUM DIUJI |
| QA-M04I6D-05 | Klaim VERIFIED dari input catatan tidak diterima | BELUM DIUJI |
| QA-M04I6D-06 | Field tambahan seperti role klien ditolak | BELUM DIUJI |
| QA-M04I6D-07 | Pemeriksaan tidak memodifikasi daftar route asal | BELUM DIUJI |
| QA-M04I6D-08 | Dua belas gerbang I6C + 12 I6D selalu pending | BELUM DIUJI |
| QA-M04I6D-09 | Rencana tidak memberi izin integrasi, tulis atau deploy | BELUM DIUJI |
| QA-M04I6D-10 | Aturan APEL 2026, larangan input ganda dan fallback tercakup | BELUM DIUJI |
| QA-M04I6D-11 | Klaim `auth_verified` palsu ditolak | BELUM DIUJI |
| QA-M04I6D-12 | Schema rute/otorisasi palsu ditolak | BELUM DIUJI |
| QA-M04I6D-13 | Setiap gerbang memiliki asal I6C atau I6D dan bukti masih null | BELUM DIUJI |
| QA-M04I6D-14 | Catatan route tetap tidak mengurangi jumlah gerbang pending | BELUM DIUJI |
| QA-M04I6D-15 | Handoff kosong mempertahankan semua gerbang tidak tertutup | BELUM DIUJI |
| QA-M04I6D-16 | Catatan DEMO tidak dapat menyetujui atau mengubah Flask | BELUM DIUJI |
| QA-M04I6D-17 | Gate dan peran pemilik yang tidak dikenal ditolak | BELUM DIUJI |
| QA-M04I6D-18 | ID duplikat/format tidak sah ditolak | BELUM DIUJI |
| QA-M04I6D-19 | URL atau fragmen kredensial di free-text ditolak | BELUM DIUJI |
| QA-M04I6D-20 | Status APPROVED dan field izin tambahan ditolak | BELUM DIUJI |
| QA-M04I6D-21 | Plan yang mengklaim izin deploy ditolak | BELUM DIUJI |
| QA-M04I6D-22 | Audit source route Flask sebenarnya: method, decorators, response, CSRF, session | RENCANA / BUTUH IZIN |
| QA-M04I6D-23 | Fixture anonimisasi APEL 2026: 1 laporan/bulan, investigasi, kurban, nol dan tenggat | RENCANA / BELUM DIUJI |
| QA-M04I6D-24 | Parity dashboard/Data Saya/checklist/SDM, boundary wilayah, backup/restore dan SPBE | RENCANA / BUTUH KEPUTUSAN |

[Spesifikasi I6D](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I6D_FLASK_APEL_INTEGRATION_GATES.md). **21 skenario Node tertulis, 0 dijalankan**. Tidak ada inspeksi server Flask nyata, tes, CI, migrasi atau perubahan database produksi.

## Antrean M04-I6C: snapshot, recovery, retensi dan runbook (BELUM DIUJI)

| ID | Pemeriksaan setelah izin G0 | Status |
|---|---|---|
| QA-M04I6C-01 | Dua observasi DEMO konsisten tetapi tidak menyatakan atomisitas/izin cutover | BELUM DIUJI |
| QA-M04I6C-02 | Jumlah observasi harus tepat dua | BELUM DIUJI |
| QA-M04I6C-03 | Perubahan revisi sumber pada pembacaan kedua ditolak | BELUM DIUJI |
| QA-M04I6C-04 | Perubahan isi sumber walau nomor revisi sama ditolak | BELUM DIUJI |
| QA-M04I6C-05 | Target yang terisi di pembacaan kedua ditolak | BELUM DIUJI |
| QA-M04I6C-06 | Klaim manifest privileged/hash palsu ditolak | BELUM DIUJI |
| QA-M04I6C-07 | Struktur observasi/revisi tidak sah ditolak | BELUM DIUJI |
| QA-M04I6C-08 | Perencanaan tidak mengubah manifest/snapshot/inventaris input | BELUM DIUJI |
| QA-M04I6C-09 | Jurnal awal `may_write=false` dan `may_restore=false` | BELUM DIUJI |
| QA-M04I6C-10 | Lima tahap jurnal tersusun berurutan dengan chain checksum | BELUM DIUJI |
| QA-M04I6C-11 | Persetujuan palsu pada input atau jurnal ditolak | BELUM DIUJI |
| QA-M04I6C-12 | Revisi jurnal dan urutan tahap salah ditolak | BELUM DIUJI |
| QA-M04I6C-13 | Penelaah DEMO harus berbeda dari penyusun | BELUM DIUJI |
| QA-M04I6C-14 | Perubahan teks isi event historis terdeteksi | BELUM DIUJI |
| QA-M04I6C-15 | Perubahan hash, tip atau kehilangan event terdeteksi | BELUM DIUJI |
| QA-M04I6C-16 | Jurnal beku tidak dapat lanjut/aktivasi otomatis | BELUM DIUJI |
| QA-M04I6C-17 | ID event duplikat dan stale revision ditolak | BELUM DIUJI |
| QA-M04I6C-18 | Kegagalan source/target/backup/restore/jurnal/otorisasi menghentikan proses | BELUM DIUJI |
| QA-M04I6C-19 | Jenis insiden dan aktor/event/note tidak sah ditolak | BELUM DIUJI |
| QA-M04I6C-20 | Retensi mencakup kelas global dan per fasilitas tanpa payload | BELUM DIUJI |
| QA-M04I6C-21 | Retensi tidak memberi izin hapus/ekspor/purge termasuk saat hold DEMO | BELUM DIUJI |
| QA-M04I6C-22 | Hold hanya metadata dan tidak menentukan masa simpan | BELUM DIUJI |
| QA-M04I6C-23 | Hold fasilitas asing/duplikat ditolak | BELUM DIUJI |
| QA-M04I6C-24 | Scope retensi tidak sah dan status privileged ditolak | BELUM DIUJI |
| QA-M04I6C-25 | Perencanaan retensi tidak memutasi input atau mengeluarkan data arsip | BELUM DIUJI |
| QA-M04I6C-26 | Runbook memuat 12 gerbang masih BELUM_DIBUKTIKAN | BELUM DIUJI |
| QA-M04I6C-27 | Runbook tidak pernah mengizinkan eksekusi/cutover/deletion | BELUM DIUJI |
| QA-M04I6C-28 | Kesiapan atomik atau izin write palsu ditolak | BELUM DIUJI |
| QA-M04I6C-29 | Klaim kebijakan retensi disetujui tanpa bukti ditolak | BELUM DIUJI |
| QA-M04I6C-30 | Fingerprint jurnal berbeda dari manifest snapshot ditolak | BELUM DIUJI |
| QA-M04I6C-31 | Bukti snapshot transaksi DB asli, freeze/lock writer dan recheck atomic | RENCANA / BUTUH BUKTI |
| QA-M04I6C-32 | Backup off-host, restore drill, pemulihan gagal listrik, transaksi lintas fasilitas | RENCANA / BELUM DIUJI |
| QA-M04I6C-33 | Retensi resmi, legal hold, arsip dinas, keamanan SPBE, hak akses dan pencabutan sesi | BUTUH KEPUTUSAN |

[Spesifikasi M04-I6C](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I6C_SNAPSHOT_RECOVERY_RETENTION.md). **30 skenario Node tertulis, 0 dijalankan**; tidak ada backup, recovery, migrasi atau perubahan DB nyata.

## Antrean M04-I6B: identitas backend & inventaris read-only (BELUM DIUJI)

| ID | Pemeriksaan setelah izin G0 | Status |
|---|---|---|
| QA-M04I6B-01 | Admin DEMO memperoleh inventaris kosong yang sesuai kontrak I6A | BELUM DIUJI |
| QA-M04I6B-02 | Daftar ID fasilitas dan total empat tabel tanpa data payload/arsip | BELUM DIUJI |
| QA-M04I6B-03 | Semua statement modul berupa SELECT, tanpa mutasi/PRAGMA | BELUM DIUJI |
| QA-M04I6B-04 | Tidak ada sesi: tolak sebelum membuka provider DB | BELUM DIUJI |
| QA-M04I6B-05 | Akun tidak aktif/peran tidak dikenal: tolak | BELUM DIUJI |
| QA-M04I6B-06 | Global inventory ditolak bagi petugas, kab/kota, verifikator dan pimpinan | BELUM DIUJI |
| QA-M04I6B-07 | Puskeswan hanya dapat ringkasan revisi fasilitas sendiri | BELUM DIUJI |
| QA-M04I6B-08 | Puskeswan tak bisa membaca fasilitas lain meski satu wilayah | BELUM DIUJI |
| QA-M04I6B-09 | Kab/kota hanya fasilitas dalam cakupan wilayah | BELUM DIUJI |
| QA-M04I6B-10 | Pimpinan ditolak untuk detail fasilitas | BELUM DIUJI |
| QA-M04I6B-11 | Selector fasilitas berbentuk objek/role palsu ditolak | BELUM DIUJI |
| QA-M04I6B-12 | Perubahan sesi backend terbaca ulang pada pemanggilan berikut | BELUM DIUJI |
| QA-M04I6B-13 | Hitungan tabel tak konsisten dan ID ganda ditolak | BELUM DIUJI |
| QA-M04I6B-14 | Hitungan negatif atau payload/skema tidak sah ditolak | BELUM DIUJI |
| QA-M04I6B-15 | Adapter tidak tersedia dan callback tidak menghasilkan snapshot ditolak | BELUM DIUJI |
| QA-M04I6B-16 | Integrasi sesi Flask yang benar-benar terverifikasi, CSRF/revocation, read-only DB & audit | RENCANA / BUTUH KEPUTUSAN |
| QA-M04I6B-17 | Snapshot transaksi konsisten, perubahan sumber/target simultan, kontrol akses DB nyata | RENCANA / BELUM DIUJI |

[Spesifikasi M04-I6B](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I6B_BACKEND_READONLY_IDENTITY.md). **15 deklarasi skenario tertulis, 0 dijalankan**. Jangan menandai lolos dan jangan menyatakan gateway siap produksi.

## Antrean M04-I6A: preflight migrasi satu arah (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit G0 | Status |
|---|---|---|
| QA-M04I6A-01 | Manifest untuk seluruh fasilitas DEMO tanpa bocor isi snapshot | BELUM DIUJI |
| QA-M04I6A-02 | Digest stabil dan entri deterministik pada input sama | BELUM DIUJI |
| QA-M04I6A-03 | Pencocokan ulang tetap `may_write=false` dan bukan bukti asal data | BELUM DIUJI |
| QA-M04I6A-04 | Digest atau field manifest palsu ditolak | BELUM DIUJI |
| QA-M04I6A-05 | Perubahan sumber dengan nomor revisi sama menolak manifest usang | BELUM DIUJI |
| QA-M04I6A-06 | Perubahan nomor revisi sumber menolak manifest lama | BELUM DIUJI |
| QA-M04I6A-07 | Target dengan baris current, versions, events atau commands ditolak | BELUM DIUJI |
| QA-M04I6A-08 | Daftar fasilitas target tidak kosong ditolak | BELUM DIUJI |
| QA-M04I6A-09 | Inventaris target palsu, tambahan field dan mode non-DEMO ditolak | BELUM DIUJI |
| QA-M04I6A-10 | Revisi tidak sah dan sumber I4 tidak memenuhi kontrak ditolak | BELUM DIUJI |
| QA-M04I6A-11 | Ketidaksesuaian register arsip dan retired ID ditolak | BELUM DIUJI |
| QA-M04I6A-12 | Input sumber/target tidak termutasi selama preflight | BELUM DIUJI |
| QA-M04I6A-13 | Manifest tidak dapat mengangkat `official_authorization` menjadi benar | BELUM DIUJI |
| QA-M04I6A-14 | Provenance sumber, inventaris transaksi, peran/akses server, integrasi Flask/APEL | RENCANA / BUTUH KEPUTUSAN |
| QA-M04I6A-15 | Backup/restore, retensi, race kondisi sumber-target, atomic cutover multi-fasilitas | RENCANA / BELUM DIUJI |

[Spesifikasi M04-I6A](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I6A_MIGRATION_PREFLIGHT.md). **13 skenario tertulis, 0 dijalankan;** tidak ada migrasi nyata atau izin G0.

## Antrean M04-I5: ID generasi dan partisi per fasilitas (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit G0 | Status |
|---|---|---|
| QA-M04I5-01 | Proyeksi I4 memuat satu sumber/fasilitas, jejak arsip dan nomor sumber cocok | BELUM DIUJI |
| QA-M04I5-02 | Tolak paket campuran fasilitas, serah terima lintas fasilitas, relasi yatim dan ID ganda | BELUM DIUJI |
| QA-M04I5-03 | ID `DEMO-*-G0002` unik, konsisten di S10–S15 dan bukan ID terarsip | BELUM DIUJI |
| QA-M04I5-04 | Tidak membuka generasi tanpa arsip I4 atau kebutuhan M03 yang diverifikasi ulang | BELUM DIUJI |
| QA-M04I5-05 | Transisi tujuh tahap berurutan; replay akhir, restart paksa dan ID lama ditolak | BELUM DIUJI |
| QA-M04I5-06 | Sumber lama terarsip tidak berubah, referensi BAST hanya fiktif, keputusan resmi false | BELUM DIUJI |
| QA-M04I5-07 | Revisi `(facility_id,revision)` A/B independen logis, CAS stale writer per fasilitas | BELUM DIUJI |
| QA-M04I5-08 | Idempotensi `(facility_id,request_id)`, replay identik dan konflik payload ditolak | BELUM DIUJI |
| QA-M04I5-09 | Koreksi M03: ajukan, penelaah berbeda, sinkron metadata tepercaya serta data versi baru | BELUM DIUJI |
| QA-M04I5-10 | Perubahan sumber setelah generasi aktif diblokir tanpa menimpa paket dan histori | BELUM DIUJI |
| QA-M04I5-11 | Role/region, pimpinan agregat, akses historis per fasilitas dan larangan data sumber dari klien | BELUM DIUJI |
| QA-M04I5-12 | Rollback gagal audit/command, append-only trigger, sumber duplikat dan korupsi snapshot | BELUM DIUJI |
| QA-M04I5-13 | 25 skenario Node tertulis; belum dijalankan termasuk regresi I1–I4 | BELUM DIUJI |
| QA-M04I5-14 | SQLite multi-koneksi/file, performa locks, database backup/restore, migrasi online dan retensi | RENCANA |
| QA-M04I5-15 | Autentikasi/otorisasi Flask, API, SOP, keabsahan dokumen, generasi ketiga dan koreksi resmi | RENCANA / BUTUH KEPUTUSAN |

[Spesifikasi M04-I5](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I5_GENERATION_AND_PARTITIONS.md). CODE_ONLY tetap.

## Antrean M04-I4: gerbang aktivasi DEMO & tindak lanjut (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit G0 | Status |
|---|---|---|
| QA-M04I4-01 | Gerbang penolakan paket lintas fasilitas, cabang belum ditelaah atau baseline tidak ada | BELUM DIUJI |
| QA-M04I4-02 | Semua catatan S13–S15 (kirim, terima, rujukan BAST, monitoring) menghalangi aktivasi DEMO | BELUM DIUJI |
| QA-M04I4-03 | Dua tahap review berbeda; reviewer I4 bukan pemohon, pembuat cabang maupun reviewer I3 | BELUM DIUJI |
| QA-M04I4-04 | Pemeriksaan ulang sumber/cakupan/versi dan isi calon branch sebelum transaksi aktivasi | BELUM DIUJI |
| QA-M04I4-05 | Snapshot workspace aktif berubah, termasuk fasilitas lain, harus ditolak dan disiapkan ulang | BELUM DIUJI |
| QA-M04I4-06 | Arsip sidecar menyimpan sumber, paket, telaah dan jadwal lama; tabel versi tetap append-only | BELUM DIUJI |
| QA-M04I4-07 | ID dipensiunkan tidak boleh digunakan ulang; alur pasca-aktivasi tetap freeze | BELUM DIUJI |
| QA-M04I4-08 | Register tindak lanjut untuk jejak realisasi tidak menyentuh stok, pembayaran, BAST maupun status resmi | BELUM DIUJI |
| QA-M04I4-09 | Idempotensi, replay, ID permintaan bentrok, stale revision, aktivasi ganda dan rollback audit gagal | BELUM DIUJI |
| QA-M04I4-10 | Peran, wilayah, kondisi pengguna nonaktif, projection hanya metadata, tanpa kebocoran candidate/arsip | BELUM DIUJI |
| QA-M04I4-11 | 20 skenario Node ditulis, tidak dijalankan; ketergantungan I1–I3 juga perlu verifikasi regresi | BELUM DIUJI |
| QA-M04I4-12 | Koreksi formal dengan dokumen sah, ID baru, pecah transaksi per fasilitas, migrasi/backup/restore dan otorisasi server | RENCANA / BUTUH KEPUTUSAN |

[Spesifikasi M04-I4](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I4_ACTIVATION_AND_FOLLOWUP.md). CODE_ONLY tetap.

## Antrean M04-I3: rekonsiliasi lintas modul (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit G0 | Status |
|---|---|---|
| QA-M04I3-01 | Kandidat sumber valid melalui I2; versi mundur, isi versi sama, histori dan wilayah tidak sah ditolak | BELUM DIUJI |
| QA-M04I3-02 | Manifest beda kebutuhan dan relasi M03 → S10–S15 lengkap, tanpa pencocokan nama | BELUM DIUJI |
| QA-M04I3-03 | Paket lintas fasilitas menghasilkan alasan blokir, tanpa cabang yang memutus data fasilitas lain | BELUM DIUJI |
| QA-M04I3-04 | Cabang prospektif valid sementara workspace aktif dan histori lama identik | BELUM DIUJI |
| QA-M04I3-05 | `prepare_reconciliation` hanya setelah konflik dan dengan provider tepercaya | BELUM DIUJI |
| QA-M04I3-06 | Peran/territory: admin pembuat cabang, penelaah berbeda; pimpinan agregat tanpa akses detail | BELUM DIUJI |
| QA-M04I3-07 | Query dampak scoped tidak membocorkan snapshot/payload cabang atau source packet | BELUM DIUJI |
| QA-M04I3-08 | Idempotensi command, ID ganda, stale revision dan perubahan body | BELUM DIUJI |
| QA-M04I3-09 | `cabang_draf_tercatat` tetap memblokir aksi lanjut dan tidak mengubah versi sumber aktif | BELUM DIUJI |
| QA-M04I3-10 | Return branch dan pembahasan paket lintas fasilitas tidak menjadi aktivasi otomatis | BELUM DIUJI |
| QA-M04I3-11 | Trigger gagal event/rollback menjaga transaksi tanpa cabang setengah tersimpan | BELUM DIUJI |
| QA-M04I3-12 | Penanganan mixed packet, perubahan data profile-only, source_removed dan impact records | BELUM DIUJI |
| QA-M04I3-13 | 15 skenario Node tertulis; runtime/sintaks/SQLite/DOM belum dijalankan | BELUM DIUJI |
| QA-M04I3-14 | Aktivasi branch dan koreksi berantai, dokumen resmi/BAST, retensi dan pemulihan histori | RENCANA / BUTUH KEPUTUSAN |
| QA-M04I3-15 | Integrasi produksi/Flask, API auth/RBAC, kekonsistenan sumber APEL dan master Puskeswan | RENCANA |

[Spesifikasi M04-I3](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I3_RECONCILIATION.md). Status tetap CODE_ONLY.

## Antrean M04-I2: repository data terpadu (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04I2-01 | Baseline Node/node:sqlite, skema STRICT, JSON, foreign keys, koneksi ulang | BELUM DIUJI |
| QA-M04I2-02 | Revisi, snapshot, event dan idempotensi dalam transaksi; rollback jika event gagal | BELUM DIUJI |
| QA-M04I2-03 | Replay identik, reuse ID berbeda/aktor berbeda, versi stale dan retry | BELUM DIUJI |
| QA-M04I2-04 | Scope fasilitas/wilayah, lookup aktif, pimpinan agregat, deny role/field palsu | BELUM DIUJI |
| QA-M04I2-05 | Koreksi satu terbuka, pemisahan reviewer, return, freeze alur | BELUM DIUJI |
| QA-M04I2-06 | Sinkron provider tepercaya, versi dan scope, preservasi histori, binding stale | BELUM DIUJI |
| QA-M04I2-07 | Konflik tercatat, snapshot sumber lama tetap, freeze; resolusi konflik belum ada | BELUM DIUJI |
| QA-M04I2-08 | Trigger append-only, histori scope/limit, audit internal; ancaman SQL admin | BELUM DIUJI |
| QA-M04I2-09 | 16 deklarasi tes tertulis; coba ulang seluruh rantai I1 pada lingkungan isolasi | BELUM DIUJI |
| QA-M04I2-10 | Restart proses/file, concurrency lintas koneksi, crash, backup/migrasi, retensi | RENCANA |
| QA-M04I2-11 | API/sesi/RBAC server, batas input, sanitasi error, keamanan dan SOP | RENCANA |
| QA-M04I2-12 | Rekonsiliasi berantai dan APEL/foundation, partisi data, sumber asli | RENCANA |

[Spesifikasi M04-I2](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I2_DATA_FOUNDATION.md). CODE_ONLY tetap.

## Antrean M04-I1: integrasi fungsi lintas modul DEMO (BELUM DIUJI)

| ID | Pemeriksaan setelah izin owner eksplisit | Status |
|---|---|---|
| QA-M04I1-01 | Master/crosswalk unik, scope cocok, ID lokal bernamespace | BELUM DIUJI |
| QA-M04I1-02 | Fungsi M02/M03 menghasilkan sumber; validasi masalah, kebutuhan, metadata dan prioritas | BELUM DIUJI |
| QA-M04I1-03 | Penolakan kebutuhan belum terverifikasi, satuan asing, sumber usang | BELUM DIUJI |
| QA-M04I1-04 | Paket memakai kuantitas asal; perubahan versi/isi menghambat model | BELUM DIUJI |
| QA-M04I1-05 | Tujuh tahap S10–S15 satu state, urutan, tidak duplikat atau klaim resmi | BELUM DIUJI |
| QA-M04I1-06 | APEL nol vs tidak tersedia; SDM/profil kosong; agregat cakupan | BELUM DIUJI |
| QA-M04I1-07 | Proyeksi fasilitas/wilayah, pimpinan agregat, peran asing dan scope salah | BELUM DIUJI |
| QA-M04I1-08 | Jejak dukungan per fasilitas/satuan, tanpa bocor baris fasilitas lain | BELUM DIUJI |
| QA-M04I1-09 | UI periode/peran, langkah, reset, mobile, keyboard, error, XSS, tidak ada akses produksi | BELUM DIUJI |
| QA-M04I1-10 | 14 deklarasi Node tertulis, belum dijalankan | BELUM DIUJI |
| QA-M04I1-11 | Rekonsiliasi snapshot/fixture, ID sumber nyata, adapter Flask/APEL, API/RBAC/DB server | RENCANA |
| QA-M04I1-12 | Koreksi objek berantai, concurrency, audit dan dasar kelembagaan | RENCANA / BUTUH KEPUTUSAN |

[Spesifikasi M04-I1](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_I1_INTEGRATED_WORKSPACE.md). CODE_ONLY tetap.

## Antrean M04-S13–S15: siklus dukungan (BELUM DIUJI)

| ID | Pemeriksaan hanya setelah izin eksplisit | Status |
|---|---|---|
| QA-M04S13-01 | Rantai S10–S12, jadwal, ID, tujuan, satuan, sumber berubah | BELUM DIUJI |
| QA-M04S13-02 | Kirim parsial/kumulatif tidak melebihi jadwal; ID ganda ditolak | BELUM DIUJI |
| QA-M04S13-03 | Terima baik/rusak, total fisik, menunggu penerimaan, belum kirim | BELUM DIUJI |
| QA-M04S13-04 | Tanggal terima, jumlah invalid, field resmi palsu dan perubahan binding | BELUM DIUJI |
| QA-M04S14-01 | Penerimaan tersedia, satu fasilitas, ID/nomor unik, tanggal dan snapshot | BELUM DIUJI |
| QA-M04S14-02 | Tidak menduplikasi penerimaan, kondisi dipertahankan, status formal false | BELUM DIUJI |
| QA-M04S15-01 | Monitoring hanya barang baik, jumlah kondisi sesuai sumber, rusak terpisah | BELUM DIUJI |
| QA-M04S15-02 | Latest per baris, tanggal tidak ganda, input tidak berurutan, belum diamati | BELUM DIUJI |
| QA-M04S15-03 | Ringkasan per satuan, histori, tidak mutasi sumber, otorisasi palsu ditolak | BELUM DIUJI |
| QA-M04S13S15-01 | UI seluruh form, dropdown dinamis, reset, keyboard, HP, XSS, tidak ada I/O | BELUM DIUJI |
| QA-M04S13S15-02 | 24 skenario tertulis (8 per tahap), belum dieksekusi | BELUM DIUJI |
| QA-M04S13S15-03 | Adapter, koreksi, rekonsiliasi, audit server, akses wilayah dan penyimpanan | RENCANA |
| QA-M04S13S15-04 | Dasar resmi, stok, penyaluran, legalitas BAST dan monitoring kelembagaan | BUTUH KEPUTUSAN |

[Spesifikasi S13–S15](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S13_S15_SUPPORT_LIFECYCLE.md). CODE_ONLY tetap.

## Antrean M04-S12: rencana distribusi dukungan (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit | Status |
|---|---|---|
| QA-M04S12-01 | Paket fixture S10/telaah S11 cocok; jadwal kosong dan jumlah awal | BELUM DIUJI |
| QA-M04S12-02 | Tujuan dan satuan diwarisi dari baris sumber | BELUM DIUJI |
| QA-M04S12-03 | Jadwal parsial dan kumulatif tepat batas; tolak kelebihan | BELUM DIUJI |
| QA-M04S12-04 | Edit mengganti baris dan hapus mengurangi kuantitas terjadwal | BELUM DIUJI |
| QA-M04S12-05 | Sumber belum ditelaah, dikembalikan, berubah atau dihapus ditolak | BELUM DIUJI |
| QA-M04S12-06 | Snapshot paket/telaah berubah, versi, barang dan metadata | BELUM DIUJI |
| QA-M04S12-07 | ID ganda, tanggal invalid, metode asing, jumlah nol/negatif/pecahan ditolak | BELUM DIUJI |
| QA-M04S12-08 | Penolakan tujuan bebas, otorisasi dan field aktual palsu | BELUM DIUJI |
| QA-M04S12-09 | Ringkasan satuan dan sisa tidak dianggap stok/penerimaan | BELUM DIUJI |
| QA-M04S12-10 | Tidak mutasi fixture; generator deterministik | BELUM DIUJI |
| QA-M04S12-11 | UI tambah/ubah/hapus/reset, batas jumlah, keyboard, HP, aksesibilitas dan XSS | BELUM DIUJI |
| QA-M04S12-12 | Adapter, rekonsiliasi usang, kontrol akses, audit server | RENCANA |
| QA-M04S12-13 | Otorisasi/ketersediaan barang, SOP dan referensi dokumen eksternal sah | BUTUH KEPUTUSAN |
| QA-M04S12-14 | 14 skenario Node baru tertulis; tidak dijalankan | BELUM DIUJI |

[Spesifikasi M04-S12](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S12_SUPPORT_DISTRIBUTION_PLAN.md). CODE_ONLY tetap.

## Antrean M04-S11: telaah paket dukungan (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit | Status |
|---|---|---|
| QA-M04S11-01 | Snapshot paket S10 sah, kosong/asing ditolak | BELUM DIUJI |
| QA-M04S11-02 | Metadata keputusan/anggaran lengkap, tanggal valid, kode fiktif berbeda | BELUM DIUJI |
| QA-M04S11-03 | Metadata kosong dapat dikembalikan, tidak dapat dicatat untuk pembahasan | BELUM DIUJI |
| QA-M04S11-04 | Draf → ajukan → kembalikan → revisi → ajukan ulang → catat | BELUM DIUJI |
| QA-M04S11-05 | Pemisahan pelaku, acknowledgement dan larangan approve | BELUM DIUJI |
| QA-M04S11-06 | Validasi status dan riwayat, tidak mutasi fixture | BELUM DIUJI |
| QA-M04S11-07 | Perubahan versi, barang, kuantitas, judul atau hapus paket menandai stale | BELUM DIUJI |
| QA-M04S11-08 | Field financial/approval palsu ditolak; otorisasi selalu false | BELUM DIUJI |
| QA-M04S11-09 | Form, submitter, error, revisi, reset, keyboard, HP, XSS dan tidak ada I/O | BELUM DIUJI |
| QA-M04S11-10 | Adapter S2/S10, kontrol akses wilayah dan audit server | RENCANA |
| QA-M04S11-11 | Keaslian dokumen, kewenangan, DPA dan SOP | BUTUH KEPUTUSAN |
| QA-M04S11-12 | 12 skenario Node baru hanya tertulis, terpisah dari snapshot S9V | BELUM DIUJI |

[Spesifikasi M04-S11](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S11_SUPPORT_PACKAGE_REVIEW.md). CODE_ONLY tetap.

## Antrean M04-S10: rancangan paket dukungan (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04S10-01 | Fixture M04-S1 cocok dengan kontrak sumber, ID dan status | BELUM DIUJI |
| QA-M04S10-02 | Tiga sumber, dua terverifikasi DEMO, satu tidak eligible | BELUM DIUJI |
| QA-M04S10-03 | Rencana parsial, sisa per kebutuhan dan satuan tidak tercampur | BELUM DIUJI |
| QA-M04S10-04 | Akumulasi lintas paket tidak melebihi kebutuhan; edit tidak dihitung dua kali | BELUM DIUJI |
| QA-M04S10-05 | Hapus paket/baris hanya mengubah draf; input asli tetap | BELUM DIUJI |
| QA-M04S10-06 | Tolak ID asing/ganda, quantity invalid, field harga/approval, sumber non-demo | BELUM DIUJI |
| QA-M04S10-07 | Penolakan versi sumber berubah; rancang rekonsiliasi/revisi sebelum integrasi | BELUM DIUJI |
| QA-M04S10-08 | Form HP, keyboard, input jumlah, kesalahan, pilihan paket, state kosong dan XSS | BELUM DIUJI |
| QA-M04S10-09 | Tidak ada jaringan, storage, transaksi, sumber nyata atau keputusan/penyaluran otomatis | BELUM DIUJI |
| QA-M04S10-10 | Adapter M03, autentikasi/akses wilayah, audit dan transaksi serentak server | RENCANA / BELUM DIUJI |
| QA-M04S10-11 | Dasar program, SOP, keputusan alokasi dan pengadaan sah | BUTUH KEPUTUSAN |
| QA-M04S10-12 | 12 skenario baru hanya tertulis; lingkup S10 terpisah dari 192 skenario S9V | BELUM DIUJI |

[Spesifikasi M04-S10](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S10_SUPPORT_PACKAGE_PLANNING.md). CODE_ONLY tetap berlaku.

## Antrean M04-S9V: paket sesi QA berjenjang (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04S9V-01 | Regresi snapshot valid S9S observed_date → S9T snapshot_date → S9U; beda tanggal ditolak | BELUM DIUJI |
| QA-M04S9V-02 | Rantai fixture S9S–S9V dan 14 kebutuhan bukti | BELUM DIUJI |
| QA-M04S9V-03 | 17 suite, 192 deklarasi tertulis, path tepat dan tidak duplikat | BELUM DIUJI |
| QA-M04S9V-04 | Pembagian G1=12, G2=56, G3=124, setiap suite tepat sekali | BELUM DIUJI |
| QA-M04S9V-05 | Kriteria masuk, keluar, berhenti G0–G4; G5 terpisah | BELUM DIUJI |
| QA-M04S9V-06 | Tidak ada izin, commit eksekusi, bukti, hasil lulus, penutupan temuan atau izin deploy palsu | BELUM DIUJI |
| QA-M04S9V-07 | Format hasil per kasus, catat expected/observed, referensi cacat dan retest | BELUM DIUJI |
| QA-M04S9V-08 | Pemeriksaan manual browser/HP/keyboard/XSS tanpa data riil dan efek samping di luar scope | TERTUNDA IZIN |
| QA-M04S9V-09 | G0: izin owner eksplisit pada commit dan batas pengujian | BUTUH IZIN OWNER |
| QA-M04S9V-10 | G5: tata kelola, SOP/SPBE dan klasifikasi; keputusan owner tentang repo PUBLIC dan histori paparan | BUTUH KEPUTUSAN |

[Rencana sesi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9V_QA_SESSION_PLAN.md). Delapan skenario baru hanya ditulis dan tidak dijalankan. 192 bukan jumlah tes lulus. 

## Antrean M04-S9U: konsistensi kebutuhan bukti (BELUM DIUJI)

| ID | Pemeriksaan tertunda setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04S9U-01 | Rantai fixture S9S → S9T → S9U dan schema sesuai | BELUM DIUJI |
| QA-M04S9U-02 | Tepat 14 ID unik, enam kebutuhan gerbang dan delapan kebutuhan temuan | BELUM DIUJI |
| QA-M04S9U-03 | Kecocokan dua arah grup, ID, deskripsi, pendahulu, dan snapshot | BELUM DIUJI |
| QA-M04S9U-04 | Penolakan ID duplikat, hilang, asing dan uraian dimodifikasi | BELUM DIUJI |
| QA-M04S9U-05 | Tolak dokumen diterima, verifikasi, reviewer, izin dan keputusan palsu | BELUM DIUJI |
| QA-M04S9U-06 | G0 tidak memberi izin otomatis, G1–G4 tidak dijalankan, G5 telaah manusia | BELUM DIUJI |
| QA-M04S9U-07 | Tidak ada temuan ditutup, status PASS atau readiness score | BELUM DIUJI |
| QA-M04S9U-08 | Perbedaan struktur dan kelengkapan bukti riil tetap jelas | BELUM DIUJI |
| QA-M04S9U-09 | UI filter, ekspor teks, mobile, DOM, keyboard dan XSS | BELUM DIUJI |
| QA-M04S9U-10 | Tidak ada fetch, API, storage, upload atau pengiriman | BELUM DIUJI |
| QA-M04S9U-11 | Dua belas skenario tes baru ditulis, belum dijalankan | BELUM DIUJI |
| QA-M04S9U-12 | Total 172 sebelumnya + 12 = 184 skenario tertulis | BELUM DIUJI |
| QA-M04S9U-13 | Review SOP/SPBE, kearsipan, klasifikasi dan bukti resmi | BUTUH KEPUTUSAN |

[Spesifikasi M04-S9U](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9U_QA_EVIDENCE_CONSISTENCY.md). Mode CODE_ONLY tetap berlaku.

## Antrean M04-S9T: register kebutuhan bukti QA DEMO (BELUM DIUJI)

| ID | Pemeriksaan tertunda hingga izin eksplisit owner | Status |
|---|---|---|
| QA-M04S9T-01 | Impor fixture M04-S9S dan keluaran daftar 6 gerbang, 4 temuan, 14 permintaan bukti | BELUM DIUJI |
| QA-M04S9T-02 | Semua ID permintaan bukti unik dan tertaut ke gerbang/temuan yang tepat | BELUM DIUJI |
| QA-M04S9T-03 | Jenis bukti yang diminta identik dengan sumber M04-S9S | BELUM DIUJI |
| QA-M04S9T-04 | G0 tetap mensyaratkan izin owner, G1–G4 tidak dapat otomatis menjadi aktif | BELUM DIUJI |
| QA-M04S9T-05 | Semua status bukti diterima/diperiksa, jawaban, tugas dan keputusan resmi tetap false/null | BELUM DIUJI |
| QA-M04S9T-06 | Penolakan sumber yang mengaku already approved, executed atau findings closed | BELUM DIUJI |
| QA-M04S9T-07 | Penolakan baris bukti palsu, perubahan deskripsi, ID hilang/duplikat | BELUM DIUJI |
| QA-M04S9T-08 | Filter gerbang/temuan, rekap teks dan peringatan bahwa ini bukan hasil QA | BELUM DIUJI |
| QA-M04S9T-09 | UI layar HP, keyboard, aksesibilitas, DOM/XSS dan ketiadaan jaringan/storage | BELUM DIUJI |
| QA-M04S9T-10 | Total 162 tes tertulis sebelum S9T + 10 tes baru = 172 tertulis; tidak ada tes yang dijalankan selama milestone | BELUM DIUJI |
| QA-M04S9T-11 | Keputusan visibility repository, klasifikasi data dan histori paparan | BUTUH KEPUTUSAN OWNER |
| QA-M04S9T-12 | Penutupan temuan audit dan kesesuaian kelembagaan memerlukan bukti serta keputusan berwenang | BUTUH KEPUTUSAN |

[Spesifikasi M04-S9T](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9T_QA_EVIDENCE_REGISTER.md). CODE_ONLY tetap aktif.
## Antrean M04-S9S: tindak lanjut temuan statis dan preflight QA (BELUM DIUJI)

| ID | Bukti / pemeriksaan tertunda hingga izin eksplisit | Status |
|---|---|---|
| QA-M04S9S-01 | Cocokkan manifest impor S9F–S9Q dengan seluruh sumber model secara dua arah, termasuk S9I/G yang dipakai lintas modul | BELUM DIUJI |
| QA-M04S9S-02 | Pastikan regex pemeriksaan impor langsung benar dan bisa mendeteksi dependensi hilang maupun berlebihan | BELUM DIUJI |
| QA-M04S9S-03 | Periksa regresi STATIC-01: fingerprint catatan S9J menolak agenda berubah (fase, dependensi, peran, dokumen, urutan) | BELUM DIUJI |
| QA-M04S9S-04 | Jangan tutup STATIC-01/04 sebelum bukti tes diisolasi; STATIC-02 dan STATIC-03 tetap terbuka | BELUM DIUJI |
| QA-M04S9S-05 | G0: izin eksplisit owner, ruang lingkup, data sintetis dan batas lingkungan sebelum menjalankan tes | BUTUH IZIN OWNER |
| QA-M04S9S-06 | G1: pemeriksaan sintaks dan import/export semua modul di lingkungan terisolasi | TERTUNDA UJI |
| QA-M04S9S-07 | G2: unit kontrak S9F–S9J, perubahan sumber serta penolakan klaim persetujuan | TERTUNDA UJI |
| QA-M04S9S-08 | G3: alur fixture S9K–S9Q, 18 butir, 6 fungsi, 4 fase, pertanyaan/bukti dan relasi dependensi | TERTUNDA UJI |
| QA-M04S9S-09 | G4: HTML, DOM/XSS, network/storage, keyboard, mobile, aksesibilitas dan audit keamanan | TERTUNDA UJI |
| QA-M04S9S-10 | G5: pemeriksaan kelembagaan oleh pihak berwenang, SOP/SPBE, kearsipan, legalitas bukti | BUTUH KEPUTUSAN |
| QA-M04S9S-11 | Skenario preflight baru `tests/preflight.test.mjs` (10 kasus) hanya ditulis, bukan dijalankan | BELUM DIUJI |
| QA-M04S9S-12 | Total tes tertulis 152 lama + 10 baru = 162; 0 dijalankan selama milestone S9S, tanpa bukti PASS | BELUM DIUJI |
| QA-M04S9S-13 | Repo PUBLIC berdasarkan metadata 12 November; owner perlu menilai PRIVATE dan histori paparan | BUTUH KEPUTUSAN OWNER |

[Laporan dan register M04-S9S](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9S_QA_PREFLIGHT_AND_FINDINGS.md). MODE CODE_ONLY tetap berlaku; jangan mengeksekusi skenario tanpa izin owner.
## Antrean M04-S9R: audit statis 12 modul (BELUM DIUJI)

| ID | Pengujian yang ditunda sampai izin owner eksplisit | Status |
|---|---|---|
| QA-M04S9R-01 | Keberadaan 12 model, fixture, HTML, UI, file tes dan rantai dependensi | BELUM DIUJI |
| QA-M04S9R-02 | Import/export Node dari S9F–S9Q dan kontrak schema/builder | BELUM DIUJI |
| QA-M04S9R-03 | Regresi S9J: fase/dependensi/peran/dokumen/judul berubah membuat catatan lama ditolak | BELUM DIUJI |
| QA-M04S9R-04 | Tidak ada ID/pertanyaan/bahan hilang sepanjang 18 butir dan 6 fungsi | BELUM DIUJI |
| QA-M04S9R-05 | Urutan P0–P3, siklus dependensi, stale snapshot dan ID invalid | BELUM DIUJI |
| QA-M04S9R-06 | Larangan perubahan status bukti terverifikasi/tugas/keputusan/izin QA atau deploy | BELUM DIUJI |
| QA-M04S9R-07 | Browser/DOM, HTML, XSS, keyboard, screen reader, mobile dan teks panjang | BELUM DIUJI |
| QA-M04S9R-08 | Network/storage/side effect dan potensi data rahasia di kode produksi | BELUM DIUJI |
| QA-M04S9R-09 | Katalog tes: 140 skenario modul dan 12 skenario audit tambahan | BELUM DIUJI |
| QA-M04S9R-10 | Jalankan 12 tes audit static_contracts.test.mjs hanya setelah izin eksplisit | TERTUNDA UJI |
| QA-M04S9R-11 | Telaah SOP, SPBE, klasifikasi data, kewenangan penelaah dan arsip | BUTUH KEPUTUSAN |
| QA-M04S9R-12 | Pengubahan repo PRIVATE serta pemeriksaan histori paparan oleh owner | BUTUH KEPUTUSAN OWNER |

[Laporan M04-S9R](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9R_STATIC_CONSOLIDATION.md). Semua tes tetap tertunda.
## Antrean M04-S9Q: paket ringkasan pembahasan fase DEMO (BELUM DIUJI)

| ID | Pemeriksaan setelah izin owner eksplisit | Status |
|---|---|---|
| QA-M04S9Q-01 | Impor berantai fixture M04-S9P dan M04-S9M tanpa produksi/berkas asli | BELUM DIUJI |
| QA-M04S9Q-02 | Tepat 4 paket P0–P3, 18 butir unik, enam fungsi dan semua pertanyaan asal | BELUM DIUJI |
| QA-M04S9Q-03 | Urutan baca global M04-S9P tetap dipertahankan di tiap paket tanpa dianggap urutan eksekusi | BELUM DIUJI |
| QA-M04S9Q-04 | Semua permintaan bahan, referensi butir/revisi, pendahulu, judul, fase dan fungsi sesuai M04-S9M | BELUM DIUJI |
| QA-M04S9Q-05 | Pertanyaan ID/teks tidak diubah, semua status jawabannya kosong dan tidak disahkan | BELUM DIUJI |
| QA-M04S9Q-06 | Tiga contoh catatan kekurangan tetap fiktif; 15 kosong bukan hasil verifikasi atau tuntas | BELUM DIUJI |
| QA-M04S9Q-07 | Tolak perubahan snapshot/revisi/ID/phaseWaves, duplikat urutan dan referensi tak dikenal | BELUM DIUJI |
| QA-M04S9Q-08 | Tolak predecessor dengan urutan/kedalaman salah, perubahan lintas fungsi atau fase mundur | BELUM DIUJI |
| QA-M04S9Q-09 | Tolak klaim palsu bukti resmi, paket dikirim, rapat terjadi, tugas/keputusan/QA/deploy | BELUM DIUJI |
| QA-M04S9Q-10 | Snapshot stale memperingatkan, perubahan private tidak menandai review resmi | BELUM DIUJI |
| QA-M04S9Q-11 | Filter per fase/fungsi, empty state, rekap teks dan disclaimer batas kewenangan | BELUM DIUJI |
| QA-M04S9Q-12 | Dua belas skenario tests/packets.test.mjs ditulis tetapi BELUM DIJALANKAN | BELUM DIUJI |
| QA-M04S9Q-13 | UI 320–375px, keyboard/screen reader, teks panjang, XSS dan tanpa fetch/API/storage/submit | BELUM DIUJI |
| QA-M04S9Q-14 | Telaah fungsi resmi/keabsahan berkas, SOP/SPBE, tata naskah dan kearsipan | BUTUH KEPUTUSAN |
| QA-M04S9Q-15 | Regresi kode/fungsi dan staging/deploy hanya setelah owner memberi izin secara eksplisit | TERTUNDA UJI |

[Spesifikasi M04-S9Q](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9Q_PHASE_REVIEW_PACKETS.md). Mode CODE_ONLY tetap aktif.

## Antrean M04-S9P: indeks kesenjangan bahan dan urutan diskusi DEMO (BELUM DIUJI)

| ID | Pemeriksaan tertunda sampai izin owner eksplisit | Status |
|---|---|---|
| QA-M04S9P-01 | Rantai impor fixture M04-S9M → S9O → S9P tanpa produksi atau data asli | BELUM DIUJI |
| QA-M04S9P-02 | Tepat 18 butir/6 fungsi, ID matriks/pertanyaan/revisi/kebutuhan bahan cocok | BELUM DIUJI |
| QA-M04S9P-03 | Urutan topologis menempatkan semua pendahulu sebelum penerus, tie-break fase lalu ID | BELUM DIUJI |
| QA-M04S9P-04 | Lapis dependensi dan jumlah penerus langsung/tidak langsung konsisten dengan graph | BELUM DIUJI |
| QA-M04S9P-05 | Empat kelompok P0–P3 tidak boleh tampil sebagai tahap resmi telah dimulai | BELUM DIUJI |
| QA-M04S9P-06 | Tolak siklus satu fase, self-loop, ID pendahulu asing dan dependensi fase mundur | BELUM DIUJI |
| QA-M04S9P-07 | Tolak daftar rujukan lintas fungsi yang tidak sama dengan sumber | BELUM DIUJI |
| QA-M04S9P-08 | Tolak snapshot/revisi/ID/teks bahan matriks yang berbeda dengan handoff | BELUM DIUJI |
| QA-M04S9P-09 | Tiga catatan kekurangan DEMO/15 kosong tidak berubah menjadi temuan audit atau bukti lengkap | BELUM DIUJI |
| QA-M04S9P-10 | Sumber stale hanya peringatan; repo PRIVATE tidak memberi otorisasi | BELUM DIUJI |
| QA-M04S9P-11 | Nol bukti resmi, tugas, keputusan, izin QA/deploy; tidak ada skor prioritas atau readiness | BELUM DIUJI |
| QA-M04S9P-12 | Teks rekap dan filter fungsi/catatan kosong; semua 12 skenario Node ditulis tidak dijalankan | BELUM DIUJI |
| QA-M04S9P-13 | UI HP 320/375px, keyboard/screen reader, teks panjang, XSS dan tanpa API/storage/fetch | BELUM DIUJI |
| QA-M04S9P-14 | Kewenangan SOP, SPBE, kearsipan dan urutan penelaahan manusia tetap memerlukan keputusan instansi | BUTUH KEPUTUSAN |
| QA-M04S9P-15 | Uji regresi, keamanan, staging, kesiapan deploy setelah izin eksplisit owner | TERTUNDA UJI |

[Spesifikasi M04-S9P](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9P_MATERIAL_GAP_SEQUENCE.md). CODE_ONLY belum dicabut.

## Antrean M04-S9O: matriks persiapan bahan pembahasan DEMO (BELUM DIUJI)

| ID | Pemeriksaan tertunda sampai ada izin eksplisit pemilik | Status |
|---|---|---|
| QA-M04S9O-01 | Rantai impor fixture M04-S9M dan M04-S9N tetap sintetis CODE_ONLY | BELUM DIUJI |
| QA-M04S9O-02 | Cakupan enam fungsi/18 butir serta tepat satu permintaan bahan per butir | BELUM DIUJI |
| QA-M04S9O-03 | Catatan teks DEMO dibedakan dari dokumen diterima dan bukti resmi terverifikasi | BELUM DIUJI |
| QA-M04S9O-04 | Tiga catatan teks contoh / 15 kosong / nol bukti terverifikasi, tanpa klaim kelulusan | BELUM DIUJI |
| QA-M04S9O-05 | ID pertanyaan, revisi, fase, fungsi dan bahan diminta cocok dengan sumber | BELUM DIUJI |
| QA-M04S9O-06 | Menolak duplikasi/hilangnya ID pertanyaan dan perubahan jumlah pertanyaan | BELUM DIUJI |
| QA-M04S9O-07 | Menolak snapshot/revisi sumber yang berbeda, flag stale memberi peringatan | BELUM DIUJI |
| QA-M04S9O-08 | Status PRIVATE tidak otomatis mengesahkan bukti atau kesiapan integrasi | BELUM DIUJI |
| QA-M04S9O-09 | Menolak forged official answer, bukti diverifikasi, keputusan, tugas atau QA/deploy | BELUM DIUJI |
| QA-M04S9O-10 | Ringkasan dan filter fungsi/status catatan, termasuk empty state dan peringatan | BELUM DIUJI |
| QA-M04S9O-11 | UI 320/375px, keyboard, screen reader, panjang teks, XSS; tanpa API, storage, fetch, upload atau pengiriman | BELUM DIUJI |
| QA-M04S9O-12 | Dua belas skenario `tests/readiness.test.mjs` sudah ditulis, tidak dijalankan | BELUM DIUJI |
| QA-M04S9O-13 | Penelaahan manusia terkait kualitas bukti, SOP/SPBE, kearsipan dan kewenangan verifikasi | BUTUH KEPUTUSAN |
| QA-M04S9O-14 | QA regresi/staging/integrasi menunggu izin owner, tanpa menyentuh APEL historis | TERTUNDA UJI |

[Spesifikasi M04-S9O](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9O_EVIDENCE_READINESS_MATRIX.md). CODE_ONLY masih berlaku.

## Antrean M04-S9N: register pertanyaan belum terjawab DEMO (BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04S9N-01 | Rantai impor fixture M04-S9M hingga S9N tetap sintetis CODE_ONLY | BELUM DIUJI |
| QA-M04S9N-02 | Keenam fungsi, 18 butir sumber, seluruh pertanyaan terangkut tanpa duplikasi atau hilang | BELUM DIUJI |
| QA-M04S9N-03 | ID per pertanyaan stabil dan terhubung dengan urutan teks, fase dan revisi sumber | BELUM DIUJI |
| QA-M04S9N-04 | Seluruh jawaban tetap belum ada, tanpa penugasan resmi, keputusan, verifikasi, izin QA/deploy | BELUM DIUJI |
| QA-M04S9N-05 | Filter dua keadaan catatan kekurangan DEMO tidak menyamakan kolom kosong dengan bukti lengkap | BELUM DIUJI |
| QA-M04S9N-06 | Kebutuhan bukti dan rujukan pendahulu lintas fungsi cocok dengan M04-S9M | BELUM DIUJI |
| QA-M04S9N-07 | Snapshot stale memberi peringatan, perubahan visibility PRIVATE tidak mengesahkan isi | BELUM DIUJI |
| QA-M04S9N-08 | Tolak sumber dengan rapat/undangan/keputusan/verifikasi palsu dan total pertanyaan tidak cocok | BELUM DIUJI |
| QA-M04S9N-09 | Tolak ID ganda, pertanyaan kosong, rujukan asing atau relasi lintas fungsi berubah | BELUM DIUJI |
| QA-M04S9N-10 | Rekap sesuai filter fungsi/kekurangan, hasil kosong, peringatan bukan jawaban resmi | BELUM DIUJI |
| QA-M04S9N-11 | UI HP 320/375px, tabel scroll, keyboard, screen reader, teks panjang, XSS, tanpa API/storage/fetch | BELUM DIUJI |
| QA-M04S9N-12 | 12 skenario tests/questions.test.mjs ditulis tetapi tidak dieksekusi | BELUM DIUJI |
| QA-M04S9N-13 | Telaah kewenangan penelaah, tata naskah, SOP/SPBE, klasifikasi dokumen, arsip | BUTUH KEPUTUSAN |
| QA-M04S9N-14 | Regresi, QA keamanan dan staging/rollback hanya setelah izin eksplisit owner | TERTUNDA UJI |

[Spesifikasi M04-S9N](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9N_OPEN_QUESTIONS.md). CODE_ONLY tetap berlaku.

## Antrean M04-S9M: paket bahan telaah manusia DEMO (BELUM DIUJI)

| ID | Pemeriksaan sesudah izin eksplisit pemilik | Status |
|---|---|---|
| QA-M04S9M-01 | Rantai impor M04-S9I dan M04-S9L/S9K dari fixture synthetic CODE_ONLY tanpa produksi | BELUM DIUJI |
| QA-M04S9M-02 | Cakupan enam fungsi, 18 ID dan 18 kebutuhan bukti tanpa duplikasi/hilang | BELUM DIUJI |
| QA-M04S9M-03 | Seluruh pertanyaan dari M04-S9I terpelihara dan belum dinyatakan dijawab | BELUM DIUJI |
| QA-M04S9M-04 | Semua kebutuhan bukti, revisi dan rujukan dependensi cocok dengan sumber M04-S9L | BELUM DIUJI |
| QA-M04S9M-05 | Tiga usulan dan tiga catatan kekurangan fiktif, 15 butir tanpa catatan tidak dianggap selesai | BELUM DIUJI |
| QA-M04S9M-06 | Menolak mismatch source repo snapshot, flag stale yang berbeda, ID/fase/bukti palsu | BELUM DIUJI |
| QA-M04S9M-07 | Menolak klaim rapat/undangan, penelaah ditetapkan, keputusan, verifikasi atau izin tes dari sumber | BELUM DIUJI |
| QA-M04S9M-08 | Menolak rujukan antarfungsi keliru atau dependensi pada ID tak dikenal | BELUM DIUJI |
| QA-M04S9M-09 | Handoff_sent, official_assignment, official_review, official_decision, permission QA/deploy tetap nol/false | BELUM DIUJI |
| QA-M04S9M-10 | UI filter fungsi, rekap salin manual, empty state dan peringatan tidak menjadi surat/berita acara | BELUM DIUJI |
| QA-M04S9M-11 | UI HP 320/375px, keyboard, screen reader, teks panjang, XSS dan tanpa API/storage/fetch/submit | BELUM DIUJI |
| QA-M04S9M-12 | 12 skenario Node pada tests/handoff.test.mjs tertulis dan BELUM DIJALANKAN | BELUM DIUJI |
| QA-M04S9M-13 | Telaah fungsi pengampu, kewenangan kelembagaan, SOP/SPBE, klasifikasi bukti dan kearsipan | BUTUH KEPUTUSAN |
| QA-M04S9M-14 | Regresi keamanan, kesiapan QA/staging dan integrasi hanya setelah izin eksplisit owner | TERTUNDA UJI |

[Spesifikasi M04-S9M](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9M_HUMAN_REVIEW_HANDOFF.md). Mode CODE_ONLY tetap berlaku.

## Antrean M04-S9L: rekap lintas fungsi dan kekurangan bukti (BELUM DIUJI)

| ID | Pemeriksaan setelah owner memberi izin eksplisit | Status |
|---|---|---|
| QA-M04S9L-01 | Impor berantai M04-S9I→S9J→S9K→S9L hanya memakai fixture sintetis | BELUM DIUJI |
| QA-M04S9L-02 | Enam fungsi, 18 ID unik, semua rujukan sumber/fungsi/revisi cocok | BELUM DIUJI |
| QA-M04S9L-03 | Tiga contoh usulan dan tiga kekurangan DEMO, kosong tetap 'belum diisi' bukan 'cukup' | BELUM DIUJI |
| QA-M04S9L-04 | Kategori proposal+gap, hanya proposal, hanya gap, dua-duanya kosong akurat | BELUM DIUJI |
| QA-M04S9L-05 | Penghitungan per fungsi dan jumlah keseluruhan konsisten | BELUM DIUJI |
| QA-M04S9L-06 | Rujukan pendahulu lintas fungsi mengacu ke ID dikenal dan fungsi berbeda | BELUM DIUJI |
| QA-M04S9L-07 | Sumber stale memperingatkan, repo PRIVATE tidak berarti verifikasi resmi | BELUM DIUJI |
| QA-M04S9L-08 | Tolak ID/fungsi salah, dependensi asing, status usulan/totals palsu dan klaim official decision/assignment/verification | BELUM DIUJI |
| QA-M04S9L-09 | Semua tugas, keputusan, bukti terverifikasi, izin tes/deploy tetap nol/false | BELUM DIUJI |
| QA-M04S9L-10 | Filter per fungsi/kelas, empty state dan teks rekap tidak menyesatkan | BELUM DIUJI |
| QA-M04S9L-11 | UX HP 320/375px, tabel scroll, keyboard, screen reader, teks panjang, XSS dan tanpa API/storage/fetch | BELUM DIUJI |
| QA-M04S9L-12 | 12 skenario Node pada tests/recap.test.mjs sudah tertulis, BELUM DIJALANKAN | BELUM DIUJI |
| QA-M04S9L-13 | Telaah penanggung jawab proses tentang SOP/SPBE, kearsipan, klasifikasi bukti dan makna rekap | BUTUH KEPUTUSAN |
| QA-M04S9L-14 | Regresi, review izin testing dan staging/rollback hanya setelah keputusan owner eksplisit | TERTUNDA UJI |

[Dokumen M04-S9L](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9L_CROSS_FUNCTION_RECAP.md). Mode CODE_ONLY tidak berubah.

## Antrean M04-S9K: register usulan tindak lanjut DEMO (BELUM DIUJI)

| ID | Pemeriksaan tertunda setelah owner memberikan izin | Status |
|---|---|---|
| QA-M04S9K-01 | Rantai impor M04-S9I→S9J→S9K dengan fixture DEMO tanpa produksi | BELUM DIUJI |
| QA-M04S9K-02 | Enam fungsi dan 18 ID unik di register serta hubungan dengan butir sumber tepat | BELUM DIUJI |
| QA-M04S9K-03 | Hanya teks tindak lanjut terisi yang menghasilkan status USULAN_CONTOH, kekosongan bukan klaim selesai | BELUM DIUJI |
| QA-M04S9K-04 | Fixture 3 usulan fiktif dan 15 kosong, tanpa data riil atau identitas | BELUM DIUJI |
| QA-M04S9K-05 | Pertahankan fungsi, revisi catatan, fase, bukti, rujukan pendahulu dan dokumen sumber | BELUM DIUJI |
| QA-M04S9K-06 | Menolak mismatch snapshot repo, status stale tidak cocok, ID/fungsi/judul/bukti berubah | BELUM DIUJI |
| QA-M04S9K-07 | Menolak sumber dengan keputusan, rapat, penelaah/otorisasi atau bukti diverifikasi palsu | BELUM DIUJI |
| QA-M04S9K-08 | Status assigned_officer/deadline null; official review/decision/assignment/test/deploy false | BELUM DIUJI |
| QA-M04S9K-09 | Export teks menurut fungsi/status, aman jika hasil kosong dan dengan peringatan bukan tugas | BELUM DIUJI |
| QA-M04S9K-10 | UI desktop/HP 320-375px, label, filter, aksesibilitas keyboard, screen reader dan teks panjang | BELUM DIUJI |
| QA-M04S9K-11 | XSS dan larangan HTML dinamis, API, storage, fetch, unggah, notifikasi, tanda tangan, mutasi sumber | BELUM DIUJI |
| QA-M04S9K-12 | 12 skenario tes pada tests/followups.test.mjs tertulis, tidak dieksekusi | BELUM DIUJI |
| QA-M04S9K-13 | Review pemilik proses terkait batas penugasan, SOP/SPBE/arsip, bukti dan keputusan manusia | BUTUH KEPUTUSAN |
| QA-M04S9K-14 | Pelaksanaan QA/regresi/staging setelah izin eksplisit owner, tanpa menyentuh APEL historis | TERTUNDA UJI |

[Spesifikasi M04-S9K](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9K_PROPOSED_FOLLOWUPS.md). CODE_ONLY masih melarang tes.

## Antrean M04-S9J: catatan pembahasan contoh per fungsi (BELUM DIUJI)

| ID | Pemeriksaan tertunda setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04S9J-01 | Rantai impor dari M04-S9I hingga S9J hanya fixture sintetis, tidak tersambung produksi | BELUM DIUJI |
| QA-M04S9J-02 | Enam fungsi dan 18 butir tepat satu lembar masing-masing tanpa hilang/duplikat | BELUM DIUJI |
| QA-M04S9J-03 | Tiga kolom hanya berisi teks fiktif; nilai kosong, trim, panjang maksimal 500 dan kontrol karakter | BELUM DIUJI |
| QA-M04S9J-04 | Revisi demo bertambah tepat bila nilai berubah, histori tidak menimpa catatan lama, input tidak memutasi sumber | BELUM DIUJI |
| QA-M04S9J-05 | Perubahan tidak menambah revisi saat isinya sama, dan pengosongan kolom berfungsi | BELUM DIUJI |
| QA-M04S9J-06 | Menolak butir/fungsi tidak cocok, extra keys dan sumber yang berubah/stale tanpa konsistensi referensi | BELUM DIUJI |
| QA-M04S9J-07 | Menolak book non-DEMO, fake approval, fake meeting/decision, fake verified evidence dan unauthorized deploy | BELUM DIUJI |
| QA-M04S9J-08 | Tidak ada API, fetch, localStorage, DB, email, notifikasi, upload atau persistensi antar-reload | BELUM DIUJI |
| QA-M04S9J-09 | Reset ke buku DEMO kosong, limit 200 edit, dan kewajaran jejak revisi lokal | BELUM DIUJI |
| QA-M04S9J-10 | Rekap per fungsi/semua fungsi, teks panjang, empty state, label eksplisit bukan berita acara resmi | BELUM DIUJI |
| QA-M04S9J-11 | Responsif 320/375px, keyboard, fokus, pembaca layar, live region dan keamanan teks/XSS | BELUM DIUJI |
| QA-M04S9J-12 | Dua belas skenario pada tests/confirmation.test.mjs ditulis, TIDAK DIJALANKAN | BELUM DIUJI |
| QA-M04S9J-13 | Pemilik proses menilai batas penggunaan hasil pembahasan terhadap SOP, SPBE, arsip dan kewenangan | BUTUH KEPUTUSAN |
| QA-M04S9J-14 | Regresi, QA keamanan dan staging sesudah izin owner, tanpa mengubah perhitungan APEL historis | TERTUNDA UJI |

[Dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9J_DISCUSSION_CONFIRMATION.md). CODE_ONLY tetap melarang pengujian dan deployment.

## Antrean M04-S9I: agenda telaah per fungsi (SEMUA BELUM DIUJI)

| ID | Pemeriksaan setelah izin eksplisit owner | Status |
|---|---|---|
| QA-M04S9I-01 | Rantai impor M04-S9H→S9I hanya menggunakan fixture sintetik DEMO | BELUM DIUJI |
| QA-M04S9I-02 | Enam paket fungsi unik dan 18 butir tercakup tanpa duplikasi/hilang | BELUM DIUJI |
| QA-M04S9I-03 | Pengampu penyiap dan penelaah tetap usulan; tanpa nama atau surat tugas resmi | BELUM DIUJI |
| QA-M04S9I-04 | Semua butir membawa bukti diminta dan dependensi yang sama dengan M04-S9H | BELUM DIUJI |
| QA-M04S9I-05 | Pertanyaan telaah per item tidak hilang dan pertanyaan khusus SEC-01/QA tampak | BELUM DIUJI |
| QA-M04S9I-06 | Snapshot PUBLIC memunculkan peringatan klasifikasi; PRIVATE tidak mengesahkan keamanan | BELUM DIUJI |
| QA-M04S9I-07 | Sumber stale tetap memberi peringatan dan tidak mengubah status sumber | BELUM DIUJI |
| QA-M04S9I-08 | Non-DEMO, MODE LIVE, fake approval, keputusan/QA berjalan, ID duplikat atau pendahulu invalid ditolak | BELUM DIUJI |
| QA-M04S9I-09 | Seluruh undangan, rapat, notulen resmi, keputusan serta bukti terverifikasi tetap nol/false | BELUM DIUJI |
| QA-M04S9I-10 | Filter fungsi, hasil kosong, teks panjang, HP 320/375px, keyboard, fokus, screen reader | BELUM DIUJI |
| QA-M04S9I-11 | Tidak ada XSS, innerHTML dinamis, fetch, API, storage, pengiriman, unggah berkas atau mutasi sumber | BELUM DIUJI |
| QA-M04S9I-12 | Sebelas skenario tes Node pada tests/agendas.test.mjs ditulis, TIDAK DIJALANKAN | BELUM DIUJI |
| QA-M04S9I-13 | Penentuan fungsi/jabatan sebenarnya, tata naskah, SPBE, keamanan, kearsipan dan batas SOP | BUTUH KEPUTUSAN |
| QA-M04S9I-14 | QA regresi, penelaahan nyata, staging dan rollback hanya setelah izin eksplisit | TERTUNDA UJI |

[Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9I_FUNCTION_REVIEW_AGENDAS.md). CODE_ONLY tetap melarang tes dan deploy.

## Antrean M04-S9H: konsolidasi hambatan dan bahan bukti (BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S9H-01 | Rantai impor M04-S9F/G/H dengan fixture DEMO tanpa produksi | BELUM DIUJI |
| QA-M04S9H-02 | Seluruh 18 butir unik, pendahulu serta urutan sumber tetap konsisten | BELUM DIUJI |
| QA-M04S9H-03 | Bukti diminta, pengampu usulan dan penelaah usulan tidak diklaim sudah resmi | BELUM DIUJI |
| QA-M04S9H-04 | Snapshot PUBLIC menyoroti klasifikasi repo, PRIVATE tidak otomatis berarti aman | BELUM DIUJI |
| QA-M04S9H-05 | Source stale mengutamakan kaji ulang tanpa mengubah sumber | BELUM DIUJI |
| QA-M04S9H-06 | Dua topik tanpa pendahulu tetap tidak diberi izin eksekusi | BELUM DIUJI |
| QA-M04S9H-07 | Semua bukti, penelaah, keputusan, izin tes/deploy tetap nol/false | BELUM DIUJI |
| QA-M04S9H-08 | Penolakan data non-DEMO, duplicate, fake approval, invalid dependensi dan fase | BELUM DIUJI |
| QA-M04S9H-09 | Filter fase/perhatian, HP 320/375px, keyboard, fokus, screen reader dan pesan kosong | BELUM DIUJI |
| QA-M04S9H-10 | XSS/input teks, tanpa API, storage, fetch, data rahasia, notifikasi atau mutasi sumber | BELUM DIUJI |
| QA-M04S9H-11 | Sebelas skenario pada tests/triage.test.mjs tertulis, tidak dijalankan | BELUM DIUJI |
| QA-M04S9H-12 | Kesesuaian tupoksi, pengampu, SOP/SPBE, klasifikasi data, keamanan, arsip dan kewenangan | BUTUH KEPUTUSAN |
| QA-M04S9H-13 | QA regresi/keamanan/HP dan review staging setelah izin owner | TERTUNDA UJI |

[Spesifikasi M04-S9H](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9H_BLOCKER_TRIAGE.md). Mode CODE_ONLY tetap berlaku.

## Antrean M04-S9G: matriks ketergantungan prasyarat integrasi (BELUM DIUJI)

| ID | Rencana pemeriksaan setelah izin eksplisit | Status |
|---|---|---|
| QA-M04S9G-01 | Import berantai M04-S9F sampai S9G, fixture DEMO dan tanpa akses produksi | BELUM DIUJI |
| QA-M04S9G-02 | Tepat 18 butir, semua ID unik, fase P0–P3 lengkap, rujukan pendahulu dikenal | BELUM DIUJI |
| QA-M04S9G-03 | Topological order: setiap prasyarat muncul sebelum turunan langsung dan tidak melompat fase mundur | BELUM DIUJI |
| QA-M04S9G-04 | Penolakan ID asing, dependensi duplikat, self-loop, siklus, dan fase mundur | BELUM DIUJI |
| QA-M04S9G-05 | Hitungan jumlah hubungan langsung, lapisan serta downstream affected sesuai graph | BELUM DIUJI |
| QA-M04S9G-06 | Sumber non-DEMO, status selesai palsu, wave sudah dijalankan, dan izin tes otomatis ditolak | BELUM DIUJI |
| QA-M04S9G-07 | Sumber stale menjadi perhatian tanpa mengubah status M04-S9F dan tidak menyatakan layak integrasi | BELUM DIUJI |
| QA-M04S9G-08 | Snapshot PRIVATE/UNKNOWN tidak dianggap bukti keamanan atau izin deployment; PUBLIC memberi peringatan | BELUM DIUJI |
| QA-M04S9G-09 | Item tanpa pendahulu hanya usulan diskusi; seluruh authorized_to_act=false dan verified=false | BELUM DIUJI |
| QA-M04S9G-10 | UI HP 320/375px, keyboard, label, screen reader, overflow, filter fase/domain dan empty state | BELUM DIUJI |
| QA-M04S9G-11 | Input XSS/text, tidak ada innerHTML dinamis, fetch, storage, mutasi, API atau pengiriman | BELUM DIUJI |
| QA-M04S9G-12 | 11 skenario Node di tests/dependencies.test.mjs tertulis namun belum dijalankan | BELUM DIUJI |
| QA-M04S9G-13 | Telaah dependensi dengan pemilik proses, tupoksi, RACI, SPBE, keamanan, pengelola APEL dan pengampu IT | BUTUH KEPUTUSAN |
| QA-M04S9G-14 | Pengujian regresi M03/M04, review staging, audit dan rollback hanya setelah owner izinkan | TERTUNDA UJI |

[Dokumen M04-S9G](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9G_DEPENDENCY_PLAN.md). CODE_ONLY tetap berlaku, tidak ada CL/CI/tes/deploy.

## Antrean M04-S9F: prasyarat integrasi lintas modul (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S9F-01 | Impor berantai M04-S9C/S9D/S9E/S9F dengan data sintetis, tidak menyentuh produksi | BELUM DIUJI |
| QA-M04S9F-02 | Jumlah 18 prasyarat, ID unik, pembagian 6 kelompok dan rujukan sumber terdokumentasi | BELUM DIUJI |
| QA-M04S9F-03 | Semua item menampilkan butuh keputusan, belum dibuktikan, atau menunggu izin uji, tanpa status lulus otomatis | BELUM DIUJI |
| QA-M04S9F-04 | Tidak ada mutasi M04-S9E, APEL, master Profil/SDM, basis data atau API | BELUM DIUJI |
| QA-M04S9F-05 | Repo PUBLIC diperhatikan; snapshot PRIVATE sekalipun tidak menyatakan aman atau layak integrasi | BELUM DIUJI |
| QA-M04S9F-06 | Sumber M04-S9E berubah menampilkan perhatian, bukan kelulusan atau pembatalan otomatis | BELUM DIUJI |
| QA-M04S9F-07 | Menolak sumber non-DEMO, schema salah, agenda duplikat, mode uji/produksi yang dilarang | BELUM DIUJI |
| QA-M04S9F-08 | Empat gelombang P0-P3 tetap BELUM DIMULAI, tanpa jalur mengeksekusi tes dari UI | BELUM DIUJI |
| QA-M04S9F-09 | Export teks eksplisit menyatakan belum diverifikasi dan belum izin deploy | BELUM DIUJI |
| QA-M04S9F-10 | UI HP 320/375px, navigasi keyboard, filter, label, teks panjang, error, aksesibilitas dan XSS | BELUM DIUJI |
| QA-M04S9F-11 | Sepuluh skenario Node pada tests/checklist.test.mjs ditulis, belum dijalankan | BELUM DIUJI |
| QA-M04S9F-12 | Klasifikasi data, risiko repo publik, SPO/SOP, tupoksi, RACI, SPBE, retensi dan persetujuan pejabat | BUTUH KEPUTUSAN |
| QA-M04S9F-13 | Role/wilayah, integritas APEL historis, security review, staging, backup, rollback dan regresi setelah izin owner | TERTUNDA UJI |

[Dokumen](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9F_CROSS_MODULE_READINESS.md). Empat gelombang hanya rencana dan **seluruh pengujian tetap ditahan** oleh CODE_ONLY.

## Antrean M04-S9E: peta perhatian kelembagaan (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang ditunda | Status |
|---|---|---|
| QA-M04S9E-01 | Import berantai M04-S7/S8/S9/S9B/S9C/S9D/S9E dengan DEMO, tanpa backend | BELUM DIUJI |
| QA-M04S9E-02 | Seluruh agenda tetap tampil saat register M04-S9D kosong | BELUM DIUJI |
| QA-M04S9E-03 | Satu catatan M04-S9D dan agenda lain tanpa catatan dihitung tanpa duplikasi | BELUM DIUJI |
| QA-M04S9E-04 | Pembatalan tidak dianggap selesai dan tetap terlacak | BELUM DIUJI |
| QA-M04S9E-05 | Tenggat DEMO berdasar tanggal acuan manual, termasuk tanggal kalender invalid | BELUM DIUJI |
| QA-M04S9E-06 | Perubahan snapshot M04-S9C menandai semua agenda untuk peninjauan ulang | BELUM DIUJI |
| QA-M04S9E-07 | Klasifikasi status prioritas: stale, kosong, batal, terlambat, revisi, menunggu, draf, bahan | BELUM DIUJI |
| QA-M04S9E-08 | Semua catatan sebagai bahan tidak pernah menghasilkan status siap integrasi | BELUM DIUJI |
| QA-M04S9E-09 | Sumber bukan DEMO, ID agenda salah dan duplikasi ditolak | BELUM DIUJI |
| QA-M04S9E-10 | Tampilan HP 320/375px, keyboard, fokus, empty state, label, teks panjang dan status filter | BELUM DIUJI |
| QA-M04S9E-11 | Text injection/XSS dan tidak ada fetch, storage, mutasi register, endpoint atau pengiriman | BELUM DIUJI |
| QA-M04S9E-12 | Sembilan skenario tes Node yang ditulis pada tests/oversight.test.mjs belum dijalankan | BELUM DIUJI |
| QA-M04S9E-13 | Telaah tupoksi, pemilik proses, SPBE, keamanan, SOP, arsip, retensi dan wewenang | BUTUH KEPUTUSAN |
| QA-M04S9E-14 | Pengujian regresi lintas modul, autentikasi/DB/audit setelah izin owner | TERTUNDA UJI |

[Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9E_OVERSIGHT_BOARD.md). Kode belum dieksekusi, mode CODE_ONLY tetap berlaku.

## Antrean M04-S9D: catatan pembahasan kelembagaan (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S9D-01 | Import berantai M04-S8/S9/S9B/S9C/S9D dengan fixture sintetik DEMO | BELUM DIUJI |
| QA-M04S9D-02 | Semua agenda M04-S9C tetap terlihat jika register masih kosong | BELUM DIUJI |
| QA-M04S9D-03 | Satu catatan per agenda, kode unik, batas jumlah 40 dan histori tidak terhapus | BELUM DIUJI |
| QA-M04S9D-04 | Validasi kode DEMO, field berbahaya/unknown, teks minimum/maksimum dan tanggal kalender | BELUM DIUJI |
| QA-M04S9D-05 | Alur draf → telaah → perbaikan/revisi atau catat sebagai bahan; pembatalan beralasan | BELUM DIUJI |
| QA-M04S9D-06 | Penelaah berbeda dari sekretariat/penanggung jawab; bukan autentikasi riil | BELUM DIUJI |
| QA-M04S9D-07 | Snapshot agenda berubah menahan mutasi, namun daftar historis masih terbaca | BELUM DIUJI |
| QA-M04S9D-08 | Rekap total/terbuka/telat berdasarkan tanggal acuan manual, status sumber berubah | BELUM DIUJI |
| QA-M04S9D-09 | Semua catatan ditutup sebagai bahan tetap tidak menghasilkan status siap integrasi | BELUM DIUJI |
| QA-M04S9D-10 | Tampilan HP 320/375px, fokus, keyboard, reader, label, pesan error, filter dan status kosong | BELUM DIUJI |
| QA-M04S9D-11 | XSS/sanitasi teks, memori browser, tanpa API, mutasi M04-S9C, penyimpanan atau pengiriman | BELUM DIUJI |
| QA-M04S9D-12 | Delapan skenario tes pada tests/register.test.mjs yang sudah ditulis, belum dijalankan | BELUM DIUJI |
| QA-M04S9D-13 | Telaah struktur/tupoksi, SOP, kewenangan, retensi, SPBE, keamanan, klasifikasi data | BUTUH KEPUTUSAN |
| QA-M04S9D-14 | Keputusan/perubahan repo PRIVATE 14 Nov masih rencana sampai metadata terverifikasi | TERTUNDA |
| QA-M04S9D-15 | Uji API/DB/otorisasi serta persetujuan owner untuk menjalankan QA lintas modul | TERTUNDA UJI |

[Dokumen M04-S9D](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9D_DISCUSSION_NOTES.md). Kode MODE CODE_ONLY tanpa pengujian/CI/CL.

## Antrean M04-S9C: agenda telaah kelembagaan dan akses repository (BELUM DIUJI)

| ID | Pemeriksaan | Status |
|---|---|---|
| QA-M04S9C-01 | Import M04-S7/S8/S9/S9B/S9C dan fixture DEMO tanpa backend | BELUM DIUJI |
| QA-M04S9C-02 | Tepat 10 persyaratan wajib masuk agenda sekalipun bahan DEMO tersedia | BELUM DIUJI |
| QA-M04S9C-03 | Repo PUBLIC teramati diberi perhatian dan tidak mengubah setting GitHub | BELUM DIUJI |
| QA-M04S9C-04 | Status PRIVATE/UNKNOWN tetap memerlukan penetapan manusia, tidak otomatis siap | BELUM DIUJI |
| QA-M04S9C-05 | Tanggal observasi invalid dan label visibilitas di luar kontrak ditolak | BELUM DIUJI |
| QA-M04S9C-06 | Ringkasan sumber usang dan perubahan katalog tidak disembunyikan | BELUM DIUJI |
| QA-M04S9C-07 | Setiap baris memiliki rujukan, pengampu usulan dan daftar bukti tanpa menerbitkan keputusan | BELUM DIUJI |
| QA-M04S9C-08 | Semua status bersifat belum diputuskan; tidak ada atribut approval/SOP/anggaran/BAST | BELUM DIUJI |
| QA-M04S9C-09 | UI HP 320/375px, keyboard, label, error, status dan filter kelompok | BELUM DIUJI |
| QA-M04S9C-10 | Sanitasi teks, tanpa innerHTML dinamis, fetch, storage, perubahan sumber atau pengiriman | BELUM DIUJI |
| QA-M04S9C-11 | Tujuh skenario Node di file draft tests/decision_matrix.test.mjs ditulis, belum dijalankan | BELUM DIUJI |
| QA-M04S9C-12 | Pemilik repo memutuskan privacy/klasifikasi dan penanganan kemungkinan paparan historis | BUTUH KEPUTUSAN |
| QA-M04S9C-13 | Pengampu institusi menguji kecocokan tupoksi/RACI/SOP/arsip/keamanan/SPBE | BUTUH KEPUTUSAN |
| QA-M04S9C-14 | Pengujian fungsional/regresi setelah izin eksplisit owner, tanpa mengubah produksi | TERTUNDA UJI |

[Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9C_INSTITUTIONAL_REVIEW.md) · [kajian akses](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/REPOSITORY_ACCESS_DECISION.md). Mode CODE_ONLY tetap berlaku.

## Antrean M04-S9B: rekap eksekutif kelembagaan (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang perlu dilakukan | Status |
|---|---|---|
| QA-M04S9B-01 | Impor berantai M04-S7/S8/S9/S9B dan fixture DEMO tanpa memerlukan sumber produksi | BELUM DIUJI |
| QA-M04S9B-02 | Tepat 12 unsur, 10 wajib/2 opsional, status bahan tersedia bukan bukti telah disahkan | BELUM DIUJI |
| QA-M04S9B-03 | Seluruh kekurangan wajib yang belum diperiksa/perlu klarifikasi tetap terlihat walau tanpa register aktif | BELUM DIUJI |
| QA-M04S9B-04 | Hubungan temuan ketiga jenis sumber dengan perbaikan, penanggung jawab, keluaran, status dan histori | BELUM DIUJI |
| QA-M04S9B-05 | Jumlah item aktif, menunggu telaah, revisi, terlambat berdasar tanggal manual dan sumber berubah benar | BELUM DIUJI |
| QA-M04S9B-06 | Docket M04-S8 atau SOP M04-S7 yang berubah mendapat penanda tanpa menutup atau mengubah register | BELUM DIUJI |
| QA-M04S9B-07 | Input invalid, tanggal kalender tidak sah dan sumber non-DEMO/gagal validasi ditolak | BELUM DIUJI |
| QA-M04S9B-08 | Empty state, semua catatan tertutup, katalog kosong, filter tanpa hasil, keluaran teks paparan | BELUM DIUJI |
| QA-M04S9B-09 | UI HP 320/375px, urutan keyboard, label, pembaca layar, fokus, pesan error, teks panjang | BELUM DIUJI |
| QA-M04S9B-10 | Tidak ada script injection melalui teks, mutasi M04-S8/M04-S9, storage, API atau pengiriman | BELUM DIUJI |
| QA-M04S9B-11 | Status kesiapan tetap BELUM DINILAI, termasuk bila tidak ada item aktif atau semua item ditutup | BELUM DIUJI |
| QA-M04S9B-12 | Telaah tupoksi, pemilik proses, tata naskah, SOP, retensi, keamanan, SPBE dan akuntabilitas | BUTUH KEPUTUSAN |
| QA-M04S9B-13 | Autentikasi, kontrol akses wilayah, DB, audit persisten dan keamanan API untuk integrasi nanti | TERTUNDA UJI |

[Spesifikasi](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9B_EXECUTIVE_BRIEFING.md). Tidak ada eksekusi tes maupun CI/CL.

## Antrean M04-S9: register tindak lanjut kelembagaan (SEMUA BELUM DIUJI)

| ID | Pemeriksaan yang ditunda | Status |
|---|---|---|
| QA-M04S9-01 | Impor lintas M04-S1/S2/S3/S5/S6/S7/S8/S9 dan fixture DEMO | BELUM DIUJI |
| QA-M04S9-02 | Sumber M04-S8 belum ditelaah, bukan DEMO atau SOP M04-S7 usang harus ditolak | BELUM DIUJI |
| QA-M04S9-03 | Tiga jenis temuan, validasi ID checklist/usulan/kode DEMO topik diskusi | BELUM DIUJI |
| QA-M04S9-04 | Duplikasi item aktif dari sumber sama, ID unik serta kapasitas 35 temuan | BELUM DIUJI |
| QA-M04S9-05 | Validasi deskripsi, dampak, rencana perbaikan, keluaran, penanggung jawab dan tanggal | BELUM DIUJI |
| QA-M04S9-06 | Draf/revisi, catat penugasan, mulai, progres, hasil, return/revise/close dan pembatalan | BELUM DIUJI |
| QA-M04S9-07 | Pemisahan koordinator, petugas dan reviewer DEMO; bukan autentikasi resmi | BELUM DIUJI |
| QA-M04S9-08 | Sumber berubah atau temuan tidak relevan membuat tindakan tertahan | BELUM DIUJI |
| QA-M04S9-09 | Histori tidak hilang, hasil/bukti hanya metadata, catatan ditutup bukan syarat resmi terpenuhi | BELUM DIUJI |
| QA-M04S9-10 | Rekap tanggal acuan manual, aktif/tertunda/telaah/stale, kasus data kosong dan filter | BELUM DIUJI |
| QA-M04S9-11 | Semua catatan ditutup tidak membuat hasil siap integrasi, SOP sah atau anggaran disetujui | BELUM DIUJI |
| QA-M04S9-12 | UI HP 320/375px, keyboard, pembaca layar, form kode topik DEMO dan pesan kesalahan | BELUM DIUJI |
| QA-M04S9-13 | Pembatasan akses, integritas data, XSS, input berbahaya dan tidak ada pengiriman/persistensi | BELUM DIUJI |
| QA-M04S9-14 | Proses kelembagaan nyata, SPBE, kewenangan, arsip, SOP dan tata naskah | BUTUH KEPUTUSAN |
| QA-M04S9-15 | Autentikasi/DB, audit tahan perubahan, keamanan API dan dokumen resmi | TERTUNDA UJI |

[Spesifikasi M04-S9](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S9_INSTITUTIONAL_FOLLOWUP.md). Tidak ada eksekusi kode/tes baru.

## Antrean M04-S8: kesiapan SOP dan perubahan unit (SEMUA BELUM DIUJI)

| ID | Pemeriksaan tertunda | Status |
|---|---|---|
| QA-M04S8-01 | Import berantai M04-S1/S2/S3/S5/S6/S7/S8 dan fixtures | BELUM DIUJI |
| QA-M04S8-02 | Sumber M04-S7 harus `dicatat_untuk_bahan_sop` dan versi tepat | BELUM DIUJI |
| QA-M04S8-03 | 12 unsur, 10 wajib/2 opsional, ID unik dan rekap | BELUM DIUJI |
| QA-M04S8-04 | Bukti `DEMO-`, alasan, pilihan tidak berlaku hanya bagi opsional | BELUM DIUJI |
| QA-M04S8-05 | Berkas parsial dapat diajukan tanpa status pengesahan/siap produksi | BELUM DIUJI |
| QA-M04S8-06 | Usulan unit tambah/ubah/nonaktif, ID, profil dan no-duplicate aktif | BELUM DIUJI |
| QA-M04S8-07 | Dampak alur M04-S6, RACI M04-S7, SOP/arsip, rollback tertulis | BELUM DIUJI |
| QA-M04S8-08 | Telaah usulan, pengembalian dan revisi dengan histori tidak hilang | BELUM DIUJI |
| QA-M04S8-09 | Telaah checklist dan katalog terpisah, penelaah bukan penyusun | BELUM DIUJI |
| QA-M04S8-10 | Perubahan source/versi menahan pencatatan dan penelaahan | BELUM DIUJI |
| QA-M04S8-11 | Katalog sumber tidak dimutasi, tidak ada apply SOP/approval bantuan/BAST | BELUM DIUJI |
| QA-M04S8-12 | Input tidak sah, teks baca-saja, kebersihan/privasi data DEMO | BELUM DIUJI |
| QA-M04S8-13 | HP 320/375px, keyboard, pembaca layar dan kontrol form tersembunyi | BELUM DIUJI |
| QA-M04S8-16 | Membuka kembali unsur `bahan_tersedia`: referensi bukti DEMO terisi dan kolom dapat diedit; selain status itu kolom dinonaktifkan | BELUM DIUJI |
| QA-M04S8-14 | Tupoksi, arsip, tata naskah, SPBE dan pemilik kewenangan | BUTUH KEPUTUSAN |
| QA-M04S8-15 | Integrasi akun riil, API/DB, audit dan approval resmi di luar demo | TERTUNDA UJI |

[Dokumen M04-S8](https://github.com/dvoriano/yandik-plus/blob/develop/yandik-foundation/docs/M04_S8_SOP_GOVERNANCE.md). Tidak ada pengujian dijalankan.


## Antrean lintas modul yang belum diujikan
- Flask legacy belum tersedia lengkap di repo; perlu audit integrasi, startup dan regresi APEL jika sudah tersedia.
- Akun/otorisasi API per wilayah, audit persisten, CSRF, password reset dan akses bukti.
- Pengguna nonteknis di HP fisik dan jaringan terbatas.
- M04-S1 sampai S9: kode draft administrasi, referensi, tindak lanjut, dashboard, eskalasi, matriks/rute, katalog RACI, kesiapan SOP dan register koreksi kelembagaan tersimpan, **BELUM DIUJI**; keputusan resmi, anggaran, distribusi dan BAST M04-S10+ tetap RENCANA.

**Terakhir lulus sebelum mode kode-saja:** M03-S3, [GitHub Actions 176 tes SUCCESS](https://github.com/dvoriano/yandik-plus/actions/runs/42939237270). Itu **bukan** pengujian M03-S4 atau kode draft berikutnya.

## Cara menutup backlog (nanti)
1. Dapatkan instruksi eksplisit: "boleh mulai uji".
2. Inventaris semua commit berlabel **BELUM DIUJI**, urutkan lintas modul.
3. Sisir review statis, keamanan, lalu tes modular, baru E2E/GitHub Actions jika anggaran dan izin memungkinkan.
4. Bila ada kegagalan, perbaiki tanpa menghapus bukti temuan.
5. Hanya setelah bukti lulus, ubah status tiap item dan kaitkan tautan pemeriksaan di ROADMAP/WORKLOG.
