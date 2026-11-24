"""K4-A3 | CODE_ONLY. Proposed synthetic profiling fields, not legacy field parity."""
from datetime import date
import re
from apel_payload import require, exact, match

VERSION="DEMO-PROFILE-2026-2030-V1"
SECTIONS=("legalitas","bangunan","peralatan","obat_bhp","wilayah_kerja","surveilans","kesmavet")
YEARS=range(2026,2031)
REF=re.compile(r"DEMO-[A-Z0-9_-]{1,40}")
DATE=re.compile(r"\d{4}-\d{2}-\d{2}")
CONDITIONS=("AVAILABLE_REPORTED","NEEDS_REVIEW","UNKNOWN")
DOC_TYPES=("ESTABLISHMENT_DEMO","OPERATING_REFERENCE_DEMO","OTHER_DEMO")
def calendar(v):
    require(match(DATE,v),"DATE_INVALID")
    try:return date.fromisoformat(v)
    except ValueError:require(False,"DATE_INVALID")
def normalize(section,raw,year):
    require(section in SECTIONS and type(year) is int and year in YEARS,"SECTION_OR_YEAR_INVALID")
    require(type(raw) is dict,"PAYLOAD_INVALID")
    if section=="legalitas":
        require(exact(raw,("observed_on","status","document_type","reference","issued_on","valid_until")),"LEGAL_SHAPE")
        status=raw["status"]
        require(status in ("REFERENCE_RECORDED_DEMO","NEEDS_REVIEW","UNKNOWN"),"LEGAL_STATUS")
        if status=="REFERENCE_RECORDED_DEMO":
            require(raw["document_type"] in DOC_TYPES and match(REF,raw["reference"]),"LEGAL_REFERENCE")
            issued=calendar(raw["issued_on"]);observed=calendar(raw["observed_on"])
            require(issued<=observed,"ISSUE_AFTER_OBSERVATION")
            if raw["valid_until"] is not None:require(calendar(raw["valid_until"])>=issued,"VALIDITY_ORDER")
        else:
            require(all(raw[k] is None for k in ("document_type","reference","issued_on","valid_until")),"UNVERIFIED_FIELDS")
    elif section=="wilayah_kerja":
        require(exact(raw,("observed_on","status","coverage_refs")),"AREA_SHAPE")
        require(raw["status"] in CONDITIONS,"AREA_STATUS")
        refs=raw["coverage_refs"]
        require(type(refs) is list and len(refs)<=100 and all(match(REF,x) for x in refs) and len(set(refs))==len(refs),"AREA_REFS")
        require(bool(refs) if raw["status"]=="AVAILABLE_REPORTED" else not refs,"AREA_STATUS_REFS")
    else:
        require(exact(raw,("observed_on","status")),"READINESS_SHAPE")
        require(raw["status"] in CONDITIONS,"READINESS_STATUS")
    require(calendar(raw["observed_on"]).year==year,"OBSERVATION_YEAR")
    return {k:list(v) if isinstance(v,list) else v for k,v in raw.items()}

def coverage(section_rows):
    # Missing, unknown and recorded review are separate; review is not official verification.
    return {"sections_total":len(SECTIONS),
            "sections_entered":sum(x["payload"] is not None for x in section_rows),
            "sections_reviewed_demo":sum(x["state"]=="RECORDED_DEMO" for x in section_rows),
            "sections_unknown":sum(x["payload"] is not None and x["payload"]["status"]=="UNKNOWN" for x in section_rows),
            "official_authorization":False}
