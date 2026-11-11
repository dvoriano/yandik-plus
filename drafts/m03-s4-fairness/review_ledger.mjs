/** M03-S4B DRAF / BELUM DIUJI.
 * Pure client-side methodological review. This is NOT approval of policy,
 * beneficiaries, payments, allocations, procurement, or BAST.
 * DEMO role IDs are not real authorization. No persistent audit log.
 */
import { PROFILES, LAB_VERSION, compareFacilities } from "./comparison.mjs";
import { FAIRNESS_SCENARIOS } from "./fixtures.mjs";
export const LEDGER_VERSION = "M03-S4B-DRAFT-1";
export const STATUS = Object.freeze({
  draf:"Draf penjelasan bobot",
  diajukan:"Menunggu telaah metodologi (DEMO)",
  dikembalikan:"Perlu perbaikan penjelasan",
  dicatat:"Dicatat untuk pembahasan, belum disahkan",
  tidak_direkomendasikan:"Tidak direkomendasikan (simulasi)",
});
export const DECISIONS = Object.freeze({
  catat:"Catat sebagai bahan pembahasan, bukan persetujuan",
  perbaiki:"Kembalikan untuk melengkapi alasan dan sumber",
  tolak:"Tidak direkomendasikan sebagai alternatif bobot",
});
const ACTOR=/^DEMO-[A-Z0-9-]{4,50}$/;
const REF=/^DEMO-[A-Z0-9_-]{4,50}$/;
const BLOCKED=["allocation","approved_budget","bast","funding_approved","recipient_selected","policy_approved","beneficiary","procurement"];
function safe(obj){
  if(!obj||typeof obj!=="object"||Array.isArray(obj)||BLOCKED.some(k=>Object.hasOwn(obj,k)))
    throw Error("Data kajian tidak sah atau berisi keputusan yang tidak diizinkan.");
}
function who(person,role){
  safe(person);
  if(person.role!==role||typeof person.id!=="string"||!ACTOR.test(person.id))
    throw Error("Hanya identitas DEMO dari peran yang tepat boleh digunakan.");
  return {role:person.role,id:person.id};
}
function words(value,label,min,max){
  if(typeof value!=="string"||value.trim().length<min||value.trim().length>max)
    throw Error(label+" memerlukan "+min+"–"+max+" karakter.");
  return value.trim();
}
function inputs(form){
  safe(form);
  const profile=PROFILES.find(x=>x.id===form.profile_id);
  if(!profile)throw Error("Pilihan bobot tidak terdaftar.");
  const evidence=words(form.evidence_ref,"Kode sumber DEMO",9,55);
  if(!REF.test(evidence))throw Error("Gunakan referensi bukti fiktif DEMO-...");
  return {
    profile_id:profile.id,
    rationale:words(form.rationale,"Alasan alternatif bobot",40,500),
    risks:words(form.risks,"Dampak yang perlu diperiksa",30,500),
    limitations:words(form.limitations,"Keterbatasan data",30,500),
    evidence_ref:evidence,
  };
}
function snapshot(profile_id){
  const baseline=compareFacilities(FAIRNESS_SCENARIOS,"baseline");
  const alternative=compareFacilities(FAIRNESS_SCENARIOS,profile_id);
  const previous=new Map(baseline.results.map(row=>[row.id,row]));
  const changes=alternative.results.map(row=>{
    const before=previous.get(row.id);
    if(!before)throw Error("Sumber pembanding berubah.");
    return {
      scenario_id:row.id, label:row.label,
      baseline_score:before.score, alternative_score:row.score,
      baseline_rank:before.rank, alternative_rank:row.rank,
      incomplete:!row.complete,
      rank_difference:before.rank===null||row.rank===null?null:before.rank-row.rank,
    };
  });
  return {
    lab_version:LAB_VERSION, profile_id,
    weights:{...PROFILES.find(x=>x.id===profile_id).weights},
    changes, missing_scenarios:changes.filter(x=>x.incomplete).map(x=>x.scenario_id),
    significant_rank_changes:changes.filter(x=>x.rank_difference!==null&&Math.abs(x.rank_difference)>=2).map(x=>x.scenario_id),
    note:"Fiktif. Tidak menetapkan penerima bantuan atau prioritas resmi.",
  };
}
function audit(action,role,id,version,note){
  return {action,actor_demo_role:role,actor_demo_id:id,version,note};
}
function checkRecord(record){
  safe(record);
  if(record.schema!==LEDGER_VERSION||record.synthetic!==true||
     !Object.hasOwn(STATUS,record.status)||!Number.isSafeInteger(record.version)||
     !Array.isArray(record.history)||record.history.length!==record.version)
    throw Error("Riwayat catatan demo tidak konsisten.");
  if(JSON.stringify(snapshot(record.profile_id))!==JSON.stringify(record.snapshot))
    throw Error("Sumber/kalkulasi berubah. Catatan perlu ditinjau ulang.");
}
export function createDraft(form,author){
  const p=who(author,"verifikator_kab"),data=inputs(form);
  return {
    schema:LEDGER_VERSION,synthetic:true,id:"DEMO-REVIEW-01",
    ...data,author:p,status:"draf",version:1,
    snapshot:snapshot(data.profile_id),review:null,
    history:[audit("buat_draf",p.role,p.id,1,"Catatan metodologi fiktif dibuat.")],
  };
}
export function submitDraft(record,author){
  checkRecord(record);
  const p=who(author,"verifikator_kab");
  if(p.id!==record.author.id||record.status!=="draf")
    throw Error("Hanya pembuat yang boleh mengajukan draf.");
  const version=record.version+1;
  return {...record,status:"diajukan",version,
    history:[...record.history,audit("ajukan",p.role,p.id,version,"Dikirim untuk telaah metodologi, bukan persetujuan.")],
  };
}
export function reviewDraft(record,reviewer,decision,reason){
  checkRecord(record);
  const p=who(reviewer,"verifikator_prov");
  if(record.status!=="diajukan"||p.id===record.author.id)
    throw Error("Telaah provinsi hanya untuk pengajuan dan bukan oleh pengusul.");
  if(!Object.hasOwn(DECISIONS,decision))throw Error("Hasil telaah tidak tersedia; tidak ada opsi persetujuan.");
  const notes=words(reason,"Alasan tinjauan",30,700);
  const status=decision==="catat"?"dicatat":decision==="perbaiki"?"dikembalikan":"tidak_direkomendasikan";
  const version=record.version+1;
  return {...record,status,version,
    review:{decision,reviewer_demo_id:p.id,notes,meaning:"TELAAH SAJA; BUKAN PENGESAHAN"},
    history:[...record.history,audit(decision,p.role,p.id,version,notes)],
  };
}
export function reviseDraft(record,form,author){
  checkRecord(record);
  const p=who(author,"verifikator_kab");
  if(record.status!=="dikembalikan"||p.id!==record.author.id)
    throw Error("Perbaikan hanya oleh pengusul setelah dikembalikan.");
  const fields=inputs(form),version=record.version+1;
  return {...record,...fields,status:"draf",version,review:null,
    snapshot:snapshot(fields.profile_id),
    history:[...record.history,audit("revisi",p.role,p.id,version,"Penjelasan diperbarui; histori sebelumnya disimpan.")],
  };
}

/** Read-only bridge for the draft report builder. Not a security/auth guarantee. */
export function validateDraftSource(record) {
  checkRecord(record);
  return true;
}
