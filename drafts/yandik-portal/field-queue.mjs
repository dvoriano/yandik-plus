/** Isolated mock server and queue. Never touches APEL ledger or other module state. */
import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
import {YEARS} from "./notification-model.mjs";
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
const count=n=>Number.isSafeInteger(n)&&n>=0&&n<=100000;
const key=(f,p)=>f+"|"+p;
export const start=()=>({next:1,online:false,queue:[],server:{},receipts:{}});
function scope(f,p){check(F.some(x=>x.facility_id===f)&&/^20\d{2}-(0[1-9]|1[0-2])$/.test(p)&&YEARS.includes(+p.slice(0,4)),"Cakupan draf fiktif tidak sah.");}
export function setOnline(s,online){return {...s,online:online===true};}
export function enqueue(s,{facility_id,period,quantity}){scope(facility_id,period);check(count(quantity),"Jumlah DEMO harus bilangan bulat 0–100000.");const k=key(facility_id,period);check(!s.queue.some(q=>q.key===k&&["PENDING","CONFLICT"].includes(q.status)),"Masih ada draf terbuka pada periode ini.");const q={id:"DEMO-OFFLINE-"+s.next,key:k,facility_id,period,quantity,baseRevision:s.server[k]?.revision??0,status:"PENDING",history:["QUEUED"]};return {...s,next:s.next+1,queue:[...s.queue,q]};}
function get(s,id){const q=s.queue.find(x=>x.id===id);check(q,"Draf tidak ditemukan.");return q;}
function patch(s,q,delta,event){return {...s,queue:s.queue.map(x=>x.id===q.id?{...q,...delta,history:[...q.history,event]}:x)};}
export function remoteEdit(s,id,quantity){const q=get(s,id);check(count(quantity),"Jumlah simulasi tidak valid.");const old=s.server[q.key];return {...s,server:{...s.server,[q.key]:{revision:(old?.revision??0)+1,quantity}}};}
export function send(s,id,{loseAck=false}={}){
 const q=get(s,id);check(s.online,"Simulasi jaringan terputus.");if(q.status==="ACK_DEMO")return s;check(q.status==="PENDING","Selesaikan konflik terlebih dahulu.");
 const prior=s.receipts[id];if(prior)return patch(s,q,{status:"ACK_DEMO",receipt:prior},"ACK_REPLAY");
 const old=s.server[q.key],rev=old?.revision??0;
 if(rev!==q.baseRevision)return patch(s,q,{status:"CONFLICT",remote:{...old}},"CONFLICT");
 const receipt={id:"DEMO-ACK-"+id,revision:rev+1};const next={...s,server:{...s.server,[q.key]:{revision:rev+1,quantity:q.quantity}},receipts:{...s.receipts,[id]:receipt}};
 return loseAck?patch(next,q,{},"ACK_LOST"):patch(next,q,{status:"ACK_DEMO",receipt},"ACK");
}
export function resolve(s,id,choice){const q=get(s,id);check(q.status==="CONFLICT","Tidak ada konflik.");check(["discard","requeue"].includes(choice),"Pilihan konflik tidak sah.");const next=patch(s,q,{status:"DISCARDED_DEMO"},"DISCARD_"+choice.toUpperCase());return choice==="discard"?next:enqueue(next,{facility_id:q.facility_id,period:q.period,quantity:q.quantity});}
