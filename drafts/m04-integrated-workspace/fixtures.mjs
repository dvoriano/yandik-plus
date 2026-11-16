/** M04-I1 | KODE DITULIS, BELUM DIUJI. Master mirrors synthetic foundation IDs. */
import {startDemo,useRole} from "../../prototypes/profil-puskeswan/model.mjs";
import {saveProblem,reviewProblem} from "../../prototypes/profil-puskeswan/problems.mjs";
import {createOrEditNeed,verifyNeed} from "../../prototypes/profil-puskeswan/support_needs.mjs";
import {startWorkspace} from "./workspace.mjs";
// Explicit crosswalk only for this constructed scenario; NOT a claim that the
// independent older M04 fixtures represent the same facilities.
export const MASTER=[
 {id:"DEMO-PSW-001",support_id:"DEMO-PUSK-BRIDGE-001",name:"Puskeswan Fiktif A",region:"Kabupaten Contoh",status:"aktif"},
 {id:"DEMO-PSW-002",support_id:"DEMO-PUSK-BRIDGE-002",name:"Puskeswan Fiktif B",region:"Kota Contoh",status:"aktif"},
 {id:"DEMO-PSW-003",support_id:"DEMO-PUSK-BRIDGE-003",name:"Puskeswan Fiktif C",region:"Kabupaten Contoh",status:"aktif"}
];
export function demoState(m,verified=true){
 // Do not copy field observations of A to B/C. For those facilities, leave
 // all profile sections unknown and remove A's pending request.
 let state=startDemo();
 if(m.id!=="DEMO-PSW-001")state={...state,sections:Object.fromEntries(
  Object.keys(state.sections).map(k=>[k,{value:null,verified:false,date:null}])),requests:[],nextId:1};
 state={...state,facility:{id:m.id,name:m.name,region:m.region}};
 state=saveProblem(state,{category:"peralatan",title:"Peralatan contoh perlu dukungan",
  description:"Permasalahan fiktif untuk alur kebutuhan dan perencanaan."},"submit");
 state=reviewProblem(useRole(state,"verifikator_kab"),1,"tercatat");
 state=createOrEditNeed(useRole(state,"petugas"),{problem_id:1,category:"peralatan",
  item:"Peralatan pemeriksaan fiktif",quantity:2,unit:"unit",urgency:"tinggi",
  reason:"Bahan simulasi pengajuan berbasis permasalahan.",
  evidence:[{type:"observasi",ref:"DEMO-BUKTI-"+m.id.slice(9)}]},"submit");
 if(verified)state=verifyNeed(useRole(state,"verifikator_prov"),1,"terverifikasi",
  "Pemeriksaan metadata fiktif.",{evidenceReviewed:true});
 return useRole(state,"petugas");
}
export function demoWorkspace(){return startWorkspace(MASTER,[demoState(MASTER[0]),demoState(MASTER[1],false)]);}
