"""K4-A7 | CODE_ONLY, synthetic structured activity and document contract."""
from copy import deepcopy
import re
from apel_payload import require,exact,match
from staff_payload import day
from apel_store import CMD,REC
VERSION="DEMO-COACH-DOC-V1"
TYPES=("Pembinaan","Bimtek","Monitoring")
TOPICS=("Pelaporan APEL","Profil dan inventaris","Pelayanan veteriner","Kompetensi SDM")
DOC_TYPES={"HASIL":"Laporan hasil","BA":"Berita acara","PENGANTAR":"Surat pengantar","REKAP":"Rekap tindak lanjut"}
EVIDENCE=("Agenda","Daftar hadir agregat","Dokumentasi","Catatan hasil")
REF=re.compile(r"DEMO-EVIDENCE-[A-Z0-9_-]{1,32}")
RESULTS=("HASIL_TERCATAT_DEMO","PERLU_PENDALAMAN_DEMO")
RECOMMENDATIONS=("PERBARUI_DATA_DEMO","PEMBINAAN_LANJUT_DEMO","TELAAH_TEKNIS_DEMO")
COMPLETIONS=("TINDAK_LANJUT_TERCATAT_DEMO","HASIL_DITELAAH_DEMO")
REASONS=("CHECK_RESULT_DEMO","CHECK_EVIDENCE_DEMO","UPDATE_SOURCE_DEMO")
COACH_ACTIONS=("plan","record","review","return_result","close")
DOC_ACTIONS=("create","refresh","evidence","submit","return_doc","archive","reopen")
def count(v):return type(v) is int and 0<=v<=1000
def intent(x,resource):
    require(exact(x,("command_id","record_id","expected_revision","action","payload")) and match(CMD,x["command_id"]) and match(REC,x["record_id"]) and type(x["expected_revision"]) is int and 0<=x["expected_revision"]<10000,"COMMAND_INVALID")
    a=x["action"];p=x["payload"]
    require(a in (COACH_ACTIONS if resource=="coaching" else DOC_ACTIONS),"ACTION_INVALID")
    if a=="plan":
        require(exact(p,("date","type","topic","planned")) and p["type"] in TYPES and p["topic"] in TOPICS and count(p["planned"]),"PLAN_INVALID");day(p["date"])
    elif a=="record":
        require(exact(p,("attendance","result","recommendation","due","recorded_on")) and count(p["attendance"]) and p["result"] in RESULTS and p["recommendation"] in RECOMMENDATIONS,"RESULT_INVALID")
        day(p["due"]);day(p["recorded_on"])
    elif a=="close":
        require(exact(p,("completion","completed_on")) and p["completion"] in COMPLETIONS,"CLOSE_INVALID");day(p["completed_on"])
    elif a in ("return_result","return_doc","archive","reopen"):
        require(exact(p,("reason",)) and p["reason"] in REASONS,"REASON_INVALID")
    elif a=="evidence":
        require(exact(p,("kind","ref")) and p["kind"] in EVIDENCE and match(REF,p["ref"]),"EVIDENCE_INVALID")
    else:require(p is None,"PAYLOAD_INVALID")
    return x
def coach_change(old,x,year):
    a=x["action"];p=x["payload"]
    if a=="plan":
        require(old is None and int(p["date"][:4])==year,"PLAN_DENIED")
        return {**p,"stage":"PLANNED","attendance":None,"result":None,"recommendation":None,"due":None,"recorded_on":None,"completion":None,"completed_on":None}
    require(old is not None,"ACTIVITY_REQUIRED");n=deepcopy(old)
    if a=="record":
        require(n["stage"]=="PLANNED" and n["date"]<=p["recorded_on"]<=p["due"],"RESULT_DATE_OR_STAGE")
        n.update(p);n["stage"]="RESULT_DRAFT"
    elif a=="review":
        require(n["stage"]=="RESULT_DRAFT","REVIEW_DENIED");n["stage"]="FOLLOWUP_OPEN"
    elif a=="return_result":
        require(n["stage"]=="RESULT_DRAFT","RETURN_DENIED")
        n.update(stage="PLANNED",attendance=None,result=None,recommendation=None,due=None,recorded_on=None)
    elif a=="close":
        require(n["stage"]=="FOLLOWUP_OPEN" and p["completed_on"]>=n["recorded_on"],"CLOSE_DENIED")
        n.update(p);n["stage"]="CLOSED_DEMO"
    else:require(False,"ACTION_INVALID")
    return n
def doc_change(old,x,source,source_rev,kind):
    a=x["action"];p=x["payload"]
    stale=old is not None and old["source_revision"]!=source_rev
    if a in ("create","refresh"):
        require((a=="create" and old is None) or (a=="refresh" and old is not None and old["stage"]!="ARCHIVED_DEMO" and (stale or old["stage"]=="CORRECTION")),"VERSION_DENIED")
        require(source is not None and source["result"] is not None and source["attendance"] is not None,"RESULT_REQUIRED")
        return {"stage":"DRAFT","kind":kind,"version":1 if old is None else old["version"]+1,"source_revision":source_rev,"snapshot":deepcopy(source),"evidence":[]}
    require(old is not None,"DOCUMENT_REQUIRED");n=deepcopy(old)
    if a=="reopen":
        require(n["stage"]=="ARCHIVED_DEMO","REOPEN_DENIED");n["stage"]="CORRECTION";return n
    require(not stale,"SOURCE_CHANGED")
    if a=="evidence":
        require(n["stage"] in ("DRAFT","CORRECTION") and not any(e["kind"]==p["kind"] or e["ref"]==p["ref"] for e in n["evidence"]),"EVIDENCE_DENIED")
        n["evidence"].append(dict(p))
    elif a=="submit":
        require(n["stage"] in ("DRAFT","CORRECTION") and set(e["kind"] for e in n["evidence"])==set(EVIDENCE),"EVIDENCE_REQUIRED")
        n["stage"]="REVIEW"
    elif a=="return_doc":
        require(n["stage"]=="REVIEW","RETURN_DENIED");n["stage"]="CORRECTION"
    elif a=="archive":
        require(n["stage"]=="REVIEW" and source["stage"] in ("FOLLOWUP_OPEN","CLOSED_DEMO"),"ARCHIVE_DENIED")
        n["stage"]="ARCHIVED_DEMO"
    else:require(False,"ACTION_INVALID")
    return n
def draft_text(s,facility_label,activity_id):
    r=s["snapshot"]
    return "\n".join(["DRAF DEMO - BUKAN DOKUMEN RESMI",DOC_TYPES[s["kind"]],f"Versi {s['version']} | Sumber {activity_id} revisi {s['source_revision']}",f"Puskeswan: {facility_label}",f"Tanggal: {r['date']}",f"Kegiatan: {r['type']} / {r['topic']}",f"Rencana peserta: {r['planned']}",f"Kehadiran: {r['attendance']}",f"Hasil: {r['result']}",f"Rekomendasi: {r['recommendation']}",f"Tenggat: {r['due']}",f"Tindak lanjut: {r['completion'] or 'Belum ditutup'}","Tanpa nomor resmi, tanda tangan, pengesahan atau pengiriman."])
