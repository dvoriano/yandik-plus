/**
 * M04-S2 | KODE DITULIS, BELUM DIUJI.
 * Register of references to documents CLAIMED to be issued outside YANDIK+.
 * It NEVER issues a letter, authenticates external files, decides recipients,
 * approves budgets, commits funding, procures, delivers or creates BAST.
 * Entirely fictional data and role labels; no backend, real sign-off or persistence.
 */
import { DOSSIER_SCHEMA, pendingRequirements } from "../m04-admin-review/dossier.mjs";

export const REFERENCE_SCHEMA = "M04-S2-UNTESTED-1";
export const REFERENCE_STATUSES = Object.freeze({
  draf: "Draf metadata referensi",
  menunggu_telaah: "Menunggu pemeriksaan referensi DEMO",
  perlu_klarifikasi: "Perlu klarifikasi metadata",
  metadata_tercatat: "Metadata dicatat, bukan verifikasi keaslian",
  tidak_sesuai: "Referensi ditandai tidak sesuai",
});
export const REFERENCE_TYPES = Object.freeze({
  keputusan_eksternal: "Dokumen keputusan dari luar sistem (klaim DEMO)",
  surat_pengantar: "Surat pengantar eksternal (klaim DEMO)",
  rekomendasi: "Rekomendasi atau pertimbangan eksternal (klaim DEMO)",
});
export const REVIEW_ACTIONS = Object.freeze({
  catat_metadata: "Catat metadata untuk penelusuran, bukan menyetujui",
  minta_klarifikasi: "Minta klarifikasi atau perbaikan rujukan",
  tandai_tidak_sesuai: "Tandai referensi tidak sesuai",
});
const DEMO_ID=/^DEMO-[A-Z0-9_-]{4,55}$/;
const FORBIDDEN=[
  "approved","approval","authorized_approval","decision","allocation",
  "budget","amount","nominal","recipient","beneficiary","recipient_selected",
  "procurement","purchase_order","payment","delivery","bast","signed_at",
  "official_signature","legal_valid","authentic","is_verified_official",
  "funding_approved","sk_issued","approval_number",
];
function object(value,name) {
  if(!value||typeof value!=="object"||Array.isArray(value))throw Error(name+" tidak valid.");
  if(FORBIDDEN.some(k=>Object.hasOwn(value,k)))
    throw Error("Register tidak boleh memuat persetujuan, transaksi atau klaim keaslian resmi.");
  return value;
}
function only(value,keys,name){
  for(const k of Object.keys(object(value,name)))if(!keys.includes(k))
    throw Error(name+" mengandung atribut tidak diizinkan: "+k);
}
function string(value,name,min,max){
  if(typeof value!=="string"||value.trim().length<min||value.trim().length>max)
    throw Error(name+" harus "+min+"–"+max+" karakter.");
  return value.trim();
}
function actor(value,role){
  only(value,["role","id"],"identitas DEMO");
  if(value.role!==role||typeof value.id!=="string"||!DEMO_ID.test(value.id))
    throw Error("Peran DEMO tidak cocok (bukan autentikasi pengguna sesungguhnya).");
  return {role:value.role,id:value.id};
}
function checkDate(raw){
  if(typeof raw!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(raw))
    throw Error("Tanggal dokumen contoh harus YYYY-MM-DD.");
  const d=new Date(raw+"T00:00:00Z");
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==raw)
    throw Error("Tanggal dokumen fiktif tidak sah.");
  return raw;
}
function fields(form){
  only(form,["document_ref","document_type","issuer_demo_id",
    "document_date_demo","claim_summary","source_metadata_ref","caveat"],"form referensi");
  if(typeof form.document_ref!=="string"||!DEMO_ID.test(form.document_ref)||
     typeof form.issuer_demo_id!=="string"||!DEMO_ID.test(form.issuer_demo_id)||
     typeof form.source_metadata_ref!=="string"||!DEMO_ID.test(form.source_metadata_ref))
    throw Error("Nomor, instansi penerbit dan rujukan metadata wajib kode DEMO-, bukan dokumen asli.");
  if(!Object.hasOwn(REFERENCE_TYPES,form.document_type))
    throw Error("Jenis dokumen eksternal tidak dikenal.");
  return {
    document_ref:form.document_ref,document_type:form.document_type,
    issuer_demo_id:form.issuer_demo_id,document_date_demo:checkDate(form.document_date_demo),
    claim_summary:string(form.claim_summary,"Uraian dokumen yang diklaim",35,500),
    source_metadata_ref:form.source_metadata_ref,
    caveat:string(form.caveat,"Keterangan pemeriksaan yang masih diperlukan",30,500),
  };
}
function dossier(d){
  object(d,"sumber administrasi");
  if(d.schema!==DOSSIER_SCHEMA||d.synthetic!==true||
     d.status!=="tercatat_untuk_pertimbangan"||
     !DEMO_ID.test(d.id??"")||!Number.isSafeInteger(d.version)||d.version<1||
     !d.need_snapshot||!DEMO_ID.test(d.need_snapshot.need_id??"")||
     !DEMO_ID.test(d.need_snapshot.puskeswan_id??"")||
     !d.review||d.review.action!=="catat_bahan")
    throw Error("Sumber harus berkas M04-S1 DEMO yang dicatat untuk pertimbangan, bukan disetujui.");
  if(pendingRequirements(d).length!==0)
    throw Error("Berkas administrasi masih belum lengkap menurut data contoh.");
  return d;
}
function snapshot(d){
  const s=dossier(d);
  return {
    dossier_id:s.id,dossier_version:s.version,
    need_id:s.need_snapshot.need_id,
    puskeswan_id:s.need_snapshot.puskeswan_id,
    need_source_version:s.need_snapshot.source_version,
    source_status:s.status,source_review_action:s.review.action,
    // Informational signature, NOT cryptographic proof of identity/integrity.
    source_signature_demo:JSON.stringify({
      schema:s.schema,version:s.version,status:s.status,
      need_snapshot:s.need_snapshot,content:s.content,review:s.review,
    }),
  };
}
function event(action,who,revision,note){
  return {action,revision,role:who.role,actor_demo_id:who.id,note};
}
function register(input){
  object(input,"register");
  if(input.schema!==REFERENCE_SCHEMA||input.synthetic!==true||
     !Array.isArray(input.entries)||input.entries.length>25)
    throw Error("Register referensi DEMO tidak sah.");
  const ids=new Set(),refs=new Set();
  for(const entry of input.entries){
    object(entry,"catatan");
    if(!DEMO_ID.test(entry.id??"")||ids.has(entry.id)||
      !Object.hasOwn(REFERENCE_STATUSES,entry.status)||
      !Number.isSafeInteger(entry.revision)||entry.revision<1||
      !entry.author||!DEMO_ID.test(entry.author.id??"")||
      !Array.isArray(entry.history)||entry.history.length!==entry.revision||
      !entry.source||typeof entry.source.source_signature_demo!=="string")
      throw Error("Catatan/riwayat referensi tidak sah atau ID ganda.");
    const normalized=fields(entry.metadata);
    if(JSON.stringify(normalized)!==JSON.stringify(entry.metadata))
      throw Error("Data metadata referensi tidak konsisten.");
    if(refs.has(normalized.document_ref))
      throw Error("Satu nomor referensi DEMO tidak boleh didaftarkan dua kali.");
    ids.add(entry.id);refs.add(normalized.document_ref);
  }
  return input;
}
function getEntry(r,id){
  register(r);
  const x=r.entries.find(e=>e.id===id);
  if(!x)throw Error("Catatan referensi DEMO tidak ditemukan.");
  return x;
}
function put(r,entry){
  return {...r,entries:r.entries.map(e=>e.id===entry.id?entry:e)};
}
function isStale(entry,d){
  try{return JSON.stringify(snapshot(d))!==JSON.stringify(entry.source);}
  catch{return true;}
}
export function createReferenceRegister(){
  return {schema:REFERENCE_SCHEMA,synthetic:true,entries:[]};
}
export function addExternalReference(r,d,form,makerInput){
  register(r);
  if(r.entries.length>=25)throw Error("Register demo dibatasi 25 catatan.");
  const who=actor(makerInput,"pencatat_referensi_prov_demo");
  const metadata=fields(form);
  if(r.entries.some(e=>e.metadata.document_ref===metadata.document_ref))
    throw Error("Nomor dokumen contoh yang sama sudah ada di register.");
  const source=snapshot(d);
  const id="DEMO-REF-"+String(r.entries.length+1).padStart(3,"0");
  const entry={
    id,synthetic:true,source,metadata,status:"draf",revision:1,author:who,
    review:null,
    history:[event("buat_draf",who,1,"Referensi eksternal hanya dicatat sebagai klaim DEMO.")],
  };
  return {...r,entries:[...r.entries,entry]};
}
export function reviseExternalReference(r,id,d,form,makerInput){
  const entry=getEntry(r,id),who=actor(makerInput,"pencatat_referensi_prov_demo");
  if(entry.author.id!==who.id||!["draf","perlu_klarifikasi"].includes(entry.status))
    throw Error("Hanya pencatat awal yang boleh merevisi draf/berkas yang dikembalikan.");
  if(isStale(entry,d))throw Error("Berkas M04-S1 berubah; lakukan pencatatan ulang setelah telaah.");
  const metadata=fields(form);
  if(r.entries.some(e=>e.id!==id&&e.metadata.document_ref===metadata.document_ref))
    throw Error("Nomor referensi DEMO ganda pada berkas lain.");
  const revision=entry.revision+1;
  const next={...entry,metadata,status:"draf",revision,review:null,
    history:[...entry.history,event("revisi_metadata",who,revision,
      "Referensi diperbaiki; semua catatan pemeriksaan sebelumnya tetap dalam histori.")],
  };
  return put(r,next);
}
export function submitExternalReference(r,id,d,makerInput){
  const entry=getEntry(r,id),who=actor(makerInput,"pencatat_referensi_prov_demo");
  if(entry.author.id!==who.id||entry.status!=="draf")
    throw Error("Hanya pencatat dapat mengajukan draf DEMO.");
  if(isStale(entry,d))
    throw Error("Referensi sumber M04-S1 usang atau tak sesuai; perlu kajian ulang.");
  const revision=entry.revision+1;
  return put(r,{...entry,status:"menunggu_telaah",revision,
    history:[...entry.history,event("ajukan_pemeriksaan",who,revision,
      "Diajukan untuk pemeriksaan metadata, bukan keaslian dokumen resmi.")],
  });
}
export function reviewExternalReference(r,id,d,reviewerInput,action,note,acknowledge){
  const entry=getEntry(r,id),who=actor(reviewerInput,"penelaah_referensi_prov_demo");
  if(entry.status!=="menunggu_telaah"||entry.author.id===who.id)
    throw Error("Referensi harus menunggu penelaah yang berbeda dari pencatat.");
  if(isStale(entry,d))throw Error("Sumber dossier telah berubah, penelaahan dihentikan.");
  if(!Object.hasOwn(REVIEW_ACTIONS,action))
    throw Error("Tidak ada aksi approval/persetujuan pada register ini.");
  if(acknowledge!==true)
    throw Error("Penelaah wajib mengakui bahwa yang diperiksa hanya metadata DEMO.");
  const reason=string(note,"Alasan pemeriksaan metadata",35,700);
  const status=action==="catat_metadata"?"metadata_tercatat":
    action==="minta_klarifikasi"?"perlu_klarifikasi":"tidak_sesuai";
  const revision=entry.revision+1;
  const review={action,note:reason,reviewer_demo_id:who.id,scope:
    "HANYA METADATA; KEASLIAN DAN KEBERLAKUAN HUKUM BELUM DIVERIFIKASI"};
  return put(r,{...entry,status,revision,review,
    history:[...entry.history,event(action,who,revision,reason)],
  });
}
export function referenceIsStale(r,id,d){
  return isStale(getEntry(r,id),d);
}
export function referenceList(r,d){
  register(r);
  return r.entries.map(e=>({
    id:e.id,document_ref:e.metadata.document_ref,
    document_type:REFERENCE_TYPES[e.metadata.document_type],
    source_dossier:e.source.dossier_id,
    status:REFERENCE_STATUSES[e.status],
    needs_recheck:isStale(e,d),
    revision:e.revision,
    authenticity:"BELUM DIPERIKSA SECARA RESMI",
  }));
}
export function referenceHandoffNote(r,id,d){
  const entry=getEntry(r,id);
  const stale=isStale(entry,d);
  return [
    "DRAF REGISTER REFERENSI KEPUTUSAN/DOKUMEN EKSTERNAL",
    "KODE DITULIS, BELUM DIUJI. SELURUH INFORMASI FIKTIF.",
    "Bukan penerbitan SK, verifikasi keaslian, keputusan bantuan, anggaran atau BAST.",
    "ID catatan: "+entry.id+" | revisi: "+entry.revision,
    "Referensi DEMO: "+entry.metadata.document_ref,
    "Jenis: "+REFERENCE_TYPES[entry.metadata.document_type],
    "Instansi penerbit contoh: "+entry.metadata.issuer_demo_id,
    "Tanggal contoh (BUKAN tanggal terverifikasi): "+entry.metadata.document_date_demo,
    "Sumber administrasi: "+entry.source.dossier_id+" versi "+entry.source.dossier_version,
    "Sumber kebutuhan: "+entry.source.need_id+" / fasilitas "+entry.source.puskeswan_id,
    "Status kajian: "+REFERENCE_STATUSES[entry.status],
    "Kesesuaian sumber saat ini: "+(stale?"PERLU PERIKSA ULANG":"Tidak berubah pada snapshot DEMO"),
    "Uraian dokumen yang diklaim: "+entry.metadata.claim_summary,
    "Kode bukti metadata: "+entry.metadata.source_metadata_ref,
    "Keterbatasan: "+entry.metadata.caveat,
    "Tinjauan penelaah DEMO: "+(entry.review?.note??"BELUM ADA"),
    "Batas review: "+(entry.review?.scope??"BELUM ADA PEMERIKSAAN METADATA"),
    "Riwayat:",
    ...entry.history.map(e=>"- r"+e.revision+" "+e.action+" ("+e.actor_demo_id+"): "+e.note),
    "Seluruh nomor dan instansi bertanda DEMO, belum ada file asli atau konfirmasi pihak penerbit.",
    "Tidak ada status persetujuan pejabat, penerima, nominal, paket, pengadaan, distribusi atau BAST.",
  ].join("\n");
}
