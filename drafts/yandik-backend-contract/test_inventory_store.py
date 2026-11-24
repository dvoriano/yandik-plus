"""CODE_ONLY: 10 pure tests + 14 memory rehearsal tests, not executed."""
import unittest
from inventory_payload import INDEX, CATALOG, normalize_item, empty, copy_snapshot, summary, assessment
from inventory_store import InventoryStore
from apel_payload import Denied
def obs(status="AVAILABLE",total=2,usable=1,condition=None):return dict(status=status,total=total,usable=usable,condition=condition)
def actor(code):return lambda:{"actor_id":"DEMO-ACTOR-"+code,"grant_id":"DEMO-GRANT-"+code}
def record(year=2026,facility="ALPHA"):return f"DEMO-REC-INV-{facility}-{year}"
def cmd(seq,rev,action,p=None,year=2026,facility="ALPHA",reason=None):return dict(command_id="DEMO-COMMAND-INV-"+str(seq),record_id=record(year,facility),expected_revision=rev,action=action,payload=p,reason_code=reason)
def item(k="A.4.b",o=None):return {"item_id":k,"observation":obs() if o is None else o}
class PureTests(unittest.TestCase):
    def test_catalog(self):self.assertEqual((len(INDEX),len(CATALOG["groups"])),(198,15))
    def test_minima(self):self.assertEqual(len([i for i in INDEX.values() if i["minimum"] is not None]),7)
    def test_unknown(self):self.assertIsNone(normalize_item("A.4.b",obs("UNKNOWN",None,None),2026)["total"])
    def test_absent(self):self.assertEqual(normalize_item("A.4.b",obs("ABSENT",0,0),2026)["total"],0)
    def test_area(self):self.assertEqual(normalize_item("A.1",obs(total=100.5,usable=99.5),2026)["usable"],99.5)
    def test_quantity(self):
        with self.assertRaises(Denied):normalize_item("A.4.b",obs(total=1,usable=2),2026)
    def test_context(self):
        with self.assertRaises(Denied):normalize_item("A.4.b",obs("CONTEXT_REVIEW",None,None),2026)
    def test_stock(self):
        k=next(k for k,i in INDEX.items() if i["kind"]=="stock")
        self.assertEqual(normalize_item(k,obs("AVAILABLE",None,None,"LIMITED_REPORTED"),2026)["condition"],"LIMITED_REPORTED")
    def test_copy(self):
        s=empty();s["rows"]["A.4.b"]=normalize_item("A.4.b",obs(),2026)
        n=copy_snapshot(s,2026,1,"DRAFT")
        self.assertFalse(n["rows"]["A.4.b"]["confirmed"]);self.assertTrue(s["rows"]["A.4.b"]["confirmed"])
    def test_summary_unknown(self):self.assertIsNone(summary(empty())["attention"])
class StoreTests(unittest.TestCase):
    def setUp(self):self.s=InventoryStore()
    def tearDown(self):self.s.close()
    def do(self,seq,rev,action,p=None,year=2026,user="ALPHA",reason=None):
        return self.s.apply_inventory(cmd(seq,rev,action,p,year,reason=reason),actor(user))
    def view(self,year=2026,user="ALPHA"):return self.s.view_inventory(record(year),actor(user))
    def full(self):
        for i,k in enumerate(INDEX,1):self.do(i,i-1,"save_item",item(k,obs("UNKNOWN",None,None)))
        return len(INDEX)
    def test_initial(self):self.assertEqual(self.view()["state"],"NOT_STARTED")
    def test_save(self):self.do(1,0,"save_item",item());self.assertEqual(self.view()["confirmed"],1)
    def test_replay(self):self.do(1,0,"save_item",item());self.assertTrue(self.do(1,0,"save_item",item())["replay_demo"])
    def test_stale(self):
        self.do(1,0,"save_item",item())
        with self.assertRaises(Denied):self.do(2,0,"save_item",item())
    def test_copy_confirm(self):
        self.do(1,0,"save_item",item());self.do(2,0,"copy_prior",year=2027)
        self.assertEqual(self.view(2027)["confirmed"],0);self.do(3,1,"confirm_item",{"item_id":"A.4.b"},year=2027)
        self.assertEqual(self.view(2027)["confirmed"],1);self.assertEqual(self.view()["revision"],1)
    def test_group_attestation(self):
        with self.assertRaises(Denied):self.do(1,0,"confirm_group",{"group":"A4","reviewed_all":False})
    def test_no_copy_overwrite(self):
        self.do(1,0,"save_item",item(),year=2027)
        with self.assertRaises(Denied):self.do(2,1,"copy_prior",year=2027)
    def test_cross_scope(self):
        with self.assertRaises(Denied):self.view(user="KAB-SELATAN")
    def test_same_region_other_facility(self):
        with self.assertRaises(Denied):self.view(user="BETA")
    def test_incomplete_submit(self):
        self.do(1,0,"save_item",item())
        with self.assertRaises(Denied):self.do(2,1,"submit")
    def test_two_stage_review(self):
        n=self.full();self.do(n+1,n,"submit")
        with self.assertRaises(Denied):self.do(n+2,n+1,"province_review",user="REVIEW")
        self.do(n+3,n+1,"county_review",user="KAB-UTARA")
        self.assertTrue(self.view()["county_review_recorded"])
        self.assertEqual(self.do(n+4,n+2,"province_review",user="REVIEW")["state"],"RECORDED_DEMO")
    def test_return_clears_review(self):
        n=self.full();self.do(n+1,n,"submit");self.do(n+2,n+1,"county_review",user="KAB-UTARA")
        self.do(n+3,n+2,"return_correction",user="REVIEW",reason="CHECK_INVENTORY_DEMO")
        self.assertFalse(self.view()["county_review_recorded"])
    def test_rollback(self):
        self.s._db.execute("CREATE TRIGGER fail_inv BEFORE INSERT ON contract_command BEGIN SELECT RAISE(ABORT,'DEMO_FAIL'); END")
        with self.assertRaises(Exception):self.do(1,0,"save_item",item())
        self.assertEqual(self.view()["revision"],0)
    def test_apel_independent(self):
        self.do(1,0,"save_item",item())
        self.assertIsNone(self.s.view("DEMO-REC-ALPHA",actor("ALPHA"))["payload"])
if __name__=="__main__":unittest.main()
