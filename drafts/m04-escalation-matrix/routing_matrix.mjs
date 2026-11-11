/**
 * M04-S6 | KODE DITULIS, BELUM DIUJI.
 * Proposes a DEMO routing matrix for M04-S5 administrative escalation tickets.
 * A recorded route is NOT a dispatch, work order, official disposition,
 * legal document verification, funding approval, procurement, or BAST.
 * No I/O, network, real role validation, or persistent audit.
 */
import { CATEGORIES, URGENCY, ESCALATION_SCHEMA, escalationList } from "../m04-admin-escalations/escalations.mjs";

export const MATRIX_VERSION = "M04-S6-UNTESTED-1";
export const ROUTE_NOTE_SCHEMA = "M04-S6-ROUTE-NOTE-UNTESTED-1";
export const UNIT_LABELS = Object.freeze({
  arsip_demo: "Pengelola administrasi/arsip (DEMO)",
  pengampu_teknis_demo: "Pengampu substansi teknis (DEMO)",
  koordinator_demo: "Koordinasi lintas petugas/unit (DEMO)",
  penelaah_prosedur_demo: "Penelaah prosedur administratif (DEMO)",
});
export const DEMO_DESTINATIONS = Object.freeze({
  arsip_demo: "DEMO-UNIT-ARSIP-01",
  pengampu_teknis_demo: "DEMO-UNIT-TEKNIS-01",
  koordinator_demo: "DEMO-UNIT-KOORDINASI-01",
  penelaah_prosedur_demo: "DEMO-UNIT-PROSEDUR-01",
});
export const ROUTING_STATUSES = Object.freeze({
  draf: "Draf pilihan alur",
  menunggu_telaah: "Menunggu telaah alasan DEMO",
  dicatat_untuk_pembahasan: "Pilihan alur dicatat untuk pembahasan, bukan disposisi",
  perlu_perbaikan: "Alasan atau rujukan perlu diperbaiki",
  tidak_direkomendasikan: "Pilihan alur tidak direkomendasikan",
});
export const BASE_ROUTES = Object.freeze({
  kelengkapan_bukti: {unit:"arsip_demo",why:"Periksa kelengkapan dan konsistensi metadata dokumen contoh"},
  klarifikasi_penerbit: {unit:"arsip_demo",why:"Siapkan daftar konfirmasi metadata kepada pemilik arsip atau penerbit melalui prosedur sah"},
  kesesuaian_kebutuhan: {unit:"pengampu_teknis_demo",why:"Siapkan telaah kesesuaian kebutuhan dan informasi teknis"},
  koordinasi_petugas: {unit:"koordinator_demo",why:"Jelaskan pembagian penanggung jawab dan lintas tugas"},
  hambatan_administrasi: {unit:"penelaah_prosedur_demo",why:"Siapkan telaah prosedur dan hambatan administrasi"},
});
const ID=/^DEMO-[A-Z0-9_-]{4,55}$/;
const FORBIDDEN=["approved","approval","budget","amount","allocation","procurement",
  "recipient_selected","payment","delivery","shipment","bast","official_decision",
  "authorized","authentic","official_disposition","legal_valid","sk_issued"];
