import datetime as dt
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from sys import path as sys_path

sys_path.insert(0, str(Path(__file__).resolve().parents[1]))
from review_adm2_package import review


class Adm2PackageReviewTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.reg = self.root / "regions.mjs"
        codes = [f"13.{i:02d}" for i in range(1, 13)] + [f"13.{i}" for i in range(71, 78)]
        self.reg.write_text("\n".join(
            '{ code: "' + code + '", name: "Kabupaten Test ' + str(i) + '" },'
            for i, code in enumerate(codes)), encoding="utf-8")
        self.geo = self.root / "candidate.geojson"
        self.manifest = self.root / "manifest.json"
        self.features = []
        for i, code in enumerate(codes):
            x, y = 98.5 + (i % 5) * .55, -3.0 + (i // 5) * .55
            ring = [[x, y], [x + .12, y], [x + .12, y + .12],
                    [x, y + .12], [x, y]]
            self.features.append({"type": "Feature", "properties": {"code": code},
                                  "geometry": {"type": "Polygon", "coordinates": [ring]}})
        self.write()

    def write(self, **overrides):
        self.geo.write_text(json.dumps({"type": "FeatureCollection",
                                        "features": self.features}), encoding="utf-8")
        data = {"source": "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0",
                "sha256": hashlib.sha256(self.geo.read_bytes()).hexdigest(),
                "retrieved_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
                "publisher": "Synthetic test", "dataset_version": "synthetic",
                "source_license_status": "NOT_VERIFIED"}
        data.update(overrides)
        self.manifest.write_text(json.dumps(data), encoding="utf-8")

    def run_review(self):
        return review(self.geo, self.manifest, self.reg)

    def test_complete_synthetic_stays_review_required(self):
        r = self.run_review()
        self.assertEqual(r["status"], "TECHNICAL_PASS_REVIEW_REQUIRED")
        self.assertEqual(r["region_count"], 19)
        self.assertFalse(r["release_approved"])
        self.assertFalse(r["license_verified"])

    def test_bad_sha_fails(self):
        self.write(sha256="0" * 64)
        self.assertEqual(self.run_review()["status"], "REJECTED")

    def test_duplicate_region_fails(self):
        self.features[-1]["properties"]["code"] = self.features[0]["properties"]["code"]
        self.write()
        self.assertEqual(self.run_review()["status"], "REJECTED")

    def test_missing_manifest_fails(self):
        self.manifest.unlink()
        self.assertEqual(self.run_review()["status"], "REJECTED")

    def test_invalid_sources_fail(self):
        for source in ("http://example.com/map",
                       "https://user:password@example.com/map",
                       "https://example.com/map?access_token=x",
                       "https://example.com/map#secret"):
            with self.subTest(source=source):
                self.write(source=source)
                self.assertEqual(self.run_review()["status"], "REJECTED")

    def test_private_or_local_provenance_url_fails(self):
        for source in (
            "https://localhost/private", "https://127.0.0.1/map",
            "https://192.168.1.2/export", "https://10.0.0.4/data",
            "https://[::1]/map", "https://device.local/map",
            "https://worker.internal/map", "https://server/map",
            "https://example.com/secret\\nheader"
        ):
            with self.subTest(source=source):
                self.write(source=source)
                self.assertEqual(self.run_review()["status"], "REJECTED")

    def test_symlinked_geojson_input_fails_closed(self):
        actual = self.root / "real.geojson"
        self.geo.rename(actual)
        self.geo.symlink_to(actual)
        result = self.run_review()
        self.assertEqual(result["status"], "REJECTED")
        self.assertTrue(any("Symlink" in error for error in result["errors"]))

    def test_future_time_fails(self):
        self.write(retrieved_utc=(dt.datetime.now(dt.timezone.utc) +
                                  dt.timedelta(days=1)).isoformat())
        self.assertEqual(self.run_review()["status"], "REJECTED")

    def test_manifest_claim_cannot_authorize_deployment(self):
        self.write(source_license_status="VERIFIED_BY_HUMAN",
                   legal_boundary_status="OFFICIAL", release_approved=True)
        self.assertEqual(self.run_review()["status"], "TECHNICAL_PASS_REVIEW_REQUIRED")
        self.assertFalse(self.run_review()["release_approved"])


if __name__ == "__main__":
    unittest.main()
