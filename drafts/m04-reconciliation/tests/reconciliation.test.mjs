/** M04-I3 | 15 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY.
 * Never run without explicit G0 permission and isolated synthetic DB.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {DatabaseSync} from "node:sqlite";
import {demoWorkspace,demoState,MASTER} from "../../m04-integrated-workspace/fixtures.mjs";
import {startWorkspace,advanceDemo,models,ACTIONS} from "../../m04-integrated-workspace/workspace.mjs";
import {bridgeSources,bindPackageSources} from "../../m04-integrated-workspace/bridge.mjs";
import {replaceDraft} from "../../m04-support-package-planning/planning.mjs";
import {followUpProblem} from "../../../prototypes/profil-puskeswan/problems.mjs";
import {useRole} from "../../../prototypes/profil-puskeswan/model.mjs";
import {buildReconciliationBranch} from "../impact.mjs";
import {openRepository} from "../../m04-data-foundation/repository.mjs";
const A=MASTER[0],B=MASTER[1],C=MASTER[2];
const ADMIN="DEMO-USER-ADMIN",PET="DEMO-USER-PET",VER="DEMO-USER-VER",KAB="DEMO-USER-KAB",LEAD="DEMO-USER-LEAD";
const COR="DEMO-KOREKSI-001";
const actors={
 [ADMIN]:{id:ADMIN,role:"provinsi_admin",active:true},
 [PET]:{id:PET,role:"puskeswan",puskeswan_id:A.id,region:A.region,active:true},
 [VER]:{id:VER,role:"provinsi_verifikator",active:true},
 [KAB]:{id:KAB,role:"kab_kota",region:A.region,active:true},
 [LEAD]:{id:LEAD,role:"pimpinan",active:true}
};
function changedState(original=demoState(A)){
 return followUpProblem(useRole(original,"verifikator_kab"),1,"ditindaklanjuti",
  "Tindak lanjut fiktif yang menaikkan versi sumber masalah.");
}
function packet(state=changedState(),revision=2){return {revision,state};}
function command(n,rev,action,data,facility_id=A.id){return {
 request_id:"DEMO-REQ-"+n,expected_revision:rev,facility_id,action,data};}
function setup(t,seed=demoWorkspace()){
 const db=new DatabaseSync(":memory:");t.after(()=>db.close());
 const src=packet(changedState(seed.states.find(s=>s.facility.id===A.id)??demoState(A)));
 const repo=openRepository(db,{lookupPrincipal:id=>actors[id],
  readSource:()=>src,clock:()=>"2026-11-19T06:00:00.000Z"});
 repo.initialize(seed);
 return {db,repo,src};
}
function request(rev){return command("C1",rev,"request_correction",
 {correction_id:COR,reason:"Perlu pemeriksaan koreksi sumber DEMO."});}
function review(rev){return command("C2",rev,"review_correction",
 {correction_id:COR,decision:"catat_untuk_sinkron",reason:"Metadata diperiksa di simulasi."});}
function sync(rev){return command("C3",rev,"sync_source",{correction_id:COR});}
function prepare(rev){return command("C4",rev,"prepare_reconciliation",{correction_id:COR});}
function reviewBranch(rev,disposition="catat_cabang_draf"){return command("C5",rev,"review_reconciliation",
 {correction_id:COR,disposition,reason:"Catatan pembahasan cabang sintetis yang belum aktif."});}
function blocked(repo,base=1){
 repo.execute(PET,request(base));
 repo.execute(VER,review(base+1));
 assert.equal(repo.execute(ADMIN,sync(base+2)).outcome,"terblokir_rekonsiliasi");
 return base+3;
}
test("pure impact lists all seven downstream collections without mutating old workspace",()=>{
 const original=demoWorkspace(),full=ACTIONS.reduce((w,action)=>advanceDemo(w,A.id,action),original);
 const before=JSON.stringify(full),out=buildReconciliationBranch(full,A,1,packet(changedState(full.states[0])));
 assert.deepEqual(out.impact.changed_need_ids,["DEMO-NEED-001-N1"]);
 for(const k of ["packages","reviews","schedules","shipments","receipts","handovers","observations"]){
  assert.equal(out.impact.counts[k],1,k);
  assert.equal(out.branch[k].length,0,k);
 }
 assert.equal(out.impact.contains_delivery_traces,true);
 assert.equal(JSON.stringify(full),before);
});
test("candidate branch can be modelled but active chain stays intact",()=>{
 const w=ACTIONS.reduce((x,a)=>advanceDemo(x,A.id,a),demoWorkspace());
 const out=buildReconciliationBranch(w,A,1,packet(changedState(w.states[0])));
 assert.equal(models(out.branch).plan.packages.length,0);
 assert.equal(models(w).monitoring.observations.length,1);
 assert.equal(out.impact.production_written,false);
});
test("profile-only change leaves source need snapshot unaffected",()=>{
 const w=advanceDemo(demoWorkspace(),A.id,"paket");
 const state=structuredClone(w.states[0]);
 state.sections.bangunan={value:"Kondisi bangunan contoh yang diperbarui.",verified:false,date:"2026-11-19"};
 const r=buildReconciliationBranch(w,A,1,packet(state));
 assert.deepEqual(r.impact.changed_need_ids,[]);
 assert.equal(r.impact.counts.packages,0);
 assert.equal(r.branch.packages.length,1);
});
test("source old version, changed same-version need, and cross-scope are rejected",()=>{
 const w=advanceDemo(demoWorkspace(),A.id,"paket");
 assert.throws(()=>buildReconciliationBranch(w,A,1,packet(changedState(w.states[0]),1)),/NOT_NEWER/);
 const state=structuredClone(w.states[0]);state.supportNeeds[0].item="Barang diam-diam diubah";
 assert.throws(()=>buildReconciliationBranch(w,A,1,packet(state)),/SAME_VERSION_CHANGED/);
 assert.throws(()=>buildReconciliationBranch(w,A,1,packet(demoState(B))),/SCOPE_MISMATCH/);
});
test("cross-facility package is flagged; no branch silently drops another facility",()=>{
 const seed=startWorkspace(MASTER,[demoState(A),demoState(B)]);
 const b=bridgeSources(seed.master,seed.states);
 const p={id:"DEMO-PKG-MIXED",title:"Paket dua wilayah contoh",
  purpose:"Hanya untuk menguji perlindungan paket lintas wilayah.",
  lines:b.needs.map(n=>({need_id:n.need_id,source_version:n.source_version,quantity:1}))};
 const packages=replaceDraft(b.needs,[],p);
 const mixed={...seed,packages,bindings:bindPackageSources(b,packages)};
 const out=buildReconciliationBranch(mixed,A,1,packet(changedState(seed.states[0])));
 assert.equal(out.impact.mixed_facility_package,true);
 assert.equal(out.branch,null);
 assert.equal(out.reason,"MIXED_FACILITY_PACKAGE_REQUIRES_MANUAL_REVIEW");
});
test("blocked source produces scoped draft without activating candidate",t=>{
 const {repo}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 const revision=blocked(repo);
 assert.equal(repo.execute(ADMIN,prepare(revision)).outcome,"cabang_draf_menunggu_telaah");
 const detail=repo.reconciliation(PET,A.id,COR);
 assert.equal(detail.branch_available,true);
 assert.equal(detail.active_workspace_unchanged,true);
 assert.equal(repo.view(ADMIN,"2026-10",A.id).details.packages.length,1);
 assert.equal(detail.impact.affected.packages.length,1);
});
test("impact view never returns candidate source payload or branch",t=>{
 const {repo}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 repo.execute(ADMIN,prepare(blocked(repo)));
 const result=repo.reconciliation(KAB,A.id,COR);
 assert.equal(Object.hasOwn(result,"branch"),false);
 assert.equal(Object.hasOwn(result,"candidate_workspace"),false);
 assert.equal(Object.hasOwn(result,"source_packet"),false);
});
test("other region and leadership cannot query reconciliation details",t=>{
 const {repo}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 repo.execute(ADMIN,prepare(blocked(repo)));
 assert.throws(()=>repo.reconciliation(LEAD,A.id,COR),/ACCESS_DENIED/);
 assert.throws(()=>repo.reconciliation(PET,B.id,COR),/ACCESS_DENIED/);
 assert.throws(()=>repo.reconciliation(KAB,B.id,COR),/ACCESS_DENIED/);
});
test("reviewer must differ from preparer and original requester",t=>{
 const {repo}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 repo.execute(ADMIN,prepare(blocked(repo)));
 assert.throws(()=>repo.execute(ADMIN,reviewBranch(5)),/ACCESS_DENIED/);
 assert.throws(()=>repo.execute(PET,reviewBranch(5)),/ACCESS_DENIED/);
 const response=repo.execute(VER,reviewBranch(5));
 assert.equal(response.outcome,"cabang_draf_tercatat");
 assert.equal(repo.reconciliation(ADMIN,A.id,COR).review.reviewer,VER);
});
test("recording draft does not unlock package steps or alter source revision",t=>{
 const {repo,db}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 repo.execute(ADMIN,prepare(blocked(repo)));
 repo.execute(VER,reviewBranch(5));
 assert.throws(()=>repo.execute(ADMIN,command("A2",6,"advance",{stage:"telaah"})),/CORRECTION_PENDING/);
 assert.equal(repo.view(ADMIN,"2026-10",A.id).details.packages.length,1);
 const active=JSON.parse(db.prepare("SELECT payload FROM workspace_current WHERE id=1").get().payload);
 assert.equal(active.source_versions[A.id],1);
 assert.equal(active.reconciliations[0].branch.packages.length,0);
});
test("preparation is idempotent and repeated changed body is rejected",t=>{
 const {repo,db}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 const revision=blocked(repo),cmd=prepare(revision);
 repo.execute(ADMIN,cmd);
 assert.equal(repo.execute(ADMIN,cmd).replayed,true);
 assert.throws(()=>repo.execute(ADMIN,{...cmd,expected_revision:revision+1}),/REQUEST_ID_CONFLICT/);
 assert.equal(db.prepare("SELECT count(*) n FROM workspace_events").get().n,5);
});
test("correction candidate cannot be supplied directly in command payload",t=>{
 const {repo}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 const rev=blocked(repo);
 assert.throws(()=>repo.execute(ADMIN,{...prepare(rev),data:{correction_id:COR,state:{}}}),/INVALID_COMMAND/);
 assert.equal(repo.reconciliation(ADMIN,A.id,COR).impact,null);
});
test("unprepared or returned correction cannot be staged",t=>{
 const {repo}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 assert.throws(()=>repo.execute(ADMIN,prepare(1)),/CORRECTION_NOT_FOUND/);
 const rev=blocked(repo);
 repo.execute(ADMIN,prepare(rev));
 assert.throws(()=>repo.execute(ADMIN,prepare(rev+1)),/RECONCILIATION_NOT_BLOCKED/);
});
test("rejected branch review keeps active workspace and old event versions",t=>{
 const {repo,db}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 repo.execute(ADMIN,prepare(blocked(repo)));
 repo.execute(VER,reviewBranch(5,"kembalikan_untuk_perbaikan"));
 assert.equal(repo.view(ADMIN,"2026-10",A.id).details.packages.length,1);
 assert.equal(repo.reconciliation(ADMIN,A.id,COR).status,"dikembalikan");
 assert.equal(db.prepare("SELECT count(*) n FROM workspace_versions").get().n,7);
});
test("revision conflict or audit failure rolls back entire preparation",t=>{
 const {repo,db}=setup(t,advanceDemo(demoWorkspace(),A.id,"paket"));
 const rev=blocked(repo);
 assert.throws(()=>repo.execute(ADMIN,prepare(rev-1)),/REVISION_CONFLICT/);
 db.exec("CREATE TRIGGER stop_event BEFORE INSERT ON workspace_events BEGIN SELECT RAISE(ABORT,'audit forced failure'); END");
 assert.throws(()=>repo.execute(ADMIN,prepare(rev)),/audit forced failure/);
 assert.equal(repo.reconciliation(ADMIN,A.id,COR).impact,null);
 db.exec("DROP TRIGGER stop_event");
 assert.equal(repo.execute(ADMIN,prepare(rev)).revision,rev+1);
});
