/** CODE_ONLY | Source-bound Support UI; no budget, actual procurement or distribution. */
import {filterSupport,supportCommand,pendingShipments,pendingHandovers,monitorable} from "./support-form-model.mjs";
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
const fmt=v=>v==null?"Belum tersedia":String(v).replaceAll("_"," ");
const labels={propose:"Simpan usulan kebutuhan",submit:"Ajukan DEMO",county_review:"Telaah kabupaten/kota",plan_package:"Susun rencana paket",schedule:"Jadwalkan",dispatch:"Catat pengiriman",receive:"Catat penerimaan",handover:"Catat referensi serah terima",monitor:"Catat pemanfaatan",return_draft:"Kembalikan ke draf"};
const reasons=["FILL_GAP_DEMO","REPLACE_DAMAGED_DEMO","REVIEW_CONDITION_DEMO"];
function field(p,name,n){const l=el("label",name);l.append(n);p.append(l);return n;}
function sel(options){const n=el("select");n.append(...options.map(x=>new Option(Array.isArray(x)?x[1]:fmt(x),Array.isArray(x)?x[0]:x)));return n;}
function input(type,min,max){const n=el("input");n.type=type;n.required=true;if(min!=null)n.min=String(min);if(max!=null)n.max=String(max);if(type==="number")n.step="1";if(type==="text")n.pattern="DEMO-[A-Z0-9_-]{1,40}";return n;}
function button(p,label,fn){const n=el("button",label);n.type="button";n.addEventListener("click",fn);p.append(n);return n;}
function line(p,label,v){p.append(el("p",label+": "+fmt(v)));}
function history(p,s){
 const parts=[["Pengiriman",s.shipments],["Penerimaan",s.receipts],["Referensi serah terima",s.handovers],["Observasi pemanfaatan",s.observations]];
 for(const [title,rows] of parts){const d=el("details");d.append(el("summary",title+" ("+rows.length+")"));for(const row of rows){const ul=el("ul");for(const [k,v] of Object.entries(row))ul.append(el("li",fmt(k)+": "+fmt(v)));d.append(ul);}p.append(d);}
}
function detail(parent,r,ctx){
 parent.replaceChildren(el("h3",r.label),el("p","Satuan: "+r.unit+" · "+fmt(r.snapshot.stage)+" · revisi "+r.revision));
 const s=r.snapshot,m=r.summary,b=r.current_inventory_basis;
 line(parent,"Kondisi inventaris",b.assessment);line(parent,"Revisi inventaris",b.revision);
 if(s.need){line(parent,"Usulan",s.need.requested);line(parent,"Revisi sumber usulan",s.need.source.revision);}
 if(r.source_changed)parent.append(el("p","Inventaris berubah sejak usulan. Telaah dan pengiriman baru diblokir sampai rekonsiliasi. Penerimaan/pemantauan barang terkirim tetap dapat dicatat."));
 for(const [key,name] of [["scheduled","Dijadwalkan"],["sent","Dikirim"],["received_good","Diterima baik"],["received_damaged","Rusak saat diterima"],["awaiting_receipt","Belum diterima"],["good_not_observed","Barang baik belum dipantau"],["in_use_observed","Digunakan (teramati)"]])line(parent,name,m[key]);
 history(parent,s);
 if(!ctx.enabled||!r.candidate_actions.length)return;
 const f=el("form");f.className="backend-report";f.addEventListener("submit",e=>e.preventDefault());parent.append(f);
 const action=field(f,"Tindakan",sel(r.candidate_actions.map(k=>[k,labels[k]]))),fields=el("div");fields.className="backend-report";f.append(fields);
 let read=()=>null,prev=action.value;
 function draw(){
  fields.replaceChildren();const a=action.value;
  const num=(label,min=0,max=1000000)=>field(fields,label,input("number",min,max));
  const ref=label=>field(fields,label,input("text"));
  const date=(label,extend=false)=>field(fields,label,input("date",r.year+"-01-01",(extend?2030:r.year)+"-12-31"));
  const reason=()=>field(fields,"Alasan DEMO",sel(reasons));
  const choice=(label,rows,key)=>field(fields,label,sel(rows.map(x=>[x[key],x[key]+(x.remaining!=null?" · sisa "+x.remaining:"")])));
  if(a==="propose"){const n=num("Jumlah diusulkan",1),why=reason();read=()=>({requested:n.valueAsNumber,reason:why.value});}
  else if(a==="plan_package"){const n=num("Jumlah rencana paket",1,s.need.requested);read=()=>({quantity:n.valueAsNumber});}
  else if(a==="schedule"){const n=num("Jumlah jadwal",1,s.package.quantity),d=date("Tanggal rencana");read=()=>({quantity:n.valueAsNumber,planned_on:d.value});}
  else if(a==="dispatch"){const n=num("Jumlah dikirim",1,m.not_sent),x=ref("Referensi pengiriman DEMO"),d=date("Tanggal pengiriman");read=()=>({shipment_ref:x.value,quantity:n.valueAsNumber,sent_on:d.value});}
  else if(a==="receive"){const ship=choice("Pengiriman",pendingShipments(s),"shipment_ref"),x=ref("Referensi penerimaan DEMO"),good=num("Diterima baik"),bad=num("Diterima rusak"),d=date("Tanggal penerimaan");read=()=>({shipment_ref:ship.value,receipt_ref:x.value,good:good.valueAsNumber,damaged:bad.valueAsNumber,received_on:d.value});}
  else if(a==="handover"){const rec=choice("Penerimaan",pendingHandovers(s),"receipt_ref"),x=ref("Referensi BAST DEMO (bukan dokumen sah)"),d=date("Tanggal pencatatan",true);read=()=>({receipt_ref:rec.value,reference:x.value,recorded_on:d.value});}
  else if(a==="monitor"){const rec=choice("Penerimaan",monitorable(s),"receipt_ref"),d=date("Tanggal pengamatan",true),used=num("Digunakan"),unused=num("Tidak digunakan"),bad=num("Rusak setelah diterima");read=()=>({receipt_ref:rec.value,observed_on:d.value,in_use:used.valueAsNumber,not_in_use:unused.valueAsNumber,damaged_after:bad.valueAsNumber});}
  else if(a==="return_draft"){const why=reason();read=()=>({reason:why.value});}
  else read=()=>null;
 }
 action.addEventListener("change",()=>{if(!ctx.clean()){action.value=prev;return;}prev=action.value;draw();});
 fields.addEventListener("input",ctx.markDirty);draw();
 button(f,"Simpan tindakan DEMO",()=>{if(!f.reportValidity())return;try{const cmd=supportCommand(r,action.value,read(),ctx.id());if(confirm("Catat tindakan DEMO? Bukan persetujuan atau pengiriman resmi."))ctx.send("support",cmd);}catch(e){ctx.error(e.message);}});
}
export async function mountSupport(parent,catalog,read,ctx){
 parent.append(el("p",catalog.candidate_total+" kandidat teknis dari "+catalog.catalog_total+" butir inventaris. Bukan daftar kelayakan anggaran."),el("p","Kebutuhan berasal dari kondisi terkonfirmasi. Minimum numerik hanya jika tercantum pada katalog; jumlah usulan ditentukan petugas dan ditelaah."));
 const filter=field(parent,"Tampilkan",sel([["attention","Perlu perhatian"],["started","Sudah ada usulan"],["all","Seluruh inventaris"],["pending","Perlu telaah katalog"]])),search=field(parent,"Cari barang",input("search"));search.required=false;
 const list=el("div"),body=el("div");parent.append(list,body);let mode=filter.value,term="",generation=0;
 function draw(){
  generation++;body.replaceChildren();list.replaceChildren();
  const rows=filterSupport(catalog.rows,mode,term);
  list.append(el("p",rows.length+" butir dalam filter"));
  const table=el("table"),h=el("thead"),tr=el("tr");
  for(const k of ["Butir","Kondisi","Selisih minimum","Status","Buka"])tr.append(el("th",k));h.append(tr);table.append(h);const b=el("tbody");
  for(const r of rows){const row=el("tr");for(const x of [r.label,r.assessment,r.minimum_gap,r.record_id?r.stage:r.classification])row.append(el("td",fmt(x)));const td=el("td");if(r.record_id)button(td,"Buka",async()=>{
   if(!ctx.clean())return;const g=++generation;body.replaceChildren(el("p","Memuat..."));
   try{const record=await read("support",{record_id:r.record_id});if(g===generation)detail(body,record,ctx);}catch{if(g===generation)body.replaceChildren(el("p","Sumber tidak tersedia atau akses dibatasi."));}
  });else td.textContent="Belum didukung";row.append(td);b.append(row);}
  table.append(b);const wrap=el("div");wrap.className="table-wrap";wrap.append(table);list.append(wrap);
 }
 filter.addEventListener("change",()=>{if(!ctx.clean()){filter.value=mode;return;}mode=filter.value;draw();});
 search.addEventListener("change",()=>{if(!ctx.clean()){search.value=term;return;}term=search.value;draw();});draw();
}
