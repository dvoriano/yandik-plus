/** YANDIK+ M04-S9P | KODE DITULIS, BELUM DIUJI. DEMO READ ONLY. */
import {MATERIAL_MATRIX_DEMO,HANDOFF_DEMO} from "./fixtures.mjs";
import {buildMaterialGapSequence,materialGapSequenceText,NOTE_CLASSES}
  from "./sequence.mjs";
const $=id=>document.getElementById(id);
const make=(tag,value="")=>{
  const x=document.createElement(tag);
  x.textContent=String(value);
  return x;
};
let bundle=null;
function render(){
  if(!bundle)return;
  const fn=$("function").value,cls=$("gap").value;
  const rows=bundle.rows.filter(x=>
    (fn==="all"||x.function_id===fn)&&
    (cls==="all"||x.gap_note_class===cls));
  const list=$("items");list.replaceChildren();
  for(const item of rows){
    const li=make("li");
    li.append(
      make("strong","Urutan diskusi contoh "+item.discussion_sequence+
        " · ["+item.phase+"] "+item.source_item_id+" · "+item.title),
      make("p","Lapis ketergantungan: "+item.dependency_layer+
        " · Fungsi usulan: "+item.function_title),
      make("p","Pendahulu yang sebaiknya dibaca dahulu: "+
        (item.prerequisite_ids.join(", ")||"Tidak ada")),
      make("p","Pendahulu lintas fungsi: "+
        (item.cross_function_ids.join(", ")||"Tidak ada")),
      make("p","Butir pembahasan lain yang mengacu ke butir ini (langsung/tidak langsung): "+
        item.downstream_discussion_items),
      make("p","Bahan yang diminta: "+item.material_request),
      make("p","Kesenjangan CATATAN DEMO: "+NOTE_CLASSES[item.gap_note_class]),
      make("p","Contoh teks kekurangan: "+
        (item.demo_gap_text||"BELUM DIISI, bukan berarti bukti lengkap")),
      make("p","Pertanyaan terkait: "+item.question_ids.join(", ")),
      make("p","Status: BUKTI RESMI BELUM DIVERIFIKASI. "+
        "Tidak ada tugas, keputusan atau izin eksekusi.")
    );
    list.append(li);
  }
  if(!rows.length)list.append(make("li","Tidak ada butir DEMO sesuai filter."));
  $("matched").textContent="Menampilkan "+rows.length+
    " dari 18 butir. Nomor yang ditampilkan adalah urutan sumber, bukan ranking.";
  $("summary").value=materialGapSequenceText(bundle,fn,cls);
}
try{
  bundle=buildMaterialGapSequence(MATERIAL_MATRIX_DEMO,HANDOFF_DEMO);
  $("counts").textContent=bundle.totals.requirements+" butir DEMO · "+
    bundle.totals.functions+" fungsi · "+
    bundle.totals.discussion_waves+" gelombang diskusi · "+
    bundle.totals.dependency_edges+" hubungan pendahulu · "+
    bundle.totals.official_evidence_verified+
      " bukti resmi terverifikasi.";
  $("snapshot").textContent="Repo snapshot "+
    bundle.source.repo_snapshot.visibility.toUpperCase()+" pada "+
    bundle.source.repo_snapshot.observed_on+" (bukan pemeriksaan live).";
  for(const wave of bundle.phaseWaves){
    const li=make("li");
    li.append(make("strong",wave.phase+" · "+
      wave.discussion_count+" butir"),
      make("span"," | Belum ada izin QA, bukti diverifikasi atau tahap resmi."));
    $("waves").append(li);
  }
  for(const fn of bundle.groups){
    const op=make("option",fn.title);
    op.value=fn.id;$("function").append(op);
  }
  for(const [key,label] of Object.entries(NOTE_CLASSES)){
    const op=make("option",label);op.value=key;$("gap").append(op);
  }
  for(const warning of bundle.warnings)
    $("warnings").append(make("li",warning));
  $("function").addEventListener("change",render);
  $("gap").addEventListener("change",render);
  render();
}catch(err){
  $("items").replaceChildren();$("summary").value="";
  $("error").textContent="Urutan DEMO tidak dapat dibuat: "+err.message;
}
