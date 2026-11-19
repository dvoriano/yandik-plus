/**
 * M04-I6B | KODE DITULIS, BELUM DIUJI. DEMO contract, not authentication.
 *
 * The resolver MUST be called only within a server-controlled request context.
 * Never build it from body/query/headers/role switches supplied by clients.
 */
import {principal,scope} from "../m04-data-foundation/policy.mjs";
export const I6B_IDENTITY_SCHEMA="M04-I6B-BACKEND-IDENTITY-UNTESTED-1";
const fail=(code="ACCESS_DENIED")=>{throw Error(code);};
const ID=/^DEMO-PSW-[A-Z0-9_-]{1,24}$/;
export function backendPrincipal(resolveServerSession) {
 if(typeof resolveServerSession!=="function")fail("TRUSTED_SESSION_RESOLVER_REQUIRED");
 const session=resolveServerSession(); // Zero arguments, no client actor_id.
 if(!session||typeof session!=="object"||Array.isArray(session)||
    typeof session.id!=="string")fail();
 const actor=principal(session.id,id=>id===session.id?session:null);
 return Object.freeze({...actor,schema:I6B_IDENTITY_SCHEMA,synthetic:true});
}
export function requireGlobalInventory(actor) {
 if(!actor||actor.schema!==I6B_IDENTITY_SCHEMA||actor.synthetic!==true||
    actor.role!=="provinsi_admin")fail();
}
export function requireFacilityRead(actor,facility) {
 if(!actor||actor.schema!==I6B_IDENTITY_SCHEMA||actor.synthetic!==true||
    !facility||typeof facility.id!=="string"||!ID.test(facility.id)||
    typeof facility.region!=="string"||
    !scope(actor,facility))fail();
 // Pimpinan deliberately never receives detail, including via region.
 return true;
}
export function facilitySelector(id) {
 if(typeof id!=="string"||!ID.test(id))fail();
 return id; // A selector is NOT proof of permission to read.
}
