/**
 * M04-I6B | KODE DITULIS, BELUM DIUJI. Read-only SQL surface on DEMO I5.
 * The host MUST supply a server-managed, consistent, read-only DB snapshot.
 * No connection lifecycle, SQL writes, PRAGMA changes or real backend here.
 */
import {EMPTY_TARGET_SCHEMA} from "../m04-migration-preflight/preflight.mjs";
import {PARTITION_SCHEMA} from "../m04-generation-partition/partition.mjs";
import {backendPrincipal,requireGlobalInventory,requireFacilityRead,
 facilitySelector} from "./identity.mjs";

export const I6B_READ_SCHEMA="M04-I6B-READONLY-INVENTORY-UNTESTED-1";
const fail=code=>{throw Error(code);};
const COUNTS=Object.freeze({
 current_rows:"SELECT COUNT(*) AS n FROM facility_current",
 version_rows:"SELECT COUNT(*) AS n FROM facility_versions",
 event_rows:"SELECT COUNT(*) AS n FROM facility_events",
 command_rows:"SELECT COUNT(*) AS n FROM facility_commands"
});
const IDS="SELECT facility_id FROM facility_current ORDER BY facility_id";
const ONE="SELECT revision,payload FROM facility_current WHERE facility_id=?";
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
function natural(n) {
 if(!Number.isSafeInteger(n)||n<0)fail("INVENTORY_COUNT_INVALID");
 return n;
}
function statement(reader,sql) {
 if(!reader||typeof reader.prepare!=="function")fail("READ_SNAPSHOT_REQUIRED");
 const stmt=reader.prepare(sql);
 if(!stmt||typeof stmt.get!=="function"||typeof stmt.all!=="function")
  fail("READ_STATEMENT_INVALID");
 return stmt;
}
function withSnapshot(withConsistentRead,fn) {
 if(typeof withConsistentRead!=="function")fail("TRUSTED_SNAPSHOT_PROVIDER_REQUIRED");
 // The callback MUST run inside a consistent RO server transaction.
 const out=withConsistentRead(fn);
 if(!out||typeof out.then==="function")fail("SNAPSHOT_MUST_BE_SYNCHRONOUS");
 return out;
}
function readTarget(reader) {
 const counts=Object.fromEntries(Object.entries(COUNTS).map(([key,sql])=>{
  const row=statement(reader,sql).get();
  return [key,natural(row?.n)];
 }));
 const rows=statement(reader,IDS).all();
 if(!Array.isArray(rows)||rows.length!==counts.current_rows)fail("INVENTORY_ROW_MISMATCH");
 const ids=rows.map(row=>row?.facility_id);
 if(ids.some(id=>typeof id!=="string"||!FAC.test(id))||
    new Set(ids).size!==ids.length)fail("INVENTORY_FACILITY_IDS_INVALID");
 return {schema:EMPTY_TARGET_SCHEMA,synthetic:true,facility_ids:ids,...counts};
}
function readOne(reader,selector) {
 const row=statement(reader,ONE).get(selector);
 if(!row)fail("FACILITY_NOT_FOUND_OR_DENIED");
 natural(row.revision);
 let payload;
 try {payload=JSON.parse(row.payload);}
 catch {fail("FACILITY_PAYLOAD_INVALID");}
 const m=payload?.workspace?.master;
 if(payload?.synthetic!==true||payload?.schema!==PARTITION_SCHEMA||
    payload?.facility_id!==selector||payload?.official_authorization!==false||
    !Array.isArray(m)||m.length!==1||m[0]?.id!==selector)
  fail("FACILITY_PAYLOAD_INVALID");
 return {revision:row.revision,master:m[0]};
}
export function openI6BReadonlyGateway({resolveServerSession,withConsistentRead}={}) {
 if(typeof resolveServerSession!=="function"||
    typeof withConsistentRead!=="function")fail("TRUSTED_ADAPTERS_REQUIRED");
 function globalTargetInventory() {
  const actor=backendPrincipal(resolveServerSession);
  requireGlobalInventory(actor); // Deny BEFORE opening any DB snapshot.
  const inventory=withSnapshot(withConsistentRead,readTarget);
  return {schema:I6B_READ_SCHEMA,synthetic:true,mode:"READ_ONLY",
   inventory,actor_role:actor.role,may_write:false,
   source_verified:false,target_frozen:false,official_authorization:false};
 }
 function scopedFacilitySummary(facilityId) {
  const actor=backendPrincipal(resolveServerSession);
  if(actor.role==="pimpinan")fail("ACCESS_DENIED");
  const id=facilitySelector(facilityId);
  const snapshot=withSnapshot(withConsistentRead,reader=>{
   const data=readOne(reader,id);
   requireFacilityRead(actor,data.master);
   return {revision:data.revision,facility_id:id};
  });
  return {schema:I6B_READ_SCHEMA,synthetic:true,mode:"READ_ONLY",
   ...snapshot,may_write:false,official_authorization:false};
 }
 return Object.freeze({globalTargetInventory,scopedFacilitySummary});
}
