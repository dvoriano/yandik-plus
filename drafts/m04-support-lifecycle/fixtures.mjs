/** Shared S12–S15 synthetic context; no runtime execution in CODE_ONLY. */
import {NEEDS,DEMO_PACKAGES,demoReview} from "../m04-support-distribution-plan/fixtures.mjs";
import {saveSchedule} from "../m04-support-distribution-plan/distribution.mjs";
export function demoContext(){
 const reviews=[demoReview()];let schedules=[];
 schedules=saveSchedule(NEEDS,DEMO_PACKAGES,reviews,schedules,{id:"DEMO-JADWAL-001",
  package_id:"DEMO-PKG-001",need_id:"DEMO-NEED-001",date_demo:"2026-12-01",method:"antar",quantity:2});
 schedules=saveSchedule(NEEDS,DEMO_PACKAGES,reviews,schedules,{id:"DEMO-JADWAL-002",
  package_id:"DEMO-PKG-001",need_id:"DEMO-NEED-002",date_demo:"2026-12-02",method:"ambil",quantity:1});
 return {needs:NEEDS,packages:DEMO_PACKAGES,reviews,schedules};
}
