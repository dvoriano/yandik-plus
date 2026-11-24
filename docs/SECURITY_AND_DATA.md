# Security and Data Boundary | Development Rules

## Do not commit
- Real `.env`, keys, GitHub tokens, Telegram tokens, Flask session secrets, database passwords.
- Real account credentials / hashes and default passwords.
- `data/` runtime files, SQLite/SQL dump files, `uploads/` and evidentiary photos/documents, backups.
- User contact info, private identifiers, live request exports, logs or internal financial data.

## Replace with
- `.env.example` listing **names** only.
- `data/examples/` synthetic records with clear non-real placeholders.
- Tests using fake users, Puskeswan and kabupaten/kota.
- App startup that fails clearly if secret is missing, never public default secrets.

## Addendum P0 | Gerbang sumber & audit (23 November 2026)
- [M00-G4](M00_G4_SOURCE_PERMISSION_GATE_2026_2030.md) hanya register kebutuhan izin data DEMO, bukan izin resmi atau konektor iSIKHNAS.
- [M00-G5](M00_G5_AUDIT_TRANSACTION_PORT_2026_2030.md) hanya rantai hash in-memory dan rancangan skema append-only SQLite; belum membangun DB aman. Hash tanpa autentikasi eksternal bukan anti-tamper.
- Untuk produksi, hak sesi API server, CSRF, audit akses sensitif, least privilege, backup, role DB dan data owner authorization harus disetujui serta diuji.

## Addendum P0 | Flask dan SQLite DEMO (23 November 2026)
- [M00-G6](M00_G6_FLASK_ADAPTER_DEMO_2026_2030.md) adalah factory Blueprint nonaktif default, bukan perlindungan autentikasi server. Jangan registrasikan pada app produksi tanpa audit/izin.
- [M00-G7](M00_G7_SQLITE_INMEMORY_TRANSACTION_2026_2030.md) menolak DB file dan hanya dapat bekerja di memori bila nanti dijalankan. Trigger dan SHA-256 sendiri tidak menjamin catatan tahan manipulasi; transaksi/konkurensi belum diuji.
- Tidak ada sumber Flask asli atau data berizin pada repo; keseluruhan kode tetap CODE_ONLY dan BELUM DIUJI.

## Addendum P0 | Interoperabilitas audit dan source Flask
- [M00-G8](M00_G8_CROSS_LANGUAGE_AUDIT_BRIDGE_2026_2030.md) menghasilkan hash baru untuk **normalisasi format**; hash asli tidak divalidasi, tidak boleh dipakai sebagai persetujuan audit/migrasi atau bukti sumber sah.
- [Gerbang penerimaan Flask](M00_FLASK_SOURCE_ACCEPTANCE_GATE_2026_2030.md) mensyaratkan sumber yang diizinkan/disanitasi, tanpa data/secret nyata, pengecekan role-per-request, dan pengujian dengan izin sebelum rilis.

## Addendum P0 | Batas metadata source Flask
- [M00-G9](M00_G9_FLASK_INTAKE_METADATA_DEMO_2026_2030.md) hanya memeriksa metadata fiktif dan pola nama file; bukan pemeriksa isi source maupun scanner secrets. Bahkan path yang lolos **tidak** membuktikan bahwa tidak ada rahasia. Jangan mengirim source, token atau PII aktual ke repo publik. Hasil `ready_for_import:false` tetap wajib.

## Known security debt in source snapshot
- Review authentication and territorial authorization across users/roles/permissions APIs.
- User list responses need an allowlist; no password hash fields.
- Remove hardcoded password fallback, including reset flow.
- Replace SHA-256 password handling with a proven password KDF and phased legacy migration.
- Add CSRF safeguards for cookie-authenticated state changes.
- Restrict uploads/downloads by user and object scope; enforce safe file paths and file types.
- Unify environment-only Flask secret source, including `core/config.py` fallback.
- Preserve audit history but never log credentials.

## Governance
- **Metadata GitHub 11 November 2026: repository PUBLIC.** Akses publik ke source tidak mengizinkan penggunaan data rahasia atau dokumen kedinasan tanpa klasifikasi. Jika kelak diubah private, hal itu tetap bukan tempat menyimpan secrets atau data masyarakat.
- Periksa keputusan visibilitas, klasifikasi dan pembatasan data pada [REPOSITORY_ACCESS_DECISION.md](REPOSITORY_ACCESS_DECISION.md).
- Test assumptions and security changes on synthetic data only.
- Maintain explicit review gates before any funded staging/production deployment.
- Coordinate any expansion into official approvals, employee activity or e-SPJ with the relevant SPBE/organizational requirements.

## K4 | Kontrak integrasi data
[Kontrak backend/data](K4_KONTRAK_BACKEND_DATA_2026_2030.md) hanya rehearsal DDL dan evaluator calon akses; jangan mendaftarkan endpoint, menjalankan DDL atau mempercayai role client. Seluruh hasil may_execute=false; sumber/otorisasi nyata dan audit keamanan belum tersedia.
