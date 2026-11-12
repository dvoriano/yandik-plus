/**
 * YANDIK+ M04-S9S | KODE DITULIS, BELUM DIUJI.
 * QA preparation ONLY. No test execution, no assignment, no authorization.
 * All statuses describe this synthetic work package, not any production system.
 */
import {MODULES,FINDINGS,TOTALS}
  from "../m04-static-consolidation/manifest.mjs";

export const PREFLIGHT_SCHEMA="M04-S9S-QA-PREFLIGHT-UNTESTED-1";
export const NO_AUTHORITY="RENCANA_QA_BELUM_DIIJINKAN_DAN_TIDAK_MENUTUP_TEMUAN_RESMI";
export const STAGE_CODES=Object.freeze([
  "G0_OWNER_SCOPE","G1_STATIC_IMPORTS","G2_UNIT_CONTRACTS",
  "G3_DEMO_PIPELINE","G4_BROWSER_SECURITY","G5_INSTITUTIONAL_REVIEW",
]);
export const EVIDENCE_REQUIREMENTS=Object.freeze({
  "STATIC-01":Object.freeze([
    "Regresi S9J pada perubahan fase, dependensi, peran, dokumen dan metadata",
    "Log hasil pengujian terisolasi yang disetujui owner",
  ]),
  "STATIC-02":Object.freeze([
    "Izin eksplisit owner untuk tes yang disepakati",
    "Laporan per kasus: PASS/FAIL, waktu, lingkungan, commit",
  ]),
  "STATIC-03":Object.freeze([
    "Pemeriksaan setting visibility oleh owner",
    "Keputusan klasifikasi informasi dan tinjauan histori paparan",
  ]),
  "STATIC-04":Object.freeze([
    "Pemeriksaan dua arah semua import langsung di 12 model",
    "Bukti uji resolver/graph dari lingkungan isolasi yang diizinkan",
  ]),
});
const steps=Object.freeze([
  Object.freeze({
    id:"G0_OWNER_SCOPE",purpose:"Persetujuan ruang lingkup dan data uji oleh pemilik",
    modules:[],predecessors:[],requires_owner_permission:true,
    proposed_evidence:"Izin eksplisit, batas biaya/lingkungan dan larangan data riil",
    authority:"OWNER",is_technical_test:false,
  }),
  Object.freeze({
    id:"G1_STATIC_IMPORTS",purpose:"Periksa sintaks dan import/export sumber di isolasi",
    modules:MODULES.map(m=>m.id),predecessors:["G0_OWNER_SCOPE"],
    requires_owner_permission:true,is_technical_test:true,
    proposed_evidence:"Hasil tes kontrak statis dan resolver per commit",
    authority:"QA_USULAN",
  }),
  Object.freeze({
    id:"G2_UNIT_CONTRACTS",purpose:"Periksa status nol, regresi fingerprint, negative input",
    modules:["S9F","S9G","S9H","S9I","S9J"],
    predecessors:["G1_STATIC_IMPORTS"],
    requires_owner_permission:true,is_technical_test:true,
    proposed_evidence:"Hasil unit test awal, regresi S9J dan tidak ada status resmi palsu",
    authority:"QA_USULAN",
  }),
  Object.freeze({
    id:"G3_DEMO_PIPELINE",purpose:"Periksa kesinambungan pertanyaan/bukti pada S9K–S9Q",
    modules:["S9K","S9L","S9M","S9N","S9O","S9P","S9Q"],
    predecessors:["G2_UNIT_CONTRACTS"],
    requires_owner_permission:true,is_technical_test:true,
    proposed_evidence:"Bukti 18 butir, 6 fungsi, fase P0–P3 dan status DEMO tidak berubah",
    authority:"QA_USULAN",
  }),
  Object.freeze({
    id:"G4_BROWSER_SECURITY",purpose:"Periksa DOM, XSS, aksesibilitas dan tampilan mobile",
    modules:MODULES.map(m=>m.id),
    predecessors:["G3_DEMO_PIPELINE"],
    requires_owner_permission:true,is_technical_test:true,
    proposed_evidence:"Hasil keyboard, screen reader, mobile dan pemeriksaan keamanan",
    authority:"QA_USULAN",
  }),
  Object.freeze({
    id:"G5_INSTITUTIONAL_REVIEW",purpose:"Telaah SOP/SPBE, klasifikasi dan otoritas oleh manusia",
    modules:[],predecessors:[],requires_owner_permission:false,
    is_technical_test:false,
    proposed_evidence:"Penilaian instansi melalui kanal kedinasan yang berlaku",
    authority:"PEJABAT_BERWENANG_USULAN",
  }),
]);
function ensureDrafts(){
  if(MODULES.length!==12||TOTALS.writtenTestsAfterChanges!==152||
    TOTALS.testsExecutedThisMilestone!==0||FINDINGS.length!==4||
    FINDINGS.some(x=>!Object.prototype.hasOwnProperty.call(EVIDENCE_REQUIREMENTS,x.id)))
    throw Error("Inventaris audit statis berubah; paket QA perlu ditinjau ulang.");
  if(steps.length!==STAGE_CODES.length||
    steps.some((s,i)=>s.id!==STAGE_CODES[i]))
    throw Error("Daftar tahap preflight tidak konsisten.");
}
export function buildQaPreflight(){
  ensureDrafts();
  const stages=steps.map(x=>({
    id:x.id,purpose:x.purpose,modules:[...x.modules],
    predecessors:[...x.predecessors],
    proposed_evidence:x.proposed_evidence,
    suggested_review_authority:x.authority,
    requires_owner_permission:x.requires_owner_permission,
    is_technical_test:x.is_technical_test,
    approved_to_run:false,executed:false,passed:false,
    actual_evidence_reference:null,official_assignee:null,
    status:x.is_technical_test?"MENUNGGU_IZIN_UJI":
      "BUTUH_PENILAIAN_MANUSIA",
  }));
  return {
    schema:PREFLIGHT_SCHEMA,synthetic:true,mode:"CODE_ONLY",
    source:{schema:"M04-S9R-STATIC-INVENTORY-UNTESTED-1",
      repository_visibility_snapshot:"public",
      observed_date:"2026-11-12",
      live_verification:false},
    modules:MODULES.map(m=>({
      id:m.id,model:m.model,
      direct_upstream:[...m.upstream],
      writtenTests:m.writtenTests,
      test_result:"BELUM_DIUJI",
      permission_to_execute:false,
    })),
    findings:FINDINGS.map(f=>({
      id:f.id,scope:f.scope,static_finding:f.description,
      remediation_text:f.change,
      remediation_code_status:f.status,
      required_evidence:[...EVIDENCE_REQUIREMENTS[f.id]],
      official_finding_closed:false,
      technical_validation_complete:false,
      institutional_acceptance:false,
    })),
    stages,
    totals:{
      module_count:MODULES.length,
      written_tests_previous:TOTALS.writtenTestsAfterChanges,
      new_preflight_tests_written:10,
      written_tests_combined:TOTALS.writtenTestsAfterChanges+10,
      tests_executed_in_s9s:0,
      qa_steps:stages.length,
      findings:4,verified_closures:0,
      owner_testing_permission:0,official_decisions:0,
    },
    readiness:NO_AUTHORITY,
    warnings:[
      "Semua status dan bukti rencana adalah DEMO, bukan hasil QA.",
      "Perbaikan kode STATIC-01 dan STATIC-04 belum diuji; jangan beri status CLOSED.",
      "Repository PUBLIC pada snapshot 12 November 2026, bukan pemeriksaan live.",
      "Tidak boleh menjalankan tes, CI, mengirim dokumen, menunjuk pejabat, merge atau deploy tanpa izin relevan.",
    ],
  };
}
export function qaPreflightText(packet,stage="all"){
  if(!packet||packet.schema!==PREFLIGHT_SCHEMA||
    packet.synthetic!==true||packet.mode!=="CODE_ONLY"||
    packet.readiness!==NO_AUTHORITY||
    !["all",...STAGE_CODES].includes(stage))
    throw Error("Paket preflight DEMO tidak sesuai.");
  const selected=packet.stages.filter(s=>stage==="all"||s.id===stage);
  return [
    "YANDIK+ M04-S9S | PERSIAPAN QA DEMO | KODE BELUM DIUJI",
    "BUKAN IZIN UJI, PERINTAH KERJA, LAPORAN PASS ATAU PENGESAHAN.",
    "Tes tertulis "+packet.totals.written_tests_combined+
      "; tes dijalankan S9S: "+packet.totals.tests_executed_in_s9s+
      "; temuan resmi ditutup: "+packet.totals.verified_closures+".",
    ...selected.flatMap(s=>[
      "- "+s.id+" | "+s.purpose,
      "  Prasyarat: "+(s.predecessors.join(", ")||"tidak ada"),
      "  Bukti yang kelak diperlukan: "+s.proposed_evidence,
      "  Status: "+s.status+"; bukti aktual tidak ada.",
    ]),
    "TEMUAN BELUM DINYATAKAN SELESAI:",
    ...packet.findings.map(f=>"- "+f.id+" | "+f.remediation_code_status+
      " | bukti verifikasi masih diperlukan"),
    "BATAS: "+packet.readiness,...packet.warnings,
  ].join("\n");
}
