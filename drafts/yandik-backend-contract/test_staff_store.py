"""CODE_ONLY; tests not run. Store tests require unit and DDL permission."""
import unittest
from staff_payload import day,intent,active,projection
from staff_store import StaffStore
from apel_payload import Denied
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def cmd(seq=1,rev=0,action="transfer",p=None,sid="DEMO-SDM-02"):
    return {"command_id":"DEMO-COMMAND-SDM-"+str(seq),"staff_id":sid,"expected_revision":rev,"action":action,"payload":{"facility_id":"DEMO-PSW-BETA","effective_on":"2026-07-01"} if p is None else p}
class PureTests(unittest.TestCase):
    def test_date(self):self.assertEqual(day("2028-02-29"),"2028-02-29")
    def test_invalid_date(self):
        with self.assertRaises(Denied):day("2027-02-29")
    def test_range(self):
        with self.assertRaises(Denied):day("2031-01-01")
    def test_exclusive(self):self.assertFalse(active({"start_date":"2026-01-01","end_exclusive":"2027-01-01"},"2027-01-01"))
    def test_partial(self):self.assertIsNone(projection("PARTIAL_DEMO",[{"kind":"dokter_hewan"}],2026)["doctors"])
    def test_complete_zero(self):self.assertEqual(projection("COMPLETE_DEMO",[],2026)["doctors"],0)
    def test_missing(self):self.assertIsNone(projection(None,[],2030)["paramedics"])
    def test_invalid_id(self):
        with self.assertRaises(Denied):intent(cmd(sid="REAL"))
class StoreTests(unittest.TestCase):
    def setUp(self):self.s=StaffStore()
    def tearDown(self):self.s.close()
    def do(self,*args,user="REVIEW",**kw):return self.s.apply_staff(cmd(*args,**kw),actor(user))
    def summary(self,f="ALPHA",year=2026,user="REVIEW"):return self.s.staff_summary("DEMO-PSW-"+f,year,actor(user))
    def hist(self,sid="DEMO-SDM-02"):return self.s.staff_history(sid,actor("REVIEW"))
    def test_initial(self):self.assertEqual(self.summary()["paramedics"],1)
    def test_transfer(self):
        self.do();self.assertEqual(self.summary()["paramedics"],0);self.assertEqual(self.summary("BETA")["paramedics"],2)
    def test_history(self):
        self.do();h=self.hist();self.assertEqual(len(h["current"]["placements"]),2);self.assertEqual(h["events"][0]["before"]["placements"][0]["end_exclusive"],None)
    def test_partial_preserved(self):
        self.do(p={"facility_id":"DEMO-PSW-GAMMA","effective_on":"2026-07-01"});self.assertIsNone(self.summary("GAMMA")["doctors"])
    def test_profile(self):
        self.do();self.assertEqual(self.s.view_profile("DEMO-PSW-ALPHA",2026,actor("ALPHA"))["sdm"]["paramedics"],0)
    def test_replay(self):self.do();self.assertTrue(self.do()["replay_demo"]);self.assertEqual(self.hist()["current"]["revision"],1)
    def test_stale(self):
        self.do()
        with self.assertRaises(Denied):self.do(2)
    def test_transfer_denied(self):
        with self.assertRaises(Denied):self.do(user="ALPHA")
    def test_scope(self):
        with self.assertRaises(Denied):self.summary("GAMMA",user="KAB-UTARA")
    def test_history_denied(self):
        with self.assertRaises(Denied):self.s.staff_history("DEMO-SDM-02",actor("ALPHA"))
    def test_end_assign(self):
        self.do(action="end_assignment",p={"effective_on":"2026-06-01"});self.do(2,1,"assign",{"facility_id":"DEMO-PSW-ALPHA","effective_on":"2027-01-01"})
        self.assertEqual(self.summary()["paramedics"],0);self.assertEqual(self.summary(year=2027)["paramedics"],1)
    def test_register(self):
        self.do(action="register",p={"kind":"dokter_hewan"},sid="DEMO-SDM-NEW");self.assertEqual(self.hist("DEMO-SDM-NEW")["current"]["placements"],[])
    def test_competency(self):
        p={"facility_id":"DEMO-PSW-ALPHA","observed_on":"2026-08-01","topic":"PENCATATAN_APEL_DEMO"}
        self.do(action="record_competency",p=p,user="ALPHA")
        self.assertFalse(self.hist()["events"][0]["after"]["competency"]["certificate_verified"])
        with self.assertRaises(Denied):self.do(2,1,"record_competency",p,user="ALPHA")
    def test_competency_conflict(self):
        self.do(action="record_competency",p={"facility_id":"DEMO-PSW-ALPHA","observed_on":"2026-08-01","topic":"KESMAVET_DEMO"},user="ALPHA")
        with self.assertRaises(Denied):self.do(2,1)
    def test_revoke_replay(self):
        self.do();self.s._db.execute("UPDATE contract_grant SET active=0 WHERE id='DEMO-GRANT-REVIEW'")
        with self.assertRaises(Denied):self.do()
    def test_rollback(self):
        self.s._db.execute("CREATE TRIGGER fail_staff BEFORE INSERT ON contract_staff_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.do()
        self.assertEqual(len(self.hist()["current"]["placements"]),1)
        self.assertEqual(self.hist()["current"]["revision"],0)
    def test_seed_history(self):self.assertEqual(len(self.hist("DEMO-SDM-01")["current"]["placements"]),2)
    def test_coverage_missing(self):self.assertIsNone(self.summary(year=2030)["paramedics"])
if __name__=="__main__":unittest.main()
