/**
 * M06-S1 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Demonstration-only oversight of veterinary medicine facilities.
 * Does NOT certify permits, perform official inspection or issue sanctions.
 */
import {requireDemoScopedRead,requireDemoScopedList}
 from "../m00-oversight-access/scoped_read.mjs";

export const M06_S1_SCHEMA="M06-S1-MEDICINE-OVERSIGHT-UNTESTED-1";
const fail=code=>{throw Error(code);};
const SITE=/^DEMO-MED-[A-Z0-9_-]{1,24}$/;
const INSPECTION=/^DEMO-INSPECT-[A-Z0-9_-]{1,28}$/;
const SOURCE=/^DEMO-SOURCE-[A-Z0-9_-]{1,32}$/;
const EVIDENCE=/^DEMO-EVIDENCE-[A-Z0-9_-]{1,32}$/;
const PERIOD=/^20(?:2[6-9]|30)-(?:0[1-9]|1[0-2])$/;
const LABEL=/^Sarana Obat DEMO [A-Za-z ]{2,36}$/;
const REG=/^Wilayah DEMO [A-Za-z]{2,25}$/;
const TYPES=new Set(["DISTRIBUSI_DEMO","PENYIMPANAN_DEMO",
 "PENJUALAN_DEMO"]);
const ANSWERS=new Set(["NOT_ASSESSED_DEMO","OBSERVED_DEMO",
 "NEEDS_CLARIFICATION_DEMO"]);
export const M06_S1_CHECKS=Object.freeze([
 "PENCATATAN_DOKUMEN","PENYIMPANAN","PENCATATAN_PERSEDIAAN",
 "PENANGANAN_KEDALUWARSA"
]);
const exact=(x,keys)=>x&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const sane=(s,pattern)=>typeof s==="string"&&pattern.test(s);
const uniq=arr=>new Set(arr).size===arr.length;
const copy=x=>structuredClone(x);

function normalizedSources(sites,inspections){
 if(!Array.isArray(sites)||sites.length>100||
    !Array.isArray(inspections)||inspections.length>600)
  fail("M06_S1_LIST_INVALID");
 const index=new Map();
 for(const site of sites){
  if(!exact(site,["site_id","site_label","region_label","kind",
    "source_ref","legal_state"])||
     !sane(site.site_id,SITE)||!sane(site.site_label,LABEL)||
     !sane(site.region_label,REG)||!TYPES.has(site.kind)||
     !sane(site.source_ref,SOURCE)||
     site.legal_state!=="NOT_VERIFIED_DEMO"||index.has(site.site_id))
   fail("M06_S1_SITE_INVALID");
  index.set(site.site_id,site);
 }
 const inspectionIds=new Set(),perSiteMonth=new Set();
 for(const visit of inspections){
  if(!exact(visit,["inspection_id","site_id","period",
     "checklist_version","answers","evidence_refs","review_state"])||
     !sane(visit.inspection_id,INSPECTION)||
     !index.has(visit.site_id)||!sane(visit.period,PERIOD)||
     visit.checklist_version!=="DEMO-CHECKLIST-UNAPPROVED-1"||
     visit.review_state!=="PENDING_HUMAN_REVIEW_DEMO"||
     !Array.isArray(visit.answers)||visit.answers.length!==M06_S1_CHECKS.length||
     !Array.isArray(visit.evidence_refs)||visit.evidence_refs.length>12||
     !visit.evidence_refs.every(x=>sane(x,EVIDENCE))||
     !uniq(visit.evidence_refs)||
     inspectionIds.has(visit.inspection_id)||
     perSiteMonth.has(visit.site_id+"|"+visit.period))
   fail("M06_S1_INSPECTION_INVALID");
  const categories=new Set();
  for(const answer of visit.answers){
   if(!exact(answer,["check","observation"])||
      !M06_S1_CHECKS.includes(answer.check)||
      !ANSWERS.has(answer.observation)||categories.has(answer.check))
    fail("M06_S1_CHECKLIST_INVALID");
   categories.add(answer.check);
  }
  inspectionIds.add(visit.inspection_id);
  perSiteMonth.add(visit.site_id+"|"+visit.period);
 }
 return index;
}

