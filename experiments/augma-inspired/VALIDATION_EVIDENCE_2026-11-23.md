# Validation evidence: 23 November 2026

## Scope
Only the isolated branch \`lab/augma-inspired-experiments\`. Production services, website APEL, database, main/develop branches, and any STB remain untouched.

## Verified in this work session

| Check | Result | Evidence | Limit |
|---|---|---|---|
| Shapely spatial auditor on self-generated 19-rectangle fixtures | **5 unit tests passed locally** | \`python3 -m unittest discover -s tools/tests -v\` | Synthetic geometry only; no real administrative polygons tested |
| Duplicate administrative IDs | Rejected (tested) | \`test_duplicate_fails\` | Only IDs in current registry |
| Self-intersecting polygon | Rejected (tested) | \`test_bowtie_fails\` | Shapely validity |
| Overlapping polygons | Rejected (tested) | \`test_overlap_fails\` | Area ratio threshold may need GIS review |
| Missing 19th region | Rejected (tested) | \`test_missing_fails\` | Feature count check |
| GitHub isolation | Confirm with compare main...lab | GitHub compare, branch check | A branch is not a security boundary if manually merged |
| Geospatial source review | Source descriptions inspected | BIG/BNPB and data.go.id pages | No authoritative ADM2 package independently obtained |
| Real Chromium against repository UI | **NOT RUN** | Browser smoke and quality tests committed for manual run | Container did not have the complete GitHub checkout |
| Android TV/STB physical benchmark | **NOT RUN** | Read-only device profile script committed | Device not physically accessible to this session |
| GIS topology of real 19 ADM2 geometries | **NOT RUN** | Offline Shapely audit script prepared | A licensed and verified dataset is required |

**Interpretation:** Technical test script passes with synthetic fixtures. This is not a legal, accuracy, or readiness certification.

## Reproduce geometry audit

Prerequisite: Python 3.10+ and Shapely 2+. From \`experiments/augma-inspired/\`:

\`\`\`sh
python3 -m unittest discover -s tools/tests -v

# Only after independently obtaining a permitted, reviewed ADM2 GeoJSON file:
python3 tools/audit_adm2.py /path/to/adm2-sumbar.geojson \
  --registry prototypes/geo-command-center/regions.mjs \
  --outline prototypes/geo-command-center/data/sumbar-outline.geojson \
  --report /tmp/yandik-lab-adm2-report.json
\`\`\`

Exit 0 + \`PASS_TECHNICAL_NOT_CERTIFIED\` means hard geometry checks passed; it does **not** establish source licence, legal boundary status, official codes in force, topological completeness, or accuracy on the ground. Outline differences are a **warning**, not automatic grounds for legal conclusions.

## Reproduce real browser checks

\`\`\`sh
cd prototypes
python3 -m http.server 8767 --bind 127.0.0.1
\`\`\`

In another terminal in the same folder:

\`\`\`sh
npm install --no-save @playwright/test
npx playwright install chromium
npm run test:browser
node tools/browser-performance.mjs > /tmp/yandik-lab-browser-performance.json
\`\`\`

Playwright uses localhost only; test data are synthetic or absent. Desktop and mobile-viewport results must be recorded after actual execution. **Mobile emulation is not a physical-phone test.**

## Physical STB read-only profile

On the STB *only if Linux shell with the necessary commands is available*, after cloning/copying the lab to a separate directory:

\`\`\`sh
bash prototypes/tools/device-profile-readonly.sh
\`\`\`

It reads kernel, board model, CPU, memory, disk, and tool availability. It does not install packages, modify boot, change a service, or benchmark application render time. A successful profile is **not** proof that a browser/server works on that STB.

## Source provenance caveats

- BIG maintains REST layers for area boundaries (e.g. [BIG Kab/Kota 50K](https://kspservices.big.go.id/satupeta/rest/services/RBI/Administrasi_AR_KabKota_50K/MapServer/0)), but layer access/metadata and distribution permission must be checked before use.
- [BNPB Sumbar 2022](https://gis.bnpb.go.id/server/rest/services/Hosted/DATA_KABKOT_SUMBAR1/FeatureServer/5) offers polygon GeoJSON and identifies historical boundary inputs. Its description itself warns that some line features have topology errors. Do not infer automatic legal accuracy.
- [Kementerian Dalam Negeri dataset on data.go.id](https://data.go.id/dataset/dataset/peta-batas-administrasi-provinsi-dan-kabupaten-kota) is listed publicly (8 Oct 2026) but its geo-data resource links were marked problematic in the listing at review.
- Do not redistribute third-party boundary files until provenance, attribution, and licence have been established.

## Unresolved acceptance gates

- [ ] Obtain a permitted/current ADM2 dataset with 19 reviewed regions and confirmed metadata.
- [ ] Run topology audit on those actual polygons, inspect islands and neighbouring boundaries in QGIS.
- [ ] Run committed Playwright scripts against the exact checkout; record versions, screenshots, and measurements.
- [ ] Run read-only profile and browser tests on actual STB or supported low-cost device.
- [ ] Authorize any integration separately under YANDIK+ governance; no automatic merge/deploy.
