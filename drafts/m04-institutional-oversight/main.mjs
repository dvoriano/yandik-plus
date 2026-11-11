/** M04-S9E | KODE DITULIS, BELUM DIUJI. UI baca-saja tanpa storage/API. */
import {AGENDA_DEMO,REGISTER_DEMO} from "./fixtures.mjs";
import {buildOversight,oversightText,ATTENTION} from "./oversight.mjs";
const $=id=>document.getElementById(id);
const el=(tag,value="")=>{const n=document.createElement(tag);n.textContent=String(value);return n;};
for(const group of new Set(AGENDA_DEMO.rows.map(x=>x.group))){
  const option=el("option",group);option.value=group;$("group").append(option);
}
for(const [key,label] of Object.entries(ATTENTION)){
  const option=el("option",label);option.value=key;$("status").append(option);
}
function render(){
  const board=buildOversight(AGENDA_DEMO,REGISTER_DEMO,$("date").value||"2026-11-11");
  $("counts").textContent="Agenda "+board.total_agenda+
    " · catatan "+board.registered_notes+
    " · tanpa catatan/dibatalkan "+board.missing_or_canceled+
    " · lewat tenggat DEMO "+board.overdue_notes+
    " · sumber berubah "+(board.source_stale?"YA":"tidak terdeteksi");
  $("repo").textContent="Status repo pada snapshot "+board.repo_snapshot.observed_on+
    ": "+board.repo_snapshot.visibility.toUpperCase()+
    ". Bukan verifikasi kondisi real-time.";
  const filtered=board.rows.filter(x=>
    ($("group").value==="all"||x.group===$("group").value)&&
    ($("status").value==="all"||x.attention_code===$("status").value));
  const list=$("list");list.replaceChildren();
  for(const row of filtered){
    const li=el("li");
    li.append(el("strong",row.agenda_title),
      el("p",row.group+" · "+row.attention_label+
        " · prioritas contoh "+row.priority_demo),
      el("p","Catatan: "+(row.note_id||"belum ada")+
        " · petugas DEMO: "+(row.assignee_demo_id||"belum ada")+
        " · tenggat DEMO: "+(row.due_date_demo||"belum ada")),
      el("p","Bukti yang diperlukan: "+
        (row.evidence_requested_demo||row.evidence_minimum)),
      el("p","Tindak lanjut contoh: "+(row.next_step_demo||"belum dicatat")));
    list.append(li);
  }
  if(!filtered.length)list.append(el("li","Tidak ada butir sesuai filter DEMO."));
  $("summary").value=oversightText(board);
  $("error").textContent="";
}
function safeRender(){
  try{render();}
  catch(err){$("list").replaceChildren();$("summary").value="";
    $("counts").textContent="";$("error").textContent="Gagal memuat DEMO: "+err.message;}
}
for(const id of ["date","group","status"])$(id).addEventListener("change",safeRender);
safeRender();
