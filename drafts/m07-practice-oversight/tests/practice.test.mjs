/** M07-S1 | QA WRITTEN, ZERO EXECUTED | CODE_ONLY */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoPracticeRegister,buildDemoPracticeReview,M07_S1_SCHEMA}
 from "../practice.mjs";
import {demoPracticeFixtures,practiceDemoSession} from "../fixtures.mjs";
const make=(region_label="Wilayah DEMO Utara",role="kab_kota")=>({
 ...demoPracticeFixtures(),...practiceDemoSession(role,region_label),
 region_label
});
const view=(input={})=>buildDemoPracticeRegister({...make(),...input});
test("M07-S1 schema identifies untested demo",()=>assert.equal(view().schema,M07_S1_SCHEMA));
test("M07-S1 register is synthetic",()=>assert.equal(view().synthetic,true));
test("M07-S1 has two northern practices",()=>assert.equal(view().rows.length,2));
test("M07-S1 southern territory has one practice",()=>assert.equal(
 buildDemoPracticeRegister(make("Wilayah DEMO Selatan")).rows.length,1));
test("M07-S1 kabupaten reader cannot cross territory",()=>assert.throws(
 ()=>view({region_label:"Wilayah DEMO Selatan"}),/ACCESS_DENIED/));
test("M07-S1 province verifier has sample read access",()=>assert.equal(
 buildDemoPracticeRegister(make("Wilayah DEMO Utara","provinsi_verifikator")).rows.length,2));
test("M07-S1 Puskeswan role is denied",()=>assert.throws(
 ()=>buildDemoPracticeRegister(make("Wilayah DEMO Utara","puskeswan")),/ACCESS_DENIED/));
test("M07-S1 leadership cannot read practice details",()=>assert.throws(
 ()=>buildDemoPracticeRegister(make("Wilayah DEMO Utara","pimpinan")),/ACCESS_DENIED/));
test("M07-S1 unknown site has no detail",()=>assert.throws(
 ()=>buildDemoPracticeReview({...make(),practice_id:"DEMO-PRACTICE-UNKNOWN"}),/ACCESS_DENIED/));
test("M07-S1 practice from other region cannot be reviewed",()=>assert.throws(
 ()=>buildDemoPracticeReview({...make(),practice_id:"DEMO-PRACTICE-GAMMA"}),/ACCESS_DENIED/));
test("M07-S1 duplicate facility IDs are rejected",()=>{
 const x=make();x.practices.push({...x.practices[0]});
 assert.throws(()=>buildDemoPracticeRegister(x),/PRACTICE_INVALID/);
});
test("M07-S1 real identity fields are rejected",()=>{
 const x=make();x.practices[0].doctor_name="Real person";
 assert.throws(()=>buildDemoPracticeRegister(x),/PRACTICE_INVALID/);
});
test("M07-S1 legal status cannot be preapproved",()=>{
 const x=make();x.practices[0].documentation_state="VALID";
 assert.throws(()=>buildDemoPracticeRegister(x),/PRACTICE_INVALID/);
});
test("M07-S1 visit needs registered practice",()=>{
 const x=make();x.visits[0].practice_id="DEMO-PRACTICE-OTHER";
 assert.throws(()=>buildDemoPracticeRegister(x),/VISIT_INVALID/);
});
test("M07-S1 visit rejects years beyond 2030",()=>{
 const x=make();x.visits[0].period="2031-01";
 assert.throws(()=>buildDemoPracticeRegister(x),/VISIT_INVALID/);
});
test("M07-S1 duplicate per-month site visit refused by simplified DEMO grain",()=>{
 const x=make();x.visits.push({...x.visits[0],visit_id:"DEMO-PVISIT-NEW"});
 assert.throws(()=>buildDemoPracticeRegister(x),/VISIT_INVALID/);
});
test("M07-S1 duplicate checklist check rejected",()=>{
 const x=make();x.visits[0].answers[1].check_id=x.visits[0].answers[0].check_id;
 assert.throws(()=>buildDemoPracticeRegister(x),/CHECKLIST_INVALID/);
});
test("M07-S1 raw photo URL is rejected",()=>{
 const x=make();x.visits[0].evidence_refs=["https://example.com/photo"];
 assert.throws(()=>buildDemoPracticeRegister(x),/VISIT_INVALID/);
});
test("M07-S1 missing visit does not imply no inspection in real world",()=>{
 const b=view().rows.find(x=>x.practice_id==="DEMO-PRACTICE-BETA");
 assert.equal(b.last_recorded_visit_month,null);
 assert.equal(b.formal_finding_count,null);
});
test("M07-S1 unresolved observations only generate review material",()=>{
 const p=buildDemoPracticeReview({...make(),practice_id:"DEMO-PRACTICE-ALPHA"});
 assert.equal(p.review_packet.status,"DRAFT_DISCUSSION_ONLY");
 assert.equal(p.review_packet.may_dispatch,false);
});
test("M07-S1 does not expose evidence content",()=>{
 const p=buildDemoPracticeReview({...make(),practice_id:"DEMO-PRACTICE-ALPHA"});
 assert.equal(p.visits[0].evidence_reference_count,1);
 assert.equal(JSON.stringify(p).includes("DEMO-EVIDENCE-PRACTICE-1"),false);
});
test("M07-S1 cannot issue license or sanction",()=>{
 const x=view();
 for(const k of ["may_issue","may_sanction","may_approve","may_publish","may_write","may_deploy"])
  assert.equal(x[k],false);
});
