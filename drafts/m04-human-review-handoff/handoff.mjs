/**
 * YANDIK+ M04-S9M | KODE DITULIS, BELUM DIUJI.
 * Unsent read-only DEMO handoff packet for future HUMAN review.
 * No official letter, assignment, meeting, verification, approval or QA/deploy permit.
 */
import {RECAP_SCHEMA,NO_DECISION as S9L_BOUNDARY,CLASSES}
  from "../m04-cross-function-recap/recap.mjs";
import {AGENDA_SCHEMA,NO_APPROVAL as S9I_BOUNDARY,FUNCTIONS}
  from "../m04-function-review-agendas/agendas.mjs";

export const HANDOFF_SCHEMA="M04-S9M-HUMAN-REVIEW-HANDOFF-UNTESTED-1";
export const NO_AUTHORITY="PAKET_BAHAN_DEMO_BELUM_DISERAHKAN_BUKAN_KEPUTUSAN_RESMI";
export const ITEM_STATE="BELUM_DITELAAH_MANUSIA";
const obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
const phaseKeys=["P0","P1","P2","P3"];

function validate(recap,agenda){
  if(!obj(recap)||recap.schema!==RECAP_SCHEMA||recap.synthetic!==true||
    recap.mode!=="CODE_ONLY"||recap.readiness!==S9L_BOUNDARY||
    !Array.isArray(recap.functions)||recap.functions.length!==6||
    !Array.isArray(recap.rows)||recap.rows.length!==18||
    !obj(recap.totals)||recap.totals.functions!==6||
    recap.totals.items!==18||recap.totals.official_tasks!==0||
    recap.totals.official_decisions!==0||
    recap.totals.official_evidence_verified!==0||
    !obj(recap.source)||!obj(recap.source.repo_snapshot)||
    !Number.isSafeInteger(recap.source.revision)||recap.source.revision<0||
    typeof recap.source.source_stale!=="boolean")
    throw Error("Rekap M04-S9L harus DEMO tanpa keputusan dan 18 butir.");
  if(!obj(agenda)||agenda.schema!==AGENDA_SCHEMA||
    agenda.synthetic!==true||agenda.mode!=="CODE_ONLY"||
    agenda.readiness!==S9I_BOUNDARY||
    !Array.isArray(agenda.groups)||agenda.groups.length!==6||
    agenda.totals?.functions!==6||agenda.totals?.agenda_items!==18||
    agenda.totals?.verified_materials!==0||
    agenda.totals?.confirmed_reviewers!==0||
    agenda.totals?.meetings_held!==0||
    agenda.totals?.official_decisions!==0||
    agenda.totals?.sent_invitations!==0||
    !obj(agenda.source)||!obj(agenda.source.repo_snapshot)||
    typeof agenda.source_stale!=="boolean")
    throw Error("Agenda M04-S9I bukan DEMO yang belum dijalankan.");
  const snapA=agenda.source.repo_snapshot,snapR=recap.source.repo_snapshot;
  if(snapA.visibility!==snapR.visibility||snapA.observed_on!==snapR.observed_on||
    agenda.source_stale!==recap.source.source_stale)
    throw Error("Snapshot atau status sumber agenda dan rekap tidak cocok.");
  const functionIds=FUNCTIONS.map(x=>x.id);
  const af=new Map(),rf=new Map(),ai=new Map(),ri=new Map();
  for(const g of agenda.groups){
    if(!obj(g)||!functionIds.includes(g.id)||af.has(g.id)||
      !Array.isArray(g.items)||!g.items.length||g.count!==g.items.length||
      !Array.isArray(g.source_ids)||g.source_ids.length!==g.items.length||
      g.invitation_sent!==false||g.meeting_held!==false||
      g.minutes_official!==false||g.owner_assigned!==false||
      g.discussion_state!=="BELUM_DIJADWALKAN")
      throw Error("Fungsi agenda DEMO tidak cocok atau telah dikonfirmasi.");
    af.set(g.id,g);
    for(const a of g.items){
      if(!obj(a)||typeof a.id!=="string"||ai.has(a.id)||
        !g.source_ids.includes(a.id)||typeof a.title!=="string"||!a.title||
        typeof a.evidence_needed!=="string"||!a.evidence_needed||
        !Array.isArray(a.dependency_ids)||
        !Array.isArray(a.proposed_questions)||!a.proposed_questions.length||
        a.proposed_questions.some(q=>typeof q!=="string"||!q)||
        typeof a.proposed_preparer_role!=="string"||
        typeof a.proposed_reviewer_role!=="string"||
        a.evidence_verified!==false||a.reviewer_confirmed!==false||
        a.meeting_held!==false||a.decision_made!==false)
        throw Error("Butir agenda tidak unik, tidak lengkap atau telah disahkan.");
      ai.set(a.id,{function_id:g.id,data:a});
    }
  }
  for(const f of recap.functions){
    if(!obj(f)||!functionIds.includes(f.id)||rf.has(f.id)||
      !Array.isArray(f.source_ids)||!f.source_ids.length||
      f.total!==f.source_ids.length||f.official_tasks!==0||
      f.official_decisions!==0)
      throw Error("Rekap fungsi tidak sah atau mengandung penetapan.");
    rf.set(f.id,f);
  }
  if(af.size!==6||rf.size!==6||ai.size!==18)
    throw Error("Harus ada enam fungsi dan delapan belas agenda.");
  let proposals=0,gaps=0,links=0;
  for(const row of recap.rows){
    const a=ai.get(row.source_id),f=rf.get(row.function_id);
    if(!obj(row)||!a||!f||ri.has(row.source_id)||
      a.function_id!==row.function_id||
      row.id!=="DEMO-FU-"+row.source_id||
      row.source_title!==a.data.title||
      row.phase!==a.data.phase||!phaseKeys.includes(row.phase)||
      row.source_material!==a.data.evidence_needed||
      !Array.isArray(row.source_dependencies)||
      row.source_dependencies.length!==a.data.dependency_ids.length||
      row.source_dependencies.some((v,i)=>v!==a.data.dependency_ids[i])||
      !Array.isArray(row.cross_function_dependencies)||
      !Number.isSafeInteger(row.source_revision)||row.source_revision<0||
      typeof row.masukan_demo!=="string"||
      typeof row.kekurangan_bukti_demo!=="string"||
      typeof row.usulan_tindak_lanjut_demo!=="string"||
      [row.masukan_demo,row.kekurangan_bukti_demo,row.usulan_tindak_lanjut_demo]
        .some(x=>x.length>500)||
      !own(CLASSES,row.class_code)||row.class_label!==CLASSES[row.class_code]||
      row.class_code!==classify(row)||
      row.preparer_role_suggestion!==a.data.proposed_preparer_role||
      row.reviewer_role_suggestion!==a.data.proposed_reviewer_role||
      row.official_evidence_verified!==false||row.confirmed_officer!==false||
      row.officially_assigned!==false||row.official_decision!==false||
      row.authorization_to_test!==false||row.authorization_to_deploy!==false)
      throw Error("Rekap butir tidak sesuai agenda atau berisi keputusan resmi.");
    ri.set(row.source_id,row);
    proposals+=Number(Boolean(row.usulan_tindak_lanjut_demo.trim()));
    gaps+=Number(Boolean(row.kekurangan_bukti_demo.trim()));
    links+=row.cross_function_dependencies.length;
  }
  if(ri.size!==18||recap.totals.proposal_notes!==proposals||
    recap.totals.gap_notes!==gaps||
    recap.totals.no_proposal_notes!==18-proposals||
    recap.totals.no_gap_notes!==18-gaps||
    recap.totals.cross_function_links!==links)
    throw Error("Rekap angka DEMO tidak sesuai isi yang tertulis.");
  for(const row of recap.rows){
    if(new Set(row.source_dependencies).size!==row.source_dependencies.length||
      row.source_dependencies.some(dep=>!ri.has(dep)||dep===row.source_id))
      throw Error("Pendahulu tidak dikenal atau diri sendiri.");
    const expected=row.source_dependencies.filter(
      dep=>ri.get(dep).function_id!==row.function_id);
    const found=row.cross_function_dependencies;
    if(found.length!==expected.length||
      found.some((v,i)=>!obj(v)||v.source_id!==expected[i]||
        v.function_id!==ri.get(expected[i]).function_id))
      throw Error("Rujukan lintas fungsi tidak sesuai sumber.");
  }
  for(const f of FUNCTIONS){
    const fromAgenda=af.get(f.id),fromRecap=rf.get(f.id);
    const ids=recap.rows.filter(x=>x.function_id===f.id).map(x=>x.source_id);
    if(fromRecap.title!==f.title||
      fromRecap.source_ids.length!==ids.length||
      new Set(fromRecap.source_ids).size!==ids.length||
      fromRecap.source_ids.some(x=>!ids.includes(x))||
      new Set(fromAgenda.source_ids).size!==ids.length||
      fromAgenda.source_ids.some(x=>!ids.includes(x))||
      fromRecap.proposal_notes!==ids.filter(x=>
        ri.get(x).usulan_tindak_lanjut_demo.trim()).length||
      fromRecap.gap_notes!==ids.filter(x=>
        ri.get(x).kekurangan_bukti_demo.trim()).length)
      throw Error("Ringkasan per fungsi tidak sesuai item sumber.");
  }
  return {af,ri};
}
function classify(row){
  const p=Boolean(row.usulan_tindak_lanjut_demo.trim());
  const g=Boolean(row.kekurangan_bukti_demo.trim());
  return p?(g?"proposal_and_gap":"proposal_only"):
    g?"gap_only":"no_proposal_or_gap";
}
export function buildHumanReviewHandoff(recap,agenda){
  const {af,ri}=validate(recap,agenda);
  const groups=FUNCTIONS.map(f=>{
    const g=af.get(f.id);
    const entries=g.items.map(a=>{
      const r=ri.get(a.id);
      return {
        id:a.id,title:a.title,phase:r.phase,
        agenda_function_id:f.id,agenda_function_title:g.title,
        source_followup_id:r.id,source_revision:r.source_revision,
        evidence_requested:r.source_material,
        evidence_verified:false,
        open_questions:[...a.proposed_questions],
        question_responses_recorded:0,
        dependency_ids:[...r.source_dependencies],
        cross_function_dependencies:r.cross_function_dependencies.map(x=>({...x})),
        proposal_text_demo:r.usulan_tindak_lanjut_demo,
        evidence_gap_text_demo:r.kekurangan_bukti_demo,
        input_note_text_demo:r.masukan_demo,
        class_code:r.class_code,
        class_label:r.class_label,
        proposed_preparer_role:a.proposed_preparer_role,
        proposed_reviewer_role:a.proposed_reviewer_role,
        human_review_state:ITEM_STATE,
        officially_reviewed:false,officially_assigned:false,
        official_decision:false,authorized_to_test:false,
        authorized_to_deploy:false,
      };
    });
    return {
      id:f.id,title:f.title,goal:g.goal,
      proposed_reviewer_role:g.suggested_reviewer_role,
      entries,source_ids:entries.map(x=>x.id),
      evidence_requests:entries.map(x=>({id:x.id,description:x.evidence_requested,
        verified:false})),
      open_question_count:entries.reduce((n,x)=>n+x.open_questions.length,0),
      proposal_notes:entries.filter(x=>x.proposal_text_demo.trim()).length,
      evidence_gap_notes:entries.filter(x=>x.evidence_gap_text_demo.trim()).length,
      discussion_state:"BELUM_DITELAAH",
      handoff_sent:false,meeting_held:false,decision_recorded:false,
    };
  });
  return {
    schema:HANDOFF_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{recap_schema:recap.schema,agenda_schema:agenda.schema,
      revision:recap.source.revision,
      source_stale:recap.source.source_stale,
      repo_snapshot:{...recap.source.repo_snapshot}},
    groups,
    totals:{
      functions:groups.length,
      requirements:groups.reduce((n,g)=>n+g.entries.length,0),
      evidence_requests:groups.reduce((n,g)=>n+g.evidence_requests.length,0),
      open_question_prompts:groups.reduce((n,g)=>n+g.open_question_count,0),
      proposal_notes_demo:recap.totals.proposal_notes,
      gap_notes_demo:recap.totals.gap_notes,
      missing_proposal_text_demo:recap.totals.no_proposal_notes,
      missing_gap_text_demo:recap.totals.no_gap_notes,
      handoffs_sent:0,official_reviews:0,verified_evidence:0,
      official_decisions:0,official_assignments:0,
    },
    readiness:NO_AUTHORITY,
    caution:"Hanya bahan presentasi diskusi DEMO: bukan surat, berita acara, hasil audit, penugasan, keputusan, izin QA/deploy, bantuan, pengadaan atau BAST.",
    warnings:[
      ...(recap.source.source_stale?[
        "Sumber ditandai berubah; paket DEMO memerlukan pemeriksaan ulang sebelum diskusi."]:[]),
      ...(recap.source.repo_snapshot.visibility==="public"?[
        "Repo PUBLIC pada snapshot. Jangan menaruh informasi rahasia atau dokumen kedinasan."]:[]),
      "Tiap pertanyaan masih terbuka karena tidak ada jawaban/keputusan resmi pada fixture.",
      "Kolom bukti kosong bukan berarti bukti lengkap atau masalah selesai.",
      "Keenam fungsi dan peran penelaah hanya usulan, bukan penugasan instansi.",
    ],
  };
}
export function humanReviewHandoffText(packet,functionId="all"){
  if(!obj(packet)||packet.schema!==HANDOFF_SCHEMA||
    packet.synthetic!==true||packet.mode!=="CODE_ONLY"||
    packet.readiness!==NO_AUTHORITY||
    !Array.isArray(packet.groups)||packet.groups.length!==6||
    !["all",...FUNCTIONS.map(x=>x.id)].includes(functionId))
    throw Error("Paket handoff M04-S9M tidak sah.");
  const selected=packet.groups.filter(g=>functionId==="all"||g.id===functionId);
  return [
    "YANDIK+ M04-S9M | PAKET BAHAN TELAAH MANUSIA DEMO | BELUM DIUJI",
    "BELUM DIKIRIM. BUKAN SURAT, NOTULEN, PENUGASAN ATAU PERSETUJUAN.",
    "Sumber M04-S9L revisi contoh "+packet.source.revision+
      " | repo snapshot "+packet.source.repo_snapshot.visibility+
      " per "+packet.source.repo_snapshot.observed_on+" (bukan live)",
    "Fungsi "+selected.length+" | butir "+
      selected.reduce((n,g)=>n+g.entries.length,0)+
      " | pertanyaan terbuka "+
      selected.reduce((n,g)=>n+g.open_question_count,0)+
      " | bukti resmi diverifikasi 0.",
    ...selected.flatMap(g=>[
      "FUNGSI USULAN: "+g.title+" | "+g.discussion_state,
      "Tujuan: "+g.goal,
      "Penelaah usulan: "+g.proposed_reviewer_role,
      ...g.entries.flatMap(e=>[
        "- ["+e.phase+"] "+e.id+" | "+e.title,
        "  Asal: "+e.source_followup_id+" / revisi "+e.source_revision,
        "  Bukti diminta (BELUM DIVERIFIKASI): "+e.evidence_requested,
        "  Pendahulu: "+(e.dependency_ids.join(", ")||"tidak ada"),
        "  Catatan kekurangan DEMO: "+(e.evidence_gap_text_demo||"BELUM DIISI"),
        "  Usulan DEMO: "+(e.proposal_text_demo||"BELUM DIISI"),
        ...e.open_questions.map((q,i)=>"  Pertanyaan terbuka "+(i+1)+": "+q),
      ]),
    ]),
    ...packet.warnings.map(x=>"PERINGATAN: "+x),
    "STATUS: "+packet.readiness,packet.caution,
  ].join("\n");
}
