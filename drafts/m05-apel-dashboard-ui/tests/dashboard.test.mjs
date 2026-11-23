/** M05-14 | QA WRITTEN, ZERO EXECUTED | CODE_ONLY DEMO ONLY. */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoDashboard,M05_14_DASHBOARD_SCHEMA,
 M05_14_MONTH_NAMES,M05_14_STATUS} from "../model.mjs";
import {DEMO_FACILITIES,buildDemoDashboardFixture} from "../fixtures.mjs";
import {emptyDemoLedger,recordDemoReport}
 from "../../m05-apel-multiyear/reporting.mjs";
import {annualPolicy,SUPPORTED_YEARS}
 from "../../m05-apel-multiyear/policy.mjs";

const fixture=()=>buildDemoDashboardFixture();
const build=(opts={})=>{
 const data=fixture();
 return buildDemoDashboard({ledger:data.ledger,facilities:data.facilities,
  year:2026,...opts});
};
const blank={counts:{pengobatan:0,vaksinasi:0,penyuluhan:0,layanan_lain:0},
 investigations:[],kurban_animals:[],evidence_refs:[]};
const demoReport=(facility_id="DEMO-PSW-ALPHA",period="2026-01",
 quantity=1)=>({facility_id,period,declared_no_activity:quantity===0,
 ...blank,counts:{...blank.counts,pengobatan:quantity}});
const authorityFlags=["may_connect","may_query","may_write","may_score",
 "may_rank","may_award","may_publish","may_notify","may_merge","may_deploy",
 "official_authorization"];
