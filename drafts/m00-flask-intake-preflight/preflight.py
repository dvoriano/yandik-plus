"""M00-G9 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | METADATA ONLY.

Fail-closed *synthetic declaration* preflight for future authorized Flask
source intake. Does not read files, follow symlinks, inspect actual code,
contact a server, grant permissions or validate origin/content signatures.
The manifest is caller-supplied and therefore NOT trusted evidence.
"""
import re
from collections import Counter

M00_G9_SCHEMA = "M00-G9-METADATA-INTAKE-UNTESTED-1"
M00_G9_MANIFEST_SCHEMA = "M00-G9-DECLARATION-UNTESTED-1"
FILE_FIELDS = {"path", "kind", "sha256_claim", "size_bytes", "symlink",
               "classification_claim"}
ROUTE_FIELDS = {"route_id", "method", "path", "owner_module",
                "auth_claim", "territory_claim", "csrf_claim"}
MANIFEST_FIELDS = {"schema", "synthetic", "origin", "consent_status",
                   "content_inspected", "file_hashes_verified",
                   "files", "routes"}
FILE_PATH = re.compile(
    r"[a-z0-9_]+(?:/[a-z0-9_]+)*\.(?:py|md|txt|toml|lock)\Z"
)
ROUTE_ID = re.compile(r"DEMO-ROUTE-[A-Z0-9_-]{1,36}\Z")
ROUTE_PATH = re.compile(r"/demo(?:/[a-z0-9_]+){1,4}\Z")
MODULE = re.compile(r"[a-z][a-z0-9_]{0,35}\Z")
HEX = re.compile(r"[a-f0-9]{64}\Z")
KINDS = {"CODE_PY", "DEPENDENCY_DECLARATION", "DOCUMENTATION"}
FLAGS = {"NOT_REVIEWED_DEMO", "CLAIMED_UNVERIFIED_DEMO"}
METHODS = {"GET", "POST", "PUT", "PATCH", "DELETE"}
MAX_FILES, MAX_ROUTES, MAX_SIZE = 100, 50, 2_000_000

class IntakeDenied(ValueError):
    pass

def _deny(code):
    raise IntakeDenied("M00_G9_" + code)

def _exact(obj, keys):
    return type(obj) is dict and set(obj) == keys

def _match(s, pattern):
    return type(s) is str and pattern.fullmatch(s) is not None

def _validate_file(item):
    if not _exact(item, FILE_FIELDS):
        _deny("FILE_SHAPE_INVALID")
    name = item["path"]
    if not _match(name, FILE_PATH) or len(name) > 150:
        _deny("FILE_PATH_DENIED")
    if name in {"requirements.txt", "pyproject.toml"}:
        kind = "DEPENDENCY_DECLARATION"
    elif name.endswith(".py"):
        kind = "CODE_PY"
    elif name.endswith((".md", ".txt")):
        kind = "DOCUMENTATION"
    else:
        kind = "DEPENDENCY_DECLARATION"
    if item["kind"] != kind or kind not in KINDS:
        _deny("FILE_KIND_MISMATCH")
    if (not _match(item["sha256_claim"], HEX)
        or type(item["size_bytes"]) is not int
        or not 1 <= item["size_bytes"] <= MAX_SIZE
        or item["symlink"] is not False
        or item["classification_claim"] != "SYNTHETIC_PLACEHOLDER_ONLY"):
        _deny("FILE_METADATA_DENIED")
    # The path grammar forbids dotfiles, .., separators, control characters,
    # unicode homoglyphs, absolute paths, and command flags.
    # But it is NOT a substitute for checking actual bytes or filesystem.
    return name

def _validate_route(item):
    if not _exact(item, ROUTE_FIELDS):
        _deny("ROUTE_SHAPE_INVALID")
    if (not _match(item["route_id"], ROUTE_ID)
        or item["method"] not in METHODS
        or not _match(item["path"], ROUTE_PATH)
        or not _match(item["owner_module"], MODULE)
        or any(item[k] not in FLAGS
               for k in ("auth_claim", "territory_claim", "csrf_claim"))):
        _deny("ROUTE_INVALID")
    return (item["method"], item["path"])

