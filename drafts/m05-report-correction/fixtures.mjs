/**
 * M05-16 | KODE DITULIS, BELUM DIUJI.
 * Demo resolver is not server authentication. All people/facilities fictional.
 */
import {emptyDemoWorkflow,applyDemoCommand}
 from "../m05-apel-workflow/workflow.mjs";
import {DEMO_FACILITIES} from "../m05-apel-dashboard-ui/fixtures.mjs";
export function demoM0516Adapters(facility_id,role="puskeswan"){
 const f=DEMO_FACILITIES.find(x=>x.facility_id===facility_id);
 if(!f)throw Error("M05_16_FIXTURE_FACILITY_UNKNOWN");
 return {
  resolveServerSession:()=>({
   id:role==="provinsi_verifikator"?"DEMO-USER-REVIEW":"DEMO-USER-REPORT",
   active:true,role,region:f.region_label,puskeswan_id:facility_id
  }),
  resolveFacility:id=>{
   const hit=DEMO_FACILITIES.find(x=>x.facility_id===id);
   return hit?{id:hit.facility_id,region:hit.region_label,status:"aktif"}:null;
  }
 };
}
const report=(facility_id,period,qty)=>({
 facility_id,period,declared_no_activity:qty===0,
 counts:{pengobatan:qty,vaksinasi:0,penyuluhan:0,layanan_lain:0},
 investigations:[],kurban_animals:[],evidence_refs:[]
});
const cmd=(action,facility_id,period,expected_revision,payload,num)=>({
 request_id:"DEMO-M05-REQ-M0516-"+num,facility_id,period,
 expected_revision,action,payload
});
export function buildDemoCorrectionWorkflowFixture(){
 let workflow=emptyDemoWorkflow();
 const submit=demoM0516Adapters("DEMO-PSW-ALPHA");
 const review=demoM0516Adapters("DEMO-PSW-ALPHA","provinsi_verifikator");
 const dispatch=(adapter,action,id,period,rev,payload,num)=>{
  workflow=applyDemoCommand(workflow,adapter,
   cmd(action,id,period,rev,payload,num)).state;
 };
 const a="DEMO-PSW-ALPHA",b="DEMO-PSW-BETA",c="DEMO-PSW-GAMMA";
 dispatch(submit,"create_draft",a,"2026-01",null,
  {report:report(a,"2026-01",5)},"A1");
 dispatch(submit,"submit",a,"2026-01",1,{},"A2");
 dispatch(review,"return_correction",a,"2026-01",2,
  {reason:"Jumlah laporan DEMO perlu dikoreksi"},"A3");
 dispatch(submit,"revise_draft",a,"2026-01",3,
  {report:report(a,"2026-01",7)},"A4");
 dispatch(submit,"resubmit",a,"2026-01",4,{},"A5");
 dispatch(demoM0516Adapters(b),"create_draft",b,"2026-02",null,
  {report:report(b,"2026-02",0)},"B1");
 dispatch(demoM0516Adapters(c),"create_draft",c,"2026-06",null,
  {report:report(c,"2026-06",2)},"C1");
 dispatch(demoM0516Adapters(c),"submit",c,"2026-06",1,{},"C2");
 dispatch(demoM0516Adapters(c,"provinsi_verifikator"),
  "return_correction",c,"2026-06",2,
  {reason:"Mohon periksa data DEMO sebelum pengiriman ulang"},"C3");
 return {workflow,synthetic:true,official_authorization:false,
  generated_in_memory:true};
}
