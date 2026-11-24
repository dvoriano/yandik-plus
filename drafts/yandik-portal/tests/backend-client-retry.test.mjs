/** CODE_ONLY | 4 declarations; no execution. */
import test from "node:test";
import assert from "node:assert/strict";
import {createDraftClient,queueDraft,sendQueued} from "../../yandik-backend-contract/api_client.mjs";
const cmd={command_id:"DEMO-COMMAND-C8",record_id:"DEMO-REC-ALPHA",expected_revision:0,action:"save_draft"};
const res=(status,data=null)=>({status,data,synthetic:true,official_authorization:false,http_registered:false});
test("malformed ACK stays pending",async()=>assert.equal((await sendQueued(createDraftClient(async()=>res(200,{})),queueDraft(cmd))).status,"PENDING"));
test("lost ACK retries same command",async()=>{let calls=[];const client=createDraftClient(async r=>{calls.push(r.body);if(calls.length===1)throw Error("lost");return res(200,{record_id:cmd.record_id,revision:1});});const a=await sendQueued(client,queueDraft(cmd));const b=await sendQueued(client,a);assert.equal(b.status,"ACK_DEMO");assert.deepEqual(calls[0],calls[1]);});
test("conflict never auto retry",async()=>assert.equal((await sendQueued(createDraftClient(async()=>res(409)),queueDraft(cmd))).status,"CONFLICT"));
test("reject non synthetic envelope",async()=>assert.equal((await sendQueued(createDraftClient(async()=>({status:200,data:{}})),queueDraft(cmd))).status,"PENDING"));
