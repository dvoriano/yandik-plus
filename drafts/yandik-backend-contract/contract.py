"""Planning contract only. No HTTP, DB connection, login or actual permission.

The host supplies synthetic session and record metadata. This is not authentication.
All outcomes keep may_execute=False. Existing domain validators are still required.
"""
from dataclasses import dataclass
from datetime import date, timedelta
import re

FACILITY = re.compile(r"DEMO-PSW-[A-Z0-9_-]{1,40}")
REGION = re.compile(r"DEMO-REGION-[A-Z0-9_-]{1,40}")
ACTOR = re.compile(r"DEMO-ACTOR-[A-Z0-9_-]{1,40}")
FACILITY_RESOURCES = frozenset({"profiles", "inventory", "apel", "personnel", "coaching", "documents"})
REGIONAL_RESOURCES = frozenset({"medicine", "practice", "surveillance", "certificates"})
ROLES = frozenset({"puskeswan", "kab_kota", "provinsi_verifikator", "provinsi_admin", "pimpinan"})
ACTIONS = {"save_draft", "submit", "return_correction", "record_review"}
TRANSITIONS = {
    ("DRAFT", "save_draft"): "DRAFT",
    ("DRAFT", "submit"): "SUBMITTED",
    ("CORRECTION", "save_draft"): "DRAFT",
    ("SUBMITTED", "return_correction"): "CORRECTION",
    ("SUBMITTED", "record_review"): "RECORDED_DEMO",
}
def matches(pattern, value):
    return isinstance(value, str) and pattern.fullmatch(value) is not None

@dataclass(frozen=True)
class Session:
    actor_id: str
    role: str
    region_id: str | None = None
    facility_id: str | None = None
    active: bool = False
    synthetic: bool = True

@dataclass(frozen=True)
class Record:
    record_id: str
    resource: str
    region_id: str
    facility_id: str | None
    owner_id: str
    state: str
    revision: int
    synthetic: bool = True

def _session_ok(s):
    if not isinstance(s, Session) or s.active is not True or s.synthetic is not True or not matches(ACTOR,s.actor_id) or s.role not in ROLES:
        return False
    if s.role == "puskeswan":
        return matches(FACILITY,s.facility_id) and matches(REGION,s.region_id)
    if s.role == "kab_kota":
        return s.facility_id is None and matches(REGION,s.region_id)
    return s.facility_id is None and s.region_id is None

def _record_ok(r):
    return (isinstance(r, Record) and r.synthetic is True
            and matches(re.compile(r"DEMO-REC-[A-Z0-9_-]{1,60}"), r.record_id)
            and matches(REGION,r.region_id) and matches(ACTOR,r.owner_id)
            and type(r.revision) is int and r.revision >= 0
            and ((r.resource in FACILITY_RESOURCES and matches(FACILITY,r.facility_id))
                 or (r.resource in REGIONAL_RESOURCES and r.facility_id is None)))

def plan_access(session, record, action, expected_revision=None):
    def out(reason, candidate=False, next_state=None):
        return {"candidate":candidate,"reason":reason,"next_state":next_state,
                "may_execute":False,"official_authorization":False}
    if not _session_ok(session) or not _record_ok(record):
        return out("INVALID_CONTEXT")
    s,r=session,record
    if s.role=="pimpinan":
        return out("AGGREGATE_ONLY")
    if s.role in {"puskeswan","kab_kota"} and s.region_id!=r.region_id:
        return out("SCOPE_DENIED")
    if s.role=="puskeswan" and (r.resource in REGIONAL_RESOURCES or s.facility_id!=r.facility_id):
        return out("SCOPE_DENIED")
    if action=="read":
        return out("READ_CANDIDATE",True)
    if action not in ACTIONS or r.resource in REGIONAL_RESOURCES:
        return out("ACTION_DENIED")
    if type(expected_revision) is not int or expected_revision!=r.revision:
        return out("REVISION_CONFLICT")
    if action in {"save_draft","submit"}:
        if s.role!="puskeswan" or s.actor_id!=r.owner_id:
            return out("WRITER_DENIED")
    else:
        if s.role!="provinsi_verifikator" or s.actor_id==r.owner_id:
            return out("REVIEWER_DENIED")
    next_state=TRANSITIONS.get((r.state,action))
    if not next_state:
        return out("TRANSITION_DENIED")
    return out("DOMAIN_VALIDATION_REQUIRED",True,next_state)

def exclusive_end(legacy_inclusive):
    """Only for confirmed inclusive legacy end date. Caller must retain original value."""
    if legacy_inclusive is None:
        return None
    if not isinstance(legacy_inclusive,str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}",legacy_inclusive):
        raise ValueError("INVALID_DATE")
    return (date.fromisoformat(legacy_inclusive)+timedelta(days=1)).isoformat()

def reconciled_identity(source_namespace, external_id, mappings):
    """Never equate matching names or IDs across namespaces. Only candidate results."""
    found=[m for m in mappings if m["namespace"]==source_namespace and m["external_id"]==external_id]
    return {"candidate_ids":sorted({m["facility_id"] for m in found}),
            "resolved_id":None,"may_merge":False}
