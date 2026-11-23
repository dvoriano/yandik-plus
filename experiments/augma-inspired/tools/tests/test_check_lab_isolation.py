import tempfile
import unittest
from pathlib import Path
from sys import path as sys_path

sys_path.insert(0, str(Path(__file__).resolve().parents[1]))
from check_lab_isolation import (
    WORKFLOW, valid_change_path, validate_paths, validate_sources
)


class LabIsolationTests(unittest.TestCase):
    def test_allows_lab_tree_and_single_branch_workflow(self):
        self.assertTrue(valid_change_path("experiments/augma-inspired/prototypes/demo/app.mjs"))
        self.assertTrue(valid_change_path(WORKFLOW))
        self.assertEqual(validate_paths([
            "experiments/augma-inspired/prototypes/demo/index.html", WORKFLOW
        ]), [])

    def test_rejects_changes_to_real_application_and_other_workflows(self):
        bad = validate_paths([
            "app.py", "yandik-foundation/main.py",
            ".github/workflows/deploy.yml"
        ])
        self.assertEqual(len(bad), 3)

    def test_rejects_path_traversal_and_secrets(self):
        for p in [
            "experiments/augma-inspired/../app.py",
            "../secrets.env", "/etc/passwd",
            "experiments/augma-inspired/.env",
            "experiments/augma-inspired/credentials.json"
        ]:
            self.assertFalse(valid_change_path(p), p)

    def test_rejects_production_domain_in_runnable_source(self):
        with tempfile.TemporaryDirectory() as temp:
            lab = Path(temp) / "experiments/augma-inspired"
            lab.mkdir(parents=True)
            (lab / "demo.mjs").write_text('fetch("https://yandikvo.my.id/api");', encoding="utf-8")
            errors = validate_sources(Path(temp))
            self.assertTrue(any("domain produksi" in error for error in errors))

    def test_ignores_normal_license_markdown_and_accepts_local_source(self):
        with tempfile.TemporaryDirectory() as temp:
            lab = Path(temp) / "experiments/augma-inspired"
            lab.mkdir(parents=True)
            (lab / "README.md").write_text("https://yandikvo.my.id/", encoding="utf-8")
            (lab / "demo.mjs").write_text('fetch("./data/sumbar-outline.geojson");', encoding="utf-8")
            self.assertEqual(validate_sources(Path(temp)), [])


if __name__ == "__main__":
    unittest.main()
