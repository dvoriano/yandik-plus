/**
 * M05-6 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Schema-neutral data dictionary and mapping readiness template.
 * No production table/column names are asserted or inferred.
 */
import {SUPPORTED_YEARS,annualPolicy,requireYear}
 from "../m05-apel-multiyear/policy.mjs";
export const M05_6_MAPPING_SCHEMA="M05-6-DATA-DICTIONARY-MAPPING-UNTESTED-1";
export const M05_6_DOMAINS=Object.freeze([
 "FACILITY_IDENTITY","FACILITY_REGION_HISTORY","SERVICE_LEDGER",
 "SERVICE_EVENT_DETAIL","REPORT_WORKFLOW","POLICY_VERSION",
 "SUPPORT_PLAN","SUPPORT_REALIZATION"
]);
const fail=code=>{throw Error(code)};
const FIELDS=Object.freeze([
 ["facility.canonical_id","FACILITY_IDENTITY","Stable facility identity across sources","string","REQUIRED"],
 ["facility.display_name","FACILITY_IDENTITY","Human-readable facility name","string","CONDITIONAL"],
 ["facility.active_from","FACILITY_IDENTITY","Start of facility validity","date","CONDITIONAL"],
 ["facility.active_to","FACILITY_IDENTITY","End of facility validity, if any","date|null","CONDITIONAL"],
 ["facility.region_id","FACILITY_REGION_HISTORY","Region attribution valid for the reporting period","string","REQUIRED"],
 ["facility.region_valid_from","FACILITY_REGION_HISTORY","Start of region attribution validity","date","REQUIRED"],
 ["facility.region_valid_to","FACILITY_REGION_HISTORY","End of region attribution validity","date|null","CONDITIONAL"],
 ["service.record_id","SERVICE_LEDGER","Stable source record identity","string","REQUIRED"],
 ["service.facility_id","SERVICE_LEDGER","Facility foreign key","string","REQUIRED"],
 ["service.period","SERVICE_LEDGER","Reporting month in YYYY-MM","string","REQUIRED"],
 ["service.revision_id","SERVICE_LEDGER","Revision/version identity","string|null","REQUIRED"],
 ["service.declared_no_activity","SERVICE_LEDGER","Explicitly declared no-activity state","boolean","REQUIRED"],
 ["service.activity_type","SERVICE_EVENT_DETAIL","Service category under the approved dictionary","string","REQUIRED"],
 ["service.quantity","SERVICE_EVENT_DETAIL","Recorded count with a defined unit","integer","REQUIRED"],
 ["service.unit","SERVICE_EVENT_DETAIL","Unit associated with quantity","string","REQUIRED"],
 ["service.event_id","SERVICE_EVENT_DETAIL","Stable event identity for deduplication","string|null","CONDITIONAL"],
 ["service.location_id","SERVICE_EVENT_DETAIL","Location identity for event/location grain","string|null","CONDITIONAL"],
 ["workflow.record_id","REPORT_WORKFLOW","Stable workflow record identity","string","REQUIRED"],
 ["workflow.facility_id","REPORT_WORKFLOW","Facility foreign key","string","REQUIRED"],
 ["workflow.period","REPORT_WORKFLOW","Reporting month in YYYY-MM","string","REQUIRED"],
 ["workflow.status","REPORT_WORKFLOW","Draft/submitted/review/correction state","string","REQUIRED"],
 ["workflow.revision_id","REPORT_WORKFLOW","Revision identity linked to report","string|null","REQUIRED"],
 ["workflow.request_id","REPORT_WORKFLOW","Submission/request event identity","string|null","CONDITIONAL"],
 ["workflow.submitted_at","REPORT_WORKFLOW","Server-recorded submission timestamp with timezone","timestamp|null","CONDITIONAL"],
 ["policy.year","POLICY_VERSION","Policy reporting year","integer","REQUIRED"],
 ["policy.version","POLICY_VERSION","Immutable policy version identifier","string","REQUIRED"],
 ["policy.approval_state","POLICY_VERSION","Approval status and authority reference","string","REQUIRED"],
 ["policy.effective_from","POLICY_VERSION","Policy effective start date","date|null","CONDITIONAL"],
 ["policy.effective_to","POLICY_VERSION","Policy effective end date","date|null","CONDITIONAL"],
 ["support.plan_id","SUPPORT_PLAN","Support plan identity","string","CONDITIONAL"],
 ["support.facility_id","SUPPORT_PLAN","Facility receiving/planned for support","string","CONDITIONAL"],
 ["support.period","SUPPORT_PLAN","Period to which support plan applies","string","CONDITIONAL"],
 ["support.planned_quantity","SUPPORT_PLAN","Approved planned quantity and unit","number|null","CONDITIONAL"],
 ["support.realization_id","SUPPORT_REALIZATION","Evidence identity for realization","string","CONDITIONAL"],
 ["support.realized_quantity","SUPPORT_REALIZATION","Realized quantity with unit and date","number|null","CONDITIONAL"],
 ["support.evidence_ref","SUPPORT_REALIZATION","Auditable reference to realization evidence","string|null","CONDITIONAL"]
].map(([field_key,domain,meaning,semantic_type,necessity])=>Object.freeze({
 field_key,domain,meaning,semantic_type,necessity,
 actual_source:null,actual_table:null,actual_column:null,
 actual_type:null,join_key:null,evidence_ref:null,
 mapping_state:"NOT_MAPPED",verified:false
})));
export const M05_6_REQUIRED_FIELDS=FIELDS;
const exact=(x,ks)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===ks.length&&ks.every(k=>Object.hasOwn(x,k));
export function buildMappingReadiness({years=SUPPORTED_YEARS}={}){
 if(!Array.isArray(years)||!years.length||
  years.some(y=>!SUPPORTED_YEARS.includes(y))||new Set(years).size!==years.length)
  fail("M05_MAPPING_YEARS_INVALID");
 const fields=FIELDS.map(f=>({...f}));
 return {schema:M05_6_MAPPING_SCHEMA,synthetic:true,
  mode:"SCHEMA_NEUTRAL_MAPPING_TEMPLATE",years:[...years].sort(),
  fields,summary:{required:fields.filter(f=>f.necessity==="REQUIRED").length,
   conditional:fields.filter(f=>f.necessity==="CONDITIONAL").length,
   mapped:0,verified:0,unmapped:fields.length},
  domain_coverage:Object.fromEntries(M05_6_DOMAINS.map(d=>[d,
   {field_count:fields.filter(f=>f.domain===d).length,
    actual_schema_verified:false}])),
  actual_schema_provided:false,source_owner_verified:false,
  policy_versions:years.map(year=>({year,
   draft_version:annualPolicy(year).draft_rule_version,
   official_approval_verified:false})),
  relationship_cardinality_verified:false,history_semantics_verified:false,
  timezone_semantics_verified:false,unit_dictionary_verified:false,
  may_connect:false,may_query:false,may_write:false,may_repair:false,
  may_score:false,may_publish:false,official_authorization:false};
}
export function validateCandidateMapping(candidate){
 const ks=["field_key","source_system","table_name","column_name",
  "observed_type","evidence_ref"];
 if(!exact(candidate,ks)||!FIELDS.some(f=>f.field_key===candidate.field_key)||
  ![candidate.source_system,candidate.table_name,candidate.column_name,
    candidate.observed_type,candidate.evidence_ref].every(x=>
     typeof x==="string"&&x.length>0&&x.length<=120&&x.trim()===x)||
  !/^DEMO-[A-Z0-9_-]{1,60}$/.test(candidate.source_system)||
  !/^DEMO-[A-Z0-9_.-]{1,60}$/.test(candidate.table_name)||
  !/^DEMO-[A-Z0-9_.-]{1,60}$/.test(candidate.column_name)||
  !/^DEMO-[A-Z0-9_.-]{1,60}$/.test(candidate.evidence_ref))
  fail("M05_MAPPING_CANDIDATE_INVALID");
 return {...candidate,mapping_state:"CANDIDATE_DEMO_ONLY",
  verified:false,official_source_verified:false};
}
export function buildCandidateMappingReview({candidates=[]}={}){
 if(!Array.isArray(candidates)||candidates.length>FIELDS.length)
  fail("M05_MAPPING_CANDIDATES_INVALID");
 const seen=new Set();
 const accepted=candidates.map(c=>{
  const row=validateCandidateMapping(c);
  if(seen.has(row.field_key))fail("M05_MAPPING_DUPLICATE_FIELD");
  seen.add(row.field_key);return row;
 });
 const fields=FIELDS.map(f=>{
  const candidate=accepted.find(c=>c.field_key===f.field_key);
  return candidate?{...f,candidate}: {...f};
 });
 return {schema:M05_6_MAPPING_SCHEMA,synthetic:true,
  mode:"DEMO_CANDIDATE_REVIEW_ONLY",fields,
  summary:{total:fields.length,candidate_count:accepted.length,
   verified:0,unmapped:fields.length-accepted.length},
  actual_schema_provided:false,source_owner_verified:false,
  candidate_names_are_demo:true,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_score:false,may_publish:false,
  official_authorization:false};
}
