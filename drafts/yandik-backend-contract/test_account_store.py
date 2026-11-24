"""CODE_ONLY. 6 pure + 18 memory rehearsal; not run."""
import unittest
from apel_payload import Denied
from account_payload import intent,session_live,valid_time
from account_store import AccountStore
from api_dispatch import DraftAPI
def fixture(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def cmd(n,rev,a,p=None,target="ALPHA"):
    return dict(command_id="DEMO-ACCESS-CMD-"+str(n),target_actor_id="DEMO-ACTOR-"+target,expected_revision=rev,action=a,payload=p,reason_code="ACCESS_REVIEW_DEMO")
GRANT={"grant_id":"DEMO-GRANT-NEW","role":"puskeswan","region_id":None,"facility_id":"DEMO-PSW-BETA"}
class PureTests(unittest.TestCase):
    def test_expiry(self):self.assertFalse(session_live(10,20,None,20))
    def test_live(self):self.assertTrue(session_live(10,20,None,19))
    def test_revoked(self):self.assertFalse(session_live(10,20,12,13))
    def test_clock(self):
        with self.assertRaises(Denied):valid_time(True)
    def test_no_admin_grant(self):
        with self.assertRaises(Denied):intent(cmd(1,0,"grant",{**GRANT,"role":"provinsi_admin"}))
    def test_no_region_spoof(self):
        with self.assertRaises(Denied):intent(cmd(1,0,"grant",{**GRANT,"region_id":"DEMO-REGION-SELATAN"}))
class StoreTests(unittest.TestCase):
    def setUp(self):
        self.now=1795500000;self.s=AccountStore(clock=lambda:self.now)
        self.admin=self.s.session_resolver(self.s.issue_demo_session(fixture("ADMIN")))
        self.token=self.s.issue_demo_session(fixture("ALPHA"));self.user=self.s.session_resolver(self.token)
    def tearDown(self):self.s.close()
    def do(self,*args,**kw):return self.s.manage_access(cmd(*args,**kw),self.admin)
    def read(self,resolver=None):return DraftAPI(self.s,resolver or self.user).dispatch("GET","/api/v1/core")
    def test_api(self):self.assertEqual(self.read()["status"],200)
    def test_raw_resolver_denied(self):self.assertEqual(self.read(fixture("ALPHA"))["status"],401)
    def test_expired(self):self.now+=1800;self.assertEqual(self.read()["status"],401)
    def test_logout(self):self.s.logout(self.token);self.assertEqual(self.read()["status"],401)
    def test_logout_replay(self):self.s.logout(self.token);self.assertTrue(self.s.logout(self.token)["logged_out_demo"])
    def test_disable(self):self.do(1,0,"disable");self.assertEqual(self.read()["status"],401)
    def test_enable_no_restore(self):
        self.do(1,0,"disable");self.do(2,1,"enable")
        self.assertEqual(self.read()["status"],401)
        with self.assertRaises(Denied):self.s.issue_demo_session(fixture("ALPHA"))
    def test_revoke(self):
        self.do(1,0,"revoke_grant",{"grant_id":"DEMO-GRANT-ALPHA"})
        self.assertEqual(self.read()["status"],401)
    def test_register_grant(self):
        self.do(1,0,"register",target="NEW");self.do(2,1,"grant",GRANT,target="NEW")
        t=self.s.issue_demo_session(lambda:{"actor_id":"DEMO-ACTOR-NEW","grant_id":"DEMO-GRANT-NEW"})
        data=self.read(self.s.session_resolver(t))["data"]
        self.assertEqual([f["facility_id"] for f in data["facilities"]],["DEMO-PSW-BETA"])
    def test_no_second_active_grant(self):
        with self.assertRaises(Denied):self.do(1,0,"grant",GRANT)
    def test_self_management(self):
        with self.assertRaises(Denied):self.do(1,0,"disable",target="ADMIN")
    def test_nonadmin(self):
        with self.assertRaises(Denied):self.s.manage_access(cmd(1,0,"disable",target="BETA"),self.user)
    def test_replay(self):self.do(1,0,"disable");self.assertTrue(self.do(1,0,"disable")["replay_demo"])
    def test_revision_conflict(self):
        self.do(1,0,"disable")
        with self.assertRaises(Denied):self.do(2,0,"enable")
    def test_history(self):
        self.do(1,0,"disable");v=self.s.account_history("DEMO-ACTOR-ALPHA",self.admin)
        self.assertEqual(len(v["events"]),1);self.assertNotIn("token_digest",str(v))
    def test_leader(self):
        r=self.s.session_resolver(self.s.issue_demo_session(fixture("LEADER")))
        v=DraftAPI(self.s,r).dispatch("GET","/api/v1/leadership",{"year":2026,"region_id":"ALL"})
        self.assertEqual(v["status"],200);self.assertNotIn("rows",v["data"])
    def test_rollback(self):
        self.s._db.execute("CREATE TRIGGER fail_access BEFORE INSERT ON contract_access_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.do(1,0,"disable")
        self.assertEqual(self.read()["status"],200)
    def test_no_raw_handle_stored(self):
        row=self.s._db.execute("SELECT token_digest FROM contract_demo_session WHERE actor_id='DEMO-ACTOR-ALPHA'").fetchone()
        self.assertNotEqual(row[0],self.token);self.assertEqual(len(row[0]),64)
if __name__=="__main__":unittest.main()
