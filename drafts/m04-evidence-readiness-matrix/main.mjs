/** YANDIK+ M04-S9O | KODE DITULIS, BELUM DIUJI. Read-only DEMO UI. */
import {HANDOFF_DEMO,OPEN_QUESTIONS_DEMO} from "./fixtures.mjs";
import {buildEvidenceReadinessMatrix,evidenceReadinessText,NOTE_STATE}
  from "./readiness.mjs";
const $=id=>document.getElementById(id);
const text=(tag,s="")=>{
  const node=document.createElement(tag);
  node.textContent=String(s);
  return node;
};
let matrix=null;
function render(){
  if(!matrix)return;
  const f=$("function").value,n=$("note").value;
  const rows=matrix.rows.filter(r=>
    (f==="all"||r.function_id===f)&&
    (n==="all"||r.demo_note_state===n));
  const items=$("items");items.replaceChildren();
  for(const r of rows){
    const li=text("li");
    li.append(
      text("strong",r.source_item_id+" · "+r.title+" ["+r.phase+"]"),
      text("p","Fungsi usulan: "+r.function_title+
        " · revisi sumber DEMO "+r.source_revision),
      text("p","Bahan DIMINTA: "+r.required_material_description),
      text("p","Catatan bahan DEMO: "+(r.demo_note_text||"BELUM DIISI")),
      text("p","Kekurangan bukti tertulis DEMO: "+
        (r.demo_gap_text||"BELUM DIISI")),
      text("p","Pertanyaan asal: "+r.question_ids.join(", ")),
      text("p","Dokumen diterima DEMO: tidak ada. "+
        "Bukti resmi terverifikasi: tidak ada."),
      text("p","Kesiapan integrasi: TIDAK DAPAT DINILAI DARI DEMO.")
    );
    items.append(li);
  }
  if(!rows.length)items.append(text("li","Tidak ada butir DEMO sesuai filter."));
  $("count-filter").textContent="Menampilkan "+rows.length+" dari 18 butir DEMO.";
  $("report").value=evidenceReadinessText(matrix,f,n);
}
try{
  matrix=buildEvidenceReadinessMatrix(OPEN_QUESTIONS_DEMO,HANDOFF_DEMO);
  $("overview").textContent=matrix.totals.functions+" fungsi · "+
    matrix.totals.material_requests+" permintaan bahan DEMO · "+
    matrix.totals.demo_notes_written+" catatan contoh tertulis · "+
    matrix.totals.documents_received_demo+" dokumen diterima DEMO · "+
    matrix.totals.official_evidence_verified+" bukti resmi terverifikasi.";
  $("snapshot").textContent="Snapshot repo "+
    matrix.source.repo_snapshot.visibility.toUpperCase()+" pada "+
    matrix.source.repo_snapshot.observed_on+" (bukan pemeriksaan live).";
  const body=$("matrix");
  for(const f of matrix.groups){
    const tr=text("tr");
    tr.append(text("th",f.title),text("td",f.requested_materials),
      text("td",f.demo_notes_written),text("td",f.demo_notes_blank),
      text("td",f.gap_notes_written),text("td",f.official_evidence_verified));
    body.append(tr);
    const opt=text("option",f.title);opt.value=f.id;$("function").append(opt);
  }
  for(const [key,label] of Object.entries(NOTE_STATE)){
    const opt=text("option",label);opt.value=key;$("note").append(opt);
  }
  for(const warning of matrix.warnings)$("warnings").append(text("li",warning));
  for(const id of ["function","note"])$(id).addEventListener("change",render);
  render();
}catch(error){
  $("items").replaceChildren();$("report").value="";
  $("error").textContent="Matriks DEMO tidak dapat ditampilkan: "+error.message;
}
