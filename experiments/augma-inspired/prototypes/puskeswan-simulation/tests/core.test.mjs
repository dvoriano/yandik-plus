import test from "node:test";
import assert from "node:assert/strict";
import {MONTHS,UNITS,RECORDS,recordFor,rowsFor,summarize,visibleUnits,
  monthlyTrend,pending,ranked,csvFor,validateDataset} from "../data.mjs";
test("19 unit fiktif x 12 bulan, 228 data berlabel SYNTHETIC",()=>{
  assert.equal(MONTHS.length,12);
  assert.equal(UNITS.length,19);
  assert.equal(RECORDS.length,228);
  assert.equal(validateDataset(),true);
});
test("missing (null) berbeda dari laporan pelayanan 0",()=>{
  const missing=RECORDS.find(r=>!r.reported);
  const zero=RECORDS.find(r=>r.reported&&r.services===0);
  assert.ok(missing);assert.ok(zero);
  assert.equal(missing.services,null);assert.equal(zero.services,0);
  assert.equal(recordFor(missing.code,missing.month),missing);
});
test("konsistensi agregasi dan ketepatan waktu",()=>{
  for(let month=0;month<12;month++){
    const s=summarize(month),rows=rowsFor(month);
    assert.equal(s.units,19);
    assert.equal(s.reported+s.missing,19);
    assert.equal(s.onTime+s.late,s.reported);
    assert.equal(s.services,rows.filter(r=>r.reported).reduce((a,r)=>a+r.services,0));
  }
});
test("filter nama, jenis, status dan tren bulanan",()=>{
  assert.equal(visibleUnits({kind:"kota"}).length,7);
  assert.equal(visibleUnits({kind:"kabupaten"}).length,12);
  assert.equal(visibleUnits({search:"Tuapejat"}).length,1);
  assert.equal(visibleUnits({month:9,status:"missing"}).length,pending(9).length);
  assert.equal(monthlyTrend().length,12);
  assert.equal(ranked(9).length,summarize(9).reported);
});
test("CSV jelas bertanda fiktif serta laporan kosong tidak ditulis nol",()=>{
  const csv=csvFor(9);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.match(csv,/SYNTHETIC \/ NOT OFFICIAL/);
  assert.match(csv,/TIDAK TERSEDIA/);
  assert.equal(csv.trim().split("\r\n").length,20);
});
test("bulan tidak valid gagal tertutup",()=>{
  assert.throws(()=>rowsFor(12),/Bulan demo/);
  assert.equal(recordFor("13.71",-1),null);
  assert.equal(summarize(9,[]).rate,null);
});
