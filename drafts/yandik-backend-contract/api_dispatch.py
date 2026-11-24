"""K4-A8 | CODE_ONLY. Transport-neutral dispatcher, NOT a registered HTTP service.
Instantiate only for synthetic rehearsal after separate permission.
The host owns the resolver. Never pass a client-selected actor/grant or enable flag.
"""
import json
import sqlite3
from apel_payload import Denied,require,exact
from apel_store import canonical
from api_projections import ProjectionStore
from account_store import AccountStore
# Exact allowlist, no dynamic getattr on client-controlled values.
READS={
"/api/v1/core":((),lambda s,q,r:s.core(r)),
"/api/v1/profiles":(("facility_id","year"),lambda s,q,r:s.view_profile(q["facility_id"],q["year"],r)),
"/api/v1/profiles/history":(("record_id",),lambda s,q,r:s.profile_history(q["record_id"],r)),
"/api/v1/inventory":(("record_id",),lambda s,q,r:s.view_inventory(q["record_id"],r)),
"/api/v1/apel":(("record_id",),lambda s,q,r:s.view(q["record_id"],r)),
"/api/v1/personnel":(("facility_id","year"),lambda s,q,r:s.staff_summary(q["facility_id"],q["year"],r)),
"/api/v1/personnel/roster":(("facility_id","year"),lambda s,q,r:s.staff_roster(q["facility_id"],q["year"],r)),
"/api/v1/personnel/history":(("staff_id",),lambda s,q,r:s.staff_history(q["staff_id"],r)),
"/api/v1/support":(("record_id",),lambda s,q,r:s.view_support(q["record_id"],r)),
"/api/v1/coaching":(("facility_id","year"),lambda s,q,r:{"activity_slots":s.list_coachdoc(q["facility_id"],q["year"],r)["activity_slots"],"synthetic":True}),
"/api/v1/documents":(("facility_id","year"),lambda s,q,r:{"document_slots":s.list_coachdoc(q["facility_id"],q["year"],r)["document_slots"],"synthetic":True}),
"/api/v1/coaching/detail":(("record_id","revision"),lambda s,q,r:s.view_coachdoc("coaching",q["record_id"],r,q["revision"])),
"/api/v1/documents/detail":(("record_id","revision"),lambda s,q,r:s.view_coachdoc("documents",q["record_id"],r,q["revision"])),
"/api/v1/leadership":(("year","region_id"),lambda s,q,r:s.leadership(q["year"],q["region_id"],r)),
"/api/v1/gis":(("year","region_id","layer"),lambda s,q,r:s.gis(q["year"],q["region_id"],q["layer"],r)),
"/api/v1/library":(("q",),lambda s,q,r:s.library(q["q"],r)),
"/api/v1/notifications":(("today",),lambda s,q,r:s.inbox(q["today"],r))}
for domain in ("medicine","practice","surveillance","certificates"):
    READS["/api/v1/"+domain]=(("region_id","year"),lambda s,q,r,d=domain:s.regional_register(d,q["region_id"],q["year"],r))
WRITES={
"/api/v1/apel/commands":lambda s,b,r:s.apply(b,r),
"/api/v1/inventory/commands":lambda s,b,r:s.apply_inventory(b,r),
"/api/v1/profiles/commands":lambda s,b,r:s.apply_profile(b,r),
"/api/v1/personnel/commands":lambda s,b,r:s.apply_staff(b,r),
"/api/v1/support/commands":lambda s,b,r:s.apply_support(b,r),
"/api/v1/coaching/commands":lambda s,b,r:s.apply_coaching(b,r),
"/api/v1/documents/commands":lambda s,b,r:s.apply_document(b,r),
"/api/v1/regional/review-commands":lambda s,b,r:s.review_regional(b,r)}
def response(status,data=None,code=None):
    return {"status":status,"data":data,"error":code,"synthetic":True,"http_registered":False,"official_authorization":False}
def bounded(value,depth=0):
    if depth>8:return False
    if value is None or type(value) in (bool,int,float):return True
    if type(value) is str:return len(value)<=1024
    if type(value) is list:return len(value)<=250 and all(bounded(v,depth+1) for v in value)
    if type(value) is dict:return len(value)<=40 and all(type(k) is str and len(k)<=80 and bounded(v,depth+1) for k,v in value.items())
    return False
def error_status(code):
    if code in ("DEMO_SESSION_REQUIRED","DEMO_SESSION_INVALID"):return 401
    if code in ("REVISION_CONFLICT","IDEMPOTENCY_CONFLICT","SOURCE_CHANGED","INVENTORY_SOURCE_CHANGED"):return 409
    if code.endswith("_NOT_AVAILABLE") or code in ("RECORD_NOT_AVAILABLE","CASE_NOT_AVAILABLE"):return 403
    if code in ("ACCESS_DENIED","SCOPE_DENIED","AGGREGATE_ONLY","INVALID_CONTEXT","OWNER_DENIED","WRITER_DENIED","REVIEWER_DENIED","RECIPIENT_DENIED") or code.endswith("_DENIED"):return 403
    return 422
class DraftAPI:
    def __init__(self,store,resolve_demo_session,allow_demo_commands=False):
        require(type(store) in (ProjectionStore,AccountStore) and callable(resolve_demo_session),"REHEARSAL_CONTEXT_REQUIRED")
        self._store=store;self._resolve=resolve_demo_session;self._commands=allow_demo_commands is True
    def dispatch(self,method,path,query=None,body=None):
        try:
            require(type(method) is str and type(path) is str and len(path)<=160,"REQUEST_INVALID")
            if path not in READS and path not in WRITES:return response(404,code="ROUTE_NOT_FOUND")
            if method not in ("GET","POST"):return response(405,code="METHOD_NOT_ALLOWED")
            if (method=="GET" and path not in READS) or (method=="POST" and path not in WRITES):return response(405,code="METHOD_NOT_ALLOWED")
            query={} if query is None else query
            require(type(query) is dict and bounded(query) and bounded(body),"REQUEST_INVALID")
            require(len(canonical({"query":query,"body":body}).encode("utf-8"))<=65536,"REQUEST_TOO_LARGE")
            if method=="GET":
                keys,handler=READS[path];require(body is None and exact(query,keys),"QUERY_INVALID")
                for k,v in query.items():
                    if k=="year":require(type(v) is int and 2026<=v<=2030,"YEAR_INVALID")
                    elif k=="revision":require(v is None or type(v) is int and 0<=v<10000,"REVISION_INVALID")
                    else:require(type(v) is str,"QUERY_INVALID")
                return response(200,handler(self._store,query,self._resolve))
            require(self._commands,"COMMANDS_DISABLED")
            require(not query and type(body) is dict,"BODY_INVALID")
            # Typed writer itself checks session, scope and revision inside transaction.
            return response(200,WRITES[path](self._store,body,self._resolve))
        except Denied as exc:
            code=str(exc)
            status=403 if code=="COMMANDS_DISABLED" else error_status(code)
            # Same status and message for missing/forbidden objects; timing and other paths still require QA.
            return response(status,code="ACCESS_OR_RECORD_UNAVAILABLE" if status in (403,404) else code)
        except (TypeError,ValueError,OverflowError):
            return response(422,code="INVALID_REQUEST")
        except sqlite3.Error:
            return response(500,code="STORE_ERROR")
        except Exception:
            return response(500,code="INTERNAL_ERROR")
