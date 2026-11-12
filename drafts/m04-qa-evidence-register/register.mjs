/**
 * YANDIK+ M04-S9T | KODE DITULIS, BELUM DIUJI.
 * Read-only register of evidence REQUIREMENTS for future QA decisions.
 * No test, uploaded attachment, owner permission, formal closure or approval.
 */
import {PREFLIGHT_SCHEMA,NO_AUTHORITY as S9S_BOUNDARY,
  STAGE_CODES,EVIDENCE_REQUIREMENTS}
  from "../m04-qa-preflight/preflight.mjs";

export const REGISTER_SCHEMA="M04-S9T-QA-EVIDENCE-REGISTER-UNTESTED-1";
export const NO_AUTHORITY="KEBUTUHAN_BUKTI_DEMO_BELUM_DIPENUHI_BUKAN_IZIN_UJI";
export const MISSING="BELUM_ADA_BUKTI_DI_DEMO";
const obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const VALID_FINDINGS=Object.freeze(["STATIC-01","STATIC-02","STATIC-03","STATIC-04"]);
const isText=x=>typeof x==="string"&&Boolean(x.trim());
function validate(preflight){
  if(!obj(preflight)||preflight.schema!==PREFLIGHT_SCHEMA||
    preflight.synthetic!==true||preflight.mode!=="CODE_ONLY"||
    preflight.readiness!==S9S_BOUNDARY||
    !obj(preflight.source)||preflight.source.live_verification!==false||
    preflight.source.repository_visibility_snapshot!=="public"||
    !Array.isArray(preflight.modules)||preflight.modules.length!==12||
    !Array.isArray(preflight.findings)||preflight.findings.length!==4||
    !Array.isArray(preflight.stages)||preflight.stages.length!==6||
    preflight.totals?.module_count!==12||
    preflight.totals?.written_tests_previous!==152||
    preflight.totals?.new_preflight_tests_written!==10||
    preflight.totals?.written_tests_combined!==162||
    preflight.totals?.tests_executed_in_s9s!==0||
    preflight.totals?.qa_steps!==6||
    preflight.totals?.findings!==4||
    preflight.totals?.verified_closures!==0||
    preflight.totals?.owner_testing_permission!==0||
    preflight.totals?.official_decisions!==0)
    throw Error("Hanya preflight M04-S9S sintetis dan belum diizinkan.");
  const moduleIds=new Set();
  for(const mod of preflight.modules){
    if(!obj(mod)||!isText(mod.id)||moduleIds.has(mod.id)||
      !isText(mod.model)||!Array.isArray(mod.direct_upstream)||
      mod.test_result!=="BELUM_DIUJI"||mod.permission_to_execute!==false)
      throw Error("Daftar modul DEMO memuat status atau ID tidak sah.");
    moduleIds.add(mod.id);
  }
  const required=["S9F","S9G","S9H","S9I","S9J","S9K",
    "S9L","S9M","S9N","S9O","S9P","S9Q"];
  if(required.some(id=>!moduleIds.has(id)))
    throw Error("Dua belas modul wajib tersedia.");
  const stageIds=new Set();
  for(const [i,stage] of preflight.stages.entries()){
    if(!obj(stage)||stage.id!==STAGE_CODES[i]||
      stageIds.has(stage.id)||!isText(stage.purpose)||
      !isText(stage.proposed_evidence)||
      !Array.isArray(stage.predecessors)||
      !Array.isArray(stage.modules)||
      stage.modules.some(id=>!moduleIds.has(id))||
      stage.approved_to_run!==false||stage.executed!==false||
      stage.passed!==false||stage.actual_evidence_reference!==null||
      stage.official_assignee!==null||
      typeof stage.is_technical_test!=="boolean"||
      typeof stage.requires_owner_permission!=="boolean"||
      (stage.is_technical_test&&!stage.requires_owner_permission))
      throw Error("Gerbang QA tidak cocok atau memuat klaim pelaksanaan.");
    if(stage.predecessors.some(id=>!stageIds.has(id))||
      stage.predecessors.length!==new Set(stage.predecessors).size)
      throw Error("Pendahulu gerbang QA tidak tersedia/duplikat.");
    if(i>0&&stage.id!=="G5_INSTITUTIONAL_REVIEW"&&
      !stage.predecessors.length)
      throw Error("Tes teknis harus tunduk pada gerbang sebelumnya.");
    if(stage.is_technical_test&&stage.status!=="MENUNGGU_IZIN_UJI")
      throw Error("Status tes teknis tidak boleh sudah aktif.");
    stageIds.add(stage.id);
  }
  const seenFindings=new Set();
  for(const [i,issue] of preflight.findings.entries()){
    if(!obj(issue)||issue.id!==VALID_FINDINGS[i]||
      seenFindings.has(issue.id)||!isText(issue.static_finding)||
      !isText(issue.remediation_text)||
      !isText(issue.remediation_code_status)||
      !Array.isArray(issue.required_evidence)||
      issue.required_evidence.length!==EVIDENCE_REQUIREMENTS[issue.id]?.length||
      issue.required_evidence.some((text,n)=>
        text!==EVIDENCE_REQUIREMENTS[issue.id][n]||!isText(text))||
      issue.official_finding_closed!==false||
      issue.technical_validation_complete!==false||
      issue.institutional_acceptance!==false)
      throw Error("Temuan statis sudah berubah atau tidak lengkap.");
    seenFindings.add(issue.id);
  }
  if(stageIds.size!==6||seenFindings.size!==4)
    throw Error("Daftar gerbang dan temuan wajib lengkap.");
  return preflight;
}
/**
 * Each row describes a DOCUMENT TO REQUEST in a future authorized QA session.
 * It is not a document/attachment or evidence that a check occurred.
 */
