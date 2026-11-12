/**
 * M04-S7 | KODE DITULIS, BELUM DIUJI.
 * DEMO unit catalog, responsibility (RACI) matrix, and SOP discussion draft.
 * Reads an M04-S6 advisory note. NEVER dispatches, issues official SOP/letter,
 * approves aid, allocates funds, procures, distributes, or creates BAST.
 * DEMO role labels are NOT authentication; history is NOT a legal audit trail.
 */
import { CATEGORIES, ESCALATION_SCHEMA, escalationList } from "../m04-admin-escalations/escalations.mjs";
import {
  UNIT_LABELS, DEMO_DESTINATIONS, ROUTE_NOTE_SCHEMA, ROUTING_STATUSES,
} from "../m04-escalation-matrix/routing_matrix.mjs";

export const CATALOG_SCHEMA="M04-S7-CATALOG-DRAFT-UNTESTED-1";
export const SOP_DRAFT_SCHEMA="M04-S7-SOP-DRAFT-UNTESTED-1";
export const SOP_STATES=Object.freeze({
  draf:"Draf aturan koordinasi untuk dibahas",
  menunggu_telaah:"Menunggu telaah substansi administratif DEMO",
  perlu_perbaikan:"Perlu perbaikan naskah konsep",
  dicatat_untuk_bahan_sop:"Dicatat sebagai bahan penyusunan SOP, bukan pengesahan",
  tidak_direkomendasikan:"Draf aturan tidak direkomendasikan",
});
export const ROLES=Object.freeze({
  pelapor_demo:"Petugas pelapor kendala (DEMO)",
  koordinator_demo:"Koordinator koordinasi administratif (DEMO)",
  penerima_demo:"Penerima/unit tujuan administratif (DEMO)",
  penelaah_demo:"Penelaah alur administrasi (DEMO)",
  pengampu_proses_demo:"Pengampu rancangan proses (DEMO)",
});
export const UNITS=Object.freeze({
  arsip_demo:{
    id:DEMO_DESTINATIONS.arsip_demo,label:UNIT_LABELS.arsip_demo,
    role:"Menyiapkan penelusuran metadata, kelengkapan bukti dan daftar pertanyaan arsip.",
    boundary:"Tidak memvalidasi surat dari penerbit atau menerbitkan dokumen resmi.",
    precondition:"Perlu sumber metadata lengkap dan verifikasi pihak penerbit di luar sistem.",
    example_contact:"DEMO-KONTAK-ARSIP-01",
  },
  pengampu_teknis_demo:{
    id:DEMO_DESTINATIONS.pengampu_teknis_demo,label:UNIT_LABELS.pengampu_teknis_demo,
    role:"Menyiapkan penjelasan kecocokan kebutuhan Puskeswan dan data teknis.",
    boundary:"Tidak menentukan penerima bantuan, kuantitas pengadaan atau pagu anggaran.",
    precondition:"Perlu telaah kebutuhan serta kondisi fasilitas melalui pemilik data.",
    example_contact:"DEMO-KONTAK-TEKNIS-01",
  },
  koordinator_demo:{
    id:DEMO_DESTINATIONS.koordinator_demo,label:UNIT_LABELS.koordinator_demo,
    role:"Memfasilitasi pembahasan lintas pihak dan memperjelas pembagian pekerjaan.",
    boundary:"Tidak menerbitkan disposisi, surat tugas, keputusan atau persetujuan anggaran.",
    precondition:"Perlu alasan koordinasi, sumber kendala dan peran yang disepakati.",
    example_contact:"DEMO-KONTAK-KOORDINASI-01",
  },
  penelaah_prosedur_demo:{
    id:DEMO_DESTINATIONS.penelaah_prosedur_demo,label:UNIT_LABELS.penelaah_prosedur_demo,
    role:"Menyiapkan tinjauan administrasi, alur pencatatan dan persyaratan prosedur.",
    boundary:"Tidak mengesahkan SOP, keabsahan surat, pembelian atau BAST.",
    precondition:"Perlu dasar prosedur yang ditetapkan pemilik proses di luar simulasi.",
    example_contact:"DEMO-KONTAK-PROSEDUR-01",
  },
});
const ACTIVITIES=Object.freeze([
  {key:"lapor_kendala",label:"Laporan kendala dan metadata awal",R:"pelapor_demo",A:"koordinator_demo",C:["penerima_demo"],I:["penelaah_demo"]},
  {key:"susun_alur",label:"Penyusunan pilihan unit dan alasan",R:"koordinator_demo",A:"koordinator_demo",C:["penerima_demo","penelaah_demo"],I:["pelapor_demo"]},
  {key:"telaah_alur",label:"Telaah pilihan alur untuk pembahasan",R:"penelaah_demo",A:"pengampu_proses_demo",C:["koordinator_demo"],I:["pelapor_demo","penerima_demo"]},
  {key:"siapkan_tanggapan",label:"Penyiapan tanggapan administratif",R:"penerima_demo",A:"koordinator_demo",C:["pelapor_demo"],I:["penelaah_demo"]},
  {key:"perbaikan_data",label:"Perbaikan rujukan dan catatan",R:"pelapor_demo",A:"koordinator_demo",C:["penerima_demo"],I:["penelaah_demo"]},
  {key:"susun_draf_sop",label:"Penyusunan konsep SOP untuk telaah",R:"pengampu_proses_demo",A:"pengampu_proses_demo",C:["koordinator_demo","penelaah_demo"],I:["pelapor_demo","penerima_demo"]},
]);
const DEMO=/^DEMO-[A-Z0-9_-]{4,55}$/;
const BANNED=["approved","approval","allocation","budget","amount","nominal",
  "recipient_selected","beneficiary","procurement","purchase_order","payment",
  "delivery","shipment","bast","official_decision","official_sop","legal_valid",
  "signature","sk_issued","authorization"];
