/**
 * YANDIK+ M04-S9H: scenario tests WRITTEN, NOT RUN.
 * Owner CODE_ONLY forbids execution until explicitly authorized.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {MATRIX_DEMO} from "../fixtures.mjs";
import {buildBlockerTriage,blockerTriageText,READINESS,ATTENTION} from "../triage.mjs";
const build=()=>buildBlockerTriage(MATRIX_DEMO);
test("all 18 blockers appear once with exact source refs",()=>{
  const b=build();
  assert.equal(b.rows.length,18);
  assert.equal(new Set(b.rows.map(x=>x.id)).size,18);
  assert.deepEqual(new Set(b.rows.map(x=>x.id)),new Set(MATRIX_DEMO.rows.map(x=>x.id)));
});
test("all roles are suggestions, no reviewer or evidence confirmed",()=>{
  const b=build();
  assert.ok(b.rows.every(x=>x.proposed_preparer_role&&x.proposed_reviewer_role));
  assert.ok(b.rows.every(x=>!x.confirmed_reviewer&&!x.official_evidence_verified));
  assert.equal(b.totals.verified_evidence,0);
});
test("public repo is flagged for discussion, not granted authority",()=>{
  const b=build();
  assert.equal(b.rows.find(x=>x.id==="SEC-01").attention_code,"klasifikasi_repo");
  assert.ok(b.rows.every(x=>!x.authorized_to_test&&!x.authorized_to_deploy));
});
test("private repo snapshot still does not imply readiness",()=>{
  const m={...MATRIX_DEMO,source:{...MATRIX_DEMO.source,
    repo_snapshot:{...MATRIX_DEMO.source.repo_snapshot,visibility:"private"}}};
  const b=buildBlockerTriage(m);
  assert.equal(b.integration_readiness,READINESS);
  assert.ok(b.rows.every(x=>!x.decision_recorded));
});
test("stale source takes precedence over normal attention classification",()=>{
  const m={...MATRIX_DEMO,source:{...MATRIX_DEMO.source,agenda_source_stale:true}};
  const b=buildBlockerTriage(m);
  assert.ok(b.rows.every(x=>x.attention_code==="kaji_ulang_sumber"));
  assert.equal(b.totals.source_needs_recheck,18);
});
test("no-predecessor items are initial discussion topics, not execution",()=>{
  const b=build();
  assert.equal(b.totals.no_predecessor,2);
  assert.ok(b.rows.filter(x=>!x.dependency_ids.length).every(x=>!x.authorized_to_test));
});
test("review evidence and dependency references remain visible",()=>{
  const b=build();
  const x=b.rows.find(x=>x.id==="FLOW-02");
  assert.deepEqual(x.dependency_ids,["DAT-03","FLOW-01","SEC-02"]);
  assert.ok(x.evidence_request.length>10&&x.review_question.length>10);
});
test("rejects non-DEMO, already verified or already authorized models",()=>{
  assert.throws(()=>buildBlockerTriage({...MATRIX_DEMO,synthetic:false}));
  assert.throws(()=>buildBlockerTriage({...MATRIX_DEMO,totals:{...MATRIX_DEMO.totals,verified:1}}));
  const bad={...MATRIX_DEMO,rows:MATRIX_DEMO.rows.map((x,i)=>i?x:{...x,authorized_to_act:true})};
  assert.throws(()=>buildBlockerTriage(bad));
});
test("rejects incorrect predecessor order and duplicate steps",()=>{
  const wrong={...MATRIX_DEMO,rows:MATRIX_DEMO.rows.map((x,i)=>i?x:
    {...x,direct_dependencies:["INT-02"]})};
  assert.throws(()=>buildBlockerTriage(wrong));
  const duplicate={...MATRIX_DEMO,rows:MATRIX_DEMO.rows.map((x,i)=>i?{...x,sequence:1}:x)};
  assert.throws(()=>buildBlockerTriage(duplicate));
});
test("stale or active test waves are rejected",()=>{
  const bad={...MATRIX_DEMO,waves:MATRIX_DEMO.waves.map((x,i)=>i?x:{...x,status:"BERJALAN"})};
  assert.throws(()=>buildBlockerTriage(bad));
});
test("text export explicitly prevents official use",()=>{
  const b=build();
  assert.equal(b.integration_readiness,READINESS);
  assert.match(blockerTriageText(b),/BUKAN KEPUTUSAN PEJABAT/);
  assert.ok(Object.keys(ATTENTION).includes(b.rows[0].attention_code));
});
