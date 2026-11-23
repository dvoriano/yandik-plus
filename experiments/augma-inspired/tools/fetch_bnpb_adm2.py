#!/usr/bin/env python3
"""Explicit, read-only acquisition of BNPB West Sumatra ADM2 candidates.

NOT automatically executed, installed or deployed. The resulting geometry is
for research/technical QA only, NOT a legally certified boundary dataset.
Requires Python 3.10+ and Shapely 2+ for the final technical audit.
"""
import argparse
import datetime as dt
import hashlib
import json
import re
import sys
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

from audit_adm2 import evaluate, load_registry

SOURCE = "https://gis.bnpb.go.id/server/rest/services/Hosted/DATA_KABKOT_SUMBAR1/FeatureServer/5"
ALLOWED_HOST = "gis.bnpb.go.id"
REQUIRED_FIELDS = {"fid", "kdpkab", "namobj", "wadmkk"}
MAX_RESPONSE_BYTES = 10_000_000
MAX_TOTAL_BYTES = 20_000_000
REGISTRY = Path(__file__).resolve().parents[1] / "prototypes/geo-command-center/regions.mjs"
OUTLINE = Path(__file__).resolve().parents[1] / "prototypes/geo-command-center/data/sumbar-outline.geojson"


def normalize(value):
    return " ".join(re.sub(r"[^\w\s]", " ", str(value).casefold()).split())


