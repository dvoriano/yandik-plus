"""Test joined Puskeswan master, dated SDM placement, sarpras and profile."""
from __future__ import annotations
import unittest
from dataclasses import replace
from datetime import date
from pathlib import Path

from foundation.yandik_base import ContractError, load_fixture_bundle
from foundation.yandik_base.masterdata import (
    AssetObservation, Placement, ProfileDatum, Staff, facility_overview,
    load_master_data, validate_master,
)

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"


class MasterDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_fixture_bundle(FIXTURES)
        cls.master = load_master_data(FIXTURES, cls.bundle)

    def view(self, facility="DEMO-PSW-001", period="2026-10", at="2026-10-31"):
        return facility_overview(self.master, self.bundle, facility, period, at)

    def test_demo_relationships_and_history(self):
        self.assertEqual(len(self.master.sdm), 4)
        self.assertEqual(len(self.master.penempatan), 4)
        self.assertEqual(len(self.master.sarpras), 3)
        self.assertEqual(len(self.master.profil), 4)

    def test_staff_history_moves_between_puskeswan(self):
        before = self.view(period="2026-05", at="2026-05-31")
        after = self.view()
        destination = self.view("DEMO-PSW-002")
        self.assertEqual(before.sdm_tercatat["dokter_hewan"], 1)
        self.assertEqual(after.sdm_tercatat["dokter_hewan"], 0)
        self.assertEqual(destination.sdm_tercatat["dokter_hewan"], 1)

    def test_unreported_month_is_not_reported_zero(self):
        missing = self.view("DEMO-PSW-003")
        zero = self.view("DEMO-PSW-002")
        self.assertIsNone(missing.pelayanan_bulanan)
        self.assertFalse(missing.sudah_melapor)
        self.assertTrue(zero.sudah_melapor)
        self.assertEqual(zero.pelayanan_bulanan["pemeriksaan"], 0)

    def test_support_needs_share_master_id(self):
        self.assertEqual(self.view().kebutuhan_tercatat, 1)
        self.assertEqual(self.view("DEMO-PSW-002").kebutuhan_tercatat, 0)

    def test_latest_asset_observation_wins(self):
        early = self.view(period="2026-06", at="2026-06-30")
        late = self.view()
        self.assertEqual(early.sarpras_tercatat, 1)
        self.assertEqual(early.sarpras_butuh_perhatian, 0)
        self.assertEqual(late.sarpras_tercatat, 1)
        self.assertEqual(late.sarpras_butuh_perhatian, 1)

    def test_missing_asset_record_is_not_confirmed_empty_inventory(self):
        missing = self.view("DEMO-PSW-003")
        self.assertEqual(missing.sarpras_tercatat, 0)
        self.assertEqual(missing.profil_terverifikasi, ("wilayah_kerja_keterangan",))

    def test_only_verified_profile_fields_are_counted(self):
        current = self.view()
        self.assertIn("legalitas_status", current.profil_terverifikasi)
        self.assertIn("bangunan_kondisi", current.profil_belum_terverifikasi)

    def test_duplicate_staff_identifier_rejected(self):
        bad = replace(self.master, sdm=self.master.sdm + (self.master.sdm[0],))
        with self.assertRaisesRegex(ContractError, "duplicated SDM"):
            validate_master(bad, self.bundle)

    def test_overlapping_placement_rejected(self):
        bad_link = replace(
            self.master.penempatan[0],
            placement_id="DEMO-PLACE-999",
            puskeswan_id="DEMO-PSW-003",
            selesai=date(2026, 12, 31),
        )
        bad = replace(self.master, penempatan=self.master.penempatan + (bad_link,))
        with self.assertRaisesRegex(ContractError, "overlapping"):
            validate_master(bad, self.bundle)

    def test_unknown_facility_rejected(self):
        bad = replace(self.master, sarpras=(
            replace(self.master.sarpras[0], puskeswan_id="DEMO-PSW-999"),
        ))
        with self.assertRaisesRegex(ContractError, "unknown Puskeswan"):
            validate_master(bad, self.bundle)

    def test_unknown_staff_rejected(self):
        bad = replace(self.master, penempatan=(
            replace(self.master.penempatan[0], sdm_id="DEMO-SDM-999"),
        ))
        with self.assertRaisesRegex(ContractError, "unknown SDM"):
            validate_master(bad, self.bundle)

    def test_asset_identity_cannot_jump_puskeswan(self):
        changed = replace(self.master.sarpras[1], puskeswan_id="DEMO-PSW-003")
        bad = replace(self.master, sarpras=(self.master.sarpras[0], changed))
        with self.assertRaisesRegex(ContractError, "identity changed"):
            validate_master(bad, self.bundle)

    def test_duplicate_profile_snapshot_rejected(self):
        bad = replace(self.master, profil=self.master.profil + (self.master.profil[0],))
        with self.assertRaisesRegex(ContractError, "duplicated profile"):
            validate_master(bad, self.bundle)

    def test_invalid_dates_rejected(self):
        for start, end in [("2026-02-30", None), ("2026-11-01", "2026-10-31")]:
            with self.subTest(start=start, end=end), self.assertRaises(ContractError):
                Placement.parse({
                    "placement_id": "DEMO-PLACE-123",
                    "sdm_id": "DEMO-SDM-001",
                    "puskeswan_id": "DEMO-PSW-001",
                    "mulai": start, "selesai": end,
                })

    def test_invalid_active_flag_and_asset_condition_rejected(self):
        with self.assertRaises(ContractError):
            Staff.parse({"sdm_id": "DEMO-SDM-009", "jenis": "dokter_hewan", "aktif": 1})
        with self.assertRaises(ContractError):
            AssetObservation.parse({
                "asset_id": "DEMO-ASSET-098", "puskeswan_id": "DEMO-PSW-001",
                "kategori": "alat_klinik", "kondisi": "tidak_valid",
                "observed_on": "2026-11-10", "sumber": "profiling",
                "terverifikasi": True,
            })

    def test_unapproved_profile_field_rejected(self):
        with self.assertRaises(ContractError):
            ProfileDatum.parse({
                "puskeswan_id": "DEMO-PSW-001", "bidang": "nomor_pribadi",
                "nilai": "dummy", "observed_on": "2026-11-10",
                "sumber": "profiling", "terverifikasi": True,
            })

    def test_future_month_and_unknown_facility_rejected(self):
        with self.assertRaises(ContractError):
            self.view(period="2026-11", at="2026-10-31")
        with self.assertRaises(ContractError):
            self.view("DEMO-PSW-999")

    def test_future_profile_observation_not_seen_early(self):
        early = self.view("DEMO-PSW-003", "2026-08", "2026-08-31")
        late = self.view("DEMO-PSW-003")
        self.assertEqual(early.profil_terverifikasi, ())
        self.assertEqual(late.profil_terverifikasi, ("wilayah_kerja_keterangan",))


if __name__ == "__main__":
    unittest.main()