export function buildQaEvidenceRegister(preflight){
  validate(preflight);
  const requests=[];
  for(const stage of preflight.stages){
    requests.push({
      id:"DEMO-REQ-STAGE-"+stage.id,
      kind:"gerbang",
      source_id:stage.id,
      title:stage.purpose,
      requirement:stage.proposed_evidence,
      needed_after:[...stage.predecessors],
      evidence_provided:false,evidence_reference:null,
      verification_done:false,verified_by:null,verified_on:null,
      official_approval:false,
      state:MISSING,
    });
  }
  for(const finding of preflight.findings){
    for(const [i,description] of finding.required_evidence.entries()){
      requests.push({
        id:"DEMO-REQ-"+finding.id+"-"+String(i+1).padStart(2,"0"),
        kind:"temuan",
        source_id:finding.id,
        title:"Bahan penelaahan "+finding.id,
        requirement:description,
        needed_after:[],
        evidence_provided:false,evidence_reference:null,
        verification_done:false,verified_by:null,verified_on:null,
        official_approval:false,
        state:MISSING,
      });
    }
  }
  return {
    schema:REGISTER_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{
      preflight_schema:preflight.schema,
      visibility_snapshot:preflight.source.repository_visibility_snapshot,
      snapshot_date:preflight.source.observed_date,
      live_verified:false,
    },
    stage_groups:preflight.stages.map(s=>({
      id:s.id,purpose:s.purpose,
      predecessor_ids:[...s.predecessors],
      request_ids:["DEMO-REQ-STAGE-"+s.id],
      permission_required:s.requires_owner_permission,
      approved_to_run:false,executed:false,passed:false,
      final_decision:null,
    })),
    finding_groups:preflight.findings.map(f=>({
      id:f.id,description:f.static_finding,
      code_status:f.remediation_code_status,
      request_ids:requests.filter(r=>r.kind==="temuan"&&r.source_id===f.id)
        .map(r=>r.id),
      verified_closed:false,formal_resolution:null,
    })),
    requests,
    totals:{
      stages:6,findings:4,
      planned_evidence_requests:requests.length,
      technical_tests_written_before:preflight.totals.written_tests_combined,
      new_s9t_scenarios_written:10,
      combined_test_scenarios_written:preflight.totals.written_tests_combined+10,
      tests_executed_this_milestone:0,
      documents_received:0,verified_evidence:0,
      approvals_given:0,official_findings_closed:0,
    },
    readiness:NO_AUTHORITY,
    warnings:[
      "Daftar ini hanya menjelaskan jenis bukti yang kelak diminta, bukan bukti yang sudah tersedia.",
      "G0 tetap memerlukan izin eksplisit pemilik sebelum menjalankan tes G1-G4.",
      "Repository PUBLIC sesuai snapshot 12 November 2026; bukan pemeriksaan live.",
      "Tidak ada berkas diunggah, keputusan diberikan atau temuan dinyatakan tertutup.",
    ],
  };
}
export function qaEvidenceRegisterText(register,filter="all"){
  if(!obj(register)||register.schema!==REGISTER_SCHEMA||
    register.synthetic!==true||register.mode!=="CODE_ONLY"||
    register.readiness!==NO_AUTHORITY||
    !Array.isArray(register.requests)||
    !["all","gerbang","temuan"].includes(filter))
    throw Error("Register bukti DEMO tidak sah.");
  const found=register.requests.filter(r=>
    filter==="all"||r.kind===filter);
  return [
    "YANDIK+ M04-S9T | REGISTER KEBUTUHAN BUKTI QA DEMO",
    "KODE DITULIS, BELUM DIUJI. BUKAN LAPORAN PENGUJIAN ATAU IZIN.",
    "Diminta: "+register.totals.planned_evidence_requests+
      "; diterima: 0; terverifikasi: 0; temuan resmi tertutup: 0.",
    ...found.flatMap(r=>[
      r.id+" | "+r.kind.toUpperCase()+" | "+r.source_id,
      "  Kebutuhan kelak: "+r.requirement,
      "  Status: BELUM ADA BUKTI DI DEMO",
    ]),
    "Batas: "+register.readiness,
    ...register.warnings.map(w=>"PERINGATAN: "+w),
  ].join("\n");
}
