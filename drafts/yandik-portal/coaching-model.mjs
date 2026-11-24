/** MOD-09 M15 CODE_ONLY, synthetic in-memory model, untested. */
import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
export const TYPES=["Pembinaan","Bimtek","Monitoring"],TOPICS=["Pelaporan APEL","Profil dan inventaris","Pelayanan veteriner","Kompetensi SDM"],OWNERS=["Tim Pembina DEMO A","Tim Pembina DEMO B"],YEARS=[2026,2027,2028,2029,2030];
export const initial=()=>({next:1,records:[]});
function ensure(ok,msg){if(!ok)throw Error(msg);}
function date(s){ensure(typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s),"Tanggal tidak valid.");const d=new Date(s+"T00:00:00Z");ensure(Number.isFinite(+d)&&d.toISOString().slice(0,10)===s&&YEARS.includes(+s.slice(0,4)),"Tanggal di luar cakupan.");return s;}
function phrase(s){ensure(typeof s==="string"&&s.trim().length>0&&s.trim().length<=300,"Catatan wajib 1–300 karakter.");return s.trim();}
function count(n){ensure(Number.isSafeInteger(n)&&n>=0&&n<=1000,"Jumlah peserta 0–1000.");return n;}
function choice(x,items){ensure(items.includes(x),"Pilihan tidak dikenal.");return x;}
export function plan(state,p){const f=F.find(f=>f.facility_id===p.facility_id);ensure(f,"Puskeswan DEMO tidak dikenal.");const r={id:"DEMO-BIMTEK-"+state.next,facility_id:f.facility_id,region_id:f.region_id,date:date(p.date),type:choice(p.type,TYPES),topic:choice(p.topic,TOPICS),owner:choice(p.owner,OWNERS),planned:count(p.planned),attendance:null,status:"PLANNED",result:null,recommendation:null,due:null,completion:null,revision:1,history:[{revision:1,action:"plan"}]};return {next:state.next+1,records:[...state.records,r]};}
export function change(state,id,expected,action,p={}){const r=state.records.find(x=>x.id===id);ensure(r&&r.revision===expected,"Catatan tidak ditemukan atau revisi berubah.");let delta;
if(action==="record"&&r.status==="PLANNED"){const due=date(p.due);ensure(due>=r.date,"Tenggat tidak sebelum kegiatan.");delta={status:"RESULT_DRAFT",attendance:count(p.attendance),result:phrase(p.result),recommendation:phrase(p.recommendation),due};}
else if(action==="review"&&r.status==="RESULT_DRAFT")delta={status:"FOLLOWUP_OPEN"};
else if(action==="return"&&r.status==="RESULT_DRAFT")delta={status:"PLANNED",attendance:null,result:null,recommendation:null,due:null};
else if(action==="close"&&r.status==="FOLLOWUP_OPEN")delta={status:"CLOSED_DEMO",completion:phrase(p.completion)};
else throw Error("Tindakan tidak tersedia.");
const revision=r.revision+1;return {...state,records:state.records.map(x=>x.id===id?{...r,...delta,revision,history:[...r.history,{revision,action,previous:{status:r.status,attendance:r.attendance,result:r.result,recommendation:r.recommendation,due:r.due,completion:r.completion}}]}:x)};}
export function list(s,{year,region_id,facility_id}){ensure(YEARS.includes(year),"Tahun tidak dikenal.");ensure(region_id==="ALL"||F.some(f=>f.region_id===region_id),"Wilayah tidak dikenal.");ensure(facility_id==="ALL"||F.some(f=>f.facility_id===facility_id&&(region_id==="ALL"||f.region_id===region_id)),"Cakupan tidak cocok.");return s.records.filter(r=>+r.date.slice(0,4)===year&&(region_id==="ALL"||r.region_id===region_id)&&(facility_id==="ALL"||r.facility_id===facility_id));}
export function summary(rows){return {activities:rows.length,planned:rows.filter(r=>r.status==="PLANNED").length,review:rows.filter(r=>r.status==="RESULT_DRAFT").length,open:rows.filter(r=>r.status==="FOLLOWUP_OPEN").length,closed:rows.filter(r=>r.status==="CLOSED_DEMO").length,attendance:rows.some(r=>r.attendance!==null)?rows.reduce((n,r)=>n+(r.attendance??0),0):null};}
