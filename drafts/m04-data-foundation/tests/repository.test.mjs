/** M04-I2 | 16 skenario tertulis, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {DatabaseSync} from "node:sqlite";
import {openRepository} from "../repository.mjs";
import {demoWorkspace,demoState,MASTER} from "../../m04-integrated-workspace/fixtures.mjs";
import {useRole} from "../../../prototypes/profil-puskeswan/model.mjs";
import {followUpProblem} from "../../../prototypes/profil-puskeswan/problems.mjs";
const A=MASTER[0],B=MASTER[1],C=MASTER[2],ADMIN="DEMO-USER-ADMIN",PET="DEMO-USER-PET",
 KAB="DEMO-USER-KAB",PROV="DEMO-USER-VER",LEAD="DEMO-USER-LEAD";
const COR="DEMO-KOREKSI-001";
const principals={
 [ADMIN]:{id:ADMIN,role:"provinsi_admin",active:true},
 [PET]:{id:PET,role:"puskeswan",active:true,puskeswan_id:A.id,region:A.region},
 [KAB]:{id:KAB,role:"kab_kota",active:true,region:A.region},
 [PROV]:{id:PROV,role:"provinsi_verifikator",active:true},
 [LEAD]:{id:LEAD,role:"pimpinan",active:true}
};
function setup(t){
 const db=new DatabaseSync(":memory:");t.after(()=>db.close());
 const source={revision:2,state:demoState(A)};
 const actors=JSON.parse(JSON.stringify(principals));
 const hooks={lookupPrincipal:id=>actors[id],readSource:()=>source,
  clock:()=>"2026-11-16T07:00:00.000Z"};
 const repo=openRepository(db,hooks);repo.initialize(demoWorkspace());
 return {db,repo,source,actors,hooks};
}
const command=(n,rev,action,data,facility_id=A.id)=>({
 request_id:"DEMO-REQ-"+n,expected_revision:rev,facility_id,action,data});
const advance=(n,rev,stage="paket",facility=A.id)=>command(n,rev,"advance",{stage},facility);
const request=(n,rev,correction_id=COR)=>command(n,rev,"request_correction",{correction_id,reason:"Catatan sumber contoh perlu koreksi."});
const review=(n,rev,decision="catat_untuk_sinkron")=>command(n,rev,"review_correction",
 {correction_id:COR,decision,reason:"Metadata koreksi contoh telah ditelaah."});
const sync=(n,rev)=>command(n,rev,"sync_source",{correction_id:COR});
const read=(r)=>r.view(ADMIN,"2026-10",A.id);
function prepare(r,rev=0){
 r.execute(PET,request("C1",rev));r.execute(PROV,review("C2",rev+1));
}
test("initialize once and reopen on same database without losing state",t=>{
 const {repo,db,hooks}=setup(t);assert.equal(read(repo).revision,0);
 assert.throws(()=>repo.initialize(demoWorkspace()),/ALREADY/);
 repo.execute(ADMIN,advance("A1",0));
 const reopened=openRepository(db,hooks);
 assert.equal(read(reopened).revision,1);assert.equal(read(reopened).details.packages.length,1);
});
test("one successful change stores revision audit and command together",t=>{
 const {repo,db}=setup(t);const res=repo.execute(ADMIN,advance("A1",0));
 assert.equal(res.revision,1);assert.equal(repo.history(PET,A.id)[0].action,"advance");
 for(const [table,n] of [["workspace_versions",2],["workspace_events",1],["workspace_commands",1]])
  assert.equal(db.prepare("SELECT count(*) n FROM "+table).get().n,n);
});
test("same request retries idempotently after later revision",t=>{
 const {repo,db}=setup(t),cmd=advance("A1",0);
 repo.execute(ADMIN,cmd);repo.execute(ADMIN,advance("A2",1,"telaah"));
 const x=repo.execute(ADMIN,cmd);assert.equal(x.replayed,true);assert.equal(x.revision,1);
 assert.equal(read(repo).revision,2);assert.equal(db.prepare("SELECT count(*) n FROM workspace_commands").get().n,2);
});
test("different command with reused request id is rejected",t=>{
 const {repo}=setup(t);repo.execute(ADMIN,advance("A1",0));
 assert.throws(()=>repo.execute(ADMIN,advance("A1",1,"telaah")),/REQUEST_ID_CONFLICT/);
});
test("optimistic revision rejects stale writer without consuming key",t=>{
 const {repo}=setup(t);repo.execute(ADMIN,advance("A1",0));
 assert.throws(()=>repo.execute(ADMIN,advance("A2",0,"telaah")),/REVISION_CONFLICT/);
 assert.equal(repo.execute(ADMIN,advance("A2",1,"telaah")).revision,2);
});
test("scope and identity lookup deny foreign, inactive and unknown actors",t=>{
 const {repo,actors}=setup(t);
 assert.throws(()=>repo.view(PET,"2026-10",B.id),/ACCESS_DENIED/);
 assert.throws(()=>repo.history(KAB,B.id),/ACCESS_DENIED/);
 assert.throws(()=>repo.execute(PET,advance("A1",0)),/ACCESS_DENIED/);
 actors[ADMIN].active=false;assert.throws(()=>repo.view(ADMIN,"2026-10",A.id),/ACCESS_DENIED/);
 assert.throws(()=>repo.view("DEMO-USER-UNKNOWN","2026-10"),/ACCESS_DENIED/);
});
test("pimpinan receives aggregate only and no facility history",t=>{
 const {repo}=setup(t);const v=repo.view(LEAD,"2026-10");
 assert.equal(v.details,null);assert.equal(Object.hasOwn(v,"revision"),false);
 assert.equal(Object.hasOwn(v,"corrections"),false);assert.throws(()=>repo.history(LEAD,A.id));
});
test("reject forged client role or source payload",t=>{
 const {repo}=setup(t);
 assert.throws(()=>repo.execute(ADMIN,{...advance("A1",0),role:"provinsi_admin"}),/INVALID_COMMAND/);
 assert.throws(()=>repo.execute(ADMIN,{...sync("C3",0),data:{correction_id:COR,state:{}}}),/INVALID_COMMAND/);
});
test("correction requires separate reviewer and blocks workflow while open",t=>{
 const {repo}=setup(t);repo.execute(KAB,request("C1",0));
 assert.throws(()=>repo.execute(KAB,review("C2",1)),/CORRECTION_REVIEW_DENIED/);
 assert.throws(()=>repo.execute(ADMIN,advance("A1",1)),/CORRECTION_PENDING/);
 assert.throws(()=>repo.execute(PET,request("C4",1,"DEMO-KOREKSI-002")),/ALREADY_OPEN/);
 assert.equal(repo.execute(PROV,review("C2",1)).outcome,"tercatat_untuk_sinkron");
});
test("review return does not apply source nor block new correction",t=>{
 const {repo}=setup(t);repo.execute(PET,request("C1",0));
 repo.execute(PROV,review("C2",1,"kembalikan"));
 assert.throws(()=>repo.execute(ADMIN,sync("C3",2)),/NOT_REVIEWED/);
 assert.equal(repo.execute(PET,request("C4",2,"DEMO-KOREKSI-002")).revision,3);
});
test("reviewed newer trusted profile snapshot syncs with version and history",t=>{
 const {repo,source}=setup(t);prepare(repo);
 source.state.sections.bangunan={value:"Kondisi bangunan fiktif diperbarui.",verified:false,date:"2026-11-16"};
 const res=repo.execute(ADMIN,sync("C3",2));
 assert.equal(res.outcome,"tersinkron_demo");assert.equal(read(repo).revision,3);
 assert.equal(read(repo).details.profile.find(x=>x.id==="bangunan").value,"Kondisi bangunan fiktif diperbarui.");
 assert.equal(read(repo).corrections[0].status,"tersinkron_demo");
});
test("reject older revision and same-version changed need without changing state",t=>{
 const {repo,source}=setup(t);prepare(repo);source.revision=1;
 assert.throws(()=>repo.execute(ADMIN,sync("C3",2)),/NOT_NEWER/);
 source.revision=2;source.state.supportNeeds[0].item="Peralatan fiktif berubah";
 assert.throws(()=>repo.execute(ADMIN,sync("C3",2)),/SAME_VERSION_CHANGED/);
 assert.equal(read(repo).revision,2);assert.equal(read(repo).corrections[0].status,"tercatat_untuk_sinkron");
});
test("linked package change records blocked reconciliation and preserves old source",t=>{
 const {repo,source}=setup(t);repo.execute(ADMIN,advance("A1",0));prepare(repo,1);
 source.state=followUpProblem(useRole(source.state,"verifikator_kab"),1,"ditindaklanjuti","Tindak lanjut fiktif.");
 const result=repo.execute(ADMIN,sync("C3",3));
 assert.equal(result.outcome,"terblokir_rekonsiliasi");
 assert.equal(read(repo).details.packages.length,1);
 assert.equal(read(repo).corrections[0].status,"terblokir_rekonsiliasi");
 assert.throws(()=>repo.execute(ADMIN,advance("A2",4,"telaah")),/CORRECTION_PENDING/);
});
test("source cannot silently erase historical rows or switch facility",t=>{
 const {repo,source}=setup(t);prepare(repo);source.state=demoState(B);
 assert.throws(()=>repo.execute(ADMIN,sync("C3",2)),/SCOPE_MISMATCH/);
 source.state=demoState(A);source.state.supportNeeds=[];
 assert.throws(()=>repo.execute(ADMIN,sync("C3",2)),/HISTORY_REMOVAL/);
 assert.equal(read(repo).revision,2);
});
test("SQL rollback preserves state if audit write fails; retry works",t=>{
 const {repo,db}=setup(t);
 db.exec("CREATE TRIGGER fail_event BEFORE INSERT ON workspace_events BEGIN SELECT RAISE(ABORT,'forced failure'); END");
 assert.throws(()=>repo.execute(ADMIN,advance("A1",0)),/forced failure/);
 assert.equal(read(repo).revision,0);assert.equal(read(repo).details.packages.length,0);
 assert.equal(db.prepare("SELECT count(*) n FROM workspace_versions").get().n,1);
 assert.equal(db.prepare("SELECT count(*) n FROM workspace_commands").get().n,0);
 db.exec("DROP TRIGGER fail_event");assert.equal(repo.execute(ADMIN,advance("A1",0)).revision,1);
});
test("normal SQL edits to immutable history are rejected",t=>{
 const {repo,db}=setup(t);repo.execute(ADMIN,advance("A1",0));
 assert.throws(()=>db.exec("UPDATE workspace_events SET outcome='changed'"),/append-only/);
 assert.throws(()=>db.exec("DELETE FROM workspace_versions WHERE revision=0"),/append-only/);
 assert.throws(()=>db.exec("DELETE FROM workspace_commands"),/append-only/);
 assert.equal(read(repo).revision,1);
});
