/** M04-I5 | 12 cases written, NOT EXECUTED, CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {partitionI4Snapshot} from "../partition.mjs";
import {generationId,beginGeneration,advanceGeneration,STAGES} from "../generation.mjs";
import {archivedI4Fixture,newerVerifiedNeed,A,B,C} from "../fixtures.mjs";
import {bridgeSources,bindPackageSources} from "../../m04-integrated-workspace/bridge.mjs";
import {startWorkspace} from "../../m04-integrated-workspace/workspace.mjs";
import {replaceDraft} from "../../m04-support-package-planning/planning.mjs";
import {demoState,MASTER} from "../../m04-integrated-workspace/fixtures.mjs";
function partitions(){const f=archivedI4Fixture();return partitionI4Snapshot(f.payload,f.sourceRevision);}
test("I5 projects 3 facilities from I4, with separate archives",()=>{
 const parts=partitions();
 assert.equal(parts.length,3);
 assert.equal(parts.find(x=>x.facility_id===A.id).archives.length,1);
 assert.equal(parts.find(x=>x.facility_id===B.id).archives.length,0);
 assert.equal(parts.find(x=>x.facility_id===C.id).workspace.states.length,0);
});
test("I5 old package ID is retired and generation 2 ID is different",()=>{
 const p=partitions().find(x=>x.facility_id===A.id);
 assert.ok(p.retired_ids.includes("DEMO-PKG-001"));
 assert.equal(generationId(A.id,2,"paket"),"DEMO-PKG-001-G0002");
 assert.ok(!p.retired_ids.includes(generationId(A.id,2,"paket")));
});
test("I5 rejects no archive and source not yet reverified",()=>{
 const parts=partitions();
 assert.throws(()=>beginGeneration(parts.find(x=>x.facility_id===B.id)),/I4_ARCHIVE_REQUIRED/);
 assert.throws(()=>beginGeneration(parts.find(x=>x.facility_id===A.id)),/REVERIFIED_M03_NEED_REQUIRED/);
});
test("I5 rejects invalid generation number, facility and stage",()=>{
 for(const n of [1,0,10000,1.5,"2"])
  assert.throws(()=>generationId(A.id,n,"paket"));
 assert.throws(()=>generationId("DEMO-PSW-FOREIGN",2,"no_stage"));
 assert.throws(()=>generationId("UNKNOWN",2,"paket"));
});
test("I5 rejects duplicate retirement registry or forged authorization",()=>{
 const {payload,sourceRevision}=archivedI4Fixture();
 assert.throws(()=>partitionI4Snapshot({...payload,
  retired_workflow_ids:[...payload.retired_workflow_ids,"DEMO-PKG-FOREIGN"]},sourceRevision));
 const part=partitions()[0];
 assert.throws(()=>beginGeneration({...part,retired_ids:[...part.retired_ids,part.retired_ids[0]]}));
});
test("I5 source state cannot cross facility in projection",()=>{
 const {payload,sourceRevision}=archivedI4Fixture();
 const states=payload.workspace.states.map(x=>x.facility.id===A.id?
  {...x,facility:{...x.facility,region:B.region}}:x);
 assert.throws(()=>partitionI4Snapshot({...payload,workspace:{...payload.workspace,states}},sourceRevision));
});
test("I5 mixed-facility package cannot be silently split",()=>{
 const a=demoState(A),b=demoState(B);
 const workspace=startWorkspace(MASTER,[a,b]);
 const br=bridgeSources(workspace.master,workspace.states);
 const pkg=replaceDraft(br.needs,[],{id:"DEMO-PKG-MIXED",
  title:"Paket dua fasilitas DEMO",
  purpose:"Verifikasi penolakan pemisahan paket lintas Puskeswan.",
  lines:br.needs.map(n=>({need_id:n.need_id,source_version:n.source_version,quantity:1}))});
 const mix={...workspace,packages:pkg,bindings:bindPackageSources(br,pkg)};
 const x={workspace:mix,source_versions:{[A.id]:1,[B.id]:1,[C.id]:0},
  archived_workflows:[],retired_workflow_ids:[],corrections:[],reconciliations:[]};
 assert.throws(()=>partitionI4Snapshot(x,0),/CROSS_FACILITY_PACKAGE/);
});
test("I5 updated verified source permits new generation without reusing archived ID",()=>{
 const f=archivedI4Fixture(),p=partitions()[0];
 const next={...p,workspace:{...p.workspace,states:[newerVerifiedNeed(f.source)]},source_revision:3};
 const started=beginGeneration(next);
 assert.equal(started.generation.active,2);
 const made=advanceGeneration(started,"paket");
 assert.equal(made.workspace.packages[0].id,"DEMO-PKG-001-G0002");
 assert.equal(made.workspace.packages[0].lines[0].need_id,"DEMO-NEED-001-N2");
});
test("I5 seven stage chain uses generation IDs consistently",()=>{
 const f=archivedI4Fixture(),p=partitions()[0];
 let x=beginGeneration({...p,workspace:{...p.workspace,states:[newerVerifiedNeed(f.source)]},
  source_revision:3});
 for(const stage of STAGES)x=advanceGeneration(x,stage);
 assert.equal(x.workspace.observations[0].id,"DEMO-MON-001-G0002");
 assert.equal(x.workspace.handovers[0].document_ref,"DEMO-BAST-001-G0002");
 assert.equal(x.workspace.receipts[0].good,1);
 assert.equal(x.workspace.reviews[0].official_approval,false);
});
test("I5 stage order and replay of last stage are rejected",()=>{
 const f=archivedI4Fixture(),p=partitions()[0];
 let x=beginGeneration({...p,workspace:{...p.workspace,states:[newerVerifiedNeed(f.source)]},
  source_revision:3});
 assert.throws(()=>advanceGeneration(x,"terima"),/GENERATION_STAGE_OUT_OF_ORDER/);
 for(const stage of STAGES)x=advanceGeneration(x,stage);
 assert.throws(()=>advanceGeneration(x,"monitor"),/GENERATION_ID_REUSED/);
 assert.throws(()=>beginGeneration(x),/GENERATION_ALREADY_ACTIVE/);
});
test("I5 invalid object and orphaned package binding fail closed",()=>{
 const f=archivedI4Fixture(),p=partitions()[0];
 assert.throws(()=>beginGeneration({...p,official_authorization:true,generation:{...p.generation,next:1}}));
 const bad={...p,workspace:{...p.workspace,bindings:[{
  package_id:"DEMO-PKG-GHOST",need_id:"DEMO-NEED-001-N1",
  snapshot:{facility:{id:A.id}}
 }]}};
 assert.throws(()=>beginGeneration(bad));
});
test("I5 I4 archive and original source remain unchanged after generation",()=>{
 const f=archivedI4Fixture(),before=JSON.stringify(f.payload);
 const p=partitions()[0];
 let x=beginGeneration({...p,workspace:{...p.workspace,states:[newerVerifiedNeed(f.source)]},
  source_revision:3});
 x=advanceGeneration(x,"paket");
 assert.equal(JSON.stringify(f.payload),before);
 assert.equal(x.archives[0].old_source.problems[0].version,
  f.oldWorkspace.states[0].problems[0].version);
});
