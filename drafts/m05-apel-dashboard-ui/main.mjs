/**
 * M05-14 | KODE DITULIS, BELUM DIUJI | UI DEMO ONLY.
 * No fetch, remote images, analytics, persistence, browser storage or API.
 * Static browser-only readout. No production credentials or user identities.
 */
import {buildDemoDashboard,M05_14_MONTH_NAMES,M05_14_STATUS}
 from "./model.mjs";
import {buildDemoDashboardFixture} from "./fixtures.mjs";

const fixture=buildDemoDashboardFixture();
const state={year:2026,region_id:"ALL",facility_id:"ALL"};
const byId=id=>document.getElementById(id);
const format=new Intl.NumberFormat("id-ID");
const text=(node,value)=>{node.textContent=String(value);return node;};
const node=(tag,className,content)=>{
 const e=document.createElement(tag);
 if(className)e.className=className;
 if(content!==undefined)text(e,content);
 return e;
};
const append=(parent,...children)=>{parent.append(...children);return parent;};
const noData="Belum ada laporan DEMO pada filter ini";
const statusClass={
 BELUM_DILAPORKAN:"is-missing",
 LAPORAN_NOL:"is-zero",
 LAPORAN_ADA_KEGIATAN:"has-data"
};
function option(value,label){
 const x=document.createElement("option");
 x.value=value;x.textContent=label;return x;
}
function populate(select,items,selected){
 select.replaceChildren(...items.map(([val,label])=>option(val,label)));
 select.value=selected;
}
function syncFilters(model){
 populate(byId("year-filter"),
  model.options.years.map(y=>[String(y),String(y)]),String(state.year));
 populate(byId("region-filter"),[
  ["ALL","Semua wilayah DEMO"],...model.options.regions.map(r=>
   [r.region_id,r.region_label])],state.region_id);
 const eligible=model.options.facilities.filter(f=>
  state.region_id==="ALL"||f.region_id===state.region_id);
 if(state.facility_id!=="ALL"&&!eligible.some(f=>
  f.facility_id===state.facility_id))state.facility_id="ALL";
 populate(byId("facility-filter"),[
  ["ALL","Semua Puskeswan DEMO"],
  ...eligible.map(f=>[f.facility_id,f.facility_label])],state.facility_id);
}
function makeKpi(title,value,note,variant){
 const card=node("article","kpi-card "+variant);
 append(card,node("div","kpi-label",title),
  node("div","kpi-value",value),node("div","kpi-help",note));
 return card;
}
function renderKpis(model){
 const s=model.summary,shown=s.observed_demo_events===null?
  "—":format.format(s.observed_demo_events);
 const cards=[
  makeKpi("Pelayanan tercatat (DEMO)",shown,
   s.observed_demo_events===null?
    "Belum ada laporan; bukan berarti 0":
    "Akumulasi laporan terisi; bisa masih parsial","accent"),
  makeKpi("Bulan Puskeswan terlapor",
   format.format(s.reported_facility_months)+" / "+format.format(s.expected_facility_months),
   "Jumlah entri fasilitas-bulan, bukan kepatuhan tenggat",""),
  makeKpi("Laporan nol eksplisit",format.format(s.explicit_zero_reports),
   "Laporan berisi 0 yang benar-benar dicatat DEMO","orange"),
  makeKpi("Bulan belum dilaporkan",format.format(s.missing_facility_months),
   "Tidak otomatis disamakan dengan pelayanan 0","grey")
 ];
 byId("kpi-cards").replaceChildren(...cards);
 const scope=s.facility_count===0?
  "Tidak ada Puskeswan dalam cakupan ini.":
  s.coverage_state==="ALL_SELECTED_REPORTED_DEMO"?
   "Semua bulan DEMO terisi; belum diverifikasi resmi.":
   "Cakupan DEMO masih parsial; total bukan capaian tahunan final.";
 text(byId("coverage-note"),"Tahun "+model.year+" · "+scope);
}
function renderChart(model){
 const target=byId("monthly-chart");
 const months=model.months;
 const positive=months.filter(m=>m.observed_demo_events!==null).map(
  m=>m.observed_demo_events);
 const max=Math.max(1,...positive);
 const bars=node("div","chart-bars");
 bars.setAttribute("role","img");
 bars.setAttribute("aria-label","Pelayanan per bulan DEMO; bulan tanpa laporan bukan nol. "+
  months.map(m=>m.label+": "+(m.observed_demo_events===null?
   "belum ada laporan":format.format(m.observed_demo_events))).join("; "));
 for(const m of months){
  const slot=node("div","bar-slot"),track=node("div","bar-track");
  const v=m.observed_demo_events;
  const fill=node("div",v===null?"bar-missing":v===0?"bar-zero":"bar-fill");
  if(v!==null&&v>0)fill.style.height=Math.max(3,(v/max)*100)+"%";
  fill.title=m.label+": "+(v===null?"belum ada laporan DEMO":
   format.format(v)+" pelayanan DEMO")+" · "+m.facilities_reported+
   " dari "+model.summary.facility_count+" Puskeswan";
  append(track,fill);
  append(slot,track,node("div","bar-label",m.label));bars.append(slot);
 }
 const note=node("p","chart-caption",
  "Diagram menggunakan jumlah yang dilaporkan. Kolom kosong berarti tidak ada laporan DEMO pada bulan tersebut.");
 target.replaceChildren(bars,note);
}
function coverageLine(label,value,description){
 const container=node("div","coverage-line");
 const left=node("div");
 append(left,node("strong","",label),node("div","",description));
 left.lastChild.style.color="#7b9197";
 left.lastChild.style.fontSize="10px";
 append(container,left,node("span","count",value));
 return container;
}
function renderCoverage(model){
 const s=model.summary,root=byId("coverage-summary");
 const progress=node("div","coverage-progress");
 progress.setAttribute("role","img");
 progress.setAttribute("aria-label",
  s.reported_facility_months+" terlapor dari "+s.expected_facility_months+
  " fasilitas-bulan DEMO");
 const done=node("span","progress-reported");
 const missing=node("span","progress-missing");
 const pct=s.expected_facility_months?
  s.reported_facility_months/s.expected_facility_months*100:0;
 done.style.width=pct+"%";missing.style.width=(100-pct)+"%";
 append(progress,done,missing);
 root.replaceChildren(
  coverageLine("Puskeswan dalam filter",String(s.facility_count),
   "Unit sintetis, bukan jumlah resmi"),
  coverageLine("Bulan terisi",String(s.reported_facility_months),
   "Bisa berisi laporan pelayanan 0"),
  coverageLine("Bulan belum melapor",String(s.missing_facility_months),
   "Tidak masuk jumlah pelayanan"),
  progress,
  node("p","coverage-foot",
   "Cakupan = laporan terisi / seluruh kombinasi Puskeswan dan 12 bulan pada filter DEMO."),
  node("p","coverage-warning",
   "Ketepatan waktu, skor, ranking, dan validitas Juknis tidak tersedia. Semua data belum terverifikasi.")
 );
}
function makeCell(row){
 const td=document.createElement("td");
 const mark=node("span","status-mark "+statusClass[row.status]);
 text(mark,row.status==="BELUM_DILAPORKAN"?"—":
  row.status==="LAPORAN_NOL"?"0":"●");
 const status=M05_14_STATUS[row.status];
 mark.title=status+(row.observed_demo_events!==null?
  " · "+format.format(row.observed_demo_events)+" pelayanan DEMO":"");
 mark.setAttribute("aria-label",row.period+" "+status+
  (row.observed_demo_events===null?"":", "+row.observed_demo_events+
  " pelayanan DEMO"));
 td.append(mark);return td;
}
function renderMatrix(model){
 const target=byId("matrix-table");
 text(byId("matrix-caption"),model.summary.facility_count+
  " Puskeswan DEMO · 12 bulan");
 if(!model.facility_rows.length){
  target.replaceChildren(node("p","table-empty",
   "Belum ada unit DEMO untuk ruang lingkup ini."));
  return;
 }
 const table=node("table","status-table"),caption=document.createElement("caption");
 text(caption,"Matriks status APEL DEMO "+model.year+
  ". ● = ada pelayanan, 0 = laporan nol, — = belum melapor.");
 const head=document.createElement("thead"),headRow=document.createElement("tr");
 append(headRow,node("th","","Puskeswan"));
 headRow.firstChild.scope="col";
 for(const m of M05_14_MONTH_NAMES){
  const th=node("th","",m);th.scope="col";headRow.append(th);
 }
 head.append(headRow);
 const body=document.createElement("tbody");
 for(const f of model.facility_rows){
  const tr=document.createElement("tr"),name=node("td","",f.facility_label);
  const label=node("div","",f.region_label);
  label.style.fontSize="10px";label.style.color="#81979c";
  name.append(label);tr.append(name);
  for(const m of f.months)tr.append(makeCell(m));
  body.append(tr);
 }
 append(table,caption,head,body);
 target.replaceChildren(table);
}
function render(){
 try{
  const model=buildDemoDashboard({
   ledger:fixture.ledger,facilities:fixture.facilities,...state
  });
  syncFilters(model);
  renderKpis(model);renderChart(model);
  renderCoverage(model);renderMatrix(model);
 }catch{
  // No display of raw exception details that could expose future inputs.
  text(byId("coverage-note"),
   "Dashboard DEMO belum dapat dibentuk. Periksa kontrak data sebelum digunakan.");
  byId("kpi-cards").replaceChildren();
  byId("monthly-chart").replaceChildren();
  byId("coverage-summary").replaceChildren();
  byId("matrix-table").replaceChildren(
   node("p","table-empty","Tampilan DEMO gagal dibentuk. Belum ada data resmi."));
 }
}
byId("year-filter").addEventListener("change",event=>{
 state.year=Number(event.target.value);render();
});
byId("region-filter").addEventListener("change",event=>{
 state.region_id=event.target.value;state.facility_id="ALL";render();
});
byId("facility-filter").addEventListener("change",event=>{
 state.facility_id=event.target.value;render();
});
byId("reset-filters").addEventListener("click",()=>{
 state.year=2026;state.region_id="ALL";state.facility_id="ALL";render();
});
render();
