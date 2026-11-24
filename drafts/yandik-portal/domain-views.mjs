/** K5 | Existing domain validators, not browser security or live records. */
export const REGIONS=Object.freeze(["Wilayah DEMO Utara","Wilayah DEMO Selatan"]);
export const DOMAINS=Object.freeze(["medicine","practice","surveillance","certificate"]);
const col=(label,key)=>({label,key});
const views={
 medicine:{title:"Pengawasan Obat Hewan",source:"M06-S1",columns:[
  col("Sarana","site_label"),col("Jenis","kind"),col("Status legal","legal_state"),
  col("Kunjungan tercatat","visit_count_demo"),col("Bulan terakhir","latest_visit_month"),
  col("Perlu klarifikasi","latest_clarification_checks"),col("Bahan telaah","review_hint_demo")]},
 practice:{title:"Klinik & Praktik Dokter Hewan",source:"M07-S1",columns:[
  col("Sarana","practice_label"),col("Jenis","kind"),col("Dokumentasi","documentation_state"),
  col("Kunjungan tercatat","recorded_visit_count_demo"),col("Bulan terakhir","last_recorded_visit_month"),
  col("Butir perlu telaah","last_review_checks"),col("Bahan telaah","review_material_state")]},
 surveillance:{title:"PHMS, Zoonosis & Surveilans",source:"M13-S1",columns:[
  col("Event","event_id"),col("Bulan","period"),col("Sindrom","syndrome_tag"),
  col("Laporan","report_class"),col("Investigasi","investigation_state"),
  col("Sampel","sample_state"),col("Tindak lanjut","followup_state")]},
 certificate:{title:"Sertifikat Veteriner & Lalu Lintas",source:"M14-S1",columns:[
  col("Permohonan","request_id"),col("Bulan","period"),col("Asal","origin_region_label"),
  col("Tujuan","destination_region_label"),col("Komoditas","commodity_type"),
  col("Tahap internal","internal_stage"),col("Perlu klarifikasi","clarification_fields_demo")]}
};
async function loadDomain(domain,region,detailId=null){
 if(!DOMAINS.includes(domain)||!REGIONS.includes(region))throw Error("DEMO_DOMAIN_SCOPE_INVALID");
 const spec=views[domain];let register,detail;
 // Dynamic imports isolate a failed module from the rest of the portal.
 if(domain==="medicine"){
  const [m,f]=await Promise.all([import("../m06-medicine-oversight/medicine.mjs"),import("../m06-medicine-oversight/fixtures.mjs")]);
  const args={...f.buildDemoMedicineFixture(),...f.demoMedicineSession("kab_kota",region),region_label:region};
  register=m.buildDemoMedicineOverview(args);
  if(detailId!==null)detail=m.buildDemoMedicineReviewPacket({...args,site_id:detailId});
 }else if(domain==="practice"){
  const [m,f]=await Promise.all([import("../m07-practice-oversight/practice.mjs"),import("../m07-practice-oversight/fixtures.mjs")]);
  const args={...f.demoPracticeFixtures(),...f.practiceDemoSession("kab_kota",region),region_label:region};
  register=m.buildDemoPracticeRegister(args);
  if(detailId!==null)detail=m.buildDemoPracticeReview({...args,practice_id:detailId});
 }else if(domain==="surveillance"){
  // This existing fixture has only a North manifest. No source != zero events.
  if(region!==REGIONS[0])return {...spec,region,available:false,rows:null,
   note:"Snapshot surveilans DEMO untuk wilayah ini belum tersedia."};
  const [m,f]=await Promise.all([import("../m13-surveillance/surveillance.mjs"),import("../m13-surveillance/fixtures.mjs")]);
  const args={...f.demoSurveillanceFixtures(),...f.demoSurveillanceAdapters({role:"kab_kota",region}),region_label:region};
  register=m.buildDemoSurveillanceRegister(args);
  if(detailId!==null)detail=m.buildDemoEventReview({...args,event_id:detailId});
 }else{
  const [m,f]=await Promise.all([import("../m14-certificate-register/register.mjs"),import("../m14-certificate-register/fixtures.mjs")]);
  const args={...f.demoCertificateFixtures(),...f.certificateDemoSession("kab_kota",region),region_label:region};
  register=m.buildDemoCertificateRegister(args);
  if(detailId!==null)detail=m.buildDemoCertificateReview({...args,request_id:detailId});
 }
 if(register.synthetic!==true||register.official_authorization!==false||
    register.region_label!==region||!Array.isArray(register.rows))
  throw Error("DEMO_REGISTER_INVALID");
 const key={medicine:"site_id",practice:"practice_id",surveillance:"event_id",certificate:"request_id"}[domain];
 const label={medicine:"site_label",practice:"practice_label",surveillance:"event_id",certificate:"request_id"}[domain];
 if(detailId!==null){
  if(!register.rows.some(row=>row[key]===detailId)||detail?.synthetic!==true||
     detail.official_authorization!==false||detail.may_write!==false)throw Error("DEMO_DETAIL_DENIED");
  return projectDetail(domain,spec,detail);
 }
 return {...spec,region,available:true,
  items:register.rows.map(row=>({id:row[key],label:row[label]})),
   // Explicit allowlist projection, not arbitrary raw record serialization.
   rows:register.rows.map(row=>spec.columns.map(c=>row[c.key]??null)),
   official_authorization:false,may_write:false};
}

export async function readDomain(domain,region){return loadDomain(domain,region);}
export async function readDomainDetail(domain,region,id){
 if(typeof id!=="string"||!/^DEMO-[A-Z0-9_-]{1,50}$/.test(id))throw Error("DEMO_DETAIL_ID_INVALID");
 const result=await loadDomain(domain,region,id);
 if(result.available!==true||!Array.isArray(result.fields))throw Error("DEMO_DETAIL_UNAVAILABLE");
 return result;
}
function projectDetail(domain,spec,d){
 let item,groups=[],extra=[];
 if(domain==="medicine"){
  item=d.site;
  groups=d.visit_history.map(v=>({title:"Kunjungan "+v.period+" · "+v.inspection_id,
   columns:["Butir checklist","Pengamatan"],rows:v.answer_statuses.map(a=>[a.check,a.observation])}));
  extra=[["Usulan bahan tindak lanjut",d.proposed_followup?.type??null]];
 }else if(domain==="practice"){
  item=d.practice;
  groups=d.visits.map(v=>({title:"Kunjungan "+v.period+" · "+v.visit_id,
   columns:["Butir checklist","Pengamatan"],rows:v.answer_statuses.map(a=>[a.check_id,a.observation])}));
  extra=[["Bahan telaah",d.review_packet.proposed_topic],["Status telaah",d.review_packet.status]];
 }else if(domain==="surveillance"){
  item=d.event;extra=[["Usulan telaah",d.suggested_review.type],["Status",d.suggested_review.status],
   ["Bukti tercatat (DEMO)",item.evidence_ref_count_demo]];
 }else{
  item=d.request;groups=[{title:"Persyaratan internal",columns:["Butir","Status"],
   rows:d.review_fields.map(f=>[f.field_id,f.state])}];
  extra=[["Status telaah",d.review_note.status],["Rujukan sertifikat resmi",null]];
 }
 return {title:spec.title+" · bahan telaah",available:true,synthetic:true,
  note:"Catatan fiktif, belum diverifikasi dan tidak memberi keputusan resmi.",
  fields:[...spec.columns.map(c=>[c.label,item[c.key]??null]),...extra],
  groups,official_authorization:false,may_write:false};
}
