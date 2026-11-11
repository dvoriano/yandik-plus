/** M04-S2 DRAF/BELUM DIUJI; all state ephemeral, all users/data DEMO. */
import { REVIEWED_DOSSIER, EXTERNAL_REFERENCE_SAMPLE } from "./fixtures.mjs";
import {
  REFERENCE_STATUSES, REFERENCE_TYPES, REVIEW_ACTIONS,
  createReferenceRegister, addExternalReference, reviseExternalReference,
  submitExternalReference, reviewExternalReference, referenceList, referenceHandoffNote,
} from "./reference_register.mjs";
const $=id=>document.getElementById(id);
const el=(tag,value="")=>{const e=document.createElement(tag);e.textContent=value;return e};
const maker={role:"pencatat_referensi_prov_demo",id:"DEMO-PENCATAT-PROV-01"};
const reviewer={role:"penelaah_referensi_prov_demo",id:"DEMO-PENELAAH-PROV-02"};
let register=createReferenceRegister();
let selected=null;
for(const [k,v] of Object.entries(REFERENCE_TYPES)){const o=el("option",v);o.value=k;$("doc-type").append(o);}
for(const [k,v] of Object.entries(REVIEW_ACTIONS)){const o=el("option",v);o.value=k;$("action").append(o);}
function form(){return {
  document_ref:$("reference").value.trim().toUpperCase(),
  document_type:$("doc-type").value,
  issuer_demo_id:$("issuer").value.trim().toUpperCase(),
  document_date_demo:$("doc-date").value,
  claim_summary:$("claim").value,
  source_metadata_ref:$("evidence").value.trim().toUpperCase(),
  caveat:$("caveat").value,
};}
function from(sample){
  $("reference").value=sample.document_ref;
  $("doc-type").value=sample.document_type;
  $("issuer").value=sample.issuer_demo_id;
  $("doc-date").value=sample.document_date_demo;
  $("claim").value=sample.claim_summary;
  $("evidence").value=sample.source_metadata_ref;
  $("caveat").value=sample.caveat;
}
function notice(s,invalid=false){$("notice").textContent=s;$("notice").className=invalid?"warning":"notice muted";}
function show(){
  const s=REFERENCE_STATUSES;
  $("source").textContent="Sumber fiktif "+REVIEWED_DOSSIER.id+" versi "+
    REVIEWED_DOSSIER.version+" · "+REVIEWED_DOSSIER.status+
    " · kebutuhan "+REVIEWED_DOSSIER.need_snapshot.need_id+
    " (tidak ada keputusan/anggaran di dalamnya).";
  const rows=referenceList(register,REVIEWED_DOSSIER);
  const entry=register.entries.find(x=>x.id===selected);
  $("entries").replaceChildren();
  for(const row of rows){
    const li=el("li",row.document_ref+" · "+row.document_type+
      " · "+row.status+(row.needs_recheck?" · PERLU PERIKSA SUMBER ULANG":"")+
      " · "+row.authenticity);
    const btn=el("button","Lihat catatan "+row.id);btn.type="button";
    btn.className="secondary";btn.addEventListener("click",()=>{
      selected=row.id;const target=register.entries.find(x=>x.id===selected);
      if(target){from(target.metadata);show();}
    });
    li.append(el("span","  "),btn);$("entries").append(li);
  }
  $("status").textContent=entry
    ? "Referensi "+entry.metadata.document_ref+" · "+s[entry.status]+
      " · revisi "+entry.revision+" · BELUM DIUJI"
    : rows.length+" referensi tersimpan dalam memori simulasi; belum ada yang dipilih.";
  $("reference-form").hidden=!!entry&&!["draf","perlu_klarifikasi"].includes(entry.status);
  $("submit-ref").hidden=!entry||entry.status!=="draf";
  $("review-form").hidden=!entry||entry.status!=="menunggu_telaah";
  $("handoff").value=entry?referenceHandoffNote(register,entry.id,REVIEWED_DOSSIER):"";
}
$("reference-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    const input=form();
    const prior=selected&&register.entries.find(x=>x.id===selected);
    register=prior?reviseExternalReference(register,prior.id,REVIEWED_DOSSIER,input,maker)
      :addExternalReference(register,REVIEWED_DOSSIER,input,maker);
    if(!prior)selected=register.entries.at(-1).id;
    show();notice("Referensi contoh tersimpan, bukan bukti dokumen asli.");
  }catch(err){notice(err.message,true);}
});
$("submit-ref").addEventListener("click",()=>{
  try{
    register=submitExternalReference(register,selected,REVIEWED_DOSSIER,maker);
    show();notice("Referensi hanya diajukan untuk pemeriksaan metadata.");
  }catch(err){notice(err.message,true);}
});
$("review-form").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    register=reviewExternalReference(register,selected,REVIEWED_DOSSIER,reviewer,
      $("action").value,$("review-reason").value,$("ack").checked);
    $("ack").checked=false;show();
    notice("Penelaahan metadata dicatat. Keaslian dan keberlakuan dokumen belum diperiksa.");
  }catch(err){notice(err.message,true);}
});
$("new-ref").addEventListener("click",()=>{
  selected=null;
  $("reference-form").reset();
  $("review-reason").value="";
  $("ack").checked=false;
  show();
  notice("Form baru siap. Catatan referensi sebelumnya tetap tersimpan di memori halaman.");
  $("reference").focus();
});
$("clear").addEventListener("click",()=>{
  register=createReferenceRegister();selected=null;
  $("reference-form").reset();$("review-reason").value="";$("ack").checked=false;
  show();notice("Seluruh catatan referensi DEMO telah dikosongkan dari halaman.");
});
from(EXTERNAL_REFERENCE_SAMPLE);
show();
