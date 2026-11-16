/** S13–S15 | 24 scenarios written, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {demoContext} from "../fixtures.mjs";
import {buildRealization,addShipment,addReceipt} from "../realization.mjs";
import {buildHandover,addHandover} from "../handover.mjs";
import {buildMonitoring,addObservation} from "../monitoring.mjs";
const shipment=(patch={})=>({id:"DEMO-KIRIM-001",schedule_id:"DEMO-JADWAL-001",
 date_demo:"2026-12-01",quantity:2,note:"Contoh pencatatan kirim fiktif.",...patch});
const receipt=(patch={})=>({id:"DEMO-TERIMA-001",shipment_id:"DEMO-KIRIM-001",
 date_demo:"2026-12-02",good:1,damaged:0,note:"Contoh penerimaan barang fiktif.",...patch});
const handover=(patch={})=>({id:"DEMO-SERAH-001",receipt_ids:["DEMO-TERIMA-001"],
 document_ref:"DEMO-BAST-001",date_demo:"2026-12-03",note:"Metadata rujukan fiktif saja.",...patch});
const observation=(patch={})=>({id:"DEMO-MON-001",handover_id:"DEMO-SERAH-001",
 receipt_id:"DEMO-TERIMA-001",date_demo:"2026-12-04",used:1,idle:0,broken:0,
 note:"Catatan kondisi pemanfaatan fiktif.",...patch});
function start(){
 const ctx=demoContext(),sh=addShipment(ctx,[],[],shipment());
 const rc=addReceipt(ctx,sh,[],receipt());
 const h=addHandover(ctx,sh,rc,[],handover());
 return {ctx,sh,rc,h};
}
test("S13 empty schedule ledger has no simulated or official realization",()=>{
 const r=buildRealization(demoContext(),[],[]);
 assert.equal(r.schedules.length,2);assert.equal(r.schedules[0].unsent_demo,2);
 assert.equal(r.totals.official_shipments,0);
});
test("S13 partial shipments and receipt balances",()=>{
 const {ctx,sh,rc}=start();const r=buildRealization(ctx,sh,rc);
 assert.equal(r.schedules[0].simulated_sent,2);
 assert.equal(r.schedules[0].simulated_good,1);
 assert.equal(r.schedules[0].awaiting_receipt_demo,1);
});
test("S13 damaged physical receipt is not good stock",()=>{
 const {ctx,sh,rc}=start();
 const next=addReceipt(ctx,sh,rc,receipt({id:"DEMO-TERIMA-002",good:0,damaged:1}));
 const r=buildRealization(ctx,sh,next);
 assert.equal(r.schedules[0].simulated_damaged,1);
 assert.equal(r.schedules[0].awaiting_receipt_demo,0);
 assert.equal(r.schedules[0].simulated_good,1);
});
test("S13 reject shipment overscheduling",()=>{
 const {ctx,sh,rc}=start();
 assert.throws(()=>addShipment(ctx,sh,rc,shipment({id:"DEMO-KIRIM-002",quantity:1})),/melebihi/);
});
test("S13 reject cumulative excess receipt and zero physical receipt",()=>{
 const {ctx,sh,rc}=start();
 assert.throws(()=>addReceipt(ctx,sh,rc,receipt({id:"DEMO-TERIMA-002",good:2})),/melebihi/);
 assert.throws(()=>addReceipt(ctx,sh,rc,receipt({id:"DEMO-TERIMA-002",good:0})));
});
test("S13 reject receipt before shipment and invalid quantities",()=>{
 const {ctx,sh}=start();
 assert.throws(()=>addReceipt(ctx,sh,[],receipt({date_demo:"2026-11-30"})));
 for(const quantity of [0,-1,1.5,"1"])assert.throws(()=>addShipment(ctx,[],[],shipment({quantity})));
});
test("S13 reject changed schedule or shipment snapshot",()=>{
 const {ctx,sh,rc}=start();
 const other={...ctx,schedules:ctx.schedules.map((r,i)=>i?r:{...r,date_demo:"2026-12-03"})};
 assert.throws(()=>buildRealization(other,sh,rc));
 assert.throws(()=>buildRealization(ctx,[{...sh[0],note:"Keterangan berbeda."}],rc));
});
test("S13 reject duplicate IDs invented destination and official flags",()=>{
 const {ctx,sh,rc}=start();
 assert.throws(()=>buildRealization(ctx,[...sh,...sh],rc));
 assert.throws(()=>addReceipt(ctx,sh,rc,receipt()));
 assert.throws(()=>addShipment(ctx,[],[],shipment({puskeswan_id:"DEMO-PUSK-999"})));
 assert.throws(()=>addReceipt(ctx,sh,[],receipt({official:true})));
});
test("S14 link receipt exactly and preserve both conditions",()=>{
 const {ctx,sh,rc,h}=start();const x=buildHandover(ctx,sh,rc,h);
 assert.equal(x.records[0].lines[0].receipt_id,rc[0].id);
 assert.equal(x.records[0].lines[0].good,1);
 assert.equal(x.uncovered_receipt_ids.length,0);
});
test("S14 no metadata without physical receipt",()=>{
 const {ctx,sh}=start();
 assert.throws(()=>addHandover(ctx,sh,[],[],handover()));
});
test("S14 reject duplicate document ref or reuse of receipt",()=>{
 const {ctx,sh,rc,h}=start();
 assert.throws(()=>addHandover(ctx,sh,rc,h,handover({id:"DEMO-SERAH-002",document_ref:"DEMO-BAST-002"})));
 assert.throws(()=>buildHandover(ctx,sh,rc,[...h,...h]));
});
test("S14 multiple receipts for same facility remain individual lines",()=>{
 const {ctx,sh,rc}=start();
 const next=addReceipt(ctx,sh,rc,receipt({id:"DEMO-TERIMA-002",good:0,damaged:1}));
 const h=addHandover(ctx,sh,next,[],handover({receipt_ids:[rc[0].id,next[1].id]}));
 const r=buildHandover(ctx,sh,next,h).records[0];
 assert.equal(r.lines.length,2);assert.equal(r.lines[1].damaged,1);
});
test("S14 reject grouping different facilities",()=>{
 const {ctx,sh,rc}=start();
 const ss=addShipment(ctx,sh,rc,shipment({id:"DEMO-KIRIM-002",schedule_id:"DEMO-JADWAL-002",quantity:1}));
 const rr=addReceipt(ctx,ss,rc,receipt({id:"DEMO-TERIMA-002",shipment_id:ss[1].id}));
 assert.throws(()=>addHandover(ctx,ss,rr,[],handover({receipt_ids:rr.map(r=>r.id)})),/fasilitas/);
});
test("S14 reject earlier dates and external-style document numbers",()=>{
 const {ctx,sh,rc}=start();
 assert.throws(()=>addHandover(ctx,sh,rc,[],handover({date_demo:"2026-12-01"})));
 assert.throws(()=>addHandover(ctx,sh,rc,[],handover({document_ref:"BAST-REAL-001"})));
});
test("S14 changed receipt text invalidates old handover binding",()=>{
 const {ctx,sh,rc,h}=start();
 assert.throws(()=>buildHandover(ctx,sh,[{...rc[0],note:"Perubahan catatan penerimaan."}],h));
});
test("S14 metadata never asserts signed legal or official document",()=>{
 const {ctx,sh,rc,h}=start();const p=buildHandover(ctx,sh,rc,h);
 assert.equal(p.totals.official_bast,0);assert.equal(p.records[0].signed,false);
 assert.equal(p.records[0].authenticity_verified,false);
 assert.throws(()=>addHandover(ctx,sh,rc,[],handover({signed:true})));
});
test("S15 unobserved accepted items are not classified as idle",()=>{
 const {ctx,sh,rc,h}=start();const p=buildMonitoring(ctx,sh,rc,h,[]);
 assert.equal(p.lines[0].latest,null);assert.equal(p.quantities_by_unit[0].unobserved,1);
 assert.equal(p.quantities_by_unit[0].idle,0);
});
test("S15 condition sum must match good quantity",()=>{
 const {ctx,sh,rc,h}=start();
 assert.throws(()=>addObservation(ctx,sh,rc,h,[],observation({used:2})));
 assert.throws(()=>addObservation(ctx,sh,rc,h,[],observation({used:0})));
});
test("S15 only latest observation counts in summary",()=>{
 const {ctx,sh,rc,h}=start();let o=addObservation(ctx,sh,rc,h,[],observation());
 o=addObservation(ctx,sh,rc,h,o,observation({id:"DEMO-MON-002",date_demo:"2026-12-05",used:0,broken:1}));
 const x=buildMonitoring(ctx,sh,rc,h,o).quantities_by_unit[0];
 assert.equal(x.monitored,1);assert.equal(x.used,0);assert.equal(x.broken,1);
 assert.equal(x.unobserved,0);
});
test("S15 out-of-order entry does not replace newer observation",()=>{
 const {ctx,sh,rc,h}=start();let o=addObservation(ctx,sh,rc,h,[],observation({date_demo:"2026-12-05",used:0,idle:1}));
 o=addObservation(ctx,sh,rc,h,o,observation({id:"DEMO-MON-002",date_demo:"2026-12-04"}));
 assert.equal(buildMonitoring(ctx,sh,rc,h,o).quantities_by_unit[0].idle,1);
});
test("S15 reject same-day duplicate and monitoring before handover",()=>{
 const {ctx,sh,rc,h}=start(),o=addObservation(ctx,sh,rc,h,[],observation());
 assert.throws(()=>addObservation(ctx,sh,rc,h,o,observation({id:"DEMO-MON-002"})));
 assert.throws(()=>addObservation(ctx,sh,rc,h,[],observation({date_demo:"2026-12-02"})));
});
test("S15 fully damaged receipt is not eligible for utilization",()=>{
 const {ctx,sh}=start(),rc=addReceipt(ctx,sh,[],receipt({good:0,damaged:1}));
 const h=addHandover(ctx,sh,rc,[],handover());
 assert.equal(buildMonitoring(ctx,sh,rc,h,[]).lines.length,0);
 assert.throws(()=>addObservation(ctx,sh,rc,h,[],observation()));
});
test("S15 reject changed handover, foreign receipt and official evaluation flag",()=>{
 const {ctx,sh,rc,h}=start(),o=addObservation(ctx,sh,rc,h,[],observation());
 assert.throws(()=>buildMonitoring(ctx,sh,rc,[{...h[0],note:"Catatan referensi diubah."}],o));
 assert.throws(()=>addObservation(ctx,sh,rc,h,[],observation({receipt_id:"DEMO-TERIMA-999"})));
 assert.throws(()=>addObservation(ctx,sh,rc,h,[],observation({official:true})));
});
test("S15 deterministic end-to-end DEMO without mutating source or counting units together",()=>{
 const {ctx,sh,rc,h}=start(),before=JSON.stringify([ctx,sh,rc,h]);
 const o=addObservation(ctx,sh,rc,h,[],observation());
 assert.deepEqual(buildMonitoring(ctx,sh,rc,h,o),buildMonitoring(ctx,sh,rc,h,o));
 assert.equal(buildMonitoring(ctx,sh,rc,h,o).totals.official_evaluations,0);
 assert.equal(JSON.stringify([ctx,sh,rc,h]),before);
});
