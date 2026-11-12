/**
 * YANDIK+ M04-S9P | 12 TESTS WRITTEN, NEVER EXECUTED (CODE_ONLY).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {MATERIAL_MATRIX_DEMO,HANDOFF_DEMO} from "../fixtures.mjs";
import {buildMaterialGapSequence,materialGapSequenceText,BOUNDARY}
  from "../sequence.mjs";
const build=()=>buildMaterialGapSequence(MATERIAL_MATRIX_DEMO,HANDOFF_DEMO);
const swapFirstRow=change=>({...MATERIAL_MATRIX_DEMO,
  rows:MATERIAL_MATRIX_DEMO.rows.map((r,i)=>i?r:{...r,...change})});
const swapFirstEntry=change=>({...HANDOFF_DEMO,
  groups:HANDOFF_DEMO.groups.map((g,i)=>i?g:{
    ...g,entries:g.entries.map((e,j)=>j?e:{...e,...change})})});
test("exactly 18 items across six functions and four waves",()=>{
  const p=build();
  assert.equal(p.rows.length,18);assert.equal(p.groups.length,6);
  assert.equal(p.phaseWaves.length,4);
  assert.equal(new Set(p.rows.map(x=>x.source_item_id)).size,18);
});
test("topological proposed discussion order respects every dependency",()=>{
  const p=build(),positions=new Map(p.rows.map(x=>[x.source_item_id,x.discussion_sequence]));
  for(const row of p.rows)for(const pred of row.prerequisite_ids)
    assert.ok(positions.get(pred)<row.discussion_sequence);
});
test("dependency layers increase after every prerequisite",()=>{
  const p=build(),levels=new Map(p.rows.map(x=>[x.source_item_id,x.dependency_layer]));
  for(const row of p.rows)for(const pred of row.prerequisite_ids)
    assert.ok(levels.get(pred)<row.dependency_layer);
});
test("source matrix note gaps are not real evidence findings",()=>{
  const p=build();assert.equal(p.totals.text_gap_notes,3);
  assert.equal(p.totals.blank_gap_notes,15);
  assert.equal(p.totals.official_evidence_verified,0);
  assert.ok(p.rows.every(x=>x.official_document_verified===false&&
    x.readiness!=="READY"));
});
test("initial no-dependency starters are only proposed discussion starters",()=>{
  const p=build();assert.equal(p.totals.initial_discussion_starters,2);
  assert.ok(p.rows.filter(x=>!x.prerequisite_ids.length).every(x=>
    !x.officially_cleared&&x.assigned_officer===null));
});
test("source question IDs and material requests survive",()=>{
  const p=build();
  for(const row of p.rows){
    const source=MATERIAL_MATRIX_DEMO.rows.find(x=>x.source_item_id===row.source_item_id);
    assert.deepEqual(row.question_ids,source.question_ids);
    assert.equal(row.material_request,source.required_material_description);
  }
});
test("all official authority and permissions remain disabled",()=>{
  const p=build();assert.equal(p.readiness,BOUNDARY);
  assert.equal(p.totals.official_tasks,0);assert.equal(p.totals.official_decisions,0);
  assert.ok(p.rows.every(x=>!x.authorized_to_test&&!x.authorized_to_deploy&&
    !x.officially_cleared&&x.official_deadline===null));
});
test("source stale warns but never confers permission",()=>{
  const m={...MATERIAL_MATRIX_DEMO,source:{...MATERIAL_MATRIX_DEMO.source,source_stale:true}};
  const h={...HANDOFF_DEMO,source:{...HANDOFF_DEMO.source,source_stale:true}};
  const p=buildMaterialGapSequence(m,h);
  assert.ok(p.warnings.some(x=>x.includes("Snapshot berubah")));
  assert.equal(p.readiness,BOUNDARY);
});
test("reject wrong revision, source snapshot or tampered evidence",()=>{
  const m={...MATERIAL_MATRIX_DEMO,source:{...MATERIAL_MATRIX_DEMO.source,revision:99}};
  assert.throws(()=>buildMaterialGapSequence(m,HANDOFF_DEMO));
  assert.throws(()=>buildMaterialGapSequence(swapFirstRow({verified_official_evidence:true}),HANDOFF_DEMO));
  assert.throws(()=>buildMaterialGapSequence(swapFirstRow({required_material_description:"ubah"}),HANDOFF_DEMO));
});
test("reject unknown predecessor, a real same-phase cycle and reverse-phase link",()=>{
  assert.throws(()=>buildMaterialGapSequence(
    MATERIAL_MATRIX_DEMO,swapFirstEntry({dependency_ids:["UNKNOWN"]})));
  // GOV-03 already depends on GOV-01; both are P0, so this closes a cycle.
  const cycle={...HANDOFF_DEMO,groups:HANDOFF_DEMO.groups.map(g=>({
    ...g,entries:g.entries.map(x=>x.id==="GOV-01"?
      {...x,dependency_ids:["GOV-03"]}:x),
  }))};
  assert.throws(()=>buildMaterialGapSequence(MATERIAL_MATRIX_DEMO,cycle));
  const reversePhase={...HANDOFF_DEMO,groups:HANDOFF_DEMO.groups.map(g=>({
    ...g,entries:g.entries.map(x=>x.id==="GOV-01"?
      {...x,dependency_ids:["INT-02"]}:x),
  }))};
  assert.throws(()=>buildMaterialGapSequence(MATERIAL_MATRIX_DEMO,reversePhase));
});
test("reject duplicated matrix source id and unauthorized approval",()=>{
  const m={...MATERIAL_MATRIX_DEMO,rows:MATERIAL_MATRIX_DEMO.rows.map((x,i)=>
    i?x:{...x,source_item_id:MATERIAL_MATRIX_DEMO.rows[1].source_item_id})};
  assert.throws(()=>buildMaterialGapSequence(m,HANDOFF_DEMO));
  assert.throws(()=>buildMaterialGapSequence(
    swapFirstRow({approved_for_integration:true}),HANDOFF_DEMO));
});
test("plain text filters have warnings and builder does not mutate source",()=>{
  const p=build();
  const text=materialGapSequenceText(p,"keamanan","demo_gap_written");
  assert.match(text,/BUKAN PRIORITAS/);assert.match(text,/SEC-01/);
  assert.doesNotMatch(text,/GOV-01/);
  assert.throws(()=>materialGapSequenceText(p,"unknown"));
  const again=build();
  assert.deepEqual(again.rows,p.rows);
  assert.equal(HANDOFF_DEMO.groups[0].entries[0].evidence_verified,false);
});
