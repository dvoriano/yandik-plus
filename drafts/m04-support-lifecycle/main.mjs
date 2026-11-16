/** S13–S15 | KODE DITULIS, BELUM DIUJI. */
import {demoContext} from "./fixtures.mjs";
import {buildRealization,addShipment,addReceipt} from "./realization.mjs";
import {buildHandover,addHandover} from "./handover.mjs";
import {buildMonitoring,addObservation} from "./monitoring.mjs";
const $=id=>document.getElementById(id);
const node=(tag,value)=>{const n=document.createElement(tag);n.textContent=String(value);return n;};
let ctx,sh=[],rc=[],h=[],o=[];
const next=(prefix,arr)=>prefix+String(arr.length+1).padStart(3,"0");
const num=id=>$(id).valueAsNumber;
function card(title,lines){const n=document.createElement("article");n.className="card";
 n.append(node("strong",title),...lines.map(l=>node("p",l)));return n;}
function cards(id,items){$(id).replaceChildren(...(items.length?items:[node("p","Belum ada catatan DEMO.")]));}
function choices(id,items,form){
 const old=$(id).value;
 $(id).replaceChildren(...items.map(([v,label])=>{const n=node("option",label);n.value=v;return n;}));
 if(items.some(x=>x[0]===old))$(id).value=old;
 $(id).disabled=!items.length;
 $(form).querySelector("button[type=submit]").disabled=!items.length;
}
function models(){return {r:buildRealization(ctx,sh,rc),b:buildHandover(ctx,sh,rc,h),m:buildMonitoring(ctx,sh,rc,h,o)};}
function showLimit(){
 const m=models().m,l=m.lines.find(x=>x.handover_id+"|"+x.receipt_id===$("monitor-source").value);
 $("monitor-limit").textContent=l?"Jumlah tiga kondisi harus sama dengan "+l.eligible_quantity+" "+l.unit+".":"Belum ada barang baik yang dapat dimonitor.";
}
function render(){
 const {r,b,m}=models();
 cards("schedule-list",r.schedules.map(s=>card(s.schedule_id+" · "+s.item,[
  s.puskeswan_id+" · "+s.unit,"Jadwal "+s.scheduled+" | Kirim DEMO "+s.simulated_sent+" | Belum dikirim "+s.unsent_demo,
  "Baik "+s.simulated_good+" | Rusak "+s.simulated_damaged+" | Menunggu terima "+s.awaiting_receipt_demo])));
 choices("ship-source",r.schedules.filter(s=>s.unsent_demo>0).map(s=>[s.schedule_id,s.item+" · sisa "+s.unsent_demo+" "+s.unit]),"ship-form");
 cards("ships",r.shipments.map(s=>card(s.id,[s.item+" · "+s.quantity+" "+s.unit,
  "Tanggal "+s.date_demo+" · menunggu terima "+s.awaiting_receipt,s.note])));
 choices("receipt-source",r.shipments.filter(s=>s.awaiting_receipt>0).map(s=>[s.id,s.id+" · "+s.item+" · sisa "+s.awaiting_receipt]),"receipt-form");
 cards("receipts",r.receipts.map(x=>card(x.id,[x.item+" · "+x.date_demo,
  "Baik "+x.good+" | Rusak "+x.damaged+" "+x.unit,x.note])));
 choices("handover-source",r.receipts.filter(x=>b.uncovered_receipt_ids.includes(x.id)).map(x=>[x.id,x.id+" · "+x.puskeswan_id+" · "+x.item]),"handover-form");
 cards("handovers",b.records.map(x=>card(x.document_ref,[x.id+" · "+x.puskeswan_id,
  ...x.lines.map(l=>l.item+" · baik "+l.good+" · rusak "+l.damaged+" "+l.unit),
  "Metadata DEMO, belum disahkan atau ditandatangani."])));
 choices("monitor-source",m.lines.map(x=>[x.handover_id+"|"+x.receipt_id,x.item+" · "+x.receipt_id+" · "+x.eligible_quantity+" "+x.unit]),"monitor-form");
 cards("monitor-summary",m.quantities_by_unit.map(x=>card(x.unit,["Layak dimonitor "+x.eligible,
  "Digunakan "+x.used+" | Belum digunakan "+x.idle+" | Rusak "+x.broken,"Belum diamati "+x.unobserved])));
 cards("observations",m.observations.map(x=>card(x.date_demo+" · "+x.item,[
  x.id+" · "+x.puskeswan_id,"Digunakan "+x.used+" | Belum digunakan "+x.idle+" | Rusak "+x.broken+" "+x.unit,x.note])));
 showLimit();
}
function mutate(fn){try{fn();render();$("feedback").textContent="Catatan fiktif ditambahkan. Tidak ada tindakan resmi.";$("error").textContent="";}
 catch(e){$("error").textContent=e.message;$("feedback").textContent="";}}
function form(id,fn){$(id).addEventListener("submit",e=>{e.preventDefault();mutate(fn);});}
try{
 ctx=demoContext();render();
 form("ship-form",()=>{sh=addShipment(ctx,sh,rc,{id:next("DEMO-KIRIM-",sh),schedule_id:$("ship-source").value,
  date_demo:$("ship-date").value,quantity:num("ship-qty"),note:$("ship-note").value});});
 form("receipt-form",()=>{rc=addReceipt(ctx,sh,rc,{id:next("DEMO-TERIMA-",rc),shipment_id:$("receipt-source").value,
  date_demo:$("receipt-date").value,good:num("good"),damaged:num("damaged"),note:$("receipt-note").value});});
 form("handover-form",()=>{h=addHandover(ctx,sh,rc,h,{id:next("DEMO-SERAH-",h),receipt_ids:[$("handover-source").value],
  document_ref:next("DEMO-BAST-",h),date_demo:$("handover-date").value,note:$("handover-note").value});});
 form("monitor-form",()=>{const [handover_id,receipt_id]=$("monitor-source").value.split("|");
  o=addObservation(ctx,sh,rc,h,o,{id:next("DEMO-MON-",o),handover_id,receipt_id,
  date_demo:$("monitor-date").value,used:num("used"),idle:num("idle"),broken:num("broken"),note:$("monitor-note").value});});
 $("monitor-source").addEventListener("change",showLimit);
 $("reset").addEventListener("click",()=>mutate(()=>{sh=[];rc=[];h=[];o=[];}));
}catch(e){$("error").textContent="DEMO tidak dapat dimuat: "+e.message;document.querySelectorAll("button,input,textarea,select").forEach(x=>x.disabled=true);}
