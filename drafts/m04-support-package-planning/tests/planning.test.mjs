/** 12 skenario tertulis, BELUM DIJALANKAN. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildSupportPlan,replaceDraft,removeDraft,BOUNDARY} from "../planning.mjs";
import {NEEDS,PACKAGES} from "../fixtures.mjs";
const base=()=>buildSupportPlan(NEEDS,PACKAGES);
const draft=(lines,id="DEMO-PKG-002")=>({
  id,title:"Rencana contoh",purpose:"Bahan simulasi untuk pembahasan kebutuhan.",lines
});
const line=(need_id,source_version,quantity)=>({need_id,source_version,quantity});
test("eligible and ineligible needs are distinct",()=>{
 const p=base();assert.equal(p.totals.eligible_needs,2);
 assert.equal(p.totals.ineligible_needs,1);
 assert.equal(p.needs.find(n=>n.need_id==="DEMO-NEED-003").remaining_quantity,null);
});
test("partial planning leaves a remainder by need",()=>{
 const n=base().needs.find(n=>n.need_id==="DEMO-NEED-001");
 assert.equal(n.planned_quantity,1);assert.equal(n.remaining_quantity,1);
});
test("same need across two drafts cannot exceed source quantity",()=>{
 const ok=replaceDraft(NEEDS,PACKAGES,draft([line("DEMO-NEED-001",2,1)]));
 assert.equal(buildSupportPlan(NEEDS,ok).needs[0].remaining_quantity,0);
 assert.throws(()=>replaceDraft(NEEDS,PACKAGES,draft([line("DEMO-NEED-001",2,2)])),/melebihi/);
});
test("edit draft replaces quantity rather than counting twice",()=>{
 const next=replaceDraft(NEEDS,PACKAGES,{...PACKAGES[0],lines:[line("DEMO-NEED-001",2,2)]});
 assert.equal(buildSupportPlan(NEEDS,next).needs[0].planned_quantity,2);
 assert.equal(PACKAGES[0].lines[0].quantity,1);
});
test("remove draft releases planning quantity, not physical inventory",()=>{
 const next=removeDraft(NEEDS,PACKAGES,PACKAGES[0].id);
 assert.equal(buildSupportPlan(NEEDS,next).needs[0].remaining_quantity,2);
 assert.throws(()=>removeDraft(NEEDS,PACKAGES,"DEMO-PKG-UNKNOWN"));
});
test("reject need that is not verified in demo or unknown",()=>{
 for(const id of ["DEMO-NEED-003","DEMO-NEED-404"])
  assert.throws(()=>replaceDraft(NEEDS,PACKAGES,draft([line(id,1,1)])),/terverifikasi/);
});
test("reject stale source version even when quantity unchanged",()=>{
 assert.throws(()=>buildSupportPlan(NEEDS.map((n,i)=>i?n:{...n,source_version:3}),PACKAGES),/Versi/);
});
test("reject repeated need in same package and duplicate package IDs",()=>{
 const l=line("DEMO-NEED-001",2,1);
 assert.throws(()=>buildSupportPlan(NEEDS,[draft([l,l])]),/ganda/);
 assert.throws(()=>buildSupportPlan(NEEDS,[...PACKAGES,...PACKAGES]),/ganda/);
});
test("reject fractional, string, zero and negative quantities",()=>{
 for(const q of [0,-1,0.5,"1",NaN,Infinity])
  assert.throws(()=>replaceDraft(NEEDS,PACKAGES,draft([line("DEMO-NEED-002",1,q)])));
});
test("reject unknown and unauthorized fields as well as non-demo source",()=>{
 assert.throws(()=>buildSupportPlan(NEEDS,[{...PACKAGES[0],approved:true}]));
 assert.throws(()=>buildSupportPlan(NEEDS,[{...PACKAGES[0],lines:[{...PACKAGES[0].lines[0],price:100}]}]));
 assert.throws(()=>buildSupportPlan(NEEDS.map((n,i)=>i?n:{...n,synthetic:false}),PACKAGES));
});
test("different units remain separate, all official totals zero",()=>{
 const p=base();
 assert.deepEqual(p.quantities_by_unit,[{unit:"unit",eligible_needs:1,requested:2,planned:1,remaining:1},
   {unit:"set",eligible_needs:1,requested:1,planned:0,remaining:1}]);
 assert.equal(p.boundary,BOUNDARY);assert.equal(p.totals.official_allocations,0);
 assert.equal(p.totals.official_approvals,0);assert.equal(p.totals.delivered_items,0);
});
test("empty draft allowed, source input is not modified, result deterministic",()=>{
 const before=JSON.stringify(NEEDS);
 const next=replaceDraft(NEEDS,PACKAGES,draft([]));
 assert.equal(buildSupportPlan(NEEDS,next).totals.draft_packages,2);
 assert.deepEqual(base(),base());assert.equal(JSON.stringify(NEEDS),before);
});