test("M05-14 exposes twelve Indonesian month labels",()=>{
 assert.equal(M05_14_MONTH_NAMES.length,12);
 assert.equal(M05_14_MONTH_NAMES[0],"Jan");
});
test("M05-14 distinguishes three monthly reporting states",()=>{
 assert.equal(Object.keys(M05_14_STATUS).length,3);
});
test("M05-14 fixtures contain only fictional facility identities",()=>{
 assert.ok(DEMO_FACILITIES.every(f=>f.facility_id.startsWith("DEMO-PSW-")));
});
test("M05-14 fixture source explicitly states no real facility data",()=>{
 const data=fixture();
 assert.equal(data.metadata.no_real_facility_data,true);
 assert.equal(data.metadata.not_official_reporting,true);
});
test("M05-14 fixture returns a fresh ledger for each build",()=>{
 const a=fixture(),b=fixture();
 assert.notStrictEqual(a.ledger,b.ledger);
 assert.notStrictEqual(a.facilities,b.facilities);
});
test("M05-14 dashboard uses the dedicated untested schema",()=>{
 assert.equal(build().schema,M05_14_DASHBOARD_SCHEMA);
});
test("M05-14 dashboard remains DEMO only",()=>{
 const m=build();
 assert.equal(m.synthetic,true);
 assert.equal(m.mode,"READ_ONLY_DEMO_UI_MODEL");
});
test("M05-14 dashboard offers years 2026 through 2030",()=>{
 assert.deepEqual(build().options.years,[...SUPPORTED_YEARS]);
});
test("M05-14 dashboard returns twelve calendar months",()=>{
 assert.equal(build().months.length,12);
});
test("M05-14 dashboard has only three DEMO facilities in the fixture",()=>{
 assert.equal(build().summary.facility_count,3);
});
test("M05-14 facility rows are alphabetical by DEMO ID",()=>{
 const ids=build().facility_rows.map(x=>x.facility_id);
 assert.deepEqual(ids,[...ids].sort());
});
test("M05-14 2026 includes sixteen submitted facility-months",()=>{
 assert.equal(build().summary.reported_facility_months,16);
});
test("M05-14 2026 includes twenty unreported facility-months",()=>{
 assert.equal(build().summary.missing_facility_months,20);
});
test("M05-14 2026 contains three explicit zero reports",()=>{
 assert.equal(build().summary.explicit_zero_reports,3);
});
test("M05-14 2026 recorded services are derived from DEMO event counts",()=>{
 assert.equal(build().summary.observed_demo_events,375);
});
test("M05-14 Feb 2026 includes explicit zero and positive reports",()=>{
 const feb=build().months[1];
 assert.equal(feb.facilities_reported,3);
 assert.equal(feb.explicit_zero_reports,1);
 assert.equal(feb.observed_demo_events,46);
});
test("M05-14 June 2026 includes a location-event investigation once",()=>{
 assert.equal(build().months[5].observed_demo_events,32);
});
test("M05-14 August 2026 counts an ante and post animal only once",()=>{
 const f=build().facility_rows.find(x=>x.facility_id==="DEMO-PSW-ALPHA");
 assert.equal(f.months[7].observed_demo_events,48);
});
test("M05-14 reported zero has numeric value zero",()=>{
 const m=build().facility_rows.find(x=>x.facility_id==="DEMO-PSW-ALPHA").months[2];
 assert.equal(m.status,"LAPORAN_NOL");
 assert.equal(m.observed_demo_events,0);
});
test("M05-14 unreported month has null value, not zero",()=>{
 const m=build().facility_rows.find(x=>x.facility_id==="DEMO-PSW-BETA").months[2];
 assert.equal(m.status,"BELUM_DILAPORKAN");
 assert.equal(m.observed_demo_events,null);
});
test("M05-14 March 2026 respects reported zero versus missing",()=>{
 const m=build().months[2];
 assert.equal(m.facilities_reported,2);
 assert.equal(m.facilities_not_reported,1);
});
test("M05-14 filters region without ranking facilities",()=>{
 const m=build({region_id:"DEMO-REGION-UTARA"});
 assert.equal(m.summary.facility_count,2);
 assert.equal(m.summary.reported_facility_months,13);
});
test("M05-14 filters single facility within its DEMO region",()=>{
 const m=build({region_id:"DEMO-REGION-UTARA",
  facility_id:"DEMO-PSW-BETA"});
 assert.equal(m.summary.facility_count,1);
 assert.equal(m.summary.observed_demo_events,78);
});
test("M05-14 a region selector keeps only its facilities",()=>{
 const m=build({region_id:"DEMO-REGION-SELATAN"});
 assert.equal(m.summary.facility_count,1);
 assert.equal(m.facility_rows[0].facility_id,"DEMO-PSW-GAMMA");
});
test("M05-14 invalid region is rejected",()=>{
 assert.throws(()=>build({region_id:"DEMO-REGION-NOT-THERE"}),
  /M05_14_REGION_FILTER_INVALID/);
});
test("M05-14 invalid facility is rejected",()=>{
 assert.throws(()=>build({facility_id:"DEMO-PSW-NOT-THERE"}),
  /M05_14_FACILITY_FILTER_INVALID/);
});
test("M05-14 cross-region facility selection is rejected",()=>{
 assert.throws(()=>build({region_id:"DEMO-REGION-SELATAN",
  facility_id:"DEMO-PSW-ALPHA"}),/M05_14_CROSS_FILTER_MISMATCH/);
});
test("M05-14 invalid year is rejected rather than converted",()=>{
 assert.throws(()=>build({year:"2026"}),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-14 year 2031 cannot inherit the 2030 rule",()=>{
 assert.throws(()=>build({year:2031}),/APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-14 2027 demo year has six reported months",()=>{
 assert.equal(build({year:2027}).summary.reported_facility_months,6);
});
test("M05-14 2027 has its own policy version",()=>{
 const m=build({year:2027});
 assert.equal(m.policy_draft_version,annualPolicy(2027).draft_rule_version);
});
test("M05-14 2027 recorded services remain independent of 2026",()=>{
 assert.equal(build({year:2027}).summary.observed_demo_events,60);
});
test("M05-14 2028 has no submitted DEMO months",()=>{
 assert.equal(build({year:2028}).summary.reported_facility_months,0);
});
test("M05-14 2028 no reports means null aggregate, never zero",()=>{
 assert.equal(build({year:2028}).summary.observed_demo_events,null);
});
test("M05-14 2029 without reports also has null aggregate",()=>{
 assert.equal(build({year:2029}).summary.observed_demo_events,null);
});
test("M05-14 2030 without reports is not an official finding",()=>{
 const m=build({year:2030});
 assert.equal(m.summary.observed_demo_events,null);
 assert.equal(m.officially_verified,false);
});
test("M05-14 complete explicit zero is distinguishable from no reports",()=>{
 let ledger=emptyDemoLedger();
 ledger=recordDemoReport(ledger,demoReport("DEMO-PSW-ALPHA","2026-01",0));
 const m=buildDemoDashboard({ledger,facilities:[DEMO_FACILITIES[0]],year:2026});
 assert.equal(m.summary.observed_demo_events,0);
 assert.equal(m.summary.explicit_zero_reports,1);
});
test("M05-14 invalid real facility identifiers are rejected",()=>{
 const a=fixture();
 a.facilities[0].facility_id="REAL-PUSKESWAN-ID";
 assert.throws(()=>buildDemoDashboard({...a,year:2026}),
  /M05_14_FACILITY_INVALID/);
});
test("M05-14 facility labels cannot include HTML",()=>{
 const a=fixture();
 a.facilities[0].facility_label="Puskeswan DEMO <script>";
 assert.throws(()=>buildDemoDashboard({...a,year:2026}),
  /M05_14_FACILITY_INVALID/);
});
test("M05-14 region labels cannot include HTML",()=>{
 const a=fixture();
 a.facilities[0].region_label="Wilayah DEMO <b>";
 assert.throws(()=>buildDemoDashboard({...a,year:2026}),
  /M05_14_FACILITY_INVALID/);
});
test("M05-14 conflicting region names are rejected",()=>{
 const a=fixture();
 a.facilities[1].region_label="Wilayah DEMO Other";
 assert.throws(()=>buildDemoDashboard({...a,year:2026}),
  /M05_14_REGION_NAME_CONFLICT/);
});
test("M05-14 duplicate facility identity is rejected",()=>{
 const a=fixture();
 a.facilities.push({...a.facilities[0]});
 assert.throws(()=>buildDemoDashboard({...a,year:2026}),
  /M05_14_FACILITY_INVALID/);
});
test("M05-14 a source record for an unknown facility is rejected",()=>{
 const a=fixture();
 a.facilities=a.facilities.filter(f=>f.facility_id!=="DEMO-PSW-GAMMA");
 assert.throws(()=>buildDemoDashboard({...a,year:2026}),
  /M05_14_UNKNOWN_LEDGER_FACILITY/);
});
test("M05-14 malformed ledger is rejected",()=>{
 assert.throws(()=>buildDemoDashboard({
  ledger:{},facilities:DEMO_FACILITIES,year:2026}),
  /M05_14_LEDGER_INVALID/);
});
test("M05-14 a tampered ledger report must fail M05-0 validation",()=>{
 const a=fixture();
 a.ledger.records[0].total_demo_events=123456;
 assert.throws(()=>buildDemoDashboard({...a,year:2026}),
  /APEL_LEDGER_RECORD_TAMPERED/);
});
test("M05-14 no selected facilities does not imply zero recorded services",()=>{
 const m=buildDemoDashboard({ledger:emptyDemoLedger(),facilities:[],year:2026});
 assert.equal(m.summary.facility_count,0);
 assert.equal(m.summary.observed_demo_events,null);
});
test("M05-14 timeliness and official rank always remain unavailable",()=>{
 const m=build();
 assert.equal(m.summary.timeliness,null);
 assert.equal(m.summary.official_rank,null);
});
test("M05-14 all source reconciliation and historical comparisons remain unverified",()=>{
 const m=build();
 assert.equal(m.all_sources_reconciled,false);
 assert.equal(m.can_compare_across_years,false);
});
test("M05-14 all permissions to write score rank award or publish are denied",()=>{
 const m=build();
 assert.ok(authorityFlags.every(k=>m[k]===false));
});
test("M05-14 no month may claim authoritative verification",()=>{
 const m=build();
 assert.ok(m.months.every(x=>x.official_verified===false));
});
