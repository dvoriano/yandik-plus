/** CODE_ONLY | Four scoped regional register panels. Source cannot be edited here. */
import {DOMAINS,REASONS,ACTIONS,fmt,sourceFields,reviewCommand,coverageText,filterRows} from "./regional-form-model.mjs";
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
function select(parent,label,options){const l=el("label",label),s=el("select");for(const [v,t] of options)s.append(new Option(t,v));l.append(s);parent.append(l);return s;}
function button(parent,label,fn){const b=el("button",label);b.type="button";b.addEventListener("click",fn);parent.append(b);return b;}
function table(parent,head,rows){
 const wrap=el("div");wrap.className="table-wrap";const t=el("table"),h=el("thead"),tr=el("tr");for(const x of head){const th=el("th",x);th.scope="col";tr.append(th);}h.append(tr);t.append(h);const body=el("tbody");
 for(const row of rows){const tr=el("tr");for(const x of row)tr.append(el("td",fmt(x)));body.append(tr);}t.append(body);wrap.append(t);parent.append(wrap);
}
function detail(parent,domain,row,read,ctx){
 const box=el("details");box.append(el("summary",row.record_id+" · "+fmt(row.review_state)));parent.append(box);
 table(box,["Informasi sumber (baca saja)","Nilai"],sourceFields(domain,row.observation));
 if(row.observation.checks)table(box,["Butir observasi","Status"],Object.entries(row.observation.checks).map(([k,v])=>[fmt(k),fmt(v)]));
 box.append(el("p","Revisi telaah "+row.review_revision+" · sumber tidak diubah oleh telaah."));
 const hist=el("div");box.append(hist);let fetching=false;
 button(box,"Lihat histori telaah",async()=>{if(fetching)return;fetching=true;hist.replaceChildren(el("p","Memuat histori..."));try{const h=await read("regionalHistory",{record_id:row.record_id});hist.replaceChildren();if(!h.events.length)hist.append(el("p","Belum ada telaah."));else table(hist,["Revisi","Tindakan","Alasan","Status","Waktu (UTC)"],h.events.map(x=>[x.revision,ACTIONS[x.action]??x.action,REASONS[x.reason_code]??x.reason_code,x.state,x.recorded_at_utc]));}catch{hist.replaceChildren(el("p","Histori tidak tersedia atau akses dibatasi."));}finally{fetching=false;}});
 if(!ctx.enabled||!row.candidate_actions?.length)return;
 const f=el("form");f.className="backend-report";f.addEventListener("submit",e=>e.preventDefault());box.append(f);
 const a=select(f,"Tindakan telaah DEMO",row.candidate_actions.map(k=>[k,ACTIONS[k]])),reason=select(f,"Alasan",Object.entries(REASONS));
 f.addEventListener("change",ctx.markDirty);
 button(f,"Simpan catatan telaah",()=>{try{const cmd=reviewCommand(row,a.value,reason.value,ctx.id());if(confirm("Catat telaah DEMO? Tidak mengubah data sumber atau menerbitkan keputusan resmi."))ctx.send("regional",cmd);}catch(e){ctx.error(e.message);}});
}
export async function mountRegional(parent,region,year,read,ctx){
 parent.append(el("p","Register wilayah: "+region+" · "+year),el("p","Data sumber baca-saja. Telaah tidak menyatakan legalitas, diagnosis terkonfirmasi, izin praktik, atau penerbitan sertifikat."));
 const filter=el("div");filter.className="filter-row";parent.append(filter);
 const domain=select(filter,"Jenis layanan",Object.entries(DOMAINS)),state=select(filter,"Status telaah",[["ALL","Semua"],["NOT_REVIEWED","Belum ditelaah"],["CLARIFICATION_REQUESTED_DEMO","Klarifikasi"],["DISCUSSION_RECORDED_DEMO","Pembahasan tercatat"]]);
 const l=el("label","Cari referensi/periode"),q=el("input");q.type="search";l.append(q);filter.append(l);
 const body=el("div");parent.append(body);let generation=0,selected=domain.value,reviewState=state.value,term="";
 async function draw(){
  const g=++generation,d=selected;body.replaceChildren(el("p","Memuat register..."));
  try{const r=await read(d,{region_id:region,year});if(g!==generation)return;
   body.replaceChildren(el("h3",DOMAINS[d]),el("p",coverageText(r)));if(!r.available)return;
   const rows=filterRows(r.rows,term,reviewState);body.append(el("p",rows.length+" catatan sesuai filter."));
   for(const row of rows)detail(body,d,row,read,ctx);
  }catch{if(g===generation)body.replaceChildren(el("p","Sumber tidak tersedia atau akses dibatasi. Tidak menggunakan data contoh pengganti."));}
 }
 domain.addEventListener("change",()=>{if(!ctx.clean()){domain.value=selected;return;}selected=domain.value;draw();});
 state.addEventListener("change",()=>{if(!ctx.clean()){state.value=reviewState;return;}reviewState=state.value;draw();});
 q.addEventListener("change",()=>{if(!ctx.clean()){q.value=term;return;}term=q.value;draw();});
 await draw();
}
