# Source candidates: administrative boundaries in West Sumatra (ADM2)

Review date: 23 November 2026. **No legally validated 19-kabupaten/kota polygon dataset has been committed.** The browser import layer checks basic structure only; the Shapely audit adds geometry/topology checks, still without certifying legal boundaries or licences.

| Source | Verified descriptive status | Use decision |
|---|---|---|
| [BIG area boundary layer](https://kspservices.big.go.id/satupeta/rest/services/RBI/Administrasi_AR_KabKota_50K/MapServer/0) | National polygon layer, WGS84/4326, supports GeoJSON; fields include KDPKAB/WADMKK | Preferred official reference; resolve export rights, actual matching, and effective date first |
| [BIG hosted administrative area](https://geoservices.big.go.id/rbi/rest/services/Hosted/Wilayah_Administrasi_Kabupaten__Kota/FeatureServer/0) | Detailed dataset description indicates sources from RBI, adjudication and Kemendagri; this endpoint intermittently returned server errors during review | Cross-check when service available |
| [BNPB Sumbar polygon layer (2022)](https://gis.bnpb.go.id/server/rest/services/Hosted/DATA_KABKOT_SUMBAR1/FeatureServer/5) | The publisher describes its May-2021 revision and 2022 updates and notes topology errors in some source lines; supports geoJSON | Secondary reference with explicit topology caution |
| [Kemendagri via data.go.id](https://data.go.id/dataset/dataset/peta-batas-administrasi-provinsi-dan-kabupaten-kota) | Dataset page dated 8 Oct 2026, but primary file links are flagged problematic | Do not treat listing alone as successful download |
| [OSM administrative extraction](https://github.com/ahsa29/kpu-osm-boundaries-2026) | 2026-10-10b manifest lists 19 West Sumatra kab/kota; ODbL 1.0 and attribution obligations | Visual cross-check only after licensing and quality review |
| [Gapmap boundary data](https://gapmap.aignited.id/en/data/) | Lists simplified `kabupaten.geojson` (~1.8 MB); attribution describes MIT from upstream cahyadsn | Research alternative; verify exact licence chain |
| [Initial province outline](https://github.com/mashadinoor/Indonesia-Geojson-2026) | Included in the lab as a reference province outline with upstream MIT notice | Display aid, not a legal boundary |

## Important warning about false ADM2 data

Some apparent kab/kota files under `Kabupaten/Sumatera_Barat/` from the early provider contained a single *kelurahan* feature, not a kabupaten/kota polygon. Those are not acceptable for ADM2 mapping.

## Accept only after six checks

1. Record original source URL, hash, download date, release/version, terms, and permitted redistribution.
2. Match 19 **unique** code+name identifiers, verify 12 kabupaten/7 kota and current effective administrative registry.
3. Check Polygon/MultiPolygon, closed rings, nonempty shapes, bounds in West Sumatra, and self-intersections.
4. Reject substantial overlaps across neighbouring ADM2 polygons; investigate topology gaps with GIS, especially Mentawai.
5. Compare with an independently trusted reference; coastlines and islands may differ by edition. Area ratios are not legal evidence.
6. Retain review sign-off before publishing or integrating into YANDIK+ production.

## Lab tools

The existing `prototypes/geo-command-center/boundary-loader.mjs` validates 19 feature identities and simple rings in the **browser**, and does not upload anything.

`tools/audit_adm2.py` optionally reads the same GeoJSON from a local disk with Shapely 2 and returns a machine-readable JSON technical audit. Its success status is `PASS_TECHNICAL_NOT_CERTIFIED`, never "official".

See [validation evidence](../VALIDATION_EVIDENCE_2026-11-23.md). No external source content is auto-downloaded or silently copied into the repo.
