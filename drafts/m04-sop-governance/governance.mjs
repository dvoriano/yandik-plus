/**
 * M04-S8 | KODE DITULIS, BELUM DIUJI.
 * Readiness review and unit catalog change governance, exclusively DEMO.
 * This module NEVER enacts SOPs, changes the M04-S6/S7 source catalog,
 * routes official work, approves aid/funding, procures, delivers, or issues BAST.
 */
import { SOP_DRAFT_SCHEMA, unitCatalog } from "../m04-unit-catalog/unit_catalog.mjs";

export const GOVERNANCE_SCHEMA="M04-S8-GOVERNANCE-UNTESTED-1";
export const CHECK_STATES=Object.freeze({
  belum_diperiksa:"Belum diperiksa",
  perlu_klarifikasi:"Perlu klarifikasi kelembagaan",
  bahan_tersedia:"Bahan tersedia untuk diskusi, belum disahkan",
  tidak_berlaku:"Tidak berlaku, dengan alasan tertulis",
});
export const REVIEW_STATES=Object.freeze({
  draf:"Draf kajian kesiapan",
  menunggu_telaah:"Menunggu telaah kelembagaan DEMO",
  perlu_perbaikan:"Perlu perbaikan rancangan",
  dicatat_untuk_pembahasan:"Catatan diterima sebagai bahan pembahasan saja",
  tidak_direkomendasikan:"Rancangan tidak direkomendasikan",
});
export const CHANGE_TYPES=Object.freeze({
  tambah:"Usulkan unit DEMO baru",
  ubah:"Usulkan perubahan fungsi/batas unit DEMO",
  nonaktifkan:"Usulkan penonaktifan unit DEMO",
});
export const CHANGE_STATES=Object.freeze({
  draf:"Draf usulan perubahan",
  menunggu_telaah:"Usulan perubahan menunggu telaah",
  perlu_perbaikan:"Usulan perlu perbaikan",
  dicatat_untuk_pembahasan:"Usulan dicatat untuk pembahasan, BELUM diterapkan",
  tidak_direkomendasikan:"Perubahan tidak direkomendasikan",
});
export const REQUIREMENTS=Object.freeze([
  {id:"pemilik_proses",group:"Kelembagaan",title:"Pemilik proses dan pengampu SOP",mandatory:true},
  {id:"tupoksi",group:"Kelembagaan",title:"Kesesuaian tugas dan fungsi unit",mandatory:true},
  {id:"otorisasi",group:"Kewenangan",title:"Batas kewenangan dan pemisahan penelaah",mandatory:true},
  {id:"raci",group:"Kewenangan",title:"Peninjauan matriks RACI dan jalur eskalasi",mandatory:true},
  {id:"dasar_prosedur",group:"Tata kelola",title:"Dasar tata naskah dan prosedur dinas",mandatory:true},
  {id:"arsip_retensi",group:"Tata kelola",title:"Lokasi arsip, bukti dan masa simpan",mandatory:true},
  {id:"keamanan_akses",group:"Sistem",title:"Pengaturan akses, wilayah, dan perlindungan data",mandatory:true},
  {id:"spbe",group:"Sistem",title:"Koordinasi arsitektur dan tata kelola SPBE",mandatory:true},
  {id:"audit",group:"Sistem",title:"Jejak perubahan yang layak diaudit",mandatory:true},
  {id:"qa_lapangan",group:"Implementasi",title:"Pengujian fungsi, HP dan petugas lapangan",mandatory:true},
  {id:"sosialisasi",group:"Implementasi",title:"Penyampaian panduan/pembinaan pengguna",mandatory:false},
  {id:"integrasi",group:"Implementasi",title:"Kebutuhan integrasi sistem resmi",mandatory:false},
]);
const DEMO=/^DEMO-[A-Z0-9_-]{4,55}$/;
const KEY=/^[a-z][a-z0-9_]{2,44}_demo$/;
const BANNED=["approved","approval","sop_effective","official_signature","enacted",
  "allocation","budget","amount","recipient_selected","beneficiary","payment",
  "procurement","delivery","shipment","bast","official_decision","sk_issued",
  "authorization","authentic","legal_valid"];
