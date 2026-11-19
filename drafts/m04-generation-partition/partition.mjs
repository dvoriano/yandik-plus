/**
 * M04-I5 | KODE DITULIS, BELUM DIUJI.
 * Explicit one-time partition PROJECTION of synthetic I4 snapshot.
 * Not a migration or export of live operational records.
 */
import {bridgeSources} from "../m04-integrated-workspace/bridge.mjs";
import {models} from "../m04-integrated-workspace/workspace.mjs";
import {GENERATION_SCHEMA,validateGenerationData} from "./generation.mjs";
export const PARTITION_SCHEMA="M04-I5-PER-FACILITY-UNTESTED-1";
const copy=x=>JSON.parse(JSON.stringify(x));
const fail=s=>{throw Error(s);};
const KINDS=["packages","reviews","schedules","shipments","receipts","handovers","observations"];
function ownerOf(map,id){if(!map.has(id))fail("PARTITION_ORPHAN_OR_CROSS_FACILITY");return map.get(id);}
function withOwner(map,id,owner){
 if(typeof id!=="string"||map.has(id))fail("PARTITION_DUPLICATE_ID");
 map.set(id,owner);
}
export function partitionI4Snapshot(source,expectedRevision){
 if(!source||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||
  source.workspace?.synthetic!==true||!Array.isArray(source.workspace.master)||
  !Array.isArray(source.archived_workflows)||!Array.isArray(source.retired_workflow_ids)||
  !source.source_versions||!Array.isArray(source.corrections)||
  !Array.isArray(source.reconciliations))fail("I4_SNAPSHOT_INVALID");
 const w=source.workspace;models(w);
 const ids=new Set(),facilities=new Map();
 for(const m of w.master){
  if(ids.has(m.id))fail("FACILITY_DUPLICATE");
  ids.add(m.id);
  facilities.set(m.id,m);
 }
 const bridge=bridgeSources(w.master,w.states);
 const needOwner=new Map(bridge.needs.map(n=>[n.need_id,n.puskeswan_id]));
 const aliasOwner=new Map(w.master.map(m=>[m.support_id,m.id]));
 const maps=Object.fromEntries(KINDS.map(k=>[k,new Map()]));
 for(const p of w.packages){
  if(!p.lines.length)fail("EMPTY_PACKAGE_UNASSIGNABLE");
  const owners=new Set(p.lines.map(l=>aliasOwner.get(ownerOf(needOwner,l.need_id))));
  if(owners.size!==1||owners.has(undefined))fail("CROSS_FACILITY_PACKAGE");
  withOwner(maps.packages,p.id,[...owners][0]);
 }
 for(const r of w.reviews)withOwner(maps.reviews,r.id,ownerOf(maps.packages,r.snapshot.package_id));
 for(const s of w.schedules)withOwner(maps.schedules,s.id,ownerOf(maps.packages,s.package_id));
 for(const s of w.shipments)withOwner(maps.shipments,s.id,ownerOf(maps.schedules,s.schedule_id));
 for(const r of w.receipts)withOwner(maps.receipts,r.id,ownerOf(maps.shipments,r.shipment_id));
 for(const h of w.handovers){
  if(!h.receipt_ids.length)fail("HANDOVER_WITHOUT_RECEIPTS");
  const owners=new Set(h.receipt_ids.map(id=>ownerOf(maps.receipts,id)));
  if(owners.size!==1)fail("CROSS_FACILITY_HANDOVER");
  withOwner(maps.handovers,h.id,[...owners][0]);
 }
 for(const o of w.observations){
  const h=ownerOf(maps.handovers,o.handover_id),r=ownerOf(maps.receipts,o.receipt_id);
  if(h!==r)fail("CROSS_FACILITY_OBSERVATION");
  withOwner(maps.observations,o.id,h);
 }
 for(const b of w.bindings)
  if(ownerOf(maps.packages,b.package_id)!==aliasOwner.get(b.snapshot.facility.id))
   fail("CROSS_FACILITY_BINDING");
 const archivedSeen=new Set();
 for(const a of source.archived_workflows){
  if(!facilities.has(a.facility_id))fail("ARCHIVE_FACILITY_UNKNOWN");
  for(const kind of ["packages","reviews","schedules"])
   for(const id of a.retired_ids?.[kind]??[]){
    if(archivedSeen.has(id))fail("RETIRED_ID_DUPLICATE");
    archivedSeen.add(id);
   }
 }
 if(archivedSeen.size!==source.retired_workflow_ids.length||
  source.retired_workflow_ids.some(id=>!archivedSeen.has(id)))fail("RETIRED_LEDGER_MISMATCH");
 const portions=[];
 for(const m of w.master){
  const local={
   ...copy(w),master:[copy(m)],
   states:copy(w.states.filter(s=>s.facility.id===m.id))};
  for(const kind of KINDS)
   local[kind]=copy(w[kind].filter(x=>maps[kind].get(x.id)===m.id));
  local.bindings=copy(w.bindings.filter(b=>maps.packages.get(b.package_id)===m.id));
  models(local);
  const archives=copy(source.archived_workflows.filter(a=>a.facility_id===m.id));
  const retired_ids=archives.flatMap(a=>[
   ...(a.retired_ids?.packages??[]),...(a.retired_ids?.reviews??[]),
   ...(a.retired_ids?.schedules??[])]);
  const corrections=copy(source.corrections.filter(c=>c.facility_id===m.id));
  const reconciliationSummary=source.reconciliations.filter(x=>x.facility_id===m.id).map(x=>({
   correction_id:x.correction_id,source_revision:x.source_revision,
   reviewed:x.review?.disposition??null,activation_review:x.activation_review?.disposition??null
  }));
  const last=corrections.filter(c=>c.status==="diaktifkan_demo_terarsip");
  if(last.length!==archives.length)fail("ARCHIVE_CORRECTION_MISMATCH");
  const next=Math.max(2,archives.length+1);
  const part={schema:PARTITION_SCHEMA,synthetic:true,facility_id:m.id,workspace:local,
   source_revision:source.source_versions[m.id],
   generation:{schema:GENERATION_SCHEMA,next,active:null,stage:null},
   archives,retired_ids,corrections,reconciliation_summary:reconciliationSummary,
   revision_requests:[],provenance:{source:"I4_SNAPSHOT_DEMO",
    source_workspace_revision:expectedRevision},
   official_authorization:false};
  if(!Number.isSafeInteger(part.source_revision)||part.source_revision<0)
   fail("SOURCE_VERSION_INVALID");
  validateGenerationData(part);
  portions.push(part);
 }
 if(portions.length!==w.master.length)fail("PARTITION_COUNT_MISMATCH");
 return portions;
}
