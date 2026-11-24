/**
 * M05-4 | KODE DITULIS, BELUM DIUJI.
 * Cross-year display is a year-by-year series, not a growth comparison.
 * No percentage change or winner when policy/taxonomy comparability is unknown.
 */
import {SUPPORTED_YEARS,requireYear} from "../m05-apel-multiyear/policy.mjs";
import {buildAnnualDescriptiveReport,M05_4_REPORT_SCHEMA}
 from "./report.mjs";
export const M05_4_TREND_SCHEMA="M05-4-MULTIYEAR-TREND-UNTESTED-1";
const fail=code=>{throw Error(code)};
export function buildMultiYearTrend({previews,years=SUPPORTED_YEARS,
 metric_key="SERVICE_VOLUME"}={}){
 if(!Array.isArray(years)||!years.length||years.length>5||
  new Set(years).size!==years.length||
  years.some(y=>!SUPPORTED_YEARS.includes(y)))fail("M05_TREND_YEARS_INVALID");
 const allowed=["SERVICE_VOLUME","REPORTING_CONSISTENCY",
  "TIMELINESS","SUPPORT_REALIZATION","DISTRICT_SERVICE"];
 if(!allowed.includes(metric_key))fail("M05_TREND_METRIC_INVALID");
 const ordered=[...years].sort((a,b)=>a-b);
 const annual=ordered.map(year=>{
  const report=buildAnnualDescriptiveReport({previews,year});
  const metric=report.metrics.find(x=>x.metric_key===metric_key);
  return {year,facility_count:report.facility_count,
   available_facility_count:metric.available_count,
   unavailable_facility_count:metric.unavailable_count,
   total_observed_demo_value:metric.total_observed_demo_value,
   unit:metric.unit,source_labels:metric.source_labels,
   evidence_state:"DESCRIPTIVE_UNVERIFIED",
   year_over_year_change:null,year_over_year_percent:null,
   comparable_to_previous_year:false};
 });
 return {schema:M05_4_TREND_SCHEMA,synthetic:true,
  mode:"MULTIYEAR_DESCRIPTIVE_SERIES",metric_key,annual,
  comparison_policy:"YEAR_BY_YEAR_ONLY_NO_INFERRED_COMPARABILITY",
  missing_years:SUPPORTED_YEARS.filter(y=>!annual.some(row=>row.year===y&&row.facility_count>0)),
  cross_year_comparability_verified:false,
  growth_calculated:false,ranking_enabled:false,scoring_enabled:false,
  awards_enabled:false,may_publish:false,official_authorization:false};
}
