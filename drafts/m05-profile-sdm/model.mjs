/**
 * M05-15 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | SYNTHETIC ONLY.
 * Profile / veterinary workforce is a read-only, as-of-year view.
 * Records are synthetic and cannot authorize publication, staffing decisions,
 * government verification, scoring, or cross-year comparisons.
 */
import {requireYear} from "../m05-apel-multiyear/policy.mjs";

export const M05_15_SCHEMA="M05-15-PROFILE-SDM-DEMO-UNTESTED-1";
const fail=code=>{throw Error(code);};
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const REG=/^DEMO-REGION-[A-Z0-9_-]{1,24}$/;
const PERSON=/^DEMO-STAFF-[A-Z0-9_-]{1,24}$/;
const REF=/^DEMO-SOURCE-[A-Z0-9_-]{1,32}$/;
const MONTH=/^(?:202[6-9]|2030)-(?:0[1-9]|1[0-2])$/;
const STATES=new Set(["DRAFT_DEMO","REVIEW_PENDING_DEMO","RECORDED_DEMO"]);
const COVERAGE=new Set(["COMPLETE_DEMO","PARTIAL_DEMO"]);
const ROLES=new Set(["DOKTER_HEWAN","PARAMEDIK"]);
const entries=(o,keys)=>o!==null&&typeof o==="object"&&!Array.isArray(o)&&
 Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
const demoLabel=(s,p)=>typeof s==="string"&&s.startsWith(p)&&
 s.trim()===s&&s.length<=70&&!/[<>\u0000-\u001f]/.test(s);
const idValid=(id,reg)=>typeof id==="string"&&reg.test(id);
const validRef=x=>idValid(x,REF);
const range=(n,limit)=>Array.isArray(n)&&n.length<=limit;
const inYear=(period,year)=>period<=String(year)+"-12";
const active=(p,point)=>p.start_month<=point&&(p.end_month===null||p.end_month>point);

function validateSource(facilities,profiles,coverage,placements){
 if(!range(facilities,100)||!range(profiles,700)||
    !range(coverage,600)||!range(placements,1000))
  fail("M05_15_ARRAY_INVALID");
 const facilityById=new Map(),regionById=new Map();
 for(const f of facilities){
  if(!entries(f,["facility_id","facility_label","region_id","region_label"])||
     !idValid(f.facility_id,FAC)||!idValid(f.region_id,REG)||
     !demoLabel(f.facility_label,"Puskeswan DEMO ")||
     !demoLabel(f.region_label,"Wilayah DEMO ")||
     facilityById.has(f.facility_id))
   fail("M05_15_FACILITY_INVALID");
  if(regionById.has(f.region_id)&&regionById.get(f.region_id)!==f.region_label)
   fail("M05_15_REGION_LABEL_CONFLICT");
  facilityById.set(f.facility_id,f);
  regionById.set(f.region_id,f.region_label);
 }
 const profileByKey=new Map(),coverageByKey=new Map(),staffById=new Map();
 for(const p of profiles){
  if(!entries(p,["facility_id","region_id","year","profile_state","source_ref"])||
    !facilityById.has(p.facility_id)||
    facilityById.get(p.facility_id).region_id!==p.region_id||
    !STATES.has(p.profile_state)||!validRef(p.source_ref))
   fail("M05_15_PROFILE_INVALID");
  requireYear(p.year);
  const key=p.facility_id+"|"+p.year;
  if(profileByKey.has(key))fail("M05_15_DUPLICATE_PROFILE_SNAPSHOT");
  profileByKey.set(key,p);
 }
 for(const c of coverage){
  if(!entries(c,["facility_id","year","completeness","source_ref"])||
     !facilityById.has(c.facility_id)||!COVERAGE.has(c.completeness)||
     !validRef(c.source_ref))
   fail("M05_15_COVERAGE_INVALID");
  requireYear(c.year);
  const key=c.facility_id+"|"+c.year;
  if(coverageByKey.has(key))fail("M05_15_DUPLICATE_STAFF_COVERAGE");
  coverageByKey.set(key,c);
 }
 for(const p of placements){
  if(!entries(p,["staff_id","facility_id","role","start_month","end_month"])||
     !idValid(p.staff_id,PERSON)||!facilityById.has(p.facility_id)||
     !ROLES.has(p.role)||!MONTH.test(p.start_month)||
     (p.end_month!==null&&(!MONTH.test(p.end_month)||p.end_month<=p.start_month)))
   fail("M05_15_PLACEMENT_INVALID");
  const other=staffById.get(p.staff_id)??[];
  if(other.some(x=>(x.end_month===null||p.start_month<x.end_month)&&
                   (p.end_month===null||x.start_month<p.end_month)))
   fail("M05_15_OVERLAPPING_STAFF_PLACEMENT");
  other.push(p);staffById.set(p.staff_id,other);
 }
 return {facilityById,profileByKey,coverageByKey};
}

