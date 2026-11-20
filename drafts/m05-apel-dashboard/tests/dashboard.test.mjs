/** M05-4 | 22 scenarios WRITTEN, NOT EXECUTED (CODE_ONLY). */
import test from "node:test";
import assert from "node:assert/strict";
import {buildAnnualDescriptiveReport} from "../report.mjs";
import {buildMultiYearTrend} from "../trends.mjs";
import {buildDashboardViewModel} from "../dashboard.mjs";
import {previewAnnualRuleFacts} from "../../m05-apel-rules/preview.mjs";
import {demoRule,demoEvidence,FACILITY_ID} from "../../m05-apel-rules/fixtures.mjs";
const make=(facility,year,metrics=["SERVICE_VOLUME","REPORTING_CONSISTENCY"])=>{
 const {ledger,checklist}=demoEvidence(year);
 const p=previewAnnualRuleFacts({rule:demoRule(year,metrics),ledger,checklist});
 return {...p,facility_id:facility};
};
const base=make(FACILITY_ID,2026);
test("M05-4 annual report includes selected year and DEMO facility",()=>{
 const r=buildAnnualDescriptiveReport({previews:[base],year:2026});
 assert.equal(r.year,2026);assert.equal(r.facility_count,1);
 assert.equal(r.schema,"M05-4-APEL-DESCRIPTIVE-REPORT-UNTESTED-1");
});
test("M05-4 raw service volume stays distinct from submitted months",()=>{
 const r=buildAnnualDescriptiveReport({previews:[base],year:2026});
 assert.equal(r.metrics.find(x=>x.metric_key==="SERVICE_VOLUME").total_observed_demo_value,1);
 assert.equal(r.metrics.find(x=>x.metric_key==="REPORTING_CONSISTENCY").total_observed_demo_value,4);
});
test("M05-4 aggregation is restricted to the requested year",()=>{
 const other=make("DEMO-PSW-OTHER",2027);
 const r=buildAnnualDescriptiveReport({previews:[base,other],year:2026});
 assert.equal(r.facility_count,1);
});
test("M05-4 duplicate facility-year is rejected",()=>{
 assert.throws(()=>buildAnnualDescriptiveReport({previews:[base,base],year:2026}),
  /M05_REPORT_DUPLICATE_FACILITY_YEAR/);
});
test("M05-4 missing facilities are not silently counted as zero",()=>{
 const r=buildAnnualDescriptiveReport({previews:[],year:2026});
 const m=r.metrics.find(x=>x.metric_key==="SERVICE_VOLUME");
 assert.equal(r.facility_count,0);assert.equal(m.total_observed_demo_value,null);
});
test("M05-4 metric absent from proposal is unavailable not zero",()=>{
 const p=make(FACILITY_ID,2026,["SERVICE_VOLUME"]);
 const r=buildAnnualDescriptiveReport({previews:[p],year:2026});
 const m=r.metrics.find(x=>x.metric_key==="REPORTING_CONSISTENCY");
 assert.equal(m.available_count,0);assert.equal(m.total_observed_demo_value,null);
});
test("M05-4 explicitly observed zero remains distinct from unavailable",()=>{
 const p=structuredClone(base);
 const row=p.rows.find(x=>x.metric_key==="SERVICE_VOLUME");
 row.observed_demo_value=0;
 const r=buildAnnualDescriptiveReport({previews:[p],year:2026});
 const m=r.metrics.find(x=>x.metric_key==="SERVICE_VOLUME");
 assert.equal(m.available_count,1);assert.equal(m.total_observed_demo_value,0);
});
test("M05-4 null metric remains unavailable",()=>{
 const p=make(FACILITY_ID,2026,["TIMELINESS"]);
 const r=buildAnnualDescriptiveReport({previews:[p],year:2026});
 const m=r.metrics.find(x=>x.metric_key==="TIMELINESS");
 assert.equal(m.unavailable_count,1);assert.equal(m.total_observed_demo_value,null);
});
test("M05-4 invalid preview or claimed official flag is rejected",()=>{
 assert.throws(()=>buildAnnualDescriptiveReport({
  previews:[{...base,official_scoring:true}],year:2026}),/M05_REPORT_PREVIEW_INVALID/);
});
test("M05-4 duplicate metric row rejected",()=>{
 const p=structuredClone(base);p.rows.push({...p.rows[0]});
 assert.throws(()=>buildAnnualDescriptiveReport({previews:[p],year:2026}),
  /M05_REPORT_ROW_INVALID|M05_REPORT_DUPLICATE_METRIC/);
});
test("M05-4 no score, rank, award or publication is enabled",()=>{
 const r=buildAnnualDescriptiveReport({previews:[base],year:2026});
 for(const k of ["official_compliance","official_scoring","ranking_enabled",
  "award_enabled","may_publish","official_authorization"])assert.equal(r[k],false);
});
test("M05-4 input size is bounded",()=>{
 assert.throws(()=>buildAnnualDescriptiveReport({
  previews:Array(1001).fill(base),year:2026}),/M05_REPORT_INPUT_INVALID/);
});
test("M05-4 cross-year trend is sorted and raw-only",()=>{
 const p2027=make("DEMO-PSW-OTHER",2027);
 const t=buildMultiYearTrend({previews:[p2027,base],years:[2027,2026]});
 assert.deepEqual(t.annual.map(x=>x.year),[2026,2027]);
 assert.ok(t.annual.every(x=>x.year_over_year_change===null&&
  x.year_over_year_percent===null&&x.comparable_to_previous_year===false));
});
test("M05-4 trend marks absent years explicitly",()=>{
 const t=buildMultiYearTrend({previews:[base]});
 assert.deepEqual(t.missing_years,[2027,2028,2029,2030]);
});
test("M05-4 trend never invents growth when values exist",()=>{
 const p2027=make("DEMO-PSW-OTHER",2027);
 const t=buildMultiYearTrend({previews:[base,p2027]});
 assert.equal(t.growth_calculated,false);
 assert.equal(t.cross_year_comparability_verified,false);
 assert.equal(t.annual[1].year_over_year_percent,null);
});
test("M05-4 unknown trend year or duplicate year selection rejected",()=>{
 assert.throws(()=>buildMultiYearTrend({previews:[base],years:[2026,2031]}),
  /M05_TREND_YEARS_INVALID/);
 assert.throws(()=>buildMultiYearTrend({previews:[base],years:[2026,2026]}),
  /M05_TREND_YEARS_INVALID/);
});
test("M05-4 unsupported trend metric rejected",()=>{
 assert.throws(()=>buildMultiYearTrend({previews:[base],metric_key:"AWARD_SCORE"}),
  /M05_TREND_METRIC_INVALID/);
});
test("M05-4 dashboard provides all five year selections",()=>{
 const d=buildDashboardViewModel({previews:[base],year:2026});
 assert.deepEqual(d.available_years,[2026,2027,2028,2029,2030]);
 assert.equal(d.trends.length,5);
});
test("M05-4 dashboard notices source limitations",()=>{
 const d=buildDashboardViewModel({previews:[base]});
 assert.ok(d.notices.some(x=>x.includes("BELUM TENTU")));
 assert.equal(d.no_scores,true);assert.equal(d.no_rankings,true);
});
test("M05-4 dashboard rejects unsupported selected year",()=>{
 assert.throws(()=>buildDashboardViewModel({previews:[base],year:2031}),
  /APEL_YEAR_NOT_CONFIGURED/);
});
test("M05-4 dashboard rejects non-array input",()=>{
 assert.throws(()=>buildDashboardViewModel({previews:null}),
  /M05_DASHBOARD_INPUT_INVALID/);
});
test("M05-4 aggregation overflow fails closed",()=>{
 const p=structuredClone(base);
 p.rows.find(x=>x.metric_key==="SERVICE_VOLUME").observed_demo_value=Number.MAX_SAFE_INTEGER;
 const q=structuredClone(p);q.facility_id="DEMO-PSW-OTHER";
 assert.throws(()=>buildAnnualDescriptiveReport({previews:[p,q],year:2026}),
  /M05_REPORT_AGGREGATE_OVERFLOW/);
});
