/** M04-S8 | BELUM DIUJI. UI only, no network/localStorage or official approval. */
import { SOP_SOURCE_DEMO,PREPARER_DEMO,REVIEWER_DEMO,CHANGE_DEMO } from "./fixtures.mjs";
import {
  REQUIREMENTS,CHECK_STATES,CHANGE_TYPES,CHANGE_STATES,
  createGovernanceDocket,recordRequirement,proposeCatalogChange,
  submitCatalogChange,reviewCatalogChange,submitGovernanceDocket,
  reviewGovernanceDocket,governanceBoard,governanceHandoff,
} from "./governance.mjs";
import { unitCatalog } from "../m04-unit-catalog/unit_catalog.mjs";
const $=id=>document.getElementById(id);
const el=(tag,value="")=>{const node=document.createElement(tag);node.textContent=value;return node;};
function option(target,key,label){const x=el("option",label);x.value=key;target.append(x);}
const catalog=unitCatalog();
let docket=createGovernanceDocket(SOP_SOURCE_DEMO,PREPARER_DEMO);
let selectedChange=null;
for(const r of REQUIREMENTS)option($("check-id"),r.id,r.title+(r.mandatory?" (wajib)":" (opsional)"));
for(const [key,label] of Object.entries(CHECK_STATES))option($("check-status"),key,label);
for(const [key,label] of Object.entries(CHANGE_TYPES))option($("change-type"),key,label);
for(const u of catalog.units)option($("change-unit"),u.unit_key,u.label);
function message(value,bad=false){$("notice").textContent=value;$("notice").className=bad?"warning":"muted";}
function metric(target,num,label){const box=el("div");box.className="metric";
  box.append(el("strong",String(num)),el("span",label));target.append(box);}
