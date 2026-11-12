/**
 * YANDIK+ M04-S9N | KODE DITULIS, BELUM DIUJI.
 * Read-only, question-level register from the unsent synthetic M04-S9M handoff.
 * Questions are OPEN in the demo, NOT formally assigned, answered or approved.
 */
import {HANDOFF_SCHEMA,NO_AUTHORITY as S9M_BOUNDARY,ITEM_STATE}
  from "../m04-human-review-handoff/handoff.mjs";
import {FUNCTIONS} from "../m04-function-review-agendas/agendas.mjs";

export const QUESTION_SCHEMA="M04-S9N-OPEN-QUESTIONS-UNTESTED-1";
export const NO_AUTHORITY="PERTANYAAN_DEMO_BELUM_DIJAWAB_DAN_TIDAK_MENGESAHKAN_APAPUN";
export const OPEN_STATE="BELUM_ADA_JAWABAN_RESMI";
export const EVIDENCE_FILTER=Object.freeze({
  written_gap:"Ada teks kekurangan bukti CONTOH",
  no_written_gap:"Tidak ada teks kekurangan bukti CONTOH (bukan berarti lengkap)",
});
const isObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const hasOwn=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
const PHASES=new Set(["P0","P1","P2","P3"]);
const MAX_NOTE=500;
function validate(packet){
  if(!isObject(packet)||packet.schema!==HANDOFF_SCHEMA||
    packet.synthetic!==true||packet.mode!=="CODE_ONLY"||
    packet.readiness!==S9M_BOUNDARY||
    !isObject(packet.source)||!isObject(packet.source.repo_snapshot)||
    !["public","private","unknown"].includes(packet.source.repo_snapshot.visibility)||
    typeof packet.source.repo_snapshot.observed_on!=="string"||
    typeof packet.source.source_stale!=="boolean"||
    !Number.isSafeInteger(packet.source.revision)||packet.source.revision<0||
    !Array.isArray(packet.groups)||packet.groups.length!==6||
    !isObject(packet.totals)||packet.totals.functions!==6||
    packet.totals.requirements!==18||packet.totals.evidence_requests!==18||
    !Number.isSafeInteger(packet.totals.open_question_prompts)||
    packet.totals.open_question_prompts<18||
    packet.totals.handoffs_sent!==0||packet.totals.official_reviews!==0||
    packet.totals.verified_evidence!==0||packet.totals.official_decisions!==0||
    packet.totals.official_assignments!==0)
    throw Error("Hanya paket M04-S9M DEMO, belum dikirim dan tanpa keputusan.");
  const validFunctions=new Map(FUNCTIONS.map(f=>[f.id,f.title]));
  const groups=new Map(),byId=new Map();
  let n=0,evidenceCount=0,proposalCount=0,gapCount=0;
  for(const group of packet.groups){
    if(!isObject(group)||!validFunctions.has(group.id)||
      validFunctions.get(group.id)!==group.title||groups.has(group.id)||
      !Array.isArray(group.entries)||!group.entries.length||
      !Array.isArray(group.evidence_requests)||
      !Array.isArray(group.source_ids)||
      group.source_ids.length!==group.entries.length||
      group.evidence_requests.length!==group.entries.length||
      !Number.isSafeInteger(group.open_question_count)||
      group.discussion_state!=="BELUM_DITELAAH"||
      group.handoff_sent!==false||group.meeting_held!==false||
      group.decision_recorded!==false)
      throw Error("Fungsi handoff tidak unik, berubah, atau tampak resmi.");
    groups.set(group.id,group);
    let questions=0,proposals=0,gaps=0;
    for(let i=0;i<group.entries.length;i++){
      const item=group.entries[i],evidence=group.evidence_requests[i];
      if(!isObject(item)||typeof item.id!=="string"||!item.id||
        byId.has(item.id)||item.agenda_function_id!==group.id||
        item.agenda_function_title!==group.title||
        item.title?.length<1||typeof item.title!=="string"||
        !PHASES.has(item.phase)||
        !Number.isSafeInteger(item.source_revision)||item.source_revision<0||
        item.source_followup_id!=="DEMO-FU-"+item.id||
        typeof item.evidence_requested!=="string"||!item.evidence_requested||
        !isObject(evidence)||evidence.id!==item.id||
        evidence.description!==item.evidence_requested||evidence.verified!==false||
        group.source_ids[i]!==item.id||
        !Array.isArray(item.open_questions)||!item.open_questions.length||
        item.open_questions.some(q=>typeof q!=="string"||!q.trim()||q.length>1000)||
        item.question_responses_recorded!==0||
        !Array.isArray(item.dependency_ids)||
        !Array.isArray(item.cross_function_dependencies)||
        new Set(item.dependency_ids).size!==item.dependency_ids.length||
        typeof item.proposal_text_demo!=="string"||
        typeof item.evidence_gap_text_demo!=="string"||
        typeof item.input_note_text_demo!=="string"||
        [item.proposal_text_demo,item.evidence_gap_text_demo,
          item.input_note_text_demo].some(s=>s.length>MAX_NOTE)||
        typeof item.proposed_preparer_role!=="string"||
        typeof item.proposed_reviewer_role!=="string"||
        item.human_review_state!==ITEM_STATE||
        item.evidence_verified!==false||
        item.officially_reviewed!==false||item.officially_assigned!==false||
        item.official_decision!==false||
        item.authorized_to_test!==false||item.authorized_to_deploy!==false)
        throw Error("Butir/pertanyaan/bukti DEMO tidak lengkap atau tampak disetujui.");
      byId.set(item.id,{function_id:group.id,item});
      questions+=item.open_questions.length;
      n+=item.open_questions.length;
      evidenceCount++;
      proposals+=Number(Boolean(item.proposal_text_demo.trim()));
      gaps+=Number(Boolean(item.evidence_gap_text_demo.trim()));
    }
    if(questions!==group.open_question_count||
      proposals!==group.proposal_notes||gaps!==group.evidence_gap_notes)
      throw Error("Jumlah pertanyaan/catatan per fungsi tidak konsisten.");
    proposalCount+=proposals;gapCount+=gaps;
  }
  if(groups.size!==6||byId.size!==18||
    n!==packet.totals.open_question_prompts||
    evidenceCount!==packet.totals.evidence_requests||
    proposalCount!==packet.totals.proposal_notes_demo||
    gapCount!==packet.totals.gap_notes_demo||
    packet.totals.missing_proposal_text_demo!==18-proposalCount||
    packet.totals.missing_gap_text_demo!==18-gapCount)
    throw Error("Cakupan total pertanyaan dan catatan DEMO tidak sesuai.");
  for(const {function_id,item} of byId.values()){
    if(item.dependency_ids.some(dep=>!byId.has(dep)||dep===item.id))
      throw Error("Rujukan pendahulu tidak dikenal.");
    const expected=item.dependency_ids.filter(dep=>
      byId.get(dep).function_id!==function_id);
    const actual=item.cross_function_dependencies;
    if(actual.length!==expected.length||actual.some((edge,i)=>
      !isObject(edge)||edge.source_id!==expected[i]||
      edge.function_id!==byId.get(expected[i]).function_id))
      throw Error("Rujukan lintas fungsi berubah.");
  }
  return {groups,byId};
}
export function buildOpenQuestionRegister(handoff){
  validate(handoff);
  const rows=handoff.groups.flatMap(group=>
    group.entries.flatMap(item=>item.open_questions.map((question,index)=>({
      id:"DEMO-Q-"+item.id+"-"+String(index+1).padStart(2,"0"),
      source_item_id:item.id,
      source_followup_id:item.source_followup_id,
      source_revision:item.source_revision,
      question_number:index+1,
      function_id:group.id,function_title:group.title,
      phase:item.phase,item_title:item.title,
      question_text:question,
      evidence_requested:item.evidence_requested,
      evidence_gap_text_demo:item.evidence_gap_text_demo,
      proposed_preparer_role:item.proposed_preparer_role,
      proposed_reviewer_role:item.proposed_reviewer_role,
      dependency_ids:[...item.dependency_ids],
      cross_function_dependencies:
        item.cross_function_dependencies.map(edge=>({...edge})),
      evidence_gap_filter:item.evidence_gap_text_demo.trim()?
        "written_gap":"no_written_gap",
      answer_state:OPEN_STATE,
      demo_answer:null,official_answer:null,
      official_evidence_verified:false,official_reviewer_confirmed:false,
      official_assignment:false,decision_recorded:false,
      authorized_to_test:false,authorized_to_deploy:false,
    }))));
  const groups=FUNCTIONS.map(f=>{
    const questions=rows.filter(q=>q.function_id===f.id);
    return {
      id:f.id,title:f.title,
      question_ids:questions.map(q=>q.id),
      source_item_ids:[...new Set(questions.map(q=>q.source_item_id))],
      question_count:questions.length,
      with_written_gap:questions.filter(q=>q.evidence_gap_filter==="written_gap").length,
      without_written_gap:questions.filter(q=>q.evidence_gap_filter==="no_written_gap").length,
      answers_confirmed:0,official_review_done:false,
    };
  });
  return {
    schema:QUESTION_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{schema:handoff.schema,revision:handoff.source.revision,
      source_stale:handoff.source.source_stale,
      repo_snapshot:{...handoff.source.repo_snapshot}},
    groups,rows,evidence_filter_labels:EVIDENCE_FILTER,
    totals:{
      functions:groups.length,source_items:18,questions:rows.length,
      open_questions:rows.length,official_answers:0,
      questions_with_written_gap:
        rows.filter(q=>q.evidence_gap_filter==="written_gap").length,
      questions_without_written_gap:
        rows.filter(q=>q.evidence_gap_filter==="no_written_gap").length,
      evidence_verified:0,official_assignments:0,official_decisions:0,
    },
    readiness:NO_AUTHORITY,
    warnings:[
      ...(handoff.source.source_stale?[
        "Snapshot sumber berubah; perlu kaji ulang sebelum diskusi."]:[]),
      ...(handoff.source.repo_snapshot.visibility==="public"?[
        "Repo PUBLIC menurut snapshot: jangan unggah data rahasia/dokumen riil."]:[]),
      "Seluruh pertanyaan berasal dari DEMO dan belum ada jawaban manusia yang dicatat secara resmi.",
      "Tidak adanya catatan kekurangan bukti bukan tanda bukti lengkap.",
      "Fungsi penyiap dan penelaah hanya usulan, bukan penugasan yang sah.",
    ],
  };
}
export function openQuestionRegisterText(register,functionId="all",gapFilter="all"){
  if(!isObject(register)||register.schema!==QUESTION_SCHEMA||
    register.synthetic!==true||register.mode!=="CODE_ONLY"||
    register.readiness!==NO_AUTHORITY||
    !Array.isArray(register.groups)||register.groups.length!==6||
    !Array.isArray(register.rows)||register.rows.length<18||
    !["all",...FUNCTIONS.map(x=>x.id)].includes(functionId)||
    !["all",...Object.keys(EVIDENCE_FILTER)].includes(gapFilter))
    throw Error("Register pertanyaan DEMO tidak sah.");
  const rows=register.rows.filter(r=>
    (functionId==="all"||r.function_id===functionId)&&
    (gapFilter==="all"||r.evidence_gap_filter===gapFilter));
  return [
    "YANDIK+ M04-S9N | REGISTER PERTANYAAN TERBUKA DEMO | BELUM DIUJI",
    "BUKAN JAWABAN, PENUGASAN, KEPUTUSAN, BERITA ACARA, IZIN TES ATAU DEPLOY.",
    "Sumber M04-S9M revisi contoh "+register.source.revision+
      "; repo snapshot "+register.source.repo_snapshot.visibility+
      " pada "+register.source.repo_snapshot.observed_on+" (bukan live).",
    "Total "+register.totals.questions+" pertanyaan dari "+
      register.totals.source_items+" butir dalam "+register.totals.functions+
      " fungsi; jawaban resmi terkonfirmasi: 0.",
    ...rows.flatMap(q=>[
      "- "+q.id+" ["+q.phase+"] "+q.question_text,
      "  Butir: "+q.source_item_id+" / "+q.item_title+
        " / revisi contoh "+q.source_revision,
      "  Fungsi usulan: "+q.function_title,
      "  Bukti diminta (belum diperiksa): "+q.evidence_requested,
      "  Catatan kekurangan bukti DEMO: "+
        (q.evidence_gap_text_demo||"BELUM DIISI"),
      "  Pendahulu: "+(q.dependency_ids.join(", ")||"tidak ada"),
      "  Status: "+q.answer_state,
    ]),
    "STATUS: "+register.readiness,
    ...register.warnings.map(x=>"PERINGATAN: "+x),
  ].join("\n");
}
