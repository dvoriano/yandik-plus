/** M05-2 | KODE DITULIS, BELUM DIUJI. Fictitious reports and schedules. */
import {emptyDemoWorkflow,applyDemoCommand}
 from "../m05-apel-workflow/workflow.mjs";
import {demoReport,command,demoAdapters,USERS,FACILITIES}
 from "../m05-apel-workflow/fixtures.mjs";
import {planAnnualDeadline} from "./schedule.mjs";
export const FACILITY_ID=FACILITIES[0].id;
export function exampleSchedule(year=2026,overrides={}){
 return planAnnualDeadline({year,proposal_id:"DEMO-M05-SCHEDULE-"+year+"-A",
  deadline_day:9,publication_day:10,...overrides});
}
export function exampleWorkflow(){
 let state=emptyDemoWorkflow();
 const create=(period,suffix,report=demoReport(FACILITY_ID,period))=>{
  state=applyDemoCommand(state,demoAdapters(USERS.PET),
   command("create_draft",null,{report},FACILITY_ID,period,"CREATE-"+suffix)).state;
 };
 const advance=(period,suffix,action,revision,payload={},user=USERS.PET)=>{
  state=applyDemoCommand(state,demoAdapters(user),
   command(action,revision,payload,FACILITY_ID,period,suffix)).state;
 };
 // 2026-01: draft not sent.
 create("2026-01","JAN");
 // 2026-02: submitted, awaiting review.
 create("2026-02","FEB");
 advance("2026-02","SEND-FEB","submit",1);
 // 2026-03: submitted then returned for correction.
 create("2026-03","MAR");
 advance("2026-03","SEND-MAR","submit",1);
 advance("2026-03","RETURN-MAR","return_correction",2,
  {reason:"Mohon periksa kembali data kegiatan DEMO."},USERS.VER);
 // 2026-04: returned, then edited, not yet resubmitted.
 create("2026-04","APR");
 advance("2026-04","SEND-APR","submit",1);
 advance("2026-04","RETURN-APR","return_correction",2,
  {reason:"Angka layanan DEMO perlu klarifikasi tambahan."},USERS.VER);
 advance("2026-04","REVISE-APR","revise_draft",3,
  {report:demoReport(FACILITY_ID,"2026-04",{counts:{
   pengobatan:5,vaksinasi:0,penyuluhan:0,layanan_lain:0}})});
 // 2026-05: explicit zero, still pending review.
 const zero=demoReport(FACILITY_ID,"2026-05",{
  declared_no_activity:true,
  counts:{pengobatan:0,vaksinasi:0,penyuluhan:0,layanan_lain:0},
  evidence_refs:[]});
 create("2026-05","MAY",zero);
 advance("2026-05","SEND-MAY","submit",1);
 // Distinct year. No backfilling or inherited deadlines.
 create("2027-01","2027");
 create("2030-12","2030");
 advance("2030-12","SEND-2030","submit",1);
 return state;
}
