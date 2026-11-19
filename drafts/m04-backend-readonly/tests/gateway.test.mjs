/** M04-I6B | 15 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {openI6BReadonlyGateway} from "../inventory.mjs";
import {MASTER} from "../../m04-integrated-workspace/fixtures.mjs";
import {PARTITION_SCHEMA} from "../../m04-generation-partition/partition.mjs";
import {EMPTY_TARGET_SCHEMA} from "../../m04-migration-preflight/preflight.mjs";
const [A,B,C]=MASTER;
const user=(role,extras={})=>({id:"DEMO-USER-TEST",active:true,role,...extras});
function setup(session=user("provinsi_admin"),options={}) {
 const data=options.data??[];
 let opened=0;
 const statements=[];
 const rowCounts=options.counts??{
  current_rows:data.length,version_rows:data.length,event_rows:0,command_rows:0};
 const countSQL={
  facility_current:"current_rows",facility_versions:"version_rows",
  facility_events:"event_rows",facility_commands:"command_rows"
 };
 const withConsistentRead=fn=>{
  opened++;
  const reader={prepare:sql=>{
   statements.push(sql);
   const count=Object.keys(countSQL).find(name=>
    sql===("SELECT COUNT(*) AS n FROM "+name));
   return {
    get:(...args)=>{
     if(count)return {n:rowCounts[countSQL[count]]};
     if(sql==="SELECT revision,payload FROM facility_current WHERE facility_id=?"){
      const r=data.find(x=>x.facility_id===args[0]);
      return r?{revision:r.revision,payload:JSON.stringify(r.payload)}:undefined;
     }
     throw Error("UNKNOWN_GET");
    },
    all:()=>{
     if(sql==="SELECT facility_id FROM facility_current ORDER BY facility_id")
      return data.map(x=>({facility_id:x.facility_id})).sort((a,b)=>
       a.facility_id.localeCompare(b.facility_id));
     throw Error("UNKNOWN_ALL");
    }
   };
  }};
  return fn(reader);
 };
 let who=session;
 const api=openI6BReadonlyGateway({
  resolveServerSession:()=>who,withConsistentRead});
 return {api,statements,get opened(){return opened;},setUser:v=>{who=v;}};
}
const facility=(m,revision=0)=>({facility_id:m.id,revision,
 payload:{schema:PARTITION_SCHEMA,synthetic:true,facility_id:m.id,
  workspace:{master:[m]},official_authorization:false}});
test("I6B admin sees empty inventory matching I6A contract",()=>{
 const t=setup(),r=t.api.globalTargetInventory();
 assert.equal(r.inventory.schema,EMPTY_TARGET_SCHEMA);
 assert.deepEqual(r.inventory.facility_ids,[]);
 assert.equal(r.mode,"READ_ONLY");assert.equal(r.may_write,false);
 assert.equal(r.target_frozen,false);assert.equal(r.source_verified,false);
});
test("I6B admin sees only ID and table counts, not snapshot content",()=>{
 const t=setup(user("provinsi_admin"),{data:[facility(A),facility(B)]});
 const result=t.api.globalTargetInventory();
 assert.equal(result.inventory.current_rows,2);
 assert.deepEqual(result.inventory.facility_ids,[A.id,B.id]);
 assert.ok(!JSON.stringify(result).includes(A.name));
});
test("I6B no DML/PRAGMA/transaction statements emitted",()=>{
 const t=setup(user("provinsi_admin"),{data:[facility(A)]});
 t.api.globalTargetInventory();t.api.scopedFacilitySummary(A.id);
 assert.ok(t.statements.every(sql=>/^SELECT /.test(sql)));
});
test("I6B rejects absent session before touching database",()=>{
 const t=setup(null);
 assert.throws(()=>t.api.globalTargetInventory(),/ACCESS_DENIED/);
 assert.equal(t.opened,0);
});
test("I6B rejects disabled account and unknown role",()=>{
 for(const s of [user("provinsi_admin",{active:false}),user("root")]){
  const t=setup(s);
  assert.throws(()=>t.api.globalTargetInventory(),/ACCESS_DENIED/);
  assert.equal(t.opened,0);
 }
});
test("I6B denies global inventory for puskeswan, kab/kota, verifier and leadership",()=>{
 for(const s of [user("puskeswan",{puskeswan_id:A.id,region:A.region}),
  user("kab_kota",{region:A.region}),user("provinsi_verifikator"),
  user("pimpinan")]){
  const t=setup(s);assert.throws(()=>t.api.globalTargetInventory(),/ACCESS_DENIED/);
  assert.equal(t.opened,0);
 }
});
test("I6B local facility readable by matching Puskeswan",()=>{
 const t=setup(user("puskeswan",{puskeswan_id:A.id,region:A.region}),
  {data:[facility(A),facility(B)]});
 const r=t.api.scopedFacilitySummary(A.id);
 assert.equal(r.facility_id,A.id);assert.equal(r.revision,0);
 assert.ok(!Object.hasOwn(r,"payload"));
});
test("I6B Puskeswan cannot read other facility, including same-region C",()=>{
 const t=setup(user("puskeswan",{puskeswan_id:A.id,region:A.region}),
  {data:[facility(A),facility(B),facility(C)]});
 assert.throws(()=>t.api.scopedFacilitySummary(C.id),/ACCESS_DENIED/);
});
test("I6B kab/kota can read same region but not another",()=>{
 const t=setup(user("kab_kota",{region:A.region}),
  {data:[facility(A),facility(B),facility(C)]});
 assert.equal(t.api.scopedFacilitySummary(C.id).facility_id,C.id);
 assert.throws(()=>t.api.scopedFacilitySummary(B.id),/ACCESS_DENIED/);
});
test("I6B pimpinan cannot read facility detail",()=>{
 const t=setup(user("pimpinan"),{data:[facility(A)]});
 assert.throws(()=>t.api.scopedFacilitySummary(A.id),/ACCESS_DENIED/);
 assert.equal(t.opened,0);
});
test("I6B requester cannot supply forged role through facility selector",()=>{
 const t=setup(user("puskeswan",{puskeswan_id:A.id,region:A.region}),
  {data:[facility(A)]});
 assert.throws(()=>t.api.scopedFacilitySummary({id:A.id,role:"provinsi_admin"}),/ACCESS_DENIED/);
});
test("I6B new backend session evaluated on every call, not cached",()=>{
 const t=setup(user("provinsi_admin"),{data:[facility(A)]});
 t.api.globalTargetInventory();
 t.setUser(user("puskeswan",{puskeswan_id:A.id,region:A.region}));
 assert.throws(()=>t.api.globalTargetInventory(),/ACCESS_DENIED/);
});
test("I6B inconsistent row counts or duplicate IDs fail closed",()=>{
 const t=setup(user("provinsi_admin"),{
  data:[facility(A)],counts:{current_rows:2,version_rows:1,event_rows:0,command_rows:0}});
 assert.throws(()=>t.api.globalTargetInventory(),/INVENTORY_ROW_MISMATCH/);
 const u=setup(user("provinsi_admin"),{data:[facility(A),facility(A)]});
 assert.throws(()=>u.api.globalTargetInventory(),/INVENTORY_FACILITY_IDS_INVALID/);
});
test("I6B missing tables, malicious counters and malformed payload are rejected",()=>{
 const t=setup(user("provinsi_admin"),{
  counts:{current_rows:0,version_rows:-1,event_rows:0,command_rows:0}});
 assert.throws(()=>t.api.globalTargetInventory(),/INVENTORY_COUNT_INVALID/);
 const u=setup(user("provinsi_admin"),{data:[
  {...facility(A),payload:{schema:"OTHER",workspace:{master:[A]}}}]});
 assert.throws(()=>u.api.scopedFacilitySummary(A.id),/FACILITY_PAYLOAD_INVALID/);
});
test("I6B missing trusted adapters and invalid no-snapshot return fail closed",()=>{
 assert.throws(()=>openI6BReadonlyGateway({}),/TRUSTED_ADAPTERS_REQUIRED/);
 const api=openI6BReadonlyGateway({
  resolveServerSession:()=>user("provinsi_admin"),withConsistentRead:()=>undefined});
 assert.throws(()=>api.globalTargetInventory(),/SNAPSHOT_MUST_BE_SYNCHRONOUS/);
});
