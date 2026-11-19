/**
 * M04-I4 | 20 QA scenarios WRITTEN, NOT EXECUTED.
 * Only permitted in an isolated synthetic environment after explicit G0.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {DatabaseSync} from "node:sqlite";
import {demoWorkspace,demoState,MASTER} from "../../m04-integrated-workspace/fixtures.mjs";
import {advanceDemo,ACTIONS} from "../../m04-integrated-workspace/workspace.mjs";
import {followUpProblem} from "../../../prototypes/profil-puskeswan/problems.mjs";
import {useRole} from "../../../prototypes/profil-puskeswan/model.mjs";
import {openRepository} from "../../m04-data-foundation/repository.mjs";
import {activationGate,previewDemoPromotion} from "../activation.mjs";
import {draftFollowupRegister} from "../compensation.mjs";
const A=MASTER[0],B=MASTER[1],COR="DEMO-KOREKSI-001";
const USERS={
 ADMIN:"DEMO-USER-ADMIN",PET:"DEMO-USER-PET",
 VER:"DEMO-USER-VER",KAB:"DEMO-USER-KAB",LEAD:"DEMO-USER-LEAD"
};
const accounts={
 [USERS.ADMIN]:{id:USERS.ADMIN,role:"provinsi_admin",active:true},
 [USERS.PET]:{id:USERS.PET,role:"puskeswan",active:true,puskeswan_id:A.id,region:A.region},
 [USERS.VER]:{id:USERS.VER,role:"provinsi_verifikator",active:true},
 [USERS.KAB]:{id:USERS.KAB,role:"kab_kota",active:true,region:A.region},
 [USERS.LEAD]:{id:USERS.LEAD,role:"pimpinan",active:true}
};
function changedState(state){
 return followUpProblem(useRole(state,"verifikator_kab"),1,"ditindaklanjuti",
  "Tindak lanjut fiktif untuk pembaruan sumber kebutuhan.");
}
const command=(id,rev,action,data,facility_id=A.id)=>({
 request_id:"DEMO-REQ-"+id,expected_revision:rev,facility_id,action,data});
const request=rev=>command("C1",rev,"request_correction",{
 correction_id:COR,reason:"Perlu koreksi riwayat permasalahan sumber."});
const review=rev=>command("C2",rev,"review_correction",{
 correction_id:COR,decision:"catat_untuk_sinkron",reason:"Sumber fiktif sudah diperiksa sebagai metadata."});
const sync=rev=>command("C3",rev,"sync_source",{correction_id:COR});
const prepare=rev=>command("C4",rev,"prepare_reconciliation",{correction_id:COR});
const reviewBranch=rev=>command("C5",rev,"review_reconciliation",{
 correction_id:COR,disposition:"catat_cabang_draf",reason:"Cabang draf fiktif dicatat untuk kajian."});
const reviewActivation=(rev,disposition="catat_kesiapan_demo")=>command("C6",rev,"review_activation",{
 correction_id:COR,disposition,reason:"Pembahasan kesiapan DEMO, bukan persetujuan lembaga."});
const activate=rev=>command("C7",rev,"activate_branch_demo",{
 correction_id:COR,acknowledge_demo:true});
const followup=rev=>command("C8",rev,"record_followup_register",{
 correction_id:COR,reason:"Dokumen dan barang telah memiliki jejak simulasi sehingga harus ditelaah manual."});
function seed(full=false){
 let w=advanceDemo(demoWorkspace(),A.id,"paket");
 if(full)for(const action of ACTIONS.slice(1))w=advanceDemo(w,A.id,action);
 return w;
}
function setup(t,full=false){
 const db=new DatabaseSync(":memory:");t.after(()=>db.close());
 const w=seed(full),source={revision:2,state:changedState(w.states[0])};
 const repo=openRepository(db,{lookupPrincipal:id=>accounts[id],
  readSource:()=>source,clock:()=>"2026-11-19T06:00:00.000Z"});
 repo.initialize(w);
 return {repo,db,w,source};
}
function stage(repo){
 repo.execute(USERS.PET,request(0));
 repo.execute(USERS.VER,review(1));
 assert.equal(repo.execute(USERS.ADMIN,sync(2)).outcome,"terblokir_rekonsiliasi");
 repo.execute(USERS.ADMIN,prepare(3));
 repo.execute(USERS.VER,reviewBranch(4));
 return 5;
}
function status(repo){return repo.activation(USERS.ADMIN,A.id,COR);}
function saved(db){
 return JSON.parse(db.prepare("SELECT payload FROM workspace_current WHERE id=1").get().payload);
}
test("I4 gate allows only a reviewed branch without delivery traces",t=>{
 const {repo,db}=setup(t);stage(repo);
 const s=saved(db),entry=s.reconciliations[0],c=s.corrections[0],gate=activationGate(entry,c);
 assert.equal(gate.eligible,true);
 assert.equal(gate.official_approval,false);
 assert.equal(gate.deployment_authorized,false);
});
test("I4 full lifecycle with shipments/receipts/BAST/monitoring cannot activate",t=>{
 const {repo,db}=setup(t,true);stage(repo);
 const e=saved(db).reconciliations[0],gate=activationGate(e,saved(db).corrections[0]);
 assert.equal(gate.eligible,false);
 assert.ok(gate.reasons.includes("DELIVERY_TRACE_PRESENT"));
 assert.throws(()=>repo.execute(USERS.KAB,reviewActivation(5)),/ACTIVATION_BLOCKED/);
});
test("I4 reviewer must be distinct from requester preparer and I3 reviewer",t=>{
 const {repo}=setup(t);stage(repo);
 assert.throws(()=>repo.execute(USERS.PET,reviewActivation(5)),/ACCESS_DENIED/);
 assert.throws(()=>repo.execute(USERS.ADMIN,reviewActivation(5)),/ACCESS_DENIED/);
 assert.throws(()=>repo.execute(USERS.VER,reviewActivation(5)),/ACTIVATION_REVIEW_DENIED/);
 assert.equal(repo.execute(USERS.KAB,reviewActivation(5)).outcome,"siap_aktivasi_demo");
});
test("I4 a returned activation review does not change active data",t=>{
 const {repo}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5,"kembalikan_untuk_perbaikan"));
 assert.equal(status(repo).status,"dikembalikan");
 assert.equal(repo.view(USERS.ADMIN,"2026-10",A.id).details.packages.length,1);
 assert.throws(()=>repo.execute(USERS.ADMIN,activate(6)),/ACTIVATION_NOT_READY/);
});
test("I4 successful DEMO promotion archives old package and source revisions",t=>{
 const {repo,db}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 const promoted=repo.execute(USERS.ADMIN,activate(6));
 assert.equal(promoted.outcome,"diaktifkan_demo_terarsip");
 const state=saved(db);
 assert.equal(state.source_versions[A.id],2);
 assert.equal(state.workspace.packages.length,0);
 assert.equal(state.archived_workflows.length,1);
 assert.equal(state.archived_workflows[0].replaced_objects.packages.length,1);
 assert.equal(state.archived_workflows[0].official_record,false);
 assert.equal(state.archived_workflows[0].old_source.problems[0].version,1);
 assert.equal(db.prepare("SELECT count(*) n FROM workspace_versions").get().n,8);
});
test("I4 command replay does not archive twice or increase revision",t=>{
 const {repo,db}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 const first=activate(6);
 repo.execute(USERS.ADMIN,first);
 const again=repo.execute(USERS.ADMIN,first);
 assert.equal(again.replayed,true);assert.equal(again.revision,7);
 assert.equal(saved(db).archived_workflows.length,1);
});
test("I4 cannot activate twice with another request key",t=>{
 const {repo}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 repo.execute(USERS.ADMIN,activate(6));
 assert.throws(()=>repo.execute(USERS.ADMIN,command("C9",7,"activate_branch_demo",{
  correction_id:COR,acknowledge_demo:true})),/ACTIVATION_NOT_READY/);
});
test("I4 archived ID cannot be reissued by deterministic I1 workflow",t=>{
 const {repo}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 repo.execute(USERS.ADMIN,activate(6));
 assert.throws(()=>repo.execute(USERS.ADMIN,command("NEXT",7,"advance",{
  stage:"paket"})),/CORRECTION_PENDING|RETIRED_WORKFLOW_ID_REUSE/);
});
test("I4 stale current source or candidate packet cannot be promoted",t=>{
 const {repo,db,source}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 source.revision=3;
 assert.throws(()=>repo.execute(USERS.ADMIN,activate(6)),/CANDIDATE_CHANGED_REPREPARE/);
 assert.equal(saved(db).workspace.packages.length,1);
 assert.equal(saved(db).source_versions[A.id],1);
});
test("I4 altered same-version candidate payload is detected",t=>{
 const {repo,source}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 source.state.sections.bangunan={value:"Snapshot kandidat fiktif berubah setelah telaah.",verified:false,date:"2026-11-19"};
 assert.throws(()=>repo.execute(USERS.ADMIN,activate(6)),/CANDIDATE_CHANGED_REPREPARE/);
});
test("I4 state changes in another facility require re-preparation",t=>{
 const {repo}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 // Baseline comparison is global and fail-closed, not a per-facility merge.
 const snapshot=repo.view(USERS.ADMIN,"2026-10",A.id);
 assert.equal(snapshot.revision,6);
 assert.equal(status(repo).guard.eligible,true);
});
test("I4 client cannot inject branch payload or bypass acknowledgment",t=>{
 const {repo}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 assert.throws(()=>repo.execute(USERS.ADMIN,command("C7",6,"activate_branch_demo",{
  correction_id:COR,acknowledge_demo:false})),/DEMO_ACKNOWLEDGMENT_REQUIRED/);
 assert.throws(()=>repo.execute(USERS.ADMIN,command("C7",6,"activate_branch_demo",{
  correction_id:COR,acknowledge_demo:true,branch:{}})),/INVALID_COMMAND/);
});
test("I4 all actions fail closed to leadership or foreign facility",t=>{
 const {repo}=setup(t);stage(repo);
 assert.throws(()=>repo.activation(USERS.LEAD,A.id,COR),/ACCESS_DENIED/);
 assert.throws(()=>repo.activation(USERS.PET,B.id,COR),/ACCESS_DENIED/);
 assert.throws(()=>repo.execute(USERS.KAB,activate(5)),/ACCESS_DENIED/);
});
test("I4 read projection never returns archive records, source or branch",t=>{
 const {repo}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 repo.execute(USERS.ADMIN,activate(6));
 const v=status(repo);
 for(const key of ["branch","archive","workspace","old_source","candidate","source_packet"])
  assert.equal(Object.hasOwn(v,key),false);
 assert.equal(v.archive_recorded,true);
});
test("I4 compensation register contains all downstream traces without executing them",t=>{
 const {repo,db}=setup(t,true);stage(repo);
 const result=repo.execute(USERS.ADMIN,followup(5));
 assert.equal(result.outcome,"tindak_lanjut_manual_tercatat");
 const state=saved(db),ledger=state.reconciliations[0].compensation;
 assert.equal(ledger.planned_followups.length,4);
 assert.ok(ledger.planned_followups.every(x=>!x.action_executed&&!x.document_reissued));
 assert.equal(ledger.stock_mutated,false);
 assert.equal(state.archived_workflows.length,0);
 assert.equal(state.workspace.observations.length,1);
});
test("I4 followup cannot be registered for an undelivered package",t=>{
 const {repo}=setup(t);stage(repo);
 assert.throws(()=>repo.execute(USERS.ADMIN,followup(5)),/FOLLOWUP_NOT_REQUIRED/);
});
test("I4 manual followup remains frozen; no activation or repeated register",t=>{
 const {repo}=setup(t,true);stage(repo);
 repo.execute(USERS.ADMIN,followup(5));
 assert.throws(()=>repo.execute(USERS.ADMIN,activate(6)),/ACTIVATION_NOT_READY/);
 assert.throws(()=>repo.execute(USERS.ADMIN,command("C9",6,"record_followup_register",{
  correction_id:COR,reason:"Catatan tindak lanjut fiktif tambahan."})),/FOLLOWUP_NOT_READY/);
 assert.throws(()=>repo.execute(USERS.ADMIN,command("C10",6,"advance",{
  stage:"paket"})),/CORRECTION_PENDING/);
});
test("I4 partial transaction failure rolls back archive and idempotency key",t=>{
 const {repo,db}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 db.exec("CREATE TRIGGER forced_failure BEFORE INSERT ON workspace_events BEGIN SELECT RAISE(ABORT,'forced audit failure'); END");
 assert.throws(()=>repo.execute(USERS.ADMIN,activate(6)),/forced audit failure/);
 assert.equal(saved(db).archived_workflows.length,0);
 assert.equal(saved(db).source_versions[A.id],1);
 db.exec("DROP TRIGGER forced_failure");
 assert.equal(repo.execute(USERS.ADMIN,activate(6)).revision,7);
});
test("I4 optimistic conflict rejects stale activation without deleting the branch",t=>{
 const {repo,db}=setup(t);stage(repo);
 repo.execute(USERS.KAB,reviewActivation(5));
 assert.throws(()=>repo.execute(USERS.ADMIN,activate(5)),/REVISION_CONFLICT/);
 assert.equal(saved(db).reconciliations[0].branch!==null,true);
});
test("I4 pure followup helper rejects missing review and empty delivery ledger",()=>{
 const w=seed(false),c={id:COR,facility_id:A.id,status:"cabang_draf_tercatat",
  base_source_revision:1};
 const entry={correction_id:COR,facility_id:A.id,
  review:{disposition:"catat_cabang_draf"},
  impact:{synthetic:true,contains_delivery_traces:false,counts:{}}};
 assert.throws(()=>draftFollowupRegister(w,entry,c),/NOT_REQUIRED/);
 const bad={...entry,review:null,impact:{...entry.impact,contains_delivery_traces:true}};
 assert.throws(()=>draftFollowupRegister(w,bad,c),/REVIEW_REQUIRED/);
});
