/** YANDIK+ M04-S9J | KODE DITULIS, BELUM DIUJI. DEMO IN-MEMORY ONLY. */
import {AGENDA_DEMO} from "./fixtures.mjs";
import {createDemoConfirmationBook,editDemoConfirmation,
  confirmationView,confirmationText} from "./confirmation.mjs";

const $=id=>document.getElementById(id);
const el=(tag,value="")=>{
  const node=document.createElement(tag);
  node.textContent=String(value);
  return node;
};
const fields=["masukan_demo","kekurangan_bukti_demo","tindak_lanjut_usulan_demo"];
let book=null;
let view=null;
function chosenItem(){
  return view?.groups.find(g=>g.id===$("function").value)?.items
    .find(i=>i.item_id===$("item").value);
}
function refreshChoices(){
  if(!view)return;
  const id=$("function").value,group=view.groups.find(g=>g.id===id);
  const select=$("item");
  select.replaceChildren();
  if(!group){$("error").textContent="Fungsi DEMO tidak dikenal.";return;}
  for(const item of group.items){
    const op=el("option",item.item_id+" · "+item.title);
    op.value=item.item_id;select.append(op);
  }
  refreshForm();
}
function refreshForm(){
  const item=chosenItem();
  if(!item)return;
  $("title").textContent=item.item_id+" | "+item.title;
  $("required-evidence").textContent="Bukti yang perlu disiapkan: "+item.expected_evidence;
  $("dependencies").textContent="Pendahulu: "+
    (item.dependency_ids.join(", ")||"Tidak ada");
  const questions=$("questions");questions.replaceChildren();
  for(const q of item.questions)questions.append(el("li",q));
  for(const f of fields)$(f).value=item.note[f];
  $("rev").textContent="Revisi catatan contoh untuk butir ini: "+item.revision;
}
function refresh(){
  view=confirmationView(book,AGENDA_DEMO);
  $("counter").textContent="6 fungsi · 18 butir · "+
    view.totals.demo_notes_started+" butir dengan catatan contoh · "+
    "0 keputusan atau verifikasi resmi.";
  $("snapshot").textContent="Repository snapshot "+
    view.source_snapshot.visibility.toUpperCase()+" per "+
    view.source_snapshot.observed_on+" (bukan cek live).";
  $("summary").value=confirmationText(view);
  refreshForm();
}
function save(event){
  event.preventDefault();
  try{
    if(!chosenItem())throw Error("Pilih butir dari fungsi DEMO terlebih dahulu.");
    const changes=Object.fromEntries(fields.map(k=>[k,$(k).value]));
    book=editDemoConfirmation(book,AGENDA_DEMO,
      $("function").value,$("item").value,changes);
    refresh();
    $("error").textContent="";
    $("notice").textContent="Catatan contoh hanya berubah di memori halaman. "+
      "Tidak ada pengiriman, verifikasi atau penyimpanan.";
  }catch(e){$("error").textContent="Draf contoh tidak dicatat: "+e.message;}
}
function reset(){
  book=createDemoConfirmationBook(AGENDA_DEMO);
  refresh();
  $("error").textContent="";
  $("notice").textContent="Semua catatan contoh di memori halaman dikosongkan.";
}
try{
  book=createDemoConfirmationBook(AGENDA_DEMO);
  for(const g of AGENDA_DEMO.groups){
    const op=el("option",g.title);op.value=g.id;$("function").append(op);
  }
  $("function").addEventListener("change",refreshChoices);
  $("item").addEventListener("change",refreshForm);
  $("edit-form").addEventListener("submit",save);
  $("reset").addEventListener("click",reset);
  view=confirmationView(book,AGENDA_DEMO);
  refreshChoices();
  refresh();
}catch(e){
  $("edit-form").hidden=true;
  $("error").textContent="Paket agenda DEMO tidak dapat disiapkan: "+e.message;
}
