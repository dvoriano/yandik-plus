/**
 * 8 test scenarios written, NOT EXECUTED.
 * Do not run until owner explicitly changes CODE_ONLY within the agreed scope.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {buildQaSessionPlan,BOUNDARY} from "../plan.mjs";

test("the whole fixture chain preserves the historical snapshot date",()=>{
  const p=buildQaSessionPlan();
  assert.equal(p.source_snapshot.source_snapshot_date,"2026-11-12");
  assert.equal(p.source_snapshot.snapshot_is_live,false);
  assert.equal(p.requested_evidence.length,14);
});
test("inventory covers 17 unique suites and 192 written cases",()=>{
  const p=buildQaSessionPlan();
  assert.equal(p.suites.length,17);
  assert.equal(new Set(p.suites.map(x=>x.path)).size,17);
  assert.equal(p.suites.reduce((n,s)=>n+s.written_cases,0),192);
  assert.equal(p.totals.written_before,184);
});
test("planned paths and literal case counts match repository sources",async()=>{
  const p=buildQaSessionPlan();
  for(const suite of p.suites){
    assert.match(suite.path,/^drafts\/[a-z0-9-]+\/tests\/[a-z0-9_]+\.test\.mjs$/);
    const source=await readFile(new URL("../../../"+suite.path,import.meta.url),"utf8");
    assert.equal((source.match(/^\s*test\s*\(/gm)||[]).length,
      suite.written_cases,suite.path);
  }
});
test("technical gate batches count 12, 56 and 124 and cover each suite once",()=>{
  const p=buildQaSessionPlan();
  assert.deepEqual(p.gates.map(g=>g.written_case_count),[0,12,56,124,0,0]);
  assert.equal(new Set(p.gates.flatMap(g=>g.written_suite_paths)).size,17);
});
test("technical chain starts at owner scope, institutional review independent",()=>{
  const p=buildQaSessionPlan();
  assert.deepEqual(p.gates.map(g=>g.predecessors),[
    [],["G0_OWNER_SCOPE"],["G1_STATIC_IMPORTS"],
    ["G2_UNIT_CONTRACTS"],["G3_DEMO_PIPELINE"],[],
  ]);
  assert.ok(p.gates.every(g=>g.entry_criteria&&g.exit_criteria&&g.stop_criteria));
});
test("no approvals, tests executed, result receipt or deployment authorization",()=>{
  const p=buildQaSessionPlan();
  assert.equal(p.status,BOUNDARY);
  assert.equal(p.target_commit,null);
  assert.equal(p.owner_permission_reference,null);
  assert.equal(p.allowed_environment,null);
  assert.equal(p.deployment_authorized,false);
  assert.ok([...p.gates,...p.suites].every(x=>
    !x.permission_to_execute&&!x.execution_started&&x.result===null));
  assert.equal(p.totals.executed,0);
  assert.equal(p.totals.passed,0);
});
test("all 14 evidence requests and 4 findings remain unresolved",()=>{
  const p=buildQaSessionPlan();
  assert.equal(p.requested_evidence.length,14);
  assert.equal(new Set(p.requested_evidence.map(x=>x.source_request_id)).size,14);
  assert.ok(p.requested_evidence.every(x=>!x.document_received&&!x.verified));
  assert.equal(p.findings.length,4);
  assert.ok(p.findings.every(x=>!x.closed&&x.official_resolution===null));
});
test("result template is empty of real evidence and generation is deterministic",()=>{
  const p=buildQaSessionPlan();
  assert.ok(p.result_template_fields.includes("commit_sha"));
  assert.ok(p.result_template_fields.includes("result_PASS_FAIL_BLOCKED"));
  assert.ok(p.result_template_fields.includes("evidence_reference"));
  assert.deepEqual(buildQaSessionPlan(),p);
});
