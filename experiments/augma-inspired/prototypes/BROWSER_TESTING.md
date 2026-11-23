# Browser and hardware testing: reproducible, not automatic

The test suite is **manual**. There is no production deployment and no GitHub Actions trigger. The presence of tests does not mean they passed in an actual browser.

## Local desktop browser

From `experiments/augma-inspired/prototypes/`:

Terminal 1:

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

Terminal 2:

```sh
npm install --no-save @playwright/test
npx playwright install chromium
npm run test:browser
node tools/browser-performance.mjs > /tmp/yandik-lab-perf.json
```

Checks include: rendering of the local province outline, 19 registry regions, search and filter, local upload of **synthetic** 19 polygons, rejection of invalid inputs, grounded answer citations, browser JavaScript errors, external asset requests, and mobile/desktop viewport overflow. CPU/device benchmarks are **not** inferred from page load times.

## Android STB / reused laptop

The same environment may not exist on Android TV. Never flash firmware, root, or modify an office computer without authorization.

If device runs a compatible Linux shell, read-only profile:

```sh
bash tools/device-profile-readonly.sh
```

Record device model, RAM, free disk, CPU architecture, OS, and whether a Chromium-compatible browser is actually available. If browser unavailable, do not call it a browser test. Run localhost server / browser only after compatibility and permission review.

## Attach real evidence

For every execution capture:
- actual timestamp and exact commit SHA
- device/OS/browser + versions and RAM
- Playwright terminal output and failed tests
- human-observed keyboard, touch, and layout behaviour
- JSON benchmark output from `tools/browser-performance.mjs` if it ran
- console errors and external request violations

Results live outside GitHub until explicitly reviewed for private data. Do not upload passwords, configuration secrets, user profiles, or production files.

## Related

- [Geometry audit](../VALIDATION_EVIDENCE_2026-11-23.md)
- [ADM2 source candidates](../docs/GEO_DATA_SOURCES.md)
