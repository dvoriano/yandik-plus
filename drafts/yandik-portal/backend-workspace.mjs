/** CODE_ONLY. Real DOM binding to explicitly injected rehearsal transport.
 * No automatic startup, fetch, credentials, fallback, storage or production binding.
 */
import {GROUPS} from "./portal-navigation.mjs";
import {mountProfiles,mountInventory,mountStaff} from "./annual-form-editor.mjs";
import {mountSupport} from "./support-form-editor.mjs";
import {mountRegional} from "./regional-form-editor.mjs";
import {mountCoaching,mountDocuments} from "./coachdoc-form-editor.mjs";
import {createPortalBackend} from "../yandik-backend-contract/portal_backend_provider.mjs";
import {menus,scope,FIELDS,shown,chooseApel,reportCommand,workflowCommand} from "./backend-workspace-model.mjs";
const reportActions = {
 submit: "Kirim laporan DEMO",
 return_correction: "Minta koreksi DEMO",
 record_review: "Catat telaah DEMO",
};
const reportStates = {
 NOT_STARTED_DEMO: "Belum ada draf",
 DRAFT: "Draf tersimpan",
 SUBMITTED: "Terkirim untuk ditinjau",
 CORRECTION: "Perlu koreksi",
 RECORDED_DEMO: "Telaah tercatat",
};
const reportFields = {
 pengobatan: "Pengobatan", vaksinasi: "Vaksinasi",
 penyuluhan: "Penyuluhan", layanan_lain: "Layanan lain",
};
const monthFormat = new Intl.DateTimeFormat("id-ID", {month: "long", timeZone: "UTC"});
const months = Array.from({length: 12}, (_, i) => monthFormat.format(new Date(Date.UTC(2026, i))));
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function table(parent,heads,rows){
 const wrap=node("div");wrap.className="table-wrap";const t=node("table"),h=node("thead"),tr=node("tr");
 for(const title of heads){const th=node("th",title);th.scope="col";tr.append(th);}h.append(tr);t.append(h);const b=node("tbody");
 for(const row of rows){const line=node("tr");for(const value of row)line.append(node("td",shown(value)));b.append(line);}t.append(b);wrap.append(t);parent.append(wrap);
 if(!rows.length)parent.append(node("p","Tidak ada catatan dalam cakupan DEMO."));
}
function pairs(parent,values){table(parent,["Informasi","Nilai"],values);}
function button(text,action){const b=node("button",text);b.type="button";b.addEventListener("click",action);return b;}
function primaryButton(text,action){
 const b=button(text,action);
 b.className="workspace-primary";
 return b;
}
function select(label,items,value,onChange){
 const l=node("label",label),s=node("select");
 s.append(...items.map(([id,title])=>new Option(title,id)));
 let current=String(value);
 s.value=current;
 s.addEventListener("change",()=>{
  if(onChange(s.value))current=s.value;
  else s.value=current;
 });
 l.append(s);
 return l;
}
function disclosure(title,content,className){
 const details=node("details");
 if(className)details.className=className;
 details.append(node("summary",title),content);
 return details;
}
const id=()=>{const bytes=crypto.getRandomValues(new Uint8Array(12));return "DEMO-COMMAND-UI-"+Array.from(bytes,x=>x.toString(16).padStart(2,"0")).join("").toUpperCase();};
export async function mountBackendWorkspace(root,{transport,executionAuthorized=false,allowCommands=false}={}){
 if(!root||executionAuthorized!==true||typeof transport!=="function")throw Error("HOST_REHEARSAL_REQUIRED");
 const api=createPortalBackend(transport);
 let generation=0,closed=false,busy=false,dirty=false,queue=null,selected=null,active=null,annualPending=null;
 const message=node("p","Memuat ruang kerja…");
 message.className="workspace-feedback";
 message.setAttribute("role","status");
 root.replaceChildren(message);
 const identity=await api.read("core");
 if(!identity.available){message.textContent="Sesi DEMO tidak tersedia. Muat ulang halaman untuk mencoba lagi.";return ()=>root.replaceChildren();}
 const core=identity.data,allowed=menus(core.role_demo);selected=scope(core);active=allowed[0];

 const context=node("p");
 context.className="workspace-context";
 const nav=node("nav");
 nav.className="backend-nav";
 nav.setAttribute("aria-label","Menu ruang kerja");
 const menu=disclosure("Menu lainnya",nav);
 const filters=node("div");
 filters.className="filter-row backend-scope";
 const filterMenu=disclosure(core.facilities.length>1?"Ubah cakupan":"Ubah periode",filters);
 const toolbar=node("div");
 toolbar.className="workspace-toolbar";
 toolbar.append(filterMenu,menu);
 const panel=node("section");
 panel.className="review-panel workspace-panel";
 root.replaceChildren(context,toolbar,message,panel);

 function unavailable(text="Sumber belum tersedia atau akses dibatasi."){panel.replaceChildren(node("p",text));}
 function canLeave(){if(busy||annualPending){message.textContent="Tunggu hingga penyimpanan selesai.";return false;}if(queue?.status==="PENDING"||queue?.status==="CONFLICT"){message.textContent="Selesaikan antrean atau konflik dahulu.";return false;}return !dirty||confirm("Buang isian yang belum disimpan?");}
 function renderContext(){
  const facility=core.facilities.find(f=>f.facility_id===selected.facility_id);
  context.textContent=facility ? facility.label+" · "+months[selected.month-1]+" "+selected.year : "Ringkasan tahun "+selected.year;
 }
 function setScope(next){
  if(!canLeave())return false;
  dirty=false;
  message.textContent="";
  selected=scope(core,{...selected,...next});
  renderContext();
  render();
  return true;
 }
 const s=selected;
 filters.append(select("Tahun",[2026,2027,2028,2029,2030].map(y=>[y,y]),s.year,v=>setScope({year:Number(v)})));
 if(core.facilities.length>1)filters.append(select("Puskeswan",core.facilities.map(f=>[f.facility_id,f.label]),s.facility_id,v=>setScope({facility_id:v})));
 if(core.facilities.length)filters.append(select("Bulan",months.map((month,i)=>[i+1,month]),s.month,v=>setScope({month:Number(v)})));
 for(const group of GROUPS.filter(g=>allowed.includes(g.id))){
  const item=button(group.label,()=>{
   if(!canLeave())return;
   dirty=false;
   message.textContent="";
   active=group.id;
   menu.open=false;
   render({focus:true});
  });
  item.dataset.group=group.id;
  nav.append(item);
 }
 message.textContent="";
 renderContext();
 async function read(resource,q){const r=await api.read(resource,q);if(!r.available)throw Error("SOURCE_UNAVAILABLE");return r.data;}
 async function profile(s){return read("profiles",{facility_id:s.facility_id,year:s.year});}
 function renderReport(r,target,fieldMode=false){
  const status=node("p",reportStates[r.state]??r.state);
  status.className="report-status";
  status.setAttribute("role","status");
  target.append(status);
  const editable=allowCommands===true&&r.candidate_actions.includes("save_draft");
  const workflowActions=allowCommands&&!fieldMode?r.candidate_actions.filter(action=>action!=="save_draft"):[];
  const nextSteps=node("div");
  nextSteps.className="action-row";
  if(workflowActions.length)target.append(nextSteps);

  const form=node("form");
  form.className="backend-report";
  if(editable)form.append(node("p","Isi semua jumlah pelayanan. Masukkan 0 pada kategori yang tidak memiliki kegiatan."));
  const inputs={};
  for(const k of FIELDS){const label=node("label",reportFields[k]),input=node("input");input.type="number";input.min="0";input.max="100000";input.step="1";input.required=true;input.value=r.payload?.counts[k]??"";input.disabled=!editable;inputs[k]=input;label.append(input);form.append(label);}
  const zero=node("input");zero.type="checkbox";zero.checked=r.payload?.declared_no_activity===true;zero.disabled=!editable;const zl=node("label"," Nyatakan tidak ada kegiatan");zl.prepend(zero);form.append(zl);
  const activities=structuredClone(r.payload??{investigations:[],kurban_animals:[],evidence_refs:[]});
  const list=node("div");
  const extra=disclosure("Investigasi, kurban dan bukti",list,"report-extra");
  form.append(extra);
  form.addEventListener("invalid",event=>{if(extra.contains(event.target))extra.open=true;},true);
  const refPattern=/^DEMO-[A-Z0-9_-]{1,40}$/;
  function addRows(){
   list.replaceChildren();
   for(const [key,title] of [["investigations","Investigasi per lokasi/kejadian"],["kurban_animals","Pemeriksaan kurban per hewan"],["evidence_refs","Metadata bukti"]]){
    const box=node("fieldset"),legend=node("legend",title);box.append(legend);box.disabled=!editable;
    for(const [i,item] of activities[key].entries()){
     const line=node("div");line.className="filter-row";
     const fields=key==="investigations"?["event_id","location_id"]:key==="kurban_animals"?["animal_id","ante","post"]:[null];
     for(const f of fields){const l=node("label",f??"Referensi DEMO"),input=node("input");if(f==="ante"||f==="post"){input.type="checkbox";input.checked=item[f];}else{input.value=f===null?item:item[f];input.required=true;input.pattern="DEMO-[A-Z0-9_-]{1,40}";}input.addEventListener("input",()=>{const v=input.type==="checkbox"?input.checked:input.value;if(f===null)activities[key][i]=v;else item[f]=v;dirty=true;});l.append(input);line.append(l);}
     line.append(button("Hapus",()=>{activities[key].splice(i,1);dirty=true;addRows();}));box.append(line);
    }
    box.append(button("Tambah",()=>{if(activities[key].length>=100)return;activities[key].push(key==="investigations"?{event_id:"",location_id:""}:key==="kurban_animals"?{animal_id:"",ante:false,post:false}:"");dirty=true;addRows();}));list.append(box);
   }
  }
  addRows();form.addEventListener("input",()=>dirty=true);form.addEventListener("submit",e=>e.preventDefault());
  const editorContent=node("div");
  editorContent.append(form);
  const feedback=node("p");feedback.className="workspace-feedback";feedback.setAttribute("role","status");editorContent.append(feedback);
  const actions=node("div");actions.className="action-row";editorContent.append(actions);
  const details=node("p","Revisi "+r.revision+" · Total layanan terverifikasi belum tersedia");
  details.className="note";
  editorContent.append(details);
  const editorLabel=editable
   ? (fieldMode?"Isian laporan":{NOT_STARTED_DEMO:"Mulai isi laporan",CORRECTION:"Perbaiki laporan"}[r.state]??"Ubah isian laporan")
   : "Lihat rincian laporan";
  const editor=disclosure(editorLabel,editorContent,"report-editor");
  editor.open=fieldMode&&editable;
  if(editable||r.payload){
   if(editable&&!workflowActions.length&&!fieldMode)editor.classList.add("primary-disclosure");
   target.append(editor);
  }
  editor.addEventListener("toggle",()=>{
   if(editable&&workflowActions.length)nextSteps.hidden=editor.open;
  });
  async function transmit(entry){
   if(busy)return;busy=true;form.querySelectorAll("input,button").forEach(e=>e.disabled=true);actions.querySelectorAll("button").forEach(e=>e.disabled=true);
   try{queue=await api.send(entry);feedback.textContent=shown(queue.status)+" · "+shown(queue.error??"Respons DEMO diterima");
    if(queue.status==="ACK_DEMO"){queue=null;dirty=false;busy=false;await render({focus:true});return;}
   }catch{queue=entry;feedback.textContent="Respons belum diketahui; gunakan perintah yang sama.";}
   finally{busy=false;}
   actions.replaceChildren();
   if(queue?.status==="PENDING")actions.append(button("Coba lagi dengan ID yang sama",()=>transmit(queue)));
   if(queue?.status!=="PENDING")actions.append(button("Tinjau data terbaru (buang draf lokal)",()=>{if(confirm("Buang draf lokal dan baca ulang?")){queue=null;dirty=false;render();}}));
  }
  if(editable)actions.append(primaryButton(fieldMode?"Antrekan & kirim draf DEMO":"Simpan draf DEMO",()=>{
   if(busy||!form.reportValidity())return;
   try{
    if(!activities.investigations.every(x=>refPattern.test(x.event_id)&&refPattern.test(x.location_id))||!activities.kurban_animals.every(x=>refPattern.test(x.animal_id)&&(x.ante||x.post))||!activities.evidence_refs.every(x=>refPattern.test(x)))throw Error("REFERENSI_DEMO_INVALID");
    const cmd=reportCommand(r,Object.fromEntries(FIELDS.map(k=>[k,inputs[k].valueAsNumber])),activities,zero.checked,id());
    queue=api.queue(cmd);transmit(queue);
   }catch(e){feedback.textContent=shown(e.message);}
  }));
  if(workflowActions.length){
   const ctx=annualContext(target);
   for(const [index,action] of workflowActions.entries()){
    const control=index===0?primaryButton:button;
    nextSteps.append(control(reportActions[action]??shown(action),()=>{
     if(!ctx.clean()||queue)return;
     if(!confirm("Catat tindakan DEMO ini?"))return;
     try{ctx.send("apel",workflowCommand(r,action,id()));}catch(e){ctx.error(e.message);}
    }));
   }
  }
 }
 function annualContext(out){
  const feedback=node("p");feedback.setAttribute("role","status");out.append(feedback);
  return {enabled:allowCommands===true,id,markDirty:()=>{dirty=true;},clean:()=>{if(dirty){feedback.textContent="Simpan isian yang berubah terlebih dahulu.";return false;}return !busy&&!annualPending;},error:m=>{feedback.textContent=shown(m);},send:async(resource,cmd)=>{
   if(busy||annualPending)return;
   annualPending={resource,cmd:structuredClone(cmd)};
   const controls=[...out.querySelectorAll("button,input,select,textarea")],disabled=controls.map(n=>n.disabled);
   const restore=()=>controls.forEach((n,i)=>n.disabled=disabled[i]);
   const retry=node("div");out.append(retry);
   async function attempt(){
    if(busy)return;busy=true;retry.replaceChildren();controls.forEach(n=>n.disabled=true);
    try{
     const v=await api.command(resource,annualPending.cmd);
     const expected=cmd.record_id??cmd.staff_id;
     if(v.status===200&&v.data?.revision===cmd.expected_revision+1&&(v.data.record_id??v.data.staff_id)===expected){annualPending=null;dirty=false;busy=false;await render({focus:resource==="apel"});return;}
     if(v.status>=500||v.status===200)throw Error("ACK_UNKNOWN");
     feedback.textContent=shown(v.error);
     if(v.status===409){retry.append(button("Tinjau ulang data (buang perubahan lokal)",()=>{if(confirm("Muat ulang tanpa menimpa revisi?")){annualPending=null;dirty=false;render();}}));}
     else{annualPending=null;restore();}
    }catch{feedback.textContent="Respons belum diketahui. Coba ulang dengan ID yang sama.";retry.append(button("Coba lagi",attempt));}
    finally{busy=false;}
   }
   await attempt();
  }};
 }
 async function render({focus=false}={}){
  const g=++generation,s={...selected},name=active;
  const heading=node("h1",GROUPS.find(x=>x.id===name)?.label??"Ruang kerja");
  heading.tabIndex=-1;
  panel.replaceChildren(heading,node("p","Memuat…"));
  panel.setAttribute("aria-busy","true");
  const out=node("div");
  try{
   const q={facility_id:s.facility_id,year:s.year};
   if(["layanan","mode-lapangan"].includes(name)){const p=await profile(s),rid=chooseApel(p,s.month);if(!rid)throw Error("SOURCE_UNAVAILABLE");const r=await read("apel",{record_id:rid});renderReport(r,out,name==="mode-lapangan");}
   else if(name==="profil-sdm"){const p=await profile(s);pairs(out,[["Puskeswan",p.facility.label],["Dokter hewan (Desember)",p.sdm.doctors],["Paramedik (Desember)",p.sdm.paramedics],["Cakupan SDM",p.sdm.status]]);const roster=await read("roster",q);const ctx=annualContext(out);mountProfiles(out,p,ctx);out.append(node("h3","SDM Veteriner"));mountStaff(out,roster,core.facilities,ctx);}
   else if(name==="inventaris"){const p=await profile(s);const r=await read("inventory",{record_id:p.inventory.record_id});mountInventory(out,r,annualContext(out));}
   else if(name==="dukungan"){const catalog=await read("supportCatalog",q);await mountSupport(out,catalog,read,annualContext(out));}
   else if(name==="pengawasan"){await mountRegional(out,s.region_id,s.year,read,annualContext(out));}
   else if(name==="kegiatan"){const r=await read("coaching",q);mountCoaching(out,r.activity_slots,read,annualContext(out));}
   else if(name==="administrasi"){const r=await read("documents",q);mountDocuments(out,r.document_slots,read,annualContext(out));}
   else if(name==="pimpinan"){const r=await read("leadership",{year:s.year,region_id:"ALL"});pairs(out,[["Fasilitas DEMO",r.facilities_demo],["Pelayanan",r.observed_services],["Bulan laporan",r.apel_reported_months],...Object.entries(r.totals).map(([k,v])=>[shown(k),v])]);}
   else if(name==="wilayah"){const r=await read("gis",{year:s.year,region_id:s.region_id,layer:"sdm"});out.append(node("p","Lapisan SDM · kisi ilustrasi, bukan koordinat geografis."));table(out,["Puskeswan","Dokter hewan","Status"],r.points.map(x=>[x.label,x.value,x.state]));}
   else if(name==="pustaka"){const r=await read("library",{q:""});table(out,["Judul","Kategori","Status"],r.items.map(x=>[x.title,x.category,x.status]));}
   else if(name==="notifikasi"){const r=await read("notifications",{today:s.year+"-"+String(s.month).padStart(2,"0")+"-01"});table(out,["Kategori","Pengingat","Tenggat"],r.items.map(x=>[x.category,x.title,x.due]));out.append(node("p","Ledger APEL belum tersedia; tidak ada pengiriman notifikasi."));}
   if(!closed&&g===generation){
    panel.replaceChildren(heading,out);
    for(const b of nav.querySelectorAll("button"))b.setAttribute("aria-pressed",String(b.dataset.group===name));
    if(focus)heading.focus();
   }
  }catch{if(!closed&&g===generation)unavailable();}
  finally{if(!closed&&g===generation)panel.removeAttribute("aria-busy");}
 }
 await render();return ()=>{closed=true;generation++;root.replaceChildren();};
}
