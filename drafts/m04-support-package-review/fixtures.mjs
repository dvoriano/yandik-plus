/** M04-S11 | fixture fiktif, BELUM DIUJI. */
export {NEEDS,PACKAGES} from "../m04-support-package-planning/fixtures.mjs";
export const MAKER=Object.freeze({id:"DEMO-PENYUSUN-01",role:"penyusun_paket_demo"});
export const REVIEWER=Object.freeze({id:"DEMO-PENELAAH-02",role:"penelaah_paket_demo"});
export const REFERENCES=Object.freeze({
 decision_reference:{document_ref:"DEMO-KEPUTUSAN-001",issuer_demo_id:"DEMO-UNIT-01",
 date_demo:"2026-11-01",metadata_ref:"DEMO-META-KEPUTUSAN-01"},
 budget_reference:{document_ref:"DEMO-ANGGARAN-001",issuer_demo_id:"DEMO-UNIT-02",
 date_demo:"2026-11-01",metadata_ref:"DEMO-META-ANGGARAN-01"},
 note:"Bahan telaah simulasi, belum ada konfirmasi dokumen asli."
});
