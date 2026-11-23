/**
 * M05-9 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Presentation-only manual handoff. Not an official report, approval or task dispatch.
 */
import {proposeDemoFollowups} from "./proposals.mjs";
import {M05_9_SCHEMA} from "./register.mjs";
export const M05_9_HANDOFF_SCHEMA="M05-9-HANDOFF-VIEW-UNTESTED-1";
export function buildDemoManualHandoff({register}={}){
 // A zero-change proposal operation performs the same structural guard.
 const data=proposeDemoFollowups({register,proposals:[]});
 const grouped=["REQUIREMENT","LINEAGE_ISSUE"].map(kind=>{
  const tasks=data.tasks.filter(t=>t.kind===kind);
  return {kind,task_count:tasks.length,open_count:tasks.length,
   items:tasks.map(t=>({task_id:t.task_id,snapshot_id:t.snapshot_id,
    finding_code:t.finding_code,owner_role:t.owner_role,
    required_evidence_ids:[...t.required_evidence_ids],
    proposed_note_count:data.proposals.filter(p=>p.task_id===t.task_id).length,
    current_review_state:t.proposal_revision?
     "DEMO_PROPOSAL_RECORDED_ONLY":"PENDING_DEMO_REVIEW",
    official_resolution:false,source_changed:false,
    due_date:null,signoff_ref:null}))};
 });
 return {schema:M05_9_HANDOFF_SCHEMA,source_schema:M05_9_SCHEMA,
  synthetic:true,mode:"NOT_FOR_OPERATIONAL_DISPATCH",
  snapshot_id:data.snapshot_id,source_readiness:"BLOCKED",
  groups:grouped,totals:{tasks:data.tasks.length,open:data.tasks.length,
   proposed_notes:data.proposals.length,officially_resolved:0},
  caveats:["DEMO_METADATA_ONLY","NO_APPROVED_EVIDENCE",
   "NO_SOURCE_OWNER_SIGNOFF","NO_SNAPSHOT_INTEGRITY_ATTESTATION",
   "NOT_AN_OFFICIAL_RECONCILIATION_RESULT"],
  may_send:false,may_assign_real_staff:false,may_close_issue:false,
  may_connect:false,may_query:false,may_write:false,may_repair:false,
  may_score:false,may_rank:false,may_award:false,may_publish:false,
  may_run_tests:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
