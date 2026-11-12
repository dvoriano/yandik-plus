/** M04-S6 | DRAF BELUM DIUJI. No network, no official routing/disposition. */
import { BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,TICKET_ID_DEMO,
  COORDINATOR_DEMO,REVIEWER_DEMO,DEFAULT_NOTE } from "./fixtures.mjs";
import {
  UNIT_LABELS,ROUTING_STATUSES,routingMatrixView,suggestEscalationRoute,
  prepareRoutingNote,submitRoutingNote,reviewRoutingNote,reviseRoutingNote,
  routingNoteText,
} from "./routing_matrix.mjs";
const $=id=>document.getElementById(id);
const el=(tag,t="")=>{const node=document.createElement(tag);node.textContent=t;return node;};
const opt=(target,key,label)=>{const o=el("option",label);o.value=key;target.append(o);};
let note=null;
const matrix=routingMatrixView();
for(const row of matrix.rows){
  const tr=el("tr");
  tr.append(el("td",row.category_label),el("td",row.urgency_label),
    el("td",row.suggested_label),el("td",row.reason));
  $("matrix-rows").append(tr);
}
for(const [key,label] of Object.entries(UNIT_LABELS))opt($("unit"),key,label);
const suggestion=suggestEscalationRoute(BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,
  DOSSIER_DEMO,TICKET_ID_DEMO);
$("source").textContent="Kendala sumber "+suggestion.ticket_id+" (DEMO), kategori "+
  suggestion.category+", urgensi "+suggestion.urgency+
  ". Belum ada disposisi atau verifikasi dokumen resmi.";
$("suggestion").textContent="Saran matriks: "+suggestion.suggested_unit_label+
  " / "+suggestion.suggested_recipient_demo_id+
  ". Alasan: "+suggestion.suggestion_reason;
function form(){return {
  chosen_unit:$("unit").value,reason:$("reason").value,
  source_note:$("limits").value,
};}
function notice(msg,bad=false){$("notice").textContent=msg;$("notice").className=bad?"warning":"muted";}
function show(){
  const has=Boolean(note);
  $("status").textContent=has?
    ROUTING_STATUSES[note.status]+" · revisi "+note.revision+" · BELUM DIUJI":
    "Belum ada draf pilihan alur; saran awal tidak mengirim berkas ke mana pun.";
  $("proposal-form").hidden=has&&!["draf","perlu_perbaikan"].includes(note.status);
  $("submit").hidden=!has||note.status!=="draf";
  $("review-form").hidden=!has||note.status!=="menunggu_telaah";
  $("report").value=has?routingNoteText(note,BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,
    DOSSIER_DEMO):"";
}
$("proposal-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    note=note?.status==="perlu_perbaikan"?
      reviseRoutingNote(note,BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
        form(),COORDINATOR_DEMO):
      prepareRoutingNote(BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
        TICKET_ID_DEMO,form(),COORDINATOR_DEMO);
    show();notice("Draf alasan tersimpan di memori halaman saja, tidak diteruskan otomatis.");
  }catch(error){notice(error.message,true);}
});
$("submit").addEventListener("click",()=>{
  try{note=submitRoutingNote(note,BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
    COORDINATOR_DEMO);
    show();notice("Catatan dikirim ke antrean telaah DEMO saja.");}
  catch(error){notice(error.message,true);}
});
$("review-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{note=reviewRoutingNote(note,BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
    REVIEWER_DEMO,$("review-action").value,$("review-reason").value);
    if(note.status==="perlu_perbaikan"){
      $("unit").value=note.chosen_unit;$("reason").value=note.reason;
      $("limits").value=note.source_note;
    }
    show();notice("Hasil telaah DEMO dicatat, bukan pengesahan rute atau disposisi.");
  }catch(error){notice(error.message,true);}
});
$("reset").addEventListener("click",()=>{
  note=null;$("proposal-form").reset();$("review-form").reset();
  $("unit").value=suggestion.suggested_unit;$("reason").value=DEFAULT_NOTE.reason;
  $("limits").value=DEFAULT_NOTE.source_note;show();
  notice("Draf matriks dikosongkan dari memori; sumber kendala DEMO tidak berubah.");
});
$("unit").value=suggestion.suggested_unit;
$("reason").value=DEFAULT_NOTE.reason;
$("limits").value=DEFAULT_NOTE.source_note;
show();
