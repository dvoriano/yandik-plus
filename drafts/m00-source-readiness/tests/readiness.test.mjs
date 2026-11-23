/** M00-G4 | QA DITULIS, BELUM DIJALANKAN | CODE_ONLY */
import test from "node:test";
import assert from "node:assert/strict";
import {buildDemoSourceReadiness,draftServerIdentityRequirements,
 M00_G4_SCHEMA} from "../readiness.mjs";
import {demoReadinessFixture} from "../fixtures.mjs";
import {demoSourceSession} from "../../m00-source-api-gate/fixtures.mjs";
const build=(more={})=>buildDemoSourceReadiness({
 ...demoReadinessFixture(),...more
});
test("M00-G4 distinct untested schema",()=>
 assert.equal(build().schema,M00_G4_SCHEMA));
test("M00-G4 all seven controls initially unreviewed",()=>
 assert.equal(build().unreviewed_count_demo,7));
test("M00-G4 drafting a checklist still grants nothing",()=>{
 const x=demoReadinessFixture();
 x.dossier.review_items.forEach(y=>{y.state="DRAFTED_UNVERIFIED_DEMO";});
 const z=buildDemoSourceReadiness(x);
 assert.equal(z.unreviewed_count_demo,0);
 assert.equal(z.data_owner_permission_obtained,false);
 assert.equal(z.ready_for_real_import,false);
});
test("M00-G4 unknown role denied",()=>
 assert.throws(()=>build({resolveServerSession:
 demoSourceSession({role:"puskeswan"}).resolveServerSession}),/ACCESS_DENIED/));
test("M00-G4 kabupaten role denied",()=>
 assert.throws(()=>build({resolveServerSession:
 demoSourceSession({role:"kab_kota"}).resolveServerSession}),/ACCESS_DENIED/));
test("M00-G4 provincial verifier can view draft",()=>
 assert.equal(build({resolveServerSession:
 demoSourceSession({role:"provinsi_verifikator"}).resolveServerSession}).synthetic,true));
test("M00-G4 without trusted resolver denied",()=>
 assert.throws(()=>build({resolveServerSession:null})));
test("M00-G4 rejects fake approved status",()=>{
 const x=demoReadinessFixture();x.dossier.review_items[0].state="APPROVED";
 assert.throws(()=>buildDemoSourceReadiness(x),/CHECK_INVALID/);
});
test("M00-G4 refuses submitted claim",()=>{
 const x=demoReadinessFixture();x.dossier.request_state="SUBMITTED";
 assert.throws(()=>buildDemoSourceReadiness(x),/DOSSIER_INVALID/);
});
test("M00-G4 refuses legal permit reference",()=>{
 const x=demoReadinessFixture();x.dossier.external_permission_ref="REAL-LETTER";
 assert.throws(()=>buildDemoSourceReadiness(x),/DOSSIER_INVALID/);
});
test("M00-G4 refuses extra owner identity fields",()=>{
 const x=demoReadinessFixture();x.dossier.owner_name="Someone";
 assert.throws(()=>buildDemoSourceReadiness(x),/DOSSIER_INVALID/);
});
test("M00-G4 refuses source URL",()=>{
 const x=demoReadinessFixture();x.dossier.source_id="https://example.org";
 assert.throws(()=>buildDemoSourceReadiness(x),/DOSSIER_INVALID/);
});
test("M00-G4 rejects missing required check",()=>{
 const x=demoReadinessFixture();x.dossier.review_items.pop();
 assert.throws(()=>buildDemoSourceReadiness(x),/DOSSIER_INVALID/);
});
test("M00-G4 rejects duplicate check",()=>{
 const x=demoReadinessFixture();
 x.dossier.review_items[1].check_id=x.dossier.review_items[0].check_id;
 assert.throws(()=>buildDemoSourceReadiness(x),/CHECK_INVALID/);
});
test("M00-G4 rejects extra check notes",()=>{
 const x=demoReadinessFixture();x.dossier.review_items[0].notes="secret";
 assert.throws(()=>buildDemoSourceReadiness(x),/CHECK_INVALID/);
});
test("M00-G4 rejects source region mismatch",()=>{
 const x=demoReadinessFixture();x.dossier.region_label="Wilayah DEMO Selatan";
 assert.throws(()=>buildDemoSourceReadiness(x),/SOURCE_SCOPE_MISMATCH/);
});
test("M00-G4 rejects source ID mismatch",()=>{
 const x=demoReadinessFixture();x.dossier.source_id="DEMO-SOURCE-OTHER";
 assert.throws(()=>buildDemoSourceReadiness(x),/SOURCE_MISMATCH/);
});
test("M00-G4 refuses official source verified claims",()=>{
 const x=demoReadinessFixture();x.manifest.source_verified=true;
 assert.throws(()=>buildDemoSourceReadiness(x),/SOURCE_UNTRUSTED/);
});
test("M00-G4 rejects unlisted source domain",()=>{
 const x=demoReadinessFixture();x.manifest.domain="MEDICINE_OVERSIGHT_DEMO";
 assert.throws(()=>buildDemoSourceReadiness(x),/SOURCE_DOMAIN_MISMATCH/);
});
test("M00-G4 no real source import nor writes",()=>{
 const y=build();
 for(const k of ["may_connect","may_import","may_store_real_data",
  "may_export","may_write","may_publish","may_approve","may_deploy"])
  assert.equal(y[k],false);
});
test("M00-G4 no host authentication implemented",()=>{
 const x=draftServerIdentityRequirements();
 assert.equal(x.session_provider_implemented,false);
 assert.equal(x.flask_adapter_implemented,false);
 assert.equal(x.production_access_enabled,false);
});
test("M00-G4 lists cookie and source security requirements",()=>{
 const controls=draftServerIdentityRequirements().required_controls;
 assert.ok(controls.includes("CSRF_PROTECTION_FOR_COOKIE_MUTATIONS"));
 assert.ok(controls.includes("APPROVED_EXTERNAL_SOURCE_RIGHTS"));
});
