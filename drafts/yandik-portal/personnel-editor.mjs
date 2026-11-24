/** UI for shared M05 identities; no free text or actual personnel records. */
import {PROFILE_CHOICES,COMPETENCIES,readPersonnel,changeProfile,transferStaff,recordCompetency} from "./personnel-model.mjs";
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);return e;};
function select(label,options,preferred){
 const wrap=el("label",label),input=el("select");
 input.replaceChildren(...options.map(([id,title])=>new Option(title,id)));
 if(options.some(([id])=>id===preferred))input.value=preferred;
 wrap.append(input);return {wrap,input};
}
function button(label,fn){const b=el("button",label);b.type="button";b.addEventListener("click",fn);return b;}
function table(columns,rows,caption){
 const wrap=el("div");wrap.className="table-wrap";
 if(!rows.length){wrap.append(el("p","Belum ada catatan dalam cakupan ini."));return wrap;}
 const t=el("table"),head=el("thead"),hr=el("tr");t.append(el("caption",caption));
 for(const col of columns){const th=el("th",col);th.scope="col";hr.append(th);}
 head.append(hr);t.append(head);const body=el("tbody");
 for(const row of rows){const tr=el("tr");for(const v of row)tr.append(el("td",v??"—"));body.append(tr);}
 t.append(body);wrap.append(t);return wrap;
}
const labels={save:"Simpan draf",submit:"Ajukan DEMO",accept:"Catat telaah diterima",correct:"Minta perbaikan",reject:"Tolak DEMO",transfer:"Mutasi DEMO",record_competency:"Catat pengembangan"};
export function renderPersonnelEditor(target,context,scope,onChange,onError){
 const v=readPersonnel(context,scope);
 const invoke=fn=>{try{onChange(fn());}catch(e){onError(e);}};
 target.replaceChildren(el("h3","Pembaruan profil per bagian"));
 for(const section of v.sections){
  const card=el("article");card.className="personnel-section";
  card.append(el("h4",section.label),el("p","Isi tercatat pada editor: "+(section.value??"belum tersedia")+
   " · Status: "+section.status+(section.request?" · Revisi "+section.request.version+" · "+section.request.value:"")));
  const actions=el("div");actions.className="action-row";
  if(section.request?.status==="diajukan"){
   for(const action of ["accept","correct","reject"])
    actions.append(button(labels[action],()=>invoke(()=>changeProfile(context,scope,{section:section.id,action}))));
  }else{
   const choice=select("Isi perubahan fiktif",PROFILE_CHOICES[section.id].map(x=>[x,x]),section.request?.value??section.value);
   card.append(choice.wrap);
   for(const action of ["save","submit"])actions.append(button(labels[action],()=>invoke(()=>changeProfile(context,scope,{section:section.id,action,value:choice.input.value}))));
  }
  card.append(actions);target.append(card);
 }
 target.append(el("h3","SDM aktif pada bulan terpilih"),
  table(["ID DEMO","Peran","Mulai","Akhir (eksklusif)"],v.staff.map(p=>[p.staff_id,p.role,p.start_month,p.end_month]),"Penempatan yang aktif"),
  el("p","Rekap Desember: dokter hewan "+(v.summary.doctors??"—")+" · paramedik "+(v.summary.paramedics??"—")+" · cakupan "+v.summary.sdm_coverage));
 if(v.movable.length&&v.destinations.length){
  const from=select("Tenaga dengan penempatan terbuka",v.movable.map(x=>[x.staff_id,x.staff_id]));
  const dest=select("Tujuan mutasi fiktif",v.destinations.map(x=>[x.facility_id,x.facility_label+" · "+x.region_label]));
  const box=el("div");box.className="personnel-section";
  box.append(el("h4","Simulasi mutasi mulai bulan terpilih"),from.wrap,dest.wrap,button("Catat mutasi DEMO",()=>invoke(()=>transferStaff(context,scope,{staff_id:from.input.value,destination_id:dest.input.value}))));
  target.append(box);
 }else target.append(el("p","Tidak ada penempatan terbuka yang dapat dimutasi pada bulan ini."));
 target.append(table(["ID DEMO","Peran","Mulai","Akhir (eksklusif)"],v.placements.map(p=>[p.staff_id,p.role,p.start_month,p.end_month]),"Riwayat penempatan sampai bulan terpilih"));
 target.append(el("h3","Catatan pengembangan kompetensi"));
 if(v.staff.length){
  const staff=select("Tenaga aktif",v.staff.map(x=>[x.staff_id,x.staff_id]));
  const topic=select("Topik DEMO",COMPETENCIES.map(x=>[x,x.replaceAll("_"," ")]));
  const box=el("div");box.className="personnel-section";
  box.append(staff.wrap,topic.wrap,button("Catat topik pengembangan DEMO",()=>invoke(()=>recordCompetency(context,scope,{staff_id:staff.input.value,topic:topic.input.value}))));
  target.append(box);
 }
 target.append(table(["ID DEMO","Bulan","Topik","Status"],v.competencies.map(x=>[x.staff_id,x.period,x.topic,x.status]),"Catatan, bukan sertifikat"),
  el("h3","Jejak perubahan simulasi"),
  table(["Revisi","Bulan pilihan","Objek","Tindakan","Sebelum","Sesudah"],v.history.map(h=>[
   h.revision,h.period,h.section??h.staff_id,labels[h.action]??h.action,
   h.type==="PROFILE"?(h.before.request?.value??h.before.value):h.type==="TRANSFER"?h.before.facility_id:null,
   h.type==="PROFILE"?(h.after.request?.value??h.after.value):h.type==="TRANSFER"?h.after.facility_id:h.after.topic
  ]),"Riwayat sesi, bukan audit server"));
}
