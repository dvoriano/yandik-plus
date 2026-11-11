/**
 * M04-S9 | DEMO BELUM DIUJI.
 * Generates a fictional reviewed M04-S8 docket from earlier draft model APIs.
 * Nothing comes from Puskeswan, SRIKANDI, or production records.
 */
import {
  SOP_SOURCE_DEMO,PREPARER_DEMO,REVIEWER_DEMO,CHANGE_DEMO,
} from "../m04-sop-governance/fixtures.mjs";
import {
  createGovernanceDocket,recordRequirement,proposeCatalogChange,
  submitCatalogChange,reviewCatalogChange,
  submitGovernanceDocket,reviewGovernanceDocket,
} from "../m04-sop-governance/governance.mjs";
export const SOP_DEMO=SOP_SOURCE_DEMO;
let docket=createGovernanceDocket(SOP_SOURCE_DEMO,PREPARER_DEMO);
docket=recordRequirement(docket,SOP_SOURCE_DEMO,"spbe","perlu_klarifikasi","",
  "Ruang lingkup koordinasi SPBE contoh belum dibahas dan membutuhkan klarifikasi kelembagaan.",
  PREPARER_DEMO);
docket=recordRequirement(docket,SOP_SOURCE_DEMO,"otorisasi","perlu_klarifikasi","",
  "Pemisahan kewenangan petugas DEMO masih perlu ditinjau bersama pemilik proses resmi.",
  PREPARER_DEMO);
docket=proposeCatalogChange(docket,SOP_SOURCE_DEMO,CHANGE_DEMO,PREPARER_DEMO);
docket=submitCatalogChange(docket,SOP_SOURCE_DEMO,"DEMO-UBAH-UNIT-001",PREPARER_DEMO);
docket=reviewCatalogChange(docket,SOP_SOURCE_DEMO,"DEMO-UBAH-UNIT-001",REVIEWER_DEMO,
  "catat_untuk_pembahasan",
  "Usulan perubahan unit fiktif dapat dibahas, tetapi tidak berarti katalog resmi dapat diubah.");
docket=submitGovernanceDocket(docket,SOP_SOURCE_DEMO,PREPARER_DEMO);
export const DOCKET_DEMO=reviewGovernanceDocket(docket,SOP_SOURCE_DEMO,REVIEWER_DEMO,
  "catat_untuk_pembahasan",
  "Hasil pemeriksaan kelembagaan simulasi dicatat sebagai bahan diskusi yang masih memiliki kekurangan.");
export const COORDINATOR_DEMO={
  role:"koordinator_tindak_lanjut_kelembagaan_demo",
  id:"DEMO-KOORDINATOR-TL-01",
};
export const STAFF_DEMO={
  role:"petugas_perbaikan_kelembagaan_demo",
  id:"DEMO-PETUGAS-TL-01",
};
export const REVIEWER_TL_DEMO={
  role:"penelaah_tindak_lanjut_kelembagaan_demo",
  id:"DEMO-PENELAAH-TL-02",
};
export const EXAMPLE_PLAN={
  kind:"syarat_kelembagaan",
  source_ref:"spbe",
  description:"Belum ada penjelasan lengkap mengenai kebutuhan koordinasi tata kelola SPBE pada contoh M04-S8.",
  impact:"Integrasi layanan nyata berisiko tidak sejalan dengan alur dan tata kelola instansi.",
  corrective_plan:"Susun daftar informasi tata kelola, pihak yang perlu dikonsultasikan dan bahan pembahasan.",
  expected_output:"Draf daftar pemeriksaan dan catatan klarifikasi yang dapat dibahas pemilik proses.",
  assignee_demo_id:STAFF_DEMO.id,due_date_demo:"2026-12-05",
};
