/** CODE_ONLY | UI projection helpers, never authorize server actions. */
export const ROLES=["puskeswan","kab_kota","provinsi_admin","provinsi_verifikator","pimpinan"];
const COMMON=["layanan","profil-sdm","inventaris","dukungan","kegiatan","administrasi","wilayah","pustaka"];
export function menus(role){
 if(!ROLES.includes(role))return [];
 if(role==="pimpinan")return ["pimpinan","pustaka"];
 if(role==="puskeswan")return [...COMMON,"notifikasi","mode-lapangan"];
 return [...COMMON,"pengawasan","pimpinan"];
}
export const FIELDS=["pengobatan","vaksinasi","penyuluhan","layanan_lain"];
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
export function scope(core,selection={}){
 check(core&&ROLES.includes(core.role_demo)&&Array.isArray(core.facilities),"IDENTITY_UNAVAILABLE");
 const fs=core.facilities;check(fs.every(f=>/^DEMO-PSW-[A-Z0-9_-]+$/.test(f.facility_id)&&/^DEMO-REGION-[A-Z0-9_-]+$/.test(f.region_id)),"MASTER_INVALID");
 check(new Set(fs.map(f=>f.facility_id)).size===fs.length,"MASTER_DUPLICATE");
 const year=selection.year??2026,month=selection.month??1;
 check(Number.isInteger(year)&&year>=2026&&year<=2030&&Number.isInteger(month)&&month>=1&&month<=12,"PERIOD_INVALID");
 const f=fs.find(f=>f.facility_id===selection.facility_id)??fs[0]??null;
 return {year,month,facility_id:f?.facility_id??null,region_id:f?.region_id??"ALL"};
}
export function reportCommand(record,counts,activities,noActivity,commandId){
 check(record?.synthetic===true&&record.candidate_actions?.includes("save_draft")&&Number.isInteger(record.revision),"DRAFT_UNAVAILABLE");
 check(FIELDS.every(k=>Number.isSafeInteger(counts[k])&&counts[k]>=0&&counts[k]<=100000),"COUNTS_INVALID");
 check(typeof noActivity==="boolean"&&/^DEMO-COMMAND-[A-Z0-9_-]{1,40}$/.test(commandId),"COMMAND_INVALID");
 const prior=activities??{investigations:[],kurban_animals:[],evidence_refs:[]};
 const total=FIELDS.reduce((n,k)=>n+counts[k],0)+prior.investigations.length+prior.kurban_animals.length;
 check(noActivity===(total===0),"EXPLICIT_ZERO_REQUIRED");
 return {command_id:commandId,record_id:record.record_id,expected_revision:record.revision,action:"save_draft",reason_code:null,payload:{facility_id:record.facility_id,period:record.period,declared_no_activity:noActivity,counts:Object.fromEntries(FIELDS.map(k=>[k,counts[k]])),investigations:structuredClone(prior.investigations),kurban_animals:structuredClone(prior.kurban_animals),evidence_refs:structuredClone(prior.evidence_refs)}};
}
export function workflowCommand(record,action,commandId){
 check(record?.candidate_actions?.includes(action)&&["submit","return_correction","record_review"].includes(action),"ACTION_UNAVAILABLE");
 return {command_id:commandId,record_id:record.record_id,expected_revision:record.revision,action,payload:null,reason_code:action==="return_correction"?"CHECK_COUNTS_DEMO":action==="record_review"?"REVIEW_RECORDED_DEMO":null};
}
export const shown=v=>v===null||v===undefined?"Belum tersedia":typeof v==="boolean"?(v?"Ya":"Tidak"):String(v).replaceAll("_"," ");
export function chooseApel(profile,month){return profile?.apel?.workflow_refs?.find(x=>x.month===month)?.record_id??null;}
