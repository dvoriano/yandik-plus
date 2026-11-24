# K4-A1 | Penulis transaksi APEL bertipe DEMO
**24 November 2026 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.** Owner menunda Codex dan melanjutkan pengembangan. Tidak ada browser, unit test, SQL atau database yang dijalankan. Tidak ada penggunaan data riil.

## Keluaran
- [Validator payload APEL](../drafts/yandik-backend-contract/apel_payload.py) mengadaptasi grain M05-0 dan batas input portal, bukan klaim paritas. Empat kategori, investigasi unik per pasangan event/lokasi, satu hewan ante/post, deklarasi nol, ID/bukti sintetis, scope fasilitas/periode.
- [DDL pendamping](../drafts/yandik-backend-contract/apel_payload.sql) satu tabel payload per revisi, trigger histori. Skema inti 16 tabel + satu tabel pendamping khusus APEL, tanpa migrasi.
- [Penulis](../drafts/yandik-backend-contract/apel_store.py) hanya factory SQLite :memory: internal, fixture Alpha/Gamma November 2026, grant aktif dari DB tiruan (callback hanya mengidentifikasi actor/grant, bukan autentikasi); guard menolak attached/file DB dan FK off. Menggunakan kandidat evaluator K4 hanya dalam rehearsal, bukan izin nyata.
- [25 unit/rehearsal](../drafts/yandik-backend-contract/test_apel_store.py) ditulis, 0 dijalankan. 8 validator murni + 17 kasus yang membuat SQLite memory jika kelak dijalankan. Izin unit saja tidak cukup untuk suite penuh.

## Alur
Not started (head 0 tanpa payload) → save_draft → DRAFT → submit → SUBMITTED → return_correction → CORRECTION → save_draft → DRAFT; record_review oleh verifikator berbeda hanya mencatat RECORDED_DEMO. Subset ini **berbeda dari status M05-1**, perlu mapping dan uji paritas; belum dipasang ke UI.
1. BEGIN IMMEDIATE, resolve grant aktif dari fixture store, baca identitas/periode/head, cek scope.
2. Validasi payload bertipe atau alasan kode. Cek receipt actor+command_id dan fingerprint; replay tetap cek grant/role/aksi dari revisi awal; konflik ID ditolak.
3. Cek expected_revision, status dan penulis/penelaah; salin payload terdahulu pada transisi non-edit. Simpan revision, payload, audit, receipt dan conditional head update dalam satu transaksi; rollback jika gagal.
4. View baca-saja mengembalikan scope dan snapshot sesuai hak kandidat. Head 0 payload null, bukan laporan nol. Tidak ada ledger, skor, publikasi, penyatuan M04/M05 atau perubahan aplikasi.

## Batas
Hanya dua fixture record terpasang, belum pembuatan record dinamis, auth/CSRF HTTP, izin reviewer per SOP, penyimpanan durable, audit chain, bukti unggahan, cross-process concurrency, integrasi model JS atau route. Hash tidak membuktikan sumber sah. SQL constraint dan guard bukan sandbox anti-admin. Tidak ada data PII atau kredensial. K4/K7 tetap tertunda. Berikutnya: typed inventory tahunan dan validasi katalog versi, atau adapter mapping workflow JS/Python tanpa eksekusi. Preview tetap ditunda.
