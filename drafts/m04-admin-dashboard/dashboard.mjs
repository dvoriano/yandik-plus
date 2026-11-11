/**
 * M04-S4 | KODE DITULIS, BELUM DIUJI.
 * Read-only administrative follow-up dashboard over M04-S3 DEMO tasks.
 * It never writes to source, authenticates a document, authorizes spending,
 * selects recipients, issues a letter, or confirms distribution/BAST.
 */
import { FOLLOWUP_SCHEMA, TASK_STATES, TASK_TYPES, followupListView } from "../m04-admin-followup/followup.mjs";
export const DASHBOARD_SCHEMA="M04-S4-DRAFT-UNTESTED-1";
export const ATTENTION=Object.freeze({
  all:"Semua tingkat perhatian",
  sumber_berubah:"Sumber berubah, perlu pemeriksaan ulang",
  melewati_tanggal_rencana:"Melewati tanggal rencana DEMO",
  jatuh_tempo_hari_ini:"Tanggal rencana jatuh pada tanggal acuan",
  perlu_perbaikan:"Catatan perlu diperbaiki",
  menunggu_telaah:"Catatan menunggu telaah",
  lainnya:"Tugas administratif lainnya",
  ditutup:"Catatan administratif sudah ditutup",
  dibatalkan:"Rencana administratif dibatalkan",
});
const ID=/^DEMO-[A-Z0-9_-]{4,55}$/;
const CLOSED=new Set(["ditutup_administratif","dibatalkan"]);
const PRIORITY=["sumber_berubah","melewati_tanggal_rencana","perlu_perbaikan",
  "menunggu_telaah","jatuh_tempo_hari_ini","lainnya","ditutup","dibatalkan"];
