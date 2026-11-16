/**
 * M04-S11 | KODE DITULIS, BELUM DIUJI.
 * Pure synthetic package review. References are claims only.
 * No legal validation, authorization, funds, procurement, delivery or BAST.
 */
import {buildSupportPlan} from "../m04-support-package-planning/planning.mjs";
export const SCHEMA="M04-S11-PACKAGE-REVIEW-UNTESTED-1";
export const BOUNDARY="BAHAN_TELAAH_DEMO_BUKAN_PERSETUJUAN_ATAU_DANA_TERSEDIA";
export const STATUS=Object.freeze({
 draf:"Draf telaah",menunggu_telaah:"Menunggu telaah DEMO",
 perlu_perbaikan:"Dikembalikan untuk perbaikan",
 tercatat_untuk_pembahasan:"Dicatat untuk pembahasan, bukan persetujuan"
});
const CODE=/^DEMO-[A-Z0-9_-]{3,55}$/;
function exact(v,keys,label){
 if(!v||typeof v!=="object"||Array.isArray(v)||Object.keys(v).length!==keys.length||
 keys.some(k=>!Object.hasOwn(v,k)))throw Error(label+": struktur tidak sah.");
}
function text(v,min,max,label){
 if(typeof v!=="string"||v.trim().length<min||v.trim().length>max)
 throw Error(label+": panjang teks tidak sah.");
 return v.trim();
}
function code(v,label){
 if(typeof v!=="string"||!CODE.test(v))throw Error(label+": kode DEMO diperlukan.");
 return v;
}
function actor(v,role){
 exact(v,["id","role"],"Peran");
 if(v.role!==role)throw Error("Peran DEMO tidak sesuai.");
 return {id:code(v.id,"Identitas"),role};
}
function reference(v){
 if(v===null)return null;
 exact(v,["document_ref","issuer_demo_id","date_demo","metadata_ref"],"Referensi");
 const d=v.date_demo;
 if(typeof d!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(d)||
 !Number.isFinite(Date.parse(d+"T00:00:00Z"))||
 new Date(d+"T00:00:00Z").toISOString().slice(0,10)!==d)
 throw Error("Tanggal referensi DEMO tidak sah.");
 return {document_ref:code(v.document_ref,"Kode dokumen"),
 issuer_demo_id:code(v.issuer_demo_id,"Penerbit"),date_demo:d,
 metadata_ref:code(v.metadata_ref,"Metadata")};
}
function fields(v){
 exact(v,["decision_reference","budget_reference","note"],"Isi telaah");
 const a=reference(v.decision_reference),b=reference(v.budget_reference);
 if(a&&b&&a.document_ref===b.document_ref)
 throw Error("Referensi keputusan dan anggaran harus dibedakan dalam DEMO.");
 return {decision_reference:a,budget_reference:b,note:text(v.note,10,500,"Catatan")};
}
// Serialize explicit normalized fields only. Not a cryptographic proof.
function snapshot(needs,packages,id){
 const plan=buildSupportPlan(needs,packages);
 const p=plan.packages.find(x=>x.id===id);
 if(!p||!p.lines.length)throw Error("Paket sumber tidak ditemukan atau kosong.");
 const lines=p.lines.map(l=>{
  const n=plan.needs.find(x=>x.need_id===l.need_id);
  return {need_id:l.need_id,source_version:l.source_version,quantity:l.quantity,
   puskeswan_id:l.puskeswan_id,region_demo:l.region_demo,item:l.item,
   unit:l.unit,source_quantity:l.source_quantity,priority_status:n.priority_status,
   priority_band:n.priority_band,evidence_status:n.evidence_status};
 }).sort((a,b)=>a.need_id.localeCompare(b.need_id));
 return {package_id:p.id,title:p.title,purpose:p.purpose,lines};
}
const clone=v=>JSON.parse(JSON.stringify(v));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function event(action,who,note){return {action,actor:who,note};}
function make(id,creator,snap,content){
 return {schema:SCHEMA,synthetic:true,mode:"CODE_ONLY",boundary:BOUNDARY,
 id,creator,snapshot:snap,content,status:"draf",review:null,revision:1,
 history:[event("buat_draf",creator,"Catatan telaah DEMO dibuat.")],
 official_approval:false,funds_confirmed:false,authorized_to_deliver:false};
}
function guard(r){
 exact(r,["schema","synthetic","mode","boundary","id","creator","snapshot","content",
 "status","review","revision","history","official_approval","funds_confirmed",
 "authorized_to_deliver"],"Catatan telaah");
 if(r.schema!==SCHEMA||r.synthetic!==true||r.mode!=="CODE_ONLY"||r.boundary!==BOUNDARY||
 !Object.hasOwn(STATUS,r.status)||r.official_approval!==false||r.funds_confirmed!==false||
 r.authorized_to_deliver!==false||!Number.isSafeInteger(r.revision)||r.revision<1||
 !Array.isArray(r.history)||r.history.length!==r.revision)
 throw Error("Catatan mengandung status/otorisasi tidak sah.");
 code(r.id,"ID telaah");
 const maker=actor(r.creator,"penyusun_paket_demo");
 if(!equal(fields(r.content),r.content))throw Error("Metadata tidak konsisten.");
 exact(r.snapshot,["package_id","title","purpose","lines"],"Snapshot paket");
 if(!Array.isArray(r.snapshot.lines)||!r.snapshot.lines.length)
 throw Error("Snapshot tidak memiliki baris.");
 code(r.snapshot.package_id,"Paket");
 // Validate state transitions and actor separation through the event sequence.
 let state=null;
 const h=r.history;
 for(const [i,e] of h.entries()){
  exact(e,["action","actor","note"],"Histori");
  text(e.note,1,700,"Catatan histori");
  if(e.action==="buat_draf"&&i===0&&equal(actor(e.actor,"penyusun_paket_demo"),maker))
    state="draf";
  else if(e.action==="revisi"&&["draf","perlu_perbaikan"].includes(state)&&
   equal(actor(e.actor,"penyusun_paket_demo"),maker))state="draf";
  else if(e.action==="ajukan"&&state==="draf"&&
   equal(actor(e.actor,"penyusun_paket_demo"),maker))state="menunggu_telaah";
  else if(["catat_pembahasan","kembalikan"].includes(e.action)&&state==="menunggu_telaah"&&
    actor(e.actor,"penelaah_paket_demo").id!==maker.id)
   state=e.action==="catat_pembahasan"?"tercatat_untuk_pembahasan":"perlu_perbaikan";
  else throw Error("Urutan histori atau pelaku tidak sesuai.");
 }
 if(state!==r.status)throw Error("Status tidak sesuai histori.");
 const last=h.at(-1);
 if(["perlu_perbaikan","tercatat_untuk_pembahasan"].includes(state)){
  exact(r.review,["action","reviewer_demo_id","note"],"Telaah");
  if(!equal(r.review,{action:last.action,reviewer_demo_id:last.actor.id,note:last.note}))
   throw Error("Catatan telaah berbeda dari histori.");
 }else if(r.review!==null)throw Error("Telaah belum tersedia.");
 if(state==="tercatat_untuk_pembahasan"&&
 (!r.content.decision_reference||!r.content.budget_reference))
 throw Error("Kedua metadata belum tercatat.");
 return r;
}
export function isStale(r,needs,packages){
 guard(r);
 try{return !equal(r.snapshot,snapshot(needs,packages,r.snapshot.package_id));}
 catch{return true;}
}
function current(r,needs,packages){
 guard(r);
 if(isStale(r,needs,packages))throw Error("Sumber paket berubah; buat telaah baru setelah rekonsiliasi.");
}
function owner(r,who){
 const a=actor(who,"penyusun_paket_demo");
 if(a.id!==r.creator.id)throw Error("Hanya penyusun awal DEMO.");
 return a;
}
function move(r,action,who,patch,note){
 return guard({...clone(r),...patch,revision:r.revision+1,
 history:[...clone(r.history),event(action,who,note)]});
}
export function createReview(needs,packages,id,content,who){
 return guard(make(code(id,"ID telaah"),actor(who,"penyusun_paket_demo"),
 snapshot(needs,packages,content.package_id),fields(content.fields)));
}
export function reviseReview(r,needs,packages,content,who){
 current(r,needs,packages);const a=owner(r,who);
 if(!["draf","perlu_perbaikan"].includes(r.status))
 throw Error("Hanya draf atau catatan dikembalikan yang dapat direvisi.");
 return move(r,"revisi",a,{content:fields(content),status:"draf",review:null},
 "Metadata dan catatan DEMO diperbarui.");
}
export function submitReview(r,needs,packages,who){
 current(r,needs,packages);const a=owner(r,who);
 if(r.status!=="draf")throw Error("Hanya draf dapat diajukan.");
 // Incomplete metadata may be submitted for clarification, not accepted.
 return move(r,"ajukan",a,{status:"menunggu_telaah",review:null},
 "Diajukan untuk telaah metadata, bukan persetujuan.");
}
export function reviewPackage(r,needs,packages,who,action,note,ack){
 current(r,needs,packages);const a=actor(who,"penelaah_paket_demo");
 if(r.status!=="menunggu_telaah"||a.id===r.creator.id||ack!==true)
 throw Error("Telaah membutuhkan penelaah berbeda dan pengakuan batas DEMO.");
 if(!["catat_pembahasan","kembalikan"].includes(action))
 throw Error("Tidak ada tindakan persetujuan.");
 if(action==="catat_pembahasan"&&(!r.content.decision_reference||!r.content.budget_reference))
 throw Error("Metadata keputusan dan anggaran belum lengkap; kembalikan untuk perbaikan.");
 const reason=text(note,15,500,"Alasan telaah");
 return move(r,action,a,{
 status:action==="catat_pembahasan"?"tercatat_untuk_pembahasan":"perlu_perbaikan",
 review:{action,reviewer_demo_id:a.id,note:reason}},reason);
}
export function reviewSummary(r,needs,packages){
 guard(r);
 return {id:r.id,package_id:r.snapshot.package_id,title:r.snapshot.title,
 status:STATUS[r.status],stale:isStale(r,needs,packages),
 decision_metadata_present:r.content.decision_reference!==null,
 budget_metadata_present:r.content.budget_reference!==null,
 legal_validity:"BELUM DIVERIFIKASI SECARA RESMI",
 approval:false,funds_confirmed:false,authorized_to_deliver:false,
 boundary:BOUNDARY};
}
