/**
 * YANDIK+ M04-S9I | KODE DITULIS, BELUM DIUJI.
 * Synthetic read-only discussion agendas grouped by suggested review function.
 * NOT meeting invitations, minutes, assignments, approvals, testing permits or deployment gates.
 */
import {TRIAGE_SCHEMA,READINESS as S9H_BOUNDARY,EVIDENCE_STATE,REVIEW_STATE,ATTENTION}
  from "../m04-blocker-triage/triage.mjs";

export const AGENDA_SCHEMA="M04-S9I-FUNCTION-AGENDAS-UNTESTED-1";
export const NO_APPROVAL="BAHAN_DISKUSI_BELUM_DIPUTUSKAN_BUKAN_IZIN_INTEGRASI";
export const FUNCTIONS=Object.freeze([
  Object.freeze({id:"kelembagaan",title:"Tata laksana, kelembagaan dan tata naskah",goal:"Mendiskusikan fungsi pengampu, kewenangan, SOP dan arsip tanpa mengesahkan prosedur."}),
  Object.freeze({id:"keamanan",title:"Keamanan informasi dan pengelolaan akses",goal:"Membahas klasifikasi data, visibilitas repository, audit dan kontrol akses."}),
  Object.freeze({id:"data",title:"Pengelola data Profil, SDM dan APEL",goal:"Memastikan sumber data, ID Puskeswan dan perlindungan capaian historis dibahas."}),
  Object.freeze({id:"alur",title:"Pengampu alur Support Puskeswan",goal:"Menelaah batas draf/penilaian/eskalasi terhadap keputusan bantuan resmi."}),
  Object.freeze({id:"pengujian",title:"QA teknis dan pengalaman pengguna",goal:"Menyusun skenario tes tertunda tanpa menjalankannya."}),
  Object.freeze({id:"integrasi",title:"Operasional sistem dan rencana perubahan",goal:"Menelaah konsep staging, rollback dan otorisasi perubahan tanpa deploy."}),
]);
const isObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function validate(packet){
  if(!isObject(packet)||packet.schema!==TRIAGE_SCHEMA||packet.synthetic!==true||
     packet.mode!=="CODE_ONLY"||packet.integration_readiness!==S9H_BOUNDARY||
     !Array.isArray(packet.rows)||packet.rows.length!==18||
     !Array.isArray(packet.phases)||packet.phases.length!==4||
     !isObject(packet.source)||!isObject(packet.source.repo_snapshot)||
     packet.evidence_state!==EVIDENCE_STATE||packet.reviewer_state!==REVIEW_STATE||
     packet.totals?.blockers!==18||packet.totals?.verified_evidence!==0||
     packet.totals?.confirmed_reviewers!==0||packet.totals?.recorded_decisions!==0)
    throw Error("Sumber hanya menerima M04-S9H DEMO yang masih terbuka.");
  const functions=new Set(FUNCTIONS.map(x=>x.id)),ids=new Set(),numbers=new Set();
  const byId=new Map();
  for(const row of packet.rows){
    if(!isObject(row)||typeof row.id!=="string"||!row.id||
      typeof row.title!=="string"||row.title.length<5||
      !functions.has(row.group)||ids.has(row.id)||
      !Number.isSafeInteger(row.discussion_order)||row.discussion_order<1||
      numbers.has(row.discussion_order)||!Array.isArray(row.dependency_ids)||
      !Array.isArray(row.dependency_ids)&&row.dependency_ids.length>18||
      typeof row.evidence_request!=="string"||row.evidence_request.length<12||
      typeof row.review_question!=="string"||row.review_question.length<12||
      typeof row.suggested_next_discussion!=="string"||
      typeof row.proposed_preparer_role!=="string"||
      typeof row.proposed_reviewer_role!=="string"||
      !Object.prototype.hasOwnProperty.call(ATTENTION,row.attention_code)||
      row.evidence_state!==EVIDENCE_STATE||
      row.confirmed_reviewer!==false||row.official_evidence_verified!==false||
      row.decision_recorded!==false||row.authorized_to_test!==false||
      row.authorized_to_deploy!==false)
      throw Error("Butir agenda DEMO tidak unik, tidak lengkap, atau tampak disetujui.");
    ids.add(row.id);numbers.add(row.discussion_order);byId.set(row.id,row);
  }
  if([...numbers].some(x=>x>18))throw Error("Urutan diskusi tidak lengkap.");
  for(const row of packet.rows){
    if(new Set(row.dependency_ids).size!==row.dependency_ids.length||
      row.dependency_ids.some(x=>!byId.has(x)||x===row.id))
      throw Error("Ketergantungan agenda tidak valid.");
  }
  if(packet.phases.some((x,i)=>!isObject(x)||x.id!==["P0","P1","P2","P3"][i]||
     x.state!=="BELUM_DIMULAI"||x.officially_cleared!==false))
     throw Error("Gelombang status tidak boleh dinaikkan.");
  if(!["public","private","unknown"].includes(packet.source.repo_snapshot.visibility))
    throw Error("Visibilitas repository DEMO tidak sesuai.");
  return packet;
}
function tailoredQuestions(row){
  const qs=[
    row.review_question,
    "Apa rujukan dan contoh bukti yang layak ditelaah untuk "+row.id+
      " tanpa menaruh dokumen asli pada repository publik?",
    "Siapa fungsi yang berwenang mengonfirmasi bahan ini di luar sistem DEMO?",
  ];
  if(row.dependency_ids.length)
    qs.push("Bagaimana hasil pembahasan "+row.dependency_ids.join(", ")+
      " perlu dirujuk sebelum "+row.id+" dibahas lebih lanjut?");
  if(row.original_status==="MENUNGGU_IZIN_UJI")
    qs.push("Siapa dapat memberi izin QA secara eksplisit di masa depan? "+
      "Saat ini tes harus tetap nonaktif.");
  if(row.id==="SEC-01")
    qs.push("Apa langkah pemeriksaan histori paparan repo sebelum dan sesudah perubahan visibility?");
  return qs;
}
export function buildFunctionAgendas(triage){
  validate(triage);
  const groups=FUNCTIONS.map(func=>{
    const items=triage.rows.filter(x=>x.group===func.id)
      .sort((a,b)=>a.discussion_order-b.discussion_order)
      .map(row=>({
        id:row.id,title:row.title,phase:row.phase,
        origin_discussion_order:row.discussion_order,
        evidence_needed:row.evidence_request,
        proposed_preparer_role:row.proposed_preparer_role,
        proposed_reviewer_role:row.proposed_reviewer_role,
        dependency_ids:[...row.dependency_ids],
        attention_code:row.attention_code,attention_label:row.attention_label,
        source_document:row.source_document,
        proposed_questions:tailoredQuestions(row),
        followup_discussion:row.suggested_next_discussion,
        evidence_verified:false,reviewer_confirmed:false,
        meeting_held:false,decision_made:false,
      }));
    return {
      id:func.id,title:func.title,goal:func.goal,
      suggested_reviewer_role:items[0]?.proposed_reviewer_role??"",
      source_ids:items.map(x=>x.id),count:items.length,
      suggested_materials:items.map(x=>({id:x.id,description:x.evidence_needed})),
      questions:items.flatMap(x=>x.proposed_questions.map((question,n)=>({
        item_id:x.id,question_number:n+1,question,
      }))),
      items,
      invitation_sent:false,meeting_held:false,minutes_official:false,
      owner_assigned:false,discussion_state:"BELUM_DIJADWALKAN",
    };
  });
  if(groups.some(x=>!x.items.length))throw Error("Keenam fungsi harus punya butir DEMO.");
  const total=groups.reduce((n,x)=>n+x.count,0);
  return {
    schema:AGENDA_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{
      schema:triage.schema,as_of_demo:triage.source.as_of_demo,
      snapshot_changed:triage.source.snapshot_changed,
      repo_snapshot:{...triage.source.repo_snapshot},
    },
    groups,
    totals:{
      functions:groups.length,agenda_items:total,
      materials_requested:total,verified_materials:0,
      confirmed_reviewers:0,meetings_held:0,
      official_decisions:0,sent_invitations:0,
    },
    source_stale:triage.source.snapshot_changed,
    readiness:NO_APPROVAL,
    policy:"Semua agenda adalah bahan persiapan; jangan gunakan sebagai surat, berita acara, perintah, penetapan, izin tes/deploy atau keputusan bantuan.",
    warnings:[
      ...(triage.source.snapshot_changed?["Sumber berubah: kaji ulang seluruh paket sebelum pembahasan."]:[]),
      ...(triage.source.repo_snapshot.visibility==="public"?[
        "Repository PUBLIC pada snapshot: jangan mengunggah bahan kedinasan atau data rahasia."]:[]),
      "Keenam fungsi hanya usulan, bukan unit atau penelaah resmi yang sudah ditetapkan.",
      "Bukti dan hasil telaah tidak diverifikasi, semua tes dalam mode CODE_ONLY tetap ditahan.",
    ],
  };
}
export function functionAgendaText(packet,groupId="all"){
  if(!isObject(packet)||packet.schema!==AGENDA_SCHEMA||packet.synthetic!==true||
    packet.readiness!==NO_APPROVAL||!Array.isArray(packet.groups))
    throw Error("Paket agenda M04-S9I tidak sesuai.");
  if(groupId!=="all"&&!FUNCTIONS.some(x=>x.id===groupId))
    throw Error("Fungsi agenda tidak dikenal.");
  const chosen=packet.groups.filter(x=>groupId==="all"||x.id===groupId);
  return [
    "YANDIK+ M04-S9I | DRAF AGENDA TELAAH PER FUNGSI / KODE BELUM DIUJI",
    "BUKAN UNDANGAN RESMI, NOTULEN, KEPUTUSAN ATAU PERSETUJUAN.",
    "Tanggal acuan DEMO "+packet.source.as_of_demo+
      "; repo snapshot "+packet.source.repo_snapshot.visibility+
      " per "+packet.source.repo_snapshot.observed_on+" (bukan live).",
    "Fungsi "+chosen.length+"; butir "+chosen.reduce((n,g)=>n+g.count,0)+
      "; bukti resmi terverifikasi 0; pertemuan terlaksana 0.",
    ...chosen.flatMap(g=>[
      "FUNGSI USULAN: "+g.title+" | "+g.count+" butir | "+g.discussion_state,
      "Tujuan pembahasan: "+g.goal,
      "Penelaah fungsi usulan: "+g.suggested_reviewer_role,
      ...g.items.flatMap(x=>[
        "- ["+x.phase+"] "+x.id+": "+x.title+
          " | pendahulu: "+(x.dependency_ids.join(", ")||"belum ada"),
        "  Bahan diminta: "+x.evidence_needed,
        "  Pengampu persiapan usulan: "+x.proposed_preparer_role,
        ...x.proposed_questions.map((q,i)=>"  Pertanyaan "+(i+1)+": "+q),
        "  Langkah diskusi: "+x.followup_discussion,
      ]),
    ]),
    "BATAS: "+packet.policy,
    ...packet.warnings.map(x=>"PERHATIAN: "+x),
    "STATUS: "+packet.readiness,
  ].join("\n");
}
