"""CODE_ONLY | New M05-master DEMO support cases, not mapping old M04.
Shared memory store; no approval, funding, delivery, BAST issuance or real sync.
"""
import json
from datetime import datetime,timezone
from pathlib import Path
from revision_envelope import start_revision,finish_revision
from staff_store import StaffStore
from apel_store import canonical,digest
from apel_payload import require,Denied
from support_catalog import classification,shortage
from support_payload import ACTIONS
from inventory_payload import INDEX,assessment,VERSION as INV_VERSION
from support_payload import VERSION,ITEMS,ATTENTION,OWNER_ACTIONS,PROVINCE_ACTIONS,intent,empty,change,project
SOURCE="DEMO-SOURCE-SUPPORT-REHEARSAL"
CORE={"propose":"save_draft","submit":"submit","county_review":"record_review","plan_package":"record_review","schedule":"record_review","dispatch":"record_review","receive":"record_review","handover":"record_review","monitor":"record_review","return_draft":"return_correction"}
class SupportStore(StaffStore):
    def __init__(self):
        super().__init__()
        c=self._db
        try:
            c.executescript((Path(__file__).resolve().parent/"support_payload.sql").read_text("utf-8"))
            c.execute("BEGIN IMMEDIATE")
            c.execute("INSERT INTO contract_source VALUES(?,?,?,?,?)",(SOURCE,"NEW-SUPPORT-REHEARSAL",VERSION,digest({"schema":VERSION,"items":ITEMS}),"UNVERIFIED_DEMO"))
            c.executemany("INSERT INTO contract_support_catalog VALUES(?,'COUNTABLE_EQUIPMENT_CANDIDATE')",[(item,) for item in ITEMS])
            for name,reg in (("ALPHA","UTARA"),("BETA","UTARA"),("GAMMA","SELATAN")):
                for year in range(2026,2031):
                    for item in ITEMS:
                        rid=f"DEMO-REC-SUP-{name}-{year}-{item.replace('.','-').upper()}"
                        f="DEMO-PSW-"+name
                        c.execute("INSERT INTO contract_record VALUES(?,?,?,?,?,0,?)",(rid,"support",f,"DEMO-REGION-"+reg,f"{year}|{item}","DEMO-ACTOR-"+name))
                        c.execute("INSERT INTO contract_support_case VALUES(?,?,?,?)",(rid,f,year,item))
            c.execute("COMMIT")
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            self.close();raise
    def _support_record(self,rid):
        r=self._db.execute("SELECT r.*,p.year,p.item_id FROM contract_record r JOIN contract_support_case p ON p.record_id=r.id AND p.facility_id=r.facility_id WHERE r.id=? AND r.resource='support'",(rid,)).fetchone()
        require(r is not None and r["business_key"]==f'{r["year"]}|{r["item_id"]}',"CASE_NOT_AVAILABLE")
        return r
    def _support_revision(self,r,rev):
        if rev==0:return empty()
        row=self._db.execute("SELECT r.source_id,r.payload_digest,p.schema_version,p.snapshot_json FROM contract_revision r JOIN contract_support_payload p USING(record_id,revision) WHERE r.record_id=? AND r.revision=?",(r["id"],rev)).fetchone()
        require(row is not None and row["source_id"]==SOURCE and row["schema_version"]==VERSION,"SOURCE_INVALID")
        snap=json.loads(row["snapshot_json"]);require(digest(snap)==row["payload_digest"],"SNAPSHOT_DIGEST_MISMATCH")
        return snap
    def _support_policy(self,s,r,action):
        self._facility_access(s,r["facility_id"])
        if action=="read":return
        if action in OWNER_ACTIONS:require(s.role=="puskeswan" and s.actor_id==r["owner_id"],"OWNER_DENIED")
        elif action=="county_review":require(s.role=="kab_kota" and s.actor_id!=r["owner_id"],"COUNTY_DENIED")
        elif action in PROVINCE_ACTIONS:require(s.role=="provinsi_verifikator" and s.actor_id!=r["owner_id"],"PROVINCE_DENIED")
        else:require(False,"ACTION_DENIED")
    def _inventory_basis(self,s,r):
        row=self._db.execute("SELECT record_id FROM contract_inventory_year WHERE facility_id=? AND year=? AND catalog_version=?",(r["facility_id"],r["year"],INV_VERSION)).fetchone()
        require(row is not None,"INVENTORY_SOURCE_MISSING")
        inv=self._inv_record(row[0]);rev=inv["current_revision"];state,snap=self._inv_revision(inv["id"],rev)
        self._read_policy(s,inv,state,rev)
        obs=snap["rows"].get(r["item_id"]);rating=assessment(INDEX[r["item_id"]],obs)
        return {"record_id":inv["id"],"revision":rev,"catalog_version":INV_VERSION,"item_id":r["item_id"],"assessment":rating,"observation":obs}
    def _receipt_support(self,r,rev,replay):
        snap=self._support_revision(r,rev)
        return {"record_id":r["id"],"revision":rev,"stage":snap["stage"],"replay_demo":replay,"synthetic":True,"persistent":False,"official_authorization":False,"may_allocate":False,"may_issue_bast":False}
    def apply_support(self,command,resolve_demo_session):
        self._guard();x=intent(command);c=self._db;c.execute("BEGIN IMMEDIATE")
        try:
            s=self._session(resolve_demo_session);r=self._support_record(x["record_id"]);rid=r["id"];rev=r["current_revision"];a=x["action"]
            self._support_policy(s,r,a);snap=self._support_revision(r,rev)
            for key in ("planned_on","sent_on","received_on"):
                if key in (x["payload"] or {}):require(int(x["payload"][key][:4])==r["year"],"CASE_YEAR_MISMATCH")
            for key in ("recorded_on","observed_on"):
                if key in (x["payload"] or {}):require(int(x["payload"][key][:4])>=r["year"],"CASE_YEAR_MISMATCH")
            fingerprint=digest({"resource":"support","schema":VERSION,"actor":s.actor_id,"command":x})
            self._command_namespace_guard(s.actor_id,x["command_id"])
            old=c.execute("SELECT * FROM contract_command WHERE actor_id=? AND command_id=?",(s.actor_id,x["command_id"])).fetchone()
            if old is not None:
                require(old["record_id"]==rid and old["request_digest"]==fingerprint,"IDEMPOTENCY_CONFLICT")
                out=self._receipt_support(r,old["result_revision"],True);c.execute("COMMIT");return out
            require(x["expected_revision"]==rev,"REVISION_CONFLICT")
            # Receipt, handover and monitoring preserve physical history even if inventory source changes.
            basis=self._inventory_basis(s,r) if a in ("propose","submit","county_review","plan_package","schedule","dispatch") else None
            if a=="propose":require(basis["assessment"] in ATTENTION,"CONFIRMED_GAP_REQUIRED")
            if a in ("submit","county_review","plan_package","schedule","dispatch"):
                require(snap["need"] is not None and snap["need"]["source"]==basis,"INVENTORY_SOURCE_CHANGED")
            n=change(snap,x,basis if a=="propose" else None)
            act=CORE[a]
            state="DRAFT" if n["stage"]=="DRAFT" else "SUBMITTED" if n["stage"]=="SUBMITTED" else "RECORDED_DEMO"
            next_rev,now=start_revision(c,rid,rev,SOURCE,s.actor_id,act,state,n)
            c.execute("INSERT INTO contract_support_payload VALUES(?,?,?,?,?,?)",(rid,next_rev,VERSION,a,canonical(n),canonical(x["payload"])))
            finish_revision(c,rid,rev,next_rev,s.actor_id,act,now,x["command_id"],fingerprint)
            out=self._receipt_support(r,next_rev,False);c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def view_support(self,record_id,resolve_demo_session):
        self._guard();c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);r=self._support_record(record_id);self._support_policy(s,r,"read")
            rev=r["current_revision"];snap=self._support_revision(r,rev);basis=self._inventory_basis(s,r)
            out={"record_id":r["id"],"facility_id":r["facility_id"],"year":r["year"],"item_id":r["item_id"],"label":INDEX[r["item_id"]]["label"],"unit":INDEX[r["item_id"]]["unit"],"revision":rev,"snapshot":snap,"summary":project(snap),"current_inventory_basis":basis,"source_changed":snap["need"] is not None and snap["need"]["source"]!=basis,"candidate_actions":self._support_actions(s,r,snap,basis),"legacy_m04_linked":False,"synthetic":True,"official_authorization":False,"funding_eligible":None}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise

    def _support_actions(self,s,r,snap,basis):
        stage=snap["stage"];m=project(snap);fresh=snap["need"] is not None and snap["need"]["source"]==basis
        candidates=[]
        if stage=="DRAFT" and basis is not None and basis["assessment"] in ATTENTION:candidates.append("propose")
        if stage=="DRAFT" and fresh:candidates.append("submit")
        if stage=="SUBMITTED" and fresh:candidates.append("county_review")
        if stage=="COUNTY_REVIEWED" and fresh:candidates.append("plan_package")
        if stage=="PACKAGE_PLANNED" and fresh:candidates.append("schedule")
        if stage in ("SCHEDULED","LIFECYCLE") and fresh and m["not_sent"] is not None and m["not_sent"]>0:candidates.append("dispatch")
        if stage=="LIFECYCLE" and m["awaiting_receipt"]>0:candidates.append("receive")
        if any(not any(h["receipt_ref"]==x["receipt_ref"] for h in snap["handovers"]) for x in snap["receipts"]):candidates.append("handover")
        if any(x["good"]>0 and any(h["receipt_ref"]==x["receipt_ref"] for h in snap["handovers"]) for x in snap["receipts"]):candidates.append("monitor")
        if stage in ("SUBMITTED","COUNTY_REVIEWED","PACKAGE_PLANNED","SCHEDULED") and not snap["shipments"]:candidates.append("return_draft")
        out=[]
        for action in candidates:
            try:self._support_policy(s,r,action)
            except Denied:continue
            out.append(action)
        return out

    def list_support(self,facility_id,year,resolve_demo_session):
        """One scoped transaction, one inventory source; no per-item remote fetch."""
        self._guard();require(type(year) is int and 2026<=year<=2030,"YEAR_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);self._facility_access(s,facility_id)
            invref=c.execute("SELECT record_id FROM contract_inventory_year WHERE facility_id=? AND year=? AND catalog_version=?",(facility_id,year,INV_VERSION)).fetchone()
            require(invref is not None,"INVENTORY_SOURCE_MISSING")
            inv=self._inv_record(invref[0]);rev=inv["current_revision"];state,inventory=self._inv_revision(inv["id"],rev);self._read_policy(s,inv,state,rev)
            cases={x["item_id"]:x["record_id"] for x in c.execute("SELECT record_id,item_id FROM contract_support_case WHERE facility_id=? AND year=?",(facility_id,year))}
            require(set(cases)==set(ITEMS),"SUPPORT_CATALOG_MISMATCH")
            rows=[]
            for k,item in INDEX.items():
                obs=inventory["rows"].get(k);rating=assessment(item,obs);rid=cases.get(k)
                row={"item_id":k,"label":item["label"],"group":item["group"],"unit":item["unit"],"classification":classification(item),"assessment":rating,"minimum_gap":shortage(item,obs),"record_id":rid,"revision":None,"stage":None,"candidate_actions":[],"funding_eligible":None}
                if rid:
                    r=self._support_record(rid);self._support_policy(s,r,"read");current=r["current_revision"];snap=self._support_revision(r,current)
                    basis={"record_id":inv["id"],"revision":rev,"catalog_version":INV_VERSION,"item_id":k,"assessment":rating,"observation":obs}
                    row.update(revision=current,stage=snap["stage"] if current else "NOT_STARTED",source_changed=snap["need"] is not None and snap["need"]["source"]!=basis,candidate_actions=self._support_actions(s,r,snap,basis))
                rows.append(row)
            out={"facility_id":facility_id,"year":year,"inventory_record_id":inv["id"],"inventory_revision":rev,"catalog_total":len(INDEX),"candidate_total":len(ITEMS),"rows":rows,"synthetic":True,"official_authorization":False,"may_allocate":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
