"""CODE_ONLY; 7 pure and 13 rehearsal tests, not executed."""
import unittest
from apel_payload import Denied
from regional_payload import normalize,transition,project,period,CHECKS,REGIONS
from regional_store import RegionalStore
N,S=REGIONS
RID="DEMO-REGREC-MEDICINE-N"
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def cmd(n=1,rev=0,a="request_clarification",rid=RID):
    return dict(command_id="DEMO-COMMAND-REG-"+str(n),record_id=rid,expected_revision=rev,action=a,reason_code="CHECK_SOURCE_DEMO")
class PureTests(unittest.TestCase):
    def test_period(self):self.assertEqual(period("2030-12"),"2030-12")
    def test_invalid_period(self):
        with self.assertRaises(Denied):period("2031-01")
    def test_checklist(self):
        with self.assertRaises(Denied):normalize("medicine",dict(site_ref="DEMO-SITE-X",kind="DISTRIBUSI_DEMO",period="2026-11",checks={},evidence_count=0),N)
    def test_no_legal_verification(self):self.assertEqual(project("medicine",{})["legal_state"],"NOT_VERIFIED_DEMO")
    def test_no_confirmed(self):self.assertIsNone(project("surveillance",{})["confirmed_cases"])
    def test_no_issue(self):self.assertFalse(project("certificates",{})["may_issue"])
    def test_no_approval(self):
        with self.assertRaises(Denied):transition("NOT_REVIEWED","approve")
class StoreTests(unittest.TestCase):
    def setUp(self):self.s=RegionalStore()
    def tearDown(self):self.s.close()
    def read(self,d="medicine",r=N,y=2026,u="KAB-UTARA"):return self.s.regional_register(d,r,y,actor(u))
    def do(self,*args,u="KAB-UTARA",**kw):return self.s.review_regional(cmd(*args,**kw),actor(u))
    def test_available(self):self.assertEqual(self.read()["record_count_demo"],1)
    def test_missing(self):self.assertIsNone(self.read("surveillance",S,u="KAB-SELATAN")["rows"])
    def test_year_missing(self):self.assertIsNone(self.read(y=2027)["record_count_demo"])
    def test_scope(self):
        with self.assertRaises(Denied):self.read(r=S)
    def test_no_puskeswan(self):
        with self.assertRaises(Denied):self.read(u="ALPHA")
    def test_destination_not_scope(self):
        with self.assertRaises(Denied):self.read("certificates",S)
    def test_review(self):
        self.do();self.assertEqual(self.do(2,1,"record_discussion",u="REVIEW")["review_state"],"DISCUSSION_RECORDED_DEMO")
    def test_wrong_action(self):
        with self.assertRaises(Denied):self.do(a="record_discussion")
    def test_source_unchanged(self):
        before=self.read()["rows"][0]["observation"];self.do()
        self.assertEqual(self.read()["rows"][0]["observation"],before)
    def test_replay(self):self.do();self.assertTrue(self.do()["replay_demo"])
    def test_revision(self):
        self.do()
        with self.assertRaises(Denied):self.do(2)
    def test_revocation(self):
        self.do();self.s._db.execute("UPDATE contract_grant SET active=0 WHERE id='DEMO-GRANT-KAB-UTARA'")
        with self.assertRaises(Denied):self.do()
    def test_rollback(self):
        self.s._db.execute("CREATE TRIGGER fail_reg BEFORE INSERT ON contract_regional_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.do()
        self.assertEqual(self.read()["rows"][0]["review_revision"],0)
if __name__=="__main__":unittest.main()
