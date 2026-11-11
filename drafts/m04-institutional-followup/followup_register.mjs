/**
 * M04-S9 | KODE DITULIS, BELUM DIUJI.
 * In-memory registry of DEMO institutional follow-up actions for M04-S8 findings.
 * Closed administrative notes are NOT evidence of institutional readiness,
 * SOP enactment, legal approval, budget, procurement, distribution or BAST.
 * No real users, authentication, persistence, network, or official decisions.
 */
import {
  GOVERNANCE_SCHEMA, REQUIREMENTS, CHECK_STATES, CHANGE_STATES, governanceBoard,
} from "../m04-sop-governance/governance.mjs";

export const FOLLOWUP_REGISTER_SCHEMA="M04-S9-FOLLOWUP-UNTESTED-1";
export const FINDING_KINDS=Object.freeze({
  syarat_kelembagaan:"Kekurangan unsur kesiapan kelembagaan M04-S8",
  usulan_katalog:"Tindak lanjut usulan perubahan katalog unit M04-S8",
  catatan_pembahasan:"Catatan isu pembahasan DEMO yang perlu ditelusuri",
});
export const FOLLOWUP_STATES=Object.freeze({
  draf:"Rencana perbaikan masih draf",
  tercatat:"Rencana ditugaskan pada simulasi, belum perintah dinas",
  dalam_proses:"Petugas DEMO menyusun catatan perbaikan",
  menunggu_telaah:"Menunggu telaah catatan hasil DEMO",
  perlu_perbaikan:"Catatan hasil diminta diperbaiki",
  catatan_ditutup:"Hanya catatan administratif ditutup, bukan persyaratan terpenuhi",
  dibatalkan:"Rencana DEMO dibatalkan dengan alasan",
});
const ID=/^DEMO-[A-Z0-9_-]{4,55}$/;
const CLOSE=new Set(["catatan_ditutup","dibatalkan"]);
const BLOCKED=["approved","approval","budget","allocation","amount","nominal",
  "recipient_selected","beneficiary","procurement","payment","delivery",
  "shipment","bast","official_decision","sop_effective","enacted",
  "legal_valid","authentic","official_signature","integration_ready"];
