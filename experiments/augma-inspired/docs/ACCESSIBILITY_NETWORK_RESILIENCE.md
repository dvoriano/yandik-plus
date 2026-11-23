# Keyboard, accessibility, and network resilience review (Innovation Lab)

**Scope:** Branch `lab/augma-inspired-experiments`, local-only demo. This is a testing protocol, not a claim of WCAG conformance, official GIS accuracy, physical device verification, or approval to deploy.

## Automated browser tests added on 23 November 2026

Source: `prototypes/tests/accessibility-resilience.spec.mjs`.

| Test | What must remain true | Status |
|---|---|---|
| Keyboard region list | Focus and Enter select Mentawai; `aria-pressed=true` | Defined; await new CI run |
| Keyboard SVG markers | Enter and Space change selected region | Defined; await new CI run |
| Assistant keyboard form | Textarea → Tab → Enter submits and displays a source | Defined; await new CI run |
| Dashboard keyboard flow | Search by Tuapejat, focus a row, Enter opens details, synthetic warning remains | Defined; await new CI run |
| Missing local GeoJSON | `fetch` fails, explicit map error visible; 19-region list still usable; missing services display `N/A` | Defined; await new CI run |
| Delayed local GeoJSON | Loading message is visible until 950 ms-delayed response completes, then outline appears | Defined; await new CI run |

These six checks are **in addition to** the previously verified 13 Playwright tests on [CI run #45114481799](https://github.com/dvoriano/yandik-plus/actions/runs/45114481799). They are not counted as passed until a newer run confirms them.

## What automated checks cannot establish

Keyboard smoke tests are not a full accessibility audit. A human should review focus order, focus visibility, zoom at 200% and 400%, text contrast, screen-reader announcements, meaning of SVG geographic features, headings/landmarks, and whether the map remains usable with assistive technology.

Network delay/abort is deterministic simulation in Chromium. It does not establish usability on actual 2G/3G networks, intermittent power, STB device memory limits, or weak cellular coverage.

## Manual review form

| Check | Evidence to collect | Status |
|---|---|---|
| Real keyboard-only walkthrough | Screenshot or concise note of focus order, select/filter/map | PENDING |
| Android TalkBack or NVDA/VoiceOver | Spoken labels, dynamic status, error messages | PENDING |
| Physical touch screen | Tap targets and scrolling on an actual phone | PENDING |
| Browser zoom and contrast | Readability at 200%/400%, dark and high-contrast modes | PENDING |
| Slow/offline network on device | Time to useful first UI, fallback usability, memory stability | PENDING |
| Real STB/laptop | Ownership permission, CPU/RAM/disk/OS, local-only lab trial | PENDING |

## Run safely

From `experiments/augma-inspired/prototypes/`, start `python3 -m http.server 8767 --bind 127.0.0.1`. In a second terminal:

```sh
npx playwright test --config=playwright.config.mjs tests/accessibility-resilience.spec.mjs
```

No production endpoint, live APEL database, private records, server credentials, or real user accounts are needed. Confirm the source remains on the lab branch before any test execution.
