"""CODE_ONLY; new 4 pure + 8 rehearsal tests, not executed."""
import unittest
from apel_payload import Denied
from contract import Session,Record,plan_access
from inventory_payload import normalize_item
from revision_envelope import digest
from api_dispatch import error_status
from rehearsal_host import RehearsalHost
from api_projections import ProjectionStore
def fixture(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def request(path,query=None):return {"method":"GET","path":"/api/v1/"+path,"query":query or {},"body":None}
class PureTests(unittest.TestCase):
    def test_digest(self):self.assertEqual(digest({"a":1,"b":2}),digest({"b":2,"a":1}))
    def test_error(self):self.assertEqual(error_status("RECORD_NOT_AVAILABLE"),error_status("SCOPE_DENIED"))
    def test_year(self):
        with self.assertRaises(Denied):normalize_item("A.4.b",{"status":"ABSENT","total":0,"usable":0,"condition":None},2031)
    def test_malformed_role(self):
        s=Session("DEMO-ACTOR-A",[],active=True);r=Record("DEMO-REC-X","apel","DEMO-REGION-UTARA","DEMO-PSW-ALPHA","DEMO-ACTOR-A","DRAFT",0)
        self.assertFalse(plan_access(s,r,"read")["candidate"])
class StoreTests(unittest.TestCase):
    def test_default_off(self):
        with self.assertRaises(Denied):RehearsalHost()
    def setUp(self):self.s=ProjectionStore()
    def tearDown(self):self.s.close()
    def test_full_periods(self):
        self.assertEqual(self.s._db.execute("SELECT COUNT(*) FROM contract_apel_period").fetchone()[0],180)
    def test_legacy_preserved(self):self.assertEqual(self.s.view("DEMO-REC-ALPHA",fixture("ALPHA"))["period"],"2026-11")
    def test_beta_slot(self):self.assertEqual(self.s.view("DEMO-REC-APEL-BETA-2030-12",fixture("BETA"))["state"],"NOT_STARTED_DEMO")
    def test_no_ledger(self):self.assertIsNone(self.s.leadership(2030,"ALL",fixture("REVIEW"))["observed_services"])
    def test_host_default_read(self):
        h=RehearsalHost(execution_authorized=True)
        try:
            token=h.issue(fixture("ALPHA"))
            self.assertEqual(h.dispatch(token,request("core"))["status"],200)
            self.assertEqual(h.dispatch(token,{"method":"POST","path":"/api/v1/apel/commands","query":{},"body":{}})["status"],403)
        finally:h.close()
    def test_missing_same_status(self):
        from api_dispatch import DraftAPI
        a=DraftAPI(self.s,fixture("ALPHA"))
        x=a.dispatch("GET","/api/v1/apel",{"record_id":"DEMO-REC-MISSING"})
        y=a.dispatch("GET","/api/v1/apel",{"record_id":"DEMO-REC-GAMMA"})
        self.assertEqual((x["status"],x["error"]),(y["status"],y["error"]))
    def test_envelope_rollback(self):
        self.s._db.execute("CREATE TRIGGER fail_b BEFORE INSERT ON contract_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        x={"command_id":"DEMO-COMMAND-B1","record_id":"DEMO-REC-ALPHA","expected_revision":0,"action":"save_draft","reason_code":None,"payload":{"facility_id":"DEMO-PSW-ALPHA","period":"2026-11","declared_no_activity":True,"counts":{"pengobatan":0,"vaksinasi":0,"penyuluhan":0,"layanan_lain":0},"investigations":[],"kurban_animals":[],"evidence_refs":[]}}
        with self.assertRaises(Exception):self.s.apply(x,fixture("ALPHA"))
        self.assertEqual(self.s.view("DEMO-REC-ALPHA",fixture("ALPHA"))["revision"],0)
        self.assertEqual(self.s._db.execute("SELECT COUNT(*) FROM contract_audit").fetchone()[0],0)
if __name__=="__main__":unittest.main()
