/** M05-2 | 9 QA written, NOT EXECUTED, CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {planAnnualDeadline,requireSchedule,M05_2_SCHEDULE_SCHEMA}
 from "../schedule.mjs";
import {exampleSchedule} from "../fixtures.mjs";
test("M05-2 year proposals cover all configured years without inherited approval",()=>{
 for(const year of [2026,2027,2028,2029,2030]){
  const p=exampleSchedule(year);
  assert.equal(p.schema,M05_2_SCHEDULE_SCHEMA);
  assert.equal(p.year,year);assert.equal(p.months.length,12);
  assert.equal(p.approved,false);assert.equal(p.may_publish,false);
  assert.equal(p.official_rules_verified,false);
 }
});
test("M05-2 deadlines refer to following calendar month",()=>{
 const p=exampleSchedule(2026);
 assert.equal(p.months[0].deadline_date,"2026-02-09");
 assert.equal(p.months[0].publication_date,"2026-02-10");
});
test("M05-2 December 2030 deadline can lie in January 2031",()=>{
 const p=exampleSchedule(2030);
 assert.equal(p.months[11].deadline_date,"2031-01-09");
 assert.equal(p.year,2030);
});
test("M05-2 specific monthly exception overrides only its month",()=>{
 const p=exampleSchedule(2026,{exceptions:[{
  period:"2026-04",deadline_day:12,publication_day:13,
  reason:"Pengecualian bulan contoh untuk simulasi administratif."
 }]});
 assert.equal(p.months[3].deadline_date,"2026-05-12");
 assert.equal(p.months[2].deadline_date,"2026-04-09");
 assert.equal(p.months[3].source,"YEAR_EXCEPTION_DEMO");
 assert.equal(requireSchedule(p,2026),true);
});
test("M05-2 January exception does not distort annual defaults",()=>{
 const p=exampleSchedule(2029,{exceptions:[{
  period:"2029-01",deadline_day:15,publication_day:16,
  reason:"Contoh pengecualian bulan pertama tahun berjalan."
 }]});
 assert.equal(p.months[0].deadline_date,"2029-02-15");
 assert.equal(p.months[1].deadline_date,"2029-03-09");
 assert.equal(requireSchedule(p,2029),true);
});
test("M05-2 duplicate monthly exception or foreign year rejected",()=>{
 for(const exceptions of [
  [{period:"2028-01",deadline_day:9,publication_day:10,reason:"Alasan contoh yang cukup panjang."},
   {period:"2028-01",deadline_day:10,publication_day:11,reason:"Alasan contoh kedua yang cukup panjang."}],
  [{period:"2027-01",deadline_day:9,publication_day:10,reason:"Alasan berbeda tahun tidak diizinkan."}]
 ])assert.throws(()=>exampleSchedule(2028,{exceptions}),/M05_SCHEDULE_EXCEPTION_INVALID/);
});
test("M05-2 invalid days and years are rejected",()=>{
 assert.throws(()=>exampleSchedule(2027,{deadline_day:0}),/M05_SCHEDULE_DAY_INVALID/);
 assert.throws(()=>exampleSchedule(2031),/APEL_YEAR_NOT_CONFIGURED/);
 assert.throws(()=>exampleSchedule(2026,{publication_day:29}),/M05_SCHEDULE_DAY_INVALID/);
});
test("M05-2 cannot claim approval or enforced deadlines",()=>{
 const p={...exampleSchedule(2026),approved:true};
 assert.throws(()=>requireSchedule(p,2026),/M05_SCHEDULE_INVALID/);
 const q={...exampleSchedule(2026),deadline_enforced:true};
 assert.throws(()=>requireSchedule(q,2026),/M05_SCHEDULE_INVALID/);
});
test("M05-2 modified schedule months are rejected",()=>{
 const p=structuredClone(exampleSchedule(2027));
 p.months[4].deadline_date="2027-06-17";
 assert.throws(()=>requireSchedule(p,2027),/M05_SCHEDULE_MONTHS_TAMPERED/);
});
