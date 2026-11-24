"""K4-A9 | CODE_ONLY. Host-only synthetic session issuance; no password or HTTP login.
AccountStore enforces an instance-bound resolver for all inherited operations.
Do not expose issuance or access administration to browser input.
"""
import hashlib
import json
import re
import secrets
import time
from pathlib import Path
from api_projections import ProjectionStore
from apel_store import canonical,digest
from apel_payload import require,match
from contract import ACTOR
from account_payload import intent,valid_time,session_live,TTL_SECONDS
from handoff_payload import proposal as handoff_proposal, acceptance as handoff_acceptance, timely as handoff_timely, TTL as HANDOFF_TTL
TOKEN=re.compile(r"[A-Za-z0-9_-]{43}")
def token_digest(token):
    require(isinstance(token,str) and TOKEN.fullmatch(token) is not None,"DEMO_SESSION_INVALID")
    return hashlib.sha256(token.encode("ascii")).hexdigest()
class _Resolver:
    __slots__=("store","_digest")
    def __init__(self,store,token):
        self.store=store;self._digest=token_digest(token)
    def __call__(self):
        return self.store._resolve_digest(self._digest)
class AccountStore(ProjectionStore):
    def __init__(self,clock=None):
        super().__init__()
        self._clock=clock if clock is not None else lambda:int(time.time())
        c=self._db
        try:
            require(callable(self._clock),"CLOCK_INVALID")
            c.executescript((Path(__file__).resolve().parent/"account_payload.sql").read_text("utf-8"))
            c.executescript((Path(__file__).resolve().parent/"handoff_payload.sql").read_text("utf-8"))
            c.execute("BEGIN IMMEDIATE")
            for name,role in (("ADMIN","provinsi_admin"),("LEADER","pimpinan")):
                actor="DEMO-ACTOR-"+name
                c.execute("INSERT INTO contract_actor VALUES(?,1)",(actor,))
                c.execute("INSERT INTO contract_grant VALUES(?,?,?,?,NULL,NULL,1)",("DEMO-GRANT-"+name,actor,role,"province"))
            c.execute("INSERT INTO contract_account_head SELECT id,0 FROM contract_actor")
            c.execute("COMMIT")
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            self.close();raise
    def _now(self):return valid_time(self._clock())
    def _resolve_digest(self,hashed):
        # Called inside the inherited operation's transaction, not pre-authorized once.
        require(self._db.in_transaction,"DEMO_SESSION_INVALID")
        row=self._db.execute("SELECT s.* FROM contract_demo_session s JOIN contract_grant g ON g.id=s.grant_id AND g.actor_id=s.actor_id JOIN contract_actor a ON a.id=s.actor_id WHERE s.token_digest=? AND g.active=1 AND a.active=1",(hashed,)).fetchone()
        require(row is not None and session_live(row["issued_epoch"],row["expires_epoch"],row["revoked_epoch"],self._now()),"DEMO_SESSION_INVALID")
        return {"actor_id":row["actor_id"],"grant_id":row["grant_id"]}
    def _session(self,resolver):
        require(type(resolver) is _Resolver and resolver.store is self,"DEMO_SESSION_INVALID")
        return super()._session(resolver)
    def session_resolver(self,token):
        return _Resolver(self,token)
    def issue_demo_session(self,resolve_trusted_fixture):
        """Host only: trusted fixture identity callback, NOT proof of real authentication."""
        self._guard();c=self._db;c.execute("BEGIN IMMEDIATE")
        try:
            s=super()._session(resolve_trusted_fixture)
            # super()._session verifies the host callback and returns actor/scope.
            # Use exactly one active grant; no client-supplied role or scope.
            grants=c.execute("SELECT id FROM contract_grant WHERE actor_id=? AND active=1",(s.actor_id,)).fetchall()
            require(len(grants)==1,"GRANT_AMBIGUOUS")
            now=self._now();raw=secrets.token_urlsafe(32);sid="DEMO-SESSION-"+secrets.token_hex(16).upper()
            c.execute("INSERT INTO contract_demo_session VALUES(?,?,?,?,?,?,NULL)",(sid,token_digest(raw),s.actor_id,grants[0][0],now,now+TTL_SECONDS))
            c.execute("INSERT INTO contract_session_event(session_id,event,recorded_epoch) VALUES(?,'ISSUED_DEMO',?)",(sid,now))
            c.execute("COMMIT")
            # Raw handle returned to trusted in-process host only, not a JSON API response.
            return raw
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def _revoke_sessions(self,actor,grant,now,event):
        c=self._db
        rows=c.execute("SELECT id,issued_epoch FROM contract_demo_session WHERE actor_id=? AND revoked_epoch IS NULL AND (? IS NULL OR grant_id=?)",(actor,grant,grant)).fetchall()
        for row in rows:
            require(now>=row["issued_epoch"],"CLOCK_REVERSED")
            c.execute("UPDATE contract_demo_session SET revoked_epoch=? WHERE id=?",(now,row["id"]))
            c.execute("INSERT INTO contract_session_event(session_id,event,recorded_epoch) VALUES(?,?,?)",(row["id"],event,now))
    def logout(self,token):
        self._guard();hashed=token_digest(token);c=self._db;c.execute("BEGIN IMMEDIATE")
        try:
            row=c.execute("SELECT id,issued_epoch,revoked_epoch FROM contract_demo_session WHERE token_digest=?",(hashed,)).fetchone()
            if row is not None and row["revoked_epoch"] is None:
                now=self._now();require(now>=row["issued_epoch"],"CLOCK_REVERSED")
                c.execute("UPDATE contract_demo_session SET revoked_epoch=? WHERE id=?",(now,row["id"]))
                c.execute("INSERT INTO contract_session_event(session_id,event,recorded_epoch) VALUES(?,'LOGOUT_DEMO',?)",(row["id"],now))
            c.execute("COMMIT")
            return {"logged_out_demo":True,"official_authorization":False}
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def _account(self,actor):
        r=self._db.execute("SELECT a.active,h.revision FROM contract_actor a JOIN contract_account_head h ON h.actor_id=a.id WHERE a.id=?",(actor,)).fetchone()
        if r is None:return None
        grants=[dict(g) for g in self._db.execute("SELECT id,role,scope_kind,region_id,facility_id,active FROM contract_grant WHERE actor_id=? ORDER BY id",(actor,))]
        return {"actor_id":actor,"active":bool(r["active"]),"revision":r["revision"],"grants":grants}
    def _admin(self,resolver):
        s=self._session(resolver);require(s.role=="provinsi_admin","ADMIN_DENIED");return s
    def manage_access(self,raw,resolver):
        """Explicit host-only administrative command; intentionally no HTTP route."""
        self._guard();x=intent(raw);c=self._db;c.execute("BEGIN IMMEDIATE")
        try:
            admin=self._admin(resolver);target=x["target_actor_id"];a=x["action"];p=x["payload"]
            require(target!=admin.actor_id,"SELF_MANAGEMENT_DENIED")
            require(c.execute("SELECT 1 FROM contract_grant WHERE actor_id=? AND role='provinsi_admin'",(target,)).fetchone() is None,"ADMIN_TARGET_DENIED")
            fingerprint=digest({"actor":admin.actor_id,"command":x})
            old=c.execute("SELECT * FROM contract_access_command WHERE administrator_id=? AND command_id=?",(admin.actor_id,x["command_id"])).fetchone()
            if old is not None:
                require(old["actor_id"]==target and old["request_digest"]==fingerprint,"IDEMPOTENCY_CONFLICT")
                out={"actor_id":target,"revision":old["result_revision"],"replay_demo":True,"official_authorization":False};c.execute("COMMIT");return out
            before=self._account(target);rev=before["revision"] if before else 0
            require(rev==x["expected_revision"],"REVISION_CONFLICT");now=self._now()
            if a=="register":
                require(before is None,"ACCOUNT_EXISTS")
                c.execute("INSERT INTO contract_actor VALUES(?,1)",(target,))
                c.execute("INSERT INTO contract_account_head VALUES(?,0)",(target,))
            else:
                require(before is not None,"ACCOUNT_NOT_AVAILABLE")
                if a=="grant":
                    require(before["active"] and not any(g["active"] for g in before["grants"]),"ACTIVE_GRANT_EXISTS_OR_DISABLED")
                    role=p["role"];f=p["facility_id"];r=p["region_id"]
                    if role=="puskeswan":
                        r=self._facility(f)["region_id"];scope="facility"
                    elif role=="kab_kota":
                        require(c.execute("SELECT 1 FROM contract_region WHERE id=?",(r,)).fetchone() is not None,"REGION_INVALID");scope="region"
                    else:scope="province"
                    require(c.execute("SELECT 1 FROM contract_grant WHERE id=?",(p["grant_id"],)).fetchone() is None,"GRANT_ID_EXISTS")
                    c.execute("INSERT INTO contract_grant VALUES(?,?,?,?,?,?,1)",(p["grant_id"],target,role,scope,r,f))
                elif a=="revoke_grant":
                    require(c.execute("UPDATE contract_grant SET active=0 WHERE id=? AND actor_id=? AND active=1",(p["grant_id"],target)).rowcount==1,"GRANT_NOT_AVAILABLE")
                    self._revoke_sessions(target,p["grant_id"],now,"ACCESS_REVOKED_DEMO")
                elif a=="disable":
                    require(before["active"],"ACCOUNT_ALREADY_DISABLED")
                    c.execute("UPDATE contract_actor SET active=0 WHERE id=?",(target,))
                    c.execute("UPDATE contract_grant SET active=0 WHERE actor_id=? AND active=1",(target,))
                    self._revoke_sessions(target,None,now,"ACCESS_REVOKED_DEMO")
                else:
                    require(not before["active"],"ACCOUNT_ALREADY_ACTIVE")
                    c.execute("UPDATE contract_actor SET active=1 WHERE id=?",(target,))
            n=rev+1
            require(c.execute("UPDATE contract_account_head SET revision=? WHERE actor_id=? AND revision=?",(n,target,rev)).rowcount==1,"REVISION_CONFLICT")
            after=self._account(target)
            c.execute("INSERT INTO contract_access_event VALUES(?,?,?,?,?,?,?,?)",(target,n,admin.actor_id,a,x["reason_code"],canonical(before),canonical(after),now))
            c.execute("INSERT INTO contract_access_command VALUES(?,?,?,?,?)",(admin.actor_id,x["command_id"],fingerprint,target,n))
            out={"actor_id":target,"revision":n,"replay_demo":False,"official_authorization":False};c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def account_history(self,actor_id,resolver):
        self._guard();require(match(ACTOR,actor_id),"ACTOR_INVALID");c=self._db;c.execute("BEGIN")
        try:
            self._admin(resolver);current=self._account(actor_id);require(current is not None,"ACCOUNT_NOT_AVAILABLE")
            events=[{"revision":r["revision"],"action":r["action"],"reason_code":r["reason_code"],"before":json.loads(r["before_json"]),"after":json.loads(r["after_json"]),"recorded_epoch":r["recorded_epoch"]} for r in c.execute("SELECT * FROM contract_access_event WHERE actor_id=? ORDER BY revision DESC LIMIT 100",(actor_id,))]
            out={"account":current,"events":events,"synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise

    def _handoff_snapshot(self,p):
        """Caller owns transaction and authorization; no client-supplied record list."""
        c=self._db;fid=p["facility_id"];f=self._facility(fid)
        old=self._account(p["outgoing_actor_id"]);new=self._account(p["incoming_actor_id"])
        require(old is not None and new is not None and old["active"] and new["active"],"ACCOUNT_NOT_AVAILABLE")
        old_active=[g for g in old["grants"] if g["active"]]
        require(len(old_active)==1 and old_active[0]["role"]=="puskeswan" and old_active[0]["facility_id"]==fid and old_active[0]["region_id"]==f["region_id"],"OUTGOING_GRANT_INVALID")
        require(not any(g["active"] for g in new["grants"]),"INCOMING_GRANT_EXISTS")
        require(not any(g["role"]=="provinsi_admin" for g in new["grants"]+old["grants"]),"ADMIN_TARGET_DENIED")
        require(c.execute("SELECT 1 FROM contract_grant WHERE id=?",(p["new_grant_id"],)).fetchone() is None,"GRANT_ID_EXISTS")
        # First rehearsal uses one responsible account per facility, no shared grant.
        grants=c.execute("SELECT id,actor_id FROM contract_grant WHERE active=1 AND facility_id=? ORDER BY id",(fid,)).fetchall()
        require(len(grants)==1 and grants[0]["id"]==old_active[0]["id"],"FACILITY_GRANT_AMBIGUOUS")
        records=[dict(x) for x in c.execute("SELECT id,resource,owner_id,current_revision FROM contract_record WHERE facility_id=? ORDER BY id",(fid,))]
        require(records and all(x["owner_id"]==old["actor_id"] for x in records),"RECORD_OWNER_MIXED")
        return {"proposal":p,"old_account":old,"new_account":new,"old_grant_id":old_active[0]["id"],"region_id":f["region_id"],"records":records}
    def _handoff_row(self,hid):
        row=self._db.execute("SELECT * FROM contract_handoff_proposal WHERE id=?",(hid,)).fetchone()
        require(row is not None,"HANDOFF_NOT_AVAILABLE")
        snap=json.loads(row["snapshot_json"])
        require(digest(snap)==row["snapshot_digest"],"HANDOFF_DIGEST_INVALID")
        return row,snap
    def prepare_handoff(self,raw,resolver):
        """Verifier records a scoped DEMO review; does not alter responsibility."""
        self._guard();p=handoff_proposal(raw);c=self._db;c.execute("BEGIN IMMEDIATE")
        try:
            s=self._session(resolver);require(s.role=="provinsi_verifikator","REVIEWER_DENIED")
            require(s.actor_id not in (p["outgoing_actor_id"],p["incoming_actor_id"]),"SEPARATION_DENIED")
            existing=c.execute("SELECT id FROM contract_handoff_proposal WHERE id=?",(p["handoff_id"],)).fetchone()
            if existing:
                r,snap=self._handoff_row(p["handoff_id"])
                require(r["reviewer_id"]==s.actor_id and snap["proposal"]==p,"IDEMPOTENCY_CONFLICT")
                out={"handoff_id":r["id"],"snapshot_digest":r["snapshot_digest"],"record_count":len(snap["records"]),"expires_epoch":r["proposed_epoch"]+HANDOFF_TTL,"replay_demo":True,"official_authorization":False}
            else:
                snap=self._handoff_snapshot(p);h=digest(snap);now=self._now()
                grants=c.execute("SELECT id FROM contract_grant WHERE actor_id=? AND active=1 AND role='provinsi_verifikator'",(s.actor_id,)).fetchall()
                require(len(grants)==1,"REVIEWER_GRANT_INVALID")
                c.execute("INSERT INTO contract_handoff_proposal VALUES(?,?,?,?,?,?,?,?,?)",(p["handoff_id"],p["facility_id"],p["outgoing_actor_id"],p["incoming_actor_id"],s.actor_id,grants[0][0],now,canonical(snap),h))
                out={"handoff_id":p["handoff_id"],"snapshot_digest":h,"record_count":len(snap["records"]),"expires_epoch":now+HANDOFF_TTL,"replay_demo":False,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def _handoff_account_event(self,before,admin,action,now):
        c=self._db;actor=before["actor_id"];rev=before["revision"]
        require(c.execute("UPDATE contract_account_head SET revision=? WHERE actor_id=? AND revision=?",(rev+1,actor,rev)).rowcount==1,"REVISION_CONFLICT")
        c.execute("INSERT INTO contract_access_event VALUES(?,?,?,?,?,?,?,?)",(actor,rev+1,admin,action,"CHANGE_DUTY_DEMO",canonical(before),canonical(self._account(actor)),now))
        return rev+1
    def accept_handoff(self,raw,resolver):
        """Separate admin executes pinned review atomically; host only."""
        self._guard();x=handoff_acceptance(raw);c=self._db;c.execute("BEGIN IMMEDIATE")
        try:
            admin=self._admin(resolver);r,snap=self._handoff_row(x["handoff_id"]);p=snap["proposal"];hid=r["id"]
            require(admin.actor_id not in (r["reviewer_id"],p["outgoing_actor_id"],p["incoming_actor_id"]),"SEPARATION_DENIED")
            require(x["expected_digest"]==r["snapshot_digest"],"HANDOFF_DIGEST_CONFLICT")
            receipt=c.execute("SELECT * FROM contract_handoff_receipt WHERE handoff_id=?",(hid,)).fetchone()
            if receipt:
                require(receipt["administrator_id"]==admin.actor_id and receipt["snapshot_digest"]==x["expected_digest"],"IDEMPOTENCY_CONFLICT")
                out={"handoff_id":hid,"record_count":receipt["record_count"],"replay_demo":True,"official_authorization":False};c.execute("COMMIT");return out
            now=self._now();require(handoff_timely(r["proposed_epoch"],now),"HANDOFF_EXPIRED")
            require(c.execute("SELECT 1 FROM contract_grant g JOIN contract_actor a ON a.id=g.actor_id WHERE g.id=? AND g.actor_id=? AND g.role='provinsi_verifikator' AND g.active=1 AND a.active=1",(r["reviewer_grant_id"],r["reviewer_id"])).fetchone() is not None,"REVIEWER_REVOKED")
            current=self._handoff_snapshot(p);require(digest(current)==r["snapshot_digest"],"HANDOFF_STALE")
            old=snap["old_account"];new=snap["new_account"];oldid=old["actor_id"];newid=new["actor_id"]
            require(c.execute("UPDATE contract_grant SET active=0 WHERE id=? AND actor_id=? AND active=1",(snap["old_grant_id"],oldid)).rowcount==1,"GRANT_CONFLICT")
            self._revoke_sessions(oldid,snap["old_grant_id"],now,"ACCESS_REVOKED_DEMO")
            c.execute("INSERT INTO contract_grant VALUES(?,?,?,?,?,?,1)",(p["new_grant_id"],newid,"puskeswan","facility",snap["region_id"],p["facility_id"]))
            oldrev=self._handoff_account_event(old,admin.actor_id,"revoke_grant",now)
            newrev=self._handoff_account_event(new,admin.actor_id,"grant",now)
            c.execute("INSERT INTO contract_handoff_receipt VALUES(?,?,?,?,?,?,?)",(hid,admin.actor_id,now,len(snap["records"]),oldrev,newrev,x["expected_digest"]))
            for row in snap["records"]:
                require(c.execute("UPDATE contract_record SET owner_id=? WHERE id=? AND facility_id=? AND owner_id=? AND current_revision=?",(newid,row["id"],p["facility_id"],oldid,row["current_revision"])).rowcount==1,"HANDOFF_STALE")
                c.execute("INSERT INTO contract_handoff_record VALUES(?,?,?,?,?)",(hid,row["id"],row["current_revision"],oldid,newid))
            out={"handoff_id":hid,"record_count":len(snap["records"]),"replay_demo":False,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def handoff_history(self,facility_id,resolver):
        """Scoped admin/verifier history; never includes session handles or digests of credentials."""
        self._guard();c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolver);require(s.role in ("provinsi_admin","provinsi_verifikator"),"ACCESS_DENIED")
            self._facility(facility_id)
            rows=[dict(x) for x in c.execute("SELECT p.id,p.facility_id,p.outgoing_actor_id,p.incoming_actor_id,p.reviewer_id,p.proposed_epoch,r.administrator_id,r.accepted_epoch,r.record_count FROM contract_handoff_proposal p LEFT JOIN contract_handoff_receipt r ON r.handoff_id=p.id WHERE p.facility_id=? ORDER BY p.proposed_epoch DESC,p.id LIMIT 100",(facility_id,))]
            out={"facility_id":facility_id,"handoffs":rows,"synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
