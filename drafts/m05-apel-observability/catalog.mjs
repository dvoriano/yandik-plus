/**
 * M05-13 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | DEMO ONLY.
 * A vocabulary of questions to monitor, NOT instrumented production telemetry.
 * No thresholds, uptime claims, real access logs, notification destinations, or timers.
 */
import {REQUIREMENTS} from "../m05-apel-evidence/evidence.mjs";
import {M05_12_STOP_CONDITIONS}
 from "../m05-apel-release-readiness/rollback.mjs";
export const M05_13_CATALOG_SCHEMA="M05-13-OBSERVABILITY-CATALOG-UNTESTED-1";
const DATA=[
 ["INGEST_STATUS","WORKFLOW","REPORT_REVISIONS","HEALTHCHECK_FAILURE",
  "Is the intake and submission workflow available and version-consistent?"],
 ["REPORT_REVISION_LINK","WORKFLOW","REPORT_REVISIONS","REPORT_REVISION_MISMATCH",
  "Does a submission reference the same report revision as its service data?"],
 ["MISSING_VS_ZERO","DATA_QUALITY","SERVICE_UNIT_GRAIN","UNEXPECTED_ZERO_CONVERSION",
  "Do unreported, not-applicable, explicit zero and positive values remain distinct?"],
 ["FACILITY_IDENTITY","DATA_QUALITY","KEYS_AND_GRAIN","SOURCE_INTEGRITY_MISMATCH",
  "Can every facility-month be attributed to a stable Puskeswan identity?"],
 ["REGION_AS_OF_MONTH","DATA_QUALITY","REGION_HISTORY","REGION_HISTORY_DRIFT",
  "Is historical district attribution valid for the reporting month?"],
 ["INVESTIGATION_EVENT_LOCATION","DATA_QUALITY","SERVICE_UNIT_GRAIN","DUPLICATE_EVENT_OR_ANIMAL",
  "Could an investigation be duplicated for an event and location?"],
 ["KURBAN_SINGLE_ANIMAL","DATA_QUALITY","SERVICE_UNIT_GRAIN","DUPLICATE_EVENT_OR_ANIMAL",
  "Could one sacrificial animal be double-counted for ante/post?"],
 ["SERVICE_TOTALS","DATA_QUALITY","JUKNIS_PARITY","SERVICE_COUNT_DRIFT",
  "Are service totals comparable across the approved definition and unit?"],
 ["YEAR_POLICY_VERSION","POLICY","YEARLY_POLICY","POLICY_VERSION_MISMATCH",
  "Is the rule version specific to the approved reporting year?"],
 ["SOURCE_SNAPSHOT","SOURCE","SNAPSHOT_ATOMICITY","SOURCE_INTEGRITY_MISMATCH",
  "Is the purported snapshot consistent and independently verifiable?"],
 ["SECURITY_REDACTION","SECURITY","SECURITY_RETENTION","ACCESS_OR_SECRET_EXPOSURE",
  "Are access, secrets and privacy controls assessed without leaking raw logs?"],
 ["RESTORE_HEALTH","SYSTEM","SECURITY_RETENTION","ROLLBACK_PATH_UNAVAILABLE",
  "Are backups, monitoring and restore readiness independently evidenced?"]
];
const reqs=new Set(REQUIREMENTS.map(r=>r.requirement_id));
const conditions=new Set(M05_12_STOP_CONDITIONS.map(x=>x.condition_id));
export const M05_13_SIGNALS=Object.freeze(DATA.map(
 ([signal_id,domain,requirement_id,rollback_condition_id,question])=>{
  if(!reqs.has(requirement_id)||!conditions.has(rollback_condition_id))
   throw Error("M05_13_CATALOG_LINK_INVALID");
  return Object.freeze({signal_id,domain,requirement_id,
   rollback_condition_id,question,
   data_source_connected:false,threshold_approved:false});
 }));
export const M05_13_SEVERITIES=Object.freeze(["INFO","REVIEW","URGENT_REVIEW"]);
export const M05_13_OBSERVATION_CODES=Object.freeze([
 "DEMO_STATUS_UNKNOWN","DEMO_RECONCILIATION_REVIEW",
 "DEMO_GRAIN_REVIEW","DEMO_HISTORY_REVIEW",
 "DEMO_PERMISSION_REVIEW","DEMO_BACKUP_REVIEW"
]);
export function observabilityCatalog(){
 return {schema:M05_13_CATALOG_SCHEMA,synthetic:true,
  mode:"QUESTIONS_NOT_LIVE_MONITORING",
  signals:M05_13_SIGNALS.map(x=>({...x})),
  counts:{signals:M05_13_SIGNALS.length,connected_sources:0,
   approved_thresholds:0},
  thresholds:null,check_schedule:null,real_alert_destinations:null,
  monitoring_activated:false,official_incidents_detected:0};
}
