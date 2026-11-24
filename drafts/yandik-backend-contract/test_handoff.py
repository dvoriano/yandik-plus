"""CODE_ONLY | 5 pure + 15 in-memory rehearsal declarations; not executed."""
import unittest
from apel_payload import Denied
from handoff_payload import proposal,acceptance,timely
from account_store import AccountStore
from api_dispatch import DraftAPI
def fixture(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
P={"handoff_id":"DEMO-HANDOFF-1","facility_id":"DEMO-PSW-ALPHA","outgoing_actor_id":"DEMO-ACTOR-ALPHA","incoming_actor_id":"DEMO-ACTOR-NEW","new_grant_id":"DEMO-GRANT-NEW","reason_code":"CHANGE_DUTY_DEMO"}
REGISTER={"command_id":"DEMO-ACCESS-CMD-NEW","target_actor_id":"DEMO-ACTOR-NEW","expected_revision":0,"action":"register","payload":None,"reason_code":"CHANGE_DUTY_DEMO"}
def report():
    return {"command_id":"DEMO-COMMAND-HANDOFF-REPORT","record_id":"DEMO-REC-ALPHA","expected_revision":0,"action":"save_draft","reason_code":None,"payload":{"facility_id":"DEMO-PSW-ALPHA","period":"2026-11","declared_no_activity":True,"counts":{"pengobatan":0,"vaksinasi":0,"penyuluhan":0,"layanan_lain":0},"investigations":[],"kurban_animals":[],"evidence_refs":[]}}
class PureTests(unittest.TestCase):
    def test_valid(self):self.assertEqual(proposal(P),P)
    def test_same_actor(self):
        with self.assertRaises(Denied):proposal({**P,"incoming_actor_id":P["outgoing_actor_id"]})
    def test_client_list_denied(self):
        with self.assertRaises(Denied):proposal({**P,"records":[]})
    def test_digest_invalid(self):
        with self.assertRaises(Denied):acceptance({"handoff_id":P["handoff_id"],"expected_digest":"no"})
    def test_expiry(self):self.assertTrue(timely(100,86499));self.assertFalse(timely(100,86500))
class StoreTests(unittest.TestCase):
    def setUp(self):
        self.now=1795500000;self.s=AccountStore(clock=lambda:self.now)
        self.admin=self.resolver("ADMIN");self.reviewer=self.resolver("REVIEW");self.old=self.resolver("ALPHA")
        self.s.manage_access(REGISTER,self.admin)
    def tearDown(self):self.s.close()
    def resolver(self,code):return self.s.session_resolver(self.s.issue_demo_session(fixture(code)))
    def prepare(self):return self.s.prepare_handoff(P,self.reviewer)
    def accept(self,p):return self.s.accept_handoff({"handoff_id":p["handoff_id"],"expected_digest":p["snapshot_digest"]},self.admin)
    def test_prepare_no_change(self):
        p=self.prepare();self.assertEqual(self.s.view("DEMO-REC-ALPHA",self.old)["revision"],0)
        self.assertGreater(p["record_count"],60)
    def test_prepare_role(self):
        with self.assertRaises(Denied):self.s.prepare_handoff(P,self.admin)
    def test_accept_role(self):
        p=self.prepare()
        with self.assertRaises(Denied):self.s.accept_handoff({"handoff_id":p["handoff_id"],"expected_digest":p["snapshot_digest"]},self.reviewer)
    def test_new_owner(self):
        p=self.prepare();self.accept(p);new=self.resolver("NEW")
        self.assertIn("save_draft",self.s.view("DEMO-REC-ALPHA",new)["candidate_actions"])
        self.assertEqual(self.s.apply(report(),new)["revision"],1)
    def test_old_session_revoked(self):
        self.accept(self.prepare())
        with self.assertRaises(Denied):self.s.view("DEMO-REC-ALPHA",self.old)
    def test_other_facility_unchanged(self):
        self.accept(self.prepare());self.assertEqual(self.s._db.execute("SELECT owner_id FROM contract_record WHERE id='DEMO-REC-GAMMA'").fetchone()[0],"DEMO-ACTOR-GAMMA")
    def test_preserve_revision(self):
        self.s.apply(report(),self.old);p=self.prepare();self.accept(p)
        r=self.s.view("DEMO-REC-ALPHA",self.resolver("NEW"));self.assertEqual(r["revision"],1);self.assertTrue(r["payload"]["declared_no_activity"])
        self.assertEqual(self.s._db.execute("SELECT actor_id FROM contract_revision WHERE record_id='DEMO-REC-ALPHA' AND revision=1").fetchone()[0],"DEMO-ACTOR-ALPHA")
    def test_stale_data(self):
        p=self.prepare();self.s.apply(report(),self.old)
        with self.assertRaises(Denied):self.accept(p)
    def test_stale_account(self):
        p=self.prepare()
        self.s.manage_access({**REGISTER,"command_id":"DEMO-ACCESS-CMD-DISABLE","action":"disable","expected_revision":1},self.admin)
        with self.assertRaises(Denied):self.accept(p)
    def test_review_revoked(self):
        p=self.prepare()
        self.s.manage_access({**REGISTER,"command_id":"DEMO-ACCESS-CMD-REV","target_actor_id":"DEMO-ACTOR-REVIEW","action":"revoke_grant","expected_revision":0,"payload":{"grant_id":"DEMO-GRANT-REVIEW"}},self.admin)
        with self.assertRaises(Denied):self.accept(p)
    def test_expired(self):
        p=self.prepare();self.now+=86400;self.admin=self.resolver("ADMIN")
        with self.assertRaises(Denied):self.accept(p)
    def test_prepare_replay(self):p=self.prepare();self.assertEqual(p["snapshot_digest"],self.prepare()["snapshot_digest"])
    def test_accept_replay(self):p=self.prepare();self.accept(p);self.assertTrue(self.accept(p)["replay_demo"])
    def test_rollback(self):
        p=self.prepare();self.s._db.execute("CREATE TRIGGER fail_handoff BEFORE INSERT ON contract_handoff_record BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.accept(p)
        self.assertIn("save_draft",self.s.view("DEMO-REC-ALPHA",self.old)["candidate_actions"])
        self.assertEqual(self.s._db.execute("SELECT COUNT(*) FROM contract_handoff_receipt").fetchone()[0],0)
    def test_history(self):
        self.accept(self.prepare());v=self.s.handoff_history("DEMO-PSW-ALPHA",self.admin)
        self.assertEqual(len(v["handoffs"]),1);self.assertEqual(v["handoffs"][0]["incoming_actor_id"],"DEMO-ACTOR-NEW")
if __name__=="__main__":unittest.main()
