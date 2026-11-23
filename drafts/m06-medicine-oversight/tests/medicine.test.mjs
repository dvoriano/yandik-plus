/** M06-S1 | QA TERTULIS, 0 DIJALANKAN, CODE_ONLY */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoMedicineOverview,buildDemoMedicineReviewPacket,M06_S1_SCHEMA}
 from "../medicine.mjs";
import {buildDemoMedicineFixture,demoMedicineSession} from "../fixtures.mjs";
const base=(region_label="Wilayah DEMO Utara",role="kab_kota")=>({
 ...buildDemoMedicineFixture(),...demoMedicineSession(role,region_label),
 region_label
});
const view=(opts={})=>buildDemoMedicineOverview({...base(),...opts});
test("M06-S1 uses untested schema",()=>assert.equal(view().schema,M06_S1_SCHEMA));
test("M06-S1 contains synthetic data",()=>assert.equal(view().synthetic,true));
test("M06-S1 selects two sites in DEMO north",()=>assert.equal(view().rows.length,2));
test("M06-S1 region south isolated",()=>
 assert.equal(view({...base("Wilayah DEMO Selatan")}).rows.length,1));
test("M06-S1 cannot read foreign territory with local session",()=>
 assert.throws(()=>view({region_label:"Wilayah DEMO Selatan"}),/ACCESS_DENIED/));
test("M06-S1 province admin can inspect DEMO scope",()=>{
 const v=view({...base("Wilayah DEMO Utara","provinsi_admin")});
 assert.equal(v.site_count_demo,2);
});
test("M06-S1 reporter cannot read medicine oversight",()=>
 assert.throws(()=>view({...base("Wilayah DEMO Utara","puskeswan")}),/ACCESS_DENIED/));
test("M06-S1 leadership denied detail",()=>
 assert.throws(()=>view({...base("Wilayah DEMO Utara","pimpinan")}),/ACCESS_DENIED/));
test("M06-S1 no inspection record is not an official zero inspection",()=>{
 const beta=view().rows.find(x=>x.site_id==="DEMO-MED-BETA");
 assert.equal(beta.latest_visit_month,null);
 assert.equal(beta.formal_finding_count,null);
});
test("M06-S1 regulatory license never marked verified",()=>{
 assert.ok(view().rows.every(x=>x.permit_validity_verified===false));
});
test("M06-S1 only DEMO source records accepted",()=>{
 const x=base();x.sites[0].source_ref="real-business-1";
 assert.throws(()=>buildDemoMedicineOverview(x),/SITE_INVALID/);
});
test("M06-S1 duplicate site IDs rejected",()=>{
 const x=base();x.sites.push({...x.sites[0]});
 assert.throws(()=>buildDemoMedicineOverview(x),/SITE_INVALID/);
});
test("M06-S1 inspections cannot reference unknown sites",()=>{
 const x=base();x.inspections[0].site_id="DEMO-MED-UNKNOWN";
 assert.throws(()=>buildDemoMedicineOverview(x),/INSPECTION_INVALID/);
});
test("M06-S1 rejects invalid future year outside 2030",()=>{
 const x=base();x.inspections[0].period="2031-01";
 assert.throws(()=>buildDemoMedicineOverview(x),/INSPECTION_INVALID/);
});
test("M06-S1 prevents duplicate monthly inspection for same site",()=>{
 const x=base();x.inspections.push({...x.inspections[0],
   inspection_id:"DEMO-INSPECT-A2"});
 assert.throws(()=>buildDemoMedicineOverview(x),/INSPECTION_INVALID/);
});
test("M06-S1 prevents duplicate checklist domain",()=>{
 const x=base();x.inspections[0].answers[1].check=x.inspections[0].answers[0].check;
 assert.throws(()=>buildDemoMedicineOverview(x),/CHECKLIST_INVALID/);
});
test("M06-S1 rejects fake evidence identifiers",()=>{
 const x=base();x.inspections[0].evidence_refs=["file://private"];
 assert.throws(()=>buildDemoMedicineOverview(x),/INSPECTION_INVALID/);
});
test("M06-S1 review hint reflects human review needed",()=>{
 const alpha=view().rows.find(x=>x.site_id==="DEMO-MED-ALPHA");
 assert.equal(alpha.review_hint_demo,"HUMAN_REVIEW_MATERIAL_DEMO");
});
test("M06-S1 review packet includes checklist statuses only",()=>{
 const p=buildDemoMedicineReviewPacket({...base(),
  site_id:"DEMO-MED-ALPHA"});
 assert.equal(p.visit_history.length,1);
 assert.equal(p.visit_history[0].evidence_count_demo,1);
});
test("M06-S1 review packet never dispatches follow-up",()=>{
 const p=buildDemoMedicineReviewPacket({...base(),
  site_id:"DEMO-MED-ALPHA"});
 assert.equal(p.proposed_followup.may_dispatch,false);
 assert.equal(p.proposed_followup.assigned_to,null);
});
test("M06-S1 review packet cannot read other region",()=>
 assert.throws(()=>buildDemoMedicineReviewPacket({...base(),
  site_id:"DEMO-MED-GAMMA"}),/ACCESS_DENIED/));
test("M06-S1 no statutory compliance score",()=>{
 assert.ok(view().rows.every(x=>x.compliance_score===null));
});
test("M06-S1 no automated sanctions or approval",()=>{
 const v=view();
 for(const k of ["may_sanction","may_approve","may_publish",
  "may_write","may_schedule","may_deploy"])assert.equal(v[k],false);
});
test("M06-S1 rejects inspection declared already approved",()=>{
 const x=base();x.inspections[0].review_state="OFFICIALLY_APPROVED";
 assert.throws(()=>buildDemoMedicineOverview(x),/INSPECTION_INVALID/);
});
