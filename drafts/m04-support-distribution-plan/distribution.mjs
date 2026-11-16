/**
 * M04-S12 | KODE DITULIS, BELUM DIUJI.
 * Synthetic scheduling only. No stock, actual shipment, recipient decision,
 * legal verification, budget confirmation, authorization, receipt or BAST.
 */
import {buildSupportPlan} from "../m04-support-package-planning/planning.mjs";
import {reviewSummary} from "../m04-support-package-review/review.mjs";
export const SCHEMA="M04-S12-DISTRIBUTION-PLAN-UNTESTED-1";
export const BOUNDARY="JADWAL_DRAF_DEMO_BUKAN_IZIN_PENYALURAN";
export const METHODS=Object.freeze({antar:"Usulan antar ke fasilitas",
 ambil:"Usulan pengambilan di titik serah"});
const copy=v=>JSON.parse(JSON.stringify(v));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function exact(v,keys,label){
 if(!v||typeof v!=="object"||Array.isArray(v)||Object.keys(v).length!==keys.length||
 keys.some(k=>!Object.hasOwn(v,k)))throw Error(label+": struktur tidak sah.");
}
function id(v,pattern,label){
 if(typeof v!=="string"||!pattern.test(v))throw Error(label+": kode DEMO tidak sah.");
 return v;
}
function date(v){
 if(typeof v!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(v)||
 !Number.isFinite(Date.parse(v+"T00:00:00Z"))||
 new Date(v+"T00:00:00Z").toISOString().slice(0,10)!==v)
 throw Error("Tanggal rencana tidak sah.");
 return v;
}
const PKG=/^DEMO-PKG-[A-Z0-9_-]{1,40}$/,NEED=/^DEMO-NEED-[A-Z0-9_-]{1,40}$/;
const ROW=/^DEMO-JADWAL-[A-Z0-9_-]{1,40}$/;
function sourceIndex(needs,packages,reviews){
 const plan=buildSupportPlan(needs,packages);
 if(!Array.isArray(reviews)||reviews.length>100)throw Error("Daftar telaah DEMO tidak sah.");
 const map=new Map(),ids=new Set();
 for(const r of reviews){
  const s=reviewSummary(r,needs,packages);
  if(ids.has(s.id)||map.has(s.package_id))throw Error("Telaah sumber ganda.");
  ids.add(s.id);
  // The entire source review is retained in the binding below; it is not a signature.
  const usable=!s.stale&&r.status==="tercatat_untuk_pembahasan"&&
   s.decision_metadata_present&&s.budget_metadata_present;
  const p=plan.packages.find(x=>x.id===s.package_id);
  map.set(s.package_id,{r,s,p,usable});
 }
 return {plan,map};
}
function binding(source,line){
 return {review_id:source.r.id,review_revision:source.r.revision,
  review_snapshot:copy(source.r),need_id:line.need_id,
  source_version:line.source_version,package_quantity:line.quantity,
  puskeswan_id:line.puskeswan_id,item:line.item,unit:line.unit};
}
function rowFields(v){
 exact(v,["id","package_id","need_id","date_demo","method","quantity"],"Baris rencana");
 const q=v.quantity;
 if(!Number.isSafeInteger(q)||q<1||q>100000)throw Error("Jumlah harus bilangan bulat positif.");
 if(!Object.hasOwn(METHODS,v.method))throw Error("Cara distribusi DEMO tidak dikenal.");
 return {id:id(v.id,ROW,"Jadwal"),package_id:id(v.package_id,PKG,"Paket"),
  need_id:id(v.need_id,NEED,"Kebutuhan"),date_demo:date(v.date_demo),
  method:v.method,quantity:q};
}
function lineSource(index,fields){
 const src=index.map.get(fields.package_id);
 if(!src?.usable||!src.p)throw Error("Paket belum dicatat untuk pembahasan atau sumber berubah.");
 const line=src.p.lines.find(l=>l.need_id===fields.need_id);
 if(!line)throw Error("Baris kebutuhan tidak ada dalam paket.");
 return {src,line};
}
export function createScheduleRow(needs,packages,reviews,form){
 const f=rowFields(form),{src,line}=lineSource(sourceIndex(needs,packages,reviews),f);
 return {...f,binding:binding(src,line)};
}
export function buildDistributionPlan(needs,packages,reviews,rows){
 const index=sourceIndex(needs,packages,reviews);
 if(!Array.isArray(rows)||rows.length>500)throw Error("Daftar jadwal tidak sah.");
 const rowIds=new Set(),acc=new Map();
 const schedules=rows.map(raw=>{
  exact(raw,["id","package_id","need_id","date_demo","method","quantity","binding"],"Jadwal");
  const {binding:stored,...input}=raw,f=rowFields(input);
  if(rowIds.has(f.id))throw Error("ID jadwal ganda.");
  rowIds.add(f.id);
  const {src,line}=lineSource(index,f);
  const current=binding(src,line);
  if(!eq(stored,current))throw Error("Rujukan telaah/paket berubah; buat rencana baru setelah rekonsiliasi.");
  const k=f.package_id+"|"+f.need_id;
  const total=(acc.get(k)||0)+f.quantity;
  if(total>line.quantity)throw Error("Jumlah jadwal melebihi jumlah baris paket.");
  acc.set(k,total);
  return {...f,puskeswan_id:line.puskeswan_id,region_demo:line.region_demo,
   item:line.item,unit:line.unit,review_id:src.r.id,review_revision:src.r.revision,
   status:"draf_jadwal",authorized_to_deliver:false,actual_delivery:false,
   actual_quantity:null,receipt_reference:null};
 });
 const lines=index.plan.packages.flatMap(p=>p.lines.map(l=>{
  const eligible=index.map.get(p.id)?.usable===true;
  const scheduled=acc.get(p.id+"|"+l.need_id)||0;
  return {package_id:p.id,package_title:p.title,need_id:l.need_id,
   puskeswan_id:l.puskeswan_id,region_demo:l.region_demo,item:l.item,unit:l.unit,
   package_quantity:l.quantity,scheduled_quantity:scheduled,
   unscheduled_quantity:eligible?l.quantity-scheduled:null,
   eligible_for_demo_schedule:eligible};
 }));
 const units=[...new Set(lines.filter(l=>l.eligible_for_demo_schedule).map(l=>l.unit))];
 const byUnit=units.map(unit=>{
  const ls=lines.filter(l=>l.eligible_for_demo_schedule&&l.unit===unit);
  return {unit,package_quantity:ls.reduce((n,l)=>n+l.package_quantity,0),
   scheduled_quantity:ls.reduce((n,l)=>n+l.scheduled_quantity,0),
   unscheduled_quantity:ls.reduce((n,l)=>n+l.unscheduled_quantity,0)};
 });
 return {schema:SCHEMA,synthetic:true,mode:"CODE_ONLY",boundary:BOUNDARY,
  lines,schedules:schedules.sort((a,b)=>a.date_demo.localeCompare(b.date_demo)||a.id.localeCompare(b.id)),
  quantities_by_unit:byUnit,
  totals:{packages:index.plan.packages.length,schedule_eligible_lines:lines.filter(l=>l.eligible_for_demo_schedule).length,
   draft_schedules:schedules.length,actual_shipments:0,confirmed_receipts:0,
   official_authorizations:0,official_bast:0},
  warnings:["Jadwal hanya draf fiktif, tidak memesan barang, kendaraan atau stok.",
   "S11 tercatat untuk pembahasan bukan keputusan penerima, dana tersedia atau izin penyaluran.",
   "Tujuan dan satuan berasal dari baris paket, bukan pilihan bebas.",
   "Sisa adalah jumlah paket yang belum dijadwalkan, bukan stok atau barang yang belum diterima.",
   "Pelaksanaan nyata menunggu dasar keputusan, pengadaan/stok, otorisasi, sistem resmi dan QA."]};
}
export function saveSchedule(needs,packages,reviews,rows,form){
 buildDistributionPlan(needs,packages,reviews,rows);
 const nextRow=createScheduleRow(needs,packages,reviews,form);
 const next=rows.some(r=>r.id===nextRow.id)?rows.map(r=>r.id===nextRow.id?nextRow:r):[...rows,nextRow];
 buildDistributionPlan(needs,packages,reviews,next);
 return copy(next);
}
export function removeSchedule(needs,packages,reviews,rows,idToRemove){
 buildDistributionPlan(needs,packages,reviews,rows);
 if(!rows.some(r=>r.id===idToRemove))throw Error("Jadwal tidak ditemukan.");
 const next=rows.filter(r=>r.id!==idToRemove);
 buildDistributionPlan(needs,packages,reviews,next);
 return copy(next);
}
