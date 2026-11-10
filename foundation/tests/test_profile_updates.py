"""M02 profile-editing prototype: permissions, revision, and approval boundary."""
from __future__ import annotations

import unittest
from dataclasses import replace
from datetime import date, datetime, timezone
from pathlib import Path

from foundation.yandik_base import ContractError, load_fixture_bundle
from foundation.yandik_base.access import Action, Principal, ResourceScope, Role, permitted
from foundation.yandik_base.masterdata import load_master_data, facility_overview
from foundation.yandik_base.profile_updates import (
    ChangeState,
    ProfileDenied,
    VersionConflict,
    apply_approved_profile_change,
    begin_profile_change,
    patch_profile_change,
    profile_section_summaries,
    review_profile_change,
    submit_profile_change,
)

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"
TIME = datetime(2026, 11, 10, 7, 0, tzinfo=timezone.utc)
SCOPE = ResourceScope("DEMO-PSW-001", "Kabupaten Contoh")
OTHER_SCOPE = ResourceScope("DEMO-PSW-002", "Kota Contoh")
OWNER = Principal("DEMO-OWNER-01", Role.PUSKESWAN, "Kabupaten Contoh", "DEMO-PSW-001")
OTHER = Principal("DEMO-OWNER-02", Role.PUSKESWAN, "Kota Contoh", "DEMO-PSW-002")
REVIEWER = Principal("DEMO-REVIEWER-01", Role.KAB_KOTA, "Kabupaten Contoh")
OTHER_REVIEWER = Principal("DEMO-REVIEWER-02", Role.KAB_KOTA, "Kota Contoh")
PROVINCE = Principal("DEMO-PROVINCE-01", Role.PROVINSI_VERIFIKATOR)
LEADER = Principal("DEMO-LEADER-01", Role.PIMPINAN)


class ProfileRevisionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_fixture_bundle(FIXTURES)
        cls.master = load_master_data(FIXTURES, cls.bundle)

    def draft(self, section="bangunan"):
        return begin_profile_change("DEMO-CHANGE-001", SCOPE, section, OWNER)

    def patched(self, value="baik"):
        return patch_profile_change(
            self.draft(), OWNER, {"bangunan_kondisi": value},
            expected_version=0, at=TIME,
        )

    def submitted(self, value="baik"):
        draft = self.patched(value)
        return submit_profile_change(draft, OWNER, expected_version=draft.version, at=TIME)

    def approved(self, value="baik"):
        submitted = self.submitted(value)
        return review_profile_change(
            submitted, REVIEWER, ChangeState.DISETUJUI,
            expected_version=submitted.version, at=TIME,
        )

    def test_sections_are_separate_and_user_friendly(self):
        cards = profile_section_summaries(
            self.master, self.bundle, SCOPE, OWNER, at=date(2026, 11, 10)
        )
        self.assertEqual(len(cards), 5)
        by_section = {card.section: card for card in cards}
        self.assertEqual(by_section["legalitas"].status, "terverifikasi")
        self.assertEqual(by_section["bangunan"].status, "perlu_verifikasi")
        self.assertEqual(by_section["peralatan"].status, "belum_lengkap")
        self.assertTrue(all(card.bisa_diperbarui for card in cards))

    def test_section_cards_do_not_grant_edit_rights_to_verifier(self):
        cards = profile_section_summaries(
            self.master, self.bundle, SCOPE, REVIEWER, at=date(2026, 11, 10)
        )
        self.assertFalse(any(card.bisa_diperbarui for card in cards))

    def test_draft_keeps_audit_and_monotonic_versions(self):
        original = self.draft()
        change = self.patched()
        self.assertEqual(original.fields, ())
        self.assertEqual(original.version, 0)
        self.assertEqual(change.version, 1)
        self.assertEqual(len(change.history), 1)
        self.assertEqual(change.history[0].fields, ("bangunan_kondisi",))
        self.assertEqual(change.history[0].actor_id, OWNER.user_id)

    def test_one_section_cannot_edit_other_sections_or_ids(self):
        change = self.draft()
        for invalid in ["legalitas_status", "puskeswan_id", "sdm_id"]:
            with self.subTest(invalid=invalid), self.assertRaises(ContractError):
                patch_profile_change(
                    change, OWNER, {invalid: "X"}, expected_version=0, at=TIME
                )

    def test_unknown_section_is_rejected(self):
        for invalid in ["sdm", "apel", "password_hash", ""]:
            with self.subTest(section=invalid), self.assertRaises(ContractError):
                self.draft(invalid)

    def test_wrong_puskeswan_cannot_create_or_edit(self):
        with self.assertRaises(ProfileDenied):
            begin_profile_change("DEMO-CHANGE-100", SCOPE, "legalitas", OTHER)
        with self.assertRaises(ProfileDenied):
            patch_profile_change(
                self.draft(), OTHER, {"bangunan_kondisi": "rusak"},
                expected_version=0, at=TIME,
            )

    def test_leadership_has_no_individual_profile_access(self):
        with self.assertRaises(ProfileDenied):
            profile_section_summaries(
                self.master, self.bundle, SCOPE, LEADER, at=date(2026, 11, 10)
            )

    def test_invalid_territory_scope_is_not_accepted(self):
        fake_scope = ResourceScope("DEMO-PSW-001", "Kota Contoh")
        with self.assertRaises(ProfileDenied):
            profile_section_summaries(
                self.master, self.bundle, fake_scope, PROVINCE, at=date(2026, 11, 10)
            )

    def test_blank_huge_and_nontext_values_are_rejected(self):
        for invalid in ["", "   ", " x", "x" * 201, 123, True]:
            with self.subTest(value=str(invalid)[:10]), self.assertRaises(ContractError):
                patch_profile_change(
                    self.draft(), OWNER, {"bangunan_kondisi": invalid},
                    expected_version=0, at=TIME,
                )

    def test_none_means_explicit_clear_with_reason(self):
        with self.assertRaises(ContractError):
            patch_profile_change(
                self.draft(), OWNER, {"bangunan_kondisi": None},
                expected_version=0, at=TIME,
            )
        changed = patch_profile_change(
            self.draft(), OWNER, {"bangunan_kondisi": None},
            expected_version=0, at=TIME, reason="Data lama belum dapat dibuktikan",
        )
        self.assertEqual(changed.fields, (("bangunan_kondisi", None),))

    def test_stale_version_cannot_overwrite_latest(self):
        patch = self.patched()
        with self.assertRaises(VersionConflict):
            patch_profile_change(
                patch, OWNER, {"bangunan_kondisi": "rusak"},
                expected_version=0, at=TIME,
            )
        with self.assertRaises(VersionConflict):
            submit_profile_change(patch, OWNER, expected_version=True, at=TIME)

    def test_submission_without_edits_is_rejected(self):
        with self.assertRaises(ContractError):
            submit_profile_change(self.draft(), OWNER, expected_version=0, at=TIME)

    def test_submit_lock_prevents_editing(self):
        submitted = self.submitted()
        self.assertEqual(submitted.state, ChangeState.DIAJUKAN)
        with self.assertRaises(ContractError):
            patch_profile_change(
                submitted, OWNER, {"bangunan_kondisi": "rusak"},
                expected_version=submitted.version, at=TIME,
            )

    def test_other_region_cannot_review(self):
        submitted = self.submitted()
        with self.assertRaises(ProfileDenied):
            review_profile_change(
                submitted, OTHER_REVIEWER, ChangeState.DISETUJUI,
                expected_version=submitted.version, at=TIME,
            )

    def test_puskeswan_cannot_approve_own_form(self):
        submitted = self.submitted()
        with self.assertRaises(ProfileDenied):
            review_profile_change(
                submitted, OWNER, ChangeState.DISETUJUI,
                expected_version=submitted.version, at=TIME,
            )
        self.assertFalse(permitted(OWNER, Action.VERIFY_PROFILE, SCOPE))
        self.assertTrue(permitted(REVIEWER, Action.VERIFY_PROFILE, SCOPE))
        self.assertFalse(permitted(OTHER_REVIEWER, Action.VERIFY_PROFILE, SCOPE))

    def test_correction_requires_reason_then_can_resubmit(self):
        submitted = self.submitted()
        with self.assertRaises(ContractError):
            review_profile_change(
                submitted, REVIEWER, ChangeState.PERLU_PERBAIKAN,
                expected_version=submitted.version, at=TIME,
            )
        returned = review_profile_change(
            submitted, REVIEWER, ChangeState.PERLU_PERBAIKAN,
            expected_version=submitted.version, at=TIME, reason="Foto belum jelas",
        )
        amended = patch_profile_change(
            returned, OWNER, {"bangunan_kondisi": "perlu_perbaikan"},
            expected_version=returned.version, at=TIME,
        )
        new_submission = submit_profile_change(
            amended, OWNER, expected_version=amended.version, at=TIME
        )
        self.assertEqual(new_submission.state, ChangeState.DIAJUKAN)
        self.assertEqual(len(new_submission.history), 5)

    def test_rejection_is_final(self):
        submitted = self.submitted()
        rejected = review_profile_change(
            submitted, REVIEWER, ChangeState.DITOLAK,
            expected_version=submitted.version, at=TIME, reason="Tidak sesuai bukti",
        )
        with self.assertRaises(ContractError):
            submit_profile_change(rejected, OWNER, expected_version=rejected.version, at=TIME)

    def test_unapproved_change_does_not_modify_master(self):
        submitted = self.submitted("baik")
        with self.assertRaises(ContractError):
            apply_approved_profile_change(
                self.master, self.bundle, submitted, effective_on=date(2026, 11, 10)
            )
        self.assertEqual(
            facility_overview(
                self.master, self.bundle, SCOPE.puskeswan_id, "2026-11", "2026-11-10"
            ).profil_belum_terverifikasi.count("bangunan_kondisi"),
            1,
        )

    def test_approved_change_updates_only_target_field_and_keeps_history(self):
        approved = self.approved("baik")
        newer_master = apply_approved_profile_change(
            self.master, self.bundle, approved, effective_on=date(2026, 11, 10)
        )
        self.assertEqual(len(newer_master.profil), len(self.master.profil) + 1)
        self.assertEqual(len(self.master.profil), 4)
        self.assertEqual(newer_master.profil[-1].nilai, "baik")
        view = facility_overview(
            newer_master, self.bundle, SCOPE.puskeswan_id, "2026-11", "2026-11-10"
        )
        self.assertIn("bangunan_kondisi", view.profil_terverifikasi)
        self.assertEqual(approved.history[-1].action, "review")

    def test_double_apply_on_same_day_is_rejected(self):
        approved = self.approved()
        once = apply_approved_profile_change(
            self.master, self.bundle, approved, effective_on=date(2026, 11, 10)
        )
        with self.assertRaisesRegex(ContractError, "duplicated profile"):
            apply_approved_profile_change(
                once, self.bundle, approved, effective_on=date(2026, 11, 10)
            )

    def test_approval_cannot_be_backdated(self):
        with self.assertRaisesRegex(ContractError, "predate"):
            apply_approved_profile_change(
                self.master, self.bundle, self.approved(),
                effective_on=date(2026, 11, 9),
            )

    def test_audit_events_require_timezone(self):
        with self.assertRaisesRegex(ContractError, "timezone"):
            patch_profile_change(
                self.draft(), OWNER, {"bangunan_kondisi": "baik"},
                expected_version=0, at=datetime(2026, 11, 10, 7, 0),
            )

    def test_noop_patch_is_not_logged(self):
        patched = self.patched()
        with self.assertRaisesRegex(ContractError, "did not change"):
            patch_profile_change(
                patched, OWNER, {"bangunan_kondisi": "baik"},
                expected_version=patched.version, at=TIME,
            )

    def test_unknown_review_decision_is_rejected(self):
        submitted = self.submitted()
        with self.assertRaises(ContractError):
            review_profile_change(
                submitted, REVIEWER, ChangeState.DRAF,
                expected_version=submitted.version, at=TIME,
            )

    def test_provincial_verifier_can_review(self):
        submitted = self.submitted()
        reviewed = review_profile_change(
            submitted, PROVINCE, ChangeState.DISETUJUI,
            expected_version=submitted.version, at=TIME,
        )
        self.assertEqual(reviewed.state, ChangeState.DISETUJUI)


if __name__ == "__main__":
    unittest.main()
