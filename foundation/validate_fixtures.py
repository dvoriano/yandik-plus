"""Run demo-data checks without dependencies, network or production access."""
from pathlib import Path

from foundation.yandik_base import load_fixture_bundle, reporting_status

FIXTURES = Path(__file__).resolve().parent / "fixtures"


def main() -> None:
    bundle = load_fixture_bundle(FIXTURES)
    period = "2026-10"
    status = reporting_status(bundle, period)
    reported = sum(item is not None for item in status.values())
    empty = sum(item is None for item in status.values())
    print(f"VALID_DEMO_PUSKESWAN={len(bundle.puskeswan)}")
    print(f"VALID_DEMO_APEL_REPORTS={len(bundle.reports)}")
    print(f"VALID_DEMO_SUPPORT_NEEDS={len(bundle.needs)}")
    print(f"PERIOD_{period}_REPORTED={reported}")
    print(f"PERIOD_{period}_NOT_REPORTED={empty}")
    print("SYNTHETIC_FIXTURES_PASS; NO_VPS_NO_DB_NO_DEPLOY")


if __name__ == "__main__":
    main()
