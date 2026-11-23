"""M00-G9 | QA DITULIS, BELUM DIJALANKAN | CODE_ONLY."""
import importlib.util
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def load(name, path):
    spec=importlib.util.spec_from_file_location(name,ROOT/path)
    mod=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

gate=load("m00_g9_preflight","preflight.py")
fixtures=load("m00_g9_fixtures","fixtures.py")

class PreflightQA(unittest.TestCase):
    def setUp(self):
        self.x=fixtures.demo_flask_intake_manifest()
    def scan(self):
        return gate.assess_demo_flask_intake(self.x)
    def test_01_schema(self):
        self.assertEqual(self.scan()["schema"], gate.M00_G9_SCHEMA)
    def test_02_four_declared_metadata_files(self):
        self.assertEqual(self.scan()["file_count_declared_demo"],4)
    def test_03_two_unverified_routes(self):
        self.assertEqual(self.scan()["route_count_declared_demo"],2)
    def test_04_post_needs_csrf_review(self):
        self.assertIn("MUTATING_ROUTES_REQUIRE_CSRF_AND_AUTH_REVIEW",
                      self.scan()["blockers"])
    def test_05_no_real_owner_permission(self):
        self.assertFalse(self.scan()["source_owner_authorized"])
    def test_06_no_files_opened(self):
        self.assertFalse(self.scan()["source_files_opened"])
    def test_07_no_actual_content_scan(self):
        self.assertFalse(self.scan()["content_scanned_for_secrets"])
    def test_08_no_file_import(self):
        self.assertFalse(self.scan()["ready_for_import"])
    def test_09_no_deployment_permission(self):
        self.assertFalse(self.scan()["may_deploy"])
    def test_10_no_production_access(self):
        self.assertFalse(self.scan()["ready_for_production"])
    def test_11_denies_external_consent_claim(self):
        self.x["consent_status"]="APPROVED"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_12_denies_real_content_claim(self):
        self.x["content_inspected"]=True
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_13_denies_fake_verified_hash(self):
        self.x["file_hashes_verified"]=True
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_14_denies_secret_env(self):
        self.x["files"][0]["path"]=".env"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_15_denies_traversal(self):
        self.x["files"][0]["path"]="../app.py"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_16_denies_windows_separator(self):
        self.x["files"][0]["path"]="core\\app.py"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_17_denies_absolute_path(self):
        self.x["files"][0]["path"]="/etc/passwd"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_18_denies_symlink(self):
        self.x["files"][0]["symlink"]=True
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_19_denies_duplicate_file(self):
        self.x["files"].append(dict(self.x["files"][0]))
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_20_denies_non_ascii_path(self):
        self.x["files"][0]["path"]="córe/app.py"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_21_denies_unknown_binary(self):
        self.x["files"][0]["path"]="archive.sqlite3"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_22_denies_fake_huge_file(self):
        self.x["files"][0]["size_bytes"]=2_000_001
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_23_denies_bad_hash_shape(self):
        self.x["files"][0]["sha256_claim"]="z"*64
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_24_denies_boolean_file_size(self):
        self.x["files"][0]["size_bytes"]=True
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_25_denies_duplicate_method_path(self):
        self.x["routes"].append(dict(self.x["routes"][0],
                                     route_id="DEMO-ROUTE-OTHER"))
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_26_denies_duplicate_route_id(self):
        self.x["routes"][1]["route_id"]=self.x["routes"][0]["route_id"]
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_27_denies_real_route_path(self):
        self.x["routes"][0]["path"]="/api/users"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_28_denies_unrecognized_route_owner(self):
        self.x["routes"][0]["owner_module"]="external"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_29_denies_route_role_claim(self):
        self.x["routes"][0]["client_role"]="admin"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_30_denies_verified_access_claim(self):
        self.x["routes"][0]["auth_claim"]="APPROVED"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_31_reports_missing_entrypoint_without_approval(self):
        self.x["files"][0]["path"]="main.py"
        self.assertIn("FLASK_ENTRYPOINT_NOT_DECLARED",
                      self.scan()["blockers"])
    def test_32_reports_missing_dependency_manifest(self):
        self.x["files"][1]["path"]="readme.md"
        self.x["files"][1]["kind"]="DOCUMENTATION"
        self.assertIn("DEPENDENCY_INVENTORY_MISSING",
                      self.scan()["blockers"])
    def test_33_rejects_top_level_extra(self):
        self.x["flask_secret"]="sensitive"
        with self.assertRaises(gate.IntakeDenied):self.scan()
    def test_34_detects_claims_are_unverified(self):
        self.assertGreater(self.scan()["route_auth_claims_unverified_demo"],0)
    def test_35_return_never_contains_source_paths(self):
        self.assertNotIn("core/auth.py",str(self.scan()))
    def test_36_no_dynamic_routes_registered(self):
        self.assertFalse(self.scan()["flask_routes_registered"])
