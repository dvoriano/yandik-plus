/**
 * M04-S5 | KODE DITULIS, BELUM DIUJI.
 * Administrative obstacles/escalations linked to M04-S3 DEMO tasks.
 * NO official decisions, fund approvals, allocations, purchases, shipments,
 * document authentication, notification, signatures or BAST.
 * Roles and source references are only DEMO labels, not access control.
 */
import { FOLLOWUP_SCHEMA, followupListView } from "../m04-admin-followup/followup.mjs";

export const ESCALATION_SCHEMA="M04-S5-DRAFT-UNTESTED-1";
export const CATEGORIES=Object.freeze({
  kelengkapan_bukti:"Kelengkapan atau perbedaan metadata bukti",
  klarifikasi_penerbit:"Informasi penerbit dokumen perlu diklarifikasi",
  kesesuaian_kebutuhan:"Kaitan dengan kebutuhan fasilitas belum jelas",
  koordinasi_petugas:"Koordinasi atau pembagian tugas belum jelas",
  hambatan_administrasi:"Hambatan administrasi lainnya",
});
export const URGENCY=Object.freeze({
  biasa:"Perlu tindak lanjut administratif",
  perlu_perhatian:"Perlu perhatian koordinator",
  mendesak_kajian:"Perlu dibahas lebih awal (bukan persetujuan)",
});
export const STATES=Object.freeze({
  draf:"Draf kendala",
  dilaporkan:"Dilaporkan untuk koordinasi DEMO",
  diteruskan:"Diteruskan ke penerima DEMO",
  ditanggapi:"Tanggapan administratif dicatat",
  perlu_klarifikasi:"Catatan dikembalikan untuk klarifikasi",
  ditutup_administratif:"Eskalasi administratif ditutup, bukan masalah substantif selesai",
  dibatalkan:"Catatan eskalasi dibatalkan",
});
const ID=/^DEMO-[A-Z0-9_-]{4,55}$/;
const FINISHED=new Set(["ditutup_administratif","dibatalkan"]);
const BLOCKED=["approval","approved","allocation","amount","nominal","budget",
  "beneficiary","recipient_selected","payment","procurement","shipment","delivery",
  "bast","sk_issued","authorized_approval","document_valid","authentic",
  "official_decision","verified_official"];
