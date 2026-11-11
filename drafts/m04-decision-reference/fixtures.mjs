/**
 * M04-S2 | DRAF BELUM DIUJI.
 * Reuses M04-S1 pure model only with synthetic, non-sensitive fixtures.
 * Nothing is copied from a real SK, decision, SRIKANDI or production database.
 */
import {
  createDossier,submitDossier,reviewDossier,REQUIREMENTS,
} from "../m04-admin-review/dossier.mjs";
import { NEED_SAMPLES } from "../m04-admin-review/fixtures.mjs";
export const MAKER_S1={role:"penyusun_prov_demo",id:"DEMO-PENYUSUN-PROV-01"};
export const REVIEWER_S1={role:"penelaah_administrasi_demo",id:"DEMO-PENELAAH-PROV-02"};
const requirements=Object.fromEntries(REQUIREMENTS.map(req=>[req.id,"ada"]));
const dossier=createDossier(NEED_SAMPLES[0],{
  purpose:"Usulan penataan sarana pendukung layanan pada fasilitas contoh fiktif.",
  technical_context:"Kondisi alat pendukung pelayanan perlu ditelaah dengan informasi tambahan.",
  limitations:"Program, kewenangan, legalitas serta sumber anggaran belum dipastikan.",
  evidence_ref:"DEMO-BUKTI-ADM-001",
  requirements,
},MAKER_S1);
export const REVIEWED_DOSSIER=reviewDossier(
  submitDossier(dossier,MAKER_S1),
  REVIEWER_S1,"catat_bahan",
  "Bahan pertimbangan administratif dicatat hanya dalam simulasi fiktif; tidak ada persetujuan bantuan."
);
export const EXTERNAL_REFERENCE_SAMPLE={
  document_ref:"DEMO-SK-EXTERNAL-001",
  document_type:"keputusan_eksternal",
  issuer_demo_id:"DEMO-UNIT-PROV-01",
  document_date_demo:"2026-10-15",
  claim_summary:"Contoh referensi dokumen yang diklaim telah terbit di luar sistem dan perlu konfirmasi penerbit.",
  source_metadata_ref:"DEMO-METADATA-EXTERNAL-01",
  caveat:"Keaslian dokumen, keberlakuan, ruang lingkup dan hubungan dengan kebutuhan belum diverifikasi.",
};
