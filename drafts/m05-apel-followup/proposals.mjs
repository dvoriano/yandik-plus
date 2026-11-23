/**
 * M05-9 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Append-only proposal history in memory. No storage, official workflow or signatures.
 * A revision counter here is NOT an atomic DB lock.
 */
import {M05_9_SCHEMA,M05_9_ACTIONS,M05_9_REASONS}
 from "./register.mjs";
import {isDemoId,REQUIREMENTS} from "../m05-apel-evidence/evidence.mjs";

const fail=code=>{throw Error(code)};
const exact=(r,keys)=>r!==null&&typeof r==="object"&&!Array.isArray(r)&&
 Object.keys(r).length===keys.length&&keys.every(k=>Object.hasOwn(r,k));
const keys=["proposal_id","snapshot_id","task_id","reviewer_id",
 "expected_revision","action_code","reason_code","evidence_requirement_id"];
const reqs=new Set(REQUIREMENTS.map(r=>r.requirement_id));
const flags=["may_close_issue","may_connect","may_query","may_write",
 "may_repair","may_score","may_rank","may_award","may_publish",
 "may_run_tests","may_merge","may_deploy","official_authorization"];
function validateRegister(register){
 if(register?.schema!==M05_9_SCHEMA||register?.synthetic!==true||
  register?.mode!=="DEMO_MANUAL_FOLLOWUP_PROPOSAL_ONLY"||
  !isDemoId(register.snapshot_id)||!register.snapshot_id.startsWith("DEMO-SNAP-")||
  register.upstream_readiness!=="BLOCKED"||
  register.no_automatic_remediation!==true||
  register.source_owner_verified!==false||
  register.official_decision_verified!==false||
  !flags.every(k=>register?.[k]===false)||
  !Array.isArray(register.tasks)||!Array.isArray(register.proposals)||
  register.tasks.length<REQUIREMENTS.length||register.tasks.length>REQUIREMENTS.length+1000||
  register.counts?.tasks!==register.tasks.length||
  register.counts?.open!==register.tasks.length||
  register.counts?.requirements!==REQUIREMENTS.length||
  register.counts?.lineage_issues!==register.tasks.length-REQUIREMENTS.length||
  register.counts?.official_resolutions!==0||
  register.counts?.proposals!==register.proposals.length||
  !register.tasks.every(t=>isDemoId(t.task_id)&&
   t.snapshot_id===register.snapshot_id&&
   ["REQUIREMENT","LINEAGE_ISSUE"].includes(t.kind)&&
   Array.isArray(t.required_evidence_ids)&&t.required_evidence_ids.length>0&&
   t.required_evidence_ids.every(k=>reqs.has(k))&&
   Number.isSafeInteger(t.proposal_revision)&&t.proposal_revision>=0&&
   t.status==="OPEN_UNVERIFIED"&&t.due_date===null&&
   t.signoff_ref===null&&t.source_modified===false&&
   t.officially_resolved===false)||
  new Set(register.tasks.map(t=>t.task_id)).size!==register.tasks.length||
  !register.proposals.every(p=>isDemoId(p.proposal_id)&&
   p.snapshot_id===register.snapshot_id&&
   p.official_decision===false&&p.issue_resolved===false&&
   p.source_modified===false)||
  new Set(register.proposals.map(p=>p.proposal_id)).size!==register.proposals.length)
  fail("M05_9_REGISTER_INVALID");
 const expected=[
  ...REQUIREMENTS.map(r=>"DEMO-TASK-REQ-"+r.requirement_id),
  ...Array.from({length:register.counts.lineage_issues},(_,i)=>
   "DEMO-TASK-ISS-"+String(i+1).padStart(4,"0"))
 ];
 if(!register.tasks.every((x,i)=>x.task_id===expected[i])||
  register.tasks.some(t=>t.kind==="REQUIREMENT"&&
   (t.reference?.requirement_id!==t.task_id.slice("DEMO-TASK-REQ-".length)))||
  register.proposals.some(p=>!register.tasks.some(t=>t.task_id===p.task_id)))
  fail("M05_9_REGISTER_LINKS_INVALID");
 return true;
}
export function proposeDemoFollowups({register,proposals=[]}={}){
 validateRegister(register);
 if(!Array.isArray(proposals)||proposals.length>100)
  fail("M05_9_PROPOSAL_SET_INVALID");
 const taskCopies=register.tasks.map(t=>({...t,
  reference:{...t.reference},required_evidence_ids:[...t.required_evidence_ids]}));
 const previous=register.proposals.map(p=>({...p}));
 const idSet=new Set(previous.map(p=>p.proposal_id));
 const next=[];
 for(const p of proposals){
  if(!exact(p,keys)||!isDemoId(p.proposal_id)||
   !isDemoId(p.snapshot_id)||p.snapshot_id!==register.snapshot_id||
   !isDemoId(p.reviewer_id)||
   !Number.isSafeInteger(p.expected_revision)||p.expected_revision<0||
   !M05_9_ACTIONS.includes(p.action_code)||
   !M05_9_REASONS.includes(p.reason_code)||
   !reqs.has(p.evidence_requirement_id))
   fail("M05_9_PROPOSAL_INVALID");
  if(idSet.has(p.proposal_id))fail("M05_9_DUPLICATE_PROPOSAL_ID");
  const task=taskCopies.find(t=>t.task_id===p.task_id);
  if(!task)fail("M05_9_UNKNOWN_TASK");
  if(p.expected_revision!==task.proposal_revision)
   fail("M05_9_STALE_PROPOSAL_REVISION");
  if(!task.required_evidence_ids.includes(p.evidence_requirement_id))
   fail("M05_9_EVIDENCE_REQUIREMENT_MISMATCH");
  idSet.add(p.proposal_id);
  task.proposal_revision++;
  next.push({...p,proposal_revision:task.proposal_revision,
   official_decision:false,issue_resolved:false,source_modified:false});
 }
 return {...register,tasks:taskCopies,proposals:[...previous,...next],
  counts:{...register.counts,proposals:previous.length+next.length},
  last_review_state:next.length?"DEMO_ACTIONS_PROPOSED_ONLY":"NO_NEW_PROPOSALS",
  upstream_readiness:"BLOCKED",source_owner_verified:false,
  official_decision_verified:false,may_close_issue:false,
  may_connect:false,may_query:false,may_write:false,may_repair:false,
  may_score:false,may_rank:false,may_award:false,may_publish:false,
  may_run_tests:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
