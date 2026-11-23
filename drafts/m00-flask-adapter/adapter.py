"""M00-G6 | CODE_ONLY | KODE DITULIS BELUM DIUJI | DEMO ONLY.
Never mount on production. Flask is imported lazily on blueprint creation.
No real server authentication, source data, or API endpoints are connected.
"""
import re

M00_G6_SCHEMA="M00-G6-FLASK-ADAPTER-UNTESTED-1"
DEMO_FLAG="YANDIK_M00_G6_DEMO_ROUTES_ENABLED"
REG=re.compile(r"Wilayah DEMO [A-Za-z]{2,25}\Z")
ID=re.compile(r"DEMO-EVENT-[A-Z0-9_-]{1,24}\Z")
USR=re.compile(r"DEMO-USER-[A-Z0-9_-]{1,40}\Z")
LOC=re.compile(r"DEMO-LOCATION-[A-Z0-9_-]{1,28}\Z")
SRC=re.compile(r"DEMO-SOURCE-[A-Z0-9_-]{1,32}\Z")
SNP=re.compile(r"DEMO-SNAPSHOT-[A-Z0-9_-]{1,32}\Z")
MONTH=re.compile(r"(?:202[6-9]|2030)-(?:0[1-9]|1[0-2])\Z")
SYN={"DEMO-SYNDROME-GENERAL","DEMO-SYNDROME-NEUROLOGIC",
     "DEMO-SYNDROME-RESPIRATORY"}
REP={"SUSPECTED_UNVERIFIED_DEMO","FIELD_OBSERVATION_UNVERIFIED_DEMO"}
INV={"NOT_STARTED_DEMO","FIELD_NOTES_RECORDED_UNVERIFIED_DEMO"}
SAM={"NOT_LOGGED_DEMO","SAMPLE_LOGGED_UNVERIFIED_DEMO",
     "RESULT_PENDING_UNVERIFIED_DEMO","RESULT_NOTES_RECORDED_UNVERIFIED_DEMO"}
FOL={"NOT_RECORDED_DEMO","DRAFT_REVIEW_ONLY"}
MKEY={"schema","source_id","snapshot_id","domain","region_label",
      "capture_month","revision","origin","synthetic","source_verified",
      "official_authorization"}
EKEY={"event_id","location_ref","region_label","period","syndrome_tag",
      "report_class","investigation_state","sample_state","followup_state",
      "evidence_ref_count_demo","source_id","snapshot_id",
      "official_case_reference","official_lab_reference"}

class DemoAccessDenied(Exception): pass
class DemoSourceRejected(Exception): pass
def is_id(value,pattern):
    return isinstance(value,str) and pattern.fullmatch(value) is not None
def exact(value,keys):
    return type(value) is dict and set(value)==keys

