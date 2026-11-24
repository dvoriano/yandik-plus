/** M04-I5 | 13 scenarios written, NOT EXECUTED, CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {DatabaseSync} from "node:sqlite";
import {openFacilityRepository} from "../repository.mjs";
import {archivedI4Fixture,newerVerifiedNeed,A,B,C} from "../fixtures.mjs";
const ADMIN="DEMO-USER-ADMIN",PET="DEMO-USER-PET",KAB="DEMO-USER-KAB",
 VER="DEMO-USER-VER",LEAD="DEMO-USER-LEAD",ID="DEMO-I5-REV-001";
const accounts={
 [ADMIN]:{id:ADMIN,role:"provinsi_admin",active:true},
 [PET]:{id:PET,role:"puskeswan",puskeswan_id:A.id,region:A.region,active:true},
 [KAB]:{id:KAB,role:"kab_kota",region:A.region,active:true},
 [VER]:{id:VER,role:"provinsi_verifikator",active:true},
 [LEAD]:{id:LEAD,role:"pimpinan",active:true}
};
function setup(t){
 const db=new DatabaseSync(":memory:");t.after(()=>db.close());
 const f=archivedI4Fixture(),source={revision:3,state:newerVerifiedNeed(f.source)};
 const repo=openFacilityRepository(db,{
  lookupPrincipal:id=>accounts[id],readSource:()=>source,
  clock:()=>"2026-11-19T10:00:00.000Z"});
 repo.seedFromI4(f.payload,f.sourceRevision);
 return {repo,db,source};
}
const cmd=(id,rev,action,data,facility=A.id)=>({
 request_id:"DEMO-I5-REQ-"+id,expected_revision:rev,
 facility_id:facility,action,data});
const request=(rev,facility=A.id)=>cmd("C1",rev,"request_revision",{
 revision_request_id:ID,reason:"Permohonan pembaruan data kebutuhan fiktif."},facility);
const review=rev=>cmd("C2",rev,"review_revision",{
 revision_request_id:ID,decision:"catat_untuk_sinkron",
 reason:"Pemeriksaan metadata revisi sumber fiktif."});
const sync=rev=>cmd("C3",rev,"sync_verified_source",{revision_request_id:ID});
function revise(r){
 r.execute(PET,request(0));
 r.execute(VER,review(1));
 r.execute(ADMIN,sync(2));
}
test("I5 baseline separate facility rows start at revision 0",t=>{
 const {repo}=setup(t);
 assert.equal(repo.view(ADMIN,A.id).revision,0);
 assert.equal(repo.view(ADMIN,B.id).revision,0);
 assert.equal(repo.view(ADMIN,C.id).revision,0);
});
test("I5 no duplicated seed on same DB",t=>{
 const {repo}=setup(t);
 assert.throws(()=>repo.seedFromI4(archivedI4Fixture().payload,7),/PARTITION_ALREADY_INITIALIZED/);
});
test("I5 reviewed source sync increases only facility A revision",t=>{
 const {repo}=setup(t);revise(repo);
 assert.equal(repo.view(ADMIN,A.id).revision,3);
 assert.equal(repo.view(ADMIN,A.id).source_revision,3);
 assert.equal(repo.view(ADMIN,B.id).revision,0);
});
test("I5 independent optimistic revision for B unaffected by A",t=>{
 const {repo}=setup(t);revise(repo);
 const b=cmd("B1",0,"request_revision",{
  revision_request_id:"DEMO-I5-REV-B1",reason:"Permohonan revisi sumber fasilitas B fiktif."},B.id);
 assert.equal(repo.execute(ADMIN,b).revision,1);
 assert.equal(repo.view(ADMIN,A.id).revision,3);
 assert.equal(repo.view(ADMIN,B.id).revision,1);
});
test("I5 replay idempotent within facility, conflicts for changed body",t=>{
 const {repo}=setup(t);
 const one=request(0);repo.execute(PET,one);
 assert.equal(repo.execute(PET,one).replayed,true);
 assert.throws(()=>repo.execute(PET,{...one,expected_revision:1}),/REQUEST_ID_CONFLICT/);
 assert.equal(repo.view(ADMIN,A.id).revision,1);
});
test("I5 same request ID may be scoped independently to B",t=>{
 const {repo}=setup(t);
 repo.execute(ADMIN,request(0));
 assert.equal(repo.execute(ADMIN,request(0,B.id)).revision,1);
 assert.equal(repo.view(ADMIN,A.id).revision,1);
});
test("I5 reviewer must be different and must possess scoped role",t=>{
 const {repo}=setup(t);
 repo.execute(KAB,request(0));
 assert.throws(()=>repo.execute(KAB,review(1)),/REVISION_REVIEW_DENIED/);
 assert.throws(()=>repo.execute(ADMIN,review(1)),/ACCESS_DENIED/);
 assert.equal(repo.execute(VER,review(1)).outcome,"tercatat_untuk_sinkron");
});
test("I5 request pending blocks generation; returned request allows new one",t=>{
 const {repo}=setup(t);
 repo.execute(PET,request(0));
 assert.throws(()=>repo.execute(ADMIN,cmd("G1",1,"begin_generation",{})),/FACILITY_REVISION_PENDING/);
 repo.execute(VER,cmd("R2",1,"review_revision",{revision_request_id:ID,
  decision:"kembalikan_untuk_perbaikan",reason:"Perlu data bukti baru fiktif."}));
 assert.throws(()=>repo.execute(ADMIN,cmd("G1",2,"begin_generation",{})),/REVERIFIED_M03_NEED_REQUIRED/);
});
test("I5 cannot begin before reverified need and after successful begin allows stage",t=>{
 const {repo}=setup(t);
 assert.throws(()=>repo.execute(ADMIN,cmd("G0",0,"begin_generation",{})),/REVERIFIED_M03_NEED_REQUIRED/);
 revise(repo);
 assert.equal(repo.execute(ADMIN,cmd("G1",3,"begin_generation",{})).outcome,"generasi_dibuka_demo");
 const p=repo.execute(ADMIN,cmd("G2",4,"advance_generation",{stage:"paket"}));
 assert.equal(p.outcome,"tahap_paket_demo_tercatat");
 assert.equal(repo.view(ADMIN,A.id).generation.active,2);
});
test("I5 source sync after generation starts blocks rather than rewriting package",t=>{
 const {repo}=setup(t);revise(repo);
 repo.execute(ADMIN,cmd("G1",3,"begin_generation",{}));
 repo.execute(ADMIN,cmd("G2",4,"advance_generation",{stage:"paket"}));
 const c=cmd("C4",5,"request_revision",{revision_request_id:"DEMO-I5-REV-002",
  reason:"Perubahan sumber setelah paket generasi baru."});
 repo.execute(PET,c);
 repo.execute(VER,cmd("C5",6,"review_revision",{
  revision_request_id:"DEMO-I5-REV-002",decision:"catat_untuk_sinkron",
  reason:"Catatan verifikasi metadata revisi lanjutan."}));
 const result=repo.execute(ADMIN,cmd("C6",7,"sync_verified_source",{
  revision_request_id:"DEMO-I5-REV-002"}));
 assert.equal(result.outcome,"terblokir_rekonsiliasi");
 assert.equal(repo.view(ADMIN,A.id).source_revision,3);
});
test("I5 leader sees aggregate only and foreign facility read is denied",t=>{
 const {repo}=setup(t);
 assert.equal(repo.overview(LEAD).facilities,3);
 assert.throws(()=>repo.view(LEAD,A.id),/ACCESS_DENIED/);
 assert.throws(()=>repo.view(PET,B.id),/ACCESS_DENIED/);
 assert.throws(()=>repo.history(KAB,B.id),/ACCESS_DENIED/);
});
test("I5 SQL failure rolls back event and state; retry remains possible",t=>{
 const {repo,db}=setup(t);
 db.exec("CREATE TRIGGER fail_i5 BEFORE INSERT ON facility_events BEGIN SELECT RAISE(ABORT,'forced failure'); END");
 assert.throws(()=>repo.execute(PET,request(0)),/forced failure/);
 assert.equal(repo.view(ADMIN,A.id).revision,0);
 assert.equal(db.prepare("SELECT count(*) n FROM facility_commands").get().n,0);
 db.exec("DROP TRIGGER fail_i5");
 assert.equal(repo.execute(PET,request(0)).revision,1);
});
test("I5 immutable facility audit cannot be overwritten or deleted through normal SQL",t=>{
 const {repo,db}=setup(t);
 repo.execute(PET,request(0));
 assert.throws(()=>db.exec("DELETE FROM facility_events WHERE facility_id='DEMO-PSW-001'"),/append-only/);
 assert.throws(()=>db.exec("UPDATE facility_versions SET payload='{}'"),/append-only/);
 assert.throws(()=>db.exec("DELETE FROM facility_commands"),/append-only/);
});
