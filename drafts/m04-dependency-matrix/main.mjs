/** M04-S9G | KODE DITULIS, BELUM DIUJI. Read-only DEMO. */
import {CHECKLIST_DEMO} from "./fixtures.mjs";
import {buildDependencyMatrix,dependencyMatrixText,PHASE_LABELS}
  from "./dependencies.mjs";
const $=id=>document.getElementById(id);
const el=(tag,value="")=>{
  const node=document.createElement(tag);node.textContent=String(value);return node;
};
let board;
try{
  board=buildDependencyMatrix(CHECKLIST_DEMO);
  for(const [id,title] of Object.entries(PHASE_LABELS)){
    const option=el("option",title);option.value=id;$("phase").append(option);
  }
  $("counts").textContent="Prasyarat "+board.totals.requirements+
    " · hubungan langsung "+board.totals.direct_edges+
    " · langkah awal diskusi "+board.totals.independent_discussion_starters+
    " · bukti resmi terverifikasi "+board.totals.verified;
  $("source").textContent="Sumber M04-S9F: "+board.source.schema+
    " · snapshot repo "+board.source.repo_snapshot.visibility.toUpperCase()+
    " pada "+board.source.repo_snapshot.observed_on+
    ". Snapshot bukan pengecekan live.";
  $("handoff").value=dependencyMatrixText(board);
  for(const wave of board.waves){
    const li=el("li");
    li.append(el("strong",wave.title),
      el("p",wave.count+" prasyarat · "+wave.status+
        " · tidak ada izin pengujian"),
      el("p","Rujukan butir: "+wave.requirements.join(", ")));
    $("waves").append(li);
  }
  const w=$("warnings");
  for(const text of board.warnings)w.append(el("li",text));
}catch(err){
  $("error").textContent="Gagal menyusun DEMO: "+err.message;
}
function render(){
  if(!board)return;
  const phase=$("phase").value,group=$("group").value;
  const source=board.rows.filter(x=>
    (phase==="all"||x.phase===phase)&&
    (group==="all"||x.group===group));
  const list=$("steps");list.replaceChildren();
  for(const x of source){
    const li=el("li");
    li.append(
      el("strong",x.sequence+". "+x.id+" · "+x.title),
      el("p",x.phase_label+" · lapisan dependensi "+x.dependency_layer),
      el("p","Pendahulu yang belum dibuktikan: "+
        (x.direct_dependencies.length?x.direct_dependencies.join(", "):
          "Tidak ada; dapat dibahas dulu, bukan izin bertindak.")),
      el("p","Butir lanjutan yang bergantung: "+x.downstream_affected),
      el("p","Bukti yang diperlukan: "+x.evidence_needed),
      el("p","Pengampu yang diusulkan: "+x.proposed_owner),
      el("p",x.note)
    );
    if(x.context_alert)li.append(el("p","Perhatian: "+x.context_alert));
    list.append(li);
  }
  if(!source.length)list.append(el("li","Tidak ada butir sesuai filter DEMO."));
}
if(board){
  for(const group of [...new Set(board.rows.map(x=>x.group))]){
    const op=el("option",group);op.value=group;$("group").append(op);
  }
  for(const id of ["phase","group"])$(id).addEventListener("change",render);
  render();
}