class HostOnlyRedirect(urllib.request.HTTPRedirectHandler):
    """Reject cross-host redirects before any request to the redirect target."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        parsed = urllib.parse.urlparse(newurl)
        if parsed.scheme != "https" or parsed.hostname != ALLOWED_HOST:
            raise ValueError("Redirect ke luar host diizinkan ditolak")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


_PINNED_OPENER = urllib.request.build_opener(HostOnlyRedirect()).open


def query_json(endpoint, params, *, opener=_PINNED_OPENER):
    """Call only the pinned public endpoint, with bounded JSON responses."""
    if endpoint not in (SOURCE, SOURCE + "/query"):
        raise ValueError("Endpoint tidak termasuk allowlist")
    url = endpoint + "?" + urllib.parse.urlencode(params)
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or parsed.hostname != ALLOWED_HOST:
        raise ValueError("URL harus memakai host HTTPS yang diizinkan")
    request = urllib.request.Request(url, headers={
        "Accept": "application/geo+json, application/json",
        "User-Agent": "YANDIK-Lab-ReadOnly-GeoQA/0.1 (research)"
    })
    with opener(request, timeout=25) as response:
        redirected = urllib.parse.urlparse(response.geturl())
        if redirected.hostname != ALLOWED_HOST or redirected.scheme != "https":
            raise ValueError("Redirect ke luar host diizinkan ditolak")
        data = response.read(MAX_RESPONSE_BYTES + 1)
    if len(data) > MAX_RESPONSE_BYTES:
        raise ValueError("Respons melebihi batas ukuran")
    result = json.loads(data.decode("utf-8"))
    if not isinstance(result, dict):
        raise ValueError("Bukan dokumen JSON")
    if "error" in result:
        raise ValueError("Layanan melaporkan error ArcGIS")
    return result, len(data)


def validate_service(metadata):
    if metadata.get("geometryType") != "esriGeometryPolygon":
        raise ValueError("Layer bukan esriGeometryPolygon")
    if "Query" not in metadata.get("capabilities", "").split(","):
        raise ValueError("Layer tidak memiliki kapabilitas Query")
    fields = {field.get("name") for field in metadata.get("fields", [])}
    if not REQUIRED_FIELDS.issubset(fields):
        raise ValueError("Atribut identitas geometri tidak lengkap")
    wkid = metadata.get("extent", {}).get("spatialReference", {}).get("wkid")
    if wkid != 4326:
        raise ValueError("Koordinat layer tidak menyatakan EPSG:4326")
    if metadata.get("objectIdField") != "fid":
        raise ValueError("Object ID layanan berubah")
    if "geojson" not in metadata.get("supportedQueryFormats", "").casefold():
        raise ValueError("Output GeoJSON tidak didukung")
    return True


def validate_upstream_feature(feature, expected):
    if not isinstance(feature, dict):
        raise ValueError("Fitur sumber bukan objek GeoJSON")
    props = feature.get("properties")
    if not isinstance(props, dict):
        raise ValueError("Atribut fitur hilang")
    code = str(props.get("kdpkab") or props.get("kdppum") or "").strip()
    if code not in expected:
        raise ValueError("Kode sumber tidak cocok registry: " + code[:30])
    name = str(props.get("wadmkk") or props.get("namobj") or "").strip()
    canonical = expected[code]
    valid_names = {normalize(canonical), normalize(canonical.split(" ", 1)[-1])}
    if normalize(name) not in valid_names:
        raise ValueError("Nama/kode sumber tidak cocok: " + code + " (" + name[:90] + ")")
    geometry = feature.get("geometry")
    if not isinstance(geometry, dict) or geometry.get("type") not in ("Polygon", "MultiPolygon"):
        raise ValueError("Bentuk geometri tidak didukung: " + code)
    return code, name


def acquire(requester, expected):
    total_size = 0
    metadata, size = requester(SOURCE, {"f": "json"})
    total_size += size
    validate_service(metadata)
    id_doc, size = requester(SOURCE + "/query", {
        "where": "1=1", "returnIdsOnly": "true", "f": "json"
    })
    total_size += size
    ids = id_doc.get("objectIds")
    if not isinstance(ids, list) or len(ids) != 19 or any(not isinstance(v, int) for v in ids):
        raise ValueError("Layanan tidak mengembalikan tepat 19 objectId")
    if len(set(ids)) != 19:
        raise ValueError("ObjectId sumber duplikat")
    ids.sort()
    features = []
    names = set()
    for start in range(0, len(ids), 3):
        batch = ids[start:start+3]
        returned_object_ids = set()
        result, size = requester(SOURCE + "/query", {
            "objectIds": ",".join(map(str, batch)),
            "outFields": "fid,namobj,kdpkab,kdppum,wadmkk,wadmpr",
            "outSR": "4326", "returnGeometry": "true", "f": "geojson"
        })
        total_size += size
        if total_size > MAX_TOTAL_BYTES:
            raise ValueError("Jumlah data terlalu besar untuk lab")
        if result.get("type") != "FeatureCollection":
            raise ValueError("Query GeoJSON tidak mengembalikan FeatureCollection")
        subset = result.get("features")
        if not isinstance(subset, list) or len(subset) != len(batch):
            raise ValueError("Jumlah geometri per batch tidak sesuai objectIds")
        for feature in subset:
            code, name = validate_upstream_feature(feature, expected)
            props = feature["properties"]
            returned_id = props.get("fid", feature.get("id"))
            if type(returned_id) is not int or returned_id not in batch:
                raise ValueError("ObjectId respons tidak cocok batch permintaan")
            if returned_id in returned_object_ids:
                raise ValueError("ObjectId respons duplikat dalam batch")
            returned_object_ids.add(returned_id)
            if code in names:
                raise ValueError("Duplikasi kode sumber: " + code)
            names.add(code)
            features.append({
                "type": "Feature",
                "properties": {
                    "code": code, "name": expected[code],
                    "source_code": code, "source_name": name,
                    "source": "BNPB-DATA_KABKOT_SUMBAR1-2022"
                },
                "geometry": feature["geometry"]
            })
        if returned_object_ids != set(batch):
            raise ValueError("Cakupan ObjectId per batch tidak lengkap")
    if names != set(expected):
        raise ValueError("Cakupan 19 kode wilayah tidak lengkap")

    # Detect data edits during pagination. Never silently combine mismatched snapshots.
    final_ids_doc, final_size = requester(SOURCE + "/query", {
        "where": "1=1", "returnIdsOnly": "true", "f": "json"
    })
    total_size += final_size
    if total_size > MAX_TOTAL_BYTES:
        raise ValueError("Jumlah data terlalu besar untuk lab")
    final_ids = final_ids_doc.get("objectIds")
    if not isinstance(final_ids, list) or len(final_ids) != 19 or set(final_ids) != set(ids):
        raise ValueError("Daftar ObjectId sumber berubah selama proses pembacaan")
    features.sort(key=lambda item: item["properties"]["code"])
    return {"type": "FeatureCollection", "features": features}, ids, total_size


def main(argv=None, requester=query_json):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fetch-public-bnpb", action="store_true",
                        help="I explicitly authorize a read-only request to the public BNPB ArcGIS server")
    parser.add_argument("--output-dir", type=Path, required=True,
                        help="Absolute temporary output path OUTSIDE the GitHub repository")
    args = parser.parse_args(argv)
    if not args.fetch_public_bnpb:
        parser.error("Wajib --fetch-public-bnpb; tidak ada panggilan jaringan default")
    directory = args.output_dir.expanduser().resolve()
    repo_root = Path(__file__).resolve().parents[3]
    if directory == repo_root or repo_root in directory.parents:
        parser.error("Simpan hasil di luar repository; tidak otomatis menyalin data geospasial")
    expected = load_registry(REGISTRY)
    try:
        candidate, ids, bytes_received = acquire(requester, expected)
        with tempfile.TemporaryDirectory(prefix="yandik-bnpb-qa-") as temporary:
            temporary_file = Path(temporary) / "source-adm2.geojson"
            temporary_file.write_text(json.dumps(candidate, ensure_ascii=False), encoding="utf-8")
            audit = evaluate(temporary_file, REGISTRY, OUTLINE if OUTLINE.exists() else None)
            if audit["status"] != "PASS_TECHNICAL_NOT_CERTIFIED":
                print(json.dumps({"status": "REJECTED", "audit": audit}, ensure_ascii=False, indent=2))
                return 1
            directory.mkdir(parents=True, exist_ok=True)
            raw = temporary_file.read_bytes()
            sha = hashlib.sha256(raw).hexdigest()
            target = directory / "sumbar-adm2-bnpb-candidate.geojson"
            if target.exists():
                raise ValueError("File target sudah ada; untuk mencegah overwrite, tentukan folder output baru")
            target.write_bytes(raw)
            manifest = {
                "status": "TECHNICALLY_CHECKED_NOT_CERTIFIED",
                "source": SOURCE,
                "retrieved_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
                "source_license_status": "NOT_VERIFIED",
                "legal_boundary_status": "NOT_VERIFIED",
                "sha256": sha, "bytes_received": bytes_received,
                "features": len(candidate["features"]),
                "object_ids": ids,
                "technical_audit": audit
            }
            (directory / "manifest.json").write_text(
                json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
            print(json.dumps({"status": manifest["status"], "geojson": str(target),
                              "manifest": str(directory / "manifest.json"),
                              "sha256": sha, "source_license_status": "NOT_VERIFIED"}, indent=2))
            return 0
    except (ValueError, OSError, UnicodeError, TimeoutError, json.JSONDecodeError) as exc:
        print(json.dumps({"status": "FAILED_CLOSED", "reason": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    sys.exit(main())
