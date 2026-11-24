/** K1/K2 personnel consolidation | synthetic memory only | UNTESTED. */
import {SECTION_DEFS,startDemo,useRole,allSections,saveOrSubmit,reviewRequest,validateDemo}
 from "../../prototypes/profil-puskeswan/model.mjs";
import {buildProfileSdmView} from "../m05-profile-sdm/model.mjs";
export const PROFILE_CHOICES=Object.freeze({
 legalitas:["Dokumen contoh tercatat","Dokumen contoh perlu telaah"],
 bangunan:["Ruang contoh dapat digunakan","Ruang contoh perlu perbaikan"],
 peralatan:["Peralatan contoh tersedia","Peralatan contoh perlu perbaikan"],
 obat_bhp:["Persediaan contoh tersedia","Persediaan contoh perlu diperiksa"],
 wilayah_kerja:["Cakupan contoh tercatat","Cakupan contoh perlu diperbarui"]
});
export const COMPETENCIES=Object.freeze(["PENCATATAN_APEL_DEMO","PELAYANAN_KLINIK_DEMO","SURVEILANS_DEMO","KESMAVET_DEMO"]);
const fail=x=>{throw Error(x);};
const clone=structuredClone;
const month=s=>s.year+"-"+String(s.month).padStart(2,"0");
const active=(p,at)=>p.start_month<=at&&(p.end_month===null||p.end_month>at);
const key=s=>s.facility_id+"|"+s.year;
export function emptyPersonnelEdits(){
 return {profileCases:{},history:[],competencies:[],revision:0};
}
function check(c,s){
 if(c?.synthetic!==true||c.persistent!==false||c.official_authorization!==false||
 !c.personnelEdits||![2026,2027,2028,2029,2030].includes(s.year)||
 !Number.isInteger(s.month)||s.month<1||s.month>12)fail("PERSONNEL_SCOPE_INVALID");
 const f=c.facilities.find(x=>x.facility_id===s.facility_id&&x.region_id===s.region_id);
 if(!f)fail("PERSONNEL_SCOPE_DENIED");return f;
}
function blank(f){
 // Discard all independent M02 fixture values and pending requests.
 return {...startDemo(),facility:{id:f.facility_id,name:f.facility_label,region:f.region_label},
 sections:Object.fromEntries(SECTION_DEFS.map(x=>[x.id,{value:null,verified:false,date:null}])),
 requests:[],nextId:1,problems:[],supportNeeds:[],priorityAssessments:[]};
}
function append(c,fixture,changes,event){
 const e=c.personnelEdits,revision=e.revision+1;
 buildProfileSdmView({...fixture});
 return {...c,profileFixture:fixture,personnelEdits:{...e,...changes,revision,
  history:[...e.history,{...event,revision,official_authorization:false}]}};
}
export function readPersonnel(c,s){
 const f=check(c,s),e=c.personnelEdits;
 const profile=e.profileCases[key(s)]??blank(f);
 const at=month(s),selected=c.profileFixture.placements.filter(p=>p.facility_id===s.facility_id);
 const staff=selected.filter(p=>active(p,at));
 return {sections:allSections(profile),staff:clone(staff),
  movable:clone(staff.filter(p=>p.end_month===null&&p.start_month<at)),
  placements:clone(selected.filter(p=>p.start_month<=at)),
  summary:buildProfileSdmView({...c.profileFixture,year:s.year,region_id:s.region_id,facility_id:s.facility_id}).rows[0],
  competencies:clone(e.competencies.filter(x=>x.facility_id===s.facility_id&&x.period.slice(0,4)===String(s.year)&&x.period<=at)),
  history:clone(e.history.filter(h=>h.year===s.year&&(h.facility_id===s.facility_id||h.destination_id===s.facility_id))),
  destinations:c.facilities.filter(x=>x.facility_id!==s.facility_id).map(x=>({...x})),
  official_authorization:false};
}
export function changeProfile(c,s,{section,action,value}){
 const f=check(c,s),e=c.personnelEdits;
 if(!Object.hasOwn(PROFILE_CHOICES,section))fail("PROFILE_SECTION_INVALID");
 const prior=e.profileCases[key(s)]??blank(f);
 const current=allSections(prior).find(x=>x.id===section);
 let next;
 if(action==="save"||action==="submit"){
  if(!PROFILE_CHOICES[section].includes(value))fail("PROFILE_DEMO_CHOICE_INVALID");
  next=saveOrSubmit(useRole(prior,"petugas"),section,value,action);
 }else if(["accept","correct","reject"].includes(action)){
  if(current.request?.status!=="diajukan")fail("PROFILE_REVIEW_DENIED");
  next=reviewRequest(useRole(prior,"verifikator_prov"),current.request.id,
   {accept:"disetujui",correct:"perlu_perbaikan",reject:"ditolak"}[action],
   action==="accept"?"":"Catatan telaah fiktif; periksa ulang contoh.");
  if(action==="accept")next={...next,sections:{...next.sections,
   [section]:{...next.sections[section],date:null}}};
 }else fail("PROFILE_ACTION_INVALID");
 next=useRole(next,"petugas");validateDemo(next);
 if(JSON.stringify(next)===JSON.stringify(prior))return c;
 const fixture=clone(c.profileFixture),sections=allSections(next);
 const status=sections.some(x=>x.status==="diajukan")?"REVIEW_PENDING_DEMO":
  sections.every(x=>x.status==="terverifikasi")?"RECORDED_DEMO":"DRAFT_DEMO";
 // Status of five-section simulation, not full Profiling or verified source.
 const old=fixture.profiles.find(x=>x.facility_id===s.facility_id&&x.year===s.year)??null;
 const replacement={facility_id:s.facility_id,region_id:s.region_id,year:s.year,
  profile_state:status,source_ref:"DEMO-SOURCE-EDIT-"+(e.revision+1)};
 fixture.profiles=fixture.profiles.filter(x=>!(x.facility_id===s.facility_id&&x.year===s.year)).concat(replacement);
 const after=allSections(next).find(x=>x.id===section);
 return append(c,fixture,{profileCases:{...e.profileCases,[key(s)]:next}},
  {type:"PROFILE",facility_id:s.facility_id,year:s.year,period:month(s),section,action,
   before:{value:current.value,request:clone(current.request),snapshot:clone(old)},
   after:{value:after.value,request:clone(after.request),snapshot:replacement}});
}
export function transferStaff(c,s,{staff_id,destination_id}){
 check(c,s);const at=month(s),fixture=clone(c.profileFixture);
 const destination=c.facilities.find(x=>x.facility_id===destination_id);
 if(!destination||destination_id===s.facility_id)fail("STAFF_DESTINATION_INVALID");
 const p=fixture.placements.find(x=>x.staff_id===staff_id&&x.facility_id===s.facility_id&&active(x,at));
 if(!p||p.end_month!==null||p.start_month>=at)fail("STAFF_TRANSFER_DENIED");
 if(c.personnelEdits.competencies.some(x=>x.staff_id===staff_id&&x.facility_id===s.facility_id&&x.period>=at))
  fail("STAFF_TRANSFER_CONFLICTS_WITH_RECORDED_COMPETENCY");
 const previous=clone(p);p.end_month=at;
 const next={staff_id:p.staff_id,facility_id:destination_id,role:p.role,start_month:at,end_month:null};
 fixture.placements.push(next);
 // Existing annual coverage declarations preserved; never promote partial/missing.
 return append(c,fixture,{}, {type:"TRANSFER",facility_id:s.facility_id,destination_id,
  year:s.year,period:at,staff_id,action:"transfer",before:previous,after:clone(next)});
}
export function recordCompetency(c,s,{staff_id,topic}){
 check(c,s);const e=c.personnelEdits,at=month(s);
 if(!COMPETENCIES.includes(topic)||!c.profileFixture.placements.some(p=>
 p.staff_id===staff_id&&p.facility_id===s.facility_id&&active(p,at)))fail("COMPETENCY_SCOPE_DENIED");
 if(e.competencies.some(x=>x.staff_id===staff_id&&x.topic===topic&&x.period===at))
 fail("COMPETENCY_DUPLICATE");
 const record={staff_id,facility_id:s.facility_id,topic,period:at,
  status:"CATATAN_PENGEMBANGAN_DEMO",certificate_verified:false};
 return append(c,c.profileFixture,{competencies:[...e.competencies,record]},
 {type:"COMPETENCY",facility_id:s.facility_id,year:s.year,period:at,staff_id,
 action:"record_competency",before:null,after:record});
}
