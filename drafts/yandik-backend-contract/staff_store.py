"""K4-A4 | CODE_ONLY, no actual employee data, login or DB file.
Province reviewer records synthetic placement changes; not HR authority.
"""
import json
from datetime import datetime,timezone
from pathlib import Path
from profile_store import ProfileStore
from apel_store import canonical,digest
from apel_payload import require,match
from staff_payload import STAFF,FAC,day,intent,projection
SOURCE="DEMO-SOURCE-STAFF-REHEARSAL"
VERSION="DEMO-STAFF-DAY-EXCLUSIVE-V1"
class StaffStore(ProfileStore):
    def __init__(self):
        super().__init__()
        c=self._db
        try:
            c.executescript((Path(__file__).resolve().parent/"staff_payload.sql").read_text("utf-8"))
            c.execute("BEGIN IMMEDIATE")
            c.execute("INSERT INTO contract_source VALUES(?,?,?,?,?)",(SOURCE,"M05-15-STAFF-REHEARSAL",VERSION,digest({"schema":VERSION,"synthetic":True}),"UNVERIFIED_DEMO"))
            # Independent synthetic namespace DEMO-SDM, not automatic mapping of M05-15 IDs.
            for code,kind in (("01","dokter_hewan"),("02","paramedik"),("03","paramedik"),("04","dokter_hewan")):
                sid="DEMO-SDM-"+code
                c.execute("INSERT INTO contract_staff VALUES(?,?)",(sid,kind))
                c.execute("INSERT INTO contract_staff_head VALUES(?,0)",(sid,))
            for i,code,f,start,end in ((1,"01","ALPHA","2026-01-01","2027-07-01"),(2,"02","ALPHA","2026-02-01",None),(3,"03","BETA","2026-01-01","2027-01-01"),(4,"04","GAMMA","2026-02-01",None),(5,"01","GAMMA","2027-07-01",None)):
                c.execute("INSERT INTO contract_placement VALUES(?,?,?,?,?,?)",(f"DEMO-PLACEMENT-SEED-{i}","DEMO-SDM-"+code,"DEMO-PSW-"+f,start,end,SOURCE))
            for f,y,status in (("ALPHA",2026,"COMPLETE_DEMO"),("BETA",2026,"COMPLETE_DEMO"),("GAMMA",2026,"PARTIAL_DEMO"),("ALPHA",2027,"COMPLETE_DEMO"),("GAMMA",2027,"COMPLETE_DEMO")):
                c.execute("INSERT INTO contract_staff_coverage VALUES(?,?,?,?)",("DEMO-PSW-"+f,y,status,SOURCE))
            c.execute("COMMIT")
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            self.close();raise
    def _facility(self,fid):
        row=self._db.execute("SELECT id,region_id FROM contract_facility WHERE id=?",(fid,)).fetchone()
        require(row is not None,"FACILITY_NOT_AVAILABLE");return row
    def _facility_access(self,s,fid):
        f=self._facility(fid)
        require(s.role in ("puskeswan","kab_kota","provinsi_verifikator","provinsi_admin"),"ACCESS_DENIED")
        require(s.role!="puskeswan" or (s.facility_id==fid and s.region_id==f["region_id"]),"SCOPE_DENIED")
        require(s.role!="kab_kota" or s.region_id==f["region_id"],"SCOPE_DENIED")
    def _staff_snapshot(self,sid):
        head=self._db.execute("SELECT s.kind,h.revision FROM contract_staff s JOIN contract_staff_head h ON h.staff_id=s.id WHERE s.id=?",(sid,)).fetchone()
        if head is None:return None
        placements=[dict(x) for x in self._db.execute("SELECT id,facility_id,start_date,end_exclusive FROM contract_placement WHERE staff_id=? ORDER BY start_date",(sid,))]
        return {"kind":head["kind"],"revision":head["revision"],"placements":placements}
    def _at(self,sid,at):
        return self._db.execute("SELECT * FROM contract_placement WHERE staff_id=? AND start_date<=? AND (end_exclusive IS NULL OR end_exclusive>?)",(sid,at,at)).fetchone()
    def _policy_staff(self,s,x):
        if x["action"]=="record_competency":
            p=x["payload"];self._facility_access(s,p["facility_id"])
            require(s.role=="puskeswan","COMPETENCY_WRITER_DENIED")
            placement=self._at(x["staff_id"],p["observed_on"])
            require(placement is not None and placement["facility_id"]==p["facility_id"],"COMPETENCY_PLACEMENT_DENIED")
        else:
            require(s.role=="provinsi_verifikator","STAFF_WRITER_DENIED")
    def _receipt_staff(self,sid,rev,replay):
        return {"staff_id":sid,"revision":rev,"replay_demo":replay,"synthetic":True,"persistent":False,"official_authorization":False,"employment_status_verified":False}
    def apply_staff(self,command,resolve_demo_session):
        self._guard();x=intent(command);c=self._db
        c.execute("BEGIN IMMEDIATE")
        try:
            s=self._session(resolve_demo_session);self._policy_staff(s,x)
            sid=x["staff_id"];a=x["action"];p=x["payload"];before=self._staff_snapshot(sid)
            fingerprint=digest({"resource":"personnel","command":x,"actor":s.actor_id,"schema":VERSION})
            # Command IDs are globally reserved per actor across the common workflow
            # and personnel stream. Other rehearsal writers reserve this namespace reciprocally.
            require(c.execute("SELECT 1 FROM contract_command WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone() is None,"IDEMPOTENCY_CONFLICT")
            if c.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='contract_regional_command'").fetchone():
                require(c.execute("SELECT 1 FROM contract_regional_command WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone() is None,"IDEMPOTENCY_CONFLICT")
            old=c.execute("SELECT * FROM contract_staff_command WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone()
            if old is not None:
                require(old["staff_id"]==sid and old["request_digest"]==fingerprint,"IDEMPOTENCY_CONFLICT")
                out=self._receipt_staff(sid,old["result_revision"],True);c.execute("COMMIT");return out
            rev=before["revision"] if before else 0
            require(x["expected_revision"]==rev,"REVISION_CONFLICT")
            if a=="register":
                require(before is None,"STAFF_EXISTS")
                c.execute("INSERT INTO contract_staff VALUES(?,?)",(sid,p["kind"]))
                c.execute("INSERT INTO contract_staff_head VALUES(?,0)",(sid,))
            else:
                require(before is not None,"STAFF_NOT_AVAILABLE")
                if a in ("assign","transfer","end_assignment"):
                    effective=p["effective_on"]
                    last=before["placements"][-1] if before["placements"] else None
                    if a=="assign":
                        require(last is None or (last["end_exclusive"] is not None and last["end_exclusive"]<=effective),"ASSIGNMENT_CONFLICT")
                    else:
                        require(last is not None and last["end_exclusive"] is None and last["start_date"]<effective,"OPEN_ASSIGNMENT_REQUIRED")
                        require(c.execute("SELECT 1 FROM contract_staff_competency WHERE staff_id=? AND observed_on>=?",(sid,effective)).fetchone() is None,"COMPETENCY_HISTORY_CONFLICT")
                        if a=="transfer":require(last["facility_id"]!=p["facility_id"],"SAME_DESTINATION")
                        require(c.execute("UPDATE contract_placement SET end_exclusive=? WHERE id=? AND end_exclusive IS NULL",(effective,last["id"])).rowcount==1,"PLACEMENT_CONFLICT")
                    if a!="end_assignment":
                        self._facility(p["facility_id"])
                        c.execute("INSERT INTO contract_placement VALUES(?,?,?,?,NULL,?)",(f"DEMO-PLACEMENT-{sid}-{rev+1}",sid,p["facility_id"],effective,SOURCE))
                else:
                    require(c.execute("SELECT 1 FROM contract_staff_competency WHERE staff_id=? AND observed_on=? AND topic=?",(sid,p["observed_on"],p["topic"])).fetchone() is None,"COMPETENCY_DUPLICATE")
            n=rev+1
            require(c.execute("UPDATE contract_staff_head SET revision=? WHERE staff_id=? AND revision=?",(n,sid,rev)).rowcount==1,"REVISION_CONFLICT")
            after=self._staff_snapshot(sid)
            if a=="record_competency":after={**after,"competency":{"facility_id":p["facility_id"],"observed_on":p["observed_on"],"topic":p["topic"],"certificate_verified":False}}
            c.execute("INSERT INTO contract_staff_event VALUES(?,?,?,?,?,?,?,?)",(sid,n,s.actor_id,SOURCE,a,canonical(before),canonical(after),datetime.now(timezone.utc).isoformat()))
            if a=="record_competency":
                c.execute("INSERT INTO contract_staff_competency VALUES(?,?,?,?,?)",(sid,p["facility_id"],p["observed_on"],p["topic"],n))
            c.execute("INSERT INTO contract_staff_command VALUES(?,?,?,?,?)",(s.actor_id,x["command_id"],fingerprint,sid,n))
            out=self._receipt_staff(sid,n,False);c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def _sdm_summary(self,s,facility_id,year):
        self._facility_access(s,facility_id)
        at=f"{year}-12-31"
        cover=self._db.execute("SELECT completeness FROM contract_staff_coverage WHERE facility_id=? AND year=?",(facility_id,year)).fetchone()
        rows=self._db.execute("SELECT s.kind FROM contract_staff s JOIN contract_placement p ON p.staff_id=s.id WHERE p.facility_id=? AND p.start_date<=? AND (p.end_exclusive IS NULL OR p.end_exclusive>?)",(facility_id,at,at)).fetchall()
        return projection(cover[0] if cover else None,rows,year)
    def staff_summary(self,facility_id,year,resolve_demo_session):
        self._guard();require(type(year) is int and 2026<=year<=2030,"YEAR_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            out=self._sdm_summary(self._session(resolve_demo_session),facility_id,year)
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def staff_history(self,staff_id,resolve_demo_session):
        self._guard();require(match(STAFF,staff_id),"STAFF_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session)
            # Cross-facility detail only for synthetic province reviewer.
            require(s.role=="provinsi_verifikator","HISTORY_DENIED")
            current=self._staff_snapshot(staff_id);require(current is not None,"STAFF_NOT_AVAILABLE")
            events=[{"revision":x["revision"],"action":x["action"],"before":json.loads(x["before_json"]),"after":json.loads(x["after_json"]),"recorded_at_utc":x["recorded_at_utc"]} for x in c.execute("SELECT * FROM contract_staff_event WHERE staff_id=? ORDER BY revision DESC LIMIT 100",(staff_id,))]
            out={"staff_id":staff_id,"current":current,"events":events,"synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def staff_roster(self,facility_id,year,resolve_demo_session):
        """Scoped synthetic roster; full placement history remains province reviewer only."""
        self._guard();require(type(year) is int and 2026<=year<=2030,"YEAR_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);self._facility_access(s,facility_id)
            rows=[]
            for item in c.execute("SELECT id FROM contract_staff ORDER BY id").fetchall():
                sid=item["id"];snap=self._staff_snapshot(sid)
                local=[p for p in snap["placements"] if p["facility_id"]==facility_id and p["start_date"]<=f"{year}-12-31" and (p["end_exclusive"] is None or p["end_exclusive"]>f"{year}-01-01")]
                if s.role=="provinsi_verifikator":
                    last=snap["placements"][-1] if snap["placements"] else None
                    actions=["transfer","end_assignment"] if last and last["end_exclusive"] is None else ["assign"]
                    rows.append({"staff_id":sid,"kind":snap["kind"],"revision":snap["revision"],"placements":local,"latest_placement":last,"candidate_actions":actions})
                elif local:
                    actions=["record_competency"] if s.role=="puskeswan" else []
                    rows.append({"staff_id":sid,"kind":snap["kind"],"revision":snap["revision"],"placements":local,"candidate_actions":actions})
            out={"facility_id":facility_id,"year":year,"rows":rows,"summary":self._sdm_summary(s,facility_id,year),"may_register_demo":s.role=="provinsi_verifikator","synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
