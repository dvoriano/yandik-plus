/** M04-S9 | DEMO BELUM DIUJI. In-memory forms, no API or official approval. */
import {
  DOCKET_DEMO,SOP_DEMO,COORDINATOR_DEMO,STAFF_DEMO,REVIEWER_TL_DEMO,EXAMPLE_PLAN,
} from "./fixtures.mjs";
import {
  FINDING_KINDS,FOLLOWUP_STATES,createInstitutionalFollowupRegister,
  createFollowupFinding,reviseFollowupFinding,recordFinding,startFollowupFinding,
  addProgressNote,submitFindingResult,reviewFindingResult,cancelFollowupFinding,
  institutionalFollowupView,institutionalFollowupHandoff,
} from "./followup_register.mjs";
import { REQUIREMENTS, CHANGE_STATES } from "../m04-sop-governance/governance.mjs";

const $=id=>document.getElementById(id);
const el=(tag,t="")=>{const node=document.createElement(tag);node.textContent=t;return node;};
const opt=(target,value,label)=>{const o=el("option",label);o.value=value;target.append(o);};
let book=createInstitutionalFollowupRegister(),selected=null;
for(const [k,v] of Object.entries(FINDING_KINDS))opt($("kind"),k,v);
for(const [k,v] of Object.entries(FOLLOWUP_STATES))opt($("status-filter"),k,v);
const all=el("option","Semua status");all.value="all";
$("status-filter").prepend(all);$("status-filter").value="all";
function populateRefs(prefer=null){
  const kind=$("kind").value,options=$("source-options"),field=$("source-ref");
  options.replaceChildren();
  const codes=[];
  function add(value,label){opt(options,value,label);codes.push(value);}
  if(kind==="syarat_kelembagaan"){
    for(const rule of REQUIREMENTS){
      const record=DOCKET_DEMO.checklist.find(x=>x.id===rule.id);
      if(record&&["belum_diperiksa","perlu_klarifikasi"].includes(record.status))
        add(rule.id,rule.title+" ("+record.status+")");
    }
  }else if(kind==="usulan_katalog"){
    for(const change of DOCKET_DEMO.changes)
      add(change.id,change.input.unit_key+" · "+CHANGE_STATES[change.status]);
  }else{
    add("DEMO-BAHAS-KELEMBAGAAN-01","Contoh topik diskusi tambahan");
  }
  field.value=prefer??(codes[0]??"");
}
function values(){
  return {
    kind:$("kind").value,source_ref:$("source-ref").value,
    description:$("description").value,impact:$("impact").value,
    corrective_plan:$("plan").value,expected_output:$("deliverable").value,
    assignee_demo_id:$("assignee").value.trim().toUpperCase(),
    due_date_demo:$("due").value,
  };
}
function fill(p){
  $("kind").value=p.kind;populateRefs(p.source_ref);
  $("description").value=p.description;$("impact").value=p.impact;
  $("plan").value=p.corrective_plan;$("deliverable").value=p.expected_output;
  $("assignee").value=p.assignee_demo_id;$("due").value=p.due_date_demo;
}
function say(text,bad=false){
  $("notice").textContent=text;$("notice").className=bad?"warning":"muted";
}
function current(){return book.items.find(x=>x.id===selected);}
function render(){
  const data=institutionalFollowupView(book,DOCKET_DEMO,SOP_DEMO,
    $("as-of").value||"2026-11-11");
  const metrics=$("metrics");metrics.replaceChildren();
  for(const [n,label] of [
    [data.total,"Seluruh catatan DEMO"],[data.open,"Rencana masih aktif"],
    [data.waiting_review,"Menunggu telaah"],[data.needs_revision,"Perlu perbaikan"],
    [data.overdue_demo,"Aktif lewat tanggal DEMO"],[data.stale_open,"Sumber berubah"],
    [data.closed_notes,"Catatan administratif ditutup"],
  ]){
    const box=el("div");box.className="metric";
    box.append(el("strong",String(n)),el("span",label));metrics.append(box);
  }
  $("source-info").textContent="M04-S8: "+DOCKET_DEMO.status+
    " (DEMO) · versi "+DOCKET_DEMO.revision+
    ". Hasil telaah hanya bahan diskusi dan belum menjadi keputusan kelembagaan.";
  const item=current();
  $("status").textContent=item?item.id+" · "+FOLLOWUP_STATES[item.status]+
    " · revisi "+item.revision+" · BELUM DIUJI":
    "Belum memilih catatan. Total "+data.total+" catatan DEMO.";
  const list=$("items");list.replaceChildren();
  const visible=data.rows.filter(row=>$("status-filter").value==="all"||
    row.status===$("status-filter").value);
  for(const row of visible){
    const li=el("li",row.id+" · "+row.source_label+" · "+row.status_label+
      " · petugas "+row.assignee_demo_id+" · tanggal "+row.due_date_demo+
      (row.source_stale?" · SUMBER BERUBAH":"")+
      (row.overdue_demo?" · LEWAT TANGGAL DEMO":""));
    const btn=el("button","Lihat "+row.id);btn.type="button";
    btn.className="secondary";
    btn.addEventListener("click",()=>{
      selected=row.id;const t=current();
      if(t){fill(t.plan);$("result-note").value=t.result?.note??"";
        $("result-evidence").value=t.result?.evidence_ref_demo??"DEMO-BUKTI-HASIL-001";}
      render();
    });
    li.append(el("span","  "),btn);list.append(li);
  }
  if(visible.length===0)list.append(el("li","Belum ada item yang cocok dengan filter DEMO."));
  $("finding-form").hidden=!!item&&item.status!=="draf";
  $("record").hidden=!item||item.status!=="draf";
  $("start").hidden=!item||item.status!=="tercatat";
  $("progress-form").hidden=!item||!["dalam_proses","perlu_perbaikan"].includes(item.status);
  $("result-form").hidden=!item||item.status!=="dalam_proses";
  $("review-form").hidden=!item||item.status!=="menunggu_telaah";
  $("cancel-form").hidden=!item||["catatan_ditutup","dibatalkan"].includes(item.status);
  $("handoff").value=item?institutionalFollowupHandoff(book,item.id,DOCKET_DEMO,SOP_DEMO):"";
}
$("kind").addEventListener("change",()=>populateRefs());
$("finding-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    const item=current();
    book=item?reviseFollowupFinding(book,item.id,DOCKET_DEMO,SOP_DEMO,values(),COORDINATOR_DEMO):
      createFollowupFinding(book,DOCKET_DEMO,SOP_DEMO,values(),COORDINATOR_DEMO);
    if(!item)selected=book.items.at(-1).id;
    render();say("Rencana koreksi DEMO disimpan, belum menjadi keputusan atau tugas dinas.");
  }catch(error){say(error.message,true);}
});
$("record").addEventListener("click",()=>{
  try{book=recordFinding(book,selected,DOCKET_DEMO,SOP_DEMO,COORDINATOR_DEMO);
    render();say("Penanggung jawab DEMO dicatat, bukan penugasan resmi.");}
  catch(error){say(error.message,true);}
});
$("start").addEventListener("click",()=>{
  try{
    const item=current();
    book=startFollowupFinding(book,selected,DOCKET_DEMO,SOP_DEMO,{
      ...STAFF_DEMO,id:item.plan.assignee_demo_id,
    });
    render();say("Catatan pelaksanaan DEMO dimulai.");
  }catch(error){say(error.message,true);}
});
$("progress-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    const item=current();
    book=addProgressNote(book,selected,DOCKET_DEMO,SOP_DEMO,
      {...STAFF_DEMO,id:item.plan.assignee_demo_id},
      $("progress-note").value,$("progress-evidence").value.trim().toUpperCase());
    $("progress-note").value="";render();
    say("Progres hanya dicatat sebagai keterangan administratif.");
  }catch(error){say(error.message,true);}
});
$("result-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    const item=current();
    book=submitFindingResult(book,selected,DOCKET_DEMO,SOP_DEMO,
      {...STAFF_DEMO,id:item.plan.assignee_demo_id},
      $("result-note").value,$("result-evidence").value.trim().toUpperCase());
    render();say("Hasil disampaikan untuk pemeriksaan catatan, bukan siap integrasi.");
  }catch(error){say(error.message,true);}
});
$("review-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    book=reviewFindingResult(book,selected,DOCKET_DEMO,SOP_DEMO,
      REVIEWER_TL_DEMO,$("decision").value,$("reason").value);
    render();say("Telaah catatan DEMO selesai. Kesiapan integrasi belum dinilai.");
  }catch(error){say(error.message,true);}
});
$("cancel-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    book=cancelFollowupFinding(book,selected,DOCKET_DEMO,SOP_DEMO,
      COORDINATOR_DEMO,$("cancel-reason").value);
    $("cancel-reason").value="";render();
    say("Rencana DEMO dibatalkan dengan alasan; sumber belum diubah.");
  }catch(error){say(error.message,true);}
});
$("new").addEventListener("click",()=>{
  selected=null;$("finding-form").reset();
  fill(EXAMPLE_PLAN);render();say("Form baru siap, histori item sebelumnya tetap di memori halaman.");
  $("kind").focus();
});
$("as-of").addEventListener("change",()=>{
  try{render();}catch(error){say(error.message,true);}
});
$("status-filter").addEventListener("change",()=>{
  try{render();}catch(error){say(error.message,true);}
});
fill(EXAMPLE_PLAN);
try{render();}catch(error){say("Kode rancangan belum diuji: "+error.message,true);}
