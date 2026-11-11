/**
 * M04-S3 | KODE DITULIS, BELUM DIUJI.
 * Plans administrative follow-up to an M04-S2 DEMO metadata reference.
 * Completion means "administrative note reviewed", NEVER document authenticity,
 * legal decision, grant award, allocation, procurement, dispatch or BAST.
 * Roles are fake strings, not actual access controls or audit identities.
 */
import { REFERENCE_SCHEMA, referenceIsStale } from "../m04-decision-reference/reference_register.mjs";
export const FOLLOWUP_SCHEMA = "M04-S3-UNTESTED-1";
export const TASK_TYPES = Object.freeze({
  konfirmasi_sumber: "Menyiapkan permintaan konfirmasi ke penerbit",
  periksa_kesesuaian: "Menyusun daftar kesesuaian ruang lingkup",
  klarifikasi_arsip: "Menyiapkan klarifikasi arsip dan metadata",
  pembahasan_proses: "Menyiapkan bahan pembahasan dengan pemilik proses",
});
export const TASK_STATES = Object.freeze({
  draf: "Draf rencana, belum ditugaskan",
  ditugaskan: "Ditugaskan dalam simulasi",
  dalam_proses: "Catatan administratif sedang disusun",
  menunggu_telaah: "Catatan menunggu pemeriksaan",
  perlu_perbaikan: "Catatan dikembalikan untuk dilengkapi",
  ditutup_administratif: "Catatan pekerjaan ditutup, bukan keputusan bantuan",
  dibatalkan: "Rencana administratif dibatalkan",
});
const ID=/^DEMO-[A-Z0-9_-]{4,55}$/;
const FORBIDDEN=["approval","approved","budget","amount","allocation","payment",
  "procurement","recipient_selected","beneficiary","official_decision",
  "authorized_approval","grant","bast","delivery","purchase_order","sk",
  "authentic","legally_valid","real_signature","verified_official"];
function obj(v,label){if(!v||typeof v!=="object"||Array.isArray(v))throw Error(label+" harus objek.");
  if(FORBIDDEN.some(k=>Object.hasOwn(v,k)))throw Error("Atribut keputusan atau pengesahan terlarang.");return v;}
function only(v,keys,label){for(const k of Object.keys(obj(v,label)))if(!keys.includes(k))throw Error(label+" memuat atribut lain: "+k);}
function words(v,label,min=30,max=600){if(typeof v!=="string"||v.trim().length<min||v.trim().length>max)throw Error(label+" harus "+min+"–"+max+" karakter.");return v.trim();}
function actor(raw,role){only(raw,["role","id"],"Identitas DEMO");
  if(raw.role!==role||typeof raw.id!=="string"||!ID.test(raw.id))throw Error("Peran DEMO tidak sesuai.");
  return {role:raw.role,id:raw.id};}
