/** M07-S1 | Fictional clinics and practices; no people or license numbers. */
export const DEMO_PRACTICES=Object.freeze([
 {practice_id:"DEMO-PRACTICE-ALPHA",
  practice_label:"Sarana Praktik DEMO Alpha",
  region_label:"Wilayah DEMO Utara",kind:"KLINIK_DEMO",
  source_ref:"DEMO-SOURCE-PRACTICE-A",
  documentation_state:"NOT_VERIFIED_DEMO"},
 {practice_id:"DEMO-PRACTICE-BETA",
  practice_label:"Sarana Praktik DEMO Beta",
  region_label:"Wilayah DEMO Utara",kind:"PRAKTIK_MANDIRI_DEMO",
  source_ref:"DEMO-SOURCE-PRACTICE-B",
  documentation_state:"NOT_VERIFIED_DEMO"},
 {practice_id:"DEMO-PRACTICE-GAMMA",
  practice_label:"Sarana Praktik DEMO Gamma",
  region_label:"Wilayah DEMO Selatan",kind:"KLINIK_DEMO",
  source_ref:"DEMO-SOURCE-PRACTICE-C",
  documentation_state:"NOT_VERIFIED_DEMO"}
]);
const keys=["DOKUMEN_ADMINISTRASI_DEMO","FASILITAS_PELAYANAN_DEMO",
 "CATATAN_LAYANAN_DEMO","KEBERSIHAN_RUANG_DEMO",
 "TINDAK_LANJUT_INTERNAL_DEMO"];
const answers=values=>keys.map((check_id,i)=>({
 check_id,observation:values[i]
}));
export function demoPracticeFixtures(){
 return {
  practices:DEMO_PRACTICES.map(x=>({...x})),
  visits:[
   {visit_id:"DEMO-PVISIT-A1",practice_id:"DEMO-PRACTICE-ALPHA",
    period:"2026-09",
    checklist_version:"DEMO-PRACTICE-CHECKLIST-UNAPPROVED-1",
    review_state:"INTERNAL_REVIEW_PENDING_DEMO",
    answers:answers(["OBSERVED_DEMO","OBSERVED_DEMO",
      "REVIEW_REQUIRED_DEMO","OBSERVED_DEMO","NOT_ASSESSED_DEMO"]),
    evidence_refs:["DEMO-EVIDENCE-PRACTICE-1"]},
   {visit_id:"DEMO-PVISIT-C1",practice_id:"DEMO-PRACTICE-GAMMA",
    period:"2027-03",
    checklist_version:"DEMO-PRACTICE-CHECKLIST-UNAPPROVED-1",
    review_state:"INTERNAL_REVIEW_PENDING_DEMO",
    answers:answers(["OBSERVED_DEMO","OBSERVED_DEMO",
      "OBSERVED_DEMO","OBSERVED_DEMO","OBSERVED_DEMO"]),
    evidence_refs:[]}
  ],
  synthetic:true,no_person_data:true
 };
}
export function practiceDemoSession(role="kab_kota",
 region="Wilayah DEMO Utara"){
 return {resolveServerSession:()=>({
  id:"DEMO-USER-"+role.toUpperCase(),role,active:true,region,
  ...(role==="puskeswan"?{puskeswan_id:"DEMO-PSW-ALPHA"}:{})
 })};
}
