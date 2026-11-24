/** K4-A8 CODE_ONLY. Transport injected by host; no fetch, storage, login or network.
 * Rehearsal adapter only; existing portal remains unchanged.
 */
const fail=code=>{throw Error(code);};
export function createDraftClient(transport){
 if(typeof transport!=="function")fail("TRANSPORT_REQUIRED");
 const call=async(method,path,query,body)=>{
  const r=await transport({method,path,query,body});
  if(!r||r.synthetic!==true||r.official_authorization!==false||r.http_registered!==false)fail("RESPONSE_INVALID");
  return r;
 };
 return {
  read:(path,query={})=>call("GET",path,query,null),
  command:(path,body)=>call("POST",path,{},body)
 };
}
export function queueDraft(command){
 if(!command||typeof command.command_id!=="string"||!/^DEMO-COMMAND-[A-Z0-9_-]{1,40}$/.test(command.command_id)||command.action!=="save_draft"||!Number.isInteger(command.expected_revision))fail("QUEUE_INVALID");
 return {command:structuredClone(command),status:"PENDING",receipt:null,error:null};
}
export async function sendQueued(client,entry){
 if(entry.status==="ACK_DEMO")return entry;
 if(entry.status!=="PENDING")fail("REVIEW_CONFLICT_FIRST");
 let r;
 try{r=await client.command("/api/v1/apel/commands",structuredClone(entry.command));}
 catch{return {...entry,status:"PENDING",error:"ACK_UNKNOWN_RETRY_SAME_COMMAND"};}
 if(r.status===200&&r.data?.record_id===entry.command.record_id&&r.data?.revision===entry.command.expected_revision+1)
  return {...entry,status:"ACK_DEMO",receipt:r.data,error:null};
 if(r.status===409)return {...entry,status:"CONFLICT",error:r.error};
 if(r.status>=500)return {...entry,status:"PENDING",error:"ACK_UNKNOWN_RETRY_SAME_COMMAND"};
 return {...entry,status:"REVIEW_REQUIRED",error:r.error??"RECEIPT_INVALID"};
}
// No rebase from unseen remote revision. User reviews latest record and constructs
// a fresh command ID/payload explicitly; never silently resubmit conflicting data.
