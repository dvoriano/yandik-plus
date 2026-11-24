"""K4-A6 | CODE_ONLY. Independent regional synthetic registers, no source writes."""
import re
from apel_payload import require,exact,match
from staff_payload import day
from apel_store import CMD
REGIONS=("DEMO-REGION-UTARA","DEMO-REGION-SELATAN")
DOMAINS=("medicine","practice","surveillance","certificates")
VERSION="DEMO-REGIONAL-REGISTER-V1"
REF=re.compile(r"DEMO-[A-Z0-9_-]{1,48}")
CHECKS={
"medicine":("PENCATATAN_DOKUMEN","PENYIMPANAN","PENCATATAN_PERSEDIAAN","PENANGANAN_KEDALUWARSA"),
"practice":("DOKUMEN_ADMINISTRASI_DEMO","FASILITAS_PELAYANAN_DEMO","CATATAN_LAYANAN_DEMO","KEBERSIHAN_RUANG_DEMO","TINDAK_LANJUT_INTERNAL_DEMO"),
"certificates":("INFORMASI_ASAL_DEMO","INFORMASI_KOMODITAS_DEMO","INFORMASI_TUJUAN_DEMO","DOKUMEN_PENDUKUNG_DEMO")}
STATUS={
"medicine":("NOT_ASSESSED_DEMO","OBSERVED_DEMO","NEEDS_CLARIFICATION_DEMO"),
"practice":("NOT_ASSESSED_DEMO","OBSERVED_DEMO","REVIEW_REQUIRED_DEMO"),
"certificates":("NOT_ASSESSED_DEMO","PRESENT_UNVERIFIED_DEMO","NEEDS_CLARIFICATION_DEMO")}
REASONS=("CHECK_SOURCE_DEMO","CHECK_COMPLETENESS_DEMO","DISCUSS_FOLLOWUP_DEMO")
ACTIONS=("request_clarification","record_discussion","reopen_discussion")
def period(v):
    require(isinstance(v,str) and re.fullmatch(r"20(?:26|27|28|29|30)-(?:0[1-9]|1[0-2])",v) is not None,"PERIOD_INVALID")
    return v
def checks(domain,x):
    require(exact(x,CHECKS[domain]) and all(v in STATUS[domain] for v in x.values()),"CHECKLIST_INVALID")
def normalize(domain,p,region):
    require(domain in DOMAINS and region in REGIONS and type(p) is dict,"DOMAIN_SCOPE_INVALID")
    if domain in ("medicine","practice"):
        require(exact(p,("site_ref","kind","period","checks","evidence_count")) and match(REF,p["site_ref"]),"INSPECTION_SHAPE")
        kinds=("DISTRIBUSI_DEMO","PENJUALAN_DEMO","PENYIMPANAN_DEMO") if domain=="medicine" else ("KLINIK_DEMO","PRAKTIK_MANDIRI_DEMO")
        require(p["kind"] in kinds,"SITE_KIND");checks(domain,p["checks"])
        require(type(p["evidence_count"]) is int and 0<=p["evidence_count"]<=100,"EVIDENCE_COUNT")
    elif domain=="surveillance":
        require(exact(p,("location_ref","period","syndrome_tag","report_class","investigation_state","sample_state","followup_state","evidence_count")) and match(REF,p["location_ref"]),"EVENT_SHAPE")
        require(p["syndrome_tag"] in ("DEMO-SYNDROME-GENERAL","DEMO-SYNDROME-NEUROLOGIC","DEMO-SYNDROME-RESPIRATORY"),"SYNDROME_INVALID")
        require(p["report_class"] in ("SUSPECTED_UNVERIFIED_DEMO","FIELD_OBSERVATION_UNVERIFIED_DEMO"),"REPORT_CLASS")
        require(p["investigation_state"] in ("NOT_STARTED_DEMO","FIELD_NOTES_RECORDED_UNVERIFIED_DEMO"),"INVESTIGATION_STATE")
        require(p["sample_state"] in ("NOT_LOGGED_DEMO","SAMPLE_LOGGED_UNVERIFIED_DEMO","RESULT_PENDING_UNVERIFIED_DEMO","RESULT_NOTES_RECORDED_UNVERIFIED_DEMO"),"SAMPLE_STATE")
        require(p["followup_state"] in ("NOT_RECORDED_DEMO","DRAFT_REVIEW_ONLY"),"FOLLOWUP_STATE")
        require(type(p["evidence_count"]) is int and 0<=p["evidence_count"]<=100,"EVIDENCE_COUNT")
    else:
        require(exact(p,("period","destination_region_id","commodity_type","checks")) and p["destination_region_id"] in REGIONS,"CERTIFICATE_SHAPE")
        require(p["commodity_type"] in ("HEWAN_HIDUP_DEMO","PRODUK_HEWAN_DEMO"),"COMMODITY_INVALID");checks(domain,p["checks"])
    period(p["period"])
    return p
def command(x):
    require(exact(x,("command_id","record_id","expected_revision","action","reason_code")) and match(CMD,x["command_id"]) and match(REF,x["record_id"]) and type(x["expected_revision"]) is int and 0<=x["expected_revision"]<10000 and x["action"] in ACTIONS and x["reason_code"] in REASONS,"COMMAND_INVALID")
    return x
def transition(state,action):
    table={("NOT_REVIEWED","request_clarification"):"CLARIFICATION_REQUESTED_DEMO",
           ("NOT_REVIEWED","record_discussion"):"DISCUSSION_RECORDED_DEMO",
           ("CLARIFICATION_REQUESTED_DEMO","record_discussion"):"DISCUSSION_RECORDED_DEMO",
           ("DISCUSSION_RECORDED_DEMO","reopen_discussion"):"CLARIFICATION_REQUESTED_DEMO"}
    result=table.get((state,action));require(result is not None,"TRANSITION_DENIED");return result
def project(domain,p):
    out={**p,"official_authorization":False}
    if domain in ("medicine","practice"):out["legal_state"]="NOT_VERIFIED_DEMO"
    elif domain=="surveillance":out["confirmed_cases"]=None
    else:out.update(official_reference=None,official_issued_at=None,may_issue=False,may_sign=False)
    return out
