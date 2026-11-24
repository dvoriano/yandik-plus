import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
import {read,subscribe} from "./leadership-bridge.mjs";
import {readDomain,DOMAINS,REGIONS} from "./domain-views.mjs";
import {YEARS,LAYERS,buildMap,registerSummary} from "./gis-model.mjs";
const $=id=>document.getElementById(id),el=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=String(t);return n;};
const svg=(tag,attrs={},text)=>{const n=document.createElementNS("http://www.w3.org/2000/svg",tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n;};
const options=(n,rows)=>n.replaceChildren(...rows.map(([v,l])=>new Option(l,v)));
const fmt=v=>v===null?"—":new Intl.NumberFormat("id-ID").format(v);
const scope=()=>({year:+$("gis-year").value,region_id:$("gis-region").value,layer:$("gis-layer").value});
const colors={UNKNOWN:"#64748b",ZERO:"#f8fafc",OBSERVED:"#16756d"};
let current=null,selected=null;
function detail(p){selected=p.facility_id;const l=LAYERS[current.layer],a=el("a","Buka panel sumber DEMO");a.href=l.href;$("gis-detail").replaceChildren(el("h3",p.label),el("p",p.region+" · "+current.year),el("p",l.label+": "+fmt(p.value)+" "+(p.value===null?"":l.unit)),el("p",p.context),el("p","Sumber: "+l.source+" · posisi fiktif, bukan GPS."),a);for(const b of $("gis-list").querySelectorAll("button"))b.setAttribute("aria-pressed",String(b.dataset.id===selected));}
function draw(v){const root=$("gis-map");const map=svg("svg",{viewBox:"0 0 600 400",role:"img","aria-label":"Kisi skematis fiktif Utara dan Selatan, bukan peta geografis"});map.style.width="100%";map.style.height="auto";map.style.display="block";
 map.append(svg("rect",{x:1,y:1,width:598,height:398,rx:12,fill:"#f1f5f9",stroke:"#94a3b8"}));
 map.append(svg("rect",{x:12,y:12,width:576,height:190,rx:10,fill:"#dbeafe"}),svg("rect",{x:12,y:214,width:576,height:174,rx:10,fill:"#dcfce7"}));
 for(let x=60;x<600;x+=60)map.append(svg("line",{x1:x,y1:48,x2:x,y2:380,stroke:"#94a3b8","stroke-opacity":.22}));
 for(let y=60;y<390;y+=60)map.append(svg("line",{x1:20,y1:y,x2:580,y2:y,stroke:"#94a3b8","stroke-opacity":.22}));
 map.append(svg("text",{x:28,y:35,fill:"#1e3a8a","font-size":16},"Wilayah DEMO Utara"),svg("text",{x:28,y:238,fill:"#14532d","font-size":16},"Wilayah DEMO Selatan"));
 for(const p of v.points){const g=svg("g");g.append(svg("title",{},p.label+" · "+fmt(p.value)),svg("circle",{cx:p.x,cy:p.y,r:21,fill:colors[p.state],stroke:"#334155","stroke-width":2,"stroke-dasharray":p.state==="UNKNOWN"?"3 3":"none"}),svg("text",{x:p.x,y:p.y+5,"text-anchor":"middle","font-size":13,"font-weight":"bold",fill:p.state==="ZERO"?"#0f172a":"#fff"},p.state==="UNKNOWN"?"?":p.state==="ZERO"?"0":"•"),svg("text",{x:p.x,y:p.y+37,"text-anchor":"middle","font-size":14,fill:"#0f172a"},p.label.replace("Puskeswan DEMO ","")));g.style.cursor="pointer";g.addEventListener("click",()=>detail(p));map.append(g);}
 root.replaceChildren(map);}
function render(){const s=scope(),query={year:s.year,region_id:s.region_id,facility_id:"ALL"};try{current=buildMap(s,{core:read("core",query),inventory:read("inventory",query),coaching:read("coaching",query)});draw(current);$("gis-status").textContent=current.points.length+" fasilitas dalam cakupan · "+current.known+" nilai tersedia · "+s.year+" · "+LAYERS[s.layer].source;const buttons=current.points.map(p=>{const b=el("button",p.label+" · "+fmt(p.value));b.type="button";b.dataset.id=p.facility_id;b.setAttribute("aria-pressed",String(selected===p.facility_id));b.addEventListener("click",()=>detail(p));return b;});$("gis-list").replaceChildren(...buttons);const p=current.points.find(x=>x.facility_id===selected);if(p)detail(p);else{$("gis-detail").textContent="Pilih titik pada kisi atau tombol daftar fasilitas.";selected=null;}}catch(e){current=null;selected=null;for(const id of ["gis-map","gis-list","gis-detail"])$(id).replaceChildren();$("gis-status").textContent="Peta DEMO tidak tersedia: "+e.message;}}
options($("gis-year"),YEARS.map(y=>[y,y]));options($("gis-region"),[["ALL","Semua wilayah DEMO"],...new Map(F.map(f=>[f.region_id,f.region_label]))]);options($("gis-layer"),Object.entries(LAYERS).map(([k,v])=>[k,v.label]));for(const id of ["gis-year","gis-region","gis-layer"])$(id).addEventListener("change",render);subscribe(render);render();
async function regionalRegisters(){const root=$("gis-registers"),rows=await Promise.all(REGIONS.flatMap(region=>DOMAINS.map(async domain=>{try{const v=await readDomain(domain,region);return [region,v.title,registerSummary(v),v.source];}catch{return [region,domain,null,"Gagal dimuat"];}})));root.replaceChildren(...rows.map(r=>el("p",r[0]+" · "+r[1]+" · "+fmt(r[2])+" entri · "+r[3])));}
regionalRegisters();
