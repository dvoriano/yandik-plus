/**
 * M13-S2 | KODE DITULIS, BELUM DIUJI | CODE_ONLY | SYNTHETIC.
 * Candidate crosswalk only: NEVER equate APEL service investigations with
 * disease surveillance events, or claim same real occurrence.
 */
import {buildDemoSurveillanceRegister,M13_S1_SCHEMA}
 from "../m13-surveillance/surveillance.mjs";
import {buildDemoDashboard}
 from "../m05-apel-dashboard-ui/model.mjs";
import {requireYear} from "../m05-apel-multiyear/policy.mjs";

export const M13_S2_SCHEMA="M13-S2-APEL-SURVEILLANCE-CANDIDATES-UNTESTED-1";
const fail=code=>{throw Error(code);};
const REG=/^Wilayah DEMO [A-Za-z]{2,25}$/;
const FAC=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
const EVENT=/^DEMO-EVENT-[A-Z0-9_-]{1,24}$/;
const LOCATION=/^DEMO-LOCATION-[A-Z0-9_-]{1,28}$/;
const LINK=/^DEMO-CROSSWALK-[A-Z0-9_-]{1,28}$/;
const PERIOD=/^(?:202[6-9]|2030)-(?:0[1-9]|1[0-2])$/;
const exact=(x,k)=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&
 Object.keys(x).length===k.length&&k.every(a=>Object.hasOwn(x,a));
const str=(v,r)=>typeof v==="string"&&r.test(v);

export function buildDemoCandidateCrosswalk({
 resolveServerSession,region_label,manifest,events,
 dashboardFixture,links,year=2026
}={}){
 requireYear(year);
 if(!str(region_label,REG))fail("M13_S2_REGION_INVALID");
 // Fail closed on access to disease case details before reading APEL data.
 const surveillance=buildDemoSurveillanceRegister({
  resolveServerSession,region_label,manifest,events
 });
 if(surveillance.schema!==M13_S1_SCHEMA||surveillance.synthetic!==true||
    surveillance.official_authorization!==false||
    surveillance.isikhnas_connected!==false)
  fail("M13_S2_SURVEILLANCE_UNTRUSTED");
 if(dashboardFixture?.metadata?.synthetic!==true||
    dashboardFixture.metadata.no_real_facility_data!==true||
    dashboardFixture.metadata.not_official_reporting!==true||
    !Array.isArray(dashboardFixture.facilities)||
    !Array.isArray(links)||links.length>100)
  fail("M13_S2_DEMO_INPUT_REQUIRED");
 const regions=new Map(),reverse=new Map();
 for(const f of dashboardFixture.facilities){
  if(!f||typeof f.region_label!=="string"||
     typeof f.region_id!=="string")fail("M13_S2_FACILITY_INVALID");
  if(regions.has(f.region_id)&&regions.get(f.region_id)!==f.region_label)
   fail("M13_S2_REGION_CONFLICT");
  if(reverse.has(f.region_label)&&reverse.get(f.region_label)!==f.region_id)
   fail("M13_S2_REGION_CONFLICT");
  regions.set(f.region_id,f.region_label);
  reverse.set(f.region_label,f.region_id);
 }
 const region_id=reverse.get(region_label);
 if(!region_id)fail("M13_S2_REGION_NOT_REGISTERED");
 // Dashboard enforces M05-0 ledger normalization, its unique facility-month,
 // approved DEMO facility mapping and 2026-2030 year constraints.
 const dashboard=buildDemoDashboard({
  ledger:dashboardFixture.ledger,
  facilities:dashboardFixture.facilities,
  year,region_id
 });
 if(dashboard.synthetic!==true||dashboard.officially_verified!==false||
    dashboard.official_authorization!==false)
  fail("M13_S2_APEL_UNTRUSTED");
 const selectedFac=new Set(dashboard.facility_rows.map(x=>x.facility_id));
 const sourceEvents=new Map(surveillance.rows.map(e=>[e.event_id,e]));
 const seenLinks=new Set(),seenPairs=new Set();
 const rows=[];
 for(const l of links){
  if(!exact(l,["link_id","facility_id","event_id","location_ref",
      "period","region_label","source_id","snapshot_id","review_state"])||
     !str(l.link_id,LINK)||!str(l.facility_id,FAC)||
     !str(l.event_id,EVENT)||!str(l.location_ref,LOCATION)||
     !str(l.period,PERIOD)||!selectedFac.has(l.facility_id)||
     l.region_label!==region_label||
     l.source_id!==surveillance.source_id||
     l.snapshot_id!==surveillance.snapshot_id||
     l.review_state!=="PROPOSED_UNVERIFIED_DEMO"||
     Number(l.period.slice(0,4))!==year)
   fail("M13_S2_LINK_INVALID");
  const pair=l.facility_id+"|"+l.period+"|"+l.event_id+"|"+l.location_ref;
  if(seenLinks.has(l.link_id)||seenPairs.has(pair))
   fail("M13_S2_LINK_DUPLICATE");
  const source=sourceEvents.get(l.event_id);
  if(!source||source.period!==l.period||
     source.location_ref!==l.location_ref)
   fail("M13_S2_SURVEILLANCE_PAIR_MISMATCH");
  const reporting=dashboardFixture.ledger.records.find(r=>
    r.facility_id===l.facility_id&&r.period===l.period);
  if(!reporting||!reporting.investigations.some(i=>
     i.event_id===l.event_id&&i.location_id===l.location_ref))
   fail("M13_S2_APEL_PAIR_MISMATCH");
  seenLinks.add(l.link_id);seenPairs.add(pair);
  rows.push({
   link_id:l.link_id,facility_id:l.facility_id,
   region_id,period:l.period,
   event_id:l.event_id,location_ref:l.location_ref,
   candidate_status:"POSSIBLE_MATCH_UNVERIFIED_DEMO",
   manual_review_required:true,
   same_real_event_proven:false,
   equivalent_reporting_unit_proven:false,
   evidence_sufficiency_verified:false,
   approved_for_reconciliation:false
  });
 }
 rows.sort((a,b)=>a.link_id.localeCompare(b.link_id));
 return {
  schema:M13_S2_SCHEMA,synthetic:true,mode:"READ_ONLY_CANDIDATE_CROSSWALK",
  year,region_label,region_id,rows:structuredClone(rows),
  candidate_links_recorded_demo:rows.length,
  synced_sources_count:null,official_case_count:null,
  reconciled_investigation_count:null,
  reporting_unit_equivalence_verified:false,
  candidates_are_not_approved_links:true,
  no_case_or_report_mutation:true,
  apel_source_reconciled:false,
  isikhnas_source_reconciled:false,
  cross_module_aggregates_enabled:false,
  changes_to_apel_ledger:false,
  changes_to_surveillance_events:false,
  may_write:false,may_sync:false,may_score:false,
  may_notify:false,may_approve:false,may_confirm_disease:false,
  may_rank:false,may_publish:false,may_deploy:false,
  official_authorization:false
 };
}
