/** YANDIK+ M04-S9I | KODE DITULIS, BELUM DIUJI. Browser read-only DEMO. */
import {TRIAGE_DEMO} from "./fixtures.mjs";
import {buildFunctionAgendas,functionAgendaText} from "./agendas.mjs";

const $=id=>document.getElementById(id);
const element=(tag,content="")=>{
  const n=document.createElement(tag);
  n.textContent=String(content);
  return n;
};
let packet=null;
function render(){
  if(!packet)return;
  const selected=$("function").value;
  const groups=packet.groups.filter(g=>selected==="all"||g.id===selected);
  const list=$("agendas");
  list.replaceChildren();
  for(const group of groups){
    const section=element("section");
    section.className="agenda";
    section.append(
      element("h3",group.title),
      element("p",group.goal),
      element("p","Penelaah fungsi yang diusulkan: "+group.suggested_reviewer_role),
      element("p","Bahan untuk "+group.count+" butir. Belum ada jadwal, undangan atau keputusan resmi.")
    );
    const details=element("ol");
    details.className="items";
    for(const item of group.items){
      const li=element("li");
      li.append(
        element("strong",item.id+" · "+item.title+" ["+item.phase+"]"),
        element("p","Pendahulu: "+(item.dependency_ids.join(", ")||"Tidak ada")),
        element("p","Bahan yang perlu disiapkan: "+item.evidence_needed),
        element("p","Penyiap bahan yang diusulkan: "+item.proposed_preparer_role),
        element("p","Penelaah fungsi yang diusulkan: "+item.proposed_reviewer_role),
        element("p","Langkah diskusi: "+item.followup_discussion)
      );
      const questions=element("ul");
      for(const question of item.proposed_questions)questions.append(element("li",question));
      li.append(element("p","Pertanyaan untuk telaah manusia:"),questions);
      details.append(li);
    }
    section.append(details);
    list.append(section);
  }
  if(!groups.length)list.append(element("p","Tidak ada agenda DEMO."));
  $("summary").value=functionAgendaText(packet,selected);
  $("selected-count").textContent="Ditampilkan "+groups.length+" fungsi dan "+
    groups.reduce((n,g)=>n+g.count,0)+" butir DEMO.";
}
try{
  packet=buildFunctionAgendas(TRIAGE_DEMO);
  $("counts").textContent=packet.totals.functions+" fungsi · "+
    packet.totals.agenda_items+" butir · "+
    packet.totals.materials_requested+" permintaan bahan (bukan lampiran) · "+
    packet.totals.official_decisions+" keputusan resmi · "+
    packet.totals.meetings_held+" pembahasan terlaksana.";
  $("snapshot").textContent="Snapshot GitHub "+
    packet.source.repo_snapshot.visibility.toUpperCase()+" pada "+
    packet.source.repo_snapshot.observed_on+
    ". Ini bukan pengecekan real-time.";
  for(const f of packet.groups){
    const op=element("option",f.title);
    op.value=f.id;
    $("function").append(op);
  }
  for(const warning of packet.warnings){
    $("warnings").append(element("li",warning));
  }
  $("function").addEventListener("change",()=>{
    try{render();$("error").textContent="";}
    catch(err){$("agendas").replaceChildren();$("summary").value="";
      $("error").textContent="Gagal menampilkan bahan DEMO: "+err.message;}
  });
  render();
}catch(err){
  $("agendas").replaceChildren();
  $("summary").value="";
  $("error").textContent="Bahan DEMO belum dapat ditampilkan: "+err.message;
}
