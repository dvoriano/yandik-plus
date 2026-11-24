"""K4-A2 | CODE_ONLY, isolated SQLite memory rehearsal.
Shares APEL DemoStore core schema/grants, no external DB, no HTTP.
"""
from datetime import datetime,timezone
from pathlib import Path
from revision_envelope import start_revision,finish_revision
from copy import deepcopy
import json
from apel_store import DemoStore, digest, canonical, CMD, REC
from apel_payload import require, exact, match, Denied
from contract import Record, plan_access
from inventory_payload import CATALOG, VERSION, INDEX, GROUPS, YEARS, empty, normalize_item, copy_snapshot, summary
SOURCE="DEMO-SOURCE-INVENTORY"
CATALOG_DIGEST=digest(CATALOG)
EDIT={"save_item","copy_prior","confirm_item","confirm_group"}
ACTIONS=EDIT|{"submit","county_review","return_correction","province_review","reopen"}
REASONS={"CHECK_INVENTORY_DEMO","UPDATE_CONDITION_DEMO"}
CORE_ACTION={**{x:"save_draft" for x in EDIT},"submit":"submit","county_review":"record_review","province_review":"record_review","return_correction":"return_correction","reopen":"return_correction"}
def validate_intent(x):
    require(exact(x,("command_id","record_id","expected_revision","action","payload","reason_code")) and match(CMD,x["command_id"]) and match(REC,x["record_id"]) and type(x["expected_revision"]) is int and 0<=x["expected_revision"]<10000 and isinstance(x["action"],str) and x["action"] in ACTIONS,"INTENT_INVALID")
    a=x["action"];p=x["payload"];reason=x["reason_code"]
    if a=="save_item":require(exact(p,("item_id","observation")),"PAYLOAD_INVALID")
    elif a=="confirm_item":require(exact(p,("item_id",)) and isinstance(p["item_id"],str),"PAYLOAD_INVALID")
    elif a=="confirm_group":require(exact(p,("group","reviewed_all")) and isinstance(p["group"],str) and p["reviewed_all"] is True,"GROUP_CONFIRM_REQUIRED")
    else:require(p is None,"PAYLOAD_INVALID")
    require(isinstance(reason,str) and reason in REASONS if a in ("return_correction","reopen") else reason is None,"REASON_INVALID")
    return x
