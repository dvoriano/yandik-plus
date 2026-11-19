/**
 * M04-I6D | KODE DITULIS, BELUM DIUJI.
 * Strict non-sensitive DEMO issue handoff, not an approval/reviewer workflow.
 */
import {I6D_COMPAT_SCHEMA} from "./contracts.mjs";
export const I6D_HANDOFF_SCHEMA="M04-I6D-HANDOFF-UNTESTED-1";
const fail=code=>{throw Error(code)};
const ISSUE=/^DEMO-I6D-ISSUE-[A-Z0-9_-]{1,24}$/;
const ACTOR=/^DEMO-USER-[A-Z0-9_-]{1,40}$/;
const OWNER=new Set(["pengampu_apel","pengampu_sdm","teknis_aplikasi",
 "keamanan","pengelola_data","tata_kelola_spbe"]);
const STATES=new Set(["BELUM_DIKAJI","PERLU_BUKTI","BUTUH_KEPUTUSAN"]);
const required=["issue_id","gate_id","owner_role","recorded_by","status","note"];
export function prepareReviewHandoff(plan,items=[]){
 if(!plan||plan.schema!==I6D_COMPAT_SCHEMA||
    plan.synthetic!==true||plan.mode!=="PLANNING_ONLY"||
    plan.may_integrate!==false||plan.may_deploy!==false||
    plan.official_authorization!==false||
    !Array.isArray(plan.gates)||plan.gates.length!==24||
    plan.gates.some(g=>g.status!=="BELUM_DIBUKTIKAN"))
  fail("HANDOFF_PLAN_INVALID");
 if(!Array.isArray(items))fail("HANDOFF_NOTES_INVALID");
 const seen=new Set(),accepted=[];
 for(const x of items){
  if(!x||typeof x!=="object"||Array.isArray(x)||
    Object.keys(x).length!==required.length||
    required.some(k=>!Object.hasOwn(x,k)))fail("HANDOFF_NOTE_SHAPE_INVALID");
  if(typeof x.issue_id!=="string"||!ISSUE.test(x.issue_id)||
    seen.has(x.issue_id)||!plan.gates.some(g=>g.id===x.gate_id)||
    !OWNER.has(x.owner_role)||typeof x.recorded_by!=="string"||
    !ACTOR.test(x.recorded_by)||!STATES.has(x.status)||
    typeof x.note!=="string"||x.note.trim()!==x.note||
    x.note.length<12||x.note.length>240)
   fail("HANDOFF_NOTE_REJECTED");
  seen.add(x.issue_id);
  // Do not accept links, paths, credentials or personal records in public repo.
  if(/https?:\/\/|(?:password|token|secret|api[_-]?key)\s*[:=]/i.test(x.note))
   fail("HANDOFF_POTENTIAL_SENSITIVE_TEXT");
  accepted.push({...x,review_only:true});
 }
 return {schema:I6D_HANDOFF_SCHEMA,synthetic:true,mode:"REVIEW_NOT_APPROVAL",
  issue_count:accepted.length,notes:accepted,
  outstanding_gate_count:plan.gates.length,owner_decisions_verified:0,
  can_close_gates:false,may_integrate:false,may_deploy:false,
  may_modify_flask:false,official_authorization:false};
}
