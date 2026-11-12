# YANDIK+ Development Backlog

This is a build plan, **not evidence that features are already implemented**.

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

### B-008 | Clinics and veterinarian practices (M07)
Practice registry, verification, supervision standards, document expiry, follow-up. Respect formal permitting authority.

### B-009 | Leadership analytics (M08)
One dashboard with metric dictionary, period, verification and provenance.

### B-010 | Notifications, offline, GIS, knowledge base (M09-M11)
Only after core data and permissions are tested. No paid AI dependency in core workflows.

### B-011 | Security and operational debt (cross-cutting, P0)
Move static Flask key and fallback secret into env-only config in development; remove default passwords; introduce password KDF and migration plan; CSRF checks; protect uploads/downloads and prevent path traversal; proxy trust and log handling.

## Standard issue acceptance checklist
- [ ] Requirement and responsible actor defined
- [ ] Sample data anonymous
- [ ] Access controls + misuse cases tested
- [ ] Existing APEL regression covered
- [ ] Schema/API and backwards compatibility described
- [ ] No deployment or production changes
