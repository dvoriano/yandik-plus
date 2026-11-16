/** M04-I1 | KODE DITULIS, BELUM DIUJI. Synthetic integration only. */
import {validateProblems} from "../../prototypes/profil-puskeswan/problems.mjs";
import {validateNeeds} from "../../prototypes/profil-puskeswan/support_needs.mjs";
import {validatePriorityAssessments,prioritySourceStale} from "../../prototypes/profil-puskeswan/support_priority.mjs";
import {buildSupportPlan} from "../m04-support-package-planning/planning.mjs";
const clone=x=>JSON.parse(JSON.stringify(x));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const units=new Set(["unit","set","paket","buah"]);
const fail=s=>{throw Error(s);};
export function bridgeSources(master,states){
 if(!Array.isArray(master)||!Array.isArray(states))fail("Daftar sumber DEMO tidak sah.");
 const facilities=new Map(),aliases=new Set(),seen=new Set(),needs=[],links=[],excluded=[];
 for(const m of master){
  if(!m||!/^DEMO-PSW-[A-Z0-9_-]{1,24}$/.test(m.id)||!/^DEMO-PUSK-[A-Z0-9_-]{1,24}$/.test(m.support_id)||
    typeof m.name!=="string"||!m.name.startsWith("Puskeswan Fiktif ")||
    typeof m.region!=="string"||!m.region.trim()||m.status!=="aktif"||
    facilities.has(m.id)||aliases.has(m.support_id))fail("Master/crosswalk DEMO tidak unik atau tidak sah.");
  facilities.set(m.id,m);aliases.add(m.support_id);
 }
 for(const state of states){
  const m=facilities.get(state?.facility?.id);
  if(!m||seen.has(m.id)||state.facility.region!==m.region||state.facility.name!==m.name)
    fail("Identitas/cakupan sumber tidak sesuai master.");
  seen.add(m.id);
  validateProblems(state);validateNeeds(state);validatePriorityAssessments(state);
  for(const r of state.problems)
   if(r.puskeswan_id!==m.id||r.kab_kota!==m.region)fail("Masalah lintas wilayah.");
  for(const n of state.supportNeeds){
   const p=state.problems.find(x=>x.id===n.problem_id);
   const a=state.priorityAssessments.find(x=>x.need_id===n.id);
   const needId="DEMO-NEED-"+m.id.slice(9)+"-N"+n.id;
   const reasons=[];
   if(n.status!=="terverifikasi")reasons.push("Kebutuhan belum terverifikasi DEMO");
   if(!p||!["tercatat","ditindaklanjuti"].includes(p.status)||
      p.version!==n.source_problem_version)reasons.push("Rujukan masalah belum aktif atau versinya berubah");
   if(!units.has(n.unit))reasons.push("Satuan belum memiliki padanan S10; tidak dikonversi");
   if(n.status==="terverifikasi"&&
     (n.evidence_review?.at_version!==n.version||
      !["verifikator_kab","verifikator_prov"].includes(n.evidence_review?.actor)))
    reasons.push("Metadata pemeriksaan tidak cocok versi/peran");
   if(a?.status==="ditinjau"&&prioritySourceStale(state,a))reasons.push("Penilaian prioritas usang");
   if(reasons.length){excluded.push({canonical_id:m.id,local_need_id:n.id,reasons});continue;}
   const reviewed=a?.status==="ditinjau";
   needs.push({synthetic:true,need_id:needId,puskeswan_id:m.support_id,
    region_demo:"Wilayah fiktif "+m.region,item:n.item,quantity:n.quantity,unit:n.unit,
    status:"terverifikasi",evidence_status:"metadata_demo",
    priority_status:reviewed?"ditinjau":"belum_dinilai",
    priority_band:reviewed?a.review.recommendation_band:null,source_version:n.version});
   links.push({need_id:needId,canonical_id:m.id,support_id:m.support_id,
    local_need_id:n.id,problem_id:n.problem_id,need_version:n.version,
    problem_version:p.version,priority_version:a?.version??null,
    snapshot:clone({facility:m,problem:p,need:n,priority:a??null})});
  }
 }
 buildSupportPlan(needs,[]);
 return {synthetic:true,needs,links,excluded};
}
export function bindPackageSources(bridge,packages){
 buildSupportPlan(bridge.needs,packages);
 return packages.flatMap(p=>p.lines.map(l=>{
  const source=bridge.links.find(x=>x.need_id===l.need_id);
  if(!source)fail("Sumber paket tidak ditemukan.");
  return {package_id:p.id,need_id:l.need_id,snapshot:clone(source.snapshot)};
 }));
}
export function assertPackageSources(bridge,packages,bindings){
 if(!Array.isArray(bindings)||!eq(bindPackageSources(bridge,packages),bindings))
  fail("Sumber M03 berubah atau pengikatan paket tidak sesuai; rekonsiliasi diperlukan.");
}
