/** M00-G5 | In-memory notes and audit entries ONLY. */
import {demoHumanReviewFixture,demoReviewerSession}
 from "../m13-crosswalk-review/fixtures.mjs";
import {emptyDemoAuditJournal}
 from "./audit_port.mjs";
export function demoAuditFixture(){
 return {...demoHumanReviewFixture(),
  ...demoReviewerSession(),auditJournal:emptyDemoAuditJournal(),
  link_id:"DEMO-CROSSWALK-ONE",
  action_code:"REQUEST_EVIDENCE_DEMO",
  reason_code:"SOURCE_COMPARISON_DEMO",
  expected_revision:0,expected_audit_revision:0
 };
}
