"""K4-A1 | untested synthetic APEL workflow rehearsal.

Only private disposable SQLite :memory: store, no file DB argument, no HTTP.
Candidate policy remains may_execute=False for any real operation.
Do not attach to Flask or use for real data. Domain transitions are a subset
of M05-1, not a replacement or a ledger synchronization.
"""
import hashlib
import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from contract import Session, Record, plan_access, ACTOR
from apel_payload import Denied, require, exact, match, normalize
CMD=re.compile(r"DEMO-COMMAND-[A-Z0-9_-]{1,40}")
REC=re.compile(r"DEMO-REC-[A-Z0-9_-]{1,60}")
GRANT=re.compile(r"DEMO-GRANT-[A-Z0-9_-]{1,40}")
SOURCE="DEMO-SOURCE-APEL-WORKFLOW"
KEYS=("command_id","record_id","expected_revision","action","payload","reason_code")
ACTIONS={"save_draft","submit","return_correction","record_review"}
REASONS={"return_correction":{"CHECK_COUNTS_DEMO","CHECK_ACTIVITY_DEMO"},"record_review":{"REVIEW_RECORDED_DEMO"}}
def canonical(x): return json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False)
def digest(x): return hashlib.sha256(canonical(x).encode("utf-8")).hexdigest()
def intent(x):
    require(exact(x,KEYS) and match(CMD,x["command_id"]) and match(REC,x["record_id"])
            and type(x["expected_revision"]) is int and 0<=x["expected_revision"]<10000
            and isinstance(x["action"],str) and x["action"] in ACTIONS,"INTENT_INVALID")
    action=x["action"]
    if action=="save_draft":
        require(type(x["payload"]) is dict and x["reason_code"] is None,"INTENT_PAYLOAD")
    else:
        require(x["payload"] is None,"INTENT_PAYLOAD")
        reason=x["reason_code"]
        require((isinstance(reason,str) and reason in REASONS[action]) if action in REASONS else reason is None,"REASON_INVALID")
    return x
