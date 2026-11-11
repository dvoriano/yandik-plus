/** M04-S4 | DRAF BELUM DIUJI. Read-only, no external calls or storage. */
import { TASK_STATES } from "../m04-admin-followup/followup.mjs";
import { ATTENTION, buildFollowupDashboard, dashboardText } from "./dashboard.mjs";
import { DEMO_AS_OF_DATE,DEMO_TASKS_DASHBOARD,DEMO_REGISTER_DASHBOARD,
  DEMO_DOSSIER_DASHBOARD } from "./fixtures.mjs";
const $=id=>document.getElementById(id);
const el=(tag,t="")=>{const e=document.createElement(tag);e.textContent=t;return e};
function option(select,value,label){const o=el("option",label);o.value=value;select.append(o);}
option($("status"),"all","Semua status");
for(const [key,label] of Object.entries(TASK_STATES))option($("status"),key,label);
for(const [key,label] of Object.entries(ATTENTION))option($("attention"),key,label);
option($("assignee"),"all","Semua penanggung jawab DEMO");
const assignees=[...new Set(DEMO_TASKS_DASHBOARD.tasks.map(x=>x.plan.assignee_demo_id))].sort();
for(const id of assignees)option($("assignee"),id,id);
function query(){return {as_of_demo:$("as-of").value,state:$("status").value,
  attention:$("attention").value,assignee_demo_id:$("assignee").value};}
function metric(box,n,label){const item=el("div");item.className="metric";
  item.append(el("strong",String(n)),el("span",label));box.append(item);}
function render(){
  const result=buildFollowupDashboard(DEMO_TASKS_DASHBOARD,
    DEMO_REGISTER_DASHBOARD,DEMO_DOSSIER_DASHBOARD,query());
  const s=result.summary;
  const box=$("metrics");box.replaceChildren();
  metric(box,s.total,"Seluruh tugas DEMO");
  metric(box,s.aktif,"Tugas administratif aktif");
  metric(box,s.perlu_perbaikan,"Catatan perlu diperbaiki");
  metric(box,s.menunggu_telaah,"Catatan menunggu telaah");
  metric(box,s.overdue_open,"Aktif lewat tanggal rencana");
  metric(box,s.due_today_open,"Aktif jatuh tempo pada tanggal acuan");
  metric(box,s.open_source_stale,"Aktif dengan sumber berubah");
  metric(box,s.ditutup_administratif,"Catatan ditutup administratif");
  metric(box,s.dibatalkan,"Rencana dibatalkan");
  $("global-status").textContent="Tanggal acuan: "+result.as_of_demo+
    " (DEMO). Penutupan catatan tidak berarti bantuan disetujui.";
  const tbody=$("task-rows");tbody.replaceChildren();
  for(const row of result.rows){
    const tr=el("tr");
    const first=el("td",row.id+" · "+row.task_label);
    first.append(el("small","Referensi "+row.reference_id+
      " | "+row.document_ref_demo));
    tr.append(first,el("td",row.assignee_demo_id),
      el("td",row.due_date_demo),el("td",row.state_label),
      el("td",row.attention_label));
    tbody.append(tr);
  }
  $("empty").hidden=result.rows.length!==0;
  $("filter-status").textContent="Menampilkan "+result.displayed+" dari "+s.total+
    " tugas contoh. Ringkasan di atas tetap berdasarkan semua tugas.";
  $("report").value=dashboardText(result);
}
$("filters").addEventListener("submit",event=>{
  event.preventDefault();
  try{render();}
  catch(error){$("filter-status").textContent="Filter belum dapat diproses: "+error.message;}
});
$("reset").addEventListener("click",()=>{
  $("filters").reset();$("as-of").value=DEMO_AS_OF_DATE;
  try{render();}
  catch(error){$("filter-status").textContent="Rancangan belum diuji: "+error.message;}
});
$("as-of").value=DEMO_AS_OF_DATE;
try{render();}
catch(error){$("filter-status").textContent="Dashboard rancangan belum diuji: "+error.message;}
