import {empty,create,action,stale,draftText,search,TYPES,EVIDENCE} from "./paperless-model.mjs";
const el=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=String(t);return n;};
const button=(t,fn)=>{const b=el("button",t);b.type="button";b.addEventListener("click",fn);return b;};
const select=values=>{const s=el("select");s.append(...values.map(([v,l])=>new Option(l,v)));return s;};
function labeled(text,input){const l=el("label",text);l.append(input);return l;}
const labels={DRAFT:"Draf",CORRECTION:"Perbaikan",REVIEW:"Telaah",ARCHIVED_DEMO:"Arsip simulasi"};
export function mountPaperless({root,getCoaching,getScope}){
 let docs=empty();const feedback=el("p"),form=el("div"),list=el("div"),query=el("input");feedback.setAttribute("role","status");query.type="search";query.placeholder="Nomor DEMO, jenis, topik, Puskeswan";root.append(form,labeled("Cari arsip DEMO",query),feedback,list);
 function act(fn){try{docs=fn();render();feedback.textContent="Perubahan dicatat dalam memori.";}catch(e){feedback.textContent=e.message;}}
 function render(){const c=getCoaching(),scope=getScope(),sources=c.records.filter(r=>r.result!==null&&+r.date.slice(0,4)===scope.year&&(scope.region_id==="ALL"||r.region_id===scope.region_id)&&(scope.facility_id==="ALL"||r.facility_id===scope.facility_id));
 form.replaceChildren(el("p","Sumber berasal dari kegiatan yang sudah memiliki draf hasil, dengan filter pembinaan di atas."));
 if(sources.length){const a=select(sources.map(r=>[r.id,r.id+" · "+r.topic+" · "+r.date])),t=select(TYPES.map(v=>[v,v]));form.append(labeled("Kegiatan sumber",a),labeled("Jenis draf",t),button("Buat draf dari kegiatan",()=>act(()=>create(docs,c,a.value,t.value))));}else form.append(el("p","Belum ada kegiatan dengan hasil pada cakupan ini."));
 drawList();}
 function drawList(){const c=getCoaching(),rows=search(docs,{...getScope(),q:query.value});list.replaceChildren(el("p",rows.length+" dokumen DEMO pada cakupan ini"));for(const d of rows){const card=el("article");card.className="review-card";const old=stale(d,c);card.append(el("h3",d.type+" · "+d.id),el("p",d.activity_id+" · "+labels[d.status]+" · versi "+d.versions.length+(old?" · SUMBER BERUBAH":"")),el("p","Metadata bukti: "+d.evidence.length+"/4 (bukan berkas asli)"));
 const v=select(d.versions.map(x=>[x.number,"Versi "+x.number]));v.value=String(d.versions.length);const preview=el("textarea");preview.readOnly=true;preview.rows=12;preview.value=draftText(d);v.addEventListener("change",()=>{preview.value=draftText(d,+v.value);});card.append(labeled("Versi naskah",v),labeled("Naskah kerja (teks untuk disalin)",preview),button("Pilih seluruh teks draf",()=>{preview.focus();preview.select();}));
 for(const e of d.evidence)card.append(el("p",e.kind+" · "+e.ref));
 const apply=(actName,p={})=>act(()=>action(docs,getCoaching(),d.id,d.revision,actName,p));
 if(d.status==="ARCHIVED_DEMO")card.append(button("Buka revisi DEMO",()=>apply("reopen")));
 else if(old||d.status==="CORRECTION")card.append(button("Buat versi baru dari sumber",()=>apply("refresh")));
 if(!old&&["DRAFT","CORRECTION"].includes(d.status)){const kind=select(EVIDENCE.map(x=>[x,x])),ref=el("input");ref.placeholder="DEMO-AGENDA-01";ref.maxLength=45;card.append(labeled("Jenis metadata bukti",kind),labeled("Kode fiktif",ref),button("Tambah metadata",()=>apply("evidence",{kind:kind.value,ref:ref.value})),button("Ajukan telaah DEMO",()=>apply("submit")));}
 if(!old&&d.status==="REVIEW"){const n=el("textarea");n.maxLength=300;card.append(labeled("Catatan telaah DEMO",n),button("Minta perbaikan",()=>apply("return",{note:n.value})),button("Catat arsip DEMO",()=>apply("archive",{note:n.value})));}
 const h=el("details");h.append(el("summary","Riwayat perubahan"));for(const x of d.history)h.append(el("p",x.revision+" · "+x.action+(x.note?" · "+x.note:"")));card.append(h);list.append(card);}}
 query.addEventListener("input",drawList);return {render,reset(){docs=empty();query.value="";feedback.textContent="Arsip simulasi direset bersama kegiatan.";}};}
