/** CODE_ONLY | Regional read-only source and separate review command. */
export const DOMAINS=Object.freeze({medicine:"Pengawasan obat hewan",practice:"Klinik dan praktik dokter hewan",surveillance:"Surveilans PHMS dan zoonosis",certificates:"Sertifikat veteriner dan lalu lintas"});
export const REASONS=Object.freeze({CHECK_SOURCE_DEMO:"Periksa sumber data",CHECK_COMPLETENESS_DEMO:"Periksa kelengkapan",DISCUSS_FOLLOWUP_DEMO:"Bahas tindak lanjut"});
export const ACTIONS=Object.freeze({request_clarification:"Minta klarifikasi",record_discussion:"Catat hasil pembahasan",reopen_discussion:"Buka kembali pembahasan"});
const title={site_ref:"Referensi lokasi",kind:"Jenis sarana",period:"Periode",evidence_count:"Jumlah metadata bukti",legal_state:"Status legalitas",location_ref:"Referensi lokasi kejadian",syndrome_tag:"Kategori sindrom",report_class:"Klasifikasi laporan",investigation_state:"Status investigasi",sample_state:"Status sampel",followup_state:"Status tindak lanjut",confirmed_cases:"Kasus terkonfirmasi",destination_region_id:"Wilayah tujuan",commodity_type:"Jenis komoditas",official_reference:"Nomor sertifikat resmi",official_issued_at:"Tanggal terbit resmi",may_issue:"Dapat menerbitkan",may_sign:"Dapat menandatangani"};
export const fmt=v=>v===null||v===undefined?"Belum tersedia":typeof v==="boolean"?v?"Ya":"Tidak":String(v).replaceAll("_"," ");
export function sourceFields(domain,observation){
 if(!Object.hasOwn(DOMAINS,domain)||!observation||observation.official_authorization!==false)throw Error("SOURCE_INVALID");
 return Object.keys(title).filter(k=>Object.hasOwn(observation,k)).map(k=>[title[k],fmt(observation[k])]);
}
export function reviewCommand(row,action,reason_code,command_id){
 if(!row?.candidate_actions?.includes(action)||!Object.hasOwn(ACTIONS,action)||!Object.hasOwn(REASONS,reason_code)||!Number.isInteger(row.review_revision)||row.review_revision<0||!/^DEMO-REGREC-[A-Z0-9_-]+$/.test(row.record_id)||!/^DEMO-COMMAND-[A-Z0-9_-]{1,40}$/.test(command_id))throw Error("REVIEW_INVALID");
 return {command_id,record_id:row.record_id,expected_revision:row.review_revision,action,reason_code};
}
export function coverageText(r){
 if(!r||r.available!==true||!Array.isArray(r.rows))return "Sumber belum tersedia; jumlah catatan tidak diketahui.";
 return r.rows.length===0?"Sumber tersedia, tidak ada catatan DEMO.":r.rows.length+" catatan sumber DEMO.";
}
export function filterRows(rows,term,state){
 return rows.filter(r=>(state==="ALL"||r.review_state===state)&&[r.record_id,r.observation.period,r.observation.site_ref,r.observation.location_ref].some(v=>String(v??"").toLowerCase().includes(term.trim().toLowerCase())));
}
