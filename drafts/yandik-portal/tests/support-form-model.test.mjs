/** CODE_ONLY | 8 declarations; not executed. */
import test from "node:test";
import assert from "node:assert/strict";
import {filterSupport,supportCommand,pendingShipments,pendingHandovers,monitorable} from "../support-form-model.mjs";
const rows=[{record_id:"DEMO-REC-X",revision:0,assessment:"ABSENT",label:"Stetoscope",item_id:"C.1.a",group:"C1"},{record_id:null,revision:null,assessment:"ABSENT",label:"Vaksin",item_id:"A.5.15",group:"A5"}];
test("attention only compatible",()=>assert.equal(filterSupport(rows,"attention").length,1));
test("pending not eligible",()=>assert.equal(filterSupport(rows,"pending").length,1));
test("search",()=>assert.equal(filterSupport(rows,"all","steto").length,1));
test("revision pin",()=>assert.equal(supportCommand({...rows[0],candidate_actions:["propose"]},"propose",{},"DEMO-COMMAND-X").expected_revision,0));
test("no denied action",()=>assert.throws(()=>supportCommand(rows[0],"dispatch",{},"DEMO-COMMAND-X")));
const snap={shipments:[{shipment_ref:"DEMO-S",quantity:5}],receipts:[{shipment_ref:"DEMO-S",receipt_ref:"DEMO-R",good:2,damaged:1}],handovers:[]};
test("partial receipt",()=>assert.equal(pendingShipments(snap)[0].remaining,2));
test("pending handover",()=>assert.equal(pendingHandovers(snap).length,1));
test("monitor only after handover",()=>{assert.equal(monitorable(snap).length,0);assert.equal(monitorable({...snap,handovers:[{receipt_ref:"DEMO-R"}]}).length,1);});
