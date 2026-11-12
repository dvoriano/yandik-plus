/** YANDIK+ M04-S9Q | KODE DITULIS, BELUM DIUJI. Read-only DEMO UI. */
import {SEQUENCE_DEMO,HANDOFF_DEMO} from "./fixtures.mjs";
import {buildPhaseReviewPackets,phaseReviewPacketsText}
  from "./packets.mjs";
const $=id=>document.getElementById(id);
const make=(tag,value="")=>{
  const element=document.createElement(tag);
  element.textContent=String(value);
  return element;
};
let data=null;
function render(){
  if(!data)return;
  const phase=$("phase").value,fn=$("function").value;
  const visible=data.packets.filter(p=>phase==="all"||p.phase===phase);
  const output=$("packets");output.replaceChildren();
  let entryCount=0,questionCount=0;
  for(const p of visible){
    const matching=p.entries.filter(e=>fn==="all"||e.function_id===fn);
    entryCount+=matching.length;
    questionCount+=matching.reduce((n,e)=>n+e.open_questions.length,0);
    const group=make("section");
    group.className="phase";
    group.append(
      make("h3",p.title),
      make("p","Bahan ditampilkan: "+matching.length+
        " dari "+p.entries.length+
        " butir pada fase DEMO "+p.phase+"."),
      make("p","Status: BELUM DIJADWALKAN, BELUM DITELAAH, BELUM DIKIRIM.")
    );
    const list=make("ol");list.className="entries";
    for(const entry of matching){
      const li=make("li");
      li.append(
        make("strong","Urutan baca sumber "+entry.discussion_sequence+
          " · "+entry.source_id+" · "+entry.title),
        make("p","Fungsi usulan: "+entry.function_title+
          " · lapisan dependensi "+entry.dependency_layer+
          " · revisi catatan DEMO "+entry.source_revision),
        make("p","Pendahulu yang perlu dibaca lebih dulu: "+
          (entry.prerequisite_ids.join(", ")||"Tidak ada")),
        make("p","Pendahulu lintas fungsi: "+
          (entry.cross_function_ids.join(", ")||"Tidak ada")),
        make("p","Jenis bahan yang diminta (BELUM DIVERIFIKASI): "+
          entry.material_requested),
        make("p","Catatan kekurangan DEMO: "+
          (entry.example_gap_note||"BELUM DIISI, bukan berarti lengkap")),
        make("p","Usulan tindak lanjut DEMO: "+
          (entry.proposal_text_demo||"BELUM DIISI")),
        make("p","Calon fungsi penyiap bahan: "+entry.proposed_preparer_role),
        make("p","Calon fungsi penelaah: "+entry.proposed_reviewer_role),
        make("p","Pertanyaan yang tetap terbuka:")
      );
      const qs=make("ul");qs.className="questions";
      for(const q of entry.open_questions)
        qs.append(make("li",q.id+" · "+q.text));
      li.append(qs,make("p","Tidak ada jawaban resmi, dokumen terverifikasi, tugas, keputusan atau izin."));
      list.append(li);
    }
    if(!matching.length)
      list.append(make("li","Tidak ada butir DEMO sesuai filter fungsi."));
    group.append(list);
    output.append(group);
  }
  $("selected").textContent="Ditampilkan "+entryCount+
    " dari 18 butir DEMO dan "+questionCount+" pertanyaan terbuka.";
  $("summary").value=phaseReviewPacketsText(data,phase,fn);
}
try{
  data=buildPhaseReviewPackets(SEQUENCE_DEMO,HANDOFF_DEMO);
  $("overview").textContent=data.totals.phases+" paket fase · "+
    data.totals.items+" butir · "+data.totals.open_questions+
    " pertanyaan belum dijawab · "+data.totals.materials_requested+
    " bahan diminta · "+data.totals.official_evidence_verified+
    " bukti resmi terverifikasi.";
  $("snapshot").textContent="Snapshot repo "+
    data.source.repo_snapshot.visibility.toUpperCase()+" pada "+
    data.source.repo_snapshot.observed_on+
    " (bukan status live).";
  for(const p of data.packets){
    const option=make("option",p.phase+" · "+p.title);
    option.value=p.phase;$("phase").append(option);
    const card=make("li");
    card.append(make("strong",p.phase+" · "+p.entries.length+" butir"),
      make("span"," | "+p.question_count+
        " pertanyaan terbuka · paket BELUM DIKIRIM"));
    $("overview-phases").append(card);
  }
  const functionMap=new Map();
  for(const p of data.packets)for(const e of p.entries)
    functionMap.set(e.function_id,e.function_title);
  for(const [key,value] of [...functionMap].sort((a,b)=>
    a[0].localeCompare(b[0]))){
    const option=make("option",value);option.value=key;
    $("function").append(option);
  }
  for(const warning of data.warnings)
    $("warnings").append(make("li",warning));
  $("phase").addEventListener("change",render);
  $("function").addEventListener("change",render);
  render();
}catch(err){
  $("packets").replaceChildren();$("summary").value="";
  $("error").textContent="Paket fase DEMO tidak dapat dibangun: "+err.message;
}
