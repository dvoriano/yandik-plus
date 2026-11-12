/** YANDIK+ M04-S9M | KODE DITULIS, BELUM DIUJI. Read-only DEMO. */
import {RECAP_DEMO,AGENDA_DEMO} from "./fixtures.mjs";
import {buildHumanReviewHandoff,humanReviewHandoffText}
  from "./handoff.mjs";
const $=id=>document.getElementById(id);
const el=(name,content="")=>{
  const node=document.createElement(name);
  node.textContent=String(content);
  return node;
};
let handoff=null;
function render(){
  if(!handoff)return;
  const id=$("group").value;
  const selection=handoff.groups.filter(x=>id==="all"||x.id===id);
  const container=$("packet");
  container.replaceChildren();
  for(const group of selection){
    const section=el("section");
    section.className="handoff-group";
    section.append(
      el("h3",group.title),
      el("p","Tujuan: "+group.goal),
      el("p","Penelaah fungsi yang diusulkan: "+group.proposed_reviewer_role),
      el("p","Bukti diminta "+group.evidence_requests.length+
        ", pertanyaan terbuka "+group.open_question_count+
        "; belum ada pemeriksaan, rapat, penugasan atau keputusan resmi.")
    );
    const list=el("ol");
    list.className="entries";
    for(const item of group.entries){
      const li=el("li");
      li.append(
        el("strong","["+item.phase+"] "+item.id+" · "+item.title),
        el("p","Sumber: "+item.source_followup_id+
          " / revisi catatan DEMO "+item.source_revision),
        el("p","Bukti diminta (BELUM DIVERIFIKASI): "+item.evidence_requested),
        el("p","Catatan kekurangan DEMO: "+
          (item.evidence_gap_text_demo||"BELUM DIISI")),
        el("p","Usulan tindak lanjut DEMO: "+
          (item.proposal_text_demo||"BELUM DIISI")),
        el("p","Pendahulu: "+(item.dependency_ids.join(", ")||"Tidak ada")),
        el("p","Pendahulu dari fungsi lain: "+
          (item.cross_function_dependencies.map(x=>
            x.source_id+" ("+x.function_id+")").join(", ")||"Tidak ada")),
        el("p","Pengampu penyedia bahan yang diusulkan: "+
          item.proposed_preparer_role)
      );
      const questions=el("ul");
      for(const q of item.open_questions)questions.append(el("li",q));
      li.append(el("p","Pertanyaan untuk telaah manusia (belum dijawab secara resmi):"),
        questions,
        el("p","Status: BELUM DITELAAH, tidak ada persetujuan atau izin.")
      );
      list.append(li);
    }
    section.append(list);
    container.append(section);
  }
  $("selected").textContent="Ditampilkan "+selection.length+
    " fungsi dan "+selection.reduce((n,g)=>n+g.entries.length,0)+
    " butir DEMO.";
  $("summary").value=humanReviewHandoffText(handoff,id);
}
try{
  handoff=buildHumanReviewHandoff(RECAP_DEMO,AGENDA_DEMO);
  $("totals").textContent=handoff.totals.functions+" fungsi · "+
    handoff.totals.requirements+" butir · "+
    handoff.totals.evidence_requests+" permintaan bukti DEMO · "+
    handoff.totals.open_question_prompts+" pertanyaan terbuka · "+
    handoff.totals.official_decisions+" keputusan resmi.";
  $("snapshot").textContent="Repo snapshot "+
    handoff.source.repo_snapshot.visibility.toUpperCase()+
    " pada "+handoff.source.repo_snapshot.observed_on+
    " (bukan cek status saat ini).";
  for(const g of handoff.groups){
    const op=el("option",g.title);
    op.value=g.id;$("group").append(op);
  }
  for(const warning of handoff.warnings){
    $("warnings").append(el("li",warning));
  }
  $("group").addEventListener("change",render);
  render();
}catch(err){
  $("packet").replaceChildren();
  $("summary").value="";
  $("error").textContent="Paket DEMO tidak dapat disusun: "+err.message;
}
