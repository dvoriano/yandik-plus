import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
import {read,subscribe} from "./leadership-bridge.mjs";
import {initial,inbox,markRead,toggleMute,TYPES} from "./notification-model.mjs";
import {start,setOnline,enqueue,remoteEdit,send,resolve} from "./field-queue.mjs";
const $=id=>document.getElementById(id),el=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=String(t);return n;};
const button=(t,fn)=>{const b=el("button",t);b.type="button";b.addEventListener("click",fn);return b;};
const opts=(n,rows)=>n.replaceChildren(...rows.map(([v,l])=>new Option(l,v)));
const labels={APEL:"Pelaporan APEL",INVENTORY:"Inventaris tahunan",CORRECTION:"Koreksi laporan",COACHING:"Pembinaan",DOCUMENT:"Administrasi"};
const priorities={OVERDUE:"Lewat tenggat DEMO",TODAY:"Hari tenggat DEMO",UPCOMING:"Mendekati tenggat DEMO",TASK:"Perlu perhatian"};
let state=initial(),field=start();
function sync(){opts($("notice-facility"),[["ALL","Semua Puskeswan"],...F.filter(f=>$("notice-region").value==="ALL"||f.region_id===$("notice-region").value).map(f=>[f.facility_id,f.facility_label])]);}
function render(){try{const today=$("notice-date").value,year=+today.slice(0,4),s={today,region_id:$("notice-region").value,facility_id:$("notice-facility").value},q={...s,year};
 const names=["monthly","inventory","correction","coaching","documentTasks"],providers=Object.fromEntries(names.map(n=>[n,read(n==="coaching"?"coachingTasks":n,q)]));const v=inbox(s,providers,state);
 $("notice-status").textContent=v.items.filter(i=>!i.read).length+" belum dibaca · "+v.items.length+" tugas · "+v.mutedCount+" disembunyikan preferensi · "+(v.missing.length?"Sumber belum tersedia: "+v.missing.join(", "):"Semua provider tersedia (DEMO).");
 $("notice-preferences").replaceChildren(...TYPES.map(type=>button((state.muted.includes(type)?"Tampilkan ":"Sembunyikan ")+labels[type],()=>{state=toggleMute(state,type);render();})));
 const rows=v.items.filter(i=>!$("notice-unread").checked||!i.read);$("notice-list").replaceChildren(...(rows.length?rows.map(i=>{const a=el("article");a.className="review-card";const l=el("a","Buka panel terkait");l.href=i.href;a.append(el("h3",i.title),el("p",i.facility+" · "+priorities[i.priority]+(i.read?" · Dibaca":" · Baru")),el("p",i.detail+(i.due?" · "+i.due:"")),l,button("Tandai dibaca",()=>{state=markRead(state,i.key);render();}));return a;}):[el("p","Tidak ada pengingat yang cocok; ini bukan bukti semua kewajiban selesai.")]));
 }catch(e){$("notice-status").textContent=e.message;$("notice-list").replaceChildren();}}
function act(fn){try{field=fn();drawField();$("field-feedback").textContent="Perubahan pada simulator terisolasi.";}catch(e){$("field-feedback").textContent=e.message;}}
function drawField(){$("field-network").textContent=field.online?"Jaringan simulasi: tersedia":"Jaringan simulasi: terputus";$("field-toggle").textContent=field.online?"Simulasikan putus jaringan":"Simulasikan koneksi kembali";
 $("field-list").replaceChildren(...(field.queue.length?field.queue.map(q=>{const a=el("article");a.className="review-card";a.append(el("h3",q.id+" · "+q.status),el("p",q.facility_id+" · "+q.period+" · jumlah "+q.quantity+" · revisi dasar "+q.baseRevision),el("p","Riwayat: "+q.history.join(" → ")));if(q.receipt)a.append(el("p","Bukti simulasi: "+q.receipt.id+" · revisi "+q.receipt.revision));
 if(q.status==="PENDING"){a.append(button("Simulasikan kirim / retry",()=>act(()=>send(field,q.id))),button("Kirim dengan ACK hilang",()=>act(()=>send(field,q.id,{loseAck:true}))),button("Simulasikan perubahan sumber",()=>act(()=>remoteEdit(field,q.id,q.quantity===100000?99999:q.quantity+1))));}
 if(q.status==="CONFLICT"){a.append(el("p","Nilai sumber: "+(q.remote?.quantity??"—")+" · revisi "+(q.remote?.revision??"—")),button("Buang draf lokal DEMO",()=>act(()=>resolve(field,q.id,"discard"))),button("Buat draf baru dengan revisi sumber terkini",()=>{if(confirm("Pertahankan jumlah lokal sebagai draf baru? Tidak langsung dikirim."))act(()=>resolve(field,q.id,"requeue"));}));}return a;}):[el("p","Belum ada antrean draf simulasi.")]));}
opts($("notice-region"),[["ALL","Semua wilayah"],...new Map(F.map(f=>[f.region_id,f.region_label]))]);sync();for(const id of ["notice-date","notice-region","notice-facility","notice-unread"])$(id).addEventListener("change",()=>{if(id==="notice-region")sync();render();});$("notice-reset").addEventListener("click",()=>{state=initial();render();});subscribe(render);render();
opts($("field-facility"),F.map(f=>[f.facility_id,f.facility_label]));$("field-form").addEventListener("submit",e=>{e.preventDefault();act(()=>enqueue(field,{facility_id:$("field-facility").value,period:$("field-period").value,quantity:$("field-quantity").valueAsNumber}));});
$("field-toggle").addEventListener("click",()=>act(()=>setOnline(field,!field.online)));$("field-reset").addEventListener("click",()=>{if(confirm("Hapus antrean dan server tiruan sesi ini?"))act(start);});drawField();
