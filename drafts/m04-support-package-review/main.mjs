/** M04-S11 | KODE DITULIS, BELUM DIUJI. In-memory demonstration only. */
import {NEEDS,PACKAGES,MAKER,REVIEWER,REFERENCES} from "./fixtures.mjs";
import {createReview,reviseReview,submitReview,reviewPackage,reviewSummary} from "./review.mjs";
const $=id=>document.getElementById(id);
const node=(tag,value)=>{const n=document.createElement(tag);n.textContent=value;return n;};
const create=()=>createReview(NEEDS,PACKAGES,"DEMO-TELAAH-001",{
 package_id:PACKAGES[0].id,fields:{...REFERENCES,decision_reference:null,budget_reference:null}},MAKER);
let record=create();
function feedback(s,error=false){$("feedback").textContent=s;$("feedback").dataset.error=String(error);}
function enable(form,enabled){for(const e of $(form).querySelectorAll("input,textarea,button"))e.disabled=!enabled;}
function refText(ref){return ref?ref.document_ref+" · "+ref.issuer_demo_id+" · "+ref.date_demo+" · "+ref.metadata_ref:"Belum dicantumkan.";}
function render(){
 const s=reviewSummary(record,NEEDS,PACKAGES);
 $("source").replaceChildren(node("h3",s.title),...record.snapshot.lines.map(l=>
 node("p",l.puskeswan_id+" · "+l.item+" · "+l.quantity+" "+l.unit+" · versi "+l.source_version)));
 $("status").textContent=s.status+" · revisi "+record.revision+(s.stale?" · sumber berubah":"")+" · Persetujuan: tidak ada · Dana: belum dikonfirmasi.";
 $("decision").checked=s.decision_metadata_present;$("budget").checked=s.budget_metadata_present;
 $("decision-detail").textContent=refText(record.content.decision_reference);
 $("budget-detail").textContent=refText(record.content.budget_reference);
 $("note").value=record.content.note;
 enable("metadata",!s.stale&&["draf","perlu_perbaikan"].includes(record.status));
 $("submit").disabled=s.stale||record.status!=="draf";
 enable("review",!s.stale&&record.status==="menunggu_telaah");
 $("reason").value="";$("ack").checked=false;
 $("history").replaceChildren(...record.history.map(e=>node("li",e.action+" · "+e.actor.id+" · "+e.note)));
}
function apply(fn){try{record=fn();render();feedback("Catatan DEMO diperbarui. Tidak ada keputusan resmi.");}catch(e){feedback(e.message,true);}}
$("metadata").addEventListener("submit",e=>{e.preventDefault();apply(()=>reviseReview(record,NEEDS,PACKAGES,{
 decision_reference:$("decision").checked?REFERENCES.decision_reference:null,
 budget_reference:$("budget").checked?REFERENCES.budget_reference:null,note:$("note").value},MAKER));});
$("submit").addEventListener("click",()=>apply(()=>submitReview(record,NEEDS,PACKAGES,MAKER)));
$("review").addEventListener("submit",e=>{e.preventDefault();const action=e.submitter?.value;if(!action)return;
 apply(()=>reviewPackage(record,NEEDS,PACKAGES,REVIEWER,action,$("reason").value,$("ack").checked));});
$("reset").addEventListener("click",()=>apply(create));
render();
