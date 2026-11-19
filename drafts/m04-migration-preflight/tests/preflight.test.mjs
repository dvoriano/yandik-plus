/** M04-I6A | scenarios written, NOT EXECUTED (CODE_ONLY). */
import test from "node:test";
import assert from "node:assert/strict";
import {archivedI4Fixture,A,B,C} from "../../m04-generation-partition/fixtures.mjs";
import {planOneWayMigration,verifyOneWayMigrationPlan,
 emptyDemoTargetInventory,MIGRATION_SCHEMA} from "../preflight.mjs";
const setup=()=>{
 const {payload,sourceRevision}=archivedI4Fixture();
 return {payload,sourceRevision,target:emptyDemoTargetInventory()};
};
const plan=f=>planOneWayMigration(f.payload,f.sourceRevision,f.target);
test("I6A produces manifest for each DEMO Puskeswan without copy of underlying records",()=>{
 const f=setup(),x=plan(f);
 assert.equal(x.schema,MIGRATION_SCHEMA);
 assert.equal(x.entries.length,3);
 assert.deepEqual(x.entries.map(a=>a.facility_id).sort(),[A.id,B.id,C.id].sort());
 assert.equal(x.mode,"PLAN_ONLY_NO_WRITE");
 assert.equal(x.official_authorization,false);
 assert.ok(x.entries.every(e=>e.partition_sha256.length===64));
 assert.ok(!JSON.stringify(x).includes("supportNeeds"));
});
test("I6A hashes and normalized ordering deterministic on unchanged source",()=>{
 const f=setup(),a=plan(f),b=plan(f);
 assert.deepEqual(a,b);
 assert.equal(a.manifest_sha256.length,64);
});
test("I6A verifies same manifest without granting permission to write",()=>{
 const f=setup(),x=verifyOneWayMigrationPlan(plan(f),f.payload,f.sourceRevision,f.target);
 assert.equal(x.match,true);assert.equal(x.may_write,false);assert.equal(x.source_verified,false);
});
test("I6A rejects forged manifest hashes",()=>{
 const f=setup(),x=plan(f);x.manifest_sha256="0".repeat(64);
 assert.throws(()=>verifyOneWayMigrationPlan(x,f.payload,f.sourceRevision,f.target),
  /MIGRATION_MANIFEST_STALE_OR_TAMPERED/);
});
test("I6A refuses changed source even when workspace revision is unchanged",()=>{
 const f=setup(),x=plan(f);
 f.payload={...f.payload,source_versions:{...f.payload.source_versions,[A.id]:7}};
 assert.throws(()=>verifyOneWayMigrationPlan(x,f.payload,f.sourceRevision,f.target));
});
test("I6A rejects unexpectedly changed source revision",()=>{
 const f=setup(),x=plan(f);
 assert.throws(()=>verifyOneWayMigrationPlan(x,f.payload,f.sourceRevision+1,f.target));
});
test("I6A target must be wholly empty, not just free of current facilities",()=>{
 const f=setup();
 for(const field of ["current_rows","version_rows","event_rows","command_rows"]){
  const target={...f.target,[field]:1};
  assert.throws(()=>planOneWayMigration(f.payload,f.sourceRevision,target),
   /MIGRATION_TARGET_NOT_EMPTY_OR_UNTRUSTED/);
 }
});
test("I6A target existing facilities are not overwritten",()=>{
 const f=setup();
 assert.throws(()=>planOneWayMigration(f.payload,f.sourceRevision,
  {...f.target,facility_ids:[B.id]}));
});
test("I6A unknown, fake or privileged target inventory is rejected",()=>{
 const f=setup();
 for(const bad of [null,{...f.target,synthetic:false},
  {...f.target,schema:"PRODUCTION"},
  {...f.target,extra:"ignore me"}])
  assert.throws(()=>planOneWayMigration(f.payload,f.sourceRevision,bad));
});
test("I6A rejects unsupported revision and untrusted source shape",()=>{
 const f=setup();
 for(const rev of [-1,1.4,"7",NaN])assert.throws(()=>planOneWayMigration(f.payload,rev,f.target));
 assert.throws(()=>planOneWayMigration({...f.payload,workspace:{synthetic:false}},
  f.sourceRevision,f.target));
});
test("I6A rejects archive registry mismatch and does not create migrations",()=>{
 const f=setup(),bad={...f.payload,retired_workflow_ids:[]};
 assert.throws(()=>planOneWayMigration(bad,f.sourceRevision,f.target));
});
test("I6A preflight does not mutate input source or target",()=>{
 const f=setup(),before=JSON.stringify(f);
 plan(f);assert.equal(JSON.stringify(f),before);
});
test("I6A cannot elevate a manifest into an approved migration",()=>{
 const f=setup(),x=plan(f);
 x.official_authorization=true;
 assert.throws(()=>verifyOneWayMigrationPlan(x,f.payload,f.sourceRevision,f.target));
});
