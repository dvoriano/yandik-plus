/**
 * YANDIK+ M04-S9E | KODE DITULIS, BELUM DIUJI.
 * Synthetic/read-only worklist from M04-S9C agenda and M04-S9D notes.
 * Not an official review, SOP, budget, aid, procurement or integration decision.
 */
import {MATRIX_SCHEMA} from "../m04-institutional-review/decision_matrix.mjs";
import {discussionSummary,SCHEMA as MINUTES_SCHEMA}
  from "../m04-institutional-minutes/register.mjs";
export const OVERSIGHT_SCHEMA="M04-S9E-OVERSIGHT-UNTESTED-1";
export const READINESS_STATUS="BELUM_DINILAI_DAN_BUKAN_IZIN_INTEGRASI";
export const ATTENTION=Object.freeze({
  sumber_berubah:"Sumber agenda berubah, perlu kaji ulang",
  tanpa_catatan:"Belum ada catatan pembahasan",
  catatan_dibatalkan:"Catatan dibatalkan, perlu dibahas ulang",
  lewat_tenggat:"Tenggat DEMO terlewati",
  perlu_perbaikan:"Catatan dikembalikan untuk perbaikan",
  menunggu_telaah:"Menunggu pembacaan penelaah DEMO",
  draf:"Catatan DEMO masih draf",
  hanya_bahan:"Dicatat sebagai bahan, belum keputusan resmi",
});
const ORDER=Object.keys(ATTENTION);
function isObj(o){return o&&typeof o==="object"&&!Array.isArray(o);}
function validate(packet,summary){
  if(!isObj(packet)||packet.schema!==MATRIX_SCHEMA||packet.synthetic!==true||
    !Array.isArray(packet.rows)||packet.rows.length<1||packet.rows.length>40||
    !isObj(packet.repo_observation)||!Array.isArray(packet.flags))
    throw Error("Agenda bukan M04-S9C DEMO yang sah.");
  if(!isObj(summary)||summary.schema!==MINUTES_SCHEMA||summary.synthetic!==true||
    !Array.isArray(summary.rows)||!Array.isArray(summary.unrecorded))
    throw Error("Ringkasan register bukan M04-S9D DEMO.");
  const ids=new Set();
  for(const x of packet.rows){
    if(!isObj(x)||typeof x.id!=="string"||ids.has(x.id)||
      x.resolution!=="BELUM_DIPUTUSKAN_MANUSIA"||
      typeof x.subject!=="string"||x.subject.length<10||
      typeof x.group!=="string")throw Error("Butir agenda tidak unik/valid.");
    ids.add(x.id);
  }
  const refs=new Set();
  for(const item of summary.rows){
    if(!isObj(item)||!ids.has(item.agenda_id)||refs.has(item.agenda_id)||
       !isObj(item.plan)||typeof item.status!=="string")
      throw Error("Catatan M04-S9D tidak cocok dengan agenda.");
    refs.add(item.agenda_id);
  }
}
function classify(note,stale){
  if(stale)return "sumber_berubah";
  if(!note)return "tanpa_catatan";
  if(note.status==="dibatalkan")return "catatan_dibatalkan";
  if(note.overdue)return "lewat_tenggat";
  if(note.status==="perlu_perbaikan")return "perlu_perbaikan";
  if(note.status==="menunggu_telaah")return "menunggu_telaah";
  if(note.status==="draf")return "draf";
  if(note.status==="dicatat_sebagai_bahan")return "hanya_bahan";
  throw Error("Status DEMO tidak dikenal.");
}
export function buildOversight(packet,book,asOf="2026-11-11"){
  const s=discussionSummary(book,packet,asOf);
  validate(packet,s);
  const map=new Map(s.rows.map(x=>[x.agenda_id,x]));
  const rows=packet.rows.map(a=>{
    const n=map.get(a.id),code=classify(n,s.source_stale);
    return {
      agenda_id:a.id,agenda_title:a.subject,group:a.group,
      priority_demo:a.priority,proposed_owner:a.owner_suggestion,
      evidence_minimum:a.evidence_needed,
      note_id:n?.id??null,note_status:n?.status??"belum_ada",
      note_revision:n?.revision??0,
      assignee_demo_id:n?.plan?.assigned_demo_id??null,
      due_date_demo:n?.plan?.due_date_demo??null,
      discussion_demo:n?.plan?.discussion??"",
      evidence_requested_demo:n?.plan?.evidence_needed??"",
      next_step_demo:n?.plan?.next_step??"",
      attention_code:code,attention_label:ATTENTION[code],
      overdue_demo:Boolean(n?.overdue),has_note:Boolean(n),
      source_stale:s.source_stale,needs_human_decision:true,
    };
  });
  rows.sort((a,b)=>ORDER.indexOf(a.attention_code)-ORDER.indexOf(b.attention_code)||
    (a.priority_demo==="PRIORITAS_TINGGI"?-1:b.priority_demo==="PRIORITAS_TINGGI"?1:0)||
    a.agenda_id.localeCompare(b.agenda_id));
  const counts=Object.fromEntries(ORDER.map(k=>[k,rows.filter(x=>x.attention_code===k).length]));
  return {
    schema:OVERSIGHT_SCHEMA,synthetic:true,as_of_demo:s.as_of_demo,
    repo_snapshot:{...packet.repo_observation},source_stale:s.source_stale,
    total_agenda:rows.length,registered_notes:s.total,
    missing_or_canceled:rows.filter(x=>!x.has_note||x.note_status==="dibatalkan").length,
    overdue_notes:s.overdue,open_notes:s.open,
    material_only:s.recorded_as_material,
    attention_counts:counts,rows,
    manual_topics:[
      "Klasifikasi akses repository dan kemungkinan paparan historis",
      "Tupoksi, unit pengampu proses, dan RACI resmi",
      "Kewenangan, SOP, tata naskah, arsip dan retensi",
      "Koordinasi SPBE, keamanan, autentikasi dan izin akses wilayah",
      "QA lintas modul setelah izin eksplisit owner",
      "Bantuan, anggaran, pengadaan, distribusi dan BAST di luar DEMO",
    ],
    integration_readiness:READINESS_STATUS,
    warning:"Semua data DEMO. Papan tidak mengubah register, tidak menutup agenda atau mengesahkan keputusan.",
  };
}
export function oversightText(b){
  if(!isObj(b)||b.schema!==OVERSIGHT_SCHEMA||b.synthetic!==true||!Array.isArray(b.rows))
    throw Error("Papan rekap tidak dikenal.");
  return [
    "YANDIK+ M04-S9E | PETA TINDAK LANJUT DEMO, KODE BELUM DIUJI",
    "BUKAN HASIL RAPAT, AUDIT, PENGESAHAN SOP ATAU IZIN INTEGRASI.",
    "Tanggal acuan contoh: "+b.as_of_demo,
    "Repo snapshot: "+b.repo_snapshot.visibility+" / "+b.repo_snapshot.observed_on+
      " (bukan pemeriksaan live)",
    "Agenda: "+b.total_agenda+"; catatan: "+b.registered_notes+
      "; tanpa catatan/dibatalkan: "+b.missing_or_canceled+
      "; lewat tenggat contoh: "+b.overdue_notes+
      "; sumber berubah: "+(b.source_stale?"YA":"tidak terdeteksi DEMO"),
    "DAFTAR PERHATIAN:",
    ...b.rows.map(x=>"- "+x.agenda_id+" | "+x.agenda_title+
      " | "+x.attention_label+" | catatan "+(x.note_id??"BELUM ADA")+
      " | pengampu usulan "+x.proposed_owner+
      " | petugas contoh "+(x.assignee_demo_id??"BELUM ADA")+
      " | tenggat contoh "+(x.due_date_demo??"BELUM ADA")+
      " | kebutuhan bukti "+(x.evidence_requested_demo||x.evidence_minimum)+
      " | tindak lanjut contoh "+(x.next_step_demo||"BELUM DICATAT")),
    "PEMERIKSAAN MANUSIA TETAP DIPERLUKAN:",
    ...b.manual_topics.map(x=>"- "+x),
    "STATUS: "+b.integration_readiness,b.warning,
  ].join("\n");
}
