#!/usr/bin/env python3
"""Fail-closed Git branch/file isolation check for YANDIK+ Innovation Lab.

Default: compare against origin/main. No network calls, no git writes,
no production access. Intended for a temporary CI checkout only.
"""
import argparse
import subprocess
import sys
from pathlib import Path, PurePosixPath

ALLOWED_ROOT = "experiments/augma-inspired/"
WORKFLOW = ".github/workflows/yandik-innovation-lab-ci.yml"
# The only file outside lab allowed on the dedicated lab branch.
ALLOWED_EXTERNAL = frozenset({WORKFLOW})
RESTRICTED_FILENAMES = frozenset({".env", ".env.local", "id_rsa", "id_ed25519", "credentials.json", "secrets.json"})
RESTRICTED_DOMAINS = (
    "yandikvo.my.id", "api.indodax.com", "api.indodax.co.id",
    "api.telegram.org"
)
ALLOWLIST_EXTERNAL_IN_DOCS = frozenset({".md", ".txt"})
CHECK_EXTENSIONS = frozenset({".js", ".mjs", ".py", ".html", ".json", ".yaml", ".yml"})


def valid_change_path(name):
    if not isinstance(name, str) or not name or "\\" in name:
        return False
    p = PurePosixPath(name)
    if p.is_absolute() or any(part in (".", "..") for part in name.split("/")):
        return False
    if name == WORKFLOW:
        return True
    if not name.startswith(ALLOWED_ROOT):
        return False
    if p.name in RESTRICTED_FILENAMES or p.name.startswith(".env") or p.suffix in (".pem", ".key"):
        return False
    return True


def validate_paths(paths):
    bad = sorted(set(path for path in paths if not valid_change_path(path)))
    return bad


def validate_sources(repo_root):
    violations = []
    base = repo_root / ALLOWED_ROOT
    if not base.is_dir():
        return [f"Folder lab tidak ditemukan: {base}"]
    for file in base.rglob("*"):
        if file.is_symlink():
            violations.append(f"Symlink tidak diizinkan dalam lab: {file.relative_to(repo_root)}")
            continue
        if not file.is_file():
            continue
        # Inspect names before extension filtering: .env and .pem may have no
        # normal source extension and must still fail closed.
        if file.name in RESTRICTED_FILENAMES or file.name.startswith(".env") or file.suffix in (".pem", ".key"):
            violations.append(f"Nama file rahasia terlarang: {file.relative_to(repo_root)}")
            continue
        if file.suffix not in CHECK_EXTENSIONS:
            continue
        if file.suffix in ALLOWLIST_EXTERNAL_IN_DOCS:
            continue
        if file.stat().st_size > 1_500_000:
            violations.append(f"File source terlalu besar: {file.relative_to(repo_root)}")
            continue
        rel = file.relative_to(base).as_posix()
        # Negative test fixtures intentionally contain forbidden domains;
        # this policy file must define them by name as well.
        if rel.startswith("tools/tests/") or rel == "tools/check_lab_isolation.py" or "/tests/" in rel:
            continue
        content = file.read_text(encoding="utf-8", errors="replace").casefold()
        for domain in RESTRICTED_DOMAINS:
            if domain in content:
                violations.append(f"Referensi domain produksi dilarang di kode: {file.relative_to(repo_root)} / {domain}")
    return violations


def changed_paths(repo_root, base_ref):
    if not base_ref or base_ref.startswith("-") or any(ch.isspace() for ch in base_ref):
        raise ValueError("Base ref tidak valid")
    completed = subprocess.run(
        ["git", "diff", "--name-only", "-z", f"{base_ref}...HEAD"],
        cwd=repo_root, capture_output=True, check=True
    )
    return [part.decode("utf-8") for part in completed.stdout.split(b"\0") if part]


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[3])
    parser.add_argument("--base-ref", default="origin/main")
    args = parser.parse_args(argv)
    root = args.repo_root.resolve()
    try:
        modified = changed_paths(root, args.base_ref)
        bad = validate_paths(modified)
        bad.extend(validate_sources(root))
        if bad:
            print("LAB_ISOLATION_FAIL")
            for error in bad:
                print(" - " + error)
            return 1
        print("LAB_ISOLATION_PASS")
        print("Changed files:", len(modified))
        print("Allowed external workflow:", WORKFLOW)
        print("No restricted production domains in runnable lab source")
        return 0
    except (OSError, ValueError, subprocess.CalledProcessError) as exc:
        print("LAB_ISOLATION_FAIL_CLOSED:", str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
