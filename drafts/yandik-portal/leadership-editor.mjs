import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
import {read,subscribe} from "./leadership-bridge.mjs";
import {coreMetrics,inventoryMetrics,coachingMetrics,documentMetrics,pct} from "./leadership-model.mjs";
import {readDomain,DOMAINS,REGIONS} from "./domain-views.mjs";
const $=id=>document.getElementById(id),el=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=String(t);return n;};
const fmt=v=>v===null||v===undefined?"—":typeof v==="number"?new Intl.NumberFormat("id-ID").format(v):String(v);
const ratio=(a,b)=>fmt(a)+" / "+fmt(b);
const opts=(n,rows)=>n.replaceChildren(...rows.map(([v,l])=>new Option(l,v)));
const scope=()=>({year:+$("lead-year").value,region_id:$("lead-region").value,facility_id:$("lead-facility").value});
function sync(){opts($("lead-facility"),[["ALL","Semua Puskeswan"],...F.filter(f=>$("lead-region").value==="ALL"||f.region_id===$("lead-region").value).map(f=>[f.facility_id,f.facility_label])]);}
function table(root,heads,rows){const w=el("div");w.className="table-wrap";const t=el("table"),h=el("thead"),tr=el("tr");for(const x of heads){const c=el("th",x);c.scope="col";tr.append(c);}h.append(tr);t.append(h);const b=el("tbody");for(const row of rows){const line=el("tr");for(const v of row)line.append(el("td",fmt(v)));b.append(line);}t.append(b);w.append(t);root.replaceChildren(w);}
function card(title,value,note,href){const a=el("article");a.className="review-card";const l=el("a","Lihat sumber DEMO");l.href=href;a.append(el("small",title),el("strong",fmt(value)),el("p",note),l);return a;}
function render(){const s=scope(),core=read("core",s),inv=read("inventory",s),coach=read("coaching",s),docs=read("documents",s),support=read("support",s);const c=core.available?coreMetrics(core.data):null,i=inv.available?inventoryMetrics(inv.data):null,k=coach.available?coachingMetrics(coach.data):null,d=docs.available?documentMetrics(docs.data):null;
 $("lead-cards").replaceChildren(
 card("Pelayanan tercatat",c?.service,"M05 ledger; hanya bulan yang tercatat, bukan estimasi tahunan.","#layanan"),
 card("Cakupan laporan",c?ratio(c.reported,c.expected):null,c?fmt(pct(c.reported,c.expected))+"% fasilitas-bulan dari 12 bulan setahun; bukan ketepatan waktu.":"Sumber belum tersedia.","#koreksi"),
 card("Profil tersedia",c?ratio(c.profiles,c.facilities):null,"M05-15 snapshot tahunan, bukan profil lengkap terverifikasi.","#profil-sdm"),
 card("SDM lengkap tercatat",c?ratio(c.sdm,c.facilities):null,c?"Dokter: "+fmt(c.doctors)+" · Paramedik: "+fmt(c.paramedics)+" (total hanya bila cakupan lengkap).":"Sumber belum tersedia.","#profil-sdm"),
 card("Inventaris dikonfirmasi",i?ratio(i.confirmed,i.expected):null,"Butir × fasilitas; "+(i?i.complete:"—")+" fasilitas lengkap, bukan jumlah aset.","#inventaris"),
 card("Butir perlu perhatian",i?.attention,"Hanya observasi terkonfirmasi; kosong bukan tidak tersedia.","#inventaris"),
 card("Pembinaan & Bimtek",k?.activities,k?"Hasil tercatat "+k.recorded+" · tindak lanjut terbuka "+k.open+" · kehadiran "+fmt(k.attendance):"Sumber belum tersedia.","#kegiatan"),
 card("Administrasi kegiatan",d?.documents,d?"Telaah "+d.review+" · arsip DEMO "+d.archived+" · sumber berubah "+d.stale:"Sumber belum tersedia.","#administrasi"));
 const f=core.available?core.data:[];const ix=new Map((inv.data??[]).map(x=>[x.facility_id,x]));
 if(!core.available){$("lead-detail").textContent="Sumber inti belum tersedia.";}else table($("lead-detail"),["Puskeswan","Bulan terlapor (dari 12)","Pelayanan tercatat","Dokter","Paramedik","Butir dikonfirmasi","Perlu perhatian"],f.map(r=>{const v=ix.get(r.facility_id);return [r.facility_label,r.reported_months,r.observed_demo_events,r.doctors,r.paramedics,v?ratio(v.confirmed,v.total):null,v?.confirmed?v.attention:null];}));
 if(!support.available)$("lead-support").textContent="Sumber dukungan belum tersedia.";else table($("lead-support"),["Skenario M04","Kebutuhan tercatat","Paket","Kirim","Terima","Referensi serah terima","Pemantauan"],support.data.map(r=>[r.name,r.needs,r.packages,r.ship,r.receipt,r.handover,r.monitor]));
 $("lead-status").textContent="Cakupan tahun "+s.year+" · "+($("lead-region").selectedOptions[0]?.textContent??"")+" · "+($("lead-facility").selectedOptions[0]?.textContent??"")+" · sumber DEMO dalam halaman ini.";
}
opts($("lead-year"),[2026,2027,2028,2029,2030].map(y=>[y,y]));opts($("lead-region"),[["ALL","Semua wilayah"],...new Map(F.map(f=>[f.region_id,f.region_label]))]);sync();for(const id of ["lead-year","lead-region","lead-facility"])$(id).addEventListener("change",()=>{if(id==="lead-region")sync();render();});
subscribe(render);render();
async function oversight(){const jobs=REGIONS.flatMap(region=>DOMAINS.map(async key=>{try{const v=await readDomain(key,region);return [v.title,region,v.source,v.available?v.rows.length:null,v.available?"Snapshot tersedia":"Sumber belum tersedia"];}catch{return [key,region,"—",null,"Sumber gagal dimuat"];}}));table($("lead-domains"),["Register","Wilayah register","Sumber","Entri","Cakupan"],await Promise.all(jobs));}
oversight();