function obj(x,label){
  if(!x||typeof x!=="object"||Array.isArray(x))throw Error(label+" harus berupa objek.");
  if(BLOCKED.some(k=>Object.hasOwn(x,k)))throw Error("Tidak boleh merekam keputusan atau atribut bantuan resmi.");
  return x;
}
function only(x,keys,label){
  for(const key of Object.keys(obj(x,label)))if(!keys.includes(key))
    throw Error(label+" berisi kolom di luar rancangan: "+key);
}
function words(value,label,min,max){
  if(typeof value!=="string"||value.trim().length<min||value.trim().length>max)
    throw Error(label+" perlu "+min+" sampai "+max+" karakter.");
  return value.trim();
}
function actor(x,role){
  only(x,["role","id"],"Pelaku DEMO");
  if(x.role!==role||typeof x.id!=="string"||!ID.test(x.id))
    throw Error("Hanya identitas peran DEMO yang sesuai dapat melakukan langkah ini.");
  return {role:x.role,id:x.id};
}
function dateDemo(value){
  if(typeof value!=="string"||!/^20\d{2}-\d{2}-\d{2}$/.test(value))
    throw Error("Tanggal rencana DEMO harus YYYY-MM-DD.");
  const date=new Date(value+"T00:00:00Z");
  if(Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==value)
    throw Error("Tanggal rencana DEMO tidak sah.");
  return value;
}
function details(input){
  only(input,["category","urgency","description","effect_on_work","attempted_steps",
    "needed_action","evidence_ref_demo"],"Kendala");
  if(!Object.hasOwn(CATEGORIES,input.category)||!Object.hasOwn(URGENCY,input.urgency))
    throw Error("Kategori kendala atau urgensi tidak dikenal.");
  if(typeof input.evidence_ref_demo!=="string"||!ID.test(input.evidence_ref_demo))
    throw Error("Referensi bukti contoh wajib kode DEMO-.");
  return {
    category:input.category,urgency:input.urgency,
    description:words(input.description,"Uraian kendala",40,600),
    effect_on_work:words(input.effect_on_work,"Dampak pada pekerjaan",30,500),
    attempted_steps:words(input.attempted_steps,"Upaya yang sudah dicatat",30,500),
    needed_action:words(input.needed_action,"Bantuan koordinasi yang diperlukan",30,500),
    evidence_ref_demo:input.evidence_ref_demo,
  };
}
function taskSnapshot(tasks,register,dossier,taskId){
  if(!tasks||tasks.schema!==FOLLOWUP_SCHEMA||tasks.synthetic!==true)
    throw Error("Harus menggunakan sumber tugas M04-S3 fiktif.");
  const rows=followupListView(tasks,register,dossier);
  const view=rows.find(r=>r.id===taskId);
  const task=tasks.tasks.find(t=>t.id===taskId);
  if(!view||!task||task.synthetic!==true||view.source_stale||
     FINISHED.has(task.state)||!ID.test(task.id??"")||
     !ID.test(task.plan?.assignee_demo_id??""))
    throw Error("Tugas sumber belum tersedia, ditutup, atau sumber berubah.");
  return {
    task_id:task.id,task_revision:task.revision,task_state:task.state,
    assignee_demo_id:task.plan.assignee_demo_id,
    reference_id:task.source.reference_id,
    dossier_id:task.source.dossier_id,
    signature_demo:JSON.stringify({
      task_id:task.id,task_revision:task.revision,task_state:task.state,
      source:task.source,plan:task.plan,completion:task.completion,review:task.review,
    }),
    note:"Checksum teks informatif, bukan bukti integritas digital.",
  };
}
function sourceCurrent(ticket,tasks,register,dossier){
  try{return JSON.stringify(taskSnapshot(tasks,register,dossier,ticket.source.task_id))===
    JSON.stringify(ticket.source);
  }catch{return false;}
}
function stamp(action,by,revision,note){
  return {action,actor_demo_id:by.id,actor_demo_role:by.role,revision,note};
}
function store(book){
  obj(book,"Buku eskalasi");
  if(book.schema!==ESCALATION_SCHEMA||book.synthetic!==true||
     !Array.isArray(book.tickets)||book.tickets.length>25)
    throw Error("Buku eskalasi DEMO tidak dikenal.");
  const ids=new Set();
  for(const ticket of book.tickets){
    obj(ticket,"Catatan kendala");
    if(!ID.test(ticket.id??"")||ids.has(ticket.id)||ticket.synthetic!==true||
      !Object.hasOwn(STATES,ticket.state)||!Number.isSafeInteger(ticket.revision)||
      ticket.revision<1||!Array.isArray(ticket.history)||
      ticket.history.length!==ticket.revision||
      !ticket.source||!ID.test(ticket.source.task_id??"")||
      !ticket.reporter||!ID.test(ticket.reporter.id??"")||
      JSON.stringify(details(ticket.details))!==JSON.stringify(ticket.details))
      throw Error("Struktur, ID, atau histori catatan kendala tidak konsisten.");
    ids.add(ticket.id);
  }
  return book;
}
function find(book,id){
  store(book);
  const ticket=book.tickets.find(t=>t.id===id);
  if(!ticket)throw Error("Kendala DEMO tidak ditemukan.");
  return ticket;
}
function put(book,ticket){return {...book,tickets:book.tickets.map(t=>t.id===ticket.id?ticket:t)};}
function move(book,ticket,state,action,who,note,additional={}){
  const revision=ticket.revision+1;
  return put(book,{...ticket,...additional,state,revision,
    history:[...ticket.history,stamp(action,who,revision,note)]});
}
function requireFresh(ticket,tasks,register,dossier){
  if(!sourceCurrent(ticket,tasks,register,dossier))
    throw Error("Tugas/referensi sumber berubah; tunda eskalasi dan periksa ulang.");
}
export function createEscalationBook(){return {schema:ESCALATION_SCHEMA,synthetic:true,tickets:[]};}
export function openEscalation(book,tasks,register,dossier,taskId,input,reporter){
  store(book);if(book.tickets.length>=25)throw Error("Maksimum 25 kendala contoh.");
  const source=taskSnapshot(tasks,register,dossier,taskId);
  const who=actor(reporter,"petugas_tindak_lanjut_demo");
  if(who.id!==source.assignee_demo_id)
    throw Error("Pencatat harus petugas DEMO yang ditugaskan pada tugas sumber.");
  const data=details(input);
  if(book.tickets.some(t=>t.source.task_id===taskId&&t.details.category===data.category&&
    !FINISHED.has(t.state)))
    throw Error("Kendala sejenis pada tugas yang sama masih aktif.");
  const id="DEMO-ESK-"+String(book.tickets.length+1).padStart(3,"0");
  return {...book,tickets:[...book.tickets,{
    id,synthetic:true,source,details:data,state:"draf",revision:1,
    reporter:who,coordinator:null,routing:null,response:null,review:null,
    history:[stamp("buat_draf",who,1,"Kendala administratif DEMO dicatat, bukan persetujuan bantuan.")],
  }]};
}
export function reviseEscalation(book,id,tasks,register,dossier,input,reporter){
  const ticket=find(book,id),who=actor(reporter,"petugas_tindak_lanjut_demo");
  if(ticket.state!=="draf"||ticket.reporter.id!==who.id)
    throw Error("Hanya pelapor dapat memperbaiki draf kendala.");
  requireFresh(ticket,tasks,register,dossier);
  const data=details(input);
  if(book.tickets.some(t=>t.id!==id&&t.source.task_id===ticket.source.task_id&&
    t.details.category===data.category&&!FINISHED.has(t.state)))
    throw Error("Kendala sejenis masih aktif pada tugas yang sama.");
  return move(book,ticket,"draf","revisi_kendala",who,
    "Rincian draf diperbaiki; catatan lama tetap pada histori.",{details:data});
}
export function reportEscalation(book,id,tasks,register,dossier,reporter){
  const ticket=find(book,id),who=actor(reporter,"petugas_tindak_lanjut_demo");
  if(ticket.reporter.id!==who.id||ticket.state!=="draf")
    throw Error("Hanya pelapor dapat mengirim draf eskalasi.");
  requireFresh(ticket,tasks,register,dossier);
  return move(book,ticket,"dilaporkan","laporkan",who,
    "Kendala diteruskan sebagai antrean koordinasi DEMO, bukan perintah dinas.");
}
export function routeEscalation(book,id,tasks,register,dossier,input,coordinator){
  const ticket=find(book,id),who=actor(coordinator,"koordinator_eskalasi_demo");
  if(ticket.state!=="dilaporkan"||who.id===ticket.reporter.id)
    throw Error("Penerusan hanya oleh koordinator DEMO yang berbeda dari pelapor.");
  requireFresh(ticket,tasks,register,dossier);
  only(input,["recipient_demo_id","due_date_demo","instruction"],"Penerusan");
  if(typeof input.recipient_demo_id!=="string"||!ID.test(input.recipient_demo_id)||
    [ticket.reporter.id,who.id].includes(input.recipient_demo_id))
    throw Error("Penerima harus identitas DEMO lain yang berbeda dari pelapor dan koordinator.");
  const routing={recipient_demo_id:input.recipient_demo_id,
    due_date_demo:dateDemo(input.due_date_demo),
    instruction:words(input.instruction,"Arahan koordinasi contoh",35,500)};
  return move(book,ticket,"diteruskan","teruskan",who,
    "Diteruskan kepada "+routing.recipient_demo_id+" untuk tanggapan administratif DEMO.",
    {coordinator:who,routing,response:null,review:null});
}
export function respondEscalation(book,id,tasks,register,dossier,input,responder){
  const ticket=find(book,id),who=actor(responder,"penerima_eskalasi_demo");
  if(ticket.state!=="diteruskan"&&ticket.state!=="perlu_klarifikasi")
    throw Error("Tanggapan hanya dapat dicatat pada kendala yang diteruskan/diklarifikasi.");
  if(!ticket.routing||ticket.routing.recipient_demo_id!==who.id)
    throw Error("Hanya penerima DEMO yang dicatat berhak menanggapi.");
  requireFresh(ticket,tasks,register,dossier);
  only(input,["response","remaining_blocker","evidence_ref_demo"],"Tanggapan");
  if(typeof input.evidence_ref_demo!=="string"||!ID.test(input.evidence_ref_demo))
    throw Error("Kode hasil tanggapan harus DEMO-.");
  const response={response:words(input.response,"Tanggapan administratif",50,800),
    remaining_blocker:words(input.remaining_blocker,"Batas yang masih perlu ditelaah",30,500),
    evidence_ref_demo:input.evidence_ref_demo,
    responder_demo_id:who.id};
  return move(book,ticket,"ditanggapi","beri_tanggapan",who,
    "Tanggapan koordinasi dicatat; belum ada konfirmasi surat atau keputusan resmi.",
    {response,review:null});
}
export function reviewEscalation(book,id,tasks,register,dossier,action,reason,examiner){
  const ticket=find(book,id),who=actor(examiner,"penelaah_eskalasi_demo");
  if(ticket.state!=="ditanggapi"||!ticket.routing||!ticket.response||
    [ticket.reporter.id,ticket.coordinator?.id,ticket.routing.recipient_demo_id].includes(who.id))
    throw Error("Catatan ditelaah oleh pelaku DEMO lain yang tidak terlibat menulis/meneruskan.");
  if(!["minta_klarifikasi","tutup_catatan"].includes(action))
    throw Error("Tidak ada aksi persetujuan bantuan pada pemeriksaan eskalasi.");
  requireFresh(ticket,tasks,register,dossier);
  const note=words(reason,"Pertimbangan penelaah",40,700);
  const state=action==="minta_klarifikasi"?"perlu_klarifikasi":"ditutup_administratif";
  return move(book,ticket,state,action,who,note,{review:{
    action,note,reviewer_demo_id:who.id,
    meaning:"PENUTUPAN CATATAN SAJA, BUKAN PENYELESAIAN MASALAH/BANTUAN/KEABSAHAN SURAT",
  }});
}
export function cancelEscalation(book,id,tasks,register,dossier,reason,coordinator){
  const ticket=find(book,id),who=actor(coordinator,"koordinator_eskalasi_demo");
  if(!["dilaporkan","diteruskan","perlu_klarifikasi"].includes(ticket.state)||
     who.id===ticket.reporter.id)
    throw Error("Hanya koordinator terpisah dapat membatalkan catatan aktif.");
  requireFresh(ticket,tasks,register,dossier);
  return move(book,ticket,"dibatalkan","batalkan_eskalasi",who,
    words(reason,"Alasan pembatalan",40,500),{coordinator:ticket.coordinator??who});
}
export function escalationList(book,tasks,register,dossier,asOfDemo="2026-11-11"){
  store(book);const date=dateDemo(asOfDemo);
  return book.tickets.map(t=>({
    id:t.id,task_id:t.source.task_id,category:t.details.category,
    category_label:CATEGORIES[t.details.category],urgency:t.details.urgency,
    urgency_label:URGENCY[t.details.urgency],state:t.state,
    state_label:STATES[t.state],reporter_demo_id:t.reporter.id,
    recipient_demo_id:t.routing?.recipient_demo_id??null,
    due_date_demo:t.routing?.due_date_demo??null,
    source_stale:!sourceCurrent(t,tasks,register,dossier),
    attention:!FINISHED.has(t.state)&&!sourceCurrent(t,tasks,register,dossier)
      ?"SUMBER_BERUBAH":!FINISHED.has(t.state)&&t.routing?.due_date_demo<date
      ?"MELEWATI_TANGGAL_DEMO":t.state==="perlu_klarifikasi"?"PERLU_KLARIFIKASI":
        t.state==="ditutup_administratif"?"CATATAN_DITUTUP":"STATUS_ADMINISTRASI",
    revision:t.revision,
    meaning:"STATUS ADMINISTRASI DEMO, BUKAN PERSETUJUAN BANTUAN",
  }));
}
export function escalationSummary(book,tasks,register,dossier,asOfDemo="2026-11-11"){
  const rows=escalationList(book,tasks,register,dossier,asOfDemo);
  const by_state=Object.fromEntries(Object.keys(STATES).map(k=>[k,rows.filter(r=>r.state===k).length]));
  return {as_of_demo:asOfDemo,total:rows.length,
    aktif:rows.filter(r=>!FINISHED.has(r.state)).length,
    perlu_klarifikasi:by_state.perlu_klarifikasi,
    menunggu_tanggapan:by_state.diteruskan,
    menunggu_koordinator:by_state.dilaporkan,
    ditutup_administratif:by_state.ditutup_administratif,
    dibatalkan:by_state.dibatalkan,
    sumber_berubah_aktif:rows.filter(r=>r.source_stale&&!FINISHED.has(r.state)).length,
    lewat_tanggal_demonstrasi:rows.filter(r=>r.attention==="MELEWATI_TANGGAL_DEMO").length,
    by_state};
}
export function escalationHandoff(book,id,tasks,register,dossier){
  const t=find(book,id),stale=!sourceCurrent(t,tasks,register,dossier);
  return [
    "DRAF REKAP KENDALA DAN ESKALASI ADMINISTRATIF (DEMO, BELUM DIUJI)",
    "TIDAK ADA keputusan bantuan, keaslian dokumen, anggaran, penyaluran atau BAST.",
    "ID: "+t.id+"; tugas: "+t.source.task_id+"; r"+t.revision+
      "; status: "+STATES[t.state],
    "Sumber berubah: "+(stale?"YA, TUNDA PROSES":"Tidak terdeteksi pada snapshot DEMO"),
    "Kendala: "+CATEGORIES[t.details.category]+"; urgensi: "+URGENCY[t.details.urgency],
    "Uraian: "+t.details.description,"Dampak: "+t.details.effect_on_work,
    "Upaya dicatat: "+t.details.attempted_steps,"Koordinasi diperlukan: "+t.details.needed_action,
    "Bukti fiktif: "+t.details.evidence_ref_demo,
    "Pelapor: "+t.reporter.id,"Penerima: "+(t.routing?.recipient_demo_id??"BELUM ADA"),
    "Tanggal acuan penanganan: "+(t.routing?.due_date_demo??"BELUM ADA"),
    "Arahan DEMO: "+(t.routing?.instruction??"BELUM ADA"),
    "Tanggapan: "+(t.response?.response??"BELUM ADA"),
    "Hambatan yang tersisa: "+(t.response?.remaining_blocker??"BELUM ADA"),
    "Penelaahan: "+(t.review?.note??"BELUM ADA"),
    "Riwayat:",...t.history.map(h=>"- r"+h.revision+" "+h.action+" "+
      h.actor_demo_id+": "+h.note),
    "PENUTUPAN CATATAN BUKAN KEPUTUSAN ATAU BUKTI MASALAH SUBSTANTIF SELESAI.",
  ].join("\n");
}
