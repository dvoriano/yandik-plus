/** M06-S1 | Fictional, not a list of licensed medicine businesses. */
export const DEMO_MEDICINE_SITES=Object.freeze([
 {site_id:"DEMO-MED-ALPHA",site_label:"Sarana Obat DEMO Alpha",
  region_label:"Wilayah DEMO Utara",kind:"DISTRIBUSI_DEMO",
  source_ref:"DEMO-SOURCE-MED-A",legal_state:"NOT_VERIFIED_DEMO"},
 {site_id:"DEMO-MED-BETA",site_label:"Sarana Obat DEMO Beta",
  region_label:"Wilayah DEMO Utara",kind:"PENJUALAN_DEMO",
  source_ref:"DEMO-SOURCE-MED-B",legal_state:"NOT_VERIFIED_DEMO"},
 {site_id:"DEMO-MED-GAMMA",site_label:"Sarana Obat DEMO Gamma",
  region_label:"Wilayah DEMO Selatan",kind:"PENYIMPANAN_DEMO",
  source_ref:"DEMO-SOURCE-MED-C",legal_state:"NOT_VERIFIED_DEMO"}
]);
const checks=(values)=>[
 "PENCATATAN_DOKUMEN","PENYIMPANAN","PENCATATAN_PERSEDIAAN",
 "PENANGANAN_KEDALUWARSA"
].map((check,i)=>({check,observation:values[i]}));
export function buildDemoMedicineFixture(){
 return {
  sites:DEMO_MEDICINE_SITES.map(x=>({...x})),
  inspections:[
   {inspection_id:"DEMO-INSPECT-A1",site_id:"DEMO-MED-ALPHA",
    period:"2026-09",checklist_version:"DEMO-CHECKLIST-UNAPPROVED-1",
    review_state:"PENDING_HUMAN_REVIEW_DEMO",
    answers:checks(["OBSERVED_DEMO","NEEDS_CLARIFICATION_DEMO",
     "OBSERVED_DEMO","NOT_ASSESSED_DEMO"]),
    evidence_refs:["DEMO-EVIDENCE-A1"]},
   {inspection_id:"DEMO-INSPECT-C1",site_id:"DEMO-MED-GAMMA",
    period:"2027-02",checklist_version:"DEMO-CHECKLIST-UNAPPROVED-1",
    review_state:"PENDING_HUMAN_REVIEW_DEMO",
    answers:checks(["OBSERVED_DEMO","OBSERVED_DEMO",
     "OBSERVED_DEMO","OBSERVED_DEMO"]),
    evidence_refs:[]}
  ],
  synthetic:true
 };
}
export function demoMedicineSession(role="kab_kota",region="Wilayah DEMO Utara"){
 return {resolveServerSession:()=>({
  id:"DEMO-USER-"+role.toUpperCase(),active:true,role,region,
  ...(role==="puskeswan"?{puskeswan_id:"DEMO-PSW-ALPHA"}:{})
 })};
}
