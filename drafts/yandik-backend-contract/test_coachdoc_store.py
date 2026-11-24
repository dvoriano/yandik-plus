"""CODE_ONLY. 6 pure + 16 memory rehearsal; not run."""
import unittest
from apel_payload import Denied
from coachdoc_payload import intent,coach_change,doc_change,EVIDENCE
from coachdoc_store import CoachDocStore
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
A="DEMO-REC-COACH-ALPHA-2026-1";D="DEMO-REC-DOC-ALPHA-2026-1-HASIL"
PLAN={"date":"2026-11-01","type":"Bimtek","topic":"Pelaporan APEL","planned":10}
RESULT={"attendance":9,"result":"HASIL_TERCATAT_DEMO","recommendation":"PERBARUI_DATA_DEMO","due":"2026-12-01","recorded_on":"2026-11-02"}
REASON={"reason":"UPDATE_SOURCE_DEMO"}
CLOSE={"completion":"TINDAK_LANJUT_TERCATAT_DEMO","completed_on":"2026-11-28"}
def cmd(n,rev,a,p=None,rid=A):return dict(command_id="DEMO-COMMAND-CD-"+str(n),record_id=rid,expected_revision=rev,action=a,payload=p)
class PureTests(unittest.TestCase):
    def test_plan(self):self.assertEqual(coach_change(None,cmd(1,0,"plan",PLAN),2026)["stage"],"PLANNED")
    def test_year(self):
        with self.assertRaises(Denied):coach_change(None,cmd(1,0,"plan",PLAN),2027)
    def test_invalid_count(self):
        with self.assertRaises(Denied):intent(cmd(1,0,"plan",{**PLAN,"planned":True}),"coaching")
    def test_bad_date(self):
        with self.assertRaises(Denied):intent(cmd(1,0,"plan",{**PLAN,"date":"2026-02-30"}),"coaching")
    def test_missing_source(self):
        with self.assertRaises(Denied):doc_change(None,cmd(1,0,"create",rid=D),None,0,"HASIL")
    def test_real_evidence(self):
        with self.assertRaises(Denied):intent(cmd(1,0,"evidence",{"kind":"Agenda","ref":"actual.pdf"},D),"documents")
class StoreTests(unittest.TestCase):
    def setUp(self):self.s=CoachDocStore()
    def tearDown(self):self.s.close()
    def coach(self,n,r,a,p=None,u="REVIEW"):return self.s.apply_coaching(cmd(n,r,a,p),actor(u))
    def doc(self,n,r,a,p=None,u="ALPHA"):return self.s.apply_document(cmd(n,r,a,p,D),actor(u))
    def view(self,r="documents",id=D,rev=None):return self.s.view_coachdoc(r,id,actor("ALPHA"),rev)
    def result(self):self.coach(1,0,"plan",PLAN);self.coach(2,1,"record",RESULT,"ALPHA")
    def created(self):self.result();self.coach(3,2,"review");self.doc(4,0,"create")
    def submitted(self):
        self.created()
        for i,k in enumerate(EVIDENCE):self.doc(5+i,1+i,"evidence",{"kind":k,"ref":"DEMO-EVIDENCE-"+str(i)})
        self.doc(9,5,"submit")
    def test_slots(self):self.assertEqual(len(self.s.list_coachdoc("DEMO-PSW-ALPHA",2026,actor("ALPHA"))["document_slots"]),8)
    def test_plan_role(self):
        with self.assertRaises(Denied):self.coach(1,0,"plan",PLAN,"ALPHA")
    def test_result(self):self.result();self.assertEqual(self.view("coaching",A)["snapshot"]["attendance"],9)
    def test_return(self):
        self.result();self.coach(3,2,"return_result",REASON);self.assertIsNone(self.view("coaching",A)["snapshot"]["attendance"])
    def test_scope(self):
        with self.assertRaises(Denied):self.s.view_coachdoc("coaching",A,actor("BETA"))
    def test_create_before_result(self):
        with self.assertRaises(Denied):self.doc(1,0,"create")
    def test_source_pin(self):self.created();self.assertEqual(self.view()["snapshot"]["source_revision"],3)
    def test_submit_missing(self):
        self.created()
        with self.assertRaises(Denied):self.doc(5,1,"submit")
    def test_duplicate_evidence(self):
        self.created();p={"kind":"Agenda","ref":"DEMO-EVIDENCE-A"}
        self.doc(5,1,"evidence",p)
        with self.assertRaises(Denied):self.doc(6,2,"evidence",p)
    def test_archive(self):self.submitted();self.assertEqual(self.doc(10,6,"archive",REASON,"REVIEW")["stage"],"ARCHIVED_DEMO")
    def test_stale(self):
        self.submitted();self.coach(11,3,"close",CLOSE)
        with self.assertRaises(Denied):self.doc(12,6,"archive",REASON,"REVIEW")
    def test_refresh(self):
        self.submitted();self.coach(11,3,"close",CLOSE);self.doc(12,6,"refresh")
        self.assertEqual(self.view()["snapshot"]["evidence"],[]);self.assertEqual(self.view(rev=6)["snapshot"]["version"],1)
    def test_reopen(self):
        self.submitted();self.doc(10,6,"archive",REASON,"REVIEW");self.doc(11,7,"reopen",REASON,"REVIEW")
        self.assertEqual(self.view()["snapshot"]["stage"],"CORRECTION")
    def test_replay(self):self.created();self.assertTrue(self.doc(4,0,"create")["replay_demo"])
    def test_stale_revision(self):
        self.created()
        with self.assertRaises(Denied):self.doc(5,0,"create")
    def test_rollback(self):
        self.result();self.s._db.execute("CREATE TRIGGER fail_cd BEFORE INSERT ON contract_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.doc(3,0,"create")
        self.assertIsNone(self.view()["snapshot"]);self.assertEqual(self.s._db.execute("SELECT COUNT(*) FROM contract_document_source").fetchone()[0],0)
if __name__=="__main__":unittest.main()
