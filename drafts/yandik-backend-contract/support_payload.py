"""K4-A5 | CODE_ONLY. New synthetic facility-bound support stream, not M04 migration."""
from copy import deepcopy
import re
from apel_payload import require,exact,match
from staff_payload import day
from inventory_payload import INDEX,assessment
from apel_store import CMD,REC

VERSION="DEMO-SUPPORT-SINGLE-ITEM-V1"
from support_catalog import ITEMS
ATTENTION=("ABSENT","BELOW_MINIMUM","UNUSABLE","PARTIAL_USABLE")
REF=re.compile(r"DEMO-[A-Z0-9_-]{1,40}")
REASONS=("REPLACE_DAMAGED_DEMO","FILL_GAP_DEMO","REVIEW_CONDITION_DEMO")
ACTIONS=("propose","submit","county_review","plan_package","schedule","dispatch","receive","handover","monitor","return_draft")
OWNER_ACTIONS=("propose","submit","receive","monitor")
PROVINCE_ACTIONS=("plan_package","schedule","dispatch","handover","return_draft")
def qty(v,minimum=0):return type(v) is int and minimum<=v<=1000000
def intent(x):
    require(exact(x,("command_id","record_id","expected_revision","action","payload")) and match(CMD,x["command_id"]) and match(REC,x["record_id"]) and type(x["expected_revision"]) is int and 0<=x["expected_revision"]<10000 and x["action"] in ACTIONS,"INTENT_INVALID")
    a=x["action"];p=x["payload"]
    if a=="propose":
        require(exact(p,("requested","reason")) and qty(p["requested"],1) and p["reason"] in REASONS,"NEED_INVALID")
    elif a=="plan_package":
        require(exact(p,("quantity",)) and qty(p["quantity"],1),"PACKAGE_INVALID")
    elif a=="schedule":
        require(exact(p,("quantity","planned_on")) and qty(p["quantity"],1),"SCHEDULE_INVALID");day(p["planned_on"])
    elif a=="dispatch":
        require(exact(p,("shipment_ref","quantity","sent_on")) and match(REF,p["shipment_ref"]) and qty(p["quantity"],1),"SHIPMENT_INVALID");day(p["sent_on"])
    elif a=="receive":
        require(exact(p,("shipment_ref","receipt_ref","good","damaged","received_on")) and match(REF,p["shipment_ref"]) and match(REF,p["receipt_ref"]) and qty(p["good"]) and qty(p["damaged"]) and p["good"]+p["damaged"]>0,"RECEIPT_INVALID");day(p["received_on"])
    elif a=="handover":
        require(exact(p,("receipt_ref","reference","recorded_on")) and match(REF,p["receipt_ref"]) and match(REF,p["reference"]),"HANDOVER_INVALID");day(p["recorded_on"])
    elif a=="monitor":
        require(exact(p,("receipt_ref","observed_on","in_use","not_in_use","damaged_after")) and match(REF,p["receipt_ref"]) and all(qty(p[k]) for k in ("in_use","not_in_use","damaged_after")),"MONITOR_INVALID");day(p["observed_on"])
    elif a=="return_draft":
        require(exact(p,("reason",)) and p["reason"] in REASONS,"RETURN_INVALID")
    else:require(p is None,"PAYLOAD_INVALID")
    return x
def empty():
    return {"stage":"DRAFT","need":None,"county_reviewed":False,"package":None,"schedule":None,"shipments":[],"receipts":[],"handovers":[],"observations":[]}
def project(s):
    sent=sum(x["quantity"] for x in s["shipments"]);good=sum(x["good"] for x in s["receipts"]);damaged=sum(x["damaged"] for x in s["receipts"])
    scheduled=s["schedule"]["quantity"] if s["schedule"] else None
    latest={}
    for x in s["observations"]:
        k=x["receipt_ref"]
        if k not in latest or x["observed_on"]>latest[k]["observed_on"]:latest[k]=x
    observed_good=sum(x["in_use"]+x["not_in_use"]+x["damaged_after"] for x in latest.values())
    return {"scheduled":scheduled,"sent":sent,"received_good":good,"received_damaged":damaged,
            "not_sent":None if scheduled is None else scheduled-sent,"awaiting_receipt":sent-good-damaged,
            "good_not_observed":good-observed_good,"in_use_observed":sum(x["in_use"] for x in latest.values()) if latest else None,
            "official_authorization":False}
