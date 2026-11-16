/** M04-S11 | 12 skenario tertulis, BELUM DIJALANKAN. */
import test from "node:test";
import assert from "node:assert/strict";
import {createReview,reviseReview,submitReview,reviewPackage,isStale,reviewSummary} from "../review.mjs";
import {NEEDS,PACKAGES,MAKER,REVIEWER,REFERENCES} from "../fixtures.mjs";
const create=(fields=REFERENCES,packages=PACKAGES)=>createReview(NEEDS,packages,
 "DEMO-TELAAH-001",{package_id:packages[0].id,fields},MAKER);
const submit=r=>submitReview(r,NEEDS,PACKAGES,MAKER);
const review=(r,action="catat_pembahasan",who=REVIEWER,ack=true)=>reviewPackage(
 r,NEEDS,PACKAGES,who,action,"Catatan pembahasan fiktif untuk kajian lebih lanjut.",ack);
test("draft binds normalized package and need quantities",()=>{
 const r=create();assert.equal(r.snapshot.lines[0].quantity,1);
 assert.equal(r.snapshot.lines[0].need_id,"DEMO-NEED-001");
 assert.equal(r.status,"draf");
});
test("empty and unknown package rejected",()=>{
 assert.throws(()=>create(REFERENCES,[{...PACKAGES[0],lines:[]}]));
 assert.throws(()=>createReview(NEEDS,PACKAGES,"DEMO-TELAAH-001",
 {package_id:"DEMO-PKG-404",fields:REFERENCES},MAKER));
});
test("complete metadata review is discussion only",()=>{
 const r=review(submit(create()));const s=reviewSummary(r,NEEDS,PACKAGES);
 assert.equal(r.status,"tercatat_untuk_pembahasan");
 assert.equal(s.approval,false);assert.equal(s.funds_confirmed,false);
 assert.equal(s.authorized_to_deliver,false);
});
test("missing references trigger clarification not approval",()=>{
 const r=submit(create({...REFERENCES,budget_reference:null}));
 assert.throws(()=>review(r),/belum lengkap/);
 assert.equal(review(r,"kembalikan").status,"perlu_perbaikan");
});
test("return revise resubmit preserves history",()=>{
 const returned=review(submit(create()),"kembalikan");
 const revised=reviseReview(returned,NEEDS,PACKAGES,REFERENCES,MAKER);
 const final=review(submit(revised));
 assert.equal(final.revision,6);assert.equal(final.history.length,6);
 assert.equal(returned.status,"perlu_perbaikan");
});
test("maker and reviewer separation and acknowledgment",()=>{
 const r=submit(create());
 assert.throws(()=>review(r,"catat_pembahasan",{...REVIEWER,id:MAKER.id}));
 assert.throws(()=>review(r,"catat_pembahasan",REVIEWER,false));
});
test("invalid transition and unauthorized action rejected",()=>{
 assert.throws(()=>review(create()));
 assert.throws(()=>review(submit(create()),"approve"));
 assert.throws(()=>submit(review(submit(create()))));
});
test("source changes including same-version text invalidate review",()=>{
 const r=create();
 const n=NEEDS.map((x,i)=>i?x:{...x,item:"Perangkat contoh berubah"});
 assert.equal(isStale(r,n,PACKAGES),true);
 assert.throws(()=>submitReview(r,n,PACKAGES,MAKER));
 const p=[{...PACKAGES[0],title:"Judul paket berubah"}];
 assert.equal(isStale(r,NEEDS,p),true);
});
test("source quantity version or package deletion invalidates review",()=>{
 const r=create();
 assert.equal(isStale(r,NEEDS.map((n,i)=>i?n:{...n,source_version:3}),PACKAGES),true);
 assert.equal(isStale(r,NEEDS,[{...PACKAGES[0],lines:[{...PACKAGES[0].lines[0],quantity:2}]}]),true);
 assert.equal(isStale(r,NEEDS,[]),true);
});
test("reject actual-style references bad date and duplicate claim code",()=>{
 assert.throws(()=>create({...REFERENCES,decision_reference:{...REFERENCES.decision_reference,document_ref:"SK-REAL"}}));
 assert.throws(()=>create({...REFERENCES,budget_reference:{...REFERENCES.budget_reference,date_demo:"2026-02-30"}}));
 assert.throws(()=>create({...REFERENCES,budget_reference:{...REFERENCES.decision_reference}}));
});
test("reject forged status, funding or extra financial attributes",()=>{
 assert.throws(()=>submit({...create(),funds_confirmed:true}));
 assert.throws(()=>submit({...create(),status:"menunggu_telaah"}));
 assert.throws(()=>create({...REFERENCES,amount:100}));
});
test("review never mutates source or grants legal validity",()=>{
 const before=JSON.stringify([NEEDS,PACKAGES,REFERENCES]);const r=review(submit(create()));
 assert.equal(JSON.stringify([NEEDS,PACKAGES,REFERENCES]),before);
 assert.equal(reviewSummary(r,NEEDS,PACKAGES).legal_validity,"BELUM DIVERIFIKASI SECARA RESMI");
});
