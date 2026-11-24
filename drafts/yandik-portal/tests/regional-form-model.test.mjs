/** CODE_ONLY | 8 JS declarations; not executed. */
import test from "node:test";
import assert from "node:assert/strict";
import {sourceFields,reviewCommand,coverageText,filterRows,fmt} from "../regional-form-model.mjs";
const row={record_id:"DEMO-REGREC-MEDICINE-N",review_revision:2,review_state:"CLARIFICATION_REQUESTED_DEMO",candidate_actions:["record_discussion"],observation:{period:"2026-11",site_ref:"DEMO-SITE-X",official_authorization:false}};
test("unknown not zero",()=>assert.notEqual(fmt(null),fmt(0)));
test("missing coverage",()=>assert.match(coverageText({available:false,rows:null}),/tidak diketahui/));
test("empty coverage",()=>assert.match(coverageText({available:true,rows:[]}),/tidak ada catatan/));
test("source fields",()=>assert.equal(sourceFields("medicine",row.observation).length,2));
test("no official source",()=>assert.throws(()=>sourceFields("medicine",{official_authorization:true})));
test("review exact envelope",()=>assert.deepEqual(Object.keys(reviewCommand(row,"record_discussion","CHECK_SOURCE_DEMO","DEMO-COMMAND-C5-1")).sort(),["action","command_id","expected_revision","reason_code","record_id"].sort()));
test("denied action",()=>assert.throws(()=>reviewCommand(row,"approve","CHECK_SOURCE_DEMO","DEMO-COMMAND-C5-1")));
test("scope filter",()=>assert.equal(filterRows([row],"2026-11","CLARIFICATION_REQUESTED_DEMO").length,1));