def change(s,x,source=None):
    n=deepcopy(s);a=x["action"];p=x["payload"];stage=n["stage"]
    if a=="propose":
        require(stage=="DRAFT" and source is not None,"SOURCE_REQUIRED")
        n["need"]={"requested":p["requested"],"reason":p["reason"],"source":deepcopy(source)}
    elif a=="submit":
        require(stage=="DRAFT" and n["need"] is not None,"NEED_REQUIRED");n["stage"]="SUBMITTED"
    elif a=="county_review":
        require(stage=="SUBMITTED","COUNTY_REVIEW_DENIED");n["stage"]="COUNTY_REVIEWED";n["county_reviewed"]=True
    elif a=="plan_package":
        require(stage=="COUNTY_REVIEWED" and p["quantity"]<=n["need"]["requested"],"PACKAGE_LIMIT");n["package"]=dict(p);n["stage"]="PACKAGE_PLANNED"
    elif a=="schedule":
        require(stage=="PACKAGE_PLANNED" and p["quantity"]<=n["package"]["quantity"],"SCHEDULE_LIMIT");n["schedule"]=dict(p);n["stage"]="SCHEDULED"
    elif a=="dispatch":
        require(stage in ("SCHEDULED","LIFECYCLE"),"SCHEDULE_REQUIRED")
        require(not any(v["shipment_ref"]==p["shipment_ref"] for v in n["shipments"]),"DUPLICATE_SHIPMENT")
        require(p["quantity"]<=project(n)["not_sent"],"SHIPMENT_LIMIT")
        require(p["sent_on"]>=n["schedule"]["planned_on"],"SHIPMENT_DATE_ORDER")
        n["shipments"].append(dict(p));n["stage"]="LIFECYCLE"
    elif a=="receive":
        require(stage=="LIFECYCLE","SHIPMENT_REQUIRED")
        ship=next((v for v in n["shipments"] if v["shipment_ref"]==p["shipment_ref"]),None)
        require(ship is not None and ship["sent_on"]<=p["received_on"],"RECEIPT_SOURCE")
        require(not any(v["receipt_ref"]==p["receipt_ref"] for v in n["receipts"]),"DUPLICATE_RECEIPT")
        used=sum(v["good"]+v["damaged"] for v in n["receipts"] if v["shipment_ref"]==p["shipment_ref"])
        require(used+p["good"]+p["damaged"]<=ship["quantity"],"RECEIPT_LIMIT")
        n["receipts"].append(dict(p))
    elif a=="handover":
        rec=next((v for v in n["receipts"] if v["receipt_ref"]==p["receipt_ref"]),None)
        require(rec is not None and rec["received_on"]<=p["recorded_on"],"HANDOVER_SOURCE")
        require(not any(v["receipt_ref"]==p["receipt_ref"] or v["reference"]==p["reference"] for v in n["handovers"]),"DUPLICATE_HANDOVER")
        n["handovers"].append(dict(p))
    elif a=="monitor":
        ref=next((v for v in n["handovers"] if v["receipt_ref"]==p["receipt_ref"]),None)
        rec=next((v for v in n["receipts"] if v["receipt_ref"]==p["receipt_ref"]),None)
        require(ref is not None and rec is not None and rec["good"]>0 and ref["recorded_on"]<=p["observed_on"],"MONITOR_SOURCE")
        require(p["in_use"]+p["not_in_use"]+p["damaged_after"]==rec["good"],"MONITOR_TOTAL")
        require(not any(v["receipt_ref"]==p["receipt_ref"] and v["observed_on"]==p["observed_on"] for v in n["observations"]),"DUPLICATE_OBSERVATION")
        n["observations"].append(dict(p))
    else:
        require(stage in ("SUBMITTED","COUNTY_REVIEWED","PACKAGE_PLANNED","SCHEDULED") and not n["shipments"],"RETURN_DENIED");n=empty()
    return n
