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

## Follow-up local regression after the verified CI commit

**23/23 Python tests and 6/6 Node simulation unit tests passed locally** on 23 November 2026, after two fail-closed GeoJSON hardening patches. Python split: **7 Shapely synthetic**, **10 BNPB mock**, **6 isolation**. Runtime: Python 3.13.5, Shapely 2.1.2, Node v22.16.0.

**Provenance:** eight Python/JavaScript source files and their test files were checked against their exact Git blob SHA on the linked GitHub branch. For Node, the imported 19-name registry was reconstructed with matching region identity/type/seat values. The local environment was not a full repository checkout; this is independent local regression evidence, not a substitute for complete CI.

The two new rejection cases cover malformed geometry represented by a list (previously could raise `AttributeError`) and malformed upstream BNPB feature objects. Both fail closed with structured error handling. The extra tests are **not included** in the earlier successful GitHub Actions run #45113635452 on commit `2d098d0`. A subsequent CI run of the latest branch tip must be reviewed before treating the latest source as CI-validated.

Local Chromium was able to render `page.set_content`, but HTTP loopback navigation was blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`. This does **not** invalidate the earlier successful GitHub-hosted Playwright run, but prevents independent local browser replication in this runtime. No real BNPB query and no physical STB test occurred.

Inspect the machine-readable [local test evidence and Git blob checksums](LOCAL_TEST_EVIDENCE_2026-11-23.json).

## Newly added gates awaiting a subsequent CI run

**Latest branch-only changes:** six additional Playwright browser tests for keyboard navigation, SVG marker activation, missing map outline, and delayed map loading. These tests were authored and syntax-reviewed but are **not yet covered by the previously verified run #45114481799**, which passed 30 Python, 31 Node, and 13 Chromium tests.

The offline ADM2 provenance reviewer now refuses private/loopback/local source URLs and symlinked input files, with **two additional Python regression tests**. Targeted local checks passed for 14 URL cases and a symlink check, but the complete updated Python suite has **not been reverified via CI**. Once successful, the expected suite counts are **32 Python, 31 Node, and 19 Playwright tests**.

Check the actual new Actions run ID and logs before changing these statuses from PENDING to PASS. The physical STB, true licensed 19-region ADM2 geometry, and human accessibility review remain outside CI scope. See [accessibility and network resilience protocol](ACCESSIBILITY_NETWORK_RESILIENCE.md).

## Local regression and keyboard-focus correction (23 November 2026)

- An actual execution of the latest 32-test Python snapshot **initially failed** on a manifest URL containing a literal backslash followed by `n`. The previously implemented control-character check did not reject it. The validator now refuses all backslashes and whitespace in provenance URLs. The regression test also covers a real newline.
- After correction, **32/32 Python unit tests passed** and **6/6 synthetic dashboard Node tests passed** in the local runtime (Python 3.13.5, Shapely 2.1.2, Node 22.16.0).
- The two changed Python blob hashes were checked and match their GitHub files. Browser source scripts also passed a syntax-only check.
- Geo Command Center and Puskeswan Simulation were adjusted to **restore keyboard focus after a selected row or SVG pin is re-rendered**. The Playwright suite now explicitly asserts post-selection focus. These new browser checks are **NOT YET CONFIRMED** by a GitHub-hosted run at the latest commit.
- No real geospatial or Puskeswan record was used for these tests.

The supporting machine-readable evidence is in [QA local regression (32 Python, 6 Node)](QA_REGRESSION_2026-11-23_32PY_6NODE.json). The last independently verified GitHub Actions run remains [#45114481799](https://github.com/dvoriano/yandik-plus/actions/runs/45114481799) on an earlier commit.

## Local verification update: all 42 Python tests passed

The evidence contract was found to accept only 32 Python tests while the current suite contains 42. This mismatch was corrected in `tools/verify_ci_evidence.py`: the minimum required Python test count is now **42** and the negative regression fixture requires a rejection at **41**.

On 23 November 2026, the isolated local snapshot completed `python3 -m unittest discover -s tools/tests -q` with **Ran 42 tests: OK** (Python 3.13.5). Exact `git hash-object` results for the two GitHub-matched verifier files:

- `tools/verify_ci_evidence.py`: `179536cf09224567294c4df022c37609cc73a1fd`
- `tools/tests/test_verify_ci_evidence.py`: `9bfaa8aaee2fc827be94b0cf8f15a211d7404a04`

The 42 tests are **locally verified**, but the latest GitHub-hosted browser run and the CI results at the newest GitHub commit have **not** been verified. GitHub Actions `push` run enumeration is not supported by the available connector path, and the local runtime cannot resolve `api.github.com` directly. No official GIS, APEL, production, or device data was accessed.

## CI proof package and offline verifier (new work)

The lab-only GitHub Actions workflow now preserves source-specific artifacts for **both** Python and browser jobs. Every artifact includes a manifest of the exact GitHub SHA, run ID, run attempt, job kind and final outcome, plus the raw test-runner logs. These records are created in temporary CI workspace only and do not write to the repository or production.

- `yandik-lab-offline-python-evidence`: manifest, raw `python-tests.log`.
- `yandik-lab-browser-evidence`: manifest, raw Node and Playwright logs, browser performance sample, and Playwright reports/traces if produced.
- `tools/verify_ci_evidence.py` validates the SHA and run ID supplied by the reviewer, branch, non-production scope, job success, test counts, no failed/skipped tests, and rejects missing/symlinked log files.
- **10 new negative/positive test cases** for that verifier were added. The total Python suite now has **42 defined test cases** (previously 32). A future successful CI run must demonstrate at least 42 Python tests, 31 Node tests, and 19 Playwright tests on one exact commit.

**Execution is still PENDING for the new evidence workflow and the six new keyboard/network Playwright tests.** The last confirmed hosted run is [#45114481799](https://github.com/dvoriano/yandik-plus/actions/runs/45114481799), an older commit. In the current tool access, newer push-triggered workflow run IDs are not listed. Do not report the new gates as passed until their logs have been independently checked.

[Step-by-step offline artifact verification](CI_EVIDENCE_VERIFICATION.md). The verifier checks internal log consistency only, not third-party geographic licences, physical device reliability or GitHub-runner authenticity.

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