function obj(value,name){
  if(!value||typeof value!=="object"||Array.isArray(value))
    throw Error(name+" harus berupa objek.");
  if(FORBIDDEN.some(key=>Object.hasOwn(value,key)))
    throw Error("Tidak boleh memuat persetujuan, keuangan, keputusan atau BAST.");
  return value;
}
function only(value,keys,name){
  for(const key of Object.keys(obj(value,name)))
    if(!keys.includes(key))throw Error(name+" memiliki atribut yang tidak diizinkan: "+key);
}
function words(value,label,min,max){
  if(typeof value!=="string"||value.trim().length<min||value.trim().length>max)
    throw Error(label+" harus "+min+" sampai "+max+" karakter.");
  return value.trim();
}
function person(input,expectedRole){
  only(input,["role","id"],"Pelaku DEMO");
  if(input.role!==expectedRole||typeof input.id!=="string"||!ID.test(input.id))
    throw Error("Identitas peran hanya DEMO dan harus sesuai tahap ini.");
  return {role:input.role,id:input.id};
}
function source(book,tasks,register,dossier,ticketId){
  if(!book||book.schema!==ESCALATION_SCHEMA||book.synthetic!==true||!Array.isArray(book.tickets))
    throw Error("Hanya register kendala M04-S5 fiktif yang dapat dibaca.");
  const ticket=book.tickets.find(t=>t.id===ticketId);
  const row=escalationList(book,tasks,register,dossier).find(r=>r.id===ticketId);
  if(!ticket||!row||row.source_stale||ticket.synthetic!==true||
     !["dilaporkan","diteruskan","ditanggapi","perlu_klarifikasi"].includes(ticket.state)||
     !Object.hasOwn(CATEGORIES,ticket.details?.category)||
     !Object.hasOwn(URGENCY,ticket.details?.urgency))
    throw Error("Sumber kendala DEMO belum dilaporkan, tidak sesuai, sudah ditutup atau sudah berubah.");
  return {
    ticket_id:ticket.id,revision:ticket.revision,
    state:ticket.state,task_id:ticket.source.task_id,
    category:ticket.details.category,urgency:ticket.details.urgency,
    signature_demo:JSON.stringify({
      id:ticket.id,revision:ticket.revision,state:ticket.state,
      source:ticket.source,details:ticket.details,history:ticket.history,
    }),
    meaning:"Snapshot teks informatif DEMO, bukan bukti integritas elektronik.",
  };
}
function suggested(category,urgency){
  if(!Object.hasOwn(BASE_ROUTES,category)||!Object.hasOwn(URGENCY,urgency))
    throw Error("Kategori atau urgensi tidak didukung oleh matriks DEMO.");
  const base=BASE_ROUTES[category];
  const urgent=urgency==="mendesak_kajian";
  return {
    base_unit:base.unit,unit:urgent?"koordinator_demo":base.unit,
    requires_substantive_input:urgent,
    reason:urgent?
      "Urgensi kajian tinggi: minta koordinator DEMO mengkaji penerusan, tanpa prioritas keputusan bantuan."
      :base.why,
  };
}
function snapshotMatches(note,book,tasks,register,dossier){
  try{return JSON.stringify(source(book,tasks,register,dossier,note.source.ticket_id))===
    JSON.stringify(note.source);}
  catch{return false;}
}
function event(action,who,revision,note){
  return {action,revision,role:who.role,actor_demo_id:who.id,note};
}
function noteRecord(note){
  obj(note,"Catatan matriks");
  if(note.schema!==ROUTE_NOTE_SCHEMA||note.synthetic!==true||
    !note.source||!ID.test(note.source.ticket_id??"")||
    !Object.hasOwn(ROUTING_STATUSES,note.status)||
    !Number.isSafeInteger(note.revision)||note.revision<1||
    !Array.isArray(note.history)||note.history.length!==note.revision||
    !note.prepared_by||!ID.test(note.prepared_by.id??"")||
    !Object.hasOwn(UNIT_LABELS,note.chosen_unit)||
    note.chosen_recipient_id!==DEMO_DESTINATIONS[note.chosen_unit]||
    !note.suggestion||!Object.hasOwn(UNIT_LABELS,note.suggestion.unit))
    throw Error("Struktur catatan pilihan alur DEMO tidak sah.");
  return note;
}
export function routingMatrixView(){
  const rows=[];
  for(const [category,categoryLabel] of Object.entries(CATEGORIES)){
    for(const [urgency,urgencyLabel] of Object.entries(URGENCY)){
      const result=suggested(category,urgency);
      rows.push({
        category,category_label:categoryLabel,urgency,urgency_label:urgencyLabel,
        suggested_unit:result.unit,suggested_label:UNIT_LABELS[result.unit],
        suggested_recipient_demo_id:DEMO_DESTINATIONS[result.unit],
        reason:result.reason,requires_human_review:true,
      });
    }
  }
  return {schema:MATRIX_VERSION,synthetic:true,rows,
    note:"Usulan arah pembahasan administratif, bukan disposisi atau keputusan pejabat."};
}
export function suggestEscalationRoute(book,tasks,register,dossier,ticketId){
  const s=source(book,tasks,register,dossier,ticketId);
  const r=suggested(s.category,s.urgency);
  return {
    schema:MATRIX_VERSION,ticket_id:s.ticket_id,source_revision:s.revision,
    category:s.category,urgency:s.urgency,
    suggested_unit:r.unit,suggested_unit_label:UNIT_LABELS[r.unit],
    suggested_recipient_demo_id:DEMO_DESTINATIONS[r.unit],
    suggestion_reason:r.reason,needs_human_review:true,
    status:"SARAN_DEMO_BELUM_DIPILIH",
  };
}
export function prepareRoutingNote(book,tasks,register,dossier,ticketId,input,coordinator){
  const who=person(coordinator,"koordinator_matriks_demo");
  const s=source(book,tasks,register,dossier,ticketId);
  only(input,["chosen_unit","reason","source_note"],"Pilihan alur");
  if(!Object.hasOwn(UNIT_LABELS,input.chosen_unit))
    throw Error("Unit tujuan bukan opsi DEMO yang terdaftar.");
  const recommendation=suggested(s.category,s.urgency);
  const override=input.chosen_unit!==recommendation.unit;
  const reason=words(input.reason,override?"Alasan perubahan usulan":"Pertimbangan koordinasi",
    override?60:40,700);
  const sourceNote=words(input.source_note,"Catatan sumber/keterbatasan",35,550);
  const suggestion={
    unit:recommendation.unit,reason:recommendation.reason,
    recipient_demo_id:DEMO_DESTINATIONS[recommendation.unit],
  };
  return {
    schema:ROUTE_NOTE_SCHEMA,synthetic:true,id:"DEMO-MATRIX-NOTE-001",
    source:s,suggestion,chosen_unit:input.chosen_unit,
    chosen_recipient_id:DEMO_DESTINATIONS[input.chosen_unit],
    override,reason,source_note:sourceNote,
    status:"draf",revision:1,prepared_by:who,review:null,
    history:[event("buat_draf",who,1,override?
      "Alternatif alur dicatat dengan alasan; BELUM diteruskan.":
      "Usulan alur dicatat dengan alasan; BELUM diteruskan.")],
  };
}
export function submitRoutingNote(note,book,tasks,register,dossier,coordinator){
  const n=noteRecord(note),who=person(coordinator,"koordinator_matriks_demo");
  if(who.id!==n.prepared_by.id||n.status!=="draf")
    throw Error("Hanya penyusun dan status draf dapat mengajukan tinjauan.");
  if(!snapshotMatches(n,book,tasks,register,dossier))
    throw Error("Sumber kendala berubah; buat analisis baru dan jangan teruskan.");
  const revision=n.revision+1;
  return {...n,status:"menunggu_telaah",revision,
    history:[...n.history,event("ajukan_telaah",who,revision,
      "Catatan pilihan alur DEMO diajukan untuk kajian, bukan pengiriman kepada penerima.")],
  };
}
export function reviewRoutingNote(note,book,tasks,register,dossier,reviewer,decision,reason){
  const n=noteRecord(note),who=person(reviewer,"penelaah_matriks_demo");
  if(n.status!=="menunggu_telaah"||who.id===n.prepared_by.id)
    throw Error("Kajian hanya oleh penelaah DEMO terpisah pada status menunggu.");
  if(!["catat_untuk_pembahasan","minta_perbaikan","tidak_direkomendasikan"].includes(decision))
    throw Error("Tidak ada opsi menyetujui/menetapkan penerusan resmi.");
  if(!snapshotMatches(n,book,tasks,register,dossier))
    throw Error("Sumber kendala berubah; kajian harus dihentikan.");
  const explanation=words(reason,"Pertimbangan penelaah DEMO",45,750);
  const status=decision==="minta_perbaikan"?"perlu_perbaikan":
    decision==="catat_untuk_pembahasan"?"dicatat_untuk_pembahasan":"tidak_direkomendasikan";
  const revision=n.revision+1;
  return {...n,status,revision,review:{
      decision,reason:explanation,reviewer_demo_id:who.id,
      meaning:"TELAAH ALUR DEMO; BUKAN DISPOSISI, OTORISASI, ATAU PEMBERIAN BANTUAN",
    },
    history:[...n.history,event(decision,who,revision,explanation)]};
}
export function reviseRoutingNote(note,book,tasks,register,dossier,input,coordinator){
  const n=noteRecord(note),who=person(coordinator,"koordinator_matriks_demo");
  if(n.status!=="perlu_perbaikan"||who.id!==n.prepared_by.id)
    throw Error("Hanya penyusun dapat merevisi catatan yang dikembalikan.");
  if(!snapshotMatches(n,book,tasks,register,dossier))
    throw Error("Sumber berubah, buat catatan baru setelah telaah.");
  const refreshed=prepareRoutingNote(book,tasks,register,dossier,
    n.source.ticket_id,input,coordinator);
  const revision=n.revision+1;
  return {...n,...refreshed,id:n.id,status:"draf",revision,review:null,
    history:[...n.history,event("revisi_alur",who,revision,
      "Alur/pertimbangan diperbaiki; hasil penelaahan lama tetap tercatat pada histori.")],
  };
}
export function routingNoteText(note,book,tasks,register,dossier){
  const n=noteRecord(note);
  const stale=!snapshotMatches(n,book,tasks,register,dossier);
  return [
    "DRAF MATRIKS PENERUSAN KENDALA ADMINISTRATIF (KODE BELUM DIUJI)",
    "BUKAN DISPOSISI RESMI ATAU KEPUTUSAN BANTUAN, ANGGARAN, PENGADAAN, BAST.",
    "Kendala DEMO: "+n.source.ticket_id+" / tugas "+n.source.task_id+
      " / versi "+n.source.revision+"; status catatan: "+ROUTING_STATUSES[n.status],
    "Sumber: "+(stale?"BERUBAH; HENTIKAN PENGGUNAAN":"Tidak berubah dalam simulasi"),
    "Kategori: "+CATEGORIES[n.source.category]+"; urgensi: "+URGENCY[n.source.urgency],
    "Rute awal: "+UNIT_LABELS[n.suggestion.unit]+" / "+n.suggestion.recipient_demo_id,
    "Alasan rute awal: "+n.suggestion.reason,
    "Pilihan untuk dibahas: "+UNIT_LABELS[n.chosen_unit]+" / "+n.chosen_recipient_id,
    "Mengubah rute rekomendasi: "+(n.override?"YA, perlu pertimbangan tertulis":"TIDAK"),
    "Pertimbangan koordinator DEMO: "+n.reason,
    "Keterbatasan sumber: "+n.source_note,
    "Catatan penelaah: "+(n.review?.reason??"BELUM ADA"),
    "Histori:",
    ...n.history.map(h=>"- v"+h.revision+" "+h.action+" ("+h.actor_demo_id+"): "+h.note),
    "Pilihan ini belum dikirim ke M04-S5, belum menyurati penerima, bukan disposisi sah.",
    "Tidak mengubah tugas, referensi, status bantuan atau anggaran.",
  ].join("\n");
}
