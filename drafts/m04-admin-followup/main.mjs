/** M04-S3 | BELUM DIUJI. No official task/decision, no persistence, roles DEMO. */
import { DEMO_DOSSIER,DEMO_REGISTER,DEMO_REFERENCE_ID,DEMO_PLAN } from "./fixtures.mjs";
import { TASK_TYPES,TASK_STATES,createFollowupList,createFollowupDraft,
  reviseFollowupDraft,assignFollowup,startFollowup,submitFollowupNote,
  reviewFollowupNote,cancelFollowup,followupListView,followupHandoffText,
} from "./followup.mjs";
const $=id=>document.getElementById(id);
const el=(tag,text="")=>{const node=document.createElement(tag);node.textContent=text;return node;};
const coordinator={role:"koordinator_administrasi_demo",id:"DEMO-KOORDINATOR-PROV-01"};
const reviewer={role:"penelaah_tindak_lanjut_demo",id:"DEMO-PENELAAH-FOLLOWUP-02"};
let list=createFollowupList(),selected=null;
for(const [key,label] of Object.entries(TASK_TYPES)){
  const o=el("option",label);o.value=key;$("task-type").append(o);
}
function staff(){
  const task=list.tasks.find(x=>x.id===selected);
  return {role:"petugas_tindak_lanjut_demo",
    id:task?.plan.assignee_demo_id??"DEMO-PETUGAS-ADMIN-01"};
}
function values(){return {task_type:$("task-type").value,description:$("description").value,
  expected_output:$("expected").value,assignee_demo_id:$("assignee").value.trim().toUpperCase(),
  due_date_demo:$("due").value,limitations:$("limitations").value};}
function fill(v){
  $("task-type").value=v.task_type;$("description").value=v.description;
  $("expected").value=v.expected_output;$("assignee").value=v.assignee_demo_id;
  $("due").value=v.due_date_demo;$("limitations").value=v.limitations;
}
function note(text,bad=false){$("notice").textContent=text;$("notice").className=bad?"warning":"muted";}
function render(){
  $("reference-info").textContent="Referensi fiktif "+DEMO_REFERENCE_ID+
    " berstatus metadata_tercatat (BUKAN DOKUMEN SAH), dari "+DEMO_DOSSIER.id+
    " versi "+DEMO_DOSSIER.version+". Tidak ada keputusan bantuan.";
  const rows=followupListView(list,DEMO_REGISTER,DEMO_DOSSIER);
  const t=list.tasks.find(x=>x.id===selected);
  $("task-status").textContent=t
    ? t.id+" · "+TASK_STATES[t.state]+" · revisi "+t.revision+" · BELUM DIUJI"
    : rows.length+" tugas tersimpan sementara. Pilih salah satu untuk melihat detail.";
  const ul=$("task-list");ul.replaceChildren();
  for(const row of rows){
    const li=el("li",row.id+" · "+row.type+" · "+row.state+
      " · "+row.assignee_demo_id+" · rencana "+row.due_date_demo+
      (row.source_stale?" · SUMBER BERUBAH, TUNDA":""));
    const btn=el("button","Pilih "+row.id);btn.type="button";btn.className="secondary";
    btn.addEventListener("click",()=>{selected=row.id;const item=list.tasks.find(x=>x.id===selected);
      if(item){fill(item.plan);$("completion").value=item.completion?.note??"";
        $("result-ref").value=item.completion?.evidence_ref_demo??"DEMO-CATATAN-001";}
      render();});
    li.append(el("span","  "),btn);ul.append(li);
  }
  $("plan-form").hidden=!!t&&t.state!=="draf";
  $("assign").hidden=!t||t.state!=="draf";
  $("start").hidden=!t||t.state!=="ditugaskan";
  $("completion-form").hidden=!t||!["dalam_proses","perlu_perbaikan"].includes(t.state);
  $("review-form").hidden=!t||t.state!=="menunggu_telaah";
  $("cancel").hidden=!t||["dibatalkan","ditutup_administratif"].includes(t.state);
  $("handoff").value=t?followupHandoffText(list,t.id,DEMO_REGISTER,DEMO_DOSSIER):"";
}
$("plan-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    const t=list.tasks.find(x=>x.id===selected);
    list=t?reviseFollowupDraft(list,t.id,DEMO_REGISTER,DEMO_DOSSIER,values(),coordinator)
      :createFollowupDraft(list,DEMO_REGISTER,DEMO_REFERENCE_ID,DEMO_DOSSIER,values(),coordinator);
    if(!t)selected=list.tasks.at(-1).id;
    render();note("Rencana dicatat dalam memori DEMO; belum merupakan penugasan dinas.");
  }catch(err){note(err.message,true);}
});
$("assign").addEventListener("click",()=>{
  try{list=assignFollowup(list,selected,DEMO_REGISTER,DEMO_DOSSIER,coordinator);
    render();note("Penugasan hanya tercatat di simulasi, bukan perintah dinas.");}
  catch(err){note(err.message,true);}
});
$("start").addEventListener("click",()=>{
  try{list=startFollowup(list,selected,DEMO_REGISTER,DEMO_DOSSIER,staff());
    render();note("Penyusunan catatan administrasi DEMO dimulai.");}
  catch(err){note(err.message,true);}
});
$("completion-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{list=submitFollowupNote(list,selected,DEMO_REGISTER,DEMO_DOSSIER,staff(),
    $("completion").value,$("result-ref").value.trim().toUpperCase());
    render();note("Catatan dikirim untuk telaah; belum ada konfirmasi eksternal.");}
  catch(err){note(err.message,true);}
});
$("review-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{list=reviewFollowupNote(list,selected,DEMO_REGISTER,DEMO_DOSSIER,reviewer,
    $("review-action").value,$("review-reason").value);
    render();note("Hanya catatan kerja yang ditelaah. Tidak ada pengesahan bantuan.");}
  catch(err){note(err.message,true);}
});
$("cancel").addEventListener("click",()=>{
  // Text is supplied explicitly by the coordinator; no automatic cancellation.
  const reason=$("limitations").value;
  try{list=cancelFollowup(list,selected,DEMO_REGISTER,DEMO_DOSSIER,coordinator,reason);
    render();note("Rencana fiktif dibatalkan dengan alasan dari kolom batas pemeriksaan.");}
  catch(err){note(err.message,true);}
});
$("new").addEventListener("click",()=>{
  selected=null;$("plan-form").reset();fill(DEMO_PLAN);render();
  note("Siapkan rencana baru. Rencana lama tetap ada dalam memori halaman.");$("task-type").focus();
});
fill(DEMO_PLAN);render();
