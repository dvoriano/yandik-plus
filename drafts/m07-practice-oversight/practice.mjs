/**
 * M07-S1 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Registry and internal checklist review of fictional veterinary practices.
 * No licensing, real inspection, practitioner identity, sanctions or publishing.
 */
import {requireDemoScopedRead,requireDemoScopedList}
 from "../m00-oversight-access/scoped_read.mjs";

export const M07_S1_SCHEMA="M07-S1-PRACTICE-OVERSIGHT-DEMO-UNTESTED-1";
export const M07_S1_CHECKS=Object.freeze([
 "DOKUMEN_ADMINISTRASI_DEMO",
 "FASILITAS_PELAYANAN_DEMO",
 "CATATAN_LAYANAN_DEMO",
 "KEBERSIHAN_RUANG_DEMO",
 "TINDAK_LANJUT_INTERNAL_DEMO"
]);
const fail=(code)=>{throw Error(code);};
const SITE=/^DEMO-PRACTICE-[A-Z0-9_-]{1,24}$/;
const VISIT=/^DEMO-PVISIT-[A-Z0-9_-]{1,24}$/;
const SOURCE=/^DEMO-SOURCE-[A-Z0-9_-]{1,32}$/;
const EVIDENCE=/^DEMO-EVIDENCE-[A-Z0-9_-]{1,32}$/;
const PERIOD=/^(?:202[6-9]|2030)-(?:0[1-9]|1[0-2])$/;
const REGION=/^Wilayah DEMO [A-Za-z]{2,25}$/;
const LABEL=/^Sarana Praktik DEMO [A-Za-z ]{2,35}$/;
const KINDS=new Set(["KLINIK_DEMO","PRAKTIK_MANDIRI_DEMO"]);
const OBS=new Set(["NOT_ASSESSED_DEMO","OBSERVED_DEMO",
 "REVIEW_REQUIRED_DEMO"]);
const is=(x,re)=>typeof x==="string"&&re.test(x);
const exact=(x,keys)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const unique=(arr)=>new Set(arr).size===arr.length;

function validateSources(practices,visits){
 if(!Array.isArray(practices)||practices.length>100||
    !Array.isArray(visits)||visits.length>600)
  fail("M07_S1_SOURCE_INVALID");
 const byId=new Map();
 for(const p of practices){
  if(!exact(p,["practice_id","practice_label","region_label",
       "kind","source_ref","documentation_state"])||
     !is(p.practice_id,SITE)||!is(p.practice_label,LABEL)||
     !is(p.region_label,REGION)||!KINDS.has(p.kind)||
     !is(p.source_ref,SOURCE)||
     p.documentation_state!=="NOT_VERIFIED_DEMO"||
     byId.has(p.practice_id))
   fail("M07_S1_PRACTICE_INVALID");
  byId.set(p.practice_id,p);
 }
 const ids=new Set(),months=new Set();
 for(const v of visits){
  if(!exact(v,["visit_id","practice_id","period","checklist_version",
       "answers","evidence_refs","review_state"])||
    !is(v.visit_id,VISIT)||!byId.has(v.practice_id)||
    !is(v.period,PERIOD)||
    v.checklist_version!=="DEMO-PRACTICE-CHECKLIST-UNAPPROVED-1"||
    v.review_state!=="INTERNAL_REVIEW_PENDING_DEMO"||
    !Array.isArray(v.answers)||v.answers.length!==M07_S1_CHECKS.length||
    !Array.isArray(v.evidence_refs)||v.evidence_refs.length>12||
    !v.evidence_refs.every(e=>is(e,EVIDENCE))||
    !unique(v.evidence_refs)||ids.has(v.visit_id)||
    months.has(v.practice_id+"|"+v.period))
   fail("M07_S1_VISIT_INVALID");
  const seen=new Set();
  for(const answer of v.answers){
   if(!exact(answer,["check_id","observation"])||
      !M07_S1_CHECKS.includes(answer.check_id)||
      !OBS.has(answer.observation)||seen.has(answer.check_id))
    fail("M07_S1_CHECKLIST_INVALID");
   seen.add(answer.check_id);
  }
  ids.add(v.visit_id);months.add(v.practice_id+"|"+v.period);
 }
 return byId;
}

