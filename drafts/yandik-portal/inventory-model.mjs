/** Annual inventory, synthetic memory only, CODE_ONLY. */
import {CATALOG,CATALOG_VERSION} from "./inventory-catalog.mjs";
import {DEMO_FACILITIES} from "../m05-apel-dashboard-ui/fixtures.mjs";
export const YEARS=Object.freeze([2026,2027,2028,2029,2030]);
const fail=x=>{throw Error(x);},clone=structuredClone;
const key=s=>s.facility_id+"|"+s.year;
const index=new Map(CATALOG.map(x=>[x.id,x]));
const EMPTY=()=>({status:"DRAFT",revision:0,rows:{},history:[],copied_from:null});
function scope(s){if(!YEARS.includes(s.year)||!DEMO_FACILITIES.some(f=>f.facility_id===s.facility_id&&f.region_id===s.region_id))fail("SCOPE_DENIED");}
export function createInventory(){return {synthetic:true,catalog_version:CATALOG_VERSION,records:{}};}
function get(state,s){scope(s);if(state?.synthetic!==true||state.catalog_version!==CATALOG_VERSION)fail("INVALID_STATE");return state.records[key(s)]??EMPTY();}
function write(state,s,record,action,detail){const revision=record.revision+1;return {...state,records:{...state.records,[key(s)]:{...record,revision,history:[...record.history,{revision,action,...detail}]}}};}
function draft(state,s){const r=get(state,s);if(r.status!=="DRAFT"&&r.status!=="CORRECTION")fail("RECORD_LOCKED");return r;}
const number=(v,decimal=false)=>typeof v==="number"&&Number.isFinite(v)&&v>=0&&v<=1000000&&(decimal||Number.isInteger(v));
export function saveItem(state,s,id,input){
 const r=draft(state,s),item=index.get(id);if(!item)fail("ITEM_UNKNOWN");
 if(!input||!["AVAILABLE","ABSENT","UNKNOWN","CONTEXT_REVIEW"].includes(input.status))fail("STATUS_INVALID");
 const status=input.status;
 if(status==="CONTEXT_REVIEW"&&item.group!=="A5")fail("CONTEXT_NOT_ALLOWED");
 let total=null,usable=null,condition=null;
 if(status==="AVAILABLE"){
  if(item.kind==="stock"){
   if(!["ADEQUATE_REPORTED","LIMITED_REPORTED","UNUSABLE_REPORTED","NOT_ASSESSED"].includes(input.condition))fail("STOCK_CONDITION_INVALID");
   condition=input.condition;
  }else{
   if(!number(input.total,item.kind==="area")||input.total<=0||!number(input.usable,item.kind==="area")||input.usable>input.total)fail("QUANTITY_INVALID");
   total=input.total;usable=input.usable;
  }
 }else if(status==="ABSENT"&&item.kind!=="stock"){total=0;usable=0;}
 const row={status,total,usable,condition,confirmed:true,source_year:s.year};
 return write(state,s,{...r,rows:{...r.rows,[id]:row}},"SAVE",{item_id:id,before:clone(r.rows[id]??null),after:clone(row)});
}
export function copyPrior(state,s){
 const r=draft(state,s);if(r.revision!==0||Object.keys(r.rows).length)fail("TARGET_ALREADY_STARTED");
 const source=YEARS.filter(y=>y<s.year).reverse().find(y=>{
  const p=get(state,{...s,year:y});return Object.keys(p.rows).length>0;
 });
 if(source===undefined)fail("NO_PRIOR_DATA");
 const previous=get(state,{...s,year:source});
 const rows=Object.fromEntries(Object.entries(previous.rows).map(([id,v])=>[id,{...clone(v),confirmed:false,source_year:source}]));
 return write(state,s,{...r,rows,copied_from:{year:source,status:previous.status,revision:previous.revision}},"COPY_PRIOR",{year:source,source_status:previous.status});
}
export function confirmGroup(state,s,group){
 const r=draft(state,s);const ids=CATALOG.filter(i=>i.group===group&&r.rows[i.id]&&!r.rows[i.id].confirmed).map(i=>i.id);
 if(!ids.length)fail("NO_COPIED_ROWS");
 const rows={...r.rows};for(const id of ids)rows[id]={...rows[id],confirmed:true};
 return write(state,s,{...r,rows},"CONFIRM_GROUP",{item_ids:ids});
}
export function evaluate(item,row){
 if(!row||!row.confirmed)return "UNCONFIRMED";
 if(row.status==="UNKNOWN"||row.status==="CONTEXT_REVIEW")return "REVIEW";
 if(row.status==="ABSENT")return "ABSENT";
 if(item.kind==="stock")return row.condition==="ADEQUATE_REPORTED"?"AVAILABLE_REPORTED":row.condition==="NOT_ASSESSED"?"REVIEW":"STOCK_ATTENTION";
 if(item.minimum!==null)return row.usable>=item.minimum?"MINIMUM_REPORTED":"BELOW_MINIMUM";
 return row.usable===0?"UNUSABLE":row.usable<row.total?"PARTIAL_USABLE":"AVAILABLE_REPORTED";
}
export function readInventory(state,s){
 const r=get(state,s);const rows=CATALOG.map(item=>({...item,observation:clone(r.rows[item.id]??null),assessment:evaluate(item,r.rows[item.id])}));
 const confirmed=rows.filter(x=>x.observation?.confirmed).length;
 return {status:r.status,revision:r.revision,rows,confirmed,total:rows.length,copied_from:clone(r.copied_from),
 attention:rows.filter(x=>["ABSENT","BELOW_MINIMUM","UNUSABLE","PARTIAL_USABLE","STOCK_ATTENTION","REVIEW"].includes(x.assessment)).length,
 history:clone(r.history),official_authorization:false};
}
export function transition(state,s,action){
 const r=get(state,s);
 if(action==="submit"){
  if(!["DRAFT","CORRECTION"].includes(r.status)||readInventory(state,s).confirmed!==CATALOG.length)fail("CONFIRM_ALL_ITEMS_FIRST");
  return write(state,s,{...r,status:"SUBMITTED"},"SUBMIT",{});
 }
 if(action==="return"&&r.status==="SUBMITTED")return write(state,s,{...r,status:"CORRECTION"},"RETURN",{reason:"Telaah DEMO memerlukan pembaruan"});
 if(action==="record"&&r.status==="SUBMITTED")return write(state,s,{...r,status:"RECORDED_DEMO"},"RECORD_DEMO",{});
 if(action==="reopen"&&r.status==="RECORDED_DEMO")return write(state,s,{...r,status:"CORRECTION"},"REOPEN_DEMO",{});
 fail("TRANSITION_DENIED");
}
export function regionalInventory(state,year,region="ALL"){
 if(!YEARS.includes(year)||!(region==="ALL"||DEMO_FACILITIES.some(f=>f.region_id===region)))fail("SCOPE_DENIED");
 return DEMO_FACILITIES.filter(f=>region==="ALL"||f.region_id===region).map(f=>{
  const v=readInventory(state,{...f,year});
  return {...f,year,status:v.revision?v.status:"NOT_STARTED",confirmed:v.confirmed,total:v.total,attention:v.attention};
 });
}
