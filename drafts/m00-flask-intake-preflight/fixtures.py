"""M00-G9 | Invented metadata only; no source file bytes or real routes."""
from copy import deepcopy

def demo_flask_intake_manifest():
    x = {
        "schema": "M00-G9-DECLARATION-UNTESTED-1",
        "synthetic": True,
        "origin": "INVENTED_OFFLINE_DECLARATION",
        "consent_status": "NOT_REQUESTED_DEMO",
        "content_inspected": False,
        "file_hashes_verified": False,
        "files": [
            {"path": "app.py", "kind": "CODE_PY", "sha256_claim": "a"*64,
             "size_bytes": 1200, "symlink": False,
             "classification_claim": "SYNTHETIC_PLACEHOLDER_ONLY"},
            {"path": "requirements.txt", "kind": "DEPENDENCY_DECLARATION",
             "sha256_claim": "b"*64, "size_bytes": 330, "symlink": False,
             "classification_claim": "SYNTHETIC_PLACEHOLDER_ONLY"},
            {"path": "core/auth.py", "kind": "CODE_PY",
             "sha256_claim": "c"*64, "size_bytes": 900, "symlink": False,
             "classification_claim": "SYNTHETIC_PLACEHOLDER_ONLY"},
            {"path": "modules/apel.py", "kind": "CODE_PY",
             "sha256_claim": "d"*64, "size_bytes": 3100, "symlink": False,
             "classification_claim": "SYNTHETIC_PLACEHOLDER_ONLY"},
        ],
        "routes": [
            {"route_id": "DEMO-ROUTE-APEL-READ", "method": "GET",
             "path": "/demo/apel", "owner_module": "modules",
             "auth_claim": "CLAIMED_UNVERIFIED_DEMO",
             "territory_claim": "NOT_REVIEWED_DEMO",
             "csrf_claim": "NOT_REVIEWED_DEMO"},
            {"route_id": "DEMO-ROUTE-APEL-SUBMIT", "method": "POST",
             "path": "/demo/apel/submit", "owner_module": "modules",
             "auth_claim": "CLAIMED_UNVERIFIED_DEMO",
             "territory_claim": "CLAIMED_UNVERIFIED_DEMO",
             "csrf_claim": "NOT_REVIEWED_DEMO"},
        ],
    }
    return deepcopy(x)
