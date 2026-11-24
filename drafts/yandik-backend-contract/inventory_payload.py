"""CODE_ONLY. Frozen catalog snapshot derived from existing portal; not legal verification."""
import json
import math
from pathlib import Path
from copy import deepcopy
from apel_payload import require, exact
VERSION="PERMENTAN64-2007-LIII-2020-V1-DEMO"
CATALOG=json.loads((Path(__file__).resolve().parent/"inventory_catalog.json").read_text("utf-8"))
require(CATALOG["version"]==VERSION and CATALOG["official_verified"] is False,"CATALOG_VERSION")
INDEX={x["id"]:x for x in CATALOG["items"]}
require(len(INDEX)==len(CATALOG["items"])==198,"CATALOG_SIZE")
GROUPS={g["id"] for g in CATALOG["groups"]}
YEARS=range(2026,2031)
def empty():
    return {"rows":{},"copied_from":None,"county_reviewer":None}
def quantity(v,kind):
    return type(v) in (int,float) and 0<=v<=1000000 and math.isfinite(v) and (kind=="area" or int(v)==v)
def normalize_item(item_id,raw,year):
    require(type(year) is int and year in YEARS,"YEAR_INVALID")
    require(isinstance(item_id,str) and item_id in INDEX and exact(raw,("status","total","usable","condition")),"ITEM_INVALID")
    item=INDEX[item_id];status=raw["status"];kind=item["kind"]
    require(status in ("AVAILABLE","ABSENT","UNKNOWN","CONTEXT_REVIEW"),"STATUS_INVALID")
    require(status!="CONTEXT_REVIEW" or item["group"]=="A5","CONTEXT_DENIED")
    total,usable,condition=raw["total"],raw["usable"],raw["condition"]
    if status=="AVAILABLE" and kind=="stock":
        require(total is None and usable is None and condition in ("ADEQUATE_REPORTED","LIMITED_REPORTED","UNUSABLE_REPORTED","NOT_ASSESSED"),"STOCK_INVALID")
    elif status=="AVAILABLE":
        require(condition is None and quantity(total,kind) and quantity(usable,kind) and 0<total and usable<=total,"QUANTITY_INVALID")
        if kind!="area":total,usable=int(total),int(usable)
    elif status=="ABSENT" and kind!="stock":
        require(type(total) in (int,float) and type(usable) in (int,float) and total==usable==0 and condition is None,"ABSENT_INVALID")
        total=usable=0
    else:
        require(total is None and usable is None and condition is None,"UNKNOWN_OR_STOCK_FIELDS_INVALID")
    return {"status":status,"total":total,"usable":usable,"condition":condition,"confirmed":True,"source_year":year}
def copy_snapshot(previous,source_year,revision,status):
    require(previous["rows"] and source_year in YEARS and revision>0,"PRIOR_MISSING")
    return {"rows":{k:{**deepcopy(v),"confirmed":False,"source_year":source_year} for k,v in previous["rows"].items()},
            "copied_from":{"year":source_year,"revision":revision,"status":status},"county_reviewer":None}
def assessment(item,row):
    if not row or not row["confirmed"]:return "UNCONFIRMED"
    if row["status"] in ("UNKNOWN","CONTEXT_REVIEW"):return "REVIEW"
    if row["status"]=="ABSENT":return "ABSENT"
    if item["kind"]=="stock":
        return {"ADEQUATE_REPORTED":"AVAILABLE_REPORTED","NOT_ASSESSED":"REVIEW"}.get(row["condition"],"STOCK_ATTENTION")
    if item["minimum"] is not None:return "MINIMUM_REPORTED" if row["usable"]>=item["minimum"] else "BELOW_MINIMUM"
    return "UNUSABLE" if row["usable"]==0 else "PARTIAL_USABLE" if row["usable"]<row["total"] else "AVAILABLE_REPORTED"
def summary(snapshot):
    rows=snapshot["rows"];confirmed=sum(v["confirmed"] for v in rows.values())
    attention=sum(assessment(item,rows.get(k)) in ("ABSENT","REVIEW","STOCK_ATTENTION","BELOW_MINIMUM","UNUSABLE","PARTIAL_USABLE") for k,item in INDEX.items())
    return {"confirmed":confirmed,"total":len(INDEX),"attention":attention if confirmed else None,"official_authorization":False}
