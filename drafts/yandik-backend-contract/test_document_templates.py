"""CODE_ONLY | 7 pure + 6 memory rehearsal declarations; not executed."""
import unittest
from document_templates import render,as_text,VERSION
from coachdoc_store import CoachDocStore
from apel_payload import Denied
from coachdoc_payload import coach_change,doc_change
A="DEMO-REC-COACH-ALPHA-2026-1";D="DEMO-REC-DOC-ALPHA-2026-1-HASIL"
PLAN={"date":"2026-11-01","type":"Bimtek","topic":"Pelaporan APEL","planned":10}
RESULT={"attendance":0,"result":"HASIL_TERCATAT_DEMO","recommendation":"PERBARUI_DATA_DEMO","due":"2026-12-01","recorded_on":"2026-11-02"}
IDENTITY={"facility_id":"DEMO-PSW-ALPHA","facility_label":"Puskeswan DEMO ALPHA","region_id":"DEMO-REGION-UTARA","region_label":"Wilayah DEMO UTARA","activity_id":A}
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def cmd(n,rev,a,p=None,rid=A):return dict(command_id="DEMO-COMMAND-C7-"+str(n),record_id=rid,expected_revision=rev,action=a,payload=p)
def snapshot(kind):
    src=coach_change(coach_change(None,cmd(1,0,"plan",PLAN),2026),cmd(2,1,"record",RESULT),2026)
    return doc_change(None,cmd(3,0,"create",rid=D),src,2,kind)
class PureTests(unittest.TestCase):
    def test_four_distinct(self):
        self.assertEqual(len({tuple(s["title"] for s in render(snapshot(k),IDENTITY,D,1)["sections"]) for k in ("HASIL","BA","PENGANTAR","REKAP")}),4)
    def test_notice(self):self.assertIn("BUKAN DOKUMEN RESMI",as_text(render(snapshot("HASIL"),IDENTITY,D,1)))
    def test_zero(self):self.assertIn("Kehadiran aktual: 0",as_text(render(snapshot("HASIL"),IDENTITY,D,1)))
    def test_null(self):self.assertIn("Penyelesaian: Belum tercatat",as_text(render(snapshot("REKAP"),IDENTITY,D,1)))
    def test_official_fields(self):
        v=render(snapshot("PENGANTAR"),IDENTITY,D,1);self.assertFalse(v["may_send"]);self.assertIn("Nomor surat: [Belum ditetapkan]",as_text(v))
    def test_template_pin(self):self.assertEqual(render(snapshot("BA"),IDENTITY,D,1)["template_version"],VERSION)
    def test_unknown_version(self):
        with self.assertRaises(Denied):render(snapshot("HASIL"),IDENTITY,D,1,"UNKNOWN")
class StoreTests(unittest.TestCase):
    def setUp(self):
        self.s=CoachDocStore()
        self.s.apply_coaching(cmd(1,0,"plan",PLAN),actor("REVIEW"))
        self.s.apply_coaching(cmd(2,1,"record",RESULT),actor("ALPHA"))
        self.s.apply_document(cmd(3,0,"create",rid=D),actor("ALPHA"))
    def tearDown(self):self.s.close()
    def view(self,rev=None):return self.s.view_coachdoc("documents",D,actor("ALPHA"),rev)
    def test_render_row(self):self.assertEqual(self.view()["document_render"]["source_revision"],2)
    def test_metadata_revision(self):
        self.s.apply_document(cmd(4,1,"evidence",{"kind":"Agenda","ref":"DEMO-EVIDENCE-C7"},D),actor("ALPHA"))
        self.assertIn("DEMO-EVIDENCE-C7",self.view()["draft_text"]);self.assertNotIn("DEMO-EVIDENCE-C7",self.view(1)["draft_text"])
    def test_stale_unchanged(self):
        before=self.view()["document_render"];self.s.apply_coaching(cmd(5,2,"review"),actor("REVIEW"))
        self.assertEqual(self.view()["document_render"],before);self.assertTrue(self.view()["source_changed"])
    def test_refresh(self):
        self.s.apply_coaching(cmd(5,2,"review"),actor("REVIEW"));self.s.apply_document(cmd(6,1,"refresh",rid=D),actor("ALPHA"))
        self.assertEqual(self.view()["document_render"]["source_revision"],3);self.assertEqual(self.view(1)["document_render"]["source_revision"],2)
    def test_immutable(self):
        with self.assertRaises(Exception):self.s._db.execute("UPDATE contract_document_render SET render_json='{}' WHERE record_id=?",(D,))
    def test_atomic_rollback(self):
        self.s._db.execute("CREATE TRIGGER fail_render BEFORE INSERT ON contract_document_render BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.s.apply_document(cmd(4,1,"evidence",{"kind":"Agenda","ref":"DEMO-EVIDENCE-C7"},D),actor("ALPHA"))
        self.assertEqual(self.view()["revision"],1)
