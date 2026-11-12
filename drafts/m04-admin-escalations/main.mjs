/** M04-S5 DRAF/BELUM DIUJI. In-memory forms, no network, no login. */
import { TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,TASK_ID_DEMO,
  REPORTER_DEMO,COORDINATOR_DEMO,RECEIVER_DEMO,REVIEWER_DEMO,
  COMPLAINT_DEMO,ROUTE_DEMO,RESPONSE_DEMO } from "./fixtures.mjs";
import { CATEGORIES,URGENCY,STATES,createEscalationBook,openEscalation,
  reviseEscalation,reportEscalation,routeEscalation,respondEscalation,
  reviewEscalation,cancelEscalation,escalationList,escalationSummary,
  escalationHandoff } from "./escalations.mjs";
const $=id=>document.getElementById(id);
const e=(tag,value="")=>{const item=document.createElement(tag);item.textContent=value;return item};
const option=(select,key,value)=>{const o=e("option",value);o.value=key;select.append(o);};
let book=createEscalationBook(),selected=null;
for(const [k,v] of Object.entries(CATEGORIES))option($("category"),k,v);
for(const [k,v] of Object.entries(URGENCY))option($("urgency"),k,v);
option($("state-filter"),"all","Semua status");
for(const [k,v] of Object.entries(STATES))option($("state-filter"),k,v);
function data(){return {
  category:$("category").value,urgency:$("urgency").value,
  description:$("description").value,effect_on_work:$("effect").value,
  attempted_steps:$("attempted").value,needed_action:$("needed").value,
  evidence_ref_demo:$("evidence").value.trim().toUpperCase(),
};}
function notify(value,bad=false){
  $("notice").textContent=value;$("notice").className=bad?"warning":"muted";
}
function selectedTicket(){return book.tickets.find(t=>t.id===selected);}
function fillDetail(d){
  $("category").value=d.category;$("urgency").value=d.urgency;
  $("description").value=d.description;$("effect").value=d.effect_on_work;
  $("attempted").value=d.attempted_steps;$("needed").value=d.needed_action;
  $("evidence").value=d.evidence_ref_demo;
}
function fillDemo(){
  fillDetail(COMPLAINT_DEMO);$("recipient").value=ROUTE_DEMO.recipient_demo_id;
  $("due").value=ROUTE_DEMO.due_date_demo;$("instruction").value=ROUTE_DEMO.instruction;
  $("response").value=RESPONSE_DEMO.response;
  $("remaining").value=RESPONSE_DEMO.remaining_blocker;
  $("response-evidence").value=RESPONSE_DEMO.evidence_ref_demo;
}
function metric(box,num,label){
  const item=e("div");item.className="metric";
  item.append(e("strong",String(num)),e("span",label));box.append(item);
}
function render(){
  const referenceDate=$("as-of").value||"2026-11-11";
  const summary=escalationSummary(book,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,referenceDate);
  const rows=escalationList(book,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,referenceDate);
  const container=$("metrics");container.replaceChildren();
  metric(container,summary.total,"Seluruh kendala DEMO");
  metric(container,summary.aktif,"Kendala administratif aktif");
  metric(container,summary.menunggu_koordinator,"Menunggu koordinator");
  metric(container,summary.menunggu_tanggapan,"Menunggu penerima");
  metric(container,summary.perlu_klarifikasi,"Perlu klarifikasi");
  metric(container,summary.sumber_berubah_aktif,"Sumber berubah (aktif)");
  metric(container,summary.lewat_tanggal_demonstrasi,"Lewat tanggal rencana DEMO");
  metric(container,summary.ditutup_administratif,"Catatan administratif ditutup");
  $("source-info").textContent="Tugas sumber "+TASK_ID_DEMO+
    " (DEMO), referensi metadata M04-S2, belum diperiksa resmi.";
  const ticket=selectedTicket();
  $("status").textContent=ticket
    ? selected+" · "+STATES[ticket.state]+" · revisi "+ticket.revision+
      ". Status ini BUKAN persetujuan bantuan."
    : "Belum ada catatan yang dipilih. Semua data sementara.";
  const list=$("tickets");list.replaceChildren();
  for(const row of rows.filter(r=>$("state-filter").value==="all"||
    r.state===$("state-filter").value)){
    const li=e("li",row.id+" · "+row.category_label+" · "+row.state_label+
      " · "+row.urgency_label+" · "+row.attention);
    const choose=e("button","Pilih "+row.id);choose.type="button";
    choose.className="secondary";choose.addEventListener("click",()=>{
      selected=row.id;const t=selectedTicket();
      if(t)fillDetail(t.details);render();
    });
    li.append(e("span","  "),choose);list.append(li);
  }
  $("obstacle-form").hidden=!!ticket&&ticket.state!=="draf";
  $("report").hidden=!ticket||ticket.state!=="draf";
  $("route-form").hidden=!ticket||ticket.state!=="dilaporkan";
  $("response-form").hidden=!ticket||!["diteruskan","perlu_klarifikasi"].includes(ticket.state);
  $("review-form").hidden=!ticket||ticket.state!=="ditanggapi";
  $("cancel-form").hidden=!ticket||!["dilaporkan","diteruskan","perlu_klarifikasi"].includes(ticket.state);
  $("handoff").value=ticket
    ?escalationHandoff(book,ticket.id,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO):"";
}
$("obstacle-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    const t=selectedTicket();
    book=t?reviseEscalation(book,t.id,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
      data(),REPORTER_DEMO):openEscalation(book,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
      TASK_ID_DEMO,data(),REPORTER_DEMO);
    if(!t)selected=book.tickets.at(-1).id;
    render();notify("Draf kendala DEMO dicatat dalam memori halaman saja.");
  }catch(error){notify(error.message,true);}
});
$("report").addEventListener("click",()=>{
  try{book=reportEscalation(book,selected,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,REPORTER_DEMO);
    render();notify("Laporan kendala DEMO disampaikan untuk koordinasi saja.");}
  catch(error){notify(error.message,true);}
});
$("route-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{book=routeEscalation(book,selected,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,{
      recipient_demo_id:$("recipient").value.trim().toUpperCase(),
      due_date_demo:$("due").value,instruction:$("instruction").value,
    },COORDINATOR_DEMO);
    render();notify("Kendala diteruskan hanya dalam simulasi. Tidak mengirim surat/notifikasi.");}
  catch(error){notify(error.message,true);}
});
$("response-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{book=respondEscalation(book,selected,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,{
      response:$("response").value,remaining_blocker:$("remaining").value,
      evidence_ref_demo:$("response-evidence").value.trim().toUpperCase(),
    },RECEIVER_DEMO);
    render();notify("Tanggapan administrasi DEMO dicatat, belum konfirmasi resmi.");}
  catch(error){notify(error.message,true);}
});
$("review-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{book=reviewEscalation(book,selected,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
      $("review-action").value,$("review-reason").value,REVIEWER_DEMO);
    render();notify("Catatan sudah ditelaah, bukan keputusan bantuan/keabsahan surat.");}
  catch(error){notify(error.message,true);}
});
$("cancel-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{book=cancelEscalation(book,selected,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
      $("cancel-reason").value,COORDINATOR_DEMO);
    $("cancel-reason").value="";render();notify("Pembatalan kendala DEMO dicatat.");}
  catch(error){notify(error.message,true);}
});
$("new").addEventListener("click",()=>{
  selected=null;$("obstacle-form").reset();fillDemo();render();
  notify("Form kendala baru siap; catatan lama tetap di memori halaman.");
  $("category").focus();
});
$("state-filter").addEventListener("change",()=>{
  try{render();}catch(error){notify(error.message,true);}
});
$("as-of").addEventListener("change",()=>{
  try{render();}catch(error){notify(error.message,true);}
});
fillDemo();
try{render();}catch(error){notify("Rancangan belum diuji: "+error.message,true);}