function asOf(raw){
  if(typeof raw!=="string"||!/^20\d{2}-\d{2}-\d{2}$/.test(raw))
    throw Error("Tanggal acuan DEMO harus YYYY-MM-DD.");
  const date=new Date(raw+"T00:00:00Z");
  if(Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==raw)
    throw Error("Tanggal acuan kalender tidak sah.");
  return raw;
}
function options(raw={}){
  if(!raw||typeof raw!=="object"||Array.isArray(raw))throw Error("Filter dashboard tidak sah.");
  if(Object.keys(raw).some(k=>!["as_of_demo","state","assignee_demo_id","attention"].includes(k)))
    throw Error("Dashboard tidak menerima atribut di luar filter baca-saja.");
  const state=raw.state??"all",attention=raw.attention??"all";
  const assignee=raw.assignee_demo_id??"all";
  if(state!=="all"&&!Object.hasOwn(TASK_STATES,state))throw Error("Status tidak dikenal.");
  if(!Object.hasOwn(ATTENTION,attention))throw Error("Kategori perhatian tidak dikenal.");
  if(assignee!=="all"&&(typeof assignee!=="string"||!ID.test(assignee)))
    throw Error("Penanggung jawab filter wajib ID DEMO atau semua.");
  return {as_of_demo:asOf(raw.as_of_demo??"2026-11-11"),
    state,assignee_demo_id:assignee,attention};
}
function attentionFor(row,as_of_demo){
  if(row.state==="ditutup_administratif")return "ditutup";
  if(row.state==="dibatalkan")return "dibatalkan";
  if(row.source_stale)return "sumber_berubah";
  if(row.due_date_demo<as_of_demo)return "melewati_tanggal_rencana";
  if(row.state==="perlu_perbaikan")return "perlu_perbaikan";
  if(row.state==="menunggu_telaah")return "menunggu_telaah";
  if(row.due_date_demo===as_of_demo)return "jatuh_tempo_hari_ini";
  return "lainnya";
}
function counts(rows,as_of_demo){
  const by_state=Object.fromEntries(Object.keys(TASK_STATES).map(key=>[key,0]));
  const by_attention=Object.fromEntries(Object.keys(ATTENTION)
    .filter(key=>key!=="all").map(key=>[key,0]));
  for(const row of rows){by_state[row.state]++;by_attention[row.attention]++;}
  return {
    total:rows.length,aktif:rows.filter(r=>!CLOSED.has(r.state)).length,
    ditutup_administratif:by_state.ditutup_administratif,dibatalkan:by_state.dibatalkan,
    perlu_perbaikan:by_state.perlu_perbaikan,menunggu_telaah:by_state.menunggu_telaah,
    source_stale:rows.filter(r=>r.source_stale).length,
    open_source_stale:rows.filter(r=>r.source_stale&&!CLOSED.has(r.state)).length,
    overdue_open:rows.filter(r=>!CLOSED.has(r.state)&&r.due_date_demo<as_of_demo).length,
    due_today_open:rows.filter(r=>!CLOSED.has(r.state)&&r.due_date_demo===as_of_demo).length,
    by_state,by_attention,
  };
}
export function buildFollowupDashboard(list,register,dossier,raw={}){
  const query=options(raw);
  if(!list||list.schema!==FOLLOWUP_SCHEMA||list.synthetic!==true)
    throw Error("Dashboard hanya menerima daftar tugas M04-S3 fiktif.");
  const views=followupListView(list,register,dossier);
  if(views.length!==list.tasks.length)throw Error("Daftar sumber dan rekap tidak konsisten.");
  const seen=new Set();
  const rows=views.map(view=>{
    const t=list.tasks.find(item=>item.id===view.id);
    if(!t||seen.has(view.id)||t.synthetic!==true||
       !Object.hasOwn(TASK_STATES,t.state)||!Object.hasOwn(TASK_TYPES,t.plan.task_type))
      throw Error("Sumber tugas DEMO tidak konsisten.");
    seen.add(view.id);
    const row={
      id:view.id,reference_id:view.reference_id,
      document_ref_demo:t.source.document_ref,
      puskeswan_id_demo:t.source.puskeswan_id,
      task_type:t.plan.task_type,task_label:TASK_TYPES[t.plan.task_type],
      description:t.plan.description,
      expected_output:t.plan.expected_output,
      state:t.state,state_label:TASK_STATES[t.state],
      assignee_demo_id:view.assignee_demo_id,due_date_demo:view.due_date_demo,
      revision:view.revision,source_stale:view.source_stale,
      attention:"",attention_label:"",last_action:t.history.at(-1)?.action??"belum_ada",
      review_note:t.review?.reason??null,
    };
    row.attention=attentionFor(row,query.as_of_demo);
    row.attention_label=ATTENTION[row.attention];
    return row;
  });
  const summary=counts(rows,query.as_of_demo);
  const filtered=rows.filter(row=>
    (query.state==="all"||row.state===query.state)&&
    (query.attention==="all"||row.attention===query.attention)&&
    (query.assignee_demo_id==="all"||row.assignee_demo_id===query.assignee_demo_id)
  );
  filtered.sort((a,b)=>PRIORITY.indexOf(a.attention)-PRIORITY.indexOf(b.attention)||
    a.due_date_demo.localeCompare(b.due_date_demo)||a.id.localeCompare(b.id));
  return {
    schema:DASHBOARD_SCHEMA,synthetic:true,mode:"BACA_SAJA_BELUM_DIUJI",
    as_of_demo:query.as_of_demo,filters:query,summary,
    displayed:filtered.length,rows:filtered,
    note:"Rekap tugas administratif DEMO, bukan dashboard bantuan, validitas surat, anggaran, distribusi ataupun BAST.",
  };
}
export function dashboardText(dashboard){
  if(!dashboard||dashboard.schema!==DASHBOARD_SCHEMA||dashboard.synthetic!==true||
     !Array.isArray(dashboard.rows)||!dashboard.summary)
    throw Error("Hanya snapshot dashboard DEMO yang dapat diringkas.");
  const s=dashboard.summary;
  return [
    "RINGKASAN ANTREAN ADMINISTRASI YANDIK+ (DEMO, KODE BELUM DIUJI)",
    "Bukan laporan pelayanan resmi, keputusan bantuan, pengesahan dokumen, anggaran atau BAST.",
    "Tanggal acuan fiktif: "+dashboard.as_of_demo,
    "Total tugas (sebelum filter): "+s.total,
    "Aktif: "+s.aktif+"; ditutup administratif: "+s.ditutup_administratif+
      "; dibatalkan: "+s.dibatalkan,
    "Perlu perbaikan: "+s.perlu_perbaikan+"; menunggu telaah: "+s.menunggu_telaah,
    "Sumber berubah (tugas aktif): "+s.open_source_stale,
    "Lewat tanggal rencana (tugas aktif): "+s.overdue_open,
    "Ditampilkan setelah filter: "+dashboard.displayed,
    "RINCIAN TUGAS (SEMUA FIKTIF):",
    ...dashboard.rows.map(r=>"- "+r.id+" | "+r.task_label+
      " | "+r.assignee_demo_id+" | "+r.state_label+
      " | rencana "+r.due_date_demo+" | perhatian: "+r.attention_label+
      " | referensi "+r.reference_id),
    "Status penutupan administratif tidak menyatakan konfirmasi penerbit atau realisasi bantuan.",
    "Tidak ada persetujuan, penerima, nominal, pengadaan, distribusi, tanda terima atau BAST.",
  ].join("\n");
}
