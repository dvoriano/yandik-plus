"""CODE_ONLY | 5 pure + 8 rehearsal declarations, not run."""
import unittest
from support_catalog import ITEMS,classification,shortage
from inventory_payload import INDEX
from support_store import SupportStore
from apel_payload import Denied
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
class PureTests(unittest.TestCase):
    def test_catalog_count(self):self.assertEqual(len(ITEMS),101)
    def test_building(self):self.assertNotIn("A.1",ITEMS)
    def test_stock(self):self.assertNotIn("A.5.15",ITEMS)
    def test_duplicate(self):self.assertNotIn("C.2.k",ITEMS)
    def test_gap(self):
        self.assertEqual(shortage(INDEX["A.4.b"],{"confirmed":True,"status":"AVAILABLE","usable":1}),1)
        self.assertIsNone(shortage(INDEX["C.1.a"],{"confirmed":True,"status":"ABSENT","usable":0}))
class StoreTests(unittest.TestCase):
    def setUp(self):self.s=SupportStore()
    def tearDown(self):self.s.close()
    def listing(self,user="ALPHA"):return self.s.list_support("DEMO-PSW-ALPHA",2026,actor(user))
    def inv(self):
        self.s.apply_inventory({"command_id":"DEMO-COMMAND-C4-INV","record_id":"DEMO-REC-INV-ALPHA-2026","expected_revision":0,"action":"save_item","payload":{"item_id":"C.1.a","observation":{"status":"ABSENT","total":0,"usable":0,"condition":None}},"reason_code":None},actor("ALPHA"))
    def test_slots(self):self.assertEqual(self.s._db.execute("SELECT COUNT(*) FROM contract_support_case").fetchone()[0],1515)
    def test_all_items(self):self.assertEqual(len(self.listing()["rows"]),198)
    def test_no_fake_eligibility(self):self.assertTrue(all(x["funding_eligible"] is None for x in self.listing()["rows"]))
    def test_scope(self):
        with self.assertRaises(Denied):self.listing("GAMMA")
    def test_no_unknown_proposal(self):
        self.assertTrue(all("propose" not in x["candidate_actions"] for x in self.listing()["rows"]))
    def test_gap_proposal(self):
        self.inv();r=next(x for x in self.listing()["rows"] if x["item_id"]=="C.1.a")
        self.assertIn("propose",r["candidate_actions"])
        self.assertEqual(self.s.apply_support({"command_id":"DEMO-COMMAND-C4-PROP","record_id":r["record_id"],"expected_revision":0,"action":"propose","payload":{"requested":2,"reason":"FILL_GAP_DEMO"}},actor("ALPHA"))["revision"],1)
    def test_county_cannot_propose(self):
        self.inv();self.assertTrue(all("propose" not in x["candidate_actions"] for x in self.listing("KAB-UTARA")["rows"]))
    def test_legacy_transport_id(self):
        self.assertEqual(self.s.view_support("DEMO-REC-SUP-ALPHA-2026-A-4-B",actor("ALPHA"))["item_id"],"A.4.b")
