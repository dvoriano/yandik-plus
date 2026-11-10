"""Python stdlib tests, no Flask, DB, credentials or network."""
from __future__ import annotations

import unittest
from dataclasses import replace
from pathlib import Path

from foundation.yandik_base import (
    APELMonthly,
    ContractError,
    Puskeswan,
    SupportNeed,
    load_fixture_bundle,
    reporting_status,
    validate_bundle,
)

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"


class TestSyntheticDataContracts(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.bundle = load_fixture_bundle(FIXTURES)

    def test_demo_ids_are_synthetic(self) -> None:
        self.assertEqual(len(self.bundle.puskeswan), 3)
        self.assertTrue(
            all(p.puskeswan_id.startswith("DEMO-PSW-") for p in self.bundle.puskeswan)
        )
        self.assertTrue(
            all(n.need_id.startswith("DEMO-NEED-") for n in self.bundle.needs)
        )

    def test_missing_report_is_not_zero(self) -> None:
        reports = reporting_status(self.bundle, "2026-10")
        self.assertIsNone(reports["DEMO-PSW-003"])
        self.assertEqual(reports["DEMO-PSW-002"]["pemeriksaan"], 0)
        self.assertEqual(len([r for r in reports.values() if r is not None]), 2)

    def test_duplicate_monthly_entry_is_rejected(self) -> None:
        doubled = replace(
            self.bundle, reports=self.bundle.reports + (self.bundle.reports[0],)
        )
        with self.assertRaisesRegex(ContractError, "duplicate monthly report"):
            validate_bundle(doubled)

    def test_unknown_puskeswan_reference_is_rejected(self) -> None:
        report = replace(self.bundle.reports[0], puskeswan_id="DEMO-PSW-999")
        with self.assertRaisesRegex(ContractError, "unknown Puskeswan"):
            validate_bundle(replace(self.bundle, reports=(report,)))

    def test_negative_and_boolean_counts_are_rejected(self) -> None:
        base = {
            "puskeswan_id": "DEMO-PSW-001",
            "periode": "2026-10",
            "jumlah_layanan": {"pemeriksaan": -1},
        }
        with self.assertRaises(ContractError):
            APELMonthly.parse(base)
        base["jumlah_layanan"]["pemeriksaan"] = True
        with self.assertRaises(ContractError):
            APELMonthly.parse(base)

    def test_bad_month_and_noncanonical_month_are_rejected(self) -> None:
        for value in ("2026-13", "2026-1", "2026/01", "2026-00"):
            with self.subTest(value=value):
                with self.assertRaises(ContractError):
                    APELMonthly.parse({
                        "puskeswan_id": "DEMO-PSW-001",
                        "periode": value,
                        "jumlah_layanan": {"pemeriksaan": 0},
                    })

    def test_support_needs_require_positive_units(self) -> None:
        with self.assertRaises(ContractError):
            SupportNeed.parse({
                "need_id": "DEMO-NEED-007",
                "puskeswan_id": "DEMO-PSW-001",
                "kategori": "alat_klinik",
                "jumlah": 0,
                "status": "diajukan",
            })

    def test_invalid_identity_or_status_is_rejected(self) -> None:
        with self.assertRaises(ContractError):
            Puskeswan.parse({
                "puskeswan_id": "PSW 001",
                "nama": "Contoh",
                "kab_kota": "Contoh",
                "status": "aktif",
            })
        with self.assertRaises(ContractError):
            Puskeswan.parse({
                "puskeswan_id": "DEMO-PSW-999",
                "nama": "Contoh",
                "kab_kota": "Contoh",
                "status": "tidak diketahui",
            })

    def test_unknown_support_reference_is_rejected(self) -> None:
        ghost = replace(self.bundle.needs[0], puskeswan_id="DEMO-PSW-888")
        with self.assertRaisesRegex(ContractError, "unknown Puskeswan"):
            validate_bundle(replace(self.bundle, needs=(ghost,)))

    def test_reporting_status_rejects_bad_period(self) -> None:
        with self.assertRaises(ContractError):
            reporting_status(self.bundle, "April 2026")


if __name__ == "__main__":
    unittest.main()
