/** YANDIK+ M04-S9H | KODE DITULIS, BELUM DIUJI. Read-only DEMO. */
import {MATRIX_DEMO} from "./fixtures.mjs";
import {buildBlockerTriage,blockerTriageText,ATTENTION}
  from "./triage.mjs";
const $=id=>document.getElementById(id);
const textNode=(name,content="")=>{
  const node=document.createElement(name);node.textContent=String(content);return node;
};
let packet;
try{
  packet=buildBlockerTriage(MATRIX_DEMO);
  $("counts").textContent="Hambatan "+packet.totals.blockers+
    " · tanpa pendahulu "+packet.totals.no_predecessor+
    " · penelaah resmi dikonfirmasi "+packet.totals.confirmed_reviewers+
    " · bukti diverifikasi "+packet.totals.verified_evidence;
  $("snapshot").textContent="Repository "+packet.source.repo_snapshot.visibility.toUpperCase()+
    " menurut snapshot "+packet.source.repo_snapshot.observed_on+
    ". Tidak mencerminkan pemeriksaan real-time.";
  $("handoff").value=blockerTriageText(packet);
  for(const [code,label] of Object.entries(ATTENTION)){
    const option=textNode("option",label);option.value=code;
    $("attention").append(option);
  }
  for(const wave of packet.phases){
    const option=textNode("option",wave.id+" · "+wave.label);
    option.value=wave.id;$("phase").append(option);
  }
}catch(error){
  $("error").textContent="Sumber DEMO belum dapat dibaca: "+error.message;
}
function show(){
  if(!packet)return;
  const phase=$("phase").value,attention=$("attention").value;
  const matched=packet.rows.filter(x=>
    (phase==="all"||x.phase===phase)&&
    (attention==="all"||x.attention_code===attention));
  const list=$("list");list.replaceChildren();
  for(const item of matched){
    const li=textNode("li");
    li.append(
      textNode("strong",item.discussion_order+". "+item.id+" · "+item.title),
      textNode("p",item.phase_label+" · "+item.attention_label),
      textNode("p","Pendahulu: "+
        (item.dependency_ids.join(", ")||"Belum ada pendahulu diskusi")),
      textNode("p","Bukti yang perlu disiapkan: "+item.evidence_request),
      textNode("p","Pengampu usulan: "+item.proposed_preparer_role),
      textNode("p","Penelaah usulan: "+item.proposed_reviewer_role),
      textNode("p","Pertanyaan telaah: "+item.review_question),
      textNode("p","Langkah diskusi contoh: "+item.suggested_next_discussion),
      textNode("p","Status: bukti belum diverifikasi, penelaah belum ditetapkan, tidak ada keputusan.")
    );
    if(item.context_alert)li.append(textNode("p","Catatan sumber: "+item.context_alert));
    list.append(li);
  }
  if(!matched.length)list.append(textNode("li","Tidak ada butir sesuai filter DEMO."));
}
if(packet){
  for(const name of ["phase","attention"])$(name).addEventListener("change",show);
  show();
}
