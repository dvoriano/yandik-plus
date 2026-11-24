"""K4-C4 | CODE_ONLY. Technical compatibility only, never funding eligibility."""
from inventory_payload import INDEX
EXCLUDED_IDS={"A.2.a","A.2.b","A.2.c","C.2.k","C.2.l","C.2.m"}
def classification(item):
    if item["group"]=="A1" or item["id"] in ("A.2.a","A.2.b","A.2.c"):
        return "INFRASTRUCTURE_REVIEW_REQUIRED"
    if item["id"] in ("C.2.k","C.2.l","C.2.m"):return "DUPLICATE_REFERENCE_REVIEW_REQUIRED"
    if item["kind"]!="asset" or not item["unit"]:return "UNIT_OR_STOCK_REVIEW_REQUIRED"
    return "COUNTABLE_EQUIPMENT_CANDIDATE"
ITEMS=tuple(k for k,x in INDEX.items() if classification(x)=="COUNTABLE_EQUIPMENT_CANDIDATE")
def shortage(item,row):
    """Only an explicit numeric minimum supplies a numeric gap; no suggested procurement."""
    if item["minimum"] is None or not row or row["confirmed"] is not True or row["status"] not in ("ABSENT","AVAILABLE"):return None
    return max(0,item["minimum"]-row["usable"])
