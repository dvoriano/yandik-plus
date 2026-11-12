/** YANDIK+ M04-S9K | KODE DITULIS, BELUM DIUJI. Read-only DEMO. */
import {AGENDA_DEMO,CONFIRMATION_VIEW_DEMO} from "./fixtures.mjs";
import {buildProposedFollowups,proposedFollowupsText,STATUS}
  from "./followups.mjs";
const $=id=>document.getElementById(id);
const el=(name,value="")=>{
  const node=document.createElement(name);
  node.textContent=String(value);
  return node;
};
let report=null;
function render(){
  if(!report)return;
  const group=$("group").value,state=$("state").value;
  const filtered=report.rows.filter(x=>
    (group==="all"||x.source_function_id===group)&&
    (state==="all"||x.status===state));
  const list=$("items");list.replaceChildren();
  for(const row of filtered){
    const li=el("li");
    li.append(
      el("strong",row.id+" · "+row.source_title),
      el("p",row.source_function_id+" · "+row.phase+" · "+STATUS[row.status]),
      el("p","Asal: "+row.source_id+" (revisi catatan DEMO "+row.source_revision+")"),
      el("p","Pendahulu: "+(row.source_dependencies.join(", ")||"Tidak ada")),
      el("p","Bukti yang dibutuhkan: "+row.source_material),
      el("p","Kekurangan bukti DEMO: "+(row.kekurangan_bukti_demo||"BELUM DIISI")),
      el("p","Usulan tindak lanjut DEMO: "+(row.usulan_tindak_lanjut_demo||"BELUM DIISI")),
      el("p","Pengampu usulan: "+row.preparer_role_suggestion),
      el("p","Penelaah usulan: "+row.reviewer_role_suggestion),
      el("p","Bahan diskusi berikut: "+row.next_discussion),
      el("p","Tidak ada penugasan, tenggat atau keputusan resmi.")
    );
    list.append(li);
  }
  if(!filtered.length)list.append(el("li","Tidak ada catatan contoh sesuai filter."));
  $("summary").value=proposedFollowupsText(report,group,state);
  $("matching").textContent="Ditampilkan "+filtered.length+
    " dari 18 butir DEMO.";
}
try{
  report=buildProposedFollowups(CONFIRMATION_VIEW_DEMO,AGENDA_DEMO);
  $("summary-count").textContent="18 butir asal · "+
    report.totals.proposals_demo+" usulan CONTOH · "+
    report.totals.without_proposal_demo+" belum ada usulan CONTOH · "+
    report.totals.official_tasks+" tugas resmi.";
  $("snapshot").textContent="Repository snapshot "+
    report.source.repo_snapshot.visibility.toUpperCase()+" per "+
    report.source.repo_snapshot.observed_on+
    " (bukan status live).";
  $("stale").textContent=report.source.source_stale?
    "Sumber DEMO berubah, kaji ulang sebelum memakai bahan ini.":
    "Tidak ada sumber berubah yang terdeteksi dalam fixture DEMO.";
  for(const f of report.functions){
    const option=el("option",f.title);
    option.value=f.id;$("group").append(option);
  }
  for(const [key,label] of Object.entries(STATUS)){
    const option=el("option",label);
    option.value=key;$("state").append(option);
  }
  for(const control of ["group","state"])
    $(control).addEventListener("change",render);
  render();
}catch(err){
  $("items").replaceChildren();
  $("summary").value="";
  $("error").textContent="Tidak dapat menyusun register DEMO: "+err.message;
}
