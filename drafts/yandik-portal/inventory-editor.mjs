/** Independent inventory panel using the canonical M05 demo master. No storage/network. */
import {register,notify} from "./leadership-bridge.mjs";
import {GROUPS,CATALOG_VERSION} from "./inventory-catalog.mjs";
import {YEARS,createInventory,readInventory,saveItem,copyPrior,confirmItem,confirmGroup,transition,regionalInventory} from "./inventory-model.mjs";
import {DEMO_FACILITIES} from "../m05-apel-dashboard-ui/fixtures.mjs";
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n;};
const set=(node,options,value)=>{node.replaceChildren(...options.map(([id,label])=>new Option(label,id)));if(options.some(([id])=>String(id)===String(value)))node.value=String(value);};
const button=(label,fn)=>{const n=el("button",label);n.type="button";n.addEventListener("click",fn);return n;};
const labels={UNCONFIRMED:"Belum dikonfirmasi",REVIEW:"Perlu telaah",ABSENT:"Tidak tersedia",STOCK_ATTENTION:"Stok perlu perhatian",BELOW_MINIMUM:"Di bawah minimum (layak pakai)",UNUSABLE:"Tidak layak pakai",PARTIAL_USABLE:"Sebagian layak",MINIMUM_REPORTED:"Minimum tercatat terpenuhi",AVAILABLE_REPORTED:"Tersedia menurut isian"};
const observations={AVAILABLE:"Tersedia",ABSENT:"Tidak tersedia",UNKNOWN:"Belum diketahui",CONTEXT_REVIEW:"Perlu telaah konteks"};
const conditions={ADEQUATE_REPORTED:"Cukup menurut petugas",LIMITED_REPORTED:"Terbatas",UNUSABLE_REPORTED:"Tidak layak/kedaluwarsa",NOT_ASSESSED:"Belum dinilai"};
function describe(row){
 if(!row)return "Belum ada isian";
 return observations[row.status]+(row.total!==null?" · "+row.usable+"/"+row.total+" layak/tersedia":"")+(row.condition?" · "+conditions[row.condition]:"")+(row.source_year!==null?" · sumber "+row.source_year:"");
}
const states={DRAFT:"Draf",CORRECTION:"Perbaikan",SUBMITTED:"Diajukan DEMO",RECORDED_DEMO:"Dicatat DEMO",NOT_STARTED:"Belum mulai"};
function table(target,head,rows){const w=el("div",undefined,"table-wrap"),t=el("table"),h=el("thead"),tr=el("tr");for(const v of head){const x=el("th",v);x.scope="col";tr.append(x);}h.append(tr);t.append(h);const b=el("tbody");for(const row of rows){const line=el("tr");for(const v of row){const td=el("td");td.append(v instanceof Node?v:document.createTextNode(String(v??"—")));line.append(td);}b.append(line);}t.append(b);w.append(t);target.replaceChildren(w);}
let state=createInventory(),selected=null;
register("inventory",s=>regionalInventory(state,s.year,s.region_id).filter(r=>s.facility_id==="ALL"||r.facility_id===s.facility_id));
const scope=()=>({year:Number($("inv-year").value),region_id:$("inv-region").value,facility_id:$("inv-facility").value});
function facility(){set($("inv-facility"),DEMO_FACILITIES.filter(f=>f.region_id===$("inv-region").value).map(f=>[f.facility_id,f.facility_label]),$("inv-facility").value);}
function act(fn,message){try{state=fn();selected=null;render();$("inv-feedback").textContent=message;}catch(e){$("inv-feedback").textContent="Belum dapat dilakukan: "+e.message;}}
function edit(item,editable){
 selected=item.id;
 const panel=$("inv-edit");panel.replaceChildren(el("h3",item.label),el("p",item.ref+" · halaman "+item.page));
 const row=item.observation;
 if(!editable){panel.append(el("p",describe(item.observation)),el("p","Laporan terkunci. Buka perbaikan DEMO untuk mengubah."));return;}
 const form=el("form"),wrap=el("div",undefined,"filter-row");
 const make=(label,control)=>{const n=el("label",label);n.append(control);wrap.append(n);return control;};
 const status=make("Ketersediaan",el("select"));
 set(status,[["","Pilih status"],["AVAILABLE","Tersedia"],["ABSENT","Tidak tersedia"],["UNKNOWN","Belum diketahui"],...(item.group==="A5"?[["CONTEXT_REVIEW","Perlu penyesuaian jenis layanan/situasi penyakit"]]:[])],row?.status??"");
 const total=make(item.kind==="area"?"Luas tercatat (m²)":"Jumlah tersedia",el("input"));
 const usable=make(item.kind==="area"?"Luas layak digunakan (m²)":"Jumlah layak pakai",el("input"));
 for(const x of [total,usable]){x.type="number";x.min="0";x.max="1000000";x.step=item.kind==="area"?"any":"1";}
 total.value=row?.total??"";usable.value=row?.usable??"";
 const condition=make("Kondisi stok",el("select"));set(condition,[["","Pilih kondisi"],["ADEQUATE_REPORTED","Cukup menurut petugas"],["LIMITED_REPORTED","Terbatas"],["UNUSABLE_REPORTED","Tidak layak/ kedaluwarsa"],["NOT_ASSESSED","Belum dinilai"]],row?.condition??"");
 function sync(){const available=status.value==="AVAILABLE";for(const x of [total,usable]){x.disabled=!available||item.kind==="stock";x.parentElement.hidden=x.disabled;x.required=!x.disabled;}condition.disabled=!available||item.kind!=="stock";condition.parentElement.hidden=condition.disabled;condition.required=!condition.disabled;}
 status.required=true;status.addEventListener("change",sync);sync();form.append(wrap);
 const save=el("button","Simpan dan konfirmasi item");save.type="submit";form.append(save);
 form.addEventListener("submit",e=>{e.preventDefault();act(()=>saveItem(state,scope(),item.id,{status:status.value,total:total.valueAsNumber,usable:usable.valueAsNumber,condition:condition.value}),"Item dikonfirmasi untuk tahun terpilih.");});
 panel.append(form);panel.scrollIntoView({block:"nearest"});
}
function render(){
 const s=scope(),v=readInventory(state,s),editable=["DRAFT","CORRECTION"].includes(v.status),g=$("inv-group").value,q=$("inv-search").value.trim().toLowerCase(),filter=$("inv-filter").value;
 $("inv-progress").textContent=v.confirmed+" dari "+v.total+" butir dikonfirmasi · "+v.attention+" butir perlu perhatian · "+states[v.status]+" · revisi "+v.revision;
 $("inv-meter").max=v.total;$("inv-meter").value=v.confirmed;
 $("inv-source").textContent=v.copied_from?"Salinan dari "+v.copied_from.year+" ("+states[v.copied_from.status]+"), revisi "+v.copied_from.revision+". Salinan belum terkonfirmasi sampai diperiksa.":"Tidak ada salinan tahun sebelumnya pada draf ini.";
 $("inv-group-progress").replaceChildren(...GROUPS.map(x=>{const rows=v.rows.filter(i=>i.group===x.id);return button(x.label+" · "+rows.filter(i=>i.observation?.confirmed).length+"/"+rows.length,()=>{$("inv-group").value=x.id;selected=null;render();});}));
 const rows=v.rows.filter(x=>(g==="ALL"||x.group===g)&&(!q||(x.label+" "+x.ref).toLowerCase().includes(q))&&(filter==="ALL"||filter==="PENDING"&&x.assessment==="UNCONFIRMED"||filter==="ATTENTION"&&["ABSENT","BELOW_MINIMUM","UNUSABLE","PARTIAL_USABLE","STOCK_ATTENTION","REVIEW"].includes(x.assessment)));
 table($("inv-list"),["Butir & rujukan","Minimum eksplisit","Kondisi tercatat","Aksi"],rows.map(x=>[
 x.label+" ("+x.ref+" · hlm. "+x.page+")",x.minimum===null?"Tidak disebut":x.minimum+" "+x.unit,
 labels[x.assessment]+" · "+describe(x.observation),
 (()=>{const box=el("div",undefined,"action-row");box.append(button(editable?"Perbarui":"Lihat",()=>edit(x,editable)));
 if(editable&&x.observation&&!x.observation.confirmed)box.append(button("Konfirmasi tetap",()=>act(()=>confirmItem(state,s,x.id),"Salinan diperiksa dan dikonfirmasi.")));
 return box;})()
 ]));
 $("inv-edit").replaceChildren();
 $("inv-actions").replaceChildren();
 if(editable){
  if(v.revision===0&&s.year>2026)$("inv-actions").append(button("Salin data tahun sebelumnya",()=>act(()=>copyPrior(state,s),"Salinan dibuat, semua butir wajib diperiksa ulang.")));
  if(g!=="ALL"&&!q&&filter==="ALL"&&v.rows.some(x=>x.group===g&&x.observation&&!x.observation.confirmed))$("inv-actions").append(button("Konfirmasi salinan grup ini",()=>{if(confirm("Sudah memeriksa semua butir salinan pada grup ini dan tidak ada perubahan?"))act(()=>confirmGroup(state,s,g),"Salinan grup dikonfirmasi.");}));
  const submit=button("Ajukan inventaris DEMO",()=>act(()=>transition(state,s,"submit"),"Diajukan dalam simulasi."));submit.disabled=v.confirmed!==v.total;$("inv-actions").append(submit);
 }else if(v.status==="SUBMITTED"){
  $("inv-actions").append(button("Minta perbaikan DEMO",()=>act(()=>transition(state,s,"return"),"Dibuka untuk perbaikan.")),button("Catat hasil telaah DEMO",()=>act(()=>transition(state,s,"record"),"Dicatat dalam simulasi; bukan verifikasi resmi.")));
 }else $("inv-actions").append(button("Buka revisi DEMO",()=>act(()=>transition(state,s,"reopen"),"Revisi dibuka.")));
 table($("inv-regional"),["Wilayah","Puskeswan","Status","Dikonfirmasi","Perlu perhatian"],regionalInventory(state,s.year).map(x=>[x.region_label,x.facility_label,states[x.status],x.confirmed+"/"+x.total,x.attention]));
 const hist=v.history.slice().reverse().map(x=>[x.revision,x.action,x.item_id??(x.item_ids?.join(", ")??x.year??"—")]);table($("inv-history"),["Revisi","Tindakan","Butir/tahun"],hist);
 $("inv-version").textContent=CATALOG_VERSION;notify();
}
set($("inv-year"),YEARS.map(y=>[y,y]),2027);
set($("inv-region"),[...new Map(DEMO_FACILITIES.map(f=>[f.region_id,f.region_label]))],DEMO_FACILITIES[0].region_id);
facility();set($("inv-group"),[["ALL","Semua kelompok"],...GROUPS.map(x=>[x.id,x.label])],"A1");
for(const id of ["inv-year","inv-region","inv-facility","inv-group","inv-filter"]){$(id).addEventListener("change",()=>{if(id==="inv-region")facility();selected=null;$("inv-feedback").textContent="";render();});}
$("inv-search").addEventListener("input",()=>{selected=null;render();});
$("inv-reset").addEventListener("click",()=>{if(confirm("Hapus seluruh inventaris simulasi dalam sesi ini?")){state=createInventory();selected=null;render();}});
render();
