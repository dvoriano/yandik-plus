/** M04-S9B. KODE DITULIS, BELUM DIUJI. Read-only DEMO. */
import {REGISTER_DEMO,DOCKET_DEMO,SOP_DEMO} from "./fixtures.mjs";
import {buildExecutiveBrief,executiveBriefText} from "./briefing.mjs";
const $=id=>document.getElementById(id);
function elem(tag,value=""){const e=document.createElement(tag);e.textContent=String(value);return e;}
function detail(parent,label,value){
  const p=elem("p");p.append(elem("strong",label+": "),
    document.createTextNode(String(value)));parent.append(p);
}
function fill(){
  const b=buildExecutiveBrief(REGISTER_DEMO,DOCKET_DEMO,SOP_DEMO,
    $("asof").value||"2026-11-11");
  $("source").textContent="M04-S8 revisi "+b.source.s8_revision+
    " · "+b.source.s8_status+" · sumber berubah: "+
    (b.source.source_changed?"YA":"tidak terdeteksi pada DEMO");
  const stats=$("stats");stats.replaceChildren();
  for(const [label,num] of [
    ["Unsur wajib perlu dibahas",b.totals.mandatory_gaps],
    ["Wajib tanpa catatan aktif",b.totals.unregistered_mandatory_gaps],
    ["Register aktif",b.totals.open],
    ["Lewat tanggal DEMO",b.totals.overdue_demo],
    ["Sumber usang aktif",b.totals.stale_open],
    ["Usulan katalog",b.totals.catalog_proposals],
  ]){
    const box=elem("div");box.className="metric";
    box.append(elem("strong",num),elem("span",label));stats.append(box);
  }
  const req=$("requirements");req.replaceChildren();
  const filter=$("reqfilter").value;
  for(const x of b.requirements.filter(x=>filter==="all"||
    filter==="missing"&&x.missing_for_discussion||
    filter==="unregistered"&&x.mandatory&&x.missing_for_discussion&&x.active_related===0)){
    const li=elem("li");
    li.append(elem("strong",x.title),elem("p",
      (x.mandatory?"Wajib":"Opsional")+" · "+x.status_label+
      " · register aktif: "+x.active_related));
    req.append(li);
  }
  if(!req.childElementCount)req.append(elem("li","Tidak ada data sesuai filter DEMO."));
  const list=$("findings");list.replaceChildren();
  const attOnly=$("attention").checked;
  for(const x of b.findings.filter(x=>!attOnly||x.open&&
    (x.source_stale||x.overdue_demo||x.status==="menunggu_telaah"||x.status==="perlu_perbaikan"))){
    const li=elem("li");li.append(elem("strong",x.source_label));
    detail(li,"Catatan",x.id+" · "+x.status_label);
    detail(li,"Penanggung jawab DEMO",x.assignee_demo_id);
    detail(li,"Tanggal acuan contoh",x.due_date_demo+(x.overdue_demo?" · LEWAT":""));
    detail(li,"Kekurangan",x.description);
    detail(li,"Rencana perbaikan",x.corrective_plan);
    detail(li,"Keluaran",x.expected_output);
    detail(li,"Sumber",x.source_stale?"BERUBAH, butuh kaji ulang":"tidak terdeteksi berubah");
    list.append(li);
  }
  if(!list.childElementCount)list.append(elem("li","Tidak ada catatan sesuai filter."));
  const changes=$("changes");changes.replaceChildren();
  for(const x of b.change_proposals){
    changes.append(elem("li",x.unit_key+" · "+x.type+" · "+x.status+
      " · belum diterapkan"));
  }
  if(!changes.childElementCount)changes.append(elem("li","Tidak ada usulan contoh."));
  const questions=$("questions");questions.replaceChildren();
  for(const x of b.decisions_for_humans){
    const li=elem("li");li.append(elem("strong",x.title),elem("p",x.question));questions.append(li);
  }
  if(!questions.childElementCount)questions.append(elem("li","Tidak ada pertanyaan dari data DEMO."));
  $("handoff").value=executiveBriefText(b);
  $("status").textContent="Teks draf DEMO siap dibaca. Tidak dikirim atau disimpan otomatis.";
}
function render(){
  try{fill();$("error").textContent="";}
  catch(e){$("error").textContent="Rekap DEMO tidak dapat disusun: "+e.message;
    $("handoff").value="";
    for(const id of ["stats","requirements","findings","changes","questions"])
      $(id).replaceChildren();}
}
for(const id of ["asof","reqfilter","attention"])$(id).addEventListener("change",render);
render();
