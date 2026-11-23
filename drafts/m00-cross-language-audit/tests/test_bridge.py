"""M00-G8 | QA WRITTEN, NOT EXECUTED. Cross-runtime checks are deferred."""
import importlib.util
import json
import subprocess
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("m00_g8_bridge",ROOT/"bridge.py")
b=importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(b)

def sample():
    return json.loads((ROOT/"demo_vectors.json").read_text("utf-8"))

class PythonPortQA(unittest.TestCase):
    def test_01_parity_on_same_demo_semantics(self):
        self.assertTrue(b.compare_demo_audit_ports(**{
            "g5_events":sample()["g5_events"],
            "g7_rows":sample()["g7_rows"]})["format_only_parity_demo"])
    def test_02_no_source_integrity_claim(self):
        x=sample()
        result=b.compare_demo_audit_ports(
            g5_events=x["g5_events"],g7_rows=x["g7_rows"])
        self.assertFalse(result["source_integrity_proven"])
    def test_03_no_migration_claim(self):
        x=sample()
        result=b.compare_demo_audit_ports(
            g5_events=x["g5_events"],g7_rows=x["g7_rows"])
        self.assertFalse(result["migration_safe"])
    def test_04_payload_fixed_domain(self):
        x=sample()["g5_events"][0]
        content=b.canonical_demo_bridge_record(
            link_id=x["link_id"],revision=1,
            reviewer_id=x["reviewer_id"],action_code=x["action_code"],
            reason_code=x["reason_code"],basis_digest=x["basis_digest"],
            previous_bridge_digest=x["previous_digest"])
        self.assertEqual(json.loads(content)[0],b.G8_DOMAIN)
    def test_05_reject_role_in_g5(self):
        x=sample();x["g5_events"][0]["role"]="admin"
        with self.assertRaises(b.DemoFormatDenied):
            b.compare_demo_audit_ports(g5_events=x["g5_events"],
                                      g7_rows=x["g7_rows"])
    def test_06_reject_real_case_id(self):
        x=sample();x["g7_rows"][0]["link_id"]="REAL-ID"
        with self.assertRaises(b.DemoFormatDenied):
            b.compare_demo_audit_ports(g5_events=x["g5_events"],
                                      g7_rows=x["g7_rows"])
    def test_07_reject_g5_official(self):
        x=sample();x["g5_events"][0]["official_authorization"]=True
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G5_LEGACY_DEMO",events=x["g5_events"])
    def test_08_reject_g7_official(self):
        x=sample();x["g7_rows"][0]["is_official"]=1
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G7_LEGACY_DEMO",events=x["g7_rows"])
    def test_09_action_difference_breaks_format_parity(self):
        x=sample();x["g7_rows"][0]["action_code"]="DISTINCT_RECORDS_DEMO"
        self.assertFalse(b.compare_demo_audit_ports(
            g5_events=x["g5_events"],g7_rows=x["g7_rows"]
        )["format_only_parity_demo"])
    def test_10_no_events(self):
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G7_LEGACY_DEMO",events=[])
    def test_11_invalid_source_hash(self):
        x=sample();x["g5_events"][0]["event_digest"]="bad"
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G5_LEGACY_DEMO",events=x["g5_events"])
    def test_12_invalid_extra_private_data(self):
        x=sample();x["g7_rows"][0]["owner_name"]="private"
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G7_LEGACY_DEMO",events=x["g7_rows"])
    def test_13_no_reviewer_exposed(self):
        x=sample();r=b.normalize_legacy_demo_audit(
            source_kind="G7_LEGACY_DEMO",events=x["g7_rows"])
        self.assertNotIn("DEMO-USER",repr(r["records"]))
    def test_14_no_write_permission(self):
        x=sample();r=b.normalize_legacy_demo_audit(
            source_kind="G7_LEGACY_DEMO",events=x["g7_rows"])
        self.assertFalse(r["may_write"])
    def test_15_reject_sequence_gap(self):
        x=sample();r=dict(x["g5_events"][0])
        r.update(audit_id="DEMO-AUDIT-2",review_id="DEMO-REVIEW-2",
                 sequence=3)
        x["g5_events"].append(r)
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G5_LEGACY_DEMO",events=x["g5_events"])
    def test_16_legacy_g5_single_link_only(self):
        x=sample();r=dict(x["g5_events"][0])
        r.update(audit_id="DEMO-AUDIT-2",review_id="DEMO-REVIEW-2",
                 sequence=2,link_id="DEMO-CROSSWALK-OTHER")
        x["g5_events"].append(r)
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G5_LEGACY_DEMO",events=x["g5_events"])
    def test_17_reject_invalid_revision_boolean(self):
        x=sample();x["g7_rows"][0]["revision"]=True
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G7_LEGACY_DEMO",events=x["g7_rows"])
    def test_18_refuse_injected_non_ascii(self):
        x=sample();x["g5_events"][0]["reviewer_id"]="DEMO-USER-Á"
        with self.assertRaises(b.DemoFormatDenied):
            b.normalize_legacy_demo_audit(
                source_kind="G5_LEGACY_DEMO",events=x["g5_events"])

class CrossRuntimeDeferredQA(unittest.TestCase):
    def test_19_js_and_python_head_digest_parity(self):
        """Requires Node in the future APPROVED testing session."""
        x=sample()
        py=b.compare_demo_audit_ports(
            g5_events=x["g5_events"],g7_rows=x["g7_rows"])
        g5=b.normalize_legacy_demo_audit(
            source_kind="G5_LEGACY_DEMO",events=x["g5_events"])
        g7=b.normalize_legacy_demo_audit(
            source_kind="G7_LEGACY_DEMO",events=x["g7_rows"])
        result=subprocess.run(["node",str(ROOT/"export_vectors.mjs")],
            capture_output=True,text=True,check=True,timeout=15)
        js=json.loads(result.stdout)
        self.assertTrue(js["format_only_parity_demo"])
        self.assertTrue(py["format_only_parity_demo"])
        self.assertEqual(js["g5_head"],g5["bridge_head_digest"])
        self.assertEqual(js["g7_head"],g7["bridge_head_digest"])
