/** CODE_ONLY | 10 declared tests, not executed. */
import test from "node:test";
import assert from "node:assert/strict";
import {annualCommand,observation,profilePayload,staffCommand,groupProgress} from "../annual-form-model.mjs";
const item={kind:"asset",group:"A4",id:"X"},r={record_id:"DEMO-REC-X",revision:3,candidate_actions:["save_item"]};
test("unknown is null",()=>assert.equal(observation(item,"UNKNOWN").total,null));
test("absent is zero",()=>assert.equal(observation(item,"ABSENT").total,0));
test("partial quantity",()=>assert.equal(observation(item,"AVAILABLE",3,1).usable,1));
test("quantity invalid",()=>assert.throws(()=>observation(item,"AVAILABLE",1,2)));
test("fractional asset",()=>assert.throws(()=>observation(item,"AVAILABLE",1.5,1)));
test("stock not numeric",()=>assert.equal(observation({kind:"stock",group:"A5"},"AVAILABLE",4,3,"LIMITED_REPORTED").total,null));
test("copy progress",()=>assert.deepEqual(groupProgress([item],{X:{confirmed:false}},"A4"),{total:1,confirmed:0,copied:1}));
test("profile unknown clears refs",()=>assert.equal(profilePayload("legalitas",{observed_on:"2026-01-01",status:"UNKNOWN",reference:"DEMO-X"}).reference,null));
test("command revision",()=>assert.equal(annualCommand(r,"save_item",{},"DEMO-COMMAND-X").expected_revision,3));
test("staff action deny",()=>assert.throws(()=>staffCommand({candidate_actions:[]},"transfer",{},"DEMO-COMMAND-X")));