export function buildProfileSdmView({
 facilities,profiles,coverage,placements,
 year=2026,region_id="ALL",facility_id="ALL"
}={}){
 requireYear(year);
 const {facilityById,profileByKey,coverageByKey}=
  validateSource(facilities,profiles,coverage,placements);
 if(region_id!=="ALL"&&
    ![...facilityById.values()].some(f=>f.region_id===region_id))
  fail("M05_15_REGION_FILTER_INVALID");
 if(facility_id!=="ALL"&&!facilityById.has(facility_id))
  fail("M05_15_FACILITY_FILTER_INVALID");
 if(facility_id!=="ALL"&&region_id!=="ALL"&&
    facilityById.get(facility_id).region_id!==region_id)
  fail("M05_15_FILTER_CONFLICT");
 const point=String(year)+"-12";
 const selected=[...facilityById.values()].filter(f=>
  (region_id==="ALL"||f.region_id===region_id)&&
  (facility_id==="ALL"||f.facility_id===facility_id));
 const rows=selected.map(f=>{
  const key=f.facility_id+"|"+year;
  const profile=profileByKey.get(key)??null;
  const staff=coverageByKey.get(key)??null;
  const visible=placements.filter(p=>p.facility_id===f.facility_id&&active(p,point));
  const complete=staff?.completeness==="COMPLETE_DEMO";
  const doctors=visible.filter(p=>p.role==="DOKTER_HEWAN").length;
  const paramedics=visible.filter(p=>p.role==="PARAMEDIK").length;
  return {
   facility_id:f.facility_id,facility_label:f.facility_label,
   region_id:f.region_id,region_label:f.region_label,year,
   profile_state:profile?.profile_state??"NOT_AVAILABLE_DEMO",
   profile_source_ref:profile?.source_ref??null,
   profile_officially_verified:false,
   sdm_coverage:staff?.completeness??"NOT_AVAILABLE_DEMO",
   sdm_source_ref:staff?.source_ref??null,
   doctors:complete?doctors:null,
   paramedics:complete?paramedics:null,
   observed_staff_in_partial_demo:staff&&!complete?visible.length:null,
   sdm_officially_verified:false
  };
 }).sort((a,b)=>a.facility_id.localeCompare(b.facility_id));
 const completeRows=rows.filter(r=>r.sdm_coverage==="COMPLETE_DEMO");
 const allComplete=rows.length>0&&completeRows.length===rows.length;
 const totalDoctors=completeRows.reduce((n,r)=>n+r.doctors,0);
 const totalParamedics=completeRows.reduce((n,r)=>n+r.paramedics,0);
 return {
  schema:M05_15_SCHEMA,synthetic:true,mode:"READ_ONLY_DEMO",
  year,as_of_month:point,filters:{region_id,facility_id},rows,
  summary:{
   facilities:rows.length,
   profile_available_demo:rows.filter(r=>r.profile_source_ref!==null).length,
   sdm_complete_demo:completeRows.length,
   sdm_unknown_or_partial_demo:rows.length-completeRows.length,
   doctors:allComplete?totalDoctors:null,
   paramedics:allComplete?totalParamedics:null,
   total_staff:allComplete?totalDoctors+totalParamedics:null
  },
  no_person_names:true,source:"SYNTHETIC_M05_15_ONLY",
  sources_reconciled:false,policy_approved:false,
  officially_verified:false,may_publish:false,may_decide_staffing:false,
  may_write:false,may_connect:false,may_score:false,may_rank:false,
  may_award:false,may_deploy:false,official_authorization:false
 };
}