class InventoryStore(DemoStore):
    def __init__(self):
        super().__init__()
        c=self._db
        try:
            c.executescript((Path(__file__).resolve().parent/"inventory_payload.sql").read_text("utf-8"))
            c.execute("BEGIN IMMEDIATE")
            c.execute("INSERT INTO contract_actor VALUES('DEMO-ACTOR-BETA',1)")
            c.execute("INSERT INTO contract_facility VALUES('DEMO-PSW-BETA','DEMO-REGION-UTARA','Puskeswan DEMO BETA')")
            c.execute("INSERT INTO contract_grant VALUES('DEMO-GRANT-BETA','DEMO-ACTOR-BETA','puskeswan','facility','DEMO-REGION-UTARA','DEMO-PSW-BETA',1)")
            for region in ("UTARA","SELATAN"):
                actor="DEMO-ACTOR-KAB-"+region
                c.execute("INSERT INTO contract_actor VALUES(?,1)",(actor,))
                c.execute("INSERT INTO contract_grant VALUES(?,?,?,?,?,NULL,1)",("DEMO-GRANT-KAB-"+region,actor,"kab_kota","region","DEMO-REGION-"+region))
            c.execute("INSERT INTO contract_source VALUES(?,?,?,?,?)",(SOURCE,"M02-INVENTORY-REHEARSAL",VERSION,CATALOG_DIGEST,"UNVERIFIED_DEMO"))
            for name,region in (("ALPHA","UTARA"),("BETA","UTARA"),("GAMMA","SELATAN")):
                f="DEMO-PSW-"+name
                for year in YEARS:
                    rid=f"DEMO-REC-INV-{name}-{year}"
                    c.execute("INSERT INTO contract_record VALUES(?,?,?,?,?,0,?)",(rid,"inventory",f,"DEMO-REGION-"+region,str(year),"DEMO-ACTOR-"+name))
                    c.execute("INSERT INTO contract_inventory_year VALUES(?,?,?,?)",(rid,f,year,VERSION))
            c.execute("COMMIT")
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            self.close();raise
    def _inv_record(self,rid):
        r=self._db.execute("SELECT r.*,i.year,i.catalog_version FROM contract_record r JOIN contract_inventory_year i ON i.record_id=r.id AND i.facility_id=r.facility_id WHERE r.id=? AND r.resource='inventory'",(rid,)).fetchone()
        require(r is not None and r["business_key"]==str(r["year"]) and r["catalog_version"]==VERSION,"RECORD_NOT_AVAILABLE")
        return r
    def _inv_revision(self,rid,rev):
        if rev==0:return "DRAFT",empty()
        row=self._db.execute("SELECT r.state,r.source_id,r.payload_digest,p.snapshot_json,p.catalog_digest FROM contract_revision r JOIN contract_inventory_payload p USING(record_id,revision) WHERE r.record_id=? AND r.revision=?",(rid,rev)).fetchone()
        require(row is not None and row["source_id"]==SOURCE and row["catalog_digest"]==CATALOG_DIGEST,"REVISION_SOURCE_INVALID")
        snap=json.loads(row["snapshot_json"])
        require(digest(snap)==row["payload_digest"],"SNAPSHOT_DIGEST_MISMATCH")
        return row["state"],snap
    def _read_policy(self,s,r,state,rev):
        candidate=plan_access(s,Record(r["id"],"inventory",r["region_id"],r["facility_id"],r["owner_id"],state,rev),"read")
        require(candidate["candidate"],candidate["reason"])
    def _action_policy(self,s,r,state,snap,action):
        self._read_policy(s,r,state,r["current_revision"])
        if action in EDIT or action=="submit":
            require(s.role=="puskeswan" and s.actor_id==r["owner_id"],"WRITER_DENIED")
            require(state in ("DRAFT","CORRECTION"),"LOCKED")
        else:
            require(s.actor_id!=r["owner_id"],"SELF_REVIEW_DENIED")
            if action=="county_review":
                require(s.role=="kab_kota" and state=="SUBMITTED" and snap["county_reviewer"] is None,"COUNTY_REVIEW_DENIED")
            elif action=="province_review":
                require(s.role=="provinsi_verifikator" and state=="SUBMITTED" and snap["county_reviewer"] is not None and s.actor_id!=snap["county_reviewer"],"PROVINCE_REVIEW_DENIED")
            elif action=="return_correction":
                require(state=="SUBMITTED" and ((s.role=="kab_kota" and snap["county_reviewer"] is None) or (s.role=="provinsi_verifikator" and snap["county_reviewer"] is not None and s.actor_id!=snap["county_reviewer"])),"RETURN_DENIED")
            else:require(s.role=="provinsi_verifikator" and state=="RECORDED_DEMO","REOPEN_DENIED")
    def _copy_prior(self,r):
        candidates=self._db.execute("SELECT r.id,r.current_revision,i.year FROM contract_record r JOIN contract_inventory_year i ON i.record_id=r.id WHERE r.facility_id=? AND r.resource='inventory' AND i.year<? AND i.catalog_version=? AND r.current_revision>0 ORDER BY i.year DESC",(r["facility_id"],r["year"],VERSION)).fetchall()
        for p in candidates:
            state,snap=self._inv_revision(p["id"],p["current_revision"])
            if snap["rows"]:return copy_snapshot(snap,p["year"],p["current_revision"],state)
        require(False,"PRIOR_MISSING")
    def _change(self,s,r,state,snap,x):
        a=x["action"];p=x["payload"];n=deepcopy(snap)
        if a=="save_item":
            n["rows"][p["item_id"]]=normalize_item(p["item_id"],p["observation"],r["year"])
        elif a=="copy_prior":
            require(r["current_revision"]==0 and not n["rows"],"TARGET_ALREADY_STARTED");n=self._copy_prior(r)
        elif a=="confirm_item":
            k=p["item_id"];require(k in INDEX and k in n["rows"] and not n["rows"][k]["confirmed"],"NO_COPIED_ROW");n["rows"][k]["confirmed"]=True
        elif a=="confirm_group":
            g=p["group"];require(g in GROUPS,"GROUP_INVALID")
            ids=[k for k,i in INDEX.items() if i["group"]==g and k in n["rows"] and not n["rows"][k]["confirmed"]]
            require(ids,"NO_COPIED_ROWS")
            for k in ids:n["rows"][k]["confirmed"]=True
        elif a=="submit":
            require(summary(n)["confirmed"]==len(INDEX),"CONFIRM_ALL_ITEMS_FIRST");state="SUBMITTED";n["county_reviewer"]=None
        elif a=="county_review":n["county_reviewer"]=s.actor_id
        elif a=="province_review":state="RECORDED_DEMO"
        else:state="CORRECTION";n["county_reviewer"]=None
        return state,n
    def apply_inventory(self,command,resolve_demo_session):
        self._guard();x=validate_intent(command);c=self._db
        c.execute("BEGIN IMMEDIATE")
        try:
            s=self._session(resolve_demo_session);r=self._inv_record(x["record_id"]);rid=r["id"];rev=r["current_revision"];state,snap=self._inv_revision(rid,rev)
            self._read_policy(s,r,state,rev)
            # Validate shape and value before hashing; scope is derived from stored record.
            if x["action"]=="save_item":normalize_item(x["payload"]["item_id"],x["payload"]["observation"],r["year"])
            fingerprint=digest({"resource":"inventory","command":x,"actor":s.actor_id,"catalog":CATALOG_DIGEST})
            self._command_namespace_guard(s.actor_id,x["command_id"])
            old=c.execute("SELECT * FROM contract_command WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone()
            if old is not None:
                require(old["record_id"]==rid and old["request_digest"]==fingerprint,"IDEMPOTENCY_CONFLICT")
                before=old["result_revision"]-1;old_state,old_snap=self._inv_revision(rid,before)
                self._action_policy(s,r,old_state,old_snap,x["action"])
                out=self._receipt(rid,old["result_revision"],True);c.execute("COMMIT");return out
            require(x["expected_revision"]==rev,"REVISION_CONFLICT")
            self._action_policy(s,r,state,snap,x["action"])
            state,n=self._change(s,r,state,snap,x);act=CORE_ACTION[x["action"]]
            new,now=start_revision(c,rid,rev,SOURCE,s.actor_id,act,state,n)
            c.execute("INSERT INTO contract_inventory_payload VALUES(?,?,?,?,?,?)",(rid,new,CATALOG_DIGEST,canonical(n),x["action"],x["reason_code"]))
            finish_revision(c,rid,rev,new,s.actor_id,act,now,x["command_id"],fingerprint)
            out=self._receipt(rid,new,False);c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def view_inventory(self,record_id,resolve_demo_session):
        self._guard();c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);r=self._inv_record(record_id);rev=r["current_revision"];state,n=self._inv_revision(record_id,rev)
            self._read_policy(s,r,state,rev)
            actions=[]
            for action in sorted(ACTIONS):
                try:self._action_policy(s,r,state,n,action)
                except Denied:continue
                if action=="copy_prior":
                    if rev!=0:continue
                    try:self._copy_prior(r)
                    except Denied:continue
                if action in ("confirm_item","confirm_group") and not any(not x["confirmed"] for x in n["rows"].values()):continue
                if action=="submit" and summary(n)["confirmed"]!=len(INDEX):continue
                actions.append(action)
            out={"record_id":r["id"],"facility_id":r["facility_id"],"year":r["year"],"catalog_version":VERSION,"revision":rev,"state":state if rev else "NOT_STARTED","candidate_actions":actions,"catalog":{"groups":CATALOG["groups"],"items":CATALOG["items"],"official_verified":False},
                 "rows":n["rows"],"copied_from":n["copied_from"],"county_review_recorded":n["county_reviewer"] is not None,**summary(n),"synthetic":True,"persistent":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
