/** M04-S12 | KODE DITULIS, BELUM DIUJI. In-memory only. */
import {NEEDS,DEMO_PACKAGES,demoReview} from "./fixtures.mjs";
import {buildDistributionPlan,saveSchedule,removeSchedule,METHODS} from "./distribution.mjs";
const $=id=>document.getElementById(id);
const node=(tag,value,cls)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=String(value);if(cls)n.className=cls;return n;};
const key=x=>x.package_id+"|"+x.need_id;
let reviews=[],rows=[],editing=null,serial=1;
function feedback(message,error=false){$("feedback").textContent=message;$("feedback").dataset.error=String(error);}
function plan(){return buildDistributionPlan(NEEDS,DEMO_PACKAGES,reviews,rows);}
function limit(){
 const line=plan().lines.find(l=>key(l)===$("line").value),old=rows.find(r=>r.id===editing);
 const max=line?line.unscheduled_quantity+(old&&key(old)===key(line)?old.quantity:0):0;
 $("quantity").max=String(max);
 $("limit").textContent="Batas pada draf ini: "+max+(line?" "+line.unit:"")+"; bukan stok tersedia.";
 $("schedule-form").querySelector("button[type=submit]").disabled=max<1;
}
function clearEdit(){
 editing=null;$("form-title").textContent="Tambah draf jadwal";
 $("quantity").value="";$("cancel").disabled=true;
}
function edit(row){
 editing=row.id;$("form-title").textContent="Ubah "+row.id;
 $("line").value=key(row);$("date").value=row.date_demo;
 $("method").value=row.method;$("quantity").value=String(row.quantity);
 $("cancel").disabled=false;limit();$("date").focus();feedback("");
}
function render(){
 const p=plan();
 $("units").replaceChildren(...p.quantities_by_unit.map(u=>node("div",
 u.unit+": "+u.scheduled_quantity+" dijadwalkan · "+u.unscheduled_quantity+" belum dijadwalkan dari "+u.package_quantity,"card")));
 $("lines").replaceChildren(...p.lines.map(l=>{
 const d=node("article",undefined,"card");d.append(node("small",l.puskeswan_id+" · "+l.region_demo),
 node("strong",l.item),node("p","Paket: "+l.package_quantity+" "+l.unit),
 node("p",l.eligible_for_demo_schedule?"Draf jadwal: "+l.scheduled_quantity+" · Sisa: "+l.unscheduled_quantity+" "+l.unit:"Belum dapat dijadwalkan"));return d;}));
 const previous=$("line").value;
 const eligible=p.lines.filter(l=>l.eligible_for_demo_schedule);
 $("line").replaceChildren(...eligible.map(l=>{const o=node("option",l.item+" · "+l.puskeswan_id);o.value=key(l);return o;}));
 if(eligible.some(l=>key(l)===previous))$("line").value=previous;
 $("line").disabled=!eligible.length;
 $("schedules").replaceChildren(...p.schedules.map(r=>{
 const d=node("article",undefined,"card"),a=node("button","Ubah","secondary"),b=node("button","Hapus draf","secondary");
 a.type=b.type="button";a.addEventListener("click",()=>edit(r));
 b.addEventListener("click",()=>apply(()=>removeSchedule(NEEDS,DEMO_PACKAGES,reviews,rows,r.id)));
 const buttons=node("div",undefined,"actions");buttons.append(a,b);
 d.append(node("small",r.date_demo+" · "+r.id),node("strong",r.item),
 node("p",r.puskeswan_id+" · "+r.quantity+" "+r.unit),node("p",METHODS[r.method]),
 node("p","DRAF · belum ada izin ataupun pengiriman aktual"),buttons);return d;}));
 if(!p.schedules.length)$("schedules").append(node("p","Belum ada jadwal DEMO."));
 $("warnings").replaceChildren(...p.warnings.map(s=>node("li",s)));
 limit();
}
function apply(fn){
 try{const next=fn();rows=next;clearEdit();render();feedback("Draf jadwal diperbarui di memori; bukan penyaluran.");}
 catch(e){feedback(e.message,true);}
}
function reset(){reviews=[demoReview()];rows=[];serial=1;clearEdit();render();feedback("Simulasi dimulai ulang.");}
try{
 reset();
 $("line").addEventListener("change",limit);
 $("cancel").addEventListener("click",()=>{clearEdit();limit();feedback("");});
 $("schedule-form").addEventListener("submit",e=>{
  e.preventDefault();const line=plan().lines.find(l=>key(l)===$("line").value);
  if(!line)return;
  const newId=editing??"DEMO-JADWAL-"+String(serial).padStart(3,"0");
  const form={id:newId,package_id:line.package_id,need_id:line.need_id,
   date_demo:$("date").value,method:$("method").value,quantity:$("quantity").valueAsNumber};
  const newRow=editing===null;
  apply(()=>{const next=saveSchedule(NEEDS,DEMO_PACKAGES,reviews,rows,form);if(newRow)serial++;return next;});
 });
 $("reset").addEventListener("click",()=>{try{reset();}catch(e){feedback(e.message,true);}});
}catch(e){
 $("error").textContent="DEMO tidak dapat dimuat: "+e.message;
 for(const el of $("schedule-form").querySelectorAll("button,input,select"))el.disabled=true;
}
