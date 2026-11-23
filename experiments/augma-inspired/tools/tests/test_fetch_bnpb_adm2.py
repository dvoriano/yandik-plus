"""Offline unit tests: public BNPB reader uses no real network."""
import contextlib
import io
import tempfile
import unittest
from pathlib import Path
from sys import path as sys_path

HERE = Path(__file__).resolve().parents[1]
sys_path.insert(0, str(HERE))
from audit_adm2 import load_registry
from fetch_bnpb_adm2 import (SOURCE, REGISTRY, acquire, query_json, validate_service)


def make_geometry(x, y):
    return {"type": "Polygon", "coordinates": [[
        [x, y], [x + .08, y], [x + .08, y + .08], [x, y + .08], [x, y]
    ]]}


class FakeArcGis:
    def __init__(self, expected, *, missing=False, bad_name=False, duplicate=False):
        self.expected = expected
        self.calls = []
        self.missing = missing
        self.bad_name = bad_name
        self.duplicate = duplicate
        self.codes = sorted(expected)
        self.ids = list(range(1, 20))

    def __call__(self, endpoint, params):
        self.calls.append((endpoint, params))
        if endpoint == SOURCE:
            doc = {
                "geometryType": "esriGeometryPolygon", "capabilities": "Query",
                "supportedQueryFormats": "JSON, geoJSON, PBF",
                "extent": {"spatialReference": {"wkid": 4326}},
                "fields": [{"name": field} for field in ("fid", "namobj", "kdpkab", "wadmkk")]
            }
            return doc, 300
        if params.get("returnIdsOnly") == "true":
            ids = self.ids[:-1] if self.missing else self.ids
            return {"objectIds": ids}, 200
        batch = [int(i) for i in params["objectIds"].split(",")]
        features = []
        for number in batch:
            code = self.codes[number - 1]
            if self.duplicate and number == 19:
                code = self.codes[0]
            col = (number - 1) % 5
            row = (number - 1) // 5
            x, y = 98.5 + col * .35, -3 + row * .35
            name = self.expected[code]
            if self.bad_name and number == 1:
                name = "Nama lain yang tidak cocok"
            features.append({
                "type": "Feature",
                "properties": {"fid": number, "kdpkab": code, "wadmkk": name},
                "geometry": make_geometry(x, y)
            })
        return {"type": "FeatureCollection", "features": features}, 1000


class BnpbSourceTests(unittest.TestCase):
    def test_reads_only_pinned_public_layer_with_pagination(self):
        registry = load_registry(REGISTRY)
        fake = FakeArcGis(registry)
        collection, object_ids, received = acquire(fake, registry)
        self.assertEqual(len(collection["features"]), 19)
        self.assertEqual(object_ids, list(range(1, 20)))
        self.assertGreater(received, 0)
        self.assertEqual(len(fake.calls), 9)  # metadata + IDs + 7 bounded batches
        self.assertTrue(all(url in (SOURCE, SOURCE + "/query") for url, _ in fake.calls))
        self.assertTrue(all(
            c[1].get("f") == "geojson" for c in fake.calls[2:]
        ))
        self.assertEqual(
            {f["properties"]["code"] for f in collection["features"]}, set(registry)
        )

    def test_rejects_missing_object_id(self):
        with self.assertRaisesRegex(ValueError, "tepat 19"):
            acquire(FakeArcGis(load_registry(REGISTRY), missing=True), load_registry(REGISTRY))

    def test_rejects_duplicate_region_code(self):
        registry = load_registry(REGISTRY)
        with self.assertRaisesRegex(ValueError, "Duplikasi kode"):
            acquire(FakeArcGis(registry, duplicate=True), registry)

    def test_rejects_mismatch_between_code_and_name(self):
        registry = load_registry(REGISTRY)
        with self.assertRaisesRegex(ValueError, "tidak cocok"):
            acquire(FakeArcGis(registry, bad_name=True), registry)

    def test_rejects_bad_metadata(self):
        with self.assertRaisesRegex(ValueError, "Layer bukan"):
            validate_service({"geometryType": "esriGeometryPoint"})

    def test_disallows_unlisted_endpoints_before_network(self):
        def never_use_network(*args, **kwargs):
            raise AssertionError("Network must not be called")
        with self.assertRaisesRegex(ValueError, "allowlist"):
            query_json("https://example.org/secret", {}, opener=never_use_network)

    def test_no_download_without_explicit_flag(self):
        from fetch_bnpb_adm2 import main
        with tempfile.TemporaryDirectory() as tmp:
            def never_use_network(*args, **kwargs):
                raise AssertionError("Network must not be called")
            with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as result:
                main(["--output-dir", tmp], requester=never_use_network)
            self.assertEqual(result.exception.code, 2)
            self.assertEqual(list(Path(tmp).iterdir()), [])


if __name__ == "__main__":
    unittest.main()
