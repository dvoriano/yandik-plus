/**
 * YANDIK+ M04-S9L | KODE DITULIS, BELUM DIUJI.
 * Synthesize synthetic proposed follow-ups and evidence-gap notes by function.
 * Read-only preparation for human discussion, NEVER institutional approval.
 */
import {FOLLOWUP_SCHEMA,NO_AUTHORITY as S9K_NO_AUTHORITY,STATUS}
  from "../m04-proposed-followups/followups.mjs";
import {FUNCTIONS} from "../m04-function-review-agendas/agendas.mjs";

export const RECAP_SCHEMA="M04-S9L-CROSS-FUNCTION-RECAP-UNTESTED-1";
export const NO_DECISION="REKAP_DEMO_BUKAN_PENETAPAN_ATAU_IZIN_INTEGRASI";
export const CLASSES=Object.freeze({
  proposal_and_gap:"Ada usulan DAN catatan kekurangan bukti DEMO",
  proposal_only:"Ada usulan, tanpa catatan kekurangan bukti DEMO",
  gap_only:"Ada catatan kekurangan bukti, tanpa usulan DEMO",
  no_proposal_or_gap:"Belum ada usulan atau catatan kekurangan bukti DEMO",
});
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
const fields=["masukan_demo","kekurangan_bukti_demo","usulan_tindak_lanjut_demo"];
function validate(bundle){
  if(!object(bundle)||bundle.schema!==FOLLOWUP_SCHEMA||
    bundle.synthetic!==true||bundle.mode!=="CODE_ONLY"||
    bundle.readiness!==S9K_NO_AUTHORITY||
    !object(bundle.source)||!object(bundle.source.repo_snapshot)||
    !["public","private","unknown"].includes(bundle.source.repo_snapshot.visibility)||
    typeof bundle.source.repo_snapshot.observed_on!=="string"||
    !Number.isSafeInteger(bundle.source.revision)||bundle.source.revision<0||
    typeof bundle.source.source_stale!=="boolean"||
    !Array.isArray(bundle.rows)||bundle.rows.length!==18||
    !Array.isArray(bundle.functions)||bundle.functions.length!==FUNCTIONS.length||
    bundle.totals?.source_items!==18||
    bundle.totals?.official_tasks!==0||
    bundle.totals?.official_decisions!==0||
    bundle.totals?.verified_evidence!==0)
    throw Error("Sumber M04-S9K harus 18 butir DEMO tanpa keputusan.");
  const functionMap=new Map(FUNCTIONS.map(x=>[x.id,x.title]));
  const byFunction=new Map(),seenFunction=new Set();
  for(const f of bundle.functions){
    if(!object(f)||!functionMap.has(f.id)||seenFunction.has(f.id)||
      f.title!==functionMap.get(f.id)||!Array.isArray(f.row_ids)||
      f.submitted_to_institution!==false||
      new Set(f.row_ids).size!==f.row_ids.length)
      throw Error("Daftar fungsi M04-S9K tidak sesuai atau sudah dikirim.");
    seenFunction.add(f.id);byFunction.set(f.id,f);
  }
  if(byFunction.size!==6)throw Error("Harus ada enam fungsi DEMO.");
  const byId=new Map(),ids=new Set(),statusCount={proposal:0,blank:0};
  for(const row of bundle.rows){
    if(!object(row)||typeof row.id!=="string"||
      typeof row.source_id!=="string"||
      row.id!=="DEMO-FU-"+row.source_id||ids.has(row.source_id)||
      !byFunction.has(row.source_function_id)||
      !byFunction.get(row.source_function_id).row_ids.includes(row.id)||
      typeof row.source_title!=="string"||!row.source_title||
      typeof row.phase!=="string"||!["P0","P1","P2","P3"].includes(row.phase)||
      !Number.isSafeInteger(row.source_revision)||row.source_revision<0||
      typeof row.source_material!=="string"||!row.source_material||
      !Array.isArray(row.source_dependencies)||
      new Set(row.source_dependencies).size!==row.source_dependencies.length||
      !fields.every(f=>typeof row[f]==="string"&&row[f].length<=500)||
      typeof row.preparer_role_suggestion!=="string"||
      typeof row.reviewer_role_suggestion!=="string"||
      !own(STATUS,row.status)||
      row.status!==(row.usulan_tindak_lanjut_demo.trim()?
        "USULAN_CONTOH_PERLU_TELAAH":"BELUM_ADA_USULAN_CONTOH")||
      row.assigned_officer!==null||row.official_deadline!==null||
      row.official_evidence_verified!==false||
      row.official_review!==false||row.officially_assigned!==false||
      row.official_decision!==false||
      row.authorization_to_test!==false||
      row.authorization_to_deploy!==false||row.demo_only!==true)
      throw Error("Baris memiliki ID/asal tidak sesuai atau tampak sudah resmi.");
    ids.add(row.source_id);byId.set(row.source_id,row);
    statusCount[row.status==="USULAN_CONTOH_PERLU_TELAAH"?"proposal":"blank"]++;
  }
  for(const row of bundle.rows){
    if(row.source_dependencies.some(dep=>!byId.has(dep)||dep===row.source_id))
      throw Error("Pendahulu lintas modul tidak cocok atau mengacu ke diri sendiri.");
  }
  for(const f of bundle.functions){
    if(!f.row_ids.length||
      f.row_ids.some(id=>!bundle.rows.some(row=>row.id===id&&
        row.source_function_id===f.id))||
      bundle.rows.filter(x=>x.source_function_id===f.id).length!==f.row_ids.length)
      throw Error("Register fungsi dan daftar sumber tidak cocok.");
  }
  if(bundle.totals.proposals_demo!==statusCount.proposal||
     bundle.totals.without_proposal_demo!==statusCount.blank||
     statusCount.proposal+statusCount.blank!==18)
    throw Error("Jumlah usulan/kekosongan dari M04-S9K tidak konsisten.");
  return byId;
}
function classify(row){
  const proposal=Boolean(row.usulan_tindak_lanjut_demo.trim());
  const gap=Boolean(row.kekurangan_bukti_demo.trim());
  return proposal?(gap?"proposal_and_gap":"proposal_only"):
    gap?"gap_only":"no_proposal_or_gap";
}
export function buildCrossFunctionRecap(bundle){
  const byId=validate(bundle);
  const rows=bundle.rows.map(row=>{
    const cross=row.source_dependencies.filter(dep=>
      byId.get(dep).source_function_id!==row.source_function_id);
    return {
      id:row.id,source_id:row.source_id,
      function_id:row.source_function_id,
      source_revision:row.source_revision,
      source_title:row.source_title,phase:row.phase,
      source_dependencies:[...row.source_dependencies],
      cross_function_dependencies:cross.map(dep=>({
        source_id:dep,function_id:byId.get(dep).source_function_id,
      })),
      source_material:row.source_material,
      preparer_role_suggestion:row.preparer_role_suggestion,
      reviewer_role_suggestion:row.reviewer_role_suggestion,
      masukan_demo:row.masukan_demo,
      kekurangan_bukti_demo:row.kekurangan_bukti_demo,
      usulan_tindak_lanjut_demo:row.usulan_tindak_lanjut_demo,
      class_code:classify(row),
      class_label:CLASSES[classify(row)],
      official_evidence_verified:false,confirmed_officer:false,
      officially_assigned:false,official_decision:false,
      authorization_to_test:false,authorization_to_deploy:false,
    };
  });
  const functions=FUNCTIONS.map(f=>{
    const ownRows=rows.filter(x=>x.function_id===f.id);
    return {
      id:f.id,title:f.title,source_ids:ownRows.map(x=>x.source_id),
      total:ownRows.length,
      proposal_notes:ownRows.filter(x=>x.usulan_tindak_lanjut_demo.trim()).length,
      gap_notes:ownRows.filter(x=>x.kekurangan_bukti_demo.trim()).length,
      no_proposal_notes:ownRows.filter(x=>!x.usulan_tindak_lanjut_demo.trim()).length,
      no_gap_notes:ownRows.filter(x=>!x.kekurangan_bukti_demo.trim()).length,
      cross_function_links:ownRows.reduce(
        (n,x)=>n+x.cross_function_dependencies.length,0),
      official_tasks:0,official_decisions:0,
    };
  });
  return {
    schema:RECAP_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{schema:bundle.schema,revision:bundle.source.revision,
      source_stale:bundle.source.source_stale,
      repo_snapshot:{...bundle.source.repo_snapshot}},
    functions,rows,class_labels:CLASSES,
    totals:{
      functions:functions.length,items:rows.length,
      proposal_notes:rows.filter(x=>x.usulan_tindak_lanjut_demo.trim()).length,
      gap_notes:rows.filter(x=>x.kekurangan_bukti_demo.trim()).length,
      no_proposal_notes:rows.filter(x=>!x.usulan_tindak_lanjut_demo.trim()).length,
      no_gap_notes:rows.filter(x=>!x.kekurangan_bukti_demo.trim()).length,
      cross_function_links:rows.reduce(
        (n,x)=>n+x.cross_function_dependencies.length,0),
      official_tasks:0,official_decisions:0,official_evidence_verified:0,
    },
    readiness:NO_DECISION,
    warnings:[
      ...(bundle.source.source_stale?
        ["Snapshot sumber berubah; pembahasan memerlukan kaji ulang."]:[]),
      ...(bundle.source.repo_snapshot.visibility==="public"?
        ["Repo PUBLIC menurut snapshot; tidak boleh menaruh data/berkas kedinasan nyata."]:[]),
      "Kekosongan catatan bukan bukti tidak ada masalah atau kebutuhan tindak lanjut.",
      "Semua angka berasal dari teks DEMO, bukan hasil rapat atau evaluasi resmi.",
      "Tidak ada alokasi, tugas, tenggat resmi, izin tes/deploy, keputusan bantuan atau BAST.",
    ],
  };
}
export function crossFunctionRecapText(recap,functionId="all",classCode="all"){
  if(!object(recap)||recap.schema!==RECAP_SCHEMA||recap.synthetic!==true||
    recap.mode!=="CODE_ONLY"||recap.readiness!==NO_DECISION||
    !Array.isArray(recap.rows)||recap.rows.length!==18||
    !["all",...FUNCTIONS.map(x=>x.id)].includes(functionId)||
    !["all",...Object.keys(CLASSES)].includes(classCode))
    throw Error("Rekap lintas fungsi DEMO tidak sah.");
  const subset=recap.rows.filter(x=>
    (functionId==="all"||x.function_id===functionId)&&
    (classCode==="all"||x.class_code===classCode));
  return [
    "YANDIK+ M04-S9L | REKAP LINTAS FUNGSI DEMO | KODE BELUM DIUJI",
    "BUKAN HASIL RAPAT, AUDIT, PENUGASAN RESMI, KEPUTUSAN ATAU IZIN INTEGRASI.",
    "Sumber M04-S9K revisi DEMO "+recap.source.revision,
    "Snapshot repo "+recap.source.repo_snapshot.visibility+
      " pada "+recap.source.repo_snapshot.observed_on+" (bukan live).",
    "Total "+recap.totals.items+" butir, "+recap.totals.functions+" fungsi."+
      " Usulan tertulis DEMO "+recap.totals.proposal_notes+
      "; kekurangan bukti tertulis DEMO "+recap.totals.gap_notes+
      "; catatan kekurangan kosong "+recap.totals.no_gap_notes+".",
    "KELOMPOK FUNGSI:",
    ...recap.functions.map(f=>"- "+f.title+": "+
      f.total+" butir, "+f.proposal_notes+" usulan DEMO, "+
      f.gap_notes+" catatan kekurangan DEMO, "+
      f.cross_function_links+" rujukan lintas fungsi."),
    "DAFTAR SESUAI FILTER:",
    ...subset.map(row=>"- "+row.source_id+" ["+row.phase+"] "+row.source_title+
      " | "+CLASSES[row.class_code]+
      " | fungsi "+row.function_id+
      " | pendahulu lintas fungsi "+
        (row.cross_function_dependencies.map(x=>x.source_id).join(", ")||"tidak ada")+
      " | kekurangan DEMO: "+(row.kekurangan_bukti_demo||"BELUM DIISI")+
      " | usulan DEMO: "+(row.usulan_tindak_lanjut_demo||"BELUM DIISI")),
    "STATUS: "+recap.readiness,
    ...recap.warnings.map(x=>"PERINGATAN: "+x),
  ].join("\n");
}
