"""K4-A7 | CODE_ONLY, shared synthetic :memory: store, no real document issuance."""
import json
from datetime import datetime,timezone
from pathlib import Path
from revision_envelope import start_revision,finish_revision
from regional_store import RegionalStore
from apel_store import canonical,digest
from apel_payload import require,Denied
from coachdoc_payload import VERSION,DOC_TYPES,EVIDENCE,intent,coach_change,doc_change
from document_templates import VERSION as TEMPLATE_VERSION,render,as_text
SOURCE="DEMO-SOURCE-COACHDOC-REHEARSAL"
OWNER=("record","create","refresh","evidence","submit")
REVIEWER=("plan","review","return_result","close","return_doc","archive","reopen")
CORE={"plan":"save_draft","record":"save_draft","review":"record_review","return_result":"return_correction","close":"record_review","create":"save_draft","refresh":"save_draft","evidence":"save_draft","submit":"submit","return_doc":"return_correction","archive":"record_review","reopen":"return_correction"}
class CoachDocStore(RegionalStore):
    def __init__(self):
        super().__init__()
        c=self._db
        try:
            c.executescript((Path(__file__).resolve().parent/"coachdoc_payload.sql").read_text("utf-8"))
            c.executescript((Path(__file__).resolve().parent/"document_render.sql").read_text("utf-8"))
            c.execute("BEGIN IMMEDIATE")
            c.execute("INSERT INTO contract_source VALUES(?,?,?,?,?)",(SOURCE,"NEW-COACHDOC-REHEARSAL",VERSION,digest({"schema":VERSION,"synthetic":True}),"UNVERIFIED_DEMO"))
            for name,reg in (("ALPHA","UTARA"),("BETA","UTARA"),("GAMMA","SELATAN")):
                f="DEMO-PSW-"+name;r="DEMO-REGION-"+reg;owner="DEMO-ACTOR-"+name
                for year in range(2026,2031):
                    for slot in (1,2):
                        aid=f"DEMO-REC-COACH-{name}-{year}-{slot}"
                        c.execute("INSERT INTO contract_record VALUES(?,?,?,?,?,0,?)",(aid,"coaching",f,r,f"{year}|{slot}",owner))
                        c.execute("INSERT INTO contract_coaching_activity VALUES(?,?,?,?)",(aid,f,year,slot))
                        for kind in DOC_TYPES:
                            did=f"DEMO-REC-DOC-{name}-{year}-{slot}-{kind}"
                            c.execute("INSERT INTO contract_record VALUES(?,?,?,?,?,0,?)",(did,"documents",f,r,f"{year}|{slot}|{kind}",owner))
                            c.execute("INSERT INTO contract_coaching_document VALUES(?,?,?,?)",(did,f,aid,kind))
            c.execute("COMMIT")
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            self.close();raise
    def _activity(self,rid):
        r=self._db.execute("SELECT r.*,a.year,a.slot FROM contract_record r JOIN contract_coaching_activity a ON a.record_id=r.id AND a.facility_id=r.facility_id WHERE r.id=? AND r.resource='coaching'",(rid,)).fetchone()
        require(r is not None and r["business_key"]==f'{r["year"]}|{r["slot"]}',"ACTIVITY_NOT_AVAILABLE");return r
    def _doc(self,rid):
        r=self._db.execute("SELECT r.*,d.activity_id,d.kind FROM contract_record r JOIN contract_coaching_document d ON d.record_id=r.id AND d.facility_id=r.facility_id WHERE r.id=? AND r.resource='documents'",(rid,)).fetchone()
        require(r is not None,"DOCUMENT_NOT_AVAILABLE")
        a=self._activity(r["activity_id"])
        require(a["facility_id"]==r["facility_id"] and r["business_key"]==f'{a["year"]}|{a["slot"]}|{r["kind"]}',"SOURCE_SCOPE");return r
    def _snapshot(self,r,rev):
        if rev==0:return None
        row=self._db.execute("SELECT r.source_id,r.payload_digest,p.schema_version,p.snapshot_json FROM contract_revision r JOIN contract_coachdoc_payload p USING(record_id,revision) WHERE r.record_id=? AND r.revision=?",(r["id"],rev)).fetchone()
        require(row is not None and row["source_id"]==SOURCE and row["schema_version"]==VERSION,"SOURCE_INVALID")
        snap=json.loads(row["snapshot_json"]);require(digest(snap)==row["payload_digest"],"DIGEST_MISMATCH")
        if r["resource"]=="documents":
            link=self._db.execute("SELECT source_record_id,source_revision FROM contract_document_source WHERE document_id=? AND document_revision=?",(r["id"],rev)).fetchone()
            require(link is not None and link["source_record_id"]==r["activity_id"] and link["source_revision"]==snap["source_revision"],"DOCUMENT_SOURCE_INVALID")
        return snap
    def _rendered(self,r,rev,snap):
        row=self._db.execute("SELECT template_version,render_json,render_digest FROM contract_document_render WHERE record_id=? AND revision=?",(r["id"],rev)).fetchone()
        require(row is not None,"RENDER_NOT_AVAILABLE")
        doc=json.loads(row["render_json"])
        require(digest(doc)==row["render_digest"] and doc["template_version"]==row["template_version"] and doc["document_id"]==r["id"] and doc["document_revision"]==rev and doc["source_revision"]==snap["source_revision"] and doc["activity_id"]==r["activity_id"] and doc["draft_version"]==snap["version"] and doc["stage"]==snap["stage"] and doc["official_authorization"] is False,"RENDER_DIGEST_INVALID")
        return doc
    def _write_render(self,r,rev,snap,prior,action):
        if action in ("create","refresh"):
            label=self._db.execute("SELECT f.label AS facility_label,g.label AS region_label FROM contract_facility f JOIN contract_region g ON g.id=f.region_id WHERE f.id=?",(r["facility_id"],)).fetchone()
            require(label is not None,"SOURCE_SCOPE")
            identity={"facility_id":r["facility_id"],"facility_label":label["facility_label"],"region_id":r["region_id"],"region_label":label["region_label"],"activity_id":r["activity_id"]}
            version=TEMPLATE_VERSION
        else:
            before=self._rendered(r,rev-1,prior)
            identity=before["identity"];version=before["template_version"]
        doc=render(snap,identity,r["id"],rev,version)
        self._db.execute("INSERT INTO contract_document_render VALUES(?,?,?,?,?)",(r["id"],rev,version,canonical(doc),digest(doc)))
    def _policy_cd(self,s,r,action):
        self._facility_access(s,r["facility_id"])
        if action=="read":return
        if action in OWNER:require(s.role=="puskeswan" and s.actor_id==r["owner_id"],"OWNER_DENIED")
        elif action in REVIEWER:require(s.role=="provinsi_verifikator" and s.actor_id!=r["owner_id"],"REVIEWER_DENIED")
        else:require(False,"ACTION_DENIED")
    def _receipt_cd(self,r,rev,replay):
        snap=self._snapshot(r,rev)
        return {"record_id":r["id"],"revision":rev,"stage":snap["stage"],"replay_demo":replay,"synthetic":True,"persistent":False,"official_authorization":False,"may_sign":False,"may_send":False}
    def _apply_cd(self,resource,raw,resolve_demo_session):
        self._guard();x=intent(raw,resource);c=self._db;c.execute("BEGIN IMMEDIATE")
        try:
            s=self._session(resolve_demo_session);r=self._activity(x["record_id"]) if resource=="coaching" else self._doc(x["record_id"])
            rid=r["id"];rev=r["current_revision"];act=x["action"];self._policy_cd(s,r,act)
            fingerprint=digest({"resource":resource,"schema":VERSION,"actor":s.actor_id,"command":x})
            self._command_namespace_guard(s.actor_id,x["command_id"])
            old=c.execute("SELECT * FROM contract_command WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone()
            if old is not None:
                require(old["record_id"]==rid and old["request_digest"]==fingerprint,"IDEMPOTENCY_CONFLICT")
                out=self._receipt_cd(r,old["result_revision"],True);c.execute("COMMIT");return out
            require(rev==x["expected_revision"],"REVISION_CONFLICT")
            snap=self._snapshot(r,rev)
            if resource=="coaching":
                n=coach_change(snap,x,r["year"])
            else:
                a=self._activity(r["activity_id"]);self._policy_cd(s,a,"read")
                source=self._snapshot(a,a["current_revision"])
                n=doc_change(snap,x,source,a["current_revision"],r["kind"])
            core=CORE[act]
            state="RECORDED_DEMO" if n["stage"] in ("FOLLOWUP_OPEN","CLOSED_DEMO","ARCHIVED_DEMO") else "SUBMITTED" if n["stage"] in ("RESULT_DRAFT","REVIEW") else "CORRECTION" if n["stage"]=="CORRECTION" else "DRAFT"
            nr,now=start_revision(c,rid,rev,SOURCE,s.actor_id,core,state,n)
            c.execute("INSERT INTO contract_coachdoc_payload VALUES(?,?,?,?,?,?)",(rid,nr,VERSION,act,canonical(n),canonical(x["payload"])))
            if resource=="documents":
                c.execute("INSERT INTO contract_document_source VALUES(?,?,?,?)",(rid,nr,r["activity_id"],n["source_revision"]))
                self._write_render(r,nr,n,snap,act)
                if act=="evidence":
                    # Metadata ID is generated from exact record/revision, not the client ref.
                    c.execute("INSERT INTO contract_evidence_ref VALUES(?,?,?,?)",("DEMO-EVIDENCE-"+rid+"-"+str(nr),rid,nr,"SYNTHETIC_METADATA_ONLY"))
            finish_revision(c,rid,rev,nr,s.actor_id,core,now,x["command_id"],fingerprint)
            out=self._receipt_cd(r,nr,False);c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def apply_coaching(self,command,resolve_demo_session):return self._apply_cd("coaching",command,resolve_demo_session)
    def apply_document(self,command,resolve_demo_session):return self._apply_cd("documents",command,resolve_demo_session)
    def _candidate_cd(self,s,r,snap,source=None,source_rev=None):
        stage=snap["stage"] if snap else None
        if r["resource"]=="coaching":
            candidates={None:["plan"],"PLANNED":["record"],"RESULT_DRAFT":["review","return_result"],"FOLLOWUP_OPEN":["close"]}.get(stage,[])
        else:
            ready=source is not None and source["result"] is not None and source["attendance"] is not None
            stale=snap is not None and snap["source_revision"]!=source_rev
            if snap is None:candidates=["create"] if ready else []
            elif stage=="ARCHIVED_DEMO":candidates=["reopen"]
            elif stale:candidates=["refresh"] if ready else []
            else:
                kinds={e["kind"] for e in snap["evidence"]}
                candidates=[]
                if stage in ("DRAFT","CORRECTION"):
                    if kinds!=set(EVIDENCE):candidates.append("evidence")
                    else:candidates.append("submit")
                    if stage=="CORRECTION" and ready:candidates.append("refresh")
                elif stage=="REVIEW":
                    candidates=["return_doc"]
                    if ready and source["stage"] in ("FOLLOWUP_OPEN","CLOSED_DEMO"):candidates.append("archive")
        out=[]
        for action in candidates:
            try:self._policy_cd(s,r,action)
            except Denied:continue
            out.append(action)
        return out
    def _view_cd(self,s,r,revision=None):
        self._policy_cd(s,r,"read");rev=r["current_revision"] if revision is None else revision
        require(type(rev) is int and 0<=rev<=r["current_revision"],"REVISION_INVALID")
        snap=self._snapshot(r,rev);out={"record_id":r["id"],"resource":r["resource"],"facility_id":r["facility_id"],"revision":rev,"current_revision":r["current_revision"],"snapshot":snap,"synthetic":True,"official_authorization":False}
        if r["resource"]=="coaching":
            out.update(year=r["year"],slot=r["slot"],candidate_actions=self._candidate_cd(s,r,snap) if rev==r["current_revision"] else [])
        if r["resource"]=="documents":
            a=self._activity(r["activity_id"]);self._policy_cd(s,a,"read")
            source=self._snapshot(a,a["current_revision"])
            out.update(year=a["year"],slot=a["slot"],source_current_revision=a["current_revision"],source_stage=source["stage"] if source else None,candidate_actions=self._candidate_cd(s,r,snap,source,a["current_revision"]) if rev==r["current_revision"] else [])
            doc=self._rendered(r,rev,snap) if snap else None
            out.update(activity_id=a["id"],kind=r["kind"],source_changed=snap is not None and snap["source_revision"]!=a["current_revision"],document_render=doc,template_version=doc["template_version"] if doc else None,draft_text=as_text(doc) if doc else None)
        return out
    def view_coachdoc(self,resource,record_id,resolve_demo_session,revision=None):
        self._guard();require(resource in ("coaching","documents"),"RESOURCE_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);r=self._activity(record_id) if resource=="coaching" else self._doc(record_id)
            out=self._view_cd(s,r,revision);c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def list_coachdoc(self,facility_id,year,resolve_demo_session):
        self._guard();require(type(year) is int and 2026<=year<=2030,"YEAR_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);self._facility_access(s,facility_id)
            acts=[];docs=[]
            for x in c.execute("SELECT record_id FROM contract_coaching_activity WHERE facility_id=? AND year=? ORDER BY slot",(facility_id,year)).fetchall():
                r=self._activity(x[0]);acts.append(self._view_cd(s,r))
                for y in c.execute("SELECT record_id FROM contract_coaching_document WHERE activity_id=? ORDER BY kind",(r["id"],)).fetchall():
                    docs.append(self._view_cd(s,self._doc(y[0])))
            out={"facility_id":facility_id,"year":year,"activity_slots":acts,"document_slots":docs,"synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
