/** M05-0 | 6 SCENARIOS WRITTEN, NOT EXECUTED. CODE_ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {multiyearDemoLedger,DEMO_FACILITIES} from "../fixtures.mjs";
import {fiveYearDemoOverview} from "../timeline.mjs";
import {annualChecklist,annualDemoTotals} from "../reporting.mjs";
test("M05-0 cross-year overview returns five separate rows",()=>{
 const x=fiveYearDemoOverview(multiyearDemoLedger(),DEMO_FACILITIES[0]);
 assert.deepEqual(x.years.map(r=>r.year),[2026,2027,2028,2029,2030]);
 assert.equal(x.from_year,2026);assert.equal(x.to_year,2030);
});
test("M05-0 each year has distinct draft policy version",()=>{
 const x=fiveYearDemoOverview(multiyearDemoLedger(),DEMO_FACILITIES[0]);
 assert.equal(new Set(x.years.map(r=>r.reporting_rule_version)).size,5);
});
test("M05-0 each year is partial and cannot be ranked officially",()=>{
 const x=fiveYearDemoOverview(multiyearDemoLedger(),DEMO_FACILITIES[0]);
 assert.ok(x.years.every(r=>r.reported_months===1&&
  r.missing_months===11&&r.is_partial&&r.scoring_enabled===false));
 assert.equal(x.scores_across_years_comparable,false);
 assert.equal(x.may_publish,false);
});
test("M05-0 DEMO fixture uses only fake facility IDs",()=>{
 const ledger=multiyearDemoLedger();
 assert.ok(ledger.records.every(r=>r.synthetic===true&&r.facility_id.startsWith("DEMO-PSW-")));
});
test("M05-0 zero report remains one reported month, not missing",()=>{
 const ledger=multiyearDemoLedger();
 const c=annualChecklist(ledger,DEMO_FACILITIES[1],2026);
 assert.equal(c.reported_months,undefined); // intentionally keep no alias
 assert.equal(c.reporting_months,1);
 assert.equal(c.rows[1].status,"LAPORAN_NOL");
 assert.equal(annualDemoTotals(ledger,DEMO_FACILITIES[1],2026).total_demo_events,0);
});
test("M05-0 one kurban animal and one investigation produce two demo events",()=>{
 const ledger=multiyearDemoLedger();
 const c=annualDemoTotals(ledger,DEMO_FACILITIES[1],2027);
 assert.equal(c.total_demo_events,2);
 assert.equal(c.official_scoring,false);
});
