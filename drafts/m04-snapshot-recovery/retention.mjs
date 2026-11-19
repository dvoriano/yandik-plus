/**
 * M04-I6C | KODE DITULIS, BELUM DIUJI.
 * Proposed retention register only: no deletion, timers, export, or storage.
 * Retention periods and legal holds require a policy owner.
 */
import {I6C_SNAPSHOT_SCHEMA} from "./snapshot.mjs";
export const I6C_RETENTION_SCHEMA="M04-I6C-RETENTION-REVIEW-UNTESTED-1";
const fail=code=>{throw Error(code)};
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const CLASSES=Object.freeze([
 "versions","events","commands","i4_archives","retired_identifiers"
]);
export function planRetentionRegister(readiness,holdFacilities=[]) {
 if(!readiness||readiness.schema!==I6C_SNAPSHOT_SCHEMA||
    readiness.synthetic!==true||readiness.official_authorization!==false||
    readiness.may_write!==false||!Array.isArray(readiness.facility_ids)||
    readiness.facility_ids.length===0)fail("RETENTION_READINESS_INVALID");
 if(!Array.isArray(holdFacilities)||holdFacilities.some(id=>
    typeof id!=="string"||!FAC.test(id))||
    new Set(holdFacilities).size!==holdFacilities.length)
  fail("RETENTION_HOLD_LIST_INVALID");
 const ids=readiness.facility_ids;
 if(ids.some(id=>typeof id!=="string"||!FAC.test(id))||
    new Set(ids).size!==ids.length||
    holdFacilities.some(id=>!ids.includes(id)))
  fail("RETENTION_FACILITY_SCOPE_INVALID");
 const hold=new Set(holdFacilities);
 const rows=[
  {id:"DEMO-I6C-GLOBAL-SOURCE",facility_id:null,kind:"source_snapshot",
   legal_hold:"BELUM_DIPERIKSA"},
  {id:"DEMO-I6C-GLOBAL-MANIFEST",facility_id:null,kind:"migration_manifest",
   legal_hold:"BELUM_DIPERIKSA"},
  {id:"DEMO-I6C-GLOBAL-BACKUP",facility_id:null,kind:"backup_plan_only",
   legal_hold:"BELUM_DIPERIKSA"},
  ...ids.flatMap(id=>CLASSES.map(kind=>({
   id:"DEMO-I6C-"+id+"-"+kind,facility_id:id,kind,
   legal_hold:hold.has(id)?"DEMO_HOLD_DICATAT":"BELUM_DIPERIKSA"
  })))
 ].map(r=>({...r,retention_period:"BELUM_DITETAPKAN",
   review_state:"MEMERLUKAN_KEPUTUSAN_PENGELOLA_DATA",
   can_delete:false,can_export:false,can_purge:false}));
 return {schema:I6C_RETENTION_SCHEMA,synthetic:true,
  mode:"DRAFT_REGISTER_ONLY",records:rows,policy_approved:false,
  backup_exists_verified:false,legal_hold_verified:false,
  can_delete:false,can_export:false,can_purge:false,
  official_authorization:false};
}
