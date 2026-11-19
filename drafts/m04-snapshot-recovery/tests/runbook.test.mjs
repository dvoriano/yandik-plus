/** M04-I6C | 5 scenarios WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {I6C_SNAPSHOT_SCHEMA} from "../snapshot.mjs";
import {I6C_RETENTION_SCHEMA} from "../retention.mjs";
import {createRecoveryJournal} from "../recovery.mjs";
import {buildCutoverRunbook,REQUIRED_GATES,I6C_RUNBOOK_SCHEMA} from "../runbook.mjs";
const snapshot=()=>({schema:I6C_SNAPSHOT_SCHEMA,synthetic:true,
 manifest_sha256:"b".repeat(64),may_write:false,atomic_snapshot_proven:false,
 target_locked:false,official_authorization:false});
const retention=()=>({schema:I6C_RETENTION_SCHEMA,policy_approved:false,can_delete:false});
const journal=()=>createRecoveryJournal(snapshot(),"DEMO-I6C-RUN-ABC","DEMO-USER-MAKER");
test("I6C runbook has all explicit server/governance gates pending",()=>{
 const r=buildCutoverRunbook(snapshot(),retention(),journal());
 assert.equal(r.schema,I6C_RUNBOOK_SCHEMA);
 assert.equal(r.gates.length,REQUIRED_GATES.length);
 assert.ok(r.gates.every(g=>g.status==="BELUM_DIBUKTIKAN"&&g.evidence_id===null));
});
test("I6C runbook never authorizes migration or deletion",()=>{
 const r=buildCutoverRunbook(snapshot(),retention(),journal());
 for(const field of ["all_gates_verified","may_execute","may_write",
  "may_cutover","may_delete","official_authorization"])assert.equal(r[field],false);
});
test("I6C refuses forged atomic readiness or write permission",()=>{
 assert.throws(()=>buildCutoverRunbook({...snapshot(),atomic_snapshot_proven:true},
  retention(),journal()),/RUNBOOK_SNAPSHOT_INVALID/);
 assert.throws(()=>buildCutoverRunbook({...snapshot(),may_write:true},
  retention(),journal()),/RUNBOOK_SNAPSHOT_INVALID/);
});
test("I6C refuses fake approved retention policy",()=>{
 assert.throws(()=>buildCutoverRunbook(snapshot(),{...retention(),policy_approved:true},
  journal()),/RUNBOOK_RETENTION_INVALID/);
});
test("I6C binds journal to identical source manifest hash",()=>{
 const j=journal();
 assert.throws(()=>buildCutoverRunbook({...snapshot(),manifest_sha256:"c".repeat(64)},
  retention(),j),/RUNBOOK_JOURNAL_MISMATCH/);
});
