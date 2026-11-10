"""Tests for regional permissions and immutable workflow audit events."""
from datetime import datetime, timezone
import unittest

from foundation.yandik_base.access import (
    Action, Principal, ResourceScope, Role, permitted,
)
from foundation.yandik_base.workflow import (
    State, WorkItem, WorkflowDenied, WorkflowError, advance,
)

AT = datetime(2026, 11, 10, 14, 0, tzinfo=timezone.utc)
A = ResourceScope("DEMO-PSW-001", "Kabupaten Contoh")
B = ResourceScope("DEMO-PSW-002", "Kota Contoh")
OWNER = Principal("DEMO-USER-001", Role.PUSKESWAN, A.kab_kota, A.puskeswan_id)
OTHER = Principal("DEMO-USER-002", Role.PUSKESWAN, B.kab_kota, B.puskeswan_id)
KAB = Principal("DEMO-KAB-001", Role.KAB_KOTA, A.kab_kota)
VERIFIER = Principal("DEMO-VER-001", Role.PROVINSI_VERIFIKATOR)
ADMIN = Principal("DEMO-ADM-001", Role.PROVINSI_ADMIN)
LEADER = Principal("DEMO-PIM-001", Role.PIMPINAN)


class TestAccess(unittest.TestCase):
    def test_puskeswan_is_limited_to_own_facility(self):
        self.assertTrue(permitted(OWNER, Action.SUBMIT_APEL, A))
        self.assertFalse(permitted(OWNER, Action.SUBMIT_APEL, B))
        self.assertFalse(permitted(OTHER, Action.EDIT_PROFILE, A))

    def test_kabupaten_cannot_cross_territory(self):
        self.assertTrue(permitted(KAB, Action.VERIFY_NEED, A))
        self.assertFalse(permitted(KAB, Action.VERIFY_NEED, B))

    def test_leadership_can_see_aggregate_not_individual(self):
        self.assertTrue(permitted(LEADER, Action.VIEW_AGGREGATE))
        self.assertFalse(permitted(LEADER, Action.VIEW_PROFILE, A))
        self.assertFalse(permitted(LEADER, Action.VIEW_NEED, A))

    def test_default_deny_for_unknown_role_action_or_scope(self):
        bad = Principal("DEMO-X", "admin", A.kab_kota)
        self.assertFalse(permitted(bad, Action.VIEW_PROFILE, A))
        self.assertFalse(permitted(OWNER, "verify_need", A))
        self.assertFalse(permitted(OWNER, Action.VIEW_PROFILE, None))

    def test_review_and_followup_arenot_same_permission(self):
        self.assertTrue(permitted(VERIFIER, Action.VERIFY_NEED, A))
        self.assertFalse(permitted(VERIFIER, Action.RECORD_FOLLOWUP, A))
        self.assertFalse(permitted(ADMIN, Action.VERIFY_NEED, A))
        self.assertTrue(permitted(ADMIN, Action.RECORD_FOLLOWUP, A))


class TestWorkflow(unittest.TestCase):
    @staticmethod
    def item():
        return WorkItem("DEMO-CASE-001", A, OWNER.user_id)

    def test_success_flow_produces_append_only_events(self):
        original = self.item()
        submitted = advance(original, State.DIAJUKAN, OWNER, AT)
        reviewing = advance(submitted, State.DALAM_VERIFIKASI, KAB, AT)
        verified = advance(reviewing, State.DIVERIFIKASI, VERIFIER, AT)
        followed = advance(verified, State.DITINDAKLANJUTI, ADMIN, AT)
        finished = advance(followed, State.SELESAI, ADMIN, AT)
        self.assertEqual(original.state, State.DRAF)
        self.assertEqual(original.history, ())
        self.assertEqual(finished.state, State.SELESAI)
        self.assertEqual(len(finished.history), 5)

    def test_other_puskeswan_cannot_submit(self):
        with self.assertRaises(WorkflowDenied):
            advance(self.item(), State.DIAJUKAN, OTHER, AT)

    def test_other_region_cannot_review(self):
        submitted = advance(self.item(), State.DIAJUKAN, OWNER, AT)
        other_kab = Principal("DEMO-KAB-002", Role.KAB_KOTA, "Kota Contoh")
        with self.assertRaises(WorkflowDenied):
            advance(submitted, State.DALAM_VERIFIKASI, other_kab, AT)

    def test_rejection_requires_reason(self):
        a = advance(self.item(), State.DIAJUKAN, OWNER, AT)
        b = advance(a, State.DALAM_VERIFIKASI, VERIFIER, AT)
        with self.assertRaises(WorkflowError):
            advance(b, State.DITOLAK, VERIFIER, AT)
        c = advance(b, State.DITOLAK, VERIFIER, AT, reason="Data belum sah")
        self.assertEqual(c.history[-1].reason, "Data belum sah")

    def test_resubmit_after_revision(self):
        a = advance(self.item(), State.DIAJUKAN, OWNER, AT)
        b = advance(a, State.DALAM_VERIFIKASI, KAB, AT)
        c = advance(b, State.PERLU_PERBAIKAN, KAB, AT, reason="Bukti kurang")
        d = advance(c, State.DIAJUKAN, OWNER, AT)
        self.assertEqual(d.state, State.DIAJUKAN)
        self.assertEqual(len(d.history), 4)

    def test_invalid_transition_and_missing_timezone_are_denied(self):
        with self.assertRaises(WorkflowError):
            advance(self.item(), State.SELESAI, ADMIN, AT)
        with self.assertRaises(WorkflowError):
            advance(self.item(), State.DIAJUKAN, OWNER, datetime(2026, 11, 10))

    def test_verifier_cannot_make_followup_decision(self):
        a = advance(self.item(), State.DIAJUKAN, OWNER, AT)
        b = advance(a, State.DALAM_VERIFIKASI, VERIFIER, AT)
        c = advance(b, State.DIVERIFIKASI, VERIFIER, AT)
        with self.assertRaises(WorkflowDenied):
            advance(c, State.DITINDAKLANJUTI, VERIFIER, AT)
