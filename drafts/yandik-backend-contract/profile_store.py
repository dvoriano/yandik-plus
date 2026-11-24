"""K4-A3 | CODE_ONLY. Profile per section, one shared synthetic memory store.
No auth/HTTP/migration or actual data. Existing source records are never edited here.
"""
from datetime import datetime,timezone
from pathlib import Path
from revision_envelope import start_revision,finish_revision
import json
from inventory_store import InventoryStore, VERSION as INVENTORY_VERSION
from inventory_payload import summary as inventory_summary
from apel_store import canonical,digest,CMD,REC
from apel_payload import require,exact,match
from contract import Record,plan_access
from profile_payload import SECTIONS,YEARS,VERSION,normalize,coverage
SOURCE="DEMO-SOURCE-PROFILE"
ACTIONS={"save_draft","submit","return_correction","record_review","reopen"}
REASONS={"CHECK_REFERENCE_DEMO","CHECK_READINESS_DEMO","UPDATE_PROFILE_DEMO"}

def validate_intent(x):
    require(exact(x,("command_id","record_id","expected_revision","action","payload","reason_code")) and match(CMD,x["command_id"]) and match(REC,x["record_id"]) and type(x["expected_revision"]) is int and 0<=x["expected_revision"]<10000 and isinstance(x["action"],str) and x["action"] in ACTIONS,"INTENT_INVALID")
    a=x["action"];p=x["payload"];reason=x["reason_code"]
    require(type(p) is dict if a=="save_draft" else p is None,"PAYLOAD_INVALID")
    require(isinstance(reason,str) and reason in REASONS if a in ("return_correction","reopen") else reason is None,"REASON_INVALID")
    return x

