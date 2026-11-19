/** M04-I2 | KODE DITULIS, BELUM DIUJI. Source sync contract, never imports live data. */
import {validateDemo} from "../../prototypes/profil-puskeswan/model.mjs";
import {bridgeSources,assertPackageSources} from "../m04-integrated-workspace/bridge.mjs";
import {models} from "../m04-integrated-workspace/workspace.mjs";
const clone=v=>JSON.parse(JSON.stringify(v));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function sourceRevision(v){
 if(!Number.isSafeInteger(v)||v<0)throw Error("SOURCE_VERSION_INVALID");
 return v;
}
function historyPreserved(oldRows,newRows){
 if(!Array.isArray(oldRows)||!Array.isArray(newRows))throw Error("SOURCE_COLLECTION_INVALID");
 for(const old of oldRows){
  const next=newRows.find(x=>x.id===old.id);
  if(!next||!Number.isSafeInteger(next.version)||next.version<old.version)
   throw Error("SOURCE_HISTORY_REMOVAL_OR_ROLLBACK");
  if(next.version===old.version&&!same(old,next))throw Error("SOURCE_SAME_VERSION_CHANGED");
  if(Array.isArray(old.history)&&(!Array.isArray(next.history)||
      !same(old.history,next.history.slice(0,old.history.length))))
   throw Error("SOURCE_HISTORY_REWRITTEN");
 }
}
/** Validate provenance before any prospective source replacement. Pure, DEMO only. */
export function inspectSourceCandidate(workspace,facility,previousRevision,packet){
 if(!packet||typeof packet!=="object"||Array.isArray(packet)||
   Object.keys(packet).length!==2||!Object.hasOwn(packet,"revision")||
   !Object.hasOwn(packet,"state"))throw Error("SOURCE_PACKET_INVALID");
 const revision=sourceRevision(packet.revision);
 if(revision<=previousRevision)throw Error("SOURCE_VERSION_NOT_NEWER");
 const state=clone(packet.state);
 if(!state||state.facility?.id!==facility.id||state.facility.region!==facility.region||
   state.facility.name!==facility.name)throw Error("SOURCE_SCOPE_MISMATCH");
 validateDemo(state);
 const before=workspace.states.find(s=>s.facility.id===facility.id);
 if(before)for(const k of ["requests","problems","supportNeeds","priorityAssessments"])
   historyPreserved(before[k],state[k]);
 const states=before?workspace.states.map(s=>s.facility.id===facility.id?state:s):[...workspace.states,state];
 const next={...workspace,states};
 const bridge=bridgeSources(next.master,next.states);
 return {workspace:next,bridge,revision};
}
export function candidateSync(workspace,facility,previousRevision,packet){
 const candidate=inspectSourceCandidate(workspace,facility,previousRevision,packet);
 // A blocked candidate must never replace the active branch.
 try{assertPackageSources(candidate.bridge,candidate.workspace.packages,candidate.workspace.bindings);}
 catch{return {outcome:"terblokir_rekonsiliasi",workspace,revision:previousRevision};}
 models(candidate.workspace);
 return {outcome:"tersinkron_demo",workspace:candidate.workspace,revision:candidate.revision};
}
