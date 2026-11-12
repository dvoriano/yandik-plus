/**
 * YANDIK+ M04-S9N | 12 TESTS WRITTEN, NOT EXECUTED.
 * CODE_ONLY requires explicit owner permission before Node or browser execution.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {HANDOFF_DEMO} from "../fixtures.mjs";
import {buildOpenQuestionRegister,openQuestionRegisterText,
  OPEN_STATE,NO_AUTHORITY} from "../questions.mjs";
const build=()=>buildOpenQuestionRegister(HANDOFF_DEMO);
const replaceFirst=(patch)=>({...HANDOFF_DEMO,groups:HANDOFF_DEMO.groups.map(
  (g,i)=>i?g:{...g,entries:g.entries.map((x,j)=>j?x:{...x,...patch})})});
test("all question prompts preserved for exactly six functions and 18 items",()=>{
  const q=build();
  assert.equal(q.groups.length,6);
  assert.equal(q.totals.source_items,18);
  assert.equal(q.totals.questions,HANDOFF_DEMO.totals.open_question_prompts);
  assert.equal(new Set(q.rows.map(x=>x.id)).size,q.rows.length);
});
test("each question carries original text, order, source revision and evidence",()=>{
  const q=build();
  for(const group of HANDOFF_DEMO.groups)for(const item of group.entries){
    const rows=q.rows.filter(x=>x.source_item_id===item.id);
    assert.deepEqual(rows.map(x=>x.question_text),item.open_questions);
    assert.deepEqual(rows.map(x=>x.question_number),
      item.open_questions.map((_,i)=>i+1));
    assert.ok(rows.every(x=>x.evidence_requested===item.evidence_requested&&
      x.source_revision===item.source_revision));
  }
});
test("all answers, decisions, assignments, review confirmations and permits stay empty",()=>{
  const q=build();
  assert.equal(q.readiness,NO_AUTHORITY);
  assert.equal(q.totals.official_answers,0);
  assert.ok(q.rows.every(x=>x.answer_state===OPEN_STATE&&
    x.demo_answer===null&&x.official_answer===null&&
    !x.official_evidence_verified&&!x.official_assignment&&
    !x.decision_recorded&&!x.authorized_to_test&&!x.authorized_to_deploy));
});
test("gap filter counts only written text and preserves blanks as unknown",()=>{
  const q=build();
  const written=q.rows.filter(x=>x.evidence_gap_filter==="written_gap");
  const blank=q.rows.filter(x=>x.evidence_gap_filter==="no_written_gap");
  assert.equal(written.length+blank.length,q.rows.length);
  assert.ok(written.length>0);
  assert.ok(blank.length>0);
  assert.ok(blank.every(x=>!x.evidence_gap_text_demo));
});
test("trace cross-function dependencies without treating them as approved",()=>{
  const q=build();
  const byId=new Map(q.rows.map(x=>[x.source_item_id,x]));
  assert.ok(q.rows.every(x=>x.cross_function_dependencies.every(edge=>
    byId.has(edge.source_id)&&
    byId.get(edge.source_id).function_id!==x.function_id)));
});
test("stale source adds warning and keeps all questions open",()=>{
  const s={...HANDOFF_DEMO,source:{...HANDOFF_DEMO.source,source_stale:true}};
  const q=buildOpenQuestionRegister(s);
  assert.equal(q.totals.open_questions,q.totals.questions);
  assert.ok(q.warnings.some(x=>x.includes("berubah")));
});
test("private snapshot alone does not approve answers",()=>{
  const s={...HANDOFF_DEMO,source:{...HANDOFF_DEMO.source,
    repo_snapshot:{...HANDOFF_DEMO.source.repo_snapshot,visibility:"private"}}};
  const q=buildOpenQuestionRegister(s);
  assert.equal(q.readiness,NO_AUTHORITY);
  assert.equal(q.totals.official_answers,0);
});
test("reject forged official decisions, handoff sent, and verified evidence",()=>{
  assert.throws(()=>buildOpenQuestionRegister({...HANDOFF_DEMO,
    totals:{...HANDOFF_DEMO.totals,official_decisions:1}}));
  assert.throws(()=>buildOpenQuestionRegister({...HANDOFF_DEMO,
    groups:HANDOFF_DEMO.groups.map((g,i)=>i?g:{...g,handoff_sent:true})}));
  assert.throws(()=>buildOpenQuestionRegister(replaceFirst({evidence_verified:true})));
});
test("reject forged official response count, missing question and duplicate item",()=>{
  assert.throws(()=>buildOpenQuestionRegister(replaceFirst({question_responses_recorded:1})));
  assert.throws(()=>buildOpenQuestionRegister(replaceFirst({open_questions:[]})));
  const duplicate={...HANDOFF_DEMO,groups:HANDOFF_DEMO.groups.map((g,i)=>
    i?g:{...g,entries:g.entries.map((x,j)=>j?x:{...x,id:g.entries[1].id})})};
  assert.throws(()=>buildOpenQuestionRegister(duplicate));
});
test("reject wrong dependent item or cross-function relation",()=>{
  assert.throws(()=>buildOpenQuestionRegister(replaceFirst({
    dependency_ids:["UNKNOWN"]})));
  assert.throws(()=>buildOpenQuestionRegister(replaceFirst({
    cross_function_dependencies:[{source_id:"UNKNOWN",function_id:"data"}]})));
});
test("plain text export respects function and gap filters and disclaimer",()=>{
  const q=build();
  const out=openQuestionRegisterText(q,"keamanan","written_gap");
  assert.match(out,/BUKAN JAWABAN/);
  assert.match(out,/SEC-01/);
  assert.doesNotMatch(out,/GOV-01/);
  assert.throws(()=>openQuestionRegisterText(q,"unknown"));
  assert.throws(()=>openQuestionRegisterText(q,"all","approved"));
});
test("builder is pure and produces identical draft on same source",()=>{
  const value=HANDOFF_DEMO.groups[0].entries[0].open_questions[0];
  const a=build(),b=build();
  assert.deepEqual(a.rows,b.rows);
  assert.equal(HANDOFF_DEMO.groups[0].entries[0].open_questions[0],value);
});