export function buildDemoPracticeRegister({
 resolveServerSession,region_label,practices,visits
}={}){
 // Scope authorization comes before any detail is returned.
 requireDemoScopedRead({resolveServerSession},
  {module:"PRACTICE_OVERSIGHT",region_label,detail:true});
 const byId=validateSources(practices,visits);
 const selected=[...byId.values()].filter(p=>p.region_label===region_label)
  .sort((a,b)=>a.practice_id.localeCompare(b.practice_id));
 requireDemoScopedList({resolveServerSession},{
  module:"PRACTICE_OVERSIGHT",region_label,
  records:selected.map(p=>({...p,synthetic:true}))
 });
 const rows=selected.map(p=>{
  const history=visits.filter(v=>v.practice_id===p.practice_id)
   .sort((a,b)=>a.period.localeCompare(b.period));
  const last=history.at(-1)??null;
  const unassessed=last?last.answers.filter(a=>
   a.observation==="NOT_ASSESSED_DEMO").length:null;
  const review=last?last.answers.filter(a=>
   a.observation==="REVIEW_REQUIRED_DEMO").length:null;
  return {
   practice_id:p.practice_id,practice_label:p.practice_label,
   region_label:p.region_label,kind:p.kind,
   source_ref:p.source_ref,documentation_state:p.documentation_state,
   recorded_visit_count_demo:history.length,
   last_recorded_visit_month:last?.period??null,
   last_unassessed_checks:unassessed,
   last_review_checks:review,
   review_material_state:last===null?"NO_OBSERVATION_DEMO":
    unassessed>0||review>0?"HUMAN_REVIEW_MATERIAL_DEMO":
    "RECORDED_NO_FORMAL_CONCLUSION_DEMO",
   registration_approved:false,practice_permit_verified:false,
   statutory_compliance:null,formal_finding_count:null
  };
 });
 return {
  schema:M07_S1_SCHEMA,synthetic:true,mode:"READ_ONLY_DEMO",
  region_label,practice_count_demo:rows.length,
  rows:structuredClone(rows),
  regulatory_checklist_approved:false,
  physician_identity_verified:false,
  licensing_authority_assessed:false,official_inspection_confirmed:false,
  personal_data_included:false,source:"SYNTHETIC_ONLY",
  may_connect:false,may_write:false,may_assign:false,
  may_issue:false,may_sanction:false,may_publish:false,
  may_approve:false,may_deploy:false,official_authorization:false
 };
}

export function buildDemoPracticeReview({
 resolveServerSession,region_label,practice_id,practices,visits
}={}){
 if(!is(practice_id,SITE))fail("M07_S1_SELECTOR_INVALID");
 const register=buildDemoPracticeRegister({
  resolveServerSession,region_label,practices,visits});
 const item=register.rows.find(x=>x.practice_id===practice_id);
 if(!item)fail("ACCESS_DENIED");
 const visitsSafe=visits.filter(v=>v.practice_id===practice_id)
  .sort((a,b)=>a.period.localeCompare(b.period)).map(v=>({
   visit_id:v.visit_id,period:v.period,
   checklist_version:v.checklist_version,
   answer_statuses:structuredClone(v.answers),
   evidence_reference_count:v.evidence_refs.length,
   review_state:v.review_state,
   official_inspection:false
  }));
 return {
  schema:M07_S1_SCHEMA,synthetic:true,
  practice:structuredClone(item),visits:visitsSafe,
  review_packet:{
   status:"DRAFT_DISCUSSION_ONLY",
   proposed_topic:item.review_material_state,
   assigned_to:null,due_date:null,letter_number:null,
   official_recommendation:null,may_dispatch:false
  },
  may_write:false,may_issue:false,may_sanction:false,
  may_publish:false,may_approve:false,may_deploy:false,
  official_authorization:false
 };
}
