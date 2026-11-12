/**
 * M04-S9G | TEST CASES WRITTEN, NOT EXECUTED (CODE_ONLY).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {CHECKLIST_DEMO} from "../fixtures.mjs";
import {buildDependencyMatrix,dependencyMatrixText,DEPENDENCIES,PHASES,
  NO_AUTHORITY} from "../dependencies.mjs";
const build=()=>buildDependencyMatrix(CHECKLIST_DEMO);
test("all 18 prereqs are present exactly once",()=>{
  const b=build();
  assert.equal(b.rows.length,18);
  assert.equal(new Set(b.rows.map(x=>x.id)).size,18);
});
test("topological order never puts a child before its parent",()=>{
  const b=build(),pos=new Map(b.rows.map(x=>[x.id,x.sequence]));
  for(const row of b.rows)for(const parent of row.direct_dependencies)
    assert.ok(pos.get(parent)<pos.get(row.id));
});
test("all phases remain unstarted and none authorized",()=>{
  const b=build();
  assert.deepEqual(b.waves.map(w=>w.id),["P0","P1","P2","P3"]);
  assert.ok(b.waves.every(w=>w.status==="BELUM_DIMULAI"&&!w.permission_to_test));
  assert.ok(b.rows.every(x=>x.authorized_to_act===false&&!x.verified));
});
test("public risk is noted without introducing credentials",()=>{
  assert.match(build().warnings.join(" "),/PUBLIC/);
});
test("private snapshot alone cannot imply security review passed",()=>{
  const x={...CHECKLIST_DEMO,
    source:{...CHECKLIST_DEMO.source,
      repo_snapshot:{...CHECKLIST_DEMO.source.repo_snapshot,visibility:"private"}}};
  assert.equal(buildDependencyMatrix(x).integration_readiness,NO_AUTHORITY);
});
test("stale source requires re-evaluation even with same deps",()=>{
  const x={...CHECKLIST_DEMO,
    source:{...CHECKLIST_DEMO.source,source_stale:true}};
  assert.match(buildDependencyMatrix(x).warnings.join(" "),/Snapshot agenda berubah/);
});
test("unknown, duplicate, self-dependent and cyclic graphs rejected",()=>{
  assert.throws(()=>buildDependencyMatrix(CHECKLIST_DEMO,
    {...DEPENDENCIES,"INT-02":["NOT-EXIST"]}));
  assert.throws(()=>buildDependencyMatrix(CHECKLIST_DEMO,
    {...DEPENDENCIES,"GOV-01":["GOV-01"]}));
  assert.throws(()=>buildDependencyMatrix(CHECKLIST_DEMO,
    {...DEPENDENCIES,"SEC-01":["SEC-04"]}));
  assert.throws(()=>buildDependencyMatrix(CHECKLIST_DEMO,
    {...DEPENDENCIES,"GOV-01":["SEC-01","SEC-01"]}));
});
test("phase regressions are rejected",()=>{
  const phases={...PHASES,"SEC-01":"P3"};
  assert.throws(()=>buildDependencyMatrix(CHECKLIST_DEMO,DEPENDENCIES,phases));
});
test("source with forged approval or non demo status is rejected",()=>{
  assert.throws(()=>buildDependencyMatrix({...CHECKLIST_DEMO,synthetic:false}));
  assert.throws(()=>buildDependencyMatrix({...CHECKLIST_DEMO,
    requirements:CHECKLIST_DEMO.requirements.map((x,i)=>i?x:{...x,done:true})}));
  assert.throws(()=>buildDependencyMatrix({...CHECKLIST_DEMO,
    waves:CHECKLIST_DEMO.waves.map((x,i)=>i?x:{...x,status:"TERUJI"})}));
});
test("all status remaining open does not permit integration",()=>{
  assert.equal(build().totals.verified,0);
  assert.equal(build().integration_readiness,NO_AUTHORITY);
  assert.match(dependencyMatrixText(build()),/BUKAN HASIL AUDIT/);
});
test("parallel independent discussion starters do not become executed tasks",()=>{
  const b=build();
  assert.ok(b.totals.independent_discussion_starters>=2);
  assert.ok(b.rows.filter(x=>!x.dependency_count).every(x=>!x.authorized_to_act));
});
