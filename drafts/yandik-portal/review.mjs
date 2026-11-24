/** CODE_ONLY: no browser or test executed for this change. */
import {register,notify} from "./leadership-bridge.mjs";
import {buildIntegratedDemoView} from "../m05-profile-sdm/integration.mjs";
import {readDomain,readDomainDetail,DOMAINS} from "./domain-views.mjs";
import {mountActivityEditor} from "./activity-editor.mjs";
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
 const personnel=await import("./personnel-editor.mjs");
 let context=m.createDemoContext(),reportDirty=false;
 register("core",s=>buildIntegratedDemoView({...s,dashboardFixture:context.dashboardFixture,profileFixture:context.profileFixture}).rows);
 const editor=mountActivityEditor({investigations:$("investigations"),animals:$("kurban-animals"),addInvestigation:$("add-investigation"),addAnimal:$("add-animal")});
 const opts=(target,items,value)=>{target.replaceChildren(...items.map(([v,l])=>new Option(l,v)));if(items.some(([v])=>String(v)===String(value)))target.value=String(value);};
 opts($("year"),m.YEARS.map(y=>[y,y]),2026);
 opts($("month"),Array.from({length:12},(_,i)=>[i+1,new Intl.DateTimeFormat("id-ID",{month:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2026,i,1)))]),1);
 opts($("region"),context.regions.map(r=>[r.region_id,r.region_label]),context.regions[0].region_id);
 function syncFacility(){opts($("facility"),context.facilities.filter(f=>f.region_id===$("region").value).map(f=>[f.facility_id,f.facility_label]),$("facility").value);}
 syncFacility();
 const scope=()=>({year:Number($("year").value),month:Number($("month").value),region_id:$("region").value,facility_id:$("facility").value});
 function read(){return m.readConsolidatedDemo(context,scope());}
 function render(){
  reportDirty=false;
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
  const available=m.nextActions(v);
  for(const key of m.FIELDS){const input=$("report-form").elements.namedItem(key);input.value=v.draft_counts ? (v.draft_counts[key]??"") : "0";input.disabled=!available.some(a=>["create_draft","save_draft","revise_draft"].includes(a));}
  editor.render(v.draft_activities,available.some(a=>["create_draft","save_draft","revise_draft"].includes(a)));
  $("report-controls").disabled=false;
  $("actions").replaceChildren(...available.map(action=>{
   const button=el("button",actions[action]);button.type="button";button.dataset.action=action;
   button.addEventListener("click",()=>{
    $("action-feedback").textContent="";
    try{
     const counts=Object.fromEntries(m.FIELDS.map(k=>[k,$("report-form").elements.namedItem(k).valueAsNumber]));
     context=m.applyConsolidatedDemoAction(context,scope(),action,counts,editor.read());
     $("action-feedback").textContent="Perubahan DEMO dicatat dalam memori.";render();
    }catch(e){$("action-feedback").textContent="Tindakan DEMO ditolak: "+String(e.message);}
   });return button;
  }));
  table($("history"),["Revisi","Tindakan","Status"],c.history.map(h=>[h.revision,actions[h.action]??h.action,h.status]),"Riwayat workflow terpilih");
  table($("followup"),["Usulan pembahasan","Peran yang dikonsultasikan","Status"],v.followup.advisory_proposals.map(p=>[p.subject,p.role_to_consult,p.status]),"Bahan telaah, bukan tugas terkirim");
  const queue=m.readRecordedFollowupQueue(context,scope());
  table($("followup-queue"),["Puskeswan","Bulan","Bahan telaah","Peran","Status"],queue.map(p=>[p.facility_label,p.period,p.subject,p.role_to_consult,p.status]),"Catatan workflow wilayah terpilih");
  personnel.renderPersonnelEditor($("personnel-editor"),context,scope(),(next)=>{
   if(reportDirty)throw Error("Simpan draf laporan dahulu agar isian tidak hilang.");
   context=next;$("personnel-feedback").textContent="Perubahan Profil/SDM DEMO tercatat dalam memori.";render();
  },(error)=>{$("personnel-feedback").textContent="Tindakan ditolak: "+String(error.message);});
  const regions=m.readRegionalCoverage(context,scope().year);
  table($("regional"),["Wilayah","Puskeswan","Bulan terlapor","Bulan diharapkan","Layanan tercatat","Profil ada","SDM lengkap"],regions.map(g=>[g.region,g.facilities,g.reported,g.expected,g.service,g.profiles,g.sdm]),"Agregat sumber M05 DEMO");
  table($("coverage"),["Wilayah","Fasilitas DEMO","Cakupan laporan"],regions.map(g=>[g.region,g.facilities,g.reported+" / "+g.expected]),"Cakupan tanpa koordinat");notify();
 }
 const redraw=()=>{try{render();}catch(e){$("core-status").textContent="Model DEMO tidak dapat dimuat: "+String(e.message);$("report-controls").disabled=true;for(const id of ["summary","sources","workflow-status","actions","history","followup","followup-queue","personnel-editor","regional","coverage"])$(id).replaceChildren();}};
 $("scope-form").addEventListener("submit",e=>e.preventDefault());
 $("scope-form").addEventListener("change",()=>{syncFacility();$("action-feedback").textContent="";$("personnel-feedback").textContent="";redraw();});
 $("report-form").addEventListener("submit",e=>e.preventDefault());
 const markDirty=()=>{
  reportDirty=true;
  for(const button of $("actions").querySelectorAll("button")){
   if(["submit","resubmit"].includes(button.dataset.action))button.disabled=true;
  }
  $("action-feedback").textContent="Isian diubah. Simpan draf/revisi dahulu sebelum simulasi kirim.";
 };
 $("report-form").addEventListener("input",markDirty);
 $("report-form").addEventListener("change",markDirty);
 editor.onChange(markDirty);
 $("reset").addEventListener("click",()=>{context=m.createDemoContext();$("report-form").reset();$("action-feedback").textContent="Simulasi laporan, profil dan SDM dikembalikan ke fixture awal.";$("personnel-feedback").textContent="";redraw();});
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
  if(v.available&&v.items.length){
   const label=el("label","Pilih entri untuk telaah","single-label"),select=el("select");
   select.append(new Option("Pilih entri",""),...v.items.map(item=>new Option(item.label,item.id)));
   label.append(select);
   const detail=el("div");x.content.append(label,detail);
   let request=0;
   select.addEventListener("change",async()=>{
    const token=++request;detail.replaceChildren();
    if(!select.value)return;
    detail.append(el("p","Memuat bahan telaah..."));
    try{
     const d=await readDomainDetail(x.key,region,select.value);
     if(g!==generation||token!==request)return;
     detail.replaceChildren(el("h4",d.title),el("p",d.note,"note"));
     const main=el("div");detail.append(main);table(main,["Keterangan","Nilai"],d.fields,"Detail DEMO");
     for(const group of d.groups){const container=el("div");detail.append(el("h4",group.title),container);table(container,group.columns,group.rows,group.title);}
    }catch(e){if(g===generation&&token===request)detail.replaceChildren(el("p","Telaah tidak dapat dimuat: "+String(e.message),"error"));}
   });
  }
 }catch(e){if(g===generation)x.content.replaceChildren(el("p","Register DEMO tidak dapat dimuat: "+String(e.message),"error"));}}));
}
$("oversight-region").addEventListener("change",domains);domains();

