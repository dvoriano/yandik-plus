/** M04-S15 | KODE DITULIS, BELUM DIUJI. No real evaluation. */
import {buildHandover} from "./handover.mjs";
import {clone,equal,exact,code,date,qty,note,list,unique} from "./common.mjs";
export const MONITORING_SCHEMA="M04-S15-UTILIZATION-DEMO-UNTESTED-1";
function fields(f){
 exact(f,["id","handover_id","receipt_id","date_demo","used","idle","broken","note"],"Monitoring");
 return {id:code(f.id,"DEMO-MON-"),handover_id:code(f.handover_id,"DEMO-SERAH-"),
 receipt_id:code(f.receipt_id,"DEMO-TERIMA-"),date_demo:date(f.date_demo),
 used:qty(f.used),idle:qty(f.idle),broken:qty(f.broken),note:note(f.note)};
}
function resolve(f,handover,records){
 const h=handover.records.find(r=>r.id===f.handover_id),l=h?.lines.find(r=>r.receipt_id===f.receipt_id);
 if(!h||!l||l.good<1)throw Error("Tidak ada barang baik dari rujukan DEMO untuk dimonitor.");
 if(f.date_demo<h.date_demo)throw Error("Monitoring mendahului rujukan serah terima.");
 if(f.used+f.idle+f.broken!==l.good)throw Error("Jumlah kondisi harus sama dengan barang baik diterima.");
 return {h,l,binding:clone(records.find(r=>r.id===h.id))};
}
export function buildMonitoring(ctx,shipments,receipts,records,observations){
 const h=buildHandover(ctx,shipments,receipts,records),ids=new Set(),days=new Set(),latest=new Map();
 const rows=list(observations,"Monitoring").map(raw=>{
  exact(raw,["id","handover_id","receipt_id","date_demo","used","idle","broken","note","binding"],"Monitoring");
  const {binding,...rest}=raw,f=fields(rest),x=resolve(f,h,records);
  unique(ids,f.id);unique(days,f.handover_id+"|"+f.receipt_id+"|"+f.date_demo);
  if(!equal(binding,x.binding))throw Error("Rujukan serah terima berubah.");
  const row={...f,item:x.l.item,unit:x.l.unit,puskeswan_id:x.h.puskeswan_id,
   eligible_quantity:x.l.good,synthetic:true,official:false};
  const key=f.handover_id+"|"+f.receipt_id;
  if(!latest.has(key)||latest.get(key).date_demo<f.date_demo)latest.set(key,row);
  return row;
 });
 const lines=h.records.flatMap(r=>r.lines.filter(l=>l.good>0).map(l=>({
  handover_id:r.id,receipt_id:l.receipt_id,puskeswan_id:r.puskeswan_id,
  item:l.item,unit:l.unit,eligible_quantity:l.good,
  latest:latest.get(r.id+"|"+l.receipt_id)??null
 })));
 const units=[...new Set(lines.map(l=>l.unit))].map(unit=>{
  const selected=lines.filter(l=>l.unit===unit);
  const sum=k=>selected.reduce((n,l)=>n+(l.latest?.[k]??0),0);
  return {unit,eligible:selected.reduce((n,l)=>n+l.eligible_quantity,0),
   monitored:selected.reduce((n,l)=>n+(l.latest?l.eligible_quantity:0),0),
   used:sum("used"),idle:sum("idle"),broken:sum("broken"),
   unobserved:selected.reduce((n,l)=>n+(l.latest?0:l.eligible_quantity),0)};
 });
 return {schema:MONITORING_SCHEMA,synthetic:true,mode:"CODE_ONLY",observations:rows,
  lines,quantities_by_unit:units,totals:{observations:rows.length,official_evaluations:0},
  boundary:"PEMANFAATAN_DEMO_BUKAN_HASIL_EVALUASI_RESMI"};
}
export function addObservation(ctx,shipments,receipts,records,observations,form){
 buildMonitoring(ctx,shipments,receipts,records,observations);
 const f=fields(form),h=buildHandover(ctx,shipments,receipts,records);
 const next=[...observations,{...f,binding:resolve(f,h,records).binding}];
 buildMonitoring(ctx,shipments,receipts,records,next);return clone(next);
}
