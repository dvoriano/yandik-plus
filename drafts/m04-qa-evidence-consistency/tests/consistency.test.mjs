/**
 * YANDIK+ M04-S9U | 12 TEST SCENARIOS WRITTEN, NOT EXECUTED.
 * Owner permission needed before running Node or browser test.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {REGISTER_DEMO,PREFLIGHT_DEMO} from "../fixtures.mjs";
import {buildQaEvidenceConsistency,qaEvidenceConsistencyText,NO_AUTHORITY}
  from "../consistency.mjs";
const create=()=>buildQaEvidenceConsistency(REGISTER_DEMO,PREFLIGHT_DEMO);
const changeRow=patch=>({...REGISTER_DEMO,
  requests:REGISTER_DEMO.requests.map((r,i)=>i?r:{...r,...patch})});
test("exactly six gate requests and eight finding requirements",()=>{
  const c=create();assert.equal(c.totals.stage_requests,6);
  assert.equal(c.totals.finding_requests,8);
  assert.equal(c.lines.length,14);
});
test("every row source ID unique and backed by requested material",()=>{
  const c=create();assert.equal(new Set(c.lines.map(x=>x.source_request_id)).size,14);
  assert.ok(c.lines.every(x=>x.requested_material_known&&x.structural_source_linked));
});
test("structural mapping never implies received documentary evidence",()=>{
  const c=create();assert.equal(c.totals.documentary_material_received,0);
  assert.equal(c.totals.verified_evidence,0);
  assert.ok(c.lines.every(x=>!x.documentary_material_received&&!x.evidence_verified));
});
test("all four findings remain open and without resolution",()=>{
  const c=create();assert.equal(c.findings.length,4);
  assert.ok(c.findings.every(f=>!f.officially_closed&&f.formal_resolution===null));
});
test("gates do not grant test permission or report execution",()=>{
  const c=create();assert.equal(c.stages[0].id,"G0_OWNER_SCOPE");
  assert.ok(c.stages.every(s=>!s.permission_to_run&&!s.executed));
  assert.equal(c.readiness,NO_AUTHORITY);
});
test("source descriptions and grouping remain unchanged",()=>{
  const c=create();
  for(const line of c.lines){
    const src=REGISTER_DEMO.requests.find(r=>r.id===line.source_request_id);
    assert.equal(line.requirement,src.requirement);
    assert.equal(line.kind,src.kind);
  }
});
test("reject a forged material receipt, verification or approval",()=>{
  assert.throws(()=>buildQaEvidenceConsistency(
    changeRow({evidence_provided:true}),PREFLIGHT_DEMO));
  assert.throws(()=>buildQaEvidenceConsistency(
    changeRow({verification_done:true}),PREFLIGHT_DEMO));
  assert.throws(()=>buildQaEvidenceConsistency(
    changeRow({official_approval:true}),PREFLIGHT_DEMO));
});
test("reject source requirement text modified without matching preflight",()=>{
  assert.throws(()=>buildQaEvidenceConsistency(
    changeRow({requirement:"Bukti pengganti palsu"}),PREFLIGHT_DEMO));
});
test("reject foreign, duplicated or missing rows",()=>{
  const dupe={...REGISTER_DEMO,
    requests:REGISTER_DEMO.requests.map((r,i)=>i?r:{...r,id:REGISTER_DEMO.requests[1].id})};
  assert.throws(()=>buildQaEvidenceConsistency(dupe,PREFLIGHT_DEMO));
  const missing={...REGISTER_DEMO,requests:REGISTER_DEMO.requests.slice(1)};
  assert.throws(()=>buildQaEvidenceConsistency(missing,PREFLIGHT_DEMO));
});
test("reject forged finding resolution or approved preflight",()=>{
  const f={...REGISTER_DEMO,
    finding_groups:REGISTER_DEMO.finding_groups.map((x,i)=>
      i?x:{...x,verified_closed:true})};
  assert.throws(()=>buildQaEvidenceConsistency(f,PREFLIGHT_DEMO));
  const p={...PREFLIGHT_DEMO,
    stages:PREFLIGHT_DEMO.stages.map((x,i)=>i?x:{...x,approved_to_run:true})};
  assert.throws(()=>buildQaEvidenceConsistency(REGISTER_DEMO,p));
});
test("source snapshot mismatches are rejected",()=>{
  const r={...REGISTER_DEMO,
    source:{...REGISTER_DEMO.source,snapshot_date:"2026-11-01"}};
  assert.throws(()=>buildQaEvidenceConsistency(r,PREFLIGHT_DEMO));
});
test("text filters retain disclaimers and builder stays deterministic",()=>{
  const c=create(),txt=qaEvidenceConsistencyText(c,"temuan");
  assert.match(txt,/BUKAN BUKTI QA/);
  assert.match(txt,/STATIC-01/);
  assert.doesNotMatch(txt,/DEMO-REQ-STAGE-G1/);
  assert.throws(()=>qaEvidenceConsistencyText(c,"approved"));
  assert.deepEqual(create(),c);
});
