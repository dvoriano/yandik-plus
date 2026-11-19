/**
 * M04-I4 | KODE DITULIS, BELUM DIUJI.
 * A DEMO-only, fail-closed activation proposal. NOT a legal approval.
 * A branch containing any delivery/receipt/BAST/monitoring trace is ineligible.
 * Never accepts caller-supplied candidate payloads.
 */
import {buildReconciliationBranch} from "../m04-reconciliation/impact.mjs";
import {models} from "../m04-integrated-workspace/workspace.mjs";

export const ACTIVATION_SCHEMA="M04-I4-DEMO-ACTIVATION-UNTESTED-1";
export const ACTIVATION_BOUNDARY="AKTIVASI_SIMULASI_BUKAN_PENGESAHAN_DATA_KEDINASAN";
const KINDS=["packages","reviews","schedules","shipments","receipts","handovers","observations"];
const DELIVERY=["shipments","receipts","handovers","observations"];
const clone=x=>JSON.parse(JSON.stringify(x));
const equal=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
const fail=s=>{throw Error(s);};

export function activationGate(entry,correction){
 if(!entry||!correction||entry.correction_id!==correction.id||
   entry.facility_id!==correction.facility_id||entry.impact?.synthetic!==true)
   fail("ACTIVATION_RECORD_INVALID");
 const impact=entry.impact, reasons=[];
 if(correction.status!=="cabang_draf_tercatat"&&
    correction.status!=="siap_aktivasi_demo")reasons.push("CORRECTION_NOT_REVIEWED");
 if(entry.review?.disposition!=="catat_cabang_draf")reasons.push("BRANCH_REVIEW_MISSING");
 if(!entry.branch||!entry.base_workspace)reasons.push("BRANCH_OR_BASELINE_MISSING");
 if(impact.facility_id!==correction.facility_id)reasons.push("FACILITY_MISMATCH");
 if(impact.mixed_facility_package)reasons.push("MIXED_FACILITY_PACKAGE");
 if(!impact.source_changed||!Array.isArray(impact.changed_need_ids)||
    impact.changed_need_ids.length===0)reasons.push("NO_SOURCE_CHANGE");
 if(impact.contains_delivery_traces||
    DELIVERY.some(k=>impact.counts?.[k]>0))reasons.push("DELIVERY_TRACE_PRESENT");
 if(impact.approved!==false||impact.production_written!==false)reasons.push("UNSUPPORTED_OFFICIAL_STATE");
 if(!Number.isSafeInteger(entry.source_revision)||entry.source_revision<=correction.base_source_revision)
  reasons.push("SOURCE_VERSION_INVALID");
 return {schema:ACTIVATION_SCHEMA,synthetic:true,eligible:reasons.length===0,
  reasons,requires_human_followup:reasons.includes("DELIVERY_TRACE_PRESENT")||
   reasons.includes("MIXED_FACILITY_PACKAGE"),
  official_approval:false,legal_documents_validated:false,
  deployment_authorized:false,source_revision:entry.source_revision,
  boundary:ACTIVATION_BOUNDARY};
}
/** All checks are repeated immediately before a transaction can promote DEMO. */
export function previewDemoPromotion(workspace,entry,correction,activeSourceRevision,packet){
 const gate=activationGate(entry,correction);
 if(!gate.eligible)fail("ACTIVATION_BLOCKED:"+gate.reasons.join(","));
 if(activeSourceRevision!==correction.base_source_revision||
    activeSourceRevision!==entry.impact.previous_source_revision)
  fail("ACTIVE_SOURCE_VERSION_CONFLICT");
 if(!equal(workspace,entry.base_workspace))fail("ACTIVE_WORKSPACE_CHANGED");
 const facility=workspace.master.find(m=>m.id===correction.facility_id);
 if(!facility)fail("FACILITY_MISSING");
 const rebuilt=buildReconciliationBranch(workspace,facility,activeSourceRevision,packet);
 if(!rebuilt.branch||!equal(rebuilt.impact,entry.impact)||
    !equal(rebuilt.branch,entry.branch)||
    rebuilt.impact.candidate_source_revision!==entry.source_revision)
  fail("CANDIDATE_CHANGED_REPREPARE");
 models(rebuilt.branch);
 const retired={};
 for(const kind of KINDS){
  const marked=new Set(entry.impact.affected?.[kind]??[]);
  retired[kind]=clone(workspace[kind].filter(x=>marked.has(x.id)));
  if(retired[kind].length!==marked.size)fail("RETIRED_OBJECT_MISSING");
 }
 const packageIds=new Set((entry.impact.affected?.packages??[]));
 retired.bindings=clone(workspace.bindings.filter(x=>packageIds.has(x.package_id)));
 if(retired.shipments.length||retired.receipts.length||retired.handovers.length||
    retired.observations.length)fail("DELIVERY_HISTORY_CANNOT_BE_RETIRED");
 const source=workspace.states.find(s=>s.facility.id===facility.id)??null;
 const archive={schema:ACTIVATION_SCHEMA,synthetic:true,facility_id:facility.id,
  correction_id:correction.id,source_revision_before:activeSourceRevision,
  source_revision_after:entry.source_revision,old_source:clone(source),
  replaced_objects:retired,retired_ids:{
   packages:entry.impact.affected.packages.slice(),
   reviews:entry.impact.affected.reviews.slice(),
   schedules:entry.impact.affected.schedules.slice()},
  old_active_workspace_revision:entry.base_workspace_revision,
  official_record:false,compensation_executed:false,
  boundary:ACTIVATION_BOUNDARY};
 return {workspace:clone(rebuilt.branch),archive,source_revision:entry.source_revision,
  official_approval:false};
}
