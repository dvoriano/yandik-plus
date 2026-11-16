/** 14 skenario ditulis, BELUM DIJALANKAN. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {MASTER,demoState,demoWorkspace} from "../fixtures.mjs";
import {bridgeSources} from "../bridge.mjs";
import {startWorkspace,models,advanceDemo,viewWorkspace,ACTIONS} from "../workspace.mjs";
const A=MASTER[0],B=MASTER[1],C=MASTER[2],admin={role:"provinsi_admin"};
const pet=m=>({role:"puskeswan",puskeswan_id:m.id,region:m.region});
const run=(w=demoWorkspace())=>ACTIONS.reduce((s,a)=>advanceDemo(s,A.id,a),w);
test("adapter derives eligible need from actual M03 workflow and preserves provenance",()=>{
 const w=demoWorkspace(),b=models(w).bridge;
 assert.equal(b.needs.length,1);assert.equal(b.excluded.length,1);
 assert.equal(b.needs[0].need_id,"DEMO-NEED-001-N1");
 assert.equal(b.needs[0].puskeswan_id,A.support_id);
 assert.equal(b.links[0].local_need_id,w.states[0].supportNeeds[0].id);
 assert.equal(b.links[0].problem_version,w.states[0].problems[0].version);
});
test("same local ID in two facilities remains separately namespaced",()=>{
 const b=bridgeSources(MASTER,[demoState(A),demoState(B)]);
 assert.equal(b.needs.length,2);assert.equal(new Set(b.needs.map(n=>n.need_id)).size,2);
});
test("crosswalk duplicates and mismatched source scope rejected",()=>{
 assert.throws(()=>bridgeSources([A,{...B,support_id:A.support_id}],[]));
 const s=demoState(A);assert.throws(()=>bridgeSources(MASTER,[{...s,facility:{...s.facility,region:B.region}}]));
});
test("unverified need and unsupported unit excluded without fabricated conversion",()=>{
 const w=demoWorkspace(),s=w.states[0];
 const altered={...s,supportNeeds:s.supportNeeds.map(n=>({...n,unit:"kotak"}))};
 const b=bridgeSources(MASTER,[altered,w.states[1]]);
 assert.equal(b.needs.length,0);assert.equal(b.excluded.length,2);
});
test("stale problem and metadata mismatch prevent entry",()=>{
 const s=demoState(A),p=s.problems[0];
 const changed={...s,problems:[{...p,version:p.version+1,history:[...p.history,{action:"ditindaklanjuti",actor:"verifikator_kab",version:p.version+1,note:"Contoh"}]}]};
 assert.equal(bridgeSources(MASTER,[changed]).needs.length,0);
 const n=s.supportNeeds[0];
 assert.equal(bridgeSources(MASTER,[{...s,supportNeeds:[{...n,evidence_review:{...n.evidence_review,at_version:99}}]}]).needs.length,0);
});
test("package uses actual M03 quantity and snapshot, not old M04 fixture",()=>{
 const w=advanceDemo(demoWorkspace(),A.id,"paket"),x=models(w);
 assert.equal(x.plan.packages[0].lines[0].need_id,"DEMO-NEED-001-N1");
 assert.equal(x.plan.packages[0].lines[0].quantity,2);
 assert.equal(w.bindings[0].snapshot.need.item,w.states[0].supportNeeds[0].item);
});
test("same-version content change after planning is blocked",()=>{
 const w=advanceDemo(demoWorkspace(),A.id,"paket"),s=w.states[0];
 const changed={...w,states:[{...s,supportNeeds:s.supportNeeds.map(n=>({...n,item:"Peralatan contoh berubah"}))},w.states[1]]};
 assert.throws(()=>models(changed),/Sumber M03 berubah/);
});
test("full seven-stage chain shares state and never claims official acts",()=>{
 const x=models(run());
 assert.equal(x.real.shipments[0].quantity,2);
 assert.equal(x.real.receipts[0].good,2);
 assert.equal(x.handover.records[0].signed,false);
 assert.equal(x.monitoring.quantities_by_unit[0].used,2);
 assert.equal(x.real.totals.official_shipments,0);
 assert.equal(x.handover.totals.official_bast,0);
});
test("out of order and unverified facility fail; source is not mutated",()=>{
 const w=demoWorkspace(),before=JSON.stringify(w);
 assert.throws(()=>advanceDemo(w,A.id,"kirim"));
 assert.throws(()=>advanceDemo(w,B.id,"paket"));
 const next=advanceDemo(w,A.id,"paket");
 assert.throws(()=>advanceDemo(next,A.id,"paket"));
 assert.equal(JSON.stringify(w),before);
});
test("APEL reported zero is distinct from unavailable month/facility",()=>{
 const w=demoWorkspace(),a=viewWorkspace(w,admin,"2026-10",A.id),
 b=viewWorkspace(w,admin,"2026-10",B.id),c=viewWorkspace(w,admin,"2026-10",C.id);
 assert.equal(a.details.apel.total,41);assert.equal(b.details.apel.total,0);
 assert.equal(c.details.apel.total,null);assert.equal(c.details.profile,null);
 assert.equal(a.aggregate.reports,2);assert.equal(a.aggregate.missing,1);
});
test("puskeswan cannot view foreign facility; kabupaten scope is limited",()=>{
 const w=demoWorkspace();
 assert.throws(()=>viewWorkspace(w,pet(A),"2026-10",B.id));
 const actor={role:"kab_kota",region:A.region};
 assert.throws(()=>viewWorkspace(w,actor,"2026-10",B.id));
 assert.equal(viewWorkspace(w,actor,"2026-10").aggregate.facilities,2);
});
test("pimpinan gets aggregate only; unknown roles fail closed",()=>{
 const w=run(),r=viewWorkspace(w,{role:"pimpinan"},"2026-10");
 assert.equal(r.details,null);assert.equal(r.aggregate.services,41);
 assert.throws(()=>viewWorkspace(w,{role:"pimpinan"},"2026-10",A.id));
 assert.throws(()=>viewWorkspace(w,{role:"unknown"},"2026-10"));
});
test("support records appear only for their facility; units preserved",()=>{
 const w=run(),a=viewWorkspace(w,pet(A),"2026-10",A.id),b=viewWorkspace(w,pet(B),"2026-10",B.id);
 assert.equal(a.details.monitor[0].unit,"unit");
 assert.equal(b.details.ship.length,0);assert.equal(b.details.handover.length,0);
});
test("empty source states do not fabricate profile or eligible needs",()=>{
 const w=startWorkspace(MASTER,[]);
 const v=viewWorkspace(w,admin,"2026-11",A.id);
 assert.equal(v.details.profile,null);assert.equal(v.details.needs.length,0);
 assert.equal(v.aggregate.bridge_eligible,0);assert.equal(v.aggregate.services,null);
});
