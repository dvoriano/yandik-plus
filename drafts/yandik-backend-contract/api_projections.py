"""K4-A8 | CODE_ONLY. Scoped read-only projections of the shared memory rehearsal.
No live ledger, geographic coordinates, real notification or policy approval.
"""
import json
from pathlib import Path
from datetime import date
from coachdoc_store import CoachDocStore
from apel_payload import require
from inventory_payload import summary as inv_summary
from staff_payload import projection as staff_projection,day
GRID={"DEMO-PSW-ALPHA":(150,95),"DEMO-PSW-BETA":(435,155),"DEMO-PSW-GAMMA":(290,310)}
LAYERS=("facilities","service","reporting","sdm","inventory","coaching")
CATALOG=json.loads((Path(__file__).resolve().parent/"api_library_catalog.json").read_text("utf-8"))
def year_ok(year):require(type(year) is int and 2026<=year<=2030,"YEAR_INVALID")
def complete_sum(rows,key):
    return sum(r[key] for r in rows) if rows and all(type(r[key]) is int for r in rows) else None
class ProjectionStore(CoachDocStore):
    def _visible_facilities(self,s,region,allow_leader=False):
        require(s.role in ("puskeswan","kab_kota","provinsi_verifikator","provinsi_admin") or (allow_leader and s.role=="pimpinan"),"ACCESS_DENIED")
        require(region=="ALL" or self._db.execute("SELECT 1 FROM contract_region WHERE id=?",(region,)).fetchone() is not None,"REGION_INVALID")
        require(s.role not in ("puskeswan","kab_kota") or region in ("ALL",s.region_id),"SCOPE_DENIED")
        rows=self._db.execute("SELECT id,region_id,label FROM contract_facility ORDER BY id").fetchall()
        return [r for r in rows if (region=="ALL" or r["region_id"]==region)
                and (s.role not in ("puskeswan","kab_kota") or r["region_id"]==s.region_id)
                and (s.role!="puskeswan" or r["id"]==s.facility_id)]
    def _metrics(self,f,year):
        # Internal projection only; caller has already scoped master rows. No individual data returned.
        c=self._db;fid=f["id"]
        inv=c.execute("SELECT record_id FROM contract_inventory_year WHERE facility_id=? AND year=?",(fid,year)).fetchone()
        inventory={"confirmed":None,"total":None,"attention":None}
        if inv:
            r=self._inv_record(inv[0]);_,snap=self._inv_revision(r["id"],r["current_revision"]);inventory=inv_summary(snap)
        cover=c.execute("SELECT completeness FROM contract_staff_coverage WHERE facility_id=? AND year=?",(fid,year)).fetchone()
        at=f"{year}-12-31"
        people=c.execute("SELECT s.kind FROM contract_staff s JOIN contract_placement p ON p.staff_id=s.id WHERE p.facility_id=? AND p.start_date<=? AND (p.end_exclusive IS NULL OR p.end_exclusive>?)",(fid,at,at)).fetchall()
        staff=staff_projection(cover[0] if cover else None,people,year)
        profiles=c.execute("SELECT r.current_revision FROM contract_profile_section p JOIN contract_record r ON r.id=p.record_id WHERE p.facility_id=? AND p.year=?",(fid,year)).fetchall()
        reports=c.execute("SELECT r.current_revision FROM contract_apel_period p JOIN contract_record r ON r.id=p.record_id WHERE p.facility_id=? AND p.year=?",(fid,year)).fetchall()
        activities=[];documents=[]
        for a in c.execute("SELECT record_id FROM contract_coaching_activity WHERE facility_id=? AND year=?",(fid,year)).fetchall():
            r=self._activity(a[0]);snap=self._snapshot(r,r["current_revision"])
            if snap:activities.append(snap)
            for d in c.execute("SELECT record_id FROM contract_coaching_document WHERE activity_id=?",(r["id"],)).fetchall():
                dr=self._doc(d[0]);ds=self._snapshot(dr,dr["current_revision"])
                if ds:documents.append({"stage":ds["stage"],"stale":ds["source_revision"]!=r["current_revision"]})
        return {"facility_id":fid,"region_id":f["region_id"],"label":f["label"],
                "doctors":staff["doctors"],"paramedics":staff["paramedics"],
                "inventory_confirmed":inventory["confirmed"],"inventory_total":inventory["total"],"inventory_attention":inventory["attention"],
                "profile_sections_entered":sum(r[0]>0 for r in profiles),
                "apel_workflow_slots":len(reports),"apel_workflows_started":sum(r[0]>0 for r in reports),
                "apel_reported_months":None,"observed_services":None,
                "coaching_open":sum(x["stage"]=="FOLLOWUP_OPEN" for x in activities),
                "coaching_recorded":len(activities),"documents_recorded":len(documents),
                "documents_stale":sum(x["stale"] for x in documents)}
    def leadership(self,year,region,resolve_demo_session):
        self._guard();year_ok(year);c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session)
            require(s.role in ("pimpinan","provinsi_verifikator","provinsi_admin","kab_kota"),"ACCESS_DENIED")
            fs=self._visible_facilities(s,region,True);rows=[self._metrics(f,year) for f in fs]
            totals={k:complete_sum(rows,k) for k in ("doctors","paramedics","inventory_confirmed","inventory_total","profile_sections_entered","apel_workflow_slots","apel_workflows_started","coaching_open","coaching_recorded","documents_recorded","documents_stale")}
            totals["inventory_attention_observed"]=sum(r["inventory_attention"] for r in rows if r["inventory_attention"] is not None) if any(r["inventory_attention"] is not None for r in rows) else None
            out={"year":year,"region_scope":s.region_id if s.role=="kab_kota" else region,"facilities_demo":len(rows),"staff_complete_facilities":sum(r["doctors"] is not None for r in rows),"inventory_observed_facilities":sum(r["inventory_attention"] is not None for r in rows),"totals":totals,"apel_reported_months":None,"observed_services":None,"ledger_status":"SOURCE_UNAVAILABLE","synthetic":True,"official_authorization":False,"may_publish":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def gis(self,year,region,layer,resolve_demo_session):
        self._guard();year_ok(year);require(layer in LAYERS,"LAYER_INVALID");c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);fs=self._visible_facilities(s,region)
            points=[]
            keys={"service":"observed_services","reporting":"apel_reported_months","sdm":"doctors","inventory":"inventory_attention","coaching":"coaching_open"}
            for f in fs:
                r=self._metrics(f,year);require(f["id"] in GRID,"GRID_SOURCE_MISSING")
                x,y=GRID[f["id"]];v=1 if layer=="facilities" else r[keys[layer]]
                points.append({"facility_id":f["id"],"label":f["label"],"region_id":f["region_id"],"x":x,"y":y,"value":v,"state":"UNKNOWN" if v is None else "ZERO" if v==0 else "OBSERVED"})
            out={"year":year,"layer":layer,"coordinate_system":"DEMO_CARTESIAN_NOT_WGS84","points":points,"synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def library(self,q,resolve_demo_session):
        self._guard();require(isinstance(q,str) and len(q)<=120,"SEARCH_INVALID")
        c=self._db;c.execute("BEGIN")
        try:
            self._session(resolve_demo_session);words=q.casefold().split()
            rows=[r for r in CATALOG["items"] if all(w in " ".join([r["title"],r["category"],r["summary"],*r["tags"]]).casefold() for w in words)]
            out={"items":rows,"source_commit":CATALOG["source_commit"],"legal_verified":False,"synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def inbox(self,today,resolve_demo_session):
        self._guard();day(today);year=int(today[:4]);c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session);require(s.role=="puskeswan","RECIPIENT_DENIED")
            fs=self._visible_facilities(s,"ALL");require(len(fs)==1,"SCOPE_DENIED");fid=fs[0]["id"];items=[]
            def add(category,rid,revision,title,due=None):
                items.append({"key":f"{category}|{rid}|{revision}","category":category,"record_id":rid,"revision":revision,"title":title,"due":due})
            r=c.execute("SELECT record_id FROM contract_inventory_year WHERE facility_id=? AND year=?",(fid,year)).fetchone()
            if r:
                inv=self._inv_record(r[0]);_,snap=self._inv_revision(inv["id"],inv["current_revision"]);m=inv_summary(snap)
                if m["confirmed"]<m["total"]:add("INVENTORY",inv["id"],inv["current_revision"],"Konfirmasi inventaris tahunan")
            for y in (year-1,year):
                for p in c.execute("SELECT record_id FROM contract_apel_period WHERE facility_id=? AND year=?",(fid,y)).fetchall():
                    a,period=self._record(p[0]);state,_=self._revision(a["id"],a["current_revision"])
                    if period<=today[:7] and state=="CORRECTION":add("CORRECTION",a["id"],a["current_revision"],"Perbaikan workflow APEL")
                for p in c.execute("SELECT record_id FROM contract_coaching_activity WHERE facility_id=? AND year=?",(fid,y)).fetchall():
                    a=self._activity(p[0]);snap=self._snapshot(a,a["current_revision"])
                    if snap and snap["stage"]=="FOLLOWUP_OPEN" and snap["date"]<=today and (date.fromisoformat(snap["due"])-date.fromisoformat(today)).days<=7:add("COACHING",a["id"],a["current_revision"],"Tindak lanjut pembinaan",snap["due"])
                    for d in c.execute("SELECT record_id FROM contract_coaching_document WHERE activity_id=?",(a["id"],)).fetchall():
                        dr=self._doc(d[0]);ds=self._snapshot(dr,dr["current_revision"])
                        if ds and (ds["stage"]=="CORRECTION" or ds["source_revision"]!=a["current_revision"]):
                            add("DOCUMENT",dr["id"],dr["current_revision"],"Perbarui draf administrasi")
                            items[-1]["key"]+=f"|source:{a['current_revision']}"
            out={"facility_id":fid,"as_of":today,"items":sorted(items,key=lambda x:(x["due"] is None,x["due"] or "",x["key"])),"missing_sources":["APEL_LEDGER"],"delivery_enabled":False,"synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
    def core(self,resolve_demo_session):
        self._guard();c=self._db;c.execute("BEGIN")
        try:
            s=self._session(resolve_demo_session)
            facilities=[] if s.role=="pimpinan" else [{"facility_id":f["id"],"region_id":f["region_id"],"label":f["label"]} for f in self._visible_facilities(s,"ALL")]
            out={"role_demo":s.role,"facilities":facilities,"synthetic":True,"official_authorization":False}
            c.execute("COMMIT");return out
        except BaseException:
            if c.in_transaction:c.execute("ROLLBACK")
            raise