function object(value,name){
  if(!value||typeof value!=="object"||Array.isArray(value))
    throw Error(name+" harus objek.");
  if(BANNED.some(k=>Object.hasOwn(value,k)))
    throw Error("Kolom kewenangan/keuangan/keputusan resmi tidak diizinkan pada rancangan.");
  return value;
}
function only(value,keys,name){
  for(const k of Object.keys(object(value,name)))
    if(!keys.includes(k))throw Error(name+" mengandung kolom tak dikenal: "+k);
}
function text(value,label,min,max){
  if(typeof value!=="string"||value.trim().length<min||value.trim().length>max)
    throw Error(label+" wajib "+min+"–"+max+" karakter.");
  return value.trim();
}
function actor(raw,role){
  only(raw,["role","id"],"Identitas DEMO");
  if(raw.role!==role||typeof raw.id!=="string"||!DEMO.test(raw.id))
    throw Error("Pelaku harus memakai ID dan label peran DEMO yang sesuai.");
  return {role:raw.role,id:raw.id};
}
function isoDay(value){
  if(typeof value!=="string"||!/^20\d{2}-\d{2}-\d{2}$/.test(value))
    throw Error("Tanggal rencana DEMO wajib YYYY-MM-DD.");
  const date=new Date(value+"T00:00:00Z");
  if(Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==value)
    throw Error("Tanggal kalender DEMO tidak sah.");
  return value;
}
function form(input){
  only(input,["unit_key","coordination_scope","minimum_checks","exception_path",
    "recordkeeping_note","review_day_demo","rationale"],"Rancangan aturan");
  if(!Object.hasOwn(UNITS,input.unit_key))
    throw Error("Unit di luar katalog DEMO tidak dapat dipilih.");
  return {
    unit_key:input.unit_key,
    coordination_scope:text(input.coordination_scope,"Lingkup tanggung jawab",45,600),
    minimum_checks:text(input.minimum_checks,"Pemeriksaan awal",50,700),
    exception_path:text(input.exception_path,"Alur saat ada kendala lanjutan",45,650),
    recordkeeping_note:text(input.recordkeeping_note,"Catatan dan arsip",40,600),
    review_day_demo:isoDay(input.review_day_demo),
    rationale:text(input.rationale,"Alasan pengusulan SOP",45,650),
  };
}
/**
 * An M04-S6 note can only be used if reviewed as discussion material.
 * This comparison is informational: snapshot strings are not signed records.
 */
