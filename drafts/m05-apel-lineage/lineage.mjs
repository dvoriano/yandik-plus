/**
 * M05-7 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Pure lineage/candidate-join review. No DB, query, side effects, or repair.
 * Real table schemas, official rules, source provenance and authorization are UNKNOWN.
 */
import {SUPPORTED_YEARS,annualPolicy} from "../m05-apel-multiyear/policy.mjs";
import {M05_6_REQUIRED_FIELDS} from "../m05-apel-mapping/mapping.mjs";

export const M05_7_SCHEMA="M05-7-LINEAGE-TEMPORAL-UNTESTED-1";
export const SOURCE_GROUPS=Object.freeze([
 "facilities","regions","services","workflows","policies",
 "support_plans","support_realizations"
]);
export const RELATIONS=Object.freeze([
 {from:"services.facility_id",to:"facilities.facility_id",cardinality:"N:1",temporal:false},
 {from:"regions.facility_id",to:"facilities.facility_id",cardinality:"N:1",temporal:true},
 {from:"services.facility_id+period",to:"regions.facility_id+validity",cardinality:"N:1_AS_OF_FULL_MONTH",temporal:true},
 {from:"services.facility_id+period+revision_id",to:"workflows.facility_id+period+revision_id",cardinality:"N:1_CANDIDATE",temporal:false},
 {from:"services.policy_version+period",to:"policies.version+validity",cardinality:"N:1_AS_OF_FULL_MONTH",temporal:true},
 {from:"support_plans.facility_id",to:"facilities.facility_id",cardinality:"N:1",temporal:false},
 {from:"support_realizations.plan_id",to:"support_plans.plan_id",cardinality:"N:1",temporal:false}
]);
const DEMO=/^DEMO-[A-Z0-9][A-Z0-9_-]{0,50}$/;
const PERIOD=/^(202[6-9]|2030)-(0[1-9]|1[0-2])$/;
const TS=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;
const STATES=["OBSERVED","UNKNOWN","NOT_REPORTED","NOT_APPLICABLE"];
const COLUMNS={
 facilities:["facility_id"],
 regions:["mapping_id","facility_id","region_id","valid_from","valid_to"],
 services:["record_id","facility_id","period","revision_id","policy_version",
  "activity_type","event_id","location_id","quantity_state","quantity","unit",
  "declared_no_activity"],
 workflows:["record_id","facility_id","period","revision_id","status",
  "request_id","submitted_at"],
 policies:["policy_id","year","version","effective_from","effective_to",
  "approval_state"],
 support_plans:["plan_id","facility_id","period","unit","quantity_state",
  "planned_quantity"],
 support_realizations:["realization_id","plan_id","unit","quantity_state",
  "realized_quantity","evidence_ref"]
};
const ID_COLUMNS={
 facilities:"facility_id",regions:"mapping_id",services:"record_id",
 workflows:"record_id",policies:"policy_id",support_plans:"plan_id",
 support_realizations:"realization_id"
};
const fail=code=>{throw new Error(code)};
const obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const exact=(r,ks)=>obj(r)&&Object.keys(r).length===ks.length&&
 ks.every(k=>Object.hasOwn(r,k));