function date(v){if(typeof v!=="string"||!/^20\d{2}-\d{2}-\d{2}$/.test(v))throw Error("Tanggal rencana harus YYYY-MM-DD, tahun 20xx.");
  const d=new Date(v+"T00:00:00Z");
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==v)throw Error("Tanggal rencana fiktif tidak sah.");
  return v;
}
function fields(v){only(v,["task_type","description","expected_output","due_date_demo","assignee_demo_id","limitations"],"Form rencana");
  if(!Object.hasOwn(TASK_TYPES,v.task_type)||typeof v.assignee_demo_id!=="string"||!ID.test(v.assignee_demo_id))
    throw Error("Jenis pekerjaan atau penanggung jawab DEMO tidak sesuai.");
  return {task_type:v.task_type,description:words(v.description,"Rincian pekerjaan",40,500),
    expected_output:words(v.expected_output,"Keluaran administratif",30,400),
    due_date_demo:date(v.due_date_demo),assignee_demo_id:v.assignee_demo_id,
    limitations:words(v.limitations,"Batas pemeriksaan",30,500)};
}
function findReference(register,id,dossier){
  obj(register,"Register referensi");
  if(register.schema!==REFERENCE_SCHEMA||register.synthetic!==true||!Array.isArray(register.entries))
    throw Error("Register referensi bukan data fiktif M04-S2.");
  const entry=register.entries.find(e=>e.id===id);
  if(!entry||entry.synthetic!==true||!ID.test(entry.id??"")||entry.status!=="metadata_tercatat"||
    entry.review?.action!=="catat_metadata"||!ID.test(entry.review?.reviewer_demo_id??"")||
    !entry.metadata||!ID.test(entry.metadata.document_ref??"")||
    !entry.source||!ID.test(entry.source.dossier_id??""))
    throw Error("Hanya referensi DEMO dengan metadata tercatat yang bisa ditindaklanjuti.");
  if(referenceIsStale(register,id,dossier))
    throw Error("Berkas sumber M04-S1 telah berubah atau tidak sesuai.");
  return entry;
}
function sourceSnapshot(entry){
  return {reference_id:entry.id,reference_revision:entry.revision,
    document_ref:entry.metadata.document_ref,document_type:entry.metadata.document_type,
    dossier_id:entry.source.dossier_id,dossier_version:entry.source.dossier_version,
    need_id:entry.source.need_id,puskeswan_id:entry.source.puskeswan_id,
    metadata_status:entry.status,source_signature_demo:JSON.stringify({
      metadata:entry.metadata,source:entry.source,review:entry.review,
      revision:entry.revision,status:entry.status,
    }),
    authenticity:"BELUM DIPERIKSA OLEH PENERBIT/ARSIP RESMI"};
}
function sourceFresh(task,register,dossier){
  try{
    const now=findReference(register,task.source.reference_id,dossier);
    return JSON.stringify(sourceSnapshot(now))===JSON.stringify(task.source);
  }catch{return false;}
}
function entryEvent(action,person,revision,note){return {action,revision,actor_demo_id:person.id,role:person.role,note};}
function taskStore(list){obj(list,"Daftar pekerjaan");
  if(list.schema!==FOLLOWUP_SCHEMA||list.synthetic!==true||!Array.isArray(list.tasks)||list.tasks.length>30)
    throw Error("Daftar tindak lanjut bukan register DEMO M04-S3.");
  const ids=new Set();
  for(const task of list.tasks){
    obj(task,"Tugas");
    if(!ID.test(task.id??"")||ids.has(task.id)||!Object.hasOwn(TASK_STATES,task.state)||
      !Number.isSafeInteger(task.revision)||task.revision<1||
      !Array.isArray(task.history)||task.history.length!==task.revision||
      !task.source||!ID.test(task.source.reference_id??"")||
      !task.author||!ID.test(task.author.id??"")||
      JSON.stringify(fields(task.plan))!==JSON.stringify(task.plan))
      throw Error("Tugas, histori, sumber atau isian DEMO tidak konsisten.");
    ids.add(task.id);
  }
  return list;
}
function getTask(list,id){taskStore(list);const t=list.tasks.find(x=>x.id===id);if(!t)throw Error("Tugas DEMO tidak ditemukan.");return t;}
function update(list,t){return {...list,tasks:list.tasks.map(x=>x.id===t.id?t:x)};}
function assertFresh(t,register,dossier){if(!sourceFresh(t,register,dossier))
  throw Error("Referensi atau berkas sumber berubah. Tunda tindak lanjut dan lakukan pemeriksaan ulang.");}
