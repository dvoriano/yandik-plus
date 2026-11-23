/**
 * M05-9 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Pure draft register from M05-8 BLOCKED readiness packet.
 * A task is a proposed manual follow-up, NOT a decision or source correction.
 */
import {SUPPORTED_YEARS} from "../m05-apel-multiyear/policy.mjs";
import {REQUIREMENTS,isDemoId} from "../m05-apel-evidence/evidence.mjs";
import {GATE_CATALOG,M05_8_GATE_SCHEMA} from "../m05-apel-evidence/gates.mjs";

export const M05_9_SCHEMA="M05-9-MANUAL-RECONCILIATION-UNTESTED-1";
export const M05_9_TASK_KINDS=Object.freeze(["REQUIREMENT","LINEAGE_ISSUE"]);
export const M05_9_ACTIONS=Object.freeze([
 "REQUEST_MISSING_EVIDENCE","REQUEST_SOURCE_CLARIFICATION",
 "REQUEST_MANUAL_RECONCILIATION","ESCALATE_FOR_SCOPE_REVIEW",
 "DEFER_PENDING_AUTHORIZATION"
]);
export const M05_9_REASONS=Object.freeze([
 "DEMO_EVIDENCE_ABSENT","DEMO_UNVERIFIED_SOURCE",
 "DEMO_AMBIGUOUS_IDENTITY","DEMO_TEMPORAL_CONFLICT",
 "DEMO_REVISION_MISMATCH","DEMO_UNRESOLVED_GRAIN",
 "DEMO_MISSING_APPROVAL","DEMO_REVIEW_PENDING"
]);
const fail=code=>{throw Error(code)};
const matches=(a,b)=>Array.isArray(a)&&a.length===b.length&&
 a.every((x,i)=>x===b[i]);
const requiredIds=REQUIREMENTS.map(x=>x.requirement_id);
const gatesIds=GATE_CATALOG.map(x=>x.gate_id);
const falseActions=[
 "may_connect","may_query","may_write","may_repair","may_score",
 "may_rank","may_award","may_publish","official_authorization",
 "may_run_tests","may_merge","may_deploy",
 "source_owner_verified","schema_mapping_verified",
 "source_snapshot_verified","methodology_parity_verified",
 "staging_testing_authorized","production_authorized",
 "publishing_authorized"
];
export const noAuthority=x=>falseActions.every(k=>x?.[k]===false);
const sourceRefOk=x=>typeof x==="string"&&
 /^[a-z_]+:DEMO-[A-Z0-9_|:-]{1,160}$/.test(x);
