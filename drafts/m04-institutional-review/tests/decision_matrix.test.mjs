/**
 * M04-S9C | SKENARIO TES DITULIS, BELUM DIJALANKAN.
 * Owner CODE_ONLY: do not execute Node/browser/CI until explicitly authorized.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {buildInstitutionalReviewPacket,institutionalReviewPacketText,
  DECISION_BOUNDARY,MATRIX_SCHEMA} from "../decision_matrix.mjs";
import {buildExecutiveBrief,REGISTER_DEMO,DOCKET_DEMO,SOP_DEMO,
  REPOSITORY_SNAPSHOT_DEMO} from "../fixtures.mjs";

function briefing(asOf="2026-11-11"){
  return buildExecutiveBrief(REGISTER_DEMO,DOCKET_DEMO,SOP_DEMO,asOf);
}
test("demonstration packet retains 10 mandatory requirements",()=>{
  const out=buildInstitutionalReviewPacket(briefing(),REPOSITORY_SNAPSHOT_DEMO);
  assert.equal(out.schema,MATRIX_SCHEMA);
  assert.equal(out.summary.mandatory_requirements,10);
  assert.equal(out.rows.filter(x=>x.group==="Persyaratan wajib").length,10);
});
test("PUBLIC snapshot remains a human security decision, not automatic change",()=>{
  const out=buildInstitutionalReviewPacket(briefing(),REPOSITORY_SNAPSHOT_DEMO);
  assert.equal(out.summary.repo_public_on_observed_date,true);
  assert.equal(out.rows[0].priority,"PRIORITAS_TINGGI");
  assert.equal(out.rows[0].resolution,"BELUM_DIPUTUSKAN_MANUSIA");
});
test("private observation still requires formal review and never confers readiness",()=>{
  const snapshot={visibility:"private",observed_on:"2026-11-11",source:"github_metadata_readonly"};
  const out=buildInstitutionalReviewPacket(briefing(),snapshot);
  assert.equal(out.summary.repo_public_on_observed_date,false);
  assert.equal(out.integration_status,DECISION_BOUNDARY);
});
test("unknown observation does not pretend to know repository visibility",()=>{
  const snapshot={visibility:"unknown",observed_on:"2026-11-11",source:"unknown"};
  const out=buildInstitutionalReviewPacket(briefing(),snapshot);
  assert.equal(out.repo_observation.visibility,"unknown");
  assert.equal(out.integration_status,DECISION_BOUNDARY);
});
test("invalid observations reject forged dates and status labels",()=>{
  assert.throws(()=>buildInstitutionalReviewPacket(briefing(),
    {visibility:"secret",observed_on:"2026-11-11",source:"unknown"}));
  assert.throws(()=>buildInstitutionalReviewPacket(briefing(),
    {visibility:"public",observed_on:"2026-02-30",source:"github_metadata_readonly"}));
});
test("text output never presents itself as an approval",()=>{
  const out=buildInstitutionalReviewPacket(briefing(),REPOSITORY_SNAPSHOT_DEMO);
  const text=institutionalReviewPacketText(out);
  assert.match(text,/BELUM ADA/);
  assert.match(text,/BUKAN hasil rapat/);
  assert.match(text,/BUTUH_TELAAH_MANUSIA/);
});
test("malformed or non-demo source is rejected",()=>{
  const fake={...briefing(),synthetic:false};
  assert.throws(()=>buildInstitutionalReviewPacket(fake,REPOSITORY_SNAPSHOT_DEMO));
});
