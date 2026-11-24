# K4 | Kontrak integrasi backend dan data YANDIK+ 2026–2030

**24 November 2026 | KODE DITULIS, BELUM DIUJI.** Dokumen ini melengkapi M01-S2, M00-G1–G9 dan M04-I2–I5; bukan pengganti schema produksi, migrasi otomatis, atau API Flask yang aktif. Database SQLite hanya kandidat rehearsal; engine produksi diputuskan sesudah audit source yang diizinkan. Tidak ada koneksi database atau HTTP.

## Artefak
- [Katalog 15 resource / usulan jalur API](../drafts/yandik-backend-contract/resources.json): grain, sumber, cakupan, batas write; seluruh path PROPOSED_NOT_BOUND.
- [Rancangan DDL inti](../drafts/yandik-backend-contract/schema.sql): 16 tabel logis, constraint identitas/wilayah, grant, provenance, kandidat crosswalk, envelope revisi, periode APEL, inventaris, interval SDM, referensi dokumen/bukti, audit dan idempotensi. DDL tidak dieksekusi; belum skema typed domain lengkap.
- [Kontrak Python](../drafts/yandik-backend-contract/contract.py): usulan evaluasi role/objek/revisi, reviewer berbeda, konversi tanggal penempatan dan kandidat crosswalk; selalu may_execute=false. Tidak ada login, penulis DB, handler HTTP, atau CRUD generik.
- [22 QA unit](../drafts/yandik-backend-contract/test_contract.py) ditulis, 0 dijalankan; SQL/integrasi masih perlu QA tersendiri.

## Pemetaan domain
- **MOD-00 core**: Master organisasi/wilayah/fasilitas dan grant; grain identity; sumber masterdata.py; M00-G1–G9; cakupan server_identity.
- **MOD-01 profiles**: Profil dan inventaris per fasilitas/tahun/versi katalog; grain facility_year; sumber M01-S2; personnel-model; inventory-model; cakupan facility.
- **MOD-02 apel**: Laporan dan revisi per fasilitas/bulan; ledger terpisah; grain facility_month; sumber M05-0/1/14/16; cakupan facility.
- **MOD-03 personnel**: Tenaga dan interval penempatan; grain staff_placement; sumber M01-S2; M05-15; personnel-model; cakupan facility.
- **MOD-04 support**: Kebutuhan, paket, distribusi, serah terima, pemantauan; grain support_case; sumber M04-I1–I5; cakupan independent.
- **MOD-05 medicine**: Sarana dan riwayat inspeksi obat; grain inspection; sumber M06-S1; G1; cakupan region.
- **MOD-06 practice**: Sarana dan inspeksi praktik; grain inspection; sumber M07-S1; G1; cakupan region.
- **MOD-07 surveillance**: Event dan investigasi; agregasi sensitif; grain event; sumber M13-S1–S3; G1–G8; cakupan region.
- **MOD-08 certificates**: Permohonan internal dan rujukan dokumen resmi; grain request; sumber M14-S1; G1; cakupan region.
- **MOD-09 coaching**: Kegiatan, peserta, hasil, tindak lanjut; grain activity; sumber coaching-model; cakupan facility.
- **MOD-10 documents**: Naskah, versi sumber, metadata bukti; grain document_version; sumber paperless-model; cakupan facility.
- **MOD-11 leadership**: Agregat berperiode dan cakupan sumber; grain metric_snapshot; sumber leadership-model; cakupan aggregate.
- **MOD-12 gis**: Lokasi institusi dan agregat berpresisi terbatas; grain location_layer; sumber gis-model; cakupan aggregate.
- **MOD-13 library**: Referensi, versi, sumber dan telaah; grain reference_version; sumber library-model; cakupan catalog.
- **MOD-14 notifications**: Pengingat, preferensi dan antrean perintah; grain recipient_event; sumber notification-model; field-queue; cakupan recipient.
Inventaris adalah bagian MOD-01; path profiles mencakup subresource yang masih perlu spesifikasi typed terpisah. Tidak menambah modul ke-16. Resource scope independent, aggregate, catalog, recipient, dan server_identity belum ditangani evaluator; default deny. Empat register pengawasan tetap baca-saja, tidak ada penerbitan resmi. Role pengawas khusus dan matriks kelembagaan perlu keputusan; tidak diberikan akses otomatis.

