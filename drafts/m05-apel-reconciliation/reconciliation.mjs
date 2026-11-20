/**
 * M05-5 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Pure DEMO contract for source inventory and cross-source reconciliation.
 * No connector, SQL, filesystem, network, mutation, or official attestation.
 */
import {SUPPORTED_YEARS,annualPolicy,requireYear}
 from "../m05-apel-multiyear/policy.mjs";
export const M05_5_RECONCILIATION_SCHEMA="M05-5-SOURCE-RECONCILIATION-UNTESTED-1";
export const M05_5_SOURCE_KEYS=Object.freeze([
 "facility_registry","service_ledger","workflow_submissions","annual_policy"
]);
const fail=code=>{throw Error(code)};
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const SNAP=/^DEMO-SNAP-[A-Z0-9_-]{1,32}$/;
const DIGEST=/^[a-f0-9]{64}$/;
const DATE=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|\+00:00)$/;
const arr=x=>Array.isArray(x);
const obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const keys=(v,expected)=>obj(v)&&Object.keys(v).length===expected.length&&
 expected.every(k=>Object.hasOwn(v,k));
const sorted=x=>[...x].sort();
const unique=x=>new Set(x).size===x.length;
const periodKey=(facility,period)=>facility+"|"+period;
function validateEnvelope(key,s){
 if(!keys(s,["schema","synthetic","snapshot_id","captured_at",
  "content_digest","records","authority_state","digest_verified",
  "source_owner_verified","read_only"] )||
  s.schema!=="M05-5-SOURCE-ENVELOPE-UNTESTED-1"||
  s.synthetic!==true||!SNAP.test(s.snapshot_id)||
  typeof s.captured_at!=="string"||!DATE.test(s.captured_at)||
  !DIGEST.test(s.content_digest)||!arr(s.records)||
  s.authority_state!=="DEMO_UNVERIFIED"||s.digest_verified!==false||
  s.source_owner_verified!==false||s.read_only!==true)
  fail("M05_SOURCE_ENVELOPE_INVALID:"+key);
 return s;
}
function validateRecords(key,records){
 if(key==="facility_registry"){
  const ids=records.map(r=>{
   if(!keys(r,["facility_id","region_id","active_demo"])||
    !FAC.test(r.facility_id)||typeof r.region_id!=="string"||
    r.region_id.length>40||r.active_demo!==true)
    fail("M05_REGISTRY_RECORD_INVALID");
   return r.facility_id;
  });
  if(!unique(ids))fail("M05_REGISTRY_DUPLICATE");
  return ids;
 }
 if(key==="annual_policy"){
  const years=records.map(r=>{
   if(!keys(r,["year","policy_draft_version","policy_state"])||
    !SUPPORTED_YEARS.includes(r.year)||
    r.policy_draft_version!==annualPolicy(r.year).draft_rule_version||
    r.policy_state!==annualPolicy(r.year).policy_state)
    fail("M05_POLICY_RECORD_INVALID");
   return r.year;
  });
  if(!unique(years))fail("M05_POLICY_DUPLICATE");
  return years;
 }
 const ids=records.map(r=>{
  if(!keys(r,["facility_id","period","policy_draft_version"])||
   !FAC.test(r.facility_id)||typeof r.period!=="string"||
   !/^(202[6-9]|2030)-(0[1-9]|1[0-2])$/.test(r.period))
   fail("M05_PERIOD_RECORD_INVALID:"+key);
  const year=Number(r.period.slice(0,4));requireYear(year);
  if(r.policy_draft_version!==annualPolicy(year).draft_rule_version)
   fail("M05_PERIOD_POLICY_MISMATCH:"+key);
  return periodKey(r.facility_id,r.period);
 });
 if(!unique(ids))fail("M05_SOURCE_DUPLICATE_PERIOD:"+key);
 return ids;
}
export function buildSourceReconciliation({sources,years=SUPPORTED_YEARS}={}){
 if(!obj(sources)||Object.keys(sources).length!==M05_5_SOURCE_KEYS.length||
  M05_5_SOURCE_KEYS.some(k=>!Object.hasOwn(sources,k)))
  fail("M05_SOURCE_SET_INVALID");
 if(!arr(years)||!years.length||years.some(y=>!SUPPORTED_YEARS.includes(y))||
  !unique(years))fail("M05_RECONCILIATION_YEARS_INVALID");
 const envelopes={},indexes={};
 for(const key of M05_5_SOURCE_KEYS){
  envelopes[key]=validateEnvelope(key,sources[key]);
  indexes[key]=validateRecords(key,envelopes[key].records);
 }
 const registry=new Set(indexes.facility_registry);
 const policies=new Set(indexes.annual_policy);
 const yearSet=new Set(years);
 const ledger=indexes.service_ledger.filter(k=>yearSet.has(Number(k.slice(k.lastIndexOf("-")+1,k.lastIndexOf("-")+5))));
 // Derive period year robustly from YYYY-MM suffix.
 const filterPeriods=xs=>xs.filter(k=>{
  const p=k.slice(k.lastIndexOf("|")+1);return yearSet.has(Number(p.slice(0,4)));
 });
 const ledgerKeys=filterPeriods(indexes.service_ledger);
 const workflowKeys=filterPeriods(indexes.workflow_submissions);
 const ledgerSet=new Set(ledgerKeys),workflowSet=new Set(workflowKeys);
 const missingWorkflow=sorted(ledgerKeys.filter(k=>!workflowSet.has(k)));
 const missingLedger=sorted(workflowKeys.filter(k=>!ledgerSet.has(k)));
 const registryOrphans=sorted([...new Set([...ledgerKeys,...workflowKeys])]
  .filter(k=>!registry.has(k.slice(0,k.indexOf("|")))));
 const policyYears=SUPPORTED_YEARS.filter(y=>yearSet.has(y)&&policies.has(y));
 const missingPolicyYears=sorted([...yearSet].filter(y=>!policies.has(y)));
 const sourceSnapshots=Object.fromEntries(M05_5_SOURCE_KEYS.map(k=>[k,{
  snapshot_id:envelopes[k].snapshot_id,captured_at:envelopes[k].captured_at,
  record_count:envelopes[k].records.length,
  digest_verified:false,source_owner_verified:false
 }]));
 const discrepancies={
  service_without_workflow:missingWorkflow,
  workflow_without_service:missingLedger,
  records_without_registry_facility:registryOrphans,
  missing_policy_years:missingPolicyYears
 };
 const clean=Object.values(discrepancies).every(a=>a.length===0);
 return {schema:M05_5_RECONCILIATION_SCHEMA,synthetic:true,
  mode:"DEMO_READ_ONLY_RECONCILIATION_PLAN",years:sorted([...yearSet]),
  source_snapshots:sourceSnapshots,
  counts:{registry_facilities:registry.size,
   service_periods:ledgerKeys.length,workflow_periods:workflowKeys.length,
   policy_years:policyYears.length},
  discrepancies,structural_match:clean,
  evidence_state:"DEMO_ONLY_NOT_INDEPENDENTLY_VERIFIED",
  digest_verification_performed:false,source_authority_verified:false,
  snapshot_atomicity_verified:false,temporal_consistency_verified:false,
  official_compliance_verified:false,official_scoring:false,
  may_write:false,may_repair:false,may_delete:false,may_rank:false,
  may_award:false,may_publish:false,official_authorization:false};
}