function object(v,label){
  if(!v||typeof v!=="object"||Array.isArray(v))throw Error(label+" harus objek.");
  if(BANNED.some(k=>Object.hasOwn(v,k)))
    throw Error("Atribut persetujuan, keputusan, anggaran, atau BAST dilarang.");
  return v;
}
function keys(v,allowed,label){
  for(const k of Object.keys(object(v,label)))
    if(!allowed.includes(k))throw Error(label+" memuat kolom di luar rancangan: "+k);
}
function text(v,label,min=30,max=750){
  if(typeof v!=="string"||v.trim().length<min||v.trim().length>max)
    throw Error(label+" harus "+min+"–"+max+" karakter.");
  return v.trim();
}
function actor(v,role){
  keys(v,["role","id"],"Pelaku DEMO");
  if(v.role!==role||typeof v.id!=="string"||!DEMO.test(v.id))
    throw Error("Label peran/ID DEMO tidak sesuai.");
  return {role:v.role,id:v.id};
}
function sourceOf(sop){
  object(sop,"Naskah M04-S7");
  if(sop.schema!==SOP_DRAFT_SCHEMA||sop.synthetic!==true||
     sop.status!=="dicatat_untuk_bahan_sop"||
     sop.review?.action!=="catat_untuk_bahan_sop"||
     !DEMO.test(sop.review?.reviewer_demo_id??"")||
     !DEMO.test(sop.id??"")||
     !Number.isSafeInteger(sop.revision)||sop.revision<1||
     !sop.source||!sop.proposal)
    throw Error("M04-S8 hanya menerima naskah M04-S7 yang dicatat sebagai bahan SOP DEMO.");
  const catalog=unitCatalog();
  if(sop.catalog_version!==catalog.version||
     !catalog.units.some(u=>u.unit_key===sop.proposal.unit_key))
    throw Error("Versi katalog/rujukan unit M04-S7 tidak sesuai.");
  return {sop_id:sop.id,sop_revision:sop.revision,
    catalog_schema:catalog.schema,catalog_version:catalog.version,
    unit_key:sop.proposal.unit_key,
    source_signature_demo:JSON.stringify({
      schema:sop.schema,status:sop.status,source:sop.source,
      proposal:sop.proposal,review:sop.review,revision:sop.revision,
    }),
    meaning:"Snapshot DEMO bukan bukti legalitas, integritas dokumen, atau pengesahan SOP."};
}
function sameSource(docket,sop){
  try{return JSON.stringify(docket.source)===JSON.stringify(sourceOf(sop));}
  catch{return false;}
}
function requirement(id){
  const item=REQUIREMENTS.find(x=>x.id===id);
  if(!item)throw Error("Jenis persyaratan kelembagaan tidak dikenal.");
  return item;
}
function evidence(item,status,reference,note){
  const rule=requirement(item);
  if(!Object.hasOwn(CHECK_STATES,status))throw Error("Status pemeriksaan tidak valid.");
  const explanation=text(note,"Catatan "+rule.title,35,650);
  if(status==="bahan_tersedia"){
    if(typeof reference!=="string"||!DEMO.test(reference))
      throw Error("Bahan yang dicatat tersedia perlu kode referensi DEMO-.");
  }else if(reference!==""&&reference!==null&&reference!==undefined)
    throw Error("Kode bukti hanya digunakan pada status bahan tersedia.");
  if(status==="tidak_berlaku"&&rule.mandatory)
    throw Error("Persyaratan wajib tidak boleh dinyatakan tidak berlaku pada DEMO.");
  return {id:item,status,reference_demo:status==="bahan_tersedia"?reference:"",
    note:explanation};
}
function validateChangeInput(input){
  keys(input,["type","unit_key","candidate","reason","impact_routes",
    "impact_raci","impact_sop","rollback_note"],"Usulan katalog");
  if(!Object.hasOwn(CHANGE_TYPES,input.type)||!KEY.test(input.unit_key??""))
    throw Error("Jenis perubahan atau kunci unit DEMO tidak sesuai.");
  const current=unitCatalog().units.find(u=>u.unit_key===input.unit_key);
  if(input.type==="tambah"&&current)throw Error("Unit sudah ada dalam katalog sumber.");
  if(input.type!=="tambah"&&!current)throw Error("Unit yang akan diubah/dinonaktifkan tidak ada.");
  keys(input.candidate,["id","label","role","boundary","precondition",
    "example_contact"],"Profil usulan unit");
  const profile={
    id:input.candidate.id,label:text(input.candidate.label,"Nama unit",12,120),
    role:text(input.candidate.role,"Fungsi unit",35,500),
    boundary:text(input.candidate.boundary,"Batas kewenangan",35,500),
    precondition:text(input.candidate.precondition,"Prasyarat unit",35,500),
    example_contact:input.candidate.example_contact,
  };
  if(!DEMO.test(profile.id)||!DEMO.test(profile.example_contact))
    throw Error("ID dan kontak contoh wajib DEMO-.");
  if(current&&current.id!==profile.id)
    throw Error("Kode ID unit yang sudah ada harus tetap; gunakan proses perubahan identitas terpisah.");
  if(input.type==="nonaktifkan"&&
    ["id","label","role","boundary","precondition","example_contact"]
      .some(k=>profile[k]!==current[k]))
    throw Error("Penonaktifan harus menggunakan snapshot unit semula, bukan mengubah atribut.");
  const impact={
    reason:text(input.reason,"Alasan perubahan",50,850),
    impact_routes:text(input.impact_routes,"Dampak ke jalur M04-S6",45,750),
    impact_raci:text(input.impact_raci,"Dampak ke RACI M04-S7",45,750),
    impact_sop:text(input.impact_sop,"Dampak ke SOP/arsip",45,750),
    rollback_note:text(input.rollback_note,"Rencana pembatalan usulan",45,750),
  };
  return {type:input.type,unit_key:input.unit_key,candidate:profile,impact};
}
function checkDocket(docket){
  object(docket,"Berkas kesiapan DEMO");
  if(docket.schema!==GOVERNANCE_SCHEMA||docket.synthetic!==true||
    !Object.hasOwn(REVIEW_STATES,docket.status)||
    !Array.isArray(docket.checklist)||docket.checklist.length!==REQUIREMENTS.length||
    !Array.isArray(docket.changes)||docket.changes.length>20||
    !Number.isSafeInteger(docket.revision)||docket.revision<1||
    !Array.isArray(docket.history)||docket.history.length!==docket.revision||
    !docket.author||!DEMO.test(docket.author.id??"")||!docket.source)
    throw Error("Format berkas kesiapan atau histori DEMO tidak konsisten.");
  const ids=new Set();
  for(const c of docket.checklist){
    if(!c||ids.has(c.id))throw Error("Checklist memiliki ID ganda.");
    ids.add(c.id);
    if(c.status!=="belum_diperiksa")
      evidence(c.id,c.status,c.reference_demo,c.note);
    else if(c.reference_demo!==""||c.note!=="")
      throw Error("Checklist belum diperiksa tidak boleh mempunyai bukti.");
    else requirement(c.id);
  }
  if(REQUIREMENTS.some(r=>!ids.has(r.id)))throw Error("Daftar persyaratan tidak lengkap.");
  const changeIds=new Set();
  for(const c of docket.changes){
    if(changeIds.has(c.id)||!DEMO.test(c.id??"")||
       !Object.hasOwn(CHANGE_STATES,c.status)||
       !Number.isSafeInteger(c.revision)||c.revision<1||
       !Array.isArray(c.history)||c.history.length!==c.revision||
       !c.author||!DEMO.test(c.author.id??""))
      throw Error("Usulan perubahan/riwayat katalog tidak konsisten.");
    changeIds.add(c.id);
    const normalized=validateChangeInput({...c.input,
      candidate:{...c.input.candidate},
    });
    if(JSON.stringify(normalized)!==JSON.stringify(c.input))
      throw Error("Data usulan katalog tidak konsisten.");
  }
  return docket;
}
function event(action,who,revision,note){
  return {action,role:who.role,actor_demo_id:who.id,revision,note};
}
function update(docket,action,who,note,more={}){
  const revision=docket.revision+1;
  return {...docket,...more,revision,
    history:[...docket.history,event(action,who,revision,note)]};
}
function changeAt(docket,id){
  const x=docket.changes.find(c=>c.id===id);
  if(!x)throw Error("Usulan katalog DEMO tidak ditemukan.");
  return x;
}
function changeReplace(docket,item,who,action,note){
  const revision=item.revision+1;
  const next={...item,revision,
    history:[...item.history,event(action,who,revision,note)]};
  return update(docket,action,who,note,{
    changes:docket.changes.map(c=>c.id===item.id?next:c),
  });
}
export function createGovernanceDocket(sop,owner){
  const who=actor(owner,"pengampu_kelembagaan_demo");
  return {schema:GOVERNANCE_SCHEMA,synthetic:true,
    source:sourceOf(sop),status:"draf",revision:1,author:who,
    checklist:REQUIREMENTS.map(r=>({id:r.id,status:"belum_diperiksa",
      reference_demo:"",note:""})),
    changes:[],review:null,
    history:[event("buat_draf",who,1,
      "Daftar pemeriksaan disiapkan untuk kajian, bukan penetapan SOP.")],
  };
}
export function recordRequirement(docket,sop,id,status,reference,note,owner){
  const d=checkDocket(docket),who=actor(owner,"pengampu_kelembagaan_demo");
  if(!["draf","perlu_perbaikan"].includes(d.status)||d.author.id!==who.id)
    throw Error("Checklist hanya diubah penyusun pada draf/hasil pengembalian.");
  if(!sameSource(d,sop))throw Error("Sumber M04-S7 berubah; hentikan perubahan.");
  const data=evidence(id,status,reference,note);
  return update(d,"catat_persyaratan",who,
    "Kondisi persyaratan "+id+" diperbarui pada simulasi.",
    {status:"draf",review:null,
      checklist:d.checklist.map(x=>x.id===id?data:x)});
}
export function proposeCatalogChange(docket,sop,input,owner){
  const d=checkDocket(docket),who=actor(owner,"pengampu_kelembagaan_demo");
  if(!["draf","perlu_perbaikan"].includes(d.status)||d.author.id!==who.id)
    throw Error("Hanya penyusun dapat menambahkan usulan pada draf.");
  if(!sameSource(d,sop))throw Error("Sumber SOP berubah, kajian dihentikan.");
  if(d.changes.length>=20)throw Error("Maksimum 20 usulan DEMO.");
  const normalized=validateChangeInput(input);
  if(d.changes.some(c=>c.input.unit_key===normalized.unit_key&&
      !["tidak_direkomendasikan"].includes(c.status)))
    throw Error("Satu unit tidak boleh mempunyai dua usulan aktif bersamaan.");
  const id="DEMO-UBAH-UNIT-"+String(d.changes.length+1).padStart(3,"0");
  const change={id,synthetic:true,source_catalog_version:d.source.catalog_version,
    input:normalized,status:"draf",revision:1,author:who,review:null,
    history:[event("buat_usulan",who,1,
      "Usulan katalog tidak mengubah data sumber M04-S7 maupun matriks M04-S6.")],
  };
  return update(d,"tambah_usulan",who,"Usulan perubahan unit DEMO dibuat.",
    {status:"draf",review:null,changes:[...d.changes,change]});
}
export function submitCatalogChange(docket,sop,id,owner){
  const d=checkDocket(docket),who=actor(owner,"pengampu_kelembagaan_demo");
  const c=changeAt(d,id);
  if(!["draf","perlu_perbaikan"].includes(d.status)||c.status!=="draf"||
     c.author.id!==who.id||d.author.id!==who.id)
    throw Error("Hanya pemilik draf boleh mengajukan usulan katalog yang masih draf.");
  if(!sameSource(d,sop))throw Error("Naskah sumber M04-S7 berubah.");
  return changeReplace(d,{...c,status:"menunggu_telaah"},who,"ajukan_perubahan",
    "Perubahan katalog DEMO diajukan hanya untuk telaah, tidak diterapkan.");
}
export function reviewCatalogChange(docket,sop,id,reviewer,decision,reason){
  const d=checkDocket(docket),who=actor(reviewer,"penelaah_kelembagaan_demo");
  const c=changeAt(d,id);
  if(c.status!=="menunggu_telaah"||d.author.id===who.id)
    throw Error("Penelaah terpisah hanya dapat memeriksa usulan yang diajukan.");
  if(!["catat_untuk_pembahasan","minta_perbaikan","tidak_direkomendasikan"].includes(decision))
    throw Error("Tidak ada status pengesahan/perubahan katalog resmi.");
  if(!sameSource(d,sop))throw Error("Sumber M04-S7 berubah, telaah tertahan.");
  const comment=text(reason,"Pertimbangan usulan unit",50,750);
  const status=decision==="minta_perbaikan"?"perlu_perbaikan":
    decision==="catat_untuk_pembahasan"?"dicatat_untuk_pembahasan":"tidak_direkomendasikan";
  return changeReplace(d,{...c,status,review:{decision,reason:comment,
    reviewer_demo_id:who.id,meaning:"CATATAN KAJIAN, BUKAN PERUBAHAN KATALOG BERLAKU"}},
    who,decision,comment);
}
export function submitGovernanceDocket(docket,sop,owner){
  const d=checkDocket(docket),who=actor(owner,"pengampu_kelembagaan_demo");
  if(d.author.id!==who.id||!["draf","perlu_perbaikan"].includes(d.status))
    throw Error("Berkas harus dalam draf/hasil perbaikan dan diajukan penyusun.");
  if(!sameSource(d,sop))throw Error("Sumber M04-S7 berubah.");
  if(d.checklist.every(x=>x.status==="belum_diperiksa"))
    throw Error("Isi setidaknya satu unsur pemeriksaan sebelum mengajukan.");
  return update(d,"ajukan_telaah",who,
    "Berkas kesiapan DEMO diajukan untuk pemeriksaan kelembagaan, bukan pengesahan.",
    {status:"menunggu_telaah",review:null});
}
export function reviewGovernanceDocket(docket,sop,reviewer,decision,reason){
  const d=checkDocket(docket),who=actor(reviewer,"penelaah_kelembagaan_demo");
  if(d.status!=="menunggu_telaah"||who.id===d.author.id)
    throw Error("Penelaah harus terpisah dan berkas sedang menunggu kajian.");
  if(!["catat_untuk_pembahasan","minta_perbaikan","tidak_direkomendasikan"].includes(decision))
    throw Error("Tidak ada opsi pengesahan SOP/anggaran pada kajian.");
  if(!sameSource(d,sop))throw Error("Sumber M04-S7 berubah; telaah harus dihentikan.");
  const comment=text(reason,"Catatan telaah kelembagaan",50,850);
  const next=decision==="minta_perbaikan"?"perlu_perbaikan":
    decision==="catat_untuk_pembahasan"?"dicatat_untuk_pembahasan":"tidak_direkomendasikan";
  return update(d,decision,who,comment,{status:next,review:{
    decision,reason:comment,reviewer_demo_id:who.id,
    effect:"BAHAN DISKUSI; BUKAN PENGESAHAN SOP/UNIT/KEPUTUSAN BANTUAN"}});
}
export function governanceBoard(docket,sop){
  const d=checkDocket(docket);
  const by_state=Object.fromEntries(Object.keys(CHECK_STATES).map(k=>[k,0]));
  for(const item of d.checklist)by_state[item.status]++;
  const mandatoryMissing=d.checklist.filter(x=>
    requirement(x.id).mandatory&&x.status!=="bahan_tersedia");
  const pendingChanges=d.changes.filter(x=>!["dicatat_untuk_pembahasan",
    "tidak_direkomendasikan"].includes(x.status));
  return {
    schema:GOVERNANCE_SCHEMA,synthetic:true,source_changed:!sameSource(d,sop),
    docket_status:d.status,status_label:REVIEW_STATES[d.status],
    total:d.checklist.length,by_state,
    mandatory_pending:mandatoryMissing.length,
    pending_changes:pendingChanges.length,
    catalog_change_count:d.changes.length,
    discussion_note:mandatoryMissing.length===0?
      "Seluruh bahan wajib DEMO tercatat; BELUM diverifikasi riil atau disahkan.":
      "Masih ada persyaratan wajib yang belum lengkap untuk bahan pembahasan.",
    items:d.checklist.map(x=>({...x,...requirement(x.id)})),
    changes:d.changes.map(x=>({id:x.id,type:CHANGE_TYPES[x.input.type],
      unit_key:x.input.unit_key,status:CHANGE_STATES[x.status],
      reason:x.input.impact.reason,review_note:x.review?.reason??null})),
    status_boundary:"Tidak ada SOP berlaku, perubahan katalog aktif, bantuan, anggaran atau BAST.",
  };
}
export function governanceHandoff(docket,sop){
  const d=checkDocket(docket),board=governanceBoard(d,sop);
  return [
    "DRAF PEMERIKSAAN KELEMBAGAAN DAN PERUBAHAN KATALOG YANDIK+ M04-S8",
    "KODE BELUM DIUJI; data seluruhnya DEMO, bukan persetujuan atau berita acara resmi.",
    "Sumber: "+d.source.sop_id+" r"+d.source.sop_revision+
      "; katalog versi "+d.source.catalog_version,
    "Status: "+REVIEW_STATES[d.status]+"; revisi "+d.revision,
    "Sumber berubah: "+(board.source_changed?"YA, HENTIKAN PENGGUNAAN":"Tidak terdeteksi pada simulasi"),
    "Jumlah syarat: "+board.total+"; syarat wajib belum tersedia: "+board.mandatory_pending,
    "Catatan: "+board.discussion_note,
    "PERSYARATAN:",
    ...board.items.map(x=>"- "+x.title+" ["+CHECK_STATES[x.status]+"]"+
      " | rujukan "+(x.reference_demo||"-")+
      " | "+(x.note||"Belum ditelaah")),
    "USULAN PERUBAHAN KATALOG (TIDAK DITERAPKAN):",
    ...d.changes.map(x=>"- "+x.id+" "+CHANGE_TYPES[x.input.type]+" "+x.input.unit_key+
      " ["+CHANGE_STATES[x.status]+"]; alasan: "+x.input.impact.reason+
      "; dampak rute: "+x.input.impact.impact_routes+
      "; dampak RACI: "+x.input.impact.impact_raci+
      "; dampak SOP: "+x.input.impact.impact_sop+
      "; rencana rollback: "+x.input.impact.rollback_note),
    "Penelaahan: "+(d.review?.reason||"BELUM ADA"),
    "RIWAYAT:",...d.history.map(h=>"- r"+h.revision+" "+h.action+
      " "+h.actor_demo_id+": "+h.note),
    "Seluruh perubahan masih bahan pembahasan; katalog M04-S7 tetap tidak berubah.",
    "Tidak ada pengesahan SOP, disposisi, anggaran, pengadaan, penyaluran atau BAST.",
  ].join("\n");
}
