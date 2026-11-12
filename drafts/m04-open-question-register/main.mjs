/** YANDIK+ M04-S9N | KODE DITULIS, BELUM DIUJI. Read-only DEMO. */
import {HANDOFF_DEMO} from "./fixtures.mjs";
import {buildOpenQuestionRegister,openQuestionRegisterText,EVIDENCE_FILTER}
  from "./questions.mjs";
const $=id=>document.getElementById(id);
const el=(tag,value="")=>{
  const node=document.createElement(tag);node.textContent=String(value);return node;
};
let register;
function render(){
  if(!register)return;
  const functionId=$("function").value,gap=$("gap").value;
  const matched=register.rows.filter(q=>
    (functionId==="all"||q.function_id===functionId)&&
    (gap==="all"||q.evidence_gap_filter===gap));
  const list=$("questions");
  list.replaceChildren();
  for(const q of matched){
    const li=el("li");
    li.append(
      el("strong",q.id+" · "+q.question_text),
      el("p","Butir "+q.source_item_id+" · "+q.item_title+" ["+q.phase+"]"),
      el("p","Fungsi usulan: "+q.function_title+
        " · revisi catatan DEMO "+q.source_revision),
      el("p","Bahan yang perlu disiapkan (belum diverifikasi): "+
        q.evidence_requested),
      el("p","Catatan kekurangan bukti DEMO: "+
        (q.evidence_gap_text_demo||"BELUM DIISI, bukan berarti lengkap")),
      el("p","Penyiap bahan yang diusulkan: "+q.proposed_preparer_role),
      el("p","Penelaah fungsi yang diusulkan: "+q.proposed_reviewer_role),
      el("p","Pendahulu: "+(q.dependency_ids.join(", ")||"Tidak ada")),
      el("p","Status: BELUM ADA JAWABAN RESMI. Bukan agenda/penugasan resmi.")
    );
    list.append(li);
  }
  if(!matched.length)
    list.append(el("li","Tidak ada pertanyaan DEMO sesuai pilihan filter."));
  $("selected").textContent="Ditampilkan "+matched.length+
    " dari "+register.totals.questions+" pertanyaan DEMO.";
  $("export").value=openQuestionRegisterText(register,functionId,gap);
}
try{
  register=buildOpenQuestionRegister(HANDOFF_DEMO);
  $("counts").textContent=register.totals.functions+" fungsi · "+
    register.totals.source_items+" butir · "+
    register.totals.questions+" pertanyaan terbuka · "+
    register.totals.official_answers+" jawaban resmi.";
  $("snapshot").textContent="Repo snapshot "+
    register.source.repo_snapshot.visibility.toUpperCase()+" pada "+
    register.source.repo_snapshot.observed_on+" (bukan pemeriksaan live).";
  const tbody=$("matrix");
  for(const f of register.groups){
    const row=el("tr");
    row.append(el("th",f.title),el("td",f.source_item_ids.length),
      el("td",f.question_count),el("td",f.with_written_gap),
      el("td",f.without_written_gap),el("td",f.answers_confirmed));
    tbody.append(row);
    const op=el("option",f.title);op.value=f.id;
    $("function").append(op);
  }
  for(const [key,value] of Object.entries(EVIDENCE_FILTER)){
    const op=el("option",value);op.value=key;
    $("gap").append(op);
  }
  for(const warning of register.warnings)
    $("warnings").append(el("li",warning));
  for(const select of ["function","gap"])
    $(select).addEventListener("change",render);
  render();
}catch(error){
  $("questions").replaceChildren();$("export").value="";
  $("error").textContent="Register pertanyaan DEMO tidak tersedia: "+error.message;
}
