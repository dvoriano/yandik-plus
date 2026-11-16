/**
 * YANDIK+ M04-S9V | KODE DITULIS, BELUM DIUJI.
 * Declarative QA session preparation only. No commands, runner, network,
 * approvals, evidence collection or environment modification.
 */
import {MODULES,TOTALS} from "../m04-static-consolidation/manifest.mjs";
import {buildQaPreflight} from "../m04-qa-preflight/preflight.mjs";
import {buildQaEvidenceRegister} from "../m04-qa-evidence-register/register.mjs";
import {buildQaEvidenceConsistency} from "../m04-qa-evidence-consistency/consistency.mjs";

export const PLAN_SCHEMA="M04-S9V-QA-SESSION-PLAN-UNTESTED-1";
export const BOUNDARY="RENCANA_SESI_QA_BUKAN_PERSETUJUAN_ATAU_HASIL_UJI";
const early=new Set(["S9F","S9G","S9H","S9I","S9J"]);
const extra=[
  ["S9R","m04-static-consolidation","static_contracts",12,"G1_STATIC_IMPORTS"],
  ["S9S","m04-qa-preflight","preflight",10,"G3_DEMO_PIPELINE"],
  ["S9T","m04-qa-evidence-register","register",10,"G3_DEMO_PIPELINE"],
  ["S9U","m04-qa-evidence-consistency","consistency",12,"G3_DEMO_PIPELINE"],
  ["S9V","m04-qa-session-plan","plan",8,"G3_DEMO_PIPELINE"],
];
const safeState=()=>({
  permission_to_execute:false,execution_started:false,
  result:null,evidence_reference:null,
});
const stagesMeta={
  G0_OWNER_SCOPE:{
    entry:"Izin eksplisit owner untuk commit, cakupan, lingkungan isolasi, batas biaya dan data sintetis.",
    exit:"Catatan izin aktual dari owner tersedia dan cocok dengan commit dan batas uji.",
    stop:"Jangan menjalankan G1-G4 apabila izin tidak ada, berubah, dicabut atau melampaui ruang lingkup.",
  },
  G1_STATIC_IMPORTS:{
    entry:"G0 telah disetujui di luar DEMO; commit uji dipatok, checkout isolasi dan lingkungan diperiksa.",
    exit:"Sintaks, impor/ekspor dan kontrak statis lolos pada commit yang dipatok, dengan log aktual.",
    stop:"Hentikan rantai bila impor, sintaks atau kontrak gagal; catat cacat dan lakukan regresi sesudah perbaikan.",
  },
  G2_UNIT_CONTRACTS:{
    entry:"G1 telah memiliki bukti hasil yang memenuhi kriteria; scope G0 masih berlaku.",
    exit:"Unit S9F-S9J dan regresi fingerprint lulus sesuai hasil aktual.",
    stop:"Hentikan sebelum G3 jika unit gagal atau log hasil tidak lengkap.",
  },
  G3_DEMO_PIPELINE:{
    entry:"G2 telah memiliki bukti hasil yang memenuhi kriteria; scope G0 masih berlaku.",
    exit:"Unit dan kontrak S9K-S9V, 18 butir/6 fungsi serta rantai bukti QA konsisten pada fixture.",
    stop:"Hentikan sebelum G4 jika fixture gagal, snapshot tidak konsisten, atau muncul klaim otorisasi palsu.",
  },
  G4_BROWSER_SECURITY:{
    entry:"G3 memenuhi kriteria; owner mengizinkan browser isolasi tanpa data atau akses produksi.",
    exit:"Bukti manual layout HP, keyboard, DOM, XSS, aksesibilitas dan tidak ada efek samping tak diizinkan.",
    stop:"Hentikan pada paparan data, efek samping, error kritis atau kendala keamanan; jangan deploy.",
  },
  G5_INSTITUTIONAL_REVIEW:{
    entry:"Ruang lingkup telaah manusia ditetapkan pihak berwenang secara terpisah dari tes teknis.",
    exit:"Catatan keputusan nyata disampaikan melalui proses institusi yang sesuai.",
    stop:"Jangan menyimpulkan persetujuan kelembagaan dari PASS teknis atau kelengkapan DEMO.",
  },
};
export function buildQaSessionPlan(){
  // The fixtures are built only if this module is run in a future permitted
  // environment; this source does not start a test or perform any I/O.
  const preflight=buildQaPreflight();
  const register=buildQaEvidenceRegister(preflight);
  const matrix=buildQaEvidenceConsistency(register,preflight);
  const suites=MODULES.map(m=>({
    module_id:m.id,path:m.testFile,written_cases:m.writtenTests,
    gate:early.has(m.id)?"G2_UNIT_CONTRACTS":"G3_DEMO_PIPELINE",
    ...safeState(),
  })).concat(extra.map(([module_id,dir,name,written_cases,gate])=>({
    module_id,path:"drafts/"+dir+"/tests/"+name+".test.mjs",
    written_cases,gate,...safeState(),
  })));
  const sum=suites.reduce((n,s)=>n+s.written_cases,0);
  const before=suites.filter(s=>s.module_id!=="S9V")
    .reduce((n,s)=>n+s.written_cases,0);
  if(suites.length!==17||new Set(suites.map(s=>s.path)).size!==17||
    before!==matrix.totals.written_scenarios_combined||
    before!==184||sum!==192||TOTALS.writtenTestsAfterChanges!==152)
    throw Error("Inventaris berubah: tinjau rencana sesi sebelum digunakan.");
  const gates=preflight.stages.map(stage=>{
    const meta=stagesMeta[stage.id];
    const group=register.stage_groups.find(g=>g.id===stage.id);
    const planned=suites.filter(s=>s.gate===stage.id);
    if(!meta||!group)throw Error("Rujukan gerbang tidak tersedia.");
    return {
      id:stage.id,purpose:stage.purpose,
      predecessors:[...stage.predecessors],
      suggested_role:stage.suggested_review_authority,
      authority_assigned:null,
      technical_test:stage.is_technical_test,
      written_suite_paths:planned.map(s=>s.path),
      written_case_count:planned.reduce((n,s)=>n+s.written_cases,0),
      requested_evidence_ids:[...group.request_ids],
      entry_criteria:meta.entry,exit_criteria:meta.exit,stop_criteria:meta.stop,
      ...safeState(),
    };
  });
  return {
    schema:PLAN_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    status:BOUNDARY,
    target_commit:null,owner_permission_reference:null,
    allowed_environment:null,
    source_snapshot:{...matrix.source},
    gates,suites,
    requested_evidence:matrix.lines.map(x=>({
      source_request_id:x.source_request_id,source_id:x.source_id,
      kind:x.kind,requirement:x.requirement,
      document_received:false,verified:false,evidence_reference:null,
    })),
    findings:matrix.findings.map(f=>({
      id:f.id,request_ids:[...f.request_ids],closed:false,
      official_resolution:null,
    })),
    result_template_fields:[
      "commit_sha","gate_id","suite_path_or_manual_case","case_id",
      "started_at","ended_at","environment","expected","observed",
      "result_PASS_FAIL_BLOCKED","evidence_reference","defect_id",
      "retest_reference",
    ],
    totals:{
      gates:6,suites:17,written_before:184,written_added:8,
      written_combined:192,manual_browser_cases_not_counted:true,
      executed:0,passed:0,verified_evidence:0,closed_findings:0,
    },
    deployment_authorized:false,
  };
}
