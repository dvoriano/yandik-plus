/** M05-9 | QA scenarios WRITTEN, 0 EXECUTED | CODE_ONLY | DEMO ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {makeDemoEvidenceRegister} from "../../m05-apel-evidence/evidence.mjs";
import {makeDemoEvidenceReview} from "../../m05-apel-evidence/review.mjs";
import {buildDemoReadinessPacket} from "../../m05-apel-evidence/gates.mjs";
import {M05_7_SCHEMA} from "../../m05-apel-lineage/lineage.mjs";
import {buildDemoFollowupRegister,verifyBlockedDemoPacket,
 M05_9_SCHEMA,M05_9_TASK_KINDS,M05_9_ACTIONS,M05_9_REASONS}
 from "../register.mjs";
import {proposeDemoFollowups} from "../proposals.mjs";
import {buildDemoManualHandoff} from "../handoff.mjs";

const snapshot="DEMO-SNAP-W1";
const demoLineage=(code="REGION_PARTIAL_MONTH",ref="services:DEMO-SVC-1")=>({
 schema:M05_7_SCHEMA,synthetic:true,mode:"DEMO_LINEAGE_REVIEW_ONLY",
 all_candidate_links_are_unverified:true,mapping_verified:false,
 source_owner_verified:false,issues:[{code,source_ref:ref,related:[],
  resolution:"HUMAN_REVIEW_REQUIRED",auto_resolved:false}],
 may_connect:false,may_query:false,may_write:false,may_repair:false,
 may_score:false,may_publish:false,official_authorization:false
});
const basePacket=(withIssue=true)=>{
 const reg=makeDemoEvidenceRegister();
 const reviews=makeDemoEvidenceReview({register:reg});
 return buildDemoReadinessPacket({register:reg,reviews,
  lineage:withIssue?demoLineage():null});
};
const makeRegister=(withIssue=true,snap=snapshot)=>buildDemoFollowupRegister({
 readiness:basePacket(withIssue),snapshot_id:snap
});
const reqTask="DEMO-TASK-REQ-DATA_DICTIONARY";
const issueTask="DEMO-TASK-ISS-0001";
const note=(task_id=issueTask,req="REGION_HISTORY",revision=0)=>({
 proposal_id:"DEMO-PROP-1",snapshot_id:snapshot,task_id,
 reviewer_id:"DEMO-REVIEWER-1",expected_revision:revision,
 action_code:"REQUEST_MISSING_EVIDENCE",
 reason_code:"DEMO_EVIDENCE_ABSENT",evidence_requirement_id:req
});
const append=(register,proposals)=>proposeDemoFollowups({register,proposals});

test("M05-9 accepts a blocked DEMO readiness input",()=>{
 assert.equal(verifyBlockedDemoPacket(basePacket()),true);
});
test("M05-9 creates a fourteen-item requirement review queue",()=>{
 const r=makeRegister(false);
 assert.equal(r.counts.requirements,14);
 assert.equal(r.counts.tasks,14);
});
test("M05-9 issues remain separate from evidence requirements",()=>{
 const r=makeRegister();
 assert.equal(r.counts.tasks,15);
 assert.equal(r.counts.lineage_issues,1);
 assert.equal(r.tasks.filter(t=>t.kind==="LINEAGE_ISSUE").length,1);
});
test("M05-9 task kinds are explicit",()=>{
 assert.deepEqual(M05_9_TASK_KINDS,["REQUIREMENT","LINEAGE_ISSUE"]);
});
test("M05-9 action codes do not include auto-close or auto-repair",()=>{
 assert.equal(M05_9_ACTIONS.includes("AUTO_CLOSE"),false);
 assert.equal(M05_9_REASONS.includes("APPROVED"),false);
});
test("M05-9 scopes every task to its snapshot",()=>{
 const r=makeRegister();
 assert.ok(r.tasks.every(t=>t.snapshot_id===snapshot));
});
test("M05-9 issue index is anchored to snapshot and source reference",()=>{
 const r=makeRegister();
 const task=r.tasks.find(t=>t.kind==="LINEAGE_ISSUE");
 assert.equal(task.reference.issue_index,1);
 assert.equal(task.reference.source_ref,"services:DEMO-SVC-1");
 assert.equal(task.snapshot_id,snapshot);
});
test("M05-9 never treats an index as global issue identity",()=>{
 const a=makeRegister(true,"DEMO-SNAP-A"),b=makeRegister(true,"DEMO-SNAP-B");
 assert.equal(a.tasks.at(-1).task_id,b.tasks.at(-1).task_id);
 assert.notEqual(a.tasks.at(-1).snapshot_id,b.tasks.at(-1).snapshot_id);
});
test("M05-9 missing readiness packet is rejected",()=>{
 assert.throws(()=>buildDemoFollowupRegister({snapshot_id:snapshot}),
  /M05_9_READINESS_PACKET_INVALID/);
});
test("M05-9 rejects readiness not shaped as M05-8 packet",()=>{
 const p=basePacket();p.schema="DEMO-WRONG";
 assert.throws(()=>buildDemoFollowupRegister({snapshot_id:snapshot,
  readiness:p}),/M05_9_READINESS_PACKET_INVALID/);
});
test("M05-9 rejects readiness with unauthorized production access",()=>{
 const p=basePacket();p.may_connect=true;
 assert.throws(()=>buildDemoFollowupRegister({snapshot_id:snapshot,
  readiness:p}),/M05_9_READINESS_PACKET_INVALID/);
});
test("M05-9 rejects gate falsely marked ready",()=>{
 const p=basePacket();p.gates[0].decision="READY";
 assert.throws(()=>buildDemoFollowupRegister({snapshot_id:snapshot,
  readiness:p}),/M05_9_READINESS_PACKET_INVALID/);
});
test("M05-9 rejects official attestation forged into requirement",()=>{
 const p=basePacket();p.requirements[0].official_attestation="APPROVED";
 assert.throws(()=>buildDemoFollowupRegister({snapshot_id:snapshot,
  readiness:p}),/M05_9_READINESS_PACKET_INVALID/);
});
test("M05-9 rejects a resolved upstream issue",()=>{
 const p=basePacket();p.issue_review.issues[0].review_state="RESOLVED";
 assert.throws(()=>buildDemoFollowupRegister({snapshot_id:snapshot,
  readiness:p}),/M05_9_READINESS_PACKET_INVALID/);
});
test("M05-9 rejects non-DEMO snapshot",()=>{
 assert.throws(()=>buildDemoFollowupRegister({snapshot_id:"2026-live",
  readiness:basePacket()}),/M05_9_SNAPSHOT_ID_INVALID/);
});
test("M05-9 rejects generic DEMO label lacking snapshot namespace",()=>{
 assert.throws(()=>buildDemoFollowupRegister({snapshot_id:"DEMO-2026",
  readiness:basePacket()}),/M05_9_SNAPSHOT_ID_INVALID/);
});
test("M05-9 unresolved region issue requires history evidence",()=>{
 const t=makeRegister().tasks.at(-1);
 assert.ok(t.required_evidence_ids.includes("REGION_HISTORY"));
});
test("M05-9 workflow issue requires workflow revision evidence",()=>{
 const p=basePacket();
 p.issue_review.issues[0].code="WORKFLOW_REVISION_MISMATCH";
 const t=buildDemoFollowupRegister({readiness:p,snapshot_id:snapshot}).tasks.at(-1);
 assert.ok(t.required_evidence_ids.includes("REPORT_REVISIONS"));
});
test("M05-9 unknown issue code falls back to provenance and grain",()=>{
 const p=basePacket();p.issue_review.issues[0].code="UNCLASSIFIED_ISSUE";
 const t=buildDemoFollowupRegister({readiness:p,snapshot_id:snapshot}).tasks.at(-1);
 assert.deepEqual(t.required_evidence_ids,["SOURCE_PROVENANCE","KEYS_AND_GRAIN"]);
});
test("M05-9 all tasks start open, without deadlines or official signoff",()=>{
 const r=makeRegister();
 assert.ok(r.tasks.every(t=>t.status==="OPEN_UNVERIFIED"&&
  t.due_date===null&&t.signoff_ref===null&&t.officially_resolved===false));
});
test("M05-9 no branch of register can authorize writes, tests or scores",()=>{
 const r=makeRegister();
 for(const key of ["may_close_issue","may_connect","may_query","may_write",
  "may_repair","may_score","may_rank","may_award","may_publish",
  "may_run_tests","may_merge","may_deploy","official_authorization"])
  assert.equal(r[key],false);
});
test("M05-9 preserves scope 2026-2030",()=>{
 assert.deepEqual(makeRegister().years,[2026,2027,2028,2029,2030]);
});
test("M05-9 accepts one proposal with correct expected revision",()=>{
 const r=makeRegister(),next=append(r,[note()]);
 assert.equal(next.counts.proposals,1);
 assert.equal(next.tasks.at(-1).proposal_revision,1);
});
test("M05-9 proposal never changes issue resolution or source",()=>{
 const r=makeRegister(),next=append(r,[note()]);
 assert.equal(next.tasks.at(-1).status,"OPEN_UNVERIFIED");
 assert.equal(next.tasks.at(-1).source_modified,false);
 assert.equal(next.proposals[0].official_decision,false);
 assert.equal(next.proposals[0].issue_resolved,false);
});
test("M05-9 append does not mutate input register",()=>{
 const r=makeRegister(),next=append(r,[note()]);
 assert.equal(r.proposals.length,0);
 assert.equal(r.tasks.at(-1).proposal_revision,0);
 assert.equal(next.proposals.length,1);
});
test("M05-9 supports ordered sequential notes with explicit revisions",()=>{
 const r=makeRegister(),first=note(),second={...note(),
  proposal_id:"DEMO-PROP-2",expected_revision:1};
 const next=append(r,[first,second]);
 assert.equal(next.tasks.at(-1).proposal_revision,2);
 assert.equal(next.proposals[1].proposal_revision,2);
});
test("M05-9 supports append on previously reviewed register",()=>{
 const r=makeRegister(),first=append(r,[note()]);
 const second=append(first,[{...note(),proposal_id:"DEMO-PROP-2",
  expected_revision:1}]);
 assert.equal(second.counts.proposals,2);
 assert.equal(first.counts.proposals,1);
});
test("M05-9 rejects stale revision rather than overwriting notes",()=>{
 const r=append(makeRegister(),[note()]);
 assert.throws(()=>append(r,[{...note(),proposal_id:"DEMO-PROP-2"}]),
  /M05_9_STALE_PROPOSAL_REVISION/);
});
test("M05-9 rejects duplicate proposal ID within new batch",()=>{
 const r=makeRegister();
 assert.throws(()=>append(r,[note(),note()]),/M05_9_DUPLICATE_PROPOSAL_ID/);
});
test("M05-9 rejects reuse of previously recorded proposal ID",()=>{
 const r=append(makeRegister(),[note()]);
 assert.throws(()=>append(r,[{...note(),expected_revision:1}]),
  /M05_9_DUPLICATE_PROPOSAL_ID/);
});
test("M05-9 cross-snapshot proposal is rejected",()=>{
 const r=makeRegister(),p=note();p.snapshot_id="DEMO-SNAP-OTHER";
 assert.throws(()=>append(r,[p]),/M05_9_PROPOSAL_INVALID/);
});
test("M05-9 unknown task is not silently created",()=>{
 const r=makeRegister(),p=note();p.task_id="DEMO-TASK-ISS-9999";
 assert.throws(()=>append(r,[p]),/M05_9_UNKNOWN_TASK/);
});
test("M05-9 unrelated evidence requirement is rejected",()=>{
 const r=makeRegister(),p=note();p.evidence_requirement_id="YEARLY_POLICY";
 assert.throws(()=>append(r,[p]),/M05_9_EVIDENCE_REQUIREMENT_MISMATCH/);
});
test("M05-9 missing evidence reference is rejected",()=>{
 const r=makeRegister(),p=note();p.evidence_requirement_id=null;
 assert.throws(()=>append(r,[p]),/M05_9_PROPOSAL_INVALID/);
});
test("M05-9 fake reviewer identifier is rejected",()=>{
 const r=makeRegister(),p=note();p.reviewer_id="actual-person";
 assert.throws(()=>append(r,[p]),/M05_9_PROPOSAL_INVALID/);
});
test("M05-9 proposed auto-approval action is rejected",()=>{
 const r=makeRegister(),p=note();p.action_code="APPROVE";
 assert.throws(()=>append(r,[p]),/M05_9_PROPOSAL_INVALID/);
});
test("M05-9 proposed close-and-repair action is rejected",()=>{
 const r=makeRegister(),p=note();p.action_code="CLOSE_AND_REPAIR";
 assert.throws(()=>append(r,[p]),/M05_9_PROPOSAL_INVALID/);
});
test("M05-9 forged official decision field is rejected",()=>{
 const r=makeRegister(),p=note();p.official_decision=true;
 assert.throws(()=>append(r,[p]),/M05_9_PROPOSAL_INVALID/);
});
test("M05-9 arbitrary free text or raw evidence is rejected",()=>{
 const r=makeRegister(),p=note();p.raw_document="DATA";
 assert.throws(()=>append(r,[p]),/M05_9_PROPOSAL_INVALID/);
});
test("M05-9 forged register authorization is rejected",()=>{
 const r=makeRegister();r.may_write=true;
 assert.throws(()=>append(r,[note()]),/M05_9_REGISTER_INVALID/);
});
test("M05-9 forged closed task is rejected",()=>{
 const r=makeRegister();r.tasks.at(-1).status="CLOSED";
 assert.throws(()=>append(r,[note()]),/M05_9_REGISTER_INVALID/);
});
test("M05-9 empty proposal batch makes no source changes",()=>{
 const r=makeRegister(),next=append(r,[]);
 assert.equal(next.counts.proposals,0);
 assert.equal(next.tasks.at(-1).proposal_revision,0);
});
test("M05-9 handoff renders requirement and issue groups without dispatch",()=>{
 const handoff=buildDemoManualHandoff({register:makeRegister()});
 assert.equal(handoff.groups.length,2);
 assert.equal(handoff.totals.open,15);
 assert.equal(handoff.may_send,false);
});
test("M05-9 handoff records notes without treating them as resolved",()=>{
 const register=append(makeRegister(),[note()]);
 const handoff=buildDemoManualHandoff({register});
 assert.equal(handoff.totals.proposed_notes,1);
 assert.equal(handoff.groups[1].items[0].current_review_state,
  "DEMO_PROPOSAL_RECORDED_ONLY");
 assert.equal(handoff.totals.officially_resolved,0);
});
test("M05-9 handoff cannot assign actual staff or publish",()=>{
 const h=buildDemoManualHandoff({register:makeRegister()});
 assert.equal(h.may_assign_real_staff,false);
 assert.equal(h.may_publish,false);
 assert.equal(h.may_deploy,false);
});
test("M05-9 handoff refuses spoofed register source",()=>{
 const r=makeRegister();r.schema="FAKE";
 assert.throws(()=>buildDemoManualHandoff({register:r}),
  /M05_9_REGISTER_INVALID/);
});
test("M05-9 proposal for missing dictionary evidence remains pending",()=>{
 const r=makeRegister(),p=note(reqTask,"DATA_DICTIONARY");
 const next=append(r,[p]);
 const t=next.tasks.find(t=>t.task_id===reqTask);
 assert.equal(t.officially_resolved,false);
 assert.equal(t.proposal_revision,1);
});
