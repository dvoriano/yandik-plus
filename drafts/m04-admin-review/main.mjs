/** M04-S1 | DRAF/BELUM DIUJI. No server, no authorization, no official decisions. */
import { NEED_SAMPLES } from "./fixtures.mjs";
import {
  REQUIREMENTS, CHECK_STATUSES, STATUSES,
  createDossier, reviseDossier, submitDossier, reviewDossier,
  handoffNote, pendingRequirements,
} from "./dossier.mjs";
const $=id=>document.getElementById(id);
const node=(tag,text="")=>{const el=document.createElement(tag);el.textContent=text;return el};
const maker={role:"penyusun_prov_demo",id:"DEMO-PENYUSUN-PROV-01"};
const reviewer={role:"penelaah_administrasi_demo",id:"DEMO-PENELAAH-PROV-02"};
let dossier=null; // deliberately memory-only
for(const need of NEED_SAMPLES){
  const opt=node("option",need.item+" · "+need.region_demo);
  opt.value=need.need_id;$("source").append(opt);
}
for(const req of REQUIREMENTS){
  const label=node("label",req.label);
  label.setAttribute("for","check-"+req.id);
  const select=node("select");
  select.id="check-"+req.id;select.dataset.requirement=req.id;
  for(const [key,value] of Object.entries(CHECK_STATUSES)){
    const o=node("option",value);o.value=key;select.append(o);
  }
  select.value="belum_ada";label.append(select);$("checklist").append(label);
}
function need(){
  return NEED_SAMPLES.find(n=>n.need_id===$("source").value);
}
function note(message,fail=false){
  $("notice").textContent=message;
  $("notice").className=fail?"warning":"muted";
}
function sourceText(){
  const n=need();
  $("source-description").textContent=n
    ? n.need_id+" · "+n.puskeswan_id+" · status sumber: "+n.status+
      " · prioritas: "+(n.priority_band??"belum dinilai")+
      ". Prioritas hanya informasi, bukan dasar persetujuan."
    : "Sumber contoh belum dipilih.";
}
function data(){
  return {
    purpose:$("purpose").value,technical_context:$("technical").value,
    limitations:$("limitations").value,evidence_ref:$("evidence").value.trim(),
    requirements:Object.fromEntries(REQUIREMENTS.map(req=>[req.id,$("check-"+req.id).value])),
  };
}
function show(){
  sourceText();
  const exists=Boolean(dossier);
  $("status").textContent=exists
    ? STATUSES[dossier.status]+" · versi "+dossier.version+" · BELUM DIUJI"
    : "Belum ada berkas simulasi.";
  $("submit").hidden=!exists||dossier.status!=="draf";
  $("review-form").hidden=!exists||dossier.status!=="diajukan";
  $("dossier-form").hidden=exists&&!["draf","perlu_perbaikan"].includes(dossier.status);
  $("handoff").value=exists?handoffNote(dossier):"";
  const h=$("history");h.replaceChildren();
  if(!exists)return;
  h.append(node("p","Kelengkapan yang masih perlu diperiksa: "+
    (pendingRequirements(dossier).join(", ")||"tidak ada yang ditandai kurang dalam DEMO.")));
  const ul=node("ul");
  for(const event of dossier.history)ul.append(node("li",
    "v"+event.version+" · "+event.action+" · "+event.actor_demo_id+" · "+event.note));
  h.append(ul);
}
function loadFromRecord(){
  const c=dossier.content;
  $("purpose").value=c.purpose;
  $("technical").value=c.technical_context;
  $("limitations").value=c.limitations;
  $("evidence").value=c.evidence_ref;
  for(const req of REQUIREMENTS)$("check-"+req.id).value=c.requirements[req.id];
}
$("source").addEventListener("change",()=>{
  sourceText();
  if(dossier)note("Sumber berubah pada pilihan tampilan saja. Kosongkan simulasi untuk membuat berkas baru.",true);
});
$("dossier-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    if(dossier&&dossier.need_snapshot.need_id!==need()?.need_id)
      throw Error("Sumber berkas telah terkunci. Kosongkan simulasi sebelum mengganti kebutuhan.");
    dossier=dossier
      ?reviseDossier(dossier,data(),maker)
      :createDossier(need(),data(),maker);
    show();note("Draf administrasi tercatat dalam memori browser. Bukan penetapan bantuan.");
  }catch(error){note(error.message,true)}
});
$("submit").addEventListener("click",()=>{
  try{
    dossier=submitDossier(dossier,maker);
    show();note("Berkas DEMO diajukan untuk pemeriksaan administratif saja.");
  }catch(error){note(error.message,true)}
});
$("review-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    dossier=reviewDossier(dossier,reviewer,$("action").value,$("reason").value);
    show();
    if(dossier.status==="perlu_perbaikan")loadFromRecord();
    note("Hasil telaah DEMO dicatat; tidak ada persetujuan bantuan ataupun anggaran.");
  }catch(error){note(error.message,true)}
});
$("reset").addEventListener("click",()=>{
  dossier=null;
  $("dossier-form").reset();
  for(const req of REQUIREMENTS)$("check-"+req.id).value="belum_ada";
  $("reason").value="";
  show();note("Data simulasi dikosongkan dari memori halaman.");
});
show();
