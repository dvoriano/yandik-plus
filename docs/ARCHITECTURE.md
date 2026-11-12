# Architecture and Baseline (from 10 Nov 2026 snapshot)

## Observed production topology (read-only investigation previously supplied)
Browser → Caddy → Gunicorn at `127.0.0.1:5000` → Python entrypoint `app:app`. This is **background context**, not a GitHub deployment configuration.

## Snapshot structure
- `app.py`: substantial legacy Flask application and APEL routes; must not be rewritten wholesale.
- `core/`: config, DB access, middleware, shared data/service primitives.
- `modules/`: authentication, user management, SDM, organization/region/master, audit, APEL and stub oversight modules.
- `templates/`, `static/`: current web UI assets.
- `docs/`: planned documentation source.
- Production `data/`, `uploads/`, backups, `ai_config.json`, credentials are **never source controlled**.

## Important constraints
- Snapshot does not include runnable production dataset. Existing `app.py` expects files below `data/` and must be adapted for anonymous fixtures.
- No complete lockfile/requirements and automated tests available in the uploaded snapshot. Build these offline.
- Do not copy database snapshots or personal files to GitHub even if private.
- Keep templates/forms and route names stable initially; use API/DB adapters to evolve functionality with test coverage.
- `master` in source directory and `main` in GitHub do not imply synchronized revision history; import clean snapshot without old Git history.

## Target design layers (incremental, not rewrite)
- Presentation: existing templates/JS plus feature-specific templates.
- Application services: Puskeswan profile, APEL, Support, Medicine Oversight, Practice Oversight.
- Access: centralized authentication, role + territorial authorization.
- Persistence: shared Puskeswan IDs, versioned schema changes, audit log, fixtures for local tests.
- Integrations: optional notifications / GIS / AI behind feature flags. Core must work without AI tokens.

## Work-mode contract
GitHub branch/PR for all changes. No VPS access, no deployment automation, no production DB. Local smoke test after restoring dependencies and anonymous fixtures. Deployment only under separate funded/go-live decision.
