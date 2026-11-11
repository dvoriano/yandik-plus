/** M04-S9D | KODE DITULIS, BELUM DIUJI. Browser memory only. */
import {AGENDA_DEMO,SECRETARIAT_DEMO,REVIEWER_DEMO,EXAMPLE,REGISTER_DEMO} from "./fixtures.mjs";
import {STATES,addDiscussion,reviseDiscussion,submitDiscussion,reviewDiscussion,
  cancelDiscussion,discussionSummary,discussionHandoff} from "./register.mjs";
const $=id=>document.getElementById(id);
const el=(tag,label="")=>{const x=document.createElement(tag);x.textContent=label;return x;};
let book=REGISTER_DEMO,selected=null;
for(const row of AGENDA_DEMO.rows){const op=el("option",row.subject);op.value=row.id;$("agenda").append(op);}
for(const [k,v] of Object.entries(STATES)){const op=el("option",v);op.value=k;$("filter").append(op);}
function fields(){return {subject:AGENDA_DEMO.rows.find(x=>x.id===$("agenda").value)?.subject,
  discussion:$("discussion").value,evidence_needed:$("evidence").value,
  next_step:$("next").value,assigned_demo_id:$("assignee").value.trim().toUpperCase(),
  due_date_demo:$("due").value};}
function fill(v){$("agenda").value=AGENDA_DEMO.rows.find(x=>x.subject===v.subject)?.id||AGENDA_DEMO.rows[0].id;
  $("discussion").value=v.discussion;$("evidence").value=v.evidence_needed;
  $("next").value=v.next_step;$("assignee").value=v.assigned_demo_id;
  $("due").value=v.due_date_demo;}
function flash(msg,bad=false){$("notice").textContent=msg;$("notice").className=bad?"warning":"muted";}
function render(){
  const b=discussionSummary(book,AGENDA_DEMO,$("asof").value||"2026-11-11");
  $("summary").textContent="Agenda "+b.agenda_total+" · catatan "+b.total+
    " · tanpa catatan "+b.unrecorded.length+" · sumber berubah "+
    (b.source_stale?"YA":"tidak terdeteksi");
  const list=$("records");list.replaceChildren();
  for(const x of b.rows.filter(x=>$("filter").value==="all"||x.status===$("filter").value)){
    const li=el("li",x.id+" | "+x.plan.subject+" | "+STATES[x.status]);
    const btn=el("button","Lihat");btn.type="button";btn.className="secondary";
    btn.addEventListener("click",()=>{selected=x.id;fill(x.plan);render();});
    li.append(el("span","  "),btn);list.append(li);
  }
  if(!list.childElementCount)list.append(el("li","Belum ada catatan sesuai filter."));
  const current=book.entries.find(x=>x.id===selected);
  $("chosen").textContent=current?current.id+" · "+STATES[current.status]:"Membuat catatan baru.";
  $("agenda").disabled=!!current;
  $("form").hidden=!!current&&!["draf","perlu_perbaikan"].includes(current.status);
  $("submit-review").hidden=!current||current.status!=="draf";
  $("review").hidden=!current||current.status!=="menunggu_telaah";
  $("cancel").hidden=!current||["dicatat_sebagai_bahan","dibatalkan"].includes(current.status);
  $("handoff").value=discussionHandoff(book,AGENDA_DEMO,$("asof").value||"2026-11-11");
}
function act(cb){try{cb();render();flash("Catatan hanya tersimpan dalam memori DEMO.");}
 catch(e){flash(e.message,true);}}
$("form").addEventListener("submit",e=>{e.preventDefault();act(()=>{
  if(selected)book=reviseDiscussion(book,AGENDA_DEMO,selected,fields(),SECRETARIAT_DEMO);
  else{book=addDiscussion(book,AGENDA_DEMO,$("agenda").value,fields(),SECRETARIAT_DEMO);
    selected=book.entries.at(-1).id;}
});});
$("new").addEventListener("click",()=>{selected=null;fill(EXAMPLE);render();flash("Form baru DEMO.");});
$("submit-review").addEventListener("click",()=>act(()=>{
  book=submitDiscussion(book,AGENDA_DEMO,selected,SECRETARIAT_DEMO);}));
$("review").addEventListener("submit",e=>{e.preventDefault();act(()=>{
  book=reviewDiscussion(book,AGENDA_DEMO,selected,REVIEWER_DEMO,$("decision").value,$("reason").value);
});});
$("cancel").addEventListener("submit",e=>{e.preventDefault();act(()=>{
  book=cancelDiscussion(book,AGENDA_DEMO,selected,SECRETARIAT_DEMO,$("cancel-reason").value);
});});
for(const id of ["filter","asof"])$(id).addEventListener("change",()=>{try{render();}catch(e){flash(e.message,true);}});
fill(EXAMPLE);try{render();}catch(e){flash("Kode BELUM DIUJI: "+e.message,true);}
