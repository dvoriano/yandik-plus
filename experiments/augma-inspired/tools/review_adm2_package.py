#!/usr/bin/env python3
"""Offline ADM2 provenance + geometry check; NEVER certifies a legal boundary."""
import argparse
import datetime as dt
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

from audit_adm2 import evaluate

MAX_GEOMETRY = 25_000_000
MAX_MANIFEST = 65536


def public_source(url):
    if not isinstance(url, str) or len(url) > 2048:
        return False
    try:
        parsed = urlsplit(url)
        return (parsed.scheme == "https" and bool(parsed.hostname)
                and not parsed.username and not parsed.password
                and not parsed.query and not parsed.fragment
                and parsed.port in (None, 443))
    except ValueError:
        return False


def review(geometry_path, manifest_path, registry_path, outline_path=None):
    result = {"schema": "yandik.lab.adm2-provenance.v1",
              "status": "REJECTED", "release_approved": False,
              "legal_boundary_verified": False, "license_verified": False,
              "errors": [], "warnings": []}
    try:
        geometry_path, manifest_path = Path(geometry_path), Path(manifest_path)
        if geometry_path.stat().st_size > MAX_GEOMETRY:
            raise ValueError("GeoJSON >25 MB")
        if manifest_path.stat().st_size > MAX_MANIFEST:
            raise ValueError("Manifest >64 KB")
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        if not isinstance(manifest, dict):
            raise ValueError("Manifest wajib objek JSON")
        actual_sha = hashlib.sha256(geometry_path.read_bytes()).hexdigest()
        result["source_sha256"] = actual_sha
        raw_sha = manifest.get("sha256", "")
        if not isinstance(raw_sha, str) or not re.fullmatch("[0-9a-fA-F]{64}", raw_sha):
            result["errors"].append("SHA256 manifest wajib 64 karakter heksadesimal")
        elif raw_sha.lower() != actual_sha:
            result["errors"].append("Checksum file tidak cocok manifest")
        if not public_source(manifest.get("source")):
            result["errors"].append("Sumber harus HTTPS tanpa credential, query atau fragmen")
        try:
            timestamp = manifest["retrieved_utc"]
            if not isinstance(timestamp, str):
                raise ValueError("type")
            when = dt.datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            if when.tzinfo is None or when > dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=5):
                raise ValueError("timestamp")
        except (KeyError, ValueError, TypeError):
            result["errors"].append("retrieved_utc tidak valid/di masa depan")
        for key in ("publisher", "dataset_version", "source_license_status"):
            if not manifest.get(key):
                result["warnings"].append(key + ": belum dicatat")
        # Any declared permission is a claim; it is not independently verified.
        result["warnings"].append("Izin pakai, hak redistribusi, versi resmi dan topologi memerlukan review manusia")
        audit = evaluate(geometry_path, Path(registry_path),
                         Path(outline_path) if outline_path else None)
        result["geometry_status"] = audit["status"]
        result["region_count"] = len(audit.get("regions", []))
        result["geometry_errors"] = audit.get("errors", [])
        result["geometry_warnings"] = audit.get("warnings", [])
        if audit["status"] != "PASS_TECHNICAL_NOT_CERTIFIED":
            result["errors"].append("Audit 19 geometri gagal")
        if not result["errors"]:
            result["status"] = "TECHNICAL_PASS_REVIEW_REQUIRED"
    except (OSError, ValueError, TypeError, UnicodeError, json.JSONDecodeError) as exc:
        result["errors"].append(type(exc).__name__ + ": " + str(exc))
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("geojson", type=Path)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--registry", type=Path, required=True)
    parser.add_argument("--outline", type=Path)
    args = parser.parse_args(argv)
    result = review(args.geojson, args.manifest, args.registry, args.outline)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["status"] == "TECHNICAL_PASS_REVIEW_REQUIRED" else 1


if __name__ == "__main__":
    sys.exit(main())
