/** K1/K2/K5 QA written, NOT executed. */
import test from "node:test";
import assert from "node:assert/strict";
import {createDemoContext,readConsolidatedDemo,applyConsolidatedDemoAction,readRegionalCoverage,nextActions} from "../shared-demo.mjs";
import {readDomain,DOMAINS,REGIONS} from "../domain-views.mjs";
const a={year:2026,month:1,region_id:"DEMO-REGION-UTARA",facility_id:"DEMO-PSW-ALPHA"};
const zero={pengobatan:0,vaksinasi:0,penyuluhan:0,layanan_lain:0};
test("K1 joined master scope and distinct workflow ledger",()=>{
 const v=readConsolidatedDemo(createDemoContext(),a);
 assert.equal(v.joined.facility_id,a.facility_id);
 assert.equal(v.ledger_workflow_reconciled,false);
 assert.equal(v.support_identity_linked,false);
});
test("K1 reject cross-region facility",()=>assert.throws(()=>readConsolidatedDemo(createDemoContext(),{...a,region_id:"DEMO-REGION-SELATAN"})));
test("K1 missing report not zero",()=>assert.equal(readConsolidatedDemo(createDemoContext(),{...a,year:2030}).ledgerMonth.observed_demo_events,null));
test("K1 explicit zero not missing",()=>assert.equal(readConsolidatedDemo(createDemoContext(),{...a,month:3}).ledgerMonth.observed_demo_events,0));
test("K1 no false aggregate for incomplete staff",()=>assert.equal(readConsolidatedDemo(createDemoContext(),{...a,region_id:"DEMO-REGION-SELATAN",facility_id:"DEMO-PSW-GAMMA"}).joined.doctors,null));
test("K2 draft submit correction revise resubmit without ledger mutation",()=>{
 let c=createDemoContext();const scope={...a,year:2028};
 const ledger=JSON.stringify(c.dashboardFixture.ledger);
 for(const action of ["create_draft","submit","return_correction","revise_draft","resubmit"])c=applyConsolidatedDemoAction(c,scope,action,zero);
 const v=readConsolidatedDemo(c,scope);
 assert.equal(v.correction.revision,5);assert.equal(v.correction.history.length,5);
 assert.equal(v.correction.activity_count_last_submitted_demo,0);
 assert.equal(v.ledgerMonth.observed_demo_events,null);
 assert.equal(JSON.stringify(c.dashboardFixture.ledger),ledger);
});
test("K2 invalid count rejected",()=>assert.throws(()=>applyConsolidatedDemoAction(createDemoContext(),{...a,year:2030},"create_draft",{...zero,pengobatan:-1})));
test("K2 invalid transition rejected",()=>assert.throws(()=>applyConsolidatedDemoAction(createDemoContext(),{...a,year:2030},"submit",zero)));
test("K2 available actions constrained",()=>assert.deepEqual(nextActions(readConsolidatedDemo(createDemoContext(),{...a,year:2030})),["create_draft"]));
test("K6 missing regional data retained",()=>assert.ok(readRegionalCoverage(createDemoContext(),2030).every(r=>r.service===null)));
for(const domain of DOMAINS)test("K5 scoped read "+domain,async()=>{
 const v=await readDomain(domain,REGIONS[0]);assert.equal(v.available,true);
 assert.equal(v.official_authorization,false);
 assert.ok(v.rows.every(row=>row.length===v.columns.length));
});
test("K5 unavailable southern surveillance is not a zero count",async()=>{
 const v=await readDomain("surveillance",REGIONS[1]);assert.equal(v.available,false);assert.equal(v.rows,null);
});
test("K5 reject unknown domain or region",async()=>{await assert.rejects(readDomain("real",REGIONS[0]));await assert.rejects(readDomain("medicine","Real region"));});

test("K2 selected draft counts are scoped and not ledger values",()=>{
 let c=createDemoContext(),scope={...a,year:2028};
 c=applyConsolidatedDemoAction(c,scope,"create_draft",{...zero,pengobatan:11});
 assert.equal(readConsolidatedDemo(c,scope).draft_counts.pengobatan,11);
 assert.equal(readConsolidatedDemo(c,{...scope,month:2}).draft_counts,null);
});
test("K3 independent M04 seven stages and M05 ledger unaffected",async()=>{
 const m=await import("../../m04-integrated-workspace/workspace.mjs");
 const f=await import("../../m04-integrated-workspace/fixtures.mjs");
 let w=f.demoWorkspace();const ctx=createDemoContext(),before=JSON.stringify(ctx.dashboardFixture.ledger);
 const id=f.MASTER[0].id;assert.ok(!ctx.facilities.some(x=>x.facility_id===id));
 for(const action of m.ACTIONS)w=m.advanceDemo(w,id,action);
 const d=m.viewWorkspace(w,{role:"provinsi_admin"},"2026-10",id).details;
 assert.equal(d.handover.length,1);assert.equal(w.observations.length,1);
 assert.equal(JSON.stringify(ctx.dashboardFixture.ledger),before);
});
