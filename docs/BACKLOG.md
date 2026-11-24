# YANDIK+ Development Backlog

This is a build plan, **not evidence that features are already implemented**.

## Consolidation queue (24 November 2026)
- Use [K0–K7 inventory and gap matrix](KONSOLIDASI_YANDIK_2026-11-24.md) to sequence existing backlog entries B-001–B-021; retain their acceptance criteria. K0 portal written, not tested. K1 shared identity/source, K2 reporting/profile/SDM UI, K3 support workflow, K4 authorized Flask/backend remain core blockers. K5–K7 extend and validate; do not create parallel implementation solely to show progress.

**Update K1–K6:** [review workspace](../drafts/yandik-portal/review.html) written, 18 QA designed/0 run. Existing M05 join, correction workflow, independent M04 seven-stage scenario, four read registers, regional coverage and document links reused. Full input/categories, cross-source identity, domain details and PWA/GIS are pending; K4 source/auth/DB and K7 remain blocked. [Codex checklist](CODEX_PREVIEW_YANDIK.md).

## Ready-to-spec / implement
### B-001 | Sanitized source baseline (M00)
- Import exact code snapshot structure under dedicated branch.
- Exclude `data/`, `uploads/`, backups, `.env*`, `ai_config.json`, keys and user exports.
- Replace embedded secrets and fallback credentials in development copy.
- Add anonymous config examples, requirements/lock, local setup instructions and tests.
- **Done when:** source inventory matches snapshot except deliberate exclusions; all Python parses; smoke tests runnable locally.

### B-002 | Identity / authorization (M01)
- Roles: provinsi admin, provinsi verifier, kabupaten/kota, Puskeswan reporter, leadership read-only.
- Every privileged API operation requires explicit auth and role/territory checks, independent of content type.
- API serializes only allowed user fields; never `password_hash`.
- **Done when:** unauthorized/forbidden requests fail in automated tests.

### B-003 | Master data and Puskeswan profile (M01-M02)
- Stable Puskeswan ID; organization/region mapping; SDM and sarpras linked with provenance and effective date.
- APEL aggregation remains monthly per Puskeswan without altering historical data.
- **Done when:** sample Puskeswan has joined view without duplicate entries and with data freshness.

### B-004 | Support needs and prioritization (M03)
- Submission, evidence and independent verification of needs for equipment, cold chain, medicine and BHP.
- Risk/need indicators with documented weights; low-service remote facilities are not automatically disadvantaged.
- **Done when:** every prioritized item has source, reason, reviewer, date and editable review decision.

### B-005 | Support distribution and accountability (M04)
- Proposal → verification → human approval → plan → delivery → BAST → utilization feedback.
- Do not substitute system status for official budget authorization.
- **Done when:** simulated end-to-end assistance case and audit events pass tests.

## Follow-on
### B-006 | APEL 2027 reporting and evaluation (M05)
Preserve 2026 reports. Define 2027 criteria, fairness, annual report card and anomaly advisory. No unreviewed score retroactivity.

### B-007 | Veterinary medicine oversight (M06)
Registry, legal status, inspector checklists, inspections, findings, remedial deadlines, document templates.
- **Partial code draft (M06-S1):** register/checklist read-only DEMO written under `drafts/m06-medicine-oversight/`; 24 QA written, none executed. Formal facility categories, inspection standards, evidence, workflow and verification remain pending.

### B-008 | Clinics and veterinarian practices (M07)
Practice registry, verification, supervision standards, document expiry, follow-up. Respect formal permitting authority.
- **Partial draft M07-S1:** internal DEMO register and checklist in `drafts/m07-practice-oversight/`, 22 QA written and none executed. No license verification, practice identities, real inspection, or formal follow-up.

### B-009 | Leadership analytics (M08)
One dashboard with metric dictionary, period, verification and provenance.

### B-010 | Notifications, offline, GIS, knowledge base (M09-M11)
Only after core data and permissions are tested. No paid AI dependency in core workflows.

### B-012 | Veterinary certificates and animal/product movement (M14)
- **Partial draft M14-S1:** DEMO internal request register in `drafts/m14-certificate-register/`, 25 QA written and none executed; not an issuer, public verification, signature, or official registry.
- Define legal types, human authority, data minimization, requirements and external issuance references separately before integration.