const ISSUE_GROUPS=Object.freeze([
 {starts:"REGION_",requirements:["REGION_HISTORY"],role:"DATA_MANAGER"},
 {starts:"WORKFLOW_",requirements:["REPORT_REVISIONS"],role:"APEL_PROCESS_OWNER"},
 {starts:"POLICY_",requirements:["YEARLY_POLICY"],role:"APEL_PROCESS_OWNER"},
 {starts:"SUPPORT_",requirements:["SUPPORT_PLAN_REALIZATION"],role:"PROCESS_OWNER"},
 {starts:"NO_ACTIVITY_",requirements:["SERVICE_UNIT_GRAIN"],role:"APEL_PROCESS_OWNER"},
 {starts:"DUPLICATE_EVENT_",requirements:["SERVICE_UNIT_GRAIN","KEYS_AND_GRAIN"],role:"APEL_PROCESS_OWNER"},
 {starts:"MISSING_FACILITY",requirements:["KEYS_AND_GRAIN","SOURCE_PROVENANCE"],role:"DATA_MANAGER"},
 {starts:"AMBIGUOUS_FACILITY",requirements:["KEYS_AND_GRAIN","SOURCE_PROVENANCE"],role:"DATA_MANAGER"},
 {starts:"DUPLICATE_SOURCE_",requirements:["KEYS_AND_GRAIN"],role:"DATA_MANAGER"}
]);
function suggestReview(code){
 const group=ISSUE_GROUPS.find(x=>code.startsWith(x.starts));
 return group?{requirement_ids:[...group.requirements],owner_role:group.role}:
  {requirement_ids:["SOURCE_PROVENANCE","KEYS_AND_GRAIN"],owner_role:"DATA_MANAGER"};
}
export function verifyBlockedDemoPacket(packet){
 if(packet?.schema!==M05_8_GATE_SCHEMA||packet?.synthetic!==true||
  packet?.mode!=="UNTESTED_EVIDENCE_REVIEW_PACKET"||
  packet?.readiness!=="BLOCKED_NO_OFFICIAL_EVIDENCE_OR_AUTHORIZATION"||
  !noAuthority(packet)||!Array.isArray(packet.requirements)||
  !matches(packet.requirements.map(x=>x.requirement_id),requiredIds)||
  packet.requirements.some((x,i)=>x.verified!==false||
   x.blocking!==true||x.official_attestation!=="NOT_PROVIDED"||
   x.owner_role!==REQUIREMENTS[i].owner_role||
   !Number.isSafeInteger(x.candidate_count)||x.candidate_count<0||
   !Number.isSafeInteger(x.review_note_count)||x.review_note_count<0||
   !["NOT_PROVIDED","DEMO_CANDIDATE_UNVERIFIED"].includes(x.evidence_status)||
   (x.evidence_status==="NOT_PROVIDED")!==(x.candidate_count===0))||
  !Array.isArray(packet.gates)||
  !matches(packet.gates.map(x=>x.gate_id),gatesIds)||
  packet.gates.some((g,i)=>g.decision!=="BLOCKED"||
   g.integration_permitted!==false||g.official_signoff!==false||
   g.reviewer_signoff!==false||
   !matches(g.requirement_ids,GATE_CATALOG[i].requirement_ids)||
   !matches(g.blocking_requirement_ids,GATE_CATALOG[i].requirement_ids))||
  packet.counts?.officially_verified_requirements!==0||
  packet.counts?.blocked_gates!==GATE_CATALOG.length||
  packet.counts?.requirements!==REQUIREMENTS.length||
  packet.counts?.evidence_candidates!==packet.requirements.reduce(
   (sum,r)=>sum+r.candidate_count,0)||
  packet.counts?.unresolved_lineage_issues!==packet.issue_review?.issues?.length||
  !Array.isArray(packet.issue_review?.issues)||
  !Number.isSafeInteger(packet.issue_review.unresolved_count)||
  packet.issue_review.unresolved_count!==packet.issue_review.issues.length||
  !["NOT_PROVIDED","DEMO_SOURCE_UNVERIFIED"].includes(packet.issue_review.source_state)||
  (packet.issue_review.source_state==="NOT_PROVIDED"&&
    packet.issue_review.issues.length!==0)||
  packet.issue_review.issues.length>1000||
  packet.issue_review.issues.some((x,i)=>
   !Number.isSafeInteger(x.issue_index)||x.issue_index!==i+1||
   typeof x.code!=="string"||!/^[A-Z0-9_]{3,90}$/.test(x.code)||
   !sourceRefOk(x.source_ref)||x.review_state!=="UNRESOLVED"||
   x.auto_resolved!==false))
  fail("M05_9_READINESS_PACKET_INVALID");
 return true;
}
export function buildDemoFollowupRegister({readiness,snapshot_id}={}){
 verifyBlockedDemoPacket(readiness);
 if(!isDemoId(snapshot_id)||!snapshot_id.startsWith("DEMO-SNAP-"))
  fail("M05_9_SNAPSHOT_ID_INVALID");
 const requirements=REQUIREMENTS.map(r=>{
  const row=readiness.requirements.find(x=>x.requirement_id===r.requirement_id);
  return {task_id:"DEMO-TASK-REQ-"+r.requirement_id,kind:"REQUIREMENT",
   snapshot_id,reference:{requirement_id:r.requirement_id},
   owner_role:r.owner_role,required_evidence_ids:[r.requirement_id],
   finding_code:row.evidence_status==="NOT_PROVIDED"?
    "EVIDENCE_NOT_PROVIDED":"EVIDENCE_CANDIDATE_UNVERIFIED",
   status:"OPEN_UNVERIFIED",proposal_revision:0,
   due_date:null,signoff_ref:null,source_modified:false,
   officially_resolved:false};
 });
 const issues=readiness.issue_review.issues.map(i=>{
  const guidance=suggestReview(i.code);
  return {task_id:"DEMO-TASK-ISS-"+String(i.issue_index).padStart(4,"0"),
   kind:"LINEAGE_ISSUE",snapshot_id,
   reference:{issue_index:i.issue_index,source_ref:i.source_ref,code:i.code},
   owner_role:guidance.owner_role,required_evidence_ids:guidance.requirement_ids,
   finding_code:i.code,status:"OPEN_UNVERIFIED",proposal_revision:0,
   due_date:null,signoff_ref:null,source_modified:false,
   officially_resolved:false};
 });
 const tasks=[...requirements,...issues];
 return {schema:M05_9_SCHEMA,synthetic:true,
  mode:"DEMO_MANUAL_FOLLOWUP_PROPOSAL_ONLY",snapshot_id,
  years:[...SUPPORTED_YEARS],tasks,proposals:[],
  upstream_readiness:"BLOCKED",lineage_source_state:readiness.issue_review.source_state,
  counts:{requirements:requirements.length,lineage_issues:issues.length,
   tasks:tasks.length,proposals:0,open:tasks.length,official_resolutions:0},
  source_owner_verified:false,official_decision_verified:false,
  no_automatic_remediation:true,may_close_issue:false,
  may_connect:false,may_query:false,may_write:false,may_repair:false,
  may_score:false,may_rank:false,may_award:false,may_publish:false,
  may_run_tests:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
