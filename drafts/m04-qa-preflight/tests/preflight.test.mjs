/**
 * YANDIK+ M04-S9S | 10 SCENARIOS WRITTEN, NOT EXECUTED.
 * CODE_ONLY: do not run before explicit owner permission.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {buildQaPreflight,qaPreflightText,NO_AUTHORITY,STAGE_CODES}
  from "../preflight.mjs";
const build=()=>buildQaPreflight();
test("twelve modules remain in declared stage order",()=>{
  const p=build();assert.equal(p.modules.length,12);
  assert.deepEqual(p.modules.map(x=>x.id),
    ["S9F","S9G","S9H","S9I","S9J","S9K","S9L","S9M","S9N","S9O","S9P","S9Q"]);
});
test("all four findings remain open and require evidence",()=>{
  const p=build();
  assert.deepEqual(p.findings.map(x=>x.id),
    ["STATIC-01","STATIC-02","STATIC-03","STATIC-04"]);
  assert.ok(p.findings.every(x=>!x.official_finding_closed&&
    !x.technical_validation_complete&&x.required_evidence.length>=2));
});
test("stages are named and contain no execution authority",()=>{
  const p=build();assert.deepEqual(p.stages.map(x=>x.id),STAGE_CODES);
  assert.ok(p.stages.every(x=>!x.executed&&!x.passed&&
    !x.approved_to_run&&x.actual_evidence_reference===null));
});
test("owner permission gate precedes every technical QA phase",()=>{
  const p=build(),byId=new Map(p.stages.map(x=>[x.id,x]));
  assert.equal(p.stages[0].id,"G0_OWNER_SCOPE");
  assert.ok(p.stages.filter(x=>x.is_technical_test).every(x=>
    x.requires_owner_permission&&x.predecessors.length>0));
  assert.equal(byId.get("G1_STATIC_IMPORTS").predecessors[0],"G0_OWNER_SCOPE");
});
test("preflight excludes production and does not infer sign-off",()=>{
  const p=build();
  assert.equal(p.readiness,NO_AUTHORITY);
  assert.equal(p.totals.owner_testing_permission,0);
  assert.equal(p.totals.official_decisions,0);
  assert.ok(p.modules.every(x=>!x.permission_to_execute));
});
test("S9J source regression and direct import inventory have explicit evidence needs",()=>{
  const p=build();
  assert.match(p.findings.find(x=>x.id==="STATIC-01")
    .required_evidence.join(" "),/Regresi S9J/);
  assert.match(p.findings.find(x=>x.id==="STATIC-04")
    .required_evidence.join(" "),/impor|import/i);
});
test("written tests remain distinguished from executed tests",()=>{
  const p=build();
  assert.equal(p.totals.written_tests_previous,152);
  assert.equal(p.totals.new_preflight_tests_written,10);
  assert.equal(p.totals.written_tests_combined,162);
  assert.equal(p.totals.tests_executed_in_s9s,0);
});
test("snapshot public is historical, not a live verification",()=>{
  const p=build();
  assert.equal(p.source.repository_visibility_snapshot,"public");
  assert.equal(p.source.live_verification,false);
  assert.ok(p.warnings.some(x=>x.includes("bukan pemeriksaan live")));
});
test("plain text export includes limitations and supports stage filter",()=>{
  const p=build(),txt=qaPreflightText(p,"G2_UNIT_CONTRACTS");
  assert.match(txt,/BUKAN IZIN UJI/);
  assert.match(txt,/G2_UNIT_CONTRACTS/);
  assert.doesNotMatch(txt,/^- G4_BROWSER_SECURITY/m);
  assert.throws(()=>qaPreflightText(p,"G9"));
});
test("pure draft generation keeps explicit zero closures",()=>{
  const a=build(),b=build();
  assert.deepEqual(a,b);
  assert.equal(a.totals.verified_closures,0);
  assert.equal(a.findings.length,4);
});