function fillUnit(){
  const type=$("change-type").value;
  const adding=type==="tambah";
  $("change-unit").hidden=adding;$("new-key-label").hidden=!adding;
  const unit=catalog.units.find(x=>x.unit_key===$("change-unit").value);
  const fields=adding?{id:"DEMO-UNIT-BARU-01",
    label:"Unit administrasi contoh baru (DEMO)",
    role:"Menyiapkan perumusan tugas administratif yang perlu dibahas dalam simulasi.",
    boundary:"Tidak menerbitkan keputusan resmi atau menyetujui dana pengadaan.",
    precondition:"Pemetaan struktur organisasi dan kewenangan masih harus disepakati.",
    example_contact:"DEMO-KONTAK-BARU-01"}:unit;
  if(!fields)return;
  $("unit-id").value=fields.id;$("unit-label").value=fields.label;
  $("unit-role").value=fields.role;$("unit-boundary").value=fields.boundary;
  $("unit-precondition").value=fields.precondition;$("unit-contact").value=fields.example_contact;
  for(const id of ["unit-id","unit-label","unit-role","unit-boundary","unit-precondition","unit-contact"])
    $(id).disabled=type==="nonaktifkan";
}
function fillImpact(){
  $("reason").value=CHANGE_DEMO.reason;
  $("routes").value=CHANGE_DEMO.impact_routes;
  $("raci").value=CHANGE_DEMO.impact_raci;
  $("sop-impact").value=CHANGE_DEMO.impact_sop;
  $("rollback").value=CHANGE_DEMO.rollback_note;
}
function changePayload(){
  return {
    type:$("change-type").value,
    unit_key:$("change-type").value==="tambah"?
      $("new-key").value.trim().toLowerCase():$("change-unit").value,
    candidate:{id:$("unit-id").value.trim().toUpperCase(),
      label:$("unit-label").value,role:$("unit-role").value,
      boundary:$("unit-boundary").value,
      precondition:$("unit-precondition").value,
      example_contact:$("unit-contact").value.trim().toUpperCase()},
    reason:$("reason").value,impact_routes:$("routes").value,
    impact_raci:$("raci").value,impact_sop:$("sop-impact").value,
    rollback_note:$("rollback").value,
  };
}
function render(){
  const b=governanceBoard(docket,SOP_SOURCE_DEMO);
  $("source").textContent="Bahan naskah M04-S7 "+docket.source.sop_id+
    " revisi "+docket.source.sop_revision+" dan katalog DEMO v"+
    docket.source.catalog_version+". Belum ada pengesahan SOP.";
  $("status").textContent=b.status_label+
    " · versi "+docket.revision+
    " · unsur wajib belum tersedia "+b.mandatory_pending+
    " · sumber berubah: "+(b.source_changed?"YA":"tidak terdeteksi (DEMO)")+".";
  const metrics=$("metrics");metrics.replaceChildren();
  metric(metrics,b.total,"Unsur kelembagaan");
  metric(metrics,b.by_state.bahan_tersedia,"Bahan contoh tersedia");
  metric(metrics,b.mandatory_pending,"Unsur wajib belum tersedia");
  metric(metrics,b.pending_changes,"Usulan unit menunggu kajian");
  metric(metrics,b.catalog_change_count,"Usulan katalog DEMO");
  const tbody=$("requirements");tbody.replaceChildren();
  for(const item of b.items){
    const tr=el("tr");
    tr.append(el("td",item.title),el("td",item.mandatory?"Wajib":"Opsional"),
      el("td",CHECK_STATES[item.status]));
    tbody.append(tr);
  }
  const changes=$("changes");changes.replaceChildren();
  for(const change of b.changes){
    const li=el("li",change.id+" · "+change.type+" · "+change.unit_key+
      " · "+change.status);
    const choose=el("button","Pilih "+change.id);
    choose.type="button";choose.className="secondary";
    choose.addEventListener("click",()=>{selectedChange=change.id;render();});
    li.append(el("span","  "),choose);changes.append(li);
  }
  const selected=docket.changes.find(x=>x.id===selectedChange);
  $("change-submit").hidden=!selected||selected.status!=="draf";
  $("change-review").hidden=!selected||selected.status!=="menunggu_telaah";
  const editable=["draf","perlu_perbaikan"].includes(docket.status);
  $("check-form").hidden=!editable;
  $("change-form").hidden=!editable;
  $("readiness-submit").hidden=!editable;
  $("readiness-review").hidden=docket.status!=="menunggu_telaah";
  $("handoff").value=governanceHandoff(docket,SOP_SOURCE_DEMO);
}
$("check-id").addEventListener("change",()=>{
  const item=docket.checklist.find(x=>x.id===$("check-id").value);
  if(item){$("check-status").value=item.status;
    $("check-note").value=item.note;$("check-evidence").value=item.reference_demo;}
});
$("check-status").addEventListener("change",()=>{
  $("check-evidence").disabled=$("check-status").value!=="bahan_tersedia";
  if($("check-evidence").disabled)$("check-evidence").value="";
});
$("check-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    docket=recordRequirement(docket,SOP_SOURCE_DEMO,$("check-id").value,
      $("check-status").value,$("check-evidence").value.trim().toUpperCase(),
      $("check-note").value,PREPARER_DEMO);
    render();message("Pemeriksaan unsur DEMO dicatat; belum diverifikasi atau disahkan.");
  }catch(error){message(error.message,true);}
});
$("change-type").addEventListener("change",fillUnit);
$("change-unit").addEventListener("change",fillUnit);
$("change-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    docket=proposeCatalogChange(docket,SOP_SOURCE_DEMO,changePayload(),PREPARER_DEMO);
    selectedChange=docket.changes.at(-1).id;render();
    message("Usulan perubahan dicatat. Katalog dasar M04-S7 TIDAK diubah.");
  }catch(error){message(error.message,true);}
});
$("change-submit").addEventListener("click",()=>{
  try{
    docket=submitCatalogChange(docket,SOP_SOURCE_DEMO,selectedChange,PREPARER_DEMO);
    render();message("Usulan katalog hanya diserahkan untuk telaah DEMO.");
  }catch(error){message(error.message,true);}
});
$("change-review").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    docket=reviewCatalogChange(docket,SOP_SOURCE_DEMO,selectedChange,REVIEWER_DEMO,
      $("change-action").value,$("change-review-note").value);
    render();message("Kajian unit dicatat, bukan perubahan katalog yang berlaku.");
  }catch(error){message(error.message,true);}
});
$("readiness-submit").addEventListener("click",()=>{
  try{
    docket=submitGovernanceDocket(docket,SOP_SOURCE_DEMO,PREPARER_DEMO);
    render();message("Checklist diajukan untuk pemeriksaan DEMO, bukan pengesahan SOP.");
  }catch(error){message(error.message,true);}
});
$("readiness-review").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    docket=reviewGovernanceDocket(docket,SOP_SOURCE_DEMO,REVIEWER_DEMO,
      $("readiness-action").value,$("readiness-review-note").value);
    render();message("Catatan telaah kelembagaan tersimpan sebagai bahan diskusi saja.");
  }catch(error){message(error.message,true);}
});
fillUnit();fillImpact();
$("check-status").value="perlu_klarifikasi";
$("check-evidence").disabled=true;
$("check-note").value="Dasar kelembagaan masih memerlukan pencocokan dengan aturan dan penanggung jawab proses resmi.";
render();