class ProfileStore(InventoryStore):
    def __init__(self):
        super().__init__()
        c=self._db
        try:
            c.executescript((Path(__file__).resolve().parent/"profile_payload.sql").read_text("utf-8"))
            c.execute("BEGIN IMMEDIATE")
            c.execute("INSERT INTO contract_source VALUES(?,?,?,?,?)",(SOURCE,"M02-PROFILE-REHEARSAL",VERSION,digest({"schema":VERSION,"sections":SECTIONS}),"UNVERIFIED_DEMO"))
            for name,reg in (("ALPHA","UTARA"),("BETA","UTARA"),("GAMMA","SELATAN")):
                f="DEMO-PSW-"+name
                for year in YEARS:
                    for section in SECTIONS:
                        rid=f"DEMO-REC-PROF-{name}-{year}-{section.upper()}"
                        c.execute("INSERT INTO contract_record VALUES(?,?,?,?,?,0,?)",(rid,"profiles",f,"DEMO-REGION-"+reg,f"{year}|{section}","DEMO-ACTOR-"+name))
                        c.execute("INSERT INTO contract_profile_section VALUES(?,?,?,?,?)",(rid,f,year,section,VERSION))
            c.execute("COMMIT")
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            self.close();raise

    def _profile_record(self,rid):
        r=self._db.execute("SELECT r.*,p.year,p.section,p.schema_version FROM contract_record r JOIN contract_profile_section p ON p.record_id=r.id AND p.facility_id=r.facility_id WHERE r.id=? AND r.resource='profiles'",(rid,)).fetchone()
        require(r is not None and r["schema_version"]==VERSION and r["business_key"]==f'{r["year"]}|{r["section"]}',"RECORD_NOT_AVAILABLE")
        return r

    def _profile_revision(self,r,rev):
        if rev==0:return "DRAFT",None
        row=self._db.execute("SELECT r.state,r.source_id,r.payload_digest,p.schema_version,p.payload_json FROM contract_revision r JOIN contract_profile_payload p USING(record_id,revision) WHERE r.record_id=? AND r.revision=?",(r["id"],rev)).fetchone()
        require(row is not None and row["source_id"]==SOURCE and row["schema_version"]==VERSION,"REVISION_SOURCE_INVALID")
        payload=json.loads(row["payload_json"])
        require(digest(payload)==row["payload_digest"],"PAYLOAD_DIGEST_MISMATCH")
        return row["state"],normalize(r["section"],payload,r["year"])

    def _profile_policy(self,s,r,state,rev,action,expected=None):
        record=Record(r["id"],"profiles",r["region_id"],r["facility_id"],r["owner_id"],state,rev)
        if action=="reopen":
            result=plan_access(s,record,"read")
            require(result["candidate"] and s.role=="provinsi_verifikator" and s.actor_id!=r["owner_id"] and state=="RECORDED_DEMO" and expected==rev,"REOPEN_DENIED")
            return "CORRECTION"
        result=plan_access(s,record,action,expected)
        require(result["candidate"],result["reason"])
        return result["next_state"]

    def apply_profile(self,command,resolve_demo_session):
        self._guard();x=validate_intent(command);c=self._db
        c.execute("BEGIN IMMEDIATE")
        try:
            s=self._session(resolve_demo_session);r=self._profile_record(x["record_id"]);rid=r["id"];rev=r["current_revision"]
            state,prior=self._profile_revision(r,rev);self._profile_policy(s,r,state,rev,"read")
            action=x["action"]
            payload=normalize(r["section"],x["payload"],r["year"]) if action=="save_draft" else None
            fingerprint=digest({"resource":"profiles","version":VERSION,"actor":s.actor_id,"command":{**x,"payload":payload}})
            self._command_namespace_guard(s.actor_id,x["command_id"])
            old=c.execute("SELECT * FROM contract_command WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone()
            if old is not None:
                require(old["record_id"]==rid and old["request_digest"]==fingerprint,"IDEMPOTENCY_CONFLICT")
                before=old["result_revision"]-1;old_state,_=self._profile_revision(r,before)
                self._profile_policy(s,r,old_state,before,action,x["expected_revision"])
                out=self._receipt(rid,old["result_revision"],True);c.execute("COMMIT");return out
            require(x["expected_revision"]==rev,"REVISION_CONFLICT")
            next_state=self._profile_policy(s,r,state,rev,action,rev)
            if action!="save_draft":
                require(prior is not None,"DRAFT_REQUIRED");payload=prior
            core_action="return_correction" if action=="reopen" else action
            n,now=start_revision(c,rid,rev,SOURCE,s.actor_id,core_action,next_state,payload)
            c.execute("INSERT INTO contract_profile_payload VALUES(?,?,?,?,?,?)",(rid,n,VERSION,canonical(payload),action,x["reason_code"]))
            finish_revision(c,rid,rev,n,s.actor_id,core_action,now,x["command_id"],fingerprint)
            out=self._receipt(rid,n,False);c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise

    def _section_view(self,s,r):
        rev=r["current_revision"];state,payload=self._profile_revision(r,rev)
        self._profile_policy(s,r,state,rev,"read")
        reviewed=self._db.execute("SELECT MAX(revision) FROM contract_revision WHERE record_id=? AND state='RECORDED_DEMO'",(r["id"],)).fetchone()[0]
        previous=None
        if reviewed is not None:
            _,old=self._profile_revision(r,reviewed)
            previous={"revision":reviewed,"payload":old,"current":reviewed==rev,"official_authorization":False}
        return {"record_id":r["id"],"section":r["section"],"revision":rev,"state":state if rev else "NOT_STARTED","payload":payload,"last_recorded_demo":previous}

    def _support_refs(self,s,facility_id,year):
        # This hook returns only new rehearsal cases; never infer M04 crosswalk.
        if not self._db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='contract_support_case'").fetchone():return None
        return [dict(r) for r in self._db.execute("SELECT record_id,item_id FROM contract_support_case WHERE facility_id=? AND year=? ORDER BY item_id",(facility_id,year))]
    def _sdm_summary(self,s,facility_id,year):
        return {"status":"SOURCE_UNAVAILABLE","doctors":None,"paramedics":None}

    def view_profile(self,facility_id,year,resolve_demo_session):
        self._guard();require(type(year) is int and year in YEARS,"YEAR_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session)
            ids=c.execute("SELECT record_id FROM contract_profile_section WHERE facility_id=? AND year=?",(facility_id,year)).fetchall()
            require(len(ids)==len(SECTIONS),"PROFILE_NOT_AVAILABLE")
            recs=[self._profile_record(x[0]) for x in ids]
            views={r["section"]:self._section_view(s,r) for r in recs}
            sections=[views[k] for k in SECTIONS]
            f=c.execute("SELECT id,label,region_id FROM contract_facility WHERE id=?",(facility_id,)).fetchone()
            # Resolve exact facility-year inventory source; never copy its observations.
            inv=c.execute("SELECT record_id FROM contract_inventory_year WHERE facility_id=? AND year=? AND catalog_version=?",(facility_id,year,INVENTORY_VERSION)).fetchone()
            inventory={"status":"SOURCE_UNAVAILABLE","confirmed":None,"total":None,"attention":None}
            if inv:
                r=self._inv_record(inv[0]);rev=r["current_revision"];st,snap=self._inv_revision(r["id"],rev)
                self._read_policy(s,r,st,rev)
                inventory={"status":st if rev else "NOT_STARTED","record_id":r["id"],"revision":rev,**inventory_summary(snap)}
            # APEL here is workflow, not observed service ledger. No totals calculated.
            reports=c.execute("SELECT r.id,r.current_revision,p.month FROM contract_apel_period p JOIN contract_record r ON r.id=p.record_id AND r.facility_id=p.facility_id WHERE p.facility_id=? AND p.year=? AND r.resource='apel' ORDER BY p.month",(facility_id,year)).fetchall()
            workflow=[]
            for row in reports:
                ar,_=self._record(row["id"]);ast,_=self._revision(row["id"],row["current_revision"])
                self._policy(s,ar,ast,row["current_revision"],"read",None)
                workflow.append({"record_id":row["id"],"month":row["month"],"revision":row["current_revision"],"state":ast if row["current_revision"] else "NOT_STARTED_DEMO"})
            out={"facility":dict(f),"year":year,"schema_version":VERSION,"sections":sections,"coverage":coverage(sections),
                 "inventory":inventory,"apel":{"workflow_refs":workflow,"ledger_status":"SOURCE_UNAVAILABLE","observed_service_total":None},
                 "sdm":self._sdm_summary(s,facility_id,year),
                 "support_refs":self._support_refs(s,facility_id,year),
                 "problems":{"status":"SEPARATE_REGISTER_PENDING"},"synthetic":True,"persistent":False,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise

    def profile_history(self,record_id,resolve_demo_session):
        self._guard();c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);r=self._profile_record(record_id);self._section_view(s,r)
            rows=c.execute("SELECT p.revision,p.domain_action,p.reason_code,r.recorded_at_utc FROM contract_profile_payload p JOIN contract_revision r USING(record_id,revision) WHERE p.record_id=? ORDER BY p.revision DESC LIMIT 100",(record_id,)).fetchall()
            out=[]
            for x in rows:
                state,payload=self._profile_revision(r,x["revision"])
                out.append({**dict(x),"state":state,"payload":payload})
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
