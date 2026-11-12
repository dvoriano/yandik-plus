/** YANDIK+ M04-S9E | SKENARIO DITULIS, BELUM DIJALANKAN. */
import test from "node:test";
import assert from "node:assert/strict";
import {AGENDA_DEMO,SECRETARIAT_DEMO,EXAMPLE,REGISTER_DEMO,REVIEWER_DEMO}
  from "../../m04-institutional-minutes/fixtures.mjs";
import {createDiscussionRegister,addDiscussion,submitDiscussion,
  cancelDiscussion,reviewDiscussion} from "../../m04-institutional-minutes/register.mjs";
import {buildOversight,oversightText,READINESS_STATUS} from "../oversight.mjs";
test("empty register lists every agenda without notes",()=>{
  const b=buildOversight(AGENDA_DEMO,createDiscussionRegister(AGENDA_DEMO,SECRETARIAT_DEMO));
  assert.equal(b.attention_counts.tanpa_catatan,b.total_agenda);
});
test("sample note and remaining agenda are both visible",()=>{
  const b=buildOversight(AGENDA_DEMO,REGISTER_DEMO);
  assert.equal(b.registered_notes,1);
  assert.equal(b.attention_counts.tanpa_catatan,b.total_agenda-1);
});
test("overdue counts use explicit date rather than system clock",()=>{
  const b=buildOversight(AGENDA_DEMO,REGISTER_DEMO,"2026-11-15");
  assert.equal(b.overdue_notes,1);
  assert.equal(b.attention_counts.lewat_tenggat,1);
});
test("cancelled discussion remains traceable",()=>{
  let book=createDiscussionRegister(AGENDA_DEMO,SECRETARIAT_DEMO);
  book=addDiscussion(book,AGENDA_DEMO,AGENDA_DEMO.rows[0].id,EXAMPLE,SECRETARIAT_DEMO);
  book=cancelDiscussion(book,AGENDA_DEMO,book.entries[0].id,SECRETARIAT_DEMO,
    "Catatan DEMO dibatalkan karena bahan pembahasan perlu disusun kembali.");
  const b=buildOversight(AGENDA_DEMO,book);
  assert.equal(b.attention_counts.catatan_dibatalkan,1);
  assert.equal(b.missing_or_canceled,b.total_agenda);
});
test("source change marks all agenda for recheck without mutating notes",()=>{
  const changed={...AGENDA_DEMO,rows:AGENDA_DEMO.rows.map((x,i)=>i?x:
    {...x,subject:x.subject+" versi baru"})};
  const b=buildOversight(changed,REGISTER_DEMO);
  assert.equal(b.source_stale,true);
  assert.equal(b.attention_counts.sumber_berubah,b.total_agenda);
});
test("records reviewed as material do not become approved integration",()=>{
  let book=REGISTER_DEMO;
  book=submitDiscussion(book,AGENDA_DEMO,book.entries[0].id,SECRETARIAT_DEMO);
  book=reviewDiscussion(book,AGENDA_DEMO,book.entries[0].id,
    REVIEWER_DEMO,"catat_sebagai_bahan",
    "Catatan dibaca hanya sebagai bahan diskusi dan tidak mewakili persetujuan institusi.");
  const board=buildOversight(AGENDA_DEMO,book);
  assert.equal(board.attention_counts.hanya_bahan,1);
  assert.equal(board.integration_readiness,READINESS_STATUS);
});
test("non-demo agenda and invalid calendar date are rejected",()=>{
  assert.throws(()=>buildOversight({...AGENDA_DEMO,synthetic:false},REGISTER_DEMO));
  assert.throws(()=>buildOversight(AGENDA_DEMO,REGISTER_DEMO,"2026-02-30"));
});
test("unknown agenda references in notes rejected",()=>{
  const fake={...REGISTER_DEMO,entries:REGISTER_DEMO.entries.map(x=>({...x,agenda_id:"S9C-FAKE"}))};
  assert.throws(()=>buildOversight(AGENDA_DEMO,fake));
});
test("text carries explicit non-approval warning",()=>{
  assert.match(oversightText(buildOversight(AGENDA_DEMO,REGISTER_DEMO)),/BUKAN HASIL RAPAT/);
});
