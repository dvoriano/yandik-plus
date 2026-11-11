# M03-S4 | Fairness Comparison Lab (DRAFT / BELUM DIUJI)

**Status: KODE DITULIS, BELUM DIUJI, TIDAK DIJALANKAN.**
No GitHub Actions/CL usage is requested for this stage. This draft is deliberately
located under \`drafts/\` and not wired into the active prototype or production.

## Files
- \`comparison.mjs\`: imports the M03-S3 factor validation and calculates side-by-side indicative results for three experimental weight profiles; incomplete inputs are unranked, equal scores share a rank, output is **not** a funding decision.
- \`fixtures.mjs\`: six entirely invented facility scenarios (remote low-volume, busy urban, staffing constraint, cold-chain emergency, incomplete, and deliberate tie).
- \`app.mjs\` + \`index.html\` + \`style.css\`: untested standalone mock interface, **not** attached to the website or Flask app.
- \`../../docs/M03_S4_FAIRNESS_PLAN.md\`: policy questions, manual-review backlog and assumptions.

## Restrictions
1. **Do not claim tests pass.** No Node, browser, CI, CL, runtime, or screenshot verification was performed for these newly created files.
2. The previous **176 passing tests** belong only to the earlier M03-S3 snapshot, not M03-S4.
3. This is not deployed; browser code is not yet validated for mobile/accessibility.
4. No real Puskeswan names, service counts, stock levels, personal data, remote locations, or decisions.
5. No automatic grant, recipient selection, BAST, procurement, payment, or official prioritization.
6. A manual review and tests must be authorized before moving files into \`prototypes/\` or production. See \`docs/TEST_BACKLOG.md\`.

## Future review order (DO NOT RUN YET)
1. Static analysis and imports relative to the existing M03-S3 module.
2. Unknown vs 0, same-score tie, identical profiles, and volume-count invariance.
3. Ranking movements under each weight profile and meaningful differences for remote/staff-limited scenarios.
4. Deliberately invalid input and malformed/missing evidence references.
5. Browser view on 320px/375px, keyboard navigation, error and overflow.
6. Compare against final approved SOP/indicators; only then implement actual app integration.
