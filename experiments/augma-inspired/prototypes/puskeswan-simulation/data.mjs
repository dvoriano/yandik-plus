// YANDIK+ Innovation Lab: all values below are SYNTHETIC, never production.
import { REGIONS } from "../geo-command-center/regions.mjs";
export const YEAR = 2026;
export const MONTHS = Object.freeze(["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]);
export const UNITS = Object.freeze(REGIONS.map((r,i)=>Object.freeze({
  id:"DEMO-"+String(i+1).padStart(2,"0"),code:r.code,name:r.name,
  type:r.type,seat:r.seat,source:"SYNTHETIC"
})));
const make = (unit, index, month) => {
  const missing = (index*5+month*7+3)%13===0 || (month===9 && index%9===0);
  if(missing) return Object.freeze({code:unit.code,month,status:"missing",reported:false,
    submittedDay:null,services:null,onTime:null,source:"SYNTHETIC"});
  const services = (index*7+month*11)%23===0 ? 0 :
    45+((index+11)*(month+7)*17)%620;
  const submittedDay = 2+(index*3+month*5)%13;
  return Object.freeze({code:unit.code,month,reported:true,
    status:submittedDay<=9?"on_time":"late",submittedDay,services,
    onTime:submittedDay<=9,source:"SYNTHETIC"});
};
export const RECORDS = Object.freeze(MONTHS.flatMap((_,m)=>UNITS.map((u,i)=>make(u,i,m))));
const idx = new Map(RECORDS.map(r=>[r.code+"/"+r.month,r]));
export function recordFor(code,month) {
  return Number.isInteger(month)&&month>=0&&month<12 ? idx.get(code+"/"+month)??null : null;
}
export function rowsFor(month,codes=UNITS.map(u=>u.code)) {
  if(!Number.isInteger(month)||month<0||month>11) throw Error("Bulan demo tidak valid");
  return codes.map(code=>recordFor(code,month)).filter(Boolean);
}
export function summarize(month,codes) {
  const rows=rowsFor(month,codes),reported=rows.filter(r=>r.reported);
  const services=reported.reduce((sum,r)=>sum+r.services,0);
  return Object.freeze({
    units:rows.length,reported:reported.length,missing:rows.length-reported.length,
    onTime:reported.filter(r=>r.onTime).length,
    late:reported.filter(r=>!r.onTime).length,
    zeroReports:reported.filter(r=>r.services===0).length,
    services,rate:rows.length?reported.length/rows.length*100:null,
    average:reported.length?services/reported.length:null
  });
}
export function visibleUnits({month=9,search="",kind="all",status="all"}={}) {
  const q=String(search).trim().toLowerCase();
  return UNITS.filter(u=>{
    const match=u.name.toLowerCase().includes(q)||u.seat.toLowerCase().includes(q)||u.code.includes(q);
    return match&&(kind==="all"||kind===u.type)&&
      (status==="all"||recordFor(u.code,month)?.status===status);
  });
}
export function monthlyTrend(codes) {
  return Object.freeze(MONTHS.map((label,month)=>Object.freeze({label,month,...summarize(month,codes)})));
}
export function pending(month,codes) {return rowsFor(month,codes).filter(r=>!r.reported);}
export function ranked(month,codes) {
  return rowsFor(month,codes).filter(r=>r.reported)
    .sort((a,b)=>b.services-a.services||a.code.localeCompare(b.code));
}
export function csvFor(month,codes) {
  const cell=value=>'"'+String(value).replace(/^[\s]*[=+\-@]/,match=>"'"+match).replace(/"/g,'""')+'"';
  const header=["Periode","Kode wilayah","Unit Fiktif","Status","Tanggal Lapor Demo","Layanan Demo","Label Sumber"];
  const rows=rowsFor(month,codes).map(r=>[
    MONTHS[month]+" "+YEAR,r.code,"DEMO-"+r.code,r.status,
    r.submittedDay===null?"BELUM LAPOR":r.submittedDay,
    r.services===null?"TIDAK TERSEDIA":r.services,"SYNTHETIC / NOT OFFICIAL"
  ]);
  return "\uFEFF"+[header,...rows].map(row=>row.map(cell).join(",")).join("\r\n")+"\r\n";
}
export function validateDataset() {
  return UNITS.length===19 && RECORDS.length===228 &&
    new Set(UNITS.map(u=>u.code)).size===19 &&
    RECORDS.every(r=>r.source==="SYNTHETIC"&&
      (r.reported ? Number.isInteger(r.services)&&r.services>=0 &&
       r.onTime===(r.submittedDay<=9) :
       r.services===null&&r.submittedDay===null&&r.onTime===null));
}
