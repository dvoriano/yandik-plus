"""CODE_ONLY | 8 new memory rehearsal declarations; not executed."""
import unittest
from apel_payload import Denied
from api_projections import ProjectionStore
from api_dispatch import DraftAPI
from regional_payload import REGIONS
N,S=REGIONS
RID="DEMO-REGREC-MEDICINE-N"
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def cmd(n,rev,a):return {"command_id":"DEMO-COMMAND-C5-"+str(n),"record_id":RID,"expected_revision":rev,"action":a,"reason_code":"CHECK_SOURCE_DEMO"}
class RegionalForms(unittest.TestCase):
    def setUp(self):self.s=ProjectionStore()
    def tearDown(self):self.s.close()
    def row(self,u):return self.s.regional_register("medicine",N,2026,actor(u))["rows"][0]
    def do(self,n,rev,a,u):return self.s.review_regional(cmd(n,rev,a),actor(u))
    def test_county_action(self):self.assertEqual(self.row("KAB-UTARA")["candidate_actions"],["request_clarification"])
    def test_admin_read_only(self):
        # ProjectionStore has no admin fixture; AccountStore supplies admin.
        from account_store import AccountStore
        s=AccountStore()
        try:
            resolver=s.session_resolver(s.issue_demo_session(actor("ADMIN")))
            self.assertEqual(s.regional_register("medicine",N,2026,resolver)["rows"][0]["candidate_actions"],[])
        finally:s.close()
    def test_reopen_separation(self):
        self.do(1,0,"record_discussion","REVIEW")
        self.do(2,1,"reopen_discussion","REVIEW")
        self.assertNotIn("record_discussion",self.row("REVIEW")["candidate_actions"])
        self.assertIn("record_discussion",self.row("REVIEW2")["candidate_actions"])
        with self.assertRaises(Denied):self.do(3,2,"record_discussion","REVIEW")
        self.do(4,2,"record_discussion","REVIEW2")
        self.assertEqual(self.row("REVIEW2")["review_revision"],3)
    def test_api_history(self):
        self.do(1,0,"request_clarification","KAB-UTARA")
        r=DraftAPI(self.s,actor("KAB-UTARA")).dispatch("GET","/api/v1/regional/history",{"record_id":RID})
        self.assertEqual(r["status"],200);self.assertEqual(len(r["data"]["events"]),1)
    def test_history_scope(self):
        r=DraftAPI(self.s,actor("KAB-SELATAN")).dispatch("GET","/api/v1/regional/history",{"record_id":RID})
        self.assertEqual(r["status"],403)
    def test_missing_coverage(self):
        r=self.s.regional_register("surveillance",S,2026,actor("KAB-SELATAN"))
        self.assertIsNone(r["record_count_demo"]);self.assertIsNone(r["rows"])
    def test_no_source_change(self):
        before=self.row("REVIEW")["observation"];self.do(1,0,"record_discussion","REVIEW")
        self.assertEqual(self.row("REVIEW")["observation"],before)
    def test_no_official_certificate(self):
        r=self.s.regional_register("certificates",N,2026,actor("REVIEW"))["rows"][0]["observation"]
        self.assertIsNone(r["official_reference"]);self.assertFalse(r["may_issue"])
