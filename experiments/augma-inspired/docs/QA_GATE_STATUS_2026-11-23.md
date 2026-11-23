# Quality gates, YANDIK+ Innovation Lab

Verified on **23 November 2026 (11:45 WIB)**. **Isolated lab only; this is not an operational-release approval.**

## Verified CI run

[GitHub Actions #45113635452](https://github.com/dvoriano/yandik-plus/actions/runs/45113635452) completed with **success** on source commit `2d098d0f25e47d4e76cd2e9e03dc78e2d8ebcf1a`.

| Gate | Verified result | Evidence | Limitation |
|---|---|---|---|
| Branch, secret, production-domain guard | **PASS** | [Isolation job](https://github.com/dvoriano/yandik-plus/actions/runs/45113635452/job/137491389939) | This is a CI check, not a GitHub branch-protection rule |
| Shapely geometry, synthetic fixtures | **6/6 PASS** | [Offline GIS job](https://github.com/dvoriano/yandik-plus/actions/runs/45113635452/job/137491418087) | No real ADM2 boundary certified |
| BNPB acquisition mock, no live download | **9/9 PASS** | Same offline GIS job | Remote endpoint availability and data licence unverified |
| Isolation-policy unit cases | **6/6 PASS** | Same offline GIS job | Defined negative/positive cases only |
| Node JavaScript unit tests | **31/31 PASS** | [Browser job](https://github.com/dvoriano/yandik-plus/actions/runs/45113635452/job/137491418134) | In-memory synthetic logic |
| Real Chromium Playwright desktop/mobile viewport | **13/13 PASS** | Same browser job | Mobile viewport emulation, not a physical phone |
| Browser sample loads | **4/4 HTTP 200**, no recorded JS errors/external requests | Same browser job, perf output | No established hardware performance targets |
| ADM2 19 regions, actual boundary geometry | **PENDING** | None | Licence, provenance, date, topology and GIS comparison |
| Actual STB/old laptop device | **PENDING** | None | Hardware model, compatibility, capacity and local browser test |
| Human accessibility/UX and bad-connection test | **PENDING** | None | Requires independent user and device review |

**Failure and correction:** the previous [run #45113502933](https://github.com/dvoriano/yandik-plus/actions/runs/45113502933) failed before executing browser tests because `ubuntu-latest` selected Ubuntu 26.04, unsupported by Playwright 1.56.1 Chromium. The browser job alone was pinned to `ubuntu-24.04` in commit `2d098d0`. The subsequent run passed all three jobs.

[Download/view browser evidence artifact in GitHub](https://github.com/dvoriano/yandik-plus/actions/runs/45113635452/artifacts/14790279846). GitHub artifact retention is configured to 7 days; preserve only reviewed non-sensitive evidence if longer-lived records are required.

## Scope and isolation

- Branch: `lab/augma-inspired-experiments`; tests use `127.0.0.1:8767` and synthetic/no operational data.
- CI workflow grants `contents: read`, disables persisted checkout credentials, and contains no deployment steps.
- Workflow branch guard runs before GIS and browser jobs. It allows lab files and a single lab-only workflow path.
- None of these checks justifies integration, production deployment, claims about official Puskeswan service counts, or the legal validity of province/regency boundary datasets.

## Reproduce safely on an authorized development machine

```sh
git checkout lab/augma-inspired-experiments
git fetch --no-tags origin main
python3 experiments/augma-inspired/tools/check_lab_isolation.py --base-ref origin/main
cd experiments/augma-inspired
python3 -m unittest discover -s tools/tests -v
cd prototypes
npm install --no-save '@playwright/test@1.56.1'
npx playwright install chromium
npm run test:unit
python3 -m http.server 8767 --bind 127.0.0.1
```

In another terminal from `prototypes/`:

```sh
npm run test:browser
npm run test:browser:perf
```

This is a local lab. Never point its tests at the YANDIK+ production website, operational databases, or private records.

## Remaining release gates

- [x] Confirm three GitHub Actions jobs on run #45113635452: success.
- [x] Record actual Node and Chromium test execution and results on the same commit.
- [ ] Confirm metadata/permission and review real ADM2 19-region polygons separately from the repo.
- [ ] Perform GIS topology review, particularly Mentawai islands and administrative boundary differences.
- [ ] Profile an authorized real STB/laptop and assess actual load, RAM and device/browser compatibility.
- [ ] Conduct manual keyboard, touch, accessibility and low-bandwidth usability checks.
- [ ] Obtain explicit organizational approval before any actual data integration, merge, or deployment.

Earlier historical notes in `VALIDATION_EVIDENCE_2026-11-23.md` reflect the state at their timestamps; this verified CI run supersedes earlier **test-not-run** statements, but not outstanding data/device governance limits.
