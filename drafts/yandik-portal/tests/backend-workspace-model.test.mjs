/** CODE_ONLY: 10 declared pure cases; not executed. */
import test from "node:test";
import assert from "node:assert/strict";
import {menus,scope,chooseApel,reportCommand,workflowCommand,shown} from "../backend-workspace-model.mjs";
import {resolveRoute} from "../portal-navigation.mjs";
const core={role_demo:"puskeswan",facilities:[{facility_id:"DEMO-PSW-ALPHA",region_id:"DEMO-REGION-UTARA",label:"Alpha"}]};
const r={synthetic:true,record_id:"DEMO-REC-ALPHA",facility_id:"DEMO-PSW-ALPHA",period:"2026-11",revision:0,candidate_actions:["save_draft","submit"]};
const counts={pengobatan:0,vaksinasi:0,penyuluhan:0,layanan_lain:0};
test("leader aggregate menus",()=>assert.deepEqual(menus("pimpinan"),["pimpinan","pustaka"]));
test("facility cannot see oversight",()=>assert.equal(menus("puskeswan").includes("pengawasan"),false));
test("unknown role denied",()=>assert.deepEqual(menus("other"),[]));
test("scope only from host identity",()=>assert.equal(scope(core,{facility_id:"DEMO-PSW-GAMMA"}).facility_id,"DEMO-PSW-ALPHA"));
test("period bounded",()=>assert.throws(()=>scope(core,{year:2031})));
test("missing record not inferred",()=>assert.equal(chooseApel({apel:{workflow_refs:[]}},11),null));
test("zero explicit",()=>assert.throws(()=>reportCommand(r,counts,null,false,"DEMO-COMMAND-1")));
test("valid draft",()=>assert.equal(reportCommand(r,counts,null,true,"DEMO-COMMAND-1").payload.declared_no_activity,true));
test("workflow revision pin",()=>assert.equal(workflowCommand(r,"submit","DEMO-COMMAND-2").expected_revision,0));
test("unknown vs zero and hash alias",()=>{assert.notEqual(shown(null),shown(0));assert.equal(resolveRoute("#toString").target,"layanan");});
