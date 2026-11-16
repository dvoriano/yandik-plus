/**
 * M04-S10 | KODE DITULIS, BELUM DIUJI.
 * Pure DEMO planning: quantities only. No allocation, budget, procurement,
 * recipient determination, formal approval, shipping or BAST.
 * All inputs must be synthetic. No production connector or persistence.
 */
export const SCHEMA="M04-S10-SUPPORT-PACKAGE-PLAN-UNTESTED-1";
export const BOUNDARY="DRAF_RENCANA_BUKAN_ALOKASI_ATAU_PERSETUJUAN";
const needCode=/^DEMO-NEED-[A-Z0-9_-]{1,40}$/;
const facilityCode=/^DEMO-PUSK-[A-Z0-9_-]{1,40}$/;
const packageCode=/^DEMO-PKG-[A-Z0-9_-]{1,40}$/;
const units=["unit","set","paket","buah"];
const statuses=["draf","diajukan","perlu_perbaikan","terverifikasi","ditolak"];
function shape(value,keys,label){
  if(value===null||typeof value!=="object"||Array.isArray(value)||
     Object.keys(value).length!==keys.length||
     keys.some(k=>!Object.hasOwn(value,k)))
    throw Error(label+": struktur tidak sesuai kontrak DEMO.");
}
function str(value,min,max,label){
  if(typeof value!=="string"||value.trim().length<min||value.trim().length>max)
    throw Error(label+": teks tidak sah.");
  return value.trim();
}
function integer(value,min,max,label){
  if(!Number.isSafeInteger(value)||value<min||value>max)
    throw Error(label+": jumlah/versi harus bilangan bulat dalam batas.");
}
function source(n){
  shape(n,["synthetic","need_id","puskeswan_id","region_demo",
    "item","quantity","unit","status","evidence_status","priority_status",
    "priority_band","source_version"],"Sumber kebutuhan");
  if(n.synthetic!==true||typeof n.need_id!=="string"||!needCode.test(n.need_id)||
    typeof n.puskeswan_id!=="string"||!facilityCode.test(n.puskeswan_id)||
    typeof n.region_demo!=="string"||!n.region_demo.startsWith("Wilayah fiktif ")||
    !units.includes(n.unit)||!statuses.includes(n.status)||
    n.evidence_status!=="metadata_demo"||
    !["ditinjau","belum_dinilai"].includes(n.priority_status)||
    (n.priority_status==="ditinjau"&&!["rendah","sedang","tinggi"].includes(n.priority_band))||
    (n.priority_status==="belum_dinilai"&&n.priority_band!==null))
    throw Error("Sumber wajib contoh sintetis dengan metadata dan status sah.");
  integer(n.quantity,1,100000,"Kebutuhan");
  integer(n.source_version,1,Number.MAX_SAFE_INTEGER,"Versi sumber");
  return {...n,item:str(n.item,5,120,"Barang"),
    region_demo:str(n.region_demo,15,120,"Wilayah")};
}
const eligible=n=>n.status==="terverifikasi";
function normalizePackage(p){
  shape(p,["id","title","purpose","lines"],"Paket draf");
  if(typeof p.id!=="string"||!packageCode.test(p.id)||
    !Array.isArray(p.lines)||p.lines.length>250)
    throw Error("Identitas atau daftar barang paket draf tidak sah.");
  const ids=new Set();
  const lines=p.lines.map(line=>{
    shape(line,["need_id","source_version","quantity"],"Baris paket");
    if(typeof line.need_id!=="string"||!needCode.test(line.need_id)||
      ids.has(line.need_id))
      throw Error("Kebutuhan ganda atau tidak dikenal dalam satu paket.");
    ids.add(line.need_id);
    integer(line.source_version,1,Number.MAX_SAFE_INTEGER,"Versi sumber");
    integer(line.quantity,1,100000,"Jumlah rencana");
    return {...line};
  });
  return {id:p.id,title:str(p.title,3,100,"Nama paket"),
    purpose:str(p.purpose,10,300,"Alasan rencana"),lines};
}
export function buildSupportPlan(needs,packages){
  if(!Array.isArray(needs)||needs.length>1000||
     !Array.isArray(packages)||packages.length>100)
    throw Error("Daftar kebutuhan/paket DEMO di luar batas.");
  const sources=new Map();
  for(const raw of needs){
    const n=source(raw);
    if(sources.has(n.need_id))throw Error("ID sumber ganda.");
    sources.set(n.need_id,n);
  }
  const planned=new Map(),ids=new Set();
  const drafts=packages.map(raw=>{
    const p=normalizePackage(raw);
    if(ids.has(p.id))throw Error("ID paket ganda.");
    ids.add(p.id);
    const lines=p.lines.map(line=>{
      const n=sources.get(line.need_id);
      if(!n||!eligible(n))
        throw Error("Hanya kebutuhan DEMO terverifikasi yang dapat direncanakan.");
      if(n.source_version!==line.source_version)
        throw Error("Versi kebutuhan berubah; kaji ulang baris "+line.need_id+".");
      const qty=(planned.get(n.need_id)||0)+line.quantity;
      if(qty>n.quantity)
        throw Error("Total rencana melebihi kebutuhan "+n.need_id+".");
      planned.set(n.need_id,qty);
      return {...line,puskeswan_id:n.puskeswan_id,region_demo:n.region_demo,
        item:n.item,unit:n.unit,source_quantity:n.quantity};
    });
    return {...p,lines,status:"draf_perencanaan",official_approval:false,
      allocated:false,distributed:false};
  });
  const needRows=[...sources.values()].map(n=>{
    const qty=planned.get(n.need_id)||0;
    return {...n,eligible_for_demo_planning:eligible(n),planned_quantity:qty,
      remaining_quantity:eligible(n)?n.quantity-qty:null,
      reason:eligible(n)?"Terverifikasi dalam fixture, bukan keputusan nyata":
        "Belum dapat dimasukkan ke rencana DEMO"};
  });
  const byUnit=units.map(unit=>{
    const rows=needRows.filter(n=>eligible(n)&&n.unit===unit);
    return {unit,eligible_needs:rows.length,
      requested:rows.reduce((a,n)=>a+n.quantity,0),
      planned:rows.reduce((a,n)=>a+n.planned_quantity,0),
      remaining:rows.reduce((a,n)=>a+n.remaining_quantity,0)};
  }).filter(x=>x.eligible_needs>0);
  return {schema:SCHEMA,synthetic:true,mode:"CODE_ONLY",boundary:BOUNDARY,
    needs:needRows,packages:drafts,quantities_by_unit:byUnit,
    totals:{source_needs:needRows.length,eligible_needs:needRows.filter(eligible).length,
      ineligible_needs:needRows.filter(n=>!eligible(n)).length,
      draft_packages:drafts.length,planned_lines:drafts.reduce((a,p)=>a+p.lines.length,0),
      distinct_planned_needs:planned.size,official_allocations:0,official_approvals:0,
      delivered_items:0},
    warnings:[
      "Semua sumber, paket dan jumlah adalah simulasi. Tidak ada reservasi stok.",
      "Sisa kebutuhan hanya selisih jumlah dalam draf, bukan kekurangan resmi atau stok tersedia.",
      "Tidak menjumlahkan satuan berbeda atau membuat nominal biaya.",
      "Verifikasi DEMO bukan penetapan penerima maupun persetujuan anggaran.",
      "Tidak menetapkan ranking, pembelian, penyaluran, BAST atau keputusan pejabat.",
    ]};
}
/** Replace a draft atomically: callers retain old inputs if validation fails. */
export function replaceDraft(needs,packages,draft){
  const p=normalizePackage(draft);
  if(!Array.isArray(packages))throw Error("Daftar paket tidak sah.");
  const next=packages.some(x=>x?.id===p.id)
    ?packages.map(x=>x.id===p.id?p:x):[...packages,p];
  // Reject an invalid current book, rather than silently repair corruption.
  buildSupportPlan(needs,packages);
  buildSupportPlan(needs,next);
  return next.map(normalizePackage);
}
export function removeDraft(needs,packages,id){
  buildSupportPlan(needs,packages);
  if(!packages.some(p=>p.id===id))throw Error("Paket tidak ditemukan.");
  const next=packages.filter(p=>p.id!==id);
  buildSupportPlan(needs,next);
  return next.map(normalizePackage);
}
