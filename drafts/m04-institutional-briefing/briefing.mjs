/**
 * YANDIK+ M04-S9B. KODE DITULIS, BELUM DIUJI.
 * Read-only presentation from M04-S8 and M04-S9 DEMO sources.
 * Not an integration, SOP, legal, budget, procurement or BAST decision.
 */
import {governanceBoard,REQUIREMENTS,CHECK_STATES} from "../m04-sop-governance/governance.mjs";
import {institutionalFollowupView,FOLLOWUP_STATES} from "../m04-institutional-followup/followup_register.mjs";
export const BRIEF_SCHEMA="M04-S9B-EXECUTIVE-UNTESTED-1";
export const INTEGRATION_STATUS="BELUM_DINILAI_DAN_BUKAN_IZIN_INTEGRASI";
const UNRESOLVED=new Set(["belum_diperiksa","perlu_klarifikasi"]);
function validDate(value){
  if(typeof value!=="string"||!/^20\d{2}-\d{2}-\d{2}$/.test(value))
    throw Error("Tanggal acuan DEMO harus YYYY-MM-DD.");
  const d=new Date(value+"T00:00:00Z");
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==value)
    throw Error("Tanggal acuan DEMO tidak valid.");
  return value;
}
export function buildExecutiveBrief(book,docket,sop,asOf="2026-11-11"){
  const today=validDate(asOf);
  const gov=governanceBoard(docket,sop);
  const follow=institutionalFollowupView(book,docket,sop,today);
  if(gov.synthetic!==true||follow.synthetic!==true||docket.synthetic!==true||sop.synthetic!==true)
    throw Error("Rekap hanya menerima data DEMO.");
  const requirements=gov.items.map(rule=>{
    const linked=follow.rows.filter(x=>x.kind==="syarat_kelembagaan"&&x.source_ref===rule.id);
    return {
      id:rule.id,group:rule.group,title:rule.title,mandatory:rule.mandatory,
      status:rule.status,status_label:CHECK_STATES[rule.status],
      missing_for_discussion:UNRESOLVED.has(rule.status),
      evidence_metadata_demo:rule.reference_demo||"",
      note:rule.note||"",related_ids:linked.map(x=>x.id),
      active_related:linked.filter(x=>x.open).length,
      requires_formal_review:true,
    };
  });
  if(requirements.length!==REQUIREMENTS.length)
    throw Error("Sumber M04-S8 tidak mencakup 12 unsur.");
  const findings=follow.rows.map(row=>{
    const original=book.items.find(x=>x.id===row.id);
    if(!original||!original.plan)throw Error("Temuan M04-S9 tidak cocok.");
    return {...row,impact:original.plan.impact,
      corrective_plan:original.plan.corrective_plan,
      expected_output:original.plan.expected_output,
      review_note:original.review?.note||""};
  });
  const gaps=requirements.filter(x=>x.mandatory&&x.missing_for_discussion);
  const notRegistered=gaps.filter(x=>x.active_related===0);
  const attention=findings.filter(x=>x.open&&
    (x.source_stale||x.overdue_demo||x.status==="perlu_perbaikan"||
      x.status==="menunggu_telaah"));
  const decisions=[
    ...gaps.map(x=>({id:"REQ-"+x.id,title:x.title,
      question:"Pihak berwenang mana yang akan menelaah persyaratan dan bukti riil untuk unsur ini?",
      related_ids:x.related_ids})),
    ...gov.changes.map(x=>({id:"CAT-"+x.id,title:x.unit_key+" / "+x.type,
      question:"Bagaimana usulan ini memengaruhi tupoksi, RACI, SOP, arsip dan jalur eskalasi?",
      related_ids:findings.filter(y=>y.kind==="usulan_katalog"&&y.source_ref===x.id).map(y=>y.id)})),
  ];
  return {
    schema:BRIEF_SCHEMA,synthetic:true,as_of_demo:today,
    source:{s8_revision:docket.revision,s8_status:docket.status,
      s7_revision:docket.source?.sop_revision??null,source_changed:gov.source_changed},
    totals:{requirements:requirements.length,mandatory:requirements.filter(x=>x.mandatory).length,
      mandatory_gaps:gaps.length,unregistered_mandatory_gaps:notRegistered.length,
      demo_materials:requirements.filter(x=>x.status==="bahan_tersedia").length,
      findings:follow.total,open:follow.open,waiting_review:follow.waiting_review,
      needs_revision:follow.needs_revision,overdue_demo:follow.overdue_demo,
      stale_open:follow.stale_open,closed_notes:follow.closed_notes,
      catalog_proposals:gov.catalog_change_count,attention:attention.length},
    requirements,findings,change_proposals:gov.changes,
    unregistered_mandatory_gaps:notRegistered,attention,decisions_for_humans:decisions,
    integration_readiness:INTEGRATION_STATUS,
    warning:"Bahan DEMO, bukan hasil audit/rapat, SOP disahkan, keputusan bantuan/anggaran atau izin integrasi.",
  };
}
export function executiveBriefText(result){
  if(!result||result.schema!==BRIEF_SCHEMA||result.synthetic!==true)
    throw Error("Bahan paparan M04-S9B DEMO tidak sesuai.");
  return [
    "DRAF BAHAN PIMPINAN YANDIK+ M04-S9B | KODE BELUM DIUJI",
    "SELURUH DATA DEMO, BUKAN DOKUMEN ATAU HASIL KAJIAN RESMI.",
    "Tanggal contoh: "+result.as_of_demo,
    "Sumber M04-S8 r"+result.source.s8_revision+" / "+result.source.s8_status,
    "Sumber berubah: "+(result.source.source_changed?"YA":"tidak terdeteksi pada DEMO"),
    "Unsur: "+result.totals.requirements+" (wajib: "+result.totals.mandatory+")",
    "Wajib perlu dibahas: "+result.totals.mandatory_gaps+
      "; tanpa catatan aktif: "+result.totals.unregistered_mandatory_gaps,
    "Register aktif: "+result.totals.open+
      "; terlambat DEMO: "+result.totals.overdue_demo+
      "; sumber usang: "+result.totals.stale_open,
    "TEMUAN DAN PERBAIKAN:",
    ...result.findings.map(x=>"- "+x.id+" "+x.source_label+" | "+
      FOLLOWUP_STATES[x.status]+" | "+x.assignee_demo_id+" | "+x.due_date_demo+
      " | sumber berubah: "+(x.source_stale?"YA":"tidak")+
      " | kekurangan: "+x.description+" | rencana: "+x.corrective_plan+
      " | keluaran: "+x.expected_output),
    "WAJIB BELUM PUNYA CATATAN AKTIF:",
    ...(result.unregistered_mandatory_gaps.map(x=>"- "+x.title).length?
      result.unregistered_mandatory_gaps.map(x=>"- "+x.title):
      ["- Tidak ditemukan pada DEMO; tidak menyatakan persyaratan riil selesai."]),
    "BAHAN TANYA UNTUK PENGAMBIL KEPUTUSAN MANUSIA:",
    ...result.decisions_for_humans.map(x=>"- "+x.title+": "+x.question),
    "STATUS INTEGRASI: "+result.integration_readiness,
    result.warning,
    "Tanpa penerapan SOP/katalog, anggaran, pengadaan, distribusi atau BAST.",
  ].join("\n");
}
