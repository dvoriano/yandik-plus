/**
 * YANDIK+ M04-S9R | KODE DITULIS, BELUM DIUJI.
 * Reviewed source-file inventory for static consolidation only.
 * This catalog is not an executable audit, QA success or authorization.
 */
export const AUDIT_SCHEMA="M04-S9R-STATIC-INVENTORY-UNTESTED-1";
export const NO_AUTHORITY="AUDIT_STATIS_BUKAN_HASIL_UJI_ATAU_PERSETUJUAN";
export const MODULES=Object.freeze([
  {
    "id": "S9F",
    "folder": "m04-preintegration-checklist",
    "model": "drafts/m04-preintegration-checklist/checklist.mjs",
    "fixture": "drafts/m04-preintegration-checklist/fixtures.mjs",
    "testFile": "drafts/m04-preintegration-checklist/tests/checklist.test.mjs",
    "ui": "drafts/m04-preintegration-checklist/main.mjs",
    "page": "drafts/m04-preintegration-checklist/index.html",
    "schemaSymbol": "CHECKLIST_SCHEMA",
    "builderSymbol": "buildPreintegrationChecklist",
    "upstream": [],
    "writtenTests": 10,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9G",
    "folder": "m04-dependency-matrix",
    "model": "drafts/m04-dependency-matrix/dependencies.mjs",
    "fixture": "drafts/m04-dependency-matrix/fixtures.mjs",
    "testFile": "drafts/m04-dependency-matrix/tests/dependencies.test.mjs",
    "ui": "drafts/m04-dependency-matrix/main.mjs",
    "page": "drafts/m04-dependency-matrix/index.html",
    "schemaSymbol": "MATRIX_SCHEMA",
    "builderSymbol": "buildDependencyMatrix",
    "upstream": [
      "S9F"
    ],
    "writtenTests": 11,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9H",
    "folder": "m04-blocker-triage",
    "model": "drafts/m04-blocker-triage/triage.mjs",
    "fixture": "drafts/m04-blocker-triage/fixtures.mjs",
    "testFile": "drafts/m04-blocker-triage/tests/triage.test.mjs",
    "ui": "drafts/m04-blocker-triage/main.mjs",
    "page": "drafts/m04-blocker-triage/index.html",
    "schemaSymbol": "TRIAGE_SCHEMA",
    "builderSymbol": "buildBlockerTriage",
    "upstream": [
      "S9G"
    ],
    "writtenTests": 11,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9I",
    "folder": "m04-function-review-agendas",
    "model": "drafts/m04-function-review-agendas/agendas.mjs",
    "fixture": "drafts/m04-function-review-agendas/fixtures.mjs",
    "testFile": "drafts/m04-function-review-agendas/tests/agendas.test.mjs",
    "ui": "drafts/m04-function-review-agendas/main.mjs",
    "page": "drafts/m04-function-review-agendas/index.html",
    "schemaSymbol": "AGENDA_SCHEMA",
    "builderSymbol": "buildFunctionAgendas",
    "upstream": [
      "S9H"
    ],
    "writtenTests": 11,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9J",
    "folder": "m04-discussion-confirmation",
    "model": "drafts/m04-discussion-confirmation/confirmation.mjs",
    "fixture": "drafts/m04-discussion-confirmation/fixtures.mjs",
    "testFile": "drafts/m04-discussion-confirmation/tests/confirmation.test.mjs",
    "ui": "drafts/m04-discussion-confirmation/main.mjs",
    "page": "drafts/m04-discussion-confirmation/index.html",
    "schemaSymbol": "CONFIRMATION_SCHEMA",
    "builderSymbol": "createDemoConfirmationBook",
    "upstream": [
      "S9I"
    ],
    "writtenTests": 13,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9K",
    "folder": "m04-proposed-followups",
    "model": "drafts/m04-proposed-followups/followups.mjs",
    "fixture": "drafts/m04-proposed-followups/fixtures.mjs",
    "testFile": "drafts/m04-proposed-followups/tests/followups.test.mjs",
    "ui": "drafts/m04-proposed-followups/main.mjs",
    "page": "drafts/m04-proposed-followups/index.html",
    "schemaSymbol": "FOLLOWUP_SCHEMA",
    "builderSymbol": "buildProposedFollowups",
    "upstream": [
      "S9J",
      "S9I"
    ],
    "writtenTests": 12,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9L",
    "folder": "m04-cross-function-recap",
    "model": "drafts/m04-cross-function-recap/recap.mjs",
    "fixture": "drafts/m04-cross-function-recap/fixtures.mjs",
    "testFile": "drafts/m04-cross-function-recap/tests/recap.test.mjs",
    "ui": "drafts/m04-cross-function-recap/main.mjs",
    "page": "drafts/m04-cross-function-recap/index.html",
    "schemaSymbol": "RECAP_SCHEMA",
    "builderSymbol": "buildCrossFunctionRecap",
    "upstream": [
      "S9K",
      "S9I"
    ],
    "writtenTests": 12,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9M",
    "folder": "m04-human-review-handoff",
    "model": "drafts/m04-human-review-handoff/handoff.mjs",
    "fixture": "drafts/m04-human-review-handoff/fixtures.mjs",
    "testFile": "drafts/m04-human-review-handoff/tests/handoff.test.mjs",
    "ui": "drafts/m04-human-review-handoff/main.mjs",
    "page": "drafts/m04-human-review-handoff/index.html",
    "schemaSymbol": "HANDOFF_SCHEMA",
    "builderSymbol": "buildHumanReviewHandoff",
    "upstream": [
      "S9L",
      "S9I"
    ],
    "writtenTests": 12,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9N",
    "folder": "m04-open-question-register",
    "model": "drafts/m04-open-question-register/questions.mjs",
    "fixture": "drafts/m04-open-question-register/fixtures.mjs",
    "testFile": "drafts/m04-open-question-register/tests/questions.test.mjs",
    "ui": "drafts/m04-open-question-register/main.mjs",
    "page": "drafts/m04-open-question-register/index.html",
    "schemaSymbol": "QUESTION_SCHEMA",
    "builderSymbol": "buildOpenQuestionRegister",
    "upstream": [
      "S9M",
      "S9I"
    ],
    "writtenTests": 12,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9O",
    "folder": "m04-evidence-readiness-matrix",
    "model": "drafts/m04-evidence-readiness-matrix/readiness.mjs",
    "fixture": "drafts/m04-evidence-readiness-matrix/fixtures.mjs",
    "testFile": "drafts/m04-evidence-readiness-matrix/tests/readiness.test.mjs",
    "ui": "drafts/m04-evidence-readiness-matrix/main.mjs",
    "page": "drafts/m04-evidence-readiness-matrix/index.html",
    "schemaSymbol": "READINESS_SCHEMA",
    "builderSymbol": "buildEvidenceReadinessMatrix",
    "upstream": [
      "S9N",
      "S9M",
      "S9I"
    ],
    "writtenTests": 12,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9P",
    "folder": "m04-material-gap-sequence",
    "model": "drafts/m04-material-gap-sequence/sequence.mjs",
    "fixture": "drafts/m04-material-gap-sequence/fixtures.mjs",
    "testFile": "drafts/m04-material-gap-sequence/tests/sequence.test.mjs",
    "ui": "drafts/m04-material-gap-sequence/main.mjs",
    "page": "drafts/m04-material-gap-sequence/index.html",
    "schemaSymbol": "SEQUENCE_SCHEMA",
    "builderSymbol": "buildMaterialGapSequence",
    "upstream": [
      "S9O",
      "S9M",
      "S9I"
    ],
    "writtenTests": 12,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  },
  {
    "id": "S9Q",
    "folder": "m04-phase-review-packets",
    "model": "drafts/m04-phase-review-packets/packets.mjs",
    "fixture": "drafts/m04-phase-review-packets/fixtures.mjs",
    "testFile": "drafts/m04-phase-review-packets/tests/packets.test.mjs",
    "ui": "drafts/m04-phase-review-packets/main.mjs",
    "page": "drafts/m04-phase-review-packets/index.html",
    "schemaSymbol": "PHASE_PACKET_SCHEMA",
    "builderSymbol": "buildPhaseReviewPackets",
    "upstream": [
      "S9P",
      "S9M",
      "S9G",
      "S9I"
    ],
    "writtenTests": 12,
    "status": "KODE_DITULIS_BELUM_DIUJI"
  }
].map(x=>Object.freeze({...x,upstream:Object.freeze(x.upstream)})));
export const FINDINGS=Object.freeze([
  Object.freeze({id:"STATIC-01",scope:"S9J",severity:"PERLU_PERBAIKAN",description:"Fingerprint sumber awal tidak mencakup fase, pendahulu, peran, dan metadata agenda.",change:"Perluasan fingerprint dan satu skenario QA tertulis",status:"KODE_DIPERBAIKI_BELUM_DIUJI"}),
  Object.freeze({id:"STATIC-02",scope:"S9F-S9Q",severity:"PENGUJIAN_TERTUNDA",description:"Skenario tertulis belum pernah dijalankan pada mode CODE_ONLY.",change:"Audit sumber dan backlog tanpa test runner",status:"BUTUH_IZIN_UJI"}),
  Object.freeze({id:"STATIC-03",scope:"REPOSITORY",severity:"RISIKO_KELEMBAGAAN",description:"Repository PUBLIC menurut pemeriksaan 12 November 2026; hanya fixture fiktif boleh disimpan.",change:"Pengaturan PRIVATE hanya oleh owner dan telaah histori paparan",status:"BUTUH_KEPUTUSAN_OWNER"}),
]);
export const TOTALS=Object.freeze({modules:12,writtenTestsBeforeS9R:139,
  newRegressionScenariosInS9J:1,writtenS9RScenarios:12,
  writtenTestsAfterChanges:152,testsExecutedThisMilestone:0,
  confirmedOfficialApprovals:0,productionChanges:0});
