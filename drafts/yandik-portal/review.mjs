/** CODE_ONLY: no browser or test executed for this change. */
import {readDomain,DOMAINS} from "./domain-views.mjs";
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n;};
const fmt=v=>v===null||v===undefined?"—":typeof v==="number"?new Intl.NumberFormat("id-ID").format(v):String(v);
const friendly=v=>typeof v==="string"?v.replaceAll("_"," ").replace(/ DEMO$/," (DEMO)"):fmt(v);
function table(target,columns,rows,caption){
 target.replaceChildren();
 if(!rows?.length){target.append(el("p",rows===null?"Sumber belum tersedia.":"Tidak ada entri dalam cakupan ini.","empty-note"));return;}
 const wrap=el("div",undefined,"table-wrap"),t=el("table"),head=el("thead"),tr=el("tr");
 if(caption)t.append(el("caption",caption));
 for(const c of columns){const th=el("th",c);th.scope="col";tr.append(th);}
 head.append(tr);t.append(head);const body=el("tbody");
 for(const row of rows){const line=el("tr");for(const value of row)line.append(el("td",friendly(value)));body.append(line);}
 t.append(body);wrap.append(t);target.append(wrap);
}
function cards(target,entries){target.replaceChildren(...entries.map(([title,value,note])=>{
 const card=el("article",undefined,"review-card");card.append(el("small",title),el("strong",friendly(value)),el("small",note));return card;
}));}
const actions={create_draft:"Buat draf DEMO",save_draft:"Simpan draf DEMO",submit:"Simulasi kirim",return_correction:"Simulasi minta koreksi (verifikator)",revise_draft:"Simpan revisi",resubmit:"Simulasi kirim ulang"};
async function startCore(){
 const m=await import("./shared-demo.mjs");
 let context=m.createDemoContext();
 const opts=(target,items,value)=>{target.replaceChildren(...items.map(([v,l])=>new Option(l,v)));if(items.some(([v])=>String(v)===String(value)))target.value=String(value);};
 opts($("year"),m.YEARS.map(y=>[y,y]),2026);
 opts($("month"),Array.from({length:12},(_,i)=>[i+1,new Intl.DateTimeFormat("id-ID",{month:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2026,i,1)))]),1);
 opts($("region"),context.regions.map(r=>[r.region_id,r.region_label]),context.regions[0].region_id);
 function syncFacility(){opts($("facility"),context.facilities.filter(f=>f.region_id===$("region").value).map(f=>[f.facility_id,f.facility_label]),$("facility").value);}
 syncFacility();
 const scope=()=>({year:Number($("year").value),month:Number($("month").value),region_id:$("region").value,facility_id:$("facility").value});
 function read(){return m.readConsolidatedDemo(context,scope());}
 function render(){
  const v=read(),r=v.joined,c=v.correction;
  $("core-status").textContent=v.facility.facility_label+" · "+v.period+" · contoh data terpisah per sumber";
  cards($("summary"),[
   ["Pelayanan bulan (ledger)",v.ledgerMonth.observed_demo_events,"0 = laporan nol; — = belum melapor"],
   ["Pelayanan tahun (ledger)",r.observed_demo_events,r.reported_months+" / 12 bulan tercatat"],
   ["Profil",r.profile_state,"Snapshot tahunan DEMO"],
   ["Dokter hewan",r.doctors,"Cakupan "+friendly(r.sdm_coverage)],
   ["Paramedik",r.paramedics,"— bila cakupan belum lengkap"]
  ]);
  $("sources").replaceChildren(el("p","ID: "+r.facility_id+" · Profil: "+fmt(r.profile_source_ref)+" · SDM: "+fmt(r.sdm_source_ref)),el("p","Ledger M05-0 tidak disinkronkan dengan workflow M05-1. Dukungan M04 tidak memiliki crosswalk identitas."));
  cards($("workflow-status"),[["Status workflow",c.report_state,"Tidak berarti laporan resmi"],["Revisi",c.revision,"Jejak simulasi"],["Jumlah terakhir terkirim",c.activity_count_last_submitted_demo,"Terpisah dari ledger"]]);
  const available=m.nextActions(v);$("actions").replaceChildren(...available.map(action=>{
   const button=el("button",actions[action]);button.type="button";
   button.addEventListener("click",()=>{
    $("action-feedback").textContent="";
    try{
     const counts=Object.fromEntries(m.FIELDS.map(k=>[k,$("report-form").elements.namedItem(k).valueAsNumber]));
     context=m.applyConsolidatedDemoAction(context,scope(),action,counts);
     $("action-feedback").textContent="Perubahan DEMO dicatat dalam memori.";render();
    }catch(e){$("action-feedback").textContent="Tindakan DEMO ditolak: "+String(e.message);}
   });return button;
  }));
  table($("history"),["Revisi","Tindakan","Status"],c.history.map(h=>[h.revision,actions[h.action]??h.action,h.status]),"Riwayat workflow terpilih");
  table($("followup"),["Usulan pembahasan","Peran yang dikonsultasikan","Status"],v.followup.advisory_proposals.map(p=>[p.subject,p.role_to_consult,p.status]),"Bahan telaah, bukan tugas terkirim");
  const regions=m.readRegionalCoverage(context,scope().year);
  table($("regional"),["Wilayah","Puskeswan","Bulan terlapor","Bulan diharapkan","Layanan tercatat","Profil ada","SDM lengkap"],regions.map(g=>[g.region,g.facilities,g.reported,g.expected,g.service,g.profiles,g.sdm]),"Agregat sumber M05 DEMO");
  table($("coverage"),["Wilayah","Fasilitas DEMO","Cakupan laporan"],regions.map(g=>[g.region,g.facilities,g.reported+" / "+g.expected]),"Cakupan tanpa koordinat");
 }
 const redraw=()=>{try{render();}catch(e){$("core-status").textContent="Model DEMO tidak dapat dimuat: "+String(e.message);$("report-controls").disabled=true;for(const id of ["summary","sources","workflow-status","actions","history","followup","regional","coverage"])$(id).replaceChildren();}};
 $("scope-form").addEventListener("submit",e=>e.preventDefault());
 $("scope-form").addEventListener("change",()=>{syncFacility();$("action-feedback").textContent="";redraw();});
 $("report-form").addEventListener("submit",e=>e.preventDefault());
 $("reset").addEventListener("click",()=>{context=m.createDemoContext();$("report-form").reset();$("action-feedback").textContent="Simulasi dikembalikan ke fixture awal.";redraw();});
 render();$("scope-controls").disabled=false;$("report-controls").disabled=false;$("reset").disabled=false;
}
startCore().catch(e=>{$("core-status").textContent="Model inti DEMO tidak dapat dimuat: "+String(e.message);});
let generation=0;
async function domains(){
 const g=++generation,region=$("oversight-region").value;const cards=DOMAINS.map(key=>{
  const item=el("article",undefined,"domain"),title=el("h3",key),content=el("div","Memuat register DEMO...");item.append(title,content);return {key,item,title,content};
 });$("domains").replaceChildren(...cards.map(x=>x.item));
 await Promise.all(cards.map(async x=>{try{
  const v=await readDomain(x.key,region);if(g!==generation)return;
  x.title.textContent=v.title;
  table(x.content,v.columns.map(c=>c.label),v.rows,v.source+" · "+region);
  if(v.note)x.content.append(el("p",v.note,"note"));
 }catch(e){if(g===generation)x.content.replaceChildren(el("p","Register DEMO tidak dapat dimuat: "+String(e.message),"error"));}}));
}
$("oversight-region").addEventListener("change",domains);domains();
