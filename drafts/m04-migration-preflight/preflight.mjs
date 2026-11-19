/**
 * M04-I6A | KODE DITULIS, BELUM DIUJI. CODE_ONLY.
 * One-way I4 -> I5 DEMO manifest (no data copy, connection, SQL or execution).
 * Digests detect changes in this rehearsal only; they do NOT attest provenance.
 */
import {createHash} from "node:crypto";
import {partitionI4Snapshot,PARTITION_SCHEMA} from "../m04-generation-partition/partition.mjs";
export const MIGRATION_SCHEMA = "M04-I6A-ONE-WAY-PREFLIGHT-UNTESTED-1";
export const EMPTY_TARGET_SCHEMA = "M04-I5-PARTITION-REPOSITORY-UNTESTED-1";
const fail = code => {throw Error(code);};
const FIELDS = ["schema","synthetic","facility_ids","current_rows",
 "version_rows","event_rows","command_rows"];
function canonical(value) {
 if(value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
 if(typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
 if(Array.isArray(value)) return "["+value.map(canonical).join(",")+"]";
 if(value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
  const keys = Object.keys(value).sort();
  return "{"+keys.map(k => JSON.stringify(k)+":"+canonical(value[k])).join(",")+"}";
 }
 fail("MIGRATION_UNSUPPORTED_VALUE");
}
function hash(value) {
 return createHash("sha256").update(canonical(value),"utf8").digest("hex");
}
function emptyTarget(target) {
 if(!target || typeof target !== "object" || Array.isArray(target) ||
    Object.keys(target).length !== FIELDS.length ||
    FIELDS.some(k => !Object.hasOwn(target,k)) ||
    target.schema !== EMPTY_TARGET_SCHEMA || target.synthetic !== true ||
    !Array.isArray(target.facility_ids) || target.facility_ids.length !== 0 ||
    ["current_rows","version_rows","event_rows","command_rows"]
      .some(k => target[k] !== 0)) fail("MIGRATION_TARGET_NOT_EMPTY_OR_UNTRUSTED");
 // The caller must obtain the inventory from its own authenticated backend;
 // this pure function cannot verify its origin or lock a database.
}
export function emptyDemoTargetInventory() {
 return {schema:EMPTY_TARGET_SCHEMA,synthetic:true,facility_ids:[],
  current_rows:0,version_rows:0,event_rows:0,command_rows:0};
}
export function planOneWayMigration(i4Snapshot,sourceRevision,targetInventory) {
 if(!Number.isSafeInteger(sourceRevision) || sourceRevision < 0)
  fail("MIGRATION_REVISION_INVALID");
 emptyTarget(targetInventory);
 const partitions = partitionI4Snapshot(i4Snapshot,sourceRevision);
 if(!partitions.length) fail("MIGRATION_NO_FACILITIES");
 const seen = new Set();
 const entries = partitions.map(p => {
  if(p.schema !== PARTITION_SCHEMA || p.synthetic !== true ||
     p.official_authorization !== false ||
     !/^DEMO-PSW-[A-Z0-9_-]{1,24}$/.test(p.facility_id) ||
     seen.has(p.facility_id)) fail("MIGRATION_FACILITY_INVALID");
  seen.add(p.facility_id);
  return {facility_id:p.facility_id,partition_schema:p.schema,
   source_revision:p.source_revision,source_workspace_revision:sourceRevision,
   archived_generations:p.archives.length,retired_identifiers:p.retired_ids.length,
   revision:0,partition_sha256:hash(p)};
 }).sort((a,b)=>a.facility_id.localeCompare(b.facility_id,"en"));
 const base = {schema:MIGRATION_SCHEMA,synthetic:true,
  direction:"I4_TO_I5",mode:"PLAN_ONLY_NO_WRITE",target_empty:true,
  source_workspace_revision:sourceRevision,
  source_sha256:hash({sourceRevision,i4Snapshot}),
  entries,official_authorization:false};
 return {...base,manifest_sha256:hash(base)};
}
export function verifyOneWayMigrationPlan(manifest,i4Snapshot,sourceRevision,targetInventory) {
 const expected=planOneWayMigration(i4Snapshot,sourceRevision,targetInventory);
 if(!manifest || canonical(manifest)!==canonical(expected))
  fail("MIGRATION_MANIFEST_STALE_OR_TAMPERED");
 return {schema:MIGRATION_SCHEMA,synthetic:true,match:true,
  facility_count:expected.entries.length,may_write:false,
  source_verified:false,official_authorization:false};
}
