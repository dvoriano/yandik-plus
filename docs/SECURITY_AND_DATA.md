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
