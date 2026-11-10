"""Validate synthetic Puskeswan/APEL/Support/SDM data without production access."""
from pathlib import Path
from foundation.yandik_base import load_fixture_bundle, reporting_status
from foundation.yandik_base.masterdata import facility_overview, load_master_data

FIXTURES = Path(__file__).resolve().parent / "fixtures"


def main() -> None:
    bundle = load_fixture_bundle(FIXTURES)
    master = load_master_data(FIXTURES, bundle)
    period = "2026-10"
    status = reporting_status(bundle, period)
    reported = sum(v is not None for v in status.values())
    missing = sum(v is None for v in status.values())
    overview = facility_overview(master, bundle, "DEMO-PSW-001", period, "2026-10-31")
    print("VALID_DEMO_PUSKESWAN=", len(bundle.puskeswan), sep="")
    print("VALID_DEMO_APEL_REPORTS=", len(bundle.reports), sep="")
    print("VALID_DEMO_SUPPORT_NEEDS=", len(bundle.needs), sep="")
    print("VALID_DEMO_SDM=", len(master.sdm), sep="")
    print("VALID_DEMO_PLACEMENTS=", len(master.penempatan), sep="")
    print("VALID_DEMO_ASSET_OBSERVATIONS=", len(master.sarpras), sep="")
    print("VALID_DEMO_PROFILE_OBSERVATIONS=", len(master.profil), sep="")
    print("PERIOD_REPORTED=", reported, sep="")
    print("PERIOD_MISSING=", missing, sep="")
    print("DEMO_PUSKESWAN_NEEDS=", overview.kebutuhan_tercatat, sep="")
    print("SYNTHETIC_MASTER_AND_FIXTURES_PASS; NO_VPS_NO_DB_NO_DEPLOY")


if __name__ == "__main__":
    main()
