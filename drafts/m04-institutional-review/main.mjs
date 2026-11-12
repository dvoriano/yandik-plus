/** M04-S9C | KODE DITULIS, BELUM DIUJI. Read-only discussion aid. */
import {buildExecutiveBrief,REGISTER_DEMO,DOCKET_DEMO,SOP_DEMO,REPOSITORY_SNAPSHOT_DEMO}
 from "./fixtures.mjs";
import {buildInstitutionalReviewPacket,institutionalReviewPacketText}
 from "./decision_matrix.mjs";
const $=id=>document.getElementById(id);
const el=(tag,value="")=>{const x=document.createElement(tag);x.textContent=String(value);return x;};
function render(){
  const briefing=buildExecutiveBrief(REGISTER_DEMO,DOCKET_DEMO,SOP_DEMO,
    $("asof").value||"2026-11-11");
  const packet=buildInstitutionalReviewPacket(briefing,REPOSITORY_SNAPSHOT_DEMO);
  $("summary").textContent="Butir pembahasan: "+packet.summary.discussion_items+
   " · unsur wajib: "+packet.summary.mandatory_requirements+
   " · belum lengkap DEMO: "+packet.summary.mandatory_unresolved_demo+
   " · kode belum diuji.";
  $("snapshot").textContent="Status repo diamati pada "+
   packet.repo_observation.observed_on+" sebagai "+
   packet.repo_observation.visibility.toUpperCase()+
   ". Ini informasi historis, bukan pemeriksaan status otomatis.";
  const list=$("agenda");list.replaceChildren();
  const filter=$("filter").value;
  for(const item of packet.rows.filter(x=>filter==="semua"||x.group===filter)){
    const li=el("li");
    li.append(el("strong",item.subject),el("p","Butir: "+item.id+" · "+item.priority),
      el("p","Bahan perlu disiapkan: "+item.evidence_needed),
      el("p","Pengampu yang diusulkan: "+item.owner_suggestion),
      el("p","Belum ada keputusan resmi."));
    list.append(li);
  }
  if(!list.childElementCount)list.append(el("li","Tidak ada butir yang cocok."));
  $("handoff").value=institutionalReviewPacketText(packet);
  $("notice").textContent="Hanya bahan telaah DEMO, tidak disimpan atau dikirim otomatis.";
  $("error").textContent="";
}
function safeRender(){
  try{render();}catch(err){
    $("agenda").replaceChildren();$("summary").textContent="";
    $("handoff").value="";$("error").textContent="Gagal menyusun draf DEMO: "+err.message;
  }
}
for(const id of ["asof","filter"])$(id).addEventListener("change",safeRender);
safeRender();
