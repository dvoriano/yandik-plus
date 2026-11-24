/** K1/K2/K5 QA written, NOT executed. */
import test from "node:test";
import assert from "node:assert/strict";
import {createDemoContext,readConsolidatedDemo,applyConsolidatedDemoAction,readRegionalCoverage,nextActions,readRecordedFollowupQueue} from "../shared-demo.mjs";
import {readDomain,readDomainDetail,DOMAINS,REGIONS} from "../domain-views.mjs";
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

const activityScope={...a,year:2028};
const extras={investigations:[{event_id:"DEMO-EVENT-01",location_id:"DEMO-LOCATION-01"},
 {event_id:"DEMO-EVENT-01",location_id:"DEMO-LOCATION-02"}],
 kurban_animals:[{animal_id:"DEMO-ANIMAL-01",ante:true,post:true}]};
test("K2 two event-location pairs and one ante+post animal count three",()=>{
 let c=createDemoContext();c=applyConsolidatedDemoAction(c,activityScope,"create_draft",zero,extras);
 c=applyConsolidatedDemoAction(c,activityScope,"submit",zero);
 const v=readConsolidatedDemo(c,activityScope);
 assert.equal(v.correction.activity_count_last_submitted_demo,3);
 assert.equal(v.ledgerMonth.observed_demo_events,null);
});
test("K2 duplicate event-location pair rejected",()=>assert.throws(()=>applyConsolidatedDemoAction(
 createDemoContext(),activityScope,"create_draft",zero,{...extras,investigations:[extras.investigations[0],extras.investigations[0]]})));
test("K2 duplicate animal rejected",()=>assert.throws(()=>applyConsolidatedDemoAction(
 createDemoContext(),activityScope,"create_draft",zero,{...extras,kurban_animals:[extras.kurban_animals[0],extras.kurban_animals[0]]})));
test("K2 animal must have ante or post",()=>assert.throws(()=>applyConsolidatedDemoAction(
 createDemoContext(),activityScope,"create_draft",zero,{investigations:[],kurban_animals:[{animal_id:"DEMO-ANIMAL-01",ante:false,post:false}]})));
test("K2 preserves activities on correction and omitted extra payload",()=>{
 let c=createDemoContext();for(const action of ["create_draft","submit","return_correction"])c=applyConsolidatedDemoAction(c,activityScope,action,zero,extras);
 c=applyConsolidatedDemoAction(c,activityScope,"revise_draft",zero);
 assert.deepEqual(readConsolidatedDemo(c,activityScope).draft_activities,extras);
});
test("K2 reject non-DEMO event ID",()=>assert.throws(()=>applyConsolidatedDemoAction(
 createDemoContext(),activityScope,"create_draft",zero,{...extras,investigations:[{event_id:"REAL",location_id:"DEMO-LOCATION-01"}]})));
test("K6 queue contains recorded workflow only and selected territory",()=>{
 const queue=readRecordedFollowupQueue(createDemoContext(),a);
 assert.ok(queue.length>0);assert.ok(queue.every(x=>x.period.startsWith("2026")&&x.facility_label!=="Puskeswan DEMO Gamma"));
 assert.deepEqual(readRecordedFollowupQueue(createDemoContext(),{...a,year:2030}),[]);
});
for(const domain of DOMAINS)test("K5 detail "+domain,async()=>{
 const v=await readDomain(domain,REGIONS[0]);const d=await readDomainDetail(domain,REGIONS[0],v.items[0].id);
 assert.ok(d.fields.length);assert.equal(d.official_authorization,false);assert.equal(d.may_write,false);
});
test("K5 deny out-of-region detail",async()=>await assert.rejects(readDomainDetail("medicine",REGIONS[1],"DEMO-MED-ALPHA")));
test("K5 no source denies surveillance detail",async()=>await assert.rejects(readDomainDetail("surveillance",REGIONS[1],"DEMO-EVENT-ALPHA")));