function routeSource(note,book,tasks,register,dossier){
  object(note,"Catatan rute M04-S6");
  if(note.schema!==ROUTE_NOTE_SCHEMA||note.synthetic!==true||
     note.status!=="dicatat_untuk_pembahasan"||
     note.review?.decision!=="catat_untuk_pembahasan"||
     !DEMO.test(note.review?.reviewer_demo_id??"")||
     !DEMO.test(note.source?.ticket_id??"")||
     !Object.hasOwn(UNITS,note.chosen_unit)||
     note.chosen_recipient_id!==UNITS[note.chosen_unit].id)
    throw Error("Sumber wajib catatan M04-S6 DEMO yang ditelaah sebagai bahan pembahasan.");
  if(!book||book.schema!==ESCALATION_SCHEMA||book.synthetic!==true)
    throw Error("Buku kendala sumber harus DEMO.");
  const ticket=book.tickets.find(x=>x.id===note.source.ticket_id);
  const row=escalationList(book,tasks,register,dossier).find(x=>x.id===note.source.ticket_id);
  if(!ticket||!row||row.source_stale||ticket.synthetic!==true||
     !["dilaporkan","diteruskan","ditanggapi","perlu_klarifikasi"].includes(ticket.state)||
     !Object.hasOwn(CATEGORIES,ticket.details.category))
    throw Error("Kendala sumber tak tersedia, stale, atau sudah ditutup.");
  const expected=JSON.stringify({
    id:ticket.id,revision:ticket.revision,state:ticket.state,
    source:ticket.source,details:ticket.details,history:ticket.history,
  });
  if(note.source.revision!==ticket.revision||
     note.source.signature_demo!==expected||
     note.source.category!==ticket.details.category||
     note.source.urgency!==ticket.details.urgency)
    throw Error("Rute M04-S6 berubah terhadap sumber; perlu telaah baru.");
  return {
    note_id:note.id,route_note_revision:note.revision,
    ticket_id:ticket.id,ticket_revision:ticket.revision,
    unit_key:note.chosen_unit,unit_id:note.chosen_recipient_id,
    route_note_signature_demo:JSON.stringify({
      source:note.source,unit:note.chosen_unit,recipient:note.chosen_recipient_id,
      status:note.status,review:note.review,revision:note.revision,
    }),
    source_signature_demo:note.source.signature_demo,
  };
}
function sourceCurrent(draft,note,book,tasks,register,dossier){
  try{return JSON.stringify(draft.source)===
    JSON.stringify(routeSource(note,book,tasks,register,dossier));}
  catch{return false;}
}
function event(action,by,revision,reason){
  return {action,revision,role:by.role,actor_demo_id:by.id,reason};
}
function validateDraft(draft){
  object(draft,"Draf aturan koordinasi");
  if(draft.schema!==SOP_DRAFT_SCHEMA||draft.synthetic!==true||
     !DEMO.test(draft.id??"")||!Object.hasOwn(SOP_STATES,draft.status)||
     !draft.source||!Object.hasOwn(UNITS,draft.source.unit_key)||
     !Number.isSafeInteger(draft.revision)||draft.revision<1||
     !Array.isArray(draft.history)||draft.history.length!==draft.revision||
     !draft.author||!DEMO.test(draft.author.id??"")||
     JSON.stringify(form(draft.proposal))!==JSON.stringify(draft.proposal))
    throw Error("Struktur draf SOP tidak konsisten.");
  if(draft.proposal.unit_key!==draft.source.unit_key)
    throw Error("Unit proposal tidak sesuai unit yang ditelaah pada M04-S6.");
  return draft;
}
export function unitCatalog(){
  return {schema:CATALOG_SCHEMA,synthetic:true,version:1,units:
    Object.entries(UNITS).map(([unit_key,data])=>({
      unit_key,...data,policy_status:"DEMO_BELUM_DISAHKAN",
    })),
    note:"Unit fiktif untuk penyusunan konsep, bukan susunan organisasi atau izin tindakan."};
}
export function responsibilityMatrix(){
  return {schema:CATALOG_SCHEMA,synthetic:true,
    roles:Object.entries(ROLES).map(([key,label])=>({key,label})),
    activities:ACTIVITIES.map(item=>({...item,C:[...item.C],I:[...item.I],
      meaning:"RACI DEMO, belum menjadi pembagian kewenangan resmi"})),
    note:"R=pelaksana; A=penanggung jawab proses contoh; C=konsultasi; I=informasi. Bukan kewenangan pejabat."};
}
export function prepareCoordinationDraft(routeNote,book,tasks,register,dossier,input,author){
  const who=actor(author,"pengampu_proses_demo");
  const source=routeSource(routeNote,book,tasks,register,dossier);
  const proposal=form(input);
  if(proposal.unit_key!==source.unit_key)
    throw Error("Pilihan unit berbeda dari catatan rute M04-S6. Ubah rute di proses terpisah.");
  return {
    schema:SOP_DRAFT_SCHEMA,synthetic:true,id:"DEMO-SOP-DRAFT-001",
    source,catalog_version:1,proposal,status:"draf",revision:1,
    author:who,review:null,
    history:[event("buat_draf",who,1,
      "Konsep unit dan koordinasi dibuat sebagai bahan telaah, bukan SOP berlaku.")],
  };
}
export function submitCoordinationDraft(draft,routeNote,book,tasks,register,dossier,author){
  const d=validateDraft(draft),who=actor(author,"pengampu_proses_demo");
  if(d.author.id!==who.id||d.status!=="draf")
    throw Error("Hanya penyusun boleh mengajukan draf yang masih aktif.");
  if(!sourceCurrent(d,routeNote,book,tasks,register,dossier))
    throw Error("Rute/sumber eskalasi berubah. Konsep harus diperiksa ulang.");
  const revision=d.revision+1;
  return {...d,status:"menunggu_telaah",revision,
    history:[...d.history,event("ajukan_telaah",who,revision,
      "Draf dikirim hanya untuk telaah naskah contoh, bukan pengesahan SOP.")],
  };
}
export function reviewCoordinationDraft(draft,routeNote,book,tasks,register,dossier,reviewer,action,reason){
  const d=validateDraft(draft),who=actor(reviewer,"penelaah_sop_demo");
  if(d.status!=="menunggu_telaah"||who.id===d.author.id)
    throw Error("Telaah wajib oleh peran DEMO lain pada status menunggu.");
  if(!["catat_untuk_bahan_sop","minta_perbaikan","tidak_direkomendasikan"].includes(action))
    throw Error("Tidak ada aksi mengesahkan SOP atau persetujuan bantuan.");
  if(!sourceCurrent(d,routeNote,book,tasks,register,dossier))
    throw Error("Rute M04-S6/sumber kendala sudah berubah, jangan meneruskan telaah.");
  const comment=text(reason,"Catatan penelaah",50,750);
  const status=action==="minta_perbaikan"?"perlu_perbaikan":
    action==="catat_untuk_bahan_sop"?"dicatat_untuk_bahan_sop":"tidak_direkomendasikan";
  const revision=d.revision+1;
  return {...d,status,revision,review:{
    action,reason:comment,reviewer_demo_id:who.id,
    effect:"CATATAN TELAah DEMO, BUKAN PENGESAHAN SOP ATAU DISPOSISI",
  },
  history:[...d.history,event(action,who,revision,comment)]};
}
export function reviseCoordinationDraft(draft,routeNote,book,tasks,register,dossier,input,author){
  const d=validateDraft(draft),who=actor(author,"pengampu_proses_demo");
  if(d.status!=="perlu_perbaikan"||d.author.id!==who.id)
    throw Error("Hanya pengampu asal boleh merevisi naskah yang dikembalikan.");
  if(!sourceCurrent(d,routeNote,book,tasks,register,dossier))
    throw Error("Rute/sumber berubah; perlu naskah baru dari catatan terbaru.");
  const proposal=form(input);
  if(proposal.unit_key!==d.source.unit_key)
    throw Error("Unit berbeda dari M04-S6, perlu telaah rute di modul sebelumnya.");
  const revision=d.revision+1;
  return {...d,proposal,status:"draf",revision,review:null,
    history:[...d.history,event("revisi_naskah",who,revision,
      "Konsep diperbaiki dengan mempertahankan catatan telaah sebelumnya.")],
  };
}
export function coordinationDraftText(draft,routeNote,book,tasks,register,dossier){
  const d=validateDraft(draft);
  const stale=!sourceCurrent(d,routeNote,book,tasks,register,dossier);
  const unit=UNITS[d.proposal.unit_key];
  return [
    "RANCANGAN ATURAN KOORDINASI ADMINISTRATIF (DEMO, BELUM DIUJI)",
    "BUKAN SOP DISAHKAN, DISPOSISI RESMI, KEPUTUSAN BANTUAN, ANGGARAN ATAU BAST.",
    "Sumber M04-S6: "+d.source.note_id+" v"+d.source.route_note_revision+
      "; eskalasi: "+d.source.ticket_id+" v"+d.source.ticket_revision,
    "Status naskah: "+SOP_STATES[d.status]+"; revisi "+d.revision,
    "Sumber berubah: "+(stale?"YA, STOP UNTUK TELAAH":"Tidak terdeteksi pada snapshot DEMO"),
    "Unit untuk pembahasan: "+unit.label+" / "+unit.id,
    "Fungsi rancangan unit: "+unit.role,
    "Batas kewenangan: "+unit.boundary,
    "Prasyarat: "+unit.precondition,
    "Lingkup koordinasi: "+d.proposal.coordination_scope,
    "Pemeriksaan minimum: "+d.proposal.minimum_checks,
    "Bila ada kendala lanjutan: "+d.proposal.exception_path,
    "Pencatatan/arsip yang diusulkan: "+d.proposal.recordkeeping_note,
    "Tanggal kajian DEMO: "+d.proposal.review_day_demo,
    "Pertimbangan pengampu DEMO: "+d.proposal.rationale,
    "Catatan penelaah DEMO: "+(d.review?.reason??"BELUM ADA"),
    "Matriks RACI DEMO masih memerlukan telaah pimpinan/pemilik proses.",
    "Histori:",...d.history.map(h=>"- v"+h.revision+" "+h.action+
      " ("+h.actor_demo_id+"): "+h.reason),
    "Tidak ada pengesahan, penugasan, pengiriman, penetapan penerima, pembiayaan, pengadaan, distribusi atau BAST.",
  ].join("\n");
}
