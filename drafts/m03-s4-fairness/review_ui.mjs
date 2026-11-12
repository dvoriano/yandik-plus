/** M03-S4B DRAF / BELUM DIUJI. UI review is local and DEMO only. */
import { PROFILES } from "./comparison.mjs";
import { createDraft,submitDraft,reviewDraft,reviseDraft,STATUS,DECISIONS } from "./review_ledger.mjs";
import { buildMinutesDraft } from "./draft_minutes.mjs";
const $=id=>document.getElementById(id);
const element=(tag,content="")=>{const e=document.createElement(tag);e.textContent=content;return e};
const kab={role:"verifikator_kab",id:"DEMO-KAB-OPERATOR-01"};
const prov={role:"verifikator_prov",id:"DEMO-PROV-REVIEWER-01"};
let record=null; // never stored persistently
for(const p of PROFILES){const o=element("option",p.label);o.value=p.id;$("profile").append(o)}
for(const [id,label] of Object.entries(DECISIONS)){const o=element("option",label);o.value=id;$("decision").append(o)}
$("profile").value="akses_sdm";
function fields(){return {
  profile_id:$("profile").value,rationale:$("rationale").value,
  risks:$("risks").value,limitations:$("limits").value,
  evidence_ref:$("evidence").value,
}}
function notify(t,bad=false){$("notice").textContent=t;$("notice").className=bad?"warning":"success"}
function render(){
  $("record-status").textContent=record
    ? STATUS[record.status]+" · versi "+record.version+" · BELUM DIUJI"
    :"Belum ada catatan; seluruh data contoh hilang ketika halaman dimuat ulang.";
  $("submit").hidden=!record||record.status!=="draf";
  $("review").hidden=!record||record.status!=="diajukan";
  $("draft").hidden=Boolean(record&&!["draf","dikembalikan"].includes(record.status));
  const list=$("impact");
  list.replaceChildren();
  if(!record)return;
  list.append(element("p","Perbandingan profil "+record.profile_id+
    ". Data tidak lengkap: "+record.snapshot.missing_scenarios.length+
    "; perubahan peringkat ≥2: "+record.snapshot.significant_rank_changes.length+"."));
  const ul=element("ul");
  for(const row of record.snapshot.changes){
    ul.append(element("li",row.label+
      " | Peringkat dasar "+(row.baseline_rank??"belum dinilai")+
      " → alternatif "+(row.alternative_rank??"belum dinilai")+
      (row.incomplete?" | DATA BELUM LENGKAP":"")));
  }
  list.append(ul);
  if(record.review)list.append(element("p","Catatan penelaah (DEMO): "+record.review.notes));
  // A change invalidates any previously composed report; regenerate explicitly.
  $("minutes-output").value="";
  $("minutes-status").textContent=record
    ?"Sumber berubah atau diperbarui. Susun ulang draf bahan berita acara."
    :"Buat catatan kajian terlebih dahulu.";
  if(record.status==="dikembalikan"){
    $("profile").value=record.profile_id;
    $("rationale").value=record.rationale;
    $("risks").value=record.risks;
    $("limits").value=record.limitations;
    $("evidence").value=record.evidence_ref;
  }
}
$("draft").addEventListener("submit",e=>{
  e.preventDefault();
  try{
    record=record?.status==="dikembalikan"?reviseDraft(record,fields(),kab):createDraft(fields(),kab);
    render();notify("Draf tercatat dalam memori browser saja. BUKAN HASIL UJI.");
  }catch(err){notify(err.message,true)}
});
$("submit").addEventListener("click",()=>{
  try{record=submitDraft(record,kab);render();notify("Kajian dikirim untuk telaah provinsi DEMO, bukan pengesahan.");}
  catch(err){notify(err.message,true)}
});
$("review").addEventListener("submit",e=>{
  e.preventDefault();
  try{record=reviewDraft(record,prov,$("decision").value,$("notes").value);
    render();notify("Tinjauan metodologi dicatat. Tidak ada keputusan bantuan atau anggaran.");}
  catch(err){notify(err.message,true)}
});
render();


$("minutes-form").addEventListener("submit",event=>{
  event.preventDefault();
  try {
    if(record===null)throw Error("Buat atau ajukan catatan kajian DEMO terlebih dahulu.");
    const result=buildMinutesDraft(record,{
      agenda:$("minutes-agenda").value,
      follow_up:$("minutes-followup").value,
    });
    $("minutes-output").value=result.text;
    $("minutes-status").textContent="Draf bahan berita acara dibuat untuk simulasi. " +
      "Belum diuji, belum ada tanda tangan, dan bukan dokumen resmi.";
    $("minutes-output").focus();
    $("minutes-output").select();
  } catch(err) {
    $("minutes-output").value="";
    $("minutes-status").textContent="Draf belum dibuat: "+err.message;
  }
});
