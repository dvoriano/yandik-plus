/** M04-I2 | KODE DITULIS, BELUM DIUJI.
 * Server-only draft. Inject an isolated node:sqlite DatabaseSync connection,
 * trusted identity lookup and trusted SYNTHETIC source reader.
 * Never expose the connection, seed or methods directly as HTTP routes.
 */
import {SCHEMA_SQL} from "./schema.mjs";
import {principal,scope,requireAction,ACTIONS} from "./policy.mjs";
import {candidateSync,sourceRevision} from "./source.mjs";
import {buildReconciliationBranch} from "../m04-reconciliation/impact.mjs";
import {models,advanceDemo,viewWorkspace,ACTIONS as STAGES} from "../m04-integrated-workspace/workspace.mjs";
const clone=v=>JSON.parse(JSON.stringify(v));
const REQ=/^DEMO-REQ-[A-Z0-9_-]{1,48}$/;
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const COR=/^DEMO-KOREKSI-[A-Z0-9_-]{1,48}$/;
function checkId(x,regex){if(typeof x!=="string"||!regex.test(x))throw Error("INVALID_ID");return x;}
function version(x){if(!Number.isSafeInteger(x)||x<0)throw Error("INVALID_VERSION");return x;}
function note(x){if(typeof x!=="string"||x.trim().length<10||x.trim().length>500)throw Error("INVALID_NOTE");return x.trim();}
function fields(x,keys){
 if(!x||typeof x!=="object"||Array.isArray(x)||Object.keys(x).length!==keys.length||keys.some(k=>!Object.hasOwn(x,k)))
  throw Error("INVALID_COMMAND");
}
function normalize(raw){
 const keys=["request_id","expected_revision","facility_id","action","data"];
 fields(raw,keys);
 if(!ACTIONS.includes(raw.action))throw Error("INVALID_ACTION");
 const data=raw.data;
 let normalized;
 if(raw.action==="advance"){
  fields(data,["stage"]);
  if(!STAGES.includes(data.stage))throw Error("INVALID_STAGE");
  normalized={stage:data.stage};
 }else if(raw.action==="request_correction"){
  fields(data,["correction_id","reason"]);
  normalized={correction_id:checkId(data.correction_id,COR),reason:note(data.reason)};
 }else if(raw.action==="review_correction"){
  fields(data,["correction_id","decision","reason"]);
  if(!["catat_untuk_sinkron","kembalikan"].includes(data.decision))throw Error("INVALID_DECISION");
  normalized={correction_id:checkId(data.correction_id,COR),decision:data.decision,reason:note(data.reason)};
 }else if(raw.action==="review_reconciliation"){
  fields(data,["correction_id","disposition","reason"]);
  if(!["catat_cabang_draf","kembalikan_untuk_perbaikan"].includes(data.disposition))
   throw Error("INVALID_DISPOSITION");
  normalized={correction_id:checkId(data.correction_id,COR),disposition:data.disposition,
   reason:note(data.reason)};
 }else{
  fields(data,["correction_id"]);
  normalized={correction_id:checkId(data.correction_id,COR)};
 }
 return {request_id:checkId(raw.request_id,REQ),expected_revision:version(raw.expected_revision),
  facility_id:checkId(raw.facility_id,FAC),action:raw.action,data:normalized};
}
function transaction(db,fn){
 db.exec("BEGIN IMMEDIATE");
 try{const result=fn();db.exec("COMMIT");return result;}
 catch(e){db.exec("ROLLBACK");throw e;}
}
// One workspace per isolated DEMO database. All mutations are synchronous.
export function openRepository(db,{lookupPrincipal,readSource,clock=()=>new Date().toISOString()}){
 if(typeof lookupPrincipal!=="function"||typeof readSource!=="function")throw Error("TRUSTED_ADAPTER_REQUIRED");
 db.exec("PRAGMA foreign_keys=ON; PRAGMA recursive_triggers=ON; PRAGMA busy_timeout=3000;");
 db.exec(SCHEMA_SQL);
 const select=()=>db.prepare("SELECT revision,payload FROM workspace_current WHERE id=1").get();
 const read=()=>{
  const row=select();if(!row)throw Error("WORKSPACE_NOT_INITIALIZED");
  return {revision:row.revision,payload:JSON.parse(row.payload)};
 };
 const timestamp=()=>{
  const t=clock();
  if(typeof t!=="string"||!Number.isFinite(Date.parse(t))||new Date(t).toISOString()!==t)
   throw Error("INVALID_CLOCK");
  return t;
 };
 function initialize(seed){
  return transaction(db,()=>{
   if(select())throw Error("ALREADY_INITIALIZED");
   models(seed);
   const workspace=clone(seed),source_versions=Object.fromEntries(workspace.master.map(m=>
    [m.id,workspace.states.some(s=>s.facility.id===m.id)?1:0]));
   const payload=JSON.stringify({workspace,source_versions,corrections:[],reconciliations:[]});
   const t=timestamp();
   db.prepare("INSERT INTO workspace_current(id,revision,payload) VALUES(1,0,?)").run(payload);
   db.prepare("INSERT INTO workspace_versions(revision,payload,recorded_at) VALUES(0,?,?)").run(payload,t);
   return {revision:0,synthetic:true};
  });
 }
 function view(actorId,period,facilityId=null){
  const actor=principal(actorId,lookupPrincipal),current=read();
  const w=current.payload.workspace;
  if(facilityId!==null&&!scope(actor,w.master.find(m=>m.id===facilityId)))throw Error("ACCESS_DENIED");
  const result=viewWorkspace(w,actor,period,facilityId);
  // Pimpinan receives no per-facility revision, correction or event data.
  if(actor.role==="pimpinan")return result;
  const corrections=facilityId===null?[]:current.payload.corrections
   .filter(c=>c.facility_id===facilityId)
   .map(c=>({id:c.id,status:c.status,reason:c.reason,base_source_revision:c.base_source_revision,
    review_reason:c.review_reason??null,outcome:c.outcome??null}));
  return {...result,revision:current.revision,corrections};
 }
 function reconciliation(actorId,facilityId,correctionId){
  const actor=principal(actorId,lookupPrincipal),{payload}=read();
  const facility=payload.workspace.master.find(m=>m.id===facilityId);
  if(!scope(actor,facility)||actor.role==="pimpinan")throw Error("ACCESS_DENIED");
  const c=payload.corrections.find(c=>c.id===correctionId&&c.facility_id===facilityId);
  if(!c)throw Error("CORRECTION_NOT_FOUND");
  const entry=(payload.reconciliations??[]).find(x=>x.correction_id===c.id);
  if(!entry)return {correction_id:c.id,status:c.status,impact:null,review:null,
   active_workspace_unchanged:true};
  return {correction_id:c.id,status:c.status,impact:clone(entry.impact),
   review:entry.review?clone(entry.review):null,
   branch_available:entry.branch!==null,active_workspace_unchanged:true};
 }
 function history(actorId,facilityId){
  const actor=principal(actorId,lookupPrincipal),{payload}=read();
  if(!scope(actor,payload.workspace.master.find(m=>m.id===facilityId)))throw Error("ACCESS_DENIED");
  return db.prepare("SELECT revision,actor_role,action,outcome,recorded_at,correction_id FROM workspace_events WHERE facility_id=? ORDER BY revision DESC LIMIT 200").all(facilityId);
 }
 function execute(actorId,raw){
  const actor=principal(actorId,lookupPrincipal),cmd=normalize(raw),serialized=JSON.stringify(cmd);
  return transaction(db,()=>{
   const {revision,payload}=read();
   const w=payload.workspace,facility=w.master.find(m=>m.id===cmd.facility_id);
   requireAction(actor,facility,cmd.action);
   const previous=db.prepare("SELECT actor_id,command_json,response_json FROM workspace_commands WHERE request_id=?").get(cmd.request_id);
   if(previous){
    if(previous.actor_id!==actor.id||previous.command_json!==serialized)throw Error("REQUEST_ID_CONFLICT");
    return {...JSON.parse(previous.response_json),replayed:true};
   }
   if(cmd.expected_revision!==revision)throw Error("REVISION_CONFLICT");
   const next=clone(payload);
   next.reconciliations??=[];
   let outcome="tercatat_demo",correctionId=null;
   if(cmd.action==="advance"){
    if(next.corrections.some(c=>c.facility_id===facility.id&&["menunggu_telaah","tercatat_untuk_sinkron","terblokir_rekonsiliasi","cabang_draf_menunggu_telaah","cabang_draf_tercatat"].includes(c.status)))throw Error("CORRECTION_PENDING");
    next.workspace=advanceDemo(w,facility.id,cmd.data.stage);
   }else if(cmd.action==="request_correction"){
    correctionId=cmd.data.correction_id;
    if(next.corrections.some(c=>c.id===correctionId))throw Error("CORRECTION_ID_CONFLICT");
    if(next.corrections.some(c=>c.facility_id===facility.id&&["menunggu_telaah","tercatat_untuk_sinkron","terblokir_rekonsiliasi","cabang_draf_menunggu_telaah","cabang_draf_tercatat"].includes(c.status)))
     throw Error("CORRECTION_ALREADY_OPEN");
    next.corrections.push({id:correctionId,facility_id:facility.id,requester:actor.id,
     reason:cmd.data.reason,base_source_revision:sourceRevision(next.source_versions[facility.id]),
     status:"menunggu_telaah",reviewer:null,review_reason:null,outcome:null});
    outcome="menunggu_telaah";
   }else{
    correctionId=cmd.data.correction_id;
    const c=next.corrections.find(c=>c.id===correctionId&&c.facility_id===facility.id);
    if(!c)throw Error("CORRECTION_NOT_FOUND");
    if(cmd.action==="review_correction"){
     if(c.requester===actor.id||c.status!=="menunggu_telaah")throw Error("CORRECTION_REVIEW_DENIED");
     c.status=cmd.data.decision==="catat_untuk_sinkron"?"tercatat_untuk_sinkron":"dikembalikan";
     c.reviewer=actor.id;c.review_reason=cmd.data.reason;outcome=c.status;
    }else if(cmd.action==="sync_source"){
     if(c.status!=="tercatat_untuk_sinkron"||c.reviewer===actor.id)throw Error("SOURCE_SYNC_NOT_REVIEWED");
     const current=sourceRevision(next.source_versions[facility.id]);
     if(current!==c.base_source_revision)throw Error("SOURCE_REVISION_CONFLICT");
     const result=candidateSync(w,facility,current,readSource(facility.id,current));
     next.workspace=result.workspace;next.source_versions[facility.id]=result.revision;
     c.status=result.outcome;c.outcome=result.outcome;outcome=result.outcome;
    }else if(cmd.action==="prepare_reconciliation"){
     if(c.status!=="terblokir_rekonsiliasi"||c.reviewer===actor.id)
      throw Error("RECONCILIATION_NOT_BLOCKED");
     if(next.reconciliations.some(x=>x.correction_id===c.id))throw Error("RECONCILIATION_ALREADY_PREPARED");
     const current=sourceRevision(next.source_versions[facility.id]);
     if(current!==c.base_source_revision)throw Error("SOURCE_REVISION_CONFLICT");
     const result=buildReconciliationBranch(w,facility,current,readSource(facility.id,current));
     if(!result.impact.source_changed||result.impact.changed_need_ids.length===0)
      throw Error("RECONCILIATION_NO_SOURCE_DIFFERENCE");
     next.reconciliations.push({correction_id:c.id,facility_id:facility.id,
      preparer:actor.id,source_revision:result.impact.candidate_source_revision,
      base_workspace_revision:revision,impact:result.impact,
      branch:result.branch,reason:result.reason,review:null});
     c.status="cabang_draf_menunggu_telaah";c.outcome=c.status;outcome=c.status;
    }else if(cmd.action==="review_reconciliation"){
     const entry=next.reconciliations.find(x=>x.correction_id===c.id&&x.facility_id===facility.id);
     if(!entry||c.status!=="cabang_draf_menunggu_telaah"||
       c.requester===actor.id||entry.preparer===actor.id)
      throw Error("RECONCILIATION_REVIEW_DENIED");
     if(cmd.data.disposition==="catat_cabang_draf"&&!entry.branch)
      throw Error("RECONCILIATION_BRANCH_UNAVAILABLE");
     entry.review={reviewer:actor.id,disposition:cmd.data.disposition,
      reason:cmd.data.reason};
     c.status=cmd.data.disposition==="catat_cabang_draf"?
      "cabang_draf_tercatat":"dikembalikan";
     c.outcome=c.status;outcome=c.status;
    }
   }
   models(next.workspace);
   const rev=version(revision+1),t=timestamp(),encoded=JSON.stringify(next);
   const response={revision:rev,synthetic:true,outcome,correction_id:correctionId,replayed:false};
   const updated=db.prepare("UPDATE workspace_current SET revision=?,payload=? WHERE id=1 AND revision=?").run(rev,encoded,revision);
   if(updated.changes!==1)throw Error("REVISION_CONFLICT");
   db.prepare("INSERT INTO workspace_versions(revision,payload,recorded_at) VALUES(?,?,?)").run(rev,encoded,t);
   db.prepare("INSERT INTO workspace_events(revision,actor_id,actor_role,facility_id,action,outcome,recorded_at,correction_id) VALUES(?,?,?,?,?,?,?,?)")
    .run(rev,actor.id,actor.role,facility.id,cmd.action,outcome,t,correctionId);
   db.prepare("INSERT INTO workspace_commands(request_id,actor_id,command_json,revision,response_json) VALUES(?,?,?,?,?)")
    .run(cmd.request_id,actor.id,serialized,rev,JSON.stringify(response));
   return response;
  });
 }
 return Object.freeze({initialize,view,reconciliation,history,execute});
}
