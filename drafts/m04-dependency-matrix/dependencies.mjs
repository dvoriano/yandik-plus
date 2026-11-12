/**
 * YANDIK+ M04-S9G | KODE DITULIS, BELUM DIUJI.
 * Read-only dependency plan of M04-S9F requirements, NOT a release gate,
 * institutional approval, permission to run QA, deploy or allocate resources.
 */
import {CHECKLIST_SCHEMA,VERDICT as S9F_VERDICT,STATES}
  from "../m04-preintegration-checklist/checklist.mjs";

export const MATRIX_SCHEMA="M04-S9G-DEPENDENCIES-UNTESTED-1";
export const NO_AUTHORITY="SELURUH_HAMBATAN_BELUM_DITUNTASKAN_BUKAN_IZIN_INTEGRASI";
export const PHASE_LABELS=Object.freeze({
  P0:"P0 | Perlindungan informasi dan arah kelembagaan",
  P1:"P1 | Kesiapan data, otorisasi dan rancangan alur",
  P2:"P2 | Pengujian teknis setelah izin eksplisit",
  P3:"P3 | Staging dan keputusan perubahan resmi",
});
export const PHASES=Object.freeze({
  "GOV-01":"P0","GOV-02":"P0","GOV-03":"P0","GOV-04":"P0",
  "SEC-01":"P0","SEC-03":"P0","SEC-04":"P0",
  "DAT-01":"P1","DAT-02":"P1","DAT-03":"P1",
  "SEC-02":"P1","FLOW-01":"P1","FLOW-02":"P1","FLOW-03":"P1",
  "QA-01":"P2","QA-02":"P2",
  "INT-01":"P3","INT-02":"P3",
});
/** Declared design dependencies, not proof of real-world requirements. */
export const DEPENDENCIES=Object.freeze({
  "SEC-01":Object.freeze([]),
  "GOV-01":Object.freeze([]),
  "GOV-03":Object.freeze(["GOV-01"]),
  "GOV-02":Object.freeze(["GOV-01","GOV-03"]),
  "GOV-04":Object.freeze(["GOV-01"]),
  "SEC-04":Object.freeze(["SEC-01"]),
  "SEC-03":Object.freeze(["SEC-01","GOV-04"]),
  "DAT-01":Object.freeze(["GOV-01"]),
  "SEC-02":Object.freeze(["SEC-01","DAT-01"]),
  "DAT-02":Object.freeze(["DAT-01"]),
  "DAT-03":Object.freeze(["DAT-01"]),
  "FLOW-01":Object.freeze(["GOV-01","DAT-01"]),
  "FLOW-02":Object.freeze(["DAT-03","FLOW-01","SEC-02"]),
  "FLOW-03":Object.freeze(["GOV-02","GOV-03"]),
  "QA-01":Object.freeze(["FLOW-02","SEC-04"]),
  "QA-02":Object.freeze(["QA-01","DAT-02","SEC-02"]),
  "INT-01":Object.freeze(["SEC-03","QA-02","GOV-04"]),
  "INT-02":Object.freeze(["INT-01","GOV-02","FLOW-03"]),
});
const isObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
function validate(source,deps,phase){
  if(!isObject(source)||source.schema!==CHECKLIST_SCHEMA||
    source.synthetic!==true||source.mode!=="CODE_ONLY"||
    source.integration_readiness!==S9F_VERDICT||
    !Array.isArray(source.requirements)||source.requirements.length!==18||
    !Array.isArray(source.waves)||source.waves.length!==4||
    !isObject(source.source)||!isObject(source.source.repo_snapshot)||
    source.totals?.verified!==0)
    throw Error("Sumber M04-S9F belum sesuai kontrak DEMO CODE_ONLY.");
  if(source.waves.some((x,i)=>x.id!==["P0","P1","P2","P3"][i]||
    x.status!=="BELUM_DIMULAI"))throw Error("Gelombang QA bukan status ditahan.");
  const ids=new Set();
  for(const item of source.requirements){
    if(!isObject(item)||typeof item.id!=="string"||ids.has(item.id)||
      typeof item.title!=="string"||!item.title||
      !own(STATES,item.status)||item.done!==false||
      item.official_evidence_verified!==false)
      throw Error("Prasyarat M04-S9F tidak unik atau keliru dianggap sudah lulus.");
    ids.add(item.id);
  }
  if(!isObject(deps)||!isObject(phase)||
    Object.keys(deps).length!==ids.size||Object.keys(phase).length!==ids.size)
    throw Error("Matriks ketergantungan harus mencakup semua butir.");
  for(const id of ids){
    if(!own(deps,id)||!own(phase,id)||!own(PHASE_LABELS,phase[id])||
      !Array.isArray(deps[id])||new Set(deps[id]).size!==deps[id].length||
      deps[id].some(v=>!ids.has(v)||v===id))
      throw Error("Dependensi mengandung ID tak dikenal, duplikat atau self-loop.");
  }
  if(Object.keys(deps).some(id=>!ids.has(id))||
     Object.keys(phase).some(id=>!ids.has(id)))
    throw Error("Matriks memiliki ID ekstra.");
  const phaseRank=id=>Object.keys(PHASE_LABELS).indexOf(phase[id]);
  for(const [id,parents] of Object.entries(deps)){
    if(parents.some(p=>phaseRank(p)>phaseRank(id)))
      throw Error("Dependensi harus mengikuti urutan fase, tidak mundur.");
  }
}
function topo(ids,dependencies,phases){
  const done=[],doneSet=new Set(),layers={},remaining=new Set(ids);
  while(remaining.size){
    const eligible=[...remaining].filter(id=>
      dependencies[id].every(parent=>doneSet.has(parent)));
    if(!eligible.length)throw Error("Siklus dependensi terdeteksi; urutan ditolak.");
    eligible.sort((a,b)=>Object.keys(PHASE_LABELS).indexOf(phases[a])-
      Object.keys(PHASE_LABELS).indexOf(phases[b])||a.localeCompare(b));
    for(const id of eligible){
      layers[id]=1+Math.max(0,...dependencies[id].map(p=>layers[p]));
      done.push(id);doneSet.add(id);remaining.delete(id);
    }
  }
  return {order:done,layers};
}
export function buildDependencyMatrix(source,deps=DEPENDENCIES,phases=PHASES){
  validate(source,deps,phases);
  const req=new Map(source.requirements.map(x=>[x.id,x]));
  const ids=[...req.keys()];
  const {order,layers}=topo(ids,deps,phases);
  const descendants=id=>{
    const seen=new Set(),stack=[id];
    while(stack.length){
      const current=stack.pop();
      for(const other of ids){
        if(deps[other].includes(current)&&!seen.has(other)){
          seen.add(other);stack.push(other);
        }
      }
    }
    return seen.size;
  };
  const rows=order.map((id,index)=>{
    const item=req.get(id),parents=[...deps[id]];
    return {
      id,title:item.title,group:item.group,phase:phases[id],
      phase_label:PHASE_LABELS[phases[id]],sequence:index+1,
      dependency_layer:layers[id],direct_dependencies:parents,
      dependency_count:parents.length,downstream_affected:descendants(id),
      evidence_needed:item.proof,proposed_owner:item.owner_suggestion,
      source_document:item.source,original_status:item.status,
      context_alert:item.context_alert??"",
      decision_pending:item.status==="BUTUH_KEPUTUSAN",
      test_permission_pending:item.status==="MENUNGGU_IZIN_UJI",
      has_unverified_dependencies:parents.length>0,
      authorized_to_act:false,verified:false,
      note:parents.length?
        "Urutan bahan: telaah ketergantungan "+parents.join(", ")+
        "; seluruhnya masih terbuka, belum terbukti.":
        "Dapat dibahas sebagai langkah awal, bukan izin eksekusi atau bukti terpenuhi.",
    };
  });
  const waves=Object.keys(PHASE_LABELS).map(code=>({
    id:code,title:PHASE_LABELS[code],
    requirements:rows.filter(x=>x.phase===code).map(x=>x.id),
    count:rows.filter(x=>x.phase===code).length,
    status:"BELUM_DIMULAI",permission_to_test:false,
  }));
  return {
    schema:MATRIX_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{schema:source.schema,as_of_demo:source.as_of_demo,
      repo_snapshot:{...source.source.repo_snapshot},
      agenda_source_stale:source.source.source_stale,
      checks:source.totals.checks},
    totals:{requirements:rows.length,verified:0,phase_count:waves.length,
      direct_edges:rows.reduce((n,x)=>n+x.dependency_count,0),
      independent_discussion_starters:rows.filter(x=>!x.dependency_count).length,
      longest_dependency_layers:Math.max(...rows.map(x=>x.dependency_layer))},
    waves,rows,phase_labels:PHASE_LABELS,
    integration_readiness:NO_AUTHORITY,
    interpretation:"Urutan adalah rancangan diskusi, bukan prioritas anggaran, keputusan, izin tes atau daftar pekerjaan otomatis.",
    warnings:[
      "Semua dependensi dan pengampu masih hipotesis desain, perlu validasi manusia.",
      "Status PRIVATE sekalipun tidak membuktikan keamanan isi atau histori repository.",
      "M03-S4 sampai M04-S9G kode baru BELUM DIUJI; CODE_ONLY melarang tes.",
      ...(source.source.source_stale?[
        "Snapshot agenda berubah, periksa sumber M04-S9C/S9E sebelum melanjutkan telaah."]:[]),
      ...(source.source.repo_snapshot.visibility==="public"?[
        "Repository PUBLIC pada tanggal observasi; jangan menambah data rahasia."]:[]),
      "Tidak ada penerbitan SOP, alokasi, pengadaan, BAST, persetujuan bantuan atau deployment.",
    ],
  };
}
export function dependencyMatrixText(result){
  if(!isObject(result)||result.schema!==MATRIX_SCHEMA||
    result.synthetic!==true||result.integration_readiness!==NO_AUTHORITY||
    !Array.isArray(result.rows)||!Array.isArray(result.waves))
    throw Error("Peta M04-S9G tidak sesuai kontrak DEMO.");
  return [
    "YANDIK+ M04-S9G | MATRIKS KETERGANTUNGAN DEMO / BELUM DIUJI",
    "BUKAN HASIL AUDIT, KEPUTUSAN KEBIJAKAN, PERSETUJUAN QA ATAU IZIN INTEGRASI.",
    "Sumber: M04-S9F; tanggal DEMO "+result.source.as_of_demo,
    "Snapshot repo "+result.source.repo_snapshot.visibility+" pada "+
      result.source.repo_snapshot.observed_on+" (BUKAN STATUS LIVE).",
    "Jumlah item "+result.totals.requirements+
      "; bukti resmi tervalidasi "+result.totals.verified+
      "; gelombang "+result.totals.phase_count,
    "URUTAN BAHAN PEMBAHASAN:",
    ...result.rows.map(x=>x.sequence+". ["+x.phase+"] "+x.id+
      " | "+x.title+" | pendahulu "+(x.direct_dependencies.join(", ")||"tidak ada")+
      " | terdampak lanjut "+x.downstream_affected+
      " | "+STATES[x.original_status]+
      " | bukti: "+x.evidence_needed),
    "KEEMPAT GELOMBANG BELUM DIMULAI:",
    ...result.waves.map(x=>"- "+x.id+" ("+x.count+
      " butir) | "+x.title+" | "+x.status),
    "PERINGATAN:",
    ...result.warnings.map(x=>"- "+x),
    "STATUS: "+result.integration_readiness,result.interpretation,
  ].join("\n");
}