function nextTask(list,task,newState,action,person,note,more={}){
  const revision=task.revision+1;
  return update(list,{...task,...more,state:newState,revision,
    history:[...task.history,entryEvent(action,person,revision,note)]});
}
export function createFollowupList(){return {schema:FOLLOWUP_SCHEMA,synthetic:true,tasks:[]};}
export function createFollowupDraft(list,register,referenceId,dossier,input,coordinator){
  taskStore(list);const who=actor(coordinator,"koordinator_administrasi_demo");
  if(list.tasks.length>=30)throw Error("Batas rancangan 30 tugas fiktif.");
  const ref=findReference(register,referenceId,dossier),plan=fields(input);
  if(list.tasks.some(t=>t.source.reference_id===referenceId&&
      t.plan.task_type===plan.task_type&&!["dibatalkan","ditutup_administratif"].includes(t.state)))
    throw Error("Jenis tindak lanjut yang sama masih aktif untuk referensi contoh ini.");
  const id="DEMO-TUGAS-"+String(list.tasks.length+1).padStart(3,"0");
  const task={id,synthetic:true,source:sourceSnapshot(ref),plan,state:"draf",
    revision:1,author:who,completion:null,review:null,
    history:[entryEvent("buat_draf",who,1,"Rencana administratif dibuat, tanpa keputusan bantuan.")]};
  return {...list,tasks:[...list.tasks,task]};
}
export function reviseFollowupDraft(list,id,register,dossier,input,coordinator){
  const t=getTask(list,id),who=actor(coordinator,"koordinator_administrasi_demo");
  if(t.author.id!==who.id||t.state!=="draf")throw Error("Hanya pembuat boleh merevisi draf.");
  assertFresh(t,register,dossier);
  const plan=fields(input);
  if(list.tasks.some(x=>x.id!==id&&x.source.reference_id===t.source.reference_id&&
      x.plan.task_type===plan.task_type&&!["dibatalkan","ditutup_administratif"].includes(x.state)))
    throw Error("Rencana sejenis masih aktif pada referensi yang sama.");
  return nextTask(list,t,"draf","perbaiki_rencana",who,
    "Rincian/tenggat diperbarui. Riwayat sebelumnya tidak dihapus.",{plan});
}
export function assignFollowup(list,id,register,dossier,coordinator){
  const t=getTask(list,id),who=actor(coordinator,"koordinator_administrasi_demo");
  if(t.author.id!==who.id||t.state!=="draf")throw Error("Hanya penyusun boleh menugaskan draf.");
  assertFresh(t,register,dossier);
  return nextTask(list,t,"ditugaskan","tugaskan",who,
    "Tugas administrasi dicatat untuk "+t.plan.assignee_demo_id+"; bukan perintah dinas.");
}
export function startFollowup(list,id,register,dossier,staff){
  const t=getTask(list,id),who=actor(staff,"petugas_tindak_lanjut_demo");
  if(t.plan.assignee_demo_id!==who.id||t.state!=="ditugaskan")
    throw Error("Tugas hanya dapat dimulai petugas DEMO yang ditunjuk.");
  assertFresh(t,register,dossier);
  return nextTask(list,t,"dalam_proses","mulai_catatan",who,
    "Penyusunan catatan administratif dimulai dalam simulasi.");
}
export function submitFollowupNote(list,id,register,dossier,staff,note,evidenceRef){
  const t=getTask(list,id),who=actor(staff,"petugas_tindak_lanjut_demo");
  if(t.plan.assignee_demo_id!==who.id||!["dalam_proses","perlu_perbaikan"].includes(t.state))
    throw Error("Hanya petugas tertunjuk dapat mengajukan catatan pada status sesuai.");
  assertFresh(t,register,dossier);
  const written=words(note,"Catatan tindakan administratif",50,800);
  if(typeof evidenceRef!=="string"||!ID.test(evidenceRef))
    throw Error("Referensi hasil masih harus berupa kode bukti fiktif DEMO-.");
  return nextTask(list,t,"menunggu_telaah","ajukan_catatan",who,
    "Catatan simulasi disampaikan untuk diperiksa, tanpa konfirmasi penerbit asli.",
    {completion:{note:written,evidence_ref_demo:evidenceRef},review:null});
}
export function reviewFollowupNote(list,id,register,dossier,reviewer,action,reason){
  const t=getTask(list,id),who=actor(reviewer,"penelaah_tindak_lanjut_demo");
  if(t.state!=="menunggu_telaah"||t.author.id===who.id||
    t.plan.assignee_demo_id===who.id)
    throw Error("Telaah harus oleh peran lain, bukan penyusun atau petugas pelaksana.");
  assertFresh(t,register,dossier);
  if(!["kembalikan","catat_selesai"].includes(action))
    throw Error("Tidak ada opsi persetujuan bantuan pada telaah tugas.");
  const notes=words(reason,"Alasan pemeriksaan catatan",40,700);
  const state=action==="kembalikan"?"perlu_perbaikan":"ditutup_administratif";
  return nextTask(list,t,state,action,who,notes,{review:{
    action,reviewer_demo_id:who.id,reason:notes,
    meaning:"PENUTUPAN CATATAN SAJA, BUKAN KEASLIAN DOKUMEN/KEPUTUSAN/BANTUAN",
  }});
}
export function cancelFollowup(list,id,register,dossier,coordinator,reason){
  const t=getTask(list,id),who=actor(coordinator,"koordinator_administrasi_demo");
  if(t.author.id!==who.id||["ditutup_administratif","dibatalkan"].includes(t.state))
    throw Error("Tugas sudah ditutup atau dibatalkan.");
  assertFresh(t,register,dossier);
  return nextTask(list,t,"dibatalkan","batalkan_rencana",who,
    words(reason,"Alasan pembatalan",40,500));
}
export function followupListView(list,register,dossier){
  taskStore(list);
  return list.tasks.map(t=>({id:t.id,reference_id:t.source.reference_id,
    type:TASK_TYPES[t.plan.task_type],state:TASK_STATES[t.state],
    due_date_demo:t.plan.due_date_demo,assignee_demo_id:t.plan.assignee_demo_id,
    revision:t.revision,source_stale:!sourceFresh(t,register,dossier),
    outcome:"HANYA CATATAN ADMINISTRASI; TIDAK ADA KEPUTUSAN BANTUAN"}));
}
export function followupHandoffText(list,id,register,dossier){
  const t=getTask(list,id),stale=!sourceFresh(t,register,dossier);
  return [
    "DRAF REKAP TINDAK LANJUT ADMINISTRATIF (SIMULASI / BELUM DIUJI)",
    "Bukan perintah dinas, konfirmasi keaslian, pengesahan bantuan atau dokumen BAST.",
    "Tugas: "+t.id+" | Status: "+TASK_STATES[t.state]+" | Revisi: "+t.revision,
    "Referensi sumber: "+t.source.document_ref+" / "+t.source.reference_id,
    "Status metadata sumber: "+t.source.metadata_status+" (BUKAN KEASLIAN)",
    "Sumber berubah: "+(stale?"YA, JANGAN DIGUNAKAN SEBELUM DITELAAH ULANG":"Tidak terdeteksi pada snapshot DEMO"),
    "Jenis: "+TASK_TYPES[t.plan.task_type],
    "Uraian: "+t.plan.description,
    "Keluaran administratif diharapkan: "+t.plan.expected_output,
    "Batas pemeriksaan: "+t.plan.limitations,
    "Penanggung jawab contoh: "+t.plan.assignee_demo_id,
    "Tanggal rencana fiktif: "+t.plan.due_date_demo,
    "Catatan penyusun: "+(t.completion?.note??"BELUM ADA"),
    "Referensi hasil DEMO: "+(t.completion?.evidence_ref_demo??"BELUM ADA"),
    "Telaah catatan: "+(t.review?.reason??"BELUM ADA"),
    "Histori:",
    ...t.history.map(h=>"- r"+h.revision+" "+h.action+" "+h.actor_demo_id+": "+h.note),
    "Tugas selesai hanya berarti catatan kerja ditelaah, tidak membuktikan dokumen resmi atau bantuan.",
    "Tidak ada penerima, anggaran, pembayaran, pengadaan, distribusi, penyaluran atau BAST.",
  ].join("\n");
}
