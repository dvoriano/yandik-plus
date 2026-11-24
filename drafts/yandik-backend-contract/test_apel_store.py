"""CODE_ONLY; do not run without separate unit and DDL authorization."""
import unittest
from copy import deepcopy
from apel_payload import Denied, normalize
from apel_store import DemoStore
def user(): return {"actor_id":"DEMO-ACTOR-ALPHA","grant_id":"DEMO-GRANT-ALPHA"}
def reviewer(): return {"actor_id":"DEMO-ACTOR-REVIEW","grant_id":"DEMO-GRANT-REVIEW"}
def payload():
    return {"facility_id":"DEMO-PSW-ALPHA","period":"2026-11","declared_no_activity":True,
            "counts":{"pengobatan":0,"vaksinasi":0,"penyuluhan":0,"layanan_lain":0},
            "investigations":[],"kurban_animals":[],"evidence_refs":[]}
def cmd(seq=1,rev=0,action="save_draft",p=None,reason=None):
    return {"command_id":"DEMO-COMMAND-"+str(seq),"record_id":"DEMO-REC-ALPHA",
            "expected_revision":rev,"action":action,"payload":payload() if action=="save_draft" and p is None else p,"reason_code":reason}
class TypedTests(unittest.TestCase):
    def norm(self,p): return normalize(p,"DEMO-PSW-ALPHA","2026-11")
    def test_zero(self): self.assertTrue(self.norm(payload())["declared_no_activity"])
    def test_bool_count(self):
        p=payload();p["counts"]["pengobatan"]=True
        with self.assertRaises(Denied): self.norm(p)
    def test_false_zero(self):
        p=payload();p["declared_no_activity"]=False
        with self.assertRaises(Denied): self.norm(p)
    def test_scope(self):
        p=payload();p["period"]="2026-12"
        with self.assertRaises(Denied): self.norm(p)
    def test_event_duplicate(self):
        p=payload();p["declared_no_activity"]=False;p["investigations"]=[{"event_id":"DEMO-E","location_id":"DEMO-L"}]*2
        with self.assertRaises(Denied): self.norm(p)
    def test_event_distinct_locations(self):
        p=payload();p["declared_no_activity"]=False;p["investigations"]=[{"event_id":"DEMO-E","location_id":"DEMO-L1"},{"event_id":"DEMO-E","location_id":"DEMO-L2"}]
        self.assertEqual(len(self.norm(p)["investigations"]),2)
    def test_kurban_both(self):
        p=payload();p["declared_no_activity"]=False;p["kurban_animals"]=[{"animal_id":"DEMO-A","ante":True,"post":True}]
        self.assertEqual(len(self.norm(p)["kurban_animals"]),1)
    def test_kurban_duplicate(self):
        p=payload();p["declared_no_activity"]=False;p["kurban_animals"]=[{"animal_id":"DEMO-A","ante":True,"post":True}]*2
        with self.assertRaises(Denied): self.norm(p)
class StoreTests(unittest.TestCase):
    def setUp(self): self.s=DemoStore()
    def tearDown(self): self.s.close()
    def apply(self,*args,actor=user,**kw): return self.s.apply(cmd(*args,**kw),actor)
    def view(self): return self.s.view("DEMO-REC-ALPHA",user)
    def test_initial_missing(self): self.assertIsNone(self.view()["payload"])
    def test_save(self): self.assertEqual(self.apply()["revision"],1)
    def test_repeat(self):
        self.apply();self.assertTrue(self.apply()["replay_demo"]);self.assertEqual(self.view()["revision"],1)
    def test_collision(self):
        self.apply();p=payload();p["declared_no_activity"]=False;p["counts"]["pengobatan"]=1
        with self.assertRaises(Denied): self.apply(p=p)
    def test_stale(self):
        self.apply()
        with self.assertRaises(Denied): self.apply(2)
    def test_cross_scope(self):
        with self.assertRaises(Denied): self.s.view("DEMO-REC-GAMMA",user)
    def test_grant_spoof(self):
        with self.assertRaises(Denied): self.s.apply(cmd(),lambda:{"actor_id":"DEMO-ACTOR-ALPHA","grant_id":"DEMO-GRANT-REVIEW"})
    def test_revoke_replay(self):
        self.apply();self.s._db.execute("UPDATE contract_grant SET active=0 WHERE id='DEMO-GRANT-ALPHA'")
        with self.assertRaises(Denied): self.apply()
    def test_submit_requires_draft(self):
        with self.assertRaises(Denied): self.apply(action="submit")
    def test_submit(self):
        self.apply();self.assertEqual(self.apply(2,1,"submit")["state"],"SUBMITTED")
    def test_self_review(self):
        self.apply();self.apply(2,1,"submit")
        with self.assertRaises(Denied): self.apply(3,2,"record_review",reason="REVIEW_RECORDED_DEMO")
    def test_review(self):
        self.apply();self.apply(2,1,"submit");self.assertEqual(self.apply(3,2,"record_review",actor=reviewer,reason="REVIEW_RECORDED_DEMO")["state"],"RECORDED_DEMO")
    def test_correction(self):
        self.apply();self.apply(2,1,"submit");self.apply(3,2,"return_correction",actor=reviewer,reason="CHECK_COUNTS_DEMO")
        self.assertEqual(self.apply(4,3)["state"],"DRAFT")
    def test_rollback(self):
        self.s._db.execute("CREATE TRIGGER fail_receipt BEFORE INSERT ON contract_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception): self.apply()
        self.assertEqual(self.view()["revision"],0)
        for table in ("contract_revision","contract_apel_payload","contract_audit","contract_command"):
            self.assertEqual(self.s._db.execute("SELECT COUNT(*) FROM "+table).fetchone()[0],0)
    def test_immutable(self):
        self.apply()
        with self.assertRaises(Exception): self.s._db.execute("DELETE FROM contract_apel_payload")
    def test_no_ledger(self): self.assertFalse(self.apply()["ledger_updated"])
    def test_fk_guard(self):
        self.s._db.execute("PRAGMA foreign_keys=OFF")
        with self.assertRaises(Denied): self.apply()
if __name__=="__main__": unittest.main()
