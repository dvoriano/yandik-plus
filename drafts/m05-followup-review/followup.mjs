/**
 * M05-17 | KODE DITULIS, BELUM DIUJI | CODE_ONLY.
 * Manual-review candidate board. No task assignment, alert, policy judgement,
 * score, approval, BAST, budget, write operation, or production access.
 */
import {M05_16_SCHEMA} from "../m05-report-correction/correction.mjs";

export const M05_17_SCHEMA="M05-17-PEMBINAAN-REVIEW-DEMO-UNTESTED-1";
const fail=code=>{throw Error(code);};
const REPORT_STATES=new Set(["NOT_STARTED_DEMO","DRAFT",
 "SUBMITTED_REVIEW_PENDING","CORRECTION_REQUESTED","REVISION_DRAFT"]);
const profileStates=new Set(["NOT_AVAILABLE_DEMO","DRAFT_DEMO",
 "REVIEW_PENDING_DEMO","RECORDED_DEMO"]);
const staffStates=new Set(["NOT_AVAILABLE_DEMO","PARTIAL_DEMO",
 "COMPLETE_DEMO"]);
const SAFE_FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const SAFE_PERIOD=/^20(?:2[6-9]|30)-(?:0[1-9]|1[0-2])$/;
const TEMPLATES=Object.freeze({
 LaporanKoreksi:{
  code:"KLARIFIKASI_KOREKSI_DEMO",
  subject:"Pembahasan bahan koreksi laporan DEMO",
  unit_role_hint:"PENGELOLA_PELAPORAN"
 },
 LaporanReview:{
  code:"TELAAH_SUBMIT_DEMO",
  subject:"Pemeriksaan draf laporan terkirim DEMO",
  unit_role_hint:"PENGELOLA_PELAPORAN"
 },
 LaporanDraf:{
  code:"PENDAMPINGAN_DRAF_DEMO",
  subject:"Peninjauan ketersediaan bahan laporan DEMO",
  unit_role_hint:"PENDAMPING_PUSKESWAN"
 },
 Profil:{
  code:"TELAAH_PROFIL_DEMO",
  subject:"Peninjauan kelengkapan profil fasilitas DEMO",
  unit_role_hint:"PENGELOLA_PROFIL"
 },
 SDM:{
  code:"TELAAH_SDM_DEMO",
  subject:"Peninjauan kelengkapan catatan SDM DEMO",
  unit_role_hint:"PENGELOLA_SDM"
 }
});
function verifyContext(c){
 if(!c||c.schema!==M05_16_SCHEMA||c.synthetic!==true||
    c.mode!=="READ_ONLY_DEMO"||c.official_authorization!==false||
    c.officially_verified!==false||c.may_publish!==false||
    c.may_connect!==false||c.cross_source_reconciled!==false||
    !SAFE_FAC.test(c.facility_id)||!SAFE_PERIOD.test(c.period)||
    c.year!==Number(c.period.slice(0,4))||
    !REPORT_STATES.has(c.report_state)||
    !profileStates.has(c.profile_context?.profile_state)||
    !staffStates.has(c.profile_context?.sdm_coverage))
  fail("M05_17_CONTEXT_UNTRUSTED");
 return c;
}
function candidate(context,template){
 // Every candidate is a review suggestion, never an instruction to issue
 // official letters, assign an employee or grant assistance.
 return {
  case_id:"DEMO-M0517-"+context.facility_id.slice("DEMO-PSW-".length)+
   "-"+context.period.replace("-","")+"-"+template.code,
  facility_id:context.facility_id,period:context.period,
  review_reason_code:template.code,subject:template.subject,
  role_to_consult:template.unit_role_hint,
  status:"DRAFT_REVIEW_ONLY",assigned_to:null,due_date:null,
  official_document_ref:null,official_decision:null,
  budget_approval:null,evidence_verified:false,
  may_dispatch:false,may_close_case:false,
  needs_human_review:true
 };
}
export function buildDemoFollowupView(context){
 const c=verifyContext(context);
 const proposals=[];
 if(c.report_state==="CORRECTION_REQUESTED"||
    c.report_state==="REVISION_DRAFT")
  proposals.push(candidate(c,TEMPLATES.LaporanKoreksi));
 else if(c.report_state==="SUBMITTED_REVIEW_PENDING")
  proposals.push(candidate(c,TEMPLATES.LaporanReview));
 else proposals.push(candidate(c,TEMPLATES.LaporanDraf));
 if(c.profile_context.profile_state==="NOT_AVAILABLE_DEMO"||
    c.profile_context.profile_state==="DRAFT_DEMO")
  proposals.push(candidate(c,TEMPLATES.Profil));
 if(c.profile_context.sdm_coverage!=="COMPLETE_DEMO")
  proposals.push(candidate(c,TEMPLATES.SDM));
 return {
  schema:M05_17_SCHEMA,synthetic:true,mode:"PROPOSAL_ONLY_READ_MODEL",
  facility_id:c.facility_id,period:c.period,year:c.year,
  report_state_demo:c.report_state,
  profile_state_demo:c.profile_context.profile_state,
  sdm_coverage_demo:c.profile_context.sdm_coverage,
  advisory_proposals:proposals,
  proposal_count:proposals.length,
  status:"DRAFT_NO_OFFICIAL_CASES",
  // This metric counts suggestions, not actions completed or service gaps.
  basis:"M05-16_UNRECONCILED_SYNTHETIC_CONTEXT",
  public_service_performance_judged:false,
  staffing_adequacy_judged:false,
  source_authority_verified:false,
  official_case_count:null,decisions_issued:0,
  may_assign:false,may_notify:false,may_write:false,
  may_score:false,may_rank:false,may_publish:false,
  may_allocate:false,may_approve:false,may_deploy:false,
  official_authorization:false,officially_verified:false
 };
}
export function buildDemoFollowupBoard(contexts){
 if(!Array.isArray(contexts)||contexts.length>120)
  fail("M05_17_BOARD_INPUT_INVALID");
 const keys=new Set();
 const items=contexts.map(c=>{
  const view=buildDemoFollowupView(c);
  const key=view.facility_id+"|"+view.period;
  if(keys.has(key))fail("M05_17_DUPLICATE_FACILITY_MONTH");
  keys.add(key);
  return view;
 }).sort((a,b)=>(a.period+"|"+a.facility_id)
  .localeCompare(b.period+"|"+b.facility_id));
 return {
  schema:M05_17_SCHEMA,synthetic:true,mode:"READ_ONLY_DEMO_BOARD",
  context_count:items.length,
  proposed_review_items:items.reduce((sum,item)=>sum+item.proposal_count,0),
  items,official_followup_cases:null,
  has_official_case_registry:false,no_priority_ranking:true,
  no_deadline_judgement:true,no_automatic_dispatch:true,
  may_assign:false,may_notify:false,may_write:false,
  may_score:false,may_rank:false,may_publish:false,
  may_allocate:false,may_approve:false,may_deploy:false,
  official_authorization:false,officially_verified:false
 };
}
