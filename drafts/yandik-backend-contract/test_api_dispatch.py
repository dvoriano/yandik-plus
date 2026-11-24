"""CODE_ONLY; 5 pure + 15 memory rehearsal. No tests run."""
import unittest
from api_dispatch import DraftAPI,bounded,error_status,READS,WRITES
from api_projections import ProjectionStore,complete_sum
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
class PureTests(unittest.TestCase):
    def test_routes(self):self.assertEqual((len(READS),len(WRITES)),(20,8))
    def test_unknown(self):self.assertIsNone(complete_sum([{"n":1},{"n":None}],"n"))
    def test_zero(self):self.assertEqual(complete_sum([{"n":0}],"n"),0)
    def test_depth(self):self.assertFalse(bounded([[[[[[[[[0]]]]]]]]]))
    def test_status(self):self.assertEqual(error_status("REVISION_CONFLICT"),409)
class StoreTests(unittest.TestCase):
    def setUp(self):self.s=ProjectionStore()
    def tearDown(self):self.s.close()
    def read(self,path,q=None,user="ALPHA"):return DraftAPI(self.s,actor(user)).dispatch("GET","/api/v1/"+path,q)
    def test_core(self):self.assertEqual(len(self.read("core")["data"]["facilities"]),1)
    def test_unknown_path(self):self.assertEqual(self.read("__dict__")["status"],404)
    def test_identity_in_query(self):self.assertEqual(self.read("core",{"role":"provinsi_admin"})["status"],422)
    def test_bad_year(self):self.assertEqual(self.read("profiles",{"facility_id":"DEMO-PSW-ALPHA","year":True})["status"],422)
    def test_scope(self):self.assertEqual(self.read("profiles",{"facility_id":"DEMO-PSW-GAMMA","year":2026})["status"],403)
    def test_no_write_default(self):self.assertEqual(DraftAPI(self.s,actor("ALPHA")).dispatch("POST","/api/v1/apel/commands",body={})["status"],403)
    def test_medical_read_scope(self):self.assertEqual(self.read("medicine",{"region_id":"DEMO-REGION-UTARA","year":2026})["status"],403)
    def test_gis_missing(self):self.assertIsNone(self.read("gis",{"year":2026,"region_id":"ALL","layer":"service"})["data"]["points"][0]["value"])
    def test_gis_scope(self):self.assertEqual(len(self.read("gis",{"year":2026,"region_id":"ALL","layer":"facilities"})["data"]["points"]),1)
    def test_leadership(self):
        v=self.read("leadership",{"year":2026,"region_id":"ALL"},"REVIEW")["data"]
        self.assertIsNone(v["totals"]["doctors"]);self.assertIsNone(v["observed_services"]);self.assertNotIn("rows",v)
    def test_leadership_denied(self):self.assertEqual(self.read("leadership",{"year":2026,"region_id":"ALL"})["status"],403)
    def test_library(self):self.assertEqual(len(self.read("library",{"q":""})["data"]["items"]),14)
    def test_inbox(self):
        v=self.read("notifications",{"today":"2026-11-24"})["data"]
        self.assertEqual(v["facility_id"],"DEMO-PSW-ALPHA");self.assertIn("APEL_LEDGER",v["missing_sources"])
    def test_method(self):self.assertEqual(DraftAPI(self.s,actor("ALPHA")).dispatch("DELETE","/api/v1/core")["status"],405)
    def test_revoked(self):
        self.s._db.execute("UPDATE contract_grant SET active=0 WHERE id='DEMO-GRANT-ALPHA'")
        self.assertEqual(self.read("core")["status"],403)
if __name__=="__main__":unittest.main()
