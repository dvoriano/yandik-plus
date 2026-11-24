"""CODE_ONLY: 6 memory rehearsal tests, not executed."""
import unittest
from api_projections import ProjectionStore
from apel_payload import Denied
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
class AnnualTests(unittest.TestCase):
    def setUp(self):self.s=ProjectionStore()
    def tearDown(self):self.s.close()
    def test_catalog(self):
        r=self.s.view_inventory("DEMO-REC-INV-ALPHA-2026",actor("ALPHA"))
        self.assertEqual((len(r["catalog"]["items"]),len(r["catalog"]["groups"])),(198,15))
        self.assertFalse(r["catalog"]["official_verified"])
    def test_inventory_no_submit(self):
        r=self.s.view_inventory("DEMO-REC-INV-ALPHA-2026",actor("ALPHA"))
        self.assertIn("save_item",r["candidate_actions"]);self.assertNotIn("submit",r["candidate_actions"])
    def test_profile_actions(self):
        p=self.s.view_profile("DEMO-PSW-ALPHA",2026,actor("ALPHA"))
        self.assertEqual(p["sections"][0]["candidate_actions"],["save_draft"])
    def test_roster_local(self):
        r=self.s.staff_roster("DEMO-PSW-ALPHA",2026,actor("ALPHA"))
        self.assertTrue(r["rows"]);self.assertTrue(all(p["facility_id"]=="DEMO-PSW-ALPHA" for x in r["rows"] for p in x["placements"]))
    def test_roster_scope(self):
        with self.assertRaises(Denied):self.s.staff_roster("DEMO-PSW-GAMMA",2026,actor("ALPHA"))
    def test_reviewer(self):
        r=self.s.staff_roster("DEMO-PSW-ALPHA",2026,actor("REVIEW"))
        self.assertTrue(r["may_register_demo"]);self.assertTrue(all("latest_placement" in x for x in r["rows"]))
