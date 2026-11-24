/** CODE_ONLY | DOM forms bound to backend candidates. No data fallback. */
import {annualCommand,observation,profilePayload,staffCommand,groupProgress} from "./annual-form-model.mjs";
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
const fmt=v=>v==null?"Belum tersedia":String(v).replaceAll("_"," ");
function select(values,value){const e=el("select");e.append(...values.map(x=>new Option(Array.isArray(x)?x[1]:fmt(x),Array.isArray(x)?x[0]:x)));if(value!=null)e.value=value;return e;}
function input(type,value="",required=true){const n=el("input");n.type=type;n.value=value??"";n.required=required;return n;}
function field(parent,label,n){const l=el("label",label);l.append(n);parent.append(l);return n;}
function btn(parent,title,click){const b=el("button",title);b.type="button";b.addEventListener("click",click);parent.append(b);return b;}
function status(parent,text){parent.append(el("p",text));}
function form(parent,ctx){const f=el("form");f.className="backend-report";f.addEventListener("submit",e=>e.preventDefault());f.addEventListener("input",ctx.markDirty);parent.append(f);return f;}
function run(ctx,f,resource,build){if(f&&!f.reportValidity())return;try{ctx.send(resource,build());}catch(e){ctx.error(e.message);}}
function workflow(parent,r,resource,ctx,actions,reason){
 if(!ctx.enabled)return;
 for(const action of actions.filter(x=>r.candidate_actions.includes(x)))btn(parent,fmt(action),()=>{
  if(!ctx.clean())return;
  if(confirm("Catat tindakan DEMO ini?"))run(ctx,null,resource,()=>annualCommand(r,action,null,ctx.id(),["return_correction","reopen"].includes(action)?reason:null));
 });
}
export function mountProfiles(parent,p,ctx){
 status(parent,`Profil tahunan · ${p.year} · ${p.coverage.sections_entered}/${p.coverage.sections_total} bagian terisi`);
 for(const r of p.sections){
  const box=el("details");box.append(el("summary",fmt(r.section)+" · "+fmt(r.state)+" · revisi "+r.revision));parent.append(box);
  const v=r.payload??{},f=form(box,ctx),editable=ctx.enabled&&r.candidate_actions.includes("save_draft");
  const day=field(f,"Tanggal pengamatan",input("date",v.observed_on??""));day.min=p.year+"-01-01";day.max=p.year+"-12-31";
  const statuses=r.section==="legalitas"?["NEEDS_REVIEW","UNKNOWN","REFERENCE_RECORDED_DEMO"]:["AVAILABLE_REPORTED","NEEDS_REVIEW","UNKNOWN"];
  const st=field(f,"Status",select(statuses,v.status??"UNKNOWN"));
  const more=el("div");more.className="backend-report";f.append(more);const extra={};
  if(r.section==="legalitas"){
   extra.document_type=field(more,"Jenis referensi",select(["ESTABLISHMENT_DEMO","OPERATING_REFERENCE_DEMO","OTHER_DEMO"],v.document_type));
   extra.reference=field(more,"Referensi sintetis",input("text",v.reference));extra.reference.pattern="DEMO-[A-Z0-9_-]{1,40}";
   extra.issued_on=field(more,"Tanggal terbit referensi",input("date",v.issued_on));
   extra.valid_until=field(more,"Berlaku hingga (opsional)",input("date",v.valid_until,false));
  }else if(r.section==="wilayah_kerja"){
   const t=el("textarea");t.value=(v.coverage_refs??[]).join("\n");t.required=true;extra.coverage_refs=field(more,"Referensi wilayah DEMO, satu per baris",t);
  }
  function sync(){const show=r.section==="legalitas"?st.value==="REFERENCE_RECORDED_DEMO":r.section==="wilayah_kerja"&&st.value==="AVAILABLE_REPORTED";more.hidden=!show;for(const n of Object.values(extra))n.disabled=!show||!editable;}
  st.addEventListener("change",sync);day.disabled=st.disabled=!editable;sync();
  if(editable)btn(f,"Simpan bagian",()=>run(ctx,f,"profiles",()=>annualCommand(r,"save_draft",profilePayload(r.section,{observed_on:day.value,status:st.value,...Object.fromEntries(Object.entries(extra).map(([k,n])=>[k,n.value]))}),ctx.id())));
  workflow(box,r,"profiles",ctx,["submit","return_correction","record_review","reopen"],"UPDATE_PROFILE_DEMO");
 }
}
export function mountInventory(parent,r,ctx){
 const {groups,items}=r.catalog;status(parent,`${r.confirmed}/${r.total} butir dikonfirmasi · perhatian: ${fmt(r.attention)} · ${fmt(r.state)}`);
 status(parent,"Katalog rujukan DEMO, bukan penetapan kelayakan resmi. Data kosong bukan nol.");
 if(ctx.enabled&&r.candidate_actions.includes("copy_prior"))btn(parent,"Salin inventaris tahun sebelumnya",()=>{if(ctx.clean()&&confirm("Salin sebagai belum dikonfirmasi?"))run(ctx,null,"inventory",()=>annualCommand(r,"copy_prior",null,ctx.id()));});
 if(r.copied_from)status(parent,"Disalin dari "+r.copied_from.year+" · revisi "+r.copied_from.revision);
 const group=field(parent,"Kelompok inventaris",select(groups.map(g=>{const m=groupProgress(items,r.rows,g.id);return [g.id,g.label+" ("+m.confirmed+"/"+m.total+")"]; })));
 const search=field(parent,"Cari nama alat",input("search","",false)),list=el("div");parent.append(list);
 let groupValue=group.value;
 const editable=ctx.enabled&&r.candidate_actions.includes("save_item");
 function draw(){
  list.replaceChildren();const g=groupValue,progress=groupProgress(items,r.rows,g);
  if(progress.copied&&ctx.enabled&&r.candidate_actions.includes("confirm_group"))btn(list,"Konfirmasi seluruh butir salinan pada kelompok ini",()=>{if(ctx.clean()&&confirm("Sudah memeriksa SEMUA butir salinan dalam kelompok, termasuk yang tidak tampil karena pencarian?"))run(ctx,null,"inventory",()=>annualCommand(r,"confirm_group",{group:g,reviewed_all:true},ctx.id()));});
  for(const item of items.filter(x=>x.group===g&&x.label.toLowerCase().includes(search.value.toLowerCase()))){
   const row=r.rows[item.id],box=el("details");box.append(el("summary",item.label+" · "+(row?.confirmed?"Terkonfirmasi":row?"Perlu konfirmasi":"Belum diisi")));list.append(box);
   status(box,item.ref+" · "+item.unit+(item.minimum!=null?" · minimum rujukan "+item.minimum:" · minimum numerik tidak disebutkan"));
   const f=form(box,ctx),st=field(f,"Ketersediaan",select(["AVAILABLE","ABSENT","UNKNOWN",...(item.group==="A5"?["CONTEXT_REVIEW"]:[])],row?.status??"UNKNOWN"));
   const total=field(f,"Jumlah tersedia",input("number",row?.total)),usable=field(f,"Jumlah layak pakai",input("number",row?.usable)),condition=field(f,"Kondisi persediaan",select(["ADEQUATE_REPORTED","LIMITED_REPORTED","UNUSABLE_REPORTED","NOT_ASSESSED"],row?.condition??"NOT_ASSESSED"));
   for(const n of [total,usable]){n.min="0";n.max="1000000";n.step=item.kind==="area"?"any":"1";}
   function sync(){const available=st.value==="AVAILABLE",stock=item.kind==="stock";for(const n of [total,usable]){n.parentElement.hidden=!available||stock;n.disabled=!editable||!available||stock;}condition.parentElement.hidden=!available||!stock;condition.disabled=!editable||!available||!stock;}
   st.disabled=!editable;st.addEventListener("change",sync);sync();
   if(editable)btn(f,"Simpan butir",()=>run(ctx,f,"inventory",()=>annualCommand(r,"save_item",{item_id:item.id,observation:observation(item,st.value,total.valueAsNumber,usable.valueAsNumber,condition.value)},ctx.id())));
   if(row&&!row.confirmed&&ctx.enabled&&r.candidate_actions.includes("confirm_item"))btn(box,"Konfirmasi salinan tanpa perubahan",()=>{if(ctx.clean()&&confirm("Butir salinan sudah diperiksa?"))run(ctx,null,"inventory",()=>annualCommand(r,"confirm_item",{item_id:item.id},ctx.id()));});
  }
 }
 group.addEventListener("change",()=>{if(!ctx.clean()){group.value=groupValue;return;}groupValue=group.value;draw();});
 search.addEventListener("change",()=>{if(!ctx.clean()){search.value="";return;}draw();});draw();
 workflow(parent,r,"inventory",ctx,["submit","county_review","province_review","return_correction","reopen"],"CHECK_INVENTORY_DEMO");
}
export function mountStaff(parent,r,facilities,ctx){
 status(parent,"SDM per 31 Desember "+r.year+" · "+fmt(r.summary.status)+" · dokter "+fmt(r.summary.doctors)+" · paramedik "+fmt(r.summary.paramedics));
 if(ctx.enabled&&r.may_register_demo){
  const f=form(parent,ctx),sid=field(f,"ID SDM sintetis baru",input("text"));sid.pattern="DEMO-SDM-[A-Z0-9_-]{1,24}";const kind=field(f,"Jenis",select(["dokter_hewan","paramedik"]));
  btn(f,"Registrasi SDM DEMO",()=>run(ctx,f,"personnel",()=>staffCommand({staff_id:sid.value,revision:0,candidate_actions:["register"]},"register",{kind:kind.value},ctx.id())));
 }
 for(const row of r.rows){
  const box=el("details");box.append(el("summary",row.staff_id+" · "+fmt(row.kind)));parent.append(box);
  for(const p of row.placements)status(box,p.facility_id+" · "+p.start_date+" hingga "+fmt(p.end_exclusive)+" (akhir eksklusif)");
  if(row.latest_placement)status(box,"Penempatan terakhir: "+row.latest_placement.facility_id);
  if(!ctx.enabled||!row.candidate_actions.length)continue;
  const f=form(box,ctx),action=field(f,"Tindakan",select(row.candidate_actions)),day=field(f,"Tanggal efektif/pengamatan",input("date"));day.min="2026-01-01";day.max="2030-12-31";
  const dest=field(f,"Fasilitas tujuan",select(facilities.map(x=>[x.facility_id,x.label]),r.facility_id));
  const topic=field(f,"Kompetensi",select(["PENCATATAN_APEL_DEMO","PELAYANAN_KLINIK_DEMO","SURVEILANS_DEMO","KESMAVET_DEMO"]));
  function sync(){dest.parentElement.hidden=!["assign","transfer"].includes(action.value);topic.parentElement.hidden=action.value!=="record_competency";}
  action.addEventListener("change",sync);sync();
  btn(f,"Catat perubahan SDM",()=>run(ctx,f,"personnel",()=>staffCommand(row,action.value,action.value==="record_competency"?{facility_id:r.facility_id,observed_on:day.value,topic:topic.value}:action.value==="end_assignment"?{effective_on:day.value}:{facility_id:dest.value,effective_on:day.value},ctx.id())));
 }
 status(parent,"Catatan kompetensi bukan sertifikat; penempatan bukan perubahan akun.");
}
