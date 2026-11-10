#!/usr/bin/env python3
"""Check YANDIK+ M00 offline source: stdlib only, no app imports, no VPS."""
from __future__ import annotations
import argparse
import ast
import csv
import hashlib
import re
from pathlib import Path

NEEDED = {
    "app.py", "core/config.py", "modules/auth/routes.py",
    "modules/apel/routes.py", "templates/login.html",
    "tests/test_source_syntax.py",
}
SOURCE_ROOTS = {
    ".env.example", ".gitignore", "README-OFFLINE-SNAPSHOT.md",
    "app.py", "core", "modules", "templates", "static", "tests",
}
RUNTIME_DIRS = {"data", "uploads", "backups", "backup"}
RUNTIME_FILES = {"ai_config.json", ".env", "id_rsa", "id_ed25519"}
RUNTIME_EXT = {".db", ".sqlite", ".sqlite3", ".pem", ".key", ".p12", ".pfx", ".sql"}
TEXT_EXT = {".py", ".html", ".js", ".css", ".svg", ".md", ".json", ".example"}
PATTERNS = [
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})"),
    re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b"),
    re.compile(r"\b\d{8,10}:[A-Za-z0-9_-]{30,}\b"),
    re.compile(r"(?i)(?:postgresql|postgres|mysql|mongodb|redis)://[^\s]+:[^@\s]+@"),
]

def inspect(root: Path, manifest: Path | None) -> list[str]:
    root = root.resolve(strict=True)
    errors: list[str] = []
    source_files: dict[str, Path] = {}
    for p in root.rglob("*"):
        rel = p.relative_to(root)
        name = rel.as_posix()
        if any(part in {".git", "__pycache__", ".venv", "node_modules"} for part in rel.parts):
            continue
        if p.is_symlink():
            errors.append(f"SYMLINK:{name}")
            continue
        if not p.is_file():
            continue
        if rel.parts[0] in RUNTIME_DIRS or rel.name in RUNTIME_FILES:
            errors.append(f"RUNTIME_FILE:{name}")
        if rel.parts[0] not in SOURCE_ROOTS:
            continue  # docs/ and scripts/ are documentation/tooling, not imported source
        if any(part in RUNTIME_DIRS for part in rel.parts):
            errors.append(f"RUNTIME_DIR:{name}")
        if rel.name.startswith(".env") and rel.name != ".env.example":
            errors.append(f"PRIVATE_ENV:{name}")
        if rel.suffix.lower() in RUNTIME_EXT:
            errors.append(f"RUNTIME_EXT:{name}")
        source_files[name] = p
        if p.stat().st_size > 15_000_000:
            errors.append(f"LARGE_FILE:{name}")
            continue
        if rel.suffix.lower() in TEXT_EXT:
            try:
                body = p.read_text(encoding="utf-8")
            except (UnicodeError, OSError):
                errors.append(f"NOT_UTF8:{name}")
                continue
            if any(pattern.search(body) for pattern in PATTERNS):
                errors.append(f"CREDENTIAL_PATTERN:{name}")
            if rel.suffix == ".py":
                try:
                    ast.parse(body, filename=name)
                except SyntaxError:
                    errors.append(f"SYNTAX:{name}")
    for key in sorted(NEEDED - source_files.keys()):
        errors.append(f"MISSING_REQUIRED:{key}")
    if manifest:
        try:
            with manifest.open(encoding="utf-8-sig", newline="") as f:
                rows = list(csv.DictReader(f))
            if not rows or set(rows[0]) != {"path", "size_bytes", "sha256"}:
                errors.append("MANIFEST_SCHEMA")
            else:
                for row in rows:
                    key = row["path"]
                    path = source_files.get(key)
                    if path is None:
                        errors.append(f"MISSING_MANIFEST_FILE:{key}")
                        continue
                    raw = path.read_bytes()
                    if len(raw) != int(row["size_bytes"]):
                        errors.append(f"SIZE_MISMATCH:{key}")
                    if hashlib.sha256(raw).hexdigest() != row["sha256"]:
                        errors.append(f"HASH_MISMATCH:{key}")
                print("MANIFEST_ENTRIES=", len(rows), sep="")
        except (OSError, ValueError, KeyError):
            errors.append("MANIFEST_UNREADABLE")
    print("SOURCE_FILES=", len(source_files), sep="")
    print("REQUIRED_PRESENT=", len(NEEDED.intersection(source_files)), "/", len(NEEDED), sep="")
    print("FINDINGS=", len(errors), sep="")
    for error in errors[:30]:
        print("REVIEW:", error)
    print("OFFLINE_ONLY_NO_VPS")
    return errors

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path)
    parser.add_argument("--manifest", type=Path, default=None)
    args = parser.parse_args()
    return 1 if inspect(args.root, args.manifest) else 0

if __name__ == "__main__":
    raise SystemExit(main())
