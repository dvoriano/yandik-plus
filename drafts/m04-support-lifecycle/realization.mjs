/** M04-S13 | KODE DITULIS, BELUM DIUJI. No real shipment or receipt. */
import {buildDistributionPlan} from "../m04-support-distribution-plan/distribution.mjs";
import {clone,equal,exact,code,date,qty,note,list,unique} from "./common.mjs";
export const REALIZATION_SCHEMA="M04-S13-REALIZATION-DEMO-UNTESTED-1";
export function scheduleSources(ctx){
 const p=buildDistributionPlan(ctx.needs,ctx.packages,ctx.reviews,ctx.schedules);
 return new Map(p.schedules.map(s=>[s.id,{...s,source:clone(ctx.schedules.find(r=>r.id===s.id))}]));
}
function shipmentForm(f){
 exact(f,["id","schedule_id","date_demo","quantity","note"],"Catatan kirim");
 return {id:code(f.id,"DEMO-KIRIM-"),schedule_id:code(f.schedule_id,"DEMO-JADWAL-"),
 date_demo:date(f.date_demo),quantity:qty(f.quantity,1),note:note(f.note)};
}
function receiptForm(f){
 exact(f,["id","shipment_id","date_demo","good","damaged","note"],"Catatan terima");
 const good=qty(f.good),damaged=qty(f.damaged);
 if(good+damaged<1)throw Error("Penerimaan harus memiliki jumlah fisik positif.");
 return {id:code(f.id,"DEMO-TERIMA-"),shipment_id:code(f.shipment_id,"DEMO-KIRIM-"),
 date_demo:date(f.date_demo),good,damaged,note:note(f.note)};
}
export function buildRealization(ctx,shipments,receipts){
 const sources=scheduleSources(ctx),ids=new Set(),sent=new Map(),shipMap=new Map(),received=new Map();
 const sh=list(shipments,"Kirim").map(raw=>{
  exact(raw,["id","schedule_id","date_demo","quantity","note","binding"],"Kirim");
  const {binding,...rest}=raw,f=shipmentForm(rest),s=sources.get(f.schedule_id);
  unique(ids,f.id);
  if(!s||!equal(binding,s.source))throw Error("Jadwal sumber hilang atau berubah.");
  // Dates represent simulated events; early shipment may be noted.
  const total=(sent.get(s.id)||0)+f.quantity;
  if(total>s.quantity)throw Error("Jumlah kirim DEMO melebihi jadwal.");
  sent.set(s.id,total);
  const row={...f,puskeswan_id:s.puskeswan_id,item:s.item,unit:s.unit,
   package_id:s.package_id,need_id:s.need_id,synthetic:true,official:false};
  shipMap.set(f.id,{row,raw});return row;
 });
 const rc=list(receipts,"Terima").map(raw=>{
  exact(raw,["id","shipment_id","date_demo","good","damaged","note","binding"],"Terima");
  const {binding,...rest}=raw,f=receiptForm(rest),s=shipMap.get(f.shipment_id);
  unique(ids,f.id);
  if(!s||!equal(binding,s.raw))throw Error("Catatan kirim sumber hilang atau berubah.");
  if(f.date_demo<s.row.date_demo)throw Error("Tanggal terima mendahului kirim DEMO.");
  const prev=received.get(f.shipment_id)||{good:0,damaged:0};
  const next={good:prev.good+f.good,damaged:prev.damaged+f.damaged};
  if(next.good+next.damaged>s.row.quantity)throw Error("Jumlah terima DEMO melebihi kirim.");
  received.set(f.shipment_id,next);
  return {...f,physical_quantity:f.good+f.damaged,schedule_id:s.row.schedule_id,
   puskeswan_id:s.row.puskeswan_id,item:s.row.item,unit:s.row.unit,
   synthetic:true,official:false};
 });
 const shipmentRows=sh.map(s=>{
  const r=received.get(s.id)||{good:0,damaged:0};
  return {...s,received_good:r.good,received_damaged:r.damaged,
   awaiting_receipt:s.quantity-r.good-r.damaged};
 });
 const scheduleRows=[...sources.values()].map(s=>{
  const rows=shipmentRows.filter(x=>x.schedule_id===s.id);
  const sum=k=>rows.reduce((n,x)=>n+x[k],0);
  return {schedule_id:s.id,puskeswan_id:s.puskeswan_id,item:s.item,unit:s.unit,
   scheduled:s.quantity,simulated_sent:sum("quantity"),
   simulated_good:sum("received_good"),simulated_damaged:sum("received_damaged"),
   unsent_demo:s.quantity-sum("quantity"),awaiting_receipt_demo:sum("awaiting_receipt")};
 });
 return {schema:REALIZATION_SCHEMA,synthetic:true,mode:"CODE_ONLY",
  shipments:shipmentRows,receipts:rc,schedules:scheduleRows,
  totals:{shipment_records:sh.length,receipt_records:rc.length,official_shipments:0,official_receipts:0},
  boundary:"SIMULASI_REALISASI_BUKAN_BUKTI_PENYALURAN"};
}
export function addShipment(ctx,shipments,receipts,form){
 buildRealization(ctx,shipments,receipts);
 const f=shipmentForm(form),s=scheduleSources(ctx).get(f.schedule_id);
 if(!s)throw Error("Jadwal tidak ditemukan.");
 const next=[...shipments,{...f,binding:clone(s.source)}];
 buildRealization(ctx,next,receipts);return clone(next);
}
export function addReceipt(ctx,shipments,receipts,form){
 buildRealization(ctx,shipments,receipts);
 const f=receiptForm(form),s=shipments.find(x=>x.id===f.shipment_id);
 if(!s)throw Error("Kirim tidak ditemukan.");
 const next=[...receipts,{...f,binding:clone(s)}];
 buildRealization(ctx,shipments,next);return clone(next);
}