## Relasi dan transaksi yang harus diterapkan nanti
Wilayah → fasilitas → record domain → revisi → bukti dan audit. Identitas pengguna → grant wilayah/fasilitas. Source manifest → revisi dan kandidat crosswalk. Dokumen → revisi sumber yang persis. Penempatan menggunakan interval [mulai, akhir eksklusif); foundation M01-S2 memakai akhir inklusif, konversi +1 hari hanya untuk sumber yang terbukti inklusif dan simpan nilai asli. Rekonsiliasi M04/M05 dan ledger/workflow membutuhkan keputusan manusia; jangan join dengan nama atau ID tanpa namespace.

- Route GET /api/v1/{resource} dan detail /{id} usulan, bukan route aplikasi. Mutasi kelak POST /commands: command_id, expected_revision, action, typed payload. Tidak boleh menerima actor_id/role/grant dari klien. Server mengambil session sah, grant aktif, objek dan wilayah dari master, lalu validasi domain, CSRF dan batas field. Agregat pimpinan tidak mengungkap detail.
- Status usulan: 401 tanpa sesi, 403/404 untuk akses/objek tak berhak (hindari enumerasi), 409 konflik revisi atau command ID dengan payload lain, 422 domain invalid, 200/201 sukses hanya setelah commit. Response allowlist; tidak mengirim hash password atau raw source.
- Perintah: autentikasi dan otorisasi ulang termasuk retry; mulai transaksi, cari command actor+ID dan bandingkan digest request; cek revisi, domain, source; update head bersyarat, tulis revisi, audit dan receipt satu transaksi. Replay identik tidak menggandakan event. Rollback seluruhnya saat gagal. Audit G5/G7 lama tidak dimigrasi atau diklaim kompatibel. Skema ini hanya envelope; writer, field validation, penyimpanan typed payload dan audit keamanan belum dibuat.
- Missing ≠ 0. Butir inventaris bukan aset unik. Ledger dan workflow terpisah sampai rekonsiliasi. Tidak ada publikasi otomatis, persetujuan atau BAST sah.
- Bukti hanya metadata sintetis; tidak ada path/file publik. Trigger bukan anti-tamper admin. Perlu backup/restore, retensi, revokasi, rate limit, keamanan upload dan pengujian konkurensi.
- DDL tidak memastikan seluruh invariant: business key dan resource harus cocok dengan typed table, sumber/dokumen harus satu scope sah, tanggal kalender/penempatan harus divalidasi, head/revisi/audit harus atomik. Jangan menerapkan langsung ke DB apa pun.

## Gate migrasi
1. Penuhi [gerbang penerimaan source](M00_FLASK_SOURCE_ACCEPTANCE_GATE_2026_2030.md). Inventaris route, model, schema, auth dan dependency asli belum ada.
2. Mapping field dan grain, tipe/null, keunikan, namespace/ID, source version, klasifikasi dan pemilik; buat tabel mapping berizin di lingkungan terbatas. Jangan commit data/secret.
3. Rehearsal disposable dengan data fiktif, negative access, rollback, duplikasi dan konkurensi, lalu bandingkan hitungan dan kualitas. Tidak ada migrasi historis yang telah dijalankan.
4. Keputusan tertulis tentang engine/DDL, rencana backup dan rollback; izin testing dan rilis terpisah. K4/K7 tetap tertunda.

## Master QA K7
[Master QA](MASTER_QA_YANDIK_2026_2030.md) Q30–Q36 mencatat DDL rehearsal dan blocker backend/rilis. 22 unit kontrak belum dijalankan. Tidak ada izin DB atau migrasi.

