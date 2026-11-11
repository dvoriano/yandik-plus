/**
 * YANDIK+ M04-S9D | KODE DITULIS, BELUM DIUJI.
 * Synthetic discussion follow-up, not official meeting minutes/approval.
 * No API, database, authentication, actual staff, SOP or budget execution.
 */
import {MATRIX_SCHEMA} from "../m04-institutional-review/decision_matrix.mjs";
export const SCHEMA="M04-S9D-UNTESTED-1";
export const READINESS="BELUM_DINILAI_DAN_TIDAK_DAPAT_DIPUTUSKAN_DARI_REGISTER";
export const STATES=Object.freeze({
  draf:"Masukan contoh belum diajukan",
  menunggu_telaah:"Catatan contoh menunggu pembacaan",
  perlu_perbaikan:"Catatan contoh diminta diperbaiki",
  dicatat_sebagai_bahan:"Hanya dicatat sebagai bahan pembahasan",
  dibatalkan:"Catatan contoh dibatalkan",
});
const DEMO=/^DEMO-[A-Z0-9_-]{4,55}$/;
const END=new Set(["dicatat_sebagai_bahan","dibatalkan"]);
function obj(x,name){
  if(!x||typeof x!=="object"||Array.isArray(x))throw Error(name+" harus objek.");
  return x;
}
function text(x,name,min=35,max=900){
  if(typeof x!=="string"||x.trim().length<min||x.trim().length>max)
    throw Error(name+" perlu "+min+"–"+max+" karakter.");
  return x.trim();
}
function day(x){
  if(typeof x!=="string"||!/^20\d{2}-\d{2}-\d{2}$/.test(x))
    throw Error("Tanggal contoh harus YYYY-MM-DD.");
  const d=new Date(x+"T00:00:00Z");
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==x)
    throw Error("Tanggal tidak valid.");
  return x;
}
function actor(x,role){
  obj(x,"Pelaku");
  if(Object.keys(x).some(k=>!["role","id"].includes(k))||
     x.role!==role||!DEMO.test(x.id??""))throw Error("Identitas peran DEMO tidak sesuai.");
  return {role:x.role,id:x.id};
}
function signature(packet){
  obj(packet,"Agenda");
  if(packet.schema!==MATRIX_SCHEMA||packet.synthetic!==true||
     !Array.isArray(packet.rows)||packet.rows.length<1||packet.rows.length>40)
    throw Error("Sumber harus agenda fiktif M04-S9C.");
  const ids=new Set();
  const rows=packet.rows.map(r=>{
    if(!r||typeof r.id!=="string"||ids.has(r.id)||
      r.resolution!=="BELUM_DIPUTUSKAN_MANUSIA"||
      typeof r.subject!=="string"||r.subject.length<10)
      throw Error("Agenda sumber tidak sah/duplikat.");
    ids.add(r.id);
    return {id:r.id,subject:r.subject,priority:r.priority,resolution:r.resolution};
  });
  return JSON.stringify({schema:packet.schema,rows,
    source:packet.origin,repo:packet.repo_observation,
    integration:packet.integration_status});
}
function plan(x,subject){
  obj(x,"Catatan");
  const keys=["subject","discussion","evidence_needed","next_step","assigned_demo_id","due_date_demo"];
  if(Object.keys(x).some(k=>!keys.includes(k))||x.subject!==subject||
    !DEMO.test(x.assigned_demo_id??""))
    throw Error("Judul/kolom/penanggung jawab DEMO tidak sah.");
  return {subject,discussion:text(x.discussion,"Catatan pembahasan",45,1000),
    evidence_needed:text(x.evidence_needed,"Bukti yang perlu disiapkan",35,750),
    next_step:text(x.next_step,"Rencana tindak lanjut",45,800),
    assigned_demo_id:x.assigned_demo_id,due_date_demo:day(x.due_date_demo)};
}
function valid(book){
  obj(book,"Register");
  if(book.schema!==SCHEMA||book.synthetic!==true||
    !Array.isArray(book.entries)||book.entries.length>40)
    throw Error("Register DEMO tidak sah.");
  const ids=new Set(),refs=new Set();
  for(const item of book.entries){
    if(ids.has(item.id)||refs.has(item.agenda_id)||!DEMO.test(item.id??"")||
      !Object.hasOwn(STATES,item.status)||!Number.isSafeInteger(item.revision)||
      item.revision<1||!Array.isArray(item.history)||
      item.history.length!==item.revision)throw Error("Item/histori DEMO tidak sah.");
    ids.add(item.id);refs.add(item.agenda_id);
  }
  return book;
}
function fresh(book,packet){
  valid(book);
  if(book.source_signature!==signature(packet))
    throw Error("Agenda berubah. Tindakan ditahan sampai kaji ulang.");
}
function itemOf(book,id){
  valid(book);
  const x=book.entries.find(e=>e.id===id);
  if(!x)throw Error("Item tidak ditemukan.");
  return x;
}
function move(book,item,status,action,who,note,extra={}){
  const revision=item.revision+1;
  const updated={...item,...extra,status,revision,
    history:[...item.history,{action,revision,actor:who.id,note}]};
  return {...book,entries:book.entries.map(e=>e.id===item.id?updated:e)};
}
export function createDiscussionRegister(packet,secretariat){
  const source_signature=signature(packet);
  const author=actor(secretariat,"sekretariat_demo");
  return {schema:SCHEMA,synthetic:true,source_signature,author,entries:[]};
}
export function addDiscussion(book,packet,agendaId,data,secretariat){
  fresh(book,packet);
  const who=actor(secretariat,"sekretariat_demo");
  if(who.id!==book.author.id)throw Error("Sekretariat DEMO berbeda.");
  const agenda=packet.rows.find(x=>x.id===agendaId);
  if(!agenda||book.entries.some(e=>e.agenda_id===agendaId)||book.entries.length>=40)
    throw Error("Agenda tidak tersedia atau sudah memiliki catatan.");
  const entry={id:"DEMO-CATATAN-"+String(book.entries.length+1).padStart(3,"0"),
    agenda_id:agendaId,plan:plan(data,agenda.subject),status:"draf",
    revision:1,author:who,review:null,
    history:[{action:"buat_catatan",revision:1,actor:who.id,note:"Catatan DEMO, bukan putusan."}]};
  return {...book,entries:[...book.entries,entry]};
}
export function reviseDiscussion(book,packet,id,data,secretariat){
  fresh(book,packet);
  const item=itemOf(book,id),who=actor(secretariat,"sekretariat_demo");
  if(item.author.id!==who.id||!["draf","perlu_perbaikan"].includes(item.status))
    throw Error("Revisi hanya oleh pembuat pada draf/perbaikan.");
  const agenda=packet.rows.find(x=>x.id===item.agenda_id);
  return move(book,item,"draf","revisi",who,"Catatan contoh diperbaiki.",
    {plan:plan(data,agenda.subject),review:null});
}
export function submitDiscussion(book,packet,id,secretariat){
  fresh(book,packet);
  const item=itemOf(book,id),who=actor(secretariat,"sekretariat_demo");
  if(item.author.id!==who.id||item.status!=="draf")
    throw Error("Hanya pembuat draf dapat mengajukan.");
  return move(book,item,"menunggu_telaah","ajukan_telaah",who,
    "Diajukan untuk pembacaan DEMO, bukan keputusan resmi.");
}
export function reviewDiscussion(book,packet,id,reviewer,decision,reason){
  fresh(book,packet);
  const item=itemOf(book,id),who=actor(reviewer,"penelaah_demo");
  if(item.status!=="menunggu_telaah"||
    who.id===item.author.id||who.id===item.plan.assigned_demo_id)
    throw Error("Penelaah berbeda dari penyusun dan penanggung jawab.");
  if(!["minta_perbaikan","catat_sebagai_bahan"].includes(decision))
    throw Error("Tidak ada opsi pengesahan atau persetujuan.");
  const note=text(reason,"Alasan penelaah",50,800);
  return move(book,item,decision==="minta_perbaikan"?"perlu_perbaikan":"dicatat_sebagai_bahan",
    decision,who,note,{review:{decision,note,reviewer_demo_id:who.id,
    meaning:"HANYA BAHAN DISKUSI, BUKAN SOP SAH/IZIN INTEGRASI"}});
}
export function cancelDiscussion(book,packet,id,secretariat,reason){
  fresh(book,packet);
  const item=itemOf(book,id),who=actor(secretariat,"sekretariat_demo");
  if(who.id!==item.author.id||END.has(item.status))
    throw Error("Tidak bisa membatalkan item yang sudah ditutup.");
  return move(book,item,"dibatalkan","batalkan",who,
    text(reason,"Alasan pembatalan",45,700));
}
export function discussionSummary(book,packet,asOf="2026-11-11"){
  valid(book);
  const currentSignature=signature(packet),today=day(asOf);
  const rows=book.entries.map(x=>({...x,
    open:!END.has(x.status),stale:book.source_signature!==currentSignature,
    overdue:!END.has(x.status)&&x.plan.due_date_demo<today}));
  const unrecorded=packet.rows.filter(x=>!rows.some(r=>r.agenda_id===x.id));
  return {schema:SCHEMA,synthetic:true,as_of_demo:today,rows,
    total:rows.length,open:rows.filter(x=>x.open).length,
    overdue:rows.filter(x=>x.overdue).length,
    needs_revision:rows.filter(x=>x.status==="perlu_perbaikan").length,
    awaiting_review:rows.filter(x=>x.status==="menunggu_telaah").length,
    recorded_as_material:rows.filter(x=>x.status==="dicatat_sebagai_bahan").length,
    source_stale:book.source_signature!==currentSignature,
    agenda_total:packet.rows.length,unrecorded,
    integration_readiness:READINESS};
}
export function discussionHandoff(book,packet,asOf="2026-11-11"){
  const b=discussionSummary(book,packet,asOf);
  return [
    "DRAF CATATAN PEMBAHASAN M04-S9D | BELUM DIUJI / DEMO",
    "BUKAN RISALAH RAPAT, SOP BERLAKU ATAU HASIL KEPUTUSAN RESMI.",
    "Tanggal acuan: "+b.as_of_demo+"; agenda "+b.agenda_total+
      "; catatan "+b.total+"; belum dicatat "+b.unrecorded.length,
    "Sumber berubah: "+(b.source_stale?"YA":"tidak terdeteksi DEMO"),
    ...b.rows.map(x=>"- "+x.id+" | "+x.plan.subject+" | status "+x.status+
      " | pengampu DEMO "+x.plan.assigned_demo_id+
      " | permintaan bukti "+x.plan.evidence_needed+
      " | rencana "+x.plan.next_step+
      " | tenggat contoh "+x.plan.due_date_demo),
    "AGENDA BELUM DICATAT:",
    ...b.unrecorded.map(x=>"- "+x.id+" "+x.subject),
    "STATUS: "+b.integration_readiness,
    "Seluruh catatan hanya bahan diskusi, bukan bantuan/anggaran/pengadaan/distribusi/BAST.",
  ].join("\n");
}
