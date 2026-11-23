import { YEAR, MONTHS, UNITS, recordFor, visibleUnits,
  summarize, monthlyTrend, pending, csvFor, validateDataset } from "./data.mjs";
if(!validateDataset()) throw Error("Dataset simulasi tidak valid");
const $=id=>document.getElementById(id);
const fmt=new Intl.NumberFormat("id-ID"),NS="http://www.w3.org/2000/svg";
const STATUS={on_time:"Tepat waktu",late:"Terlambat",missing:"Belum lapor"};
let month=9,kind="all",status="all",search="",selected=UNITS[0].code;
for(const [i,label] of MONTHS.entries()){
  const option=document.createElement("option");
  option.value=String(i);option.textContent=label+" "+YEAR;
  $("month").append(option);
}
$("month").value=String(month);
const scope=()=>visibleUnits({month,search,kind,status:"all"});
const shown=()=>visibleUnits({month,search,kind,status});
const text=(id,value)=>{$(id).textContent=String(value)};
function svg(tag,props={}){
 const el=document.createElementNS(NS,tag);
 for(const [key,value] of Object.entries(props))el.setAttribute(key,String(value));
 return el;
}
function drawUnits(){
 const target=$("region-list");target.replaceChildren();
 const entries=shown();
 text("filter-note",entries.length+" dari "+scope().length+" wilayah sesuai filter · SIMULASI");
 if(!entries.length){
  const p=document.createElement("p");p.className="no-data";
  p.textContent="Tidak ada wilayah contoh yang cocok. Ubah filter.";
  target.append(p);return;
 }
 for(const unit of entries){
  const r=recordFor(unit.code,month),button=document.createElement("button");
  button.type="button";button.className="region-row";
  button.setAttribute("aria-pressed",String(selected===unit.code));
  const left=document.createElement("span"),right=document.createElement("span");
  const name=document.createElement("strong");name.textContent=unit.name;
  const sub=document.createElement("small");
  sub.textContent=unit.id+" · "+unit.code+" · "+unit.seat;
  left.append(name,sub);right.className="right";
  const tag=document.createElement("span");tag.className="state "+r.status;
  tag.textContent=STATUS[r.status];
  const val=document.createElement("small");
  val.textContent=r.services===null?"N/A":fmt.format(r.services)+" layanan";
  right.append(tag,val);button.append(left,right);
  button.addEventListener("click",()=>{selected=unit.code;render()});
  target.append(button);
 }
}
function drawSummary(){
 const s=summarize(month,shown().map(u=>u.code));
 text("k-units",fmt.format(s.units));text("k-reported",fmt.format(s.reported));
 text("k-missing",fmt.format(s.missing));text("k-ontime",fmt.format(s.onTime));
 text("k-services",s.units?fmt.format(s.services):"N/A");
 text("k-rate",s.rate===null?"N/A":s.rate.toFixed(1)+"% melapor · fiktif");
}
function drawDetail(){
 const unit=UNITS.find(u=>u.code===selected),r=unit?recordFor(unit.code,month):null;
 text("selected-name",unit?.name??"Tidak ada wilayah dipilih");
 text("selected-seat",unit?unit.id+" · sekitar "+unit.seat+" (bukan alamat fasilitas)":"Ubah filter untuk menampilkan contoh.");
 text("selected-status",r?STATUS[r.status]:"—");
 text("selected-day",!r||r.submittedDay===null?"Belum tersedia":String(r.submittedDay));
 text("selected-services",!r||r.services===null?"N/A":fmt.format(r.services));
 text("detail-note",!r?"Tidak ada wilayah dalam filter.":
  !r.reported?"Laporan belum tersedia. Jangan disimpulkan pelayanan nol.":
  r.services===0?"Pelaporan ada, nilai pelayanan 0. Berbeda dari belum melapor.":
  "Semua angka pada kartu ini fiktif, tidak mencerminkan kondisi aktual.");
}
function drawTrend(){
 const target=$("trend-chart");target.replaceChildren();
 const values=monthlyTrend(scope().map(u=>u.code));
 const n=Math.max(1,...values.map(v=>v.units));
 target.append(svg("line",{x1:36,y1:203,x2:716,y2:203,stroke:"#51677c"}));
 const title=svg("title");title.textContent="Jumlah unit fiktif yang sudah melapor selama 12 bulan";target.append(title);
 for(const [i,row] of values.entries()){
  const x=45+i*55,height=170*row.reported/n;
  const bar=svg("rect",{x,y:203-height,width:29,height,rx:4,fill:i===month?"#72e3cc":"#3d899a"});
  const label=svg("text",{x:x+14,y:230,"text-anchor":"middle",fill:"#9db0c4","font-size":11});
  label.textContent=MONTHS[i].slice(0,3);
  const count=svg("text",{x:x+14,y:Math.max(14,203-height-7),"text-anchor":"middle",fill:"#d1f3eb","font-size":11});
  count.textContent=String(row.reported);
  target.append(bar,label,count);
 }
}
function drawFollowUp(){
 const target=$("follow-up");target.replaceChildren();
 const remaining=pending(month,scope().map(u=>u.code));
 if(!remaining.length){
  const p=document.createElement("p");p.className="subtle";
  p.textContent="Tidak ada unit contoh berstatus belum lapor pada cakupan ini.";target.append(p);return;
 }
 for(const r of remaining.slice(0,10)){
  const unit=UNITS.find(u=>u.code===r.code),row=document.createElement("div");
  row.className="follow-row";
  const name=document.createElement("strong");name.textContent=unit.name;
  const desc=document.createElement("span");desc.textContent="Belum lapor · fiktif";
  row.append(name,desc);target.append(row);
 }
 if(remaining.length>10){
  const note=document.createElement("p");note.className="subtle";
  note.textContent="+"+(remaining.length-10)+" wilayah contoh lainnya";target.append(note);
 }
}
function render(){
 const matches=shown();
 if(!matches.some(u=>u.code===selected))selected=matches[0]?.code??null;
 drawSummary();drawUnits();drawDetail();drawTrend();drawFollowUp();
}
$("month").addEventListener("change",e=>{month=Number(e.target.value);render()});
$("kind").addEventListener("change",e=>{kind=e.target.value;render()});
$("status").addEventListener("change",e=>{status=e.target.value;render()});
$("search").addEventListener("input",e=>{search=e.target.value;render()});
$("export").addEventListener("click",()=>{
 const csv=csvFor(month,shown().map(u=>u.code));
 const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
 const anchor=document.createElement("a");
 anchor.href=url;anchor.download="YANDIK-LAB-FIKTIF-"+YEAR+"-"+String(month+1).padStart(2,"0")+".csv";
 document.body.append(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);
});
render();
