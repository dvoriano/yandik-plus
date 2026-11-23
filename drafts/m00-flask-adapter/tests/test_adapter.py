"""M00-G6 | QA WRITTEN, 0 EXECUTED | do not run without owner approval."""
import unittest
from importlib.util import module_from_spec,spec_from_file_location
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def load(name,file):
    spec=spec_from_file_location(name,root/file)
    module=module_from_spec(spec);spec.loader.exec_module(module);return module
a=load("m00_g6_adapter","adapter.py")
f=load("m00_g6_fixtures","fixtures.py")
class ProjectionQA(unittest.TestCase):
    def setUp(self):self.x=f.demo_input()
    def read(self):return a.demo_projection(**self.x)
    def test_01_read_schema(self):self.assertEqual(self.read()["schema"],a.M00_G6_SCHEMA)
    def test_02_one_record(self):self.assertEqual(self.read()["record_count_demo"],1)
    def test_03_no_auth_claim(self):self.assertFalse(self.read()["production_session_authenticated"])
    def test_04_no_official_cases(self):self.assertIsNone(self.read()["official_case_count"])
    def test_05_no_location_leak(self):self.assertNotIn("DEMO-LOCATION",str(self.read()))
    def test_06_no_session_leak(self):self.assertNotIn("DEMO-USER",str(self.read()))
    def test_07_region_denied(self):
        self.x["session"]["region"]="Wilayah DEMO Selatan"
        with self.assertRaises(a.DemoAccessDenied):self.read()
    def test_08_inactive_denied(self):
        self.x["session"]["active"]=False
        with self.assertRaises(a.DemoAccessDenied):self.read()
    def test_09_leadership_denied(self):
        self.x["session"]["role"]="pimpinan"
        with self.assertRaises(a.DemoAccessDenied):self.read()
    def test_10_extra_session_role_denied(self):
        self.x["session"]["client_role"]="provinsi_admin"
        with self.assertRaises(a.DemoAccessDenied):self.read()
    def test_11_source_claim_denied(self):
        self.x["payload"]["manifest"]["source_verified"]=True
        with self.assertRaises(a.DemoSourceRejected):self.read()
    def test_12_official_permission_denied(self):
        self.x["payload"]["manifest"]["official_authorization"]=True
        with self.assertRaises(a.DemoSourceRejected):self.read()
    def test_13_owner_field_denied(self):
        self.x["payload"]["events"][0]["owner_name"]="private"
        with self.assertRaises(a.DemoSourceRejected):self.read()
    def test_14_official_id_denied(self):
        self.x["payload"]["events"][0]["official_case_reference"]="REAL"
        with self.assertRaises(a.DemoSourceRejected):self.read()
    def test_15_duplicate_denied(self):
        self.x["payload"]["events"].append(dict(self.x["payload"]["events"][0]))
        with self.assertRaises(a.DemoSourceRejected):self.read()
    def test_16_future_capture_denied(self):
        self.x["payload"]["events"][0]["period"]="2026-12"
        with self.assertRaises(a.DemoSourceRejected):self.read()
    def test_17_missing_selector_denied(self):
        with self.assertRaises(a.DemoAccessDenied):
            a.demo_projection(**self.x,event_id="DEMO-EVENT-OTHER")
    def test_18_write_disabled(self):self.assertFalse(self.read()["may_write"])
    def test_19_publication_disabled(self):self.assertFalse(self.read()["may_publish"])
class FlaskQA(unittest.TestCase):
    def setUp(self):
        try:from flask import Flask
        except ImportError:raise unittest.SkipTest("Flask not installed")
        self.x=f.demo_input();self.app=Flask(__name__)
        bp=a.make_demo_blueprint(
            resolve_server_session=lambda:self.x["session"],
            load_synthetic_source=lambda:self.x["payload"])
        self.app.register_blueprint(bp);self.client=self.app.test_client()
    def test_20_disabled_default(self):
        self.assertEqual(self.client.get("/_internal_yandik_demo/surveillance").status_code,404)
    def test_21_opt_in_read(self):
        self.app.config[a.DEMO_FLAG]=True
        self.assertEqual(self.client.get("/_internal_yandik_demo/surveillance").status_code,200)
    def test_22_query_rejected(self):
        self.app.config[a.DEMO_FLAG]=True
        self.assertEqual(self.client.get("/_internal_yandik_demo/surveillance?role=admin").status_code,400)
    def test_23_post_rejected(self):
        self.assertEqual(self.client.post("/_internal_yandik_demo/surveillance").status_code,405)
    def test_24_cache_disabled(self):
        self.app.config[a.DEMO_FLAG]=True
        resp=self.client.get("/_internal_yandik_demo/surveillance")
        self.assertEqual(resp.headers["Cache-Control"],"no-store")
    def test_25_missing_session_rejected(self):
        self.app.config[a.DEMO_FLAG]=True;self.x["session"]=None
        self.assertEqual(self.client.get("/_internal_yandik_demo/surveillance").status_code,403)
