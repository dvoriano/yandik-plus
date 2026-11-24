"""CODE_ONLY, not executed. Memory tests require separate DDL permission."""
import unittest
from profile_payload import SECTIONS,normalize,coverage
from profile_store import ProfileStore
from apel_payload import Denied
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def ready(status="AVAILABLE_REPORTED"):return {"observed_on":"2026-11-24","status":status}
def legal():return {"observed_on":"2026-11-24","status":"REFERENCE_RECORDED_DEMO","document_type":"ESTABLISHMENT_DEMO","reference":"DEMO-DOC-1","issued_on":"2020-01-01","valid_until":None}
def rid(section="bangunan",year=2026,name="ALPHA"):return f"DEMO-REC-PROF-{name}-{year}-{section.upper()}"
def cmd(seq,rev,action="save_draft",p=None,section="bangunan",year=2026,reason=None):
    return dict(command_id="DEMO-COMMAND-PROF-"+str(seq),record_id=rid(section,year),expected_revision=rev,action=action,payload=ready() if action=="save_draft" and p is None else p,reason_code=reason)
class PureTests(unittest.TestCase):
    def test_seven(self):self.assertEqual(len(SECTIONS),7)
    def test_legal(self):self.assertEqual(normalize("legalitas",legal(),2026)["reference"],"DEMO-DOC-1")
    def test_real_ref(self):
        p=legal();p["reference"]="123456"
        with self.assertRaises(Denied):normalize("legalitas",p,2026)
    def test_bad_date(self):
        p=legal();p["issued_on"]="2020-02-30"
        with self.assertRaises(Denied):normalize("legalitas",p,2026)
    def test_year(self):
        with self.assertRaises(Denied):normalize("bangunan",ready(),2027)
    def test_validity(self):
        p=legal();p["valid_until"]="2019-01-01"
        with self.assertRaises(Denied):normalize("legalitas",p,2026)
    def test_no_duplicate_counts(self):
        with self.assertRaises(Denied):normalize("peralatan",{**ready(),"total":10},2026)
    def test_unknown(self):self.assertEqual(normalize("surveilans",ready("UNKNOWN"),2026)["status"],"UNKNOWN")
    def test_coverage_duplicate(self):
        with self.assertRaises(Denied):normalize("wilayah_kerja",{**ready(),"coverage_refs":["DEMO-AREA","DEMO-AREA"]},2026)
    def test_no_sdm_field(self):
        with self.assertRaises(Denied):normalize("sdm",ready(),2026)
class StoreTests(unittest.TestCase):
    def setUp(self):self.s=ProfileStore()
    def tearDown(self):self.s.close()
    def do(self,*args,user="ALPHA",**kw):return self.s.apply_profile(cmd(*args,**kw),actor(user))
    def view(self,year=2026,user="ALPHA"):return self.s.view_profile("DEMO-PSW-ALPHA",year,actor(user))
    def section(self,section="bangunan"):return next(x for x in self.view()["sections"] if x["section"]==section)
    def test_blank(self):self.assertEqual(self.view()["coverage"]["sections_entered"],0)
    def test_save(self):self.do(1,0);self.assertEqual(self.section()["revision"],1)
    def test_section_isolation(self):self.do(1,0);self.assertEqual(self.section("peralatan")["revision"],0)
    def test_year_isolation(self):self.do(1,0);self.assertEqual(self.view(2027)["coverage"]["sections_entered"],0)
    def test_wrong_facility(self):
        with self.assertRaises(Denied):self.view(user="BETA")
    def test_wrong_region(self):
        with self.assertRaises(Denied):self.view(user="KAB-SELATAN")
    def test_county_read(self):self.assertEqual(len(self.view(user="KAB-UTARA")["sections"]),7)
    def test_county_no_review(self):
        self.do(1,0);self.do(2,1,"submit")
        with self.assertRaises(Denied):self.do(3,2,"record_review",user="KAB-UTARA")
    def test_submit_missing(self):
        with self.assertRaises(Denied):self.do(1,0,"submit")
    def test_review_reopen(self):
        self.do(1,0);self.do(2,1,"submit");self.do(3,2,"record_review",user="REVIEW")
        self.do(4,3,"reopen",user="REVIEW",reason="UPDATE_PROFILE_DEMO")
        self.assertEqual(self.section()["state"],"CORRECTION")
        self.assertFalse(self.section()["last_recorded_demo"]["current"])
    def test_replay(self):self.do(1,0);self.assertTrue(self.do(1,0)["replay_demo"])
    def test_stale(self):
        self.do(1,0)
        with self.assertRaises(Denied):self.do(2,0)
    def test_history(self):
        self.do(1,0);self.do(2,1,"submit")
        self.assertEqual(len(self.s.profile_history(rid(),actor("ALPHA"))),2)
    def test_unknown_sources(self):
        v=self.view();self.assertIsNone(v["sdm"]["doctors"]);self.assertIsNone(v["apel"]["observed_service_total"])
    def test_inventory_reference(self):
        self.s.apply_inventory(dict(command_id="DEMO-COMMAND-REF-1",record_id="DEMO-REC-INV-ALPHA-2026",expected_revision=0,action="save_item",payload={"item_id":"A.4.b","observation":{"status":"ABSENT","total":0,"usable":0,"condition":None}},reason_code=None),actor("ALPHA"))
        self.assertEqual(self.view()["inventory"]["confirmed"],1)
        self.assertEqual(self.view()["coverage"]["sections_entered"],0)
    def test_rollback(self):
        self.s._db.execute("CREATE TRIGGER fail_prof BEFORE INSERT ON contract_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.do(1,0)
        self.assertEqual(self.section()["revision"],0)
if __name__=="__main__":unittest.main()
