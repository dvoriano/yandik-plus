/**
 * M04-S9J | 12 TESTS WRITTEN, NOT EXECUTED under CODE_ONLY.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {AGENDA_DEMO} from "../fixtures.mjs";
import {createDemoConfirmationBook,editDemoConfirmation,confirmationView,
  confirmationText,NO_DECISION} from "../confirmation.mjs";
const book=()=>createDemoConfirmationBook(AGENDA_DEMO);
const changes=(a="",b="",c="")=>({
  masukan_demo:a,kekurangan_bukti_demo:b,tindak_lanjut_usulan_demo:c,
});
test("initial book mirrors 18 agenda items with no official confirmations",()=>{
  const b=book(),v=confirmationView(b,AGENDA_DEMO);
  assert.equal(b.records.length,18);
  assert.equal(v.totals.functions,6);
  assert.equal(v.totals.demo_notes_started,0);
  assert.equal(v.totals.formal_decisions,0);
});
test("record a sample draft without changing agenda or granting permission",()=>{
  const b=book();
  const edited=editDemoConfirmation(b,AGENDA_DEMO,"kelembagaan","GOV-01",
    changes("Contoh masukan","Contoh kekurangan","Contoh tindak lanjut"));
  assert.equal(edited.revision,1);assert.equal(b.revision,0);
  assert.equal(edited.records.find(x=>x.item_id==="GOV-01").revision,1);
  assert.equal(edited.readiness,NO_DECISION);
  assert.equal(AGENDA_DEMO.totals.official_decisions,0);
});
test("editing the same values does not add a revision",()=>{
  const x=editDemoConfirmation(book(),AGENDA_DEMO,"keamanan","SEC-01",
    changes("contoh","contoh","contoh"));
  const y=editDemoConfirmation(x,AGENDA_DEMO,"keamanan","SEC-01",
    changes("contoh","contoh","contoh"));
  assert.strictEqual(x,y);
});
test("clear all three fields in one item remains a nonofficial demo",()=>{
  const x=editDemoConfirmation(book(),AGENDA_DEMO,"data","DAT-01",
    changes("A","B","C"));
  const y=editDemoConfirmation(x,AGENDA_DEMO,"data","DAT-01",changes());
  assert.equal(confirmationView(y,AGENDA_DEMO).totals.demo_notes_started,0);
  assert.equal(y.edits,2);
});
test("refuse wrong function ID and unknown item",()=>{
  assert.throws(()=>editDemoConfirmation(book(),AGENDA_DEMO,"keamanan","GOV-01",changes("x")));
  assert.throws(()=>editDemoConfirmation(book(),AGENDA_DEMO,"x","NOT-FOUND",changes("x")));
});
test("refuse extra keys and missing fields",()=>{
  assert.throws(()=>editDemoConfirmation(book(),AGENDA_DEMO,"kelembagaan","GOV-01",
    {...changes(),official_decision:true}));
  assert.throws(()=>editDemoConfirmation(book(),AGENDA_DEMO,"kelembagaan","GOV-01",
    {masukan_demo:"c"}));
});
test("reject oversized or control-character input",()=>{
  assert.throws(()=>editDemoConfirmation(book(),AGENDA_DEMO,"kelembagaan","GOV-01",
    changes("x".repeat(501))));
  assert.throws(()=>editDemoConfirmation(book(),AGENDA_DEMO,"kelembagaan","GOV-01",
    changes("a\u0000b")));
});
test("source version mismatch rejects draft reuse",()=>{
  const changed={...AGENDA_DEMO,source_stale:true};
  assert.throws(()=>editDemoConfirmation(book(),changed,"kelembagaan","GOV-01",changes("a")));
});
test("fake official approval in book rejected",()=>{
  const x=book();
  const y={...x,records:x.records.map((v,i)=>i? v:{...v,official_confirmation:true})};
  assert.throws(()=>confirmationView(y,AGENDA_DEMO));
});
test("fake official meeting in agenda rejected",()=>{
  const fake={...AGENDA_DEMO,groups:AGENDA_DEMO.groups.map((g,i)=>i?g:{...g,meeting_held:true})};
  assert.throws(()=>createDemoConfirmationBook(fake));
});
test("subset export contains correct item and strong disclaimer",()=>{
  const v=confirmationView(book(),AGENDA_DEMO);
  const t=confirmationText(v,"keamanan");
  assert.match(t,/BUKAN NOTULEN/);
  assert.match(t,/SEC-01/);
  assert.doesNotMatch(t,/GOV-01 /);
  assert.throws(()=>confirmationText(v,"unknown"));
});
test("in-memory edits never imply sending or persisting, source remains immutable",()=>{
  const original=book();
  const next=editDemoConfirmation(original,AGENDA_DEMO,"alur","FLOW-01",
    changes("Bahan contoh"));
  assert.equal(original.records.find(x=>x.item_id==="FLOW-01").notes.masukan_demo,"");
  assert.equal(next.records.find(x=>x.item_id==="FLOW-01").official_decision,false);
  assert.equal(next.records.find(x=>x.item_id==="FLOW-01").history[0].official,false);
});

test("M04-S9R static audit: draft is stale when phase, dependencies, roles or group title change",()=>{
  const existing=book();
  const mutate=(patch)=>({
    ...AGENDA_DEMO,
    groups:AGENDA_DEMO.groups.map(g=>g.id==="kelembagaan"?{
      ...g,
      items:g.items.map(x=>x.id==="GOV-01"?{...x,...patch}:x),
    }:g),
  });
  for(const patch of [
    {phase:"P1"},
    {dependency_ids:["SEC-01"]},
    {proposed_reviewer_role:"Fungsi DEMO berubah"},
    {source_document:"docs/CHANGED_DEMO.md"},
    {origin_discussion_order:99},
  ]){
    assert.throws(()=>confirmationView(existing,mutate(patch)));
  }
  const renamed={...AGENDA_DEMO,
    groups:AGENDA_DEMO.groups.map(g=>g.id==="kelembagaan"?
      {...g,title:"Judul fungsi DEMO berubah"}:g)};
  assert.throws(()=>confirmationView(existing,renamed));
});