def demo_projection(*,session,payload,event_id=None):
    """Minimal synthetic read projection, NOT authentication of a real user."""
    if not exact(payload,{"region_label","manifest","events"}):
        raise DemoSourceRejected("BAD_SOURCE")
    region=payload["region_label"]
    m=payload["manifest"]
    if not is_id(region,REG) or not exact(m,MKEY):
        raise DemoSourceRejected("BAD_MANIFEST")
    if (m["schema"]!="M00-G2-SOURCE-MANIFEST-UNTESTED-1"
        or not is_id(m["source_id"],SRC)
        or not is_id(m["snapshot_id"],SNP)
        or not is_id(m["capture_month"],MONTH)
        or m["domain"]!="SURVEILLANCE_DEMO"
        or m["region_label"]!=region
        or type(m["revision"]) is not int or not 1<=m["revision"]<=100000
        or m["origin"]!="LOCAL_SYNTHETIC_FIXTURE"
        or m["synthetic"] is not True or m["source_verified"] is not False
        or m["official_authorization"] is not False):
        raise DemoSourceRejected("BAD_MANIFEST")
    if (not exact(session,{"id","role","active","region"})
        or not is_id(session["id"],USR)
        or session["active"] is not True
        or session["role"] not in {"provinsi_admin","provinsi_verifikator","kab_kota"}
        or (session["role"]=="kab_kota" and session["region"]!=region)):
        raise DemoAccessDenied("ACCESS_DENIED")
    records=payload["events"]
    if type(records) is not list or len(records)>100:
        raise DemoSourceRejected("BAD_EVENTS")
    seen=set()
    rows=[]
    for e in records:
        if not exact(e,EKEY):
            raise DemoSourceRejected("BAD_EVENT")
        if (not is_id(e["event_id"],ID)
            or not is_id(e["location_ref"],LOC)
            or not is_id(e["period"],MONTH)
            or e["period"]>m["capture_month"]
            or e["region_label"]!=region
            or e["source_id"]!=m["source_id"]
            or e["snapshot_id"]!=m["snapshot_id"]
            or e["syndrome_tag"] not in SYN
            or e["report_class"] not in REP
            or e["investigation_state"] not in INV
            or e["sample_state"] not in SAM
            or e["followup_state"] not in FOL
            or type(e["evidence_ref_count_demo"]) is not int
            or not 0<=e["evidence_ref_count_demo"]<=12
            or e["official_case_reference"] is not None
            or e["official_lab_reference"] is not None
            or e["event_id"] in seen
            or (e["investigation_state"]=="NOT_STARTED_DEMO"
                and e["sample_state"]!="NOT_LOGGED_DEMO")):
            raise DemoSourceRejected("BAD_EVENT")
        seen.add(e["event_id"])
        rows.append({"event_id":e["event_id"],"period":e["period"],
                     "report_class":e["report_class"],
                     "investigation_state":e["investigation_state"],
                     "sample_state":e["sample_state"],
                     "officially_notified":False,"disease_confirmed":False})
    if event_id is not None:
        if not is_id(event_id,ID):
            raise DemoAccessDenied("ACCESS_DENIED")
        rows=[x for x in rows if x["event_id"]==event_id]
        if not rows:
            raise DemoAccessDenied("ACCESS_DENIED")
    rows.sort(key=lambda x:(x["period"],x["event_id"]))
    return {"schema":M00_G6_SCHEMA,"synthetic":True,
            "mode":"READ_ONLY_UNVERIFIED_DEMO","records":rows,
            "record_count_demo":len(rows),
            "source_authenticated":False,
            "production_session_authenticated":False,
            "official_case_count":None,"isikhnas_connected":False,
            "may_write":False,"may_confirm_disease":False,
            "may_publish":False,"official_authorization":False}

def make_demo_blueprint(*,resolve_server_session,load_synthetic_source):
    """Returns an UNREGISTERED blueprint; never reads user-supplied role/source."""
    if not callable(resolve_server_session) or not callable(load_synthetic_source):
        raise ValueError("SERVER_CALLBACKS_REQUIRED")
    from flask import Blueprint,abort,current_app,jsonify,make_response,request
    bp=Blueprint("yandik_m00_g6_demo",__name__,
                 url_prefix="/_internal_yandik_demo/surveillance")
    def read(event_id=None):
        if current_app.config.get(DEMO_FLAG) is not True:
            abort(404)
        if request.args or request.content_length not in (None,0):
            abort(400)
        try:
            data=demo_projection(session=resolve_server_session(),
                                 payload=load_synthetic_source(),
                                 event_id=event_id)
        except DemoAccessDenied:
            abort(403)
        except DemoSourceRejected:
            abort(503)
        resp=make_response(jsonify(data),200)
        resp.headers["Cache-Control"]="no-store"
        resp.headers["X-Content-Type-Options"]="nosniff"
        return resp
    bp.add_url_rule("","list_events",read,methods=["GET"])
    bp.add_url_rule("/<event_id>","review_event",read,methods=["GET"])
    return bp
