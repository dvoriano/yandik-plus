"""Typed synthetic APEL payload contract, adapted from M05-0 / shared-demo.
CODE_ONLY. Not a verified live form or cross-language parity result.
"""
import re
KINDS=("pengobatan","vaksinasi","penyuluhan","layanan_lain")
REF=re.compile(r"DEMO-[A-Z0-9_-]{1,40}")
PERIOD=re.compile(r"20(?:26|27|28|29|30)-(?:0[1-9]|1[0-2])")
FAC=re.compile(r"DEMO-PSW-[A-Z0-9_-]{1,24}")
class Denied(ValueError): pass
def require(ok,code):
    if not ok: raise Denied(code)
def exact(x,keys): return type(x) is dict and set(x)==set(keys)
def match(pattern,x): return isinstance(x,str) and pattern.fullmatch(x) is not None
def normalize(raw,facility,period):
    require(exact(raw,("facility_id","period","declared_no_activity","counts","investigations","kurban_animals","evidence_refs")),"PAYLOAD_SHAPE")
    require(match(FAC,facility) and match(PERIOD,period) and raw["facility_id"]==facility and raw["period"]==period,"PAYLOAD_SCOPE")
    counts=raw["counts"]
    require(exact(counts,KINDS) and all(type(v) is int and 0<=v<=100000 for v in counts.values()),"COUNTS_INVALID")
    require(type(raw["declared_no_activity"]) is bool,"ZERO_INVALID")
    events,animals,refs=raw["investigations"],raw["kurban_animals"],raw["evidence_refs"]
    require(all(type(v) is list and len(v)<=100 for v in (events,animals,refs)),"LIST_INVALID")
    event_keys=set()
    for x in events:
        require(exact(x,("event_id","location_id")) and all(match(REF,v) for v in x.values()),"INVESTIGATION_INVALID")
        k=(x["event_id"],x["location_id"])
        require(k not in event_keys,"DUPLICATE_INVESTIGATION");event_keys.add(k)
    animal_keys=set()
    for x in animals:
        require(exact(x,("animal_id","ante","post")) and match(REF,x["animal_id"]) and type(x["ante"]) is bool and type(x["post"]) is bool and (x["ante"] or x["post"]),"KURBAN_INVALID")
        require(x["animal_id"] not in animal_keys,"DUPLICATE_ANIMAL");animal_keys.add(x["animal_id"])
    require(all(match(REF,v) for v in refs) and len(set(refs))==len(refs),"EVIDENCE_INVALID")
    total=sum(counts.values())+len(event_keys)+len(animal_keys)
    require(raw["declared_no_activity"]==(total==0),"ZERO_CONFLICT")
    return {"facility_id":facility,"period":period,"declared_no_activity":raw["declared_no_activity"],
            "counts":{k:counts[k] for k in KINDS},
            "investigations":[dict(x) for x in events],"kurban_animals":[dict(x) for x in animals],"evidence_refs":list(refs)}
