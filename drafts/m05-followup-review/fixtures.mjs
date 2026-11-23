/** M05-17 | Synthetic contexts only, no network, no live identifiers. */
import {buildDemoCorrectionContext}
 from "../m05-report-correction/correction.mjs";
import {demoM0516Adapters,buildDemoCorrectionWorkflowFixture}
 from "../m05-report-correction/fixtures.mjs";

export function buildDemoFollowupContexts(){
 const {workflow}=buildDemoCorrectionWorkflowFixture();
 const examples=[
  ["DEMO-PSW-ALPHA","2026-01"],
  ["DEMO-PSW-BETA","2026-02"],
  ["DEMO-PSW-GAMMA","2026-06"],
  ["DEMO-PSW-ALPHA","2029-04"]
 ];
 return examples.map(([facility_id,period])=>buildDemoCorrectionContext({
  workflow,facility_id,period,...demoM0516Adapters(facility_id)
 }));
}
