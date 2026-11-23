"""Offline fail-closed validation of stored CI evidence. No GitHub API calls."""
import json
import tempfile
import unittest
from pathlib import Path
from sys import path as sys_path

sys_path.insert(0, str(Path(__file__).resolve().parents[1]))
from verify_ci_evidence import VerificationError, verify

SHA = "a" * 40
PY_OK = "test_ok (...) ... ok\n" + "-" * 70 + "\nRan 42 tests in 0.014s\n\nOK\n"
NODE_OK = "# tests 31\n# suites 4\n# pass 31\n# fail 0\n# cancelled 0\n# skipped 0\n# todo 0\n"
BROWSER_OK = "Running 19 tests using 1 worker\n  19 passed (9.8s)\n"


class CiEvidenceVerificationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.manifest = self.root / "manifest.json"
        self.python_log = self.root / "python-tests.log"
        self.node_log = self.root / "node-tests.log"
        self.browser_log = self.root / "playwright-tests.log"
        self.python_log.write_text(PY_OK, encoding="utf-8")
        self.node_log.write_text(NODE_OK, encoding="utf-8")
        self.browser_log.write_text(BROWSER_OK, encoding="utf-8")
        self.write_manifest("geometry-and-acquisition")

    def write_manifest(self, job_kind, **changes):
        data = {
            "schema": "yandik.lab.ci-evidence.v1",
            "branch_ref": "refs/heads/lab/augma-inspired-experiments",
            "commit_sha": SHA,
            "job_kind": job_kind,
            "data_scope": "SYNTHETIC_AND_OFFLINE_ONLY",
            "approval": "NOT_FOR_PRODUCTION",
            "job_result": "success",
            "run_id": "45112345678",
            "run_attempt": "1",
        }
        data.update(changes)
        self.manifest.write_text(json.dumps(data), encoding="utf-8")

    def test_python_logs_on_exact_commit_pass(self):
        result = verify(self.manifest, SHA, python_log=self.python_log)
        self.assertEqual(result["counts"]["python_passed"], 42)
        self.assertFalse(result["production_approval"])

    def test_node_and_browser_logs_pass_together(self):
        self.write_manifest("browser-smoke")
        result = verify(self.manifest, SHA,
                        node_log=self.node_log, browser_log=self.browser_log)
        self.assertEqual(result["counts"], {"node_passed": 31, "playwright_passed": 19})

    def test_sha_mismatch_fails(self):
        with self.assertRaisesRegex(VerificationError, "commit_sha"):
            verify(self.manifest, "b" * 40, python_log=self.python_log)

    def test_untrusted_or_failed_job_fails(self):
        for bad in (
            {"job_result": "failure"}, {"approval": "PRODUCTION_APPROVED"},
            {"branch_ref": "refs/heads/main"}, {"data_scope": "LIVE"}
        ):
            with self.subTest(bad=bad):
                self.write_manifest("geometry-and-acquisition", **bad)
                with self.assertRaises(VerificationError):
                    verify(self.manifest, SHA, python_log=self.python_log)

    def test_python_fewer_tests_or_failed_status_fails(self):
        for log in (
            PY_OK.replace("Ran 42", "Ran 41"),
            PY_OK.replace("\nOK\n", "\nFAILED (failures=1)\n")
        ):
            with self.subTest(log=log[-60:]):
                self.python_log.write_text(log, encoding="utf-8")
                with self.assertRaises(VerificationError):
                    verify(self.manifest, SHA, python_log=self.python_log)

    def test_missing_browser_log_fails(self):
        self.write_manifest("browser-smoke")
        with self.assertRaisesRegex(VerificationError, "Wajib"):
            verify(self.manifest, SHA, node_log=self.node_log)

    def test_skipped_node_or_fewer_browser_cases_fails(self):
        self.write_manifest("browser-smoke")
        self.node_log.write_text(NODE_OK.replace("# skipped 0", "# skipped 1"), encoding="utf-8")
        with self.assertRaisesRegex(VerificationError, "skipped"):
            verify(self.manifest, SHA, node_log=self.node_log, browser_log=self.browser_log)
        self.node_log.write_text(NODE_OK, encoding="utf-8")
        self.browser_log.write_text(BROWSER_OK.replace("19 passed", "18 passed"), encoding="utf-8")
        with self.assertRaisesRegex(VerificationError, "baseline"):
            verify(self.manifest, SHA, node_log=self.node_log, browser_log=self.browser_log)

    def test_requires_exact_run_id_when_supplied(self):
        with self.assertRaisesRegex(VerificationError, "tidak cocok run"):
            verify(self.manifest, SHA, python_log=self.python_log,
                   expected_run_id="45112345000")
        result = verify(self.manifest, SHA, python_log=self.python_log,
                        expected_run_id="45112345678")
        self.assertEqual(result["run_id"], "45112345678")

    def test_invalid_run_id_fails(self):
        self.write_manifest("geometry-and-acquisition", run_id="not-a-run")
        with self.assertRaisesRegex(VerificationError, "run_id"):
            verify(self.manifest, SHA, python_log=self.python_log)

    def test_symlinked_evidence_fails(self):
        alternate = self.root / "alternate.log"
        alternate.write_text(PY_OK, encoding="utf-8")
        self.python_log.unlink()
        self.python_log.symlink_to(alternate)
        with self.assertRaisesRegex(VerificationError, "symlink"):
            verify(self.manifest, SHA, python_log=self.python_log)


if __name__ == "__main__":
    unittest.main()