class DemoStore:
    def __init__(self):
        self._db=sqlite3.connect(":memory:",isolation_level=None)
        self._db.row_factory=sqlite3.Row
        try:
            base=Path(__file__).resolve().parent
            self._db.executescript((base/"schema.sql").read_text("utf-8"))
            self._db.executescript((base/"apel_payload.sql").read_text("utf-8"))
            self._guard()
            self._seed()
        except BaseException:
            self._db.close()
            raise
    def close(self): self._db.close()
    def _guard(self):
        dbs=list(self._db.execute("PRAGMA database_list"))
        require(len(dbs)==1 and dbs[0][1]=="main" and not dbs[0][2],"DISK_OR_ATTACHED_DB_DENIED")
        require(self._db.execute("PRAGMA foreign_keys").fetchone()[0]==1,"FOREIGN_KEYS_REQUIRED")
        require(not self._db.in_transaction,"CALLER_TRANSACTION_DENIED")
    def _seed(self):
        c=self._db
        c.execute("BEGIN IMMEDIATE")
        try:
            for code in ("UTARA","SELATAN"):
                c.execute("INSERT INTO contract_region VALUES(?,?)",("DEMO-REGION-"+code,"Wilayah DEMO "+code))
            for name,reg in (("ALPHA","UTARA"),("GAMMA","SELATAN")):
                f="DEMO-PSW-"+name;r="DEMO-REGION-"+reg;u="DEMO-ACTOR-"+name
                c.execute("INSERT INTO contract_facility VALUES(?,?,?)",(f,r,"Puskeswan DEMO "+name))
                c.execute("INSERT INTO contract_actor VALUES(?,1)",(u,))
                c.execute("INSERT INTO contract_grant VALUES(?,?,?,?,?,?,1)",("DEMO-GRANT-"+name,u,"puskeswan","facility",r,f))
                rec="DEMO-REC-"+name
                c.execute("INSERT INTO contract_record VALUES(?,?,?,?,?,0,?)",(rec,"apel",f,r,"2026-11",u))
                c.execute("INSERT INTO contract_apel_period VALUES(?,?,2026,11)",(rec,f))
            c.execute("INSERT INTO contract_actor VALUES('DEMO-ACTOR-REVIEW',1)")
            c.execute("INSERT INTO contract_grant VALUES('DEMO-GRANT-REVIEW','DEMO-ACTOR-REVIEW','provinsi_verifikator','province',NULL,NULL,1)")
            c.execute("INSERT INTO contract_source VALUES(?,?,?,?,?)",(SOURCE,"M05-WORKFLOW-REHEARSAL","DEMO-1",digest({"synthetic":True,"namespace":"M05-WORKFLOW-REHEARSAL"}),"UNVERIFIED_DEMO"))
            c.execute("COMMIT")
        except BaseException:
            c.execute("ROLLBACK");raise
    def _session(self,resolve_demo_session):
        require(callable(resolve_demo_session),"DEMO_SESSION_REQUIRED")
        s=resolve_demo_session()
        require(exact(s,("actor_id","grant_id")) and match(ACTOR,s["actor_id"]) and match(GRANT,s["grant_id"]),"DEMO_SESSION_INVALID")
        row=self._db.execute("SELECT g.* FROM contract_grant g JOIN contract_actor a ON a.id=g.actor_id WHERE g.id=? AND g.actor_id=? AND g.active=1 AND a.active=1",(s["grant_id"],s["actor_id"])).fetchone()
        require(row is not None,"ACCESS_DENIED")
        return Session(row["actor_id"],row["role"],row["region_id"],row["facility_id"],True)
    def _record(self,rid):
        row=self._db.execute("SELECT r.*,p.year,p.month FROM contract_record r JOIN contract_apel_period p ON p.record_id=r.id AND p.facility_id=r.facility_id WHERE r.id=? AND r.resource='apel'",(rid,)).fetchone()
        require(row is not None,"RECORD_NOT_AVAILABLE")
        period=f'{row["year"]:04d}-{row["month"]:02d}'
        require(row["business_key"]==period,"GRAIN_MISMATCH")
        return row,period
    def _revision(self,rid,revision):
        if revision==0: return "DRAFT",None
        row=self._db.execute("SELECT r.state,r.payload_digest,r.source_id,p.payload_json FROM contract_revision r JOIN contract_apel_payload p USING(record_id,revision) WHERE r.record_id=? AND r.revision=?",(rid,revision)).fetchone()
        require(row is not None and row["source_id"]==SOURCE,"REVISION_SOURCE_MISSING")
        try: payload=json.loads(row["payload_json"])
        except (ValueError,TypeError): raise Denied("PAYLOAD_CORRUPT") from None
        require(digest(payload)==row["payload_digest"],"PAYLOAD_DIGEST_MISMATCH")
        return row["state"],payload
    def _policy(self,session,row,state,revision,action,expected):
        r=Record(row["id"],"apel",row["region_id"],row["facility_id"],row["owner_id"],state,revision)
        result=plan_access(session,r,action,expected)
        require(result["candidate"],result["reason"])
        # Candidate flag is used only inside this isolated rehearsal. It never grants production access.
        return result["next_state"]
    def _command_namespace_guard(self,actor_id,command_id):
        # StaffStore may add its own stream; older stores have no such table.
        for table in ("contract_staff_command","contract_regional_command"):
            if self._db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?",(table,)).fetchone():
                require(self._db.execute("SELECT 1 FROM "+table+" WHERE actor_id=? AND command_id=?",(actor_id,command_id)).fetchone() is None,"IDEMPOTENCY_CONFLICT")
    def _receipt(self,rid,revision,replay):
        row=self._db.execute("SELECT state FROM contract_revision WHERE record_id=? AND revision=?",(rid,revision)).fetchone()
        require(row is not None,"RECEIPT_INVALID")
        return {"record_id":rid,"revision":revision,"state":row["state"],"replay_demo":replay,
                "synthetic":True,"persistent":False,"ledger_updated":False,"official_authorization":False,"may_publish":False}
    def apply(self,command,resolve_demo_session):
        self._guard()
        x=intent(command)
        c=self._db
        c.execute("BEGIN IMMEDIATE")
        try:
            session=self._session(resolve_demo_session)
            rid=x["record_id"];row,period=self._record(rid);rev=row["current_revision"]
            state,prior=self._revision(rid,rev)
            # Enforce access before even looking up the replay receipt.
            self._policy(session,row,state,rev,"read",None)
            if x["action"]=="save_draft":
                payload=normalize(x["payload"],row["facility_id"],period)
            else:
                payload=None
            fingerprint=digest({"command":{**x,"payload":payload},"actor":session.actor_id})
            self._command_namespace_guard(session.actor_id,x["command_id"])
            old=c.execute("SELECT * FROM contract_command WHERE actor_id=? AND command_id=?",(session.actor_id,x["command_id"])).fetchone()
            if old is not None:
                require(old["record_id"]==rid and old["request_digest"]==fingerprint,"IDEMPOTENCY_CONFLICT")
                before=old["result_revision"]-1
                old_state,_=self._revision(rid,before)
                self._policy(session,row,old_state,before,x["action"],x["expected_revision"])
                receipt=self._receipt(rid,old["result_revision"],True)
                c.execute("COMMIT");return receipt
            next_state=self._policy(session,row,state,rev,x["action"],x["expected_revision"])
            if x["action"]!="save_draft":
                require(prior is not None,"DRAFT_REQUIRED")
                payload=normalize(prior,row["facility_id"],period)
            require(payload is not None,"DRAFT_REQUIRED")
            n=rev+1;now=datetime.now(timezone.utc).isoformat()
            c.execute("INSERT INTO contract_revision VALUES(?,?,?,?,?,?,?,?)",(rid,n,SOURCE,session.actor_id,x["action"],next_state,now,digest(payload)))
            c.execute("INSERT INTO contract_apel_payload VALUES(?,?,?,?)",(rid,n,canonical(payload),x["reason_code"]))
            c.execute("INSERT INTO contract_audit VALUES(?,?,?,?,?,?)",("DEMO-AUDIT-"+rid+"-"+str(n),rid,n,session.actor_id,x["action"],now))
            c.execute("INSERT INTO contract_command VALUES(?,?,?,?,?)",(session.actor_id,x["command_id"],fingerprint,rid,n))
            updated=c.execute("UPDATE contract_record SET current_revision=? WHERE id=? AND current_revision=?",(n,rid,rev))
            require(updated.rowcount==1,"REVISION_CONFLICT")
            receipt=self._receipt(rid,n,False)
            c.execute("COMMIT")
            return receipt
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def view(self,record_id,resolve_demo_session):
        self._guard()
        self._db.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session)
            r,p=self._record(record_id);rev=r["current_revision"];state,payload=self._revision(record_id,rev)
            self._policy(s,r,state,rev,"read",None)
            if payload is not None: payload=normalize(payload,r["facility_id"],p)
            result={"record_id":record_id,"facility_id":r["facility_id"],"period":p,"revision":rev,
                    "state":state if rev else "NOT_STARTED_DEMO","payload":payload,
                    "synthetic":True,"official_authorization":False,"ledger_updated":False}
            self._db.execute("COMMIT");return result
        except BaseException:
            if self._db.in_transaction:self._db.execute("ROLLBACK")
            raise
