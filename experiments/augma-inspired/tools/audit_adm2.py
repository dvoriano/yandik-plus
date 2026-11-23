#!/usr/bin/env python3
"""Offline spatial audit of a 19-feature West Sumatra ADM2 GeoJSON.

This is a TECHNICAL audit only, not certification of boundaries, attribution,
source licensing, or administrative validity. Does not fetch or mutate data.
Requires Shapely >= 2.0. Exit 0 only when hard checks pass.
"""
import argparse
import hashlib
import json
import re
import sys
from itertools import combinations
from pathlib import Path
from shapely.geometry import shape
from shapely.ops import unary_union
from shapely.validation import explain_validity

CODE_FIELDS = ("code", "kode", "KODE", "KDPKAB", "kdpkab", "KDPPUM", "kdppum")
NAME_FIELDS = ("name", "shapeName", "WADMKK", "wadmkk", "nama")
HARD_BBOX = (98, -4, 103, 2)


def load_registry(path):
    source = path.read_text(encoding="utf-8")
    pairs = re.findall(r'\bcode:\s*"(13\.\d{2})",\s*name:\s*"([^"]+)"', source)
    expected = dict(pairs)
    if len(pairs) != 19 or len(expected) != 19:
        raise ValueError("Registry lab harus memiliki tepat 19 kode unik")
    return expected


def code_for(props):
    for field in CODE_FIELDS:
        value = props.get(field)
        if isinstance(value, str) and re.fullmatch(r"13\.\d{2}", value.strip()):
            return value.strip()
    return None


def norm(text):
    return " ".join(re.sub(r"[^\w\s]", " ", str(text).casefold()).split())


def evaluate(path, registry_path, outline_path=None):
    output = {"schema": "yandik.lab.adm2-audit.v1", "status": "FAIL",
              "source_file": path.name, "source_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
              "source_license_verified": False, "legal_boundary_verified": False,
              "technical_checks_only": True, "errors": [], "warnings": [], "regions": []}
    try:
        expected = load_registry(registry_path)
        dataset = json.loads(path.read_text(encoding="utf-8"))
        features = dataset.get("features") if isinstance(dataset, dict) else None
        if not isinstance(dataset, dict) or dataset.get("type") != "FeatureCollection" or not isinstance(features, list):
            raise ValueError("GeoJSON harus berbentuk FeatureCollection")
        if len(features) != 19:
            raise ValueError(f"Butuh 19 fitur ADM2, ditemukan {len(features)}")
        polys = {}
        for index, feature in enumerate(features):
            props = feature.get("properties") if isinstance(feature, dict) else None
            props = props if isinstance(props, dict) else {}
            code = code_for(props)
            if not code or code not in expected:
                output["errors"].append(f"Fitur {index}: kode ADM2 tidak cocok/tidak ada")
                continue
            if code in polys:
                output["errors"].append(f"Kode duplikat: {code}")
                continue
            name = next((props[x] for x in NAME_FIELDS if isinstance(props.get(x), str) and props[x]), None)
            if name and norm(name) != norm(expected[code]) and norm(name) != norm(expected[code].split(" ",1)[-1]):
                output["errors"].append(f"{code}: nama tidak cocok ({name} != {expected[code]})")
            geom = feature.get("geometry") or {}
            if geom.get("type") not in ("Polygon", "MultiPolygon"):
                output["errors"].append(f"{code}: bukan Polygon/MultiPolygon")
                continue
            try:
                polygon = shape(geom)
            except Exception as exc:
                output["errors"].append(f"{code}: geometri tidak terbaca ({type(exc).__name__})")
                continue
            if polygon.is_empty or not polygon.is_valid or polygon.area <= 0:
                output["errors"].append(f"{code}: geometri invalid/kosong ({explain_validity(polygon)})")
                continue
            minx,miny,maxx,maxy = polygon.bounds
            if not (HARD_BBOX[0] <= minx < maxx <= HARD_BBOX[2] and HARD_BBOX[1] <= miny < maxy <= HARD_BBOX[3]):
                output["errors"].append(f"{code}: koordinat keluar rentang Sumbar")
                continue
            polys[code] = polygon
            output["regions"].append({"code":code,"name":expected[code],"geometry_valid":True,
                                      "area_degree_squared":round(polygon.area,8)})
        missing = sorted(set(expected) - set(polys))
        if missing:
            output["errors"].append("Wilayah gagal/hilang: " + ", ".join(missing))
        # Use planar bounds/areas for indicative overlap signal only, not cadastral distance.
        for (a, x), (b, y) in combinations(polys.items(), 2):
            if not x.intersects(y):
                continue
            overlap = x.intersection(y).area
            # A true area overlap greater than 0.005% of smaller area flags a review.
            if overlap > 0 and overlap / min(x.area, y.area) >= 0.00005:
                output["errors"].append(f"Geometri saling tumpang tindih: {a} dan {b} (rasio {overlap / min(x.area,y.area):.5%})")
        if outline_path and polys:
            outline_doc = json.loads(outline_path.read_text(encoding="utf-8"))
            if outline_doc.get("type") != "FeatureCollection" or not outline_doc.get("features"):
                raise ValueError("Outline provinsi tidak valid")
            outline = unary_union([shape(f["geometry"]) for f in outline_doc["features"]])
            if not outline.is_valid:
                output["warnings"].append("Outline provinsi sendiri tidak valid")
            else:
                union = unary_union(list(polys.values()))
                outside = union.difference(outline).area
                omitted = outline.difference(union).area
                output["outline_comparison"] = {"outside_ratio":round(outside / max(union.area, 1e-12), 6),
                                               "missing_ratio":round(omitted / max(outline.area,1e-12), 6)}
                if outside > 0 or omitted > 0:
                    output["warnings"].append("Terdapat selisih dengan outline; cek coastline, pulau, versi, dan sumber GIS sebelum digunakan")
        # Never claim licensing / jurisdictional approval based only on structure/geometry.
        output["status"] = "PASS_TECHNICAL_NOT_CERTIFIED" if not output["errors"] else "FAIL"
    except (ValueError, TypeError, KeyError, json.JSONDecodeError) as exc:
        output["errors"].append(str(exc))
    return output


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("geojson", type=Path)
    parser.add_argument("--registry", type=Path, required=True, help="Path to geo-command-center/regions.mjs")
    parser.add_argument("--outline", type=Path, help="Optional province outline GeoJSON for approximate comparison")
    parser.add_argument("--report", type=Path, help="JSON output (defaults to stdout)")
    args = parser.parse_args(argv)
    try:
        result = evaluate(args.geojson, args.registry, args.outline)
    except (OSError, ValueError) as exc:
        result = {"status": "FAIL", "errors": [str(exc)], "technical_checks_only": True}
    doc = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.report:
        args.report.write_text(doc, encoding="utf-8")
    else:
        print(doc, end="")
    return 0 if result["status"] == "PASS_TECHNICAL_NOT_CERTIFIED" else 1


if __name__ == "__main__":
    sys.exit(main())
