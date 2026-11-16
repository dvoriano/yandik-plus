/** 14 skenario tertulis, BELUM DIJALANKAN. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDistributionPlan,createScheduleRow,saveSchedule,removeSchedule,BOUNDARY} from "../distribution.mjs";
import {NEEDS,DEMO_PACKAGES,demoReview} from "../fixtures.mjs";
import {REFERENCES} from "../../m04-support-package-review/fixtures.mjs";
const form=(patch={})=>({id:"DEMO-JADWAL-001",package_id:"DEMO-PKG-001",
 need_id:"DEMO-NEED-001",date_demo:"2026-12-01",method:"antar",quantity:1,...patch});
const reviews=()=>[demoReview()];
const build=(rows=[],rs=reviews(),needs=NEEDS,packages=DEMO_PACKAGES)=>
 buildDistributionPlan(needs,packages,rs,rows);
const add=(rows=[],f=form(),rs=reviews())=>saveSchedule(NEEDS,DEMO_PACKAGES,rs,rows,f);
test("empty schedule shows eligible package quantities and no shipments",()=>{
 const p=build();assert.equal(p.lines.length,2);assert.equal(p.totals.schedule_eligible_lines,2);
 assert.equal(p.lines[0].unscheduled_quantity,2);assert.equal(p.totals.actual_shipments,0);
});
test("destination and unit are derived from package",()=>{
 const p=build(add());assert.equal(p.schedules[0].puskeswan_id,"DEMO-PUSK-001");
 assert.equal(p.schedules[0].unit,"unit");assert.equal(p.lines[0].unscheduled_quantity,1);
});
test("split schedules may exactly exhaust package quantity",()=>{
 const rows=add(add(),form({id:"DEMO-JADWAL-002",date_demo:"2026-12-02"}));
 assert.equal(build(rows).lines[0].unscheduled_quantity,0);
 assert.equal(build(rows).schedules.length,2);
});
test("reject cumulative overscheduling and retain original input",()=>{
 const rows=add();assert.throws(()=>add(rows,form({id:"DEMO-JADWAL-002",quantity:2})),/melebihi/);
 assert.equal(rows[0].quantity,1);
});
test("edit replaces row instead of double counting",()=>{
 const rows=add(add(),form({quantity:2}));
 assert.equal(rows.length,1);assert.equal(build(rows).lines[0].unscheduled_quantity,0);
});
test("deletion releases draft quantity only",()=>{
 const rs=reviews(),rows=add([],form(),rs);
 const next=removeSchedule(NEEDS,DEMO_PACKAGES,rs,rows,rows[0].id);
 assert.equal(build(next,rs).lines[0].unscheduled_quantity,2);
 assert.equal(rows.length,1);
});
test("unreviewed and returned package cannot be scheduled",()=>{
 assert.equal(build([],[]).totals.schedule_eligible_lines,0);
 assert.throws(()=>add([],form(),[]));
 const returned=[demoReview({...REFERENCES,budget_reference:null},"kembalikan")];
 assert.throws(()=>add([],form(),returned));
});
test("invalid changed source and same-version item change reject schedules",()=>{
 const rs=reviews(),rows=add([],form(),rs);
 assert.throws(()=>build(rows,rs,NEEDS.map((n,i)=>i?n:{...n,item:"Barang contoh berubah"})));
 assert.throws(()=>build(rows,rs,NEEDS,DEMO_PACKAGES.map(p=>({...p,title:"Paket berubah"}))));
});
test("changed review metadata invalidates previous binding",()=>{
 const rows=add();
 const rs=[demoReview({...REFERENCES,note:"Catatan metadata fiktif yang berbeda."})];
 assert.throws(()=>build(rows,rs),/berubah/);
});
test("duplicate reviews and schedule IDs rejected",()=>{
 const r=reviews(),rows=add([],form(),r);
 assert.throws(()=>build(rows,[...r,...r]),/ganda/);
 assert.throws(()=>build([...rows,...rows],r),/ganda/);
});
test("reject unknown line, date, method, and invalid quantity",()=>{
 for(const patch of [{need_id:"DEMO-NEED-404"},{date_demo:"2026-02-30"},
 {method:"dikirim"},...([0,-1,0.5,"1"].map(quantity=>({quantity})))])
  assert.throws(()=>add([],form(patch)));
});
test("reject invented destination, official fields and modified bound review",()=>{
 assert.throws(()=>add([],form({puskeswan_id:"DEMO-PUSK-002"})));
 assert.throws(()=>add([],form({authorized_to_deliver:true})));
 const rows=add();assert.throws(()=>build([{...rows[0],binding:{...rows[0].binding,review_revision:99}}]));
});
test("different units are not combined and no actual receipt or approval",()=>{
 const rows=add(add(),form({id:"DEMO-JADWAL-002",need_id:"DEMO-NEED-002"}));
 const p=build(rows);assert.deepEqual(p.quantities_by_unit,[
  {unit:"unit",package_quantity:2,scheduled_quantity:1,unscheduled_quantity:1},
  {unit:"set",package_quantity:1,scheduled_quantity:1,unscheduled_quantity:0}]);
 assert.equal(p.boundary,BOUNDARY);assert.equal(p.totals.official_authorizations,0);
 assert.ok(p.schedules.every(r=>!r.actual_delivery&&!r.authorized_to_deliver&&r.receipt_reference===null));
});
test("source creation and scheduling do not mutate fixture",()=>{
 const before=JSON.stringify([NEEDS,DEMO_PACKAGES]);
 const rs=reviews(),r=createScheduleRow(NEEDS,DEMO_PACKAGES,rs,form());
 assert.deepEqual(build([r],rs),build([r],rs));
 assert.equal(JSON.stringify([NEEDS,DEMO_PACKAGES]),before);
});
