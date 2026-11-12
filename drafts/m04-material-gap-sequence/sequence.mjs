/**
 * YANDIK+ M04-S9P | KODE DITULIS, BELUM DIUJI.
 * Proposed reading order for synthetic discussion materials based on M04-S9G
 * dependency edges relayed via M04-S9M. This is NOT a work queue or priority.
 */
import {READINESS_SCHEMA,NOT_READY,NOTE_STATE}
  from "../m04-evidence-readiness-matrix/readiness.mjs";
import {HANDOFF_SCHEMA,NO_AUTHORITY as S9M_BOUNDARY,ITEM_STATE}
  from "../m04-human-review-handoff/handoff.mjs";
import {FUNCTIONS} from "../m04-function-review-agendas/agendas.mjs";

export const SEQUENCE_SCHEMA="M04-S9P-MATERIAL-GAP-SEQUENCE-UNTESTED-1";
export const BOUNDARY="URUTAN_DISKUSI_DEMO_BUKAN_KELULUSAN_ATAU_PENUGASAN";
export const NOTE_CLASSES=Object.freeze({
  demo_gap_written:"Ada catatan kekurangan DEMO, bukan temuan audit",
  no_demo_gap_written:"Tidak ada catatan kekurangan DEMO, bukan bukti cukup",
});
const phases=["P0","P1","P2","P3"];
const isObject=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const sortedUnique=v=>[...new Set(v)].sort();
function validate(matrix,handoff){
  if(!isObject(matrix)||matrix.schema!==READINESS_SCHEMA||
     matrix.synthetic!==true||matrix.mode!=="CODE_ONLY"||
     matrix.readiness!==NOT_READY||
     !isObject(matrix.source)||!isObject(matrix.source.repo_snapshot)||
     !Array.isArray(matrix.groups)||matrix.groups.length!==6||
     !Array.isArray(matrix.rows)||matrix.rows.length!==18||
     matrix.totals?.functions!==6||matrix.totals?.requirements!==18||
     matrix.totals?.material_requests!==18||
     matrix.totals?.documents_received_demo!==0||
     matrix.totals?.official_evidence_verified!==0||
     matrix.totals?.official_reviewers!==0||
     matrix.totals?.approved_for_integration!==0)
    throw Error("Sumber M04-S9O harus matriks sintetis belum diverifikasi.");
  if(!isObject(handoff)||handoff.schema!==HANDOFF_SCHEMA||
     handoff.synthetic!==true||handoff.mode!=="CODE_ONLY"||
     handoff.readiness!==S9M_BOUNDARY||
     !isObject(handoff.source)||!isObject(handoff.source.repo_snapshot)||
     !Array.isArray(handoff.groups)||handoff.groups.length!==6||
     handoff.totals?.requirements!==18||
     handoff.totals?.handoffs_sent!==0||
     handoff.totals?.verified_evidence!==0||
     handoff.totals?.official_reviews!==0||
     handoff.totals?.official_decisions!==0||
     handoff.totals?.official_assignments!==0)
    throw Error("Sumber M04-S9M bukan paket DEMO yang belum diserahkan.");
  const m=matrix.source,h=handoff.source;
  if(m.handoff_schema!==handoff.schema||m.revision!==h.revision||
    m.source_stale!==h.source_stale||
    m.repo_snapshot.visibility!==h.repo_snapshot.visibility||
    m.repo_snapshot.observed_on!==h.repo_snapshot.observed_on)
    throw Error("Snapshot/revisi M04-S9O dan M04-S9M tidak konsisten.");
  const validFns=new Map(FUNCTIONS.map(x=>[x.id,x.title]));
  const fromHandoff=new Map(),groupsSeen=new Set();
  for(const g of handoff.groups){
    if(!isObject(g)||!validFns.has(g.id)||g.title!==validFns.get(g.id)||
      groupsSeen.has(g.id)||!Array.isArray(g.entries)||!g.entries.length||
      g.discussion_state!=="BELUM_DITELAAH"||
      g.handoff_sent!==false||g.meeting_held!==false||
      g.decision_recorded!==false)
      throw Error("Fungsi handoff tidak sesuai DEMO.");
    groupsSeen.add(g.id);
    for(const x of g.entries){
      if(!isObject(x)||typeof x.id!=="string"||!x.id||
        fromHandoff.has(x.id)||x.agenda_function_id!==g.id||
        x.agenda_function_title!==g.title||
        !phases.includes(x.phase)||
        !Array.isArray(x.dependency_ids)||
        new Set(x.dependency_ids).size!==x.dependency_ids.length||
        !Array.isArray(x.open_questions)||!x.open_questions.length||
        x.question_responses_recorded!==0||
        x.human_review_state!==ITEM_STATE||
        x.evidence_verified!==false||x.officially_reviewed!==false||
        x.officially_assigned!==false||x.official_decision!==false||
        x.authorized_to_test!==false||x.authorized_to_deploy!==false)
        throw Error("Butir handoff mengandung duplikat atau status resmi.");
      fromHandoff.set(x.id,x);
    }
  }
  if(groupsSeen.size!==6||fromHandoff.size!==18)
    throw Error("Diperlukan tepat 6 fungsi dan 18 butir.");
  const fromMatrix=new Map(),functionSeen=new Set();
  for(const g of matrix.groups){
    if(!isObject(g)||!validFns.has(g.id)||g.title!==validFns.get(g.id)||
      functionSeen.has(g.id)||!Array.isArray(g.item_ids)||
      g.official_evidence_verified!==0||
      g.approved_for_integration!==false)
      throw Error("Kelompok matriks tidak sesuai.");
    functionSeen.add(g.id);
  }
  if(functionSeen.size!==6)throw Error("Enam fungsi matriks tidak lengkap.");
  for(const row of matrix.rows){
    const src=fromHandoff.get(row.source_item_id);
    if(!isObject(row)||!src||fromMatrix.has(row.source_item_id)||
      row.id!=="DEMO-MAT-"+row.source_item_id||
      row.function_id!==src.agenda_function_id||
      row.function_title!==src.agenda_function_title||
      row.source_revision!==src.source_revision||
      row.title!==src.title||row.phase!==src.phase||
      row.required_material_description!==src.evidence_requested||
      row.demo_note_text!==src.input_note_text_demo||
      row.demo_gap_text!==src.evidence_gap_text_demo||
      !Array.isArray(row.question_ids)||
      row.open_question_count!==src.open_questions.length||
      row.question_ids.length!==src.open_questions.length||
      row.open_question_count!==row.question_ids.length||
      row.demo_note_state!==(src.input_note_text_demo.trim()?
        "ada_catatan_demo":"belum_ada_catatan_demo")||
      row.demo_gap_written!==Boolean(src.evidence_gap_text_demo.trim())||
      !Object.prototype.hasOwnProperty.call(NOTE_STATE,row.demo_note_state)||
      row.material_requested!==true||
      row.document_received_in_demo!==false||
      row.verified_official_evidence!==false||
      row.evidence_reference!==null||
      row.reviewer_assigned_officially!==false||
      row.approved_for_integration!==false||
      row.readiness!==NOT_READY)
      throw Error("Kaitan bukti DEMO tidak cocok atau ada klaim persetujuan.");
    const correctQuestions=src.open_questions.map((_,i)=>
      "DEMO-Q-"+src.id+"-"+String(i+1).padStart(2,"0"));
    if(!same(row.question_ids,correctQuestions))
      throw Error("ID pertanyaan terkait tidak cocok.");
    fromMatrix.set(row.source_item_id,row);
  }
  if(fromMatrix.size!==18)
    throw Error("Matriks harus memiliki semua 18 ID unik.");
  for(const g of matrix.groups){
    const rows=matrix.rows.filter(x=>x.function_id===g.id);
    if(!same(sortedUnique(g.item_ids),sortedUnique(rows.map(x=>x.source_item_id)))||
      g.requested_materials!==rows.length||
      g.demo_notes_written!==rows.filter(x=>x.demo_note_state==="ada_catatan_demo").length||
      g.demo_notes_blank!==rows.filter(x=>x.demo_note_state==="belum_ada_catatan_demo").length||
      g.gap_notes_written!==rows.filter(x=>x.demo_gap_written).length)
      throw Error("Jumlah/ID pada kelompok matriks tidak cocok.");
  }
  if(matrix.totals.demo_notes_written!==matrix.rows.filter(x=>
       x.demo_note_state==="ada_catatan_demo").length||
     matrix.totals.demo_notes_blank!==matrix.rows.filter(x=>
       x.demo_note_state==="belum_ada_catatan_demo").length||
     matrix.totals.gap_notes_written!==matrix.rows.filter(x=>
       x.demo_gap_written).length||
     matrix.totals.question_prompts!==matrix.rows.reduce(
       (sum,x)=>sum+x.question_ids.length,0))
    throw Error("Ikhtisar matriks tidak sesuai isi.");
  for(const src of fromHandoff.values()){
    if(src.dependency_ids.some(parent=>!fromHandoff.has(parent)||
      parent===src.id||
      phases.indexOf(fromHandoff.get(parent)?.phase)>phases.indexOf(src.phase)))
      throw Error("Dependensi tidak dikenal, self-loop, atau melompati fase mundur.");
    const expected=src.dependency_ids.filter(dep=>
      fromHandoff.get(dep).agenda_function_id!==src.agenda_function_id);
    if(!Array.isArray(src.cross_function_dependencies)||
      !same(src.cross_function_dependencies.map(x=>x.source_id),expected)||
      src.cross_function_dependencies.some((v,i)=>
        !isObject(v)||v.function_id!==fromHandoff.get(expected[i]).agenda_function_id))
      throw Error("Kaitan lintas fungsi tidak sesuai sumber.");
  }
  return {fromHandoff,fromMatrix};
}
/** Deterministic dependency-layer order; NEVER an execution queue. */
function proposedOrder(fromHandoff){
  const remaining=new Set(fromHandoff.keys());
  const sequence=[],completed=new Set(),layers=new Map();
  while(remaining.size){
    const eligible=[...remaining].filter(id=>
      fromHandoff.get(id).dependency_ids.every(dep=>completed.has(dep)));
    if(!eligible.length)
      throw Error("Siklus dependensi terdeteksi; usulan urutan tidak boleh diterbitkan.");
    eligible.sort((a,b)=>
      phases.indexOf(fromHandoff.get(a).phase)-
      phases.indexOf(fromHandoff.get(b).phase)||a.localeCompare(b));
    for(const id of eligible){
      const preds=fromHandoff.get(id).dependency_ids;
      layers.set(id,1+Math.max(0,...preds.map(dep=>layers.get(dep))));
      sequence.push(id);completed.add(id);remaining.delete(id);
    }
  }
  return {sequence,layers};
}
export function buildMaterialGapSequence(matrix,handoff){
  const {fromHandoff,fromMatrix}=validate(matrix,handoff);
  const {sequence,layers}=proposedOrder(fromHandoff);
  const descendants=(id)=>{
    const seen=new Set(),stack=[id];
    while(stack.length){
      const parent=stack.pop();
      for(const [target,item] of fromHandoff){
        if(item.dependency_ids.includes(parent)&&!seen.has(target)){
          seen.add(target);stack.push(target);
        }
      }
    }
    return seen.size;
  };
  const rows=sequence.map((id,index)=>{
    const item=fromHandoff.get(id),mat=fromMatrix.get(id);
    return {
      id:"DEMO-SEQ-"+id,source_item_id:id,source_revision:mat.source_revision,
      discussion_sequence:index+1,dependency_layer:layers.get(id),
      function_id:mat.function_id,function_title:mat.function_title,
      phase:mat.phase,title:mat.title,
      prerequisite_ids:[...item.dependency_ids],
      cross_function_ids:item.cross_function_dependencies.map(x=>x.source_id),
      downstream_discussion_items:descendants(id),
      material_request:mat.required_material_description,
      question_ids:[...mat.question_ids],
      has_demo_text_note:mat.demo_note_state==="ada_catatan_demo",
      has_demo_gap_note:mat.demo_gap_written,
      demo_gap_text:mat.demo_gap_text,
      gap_note_class:mat.demo_gap_written?
        "demo_gap_written":"no_demo_gap_written",
      official_document_verified:false,
      assigned_officer:null,official_deadline:null,
      officially_cleared:false,authorized_to_test:false,
      authorized_to_deploy:false,readiness:NOT_READY,
    };
  });
  const groups=FUNCTIONS.map(fn=>{
    const own=rows.filter(x=>x.function_id===fn.id);
    return {
      id:fn.id,title:fn.title,
      source_ids:own.map(x=>x.source_item_id),
      count:own.length,
      demo_gap_notes:own.filter(x=>x.has_demo_gap_note).length,
      official_evidence_verified:0,official_decisions:0,
    };
  });
  const phaseWaves=phases.map(phase=>({
    phase,
    source_ids:rows.filter(x=>x.phase===phase).map(x=>x.source_item_id),
    discussion_count:rows.filter(x=>x.phase===phase).length,
    officially_cleared:false,permission_to_test:false,
  }));
  return {
    schema:SEQUENCE_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{matrix_schema:matrix.schema,handoff_schema:handoff.schema,
      revision:matrix.source.revision,source_stale:matrix.source.source_stale,
      repo_snapshot:{...matrix.source.repo_snapshot}},
    rows,groups,phaseWaves,gap_note_labels:NOTE_CLASSES,
    totals:{
      requirements:18,functions:6,discussion_waves:4,
      text_gap_notes:rows.filter(x=>x.has_demo_gap_note).length,
      blank_gap_notes:rows.filter(x=>!x.has_demo_gap_note).length,
      dependency_edges:rows.reduce((n,x)=>n+x.prerequisite_ids.length,0),
      initial_discussion_starters:rows.filter(x=>!x.prerequisite_ids.length).length,
      longest_dependency_layer:Math.max(...rows.map(x=>x.dependency_layer)),
      official_evidence_verified:0,official_tasks:0,
      official_decisions:0,authorized_tests:0,authorized_deployments:0,
    },
    readiness:BOUNDARY,
    warnings:[
      ...(matrix.source.source_stale?
        ["Snapshot berubah: wajib kaji ulang desain dependensi."]:[]),
      ...(matrix.source.repo_snapshot.visibility==="public"?
        ["Repo PUBLIC pada snapshot; dilarang unggah dokumen riil atau rahasia."]:[]),
      "Urutan berdasarkan dependensi adalah urutan baca DEMO, bukan prioritas kegiatan atau instruksi kerja.",
      "Semua permintaan bahan BELUM DIVERIFIKASI. Catatan DEMO bukan temuan dan kolom kosong bukan bukti lengkap.",
      "P0-P3 adalah kelompok persiapan diskusi, bukan tanda fase pekerjaan sudah dimulai atau selesai.",
      "Tidak ada penugasan, tenggat, keputusan, izin QA/deploy, bantuan, pengadaan atau BAST.",
    ],
  };
}
export function materialGapSequenceText(packet,functionId="all",gapClass="all"){
  if(!isObject(packet)||packet.schema!==SEQUENCE_SCHEMA||
    packet.synthetic!==true||packet.mode!=="CODE_ONLY"||
    packet.readiness!==BOUNDARY||
    !Array.isArray(packet.rows)||packet.rows.length!==18||
    !["all",...FUNCTIONS.map(f=>f.id)].includes(functionId)||
    !["all",...Object.keys(NOTE_CLASSES)].includes(gapClass))
    throw Error("Urutan bahan DEMO tidak sesuai.");
  const chosen=packet.rows.filter(x=>
    (functionId==="all"||x.function_id===functionId)&&
    (gapClass==="all"||x.gap_note_class===gapClass));
  return [
    "YANDIK+ M04-S9P | INDEKS KESENJANGAN BAHAN DEMO | BELUM DIUJI",
    "URUTAN BACA, BUKAN PRIORITAS/URUTAN EKSEKUSI, PENUGASAN ATAU IZIN.",
    "Repo snapshot "+packet.source.repo_snapshot.visibility+" per "+
      packet.source.repo_snapshot.observed_on+" (bukan live).",
    "18 butir; pendahulu awal "+packet.totals.initial_discussion_starters+
      "; catatan kekurangan teks DEMO "+packet.totals.text_gap_notes+
      "; bukti resmi terverifikasi 0.",
    ...chosen.flatMap(row=>[
      row.discussion_sequence+". ["+row.phase+"] "+row.source_item_id+
        " | lapis dependensi "+row.dependency_layer+" | "+row.title,
      "  Fungsi usulan: "+row.function_title,
      "  Pendahulu: "+(row.prerequisite_ids.join(", ")||"tidak ada"),
      "  Bahan diminta (belum diperiksa): "+row.material_request,
      "  Kekurangan catatan DEMO: "+(row.demo_gap_text||"BELUM DIISI"),
      "  Pertanyaan: "+row.question_ids.join(", "),
      "  BUKTI RESMI: BELUM DIVERIFIKASI; TUGAS RESMI: TIDAK ADA.",
    ]),
    "STATUS: "+packet.readiness,
    ...packet.warnings.map(x=>"PERINGATAN: "+x),
  ].join("\n");
}
