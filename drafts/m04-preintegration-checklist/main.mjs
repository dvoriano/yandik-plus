/** M04-S9F | KODE DITULIS, BELUM DIUJI. DEMO read-only. */
import {BOARD_DEMO,CONTEXT_DEMO} from "./fixtures.mjs";
import {buildPreintegrationChecklist,checklistText,STATES}
  from "./checklist.mjs";
const $=id=>document.getElementById(id);
const el=(tag,label="")=>{const n=document.createElement(tag);n.textContent=String(label);return n;};
let report;
try{
  report=buildPreintegrationChecklist(BOARD_DEMO,CONTEXT_DEMO);
  for(const [key,label] of Object.entries(report.groups)){
    const option=el("option",label);option.value=key;$("group").append(option);
  }
  for(const [key,label] of Object.entries(STATES)){
    const option=el("option",label);option.value=key;$("status").append(option);
  }
  $("totals").textContent="Prasyarat "+report.totals.checks+
    " · butuh keputusan "+report.totals.needs_decision+
    " · bukti belum diperiksa "+report.totals.needs_proof+
    " · menunggu izin uji "+report.totals.awaiting_qa+
    " · terverifikasi resmi: 0";
  $("repo").textContent="Repository: "+report.source.repo_snapshot.visibility.toUpperCase()+
    " (snapshot "+report.source.repo_snapshot.observed_on+
    "). Rencana PRIVATE 14 Nov 2026 belum dilaksanakan pada snapshot.";
  $("summary").value=checklistText(report);
  const waves=$("waves");
  for(const wave of report.waves){
    const li=el("li");
    li.append(el("strong",wave.id+" · "+wave.title),
      el("p","Syarat: "+wave.prerequisites),
      el("p","Ruang lingkup: "+wave.scope),
      el("p","Status: "+wave.status));
    waves.append(li);
  }
}catch(error){
  $("errors").textContent="Gagal menyusun daftar DEMO: "+error.message;
}
function render(){
  if(!report)return;
  const group=$("group").value,status=$("status").value;
  const rows=report.requirements.filter(x=>
    (group==="all"||x.group===group)&&(status==="all"||x.status===status));
  const list=$("items");list.replaceChildren();
  for(const item of rows){
    const li=el("li");
    li.append(el("strong",item.id+" · "+item.title),
      el("p",item.group_label+" · "+STATES[item.status]),
      el("p","Bukti diperlukan: "+item.proof),
      el("p","Pengampu yang diusulkan: "+item.owner_suggestion),
      el("p","Rujukan: "+item.source),
      el("p",item.context_alert||"Belum ada pembuktian resmi."));
    list.append(li);
  }
  if(!rows.length)list.append(el("li","Tidak ada item yang sesuai filter DEMO."));
}
for(const id of ["group","status"])$(id).addEventListener("change",render);
render();
