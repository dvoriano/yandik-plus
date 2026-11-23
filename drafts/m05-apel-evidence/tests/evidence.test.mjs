/** M05-8 | QA WRITTEN, NOT EXECUTED | CODE_ONLY. No real records. */
import test from "node:test";
import assert from "node:assert/strict";
import {REQUIREMENTS,EVIDENCE_TYPES,evidenceRequirements,
 makeDemoEvidenceRegister} from "../evidence.mjs";
import {makeDemoEvidenceReview} from "../review.mjs";
import {GATE_CATALOG,buildDemoReadinessPacket} from "../gates.mjs";
import {M05_7_SCHEMA} from "../../m05-apel-lineage/lineage.mjs";

const sampleEvidence=(id="DEMO-EVID-1",req="SOURCE_OWNER_SCOPE")=>{
 const item=REQUIREMENTS.find(x=>x.requirement_id===req);
 return {evidence_id:id,requirement_id:req,evidence_type:item.evidence_type,
  reference_id:"DEMO-REF-1",source_family:item.source_family,
  supplied_by:"DEMO-OWNER-1",revision:1,claim_state:"DEMO_UNVERIFIED"};
};
const sampleReview=(evidence_id="DEMO-EVID-1",
 requirement_id="SOURCE_OWNER_SCOPE")=>({
 review_id:"DEMO-REVIEW-1",requirement_id,evidence_id,
 reviewer_id:"DEMO-REVIEWER-1",assessment:"DEMO_STRUCTURE_NOTED",
 reason_code:"DEMO_REVIEW_NOTE_ONLY"
});
const register=(candidates=[])=>makeDemoEvidenceRegister({candidates});
const reviews=(r,notes=[])=>makeDemoEvidenceReview({register:r,notes});
const packet=(r,rv,lineage=null,issue_notes=[])=>buildDemoReadinessPacket({
 register:r,reviews:rv,lineage,issue_notes});
const issueNote=()=>({note_id:"DEMO-ISSNOTE-1",issue_index:1,
 reviewer_id:"DEMO-REVIEWER-1",action:"REQUEST_SOURCE_CLARIFICATION",
 reason_code:"DEMO_MISSING_PARENT"});
const lineage=(withIssue=true)=>({
 schema:M05_7_SCHEMA,synthetic:true,mode:"DEMO_LINEAGE_REVIEW_ONLY",
 all_candidate_links_are_unverified:true,mapping_verified:false,
 source_owner_verified:false,
 issues:withIssue?[{code:"MISSING_FACILITY",
  source_ref:"services:DEMO-SVC-1",related:[],
  resolution:"HUMAN_REVIEW_REQUIRED",auto_resolved:false}]:[],
 may_connect:false,may_query:false,may_write:false,may_repair:false,
 may_score:false,may_publish:false,official_authorization:false
});

