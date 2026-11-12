/** M04-S3 DRAF/BELUM DIUJI | All identifiers are invented, no real records. */
import { REVIEWED_DOSSIER, EXTERNAL_REFERENCE_SAMPLE } from "../m04-decision-reference/fixtures.mjs";
import { createReferenceRegister, addExternalReference, submitExternalReference, reviewExternalReference } from "../m04-decision-reference/reference_register.mjs";
const maker={role:"pencatat_referensi_prov_demo",id:"DEMO-PENCATAT-PROV-01"};
const reviewer={role:"penelaah_referensi_prov_demo",id:"DEMO-PENELAAH-PROV-02"};
const draft=addExternalReference(createReferenceRegister(),REVIEWED_DOSSIER,EXTERNAL_REFERENCE_SAMPLE,maker);
const submitted=submitExternalReference(draft,"DEMO-REF-001",REVIEWED_DOSSIER,maker);
export const DEMO_DOSSIER=REVIEWED_DOSSIER;
export const DEMO_REGISTER=reviewExternalReference(submitted,"DEMO-REF-001",
  REVIEWED_DOSSIER,reviewer,"catat_metadata",
  "Metadata referensi contoh dicatat untuk penelusuran lanjut; keaslian belum diperiksa.",
  true);
export const DEMO_REFERENCE_ID="DEMO-REF-001";
export const DEMO_PLAN={
  task_type:"konfirmasi_sumber",
  description:"Menyiapkan daftar pertanyaan dan rujukan untuk klarifikasi ke penerbit dokumen contoh.",
  expected_output:"Draf permintaan penjelasan metadata serta daftar hal yang masih harus dikonfirmasi.",
  due_date_demo:"2026-11-24",
  assignee_demo_id:"DEMO-PETUGAS-ADMIN-01",
  limitations:"Belum ada pemeriksaan keaslian atau kewenangan; seluruh tindakan hanya simulasi.",
};
