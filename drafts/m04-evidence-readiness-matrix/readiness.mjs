/**
 * YANDIK+ M04-S9O | KODE DITULIS, BELUM DIUJI.
 * Read-only, synthetic evidence PREPARATION matrix. No material submitted;
 * an example note is NOT documentary evidence or official verification.
 */
import {QUESTION_SCHEMA,NO_AUTHORITY as S9N_BOUNDARY,OPEN_STATE}
  from "../m04-open-question-register/questions.mjs";
import {HANDOFF_SCHEMA,NO_AUTHORITY as S9M_BOUNDARY,ITEM_STATE}
  from "../m04-human-review-handoff/handoff.mjs";
import {FUNCTIONS} from "../m04-function-review-agendas/agendas.mjs";

export const READINESS_SCHEMA="M04-S9O-EVIDENCE-MATRIX-UNTESTED-1";
export const NOT_READY="KELENGKAPAN_BUKTI_BELUM_DAPAT_DINILAI_DARI_DEMO";
export const NOTE_STATE=Object.freeze({
  ada_catatan_demo:"Ada catatan teks DEMO (BUKAN bukti dokumen)",
  belum_ada_catatan_demo:"Belum ada catatan teks DEMO (BUKAN berarti dokumen tidak ada)",
});
const obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const ids=FUNCTIONS.map(f=>f.id);
function validate(questions,handoff){
  if(!obj(questions)||questions.schema!==QUESTION_SCHEMA||
    questions.synthetic!==true||questions.mode!=="CODE_ONLY"||
    questions.readiness!==S9N_BOUNDARY||
    !obj(questions.source)||!obj(questions.source.repo_snapshot)||
    !Array.isArray(questions.groups)||questions.groups.length!==6||
    !Array.isArray(questions.rows)||questions.rows.length<18||
    questions.totals?.functions!==6||questions.totals?.source_items!==18||
    questions.totals?.questions!==questions.rows.length||
    questions.totals?.open_questions!==questions.rows.length||
    questions.totals?.official_answers!==0||
    questions.totals?.evidence_verified!==0||
    questions.totals?.official_assignments!==0||
    questions.totals?.official_decisions!==0)
    throw Error("Sumber M04-S9N bukan daftar pertanyaan DEMO terbuka.");
  if(!obj(handoff)||handoff.schema!==HANDOFF_SCHEMA||
    handoff.synthetic!==true||handoff.mode!=="CODE_ONLY"||
    handoff.readiness!==S9M_BOUNDARY||
    !obj(handoff.source)||!obj(handoff.source.repo_snapshot)||
    !Array.isArray(handoff.groups)||handoff.groups.length!==6||
    handoff.totals?.functions!==6||handoff.totals?.requirements!==18||
    handoff.totals?.evidence_requests!==18||
    handoff.totals?.open_question_prompts!==questions.rows.length||
    handoff.totals?.handoffs_sent!==0||
    handoff.totals?.official_reviews!==0||
    handoff.totals?.verified_evidence!==0||
    handoff.totals?.official_decisions!==0||
    handoff.totals?.official_assignments!==0)
    throw Error("Sumber M04-S9M bukan paket DEMO belum diserahkan.");
  const qs=questions.source,hs=handoff.source;
  if(qs.schema!==handoff.schema||qs.revision!==hs.revision||
    qs.source_stale!==hs.source_stale||
    qs.repo_snapshot.visibility!==hs.repo_snapshot.visibility||
    qs.repo_snapshot.observed_on!==hs.repo_snapshot.observed_on)
    throw Error("Revisi dan snapshot sumber M04-S9N/M04-S9M tidak cocok.");
  const items=new Map(),fns=new Set(),qf=new Set();
  for(const g of handoff.groups){
    if(!obj(g)||!ids.includes(g.id)||fns.has(g.id)||
      !Array.isArray(g.entries)||!g.entries.length||
      !Array.isArray(g.evidence_requests)||
      g.evidence_requests.length!==g.entries.length||
      !Array.isArray(g.source_ids)||
      g.source_ids.length!==g.entries.length||
      g.discussion_state!=="BELUM_DITELAAH"||
      g.handoff_sent!==false||g.meeting_held!==false||
      g.decision_recorded!==false)
      throw Error("Pengelompokan fungsi handoff tidak sesuai.");
    fns.add(g.id);
    for(let i=0;i<g.entries.length;i++){
      const e=g.entries[i],req=g.evidence_requests[i];
      if(!obj(e)||typeof e.id!=="string"||!e.id||items.has(e.id)||
        !obj(req)||req.id!==e.id||req.verified!==false||
        req.description!==e.evidence_requested||
        g.source_ids[i]!==e.id||
        e.agenda_function_id!==g.id||
        e.agenda_function_title!==g.title||
        e.source_followup_id!=="DEMO-FU-"+e.id||
        !Number.isSafeInteger(e.source_revision)||e.source_revision<0||
        !Array.isArray(e.open_questions)||!e.open_questions.length||
        e.question_responses_recorded!==0||
        typeof e.evidence_requested!=="string"||!e.evidence_requested.trim()||
        typeof e.input_note_text_demo!=="string"||
        typeof e.evidence_gap_text_demo!=="string"||
        typeof e.proposal_text_demo!=="string"||
        [e.input_note_text_demo,e.evidence_gap_text_demo,e.proposal_text_demo]
          .some(s=>s.length>500)||
        e.human_review_state!==ITEM_STATE||e.evidence_verified!==false||
        e.officially_reviewed!==false||e.officially_assigned!==false||
        e.official_decision!==false||e.authorized_to_test!==false||
        e.authorized_to_deploy!==false)
        throw Error("Butir/bukti handoff tidak lengkap atau sudah disahkan.");
      items.set(e.id,{group:g,entry:e,question_ids:[]});
    }
  }
  if(items.size!==18||fns.size!==6)throw Error("Harus ada 18 butir/6 fungsi.");
  const seen=new Set(),perGroup=new Map(ids.map(id=>[id,[]]));
  for(const group of questions.groups){
    if(!obj(group)||!ids.includes(group.id)||qf.has(group.id)||
      !Array.isArray(group.question_ids)||
      !Array.isArray(group.source_item_ids)||
      group.question_count!==group.question_ids.length||
      group.answers_confirmed!==0||group.official_review_done!==false)
      throw Error("Rekap fungsi pertanyaan tidak sesuai.");
    qf.add(group.id);
  }
  if(qf.size!==6)throw Error("Enam fungsi pertanyaan harus tersedia.");
  for(const q of questions.rows){
    const source=items.get(q.source_item_id);
    if(!obj(q)||!source||seen.has(q.id)||
      q.function_id!==source.group.id||
      q.function_title!==source.group.title||
      q.source_followup_id!==source.entry.source_followup_id||
      q.source_revision!==source.entry.source_revision||
      q.item_title!==source.entry.title||
      q.phase!==source.entry.phase||
      !Number.isSafeInteger(q.question_number)||
      q.question_number<1||
      q.id!=="DEMO-Q-"+q.source_item_id+"-"+
        String(q.question_number).padStart(2,"0")||
      source.entry.open_questions[q.question_number-1]!==q.question_text||
      q.evidence_requested!==source.entry.evidence_requested||
      q.evidence_gap_text_demo!==source.entry.evidence_gap_text_demo||
      q.answer_state!==OPEN_STATE||
      q.demo_answer!==null||q.official_answer!==null||
      q.official_evidence_verified!==false||
      q.official_reviewer_confirmed!==false||
      q.official_assignment!==false||q.decision_recorded!==false||
      q.authorized_to_test!==false||q.authorized_to_deploy!==false)
      throw Error("Pertanyaan tidak sesuai sumber atau memuat jawaban resmi.");
    seen.add(q.id);
    source.question_ids.push(q.id);
    perGroup.get(q.function_id).push(q.id);
  }
  for(const {entry,question_ids} of items.values()){
    if(question_ids.length!==entry.open_questions.length||
      new Set(question_ids).size!==question_ids.length)
      throw Error("Daftar pertanyaan suatu butir tidak lengkap.");
  }
  for(const g of questions.groups){
    const expected=perGroup.get(g.id);
    if(expected.length!==g.question_count||
      g.question_ids.length!==expected.length||
      new Set(g.question_ids).size!==expected.length||
      g.question_ids.some(id=>!expected.includes(id))||
      new Set(g.source_item_ids).size!==
        [...items.values()].filter(x=>x.group.id===g.id).length||
      g.source_item_ids.some(id=>items.get(id)?.group.id!==g.id))
      throw Error("Ringkasan pertanyaan per fungsi tidak konsisten.");
  }
  if(questions.totals.questions_with_written_gap!==questions.rows.filter(
    q=>q.evidence_gap_text_demo.trim()).length||
    questions.totals.questions_without_written_gap!==questions.rows.filter(
    q=>!q.evidence_gap_text_demo.trim()).length)
    throw Error("Klasifikasi kekurangan bukti pada pertanyaan tidak konsisten.");
  return items;
}
export function buildEvidenceReadinessMatrix(questions,handoff){
  const items=validate(questions,handoff);
  const rows=[...items.values()].map(({group,entry,question_ids})=>{
    const note=Boolean(entry.input_note_text_demo.trim());
    const gap=Boolean(entry.evidence_gap_text_demo.trim());
    return {
      id:"DEMO-MAT-"+entry.id,
      source_item_id:entry.id,source_revision:entry.source_revision,
      function_id:group.id,function_title:group.title,
      title:entry.title,phase:entry.phase,
      question_ids:[...question_ids],open_question_count:question_ids.length,
      required_material_description:entry.evidence_requested,
      material_requested:true,
      demo_note_text:entry.input_note_text_demo,
      demo_note_state:note?"ada_catatan_demo":"belum_ada_catatan_demo",
      demo_gap_text:entry.evidence_gap_text_demo,
      demo_gap_written:gap,
      document_received_in_demo:false,
      verified_official_evidence:false,
      evidence_reference:null,
      reviewer_assigned_officially:false,
      approved_for_integration:false,
      readiness:NOT_READY,
      interpretation:"Catatan teks bukan bukti; tidak ada dokumen yang diterima/diverifikasi oleh DEMO.",
    };
  });
  const groups=FUNCTIONS.map(f=>{
    const subset=rows.filter(row=>row.function_id===f.id);
    return {
      id:f.id,title:f.title,
      item_ids:subset.map(row=>row.source_item_id),
      requested_materials:subset.length,
      demo_notes_written:subset.filter(row=>row.demo_note_state==="ada_catatan_demo").length,
      demo_notes_blank:subset.filter(row=>row.demo_note_state==="belum_ada_catatan_demo").length,
      gap_notes_written:subset.filter(row=>row.demo_gap_written).length,
      official_evidence_verified:0,approved_for_integration:false,
    };
  });
  return {
    schema:READINESS_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{question_schema:questions.schema,handoff_schema:handoff.schema,
      revision:questions.source.revision,source_stale:questions.source.source_stale,
      repo_snapshot:{...questions.source.repo_snapshot}},
    rows,groups,note_labels:NOTE_STATE,
    totals:{
      functions:6,requirements:18,material_requests:18,
      question_prompts:questions.rows.length,
      demo_notes_written:rows.filter(row=>row.demo_note_state==="ada_catatan_demo").length,
      demo_notes_blank:rows.filter(row=>row.demo_note_state==="belum_ada_catatan_demo").length,
      gap_notes_written:rows.filter(row=>row.demo_gap_written).length,
      documents_received_demo:0,official_evidence_verified:0,
      official_reviewers:0,approved_for_integration:0,
    },
    readiness:NOT_READY,
    warnings:[
      ...(questions.source.source_stale?
        ["Sumber berubah; seluruh bahan perlu kaji ulang, bukan dianggap siap."]:[]),
      ...(questions.source.repo_snapshot.visibility==="public"?
        ["Repo PUBLIC pada snapshot; jangan mengunggah dokumen atau data kedinasan."]:[]),
      "Permintaan bahan bukan bukti bahwa berkas sudah diterima.",
      "Catatan DEMO bukan dokumen/bukti verifikasi. Kolom kosong bukan berarti tidak ada dokumen riil.",
      "Tidak ada nilai persentase kesiapan atau izin otomatis untuk QA, integrasi, pengadaan maupun BAST.",
    ],
  };
}
export function evidenceReadinessText(matrix,functionId="all",noteState="all"){
  if(!obj(matrix)||matrix.schema!==READINESS_SCHEMA||
    matrix.synthetic!==true||matrix.mode!=="CODE_ONLY"||
    matrix.readiness!==NOT_READY||
    !Array.isArray(matrix.rows)||matrix.rows.length!==18||
    !["all",...ids].includes(functionId)||
    !["all",...Object.keys(NOTE_STATE)].includes(noteState))
    throw Error("Matriks kesiapan bahan DEMO tidak sesuai.");
  const chosen=matrix.rows.filter(x=>
    (functionId==="all"||x.function_id===functionId)&&
    (noteState==="all"||x.demo_note_state===noteState));
  return [
    "YANDIK+ M04-S9O | MATRIKS BAHAN DEMO | KODE BELUM DIUJI",
    "BUKAN DOKUMEN RESMI, VERIFIKASI, KEPUTUSAN, ATAU PERSETUJUAN INTEGRASI.",
    "Snapshot repository "+matrix.source.repo_snapshot.visibility+
      " pada "+matrix.source.repo_snapshot.observed_on+" (bukan live).",
    "18 kebutuhan bahan; catatan teks DEMO "+matrix.totals.demo_notes_written+
      "; dokumen diterima DEMO 0; bukti resmi terverifikasi 0.",
    ...chosen.flatMap(x=>[
      "- "+x.source_item_id+" ["+x.phase+"] "+x.title,
      "  Fungsi usulan: "+x.function_title+" / revisi "+x.source_revision,
      "  Bahan DIMINTA: "+x.required_material_description,
      "  Catatan DEMO: "+(x.demo_note_text||"BELUM DIISI"),
      "  Kekurangan bukti tertulis DEMO: "+(x.demo_gap_text||"BELUM DIISI"),
      "  Pertanyaan terkait: "+x.question_ids.join(", "),
      "  BUKTI RESMI: BELUM DIVERIFIKASI. KESIAPAN: TIDAK DAPAT DINILAI DARI DEMO.",
    ]),
    "STATUS: "+matrix.readiness,
    ...matrix.warnings.map(x=>"PERINGATAN: "+x),
  ].join("\n");
}
