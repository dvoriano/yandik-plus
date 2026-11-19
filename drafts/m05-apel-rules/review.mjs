/**
 * M05-3 | KODE DITULIS, BELUM DIUJI.
 * Review packet is a checklist of open questions, never an official approval.
 */
import {requireYearRules} from "./rulebook.mjs";
import {M05_3_PREVIEW_SCHEMA} from "./preview.mjs";
export const M05_3_REVIEW_SCHEMA="M05-3-RULE-METHODOLOGY-REVIEW-UNTESTED-1";
const fail=code=>{throw Error(code)};
export const REVIEW_GATES=Object.freeze([
 ["annual_rule_owner","Pemilik metode dan persetujuan resmi khusus tahun terkait"],
 ["legacy_2026_parity","Rumus dan contoh 2026 dicocokkan dengan sumber lama bila relevan"],
 ["metric_taxonomy","Kategori layanan, satuan serta definisi investigasi dan kurban sah"],
 ["submission_provenance","Laporan bulanan, revisi dan bukti diverifikasi di sistem sumber"],
 ["timeliness_evidence","Timestamp server, timezone WIB, batas waktu dan pengecualian sah"],
 ["support_baseline","Dukungan awal/denominator dan realisasi diverifikasi jika dinilai"],
 ["district_attribution","Atribusi Puskeswan ke kab/kota dan agregasi diuji"],
 ["formula_weight_tiebreak","Rumus, bobot, rounding, normalisasi, tie-break dan sensitivitas ditetapkan"],
 ["fairness_and_missingness","Data kosong vs nol, pelapor parsial, kapasitas daerah dan seri ditelaah"],
 ["historical_freeze","Versi per tahun dan revisi tidak menghitung ulang arsip tanpa izin"],
 ["security_rbac","Akses data lintas wilayah, bukti, audit dan klasifikasi sesuai kewenangan"],
 ["publication_and_appeals","Review manusia, masa sanggah, format apresiasi dan publikasi sah"]
]);
const NOTE=/^DEMO-M05-REVIEW-[A-Z0-9_-]{1,32}$/;
const OWNER=new Set([
 "pengampu_apel","pengelola_data","teknis_aplikasi","keamanan","kelembagaan"
]);
const exact=(x,k)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===k.length&&k.every(t=>Object.hasOwn(x,t));
export function prepareAnnualRuleReview({rule,preview,notes=[]}={}){
 if(!rule||!Number.isInteger(rule.year))fail("M05_REVIEW_RULE_INVALID");
 requireYearRules(rule,rule.year);
 if(!preview||preview.schema!==M05_3_PREVIEW_SCHEMA||
    preview.synthetic!==true||preview.mode!=="DESCRIPTIVE_NONOFFICIAL_ONLY"||
    preview.year!==rule.year||preview.proposal_id!==rule.proposal_id||
    preview.sources_reconciled!==false||
    preview.official_scoring!==false||preview.may_rank!==false||
    preview.may_award!==false||preview.may_publish!==false||
    preview.official_authorization!==false||
    !Array.isArray(preview.rows)||
    preview.rows.length!==rule.categories.length||
    preview.rows.some((r,i)=>r.category_id!==rule.categories[i].category_id||
      r.metric_key!==rule.categories[i].metric_key||
      r.official_scoring_eligible!==false||r.score!==null||
      r.rank!==null||r.award!==null))
  fail("M05_REVIEW_PREVIEW_INVALID");
 if(!Array.isArray(notes)||notes.length>REVIEW_GATES.length)
  fail("M05_REVIEW_NOTES_INVALID");
 const ids=new Set(),gateIds=new Set(REVIEW_GATES.map(g=>g[0]));
 const items=notes.map(n=>{
  if(!exact(n,["note_id","gate_id","owner_role","status","text"])||
    typeof n.note_id!=="string"||!NOTE.test(n.note_id)||
    ids.has(n.note_id)||!gateIds.has(n.gate_id)||
    !OWNER.has(n.owner_role)||
    !["BELUM_DITELAAH","BUTUH_BUKTI","BUTUH_KEPUTUSAN"].includes(n.status)||
    typeof n.text!=="string"||n.text.trim()!==n.text||
    n.text.length<15||n.text.length>260||
    /https?:\/\/|(?:token|password|secret|api[_-]?key)\s*[:=]/i.test(n.text))
   fail("M05_REVIEW_NOTE_INVALID");
  ids.add(n.note_id);return {...n,nonofficial:true};
 });
 return {
  schema:M05_3_REVIEW_SCHEMA,synthetic:true,mode:"OPEN_GATES_ONLY",
  year:rule.year,proposal_id:rule.proposal_id,
  pending_gates:REVIEW_GATES.map(([gate_id,requirement])=>({
   gate_id,requirement,status:"BELUM_DIBUKTIKAN",evidence_ref:null
  })),
  notes:items,official_approvals_recorded:0,
  rule_version_locked:false,source_verified:false,
  may_accept_scores:false,may_rank:false,may_award:false,
  may_publish:false,official_authorization:false
 };
}
