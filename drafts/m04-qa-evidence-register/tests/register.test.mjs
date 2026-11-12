/**
 * YANDIK+ M04-S9T | 10 TESTS WRITTEN, NOT EXECUTED.
 * CODE_ONLY forbids test execution without explicit owner authorization.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {PREFLIGHT_DEMO} from "../fixtures.mjs";
import {buildQaEvidenceRegister,qaEvidenceRegisterText,NO_AUTHORITY}
  from "../register.mjs";
const create=()=>buildQaEvidenceRegister(PREFLIGHT_DEMO);
test("six gates and four findings are retained",()=>{
  const x=create();
  assert.equal(x.stage_groups.length,6);
  assert.equal(x.finding_groups.length,4);
});
test("all requested evidence rows are unique",()=>{
  const x=create();
  assert.equal(x.requests.length,14);
  assert.equal(new Set(x.requests.map(r=>r.id)).size,14);
});
test("no evidence, test execution or official closures are implied",()=>{
  const x=create();assert.equal(x.readiness,NO_AUTHORITY);
  assert.equal(x.totals.documents_received,0);
  assert.equal(x.totals.verified_evidence,0);
  assert.equal(x.totals.official_findings_closed,0);
  assert.ok(x.requests.every(r=>!r.evidence_provided&&!r.verification_done&&
    r.evidence_reference===null&&r.official_approval===false));
});
test("G0 remains first in preflight and permission never granted",()=>{
  const x=create();assert.equal(x.stage_groups[0].id,"G0_OWNER_SCOPE");
  assert.ok(x.stage_groups.every(g=>!g.approved_to_run&&!g.executed&&!g.passed));
});
test("stage request preserves exact proposed evidence description",()=>{
  const x=create();
  for(const stage of PREFLIGHT_DEMO.stages){
    const r=x.requests.find(r=>r.id==="DEMO-REQ-STAGE-"+stage.id);
    assert.equal(r.requirement,stage.proposed_evidence);
  }
});
test("finding evidence requests map to their source",()=>{
  const x=create();
  for(const finding of PREFLIGHT_DEMO.findings){
    const group=x.finding_groups.find(g=>g.id===finding.id);
    assert.equal(group.request_ids.length,finding.required_evidence.length);
    assert.ok(group.request_ids.every(id=>x.requests.some(r=>r.id===id)));
  }
});
test("reject fake executed or approved stage",()=>{
  const modified={...PREFLIGHT_DEMO,stages:PREFLIGHT_DEMO.stages.map(
    (s,i)=>i?s:{...s,approved_to_run:true})};
  assert.throws(()=>buildQaEvidenceRegister(modified));
});
test("reject fabricated official closure and evidence references",()=>{
  const modified={...PREFLIGHT_DEMO,findings:PREFLIGHT_DEMO.findings.map(
    (f,i)=>i?f:{...f,official_finding_closed:true})};
  assert.throws(()=>buildQaEvidenceRegister(modified));
});
test("reject missing or altered evidence requirement",()=>{
  const modified={...PREFLIGHT_DEMO,findings:PREFLIGHT_DEMO.findings.map(
    (f,i)=>i?f:{...f,required_evidence:["dokumen palsu"]})};
  assert.throws(()=>buildQaEvidenceRegister(modified));
});
test("read-only export filters and does not mutate the source",()=>{
  const x=create(),s=qaEvidenceRegisterText(x,"temuan");
  assert.match(s,/BUKAN LAPORAN PENGUJIAN/);
  assert.match(s,/STATIC-01/);
  assert.doesNotMatch(s,/DEMO-REQ-STAGE-G1/);
  assert.throws(()=>qaEvidenceRegisterText(x,"approved"));
  assert.deepEqual(create(),x);
});
