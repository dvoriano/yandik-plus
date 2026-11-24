/** MOD-12/M10 | synthetic Cartesian schematic, not geographic coordinates. CODE_ONLY. */
import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
export const YEARS=[2026,2027,2028,2029,2030];
export const LAYERS=Object.freeze({
 facilities:{label:"Sebaran Puskeswan",unit:"fasilitas",source:"Master M05",href:"#profil-sdm"},
 service:{label:"Pelayanan tercatat",unit:"layanan",source:"M05-0/M05-14",href:"#layanan"},
 reporting:{label:"Cakupan laporan",unit:"bulan / 12",source:"M05-14",href:"#koreksi"},
 sdm:{label:"Dokter hewan",unit:"orang tercatat",source:"M05-15 (Desember)",href:"#profil-sdm"},
 inventory:{label:"Inventaris perlu perhatian",unit:"butir terkonfirmasi",source:"MOD-01",href:"#inventaris"},
 coaching:{label:"Tindak lanjut pembinaan",unit:"kegiatan terbuka",source:"MOD-09",href:"#kegiatan"}
});
export const GRID=Object.freeze([
 Object.freeze({facility_id:"DEMO-PSW-ALPHA",x:150,y:95}),
 Object.freeze({facility_id:"DEMO-PSW-BETA",x:435,y:155}),
 Object.freeze({facility_id:"DEMO-PSW-GAMMA",x:290,y:310})
]);
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
export function validateGrid(grid=GRID){
 check(Array.isArray(grid)&&grid.length===F.length,"GRID_COVERAGE_INVALID");
 const ids=new Set(),points=new Set();
 for(const p of grid){
  check(Object.keys(p).sort().join(",")==="facility_id,x,y","GRID_FIELDS_INVALID");
  const f=F.find(x=>x.facility_id===p.facility_id);
  check(f&&!ids.has(p.facility_id),"GRID_ID_INVALID");
  check(Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=45&&p.x<=555&&p.y>=65&&p.y<=365,"GRID_POINT_INVALID");
  check(f.region_id==="DEMO-REGION-UTARA"?p.y<200:p.y>230,"GRID_REGION_INVALID");
  const k=p.x+"|"+p.y;check(!points.has(k),"GRID_DUPLICATE_POINT");ids.add(p.facility_id);points.add(k);
 }
 return true;
}
function index(provider,allowed){
 if(provider?.available!==true||!Array.isArray(provider.data))return null;
 const map=new Map();
 for(const r of provider.data){check(allowed.some(f=>f.facility_id===r.facility_id&&f.region_id===r.region_id)&&!map.has(r.facility_id),"SOURCE_SCOPE_MISMATCH");map.set(r.facility_id,r);}
 return map;
}
const nonneg=v=>Number.isFinite(v)&&v>=0?v:null;
export function buildMap(scope,providers={},grid=GRID){
 validateGrid(grid);
 check(YEARS.includes(scope.year)&&Object.hasOwn(LAYERS,scope.layer),"GIS_SCOPE_INVALID");
 check(scope.region_id==="ALL"||F.some(f=>f.region_id===scope.region_id),"GIS_REGION_INVALID");
 const facilities=F.filter(f=>scope.region_id==="ALL"||f.region_id===scope.region_id);
 const core=index(providers.core,facilities),inv=index(providers.inventory,facilities);
 const coach=providers.coaching?.available===true&&Array.isArray(providers.coaching.data)?providers.coaching.data:null;
 if(coach)check(coach.every(r=>facilities.some(f=>f.facility_id===r.facility_id&&f.region_id===r.region_id)&&Number(r.date?.slice(0,4))===scope.year),"COACH_SCOPE_MISMATCH");
 const points=facilities.map(f=>{
  const p=grid.find(x=>x.facility_id===f.facility_id),c=core?.get(f.facility_id),i=inv?.get(f.facility_id);
  let value=null,context="Sumber belum tersedia";
  switch(scope.layer){
   case "facilities":value=1;context="Identitas master fiktif; posisi pada kisi ilustrasi";break;
   case "service":value=nonneg(c?.observed_demo_events);context=c?c.reported_months+" / 12 bulan tercatat":"Sumber belum tersedia";break;
   case "reporting":value=nonneg(c?.reported_months);context=value===null?context:"Cakupan tahun penuh, bukan ketepatan waktu";break;
   case "sdm":value=nonneg(c?.doctors);context=c?"Paramedik: "+(nonneg(c.paramedics)??"—")+" · cakupan "+c.sdm_coverage:context;break;
   case "inventory":value=i?.confirmed>0?nonneg(i.attention):null;context=i?i.confirmed+" / "+i.total+" butir dikonfirmasi; bukan jumlah aset":context;break;
   case "coaching":value=coach?coach.filter(r=>r.facility_id===f.facility_id&&r.status==="FOLLOWUP_OPEN").length:null;context=coach?"Catatan kegiatan DEMO pada sesi ini":context;break;
  }
  return {facility_id:f.facility_id,label:f.facility_label,region:f.region_label,x:p.x,y:p.y,value,context,state:value===null?"UNKNOWN":value===0?"ZERO":"OBSERVED"};
 });
 return {year:scope.year,layer:scope.layer,synthetic:true,coordinate_system:"DEMO_CARTESIAN_NOT_WGS84",official_authorization:false,points,known:points.filter(p=>p.value!==null).length};
}
export function registerSummary(v){return v?.available===true&&Array.isArray(v.rows)?v.rows.length:null;}
