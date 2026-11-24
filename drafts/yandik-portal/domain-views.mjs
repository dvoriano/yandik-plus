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
export async function readDomain(domain,region){
 if(!DOMAINS.includes(domain)||!REGIONS.includes(region))throw Error("DEMO_DOMAIN_SCOPE_INVALID");
 const spec=views[domain];let register;
 // Dynamic imports isolate a failed module from the rest of the portal.
 if(domain==="medicine"){
  const [m,f]=await Promise.all([import("../m06-medicine-oversight/medicine.mjs"),import("../m06-medicine-oversight/fixtures.mjs")]);
  register=m.buildDemoMedicineOverview({...f.buildDemoMedicineFixture(),
   ...f.demoMedicineSession("kab_kota",region),region_label:region});
 }else if(domain==="practice"){
  const [m,f]=await Promise.all([import("../m07-practice-oversight/practice.mjs"),import("../m07-practice-oversight/fixtures.mjs")]);
  register=m.buildDemoPracticeRegister({...f.demoPracticeFixtures(),
   ...f.practiceDemoSession("kab_kota",region),region_label:region});
 }else if(domain==="surveillance"){
  // This existing fixture has only a North manifest. No source != zero events.
  if(region!==REGIONS[0])return {...spec,region,available:false,rows:null,
   note:"Snapshot surveilans DEMO untuk wilayah ini belum tersedia."};
  const [m,f]=await Promise.all([import("../m13-surveillance/surveillance.mjs"),import("../m13-surveillance/fixtures.mjs")]);
  register=m.buildDemoSurveillanceRegister({...f.demoSurveillanceFixtures(),
   ...f.demoSurveillanceAdapters({role:"kab_kota",region}),region_label:region});
 }else{
  const [m,f]=await Promise.all([import("../m14-certificate-register/register.mjs"),import("../m14-certificate-register/fixtures.mjs")]);
  register=m.buildDemoCertificateRegister({...f.demoCertificateFixtures(),
   ...f.certificateDemoSession("kab_kota",region),region_label:region});
 }
 if(register.synthetic!==true||register.official_authorization!==false||
    register.region_label!==region||!Array.isArray(register.rows))
  throw Error("DEMO_REGISTER_INVALID");
 return {...spec,region,available:true,
   // Explicit allowlist projection, not arbitrary raw record serialization.
   rows:register.rows.map(row=>spec.columns.map(c=>row[c.key]??null)),
   official_authorization:false,may_write:false};
}
