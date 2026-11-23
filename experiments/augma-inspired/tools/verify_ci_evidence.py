#!/usr/bin/env python3
"""Verify retained YANDIK+ LAB CI logs against an exact GitHub commit.

Offline standard-library verifier. It cannot prove runner trust or official
GIS data quality. It NEVER connects to GitHub or production.
"""
import argparse
import json
import re
import sys
from pathlib import Path

BRANCH = "refs/heads/lab/augma-inspired-experiments"
DATA_SCOPE = "SYNTHETIC_AND_OFFLINE_ONLY"
MIN_COUNTS = {"python": 66, "node": 31, "playwright": 19}
SHA = re.compile(r"[0-9a-fA-F]{40}")


class VerificationError(ValueError):
    pass


def checked_read(path, limit=2_500_000):
    path = Path(path)
    if path.is_symlink() or not path.is_file():
        raise VerificationError("Bukti tidak tersedia atau berupa symlink: " + str(path))
    if path.stat().st_size > limit:
        raise VerificationError("Bukti melebihi batas ukuran: " + str(path))
    return path.read_text(encoding="utf-8")


def parse_manifest(path, expected_sha, expected_kind, expected_run_id=None):
    if not isinstance(expected_sha, str) or not SHA.fullmatch(expected_sha):
        raise VerificationError("SHA commit pembanding harus 40 karakter heksadesimal")
    try:
        manifest = json.loads(checked_read(path, 65536))
    except (ValueError, UnicodeError) as exc:
        raise VerificationError("Manifest JSON tidak valid") from exc
    if not isinstance(manifest, dict):
        raise VerificationError("Manifest wajib objek")
    required = {
        "schema": "yandik.lab.ci-evidence.v1",
        "branch_ref": BRANCH,
        "commit_sha": expected_sha,
        "job_kind": expected_kind,
        "data_scope": DATA_SCOPE,
        "approval": "NOT_FOR_PRODUCTION",
        "job_result": "success",
    }
    for key, value in required.items():
        current = manifest.get(key)
        if key == "commit_sha" and isinstance(current, str):
            current = current.lower()
            value = value.lower()
        if current != value:
            raise VerificationError(f"Manifest {key} tidak sesuai")
    if not re.fullmatch(r"[1-9]\d*", str(manifest.get("run_id", ""))):
        raise VerificationError("GitHub run_id tidak valid")
    if expected_run_id is not None and str(manifest["run_id"]) != str(expected_run_id):
        raise VerificationError("GitHub run_id tidak cocok run yang diperiksa")
    if not re.fullmatch(r"[1-9]\d*", str(manifest.get("run_attempt", ""))):
        raise VerificationError("GitHub run_attempt tidak valid")
    return manifest


def check_python_log(log):
    numbers = re.findall(r"(?m)^Ran (\d+) tests? in [0-9.]+s\s*$", log)
    if len(numbers) != 1:
        raise VerificationError("Ringkasan unittest tidak tunggal atau hilang")
    count = int(numbers[0])
    if count < MIN_COUNTS["python"]:
        raise VerificationError("Jumlah tes Python kurang dari baseline")
    if not re.search(r"(?m)^OK\s*$", log):
        raise VerificationError("Unittest tidak menampilkan OK")
    if re.search(r"(?m)^(?:FAILED|ERROR:|FAIL:)", log):
        raise VerificationError("Terdapat kegagalan Python")
    return {"python_passed": count}


def check_node_log(log):
    def number(label):
        values = re.findall(r"(?m)^# " + re.escape(label) + r" (\d+)\s*$", log)
        if len(values) != 1:
            raise VerificationError("TAP Node " + label + " tidak tunggal")
        return int(values[0])
    tests, passed, failed = number("tests"), number("pass"), number("fail")
    if tests < MIN_COUNTS["node"] or passed != tests or failed:
        raise VerificationError("Unit test Node tidak lengkap/lulus")
    for label in ("skipped", "cancelled", "todo"):
        values = re.findall(r"(?m)^# " + label + r" (\d+)\s*$", log)
        if values and int(values[-1]) != 0:
            raise VerificationError("Terdapat unit test Node " + label)
    return {"node_passed": passed}


def check_browser_log(log):
    results = re.findall(r"(?m)^\s*(\d+)\s+passed\s+\([^)]+\)\s*$", log)
    if len(results) != 1:
        raise VerificationError("Ringkasan Playwright tidak tunggal atau hilang")
    count = int(results[0])
    if count < MIN_COUNTS["playwright"]:
        raise VerificationError("Tes Playwright kurang dari baseline")
    if re.search(r"(?m)^\s*\d+\s+(?:failed|skipped|flaky)\b", log):
        raise VerificationError("Terdapat tes Playwright gagal, terlewat, atau flaky")
    return {"playwright_passed": count}


def verify(manifest_path, sha, *, python_log=None, node_log=None, browser_log=None, expected_run_id=None):
    kind = "geometry-and-acquisition" if python_log is not None else "browser-smoke"
    if kind == "geometry-and-acquisition" and (node_log is not None or browser_log is not None):
        raise VerificationError("Pisahkan bukti Python dan browser")
    if kind == "browser-smoke" and (node_log is None or browser_log is None):
        raise VerificationError("Wajib sertakan Node dan Playwright log")
    manifest = parse_manifest(manifest_path, sha, kind, expected_run_id)
    counts = check_python_log(checked_read(python_log)) if python_log is not None else {
        **check_node_log(checked_read(node_log)),
        **check_browser_log(checked_read(browser_log))
    }
    return {
        "status": "PASS_OFFLINE_CI_LOG_CONTRACT",
        "commit_sha": manifest["commit_sha"],
        "run_id": manifest["run_id"],
        "job_kind": kind,
        "counts": counts,
        "data_scope": DATA_SCOPE,
        "production_approval": False,
        "note": "Log/manifest consistency only; not independent trust attestation.",
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--expected-sha", required=True)
    parser.add_argument("--expected-run-id", help="Require this GitHub Actions run ID")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--python-log", type=Path)
    group.add_argument("--node-log", type=Path)
    parser.add_argument("--playwright-log", type=Path)
    args = parser.parse_args(argv)
    try:
        output = verify(args.manifest, args.expected_sha,
                        python_log=args.python_log, node_log=args.node_log,
                        browser_log=args.playwright_log, expected_run_id=args.expected_run_id)
        print(json.dumps(output, indent=2, sort_keys=True))
        return 0
    except (VerificationError, OSError, UnicodeError) as exc:
        print(json.dumps({"status": "FAIL_CLOSED", "reason": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
