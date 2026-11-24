"""CODE_ONLY. 6 pure + 14 memory rehearsal; never executed in this phase."""
import unittest
from apel_payload import Denied
from support_payload import empty,change,intent,project
from support_store import SupportStore
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
RID="DEMO-REC-SUP-ALPHA-2026-A-4-B"
def cmd(seq,rev,a,p=None,rid=RID):return dict(command_id="DEMO-COMMAND-SUP-"+str(seq),record_id=rid,expected_revision=rev,action=a,payload=p)
NEED={"requested":4,"reason":"FILL_GAP_DEMO"}
SHIP={"shipment_ref":"DEMO-SHIP-1","quantity":3,"sent_on":"2026-11-24"}
RECEIVE={"shipment_ref":"DEMO-SHIP-1","receipt_ref":"DEMO-RECEIPT-1","good":2,"damaged":1,"received_on":"2026-11-25"}
HANDOVER={"receipt_ref":"DEMO-RECEIPT-1","reference":"DEMO-BAST-1","recorded_on":"2026-11-26"}
MONITOR={"receipt_ref":"DEMO-RECEIPT-1","observed_on":"2027-01-01","in_use":1,"not_in_use":1,"damaged_after":0}
class PureTests(unittest.TestCase):
    def test_empty(self):self.assertIsNone(project(empty())["not_sent"])
    def test_missing_source(self):
        with self.assertRaises(Denied):change(empty(),cmd(1,0,"propose",NEED))
    def test_negative(self):
        with self.assertRaises(Denied):intent(cmd(1,0,"plan_package",{"quantity":-1}))
    def test_invalid_date(self):
        with self.assertRaises(Denied):intent(cmd(1,0,"dispatch",{**SHIP,"sent_on":"2026-02-30"}))
    def test_no_dispatch(self):
        with self.assertRaises(Denied):change(empty(),cmd(1,0,"dispatch",SHIP))
    def test_missing_observation(self):self.assertIsNone(project(empty())["in_use_observed"])
class StoreTests(unittest.TestCase):
    def setUp(self):self.s=SupportStore()
    def tearDown(self):self.s.close()
    def inv(self,seq=1,rev=0,status="ABSENT",total=0,usable=0):
        self.s.apply_inventory(dict(command_id="DEMO-COMMAND-SINV-"+str(seq),record_id="DEMO-REC-INV-ALPHA-2026",expected_revision=rev,action="save_item",payload={"item_id":"A.4.b","observation":{"status":status,"total":total,"usable":usable,"condition":None}},reason_code=None),actor("ALPHA"))
    def do(self,n,rev,a,p=None,user="ALPHA"):return self.s.apply_support(cmd(n,rev,a,p),actor(user))
    def view(self,user="ALPHA"):return self.s.view_support(RID,actor(user))
    def draft(self):self.inv();self.do(1,0,"propose",NEED)
    def schedule(self):
        self.draft();self.do(2,1,"submit");self.do(3,2,"county_review",user="KAB-UTARA")
        self.do(4,3,"plan_package",{"quantity":3},user="REVIEW")
        self.do(5,4,"schedule",{"quantity":3,"planned_on":"2026-11-24"},user="REVIEW")
    def dispatched(self):self.schedule();self.do(6,5,"dispatch",SHIP,user="REVIEW")
    def received(self):self.dispatched();self.do(7,6,"receive",RECEIVE)
    def test_unknown_denied(self):
        with self.assertRaises(Denied):self.do(1,0,"propose",NEED)
    def test_source_pin(self):self.draft();self.assertEqual(self.view()["snapshot"]["need"]["source"]["revision"],1)
    def test_replay(self):self.draft();self.assertTrue(self.do(1,0,"propose",NEED)["replay_demo"])
    def test_stale_source(self):
        self.draft();self.inv(2,1,"AVAILABLE",2,2)
        with self.assertRaises(Denied):self.do(2,1,"submit")
    def test_scope(self):
        with self.assertRaises(Denied):self.view("KAB-SELATAN")
    def test_county_required(self):
        self.draft();self.do(2,1,"submit")
        with self.assertRaises(Denied):self.do(3,2,"plan_package",{"quantity":3},user="REVIEW")
    def test_over_ship(self):
        self.schedule()
        with self.assertRaises(Denied):self.do(6,5,"dispatch",{**SHIP,"quantity":4},user="REVIEW")
    def test_partial_receipt(self):
        self.dispatched();self.do(7,6,"receive",{**RECEIVE,"good":1,"damaged":0})
        self.assertEqual(self.view()["summary"]["awaiting_receipt"],2)
    def test_over_receive(self):
        self.dispatched()
        with self.assertRaises(Denied):self.do(7,6,"receive",{**RECEIVE,"good":3})
    def test_stale_after_dispatch(self):
        self.dispatched();self.inv(2,1,"AVAILABLE",2,2);self.do(7,6,"receive",RECEIVE)
        self.assertTrue(self.view()["source_changed"])
    def test_monitor(self):
        self.received();self.do(8,7,"handover",HANDOVER,user="REVIEW");self.do(9,8,"monitor",MONITOR)
        self.assertEqual(self.view()["summary"]["good_not_observed"],0)
    def test_monitor_bad_total(self):
        self.received();self.do(8,7,"handover",HANDOVER,user="REVIEW")
        with self.assertRaises(Denied):self.do(9,8,"monitor",{**MONITOR,"in_use":3})
    def test_no_rewind(self):
        self.dispatched()
        with self.assertRaises(Denied):self.do(7,6,"return_draft",{"reason":"REVIEW_CONDITION_DEMO"},user="REVIEW")
    def test_rollback(self):
        self.inv();self.s._db.execute("CREATE TRIGGER fail_sup BEFORE INSERT ON contract_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.do(1,0,"propose",NEED)
        self.assertEqual(self.view()["revision"],0)
if __name__=="__main__":unittest.main()
