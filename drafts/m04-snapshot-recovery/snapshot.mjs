/**
 * M04-I6C | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Two independent DEMO observations, not an atomic transaction or a migration.
 * Backend ownership of snapshot and source cannot be proven by this module.
 */
import {verifyOneWayMigrationPlan,MIGRATION_SCHEMA} from "../m04-migration-preflight/preflight.mjs";
export const I6C_SNAPSHOT_SCHEMA="M04-I6C-SNAPSHOT-REHEARSAL-UNTESTED-1";
const fail=code=>{throw Error(code)};
const plain=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
export function planSnapshotConsistency(manifest,observations) {
 if(!plain(manifest)||manifest.schema!==MIGRATION_SCHEMA||
    manifest.synthetic!==true||manifest.official_authorization!==false)
  fail("SNAPSHOT_MANIFEST_INVALID");
 if(!Array.isArray(observations)||observations.length!==2)
  fail("SNAPSHOT_TWO_READS_REQUIRED");
 const fingerprints=[];
 for(const item of observations){
  if(!plain(item)||!Object.hasOwn(item,"snapshot")||
     !Object.hasOwn(item,"revision")||!Object.hasOwn(item,"inventory"))
   fail("SNAPSHOT_OBSERVATION_INVALID");
  if(!Number.isSafeInteger(item.revision)||item.revision<0)
   fail("SNAPSHOT_REVISION_INVALID");
  // Recompute I6A from each observed source AND target inventory. This rejects
  // a changed source or changed target, but cannot prove simultaneous reads.
  const result=verifyOneWayMigrationPlan(manifest,item.snapshot,item.revision,item.inventory);
  if(result.match!==true||result.may_write!==false||result.source_verified!==false)
   fail("SNAPSHOT_RECHECK_INVALID");
  fingerprints.push(manifest.manifest_sha256);
 }
 if(fingerprints.length!==2||fingerprints[0]!==fingerprints[1])
  fail("SNAPSHOT_WINDOW_CHANGED");
 return Object.freeze({
  schema:I6C_SNAPSHOT_SCHEMA,synthetic:true,mode:"DESIGN_ONLY_NO_WRITE",
  manifest_sha256:manifest.manifest_sha256,
  facility_ids:manifest.entries.map(e=>e.facility_id),
  observation_count:2,stable_in_supplied_observations:true,
  // These flags are intentionally non-negotiable.
  atomic_snapshot_proven:false,source_provenance_verified:false,
  target_locked:false,backup_verified:false,restore_verified:false,
  may_write:false,may_cutover:false,official_authorization:false
 });
}
