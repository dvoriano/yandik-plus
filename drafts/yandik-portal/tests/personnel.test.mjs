/** K1/K2 personnel unit QA written, NOT executed. */
import test from "node:test";
import assert from "node:assert/strict";
import {createDemoContext,readConsolidatedDemo} from "../shared-demo.mjs";
import {PROFILE_CHOICES,COMPETENCIES,readPersonnel,changeProfile,transferStaff,recordCompetency} from "../personnel-model.mjs";
const a={year:2026,month:3,region_id:"DEMO-REGION-UTARA",facility_id:"DEMO-PSW-ALPHA"};
const beta={...a,facility_id:"DEMO-PSW-BETA"};
const gamma={...a,facility_id:"DEMO-PSW-GAMMA",region_id:"DEMO-REGION-SELATAN"};
const choice=PROFILE_CHOICES.legalitas[0];
const edit=(c,scope,action,value=choice)=>changeProfile(c,scope,{section:"legalitas",action,value});
test("blank section editor does not import old M02 values",()=>assert.ok(readPersonnel(createDemoContext(),a).sections.every(x=>x.value===null&&x.request===null)));
test("profile scope isolation by facility and year",()=>{
 const c=edit(createDemoContext(),a,"save");
 assert.equal(readPersonnel(c,a).sections[0].request.value,choice);
 assert.equal(readPersonnel(c,beta).sections[0].request,null);
 assert.equal(readPersonnel(c,{...a,year:2027}).sections[0].request,null);
});
test("profile draft submit correct revise accept",()=>{
 let c=createDemoContext();for(const action of ["save","submit","correct","submit","accept"])c=edit(c,a,action);
 const v=readPersonnel(c,a);assert.equal(v.sections[0].status,"terverifikasi");
 assert.equal(v.sections[0].latestDate,null);assert.equal(v.history.length,5);
 assert.equal(v.history[0].before.snapshot.profile_state,"RECORDED_DEMO");
 assert.equal(readConsolidatedDemo(c,a).joined.profile_state,"DRAFT_DEMO");
});
test("profile submit projects pending without real approval",()=>{
 const c=edit(createDemoContext(),a,"submit");
 assert.equal(readConsolidatedDemo(c,a).joined.profile_state,"REVIEW_PENDING_DEMO");
 assert.equal(c.personnelEdits.history[0].official_authorization,false);
});
test("profile five sections recorded only after simulated review",()=>{
 let c=createDemoContext();for(const section of Object.keys(PROFILE_CHOICES)){
 c=changeProfile(c,a,{section,action:"submit",value:PROFILE_CHOICES[section][0]});
 c=changeProfile(c,a,{section,action:"accept"});
 }
 assert.equal(readConsolidatedDemo(c,a).joined.profile_state,"RECORDED_DEMO");
});
test("profile denies review without submission",()=>assert.throws(()=>edit(createDemoContext(),a,"accept")));
test("profile rejects arbitrary non-DEMO text",()=>assert.throws(()=>edit(createDemoContext(),a,"save","arbitrary")));
test("profile rejects facility-region conflict",()=>assert.throws(()=>edit(createDemoContext(),{...a,region_id:gamma.region_id},"save")));
test("profile changes preserve ledger and workflow",()=>{
 const c=createDemoContext(),n=edit(c,a,"submit");assert.equal(n.dashboardFixture,c.dashboardFixture);assert.equal(n.workflow,c.workflow);
});
test("transfer at month boundary keeps prior assignment and changes both totals",()=>{
 const c=createDemoContext(),s={...a,year:2027,month:8},dest={...gamma,year:2027,month:8};
 const n=transferStaff(c,s,{staff_id:"DEMO-STAFF-02",destination_id:gamma.facility_id});
 assert.equal(readPersonnel(n,{...s,month:7}).staff.some(x=>x.staff_id==="DEMO-STAFF-02"),true);
 assert.equal(readPersonnel(n,s).staff.some(x=>x.staff_id==="DEMO-STAFF-02"),false);
 assert.equal(readPersonnel(n,dest).staff.some(x=>x.staff_id==="DEMO-STAFF-02"),true);
 assert.equal(readConsolidatedDemo(n,s).joined.paramedics,0);
 assert.equal(readConsolidatedDemo(n,dest).joined.paramedics,1);
 assert.equal(readConsolidatedDemo(n,a).joined.paramedics,1);
 assert.equal(c.profileFixture.placements.find(x=>x.staff_id==="DEMO-STAFF-02").end_month,null);
});
test("transfer cannot rewrite closed known assignment",()=>assert.throws(()=>transferStaff(createDemoContext(),a,{staff_id:"DEMO-STAFF-01",destination_id:beta.facility_id})));
test("transfer cannot begin at same month as original start",()=>assert.throws(()=>transferStaff(createDemoContext(),{...a,month:2},{staff_id:"DEMO-STAFF-02",destination_id:beta.facility_id})));
test("transfer denies same facility",()=>assert.throws(()=>transferStaff(createDemoContext(),a,{staff_id:"DEMO-STAFF-02",destination_id:a.facility_id})));
test("transfer preserves partial coverage as unknown",()=>{
 const c=transferStaff(createDemoContext(),a,{staff_id:"DEMO-STAFF-02",destination_id:gamma.facility_id});
 assert.equal(readConsolidatedDemo(c,gamma).joined.paramedics,null);
});
test("competency is not verified certificate",()=>{
 const c=recordCompetency(createDemoContext(),a,{staff_id:"DEMO-STAFF-02",topic:COMPETENCIES[0]});
 assert.equal(readPersonnel(c,a).competencies[0].certificate_verified,false);
 assert.equal(readPersonnel(c,beta).competencies.length,0);
});
test("competency duplicate rejected",()=>{
 const input={staff_id:"DEMO-STAFF-02",topic:COMPETENCIES[0]},c=recordCompetency(createDemoContext(),a,input);
 assert.throws(()=>recordCompetency(c,a,input));
});
test("competency denies staff outside facility",()=>assert.throws(()=>recordCompetency(createDemoContext(),beta,{staff_id:"DEMO-STAFF-02",topic:COMPETENCIES[0]})));
test("retroactive transfer cannot invalidate competency record",()=>{
 const c=recordCompetency(createDemoContext(),{...a,month:4},{staff_id:"DEMO-STAFF-02",topic:COMPETENCIES[0]});
 assert.throws(()=>transferStaff(c,a,{staff_id:"DEMO-STAFF-02",destination_id:beta.facility_id}));
});
test("reset returns initial snapshots and no edit history",()=>assert.equal(createDemoContext().personnelEdits.history.length,0));
