import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
import {TYPES,TOPICS,OWNERS,YEARS,initial,plan,change,list,summary} from "./coaching-model.mjs";
const $=id=>document.getElementById(id),el=(tag,text)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=String(text);return x;},choices=a=>a.map(x=>[x,x]),opts=(x,a)=>x.replaceChildren(...a.map(([v,l])=>new Option(l,v)));
import {register,notify} from "./leadership-bridge.mjs";
import {mountPaperless} from "./paperless-editor.mjs";
let state=initial();
const paperless=mountPaperless({root:$("coach-paperless"),getCoaching:()=>state,getScope:()=>({year:+$("coach-cy").value,region_id:$("coach-cr").value,facility_id:$("coach-cf").value}),onChange:notify});
register("coaching",s=>list(state,s));
register("documents",s=>paperless.dashboard(s));
register("documentTasks",s=>[s.year-1,s.year].filter(y=>YEARS.includes(y)).flatMap(year=>paperless.tasks({...s,year})));
register("coachingTasks",s=>[s.year-1,s.year].filter(y=>YEARS.includes(y)).flatMap(year=>list(state,{...s,year})));
const labels={PLANNED:"Rencana",RESULT_DRAFT:"Draf hasil",FOLLOWUP_OPEN:"Tindak lanjut terbuka",CLOSED_DEMO:"Ditutup DEMO"};
function field(form,label,type,options){const l=el("label",label),x=el(options?"select":type==="textarea"?"textarea":"input");x.required=true;if(options)opts(x,options);else if(type==="textarea")x.maxLength=300;else{x.type=type;if(type==="number"){x.min=0;x.max=1000;x.step=1;}if(type==="date"){x.min="2026-01-01";x.max="2030-12-31";}}l.append(x);form.append(l);return x;}
function button(text,fn){const b=el("button",text);b.type="button";b.addEventListener("click",fn);return b;}
function submit(form,text,fn){const b=el("button",text);b.type="submit";form.append(b);form.addEventListener("submit",e=>{e.preventDefault();act(fn);});}
function act(fn){try{state=fn();render();$("coach-feedback").textContent="Perubahan DEMO dicatat dalam memori.";}catch(e){$("coach-feedback").textContent=e.message;}}
function facilities(){opts($("coach-cf"),[["ALL","Semua Puskeswan"],...F.filter(f=>$("coach-cr").value==="ALL"||f.region_id===$("coach-cr").value).map(f=>[f.facility_id,f.facility_label])]);}
function card(r){const a=el("article");a.className="review-card";a.append(el("h3",r.type+" · "+r.topic),el("p",F.find(f=>f.facility_id===r.facility_id).facility_label+" · "+r.date+" · "+labels[r.status]),el("p",r.owner+" · Rencana "+r.planned+" · Hadir "+(r.attendance??"Belum dicatat")));
if(r.result!==null)a.append(el("p","Hasil: "+r.result),el("p","Rekomendasi: "+r.recommendation+" · Tenggat "+r.due));if(r.completion!==null)a.append(el("p","Penutupan: "+r.completion));
if(r.status==="PLANNED"){const form=el("form");form.className="filter-row";const n=field(form,"Hadir","number"),result=field(form,"Hasil DEMO","textarea"),rec=field(form,"Rekomendasi DEMO","textarea"),due=field(form,"Tenggat","date");due.min=r.date;submit(form,"Simpan draf hasil",()=>change(state,r.id,r.revision,"record",{attendance:n.valueAsNumber,result:result.value,recommendation:rec.value,due:due.value}));a.append(form);}
else if(r.status==="RESULT_DRAFT")a.append(button("Catat telaah DEMO",()=>act(()=>change(state,r.id,r.revision,"review"))),button("Minta perbaikan",()=>act(()=>change(state,r.id,r.revision,"return"))));
else if(r.status==="FOLLOWUP_OPEN"){const form=el("form"),note=field(form,"Hasil tindak lanjut DEMO","textarea");submit(form,"Catat penutupan DEMO",()=>change(state,r.id,r.revision,"close",{completion:note.value}));a.append(form);}
const h=el("details");h.append(el("summary","Riwayat revisi"));for(const x of r.history)h.append(el("p",x.revision+" · "+x.action+(x.previous?.result?" · Hasil sebelumnya: "+x.previous.result:"")));a.append(h);return a;}
function render(){const rows=list(state,{year:+$("coach-cy").value,region_id:$("coach-cr").value,facility_id:$("coach-cf").value}),s=summary(rows);$("coach-stats").textContent="Kegiatan "+s.activities+" · Rencana "+s.planned+" · Draf hasil "+s.review+" · Tindak lanjut "+s.open+" · Ditutup "+s.closed+" · Kehadiran "+(s.attendance??"—")+" (bukan orang unik)";$("coach-records").replaceChildren(...(rows.length?rows.map(card):[el("p","Belum ada kegiatan pada cakupan ini.")]));paperless.render();notify();}
opts($("coach-cy"),choices(YEARS));opts($("coach-cr"),[["ALL","Semua wilayah"],...new Map(F.map(f=>[f.region_id,f.region_label]))]);facilities();for(const id of ["coach-cy","coach-cr","coach-cf"])$(id).addEventListener("change",()=>{if(id==="coach-cr")facilities();render();});
const form=$("coach-plan"),target=field(form,"Puskeswan sasaran","",F.map(f=>[f.facility_id,f.facility_label])),d=field(form,"Tanggal","date"),type=field(form,"Jenis","",choices(TYPES)),topic=field(form,"Topik","",choices(TOPICS)),owner=field(form,"Penanggung jawab","",choices(OWNERS)),n=field(form,"Rencana peserta","number");
submit(form,"Buat rencana DEMO",()=>{const next=plan(state,{facility_id:target.value,date:d.value,type:type.value,topic:topic.value,owner:owner.value,planned:n.valueAsNumber});$("coach-cy").value=d.value.slice(0,4);$("coach-cr").value="ALL";facilities();$("coach-cf").value=target.value;form.reset();return next;});
$("coach-reset").addEventListener("click",()=>{if(confirm("Hapus semua kegiatan dan arsip simulasi?")){paperless.reset();act(s=>({...initial(),next:s.next}));}});render();
