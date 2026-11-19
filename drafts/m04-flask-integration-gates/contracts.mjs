/**
 * M04-I6D | KODE DITULIS, BELUM DIUJI (CODE_ONLY).
 * Required behavioral contracts before any Flask/APEL integration.
 * A plan, not runtime checks and not an endorsement of any official Juknis.
 */
import {I6D_ROUTE_SCHEMA} from "./legacy-surfaces.mjs";
import {REQUIRED_GATES} from "../m04-snapshot-recovery/runbook.mjs";
export const I6D_COMPAT_SCHEMA="M04-I6D-INTEGRATION-GATES-UNTESTED-1";
const fail=code=>{throw Error(code)};
export const INTEGRATION_GATES=Object.freeze([
 ["legacy_route_inventory","Daftar route, method, middleware, template dan respons Flask harus ditinjau dari source asli"],
 ["session_boundary","Sesi server, hak akses, CSRF, logout dan pembatasan wilayah harus diverifikasi"],
 ["schema_crosswalk","Identitas Puskeswan, periode laporan dan foreign keys perlu crosswalk source of truth"],
 ["apel_2026_parity","Perhitungan APEL 2026, periode, nol kosong, pemeriksaan kurban dan investigasi harus sama"],
 ["apel_no_double_entry","Tidak menimbulkan laporan bulanan ganda, penimpaan data atau input dua kali"],
 ["support_readonly_seam","Support M04 hanya membaca kontrak APEL/SDM terotorisasi tanpa mengambil alih tulis"],
 ["data_privacy","Pemisahan data pribadi, bukti, unduhan dan retensi/arsip harus ditinjau"],
 ["api_error_behavior","Hak akses, sesi habis, rate limit, status kesalahan, idempotensi dan audit harus dikaji"],
 ["frontend_parity","Form/data saya/checklist/dashboard tetap dipahami pengguna dan dapat diakses"],
 ["fallback_no_cutover","Feature flag OFF, dual-run terisolasi dan fallback butuh prosedur tertulis"],
 ["real_staging_qa","Fixture anonim, uji DB/Flask regresi lintas fasilitas dan rollback hanya setelah izin G0"],
 ["governance_spbe","Pengampu layanan, data, keamanan dan SPBE menyelesaikan telaah sebelum go-live"]
]);
const referenceOnly=(pair,source)=>({
 id:pair[0],requirement:pair[1],source,
 status:"BELUM_DIBUKTIKAN",evidence_ref:null,decision_ref:null
});
export function buildFlaskIntegrationGatePlan(routeReview) {
 if(!routeReview||routeReview.schema!==I6D_ROUTE_SCHEMA||
   routeReview.synthetic!==true||routeReview.mode!=="REVIEW_ONLY"||
   routeReview.route_parity_proven!==false||
   routeReview.actual_flask_routes_examined!==false||
   routeReview.official_authorization!==false||
   !Array.isArray(routeReview.rows)||routeReview.rows.length!==5||
   routeReview.rows.some(x=>x.readiness!=="MEMERLUKAN_REVIEW_FLASK"||
     x.route_exists_verified!==false||x.auth_verified!==false||
     x.behavior_verified!==false))
   fail("INTEGRATION_ROUTE_REVIEW_INVALID");
 const gates=[
  ...REQUIRED_GATES.map(pair=>referenceOnly(pair,"M04-I6C")),
  ...INTEGRATION_GATES.map(pair=>referenceOnly(pair,"M04-I6D"))
 ];
 if(new Set(gates.map(g=>g.id)).size!==gates.length)
  fail("INTEGRATION_GATE_ID_COLLISION");
 return {schema:I6D_COMPAT_SCHEMA,synthetic:true,mode:"PLANNING_ONLY",
  route_count:routeReview.documented_routes,
  route_note_count:routeReview.notes_received,
  gates,pending:gates.length,
  actual_legacy_code_verified:false,
  schema_migration_approved:false,security_review_passed:false,
  data_owner_approval:false,apel_parity_proven:false,
  may_integrate:false,may_write:false,may_cutover:false,
  may_deploy:false,official_authorization:false};
}
