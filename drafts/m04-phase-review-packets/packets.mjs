/**
 * YANDIK+ M04-S9Q | KODE DITULIS, BELUM DIUJI.
 * Four UNSENT synthetic phase-review packets from M04-S9P and M04-S9M.
 * Sequence means reading order only, NEVER permission to execute work.
 */
import {SEQUENCE_SCHEMA,BOUNDARY as S9P_BOUNDARY,NOTE_CLASSES}
  from "../m04-material-gap-sequence/sequence.mjs";
import {HANDOFF_SCHEMA,NO_AUTHORITY as S9M_BOUNDARY,ITEM_STATE}
  from "../m04-human-review-handoff/handoff.mjs";
import {PHASE_LABELS} from "../m04-dependency-matrix/dependencies.mjs";
import {FUNCTIONS} from "../m04-function-review-agendas/agendas.mjs";

export const PHASE_PACKET_SCHEMA="M04-S9Q-PHASE-REVIEW-PACKETS-UNTESTED-1";
export const NO_AUTHORITY="PAKET_DISKUSI_FASE_DEMO_BELUM_DIKIRIM_BUKAN_IZIN_KERJA";
export const PHASE_STATE="CONTOH_BELUM_DITELAAH_ATAU_DIJADWALKAN";
const phases=["P0","P1","P2","P3"];
const isObject=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const same=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
function validate(sequence,handoff){
  if(!isObject(sequence)||sequence.schema!==SEQUENCE_SCHEMA||
    sequence.synthetic!==true||sequence.mode!=="CODE_ONLY"||
    sequence.readiness!==S9P_BOUNDARY||
    !isObject(sequence.source)||!isObject(sequence.source.repo_snapshot)||
    !Array.isArray(sequence.rows)||sequence.rows.length!==18||
    !Array.isArray(sequence.groups)||sequence.groups.length!==6||
    !Array.isArray(sequence.phaseWaves)||sequence.phaseWaves.length!==4||
    sequence.totals?.requirements!==18||sequence.totals?.functions!==6||
    sequence.totals?.discussion_waves!==4||
    sequence.totals?.official_evidence_verified!==0||
    sequence.totals?.official_tasks!==0||
    sequence.totals?.official_decisions!==0||
    sequence.totals?.authorized_tests!==0||
    sequence.totals?.authorized_deployments!==0)
    throw Error("Sumber M04-S9P bukan urutan baca DEMO belum disahkan.");
  if(!isObject(handoff)||handoff.schema!==HANDOFF_SCHEMA||
    handoff.synthetic!==true||handoff.mode!=="CODE_ONLY"||
    handoff.readiness!==S9M_BOUNDARY||
    !isObject(handoff.source)||!isObject(handoff.source.repo_snapshot)||
    !Array.isArray(handoff.groups)||handoff.groups.length!==6||
    handoff.totals?.functions!==6||
    handoff.totals?.requirements!==18||
    handoff.totals?.evidence_requests!==18||
    handoff.totals?.handoffs_sent!==0||
    handoff.totals?.official_reviews!==0||
    handoff.totals?.verified_evidence!==0||
    handoff.totals?.official_decisions!==0||
    handoff.totals?.official_assignments!==0)
    throw Error("Paket M04-S9M bukan handoff sintetis yang belum dikirim.");
  const s=sequence.source,h=handoff.source;
  if(s.handoff_schema!==handoff.schema||
    s.revision!==h.revision||s.source_stale!==h.source_stale||
    s.repo_snapshot.visibility!==h.repo_snapshot.visibility||
    s.repo_snapshot.observed_on!==h.repo_snapshot.observed_on)
    throw Error("Revisi/snapshot kedua sumber tidak cocok.");
  const functions=new Map(FUNCTIONS.map(x=>[x.id,x.title]));
  const handoffItems=new Map(),handoffGroups=new Set();
  for(const g of handoff.groups){
    if(!isObject(g)||!functions.has(g.id)||functions.get(g.id)!==g.title||
      handoffGroups.has(g.id)||
      !Array.isArray(g.entries)||!g.entries.length||
      !Array.isArray(g.evidence_requests)||
      g.evidence_requests.length!==g.entries.length||
      !Array.isArray(g.source_ids)||g.source_ids.length!==g.entries.length||
      g.discussion_state!=="BELUM_DITELAAH"||
      g.handoff_sent!==false||g.meeting_held!==false||
      g.decision_recorded!==false)
      throw Error("Fungsi handoff tidak unik atau telah ditetapkan.");
    handoffGroups.add(g.id);
    let questions=0;
    for(let i=0;i<g.entries.length;i++){
      const x=g.entries[i],req=g.evidence_requests[i];
      if(!isObject(x)||typeof x.id!=="string"||!x.id||
        handoffItems.has(x.id)||g.source_ids[i]!==x.id||
        x.agenda_function_id!==g.id||x.agenda_function_title!==g.title||
        !phases.includes(x.phase)||
        !isObject(req)||req.id!==x.id||
        req.description!==x.evidence_requested||req.verified!==false||
        x.source_followup_id!=="DEMO-FU-"+x.id||
        !Number.isSafeInteger(x.source_revision)||x.source_revision<0||
        !Array.isArray(x.open_questions)||!x.open_questions.length||
        x.open_questions.some(q=>typeof q!=="string"||!q.trim()||q.length>1000)||
        x.question_responses_recorded!==0||
        !Array.isArray(x.dependency_ids)||
        new Set(x.dependency_ids).size!==x.dependency_ids.length||
        !Array.isArray(x.cross_function_dependencies)||
        typeof x.evidence_requested!=="string"||!x.evidence_requested.trim()||
        typeof x.evidence_gap_text_demo!=="string"||
        typeof x.proposal_text_demo!=="string"||
        x.human_review_state!==ITEM_STATE||
        x.evidence_verified!==false||x.officially_reviewed!==false||
        x.officially_assigned!==false||x.official_decision!==false||
        x.authorized_to_test!==false||x.authorized_to_deploy!==false)
        throw Error("Butir sumber DEMO tidak lengkap atau mengaku resmi.");
      handoffItems.set(x.id,x);
      questions+=x.open_questions.length;
    }
    if(g.open_question_count!==questions)
      throw Error("Jumlah pertanyaan fungsi berbeda dengan sumber.");
  }
  if(handoffGroups.size!==6||handoffItems.size!==18||
    handoff.totals.open_question_prompts!==
      [...handoffItems.values()].reduce((n,x)=>n+x.open_questions.length,0))
    throw Error("Paket harus memuat 18 butir dan semua pertanyaan asal.");
  const sequenceMap=new Map(),ordered=[];
  for(const row of sequence.rows){
    const x=handoffItems.get(row.source_item_id);
    if(!isObject(row)||!x||sequenceMap.has(row.source_item_id)||
      row.id!=="DEMO-SEQ-"+row.source_item_id||
      !Number.isInteger(row.discussion_sequence)||
      row.discussion_sequence<1||row.discussion_sequence>18||
      row.discussion_sequence!==ordered.length+1||
      !Number.isInteger(row.dependency_layer)||row.dependency_layer<1||
      row.function_id!==x.agenda_function_id||
      row.function_title!==x.agenda_function_title||
      row.title!==x.title||row.phase!==x.phase||
      row.source_revision!==x.source_revision||
      !Array.isArray(row.prerequisite_ids)||
      !same(row.prerequisite_ids,x.dependency_ids)||
      !Array.isArray(row.cross_function_ids)||
      !same(row.cross_function_ids,
        x.cross_function_dependencies.map(edge=>edge.source_id))||
      row.material_request!==x.evidence_requested||
      !Array.isArray(row.question_ids)||
      !same(row.question_ids,x.open_questions.map((_,i)=>
        "DEMO-Q-"+x.id+"-"+String(i+1).padStart(2,"0")))||
      row.has_demo_gap_note!==Boolean(x.evidence_gap_text_demo.trim())||
      row.demo_gap_text!==x.evidence_gap_text_demo||
      row.gap_note_class!==(x.evidence_gap_text_demo.trim()?
        "demo_gap_written":"no_demo_gap_written")||
      !Object.prototype.hasOwnProperty.call(NOTE_CLASSES,row.gap_note_class)||
      row.official_document_verified!==false||
      row.assigned_officer!==null||row.official_deadline!==null||
      row.officially_cleared!==false||
      row.authorized_to_test!==false||
      row.authorized_to_deploy!==false)
      throw Error("Urutan/bukti/pertanyaan berbeda dengan handoff DEMO.");
    sequenceMap.set(row.source_item_id,row);
    ordered.push(row.source_item_id);
  }
  if(sequenceMap.size!==18)throw Error("Ada butir yang hilang.");
  for(const row of sequence.rows){
    if(row.prerequisite_ids.some(dep=>!sequenceMap.has(dep)||
      sequenceMap.get(dep).discussion_sequence>=row.discussion_sequence||
      sequenceMap.get(dep).dependency_layer>=row.dependency_layer||
      phases.indexOf(sequenceMap.get(dep).phase)>phases.indexOf(row.phase)))
      throw Error("Pendahulu tidak valid atau urutan didahului penerus.");
    const depth=1+Math.max(0,...row.prerequisite_ids.map(dep=>
      sequenceMap.get(dep).dependency_layer));
    if(row.dependency_layer!==depth)
      throw Error("Lapisan dependensi tidak cocok.");
    const x=handoffItems.get(row.source_item_id);
    const expected=x.dependency_ids.filter(dep=>
      handoffItems.get(dep)?.agenda_function_id!==x.agenda_function_id);
    if(!same(row.cross_function_ids,expected))
      throw Error("Rujukan lintas fungsi berubah.");
  }
  const seenWaves=new Set();
  for(const wave of sequence.phaseWaves){
    if(!isObject(wave)||!phases.includes(wave.phase)||
      seenWaves.has(wave.phase)||!Array.isArray(wave.source_ids)||
      wave.discussion_count!==wave.source_ids.length||
      !same(wave.source_ids,sequence.rows.filter(x=>
        x.phase===wave.phase).map(x=>x.source_item_id))||
      wave.officially_cleared!==false||
      wave.permission_to_test!==false)
      throw Error("Kelompok fase DEMO tidak cocok atau telah disahkan.");
    seenWaves.add(wave.phase);
  }
  if(seenWaves.size!==4)throw Error("Harus ada empat kelompok fase.");
  const seenFns=new Set();
  for(const g of sequence.groups){
    if(!isObject(g)||!functions.has(g.id)||seenFns.has(g.id)||
      g.title!==functions.get(g.id)||
      !Array.isArray(g.source_ids)||
      !same(g.source_ids,sequence.rows.filter(x=>
        x.function_id===g.id).map(x=>x.source_item_id))||
      g.count!==g.source_ids.length||
      g.demo_gap_notes!==sequence.rows.filter(x=>
        x.function_id===g.id&&x.has_demo_gap_note).length||
      g.official_evidence_verified!==0||g.official_decisions!==0)
      throw Error("Ringkasan fungsi urutan tidak sesuai.");
    seenFns.add(g.id);
  }
  if(seenFns.size!==6||
    sequence.totals.text_gap_notes!==sequence.rows.filter(x=>x.has_demo_gap_note).length||
    sequence.totals.blank_gap_notes!==sequence.rows.filter(x=>!x.has_demo_gap_note).length||
    sequence.totals.dependency_edges!==sequence.rows.reduce(
      (n,x)=>n+x.prerequisite_ids.length,0))
    throw Error("Total ringkasan tidak cocok dengan baris.");
  return {handoffItems,sequenceMap};
}
export function buildPhaseReviewPackets(sequence,handoff){
  const {handoffItems}=validate(sequence,handoff);
  const packets=phases.map(phase=>{
    const ordered=sequence.rows.filter(row=>row.phase===phase);
    const entries=ordered.map(row=>{
      const src=handoffItems.get(row.source_item_id);
      return {
        id:"DEMO-REVIEW-"+row.source_item_id,
        source_id:row.source_item_id,
        source_sequence_id:row.id,
        phase,discussion_sequence:row.discussion_sequence,
        dependency_layer:row.dependency_layer,
        source_revision:row.source_revision,
        function_id:row.function_id,function_title:row.function_title,
        title:row.title,
        prerequisite_ids:[...row.prerequisite_ids],
        cross_function_ids:[...row.cross_function_ids],
        material_requested:row.material_request,
        material_received_demo:false,
        evidence_officially_verified:false,
        example_gap_note:row.demo_gap_text,
        gap_note_class:row.gap_note_class,
        proposal_text_demo:src.proposal_text_demo,
        open_questions:src.open_questions.map((q,i)=>({
          id:row.question_ids[i],text:q,
          answer_recorded:false,official_answer:null,
        })),
        proposed_preparer_role:src.proposed_preparer_role,
        proposed_reviewer_role:src.proposed_reviewer_role,
        human_review_complete:false,official_decision:false,
        officially_assigned:false,authorized_to_test:false,
        authorized_to_deploy:false,
      };
    });
    return {
      phase,title:PHASE_LABELS[phase],
      description:"Usulan urutan bahan telaah, bukan fase pekerjaan resmi.",
      item_ids:entries.map(x=>x.source_id),
      entries,
      question_count:entries.reduce((n,x)=>n+x.open_questions.length,0),
      required_material_count:entries.length,
      example_gap_notes:entries.filter(x=>x.example_gap_note.trim()).length,
      official_documents_verified:0,
      unsent:true,formal_meeting:false,
      phase_review_state:PHASE_STATE,
      official_approval:false,permission_to_test:false,
      permission_to_deploy:false,
    };
  });
  return {
    schema:PHASE_PACKET_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{sequence_schema:sequence.schema,handoff_schema:handoff.schema,
      revision:sequence.source.revision,
      source_stale:sequence.source.source_stale,
      repo_snapshot:{...sequence.source.repo_snapshot}},
    packets,
    totals:{
      phases:4,functions:6,items:18,
      open_questions:packets.reduce((n,p)=>n+p.question_count,0),
      materials_requested:18,
      example_gap_notes:packets.reduce((n,p)=>n+p.example_gap_notes,0),
      official_evidence_verified:0,
      official_answers:0,official_decisions:0,
      formal_meetings:0,packages_sent:0,
      official_assignments:0,
      authorized_tests:0,authorized_deployments:0,
    },
    readiness:NO_AUTHORITY,
    warnings:[
      ...(sequence.source.source_stale?
        ["Sumber DEMO ditandai berubah; telaah ulang sebelum memanfaatkan ringkasan."]:[]),
      ...(sequence.source.repo_snapshot.visibility==="public"?
        ["Repository PUBLIC menurut snapshot. Jangan menyimpan dokumen atau data kedinasan."]:[]),
      "Urutan P0-P3 hanya saran membaca bahan, bukan jadwal atau urutan kerja dinas.",
      "Pendahulu sudah disebut pada daftar, BUKAN berarti prasyarat sudah dipenuhi.",
      "Semua pertanyaan belum dijawab resmi; semua bahan diminta tetapi belum diverifikasi.",
      "Paket belum dikirim dan tidak memberi keputusan, penugasan, izin tes/deploy, bantuan, pengadaan atau BAST.",
    ],
  };
}
export function phaseReviewPacketsText(bundle,phase="all",functionId="all"){
  if(!isObject(bundle)||bundle.schema!==PHASE_PACKET_SCHEMA||
    bundle.synthetic!==true||bundle.mode!=="CODE_ONLY"||
    bundle.readiness!==NO_AUTHORITY||
    !Array.isArray(bundle.packets)||bundle.packets.length!==4||
    !["all",...phases].includes(phase)||
    !["all",...FUNCTIONS.map(f=>f.id)].includes(functionId))
    throw Error("Paket fase tidak sesuai kontrak DEMO.");
  const selected=bundle.packets.filter(p=>phase==="all"||phase===p.phase);
  return [
    "YANDIK+ M04-S9Q | PAKET BAHAN PEMBAHASAN FASE DEMO | BELUM DIUJI",
    "BELUM DIKIRIM. BUKAN UNDANGAN, TUGAS, NOTULEN, KEPUTUSAN ATAU IZIN INTEGRASI.",
    "Sumber M04-S9P revisi contoh "+bundle.source.revision+
      " | snapshot repo "+bundle.source.repo_snapshot.visibility+
      " per "+bundle.source.repo_snapshot.observed_on+" (bukan live).",
    "Total empat fase, 18 butir, "+bundle.totals.open_questions+
      " pertanyaan terbuka, 0 bukti resmi diverifikasi.",
    ...selected.flatMap(packet=>{
      const entries=packet.entries.filter(x=>
        functionId==="all"||x.function_id===functionId);
      return [
        "FASE "+packet.phase+" | "+packet.title,
        "Bahan ditampilkan "+entries.length+" dari "+packet.entries.length+
          "; belum ada rapat, jawaban atau penugasan resmi.",
        ...entries.flatMap(e=>[
          "- Urutan baca "+e.discussion_sequence+" | "+
            e.source_id+" ["+e.function_title+"] "+e.title,
          "  Pendahulu: "+(e.prerequisite_ids.join(", ")||"tidak ada"),
          "  Bahan diminta (BELUM DIVERIFIKASI): "+e.material_requested,
          "  Catatan kekurangan DEMO: "+(e.example_gap_note||"BELUM DIISI"),
          "  Usulan DEMO: "+(e.proposal_text_demo||"BELUM DIISI"),
          ...e.open_questions.map(q=>
            "  Pertanyaan BELUM DIJAWAB: "+q.id+" | "+q.text),
        ]),
      ];
    }),
    "STATUS: "+bundle.readiness,
    ...bundle.warnings.map(w=>"PERINGATAN: "+w),
  ].join("\n");
}
