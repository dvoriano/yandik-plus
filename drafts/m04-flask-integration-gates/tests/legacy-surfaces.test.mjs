/** M04-I6D | 7 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {mapLegacyCompatibility,ROUTE_BASELINE,I6D_ROUTE_SCHEMA}
 from "../legacy-surfaces.mjs";
const note=(r)=>({id:r.id,path:r.path,method:"BELUM_DIPERIKSA",
 auth:"BELUM_DIPERIKSA",response:"BELUM_DIPERIKSA",schema:"BELUM_DIPERIKSA"});
test("I6D known APEL and SDM entrypoints remain documentary candidates",()=>{
 const r=mapLegacyCompatibility();
 assert.equal(r.schema,I6D_ROUTE_SCHEMA);
 assert.equal(r.rows.length,5);
 assert.equal(r.actual_flask_routes_examined,false);
 assert.equal(r.route_parity_proven,false);
 assert.ok(r.rows.every(x=>x.route_exists_verified===false));
});
test("I6D notes never become verification or permission",()=>{
 const r=mapLegacyCompatibility([note(ROUTE_BASELINE[0])]);
 assert.equal(r.notes_received,1);assert.equal(r.may_change_routes,false);
 assert.equal(r.may_deploy,false);
 assert.equal(r.rows[0].auth_verified,false);
});
test("I6D rejects path spoofing for documented route IDs",()=>{
 assert.throws(()=>mapLegacyCompatibility([
  {...note(ROUTE_BASELINE[0]),path:"/admin/delete"}]),/ROUTES_UNKNOWN_OR_DUPLICATE/);
});
test("I6D rejects unlisted routes and duplicate observations",()=>{
 assert.throws(()=>mapLegacyCompatibility([
  {...note(ROUTE_BASELINE[0]),id:"UNLISTED"}]),/ROUTES_UNKNOWN_OR_DUPLICATE/);
 assert.throws(()=>mapLegacyCompatibility([
  note(ROUTE_BASELINE[0]),note(ROUTE_BASELINE[0])]),/ROUTES_UNKNOWN_OR_DUPLICATE/);
});
test("I6D does not accept user-asserted VERIFIED flags",()=>{
 assert.throws(()=>mapLegacyCompatibility([
  {...note(ROUTE_BASELINE[1]),auth:"VERIFIED"}]),/ROUTES_UNVERIFIED_ONLY/);
});
test("I6D rejects fields for invented HTTP methods or claims",()=>{
 assert.throws(()=>mapLegacyCompatibility([
  {...note(ROUTE_BASELINE[2]),role:"provinsi_admin"}]),/ROUTES_EVIDENCE_SHAPE_INVALID/);
});
test("I6D observations do not modify baseline catalog",()=>{
 const before=JSON.stringify(ROUTE_BASELINE);
 mapLegacyCompatibility([note(ROUTE_BASELINE[0])]);
 assert.equal(JSON.stringify(ROUTE_BASELINE),before);
});