test("M05-8 catalog has fourteen distinct mandatory requirements",()=>{
 assert.equal(REQUIREMENTS.length,14);
 assert.equal(new Set(REQUIREMENTS.map(x=>x.requirement_id)).size,14);
});
test("M05-8 catalog cites eight semantic domains",()=>{
 assert.equal(evidenceRequirements().semantic_domains.length,8);
});
test("M05-8 catalog cites seven DEMO source families",()=>{
 assert.equal(evidenceRequirements().source_families.length,7);
});
test("M05-8 catalog covers years 2026 to 2030",()=>{
 assert.deepEqual(evidenceRequirements().years,[2026,2027,2028,2029,2030]);
});
test("M05-8 contract never grants access, scoring, or publication",()=>{
 const e=evidenceRequirements();
 for(const k of ["may_connect","may_query","may_write","may_repair",
  "may_score","may_publish","official_authorization"])assert.equal(e[k],false);
});
test("M05-8 empty register represents fourteen missing requirements",()=>{
 const r=register();
 assert.equal(r.requirements.length,14);
 assert.ok(r.requirements.every(x=>x.evidence_state==="NOT_PROVIDED"));
});
test("M05-8 valid DEMO candidate stays unverified",()=>{
 const r=register([sampleEvidence()]);
 assert.equal(r.candidates[0].officially_verified,false);
 assert.equal(r.requirements[0].evidence_state,"DEMO_CANDIDATE_NOT_VERIFIED");
});
test("M05-8 multiple pieces of DEMO evidence may belong to one requirement",()=>{
 const r=register([sampleEvidence(),sampleEvidence("DEMO-EVID-2")]);
 assert.equal(r.requirements[0].candidate_count,2);
});
test("M05-8 non-DEMO evidence identity is rejected",()=>{
 const e=sampleEvidence();e.evidence_id="REAL-ID";
 assert.throws(()=>register([e]),/M05_8_EVIDENCE_CANDIDATE_INVALID/);
});
test("M05-8 non-DEMO reference is rejected",()=>{
 const e=sampleEvidence();e.reference_id="actual-document";
 assert.throws(()=>register([e]),/M05_8_EVIDENCE_CANDIDATE_INVALID/);
});
test("M05-8 non-DEMO supplier identity is rejected",()=>{
 const e=sampleEvidence();e.supplied_by="person";
 assert.throws(()=>register([e]),/M05_8_EVIDENCE_CANDIDATE_INVALID/);
});
test("M05-8 evidence type must match requirement",()=>{
 const e=sampleEvidence();e.evidence_type=EVIDENCE_TYPES[1];
 assert.throws(()=>register([e]),/M05_8_REQUIREMENT_TYPE_MISMATCH/);
});
test("M05-8 evidence family must match requirement",()=>{
 const e=sampleEvidence();e.source_family="workflows";
 assert.throws(()=>register([e]),/M05_8_REQUIREMENT_TYPE_MISMATCH/);
});
test("M05-8 unknown requirement is rejected",()=>{
 const e=sampleEvidence();e.requirement_id="UNKNOWN";
 assert.throws(()=>register([e]),/M05_8_REQUIREMENT_TYPE_MISMATCH/);
});
test("M05-8 duplicate evidence identity is rejected",()=>{
 assert.throws(()=>register([sampleEvidence(),sampleEvidence()]),
  /M05_8_DUPLICATE_EVIDENCE_ID/);
});
test("M05-8 noninteger revision is rejected",()=>{
 const e=sampleEvidence();e.revision=1.5;
 assert.throws(()=>register([e]),/M05_8_EVIDENCE_CANDIDATE_INVALID/);
});
test("M05-8 invented verified claim cannot enter register",()=>{
 const e=sampleEvidence();e.claim_state="OFFICIALLY_VERIFIED";
 assert.throws(()=>register([e]),/M05_8_EVIDENCE_CANDIDATE_INVALID/);
});
test("M05-8 evidence metadata rejects raw document contents",()=>{
 const e=sampleEvidence();e.document_contents="DO_NOT_STORE";
 assert.throws(()=>register([e]),/M05_8_EVIDENCE_CANDIDATE_INVALID/);
});
test("M05-8 excessive candidate count is rejected",()=>{
 const all=Array.from({length:71},(_,i)=>sampleEvidence(
  "DEMO-EVID-"+(i+1)));
 assert.throws(()=>register(all),/M05_8_CANDIDATE_SET_INVALID/);
});
test("M05-8 reviews reject missing register",()=>{
 assert.throws(()=>makeDemoEvidenceReview(),/M05_8_REGISTER_INVALID/);
});
test("M05-8 empty review register does not claim signoff",()=>{
 const r=register(),rv=reviews(r);
 assert.equal(rv.counts.approved,0);
 assert.ok(rv.items.every(x=>x.signoff_obtained===false));
});
test("M05-8 DEMO review note remains non-authoritative",()=>{
 const r=register([sampleEvidence()]),rv=reviews(r,[sampleReview()]);
 assert.equal(rv.notes.length,1);
 assert.equal(rv.notes[0].official_decision,false);
 assert.equal(rv.items[0].review_state,"DEMO_NOTES_RECORDED_NOT_VERIFIED");
});
test("M05-8 review rejects unknown evidence reference",()=>{
 const r=register([sampleEvidence()]);
 assert.throws(()=>reviews(r,[sampleReview("DEMO-NO-REF")]),
  /M05_8_REVIEW_REFERENCE_MISMATCH/);
});
test("M05-8 review rejects mismatched requirement link",()=>{
 const r=register([sampleEvidence()]);
 assert.throws(()=>reviews(r,[sampleReview("DEMO-EVID-1","DATA_DICTIONARY")]),
  /M05_8_REVIEW_REFERENCE_MISMATCH/);
});
test("M05-8 review duplicate ID is rejected",()=>{
 const r=register([sampleEvidence()]);
 assert.throws(()=>reviews(r,[sampleReview(),sampleReview()]),
  /M05_8_DUPLICATE_REVIEW_ID/);
});
test("M05-8 review non-DEMO reviewer ID is rejected",()=>{
 const r=register([sampleEvidence()]),n=sampleReview();n.reviewer_id="real";
 assert.throws(()=>reviews(r,[n]),/M05_8_REVIEW_NOTE_INVALID/);
});
test("M05-8 unknown review reason is rejected",()=>{
 const r=register([sampleEvidence()]),n=sampleReview();n.reason_code="APPROVED";
 assert.throws(()=>reviews(r,[n]),/M05_8_REVIEW_NOTE_INVALID/);
});
test("M05-8 review cannot assert official approval",()=>{
 const r=register([sampleEvidence()]),n=sampleReview();n.assessment="APPROVE";
 assert.throws(()=>reviews(r,[n]),/M05_8_REVIEW_NOTE_INVALID/);
});
test("M05-8 review rejects free-text or unexpected metadata",()=>{
 const r=register([sampleEvidence()]),n=sampleReview();n.free_text="unknown";
 assert.throws(()=>reviews(r,[n]),/M05_8_REVIEW_NOTE_INVALID/);
});
test("M05-8 baseline packet has all official gates blocked",()=>{
 const r=register(),p=packet(r,reviews(r));
 assert.equal(p.gates.length,6);
 assert.equal(p.counts.blocked_gates,6);
 assert.ok(p.gates.every(g=>g.decision==="BLOCKED"));
});
test("M05-8 every requirement belongs to an explicit approval gate",()=>{
 const coverage=new Set(GATE_CATALOG.flatMap(g=>g.requirement_ids));
 assert.ok(REQUIREMENTS.every(r=>coverage.has(r.requirement_id)));
});
test("M05-8 no lineage report is explicitly unavailable",()=>{
 const r=register(),p=packet(r,reviews(r));
 assert.equal(p.issue_review.source_state,"NOT_PROVIDED");
 assert.equal(p.issue_review.unresolved_count,0);
 assert.equal(p.readiness,"BLOCKED_NO_OFFICIAL_EVIDENCE_OR_AUTHORIZATION");
});
test("M05-8 DEMO lineage conflict stays unresolved",()=>{
 const r=register(),p=packet(r,reviews(r),lineage());
 assert.equal(p.issue_review.issues[0].code,"MISSING_FACILITY");
 assert.equal(p.issue_review.unresolved_count,1);
});
test("M05-8 lineage with no issues cannot imply official readiness",()=>{
 const r=register(),p=packet(r,reviews(r),lineage(false));
 assert.equal(p.issue_review.issues.length,0);
 assert.equal(p.counts.blocked_gates,6);
});
test("M05-8 note on lineage conflict does not resolve it",()=>{
 const r=register(),p=packet(r,reviews(r),lineage(),[issueNote()]);
 assert.equal(p.issue_review.notes[0].issue_resolved,false);
 assert.equal(p.issue_review.unresolved_count,1);
});
test("M05-8 issue review rejects nonexisting issue index",()=>{
 const r=register(),n=issueNote();n.issue_index=2;
 assert.throws(()=>packet(r,reviews(r),lineage(),[n]),
  /M05_8_ISSUE_NOTE_INVALID/);
});
test("M05-8 issue review rejects notes without lineage source",()=>{
 const r=register();
 assert.throws(()=>packet(r,reviews(r),null,[issueNote()]),
  /M05_8_ISSUE_NOTES_INVALID/);
});
test("M05-8 duplicate issue note identity is rejected",()=>{
 const r=register();
 assert.throws(()=>packet(r,reviews(r),lineage(),[issueNote(),issueNote()]),
  /M05_8_DUPLICATE_ISSUE_NOTE/);
});
test("M05-8 issue note rejects non-DEMO reviewer",()=>{
 const r=register(),n=issueNote();n.reviewer_id="official";
 assert.throws(()=>packet(r,reviews(r),lineage(),[n]),
  /M05_8_ISSUE_NOTE_INVALID/);
});
test("M05-8 issue review cannot automatically approve a conflict",()=>{
 const r=register(),n=issueNote();n.action="APPROVE_AND_CLOSE";
 assert.throws(()=>packet(r,reviews(r),lineage(),[n]),
  /M05_8_ISSUE_NOTE_INVALID/);
});
test("M05-8 bad lineage synthetic marker is rejected",()=>{
 const r=register(),l=lineage();l.synthetic=false;
 assert.throws(()=>packet(r,reviews(r),l),/M05_8_LINEAGE_SOURCE_INVALID/);
});
test("M05-8 lineage unauthorized permission cannot pass",()=>{
 const r=register(),l=lineage();l.official_authorization=true;
 assert.throws(()=>packet(r,reviews(r),l),/M05_8_LINEAGE_SOURCE_INVALID/);
});
test("M05-8 upstream auto-resolved conflict is rejected",()=>{
 const r=register(),l=lineage();l.issues[0].auto_resolved=true;
 assert.throws(()=>packet(r,reviews(r),l),/M05_8_LINEAGE_SOURCE_INVALID/);
});
test("M05-8 real-looking lineage source reference is rejected",()=>{
 const r=register(),l=lineage();l.issues[0].source_ref="services:REAL";
 assert.throws(()=>packet(r,reviews(r),l),/M05_8_LINEAGE_SOURCE_INVALID/);
});
test("M05-8 mismatched register and review snapshots are rejected",()=>{
 const r=register([sampleEvidence()]),rv=reviews(r);
 const changed=register([sampleEvidence("DEMO-EVID-2")]);
 assert.throws(()=>packet(changed,rv),/M05_8_GATE_REVIEW_INVALID/);
});
test("M05-8 all requirements with DEMO metadata are still blocked",()=>{
 const all=REQUIREMENTS.map((q,i)=>sampleEvidence("DEMO-EVID-"+(i+1),q.requirement_id));
 const r=register(all),rv=reviews(r);
 const p=packet(r,rv,lineage(false));
 assert.equal(p.counts.evidence_candidates,14);
 assert.equal(p.counts.officially_verified_requirements,0);
 assert.equal(p.counts.blocked_gates,6);
});
test("M05-8 packet rejects modified official register state",()=>{
 const r=register();r.official_authorization=true;
 assert.throws(()=>packet(r,reviews(register())),
  /M05_8_GATE_REGISTER_INVALID/);
});
test("M05-8 packet rejects spoofed human review signoff",()=>{
 const r=register(),rv=reviews(r);rv.items[0].signoff_obtained=true;
 assert.throws(()=>packet(r,rv),/M05_8_GATE_REVIEW_INVALID/);
});
test("M05-8 packet forbids tests, merge, deployment and all actions",()=>{
 const r=register(),p=packet(r,reviews(r),lineage());
 for(const key of ["may_run_tests","may_merge","may_deploy","may_connect",
  "may_query","may_write","may_repair","may_score","may_rank",
  "may_award","may_publish","official_authorization",
  "staging_testing_authorized","production_authorized",
  "publishing_authorized"])assert.equal(p[key],false);
});
