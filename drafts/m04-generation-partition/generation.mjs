/**
 * M04-I5 | KODE DITULIS, BELUM DIUJI.
 * Next-generation DEMO IDs, with no reuse of archived identifiers.
 * No permission, stock, funds, official verification, or live delivery.
 */
import {models} from "../m04-integrated-workspace/workspace.mjs";
import {replaceDraft} from "../m04-support-package-planning/planning.mjs";
import {bindPackageSources} from "../m04-integrated-workspace/bridge.mjs";
import {createReview,submitReview,reviewPackage} from "../m04-support-package-review/review.mjs";
import {MAKER,REVIEWER,REFERENCES} from "../m04-support-package-review/fixtures.mjs";
import {saveSchedule} from "../m04-support-distribution-plan/distribution.mjs";
import {addShipment,addReceipt} from "../m04-support-lifecycle/realization.mjs";
import {addHandover} from "../m04-support-lifecycle/handover.mjs";
import {addObservation} from "../m04-support-lifecycle/monitoring.mjs";

export const GENERATION_SCHEMA="M04-I5-GENERATION-UNTESTED-1";
export const STAGES=Object.freeze(["paket","telaah","jadwal","kirim","terima","rujukan","monitor"]);
export const PREFIX=Object.freeze({
 paket:"DEMO-PKG-",telaah:"DEMO-TELAAH-",jadwal:"DEMO-JADWAL-",
 kirim:"DEMO-KIRIM-",terima:"DEMO-TERIMA-",rujukan:"DEMO-SERAH-",
 monitor:"DEMO-MON-",bast:"DEMO-BAST-"
});
const copy=x=>JSON.parse(JSON.stringify(x));
const fail=s=>{throw Error(s);};
export function generationId(facilityId,generation,stage){
 if(typeof facilityId!=="string"||!/^DEMO-PSW-[A-Z0-9_-]{1,24}$/.test(facilityId)||
    !Number.isSafeInteger(generation)||generation<2||generation>9999||
    !Object.hasOwn(PREFIX,stage))fail("GENERATION_ID_INVALID");
 return PREFIX[stage]+facilityId.slice("DEMO-PSW-".length)+"-G"+String(generation).padStart(4,"0");
}
export function validateGenerationData(part){
 if(!part||part.synthetic!==true||part.facility_id!==part.workspace?.master?.[0]?.id||
    !part.generation||part.generation.schema!==GENERATION_SCHEMA||
    !Number.isSafeInteger(part.generation.next)||part.generation.next<2||
    part.generation.next>10000||!Array.isArray(part.retired_ids)||
    !Array.isArray(part.archives))fail("GENERATION_PARTITION_INVALID");
 const {active,stage}=part.generation;
 if(active===null){if(stage!==null)fail("GENERATION_STAGE_INVALID");}
 else if(!Number.isSafeInteger(active)||active<2||active>=part.generation.next||
    !STAGES.includes(stage))fail("GENERATION_STAGE_INVALID");
 const seen=new Set();
 for(const id of part.retired_ids){
  if(typeof id!=="string"||seen.has(id)||!/^DEMO-[A-Z0-9_-]{3,70}$/.test(id))
   fail("RETIRED_ID_INVALID");
  seen.add(id);
 }
 return models(part.workspace);
}
export function beginGeneration(part){
 const x=validateGenerationData(part);
 if(part.generation.active!==null)fail("GENERATION_ALREADY_ACTIVE");
 if(part.archives.length===0)fail("I4_ARCHIVE_REQUIRED");
 if(part.generation.next>9999)fail("GENERATION_LIMIT_REACHED");
 if(["packages","reviews","schedules","shipments","receipts","handovers","observations"]
   .some(k=>part.workspace[k].length))fail("ACTIVE_CHAIN_REQUIRES_RECONCILIATION");
 const available=x.bridge.needs.filter(n=>n.puskeswan_id===part.workspace.master[0].support_id);
 if(!available.length)fail("REVERIFIED_M03_NEED_REQUIRED");
 return {...copy(part),generation:{schema:GENERATION_SCHEMA,next:part.generation.next+1,
  active:part.generation.next,stage:"paket"}};
}
export function advanceGeneration(part,stage){
 const x=validateGenerationData(part);
 if(!STAGES.includes(stage)||part.generation.active===null)fail("GENERATION_NOT_STARTED");
 const index=STAGES.indexOf(stage),previous=STAGES.indexOf(part.generation.stage);
 if(index!==previous)fail("GENERATION_STAGE_OUT_OF_ORDER");
 const facility=part.workspace.master[0],generation=part.generation.active;
 const id=k=>generationId(facility.id,generation,k),w=copy(part.workspace);
 const ctx={needs:x.bridge.needs,packages:w.packages,reviews:w.reviews,schedules:w.schedules};
 const n=x.bridge.needs.find(n=>n.puskeswan_id===facility.support_id);
 if(!n)fail("REVERIFIED_M03_NEED_REQUIRED");
 const pId=id("paket"),rId=id("telaah"),sId=id("jadwal"),kId=id("kirim"),
   tId=id("terima"),hId=id("rujukan"),oId=id("monitor");
 const newId=id(stage);
 if(part.retired_ids.includes(newId)||w[({
  paket:"packages",telaah:"reviews",jadwal:"schedules",kirim:"shipments",
  terima:"receipts",rujukan:"handovers",monitor:"observations"})[stage]].some(z=>z.id===newId))
  fail("GENERATION_ID_REUSED");
 if(stage==="paket"){
  w.packages=replaceDraft(ctx.needs,w.packages,{id:pId,
   title:"Paket generasi "+generation+" fiktif "+facility.name,
   purpose:"Rencana setelah rekonsiliasi dan verifikasi kebutuhan dalam simulasi.",
   lines:[{need_id:n.need_id,source_version:n.source_version,quantity:n.quantity}]});
  w.bindings=bindPackageSources(x.bridge,w.packages);
 }else if(stage==="telaah"){
  const draft=createReview(ctx.needs,w.packages,rId,{package_id:pId,fields:REFERENCES},MAKER);
  const submitted=submitReview(draft,ctx.needs,w.packages,MAKER);
  w.reviews.push(reviewPackage(submitted,ctx.needs,w.packages,REVIEWER,"catat_pembahasan",
   "Catatan pembahasan generasi baru hanya untuk simulasi.",true));
 }else if(stage==="jadwal"){
  const pkg=w.packages.find(z=>z.id===pId),line=pkg?.lines[0];
  if(!line)fail("GENERATION_SOURCE_PACKAGE_MISSING");
  w.schedules=saveSchedule(ctx.needs,w.packages,w.reviews,w.schedules,{
   id:sId,package_id:pId,need_id:line.need_id,date_demo:"2026-12-01",
   method:"antar",quantity:line.quantity});
 }else if(stage==="kirim"){
  const row=w.schedules.find(z=>z.id===sId);
  if(!row)fail("GENERATION_SCHEDULE_MISSING");
  w.shipments=addShipment({...ctx,schedules:w.schedules},w.shipments,w.receipts,{
   id:kId,schedule_id:sId,date_demo:"2026-12-01",quantity:row.quantity,
   note:"Pengiriman fiktif generasi baru, tanpa barang aktual."});
 }else if(stage==="terima"){
  const row=w.shipments.find(z=>z.id===kId);
  if(!row)fail("GENERATION_SHIPMENT_MISSING");
  w.receipts=addReceipt({...ctx,schedules:w.schedules},w.shipments,w.receipts,{
   id:tId,shipment_id:kId,date_demo:"2026-12-02",good:row.quantity,damaged:0,
   note:"Penerimaan fiktif generasi baru, bukan bukti fisik."});
 }else if(stage==="rujukan"){
  w.handovers=addHandover({...ctx,schedules:w.schedules},w.shipments,w.receipts,w.handovers,{
   id:hId,receipt_ids:[tId],document_ref:id("bast"),date_demo:"2026-12-03",
   note:"Rujukan BAST fiktif, bukan penerbitan dokumen sah."});
 }else{
  const receipt=w.receipts.find(z=>z.id===tId);
  if(!receipt)fail("GENERATION_RECEIPT_MISSING");
  w.observations=addObservation({...ctx,schedules:w.schedules},w.shipments,w.receipts,
   w.handovers,w.observations,{id:oId,handover_id:hId,receipt_id:tId,
   date_demo:"2026-12-04",used:receipt.good,idle:0,broken:0,
   note:"Pemanfaatan generasi baru sebatas pengamatan DEMO."});
 }
 models(w);
 const result={...copy(part),workspace:w,
  generation:{...part.generation,stage:index+1<STAGES.length?STAGES[index+1]:"monitor"}};
 // No second replay of the last stage: duplicate ID guard above rejects it.
 validateGenerationData(result);
 return result;
}