## 2026-11-24 | K4-A1: penulis transaksi APEL bertipe DEMO
- Owner menunda preview Codex; kembali fokus CODE_ONLY. [Kontrak](K4_A1_APEL_TYPED_WRITER_2026_2030.md): validator payload M05-0, satu tabel pendamping payload/revisi, penulis SQLite :memory: terisolasi untuk dua fixture record APEL, grant aktif, pemeriksaan revisi, replay, rollback, audit dan pemisahan ledger. 25 QA tertulis (8 validator + 17 rehearsal), 0 dijalankan. Bukan paritas M05-1, belum HTTP, DB riil, UI binding, otorisasi atau persistensi. K4/K7 tertunda; berikutnya typed inventory tahunan dan validasi katalog versi. [skip ci].


## 2026-11-24 | K4-A2: backend inventaris tahunan DEMO
- [Kontrak](K4_A2_INVENTORY_TYPED_WRITER_2026_2030.md): snapshot katalog 198 butir/15 kelompok dari JS, validator typed, DDL payload, writer SQLite :memory: berbagi fondasi APEL, 15 record fasilitas-tahun, salin/konfirmasi, histori, calon telaah kab/kota kemudian provinsi, replay dan rollback. 24 QA tertulis (10 pure + 14 rehearsal), 0 dijalankan. Belum paritas UI, kewenangan, login/HTTP, DB riil, M04 atau persistensi. CODE_ONLY [skip ci]. Berikutnya K4-A3 Profil Puskeswan bertipe.


## 2026-11-24 | K4-A3: backend Profil Puskeswan DEMO
- [Kontrak](K4_A3_PROFILE_TYPED_WRITER_2026_2030.md): validator 7 bagian, DDL profil/payload, shared memory writer 105 record kosong per fasilitas/tahun/bagian, histori, koreksi/reopen, rekap inventaris dan rujukan workflow APEL baca-saja; SDM/ledger null, register masalah pending. 26 QA tertulis (10 pure + 16 rehearsal), 0 dijalankan. Belum mapping form asli, auth/HTTP/DB riil/UI atau kebijakan resmi. CODE_ONLY [skip ci]. Berikutnya K4-A4 backend SDM dan histori mutasi.


## 2026-11-24 | K4-A4: backend SDM Veteriner DEMO
- [Kontrak](K4_A4_STAFF_TYPED_WRITER_2026_2030.md): master/interval eksklusif, histori mutasi, register/assign/end, catatan kompetensi, coverage tahunan, rekap profil dalam transaksi baca, grant aktif, replay dan rollback. 26 QA tertulis (8 pure + 18 memory rehearsal), 0 dijalankan. Bukan data pegawai/otorisasi resmi; belum API, impor, persetujuan mutasi, DB riil atau persistensi. CODE_ONLY [skip ci]. Berikutnya K4-A5 Support Puskeswan dengan crosswalk terpisah.


## 2026-11-24 | K4-A5: backend Support Puskeswan DEMO
- [Kontrak](K4_A5_SUPPORT_TYPED_WRITER_2026_2030.md): stream baru 30 case fixture per fasilitas/tahun/dua item, sumber inventaris terkonfirmasi terikat revisi, usulan/telaah kab/kota/paket/jadwal/kirim/terima/metadata BAST/monitoring, batas kuantitas, source stale, audit/replay/rollback. 20 QA tertulis (6 pure + 14 rehearsal), 0 dijalankan. Bukan migrasi M04, crosswalk, bantuan resmi, HTTP, DB riil atau otorisasi. CODE_ONLY [skip ci]. Berikutnya K4-A6 pengawasan/layanan teknis.


## 2026-11-24 | K4-A6: backend empat register teknis DEMO
- [Kontrak](K4_A6_REGIONAL_REGISTERS_2026_2030.md): typed snapshot regional read-only obat/praktik/surveilans/sertifikat, 7 fixture 2026 independen, coverage null, sidecar telaah internal ber-revisi dan audit, grant aktif/scope asal, replay/rollback, command namespace lintas stream. 20 QA tertulis (7 pure + 13 rehearsal), 0 dijalankan. Bukan migrasi M06/M07/M13/M14, iSIKHNAS/APEL sync, penerbitan, izin atau diagnosis; belum HTTP/auth/DB riil. CODE_ONLY [skip ci]. Berikutnya K4-A7 pembinaan/administrasi.

