/** M04-S9D | SKENARIO TES DITULIS, BELUM DIJALANKAN (CODE_ONLY). */
import test from "node:test";
import assert from "node:assert/strict";
import {AGENDA_DEMO,SECRETARIAT_DEMO,REVIEWER_DEMO,EXAMPLE} from "../fixtures.mjs";
import {createDiscussionRegister,addDiscussion,reviseDiscussion,submitDiscussion,
  reviewDiscussion,discussionSummary,discussionHandoff,READINESS} from "../register.mjs";
const empty=()=>createDiscussionRegister(AGENDA_DEMO,SECRETARIAT_DEMO);
const seed=()=>addDiscussion(empty(),AGENDA_DEMO,AGENDA_DEMO.rows[0].id,EXAMPLE,SECRETARIAT_DEMO);
test("all agenda remain visible when no notes",()=>{
  const b=discussionSummary(empty(),AGENDA_DEMO);
  assert.equal(b.total,0);assert.equal(b.unrecorded.length,AGENDA_DEMO.rows.length);
});
test("duplicate agenda and non DEMO assignee are rejected",()=>{
  const b=seed();
  assert.throws(()=>addDiscussion(b,AGENDA_DEMO,AGENDA_DEMO.rows[0].id,EXAMPLE,SECRETARIAT_DEMO));
  assert.throws(()=>addDiscussion(empty(),AGENDA_DEMO,AGENDA_DEMO.rows[0].id,
    {...EXAMPLE,assigned_demo_id:"staff-name"},SECRETARIAT_DEMO));
});
test("no official approval attribute is permitted in input",()=>{
  assert.throws(()=>addDiscussion(empty(),AGENDA_DEMO,AGENDA_DEMO.rows[0].id,
    {...EXAMPLE,approval:true},SECRETARIAT_DEMO));
});
test("reviewer must differ from author and assignee",()=>{
  let b=seed(),id=b.entries[0].id;
  b=submitDiscussion(b,AGENDA_DEMO,id,SECRETARIAT_DEMO);
  assert.throws(()=>reviewDiscussion(b,AGENDA_DEMO,id,
    {role:"penelaah_demo",id:SECRETARIAT_DEMO.id},"catat_sebagai_bahan",
    "Hanya bahan diskusi fiktif, tidak ada pengesahan atau keputusan."));
});
test("return and revision keep history",()=>{
  let b=seed(),id=b.entries[0].id;
  b=submitDiscussion(b,AGENDA_DEMO,id,SECRETARIAT_DEMO);
  b=reviewDiscussion(b,AGENDA_DEMO,id,REVIEWER_DEMO,"minta_perbaikan",
    "Mohon lengkapi referensi bukti DEMO dan penjelasan latar belakang sebelum dibahas.");
  b=reviseDiscussion(b,AGENDA_DEMO,id,{...EXAMPLE,
    discussion:EXAMPLE.discussion+" Tambahan rujukan akan disusun."},SECRETARIAT_DEMO);
  assert.equal(b.entries[0].history.length,b.entries[0].revision);
});
test("source change blocks mutation and marks record stale",()=>{
  const b=seed(),changed={...AGENDA_DEMO,rows:AGENDA_DEMO.rows.map((x,i)=>i?x:
    {...x,subject:x.subject+" versi baru"})};
  assert.throws(()=>submitDiscussion(b,changed,b.entries[0].id,SECRETARIAT_DEMO));
  assert.equal(discussionSummary(b,changed).source_stale,true);
});
test("notes recorded as material never authorize integration",()=>{
  let b=seed(),id=b.entries[0].id;
  b=submitDiscussion(b,AGENDA_DEMO,id,SECRETARIAT_DEMO);
  b=reviewDiscussion(b,AGENDA_DEMO,id,REVIEWER_DEMO,"catat_sebagai_bahan",
    "Catatan hanya dibaca dan dicatat sebagai bahan diskusi, bukan keputusan atau pengesahan.");
  assert.equal(discussionSummary(b,AGENDA_DEMO).integration_readiness,READINESS);
  assert.match(discussionHandoff(b,AGENDA_DEMO),/BUKAN RISALAH/);
});
test("overdue uses manual calendar date and rejects invalid date",()=>{
  assert.equal(discussionSummary(seed(),AGENDA_DEMO,"2026-11-15").overdue,1);
  assert.throws(()=>discussionSummary(seed(),AGENDA_DEMO,"2026-02-30"));
});
