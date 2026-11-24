/** CODE_ONLY | Exact command shapes for annual profile, inventory and personnel. */
const require=(x,msg)=>{if(!x)throw Error(msg);};
export function annualCommand(r,action,payload,command_id,reason_code=null){
 require(r.candidate_actions?.includes(action),"ACTION_UNAVAILABLE");
 return {command_id,record_id:r.record_id,expected_revision:r.revision,action,payload,reason_code};
}
export function observation(item,status,total,usable,condition){
 require(["AVAILABLE","ABSENT","UNKNOWN","CONTEXT_REVIEW"].includes(status),"STATUS_INVALID");
 require(status!=="CONTEXT_REVIEW"||item.group==="A5","CONTEXT_DENIED");
 if(status==="AVAILABLE"&&item.kind==="stock"){
  require(["ADEQUATE_REPORTED","LIMITED_REPORTED","UNUSABLE_REPORTED","NOT_ASSESSED"].includes(condition),"CONDITION_INVALID");
  return {status,total:null,usable:null,condition};
 }
 if(status==="AVAILABLE"){
  require(Number.isFinite(total)&&Number.isFinite(usable)&&total>0&&total<=1000000&&usable>=0&&usable<=total&&(item.kind==="area"||Number.isInteger(total)&&Number.isInteger(usable)),"QUANTITY_INVALID");
  return {status,total,usable,condition:null};
 }
 if(status==="ABSENT"&&item.kind!=="stock")return {status,total:0,usable:0,condition:null};
 return {status,total:null,usable:null,condition:null};
}
export function profilePayload(section,values){
 const {observed_on,status}=values;
 require(/^20(?:26|27|28|29|30)-\d{2}-\d{2}$/.test(observed_on),"DATE_INVALID");
 if(section==="legalitas")return {observed_on,status,document_type:status==="REFERENCE_RECORDED_DEMO"?values.document_type:null,reference:status==="REFERENCE_RECORDED_DEMO"?values.reference:null,issued_on:status==="REFERENCE_RECORDED_DEMO"?values.issued_on:null,valid_until:status==="REFERENCE_RECORDED_DEMO"?(values.valid_until||null):null};
 if(section==="wilayah_kerja")return {observed_on,status,coverage_refs:status==="AVAILABLE_REPORTED"?values.coverage_refs.split(/[\n,]+/).map(x=>x.trim()).filter(Boolean):[]};
 return {observed_on,status};
}
export function staffCommand(row,action,payload,command_id){
 require(row.candidate_actions?.includes(action),"ACTION_UNAVAILABLE");
 return {command_id,staff_id:row.staff_id,expected_revision:row.revision,action,payload};
}
export function groupProgress(items,rows,group){
 const list=items.filter(i=>i.group===group);
 return {total:list.length,confirmed:list.filter(i=>rows[i.id]?.confirmed===true).length,copied:list.filter(i=>rows[i.id]?.confirmed===false).length};
}
