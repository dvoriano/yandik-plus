/** YANDIK+ M04-S9T | KODE DITULIS, BELUM DIUJI. Read-only UI. */
import {PREFLIGHT_DEMO} from "./fixtures.mjs";
import {buildQaEvidenceRegister,qaEvidenceRegisterText} from "./register.mjs";
const $=id=>document.getElementById(id);
const element=(tag,value="")=>{
  const node=document.createElement(tag);
  node.textContent=String(value);
  return node;
};
let ledger=null;
function render(){
  if(!ledger)return;
  const kind=$("filter-kind").value;
  const rows=ledger.requests.filter(r=>kind==="all"||r.kind===kind);
  const list=$("requests");list.replaceChildren();
  for(const req of rows){
    const item=element("li");
    item.append(
      element("strong",req.id),
      element("p","Kelompok: "+(req.kind==="gerbang"?"Tahap QA":"Temuan audit")+
        " · Rujukan: "+req.source_id),
      element("p","Jenis bukti yang kelak diperlukan: "+req.requirement),
      element("p","Bukti diterima: BELUM ADA · Verifikasi: BELUM DILAKUKAN"),
    );
    list.append(item);
  }
  if(!rows.length)list.append(element("li","Tidak ada kebutuhan bukti sesuai filter."));
  $("shown").textContent="Menampilkan "+rows.length+
    " dari "+ledger.totals.planned_evidence_requests+" kebutuhan bukti DEMO.";
  $("report").value=qaEvidenceRegisterText(ledger,kind);
}
try{
  ledger=buildQaEvidenceRegister(PREFLIGHT_DEMO);
  $("overview").textContent=ledger.totals.stages+" tahap QA · "+
    ledger.totals.findings+" temuan audit · "+
    ledger.totals.planned_evidence_requests+" kebutuhan bukti · "+
    ledger.totals.documents_received+" dokumen diterima · "+
    ledger.totals.verified_evidence+" bukti diverifikasi.";
  $("snapshot").textContent="Snapshot repo "+
    ledger.source.visibility_snapshot.toUpperCase()+" pada "+
    ledger.source.snapshot_date+" (bukan status live).";
  for(const group of ledger.stage_groups){
    const li=element("li");
    li.append(element("strong",group.id),
      element("p",group.purpose),
      element("p","Prasyarat: "+
        (group.predecessor_ids.join(", ")||"Tidak ada")+
        " · Izin pelaksanaan: BELUM ADA"));
    $("stages").append(li);
  }
  for(const finding of ledger.finding_groups){
    const li=element("li");
    li.append(element("strong",finding.id+" · BELUM DITUTUP"),
      element("p",finding.description),
      element("p","Bukti yang diminta: "+finding.request_ids.length+
        " jenis · Verifikasi belum dilakukan"));
    $("findings").append(li);
  }
  for(const warning of ledger.warnings)
    $("warnings").append(element("li",warning));
  $("filter-kind").addEventListener("change",render);
  render();
}catch(err){
  $("requests").replaceChildren();
  $("report").value="";
  $("error").textContent="Register DEMO tidak dapat ditampilkan: "+err.message;
}
