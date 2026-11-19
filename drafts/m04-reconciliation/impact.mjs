/** M04-I3 | KODE DITULIS, BELUM DIUJI.
 * Impact graph is conservative and derived from synthetic bound IDs, never
 * guessed from a person's or facility's name. No active-state mutation.
 */
import {bridgeSources} from "../m04-integrated-workspace/bridge.mjs";
import {inspectSourceCandidate} from "../m04-data-foundation/source.mjs";
import {models} from "../m04-integrated-workspace/workspace.mjs";
const clone=v=>JSON.parse(JSON.stringify(v));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const KEYS=["packages","bindings","reviews","schedules","shipments","receipts","handovers","observations"];
export const IMPACT_SCHEMA="M04-I3-RECONCILIATION-IMPACT-UNTESTED-1";
function ids(rows){return new Set(rows.map(x=>x.id));}
function report(rows){return rows.map(x=>x.id).sort();}
export function buildReconciliationBranch(workspace,facility,previousRevision,packet){
 models(workspace);
 const old=bridgeSources(workspace.master,workspace.states);
 const candidate=inspectSourceCandidate(workspace,facility,previousRevision,packet);
 const before=old.links.filter(l=>l.canonical_id===facility.id);
 const after=candidate.bridge.links.filter(l=>l.canonical_id===facility.id);
 const oldMap=new Map(before.map(l=>[l.need_id,l]));
 const newMap=new Map(after.map(l=>[l.need_id,l]));
 const needIds=new Set([...oldMap.keys(),...newMap.keys()].filter(id=>
  !oldMap.has(id)||!newMap.has(id)||
  !same(oldMap.get(id).snapshot,newMap.get(id).snapshot)||
  !same(old.needs.find(n=>n.need_id===id),candidate.bridge.needs.find(n=>n.need_id===id))));
 const packages=workspace.packages.filter(p=>p.lines.some(l=>needIds.has(l.need_id)));
 const pIds=ids(packages);
 const reviews=workspace.reviews.filter(r=>pIds.has(r.snapshot.package_id));
 const schedules=workspace.schedules.filter(s=>pIds.has(s.package_id));
 const sIds=ids(schedules);
 const shipments=workspace.shipments.filter(s=>sIds.has(s.schedule_id));
 const kIds=ids(shipments);
 const receipts=workspace.receipts.filter(r=>kIds.has(r.shipment_id));
 const rIds=ids(receipts);
 const handovers=workspace.handovers.filter(h=>h.receipt_ids.some(r=>rIds.has(r)));
 const hIds=ids(handovers);
 const observations=workspace.observations.filter(o=>hIds.has(o.handover_id)||rIds.has(o.receipt_id));
 const activeIds=new Set([facility.support_id]);
 const mixed=packages.some(p=>p.lines.some(l=>!old.needs.some(n=>n.need_id===l.need_id&&activeIds.has(n.puskeswan_id))));
 const affected={packages,reviews,schedules,shipments,receipts,handovers,observations};
 const counts=Object.fromEntries(Object.entries(affected).map(([k,v])=>[k,v.length]));
 const sourceChanged=needIds.size>0;
 const changedNeeds=[...needIds].sort();
 const impact={schema:IMPACT_SCHEMA,synthetic:true,facility_id:facility.id,
  previous_source_revision:previousRevision,candidate_source_revision:candidate.revision,
  changed_need_ids:changedNeeds,
  affected: Object.fromEntries(Object.entries(affected).map(([k,v])=>[k,report(v)])),
  counts,
  mixed_facility_package:mixed,
  contains_delivery_traces:shipments.length>0||receipts.length>0||
   handovers.length>0||observations.length>0,
  source_changed:sourceChanged,
  evidence_verified:false,approved:false,production_written:false};
 // A mixed-facility package cannot be split safely by facility at this stage.
 if(mixed)return {impact,branch:null,reason:"MIXED_FACILITY_PACKAGE_REQUIRES_MANUAL_REVIEW"};
 // Preview only: old active objects are retained in historical snapshots;
 // all affected objects are removed from *candidate branch* ONLY.
 const branch=clone(candidate.workspace);
 for(const key of ["packages","reviews","schedules","shipments","receipts","handovers","observations"]){
  const impactedIds=ids(affected[key]);
  branch[key]=branch[key].filter(x=>!impactedIds.has(x.id));
 }
 branch.bindings=branch.bindings.filter(b=>!pIds.has(b.package_id));
 // No structural inconsistencies may pass through branch creation.
 models(branch);
 return {impact,branch,reason:null};
}
