/** M04-I6D | 7 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {mapLegacyCompatibility} from "../legacy-surfaces.mjs";
import {buildFlaskIntegrationGatePlan,INTEGRATION_GATES,
 I6D_COMPAT_SCHEMA} from "../contracts.mjs";
import {REQUIRED_GATES} from "../../m04-snapshot-recovery/runbook.mjs";
const base=()=>mapLegacyCompatibility();
test("I6D includes I6C gates and 12 application integration gates",()=>{
 const p=buildFlaskIntegrationGatePlan(base());
 assert.equal(p.schema,I6D_COMPAT_SCHEMA);
 assert.equal(p.gates.length,REQUIRED_GATES.length+INTEGRATION_GATES.length);
 assert.equal(p.gates.length,24);
 assert.ok(p.gates.every(g=>g.status==="BELUM_DIBUKTIKAN"));
});
test("I6D plans never authorize integration or deployment",()=>{
 const p=buildFlaskIntegrationGatePlan(base());
 for(const k of ["may_integrate","may_write","may_cutover","may_deploy",
  "official_authorization","apel_parity_proven","security_review_passed"])
  assert.equal(p[k],false);
});
test("I6D includes APEL 2026 parity, unique monthly report and fallback",()=>{
 const p=buildFlaskIntegrationGatePlan(base());
 for(const id of ["apel_2026_parity","apel_no_double_entry","fallback_no_cutover"])
  assert.ok(p.gates.some(g=>g.id===id));
});
test("I6D refuses forged verified route data",()=>{
 const r=base();r.rows[0].auth_verified=true;
 assert.throws(()=>buildFlaskIntegrationGatePlan(r),/INTEGRATION_ROUTE_REVIEW_INVALID/);
});
test("I6D refuses untrusted route schema or permission",()=>{
 const r=base();r.schema="OTHER";
 assert.throws(()=>buildFlaskIntegrationGatePlan(r),/INTEGRATION_ROUTE_REVIEW_INVALID/);
 const u=base();u.official_authorization=true;
 assert.throws(()=>buildFlaskIntegrationGatePlan(u),/INTEGRATION_ROUTE_REVIEW_INVALID/);
});
test("I6D references source of every gate explicitly",()=>{
 const p=buildFlaskIntegrationGatePlan(base());
 assert.equal(p.gates.filter(g=>g.source==="M04-I6C").length,12);
 assert.equal(p.gates.filter(g=>g.source==="M04-I6D").length,12);
 assert.ok(p.gates.every(g=>g.evidence_ref===null&&g.decision_ref===null));
});
test("I6D notes do not cause a reduction in pending gates",()=>{
 const r=mapLegacyCompatibility([{
  id:"APEL_FORM",path:"/form",method:"PERLU_KONFIRMASI",
  auth:"BELUM_DIPERIKSA",response:"BELUM_DIPERIKSA",schema:"BELUM_DIPERIKSA"
 }]);
 const p=buildFlaskIntegrationGatePlan(r);
 assert.equal(p.pending,24);
 assert.equal(p.route_note_count,1);
});