def assess_demo_flask_intake(manifest):
    """Inspects ONLY metadata supplied as a Python object. NEVER scans files."""
    if not _exact(manifest, MANIFEST_FIELDS):
        _deny("MANIFEST_SHAPE_INVALID")
    if (manifest["schema"] != M00_G9_MANIFEST_SCHEMA
        or manifest["synthetic"] is not True
        or manifest["origin"] != "INVENTED_OFFLINE_DECLARATION"
        or manifest["consent_status"] != "NOT_REQUESTED_DEMO"
        or manifest["content_inspected"] is not False
        or manifest["file_hashes_verified"] is not False):
        _deny("MANIFEST_TRUST_CLAIM_DENIED")
    files = manifest["files"]
    routes = manifest["routes"]
    if (type(files) is not list or not 1 <= len(files) <= MAX_FILES
        or type(routes) is not list or len(routes) > MAX_ROUTES):
        _deny("MANIFEST_VOLUME_INVALID")
    file_names = [_validate_file(item) for item in files]
    if len(file_names) != len(set(file_names)):
        _deny("FILE_DUPLICATE")
    file_kinds = Counter(item["kind"] for item in files)
    keys = [_validate_route(item) for item in routes]
    if len(keys) != len(set(keys)):
        _deny("ROUTE_DUPLICATE")
    ids = [item["route_id"] for item in routes]
    if len(ids) != len(set(ids)):
        _deny("ROUTE_ID_DUPLICATE")
    for item in routes:
        if item["owner_module"] not in {
            name.split("/", 1)[0] for name in file_names if "/" in name
        }:
            _deny("ROUTE_MODULE_NOT_DECLARED")
    non_get = sum(item["method"] != "GET" for item in routes)
    auth_claims = sum(item["auth_claim"] == "CLAIMED_UNVERIFIED_DEMO"
                      for item in routes)
    territory_claims = sum(
        item["territory_claim"] == "CLAIMED_UNVERIFIED_DEMO"
        for item in routes
    )
    csrf_claims = sum(item["csrf_claim"] == "CLAIMED_UNVERIFIED_DEMO"
                      for item in routes if item["method"] != "GET")
    has_entrypoint = "app.py" in file_names or "core/app.py" in file_names
    has_dependencies = bool(set(file_names) &
                            {"requirements.txt", "pyproject.toml"})
    blockers = [
        "OWNER_AUTHORIZATION_NOT_REQUESTED",
        "SOURCE_BYTES_NOT_PRESENT_OR_INSPECTED",
        "CONTENT_HASHES_NOT_VERIFIED",
        "FILE_SANITIZATION_NOT_VERIFIED",
        "ROUTE_DISCOVERY_NOT_VERIFIED",
        "AUTHENTICATION_NOT_VERIFIED",
        "TERRITORIAL_ACCESS_NOT_VERIFIED",
        "NO_REAL_SOURCE_IMPORT_ALLOWED",
    ]
    if not has_entrypoint:
        blockers.append("FLASK_ENTRYPOINT_NOT_DECLARED")
    if not has_dependencies:
        blockers.append("DEPENDENCY_INVENTORY_MISSING")
    if non_get:
        blockers.append("MUTATING_ROUTES_REQUIRE_CSRF_AND_AUTH_REVIEW")
    return {
        "schema": M00_G9_SCHEMA,
        "synthetic": True,
        "mode": "DECLARED_METADATA_PREFLIGHT_ONLY",
        "file_count_declared_demo": len(files),
        "code_file_count_declared_demo": file_kinds["CODE_PY"],
        "route_count_declared_demo": len(routes),
        "mutating_route_count_declared_demo": non_get,
        "route_auth_claims_unverified_demo": auth_claims,
        "route_territory_claims_unverified_demo": territory_claims,
        "mutating_csrf_claims_unverified_demo": csrf_claims,
        "entrypoint_declared_demo": has_entrypoint,
        "dependencies_declared_demo": has_dependencies,
        "blockers": blockers,
        "source_files_opened": False,
        "source_bytes_obtained": False,
        "paths_and_routes_authenticated": False,
        "static_analysis_performed": False,
        "content_scanned_for_secrets": False,
        "independent_review_performed": False,
        "source_owner_authorized": False,
        "credentials_checked": False,
        "flask_routes_registered": False,
        "migration_allowed": False,
        "ready_for_import": False,
        "ready_for_staging": False,
        "ready_for_production": False,
        "may_connect": False,
        "may_execute": False,
        "may_write": False,
        "may_publish": False,
        "may_deploy": False,
        "official_authorization": False,
    }
