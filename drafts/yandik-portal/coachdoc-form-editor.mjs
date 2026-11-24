/** CODE_ONLY | DOM editor, no uploads, issuance, signature, send or download. */
import {TYPES,TOPICS,RESULTS,RECOMMENDATIONS,COMPLETIONS,REASONS,EVIDENCE,DOCS,ACTIONS,fmt,missingEvidence,coachdocCommand,slotGroups,progress} from "./coachdoc-form-model.mjs";
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
function line(p,k,v){p.append(el("p",k+": "+fmt(v)));}
function field(p,k,n){const l=el("label",k);l.append(n);p.append(l);return n;}
function select(p,k,values){const s=el("select");s.append(...values.map(x=>new Option(fmt(x),x)));return field(p,k,s);}
function input(p,k,type,min,max){const n=el("input");n.type=type;n.required=true;if(min!=null)n.min=String(min);if(max!=null)n.max=String(max);if(type==="number")n.step="1";return field(p,k,n);}
function btn(p,k,fn){const n=el("button",k);n.type="button";n.addEventListener("click",fn);p.append(n);return n;}
function history(p,r,read,ctx){
 if(!r.current_revision)return;
 const h=el("details");h.append(el("summary","Baca revisi terdahulu"));p.append(h);
 const n=input(h,"Nomor revisi","number",1,r.current_revision);n.value=r.current_revision;
 const out=el("div");h.append(out);let generation=0;
 btn(h,"Baca revisi",async()=>{if(!n.reportValidity()||!ctx.clean())return;const g=++generation;out.replaceChildren(el("p","Memuat..."));
  try{const v=await read(r.resource==="coaching"?"coachingDetail":"documentDetail",{record_id:r.record_id,revision:n.valueAsNumber});if(g!==generation)return;
   out.replaceChildren(el("p","Revisi "+v.revision+" (baca saja)"));if(v.resource==="documents")out.append(el("pre",v.draft_text??"Belum ada draf"));else showActivity(out,v.snapshot);
  }catch{if(g===generation)out.replaceChildren(el("p","Revisi tidak tersedia atau akses dibatasi."));}
 });
}
function showActivity(p,s){
 if(!s){p.append(el("p","Slot belum diisi."));return;}
 for(const [k,label] of [["date","Tanggal"],["type","Jenis kegiatan"],["topic","Topik"],["stage","Tahap"],["planned","Rencana peserta"],["attendance","Kehadiran aktual"],["recorded_on","Tanggal pencatatan"],["result","Hasil"],["recommendation","Rekomendasi"],["due","Tenggat tindak lanjut"],["completion","Penyelesaian"],["completed_on","Tanggal penyelesaian"]])line(p,label,s[k]);
}
function actionForm(p,r,ctx){
 if(!ctx.enabled||!r.candidate_actions?.length)return;
 const f=el("form");f.className="backend-report";f.addEventListener("submit",e=>e.preventDefault());p.append(f);
 const a=el("select");a.append(...r.candidate_actions.map(k=>new Option(ACTIONS[k],k)));field(f,"Tindakan DEMO",a);
 const fields=el("div");fields.className="backend-report";f.append(fields);let previous=a.value,read=()=>null;
 function draw(){
  fields.replaceChildren();
  const action=a.value,day=(label,min=r.year+"-01-01",max="2030-12-31")=>input(fields,label,"date",min,max),num=label=>input(fields,label,"number",0,1000),sel=(label,values)=>select(fields,label,values);
  if(action==="plan"){const d=day("Tanggal rencana",r.year+"-01-01",r.year+"-12-31"),type=sel("Jenis kegiatan",TYPES),topic=sel("Topik",TOPICS),n=num("Rencana peserta");read=()=>({date:d.value,type:type.value,topic:topic.value,planned:n.valueAsNumber});}
  else if(action==="record"){const n=num("Kehadiran aktual"),res=sel("Hasil",RESULTS),rec=sel("Rekomendasi",RECOMMENDATIONS),d=day("Tanggal pencatatan",r.snapshot.date),due=day("Tenggat tindak lanjut",r.snapshot.date);read=()=>({attendance:n.valueAsNumber,result:res.value,recommendation:rec.value,due:due.value,recorded_on:d.value});}
  else if(action==="close"){const c=sel("Penyelesaian",COMPLETIONS),d=day("Tanggal penyelesaian",r.snapshot.recorded_on);read=()=>({completion:c.value,completed_on:d.value});}
  else if(action==="evidence"){const kind=sel("Jenis metadata",missingEvidence(r.snapshot)),ref=input(fields,"Referensi bukti sintetis","text");ref.pattern="DEMO-EVIDENCE-[A-Z0-9_-]{1,32}";read=()=>({kind:kind.value,ref:ref.value});}
  else if(["return_result","return_doc","archive","reopen"].includes(action)){const why=sel("Alasan DEMO",REASONS);read=()=>({reason:why.value});}
  else read=()=>null;
 }
 a.addEventListener("change",()=>{if(!ctx.clean()){a.value=previous;return;}previous=a.value;draw();});fields.addEventListener("input",ctx.markDirty);draw();
 btn(f,"Simpan tindakan DEMO",()=>{if(!f.reportValidity())return;try{const command=coachdocCommand(r,a.value,read(),ctx.id());
  const question=a.value==="refresh"?"Perbarui dari sumber? Metadata bukti versi baru harus dikonfirmasi ulang. Histori versi lama tetap ada.":"Catat tindakan DEMO ini? Bukan keputusan atau dokumen resmi.";
  if(confirm(question))ctx.send(r.resource,command);
 }catch(e){ctx.error(e.message);}});
}
export function mountCoaching(parent,rows,read,ctx){
 const m=progress(rows);parent.append(el("p",m.planned+" dari "+m.slots+" slot memiliki kegiatan · "+m.open+" tindak lanjut terbuka · "+m.closed+" ditutup DEMO"),el("p","Slot kosong tidak dihitung sebagai kegiatan. Kehadiran agregat bukan daftar peserta atau sertifikat."));
 for(const r of rows){const box=el("details");box.append(el("summary","Slot "+r.slot+" · "+fmt(r.snapshot?.stage??"BELUM DIRENCANAKAN")));parent.append(box);showActivity(box,r.snapshot);line(box,"Revisi",r.revision);actionForm(box,r,ctx);history(box,r,read,ctx);}
}
export function mountDocuments(parent,rows,read,ctx){
 parent.append(el("p","Empat jenis draf per kegiatan. Sumber dikunci pada revisi tertentu. Tidak ada nomor resmi, unggah berkas, tanda tangan atau pengiriman."));
 for(const g of slotGroups(rows)){const group=el("section");group.append(el("h3","Kegiatan slot "+g.slot));parent.append(group);
  for(const r of g.rows){const box=el("details"),s=r.snapshot;box.append(el("summary",(DOCS[r.kind]??r.kind)+" · "+fmt(s?.stage??"BELUM DIBUAT")+(r.source_changed?" · SUMBER BERUBAH":"")));group.append(box);
   line(box,"Tahap kegiatan sumber",r.source_stage);line(box,"Revisi sumber terkini",r.source_current_revision);
   if(s){line(box,"Versi draf",s.version);line(box,"Revisi sumber terikat",s.source_revision);line(box,"Revisi dokumen",r.revision);
    if(r.source_changed)box.append(el("p","Draf ini bukan versi terkini. Telaah/arsip dibatasi; perbarui dari sumber atau buka kembali arsip sesuai kewenangan."));
    box.append(el("pre",r.draft_text??"Belum tersedia"));
    const evidence=el("ul");for(const k of EVIDENCE){const e=s.evidence.find(x=>x.kind===k);evidence.append(el("li",k+" · "+(e?e.ref:"Belum dicatat")));}box.append(evidence);
   }else box.append(el("p","Draf dibuat setelah hasil kegiatan tercatat."));
   actionForm(box,r,ctx);history(box,r,read,ctx);
  }
 }
}
