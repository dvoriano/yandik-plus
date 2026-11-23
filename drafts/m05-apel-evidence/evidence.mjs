/**
 * M05-8 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY
 * Evidence requirement catalog and synthetic candidate register.
 * Metadata only: does NOT store real documents, secrets or claims of authorization.
 */
import {SUPPORTED_YEARS} from "../m05-apel-multiyear/policy.mjs";
import {M05_6_DOMAINS} from "../m05-apel-mapping/mapping.mjs";
import {SOURCE_GROUPS} from "../m05-apel-lineage/lineage.mjs";

export const M05_8_EVIDENCE_SCHEMA="M05-8-EVIDENCE-REGISTER-UNTESTED-1";
export const EVIDENCE_TYPES=Object.freeze([
 "DEMO_OWNER_SCOPE","DEMO_DICTIONARY","DEMO_KEYS_AND_GRAIN",
 "DEMO_SNAPSHOT_PROTOCOL","DEMO_PROVENANCE","DEMO_REGION_HISTORY",
 "DEMO_WORKFLOW_REVISION","DEMO_SERVICE_UNITS","DEMO_POLICY_DOCUMENT",
 "DEMO_SUPPORT_REFERENCE","DEMO_SECURITY_CHECK","DEMO_PARITY_RESULTS",
 "DEMO_STAGING_PERMISSION","DEMO_PUBLICATION_REVIEW"
]);
export const REQUIREMENTS=Object.freeze([
 ["SOURCE_OWNER_SCOPE","Source owner and minimum read-only scope","SOURCE_OWNER","DEMO_OWNER_SCOPE","cross_source"],
 ["DATA_DICTIONARY","Official schema and actual field mapping","SYSTEM_MANAGER","DEMO_DICTIONARY","cross_source"],
 ["KEYS_AND_GRAIN","Primary and foreign keys, revision/event grain","DATA_MANAGER","DEMO_KEYS_AND_GRAIN","cross_source"],
 ["SNAPSHOT_ATOMICITY","Reproducible atomic snapshot and digest verification","SYSTEM_MANAGER","DEMO_SNAPSHOT_PROTOCOL","cross_source"],
 ["SOURCE_PROVENANCE","Authoritative source evidence and record lifecycle","SOURCE_OWNER","DEMO_PROVENANCE","cross_source"],
 ["REGION_HISTORY","Temporal attribution of facility to district","DATA_MANAGER","DEMO_REGION_HISTORY","regions"],
 ["REPORT_REVISIONS","Server-submitted workflow revision and timestamps","APEL_PROCESS_OWNER","DEMO_WORKFLOW_REVISION","workflows"],
 ["SERVICE_UNIT_GRAIN","Service category, unit and event/location definitions","APEL_PROCESS_OWNER","DEMO_SERVICE_UNITS","services"],
 ["YEARLY_POLICY","Independent approved policy and effective dates per year","APEL_PROCESS_OWNER","DEMO_POLICY_DOCUMENT","policies"],
 ["SUPPORT_PLAN_REALIZATION","Distinct support plan, realization and evidence","PROCESS_OWNER","DEMO_SUPPORT_REFERENCE","support_realizations"],
 ["SECURITY_RETENTION","RBAC, privacy, data handling, backup and retention","SYSTEM_MANAGER","DEMO_SECURITY_CHECK","cross_source"],
 ["JUKNIS_PARITY","2026 count parity and approved annual regressions","APEL_PROCESS_OWNER","DEMO_PARITY_RESULTS","services"],
 ["STAGING_TEST_PERMISSION","Specific written authorization to run staging tests","SYSTEM_OWNER","DEMO_STAGING_PERMISSION","cross_source"],
 ["REPORT_PUBLICATION_PERMISSION","Separate authority to use results and publish","APEL_PROCESS_OWNER","DEMO_PUBLICATION_REVIEW","cross_source"]
].map(([requirement_id,description,owner_role,evidence_type,source_family])=>
 Object.freeze({requirement_id,description,owner_role,evidence_type,source_family,
  externally_verified:false,officially_approved:false})));

const DEMO=/^DEMO-[A-Z0-9][A-Z0-9_-]{0,60}$/;
const candidateKeys=["evidence_id","requirement_id","evidence_type",
 "reference_id","source_family","supplied_by","revision","claim_state"];
const fail=code=>{throw Error(code)};
const exact=(v,keys)=>v!==null&&typeof v==="object"&&!Array.isArray(v)&&
 Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
export const isDemoId=v=>typeof v==="string"&&DEMO.test(v);
export function evidenceRequirements(){
 return {schema:M05_8_EVIDENCE_SCHEMA,synthetic:true,
  years:[...SUPPORTED_YEARS],semantic_domains:[...M05_6_DOMAINS],
  source_families:[...SOURCE_GROUPS],requirements:REQUIREMENTS.map(x=>({...x})),
  official_sources_loaded:false,owner_permission_verified:false,
  actual_schema_verified:false,may_connect:false,may_query:false,
  may_write:false,may_repair:false,may_score:false,may_publish:false,
  official_authorization:false};
}
export function makeDemoEvidenceRegister({candidates=[]}={}){
 if(!Array.isArray(candidates)||candidates.length>70)
  fail("M05_8_CANDIDATE_SET_INVALID");
 const ids=new Set();
 const copy=candidates.map(c=>{
  if(!exact(c,candidateKeys)||!isDemoId(c.evidence_id)||
   !isDemoId(c.reference_id)||!isDemoId(c.supplied_by)||
   !Number.isSafeInteger(c.revision)||c.revision<1||c.revision>100||
   c.claim_state!=="DEMO_UNVERIFIED")
   fail("M05_8_EVIDENCE_CANDIDATE_INVALID");
  const req=REQUIREMENTS.find(x=>x.requirement_id===c.requirement_id);
  if(!req||req.evidence_type!==c.evidence_type||
    req.source_family!==c.source_family||
    !EVIDENCE_TYPES.includes(c.evidence_type))
   fail("M05_8_REQUIREMENT_TYPE_MISMATCH");
  if(ids.has(c.evidence_id))fail("M05_8_DUPLICATE_EVIDENCE_ID");
  ids.add(c.evidence_id);
  return {...c,officially_verified:false,document_contents_loaded:false,
   access_granted:false};
 });
 return {schema:M05_8_EVIDENCE_SCHEMA,synthetic:true,
  mode:"DEMO_EVIDENCE_METADATA_ONLY",
  requirements:REQUIREMENTS.map(r=>({...r,
    candidate_count:copy.filter(c=>c.requirement_id===r.requirement_id).length,
    evidence_state:copy.some(c=>c.requirement_id===r.requirement_id)?
     "DEMO_CANDIDATE_NOT_VERIFIED":"NOT_PROVIDED",
    official_verification_state:"NOT_VERIFIED"})),
  candidates:copy,
  counts:{requirements:REQUIREMENTS.length,candidates:copy.length,
   official_verified:0},
  external_documents_loaded:false,actual_source_verified:false,
  source_owner_verified:false,official_authorization:false,
  may_connect:false,may_query:false,may_write:false,may_repair:false,
  may_score:false,may_publish:false};
}
