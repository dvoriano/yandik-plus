# YANDIK+ | Development Workspace

> **Status:** offline development only. Production at https://yandikvo.my.id/ is **not connected** to this GitHub repository.

## Mission
Build the next version of YANDIK+ progressively in GitHub, using the current Flask application snapshot as the functional baseline. No VPS connection, no live database, no automatic deployment, and no changes to the existing website until funding, testing, and formal approval are available.

## Existing baseline (snapshot provided 10 Nov 2026)
- Python 3.12; Flask-style `app.py` served by Gunicorn and Caddy in production, based on earlier operator inspection.
- Source snapshot contains **168 files** including `app.py`, `core/`, `modules/`, `templates/`, and `static/`; snapshot was sanitized separately from production.
- APEL Puskeswan, profiles, SDM, authentication, master platform, and web templates are present in the baseline.
- `modules/pengawasan` and `modules/klinik` contain starter blueprints, **not finished implementations**.
- Original runtime data and `data/config.json`, `data/puskeswan_list.json`, `uploads/`, and private configuration are **not** included. This snapshot is not a deployable environment as-is.

## Rules
1. **Production is frozen:** no SSH, no service restart, no DB write or migration in production, no deployment from GitHub.
2. **Separate from Indodax bot:** no shared repositories, keys, environments, services or workflows.
3. **Development uses dummy/anonymous data only.** Exclude secrets, tokens, personal information, production files and backups.
4. **`main` is protected by process:** work in feature branches, test, review in PRs; never push directly to `main` for product changes.
5. Each feature needs specification, schema/migration proposal, tests, and rollback/deployment notes before it is considered ready.
6. Later deployment requires separate approval and a staging rehearsal.

## Entry points
- [Roadmap](ROADMAP.md)
- [Backlog and acceptance criteria](BACKLOG.md)
- [Support Puskeswan specification](SUPPORT_PUSKESWAN.md)
- [Architecture and baseline constraints](ARCHITECTURE.md)
- [Data boundary and security debt](SECURITY_AND_DATA.md)

**Current repository state:** this branch initially holds development documentation; **the full code snapshot has not yet been imported into GitHub**. Do not confuse it with the running website.