export function buildDemoMedicineOverview({
 resolveServerSession,region_label,sites,inspections
}={}){
 // Check regional authorization before parsing or projecting site detail.
 requireDemoScopedRead({resolveServerSession},
  {module:"MEDICINE_OVERSIGHT",region_label,detail:true});
 const sourceIndex=normalizedSources(sites,inspections);
 const selected=[...sourceIndex.values()]
  .filter(x=>x.region_label===region_label)
  .sort((a,b)=>a.site_id.localeCompare(b.site_id));
 requireDemoScopedList({resolveServerSession},
  {module:"MEDICINE_OVERSIGHT",region_label,
   records:selected.map(x=>({...x,synthetic:true}))});
 const rows=selected.map(site=>{
  const records=inspections.filter(i=>i.site_id===site.site_id)
   .sort((a,b)=>a.period.localeCompare(b.period));
  const latest=records.at(-1)??null;
  const missingChecks=latest?latest.answers.filter(x=>
   x.observation==="NOT_ASSESSED_DEMO").length:null;
  const clarify=latest?latest.answers.filter(x=>
   x.observation==="NEEDS_CLARIFICATION_DEMO").length:null;
  const reviewHint=!latest?"NO_VISIT_RECORD_DEMO":
   missingChecks>0||clarify>0?"HUMAN_REVIEW_MATERIAL_DEMO":
   "RECORDED_CHECKLIST_DEMO_NOT_VERIFIED";
  return {
   site_id:site.site_id,site_label:site.site_label,
   region_label:site.region_label,kind:site.kind,
   source_ref:site.source_ref,legal_state:site.legal_state,
   visit_count_demo:records.length,
   latest_visit_month:latest?.period??null,
   latest_inspection_id:latest?.inspection_id??null,
   latest_unassessed_checks:missingChecks,
   latest_clarification_checks:clarify,
   review_hint_demo:reviewHint,
   official_inspection_confirmed:false,
   permit_validity_verified:false,
   compliance_score:null,formal_finding_count:null,
   may_publish:false,may_close_finding:false
  };
 });
 return {
  schema:M06_S1_SCHEMA,synthetic:true,
  mode:"READ_ONLY_DEMO",region_label,
  site_count_demo:rows.length,
  sites_with_recorded_visit_demo:rows.filter(x=>x.visit_count_demo>0).length,
  rows:copy(rows),official_coverage_rate:null,
  regulatory_standard_approved:false,
  license_verification_complete:false,
  findings_officially_verified:false,
  source:"SYNTHETIC_NON_PRODUCTION",no_person_data:true,
  may_connect:false,may_write:false,may_schedule:false,
  may_sanction:false,may_approve:false,may_publish:false,
  may_deploy:false,official_authorization:false
 };
}

export function buildDemoMedicineReviewPacket({
 resolveServerSession,region_label,site_id,sites,inspections
}={}){
 if(!sane(site_id,SITE))fail("M06_S1_SITE_SELECTOR_INVALID");
 const overview=buildDemoMedicineOverview({
  resolveServerSession,region_label,sites,inspections
 });
 const row=overview.rows.find(x=>x.site_id===site_id);
 if(!row)fail("ACCESS_DENIED");
 const visits=inspections.filter(x=>x.site_id===site_id)
  .sort((a,b)=>a.period.localeCompare(b.period))
  .map(x=>({
   inspection_id:x.inspection_id,period:x.period,
   checklist_version:x.checklist_version,
   answer_statuses:copy(x.answers),
   evidence_count_demo:x.evidence_refs.length,
   review_state:x.review_state,
   officially_verified:false
  }));
 return {
  schema:M06_S1_SCHEMA,synthetic:true,
  site:copy(row),visit_history:visits,
  proposed_followup:row.review_hint_demo==="HUMAN_REVIEW_MATERIAL_DEMO"?
   {type:"DISCUSS_OBSERVATIONS_DEMO",
    assigned_to:null,due_at:null,official_document:null,
    status:"PROPOSED_NOT_DISPATCHED",
    may_dispatch:false,may_close:false}:null,
  regulatory_sufficiency_assessed:false,
  official_finding_issued:false,official_authorization:false,
  may_write:false,may_schedule:false,may_sanction:false,
  may_approve:false,may_publish:false,may_deploy:false
 };
}