/** K3: preserve existing independent M04 scenario; never map M05 identifiers. */
async function startSupport(){
 const [m,f]=await Promise.all([import("../m04-integrated-workspace/workspace.mjs"),
   import("../m04-integrated-workspace/fixtures.mjs")]);
 let state=f.demoWorkspace();
 register("support",()=>f.MASTER.map(x=>{const d=m.viewWorkspace(state,{role:"provinsi_admin"},"2026-10",x.id).details;return {name:x.name,needs:d.profile===null?null:d.needs.length,packages:d.packages.length,ship:d.ship.length,receipt:d.receipt.length,handover:d.handover.length,monitor:d.monitor.length};}));
 const selector=$("support-facility");
 selector.replaceChildren(...f.MASTER.map(x=>new Option(x.name,x.id)));
 const labels={paket:"Susun paket",telaah:"Catat telaah",jadwal:"Buat jadwal",kirim:"Simulasi kirim",terima:"Simulasi terima",rujukan:"Catat referensi BAST",monitor:"Catat pemanfaatan"};
 function render(){
  // Independent fixture intentionally limited to its own 2026 scenario.
  const d=m.viewWorkspace(state,{role:"provinsi_admin"},"2026-10",selector.value).details;
  const next=[["paket",d.packages],["telaah",state.reviews.filter(x=>x.id==="DEMO-TELAAH-"+selector.value.slice(9))],["jadwal",d.schedule],["kirim",d.ship],["terima",d.receipt],["rujukan",d.handover],["monitor",state.observations.filter(x=>x.id==="DEMO-MON-"+selector.value.slice(9))]].find(([,rows])=>rows.length===0)?.[0];
  cards($("support-summary"),[
   ["Kebutuhan",d.needs.length,"Catatan skenario M04"],["Paket",d.packages.length,"Bahan rencana"],["Jadwal",d.schedule.length,"DEMO"],["Kirim / terima",d.ship.length+" / "+d.receipt.length,"Bukan distribusi nyata"],["Referensi serah terima",d.handover.length,"Bukan BAST sah"],["Pemantauan",d.monitor.length,"Catatan DEMO"]
  ]);
  table($("support-needs"),["Kebutuhan","Jumlah","Satuan","Status"],d.needs.map(n=>[n.item,n.quantity,n.unit,n.status]),"Kebutuhan dari skenario M04");
  table($("support-stages"),["Tahap","Catatan tersedia"],[
   ["Paket",d.packages.length],["Telaah",state.reviews.filter(x=>x.id==="DEMO-TELAAH-"+selector.value.slice(9)).length],
   ["Jadwal",d.schedule.length],["Kirim",d.ship.length],["Terima",d.receipt.length],
   ["Referensi serah terima",d.handover.length],["Pemantauan",d.monitor.length]
  ],"Rekap tahap simulasi, bukan status anggaran");
  $("support-actions").replaceChildren();
  if(next){
   const button=el("button",labels[next]);button.type="button";
   button.addEventListener("click",()=>{try{state=m.advanceDemo(state,selector.value,next);render();$("support-feedback").textContent="Langkah "+labels[next]+" dicatat pada skenario M04 dalam memori.";}catch(e){$("support-feedback").textContent="Langkah belum tersedia: "+String(e.message);}});
   $("support-actions").append(button);
  }else $("support-actions").append(el("p","Seluruh tujuh tahap skenario telah dicatat dalam memori."));notify();
 }
 function reset(){state=f.demoWorkspace();render();$("support-feedback").textContent="Skenario M04 dipulihkan.";}
 selector.addEventListener("change",()=>{try{render();$("support-feedback").textContent="Skenario independen M04 terpilih.";}catch(e){$("support-feedback").textContent="Skenario tidak tersedia: "+String(e.message);$("support-actions").replaceChildren();for(const id of ["support-summary","support-needs","support-stages"])$(id).replaceChildren();}});
 $("support-reset").addEventListener("click",()=>{try{reset();}catch(e){$("support-feedback").textContent="Reset gagal: "+String(e.message);}});
 render();selector.disabled=false;$("support-reset").disabled=false;
 $("support-feedback").textContent="Skenario M04 terpisah · Oktober 2026. Hanya kebutuhan yang lolos model DEMO dapat dilanjutkan.";
}
startSupport().catch(e=>{$("support-feedback").textContent="Model dukungan DEMO tidak dapat dimuat: "+String(e.message);});