const id=x=>typeof x==="string"&&DEMO.test(x);
const validDate=x=>{
 if(typeof x!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;
 const d=new Date(x+"T00:00:00Z");
 return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===x;
};
const bounds=period=>{
 const [year,month]=period.split("-").map(Number);
 const next=month===12?(year+1)+"-01-01":year+"-"+String(month+1).padStart(2,"0")+"-01";
 return {start:period+"-01",end:next};
};
const inWindow=(r,start,end)=>r.valid_from<=start&&
 (r.valid_to===null||r.valid_to>=end);
const touches=(r,start,end)=>r.valid_from<end&&
 (r.valid_to===null||r.valid_to>start);
function stateOk(state,quantity){
 return STATES.includes(state)&&
  (state==="OBSERVED"?Number.isSafeInteger(quantity)&&quantity>=0:quantity===null);
}
export function classifyQuantity({state,quantity}={}){
 if(!stateOk(state,quantity))fail("M05_7_VALUE_STATE_INVALID");
 return state==="OBSERVED"?(quantity===0?"OBSERVED_ZERO":"OBSERVED_NONZERO"):state;
}
function validateGroup(group,rows){
 if(!Array.isArray(rows)||rows.length>500)fail("M05_7_GROUP_INVALID:"+group);
 for(const r of rows){
  if(!exact(r,COLUMNS[group]))fail("M05_7_ROW_SHAPE:"+group);
  for(const k of COLUMNS[group]){
   if(k.endsWith("_id")&&k!=="event_id"&&k!=="location_id"&&
    k!=="request_id"&&k!=="revision_id"&&k!=="region_id"&&
    !id(r[k]))fail("M05_7_NON_DEMO_ID:"+group);
  }
  if(group==="facilities")continue;
  if(group==="regions"){
   if(!id(r.facility_id)||!id(r.region_id)||!validDate(r.valid_from)||
    !(r.valid_to===null||validDate(r.valid_to))||
    (r.valid_to!==null&&r.valid_to<=r.valid_from))
    fail("M05_7_REGION_INVALID");
  }
  if(group==="services"){
   if(!id(r.facility_id)||!PERIOD.test(r.period)||!id(r.revision_id)||
    !id(r.policy_version)||!id(r.activity_type)||
    !(r.event_id===null||id(r.event_id))||
    !(r.location_id===null||id(r.location_id))||
    !id(r.unit)||!stateOk(r.quantity_state,r.quantity)||
    typeof r.declared_no_activity!=="boolean")
    fail("M05_7_SERVICE_INVALID");
  }
  if(group==="workflows"){
   if(!id(r.facility_id)||!PERIOD.test(r.period)||!id(r.revision_id)||
    !["DEMO_DRAFT","DEMO_SUBMITTED","DEMO_CORRECTION"].includes(r.status)||
    !(r.request_id===null||id(r.request_id))||
    !(r.submitted_at===null||(typeof r.submitted_at==="string"&&TS.test(r.submitted_at))))
    fail("M05_7_WORKFLOW_INVALID");
  }
  if(group==="policies"){
   if(!SUPPORTED_YEARS.includes(r.year)||
    !new RegExp("^DEMO-APEL-"+r.year+"-[A-Z0-9_-]+$").test(r.version)||
    !validDate(r.effective_from)||
    !(r.effective_to===null||validDate(r.effective_to))||
    (r.effective_to!==null&&r.effective_to<=r.effective_from)||
    r.approval_state!=="DEMO_UNVERIFIED")
    fail("M05_7_POLICY_INVALID");
  }
  if(group==="support_plans"){
   if(!id(r.facility_id)||!PERIOD.test(r.period)||!id(r.unit)||
    !stateOk(r.quantity_state,r.planned_quantity))
    fail("M05_7_PLAN_INVALID");
  }
  if(group==="support_realizations"){
   if(!id(r.plan_id)||!id(r.unit)||
    !stateOk(r.quantity_state,r.realized_quantity)||
    !(r.evidence_ref===null||id(r.evidence_ref)))
    fail("M05_7_REALIZATION_INVALID");
  }
 }
}
function manualIssue(out,code,source_ref,related=[]){
 out.push({code,source_ref,related:[...related].sort(),
  resolution:"HUMAN_REVIEW_REQUIRED",auto_resolved:false});
}
export function buildLineageContract(){
 const needed=["facility.canonical_id","facility.region_valid_from",
  "facility.region_valid_to","service.revision_id","workflow.revision_id",
  "policy.version","support.plan_id","support.realization_id"];
 const dictionaryKeys=new Set(M05_6_REQUIRED_FIELDS.map(f=>f.field_key));
 return {schema:M05_7_SCHEMA,synthetic:true,years:[...SUPPORTED_YEARS],
  model:"SCHEMA_NEUTRAL_DEMO_CANDIDATE_LINEAGE",relations:RELATIONS.map(r=>({...r})),
  business_fields:needed.map(field_key=>({field_key,
   catalogued:dictionaryKeys.has(field_key),actual_mapping_verified:false})),
  region_valid_to:"EXCLUSIVE_DATE_BOUNDARY",month_attribution:"FULL_MONTH_ONLY",
  revisions:"EXACT_MATCH_NO_LATEST_WINS",identity:"STABLE_ID_ONLY_NO_NAME_JOIN",
  source_grain_verified:false,mapping_verified:false,
  source_owner_verified:false,official_authorization:false,
  may_connect:false,may_query:false,may_write:false,may_repair:false,
  may_score:false,may_publish:false};
}
export function inspectDemoLineage({sources}={}){
 if(!exact(sources,SOURCE_GROUPS)||sources.synthetic!==undefined)
  fail("M05_7_SOURCE_SET_INVALID");
 for(const group of SOURCE_GROUPS)validateGroup(group,sources[group]);
 const issues=[];
 for(const group of SOURCE_GROUPS){
  const seen=new Set(),col=ID_COLUMNS[group];
  for(const r of sources[group]){
   const value=r[col];
   if(seen.has(value))manualIssue(issues,"DUPLICATE_SOURCE_ID",
    group+":"+value,[group]);
   seen.add(value);
  }
 }
 const facilityCount=new Map();
 for(const f of sources.facilities)
  facilityCount.set(f.facility_id,(facilityCount.get(f.facility_id)||0)+1);
 const ensureFacility=(facilityId,ref)=>{
  const count=facilityCount.get(facilityId)||0;
  if(count!==1)manualIssue(issues,count===0?"MISSING_FACILITY":"AMBIGUOUS_FACILITY",ref,[facilityId]);
  return count===1;
 };
 for(const r of sources.regions)ensureFacility(r.facility_id,"regions:"+r.mapping_id);
 for(const r of sources.workflows)ensureFacility(r.facility_id,"workflows:"+r.record_id);
 for(const r of sources.support_plans)ensureFacility(r.facility_id,"support_plans:"+r.plan_id);
 const servicePeriods=new Map(),seenEvents=new Set();
 const chains=sources.services.map(s=>{
  const ref="services:"+s.record_id;
  const stableFacility=ensureFacility(s.facility_id,ref);
  const key=s.facility_id+"|"+s.period+"|"+s.revision_id;
  servicePeriods.set(key,(servicePeriods.get(key)||0)+1);
  if(s.event_id!==null){
   const eventKey=key+"|"+s.activity_type+"|"+s.event_id+"|"+(s.location_id||"NO_LOCATION");
   if(seenEvents.has(eventKey))manualIssue(issues,"DUPLICATE_EVENT_GRAIN",ref,[eventKey]);
   seenEvents.add(eventKey);
  }
  if(s.declared_no_activity&&
   !(s.quantity_state==="OBSERVED"&&s.quantity===0))
   manualIssue(issues,"NO_ACTIVITY_NOT_EXPLICIT_ZERO",ref);
  const {start,end}=bounds(s.period);
  const regionTouch=sources.regions.filter(r=>r.facility_id===s.facility_id&&
   touches(r,start,end));
  let region=null;
  if(regionTouch.length===1&&inWindow(regionTouch[0],start,end))
   region=regionTouch[0].mapping_id;
  else manualIssue(issues,regionTouch.length>1?"REGION_SPLIT_OR_OVERLAP":
   regionTouch.length===1?"REGION_PARTIAL_MONTH":"REGION_NOT_COVERED",ref,
   regionTouch.map(r=>r.mapping_id));
  const flow=sources.workflows.filter(w=>w.facility_id===s.facility_id&&
   w.period===s.period&&w.revision_id===s.revision_id);
  const anyFlow=sources.workflows.some(w=>w.facility_id===s.facility_id&&
   w.period===s.period);
  let workflow=null;
  if(flow.length===1)workflow=flow[0].record_id;
  else manualIssue(issues,flow.length>1?"WORKFLOW_CARDINALITY":
   anyFlow?"WORKFLOW_REVISION_MISMATCH":"WORKFLOW_MISSING",ref,
   flow.map(w=>w.record_id));
  const allPolicies=sources.policies.filter(p=>p.year===Number(s.period.slice(0,4))&&
   p.version===s.policy_version&&touches({
    valid_from:p.effective_from,valid_to:p.effective_to},start,end));
  let policy=null;
  if(allPolicies.length===1&&inWindow({
   valid_from:allPolicies[0].effective_from,valid_to:allPolicies[0].effective_to
  },start,end))policy=allPolicies[0].policy_id;
  else manualIssue(issues,allPolicies.length>1?"POLICY_CARDINALITY":
   allPolicies.length===1?"POLICY_PARTIAL_MONTH":"POLICY_MISSING_OR_VERSION",ref,
   allPolicies.map(p=>p.policy_id));
  return {source_ref:ref,facility_id:s.facility_id,period:s.period,
   revision_id:s.revision_id,quantity_state:classifyQuantity({
    state:s.quantity_state,quantity:s.quantity}),
   candidate_refs:{facility:stableFacility?s.facility_id:null,
    region_mapping:region,workflow_record:workflow,policy_record:policy},
   lineage_state:"DEMO_CANDIDATE_UNVERIFIED",verified:false,usable_for_reporting:false};
 });
 for(const [k,n] of servicePeriods)
  if(n>1)manualIssue(issues,"MULTIPLE_SERVICE_ROWS_PER_REVISION",
   "services:"+k,["SOURCE_GRAIN_REVIEW_REQUIRED"]);
 const support_lineage=sources.support_realizations.map(r=>{
  const ref="support_realizations:"+r.realization_id;
  const plans=sources.support_plans.filter(p=>p.plan_id===r.plan_id);
  let plan=null;
  if(plans.length===1){
   plan=plans[0].plan_id;
   if(r.unit!==plans[0].unit)manualIssue(issues,"SUPPORT_UNIT_CONFLICT",ref,[plan]);
   if(r.evidence_ref===null)manualIssue(issues,"SUPPORT_EVIDENCE_MISSING",ref,[plan]);
  }else manualIssue(issues,plans.length?"SUPPORT_PLAN_CARDINALITY":
   "SUPPORT_PLAN_MISSING",ref,plans.map(p=>p.plan_id));
  return {source_ref:ref,plan_ref:plan,quantity_state:classifyQuantity({
   state:r.quantity_state,quantity:r.realized_quantity}),
   evidence_ref:r.evidence_ref,verified:false,usable_for_reporting:false};
 });
 const plan_lineage=sources.support_plans.map(p=>({
  source_ref:"support_plans:"+p.plan_id,facility_id:p.facility_id,
  period:p.period,quantity_state:classifyQuantity({
   state:p.quantity_state,quantity:p.planned_quantity}),
  verified:false,usable_for_reporting:false
 }));
 return {schema:M05_7_SCHEMA,synthetic:true,mode:"DEMO_LINEAGE_REVIEW_ONLY",
  years:[...SUPPORTED_YEARS],candidate_chains:chains,
  support_plan_candidates:plan_lineage,support_realization_candidates:support_lineage,
  issues:issues.sort((a,b)=>(a.source_ref+"|"+a.code).localeCompare(b.source_ref+"|"+b.code)),
  counts:{services:sources.services.length,workflow_rows:sources.workflows.length,
   issues:issues.length,plan_rows:sources.support_plans.length,
   realization_rows:sources.support_realizations.length},
  all_candidate_links_are_unverified:true,
  structural_review_only:true,snapshot_consistency_verified:false,
  source_grain_verified:false,temporal_semantics_verified:false,
  mapping_verified:false,source_owner_verified:false,official_authorization:false,
  may_connect:false,may_query:false,may_write:false,may_repair:false,
  may_score:false,may_publish:false};
}
