/**
 * M04-I4 | KODE DITULIS, BELUM DIUJI.
 * Register unresolved downstream implications. No financial calculation,
 * stock adjustment, reversal, official BAST amendment or delivery changes.
 */
export const COMPENSATION_SCHEMA="M04-I4-FOLLOWUP-REGISTER-UNTESTED-1";
export function draftFollowupRegister(workspace,entry,correction){
 if(!workspace||!entry||!correction||entry.facility_id!==correction.facility_id||
    entry.correction_id!==correction.id||entry.impact?.synthetic!==true)
  throw Error("FOLLOWUP_SOURCE_INVALID");
 const impact=entry.impact;
 const hasTraces=impact.contains_delivery_traces===true||
  ["shipments","receipts","handovers","observations"].some(k=>impact.counts?.[k]>0);
 if(!hasTraces)throw Error("FOLLOWUP_NOT_REQUIRED_FOR_UNDELIVERED");
 if(correction.status!=="cabang_draf_tercatat"||
    entry.review?.disposition!=="catat_cabang_draf")
  throw Error("FOLLOWUP_REVIEW_REQUIRED");
 const categories=["shipments","receipts","handovers","observations"];
 const rows=[];
 for(const kind of categories){
  const ids=new Set(impact.affected?.[kind]??[]);
  const found=workspace[kind].filter(x=>ids.has(x.id));
  if(found.length!==ids.size)throw Error("FOLLOWUP_SOURCE_OBJECT_MISSING");
  for(const x of found){
   const quantity=kind==="shipments"?x.quantity:
    kind==="receipts"?{good:x.good,damaged:x.damaged}:
    kind==="observations"?{used:x.used,idle:x.idle,broken:x.broken}:null;
   rows.push({kind,source_id:x.id,related_to:kind==="shipments"?x.schedule_id:
    kind==="receipts"?x.shipment_id:
    kind==="handovers"?x.receipt_ids.slice():[x.handover_id,x.receipt_id],
    quantity_demo:quantity,status:"butuh_telaah_manual",
    action_executed:false,document_reissued:false,
    reason:"Keterkaitan sumber berubah; perlu pemeriksaan dan dasar resmi bila diterapkan"});
  }
 }
 return {schema:COMPENSATION_SCHEMA,synthetic:true,correction_id:correction.id,
  facility_id:correction.facility_id,source_revision_before:correction.base_source_revision,
  planned_followups:rows,actual_compensation:0,official_adjustments:0,
  legal_bast_issued:false,stock_mutated:false,workspace_changed:false,
  boundary:"REGISTER_TINDAK_LANJUT_DEMO_BUKAN_KOMPENSASI_AKTUAL"};
}
