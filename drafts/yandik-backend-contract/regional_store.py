"""K4-A6 | CODE_ONLY. Dedicated regional stream in synthetic memory only."""
import json
from datetime import datetime,timezone
from pathlib import Path
from support_store import SupportStore
from apel_store import canonical,digest
from apel_payload import require,Denied
from regional_payload import VERSION,DOMAINS,REGIONS,CHECKS,normalize,command,transition,project
SOURCE="DEMO-SOURCE-REGIONAL-REHEARSAL"
class RegionalStore(SupportStore):
    def __init__(self):
        super().__init__()
        c=self._db
        try:
            c.executescript((Path(__file__).resolve().parent/"regional_payload.sql").read_text("utf-8"))
            c.execute("BEGIN IMMEDIATE")
            c.execute("INSERT INTO contract_source VALUES(?,?,?,?,?)",(SOURCE,"NEW-REGIONAL-REHEARSAL",VERSION,digest({"schema":VERSION,"synthetic":True}),"UNVERIFIED_DEMO"))
            # Independent reviewer for reopened discussions; synthetic, not an assigned official.
            c.execute("INSERT INTO contract_actor VALUES('DEMO-ACTOR-REVIEW2',1)")
            c.execute("INSERT INTO contract_grant VALUES('DEMO-GRANT-REVIEW2','DEMO-ACTOR-REVIEW2','provinsi_verifikator','province',NULL,NULL,1)")
            for domain in DOMAINS:
                for region in REGIONS:
                    if domain=="surveillance" and region==REGIONS[1]:continue
                    c.execute("INSERT INTO contract_regional_coverage VALUES(?,?,2026,?)",(domain,region,SOURCE))
                    tag="N" if region==REGIONS[0] else "S"
                    rid=f"DEMO-REGREC-{domain.upper()}-{tag}"
                    p={"period":"2026-11"}
                    if domain in ("medicine","practice"):
                        p.update(site_ref=f"DEMO-SITE-{domain.upper()}-{tag}",kind="DISTRIBUSI_DEMO" if domain=="medicine" else "KLINIK_DEMO",
                                 checks={k:"NOT_ASSESSED_DEMO" for k in CHECKS[domain]},evidence_count=0)
                    elif domain=="surveillance":
                        p.update(location_ref="DEMO-LOCATION-N",syndrome_tag="DEMO-SYNDROME-GENERAL",report_class="SUSPECTED_UNVERIFIED_DEMO",investigation_state="NOT_STARTED_DEMO",sample_state="NOT_LOGGED_DEMO",followup_state="NOT_RECORDED_DEMO",evidence_count=0)
                    else:
                        p.update(destination_region_id=REGIONS[1] if region==REGIONS[0] else REGIONS[0],commodity_type="HEWAN_HIDUP_DEMO",checks={k:"NOT_ASSESSED_DEMO" for k in CHECKS[domain]})
                    normalize(domain,p,region)
                    c.execute("INSERT INTO contract_regional_snapshot VALUES(?,?,?,?,?,?,?,?)",(rid,domain,region,SOURCE,p["period"],VERSION,canonical(p),digest(p)))
            c.execute("COMMIT")
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            self.close();raise
    def _regional_scope(self,s,region,write=False):
        require(region in REGIONS and s.role in ("kab_kota","provinsi_verifikator","provinsi_admin"),"ACCESS_DENIED")
        require(s.role!="kab_kota" or s.region_id==region,"SCOPE_DENIED")
        if write:require(s.role in ("kab_kota","provinsi_verifikator"),"REVIEW_WRITER_DENIED")
    def _regional_row(self,rid):
        r=self._db.execute("SELECT * FROM contract_regional_snapshot WHERE id=?",(rid,)).fetchone()
        require(r is not None and r["source_id"]==SOURCE and r["schema_version"]==VERSION,"RECORD_NOT_AVAILABLE")
        return r
    def _regional_payload(self,r):
        p=json.loads(r["payload_json"])
        require(digest(p)==r["payload_digest"] and p["period"]==r["period"],"SOURCE_DIGEST_MISMATCH")
        return normalize(r["domain"],p,r["region_id"])
    def _head(self,rid):
        return self._db.execute("SELECT * FROM contract_regional_review WHERE record_id=? ORDER BY revision DESC LIMIT 1",(rid,)).fetchone()
    def _regional_actions(self,s,r,head):
        self._regional_scope(s,r["region_id"])
        if head and head["source_digest"]!=r["payload_digest"]:return []
        state=head["state"] if head else "NOT_REVIEWED"
        choices=("request_clarification",) if s.role=="kab_kota" else ("record_discussion","reopen_discussion") if s.role=="provinsi_verifikator" else ()
        out=[]
        for action in choices:
            if action=="record_discussion" and head and head["actor_id"]==s.actor_id:continue
            try:transition(state,action)
            except Denied:continue
            out.append(action)
        return out
    def _receipt_regional(self,rid,revision,replay):
        row=self._db.execute("SELECT state FROM contract_regional_review WHERE record_id=? AND revision=?",(rid,revision)).fetchone()
        require(row is not None,"RECEIPT_INVALID")
        return {"record_id":rid,"revision":revision,"review_state":row["state"],"replay_demo":replay,"source_modified":False,"official_authorization":False,"synthetic":True,"persistent":False}
    def review_regional(self,raw,resolve_demo_session):
        self._guard();x=command(raw);c=self._db;c.execute("BEGIN IMMEDIATE")
        try:
            s=self._session(resolve_demo_session);r=self._regional_row(x["record_id"]);rid=r["id"]
            self._regional_scope(s,r["region_id"],True);self._regional_payload(r)
            # Kabupaten/kota can request clarification only; provincial reviewer records or reopens discussion.
            require((s.role=="kab_kota" and x["action"]=="request_clarification") or (s.role=="provinsi_verifikator" and x["action"] in ("record_discussion","reopen_discussion")),"REVIEW_ACTION_DENIED")
            for table in ("contract_command","contract_staff_command"):
                require(c.execute("SELECT 1 FROM "+table+" WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone() is None,"IDEMPOTENCY_CONFLICT")
            fingerprint=digest({"command":x,"source":r["payload_digest"],"actor":s.actor_id,"resource":r["domain"]})
            old=c.execute("SELECT * FROM contract_regional_command WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone()
            if old is not None:
                require(old["record_id"]==rid and old["request_digest"]==fingerprint,"IDEMPOTENCY_CONFLICT")
                out=self._receipt_regional(rid,old["result_revision"],True);c.execute("COMMIT");return out
            head=self._head(rid);rev=head["revision"] if head else 0
            require(rev==x["expected_revision"],"REVISION_CONFLICT")
            if head:
                require(head["source_digest"]==r["payload_digest"],"SOURCE_CHANGED")
                if x["action"]=="record_discussion":require(head["actor_id"]!=s.actor_id,"SEPARATION_REQUIRED")
            state=transition(head["state"] if head else "NOT_REVIEWED",x["action"])
            n=rev+1
            c.execute("INSERT INTO contract_regional_review VALUES(?,?,?,?,?,?,?,?)",(rid,n,s.actor_id,r["payload_digest"],x["action"],x["reason_code"],state,datetime.now(timezone.utc).isoformat()))
            c.execute("INSERT INTO contract_regional_command VALUES(?,?,?,?,?)",(s.actor_id,x["command_id"],fingerprint,rid,n))
            out=self._receipt_regional(rid,n,False);c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def regional_register(self,domain,region,year,resolve_demo_session):
        self._guard();require(domain in DOMAINS and type(year) is int and 2026<=year<=2030,"FILTER_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);self._regional_scope(s,region)
            coverage=c.execute("SELECT source_id FROM contract_regional_coverage WHERE domain=? AND region_id=? AND year=?",(domain,region,year)).fetchone()
            rows=None
            if coverage:
                require(coverage[0]==SOURCE,"SOURCE_INVALID")
                rows=[]
                for r in c.execute("SELECT * FROM contract_regional_snapshot WHERE domain=? AND region_id=? AND substr(period,1,4)=? ORDER BY id",(domain,region,str(year))).fetchall():
                    p=self._regional_payload(r);head=self._head(r["id"])
                    rows.append({"record_id":r["id"],"source_digest":r["payload_digest"],"observation":project(domain,p),"review_revision":head["revision"] if head else 0,"review_state":head["state"] if head else "NOT_REVIEWED","candidate_actions":self._regional_actions(s,r,head)})
            out={"domain":domain,"region_id":region,"year":year,"available":coverage is not None,"rows":rows,"record_count_demo":len(rows) if rows is not None else None,"synthetic":True,"source_read_only":True,"official_authorization":False,"may_publish":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def regional_history(self,record_id,resolve_demo_session):
        self._guard();c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);r=self._regional_row(record_id);self._regional_scope(s,r["region_id"]);self._regional_payload(r)
            out=[dict(v) for v in c.execute("SELECT revision,action,reason_code,state,recorded_at_utc FROM contract_regional_review WHERE record_id=? ORDER BY revision DESC LIMIT 100",(record_id,))]
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
