"""K4-B3 | CODE_ONLY. Shared envelope helpers for five facility workflow writers.
Caller owns BEGIN IMMEDIATE, typed domain payload and policy; never commit here.
"""
import hashlib
import json
from datetime import datetime,timezone
from apel_payload import require
def canonical(x):return json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False)
def digest(x):return hashlib.sha256(canonical(x).encode("utf-8")).hexdigest()
def start_revision(c,rid,previous,source,actor,action,state,payload):
    require(c.in_transaction and type(previous) is int and previous>=0,"REVISION_CONTEXT_INVALID")
    now=datetime.now(timezone.utc).isoformat();n=previous+1
    head=c.execute("SELECT current_revision FROM contract_record WHERE id=?",(rid,)).fetchone()
    require(head is not None and head[0]==previous,"REVISION_CONFLICT")
    c.execute("INSERT INTO contract_revision VALUES(?,?,?,?,?,?,?,?)",(rid,n,source,actor,action,state,now,digest(payload)))
    return n,now
def finish_revision(c,rid,previous,n,actor,action,now,command_id,fingerprint):
    require(c.in_transaction and n==previous+1,"REVISION_CONTEXT_INVALID")
    c.execute("INSERT INTO contract_audit VALUES(?,?,?,?,?,?)",("DEMO-AUDIT-"+rid+"-"+str(n),rid,n,actor,action,now))
    c.execute("INSERT INTO contract_command VALUES(?,?,?,?,?)",(actor,command_id,fingerprint,rid,n))
    require(c.execute("UPDATE contract_record SET current_revision=? WHERE id=? AND current_revision=?",(n,rid,previous)).rowcount==1,"REVISION_CONFLICT")
