/** M13-S2 | QA DITULIS, BELUM DIJALANKAN | NO EXECUTION */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoCandidateCrosswalk,M13_S2_SCHEMA}
 from "../crosswalk.mjs";
import {demoCrosswalkFixture} from "../fixtures.mjs";
import {demoSurveillanceAdapters}
 from "../../m13-surveillance/fixtures.mjs";
const make=(x={})=>buildDemoCandidateCrosswalk({...demoCrosswalkFixture(),...x});
test("M13-S2 draft schema",()=>assert.equal(make().schema,M13_S2_SCHEMA));
test("M13-S2 one synthetic link candidate",()=>
 assert.equal(make().candidate_links_recorded_demo,1));
test("M13-S2 matching keys do not establish equivalence",()=>
 assert.equal(make().rows[0].same_real_event_proven,false));
test("M13-S2 matching keys cannot confirm disease",()=>
 assert.equal(make().official_case_count,null));
test("M13-S2 cannot reconcile counts",()=>
 assert.equal(make().reconciled_investigation_count,null));
test("M13-S2 cannot sync sources",()=>
 assert.equal(make().may_sync,false));
test("M13-S2 APEL ledger is unchanged by projection",()=>{
 const x=demoCrosswalkFixture();
 const before=JSON.stringify(x.dashboardFixture.ledger);
 buildDemoCandidateCrosswalk(x);
 assert.equal(JSON.stringify(x.dashboardFixture.ledger),before);
});
test("M13-S2 source events unchanged",()=>{
 const x=demoCrosswalkFixture();
 const before=JSON.stringify(x.events);
 buildDemoCandidateCrosswalk(x);
 assert.equal(JSON.stringify(x.events),before);
});
test("M13-S2 disallows unregistered facility",()=>{
 const x=demoCrosswalkFixture();
 x.links[0].facility_id="DEMO-PSW-UNKNOWN";
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/LINK_INVALID/);
});
test("M13-S2 prevents cross-region facility links",()=>{
 const x=demoCrosswalkFixture();
 x.links[0].facility_id="DEMO-PSW-GAMMA";
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/LINK_INVALID/);
});
test("M13-S2 prevents wrong event identity",()=>{
 const x=demoCrosswalkFixture();
 x.links[0].event_id="DEMO-EVENT-NONEXISTENT";
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/SURVEILLANCE_PAIR_MISMATCH/);
});
test("M13-S2 prevents mismatched location",()=>{
 const x=demoCrosswalkFixture();
 x.links[0].location_ref="DEMO-LOCATION-OTHER";
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/SURVEILLANCE_PAIR_MISMATCH/);
});
test("M13-S2 prevents event-period mismatch",()=>{
 const x=demoCrosswalkFixture();
 x.links[0].period="2026-04";
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/SURVEILLANCE_PAIR_MISMATCH/);
});
test("M13-S2 fails when APEL has no matching investigation",()=>{
 const x=demoCrosswalkFixture();
 x.links[0].facility_id="DEMO-PSW-BETA";
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/APEL_PAIR_MISMATCH/);
});
test("M13-S2 rejects duplicated crosswalk ID",()=>{
 const x=demoCrosswalkFixture();
 x.links.push({...x.links[0]});
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/LINK_DUPLICATE/);
});
test("M13-S2 rejects false approval claim",()=>{
 const x=demoCrosswalkFixture();
 x.links[0].review_state="APPROVED";
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/LINK_INVALID/);
});
test("M13-S2 rejects wrong source snapshot",()=>{
 const x=demoCrosswalkFixture();
 x.links[0].snapshot_id="DEMO-SNAPSHOT-OTHER";
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/LINK_INVALID/);
});
test("M13-S2 does not accept links for different year",()=>{
 const x=demoCrosswalkFixture();
 x.year=2027;
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/LINK_INVALID/);
});
test("M13-S2 can show empty candidate list",()=>{
 const x=demoCrosswalkFixture();x.links=[];
 assert.equal(buildDemoCandidateCrosswalk(x).candidate_links_recorded_demo,0);
});
test("M13-S2 no candidates does not mean zero real events",()=>{
 const x=demoCrosswalkFixture();x.links=[];
 assert.equal(buildDemoCandidateCrosswalk(x).official_case_count,null);
});
test("M13-S2 refuses no synthetic metadata",()=>{
 const x=demoCrosswalkFixture();
 x.dashboardFixture.metadata.synthetic=false;
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/DEMO_INPUT_REQUIRED/);
});
test("M13-S2 does not allow cross-territory user",()=>{
 const x=demoCrosswalkFixture();
 x.resolveServerSession=demoSurveillanceAdapters({
  role:"kab_kota",region:"Wilayah DEMO Selatan"
 }).resolveServerSession;
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/ACCESS_DENIED/);
});
test("M13-S2 source must remain unverified",()=>{
 const x=demoCrosswalkFixture();
 x.manifest.source_verified=true;
 assert.throws(()=>buildDemoCandidateCrosswalk(x),/SOURCE_UNTRUSTED/);
});
test("M13-S2 no write/score/notify/publish permissions",()=>{
 const v=make();
 for(const k of ["may_write","may_sync","may_score","may_notify",
  "may_approve","may_confirm_disease","may_rank",
  "may_publish","may_deploy"])assert.equal(v[k],false);
});
