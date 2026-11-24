"""CODE_ONLY | SDM date, command and coverage contract. No I/O."""
import re
from datetime import date
from apel_payload import require, exact, match
from apel_store import CMD
STAFF=re.compile(r"DEMO-SDM-[A-Z0-9_-]{1,24}")
FAC=re.compile(r"DEMO-PSW-[A-Z0-9_-]{1,24}")
TOPICS=("PENCATATAN_APEL_DEMO","PELAYANAN_KLINIK_DEMO","SURVEILANS_DEMO","KESMAVET_DEMO")
KINDS=("dokter_hewan","paramedik")
ACTIONS=("register","assign","transfer","end_assignment","record_competency")
def day(v):
    require(isinstance(v,str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}",v) is not None,"DATE_INVALID")
    try:d=date.fromisoformat(v)
    except ValueError:require(False,"DATE_INVALID")
    require(2026<=d.year<=2030,"YEAR_INVALID")
    return v
def intent(x):
    require(exact(x,("command_id","staff_id","expected_revision","action","payload")) and match(CMD,x["command_id"]) and match(STAFF,x["staff_id"]) and type(x["expected_revision"]) is int and 0<=x["expected_revision"]<10000 and x["action"] in ACTIONS,"INTENT_INVALID")
    p=x["payload"];a=x["action"]
    if a=="register":
        require(exact(p,("kind",)) and p["kind"] in KINDS,"KIND_INVALID")
    elif a in ("assign","transfer"):
        require(exact(p,("facility_id","effective_on")) and match(FAC,p["facility_id"]),"DESTINATION_INVALID");day(p["effective_on"])
    elif a=="end_assignment":
        require(exact(p,("effective_on",)),"PAYLOAD_INVALID");day(p["effective_on"])
    else:
        require(exact(p,("facility_id","observed_on","topic")) and match(FAC,p["facility_id"]) and p["topic"] in TOPICS,"COMPETENCY_INVALID");day(p["observed_on"])
    return x
def active(p,at):
    return p["start_date"]<=at and (p["end_exclusive"] is None or at<p["end_exclusive"])
def projection(completeness,rows,year):
    require(completeness in (None,"COMPLETE_DEMO","PARTIAL_DEMO"),"COVERAGE_INVALID")
    return {"status":completeness or "SOURCE_UNAVAILABLE","as_of":f"{year}-12-31",
            "doctors":sum(r["kind"]=="dokter_hewan" for r in rows) if completeness=="COMPLETE_DEMO" else None,
            "paramedics":sum(r["kind"]=="paramedik" for r in rows) if completeness=="COMPLETE_DEMO" else None,
            "observed_staff_partial":len(rows) if completeness=="PARTIAL_DEMO" else None,
            "official_authorization":False}
