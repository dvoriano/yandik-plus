/**
 * M04-I5 | KODE DITULIS, BELUM DIUJI.
 * DEMO-only per-facility store. All identity and source callbacks must come
 * from a trusted server host. No HTTP, direct client calls or live SQLite here.
 */
import {FACILITY_SQL} from "./schema.mjs";
import {partitionI4Snapshot,PARTITION_SCHEMA} from "./partition.mjs";
import {validateGenerationData,beginGeneration,advanceGeneration,STAGES} from "./generation.mjs";
import {principal,scope} from "../m04-data-foundation/policy.mjs";
import {candidateSync,sourceRevision} from "../m04-data-foundation/source.mjs";

export const REPOSITORY_SCHEMA="M04-I5-PARTITION-REPOSITORY-UNTESTED-1";
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const REQ=/^DEMO-I5-REQ-[A-Z0-9_-]{1,40}$/;
const REV=/^DEMO-I5-REV-[A-Z0-9_-]{1,40}$/;
const ACTIONS=["begin_generation","advance_generation","request_revision",
 "review_revision","sync_verified_source"];
const clone=x=>JSON.parse(JSON.stringify(x));
const fail=s=>{throw Error(s);};
function exact(v,keys,label){
 if(!v||typeof v!=="object"||Array.isArray(v)||Object.keys(v).length!==keys.length||
   keys.some(k=>!Object.hasOwn(v,k)))fail(label+"_INVALID_SHAPE");
}
function code(v,re,label){
 if(typeof v!=="string"||!re.test(v))fail(label+"_INVALID");
 return v;
}
function revision(v){
 if(!Number.isSafeInteger(v)||v<0)fail("REVISION_INVALID");
 return v;
}
function note(v){
 if(typeof v!=="string"||v.trim().length<10||v.trim().length>400)
  fail("REVISION_NOTE_INVALID");
 return v.trim();
}
function normalize(c){
 exact(c,["request_id","expected_revision","facility_id","action","data"],"COMMAND");
 if(!ACTIONS.includes(c.action))fail("ACTION_INVALID");
 let data;
 if(c.action==="begin_generation"){
  exact(c.data,[],"START_DATA");data={};
 }else if(c.action==="advance_generation"){
  exact(c.data,["stage"],"ADVANCE_DATA");
  if(!STAGES.includes(c.data.stage))fail("STAGE_INVALID");
  data={stage:c.data.stage};
 }else if(c.action==="request_revision"){
  exact(c.data,["revision_request_id","reason"],"REQUEST_DATA");
  data={revision_request_id:code(c.data.revision_request_id,REV,"REVISION_REQUEST"),
   reason:note(c.data.reason)};
 }else if(c.action==="review_revision"){
  exact(c.data,["revision_request_id","decision","reason"],"REVIEW_DATA");
  if(!["catat_untuk_sinkron","kembalikan_untuk_perbaikan"].includes(c.data.decision))
   fail("REVIEW_DECISION_INVALID");
  data={revision_request_id:code(c.data.revision_request_id,REV,"REVISION_REQUEST"),
   decision:c.data.decision,reason:note(c.data.reason)};
 }else{
  exact(c.data,["revision_request_id"],"SYNC_DATA");
  data={revision_request_id:code(c.data.revision_request_id,REV,"REVISION_REQUEST")};
 }
 return {request_id:code(c.request_id,REQ,"REQUEST_ID"),
  expected_revision:revision(c.expected_revision),
  facility_id:code(c.facility_id,FAC,"FACILITY"),action:c.action,data};
}
function allow(actor,facility,action){
 if(!scope(actor,facility))fail("ACCESS_DENIED");
 const roles={
  begin_generation:["provinsi_admin"],
  advance_generation:["provinsi_admin"],
  request_revision:["puskeswan","kab_kota","provinsi_admin"],
  review_revision:["kab_kota","provinsi_verifikator"],
  sync_verified_source:["provinsi_admin"]};
 if(!roles[action]?.includes(actor.role))fail("ACCESS_DENIED");
}
function transaction(db,fn){
 db.exec("BEGIN IMMEDIATE");
 try{const result=fn();db.exec("COMMIT");return result;}
 catch(e){db.exec("ROLLBACK");throw e;}
}
export function openFacilityRepository(db,{
 lookupPrincipal,readSource,clock=()=>new Date().toISOString()
}){
 if(typeof lookupPrincipal!=="function"||typeof readSource!=="function")
  fail("TRUSTED_ADAPTER_REQUIRED");
 db.exec("PRAGMA foreign_keys=ON; PRAGMA busy_timeout=3000; PRAGMA recursive_triggers=ON;");
 db.exec(FACILITY_SQL);
 const select=db.prepare("SELECT revision,payload FROM facility_current WHERE facility_id=?");
 function current(id){
  const row=select.get(id);
  if(!row)fail("FACILITY_NOT_INITIALIZED");
  const data=JSON.parse(row.payload);
  if(data.schema!==PARTITION_SCHEMA||data.facility_id!==id||
    data.official_authorization!==false)fail("PARTITION_PAYLOAD_INVALID");
  validateGenerationData(data);
  return {revision:row.revision,data};
 }
 function timestamp(){
  const t=clock();
  if(typeof t!=="string"||!Number.isFinite(Date.parse(t))||
    new Date(t).toISOString()!==t)fail("CLOCK_INVALID");
  return t;
 }
 function seedFromI4(source,sourceWorkspaceRevision){
  return transaction(db,()=>{
   if(db.prepare("SELECT COUNT(*) n FROM facility_current").get().n!==0)
    fail("PARTITION_ALREADY_INITIALIZED");
   const parts=partitionI4Snapshot(source,sourceWorkspaceRevision);
   if(parts.length===0)fail("EMPTY_PARTITION");
   const stamp=timestamp();
   const insCur=db.prepare(
    "INSERT INTO facility_current(facility_id,revision,payload) VALUES(?,0,?)");
   const insVer=db.prepare(
    "INSERT INTO facility_versions(facility_id,revision,payload,recorded_at) VALUES(?,0,?,?)");
   for(const part of parts){
    const s=JSON.stringify(part);
    insCur.run(part.facility_id,s);
    insVer.run(part.facility_id,s,stamp);
   }
   return {schema:REPOSITORY_SCHEMA,synthetic:true,facilities:parts.length,revision:0};
  });
 }
 function view(actorId,facilityId){
  const actor=principal(actorId,lookupPrincipal),id=code(facilityId,FAC,"FACILITY");
  const {revision:rev,data}=current(id),m=data.workspace.master[0];
  if(!scope(actor,m))fail("ACCESS_DENIED");
  return {schema:REPOSITORY_SCHEMA,synthetic:true,facility_id:id,
   facility_name:m.name,region:m.region,revision:rev,
   source_revision:data.source_revision,generation:clone(data.generation),
   archived_generations:data.archives.length,retired_ids_count:data.retired_ids.length,
   revision_requests:data.revision_requests.map(x=>({
    id:x.id,status:x.status,base_source_revision:x.base_source_revision,
    reviewer_role:x.reviewer_role??null
   })),official_approval:false};
 }
 function overview(actorId){
  const actor=principal(actorId,lookupPrincipal);
  const rows=db.prepare("SELECT payload FROM facility_current").all();
  const visible=rows.map(x=>JSON.parse(x.payload)).filter(p=>
   actor.role==="pimpinan"||scope(actor,p.workspace.master[0]));
  if(actor.role!=="pimpinan"&&!visible.length)fail("ACCESS_DENIED");
  return {schema:REPOSITORY_SCHEMA,synthetic:true,
   facilities:visible.length,
   pending_revisions:visible.filter(p=>p.revision_requests.some(r=>
    ["menunggu_telaah","tercatat_untuk_sinkron","terblokir_rekonsiliasi"]
     .includes(r.status))).length,
   archived_generations:visible.reduce((n,p)=>n+p.archives.length,0),
   active_generations:visible.filter(p=>p.generation.active!==null).length,
   official_approval:false};
 }
 function history(actorId,facilityId){
  const actor=principal(actorId,lookupPrincipal),id=code(facilityId,FAC,"FACILITY");
  const {data}=current(id);
  if(!scope(actor,data.workspace.master[0]))fail("ACCESS_DENIED");
  return db.prepare("SELECT revision,actor_role,action,outcome,recorded_at,revision_request_id FROM facility_events WHERE facility_id=? ORDER BY revision DESC LIMIT 200")
   .all(id);
 }
 function execute(actorId,raw){
  const actor=principal(actorId,lookupPrincipal),cmd=normalize(raw),
   encoded=JSON.stringify(cmd);
  return transaction(db,()=>{
   const {revision:oldRev,data}=current(cmd.facility_id);
   allow(actor,data.workspace.master[0],cmd.action);
   const previous=db.prepare(
    "SELECT actor_id,command_json,response_json FROM facility_commands WHERE facility_id=? AND request_id=?")
    .get(cmd.facility_id,cmd.request_id);
   if(previous){
    if(previous.actor_id!==actor.id||previous.command_json!==encoded)
     fail("REQUEST_ID_CONFLICT");
    return {...JSON.parse(previous.response_json),replayed:true};
   }
   if(cmd.expected_revision!==oldRev)fail("FACILITY_REVISION_CONFLICT");
   const next=clone(data);
   const pending=next.revision_requests.find(x=>
    ["menunggu_telaah","tercatat_untuk_sinkron","terblokir_rekonsiliasi"]
     .includes(x.status));
   let outcome="tercatat_demo",revisionRequest=null;
   if(cmd.action==="request_revision"){
    revisionRequest=cmd.data.revision_request_id;
    if(pending)fail("FACILITY_REVISION_PENDING");
    if(next.revision_requests.some(x=>x.id===revisionRequest))
     fail("REVISION_REQUEST_ID_REUSED");
    next.revision_requests.push({
     id:revisionRequest,status:"menunggu_telaah",requester:actor.id,
     reason:cmd.data.reason,base_source_revision:next.source_revision,
     reviewer:null,reviewer_role:null,review_reason:null,outcome:null});
    outcome="menunggu_telaah";
   }else if(cmd.action==="review_revision"){
    revisionRequest=cmd.data.revision_request_id;
    const item=next.revision_requests.find(x=>x.id===revisionRequest);
    if(!item||item.status!=="menunggu_telaah"||item.requester===actor.id)
     fail("REVISION_REVIEW_DENIED");
    item.reviewer=actor.id;item.reviewer_role=actor.role;
    item.review_reason=cmd.data.reason;
    item.status=cmd.data.decision==="catat_untuk_sinkron"?
     "tercatat_untuk_sinkron":"dikembalikan";
    outcome=item.status;
   }else if(cmd.action==="sync_verified_source"){
    revisionRequest=cmd.data.revision_request_id;
    const item=next.revision_requests.find(x=>x.id===revisionRequest);
    if(!item||item.status!=="tercatat_untuk_sinkron"||
     item.reviewer===actor.id||item.requester===actor.id)
     fail("SOURCE_SYNC_NOT_REVIEWED");
    if(item.base_source_revision!==next.source_revision)
     fail("SOURCE_REVISION_CONFLICT");
    if(next.generation.active!==null){
     item.status="terblokir_rekonsiliasi";outcome=item.status;
    }else{
     const packet=readSource(cmd.facility_id,next.source_revision);
     const result=candidateSync(next.workspace,next.workspace.master[0],
      next.source_revision,packet);
     if(result.outcome==="terblokir_rekonsiliasi"){
      item.status=result.outcome;outcome=item.status;
     }else{
      next.workspace=result.workspace;
      next.source_revision=sourceRevision(result.revision);
      item.status="tersinkron_demo";outcome=item.status;
     }
    }
    item.outcome=outcome;
   }else{
    if(pending)fail("FACILITY_REVISION_PENDING");
    if(cmd.action==="begin_generation"){
     next.generation=beginGeneration(next).generation;
     outcome="generasi_dibuka_demo";
    }else{
     const updated=advanceGeneration(next,cmd.data.stage);
     next.workspace=updated.workspace;next.generation=updated.generation;
     outcome="tahap_"+cmd.data.stage+"_demo_tercatat";
    }
   }
   validateGenerationData(next);
   const newRev=revision(oldRev+1),stamp=timestamp(),serialized=JSON.stringify(next);
   const response={schema:REPOSITORY_SCHEMA,synthetic:true,
    facility_id:cmd.facility_id,revision:newRev,outcome,
    revision_request_id:revisionRequest,replayed:false,official_approval:false};
   const updated=db.prepare(
    "UPDATE facility_current SET revision=?,payload=? WHERE facility_id=? AND revision=?")
    .run(newRev,serialized,cmd.facility_id,oldRev);
   if(updated.changes!==1)fail("FACILITY_REVISION_CONFLICT");
   db.prepare(
    "INSERT INTO facility_versions(facility_id,revision,payload,recorded_at) VALUES(?,?,?,?)")
    .run(cmd.facility_id,newRev,serialized,stamp);
   db.prepare(
    "INSERT INTO facility_events(facility_id,revision,actor_id,actor_role,action,outcome,recorded_at,revision_request_id) VALUES(?,?,?,?,?,?,?,?)")
    .run(cmd.facility_id,newRev,actor.id,actor.role,cmd.action,outcome,stamp,revisionRequest);
   db.prepare(
    "INSERT INTO facility_commands(facility_id,request_id,actor_id,command_json,revision,response_json) VALUES(?,?,?,?,?,?)")
    .run(cmd.facility_id,cmd.request_id,actor.id,encoded,newRev,JSON.stringify(response));
   return response;
  });
 }
 return Object.freeze({seedFromI4,view,overview,history,execute});
}
