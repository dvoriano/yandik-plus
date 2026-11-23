"""M00-G7 | QA WRITTEN ONLY | DO NOT RUN WITHOUT OWNER APPROVAL."""
import unittest
from importlib.util import module_from_spec,spec_from_file_location
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def load(name,file):
    spec=spec_from_file_location(name,root/file)
    module=module_from_spec(spec);spec.loader.exec_module(module);return module
w=load("m00_g7_writer","writer.py")
f=load("m00_g7_fixtures","fixtures.py")
class AtomicWriterQA(unittest.TestCase):
    def setUp(self):
        self.db=w.create_in_memory_demo_store()
        self.resolve=f.demo_resolver()
    def tearDown(self):self.db.close()
    def append(self,intent=None):
        return w.append_demo_review(self.db,intent=intent or f.demo_intent(),
                                    resolve_server_session=self.resolve)
    def test_01_initial_revision(self):self.assertEqual(self.append()["review_revision_demo"],1)
    def test_02_no_disk_persistence_claim(self):self.assertFalse(self.append()["persisted_to_disk"])
    def test_03_no_production_auth_claim(self):self.assertFalse(self.append()["production_identity_verified"])
    def test_04_idempotent_replay(self):
        self.append();self.assertTrue(self.append()["idempotent_replay_demo"])
    def test_05_no_duplicate_on_replay(self):
        self.append();self.append();self.assertEqual(
            self.db.execute("SELECT count(*) FROM demo_audit").fetchone()[0],1)
    def test_06_new_revision(self):
        first=self.append()
        next_intent=f.demo_intent("DEMO-COMMAND-TWO",1,first["head_digest_demo"])
        self.assertEqual(self.append(next_intent)["review_revision_demo"],2)
    def test_07_summary_counts(self):
        self.append();s=w.read_demo_audit_summary(
            self.db,link_id="DEMO-CROSSWALK-ONE",
            resolve_server_session=self.resolve)
        self.assertEqual(s["recorded_review_notes_demo"],1)
    def test_08_summary_hides_reviewer(self):
        self.append();s=w.read_demo_audit_summary(
            self.db,link_id="DEMO-CROSSWALK-ONE",
            resolve_server_session=self.resolve)
        self.assertNotIn("DEMO-USER",str(s))
    def test_09_stale_revision_denied(self):
        self.append()
        with self.assertRaises(w.DemoWriterDenied):
            self.append(f.demo_intent("DEMO-COMMAND-NEW"))
    def test_10_idempotency_conflict(self):
        self.append()
        x=f.demo_intent();x["reason_code"]="LOCATION_UNCLEAR_DEMO"
        with self.assertRaises(w.DemoWriterDenied):self.append(x)
    def test_11_no_partial_transaction_after_conflict(self):
        self.append();x=f.demo_intent("DEMO-COMMAND-TWO",1,"0"*64)
        with self.assertRaises(w.DemoWriterDenied):self.append(x)
        self.assertEqual(self.db.execute("SELECT count(*) FROM demo_audit").fetchone()[0],1)
    def test_12_denies_approval_action(self):
        x=f.demo_intent();x["action_code"]="APPROVED"
        with self.assertRaises(w.DemoWriterDenied):self.append(x)
    def test_13_denies_official_auth(self):
        x=f.demo_intent();x["official_authorization"]=True
        with self.assertRaises(w.DemoWriterDenied):self.append(x)
    def test_14_denies_extra_private_field(self):
        x=f.demo_intent();x["owner_name"]="private"
        with self.assertRaises(w.DemoWriterDenied):self.append(x)
    def test_15_denies_source_digest_drift(self):
        first=self.append()
        x=f.demo_intent("DEMO-COMMAND-TWO",1,first["head_digest_demo"])
        x["basis_digest"]="b"*64
        with self.assertRaises(w.DemoWriterDenied):self.append(x)
    def test_16_denies_non_verifier(self):
        self.resolve=f.demo_resolver(role="kab_kota")
        with self.assertRaises(w.DemoWriterDenied):self.append()
    def test_17_denies_missing_session(self):
        self.resolve=lambda:None
        with self.assertRaises(w.DemoWriterDenied):self.append()
    def test_18_denies_client_identity_field(self):
        x=f.demo_intent();x["role"]="provinsi_verifikator"
        with self.assertRaises(w.DemoWriterDenied):self.append(x)
    def test_19_denies_disk_db(self):
        import sqlite3,tempfile
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/"test.sqlite3"
            con=sqlite3.connect(str(path),isolation_level=None)
            try:
                con.execute("PRAGMA foreign_keys=ON")
                with self.assertRaises(w.DemoWriterDenied):
                    w.append_demo_review(con,intent=f.demo_intent(),
                        resolve_server_session=self.resolve)
            finally:con.close()
    def test_20_write_denial_foreign_keys_off(self):
        self.db.execute("PRAGMA foreign_keys=OFF")
        with self.assertRaises(w.DemoWriterDenied):self.append()
    def test_21_audit_event_update_trigger(self):
        self.append()
        import sqlite3
        with self.assertRaises(sqlite3.DatabaseError):
            self.db.execute("UPDATE demo_audit SET action_code='OTHER'")
    def test_22_audit_event_delete_trigger(self):
        self.append()
        import sqlite3
        with self.assertRaises(sqlite3.DatabaseError):
            self.db.execute("DELETE FROM demo_audit")
    def test_23_chain_content_mismatch(self):
        self.append()
        self.db.execute("UPDATE demo_stream SET head_digest=?",("f"*64,))
        with self.assertRaises(w.DemoWriterDenied):
            w.read_demo_audit_summary(self.db,
                link_id="DEMO-CROSSWALK-ONE",
                resolve_server_session=self.resolve)
    def test_24_no_official_cases_from_audit(self):
        self.append()
        s=w.read_demo_audit_summary(self.db,link_id="DEMO-CROSSWALK-ONE",
            resolve_server_session=self.resolve)
        self.assertIsNone(s["official_case_count"])
    def test_25_unknown_audit_link_denied(self):
        with self.assertRaises(w.DemoWriterDenied):
            w.read_demo_audit_summary(self.db,link_id="DEMO-CROSSWALK-MISSING",
                resolve_server_session=self.resolve)
