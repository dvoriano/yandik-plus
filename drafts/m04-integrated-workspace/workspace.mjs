/** M04-I1 | KODE DITULIS, BELUM DIUJI. Shared DEMO session, no authentication. */
import {bridgeSources,bindPackageSources,assertPackageSources} from "./bridge.mjs";
import {allSections} from "../../prototypes/profil-puskeswan/model.mjs";
import {readApelSnapshot,readSdmSnapshot} from "../../prototypes/profil-puskeswan/source_snapshots.mjs";
import {buildSupportPlan,replaceDraft} from "../m04-support-package-planning/planning.mjs";
import {createReview,submitReview,reviewPackage} from "../m04-support-package-review/review.mjs";
import {MAKER,REVIEWER,REFERENCES} from "../m04-support-package-review/fixtures.mjs";
import {buildDistributionPlan,saveSchedule} from "../m04-support-distribution-plan/distribution.mjs";
import {buildRealization,addShipment,addReceipt} from "../m04-support-lifecycle/realization.mjs";
import {buildHandover,addHandover} from "../m04-support-lifecycle/handover.mjs";
import {buildMonitoring,addObservation} from "../m04-support-lifecycle/monitoring.mjs";
export const SCHEMA="M04-I1-INTEGRATED-WORKSPACE-DEMO-UNTESTED-1";
export const ACTIONS=["paket","telaah","jadwal","kirim","terima","rujukan","monitor"];
const clone=x=>JSON.parse(JSON.stringify(x));
export function startWorkspace(master,states){
 bridgeSources(master,states);
 return {schema:SCHEMA,synthetic:true,master:clone(master),states:clone(states),
 packages:[],bindings:[],reviews:[],schedules:[],shipments:[],receipts:[],handovers:[],observations:[]};
}
export function models(w){
 if(w?.schema!==SCHEMA||w.synthetic!==true)throw Error("Workspace DEMO diperlukan.");
 const bridge=bridgeSources(w.master,w.states);
 assertPackageSources(bridge,w.packages,w.bindings);
 const ctx={needs:bridge.needs,packages:w.packages,reviews:w.reviews,schedules:w.schedules};
 const plan=buildSupportPlan(ctx.needs,ctx.packages);
 const dist=buildDistributionPlan(ctx.needs,ctx.packages,ctx.reviews,ctx.schedules);
 const real=buildRealization(ctx,w.shipments,w.receipts);
 const handover=buildHandover(ctx,w.shipments,w.receipts,w.handovers);
 const monitoring=buildMonitoring(ctx,w.shipments,w.receipts,w.handovers,w.observations);
 return {bridge,ctx,plan,dist,real,handover,monitoring};
}
// One deterministic scenario per facility. Explicit user action advances a single
// stage. No real authorization and no claim of arbitrary workflow editing.
export function advanceDemo(w,facilityId,action){
 const m=w.master.find(x=>x.id===facilityId);
 if(!m||!ACTIONS.includes(action))throw Error("Fasilitas/tindakan DEMO tidak dikenal.");
 const x=models(w),key=m.id.slice(9),pId="DEMO-PKG-"+key,
 rId="DEMO-TELAAH-"+key,sId="DEMO-JADWAL-"+key,
 kId="DEMO-KIRIM-"+key,tId="DEMO-TERIMA-"+key,hId="DEMO-SERAH-"+key,
 oId="DEMO-MON-"+key;
 const available=x.bridge.needs.find(n=>n.puskeswan_id===m.support_id);
 if(!available)throw Error("Belum ada kebutuhan yang dapat dijembatani.");
 const p=w.packages.find(p=>p.id===pId),r=w.reviews.find(r=>r.id===rId);
 const s=w.schedules.find(s=>s.id===sId),k=w.shipments.find(k=>k.id===kId);
 const t=w.receipts.find(t=>t.id===tId),h=w.handovers.find(h=>h.id===hId);
 let next={...w};
 if(action==="paket"&&!p){
  next.packages=replaceDraft(x.ctx.needs,w.packages,{id:pId,title:"Paket fiktif "+m.name,
   purpose:"Bahan perencanaan dari kebutuhan M03 dalam workspace DEMO.",
   lines:[{need_id:available.need_id,source_version:available.source_version,quantity:available.quantity}]});
  next.bindings=bindPackageSources(x.bridge,next.packages);
 }else if(action==="telaah"&&p&&!r){
  const draft=createReview(x.ctx.needs,w.packages,rId,{package_id:pId,fields:REFERENCES},MAKER);
  const submitted=submitReview(draft,x.ctx.needs,w.packages,MAKER);
  next.reviews=[...w.reviews,reviewPackage(submitted,x.ctx.needs,w.packages,REVIEWER,
   "catat_pembahasan","Catatan simulasi pembahasan paket, bukan persetujuan.",true)];
 }else if(action==="jadwal"&&r&&p&&!s){
  const l=p.lines[0];
  next.schedules=saveSchedule(x.ctx.needs,w.packages,w.reviews,w.schedules,
   {id:sId,package_id:pId,need_id:l.need_id,date_demo:"2026-12-01",method:"antar",quantity:l.quantity});
 }else if(action==="kirim"&&s&&!k){
  next.shipments=addShipment(x.ctx,w.shipments,w.receipts,{id:kId,schedule_id:sId,
   date_demo:"2026-12-01",quantity:s.quantity,note:"Catatan realisasi contoh, bukan pengiriman aktual."});
 }else if(action==="terima"&&k&&!t){
  next.receipts=addReceipt(x.ctx,w.shipments,w.receipts,{id:tId,shipment_id:kId,
   date_demo:"2026-12-02",good:k.quantity,damaged:0,note:"Penerimaan fiktif dalam satu alur demonstrasi."});
 }else if(action==="rujukan"&&t&&!h){
  next.handovers=addHandover(x.ctx,w.shipments,w.receipts,w.handovers,{id:hId,
   receipt_ids:[tId],document_ref:"DEMO-BAST-"+key,date_demo:"2026-12-03",
   note:"Metadata serah terima fiktif, bukan dokumen sah."});
 }else if(action==="monitor"&&h&&t&&!w.observations.some(x=>x.id===oId)){
  next.observations=addObservation(x.ctx,w.shipments,w.receipts,w.handovers,w.observations,
   {id:oId,handover_id:hId,receipt_id:tId,date_demo:"2026-12-04",used:t.good,idle:0,
    broken:0,note:"Pengamatan penggunaan barang fiktif dalam demonstrasi."});
 }else throw Error("Tahap belum tersedia atau sudah pernah dicatat.");
 models(next);return next;
}
function apel(id,period){
 const a=readApelSnapshot(id,period);
 return {status:a.status,periode:period,kategori:a.kategori?{...a.kategori}:null,
  total:a.kategori?Object.values(a.kategori).reduce((n,v)=>n+v,0):null,
  source:a.source};
}
export function viewWorkspace(w,actor,period,facilityId=null){
 if(typeof period!=="string"||!/^\d{4}-(0[1-9]|1[0-2])$/.test(period))throw Error("Periode tidak sah.");
 const roles=["puskeswan","kab_kota","provinsi_verifikator","provinsi_admin","pimpinan"];
 if(!actor||!roles.includes(actor.role))throw Error("Peran DEMO tidak dikenal.");
 const x=models(w);
 let allowed=w.master;
 if(actor.role==="puskeswan")allowed=allowed.filter(m=>m.id===actor.puskeswan_id&&m.region===actor.region);
 if(actor.role==="kab_kota")allowed=allowed.filter(m=>m.region===actor.region);
 if(!allowed.length)throw Error("Tidak ada cakupan DEMO yang cocok.");
 if(actor.role==="pimpinan"&&facilityId!==null)throw Error("Pimpinan hanya agregat.");
 const visible=allowed.map(m=>{
  const a=apel(m.id,period),state=w.states.find(s=>s.facility.id===m.id);
  return {m,a,state,eligible:x.bridge.links.filter(l=>l.canonical_id===m.id).length};
 });
 const reports=visible.filter(v=>v.a.total!==null);
 const aggregate={facilities:visible.length,reports:reports.length,missing:visible.length-reports.length,
  services:reports.length?reports.reduce((n,v)=>n+v.a.total,0):null,
  bridge_eligible:visible.reduce((n,v)=>n+v.eligible,0)};
 if(facilityId===null)return {synthetic:true,period,aggregate,details:null};
 const v=visible.find(x=>x.m.id===facilityId);
 if(!v)throw Error("Fasilitas di luar cakupan DEMO.");
 const matches=r=>r.puskeswan_id===v.m.support_id;
 const packages=x.plan.packages.filter(p=>p.lines.some(matches)).map(p=>({
  id:p.id,title:p.title,lines:p.lines.filter(matches)}));
 const schedule=x.dist.schedules.filter(matches);
 const ship=x.real.shipments.filter(matches),receipt=x.real.receipts.filter(matches);
 const handover=x.handover.records.filter(matches),monitor=x.monitoring.lines.filter(matches);
 const needRows=(v.state?.supportNeeds??[]).filter(n=>actor.role==="puskeswan"||n.status!=="draf");
 return clone({synthetic:true,period,aggregate,details:{facility:v.m,
  profile:v.state?allSections(v.state).map(s=>({id:s.id,label:s.label,value:s.value,status:s.status})):null,
  sdm:readSdmSnapshot(v.m.id),apel:v.a,
  needs:needRows.map(n=>({id:n.id,item:n.item,quantity:n.quantity,unit:n.unit,status:n.status})),
  excluded:x.bridge.excluded.filter(l=>l.canonical_id===v.m.id&&needRows.some(n=>n.id===l.local_need_id)),
  packages,schedule,ship,receipt,handover,monitor}});
}
