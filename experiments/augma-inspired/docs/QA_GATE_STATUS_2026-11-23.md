# Quality gates, YANDIK+ Innovation Lab

Reviewed on 23 November 2026. **Not an operational-release approval.** This document distinguishes tests **defined**, tests **run**, and tests **passed**.

## The next decision

**Remain in isolated lab.** Do not merge or deploy until the complete checks have been executed in a reproducible checkout and reviewed. External geospatial sources still require licensing and GIS verification.

## Evidence and current state

| Gate | Implemented | Executed with current evidence | Acceptance |
|---|---|---|---|
| Shapely geometry checks, synthetic fixtures | Yes, 6 Python test functions | **6 passed locally** | Technical fixture QA only |
| BNPB importer mock behavior | Yes, 9 Python test functions | **Not verified in complete checkout** | Must run and pass |
| Branch/file/production-domain isolation policy | Yes, 5 Python test functions | **Not verified in complete checkout** | Must run and pass |
| Node unit tests | Scripts present, include simulation | Partial independent in-memory logic checks only | Must run in Node |
| Browser desktop/mobile viewport | Playwright specs present | **No confirmed run** | Must pass real Chromium |
| Browser failure evidence | HTML report, traces, performance output configured | No workflow report retrieved | Review failed steps and artifacts |
| Real ADM2 dataset 19 regions | Reader and auditor available, manual opt-in | **No 19 official polygons verified** | Metadata, license, geometry, topology, attribution |
| Physical STB | Read-only profiler available | **Not run on STB** | Manual device and performance evidence |

A successful Shapely fixture test is not proof that BNPB polygons are valid. A viewport simulation is not physical mobile/Android TV verification.

## GitHub Actions setup

Workflow: `.github/workflows/yandik-innovation-lab-ci.yml`, allowed **only** on branch `lab/augma-inspired-experiments`.

It implements three jobs:

1. **isolation-policy**: compare against `origin/main`, fail on changed non-lab paths except the single workflow; detect symlinks, secret filenames and selected production domains in runnable sources.
2. **geometry-and-acquisition**: Shapely, 20 total Python test definitions (6 geometry + 9 importer + 5 isolation), and a negative check that the BNPB downloader does not connect without opt-in.
3. **browser-smoke**: `node --check` on all lab JS modules, JavaScript unit tests, desktop/mobile viewport Playwright tests, and local browser performance sampling.

The last two jobs depend on successful isolation-policy. The workflow is read-only with `permissions: contents: read`, checkout credentials not persisted, and there are no deployment steps.

**Important:** the available GitHub connector does not expose a trustworthy list of `push`-triggered workflow runs. An empty commit status result is **not** a green test result. Check the Actions page for this branch, run IDs, logs and artifacts before marking any CI box complete.

## How to reproduce without production access

From a clone of the lab branch:

```sh
git checkout lab/augma-inspired-experiments
git fetch --no-tags origin main
python3 experiments/augma-inspired/tools/check_lab_isolation.py --base-ref origin/main
cd experiments/augma-inspired
python3 -m unittest discover -s tools/tests -v
cd prototypes
npm run test:unit
python3 -m http.server 8767 --bind 127.0.0.1
```

In a second terminal from `prototypes/`:

```sh
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
npm run test:browser:perf
```

Only the local static prototype server is contacted during Playwright tests. Never connect this QA workflow to APEL production, VPS services, private records or real Puskeswan user accounts.

## Active blockers

- [ ] Capture an actual GitHub Actions push run with three job outcomes and retained logs.
- [ ] Correct test failures, if any, then rerun the same commit.
- [ ] Record browser screenshot/accessibility/manual device observations after genuine execution.
- [ ] Obtain and verify permitted ADM2 data in a separate offline GIS review.
- [ ] Audit STB physically only after owner authorization and local compatibility checks.

## References

- [Source branch](https://github.com/dvoriano/yandik-plus/tree/lab/augma-inspired-experiments)
- [Branch-only Actions workflow](https://github.com/dvoriano/yandik-plus/blob/lab/augma-inspired-experiments/.github/workflows/yandik-innovation-lab-ci.yml)
- [Existing geometry validation evidence](../VALIDATION_EVIDENCE_2026-11-23.md)
