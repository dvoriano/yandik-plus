/**
 * M04-S7 | BELUM DIUJI. UI renders DEMO unit catalog + human-reviewed
 * SOP preparation note. No official SOP, network, or delivery.
 */
import { BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO,
  ROUTE_NOTE_DEMO,PROCESS_OWNER_DEMO,SOP_REVIEWER_DEMO,DEFAULT_PROPOSAL_DEMO,
} from "./fixtures.mjs";
import {
  ROLES,UNITS,SOP_STATES,unitCatalog,responsibilityMatrix,
  prepareCoordinationDraft,submitCoordinationDraft,reviewCoordinationDraft,
  reviseCoordinationDraft,coordinationDraftText,
} from "./unit_catalog.mjs";
const $=id=>document.getElementById(id);
const el=(tag,text="")=>{const n=document.createElement(tag);n.textContent=text;return n;};
let draft=null;
const catalog=unitCatalog();
for(const unit of catalog.units){
  const tr=el("tr");
  tr.append(el("td",unit.label+" / "+unit.id),
    el("td",unit.role),el("td",unit.boundary));
  $("catalog-rows").append(tr);
}
const raci=responsibilityMatrix();
for(const a of raci.activities){
  const tr=el("tr");
  tr.append(el("td",a.label),el("td",ROLES[a.R]),el("td",ROLES[a.A]),
    el("td",a.C.map(x=>ROLES[x]).join("; ")),
    el("td",a.I.map(x=>ROLES[x]).join("; ")));
  $("raci-rows").append(tr);
}
const key=ROUTE_NOTE_DEMO.chosen_unit;
const opt=el("option",UNITS[key].label+" / "+UNITS[key].id);
opt.value=key;$("unit").append(opt);
$("source").textContent="Sumber M04-S6 "+ROUTE_NOTE_DEMO.id+" (DEMO), "+
  "status: "+ROUTE_NOTE_DEMO.status+". Pilihan unit: "+
  UNITS[key].label+". Ini bukan disposisi atau SOP yang disahkan.";
function fields(){
  return {unit_key:key,
    coordination_scope:$("scope").value,
    minimum_checks:$("minimum").value,
    exception_path:$("exception").value,
    recordkeeping_note:$("records").value,
    review_day_demo:$("review-date").value,
    rationale:$("rationale").value,
  };
}
function load(p){
  $("scope").value=p.coordination_scope;
  $("minimum").value=p.minimum_checks;
  $("exception").value=p.exception_path;
  $("records").value=p.recordkeeping_note;
  $("review-date").value=p.review_day_demo;
  $("rationale").value=p.rationale;
}
function message(t,bad=false){$("notice").textContent=t;$("notice").className=bad?"warning":"muted";}
function render(){
  $("status").textContent=draft?
    SOP_STATES[draft.status]+" · revisi "+draft.revision+" · BELUM DIUJI":
    "Belum ada naskah. Katalog dan matriks di atas hanya usulan DEMO.";
  $("draft-form").hidden=!!draft&&!["draf","perlu_perbaikan"].includes(draft.status);
  $("submit").hidden=!draft||draft.status!=="draf";
  $("review-form").hidden=!draft||draft.status!=="menunggu_telaah";
  $("handoff").value=draft?coordinationDraftText(draft,ROUTE_NOTE_DEMO,
    BOOK_DEMO,TASKS_DEMO,REGISTER_DEMO,DOSSIER_DEMO):"";
}
$("draft-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    draft=draft?.status==="perlu_perbaikan"?
      reviseCoordinationDraft(draft,ROUTE_NOTE_DEMO,BOOK_DEMO,TASKS_DEMO,
        REGISTER_DEMO,DOSSIER_DEMO,fields(),PROCESS_OWNER_DEMO):
      prepareCoordinationDraft(ROUTE_NOTE_DEMO,BOOK_DEMO,TASKS_DEMO,
        REGISTER_DEMO,DOSSIER_DEMO,fields(),PROCESS_OWNER_DEMO);
    render();message("Naskah DEMO tersimpan sementara, belum disahkan atau dikirim.");
  }catch(error){message(error.message,true);}
});
$("submit").addEventListener("click",()=>{
  try{
    draft=submitCoordinationDraft(draft,ROUTE_NOTE_DEMO,BOOK_DEMO,TASKS_DEMO,
      REGISTER_DEMO,DOSSIER_DEMO,PROCESS_OWNER_DEMO);
    render();message("Draf diserahkan untuk telaah DEMO saja, bukan pengesahan.");
  }catch(error){message(error.message,true);}
});
$("review-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    draft=reviewCoordinationDraft(draft,ROUTE_NOTE_DEMO,BOOK_DEMO,TASKS_DEMO,
      REGISTER_DEMO,DOSSIER_DEMO,SOP_REVIEWER_DEMO,
      $("action").value,$("review-reason").value);
    if(draft.status==="perlu_perbaikan")load(draft.proposal);
    render();message("Catatan telaah DEMO tersimpan tanpa keputusan SOP resmi.");
  }catch(error){message(error.message,true);}
});
$("reset").addEventListener("click",()=>{
  draft=null;$("draft-form").reset();$("review-form").reset();
  load(DEFAULT_PROPOSAL_DEMO);render();
  message("Naskah konsep DEMO dikosongkan; sumber dan unit katalog tidak berubah.");
});
load(DEFAULT_PROPOSAL_DEMO);
render();
