/**
 * M04-S9F | TEST CASES WRITTEN, NOT EXECUTED.
 * CODE_ONLY prohibits Node, CI and browser execution without explicit owner permission.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {BOARD_DEMO,CONTEXT_DEMO} from "../fixtures.mjs";
import {buildPreintegrationChecklist,checklistText,VERDICT,REQUIREMENTS,
  TEST_WAVES} from "../checklist.mjs";
test("all integration requirements remain unverified",()=>{
  const x=buildPreintegrationChecklist(BOARD_DEMO,CONTEXT_DEMO);
  assert.equal(x.totals.checks,REQUIREMENTS.length);
  assert.equal(x.totals.verified,0);
  assert.ok(x.requirements.every(r=>!r.done&&!r.official_evidence_verified));
});
test("all QA waves remain pending independent of examples",()=>{
  const x=buildPreintegrationChecklist(BOARD_DEMO,CONTEXT_DEMO);
  assert.equal(x.waves.length,TEST_WAVES.length);
  assert.ok(x.waves.every(w=>w.status==="BELUM_DIMULAI"));
});
test("public visibility highlights repository risk but never authorizes transition",()=>{
  const x=buildPreintegrationChecklist(BOARD_DEMO,CONTEXT_DEMO);
  assert.match(x.requirements.find(r=>r.id==="SEC-01").context_alert,/PUBLIC/);
  assert.equal(x.integration_readiness,VERDICT);
});
test("private snapshot would not equal a security audit or readiness",()=>{
  const board={...BOARD_DEMO,repo_snapshot:{...BOARD_DEMO.repo_snapshot,visibility:"private"}};
  const ctx={...CONTEXT_DEMO,repo_visibility:"private"};
  const x=buildPreintegrationChecklist(board,ctx);
  assert.equal(x.totals.verified,0);assert.equal(x.integration_readiness,VERDICT);
});
test("source stale escalates review without modifying source",()=>{
  const board={...BOARD_DEMO,source_stale:true};
  const x=buildPreintegrationChecklist(board,CONTEXT_DEMO);
  assert.match(x.requirements.find(r=>r.id==="FLOW-02").context_alert,/berubah/);
});
test("refuses real or wrong-schema board",()=>{
  assert.throws(()=>buildPreintegrationChecklist({...BOARD_DEMO,synthetic:false},CONTEXT_DEMO));
  assert.throws(()=>buildPreintegrationChecklist({...BOARD_DEMO,schema:"external"},CONTEXT_DEMO));
});
test("rejects production or QA mode even if other fields appear valid",()=>{
  assert.throws(()=>buildPreintegrationChecklist(BOARD_DEMO,
    {...CONTEXT_DEMO,authorized_testing:true}));
  assert.throws(()=>buildPreintegrationChecklist(BOARD_DEMO,
    {...CONTEXT_DEMO,production_connected:true}));
});
test("rejects mismatch between repo observation and source snapshot",()=>{
  assert.throws(()=>buildPreintegrationChecklist(BOARD_DEMO,
    {...CONTEXT_DEMO,repo_visibility:"private"}));
});
test("rejects duplicate agenda references",()=>{
  const board={...BOARD_DEMO,rows:[...BOARD_DEMO.rows,BOARD_DEMO.rows[0]],
    total_agenda:BOARD_DEMO.rows.length+1};
  assert.throws(()=>buildPreintegrationChecklist(board,CONTEXT_DEMO));
});
test("export stays explicit that no approval happened",()=>{
  assert.match(checklistText(buildPreintegrationChecklist(BOARD_DEMO,CONTEXT_DEMO)),
    /BUKAN HASIL PEMERIKSAAN/);
});
