/** M00-G2 | Source manifests are invented, never iSIKHNAS or government exports. */
import {M00_G2_SOURCE_SCHEMA}
 from "./source_access.mjs";
export function demoSourceManifest({
 domain="SURVEILLANCE_DEMO",
 region_label="Wilayah DEMO Utara",
 source_id="DEMO-SOURCE-SURV-NORTH",
 snapshot_id="DEMO-SNAPSHOT-SURV-NORTH",
 capture_month="2026-11",revision=1
}={}){
 return {schema:M00_G2_SOURCE_SCHEMA,
  source_id,snapshot_id,domain,region_label,
  capture_month,revision,origin:"LOCAL_SYNTHETIC_FIXTURE",
  synthetic:true,source_verified:false,official_authorization:false};
}
export function demoSourceSession({
 role="kab_kota",region="Wilayah DEMO Utara"
}={}){
 return {resolveServerSession:()=>({
  id:"DEMO-USER-"+role.toUpperCase(),active:true,role,region,
  ...(role==="puskeswan"?{puskeswan_id:"DEMO-PSW-ALPHA"}:{})
 })};
}
