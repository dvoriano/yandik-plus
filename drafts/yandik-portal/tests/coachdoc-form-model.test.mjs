/** CODE_ONLY | 8 declared tests, not executed. */
import test from "node:test";
import assert from "node:assert/strict";
import {missingEvidence,coachdocCommand,slotGroups,progress} from "../coachdoc-form-model.mjs";
const row={record_id:"DEMO-REC-COACH-ALPHA-2026-1",revision:0,current_revision:0,candidate_actions:["plan"]};
test("blank evidence",()=>assert.equal(missingEvidence(null).length,4));
test("one evidence",()=>assert.equal(missingEvidence({evidence:[{kind:"Agenda"}]}).length,3));
test("command exact",()=>assert.deepEqual(Object.keys(coachdocCommand(row,"plan",{},"DEMO-COMMAND-X")).sort(),["action","command_id","expected_revision","payload","record_id"].sort()));
test("history deny",()=>assert.throws(()=>coachdocCommand({...row,current_revision:1},"plan",{},"DEMO-COMMAND-X")));
test("action denied",()=>assert.throws(()=>coachdocCommand(row,"archive",null,"DEMO-COMMAND-X")));
test("group by source",()=>assert.equal(slotGroups([{activity_id:"A",slot:1},{activity_id:"A",slot:1}]).length,1));
test("empty slots not counted",()=>assert.equal(progress([{snapshot:null}]).planned,0));
test("open and closed distinct",()=>assert.deepEqual(progress([{snapshot:{stage:"FOLLOWUP_OPEN"}},{snapshot:{stage:"CLOSED_DEMO"}}]),{slots:2,planned:2,open:1,closed:1}));
