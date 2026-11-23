/**
 * M05-11 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * Staging evidence package is an EMPTY requirements template.
 * No test runner, secrets, source payloads, stored artifacts or permissions.
 */
import {buildDemoStagingProtocol,M05_11_PROTOCOL_SCHEMA,
 noExecutionAuthority} from "./protocol.mjs";
import {buildDemoProtocolReview,M05_11_REVIEW_SCHEMA} from "./review.mjs";
import {GATE_CATALOG} from "../m05-apel-evidence/gates.mjs";
export const M05_11_PACKET_SCHEMA="M05-11-STAGING-EVIDENCE-PACKET-UNTESTED-1";
export const M05_11_EVIDENCE_ARTIFACTS=Object.freeze([
 ["SIGNED_SCOPE","Written test authority and intended source access scope"],
 ["STAGING_ISOLATION","Environment isolation, endpoint and DB separation review"],
 ["ACCESS_REVIEW","RBAC, credential custody, privacy and retention assessment"],
 ["SOURCE_MAPPING","Approved schema/keys/units and change-controlled mapping"],
 ["JUKNIS_BASELINE","Approved 2026 historical Juknis and baseline source"],
 ["ANNUAL_POLICY","Independent annual policy version and effective dates"],
 ["SNAPSHOT_ATTESTATION","Atomic snapshot and independently verified provenance/digest"],
 ["REGRESSION_RUN_LOG","Future executed scenario IDs, runner version and run timestamps"],
 ["PARITY_DIFF_REPORT","Future source-labelled observed/expected diffs and tolerance decisions"],
 ["INCIDENT_STOP_LOG","Future incident, stop condition and restore documentation"],
 ["INDEPENDENT_REVIEW","Future reviewer signoff, scope and outstanding defects"],
 ["PUBLICATION_DECISION","Separate written authority for use of official/public results"]
].map(([artifact_id,purpose])=>Object.freeze({artifact_id,purpose})));
const NOTE_INPUT_KEYS=["note_id","snapshot_id","control_id","reviewer_id",
 "note_kind","reason_code"];
const fail=x=>{throw Error(x)};
export function buildDemoStagingEvidencePacket({protocol,review}={}){
 if(protocol?.schema!==M05_11_PROTOCOL_SCHEMA||
  !noExecutionAuthority(protocol)||
  protocol?.synthetic!==true||protocol?.mode!=="DRAFT_NO_STAGING_EXECUTION"||
  review?.schema!==M05_11_REVIEW_SCHEMA||
  review?.synthetic!==true||review?.mode!=="NOTES_ONLY_NO_AUTHORITY"||
  !noExecutionAuthority(review)||
  !Array.isArray(review?.notes)||!Array.isArray(review?.controls)||
  review.snapshot_id!==protocol.snapshot_id||review.year!==protocol.year)
  fail("M05_11_PACKET_INPUT_INVALID");
 const canonical=buildDemoStagingProtocol({
  year:protocol.year,snapshot_id:protocol.snapshot_id});
 if(JSON.stringify(protocol)!==JSON.stringify(canonical))
  fail("M05_11_PACKET_PROTOCOL_TAMPERED");
 // Recreate and compare, to prevent a forged signature or reviewed state.
 const sourceNotes=review.notes.map(n=>Object.fromEntries(
  NOTE_INPUT_KEYS.map(k=>[k,n[k]])));
 const canonicalReview=buildDemoProtocolReview({protocol:canonical,notes:sourceNotes});
 if(JSON.stringify(review)!==JSON.stringify(canonicalReview))
  fail("M05_11_PACKET_REVIEW_TAMPERED");
 const artifacts=M05_11_EVIDENCE_ARTIFACTS.map(a=>({
  ...a,reference_id:null,status:"NOT_PROVIDED",
  verified:false,official_signoff:false,eligible_for_execution:false}));
 const gates=GATE_CATALOG.map(g=>({
  gate_id:g.gate_id,required:[...g.requirement_ids],
  status:"BLOCKED",official_signoff:false,permission_granted:false}));
 const cases=canonical.parity_cases.map(x=>({
  case_key:x.case_key,year:canonical.year,criterion:x.criterion,
  execution_state:"NOT_RUN",evidence_id:null,expected_value:null,
  observed_value:null,difference:null,verdict:"NOT_ASSESSED",
  source_comparable:false,verified:false}));
 return {schema:M05_11_PACKET_SCHEMA,synthetic:true,
  mode:"FUTURE_STAGING_EVIDENCE_REQUIREMENTS_ONLY",
  year:canonical.year,snapshot_id:canonical.snapshot_id,
  controls:canonical.controls.map(x=>({
   control_id:x.control_id,status:x.status,
   owner_role:x.owner_role,notes_count:canonicalReview.notes.filter(n=>
    n.control_id===x.control_id).length,
   signed_off:false,permission_granted:false})),
  artifacts,gates,cases,
  counts:{controls:canonical.controls.length,
   artifacts_required:artifacts.length,artifacts_provided:0,
   artifacts_verified:0,blocked_gates:gates.length,
   scenarios:cases.length,scenarios_run:0,
   scenarios_passed:0,scenarios_failed:0,
   demo_review_notes:canonicalReview.notes.length},
  status:"BLOCKED_NOT_AUTHORIZED_NOT_EXECUTED",
  next_step:"WAIT_FOR_EXPLICIT_OWNER_TEST_PERMISSION_AND_AUTHORIZED_STAGING_DESIGN",
  code_only_active:true,
  project_test_permission_verified:false,
  system_access_permission_verified:false,
  source_owner_verified:false,staging_environment_verified:false,
  security_controls_verified:false,baseline_verified:false,
  juknis_parity_verified:false,
  may_run_tests:false,may_connect:false,may_query:false,may_write:false,
  may_repair:false,may_score:false,may_rank:false,may_award:false,
  may_publish:false,may_merge:false,may_deploy:false,
  official_authorization:false};
}
