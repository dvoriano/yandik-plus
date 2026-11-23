/** M00-G8 | Cross-runtime QA helper: DO NOT RUN until owner approves tests. */
import {readFileSync} from "node:fs";
import {compareDemoAuditPorts,normalizeLegacyDemoAudit}
 from "./bridge.mjs";
const fixture=JSON.parse(readFileSync(
 new URL("./demo_vectors.json",import.meta.url),"utf8"));
if(fixture.schema!=="M00-G8-SYNTHETIC-VECTORS-UNTESTED-1"||
   fixture.synthetic!==true)throw Error("SYNTHETIC_VECTORS_REQUIRED");
const g5=normalizeLegacyDemoAudit({
 source_kind:"G5_LEGACY_DEMO",events:fixture.g5_events});
const g7=normalizeLegacyDemoAudit({
 source_kind:"G7_LEGACY_DEMO",events:fixture.g7_rows});
const comparison=compareDemoAuditPorts(fixture);
process.stdout.write(JSON.stringify({
 g5_head:g5.bridge_head_digest,g7_head:g7.bridge_head_digest,
 format_only_parity_demo:comparison.format_only_parity_demo
})+"\n");
