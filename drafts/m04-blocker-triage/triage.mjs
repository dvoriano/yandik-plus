/**
 * YANDIK+ M04-S9H | KODE DITULIS, BELUM DIUJI.
 * Read-only, synthetic consolidation of M04-S9G integration dependencies.
 * A discussion queue, NOT a legal gate, approval or authorization to test/deploy.
 */
import {MATRIX_SCHEMA,NO_AUTHORITY as S9G_BOUNDARY,PHASE_LABELS}
  from "../m04-dependency-matrix/dependencies.mjs";

export const TRIAGE_SCHEMA="M04-S9H-TRIAGE-UNTESTED-1";
export const READINESS="TIDAK_DAPAT_MENYATAKAN_SIAP_INTEGRASI_DARI_BAHAN_DEMO";
export const EVIDENCE_STATE="BUKTI_BELUM_DIVERIFIKASI";
export const REVIEW_STATE="PENELAAH_BELUM_DITETAPKAN";
export const ATTENTION=Object.freeze({
  kaji_ulang_sumber:"Tahan pembahasan hasil sampai snapshot sumber dikaji ulang",
  klasifikasi_repo:"Klasifikasi data dan akses repo perlu dibahas oleh pemilik",
  topik_awal:"Bahan diskusi awal tanpa pendahulu",
  menunggu_izin_uji:"Bahas scope saja, tes menunggu izin eksplisit",
  menunggu_pendahulu:"Perlu telaah bahan pendahulu",
});
const GROUPS=Object.freeze({
  kelembagaan:Object.freeze({
    suggested_reviewer:"Fungsi tata laksana/kelembagaan yang ditetapkan instansi",
    review_question:"Apakah dokumen, kewenangan dan prosedur yang diusulkan sesuai proses resmi?",
  }),
  keamanan:Object.freeze({
    suggested_reviewer:"Pengampu keamanan informasi/pengelola sistem yang ditetapkan",
    review_question:"Apakah klasifikasi informasi, kendali akses dan audit data cukup untuk ditelaah?",
  }),
  data:Object.freeze({
    suggested_reviewer:"Pengampu data Profil, SDM dan APEL yang ditetapkan",
    review_question:"Apakah identitas, sumber serta perhitungan data historis tetap terlindungi?",
  }),
  alur:Object.freeze({
    suggested_reviewer:"Pengampu proses Support serta pejabat yang berwenang",
    review_question:"Apakah alur draft tetap terpisah dari keputusan bantuan dan anggaran?",
  }),
  pengujian:Object.freeze({
    suggested_reviewer:"Fungsi QA/keamanan dan pemilik izin pengujian",
    review_question:"Apakah izin tes dan bukti hasil benar-benar tersedia sebelum status dinaikkan?",
  }),
  integrasi:Object.freeze({
    suggested_reviewer:"Pemilik sistem dan pengampu operasional perubahan",
    review_question:"Apakah staging, backup/rollback dan otorisasi perubahan telah disahkan?",
  }),
});
const isObj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
function validateMatrix(m){
  if(!isObj(m)||m.schema!==MATRIX_SCHEMA||m.synthetic!==true||m.mode!=="CODE_ONLY"||
    m.integration_readiness!==S9G_BOUNDARY||!Array.isArray(m.rows)||m.rows.length!==18||
    !Array.isArray(m.waves)||m.waves.length!==4||!isObj(m.source)||
    !isObj(m.source.repo_snapshot)||m.totals?.requirements!==18||
    m.totals?.verified!==0)
    throw Error("Sumber harus peta M04-S9G DEMO, CODE_ONLY, tanpa kelulusan.");
  const phaseKeys=Object.keys(PHASE_LABELS),seen=new Set(),ids=new Set();
  for(const x of m.rows){
    if(!isObj(x)||typeof x.id!=="string"||ids.has(x.id)||!x.id||
      typeof x.title!=="string"||x.title.length<5||!own(GROUPS,x.group)||
      !own(PHASE_LABELS,x.phase)||!Array.isArray(x.direct_dependencies)||
      !Number.isSafeInteger(x.sequence)||x.sequence<1||
      !Number.isSafeInteger(x.downstream_affected)||x.downstream_affected<0||
      typeof x.evidence_needed!=="string"||x.evidence_needed.length<12||
      typeof x.proposed_owner!=="string"||x.proposed_owner.length<5||
      x.verified!==false||x.authorized_to_act!==false)
      throw Error("Baris dependensi tidak sah atau tampak sudah diberi kewenangan.");
    ids.add(x.id);
    if(seen.has(x.sequence))throw Error("Nomor urut ganda.");
    seen.add(x.sequence);
  }
  if(m.waves.some((w,i)=>!isObj(w)||w.id!==phaseKeys[i]||
    w.status!=="BELUM_DIMULAI"||w.permission_to_test!==false))
    throw Error("Fase belum boleh dijalankan.");
  const byId=new Map(m.rows.map(x=>[x.id,x]));
  for(const x of m.rows){
    if(new Set(x.direct_dependencies).size!==x.direct_dependencies.length||
       x.direct_dependencies.some(dep=>!byId.has(dep)||dep===x.id||
         byId.get(dep).sequence>=x.sequence||
         phaseKeys.indexOf(byId.get(dep).phase)>phaseKeys.indexOf(x.phase)))
      throw Error("Urutan pendahulu tidak valid.");
  }
  if(seen.size!==18||![...seen].every(n=>n<=18))
    throw Error("Urutan harus mencakup 1 sampai 18.");
  if(!["public","private","unknown"].includes(m.source.repo_snapshot.visibility))
    throw Error("Snapshot repo tidak sesuai kontrak.");
  return m;
}
function attention(row,m){
  if(m.source.agenda_source_stale)return "kaji_ulang_sumber";
  if(row.id==="SEC-01"&&m.source.repo_snapshot.visibility==="public")
    return "klasifikasi_repo";
  if(row.direct_dependencies.length===0)return "topik_awal";
  if(row.test_permission_pending===true)return "menunggu_izin_uji";
  return "menunggu_pendahulu";
}
function nextDiscussion(row,code){
  if(code==="kaji_ulang_sumber")return "Bandingkan snapshot sumber M04-S9C hingga S9G, jangan mengesahkan data lama.";
  if(code==="klasifikasi_repo")return "Bahas keputusan visibility, klasifikasi isi dan audit histori akses tanpa unggahan data riil.";
  if(code==="topik_awal")return "Identifikasi sumber dokumen dan fungsi pengampu untuk ditelaah secara manual.";
  if(code==="menunggu_izin_uji")return "Rinci skenario serta ruang lingkup uji. Jangan menjalankan tes sampai izin owner.";
  return "Inventaris bahan pendahulu yang harus dikaji sebelum pembahasan butir ini.";
}
export function buildBlockerTriage(matrix){
  validateMatrix(matrix);
  const rows=matrix.rows.map(x=>{
    const review=GROUPS[x.group],attention_code=attention(x,matrix);
    return {
      id:x.id,title:x.title,group:x.group,phase:x.phase,
      phase_label:PHASE_LABELS[x.phase],origin_sequence:x.sequence,
      discussion_layer:x.dependency_layer,
      dependency_ids:[...x.direct_dependencies],
      downstream_count:x.downstream_affected,
      evidence_request:x.evidence_needed,
      evidence_state:EVIDENCE_STATE,
      proposed_preparer_role:x.proposed_owner,
      proposed_reviewer_role:review.suggested_reviewer,
      review_question:review.review_question,
      suggested_next_discussion:nextDiscussion(x,attention_code),
      original_status:x.original_status,
      attention_code,attention_label:ATTENTION[attention_code],
      source_document:x.source_document,context_alert:x.context_alert,
      confirmed_reviewer:false,official_evidence_verified:false,
      decision_recorded:false,authorized_to_test:false,authorized_to_deploy:false,
    };
  });
  // Discussion attention sorts editorials only. Not a public-policy ranking.
  const alertPriority=Object.keys(ATTENTION);
  rows.sort((a,b)=>alertPriority.indexOf(a.attention_code)-
    alertPriority.indexOf(b.attention_code)||
    Object.keys(PHASE_LABELS).indexOf(a.phase)-
      Object.keys(PHASE_LABELS).indexOf(b.phase)||
    a.origin_sequence-b.origin_sequence);
  const queue=rows.map((x,i)=>({...x,discussion_order:i+1}));
  const phases=Object.keys(PHASE_LABELS).map(id=>({
    id,label:PHASE_LABELS[id],
    blockers:queue.filter(x=>x.phase===id).map(x=>x.id),
    state:"BELUM_DIMULAI",officially_cleared:false,
  }));
  return {
    schema:TRIAGE_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{schema:matrix.schema,as_of_demo:matrix.source.as_of_demo,
      snapshot_changed:matrix.source.agenda_source_stale,
      repo_snapshot:{...matrix.source.repo_snapshot}},
    totals:{
      blockers:queue.length,verified_evidence:0,confirmed_reviewers:0,
      recorded_decisions:0,
      no_predecessor:queue.filter(x=>x.dependency_ids.length===0).length,
      permission_gated:queue.filter(x=>x.original_status==="MENUNGGU_IZIN_UJI").length,
      source_needs_recheck:matrix.source.agenda_source_stale?queue.length:0,
    },
    rows:queue,phases,
    evidence_state:EVIDENCE_STATE,reviewer_state:REVIEW_STATE,
    integration_readiness:READINESS,
    warning:"Pemetaan murni usulan dan DEMO. Ini bukan penugasan, bukti verifikasi, persetujuan QA atau izin integrasi.",
  };
}
export function blockerTriageText(bundle){
  if(!isObj(bundle)||bundle.schema!==TRIAGE_SCHEMA||bundle.synthetic!==true||
    bundle.integration_readiness!==READINESS||!Array.isArray(bundle.rows))
    throw Error("Paket hambatan M04-S9H tidak sah.");
  return [
    "YANDIK+ M04-S9H | PAKET TELAAH HAMBATAN DEMO / KODE BELUM DIUJI",
    "BUKAN KEPUTUSAN PEJABAT, AUDIT, SOP, BAST, IZIN TES ATAU DEPLOY.",
    "Tanggal acuan DEMO "+bundle.source.as_of_demo+
      "; status repo "+bundle.source.repo_snapshot.visibility+
      " per "+bundle.source.repo_snapshot.observed_on+" (snapshot, bukan live).",
    "Butir "+bundle.totals.blockers+
      "; bukti terverifikasi "+bundle.totals.verified_evidence+
      "; penelaah resmi dikonfirmasi "+bundle.totals.confirmed_reviewers+
      "; keputusan tercatat "+bundle.totals.recorded_decisions,
    "URUTAN DISKUSI (BUKAN RANKING KEBIJAKAN):",
    ...bundle.rows.map(x=>x.discussion_order+". ["+x.phase+"] "+x.id+" "+x.title+
      " | "+x.attention_label+
      " | pendahulu "+(x.dependency_ids.join(", ")||"tanpa pendahulu")+
      " | bukti diminta: "+x.evidence_request+
      " | pengampu usulan: "+x.proposed_preparer_role+
      " | penelaah usulan: "+x.proposed_reviewer_role+
      " | pertanyaan: "+x.review_question+
      " | bahas: "+x.suggested_next_discussion),
    "SEMUA FASE BELUM DIMULAI:",
    ...bundle.phases.map(x=>"- "+x.label+" | "+x.state),
    "STATUS: "+bundle.integration_readiness,bundle.warning,
  ].join("\n");
}