### B-013 | PHMS, zoonosis, surveillance and source governance (M13 + M00-G2)
- **Partial draft:** source/API contract in drafts/m00-source-api-gate/ with 24 QA written and 0 executed. No official external data or authentication.
- **Partial draft:** synthetic event register in drafts/m13-surveillance/ with 28 QA written and 0 executed. Suspected, investigation, lab notes and review remain distinct and unverified.
- Still required: official case definitions, data owner permissions, location privacy, institutional workflow, iSIKHNAS/APEL reconciliation, valid API trust boundary and tests.

### B-014 | Read API and APEL/surveillance candidate linkage (M00-G3 / M13-S2)
- **Partial draft M00-G3:** read-only GET simulation at drafts/m00-read-api-gate/, 19 QA written, 0 executed; no live API authentication or HTTP endpoints.
- **Partial draft M13-S2:** candidate event-location-period-facility links at drafts/m13-apel-crosswalk/, 24 QA written, 0 executed; not verified equivalence or actual reconciliation.
- Still required: source approvals, real server session trust, Juknis case/investigation dictionary, server API permissions, manual review audit, privacy and regression tests.

### B-015 | Human review notes for crosswalk candidates (M13-S3)
- **Partial draft:** in-memory review log in drafts/m13-crosswalk-review/; 28 QA written, 0 executed. Rechecks M13-S2 candidate/source and detects stale DEMO inputs using non-authenticating SHA-256 fingerprint.
- Before use: authenticated independent reviewers, authoritative source lineage, audited durable event store, official case terminology, permission to integrate, and negative/regression tests.

### B-016 | Source permission readiness and authenticated Flask integration (M00-G4)
- **Partial draft M00-G4:** synthetic source-permission checklist and host identity requirements in drafts/m00-source-readiness/; 22 QA written, 0 executed. No official permission, endpoints or real data transfers.
- Before implementation: data-owner authorization, written scope, personal/sensitive classifications, sessions/CSRF, source contract and approvals.

### B-017 | Durable review audit and transaction port (M00-G5)
- **Partial draft M00-G5:** in-memory paired review/audit chain and unexecuted SQLite schema in drafts/m00-audit-port/; 24 QA written, 0 executed.
- Requires authenticated server, atomic transaction, optimistic locking, tamper-resistant external anchoring/operational audit, backup/restore, idempotency and negative tests before real use.

### B-018 | Flask read-only adapter behind default-deny (M00-G6)
- Draft Flask blueprint factory under drafts/m00-flask-adapter/, 25 QA written, 0 executed; no registered endpoints, real auth or official source access. Validate source Flask baseline, secure session resolution, route permissions and data classification before integration.

### B-019 | In-memory atomic audit writer (M00-G7)
- Draft SQLite in-memory writer under drafts/m00-sqlite-demo-writer/, 25 QA written, 0 executed; conditional revisions, idempotency, rollback and chain read model are not tested. Real database integration, JS/Python contract parity, storage hardening and operational audit remain pending.

### B-020 | Canonical demo audit bridge, cross-language data contract (M00-G8)
- **Partial draft:** drafts/m00-cross-language-audit/ with JavaScript/Python format normalization and synthetic vectors; 37 QA written (18 JS, 19 Python), 0 executed. No legacy hash migration, no source/actor integrity guarantees, and G5 global sequence differs from G7 per-link revision.
- **Flask source gate:** docs/M00_FLASK_SOURCE_ACCEPTANCE_GATE_2026_2030.md; source baseline remains unavailable as a verified, sanitized, authorized copy. Review permissions, secrets, PII, legal source scope and per-route authorization first.

### B-021 | Preflight declaration for future authorized sanitized Flask source (M00-G9)
- **Partial draft:** `drafts/m00-flask-intake-preflight/`, 41 QA written, 0 executed. Metadata file/path/dependency and DEMO route declaration only; no file contents, secrets, provenance, permits or actual code checked. Output always NOT_READY.
- **Still required:** authorized sanitized source snapshot, offline content scan by authorized reviewers, dependency/security review, Flask auth/session and territorial contract, audited approval before integration.

### B-011 | Security and operational debt (cross-cutting, P0)
Move static Flask key and fallback secret into env-only config in development; remove default passwords; introduce password KDF and migration plan; CSRF checks; protect uploads/downloads and prevent path traversal; proxy trust and log handling.

## Standard issue acceptance checklist
- [ ] Requirement and responsible actor defined
- [ ] Sample data anonymous
- [ ] Access controls + misuse cases tested
- [ ] Existing APEL regression covered
- [ ] Schema/API and backwards compatibility described
- [ ] No deployment or production changes
