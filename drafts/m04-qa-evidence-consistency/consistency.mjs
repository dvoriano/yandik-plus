/**
 * YANDIK+ M04-S9U | KODE DITULIS, BELUM DIUJI.
 * Structural consistency of synthetic evidence REQUIREMENTS, NOT evidence QA.
 * No received documents, tests, owner authorization or institutional decision.
 */
import {REGISTER_SCHEMA,NO_AUTHORITY as S9T_BOUNDARY,MISSING}
  from "../m04-qa-evidence-register/register.mjs";
import {PREFLIGHT_SCHEMA,NO_AUTHORITY as S9S_BOUNDARY,
  STAGE_CODES,EVIDENCE_REQUIREMENTS}
  from "../m04-qa-preflight/preflight.mjs";

export const CHECK_SCHEMA="M04-S9U-QA-EVIDENCE-CONSISTENCY-UNTESTED-1";
export const NO_AUTHORITY="STRUKTUR_REGISTER_DEMO_BELUM_MEMBUKTIKAN_KESIAPAN_QA";
export const MATERIAL_STATE="BUKTI_BELUM_DITERIMA_DAN_BELUM_DIVERIFIKASI";
const isObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const text=x=>typeof x==="string"&&Boolean(x.trim());
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const findings=Object.freeze(["STATIC-01","STATIC-02","STATIC-03","STATIC-04"]);
function sourceGuard(register,preflight){
  if(!isObject(register)||register.schema!==REGISTER_SCHEMA||
    register.synthetic!==true||register.mode!=="CODE_ONLY"||
    register.readiness!==S9T_BOUNDARY||
    !isObject(register.source)||
    register.source.preflight_schema!==PREFLIGHT_SCHEMA||
    register.source.live_verified!==false||
    !Array.isArray(register.requests)||register.requests.length!==14||
    !Array.isArray(register.stage_groups)||register.stage_groups.length!==6||
    !Array.isArray(register.finding_groups)||register.finding_groups.length!==4||
    register.totals?.stages!==6||register.totals?.findings!==4||
    register.totals?.planned_evidence_requests!==14||
    register.totals?.technical_tests_written_before!==162||
    register.totals?.new_s9t_scenarios_written!==10||
    register.totals?.combined_test_scenarios_written!==172||
    register.totals?.tests_executed_this_milestone!==0||
    register.totals?.documents_received!==0||
    register.totals?.verified_evidence!==0||
    register.totals?.approvals_given!==0||
    register.totals?.official_findings_closed!==0)
    throw Error("M04-S9T harus register DEMO 14 permintaan yang belum memiliki bukti.");
  if(!isObject(preflight)||preflight.schema!==PREFLIGHT_SCHEMA||
    preflight.synthetic!==true||preflight.mode!=="CODE_ONLY"||
    preflight.readiness!==S9S_BOUNDARY||
    !isObject(preflight.source)||preflight.source.live_verification!==false||
    !Array.isArray(preflight.stages)||preflight.stages.length!==6||
    !Array.isArray(preflight.findings)||preflight.findings.length!==4||
    preflight.totals?.written_tests_combined!==162||
    preflight.totals?.owner_testing_permission!==0||
    preflight.totals?.verified_closures!==0||
    preflight.totals?.tests_executed_in_s9s!==0||
    preflight.totals?.official_decisions!==0)
    throw Error("M04-S9S harus preflight sintetis tanpa izin atau bukti resmi.");
  if(register.source.visibility_snapshot!==
      preflight.source.repository_visibility_snapshot||
    register.source.snapshot_date!==preflight.source.observed_on||
    !text(register.source.snapshot_date))
    throw Error("Snapshot M04-S9T dan M04-S9S tidak cocok.");
}
function validatedRows(register,preflight){
  sourceGuard(register,preflight);
  const rows=new Map();
  for(const r of register.requests){
    if(!isObject(r)||!text(r.id)||rows.has(r.id)||
      !["gerbang","temuan"].includes(r.kind)||!text(r.source_id)||
      !text(r.title)||!text(r.requirement)||
      !Array.isArray(r.needed_after)||
      r.evidence_provided!==false||r.evidence_reference!==null||
      r.verification_done!==false||r.verified_by!==null||
      r.verified_on!==null||r.official_approval!==false||
      r.state!==MISSING)
      throw Error("Butir kebutuhan bukti duplikat atau berisi klaim verifikasi.");
    rows.set(r.id,r);
  }
  const expected=new Set();
  for(const [index,stage] of preflight.stages.entries()){
    const group=register.stage_groups[index];
    const id="DEMO-REQ-STAGE-"+stage.id;
    const row=rows.get(id);
    if(!isObject(stage)||stage.id!==STAGE_CODES[index]||
      !text(stage.purpose)||!text(stage.proposed_evidence)||
      !Array.isArray(stage.predecessors)||
      stage.approved_to_run!==false||stage.executed!==false||
      stage.passed!==false||stage.actual_evidence_reference!==null||
      !isObject(group)||group.id!==stage.id||
      group.purpose!==stage.purpose||
      !Array.isArray(group.predecessor_ids)||
      !same(group.predecessor_ids,stage.predecessors)||
      !Array.isArray(group.request_ids)||!same(group.request_ids,[id])||
      group.permission_required!==stage.requires_owner_permission||
      group.approved_to_run!==false||group.executed!==false||
      group.passed!==false||group.final_decision!==null||
      !row||row.kind!=="gerbang"||row.source_id!==stage.id||
      row.title!==stage.purpose||
      row.requirement!==stage.proposed_evidence||
      !same(row.needed_after,stage.predecessors))
      throw Error("Bukti gerbang tidak sinkron dengan preflight atau sudah dijalankan.");
    expected.add(id);
  }
  for(const [i,finding] of preflight.findings.entries()){
    const group=register.finding_groups[i];
    if(!isObject(finding)||finding.id!==findings[i]||
      !Array.isArray(finding.required_evidence)||
      !same(finding.required_evidence,EVIDENCE_REQUIREMENTS[finding.id])||
      finding.official_finding_closed!==false||
      finding.technical_validation_complete!==false||
      finding.institutional_acceptance!==false||
      !isObject(group)||group.id!==finding.id||
      group.description!==finding.static_finding||
      group.code_status!==finding.remediation_code_status||
      group.verified_closed!==false||group.formal_resolution!==null||
      !Array.isArray(group.request_ids)||
      group.request_ids.length!==finding.required_evidence.length)
      throw Error("Kelompok temuan berubah atau dilaporkan telah ditutup.");
    for(const [n,description] of finding.required_evidence.entries()){
      const id="DEMO-REQ-"+finding.id+"-"+String(n+1).padStart(2,"0");
      const row=rows.get(id);
      if(group.request_ids[n]!==id||!row||row.kind!=="temuan"||
        row.source_id!==finding.id||
        row.title!=="Bahan penelaahan "+finding.id||
        row.requirement!==description||row.needed_after.length!==0)
        throw Error("Referensi kebutuhan temuan tidak cocok dengan M04-S9S.");
      expected.add(id);
    }
  }
  if(expected.size!==14||rows.size!==expected.size||
    [...rows.keys()].some(id=>!expected.has(id)))
    throw Error("Terdapat kebutuhan bukti yang hilang, asing atau duplikat.");
  return {rows,expected};
}
export function buildQaEvidenceConsistency(register,preflight){
  const {rows}=validatedRows(register,preflight);
  const lines=register.requests.map((r,index)=>({
    id:"DEMO-CHECK-"+String(index+1).padStart(2,"0"),
    source_request_id:r.id,
    kind:r.kind,source_id:r.source_id,
    title:r.title,requirement:r.requirement,
    predecessor_ids:[...r.needed_after],
    structural_source_linked:true,
    structural_requirement_matches:true,
    requested_material_known:true,
    documentary_material_received:false,
    evidence_verified:false,
    evidence_reference:null,
    official_reviewer:null,official_decision:null,
    completeness_status:MATERIAL_STATE,
    permitted_to_run_tests:false,
    permitted_to_deploy:false,
  }));
  const stages=register.stage_groups.map(group=>({
    id:group.id,request_ids:[...group.request_ids],
    structural_request_count:group.request_ids.length,
    received_documents:0,verified_documents:0,
    permission_to_run:false,executed:false,
  }));
  const issueGroups=register.finding_groups.map(group=>({
    id:group.id,request_ids:[...group.request_ids],
    structural_request_count:group.request_ids.length,
    received_documents:0,verified_documents:0,
    officially_closed:false,formal_resolution:null,
  }));
  return {
    schema:CHECK_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{
      register_schema:register.schema,
      preflight_schema:preflight.schema,
      source_visibility_snapshot:register.source.visibility_snapshot,
      source_snapshot_date:register.source.snapshot_date,
      snapshot_is_live:false,
    },
    lines,stages,findings:issueGroups,
    totals:{
      structural_requests_found:rows.size,
      structural_requests_linked:lines.length,
      stage_requests:stages.reduce((n,g)=>n+g.structural_request_count,0),
      finding_requests:issueGroups.reduce((n,g)=>n+g.structural_request_count,0),
      documentary_material_received:0,
      verified_evidence:0,
      official_decisions:0,officially_closed_findings:0,
      written_scenarios_before:172,
      written_scenarios_new:12,
      written_scenarios_combined:184,
      tests_executed_this_milestone:0,
    },
    readiness:NO_AUTHORITY,
    warnings:[
      "Kecocokan struktur ID/deskripsi bukan kelengkapan dokumen pembuktian.",
      "Semua 14 permintaan adalah kebutuhan DEMO; tidak ada lampiran atau referensi bukti diterima.",
      "G0 tetap membutuhkan izin eksplisit owner sebelum G1–G4. G5 memerlukan telaah kelembagaan.",
      "Snapshot repository dari sumber bukan pemeriksaan visibility secara live.",
      "Tidak ada temuan ditutup, QA dinyatakan PASS, persetujuan atau izin deployment.",
    ],
  };
}
export function qaEvidenceConsistencyText(check,filter="all"){
  if(!isObject(check)||check.schema!==CHECK_SCHEMA||
    check.synthetic!==true||check.mode!=="CODE_ONLY"||
    check.readiness!==NO_AUTHORITY||
    !Array.isArray(check.lines)||check.lines.length!==14||
    !["all","gerbang","temuan"].includes(filter))
    throw Error("Matriks konsistensi DEMO tidak sesuai.");
  const selected=check.lines.filter(x=>filter==="all"||x.kind===filter);
  return [
    "YANDIK+ M04-S9U | PEMERIKSAAN KETERKAITAN KEBUTUHAN BUKTI DEMO",
    "KODE BELUM DIUJI, BUKAN BUKTI QA ATAU PERSETUJUAN.",
    "14 permintaan terindeks, tetapi 0 dokumen diterima/0 bukti diverifikasi.",
    ...selected.flatMap(x=>[
      x.id+" | "+x.source_request_id,
      "  Kebutuhan: "+x.requirement,
      "  Keterkaitan sumber: TERDAFTAR PADA RANCANGAN (BELUM DIUJI)",
      "  Kecukupan bukti: BELUM BISA DINILAI; BUKTI BELUM DITERIMA.",
    ]),
    "STATUS: "+check.readiness,
    ...check.warnings.map(x=>"PERINGATAN: "+x),
  ].join("\n");
}
