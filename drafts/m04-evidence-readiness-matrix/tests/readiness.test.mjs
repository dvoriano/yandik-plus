/**
 * YANDIK+ M04-S9O | 12 SCENARIOS WRITTEN, NOT EXECUTED.
 * CODE_ONLY forbids test execution until explicit owner permission.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {HANDOFF_DEMO,OPEN_QUESTIONS_DEMO} from "../fixtures.mjs";
import {buildEvidenceReadinessMatrix,evidenceReadinessText,NOT_READY}
  from "../readiness.mjs";
const build=()=>buildEvidenceReadinessMatrix(OPEN_QUESTIONS_DEMO,HANDOFF_DEMO);
test("six groups 18 requested materials one per requirement",()=>{
  const m=build();assert.equal(m.groups.length,6);
  assert.equal(m.rows.length,18);assert.equal(m.totals.material_requests,18);
  assert.equal(new Set(m.rows.map(r=>r.source_item_id)).size,18);
});
test("text notes and documentary evidence remain separate",()=>{
  const m=build();
  assert.equal(m.totals.demo_notes_written,3);
  assert.equal(m.totals.demo_notes_blank,15);
  assert.equal(m.totals.documents_received_demo,0);
  assert.equal(m.totals.official_evidence_verified,0);
});
test("three synthetic written gaps do not imply official findings",()=>{
  const m=build();assert.equal(m.totals.gap_notes_written,3);
  assert.ok(m.rows.every(r=>!r.verified_official_evidence));
});
test("requested material matches source text and each question ID is preserved",()=>{
  const m=build();
  for(const row of m.rows){
    const src=HANDOFF_DEMO.groups.flatMap(g=>g.entries).find(e=>e.id===row.source_item_id);
    assert.equal(row.required_material_description,src.evidence_requested);
    assert.equal(row.question_ids.length,src.open_questions.length);
    assert.ok(row.question_ids.every(id=>OPEN_QUESTIONS_DEMO.rows.some(q=>q.id===id)));
  }
});
test("empty notes do not become passed, ready, complete or approved",()=>{
  const m=build(),row=m.rows.find(r=>r.source_item_id==="GOV-02");
  assert.equal(row.demo_note_state,"belum_ada_catatan_demo");
  assert.equal(row.readiness,NOT_READY);
  assert.equal(row.approved_for_integration,false);
});
test("source stale triggers warning and never upgrades readiness",()=>{
  const a={...HANDOFF_DEMO,source:{...HANDOFF_DEMO.source,source_stale:true}};
  const q={...OPEN_QUESTIONS_DEMO,source:{...OPEN_QUESTIONS_DEMO.source,source_stale:true}};
  const m=buildEvidenceReadinessMatrix(q,a);
  assert.ok(m.warnings.some(w=>w.includes("Sumber berubah")));
  assert.equal(m.readiness,NOT_READY);
});
test("private repository snapshot does not verify evidence",()=>{
  const snap={...HANDOFF_DEMO.source.repo_snapshot,visibility:"private"};
  const a={...HANDOFF_DEMO,source:{...HANDOFF_DEMO.source,repo_snapshot:snap}};
  const q={...OPEN_QUESTIONS_DEMO,source:{...OPEN_QUESTIONS_DEMO.source,repo_snapshot:snap}};
  assert.equal(buildEvidenceReadinessMatrix(q,a).totals.official_evidence_verified,0);
});
test("mismatched source snapshot or revision is rejected",()=>{
  const q={...OPEN_QUESTIONS_DEMO,source:{...OPEN_QUESTIONS_DEMO.source,revision:99}};
  assert.throws(()=>buildEvidenceReadinessMatrix(q,HANDOFF_DEMO));
  const a={...HANDOFF_DEMO,source:{...HANDOFF_DEMO.source,
    repo_snapshot:{...HANDOFF_DEMO.source.repo_snapshot,visibility:"private"}}};
  assert.throws(()=>buildEvidenceReadinessMatrix(OPEN_QUESTIONS_DEMO,a));
});
test("reject forged official answer, decision or reviewed evidence",()=>{
  const q={...OPEN_QUESTIONS_DEMO,rows:OPEN_QUESTIONS_DEMO.rows.map((r,i)=>
    i?r:{...r,official_answer:"Yes"})};
  assert.throws(()=>buildEvidenceReadinessMatrix(q,HANDOFF_DEMO));
  const a={...HANDOFF_DEMO,totals:{...HANDOFF_DEMO.totals,verified_evidence:1}};
  assert.throws(()=>buildEvidenceReadinessMatrix(OPEN_QUESTIONS_DEMO,a));
});
test("missing or duplicate question IDs cannot silently pass",()=>{
  const q={...OPEN_QUESTIONS_DEMO,rows:OPEN_QUESTIONS_DEMO.rows.slice(1),
    totals:{...OPEN_QUESTIONS_DEMO.totals,
      questions:OPEN_QUESTIONS_DEMO.rows.length-1,
      open_questions:OPEN_QUESTIONS_DEMO.rows.length-1}};
  assert.throws(()=>buildEvidenceReadinessMatrix(q,HANDOFF_DEMO));
  const dup={...OPEN_QUESTIONS_DEMO,rows:OPEN_QUESTIONS_DEMO.rows.map((r,i)=>
    i?r:{...r,id:OPEN_QUESTIONS_DEMO.rows[1].id})};
  assert.throws(()=>buildEvidenceReadinessMatrix(dup,HANDOFF_DEMO));
});
test("text export filters and preserves non-approval disclaimer",()=>{
  const m=build();const t=evidenceReadinessText(m,"keamanan","ada_catatan_demo");
  assert.match(t,/BUKAN DOKUMEN RESMI/);
  assert.match(t,/SEC-01/);
  assert.doesNotMatch(t,/GOV-01/);
  assert.throws(()=>evidenceReadinessText(m,"unauthorized"));
  assert.throws(()=>evidenceReadinessText(m,"all","verified"));
});
test("pure aggregation does not mutate source",()=>{
  const previous=HANDOFF_DEMO.groups[0].entries[0].input_note_text_demo;
  const a=build(),b=build();assert.deepEqual(a.rows,b.rows);
  assert.equal(HANDOFF_DEMO.groups[0].entries[0].input_note_text_demo,previous);
});
