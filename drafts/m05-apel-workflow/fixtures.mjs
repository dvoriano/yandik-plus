/** M05-1 | KODE DITULIS, BELUM DIUJI. All IDs, regions and users DEMO. */
import {emptyDemoWorkflow,applyDemoCommand} from "./workflow.mjs";
export const FACILITIES=Object.freeze([
 Object.freeze({id:"DEMO-PSW-001",region:"Kabupaten Contoh",status:"aktif"}),
 Object.freeze({id:"DEMO-PSW-002",region:"Kota Contoh",status:"aktif"}),
 Object.freeze({id:"DEMO-PSW-003",region:"Kabupaten Contoh",status:"aktif"})
]);
export const USERS=Object.freeze({
 PET:Object.freeze({id:"DEMO-USER-PET",active:true,role:"puskeswan",
   puskeswan_id:FACILITIES[0].id,region:FACILITIES[0].region}),
 PET_B:Object.freeze({id:"DEMO-USER-PETB",active:true,role:"puskeswan",
   puskeswan_id:FACILITIES[1].id,region:FACILITIES[1].region}),
 KAB:Object.freeze({id:"DEMO-USER-KAB",active:true,role:"kab_kota",
   region:FACILITIES[0].region}),
 VER:Object.freeze({id:"DEMO-USER-VER",active:true,role:"provinsi_verifikator"}),
 ADMIN:Object.freeze({id:"DEMO-USER-ADMIN",active:true,role:"provinsi_admin"}),
 LEAD:Object.freeze({id:"DEMO-USER-LEAD",active:true,role:"pimpinan"})
});
export function demoAdapters(person=USERS.PET){
 return {resolveServerSession:()=>person,
  resolveFacility:id=>FACILITIES.find(f=>f.id===id)??null};
}
export function demoReport(id=FACILITIES[0].id,period="2026-01",overrides={}){
 const base={facility_id:id,period,declared_no_activity:false,
  counts:{pengobatan:2,vaksinasi:0,penyuluhan:0,layanan_lain:0},
  investigations:[],kurban_animals:[],evidence_refs:["DEMO-BUKTI-001"]};
 return {...base,...overrides};
}
export function partialDraft(id=FACILITIES[0].id,period="2026-01"){
 return demoReport(id,period,{declared_no_activity:null,
  counts:{pengobatan:null,vaksinasi:null,penyuluhan:null,layanan_lain:null},
  evidence_refs:[]});
}
export function command(action,revision,payload={},id=FACILITIES[0].id,
 period="2026-01",suffix="1"){
 return {request_id:"DEMO-M05-REQ-"+suffix,facility_id:id,period,
  expected_revision:revision,action,payload};
}
export function startedDemo(period="2026-01"){
 const state=emptyDemoWorkflow(),adapters=demoAdapters();
 const r=applyDemoCommand(state,adapters,command("create_draft",null,
  {report:demoReport(FACILITIES[0].id,period)},FACILITIES[0].id,period,"START"));
 return r.state;
}
