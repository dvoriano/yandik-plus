/** M14-S1 | Invented applications. NOT certificate numbers, QR or signatures. */
const fields=(values)=>[
 "INFORMASI_ASAL_DEMO","INFORMASI_KOMODITAS_DEMO",
 "INFORMASI_TUJUAN_DEMO","DOKUMEN_PENDUKUNG_DEMO"
].map((field_id,i)=>({field_id,state:values[i]}));
export function demoCertificateFixtures(){
 return {requests:[
  {request_id:"DEMO-CERT-REQ-ALPHA",period:"2026-10",
   origin_region_label:"Wilayah DEMO Utara",
   destination_region_label:"Wilayah DEMO Selatan",
   commodity_type:"HEWAN_HIDUP_DEMO",
   source_ref:"DEMO-SOURCE-CERT-A",
   internal_stage:"INTERNAL_REVIEW_PENDING_DEMO",
   review_template_version:"DEMO-INTAKE-TEMPLATE-UNAPPROVED-1",
   requirements:fields(["PRESENT_UNVERIFIED_DEMO","PRESENT_UNVERIFIED_DEMO",
     "NOT_ASSESSED_DEMO","NEEDS_CLARIFICATION_DEMO"]),
   official_reference:null,official_issued_at:null},
  {request_id:"DEMO-CERT-REQ-BETA",period:"2026-11",
   origin_region_label:"Wilayah DEMO Utara",
   destination_region_label:"Wilayah DEMO Utara",
   commodity_type:"PRODUK_HEWAN_DEMO",
   source_ref:"DEMO-SOURCE-CERT-B",
   internal_stage:"DRAFT_DEMO",
   review_template_version:"DEMO-INTAKE-TEMPLATE-UNAPPROVED-1",
   requirements:fields(["NOT_ASSESSED_DEMO","NOT_ASSESSED_DEMO",
     "NOT_ASSESSED_DEMO","NOT_ASSESSED_DEMO"]),
   official_reference:null,official_issued_at:null},
  {request_id:"DEMO-CERT-REQ-GAMMA",period:"2027-02",
   origin_region_label:"Wilayah DEMO Selatan",
   destination_region_label:"Wilayah DEMO Utara",
   commodity_type:"HEWAN_HIDUP_DEMO",
   source_ref:"DEMO-SOURCE-CERT-C",
   internal_stage:"NEEDS_CLARIFICATION_DEMO",
   review_template_version:"DEMO-INTAKE-TEMPLATE-UNAPPROVED-1",
   requirements:fields(["PRESENT_UNVERIFIED_DEMO","PRESENT_UNVERIFIED_DEMO",
     "PRESENT_UNVERIFIED_DEMO","NEEDS_CLARIFICATION_DEMO"]),
   official_reference:null,official_issued_at:null}
 ],synthetic:true,contains_applicant_data:false};
}
export function certificateDemoSession(role="kab_kota",
 region="Wilayah DEMO Utara"){
 return {resolveServerSession:()=>({
  id:"DEMO-USER-"+role.toUpperCase(),role,active:true,region,
  ...(role==="puskeswan"?{puskeswan_id:"DEMO-PSW-ALPHA"}:{})
 })};
}
