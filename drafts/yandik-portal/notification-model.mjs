/** MOD-14/M09 CODE_ONLY. No real delivery, storage, or policy authorization. */
import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
export const YEARS=[2026,2027,2028,2029,2030];
export const initial=()=>({readKeys:[],muted:[]});
export const TYPES=["APEL","INVENTORY","CORRECTION","COACHING","DOCUMENT"];
export function validDate(s){check(typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s),"Tanggal simulasi tidak sah.");const d=new Date(s+"T00:00:00Z");check(Number.isFinite(+d)&&d.toISOString().slice(0,10)===s&&YEARS.includes(+s.slice(0,4)),"Tanggal di luar 2026–2030.");return s;}
export function reportDue(period){check(/^20(?:26|27|28|29|30)-(0[1-9]|1[0-2])$/.test(period),"Periode tidak sah.");const [y,m]=period.split("-").map(Number);return new Date(Date.UTC(y,m,9)).toISOString().slice(0,10);}
function days(a,b){return Math.round((Date.parse(b+"T00:00:00Z")-Date.parse(a+"T00:00:00Z"))/86400000);}
function level(today,due){return due<today?"OVERDUE":due===today?"TODAY":"UPCOMING";}
export function inbox(scope,providers,state=initial()){
 const today=validDate(scope.today),year=+today.slice(0,4);
 check(scope.region_id==="ALL"||F.some(f=>f.region_id===scope.region_id),"Wilayah tidak dikenal.");
 const facilities=F.filter(f=>(scope.region_id==="ALL"||f.region_id===scope.region_id)&&(scope.facility_id==="ALL"||f.facility_id===scope.facility_id));
 check(facilities.length>0,"Cakupan tidak sesuai.");const ids=new Set(facilities.map(f=>f.facility_id)),items=[],missing=[];
 const get=name=>{const p=providers[name];if(p?.available!==true||!Array.isArray(p.data)){missing.push(name);return [];}return p.data.filter(r=>ids.has(r.facility_id));};
 const add=(type,r,ref,title,detail,href,due=null,revision="1")=>{const key=[type,r.facility_id,ref,revision].join("|");items.push({key,type,facility_id:r.facility_id,facility:F.find(f=>f.facility_id===r.facility_id).facility_label,title,detail,href,due,priority:due?level(today,due):"TASK",read:state.readKeys.includes(key)});};
 for(const r of get("monthly")){for(const m of r.months){if(m.status!=="BELUM_DILAPORKAN")continue;const due=reportDue(m.period);if(days(today,due)<=7&&m.period<today.slice(0,7))add("APEL",r,m.period,"Laporan belum tercatat",m.period+" · ledger DEMO, bukan status workflow","#koreksi",due);}}
 for(const r of get("inventory")){if(r.confirmed<r.total)add("INVENTORY",r,year,"Perbarui inventaris tahunan",r.confirmed+" / "+r.total+" butir dikonfirmasi; tanpa tenggat resmi","#inventaris");}
 for(const r of get("correction")){if(r.status==="CORRECTION_REQUESTED"||r.status==="REVISION_DRAFT")add("CORRECTION",r,r.period,"Perbaikan laporan",r.period+" · revisi "+r.revision+" · workflow terpisah","#koreksi",null,r.revision);}
 for(const r of get("coaching")){if(r.status==="FOLLOWUP_OPEN"&&r.due&&days(today,r.due)<=7)add("COACHING",r,r.id,"Tindak lanjut pembinaan",r.id+" · tenggat tercatat","#kegiatan",r.due,r.revision);}
 for(const r of get("documentTasks")){if(r.stale||["REVIEW","CORRECTION"].includes(r.status))add("DOCUMENT",r,r.id,r.stale?"Sumber dokumen berubah":r.status==="REVIEW"?"Draf menunggu telaah":"Dokumen perlu perbaikan",r.id+" · "+r.status,"#administrasi",null,r.revision);}
 const order={OVERDUE:0,TODAY:1,UPCOMING:2,TASK:3},unique=[...new Map(items.map(x=>[x.key,x])).values()];
 return {items:unique.filter(x=>!state.muted.includes(x.type)).sort((a,b)=>order[a.priority]-order[b.priority]||(a.due??"").localeCompare(b.due??"")||a.key.localeCompare(b.key)),missing,mutedCount:unique.filter(x=>state.muted.includes(x.type)).length};
}
export function markRead(s,key){check(typeof key==="string"&&key.length>0,"Kunci tidak sah.");return {...s,readKeys:[...new Set([...s.readKeys,key])]};}
export function toggleMute(s,type){check(TYPES.includes(type),"Kategori tidak dikenal.");return {...s,muted:s.muted.includes(type)?s.muted.filter(x=>x!==type):[...s.muted,type]};}
