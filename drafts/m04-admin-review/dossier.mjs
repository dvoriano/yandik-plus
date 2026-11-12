/**
 * M04-S1 | KODE DITULIS, BELUM DIUJI.
 * Preparatory administrative dossier for DEMO verified needs ONLY.
 * No officer decision, authorization, allocation, procurement, distribution or BAST.
 * Roles are labels, not authentication. No storage, timestamps, or real data.
 */
export const DOSSIER_SCHEMA = "M04-S1-UNTESTED-1";
export const REQUIREMENTS = Object.freeze([
  { id:"identitas_fasilitas", label:"Identitas dan wilayah Puskeswan" },
  { id:"kebutuhan_terverifikasi", label:"Sumber kebutuhan terverifikasi" },
  { id:"alasan_teknis", label:"Alasan kebutuhan dan kondisi fasilitas" },
  { id:"referensi_bukti", label:"Referensi bukti administratif (metadata contoh)" },
  { id:"dasar_program", label:"Kesesuaian rencana kegiatan/program (untuk ditelaah)" },
]);
export const CHECK_STATUSES = Object.freeze({
  ada:"Ada dalam data contoh, belum diaudit resmi",
  belum_ada:"Belum ada",
  perlu_klarifikasi:"Perlu klarifikasi",
});
export const STATUSES = Object.freeze({
  draf:"Draf berkas administrasi",
  diajukan:"Menunggu pemeriksaan kelengkapan",
  perlu_perbaikan:"Berkas perlu dilengkapi",
  tercatat_untuk_pertimbangan:"Bahan pertimbangan tercatat, bukan persetujuan",
});
const CODE=/^DEMO-[A-Z0-9_-]{4,55}$/;
const FORBIDDEN=[
  "approved","approved_budget","allocation","amount","recipient_selected",
  "official_number","signature","official_date","signed_at","bast","delivery",
  "payment","purchase_order","procurement","funding_approved","decision",
  "authorized_approval","policy_approved","sk","nomor_sk",
];
function object(value,label) {
  if(!value || typeof value!=="object" || Array.isArray(value))throw Error(label+" harus objek.");
  if(FORBIDDEN.some(k=>Object.hasOwn(value,k)))
    throw Error(label+" tidak boleh memuat keputusan, anggaran, pengadaan atau BAST.");
  return value;
}
function only(value,allowed,label) {
  for(const key of Object.keys(object(value,label))) {
    if(!allowed.includes(key))throw Error("Kolom tidak diizinkan pada "+label+": "+key);
  }
}
function text(value,name,min,max) {
  if(typeof value!=="string"||value.trim().length<min||value.trim().length>max)
    throw Error(name+" harus "+min+"–"+max+" karakter.");
  return value.trim();
}
function actor(value,role) {
  only(value,["role","id"],"peran DEMO");
  if(value.role!==role||typeof value.id!=="string"||!CODE.test(value.id))
    throw Error("Peran DEMO tidak sesuai; ini bukan mekanisme login.");
  return {role:value.role,id:value.id};
}
function source(input) {
  only(input,["need_id","puskeswan_id","region_demo","item","quantity","unit","status",
    "evidence_status","priority_band","priority_status","source_version","synthetic"],"sumber kebutuhan");
  if(input.synthetic!==true||!CODE.test(input.need_id??"")||
     !CODE.test(input.puskeswan_id??"")||
     typeof input.region_demo!=="string"||!input.region_demo.startsWith("Wilayah fiktif ")||
     typeof input.item!=="string"||input.item.trim().length<8||input.item.length>120||
     !Number.isSafeInteger(input.quantity)||input.quantity<1||input.quantity>100000||
     !["unit","paket","set","buah"].includes(input.unit)||
     input.status!=="terverifikasi"||input.evidence_status!=="metadata_demo"||
     !["belum_dinilai","ditinjau"].includes(input.priority_status)||
     (input.priority_status==="belum_dinilai"&&input.priority_band!==null)||
     (input.priority_status==="ditinjau"&&!["rendah","sedang","tinggi"].includes(input.priority_band))||
     !Number.isSafeInteger(input.source_version)||input.source_version<1)
    throw Error("Sumber harus kebutuhan DEMO terverifikasi dengan metadata dan versi yang sah.");
  return {
    need_id:input.need_id,puskeswan_id:input.puskeswan_id,
    region_demo:input.region_demo,item:input.item.trim(),quantity:input.quantity,
    unit:input.unit,status:input.status,evidence_status:input.evidence_status,
    priority_status:input.priority_status,priority_band:input.priority_band,
    source_version:input.source_version,synthetic:true,
  };
}
function contents(input) {
  only(input,["purpose","technical_context","limitations","evidence_ref","requirements"],"isi berkas");
  const raw=object(input.requirements,"checklist");
  only(raw,REQUIREMENTS.map(r=>r.id),"checklist");
  const requirements={};
  for(const req of REQUIREMENTS) {
    const value=raw[req.id]??"belum_ada";
    if(!Object.hasOwn(CHECK_STATUSES,value))throw Error("Nilai checklist tidak dikenal.");
    requirements[req.id]=value;
  }
  if(typeof input.evidence_ref!=="string"||!CODE.test(input.evidence_ref))
    throw Error("Bukti contoh harus kode DEMO-..., bukan berkas atau URL nyata.");
  return {
    purpose:text(input.purpose,"Tujuan dan manfaat usulan",35,550),
    technical_context:text(input.technical_context,"Kondisi teknis",35,550),
    limitations:text(input.limitations,"Batasan administrasi",30,550),
    evidence_ref:input.evidence_ref,
    requirements,
  };
}
function history(action,person,version,note) {
  return {action,version,role:person.role,actor_demo_id:person.id,note};
}
function packet(record) {
  object(record,"berkas");
  if(record.schema!==DOSSIER_SCHEMA||record.synthetic!==true||
    !Object.hasOwn(STATUSES,record.status)||
    !Number.isSafeInteger(record.version)||record.version<1||
    !Array.isArray(record.history)||record.history.length!==record.version||
    !record.creator||!CODE.test(record.creator.id??""))
    throw Error("Berkas atau riwayat tidak sah.");
  const verifiedSource=source(record.need_snapshot);
  const normalized=contents(record.content);
  if(JSON.stringify(normalized)!==JSON.stringify(record.content)||
     JSON.stringify(verifiedSource)!==JSON.stringify(record.need_snapshot))
    throw Error("Referensi berkas DEMO tidak konsisten.");
  return record;
}
export function pendingRequirements(record) {
  packet(record);
  return REQUIREMENTS.filter(r=>record.content.requirements[r.id]!=="ada").map(r=>r.id);
}
export function createDossier(needInput,fields,creatorInput) {
  const need=source(needInput);
  const content=contents(fields);
  const creator=actor(creatorInput,"penyusun_prov_demo");
  return {
    schema:DOSSIER_SCHEMA,synthetic:true,id:"DEMO-DOSSIER-01",
    need_snapshot:need,content,status:"draf",version:1,creator,review:null,
    history:[history("buat_draf",creator,1,"Berkas simulasi dibuat; tidak ada komitmen bantuan.")],
  };
}
export function reviseDossier(record,fields,whoInput) {
  packet(record);
  const who=actor(whoInput,"penyusun_prov_demo");
  if(who.id!==record.creator.id||!["draf","perlu_perbaikan"].includes(record.status))
    throw Error("Berkas hanya bisa diperbaiki penyusun pada status draf/perlu perbaikan.");
  const content=contents(fields);
  const version=record.version+1;
  return {
    ...record,content,status:"draf",version,review:null,
    history:[...record.history,history("perbaiki_draf",who,version,
      "Kelengkapan dan catatan diperbarui; histori sebelumnya tetap tersimpan.")],
  };
}
export function submitDossier(record,whoInput) {
  packet(record);
  const who=actor(whoInput,"penyusun_prov_demo");
  if(who.id!==record.creator.id||record.status!=="draf")
    throw Error("Hanya draf penyusun yang dapat diajukan.");
  const missing=pendingRequirements(record);
  if(missing.length)throw Error("Kelengkapan masih perlu diperiksa: "+missing.join(", ")+".");
  const version=record.version+1;
  return {...record,status:"diajukan",version,
    history:[...record.history,history("ajukan_pemeriksaan",who,version,
      "Dikirim untuk pemeriksaan administratif, bukan permohonan pembayaran.")],
  };
}
export function reviewDossier(record,whoInput,action,reason) {
  packet(record);
  const who=actor(whoInput,"penelaah_administrasi_demo");
  if(record.status!=="diajukan"||who.id===record.creator.id)
    throw Error("Telaah hanya untuk berkas diajukan dan bukan oleh pembuat.");
  if(!["kembalikan","catat_bahan"].includes(action))
    throw Error("Tindakan tidak tersedia; tidak ada opsi menyetujui anggaran.");
  const note=text(reason,"Catatan penelaah",35,650);
  const version=record.version+1;
  const status=action==="kembalikan"?"perlu_perbaikan":"tercatat_untuk_pertimbangan";
  return {...record,status,version,
    review:{
      action,reviewer_demo_id:who.id,note,
      effect:"CATATAN ADMINISTRASI SAJA, BUKAN PERSETUJUAN ATAU PENETAPAN",
    },
    history:[...record.history,history(action,who,version,note)],
  };
}
export function sourceIsStale(record,currentNeed) {
  packet(record);
  try {
    return JSON.stringify(source(currentNeed))!==JSON.stringify(record.need_snapshot);
  } catch {
    return true;
  }
}
export function handoffNote(record) {
  packet(record);
  const unresolved=pendingRequirements(record);
  const lines=[
    "DRAF BAHAN PERTIMBANGAN ADMINISTRASI (DATA FIKTIF, BELUM DIUJI)",
    "Bukan penetapan pejabat, berita acara resmi, SK, keputusan bantuan atau anggaran.",
    "ID kajian: "+record.id+" | status: "+STATUSES[record.status]+" | versi: "+record.version,
    "Sumber DEMO: "+record.need_snapshot.need_id+" / "+record.need_snapshot.puskeswan_id,
    "Usulan: "+record.need_snapshot.item+" ("+record.need_snapshot.quantity+" "+record.need_snapshot.unit+")",
    "Prioritas sumber (informasi saja): "+(record.need_snapshot.priority_band??"belum dinilai"),
    "Tujuan: "+record.content.purpose,
    "Konteks teknis: "+record.content.technical_context,
    "Batasan: "+record.content.limitations,
    "Referensi bukti metadata: "+record.content.evidence_ref,
    "Checklist belum lengkap: "+(unresolved.join(", ")||"Tidak ada yang ditandai belum lengkap; belum diverifikasi resmi"),
    "Catatan penelaah: "+(record.review?.note??"BELUM ADA"),
    "Status tindak lanjut: "+(record.status==="tercatat_untuk_pertimbangan"
      ?"Bahan dapat dipertimbangkan melalui jalur pejabat yang sah; TIDAK diteruskan otomatis."
      :"Masih dalam rangkaian administrasi DEMO."),
    "Riwayat perubahan:",
    ...record.history.map(h=>"- v"+h.version+" "+h.action+" ["+h.role+"/"+h.actor_demo_id+"]: "+h.note),
    "Tidak ada penerima ditetapkan, nominal, paket pengadaan, penyaluran, BAST atau tanda tangan.",
  ];
  return lines.join("\n");
}
