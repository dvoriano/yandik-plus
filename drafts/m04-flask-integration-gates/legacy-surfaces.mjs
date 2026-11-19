/**
 * M04-I6D | KODE DITULIS, BELUM DIUJI (CODE_ONLY).
 * DOCUMENTED public entrypoints, NOT route discovery, NOT a production probe.
 * These are candidate contract identifiers, not verified Flask registrations.
 */
export const I6D_ROUTE_SCHEMA="M04-I6D-LEGACY-ROUTES-UNTESTED-1";
export const ROUTE_BASELINE=Object.freeze([
 {id:"APEL_FORM",path:"/form",domain:"apel",
  concern:"Laporan Puskeswan bulanan; validasi dan isolasi fasilitas"},
 {id:"APEL_DASHBOARD",path:"/dashboard",domain:"apel",
  concern:"Rekap dan perhitungan agregat tanpa perluasan hak akses"},
 {id:"APEL_DATA_SAYA",path:"/data-saya",domain:"apel",
  concern:"Pembacaan data sesuai sesi dan fasilitas sendiri"},
 {id:"APEL_CHECKLIST",path:"/checklist-kepatuhan",domain:"apel",
  concern:"Status kelengkapan laporan per bulan dan unit"},
 {id:"SDM_DIREKTORI",path:"/modul/sdm",domain:"sdm",
  concern:"Hak akses dan pembatasan data SDM"}
].map(v=>Object.freeze({...v,origin:"DOCUMENTED_ONLY",
  method:"BELUM_DIPERIKSA",auth:"BELUM_DIPERIKSA",
  response:"BELUM_DIPERIKSA",schema:"BELUM_DIPERIKSA"})));
const fail=code=>{throw Error(code)};
const KEYS=["id","path","method","auth","response","schema"];
const STATES=new Set(["BELUM_DIPERIKSA","PERLU_KONFIRMASI"]);
export function mapLegacyCompatibility(evidence=[]) {
 if(!Array.isArray(evidence))fail("ROUTES_INPUT_INVALID");
 // Only record unverified notes; there is intentionally no VERIFIED state.
 const notes=new Map();
 for(const x of evidence){
  if(!x||typeof x!=="object"||Array.isArray(x)||
     Object.keys(x).length!==KEYS.length||
     KEYS.some(k=>!Object.hasOwn(x,k)))fail("ROUTES_EVIDENCE_SHAPE_INVALID");
  const base=ROUTE_BASELINE.find(r=>r.id===x.id);
  if(!base||base.path!==x.path||notes.has(x.id))
   fail("ROUTES_UNKNOWN_OR_DUPLICATE");
  if(["method","auth","response","schema"].some(k=>!STATES.has(x[k])))
   fail("ROUTES_UNVERIFIED_ONLY");
  notes.set(x.id,{...x});
 }
 const rows=ROUTE_BASELINE.map(r=>({
  id:r.id,documented_path:r.path,domain:r.domain,
  contract_origin:r.origin,concern:r.concern,
  observation:notes.get(r.id)??null,
  route_exists_verified:false,methods_verified:false,
  auth_verified:false,behavior_verified:false,
  readiness:"MEMERLUKAN_REVIEW_FLASK"
 }));
 return {schema:I6D_ROUTE_SCHEMA,synthetic:true,mode:"REVIEW_ONLY",
  rows,documented_routes:rows.length,notes_received:notes.size,
  actual_flask_routes_examined:false,route_parity_proven:false,
  may_change_routes:false,may_deploy:false,official_authorization:false};
}
