# YANDIK+ Master Roadmap (offline)

**North star:** data pelayanan → analisis kebutuhan → verifikasi → dukungan/pembinaan → evaluasi. Keep current APEL workflows intact in every proposed change.

| Sequence | Milestone | Scope | Exit criterion | Priority |
|---|---|---|---|---|
| M00 | Safe source baseline | Import sanitized Flask source, document missing runtime config and local execution | All expected source paths present; syntax/checks pass; no operational data or credentials | P0 |
| M01 | Shared platform minimum | Central Puskeswan IDs; region/organization model; role permissions; audit trail; API boundary | Access matrix and negative auth tests; no duplicate Puskeswan records | P0 |
| M02 | Unified Puskeswan profile | Link APEL, SDM, buildings/equipment, medicines and profile, with freshness/verification | One Puskeswan record with origin/status for each dimension | P0 |
| M03 | Support Puskeswan: needs | Need assessment, priority indicators, evidence, validation and transparent explanations | List of verified needs, with reasons and human review | P0 |
| M04 | Support Puskeswan: distribution | Proposal, review, approval, available funding, handover/BAST and utilization monitoring | End-to-end simulated case with audit log and no production data | P0 |
| M05 | APEL enhancement | Annual report card, year 2027 rules, trends, abnormal input flags, follow-up | Regression checks preserve historical monthly counting/reporting | P1 |
| M06 | Veterinary medicine oversight | Facility registry, legality, risk-based inspection, checklists, findings and actions | Inspection record and actionable follow-up process | P1 |
| M07 | Veterinarian practice/clinic oversight | Practice and facility profiles, permitted document tracking, supervision, follow-up | Regional access and reportable supervision records | P1 |
| M08 | Leadership dashboard | Aggregate verified metrics from APEL, support and oversight | Freshness, definitions, authorized dashboard views | P1 |
| M09 | Notifications + field mode | Monthly reminders, expiring documents, pending assistance, mobile/offline drafts | Duplicate prevention and traceability | P2 |
| M10 | GIS | Authorized service/facility locations and priority layers | No personal coordinates publicly exposed | P2 |
| M11 | Knowledge base + optional AI | SOP search and drafts/recommendations, human review, provider-neutral | Works without AI tokens; data safeguards; no automatic official decisions | P2 |
| M12 | Optional administration | Evaluate personnel activity/e-SPJ/Telegram integration and SPBE alignment first | Written governance decision before build | P3 |

## Delivery method
- Each milestone has its own issue(s), branch and PR. No feature directly modifies production.
- Use **dummy data** in tests. Build local fixtures and migrations separately from live data.
- Do not interpret ranking as punishment; account for remote Puskeswan and limited staffing in support prioritization.
- Default priority is M00 → M01 → M02 → M03 → M04; M05 maintenance may progress in parallel when backward-compatible.
- Finances determine eventual deployment, not whether specifications and code can be developed now.

## Release gate (future only)
1. Security P0 remediations and tests green.
2. Dependency lock + reproducible environment + anonymized fixtures.
3. Staging deployment, backup, rollback, data-migration rehearsal.
4. Functional sign-off by responsible officials; appropriate SPBE and data-protection review.
5. Separate explicit go-live approval.
