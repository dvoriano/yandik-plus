"""M00-G8 | KODE DITULIS BELUM DIUJI | CODE_ONLY | DEMO.
Python counterpart of bridge.mjs. Do NOT treat this as source hash
validation, authorization, production migration, or real data import.
"""
import hashlib
import json
import re

G8_SCHEMA="M00-G8-INTEROP-PREVIEW-UNTESTED-1"
G8_DOMAIN="YANDIK_DEMO_AUDIT_BRIDGE_V1"
ZERO="0"*64
K5={"audit_id","review_id","link_id","sequence","reviewer_id",
    "action_code","reason_code","basis_digest","previous_digest",
    "event_digest","official_authorization"}
K7={"event_id","link_id","revision","reviewer_id",
    "action_code","reason_code","basis_digest","previous_digest",
    "event_digest","is_official"}
LINK=re.compile(r"DEMO-CROSSWALK-[A-Z0-9_-]{1,28}\Z")
USER=re.compile(r"DEMO-USER-[A-Z0-9_-]{1,40}\Z")
HEX=re.compile(r"[a-f0-9]{64}\Z")
EVENT=re.compile(r"DEMO-AUDIT-[A-Z0-9_-]{1,32}\Z")
ACTIONS={"REQUEST_EVIDENCE_DEMO","POSSIBLY_RELATED_DEMO",
         "DISTINCT_RECORDS_DEMO","REOPEN_DEMO"}
REASONS={"IDENTIFIER_UNCLEAR_DEMO","LOCATION_UNCLEAR_DEMO",
         "PERIOD_UNCLEAR_DEMO","SOURCE_COMPARISON_DEMO",
         "MANUAL_ASSESSMENT_DEMO"}

class DemoFormatDenied(ValueError):
    pass

def deny():
    raise DemoFormatDenied("M00_G8_FORMAT_DENIED")

def exact(x,keys):
    return type(x) is dict and set(x)==keys

def matches(x,pattern):
    return type(x) is str and pattern.fullmatch(x) is not None

def canonical_demo_bridge_record(*,link_id,revision,reviewer_id,
                                 action_code,reason_code,basis_digest,
                                 previous_bridge_digest):
    if (not matches(link_id,LINK) or type(revision) is not int
        or not 1<=revision<=100 or not matches(reviewer_id,USER)
        or action_code not in ACTIONS or reason_code not in REASONS
        or not matches(basis_digest,HEX)
        or not matches(previous_bridge_digest,HEX)):
        deny()
    values=[G8_DOMAIN,link_id,revision,reviewer_id,action_code,
            reason_code,basis_digest,previous_bridge_digest,False]
    return json.dumps(values,ensure_ascii=True,separators=(",",":"))

def _source(kind,e,index,link):
    if kind not in {"G5_LEGACY_DEMO","G7_LEGACY_DEMO"}:
        deny()
    five=kind=="G5_LEGACY_DEMO"
    if (not exact(e,K5 if five else K7)
        or not matches(e["link_id"],LINK)
        or link is not None and link!=e["link_id"]
        or not matches(e["reviewer_id"],USER)
        or e["action_code"] not in ACTIONS
        or e["reason_code"] not in REASONS
        or not matches(e["basis_digest"],HEX)
        or not matches(e["previous_digest"],HEX)
        or not matches(e["event_digest"],HEX)):
        deny()
    if five:
        if (e["audit_id"]!="DEMO-AUDIT-"+str(index)
            or e["review_id"]!="DEMO-REVIEW-"+str(index)
            or type(e["sequence"]) is not int or e["sequence"]!=index
            or e["official_authorization"] is not False):
            deny()
    elif (not matches(e["event_id"],EVENT)
          or type(e["revision"]) is not int or e["revision"]!=index
          or type(e["is_official"]) is not int or e["is_official"]!=0):
        deny()
    return e["link_id"]

def normalize_legacy_demo_audit(*,source_kind,events):
    if (source_kind not in {"G5_LEGACY_DEMO","G7_LEGACY_DEMO"}
        or type(events) is not list or not 1<=len(events)<=100):
        deny()
    link=None
    previous=ZERO
    records=[]
    for i,e in enumerate(events,1):
        link=_source(source_kind,e,i,link)
        canonical=canonical_demo_bridge_record(
            link_id=link,revision=i,reviewer_id=e["reviewer_id"],
            action_code=e["action_code"],reason_code=e["reason_code"],
            basis_digest=e["basis_digest"],
            previous_bridge_digest=previous)
        previous=hashlib.sha256(canonical.encode("utf8")).hexdigest()
        records.append({"link_id":link,"revision_demo":i,
                        "bridge_digest":previous})
    return {
        "schema":G8_SCHEMA,"synthetic":True,
        "mode":"READ_ONLY_FORMAT_NORMALIZATION_DEMO",
        "source_kind":source_kind,"link_id":link,
        "record_count_demo":len(records),
        "records":records,"bridge_head_digest":previous,
        "original_source_digests_validated":False,
        "original_source_chain_validated":False,
        "original_source_revisions_authenticated":False,
        "cross_language_digest_is_official":False,
        "source_permission_verified":False,"identity_authenticated":False,
        "production_import_allowed":False,"migration_approved":False,
        "no_source_rewrite":True,"may_write":False,"may_sync":False,
        "may_approve":False,"may_publish":False,"may_deploy":False,
        "official_authorization":False
    }

def compare_demo_audit_ports(*,g5_events,g7_rows):
    g5=normalize_legacy_demo_audit(
        source_kind="G5_LEGACY_DEMO",events=g5_events)
    g7=normalize_legacy_demo_audit(
        source_kind="G7_LEGACY_DEMO",events=g7_rows)
    return {
        "schema":G8_SCHEMA,"synthetic":True,
        "format_only_parity_demo":(
            g5["link_id"]==g7["link_id"]
            and g5["record_count_demo"]==g7["record_count_demo"]
            and all(x["bridge_digest"]==y["bridge_digest"]
                    for x,y in zip(g5["records"],g7["records"]))
        ),
        "g5_record_count_demo":g5["record_count_demo"],
        "g7_record_count_demo":g7["record_count_demo"],
        "source_integrity_proven":False,
        "audit_immutability_proven":False,
        "evidence_of_same_authenticated_journal":False,
        "migration_safe":False,"may_write":False,
        "may_deploy":False,"official_authorization":False
    }
