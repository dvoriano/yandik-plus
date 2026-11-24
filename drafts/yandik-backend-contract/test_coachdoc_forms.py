"""CODE_ONLY | 9 memory rehearsal declarations; not run."""
import unittest
from coachdoc_store import CoachDocStore
from coachdoc_payload import EVIDENCE
from apel_payload import Denied
A="DEMO-REC-COACH-ALPHA-2026-1";D="DEMO-REC-DOC-ALPHA-2026-1-HASIL"
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def cmd(n,rev,a,p=None,rid=A):return dict(command_id="DEMO-COMMAND-C6-"+str(n),record_id=rid,expected_revision=rev,action=a,payload=p)
PLAN={"date":"2026-11-01","type":"Bimtek","topic":"Pelaporan APEL","planned":10}
RESULT={"attendance":9,"result":"HASIL_TERCATAT_DEMO","recommendation":"PERBARUI_DATA_DEMO","due":"2026-12-01","recorded_on":"2026-11-02"}
class FormTests(unittest.TestCase):
    def setUp(self):self.s=CoachDocStore()
    def tearDown(self):self.s.close()
    def a(self,u="REVIEW",rev=None):return self.s.view_coachdoc("coaching",A,actor(u),rev)
    def d(self,u="ALPHA",rev=None):return self.s.view_coachdoc("documents",D,actor(u),rev)
    def result(self):
        self.s.apply_coaching(cmd(1,0,"plan",PLAN),actor("REVIEW"))
        self.s.apply_coaching(cmd(2,1,"record",RESULT),actor("ALPHA"))
    def created(self):
        self.result();self.s.apply_document(cmd(3,0,"create",rid=D),actor("ALPHA"))
    def test_empty_plan(self):
        self.assertEqual(self.a()["candidate_actions"],["plan"])
        self.assertEqual(self.a("ALPHA")["candidate_actions"],[])
    def test_slots(self):
        v=self.s.list_coachdoc("DEMO-PSW-ALPHA",2026,actor("REVIEW"))
        self.assertEqual([x["slot"] for x in v["activity_slots"]],[1,2])
        self.assertEqual(len(v["document_slots"]),8)
    def test_result_actions(self):
        self.result();self.assertEqual(self.a()["candidate_actions"],["review","return_result"])
    def test_creation_actions(self):
        self.assertEqual(self.d()["candidate_actions"],[])
        self.result();self.assertEqual(self.d()["candidate_actions"],["create"])
    def test_missing_evidence(self):
        self.created();self.assertEqual(self.d()["candidate_actions"],["evidence"])
    def test_complete_evidence(self):
        self.created()
        for i,k in enumerate(EVIDENCE):self.s.apply_document(cmd(4+i,1+i,"evidence",{"kind":k,"ref":"DEMO-EVIDENCE-"+str(i)},D),actor("ALPHA"))
        self.assertIn("submit",self.d()["candidate_actions"])
    def test_stale_refresh(self):
        self.created();self.s.apply_coaching(cmd(8,2,"review"),actor("REVIEW"))
        self.assertTrue(self.d()["source_changed"]);self.assertEqual(self.d()["candidate_actions"],["refresh"])
    def test_history_read_only(self):
        self.result();self.assertEqual(self.a("REVIEW",1)["candidate_actions"],[])
    def test_scope(self):
        with self.assertRaises(Denied):self.d("BETA")
