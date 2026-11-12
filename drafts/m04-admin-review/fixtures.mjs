/** M04-S1 | DEMO fiktif, KODE DITULIS / BELUM DIUJI.
 * These records are NOT imported from M03, APEL, production or any real Puskeswan.
 * The adapter to M03 source version and role authorization is intentionally pending.
 */
export const NEED_SAMPLES=Object.freeze([
  {
    synthetic:true,need_id:"DEMO-NEED-001",puskeswan_id:"DEMO-PUSK-001",
    region_demo:"Wilayah fiktif Pegunungan A",item:"Perangkat penyimpanan rantai dingin",
    quantity:2,unit:"unit",status:"terverifikasi",
    evidence_status:"metadata_demo",priority_status:"ditinjau",priority_band:"tinggi",
    source_version:2,
  },
  {
    synthetic:true,need_id:"DEMO-NEED-002",puskeswan_id:"DEMO-PUSK-002",
    region_demo:"Wilayah fiktif Kota B",item:"Peralatan pemeriksaan klinik sederhana",
    quantity:1,unit:"set",status:"terverifikasi",
    evidence_status:"metadata_demo",priority_status:"belum_dinilai",priority_band:null,
    source_version:1,
  },
  {
    synthetic:true,need_id:"DEMO-NEED-003",puskeswan_id:"DEMO-PUSK-003",
    region_demo:"Wilayah fiktif Pesisir C",item:"Alat bantu penanganan hewan kecil",
    quantity:3,unit:"unit",status:"diajukan",
    evidence_status:"metadata_demo",priority_status:"belum_dinilai",priority_band:null,
    source_version:1,
  },
]);
