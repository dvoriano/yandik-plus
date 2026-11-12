/**
 * YANDIK+ M04-S9R | 12 FUTURE STATIC-CONTRACT TEST SCENARIOS.
 * KODE DITULIS, BELUM DIUJI.
 * DO NOT RUN under CODE_ONLY without explicit owner permission.
 * These tests read files only when a future owner-authorized test is run;
 * they never launch production, network, browser or CI themselves.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {readFile,access} from "node:fs/promises";
import {MODULES,FINDINGS,TOTALS,AUDIT_SCHEMA,NO_AUTHORITY}
  from "../manifest.mjs";

const fileURL=path=>new URL("../../../"+path,import.meta.url);
const read=async path=>readFile(fileURL(path),"utf8");
const allIds=()=>new Set(MODULES.map(m=>m.id));
test("exactly 12 unique modules M04-S9F to M04-S9Q",()=>{
  const expected=["S9F","S9G","S9H","S9I","S9J","S9K",
    "S9L","S9M","S9N","S9O","S9P","S9Q"];
  assert.deepEqual(MODULES.map(x=>x.id),expected);
  assert.equal(allIds().size,12);
  assert.equal(TOTALS.modules,12);
});
test("audit schema and findings cannot be mistaken for approvals",()=>{
  assert.match(AUDIT_SCHEMA,/UNTESTED/);
  assert.match(NO_AUTHORITY,/BUKAN_HASIL_UJI/);
  assert.ok(FINDINGS.some(x=>x.id==="STATIC-01"&&
    x.status==="KODE_DIPERBAIKI_BELUM_DIUJI"));
  assert.ok(FINDINGS.some(x=>x.id==="STATIC-03"&&
    x.status==="BUTUH_KEPUTUSAN_OWNER"));
  assert.equal(TOTALS.testsExecutedThisMilestone,0);
  assert.equal(TOTALS.confirmedOfficialApprovals,0);
});
test("upstream dependencies are earlier stages with no cycles",()=>{
  const pos=new Map(MODULES.map((x,i)=>[x.id,i]));
  for(const stage of MODULES){
    assert.ok(new Set(stage.upstream).size===stage.upstream.length);
    for(const dep of stage.upstream){
      assert.ok(pos.has(dep));
      assert.ok(pos.get(dep)<pos.get(stage.id));
    }
  }
});
test("all expected model, fixture, UI, HTML, and test sources exist",async()=>{
  for(const m of MODULES){
    for(const name of ["model","fixture","ui","page","testFile"]){
      assert.ok(m[name].startsWith("drafts/"));
      await access(fileURL(m[name]));
    }
  }
});
test("each module exports its declared schema and builder",async()=>{
  for(const m of MODULES){
    const s=await read(m.model);
    assert.match(s,new RegExp("export const "+m.schemaSymbol+"\\s*="));
    assert.match(s,new RegExp("export function "+m.builderSymbol+"\\s*\\("));
    assert.match(s,/CODE_ONLY/);
  }
});
test("manifest equals exact in-scope direct imports, not just a subset",async()=>{
  const byFolder=new Map(MODULES.map(m=>[m.folder,m.id]));
  for(const module of MODULES){
    const s=await read(module.model);
    const imported=[...s.matchAll(/\bfrom\s+["']\.\.\/([^/]+)\/[^"']+["']/g)]
      .map(m=>byFolder.get(m[1])).filter(Boolean);
    assert.equal(new Set(imported).size,imported.length,
      module.id+" duplicates in-scope module imports");
    assert.deepEqual(imported.sort(),[...module.upstream].sort(),
      module.id+" missing or extra direct imports");
  }
});
test("every local relative model and fixture import target exists",async()=>{
  for(const m of MODULES){
    for(const path of [m.model,m.fixture]){
      const s=await read(path);
      const refs=[...s.matchAll(/\bfrom\s+["']([^"']+)["']/g)]
        .map(x=>x[1]).filter(x=>x.startsWith("."));
      for(const ref of refs)await access(new URL(ref,fileURL(path)));
    }
  }
});
test("all module HTML entrypoints point to their own main.mjs",async()=>{
  for(const m of MODULES){
    const h=await read(m.page);
    assert.match(h,/src=["']\.\/main\.mjs["']/);
    assert.match(h,/KODE DITULIS, BELUM DIUJI/);
  }
});
test("UI script source avoids dynamic HTML/network execution sinks",async()=>{
  for(const m of MODULES){
    const script=await read(m.ui);
    assert.doesNotMatch(script,/\.innerHTML\s*=/);
    assert.doesNotMatch(script,/document\.write\s*\(/);
    assert.doesNotMatch(script,/\beval\s*\(/);
    assert.doesNotMatch(script,/\bfetch\s*\(/);
    assert.doesNotMatch(script,/\bXMLHttpRequest\b|\bWebSocket\b/);
    assert.doesNotMatch(script,/\blocalStorage\b|\bsessionStorage\b/);
  }
});
test("S9J source identity now includes sensitive agenda lineage fields",async()=>{
  const j=MODULES.find(x=>x.id==="S9J");
  const source=await read(j.model);
  const identity=source.slice(
    source.indexOf("function identity(source){"),
    source.indexOf("function emptyNotes(){"));
  for(const name of ["phase","dependency_ids","source_document",
    "origin_discussion_order","proposed_preparer_role",
    "proposed_reviewer_role","suggested_materials","questions",
    "followup_discussion"])
    assert.ok(identity.includes(name+":"),name+" missing from identity");
  assert.match(identity,/JSON\.stringify/);
});
test("existing per-module test-file case counts match the catalog",async()=>{
  for(const m of MODULES){
    const s=await read(m.testFile);
    const written=(s.match(/\btest\s*\(/g)||[]).length;
    assert.equal(written,m.writtenTests,
      m.id+" written test count drifted");
    assert.match(s,/NOT EXECUTED|NOT RUN|BELUM DIJALANKAN|BELUM DIUJI/);
  }
});
test("written test totals and no-production boundary remain explicit",()=>{
  assert.equal(MODULES.reduce((n,x)=>n+x.writtenTests,0),140);
  assert.equal(TOTALS.writtenTestsBeforeS9R,139);
  assert.equal(TOTALS.newRegressionScenariosInS9J,1);
  assert.equal(TOTALS.writtenS9RScenarios,12);
  assert.equal(TOTALS.writtenTestsAfterChanges,152);
  assert.equal(TOTALS.productionChanges,0);
});
