/**
 * M04-S9L | 12 WRITTEN TEST SCENARIOS, NOT EXECUTED (CODE_ONLY).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {FOLLOWUP_DEMO} from "../fixtures.mjs";
import {buildCrossFunctionRecap,crossFunctionRecapText,NO_DECISION}
  from "../recap.mjs";
const build=()=>buildCrossFunctionRecap(FOLLOWUP_DEMO);
test("six functions and 18 unique items without data loss",()=>{
  const x=build();
  assert.equal(x.totals.functions,6);assert.equal(x.rows.length,18);
  assert.equal(new Set(x.rows.map(r=>r.source_id)).size,18);
  assert.equal(x.functions.reduce((n,g)=>n+g.total,0),18);
});
test("three explicit synthetic proposals and three explicit gap notes",()=>{
  const x=build();
  assert.equal(x.totals.proposal_notes,3);assert.equal(x.totals.gap_notes,3);
  assert.equal(x.totals.no_proposal_notes,15);
  assert.equal(x.totals.no_gap_notes,15);
  assert.equal(x.rows.filter(r=>r.class_code==="proposal_and_gap").length,3);
});
test("blank gap is never interpreted as verified evidence or no risk",()=>{
  const x=build();
  const empty=x.rows.find(r=>r.source_id==="GOV-02");
  assert.equal(empty.class_code,"no_proposal_or_gap");
  assert.equal(empty.official_evidence_verified,false);
  assert.equal(x.totals.official_evidence_verified,0);
});
test("all source references/revisions survive summarization",()=>{
  const x=build();
  for(const row of x.rows){
    const src=FOLLOWUP_DEMO.rows.find(r=>r.source_id===row.source_id);
    assert.equal(row.source_revision,src.source_revision);
    assert.deepEqual(row.source_dependencies,src.source_dependencies);
    assert.equal(row.source_material,src.source_material);
  }
});
test("cross function links only reference different known function",()=>{
  const x=build(),byId=new Map(x.rows.map(r=>[r.source_id,r]));
  for(const row of x.rows)for(const edge of row.cross_function_dependencies){
    assert.ok(byId.has(edge.source_id));
    assert.notEqual(byId.get(edge.source_id).function_id,row.function_id);
  }
  assert.ok(x.totals.cross_function_links>0);
});
test("no official assignment, deadline, decision or permit may appear",()=>{
  const x=build();
  assert.equal(x.readiness,NO_DECISION);
  assert.equal(x.totals.official_tasks,0);
  assert.equal(x.totals.official_decisions,0);
  assert.ok(x.rows.every(r=>!r.officially_assigned&&!r.official_decision&&
    !r.authorization_to_test&&!r.authorization_to_deploy));
});
test("stale source produces warning but never institutional clearance",()=>{
  const source={...FOLLOWUP_DEMO,source:{...FOLLOWUP_DEMO.source,source_stale:true}};
  const x=buildCrossFunctionRecap(source);
  assert.equal(x.source.source_stale,true);
  assert.ok(x.warnings.some(y=>y.includes("Snapshot sumber berubah")));
  assert.equal(x.readiness,NO_DECISION);
});
test("private snapshot does not imply evidence verification",()=>{
  const source={...FOLLOWUP_DEMO,source:{...FOLLOWUP_DEMO.source,
    repo_snapshot:{...FOLLOWUP_DEMO.source.repo_snapshot,visibility:"private"}}};
  const x=buildCrossFunctionRecap(source);
  assert.equal(x.totals.official_evidence_verified,0);
  assert.equal(x.readiness,NO_DECISION);
});
test("reject source that claims official task or tampered proposal totals",()=>{
  assert.throws(()=>buildCrossFunctionRecap({...FOLLOWUP_DEMO,
    totals:{...FOLLOWUP_DEMO.totals,official_tasks:1}}));
  assert.throws(()=>buildCrossFunctionRecap({...FOLLOWUP_DEMO,
    totals:{...FOLLOWUP_DEMO.totals,proposals_demo:18}}));
});
test("reject fake row approval, duplicate source and unknown dependencies",()=>{
  const altered={...FOLLOWUP_DEMO,rows:FOLLOWUP_DEMO.rows.map((r,i)=>
    i?r:{...r,official_decision:true})};
  assert.throws(()=>buildCrossFunctionRecap(altered));
  const dup={...FOLLOWUP_DEMO,rows:FOLLOWUP_DEMO.rows.map((r,i)=>
    i?r:{...r,source_id:FOLLOWUP_DEMO.rows[1].source_id})};
  assert.throws(()=>buildCrossFunctionRecap(dup));
  const badDep={...FOLLOWUP_DEMO,rows:FOLLOWUP_DEMO.rows.map((r,i)=>
    i?r:{...r,source_dependencies:["UNKNOWN"]})};
  assert.throws(()=>buildCrossFunctionRecap(badDep));
});
test("filter text shows only selected function and class",()=>{
  const x=build();
  const t=crossFunctionRecapText(x,"keamanan","proposal_and_gap");
  assert.match(t,/SEC-01/);assert.doesNotMatch(t,/GOV-01 \[/);
  assert.match(t,/BUKAN HASIL RAPAT/);
  assert.throws(()=>crossFunctionRecapText(x,"unlisted"));
  assert.throws(()=>crossFunctionRecapText(x,"all","approved"));
});
test("builder does not mutate source DEMO objects",()=>{
  const before=FOLLOWUP_DEMO.rows[0].usulan_tindak_lanjut_demo;
  const a=build(),b=build();
  assert.deepEqual(a.rows,b.rows);
  assert.equal(FOLLOWUP_DEMO.rows[0].usulan_tindak_lanjut_demo,before);
});
