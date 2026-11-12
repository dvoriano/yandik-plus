/**
 * YANDIK+ M04-S9K | KODE DITULIS, BELUM DIUJI.
 * Read-only PROPOSED follow-ups from M04-S9J in-memory DEMO notes.
 * Nothing here assigns personnel, verifies evidence or creates official tasks.
 */
import {CONFIRMATION_SCHEMA,NO_DECISION as S9J_NO_DECISION}
  from "../m04-discussion-confirmation/confirmation.mjs";
import {AGENDA_SCHEMA,NO_APPROVAL as S9I_NO_APPROVAL,FUNCTIONS}
  from "../m04-function-review-agendas/agendas.mjs";

export const FOLLOWUP_SCHEMA="M04-S9K-PROPOSED-FOLLOWUPS-UNTESTED-1";
export const NO_AUTHORITY="USULAN_DEMO_TIDAK_MEMBUAT_TUGAS_ATAU_KEPUTUSAN";
export const STATUS=Object.freeze({
  USULAN_CONTOH_PERLU_TELAAH:"Ada teks usulan DEMO; perlu telaah manusia",
  BELUM_ADA_USULAN_CONTOH:"Belum ada teks usulan DEMO; bukan berarti tidak perlu ditindaklanjuti",
});
const isObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const text=x=>typeof x==="string";
function validate(view,agenda){
  if(!isObject(view)||view.schema!==CONFIRMATION_SCHEMA||
    view.synthetic!==true||view.mode!=="CODE_ONLY"||
    view.readiness!==S9J_NO_DECISION||!Array.isArray(view.groups)||
    view.groups.length!==6||view.totals?.items!==18||
    view.totals?.functions!==6||view.totals?.official_reviews!==0||
    view.totals?.verified_evidence!==0||view.totals?.formal_decisions!==0||
    view.totals?.authorized_tests!==0||view.totals?.authorized_deployments!==0||
    !isObject(view.source_snapshot))
    throw Error("Sumber M04-S9J DEMO tidak valid atau mengandung status resmi.");
  if(!isObject(agenda)||agenda.schema!==AGENDA_SCHEMA||
    agenda.synthetic!==true||agenda.mode!=="CODE_ONLY"||
    agenda.readiness!==S9I_NO_APPROVAL||
    !Array.isArray(agenda.groups)||agenda.groups.length!==6||
    agenda.totals?.agenda_items!==18||agenda.totals?.official_decisions!==0||
    agenda.totals?.meetings_held!==0||
    agenda.totals?.verified_materials!==0||
    agenda.totals?.confirmed_reviewers!==0||
    agenda.totals?.sent_invitations!==0||!isObject(agenda.source?.repo_snapshot))
    throw Error("Agenda M04-S9I bukan bahan DEMO yang belum diputuskan.");
  if(view.source_stale!==agenda.source_stale||
    view.source_snapshot.visibility!==agenda.source.repo_snapshot.visibility||
    view.source_snapshot.observed_on!==agenda.source.repo_snapshot.observed_on)
    throw Error("Snapshot agenda dan catatan berbeda; kaji ulang sebelum membuat draf.");
  const funcs=new Set(FUNCTIONS.map(x=>x.id));
  const groups=new Map(),ids=new Set();
  for(const g of agenda.groups){
    if(!isObject(g)||!funcs.has(g.id)||groups.has(g.id)||
      g.meeting_held!==false||g.minutes_official!==false||
      g.invitation_sent!==false||g.owner_assigned!==false||
      !Array.isArray(g.items)||g.items.length===0||
      g.count!==g.items.length)
      throw Error("Ada fungsi agenda hilang, rangkap atau tampak telah disahkan.");
    const items=new Map();
    for(const a of g.items){
      if(!isObject(a)||!text(a.id)||!a.id||ids.has(a.id)||
        !text(a.title)||!text(a.evidence_needed)||
        !text(a.proposed_preparer_role)||!text(a.proposed_reviewer_role)||
        !Array.isArray(a.dependency_ids)||a.evidence_verified!==false||
        a.reviewer_confirmed!==false||a.meeting_held!==false||
        a.decision_made!==false)
        throw Error("Butir agenda tidak unik atau berisi klaim verifikasi.");
      items.set(a.id,a);ids.add(a.id);
    }
    groups.set(g.id,{agenda:g,items});
  }
  if(groups.size!==6||ids.size!==18)throw Error("Agenda harus memuat tepat 18 butir.");
  const seen=new Set(),functionsSeen=new Set();
  let drafted=0;
  for(const group of view.groups){
    if(!isObject(group)||!groups.has(group.id)||functionsSeen.has(group.id)||
      !Array.isArray(group.items)||group.items.length!==groups.get(group.id).items.size||
      group.formal_review_occurred!==false)
      throw Error("Kelompok catatan tidak sesuai agenda.");
    functionsSeen.add(group.id);
    for(const item of group.items){
      const original=groups.get(group.id).items.get(item.item_id);
      if(!original||seen.has(item.item_id)||item.function_id!==group.id||
        item.title!==original.title||item.expected_evidence!==original.evidence_needed||
        item.phase!==original.phase||!Array.isArray(item.dependency_ids)||
        item.dependency_ids.length!==original.dependency_ids.length||
        item.dependency_ids.some((x,i)=>x!==original.dependency_ids[i])||
        !isObject(item.note)||!text(item.note.masukan_demo)||
        !text(item.note.kekurangan_bukti_demo)||
        !text(item.note.tindak_lanjut_usulan_demo)||
        [item.note.masukan_demo,item.note.kekurangan_bukti_demo,
         item.note.tindak_lanjut_usulan_demo].some(x=>x.length>500)||
        !Number.isSafeInteger(item.revision)||item.revision<0||
        item.official_confirmation!==false||
        item.has_demo_draft!==Object.values(item.note).some(x=>Boolean(x)))
        throw Error("Catatan DEMO tidak cocok dengan agenda asli.");
      if(item.has_demo_draft)drafted+=1;
      seen.add(item.item_id);
    }
  }
  if(seen.size!==18||functionsSeen.size!==6||
    view.totals.demo_notes_started!==drafted)
    throw Error("Jumlah catatan M04-S9J tidak konsisten.");
  return groups;
}
export function buildProposedFollowups(view,agenda){
  const groups=validate(view,agenda);
  const rows=view.groups.flatMap(group=>group.items.map(item=>{
    const a=groups.get(group.id).items.get(item.item_id);
    const notes=item.note;
    const hasProposal=Boolean(notes.tindak_lanjut_usulan_demo.trim());
    return {
      id:"DEMO-FU-"+item.item_id,
      source_id:item.item_id,source_function_id:group.id,
      source_schema:view.schema,source_revision:item.revision,
      source_title:item.title,phase:item.phase,
      source_material:a.evidence_needed,
      source_dependencies:[...a.dependency_ids],
      discussion_function_suggestion:group.title,
      source_document:a.source_document,
      preparer_role_suggestion:a.proposed_preparer_role,
      reviewer_role_suggestion:a.proposed_reviewer_role,
      masukan_demo:notes.masukan_demo,
      kekurangan_bukti_demo:notes.kekurangan_bukti_demo,
      usulan_tindak_lanjut_demo:notes.tindak_lanjut_usulan_demo,
      status:hasProposal?"USULAN_CONTOH_PERLU_TELAAH":"BELUM_ADA_USULAN_CONTOH",
      next_discussion:hasProposal?
        "Klarifikasi redaksi dan bukti contoh dengan pengampu fungsi yang berwenang; tidak membentuk tugas.":
        "Lihat kembali pertanyaan agenda dan catatan DEMO sebelum merumuskan usulan.",
      assigned_officer:null,official_deadline:null,
      official_evidence_verified:false,official_review:false,
      officially_assigned:false,official_decision:false,
      authorization_to_test:false,authorization_to_deploy:false,
      demo_only:true,
    };
  }));
  const functions=FUNCTIONS.map(f=>({
    id:f.id,title:f.title,
    row_ids:rows.filter(x=>x.source_function_id===f.id).map(x=>x.id),
    submitted_to_institution:false,
  }));
  return {
    schema:FOLLOWUP_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{schema:view.schema,revision:view.revision,
      repo_snapshot:{...view.source_snapshot},source_stale:view.source_stale},
    rows,functions,status_labels:STATUS,
    totals:{
      source_items:rows.length,
      proposals_demo:rows.filter(x=>x.status==="USULAN_CONTOH_PERLU_TELAAH").length,
      without_proposal_demo:rows.filter(x=>x.status==="BELUM_ADA_USULAN_CONTOH").length,
      official_tasks:0,official_decisions:0,verified_evidence:0,
    },
    readiness:NO_AUTHORITY,
    caution:"Usulan contoh, bukan hasil rapat, perintah dinas, penugasan resmi, SOP, keputusan bantuan, izin tes/deploy, pengadaan atau BAST.",
  };
}
export function proposedFollowupsText(bundle,functionId="all",status="all"){
  if(!isObject(bundle)||bundle.schema!==FOLLOWUP_SCHEMA||
    bundle.synthetic!==true||bundle.readiness!==NO_AUTHORITY||
    !Array.isArray(bundle.rows)||bundle.rows.length!==18||
    !["all",...FUNCTIONS.map(x=>x.id)].includes(functionId)||
    !["all",...Object.keys(STATUS)].includes(status))
    throw Error("Ringkasan tindak lanjut M04-S9K DEMO tidak sesuai.");
  const subset=bundle.rows.filter(x=>
    (functionId==="all"||x.source_function_id===functionId)&&
    (status==="all"||x.status===status));
  return [
    "YANDIK+ M04-S9K | REGISTER USULAN TINDAK LANJUT (DEMO / BELUM DIUJI)",
    "BUKAN PENUGASAN, KEPUTUSAN RESMI, PERSYARATAN LULUS ATAU IZIN INTEGRASI.",
    "Snapshot repo "+bundle.source.repo_snapshot.visibility+" per "+
      bundle.source.repo_snapshot.observed_on+" (bukan live).",
    "Sumber M04-S9J revisi contoh "+bundle.source.revision+
      "; sumber berubah: "+(bundle.source.source_stale?"YA, kaji ulang":"tidak terdeteksi DEMO"),
    "Butir "+bundle.totals.source_items+
      "; dengan usulan DEMO "+bundle.totals.proposals_demo+
      "; belum ada usulan DEMO "+bundle.totals.without_proposal_demo+
      "; tugas resmi 0.",
    ...subset.flatMap(x=>[
      "- "+x.id+" ["+x.phase+"] "+x.source_title+
        " | "+STATUS[x.status],
      "  Asal: "+x.source_id+" / fungsi "+x.source_function_id+
        " / revisi demo "+x.source_revision,
      "  Pendahulu: "+(x.source_dependencies.join(", ")||"tidak ada"),
      "  Bahan diminta: "+x.source_material,
      "  Kekurangan bukti DEMO: "+(x.kekurangan_bukti_demo||"BELUM DIISI"),
      "  Usulan DEMO: "+(x.usulan_tindak_lanjut_demo||"BELUM DIISI"),
      "  Pengampu/penelaah: hanya saran fungsi, bukan pejabat yang ditugaskan.",
    ]),
    "STATUS: "+bundle.readiness,bundle.caution,
  ].join("\n");
}
