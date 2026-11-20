/**
 * M05-4 | KODE DITULIS, BELUM DIUJI.
 * Presentation model for a nonofficial APEL dashboard. No UI or live API.
 */
import {SUPPORTED_YEARS,requireYear} from "../m05-apel-multiyear/policy.mjs";
import {buildAnnualDescriptiveReport} from "./report.mjs";
import {buildMultiYearTrend} from "./trends.mjs";
export const M05_4_DASHBOARD_SCHEMA="M05-4-DASHBOARD-VIEWMODEL-UNTESTED-1";
const fail=code=>{throw Error(code)};
export function buildDashboardViewModel({previews,year=2026}={}){
 requireYear(year);
 if(!Array.isArray(previews))fail("M05_DASHBOARD_INPUT_INVALID");
 const annual=buildAnnualDescriptiveReport({previews,year});
 const trends=["SERVICE_VOLUME","REPORTING_CONSISTENCY",
  "TIMELINESS","SUPPORT_REALIZATION","DISTRICT_SERVICE"].map(metric_key=>
   buildMultiYearTrend({previews,metric_key}));
 return {schema:M05_4_DASHBOARD_SCHEMA,synthetic:true,
  mode:"READ_ONLY_DESCRIPTIVE_VIEWMODEL",
  selected_year:year,available_years:[...SUPPORTED_YEARS],
  annual,trends,
  notices:[
   "DATA DEMO DAN BELUM DIVERIFIKASI",
   "JUMLAH SUBMIT BUKAN KEPATUHAN RESMI",
   "DATA TIDAK TERSEDIA TIDAK DIANGGAP NOL",
   "ANGKA ANTAR TAHUN BELUM TENTU DAPAT DIPERBANDINGKAN"
  ],
  no_scores:true,no_rankings:true,no_awards:true,
  no_publication:true,official_authorization:false};
}
