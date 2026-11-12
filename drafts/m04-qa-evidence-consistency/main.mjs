/** YANDIK+ M04-S9U | KODE DITULIS, BELUM DIUJI. Read-only DEMO. */
import {REGISTER_DEMO,PREFLIGHT_DEMO} from "./fixtures.mjs";
import {buildQaEvidenceConsistency,qaEvidenceConsistencyText}
  from "./consistency.mjs";

const $=id=>document.getElementById(id);
const node=(tag,value="")=>{
  const x=document.createElement(tag);
  x.textContent=String(value);
  return x;
};
let matrix=null;
function render(){
  if(!matrix)return;
  const filter=$("kind").value;
  const shown=matrix.lines.filter(x=>filter==="all"||x.kind===filter);
  const target=$("items");target.replaceChildren();
  for(const item of shown){
    const li=node("li");
    li.append(
      node("strong",item.id+" · "+item.source_request_id),
      node("p","Kategori: "+(item.kind==="gerbang"?"Gerbang QA":"Temuan audit")),
      node("p","Rujukan: "+item.source_id),
      node("p","Bahan yang perlu disiapkan: "+item.requirement),
      node("p","Kaitan struktur: TERDAFTAR DALAM RANCANGAN, BELUM DIUJI"),
      node("p","Dokumen diterima: 0 · Verifikasi bukti: BELUM DILAKUKAN"),
      node("p","Status: BUKTI BELUM DITERIMA. Bukan izin QA atau keputusan."),
    );
    target.append(li);
  }
  $("shown").textContent=shown.length+" dari 14 baris DEMO ditampilkan.";
  $("summary").value=qaEvidenceConsistencyText(matrix,filter);
}
try{
  matrix=buildQaEvidenceConsistency(REGISTER_DEMO,PREFLIGHT_DEMO);
  $("overview").textContent=matrix.totals.structural_requests_found+
    " kebutuhan terindeks di sumber DEMO · "+
    matrix.totals.documentary_material_received+" dokumen diterima · "+
    matrix.totals.verified_evidence+" bukti diverifikasi · "+
    matrix.totals.officially_closed_findings+" temuan resmi ditutup.";
  $("snapshot").textContent="Snapshot repository "+
    matrix.source.source_visibility_snapshot.toUpperCase()+" per "+
    matrix.source.source_snapshot_date+" (bukan pemeriksaan live).";
  for(const stage of matrix.stages){
    const li=node("li");
    li.append(
      node("strong",stage.id),
      node("p","Kebutuhan bahan: "+stage.structural_request_count),
      node("p","Bukti diverifikasi: 0 · Izin pelaksanaan: BELUM ADA"),
    );
    $("gates").append(li);
  }
  for(const f of matrix.findings){
    const li=node("li");
    li.append(
      node("strong",f.id),
      node("p","Kebutuhan bahan: "+f.structural_request_count),
      node("p","Temuan resmi: BELUM DITUTUP"),
    );
    $("findings").append(li);
  }
  for(const warning of matrix.warnings)
    $("warnings").append(node("li",warning));
  $("kind").addEventListener("change",render);
  render();
}catch(err){
  $("items").replaceChildren();
  $("summary").value="";
  $("error").textContent="Matriks DEMO tidak dapat ditampilkan: "+err.message;
}
