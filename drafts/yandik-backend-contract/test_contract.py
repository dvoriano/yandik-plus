"""CODE_ONLY: written, not run. No DB or HTTP."""
import unittest
from dataclasses import replace
from contract import Session, Record, plan_access, exclusive_end, reconciled_identity
S=Session("DEMO-ACTOR-A","puskeswan","DEMO-REGION-N","DEMO-PSW-A",True)
R=Record("DEMO-REC-A","apel","DEMO-REGION-N","DEMO-PSW-A","DEMO-ACTOR-A","DRAFT",1)
V=Session("DEMO-ACTOR-V","provinsi_verifikator",active=True)
class ContractTests(unittest.TestCase):
    def test_own_read(self): self.assertTrue(plan_access(S,R,"read")["candidate"])
    def test_inactive(self): self.assertFalse(plan_access(replace(S,active=False),R,"read")["candidate"])
    def test_non_demo(self): self.assertFalse(plan_access(S,replace(R,synthetic=False),"read")["candidate"])
    def test_region(self): self.assertEqual(plan_access(replace(S,region_id="DEMO-REGION-X"),R,"read")["reason"],"SCOPE_DENIED")
    def test_facility(self): self.assertFalse(plan_access(replace(S,facility_id="DEMO-PSW-X"),R,"read")["candidate"])
    def test_pimpinan(self): self.assertEqual(plan_access(Session("DEMO-ACTOR-P","pimpinan",active=True),R,"read")["reason"],"AGGREGATE_ONLY")
    def test_role_scope(self): self.assertFalse(plan_access(replace(S,role="provinsi_admin"),R,"read")["candidate"])
    def test_draft(self): self.assertEqual(plan_access(S,R,"save_draft",1)["next_state"],"DRAFT")
    def test_submit(self): self.assertEqual(plan_access(S,R,"submit",1)["next_state"],"SUBMITTED")
    def test_stale(self): self.assertEqual(plan_access(S,R,"submit",0)["reason"],"REVISION_CONFLICT")
    def test_boolean_revision(self): self.assertFalse(plan_access(S,R,"submit",True)["candidate"])
    def test_wrong_author(self): self.assertFalse(plan_access(replace(S,actor_id="DEMO-ACTOR-B"),R,"submit",1)["candidate"])
    def test_self_review(self): self.assertFalse(plan_access(replace(V,actor_id=R.owner_id),replace(R,state="SUBMITTED"),"record_review",1)["candidate"])
    def test_review(self): self.assertEqual(plan_access(V,replace(R,state="SUBMITTED"),"record_review",1)["next_state"],"RECORDED_DEMO")
    def test_no_skip(self): self.assertFalse(plan_access(V,R,"record_review",1)["candidate"])
    def test_readonly_regional(self): self.assertFalse(plan_access(V,replace(R,resource="medicine",facility_id=None,state="SUBMITTED"),"record_review",1)["candidate"])
    def test_no_execute(self): self.assertFalse(plan_access(S,R,"submit",1)["may_execute"])
    def test_inclusive_conversion(self): self.assertEqual(exclusive_end("2026-12-31"),"2027-01-01")
    def test_open_interval(self): self.assertIsNone(exclusive_end(None))
    def test_invalid_date(self):
        with self.assertRaises(ValueError): exclusive_end("2026-02-30")
    def test_namespace(self): self.assertEqual(reconciled_identity("M05","A",[{"namespace":"M04","external_id":"A","facility_id":"DEMO-PSW-A"}])["candidate_ids"],[])
    def test_candidate_not_merge(self): self.assertIsNone(reconciled_identity("M04","A",[{"namespace":"M04","external_id":"A","facility_id":"DEMO-PSW-A"}])["resolved_id"])
if __name__=="__main__": unittest.main()
