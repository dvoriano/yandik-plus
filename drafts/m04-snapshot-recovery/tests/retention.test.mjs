/** M04-I6C | 6 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {planRetentionRegister,I6C_RETENTION_SCHEMA} from "../retention.mjs";
import {I6C_SNAPSHOT_SCHEMA} from "../snapshot.mjs";
const IDS=["DEMO-PSW-001","DEMO-PSW-002","DEMO-PSW-003"];
const ready=()=>({schema:I6C_SNAPSHOT_SCHEMA,synthetic:true,
 official_authorization:false,may_write:false,facility_ids:[...IDS]});
test("I6C retention register includes global and per-facility classes",()=>{
 const r=planRetentionRegister(ready());
 assert.equal(r.schema,I6C_RETENTION_SCHEMA);assert.equal(r.records.length,18);
 assert.ok(r.records.some(x=>x.kind==="migration_manifest"));
 assert.ok(r.records.some(x=>x.kind==="i4_archives"&&x.facility_id===IDS[0]));
});
test("I6C cannot delete, export or purge even with DEMO hold",()=>{
 const r=planRetentionRegister(ready(),[IDS[0]]);
 assert.equal(r.policy_approved,false);
 assert.equal(r.can_delete,false);assert.equal(r.can_export,false);
 assert.equal(r.can_purge,false);assert.equal(r.backup_exists_verified,false);
 assert.equal(r.legal_hold_verified,false);
 assert.ok(r.records.every(x=>x.can_delete===false&&x.can_purge===false));
});
test("I6C hold changes metadata only, with retention days unset",()=>{
 const r=planRetentionRegister(ready(),[IDS[1]]);
 const held=r.records.filter(x=>x.facility_id===IDS[1]);
 assert.equal(held.length,5);
 assert.ok(held.every(x=>x.legal_hold==="DEMO_HOLD_DICATAT"));
 assert.ok(r.records.every(x=>x.retention_period==="BELUM_DITETAPKAN"));
});
test("I6C rejects unknown or duplicate hold facilities",()=>{
 assert.throws(()=>planRetentionRegister(ready(),["DEMO-PSW-999"]),
  /RETENTION_FACILITY_SCOPE_INVALID/);
 assert.throws(()=>planRetentionRegister(ready(),[IDS[0],IDS[0]]),
  /RETENTION_HOLD_LIST_INVALID/);
});
test("I6C rejects duplicate or malformed scopes and false readiness",()=>{
 assert.throws(()=>planRetentionRegister({...ready(),facility_ids:[IDS[0],IDS[0]]}),
  /RETENTION_FACILITY_SCOPE_INVALID/);
 assert.throws(()=>planRetentionRegister({...ready(),may_write:true}),
  /RETENTION_READINESS_INVALID/);
 assert.throws(()=>planRetentionRegister({...ready(),facility_ids:[]}),
  /RETENTION_READINESS_INVALID/);
});
test("I6C only returns planned metadata, never actual archived payload",()=>{
 const original=ready(),before=JSON.stringify(original);
 const r=planRetentionRegister(original);
 assert.equal(JSON.stringify(original),before);
 assert.ok(!JSON.stringify(r).includes("source_snapshot_payload"));
 assert.ok(r.records.every(x=>x.review_state==="MEMERLUKAN_KEPUTUSAN_PENGELOLA_DATA"));
});
