/**
 * M05-0 | KODE DITULIS, BELUM DIUJI. Non-official 2026-2030 overview.
 * A multi-year overview must never silently merge scoring schemes across years.
 */
import {SUPPORTED_YEARS,annualPolicy} from "./policy.mjs";
import {annualDemoTotals,annualChecklist,APEL_LEDGER_SCHEMA} from "./reporting.mjs";
export const APEL_TIMELINE_SCHEMA="M05-0-2026-2030-TIMELINE-UNTESTED-1";
export function fiveYearDemoOverview(ledger,facilityId){
 const years=SUPPORTED_YEARS.map(year=>{
  const total=annualDemoTotals(ledger,facilityId,year),
   policy=annualPolicy(year),checklist=annualChecklist(ledger,facilityId,year);
  return {year,reporting_rule_version:policy.draft_rule_version,
   policy_state:policy.policy_state,reported_months:total.reported_months,
   missing_months:total.missing_months,zero_months:checklist.rows.filter(
     x=>x.status==="LAPORAN_NOL").length,total_demo_events:total.total_demo_events,
   is_partial:total.is_partial,scoring_enabled:false,ranking_enabled:false};
 });
 return {schema:APEL_TIMELINE_SCHEMA,synthetic:true,
  from_year:SUPPORTED_YEARS[0],to_year:SUPPORTED_YEARS.at(-1),
  facility_id:facilityId,years,
  dataset_schema:APEL_LEDGER_SCHEMA,
  comparisons_must_disclose_missingness:true,
  scores_across_years_comparable:false,
  official_scoring:false,may_publish:false,official_authorization:false};
}