function object(v,label){
  if(!v||typeof v!=="object"||Array.isArray(v))throw Error(label+" harus objek.");
  if(BLOCKED.some(k=>Object.hasOwn(v,k)))
    throw Error("Register tidak boleh memuat atribut keputusan resmi, anggaran atau siap integrasi.");
  return v;
}
function only(v,allowed,label){
  for(const k of Object.keys(object(v,label)))
    if(!allowed.includes(k))throw Error(label+" memuat kolom tidak dikenal: "+k);
}
function words(v,label,min,max){
  if(typeof v!=="string"||v.trim().length<min||v.trim().length>max)
    throw Error(label+" memerlukan "+min+"–"+max+" karakter.");
  return v.trim();
}
function actor(v,expected){
  only(v,["role","id"],"Pelaku DEMO");
  if(v.role!==expected||typeof v.id!=="string"||!ID.test(v.id))
    throw Error("Peran/ID petugas DEMO tidak sesuai.");
  return {role:v.role,id:v.id};
}
function day(v){
  if(typeof v!=="string"||!/^20\d{2}-\d{2}-\d{2}$/.test(v))
    throw Error("Tanggal rencana fiktif wajib YYYY-MM-DD.");
  const d=new Date(v+"T00:00:00Z");
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==v)
    throw Error("Tanggal kalender tidak sesuai.");
  return v;
}
function fields(input){
  only(input,["kind","source_ref","description","impact","corrective_plan",
    "expected_output","assignee_demo_id","due_date_demo"],"Rencana tindak lanjut");
  if(!Object.hasOwn(FINDING_KINDS,input.kind))
    throw Error("Jenis temuan tidak dikenal.");
  if(typeof input.source_ref!=="string"||
    (input.kind==="catatan_pembahasan"&&!ID.test(input.source_ref))||
    (input.kind==="usulan_katalog"&&!ID.test(input.source_ref))||
    (input.kind==="syarat_kelembagaan"&&!REQUIREMENTS.some(x=>x.id===input.source_ref)))
    throw Error("Kode rujukan temuan DEMO tidak sesuai jenisnya.");
  if(typeof input.assignee_demo_id!=="string"||!ID.test(input.assignee_demo_id))
    throw Error("Penanggung jawab harus ID DEMO.");
  return {
    kind:input.kind,source_ref:input.source_ref,
    description:words(input.description,"Kekurangan yang dicatat",45,700),
    impact:words(input.impact,"Dampak jika tidak diperbaiki",35,650),
    corrective_plan:words(input.corrective_plan,"Rencana tindakan perbaikan",50,850),
    expected_output:words(input.expected_output,"Keluaran yang diharapkan",35,600),
    assignee_demo_id:input.assignee_demo_id,due_date_demo:day(input.due_date_demo),
  };
}
function docketSource(docket,sop,kind,reference){
  object(docket,"Berkas M04-S8");
  if(docket.schema!==GOVERNANCE_SCHEMA||docket.synthetic!==true||
    !["dicatat_untuk_pembahasan","perlu_perbaikan","tidak_direkomendasikan"]
      .includes(docket.status)||
    !["catat_untuk_pembahasan","minta_perbaikan","tidak_direkomendasikan"]
      .includes(docket.review?.decision)||
    !ID.test(docket.review?.reviewer_demo_id??"")||
    !Number.isSafeInteger(docket.revision)||docket.revision<1)
    throw Error("Sumber harus berkas M04-S8 DEMO yang sudah ditelaah, bukan naskah resmi.");
  const board=governanceBoard(docket,sop);
  if(board.source_changed)throw Error("Sumber M04-S7 berubah terhadap berkas M04-S8.");
  let source_label;
  let state;
  if(kind==="syarat_kelembagaan"){
    const item=docket.checklist.find(x=>x.id===reference);
    const rule=REQUIREMENTS.find(x=>x.id===reference);
    if(!item||!rule||!["belum_diperiksa","perlu_klarifikasi"].includes(item.status))
      throw Error("Unsur wajib/opsional hanya bisa didaftar sebagai kekurangan jika belum diperiksa atau perlu klarifikasi.");
    source_label=rule.title;state=CHECK_STATES[item.status];
  }else if(kind==="usulan_katalog"){
    const item=docket.changes.find(x=>x.id===reference);
    if(!item||!Object.hasOwn(CHANGE_STATES,item.status))
      throw Error("Usulan katalog M04-S8 DEMO tidak ditemukan.");
    source_label=item.input.unit_key+" / "+item.input.type;
    state=CHANGE_STATES[item.status];
  }else if(kind==="catatan_pembahasan"){
    if(!ID.test(reference))throw Error("Catatan pembahasan membutuhkan kode fiktif DEMO-.");
    source_label="Topik pembahasan DEMO "+reference;
    state="Perlu tindak lanjut administratif, belum dinilai resmi";
  }else throw Error("Jenis temuan di luar rancangan.");
  return {
    docket_revision:docket.revision,
    docket_status:docket.status,
    sop_revision:docket.source.sop_revision,
    catalog_version:docket.source.catalog_version,
    kind,reference,source_label,source_state:state,
    // Text snapshot, NOT digital signature, proof of authenticity or formal record.
    signature_demo:JSON.stringify({
      source:docket.source,status:docket.status,revision:docket.revision,
      review:docket.review,checklist:docket.checklist,changes:docket.changes,
    }),
  };
}
function sourceFresh(item,docket,sop){
  try{
    return JSON.stringify(item.source)===JSON.stringify(docketSource(
      docket,sop,item.plan.kind,item.plan.source_ref));
  }catch{return false;}
}
function history(action,who,revision,note){
  return {action,revision,role:who.role,actor_demo_id:who.id,note};
}
function validateRegistry(book){
  object(book,"Register tindak lanjut");
  if(book.schema!==FOLLOWUP_REGISTER_SCHEMA||book.synthetic!==true||
     !Array.isArray(book.items)||book.items.length>35)
    throw Error("Register M04-S9 DEMO tidak sah.");
  const ids=new Set(),active=new Set();
  for(const item of book.items){
    object(item,"Catatan perbaikan");
    if(item.synthetic!==true||!ID.test(item.id??"")||ids.has(item.id)||
      !Object.hasOwn(FOLLOWUP_STATES,item.status)||
      !Number.isSafeInteger(item.revision)||item.revision<1||
      !Array.isArray(item.history)||item.history.length!==item.revision||
      !item.author||!ID.test(item.author.id??"")||
      !item.source||item.source.reference!==item.plan?.source_ref||
      JSON.stringify(fields(item.plan))!==JSON.stringify(item.plan)||
      !Array.isArray(item.progress)||item.progress.length>25)
      throw Error("Item/riwayat register tidak konsisten.");
    ids.add(item.id);
    const key=item.plan.kind+"|"+item.plan.source_ref;
    if(!CLOSE.has(item.status)){
      if(active.has(key))throw Error("Temuan sejenis dengan rujukan sama sudah aktif.");
      active.add(key);
    }
  }
  return book;
}
function get(book,id){
  validateRegistry(book);
  const item=book.items.find(x=>x.id===id);
  if(!item)throw Error("Item M04-S9 DEMO tidak ditemukan.");
  return item;
}
function set(book,next){
  return {...book,items:book.items.map(x=>x.id===next.id?next:x)};
}
function move(book,item,status,action,who,note,extra={}){
  const revision=item.revision+1;
  return set(book,{...item,...extra,status,revision,
    history:[...item.history,history(action,who,revision,note)]});
}
function fresh(item,docket,sop){
  if(!sourceFresh(item,docket,sop))
    throw Error("Sumber M04-S8 berubah/temuan tidak lagi relevan; kaji ulang, jangan menutup otomatis.");
}
export function createInstitutionalFollowupRegister(){
  return {schema:FOLLOWUP_REGISTER_SCHEMA,synthetic:true,items:[]};
}
export function createFollowupFinding(book,docket,sop,input,author){
  validateRegistry(book);
  if(book.items.length>=35)throw Error("Register DEMO dibatasi 35 item.");
  const who=actor(author,"koordinator_tindak_lanjut_kelembagaan_demo");
  const plan=fields(input);
  if(book.items.some(x=>x.plan.kind===plan.kind&&
    x.plan.source_ref===plan.source_ref&&!CLOSE.has(x.status)))
    throw Error("Temuan dengan sumber yang sama masih ditindaklanjuti.");
  const source=docketSource(docket,sop,plan.kind,plan.source_ref);
  const id="DEMO-TL-KELEM-"+String(book.items.length+1).padStart(3,"0");
  const item={id,synthetic:true,source,plan,status:"draf",revision:1,
    author:who,progress:[],result:null,review:null,
    history:[history("buat_draf",who,1,"Rencana DEMO dicatat tanpa persetujuan kelembagaan.")],
  };
  return {...book,items:[...book.items,item]};
}
export function reviseFollowupFinding(book,id,docket,sop,input,author){
  const item=get(book,id),who=actor(author,"koordinator_tindak_lanjut_kelembagaan_demo");
  if(item.author.id!==who.id||item.status!=="draf")
    throw Error("Hanya koordinator asal dapat mengubah draf.");
  fresh(item,docket,sop);
  const plan=fields(input);
  if(item.plan.kind!==plan.kind||item.plan.source_ref!==plan.source_ref)
    throw Error("Jenis/sumber temuan tidak boleh diganti melalui revisi.");
  return move(book,item,"draf","perbaiki_rencana",who,
    "Rencana, petugas atau tenggat DEMO diubah sebelum penugasan.",{plan});
}
export function recordFinding(book,id,docket,sop,author){
  const item=get(book,id),who=actor(author,"koordinator_tindak_lanjut_kelembagaan_demo");
  if(item.status!=="draf"||item.author.id!==who.id)
    throw Error("Hanya koordinator asal boleh mencatat penugasan DEMO.");
  fresh(item,docket,sop);
  return move(book,item,"tercatat","catat_penugasan",who,
    "Rencana tercatat untuk "+item.plan.assignee_demo_id+
      "; bukan surat perintah atau penugasan resmi.");
}
export function startFollowupFinding(book,id,docket,sop,staff){
  const item=get(book,id),who=actor(staff,"petugas_perbaikan_kelembagaan_demo");
  if(item.status!=="tercatat"||item.plan.assignee_demo_id!==who.id)
    throw Error("Hanya petugas DEMO yang tercantum boleh memulai catatan.");
  fresh(item,docket,sop);
  return move(book,item,"dalam_proses","mulai_tindak_lanjut",who,
    "Penyusunan bukti/catatan perbaikan simulasi dimulai.");
}
export function addProgressNote(book,id,docket,sop,staff,note,evidenceRef){
  const item=get(book,id),who=actor(staff,"petugas_perbaikan_kelembagaan_demo");
  if(!["dalam_proses","perlu_perbaikan"].includes(item.status)||
    item.plan.assignee_demo_id!==who.id)
    throw Error("Petugas DEMO hanya dapat mencatat progres pada item yang aktif/dikembalikan.");
  fresh(item,docket,sop);
  if(item.progress.length>=25)throw Error("Maksimum 25 catatan progres per item DEMO.");
  const content=words(note,"Catatan upaya perbaikan",45,850);
  if(typeof evidenceRef!=="string"||!ID.test(evidenceRef))
    throw Error("Referensi hasil harus kode metadata fiktif DEMO-.");
  return move(book,item,"dalam_proses","catat_progres",who,
    "Catatan progres DEMO ditambahkan; belum membuktikan unsur kelembagaan telah terpenuhi.",
    {progress:[...item.progress,{note:content,evidence_ref_demo:evidenceRef,
      by_demo_id:who.id}]});
}
export function submitFindingResult(book,id,docket,sop,staff,resultNote,evidenceRef){
  const item=get(book,id),who=actor(staff,"petugas_perbaikan_kelembagaan_demo");
  if(item.status!=="dalam_proses"||item.plan.assignee_demo_id!==who.id)
    throw Error("Hasil hanya dapat diajukan petugas tertunjuk dari status dalam proses.");
  fresh(item,docket,sop);
  if(typeof evidenceRef!=="string"||!ID.test(evidenceRef))
    throw Error("Bukti hasil contoh harus kode DEMO-.");
  const result={note:words(resultNote,"Hasil tindak lanjut",60,900),
    evidence_ref_demo:evidenceRef,prepared_by_demo_id:who.id};
  return move(book,item,"menunggu_telaah","ajukan_hasil",who,
    "Hasil DEMO diajukan untuk pemeriksaan catatan, bukan konfirmasi dokumen sah.",
    {result,review:null});
}
export function reviewFindingResult(book,id,docket,sop,reviewer,decision,reason){
  const item=get(book,id),who=actor(reviewer,"penelaah_tindak_lanjut_kelembagaan_demo");
  if(item.status!=="menunggu_telaah"||!item.result||
    who.id===item.author.id||who.id===item.plan.assignee_demo_id)
    throw Error("Penelaah harus berbeda dari koordinator dan petugas pelaksana.");
  if(!["kembalikan","tutup_catatan"].includes(decision))
    throw Error("Tidak ada pilihan menyetujui integrasi atau mengesahkan SOP.");
  fresh(item,docket,sop);
  const comment=words(reason,"Pertimbangan pemeriksaan catatan",50,850);
  const status=decision==="kembalikan"?"perlu_perbaikan":"catatan_ditutup";
  return move(book,item,status,decision,who,comment,{
    review:{decision,note:comment,reviewer_demo_id:who.id,
      meaning:"HANYA CATATAN KERJA, BUKAN VERIFIKASI RIIL ATAU SIAP INTEGRASI"},
  });
}
export function cancelFollowupFinding(book,id,docket,sop,author,reason){
  const item=get(book,id),who=actor(author,"koordinator_tindak_lanjut_kelembagaan_demo");
  if(item.author.id!==who.id||CLOSE.has(item.status))
    throw Error("Hanya koordinator asal dapat membatalkan rencana terbuka.");
  fresh(item,docket,sop);
  return move(book,item,"dibatalkan","batalkan_rencana",who,
    words(reason,"Alasan pembatalan",45,650));
}
export function institutionalFollowupView(book,docket,sop,asOfDemo="2026-11-11"){
  validateRegistry(book);
  const asOf=day(asOfDemo);
  const rows=book.items.map(x=>{
    const source_stale=!sourceFresh(x,docket,sop);
    const open=!CLOSE.has(x.status);
    return {
      id:x.id,kind:x.plan.kind,kind_label:FINDING_KINDS[x.plan.kind],
      source_ref:x.plan.source_ref,source_label:x.source.source_label,
      description:x.plan.description,assignee_demo_id:x.plan.assignee_demo_id,
      due_date_demo:x.plan.due_date_demo,status:x.status,
      status_label:FOLLOWUP_STATES[x.status],revision:x.revision,
      source_stale,open,
      overdue_demo:open&&x.plan.due_date_demo<asOf,
      has_result:!!x.result,
      meaning:"Tugas administratif DEMO; tidak menyatakan kesiapan integrasi.",
    };
  });
  const by_status=Object.fromEntries(Object.keys(FOLLOWUP_STATES).map(k=>
    [k,rows.filter(x=>x.status===k).length]));
  return {
    schema:FOLLOWUP_REGISTER_SCHEMA,synthetic:true,as_of_demo:asOf,
    total:rows.length,open:rows.filter(x=>x.open).length,
    waiting_review:by_status.menunggu_telaah,
    needs_revision:by_status.perlu_perbaikan,
    overdue_demo:rows.filter(x=>x.overdue_demo).length,
    stale_open:rows.filter(x=>x.open&&x.source_stale).length,
    closed_notes:by_status.catatan_ditutup,cancelled:by_status.dibatalkan,
    by_status,rows,
    integration_readiness:"BELUM_DINILAI_DAN_TIDAK_DAPAT_DIPUTUSKAN_DARI_REGISTER",
  };
}
export function institutionalFollowupHandoff(book,id,docket,sop){
  const item=get(book,id),stale=!sourceFresh(item,docket,sop);
  return [
    "DRAF REGISTER TINDAK LANJUT PEMBAHASAN KELEMBAGAAN (M04-S9, BELUM DIUJI)",
    "Seluruh informasi DEMO; bukan keputusan pejabat, SOP disahkan atau persetujuan integrasi.",
    "Item: "+item.id+" | revisi "+item.revision+" | "+FOLLOWUP_STATES[item.status],
    "Sumber: "+item.source.source_label+" / "+item.plan.source_ref+
      " (M04-S8 r"+item.source.docket_revision+")",
    "Sumber berubah: "+(stale?"YA, PERLU PEMERIKSAAN ULANG":"Tidak terdeteksi pada DEMO"),
    "Kekurangan: "+item.plan.description,
    "Dampak: "+item.plan.impact,
    "Rencana perbaikan: "+item.plan.corrective_plan,
    "Keluaran diharapkan: "+item.plan.expected_output,
    "Penanggung jawab DEMO: "+item.plan.assignee_demo_id,
    "Tanggal rencana fiktif: "+item.plan.due_date_demo,
    "PROGRES:",
    ...item.progress.map((p,i)=>"- "+(i+1)+". "+p.note+" ["+p.evidence_ref_demo+"]"),
    "Hasil catatan: "+(item.result?.note??"BELUM ADA"),
    "Referensi hasil DEMO: "+(item.result?.evidence_ref_demo??"BELUM ADA"),
    "Penelaah DEMO: "+(item.review?.reviewer_demo_id??"BELUM ADA"),
    "Hasil telaah: "+(item.review?.note??"BELUM ADA"),
    "RIWAYAT:",...item.history.map(h=>"- r"+h.revision+" "+h.action+
      " ("+h.actor_demo_id+"): "+h.note),
    "PENUTUPAN CATATAN BUKAN BUKTI KESIAPAN KELEMBAGAAN ATAU IZIN INTEGRASI.",
    "Masih perlu keputusan resmi atas SOP, pemilik proses, SPBE, keamanan, pembiayaan dan kewenangan.",
    "Tidak ada penetapan bantuan, belanja, pengadaan, distribusi atau BAST.",
  ].join("\n");
}
