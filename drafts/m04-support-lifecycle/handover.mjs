/** M04-S14 | KODE DITULIS, BELUM DIUJI. Metadata only; no signed BAST. */
import {buildRealization} from "./realization.mjs";
import {clone,equal,exact,code,date,note,list,unique} from "./common.mjs";
export const HANDOVER_SCHEMA="M04-S14-HANDOVER-DEMO-UNTESTED-1";
function fields(f){
 exact(f,["id","receipt_ids","document_ref","date_demo","note"],"Rujukan serah terima");
 const rs=list(f.receipt_ids,"Penerimaan",100);
 if(!rs.length)throw Error("Rujukan perlu minimal satu penerimaan DEMO.");
 const ids=new Set();rs.forEach(x=>unique(ids,code(x,"DEMO-TERIMA-")));
 return {id:code(f.id,"DEMO-SERAH-"),receipt_ids:[...rs].sort(),
 document_ref:code(f.document_ref,"DEMO-BAST-"),date_demo:date(f.date_demo),note:note(f.note)};
}
function resolve(f,real,receipts){
 const selected=f.receipt_ids.map(id=>{
  const r=real.receipts.find(x=>x.id===id);
  if(!r)throw Error("Penerimaan sumber tidak ditemukan.");
  if(f.date_demo<r.date_demo)throw Error("Tanggal rujukan mendahului penerimaan.");
  return r;
 });
 if(new Set(selected.map(r=>r.puskeswan_id)).size!==1)
 throw Error("Satu catatan rujukan DEMO hanya untuk satu fasilitas.");
 return {selected,binding:f.receipt_ids.map(id=>clone(receipts.find(r=>r.id===id)))};
}
export function buildHandover(ctx,shipments,receipts,records){
 const real=buildRealization(ctx,shipments,receipts),ids=new Set(),refs=new Set(),used=new Set();
 const rows=list(records,"Serah terima").map(raw=>{
  exact(raw,["id","receipt_ids","document_ref","date_demo","note","binding"],"Serah terima");
  const {binding,...rest}=raw,f=fields(rest),resolved=resolve(f,real,receipts);
  unique(ids,f.id);unique(refs,f.document_ref);f.receipt_ids.forEach(id=>unique(used,id));
  if(!equal(binding,resolved.binding))throw Error("Penerimaan sumber berubah.");
  return {...f,puskeswan_id:resolved.selected[0].puskeswan_id,
   lines:resolved.selected.map(r=>({receipt_id:r.id,item:r.item,unit:r.unit,
    good:r.good,damaged:r.damaged,physical_quantity:r.physical_quantity})),
   status:"metadata_demo_tercatat",authenticity_verified:false,official_bast_issued:false,
   signed:false};
 });
 return {schema:HANDOVER_SCHEMA,synthetic:true,mode:"CODE_ONLY",records:rows,
  uncovered_receipt_ids:real.receipts.filter(r=>!used.has(r.id)).map(r=>r.id),
  totals:{metadata_records:rows.length,official_bast:0,official_signatures:0},
  boundary:"RUJUKAN_DEMO_BUKAN_BAST_SAH"};
}
export function addHandover(ctx,shipments,receipts,records,form){
 buildHandover(ctx,shipments,receipts,records);
 const f=fields(form),real=buildRealization(ctx,shipments,receipts);
 const next=[...records,{...f,binding:resolve(f,real,receipts).binding}];
 buildHandover(ctx,shipments,receipts,next);return clone(next);
}
