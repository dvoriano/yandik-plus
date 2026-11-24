/** MOD-10 / M12 draft; no official archive or storage. */
import {DEMO_FACILITIES as F} from "../m05-apel-dashboard-ui/fixtures.mjs";
export const TYPES=["Laporan hasil","Berita acara","Surat pengantar","Rekap tindak lanjut"];
export const EVIDENCE=["Agenda","Daftar hadir agregat","Dokumentasi","Catatan hasil"];
export const empty=()=>({next:1,docs:[]});
function check(ok,msg){if(!ok)throw Error(msg);}
function note(v){check(typeof v==="string"&&v.trim().length>0&&v.trim().length<=300,"Catatan DEMO wajib 1–300 karakter.");return v.trim();}
function source(coaching,id){const r=coaching.records.find(x=>x.id===id);check(r,"Kegiatan sumber tidak ditemukan.");return r;}
export function stale(d,c){return c.records.find(r=>r.id===d.activity_id)?.revision!==d.source_revision;}
function snapshot(r){return {facility_id:r.facility_id,region_id:r.region_id,facility_label:F.find(f=>f.facility_id===r.facility_id).facility_label,date:r.date,topic:r.topic,type:r.type,owner:r.owner,planned:r.planned,attendance:r.attendance,result:r.result,recommendation:r.recommendation,due:r.due,completion:r.completion};}
function version(r,number){check(r.result!==null&&r.attendance!==null,"Catat hasil kegiatan dahulu.");return {number,source_revision:r.revision,snapshot:snapshot(r),template_version:"DEMO-1"};}
export function create(s,c,id,type){check(TYPES.includes(type),"Jenis draf tidak dikenal.");check(!s.docs.some(d=>d.activity_id===id&&d.type===type),"Draf jenis ini sudah ada; gunakan versi baru.");const r=source(c,id),v=version(r,1);const d={id:"DEMO-DOC-"+s.next,activity_id:id,type,source_revision:r.revision,status:"DRAFT",revision:1,versions:[v],evidence:[],history:[{revision:1,action:"create"}]};return {next:s.next+1,docs:[...s.docs,d]};}
export function action(s,c,id,expected,act,p={}){const d=s.docs.find(x=>x.id===id);check(d&&d.revision===expected,"Dokumen atau revisi tidak cocok.");let delta;
if(act==="refresh"){check(stale(d,c)||d.status==="CORRECTION","Versi baru hanya untuk perubahan sumber atau koreksi.");check(d.status!=="ARCHIVED_DEMO","Arsip DEMO terkunci; buka revisi dahulu.");const r=source(c,d.activity_id),v=version(r,d.versions.length+1);delta={source_revision:r.revision,versions:[...d.versions,v],status:"DRAFT",evidence:[]};}
else if(act==="reopen"&&d.status==="ARCHIVED_DEMO"){delta={status:"CORRECTION"};}
else {check(!stale(d,c),"Sumber berubah; buat versi baru dahulu.");if(act==="evidence"&&["DRAFT","CORRECTION"].includes(d.status)){check(EVIDENCE.includes(p.kind)&&/^DEMO-[A-Z0-9-]{1,40}$/.test(p.ref),"Pilih jenis dan kode bukti fiktif DEMO.");check(!d.evidence.some(e=>e.kind===p.kind||e.ref===p.ref),"Metadata bukti duplikat.");delta={evidence:[...d.evidence,{kind:p.kind,ref:p.ref}]};}
else if(act==="submit"&&["DRAFT","CORRECTION"].includes(d.status)){check(EVIDENCE.every(k=>d.evidence.some(e=>e.kind===k)),"Lengkapi empat metadata bukti.");delta={status:"REVIEW"};}
else if(act==="return"&&d.status==="REVIEW"){delta={status:"CORRECTION"};note(p.note);}
else if(act==="archive"&&d.status==="REVIEW"){check(["FOLLOWUP_OPEN","CLOSED_DEMO"].includes(source(c,d.activity_id).status),"Hasil pembinaan belum ditelaah DEMO.");delta={status:"ARCHIVED_DEMO"};note(p.note);}
else throw Error("Tindakan tidak tersedia.");}
const revision=d.revision+1;return {...s,docs:s.docs.map(x=>x.id===id?{...d,...delta,revision,history:[...d.history,{revision,action:act,previous_status:d.status,previous_evidence:d.evidence.map(e=>({...e})),note:p.note?note(p.note):null}]}:x)};}
export function draftText(d,n=d.versions.length){const v=d.versions.find(x=>x.number===n);check(v,"Versi tidak ditemukan.");const r=v.snapshot;return ["DRAF DEMO - BUKAN DOKUMEN RESMI",d.type.toUpperCase(),d.id+" | versi "+v.number+" | sumber "+d.activity_id+" revisi "+v.source_revision,"Puskeswan: "+r.facility_label,"Tanggal: "+r.date,"Kegiatan: "+r.type+" / "+r.topic,"Penanggung jawab: "+r.owner,"Rencana peserta: "+r.planned,"Kehadiran tercatat: "+r.attendance,"Hasil: "+r.result,"Rekomendasi: "+r.recommendation,"Tenggat: "+r.due,"Tindak lanjut: "+(r.completion??"Belum ditutup"),"Naskah kerja untuk ditelaah. Tanpa nomor surat resmi, tanda tangan, pengesahan atau pengiriman."].join("\n");}
export function search(s,{year,region_id,facility_id,q=""}){const term=q.trim().toLowerCase();return s.docs.filter(d=>{const r=d.versions.at(-1).snapshot;return +r.date.slice(0,4)===year&&(region_id==="ALL"||r.region_id===region_id)&&(facility_id==="ALL"||r.facility_id===facility_id)&&(!term||[d.id,d.activity_id,d.type,r.topic,r.facility_label].join(" ").toLowerCase().includes(term));});}
