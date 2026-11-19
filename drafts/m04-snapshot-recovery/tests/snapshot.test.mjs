/** M04-I6C | 8 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {archivedI4Fixture,A} from "../../m04-generation-partition/fixtures.mjs";
import {emptyDemoTargetInventory,planOneWayMigration} from "../../m04-migration-preflight/preflight.mjs";
import {planSnapshotConsistency,I6C_SNAPSHOT_SCHEMA} from "../snapshot.mjs";
function example(){
 const f=archivedI4Fixture(),inventory=emptyDemoTargetInventory();
 const manifest=planOneWayMigration(f.payload,f.sourceRevision,inventory);
 const read=()=>({snapshot:f.payload,revision:f.sourceRevision,inventory});
 return {manifest,observations:[read(),read()]};
}
test("I6C two stable DEMO reads produce readiness, never atomic proof",()=>{
 const x=example(),p=planSnapshotConsistency(x.manifest,x.observations);
 assert.equal(p.schema,I6C_SNAPSHOT_SCHEMA);
 assert.equal(p.observation_count,2);
 assert.equal(p.stable_in_supplied_observations,true);
 assert.equal(p.atomic_snapshot_proven,false);
 assert.equal(p.source_provenance_verified,false);
 assert.equal(p.target_locked,false);
 assert.equal(p.may_write,false);
 assert.equal(p.may_cutover,false);
});
test("I6C rejects missing or extra observations",()=>{
 const x=example();
 for(const list of [[],[x.observations[0]],[...x.observations,x.observations[0]]])
  assert.throws(()=>planSnapshotConsistency(x.manifest,list),/SNAPSHOT_TWO_READS_REQUIRED/);
});
test("I6C rejects source revision changed in second read",()=>{
 const x=example();x.observations[1]={...x.observations[1],revision:99};
 assert.throws(()=>planSnapshotConsistency(x.manifest,x.observations));
});
test("I6C rejects changed source content even when revision reused",()=>{
 const x=example();
 x.observations[1]={...x.observations[1],
  snapshot:{...x.observations[1].snapshot,
   source_versions:{...x.observations[1].snapshot.source_versions,[A.id]:11}}};
 assert.throws(()=>planSnapshotConsistency(x.manifest,x.observations));
});
test("I6C rejects target rows added between observations",()=>{
 const x=example();x.observations[1]={...x.observations[1],
  inventory:{...x.observations[1].inventory,event_rows:1}};
 assert.throws(()=>planSnapshotConsistency(x.manifest,x.observations));
});
test("I6C rejects forged manifest privilege flag and hash",()=>{
 const x=example();
 assert.throws(()=>planSnapshotConsistency({...x.manifest,official_authorization:true},x.observations));
 assert.throws(()=>planSnapshotConsistency({...x.manifest,manifest_sha256:"0".repeat(64)},x.observations));
});
test("I6C rejects malformed observation and revision",()=>{
 const x=example();
 assert.throws(()=>planSnapshotConsistency(x.manifest,[null,x.observations[1]]),
  /SNAPSHOT_OBSERVATION_INVALID/);
 assert.throws(()=>planSnapshotConsistency(x.manifest,[
  {...x.observations[0],revision:-1},x.observations[1]]),/SNAPSHOT_REVISION_INVALID/);
});
test("I6C does not mutate snapshots, target inventories or manifest",()=>{
 const x=example(),original=JSON.stringify(x);
 planSnapshotConsistency(x.manifest,x.observations);
 assert.equal(JSON.stringify(x),original);
});
